/**
 * Unified Multi-Provider BYOK (Bring Your Own Key) LLM Service
 * Supports:
 * 1. Google Gemini (Gemini 2.0 Flash / 1.5 Flash / Pro)
 * 2. GitHub Models (GPT-4o, Llama-3.3-70B, Mistral-Large via GitHub PAT)
 * 3. OpenAI (GPT-4o, GPT-4o-mini)
 * 4. Groq (Llama-3.3-70B-Versatile, etc.)
 * 5. OpenRouter (Multi-model router)
 * 6. Custom OpenAI-compatible Endpoint
 */

export const LLM_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    badge: 'Gratis & Cepat',
    defaultModel: 'gemini-2.0-flash',
    models: ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro'],
    keyPlaceholder: 'AIzaSy...',
    keyHelpUrl: 'https://aistudio.google.com/app/apikey',
    keyHelpText: 'Dapatkan API Key Gratis di Google AI Studio'
  },
  {
    id: 'github',
    name: 'GitHub Models',
    badge: 'Student Pack / Free',
    defaultModel: 'openai/gpt-4o',
    models: ['openai/gpt-4o', 'openai/gpt-4o-mini', 'meta/llama-3.3-70b-instruct', 'mistralai/mistral-large-2407'],
    keyPlaceholder: 'ghp_...',
    keyHelpUrl: 'https://github.com/settings/tokens/new?scopes=repo,workflow&description=GitHub-Models-Lemo-Opuscar',
    keyHelpText: 'Gunakan GitHub Personal Access Token (PAT)'
  },
  {
    id: 'groq',
    name: 'Groq',
    badge: 'Ultra Fast',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
    keyPlaceholder: 'gsk_...',
    keyHelpUrl: 'https://console.groq.com/keys',
    keyHelpText: 'Dapatkan API Key di Groq Console'
  },
  {
    id: 'openai',
    name: 'OpenAI',
    badge: 'Official',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o'],
    keyPlaceholder: 'sk-...',
    keyHelpUrl: 'https://platform.openai.com/api-keys',
    keyHelpText: 'Dapatkan API Key di OpenAI Platform'
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    badge: 'Universal',
    defaultModel: 'google/gemini-2.0-flash-001',
    models: ['google/gemini-2.0-flash-001', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.3-70b-instruct'],
    keyPlaceholder: 'sk-or-...',
    keyHelpUrl: 'https://openrouter.ai/keys',
    keyHelpText: 'Dapatkan API Key di OpenRouter'
  },
  {
    id: 'custom',
    name: 'Custom (OpenAI-Compatible)',
    badge: 'Self-Hosted / Local',
    defaultModel: 'default',
    models: ['default'],
    keyPlaceholder: 'Bearer token or API Key',
    requiresBaseUrl: true,
    keyHelpText: 'Masukkan Base URL kustom (misal: Ollama, vLLM, LMStudio)'
  }
];

export const getStoredLLMConfig = () => {
  try {
    const raw = localStorage.getItem('LEMO_LLM_CONFIG');
    if (raw) return JSON.parse(raw);
    
    // Auto-detect GitHub PAT if user already saved it for rendering
    const githubPat = localStorage.getItem('GITHUB_STUDIO_PAT');
    if (githubPat) {
      return {
        provider: 'github',
        apiKey: githubPat,
        model: 'gpt-4o',
        baseUrl: ''
      };
    }
  } catch (e) {}

  return {
    provider: 'gemini',
    apiKey: '',
    model: 'gemini-2.0-flash',
    baseUrl: ''
  };
};

export const saveLLMConfig = (config) => {
  localStorage.setItem('LEMO_LLM_CONFIG', JSON.stringify(config));
};

/**
 * Universal Chat Completion Dispatcher
 */
async function callLLM({ provider, apiKey, model, baseUrl, messages, temperature = 0.7, jsonMode = false }) {
  if (!apiKey?.trim()) {
    throw new Error('API Key belum diisi. Silakan isi API Key di menu Pengaturan AI (BYOK).');
  }

  const cleanKey = apiKey.trim();

  // 1. Google Gemini Native API
  if (provider === 'gemini') {
    const modelName = model || 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`;

    // Convert messages to Gemini contents
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : (m.role === 'system' ? 'user' : 'user'),
      parts: [{ text: (m.role === 'system' ? `[SYSTEM INSTRUCTIONS]:\n${m.content}\n\n` : '') + m.content }]
    }));

    const body = {
      contents,
      generationConfig: {
        temperature,
        responseMimeType: jsonMode ? 'application/json' : 'text/plain'
      }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Gemini Error (${res.status}): ${err.error?.message || res.statusText}`);
    }

    const data = await res.json();
    const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error('Respon kosong dari Google Gemini.');
    return candidate;
  }

  // 2. OpenAI-Compatible Providers (GitHub Models, Groq, OpenAI, OpenRouter, Custom)
  let endpoint = '';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${cleanKey}`
  };

  switch (provider) {
    case 'github':
      endpoint = 'https://models.github.ai/inference/chat/completions';
      break;
    case 'groq':
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      break;
    case 'openai':
      endpoint = 'https://api.openai.com/v1/chat/completions';
      break;
    case 'openrouter':
      endpoint = 'https://openrouter.ai/api/v1/chat/completions';
      headers['HTTP-Referer'] = 'https://ikyonly12.github.io/lemo-opuscar-studio/';
      headers['X-Title'] = 'Lemo-Opuscar Studio';
      break;
    case 'custom':
      endpoint = (baseUrl || 'http://localhost:11434/v1').replace(/\/+$/, '') + '/chat/completions';
      break;
    default:
      throw new Error(`Provider '${provider}' tidak didukung.`);
  }

  const payload = {
    model: model || 'gpt-4o',
    messages,
    temperature
  };

  if (jsonMode && (provider === 'openai' || provider === 'github' || provider === 'groq')) {
    payload.response_format = { type: 'json_object' };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    let errMsg = res.statusText;
    try {
      const errJson = JSON.parse(errText);
      errMsg = errJson.error?.message || errJson.message || errMsg;
    } catch (e) {
      if (errText) errMsg = errText.slice(0, 150);
    }
    throw new Error(`${provider.toUpperCase()} Error (${res.status}): ${errMsg}`);
  }

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error(`${provider.toUpperCase()} mengembalikan respon bukan JSON. Pastikan Token & Model valid.`);
  }
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error(`Respon kosong dari ${provider}.`);
  return content;
}

/**
 * Test Connection with currently selected provider & key
 */
export async function testLLMConnection(config) {
  try {
    const reply = await callLLM({
      ...config,
      temperature: 0.1,
      messages: [
        { role: 'user', content: 'Respond with exactly the single word "READY" if you can read this.' }
      ]
    });
    return {
      success: true,
      message: `Terhubung sukses ke ${config.provider} (${config.model || 'default'})! Balasan: "${reply.trim()}"`
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
}

/**
 * Generate 3 Fresh Modern-Relatable Story Concepts
 * Adhering strictly to Lemo-Opuscar Formula:
 * Everyday phenomenon + Surprising historical origin/physics truth + Visual Style Affinity
 */
export async function generateAIStoryConcepts(config, themePrompt = '') {
  const systemPrompt = `You are the Lead Creative Director of Lemo-Opuscar, an algorithmic, code-driven computational film studio.
Your task is to pitch exactly 3 compelling, modern-relatable short-film story concepts.

DIRECTORIAL RULES:
1. FORMULA: Focus on an everyday object, habit, tool, or phenomenon relatable to modern audiences today. Reveal the fascinating unknown facts behind it + its surprising historical origin or kinematic/physical truth.
2. CITATION & FIDELITY: Ground every fact in real history, patents, or physics (e.g. 19th century telegraph codes, 1960s traffic light dilemma zone kinematics, 1940s WWII aircraft ballpoint pen hydraulics, laser barcodes, elevator gears).
3. STYLE AFFINITY: Suggest 1 of the following 66 visual styles for each story:
   - paper-popup, brick-toy, exploded-teardown, blueprint, chalkboard, watercolor-brush, swiss-motion, 16-bit-pixel-rpg, circuit-board, data-physical, cel-anime-80s, ukiyo-e, engraving, archive-lighttable.
4. LANGUAGE: Titles and descriptions should be written in clean, engaging Bahasa Indonesia (or English if requested).
5. FORMAT: Return strictly valid JSON containing an array of 3 objects under key "stories".

Schema:
{
  "stories": [
    {
      "id": "slug-name",
      "title": "Judul Menarik & Puitis",
      "topic": "Penjelasan mendalam 2-3 kalimat mengenai fakta ilmiah/sejarah dan fenomena modern yang diangkat.",
      "rationale": "1 kalimat penjelasan mengapa gaya visual yang dipilih cocok dengan fisika atau estetika ceritanya.",
      "suggestedStyle": "style-slug"
    }
  ]
}`;

  const userPrompt = themePrompt?.trim()
    ? `Tema/Subjek yang diinginkan pengguna: "${themePrompt}". Buatkan 3 konsep cerita orisinal yang segar sesuai rumus di atas.`
    : `Buatkan 3 konsep cerita orisinal yang sangat menarik, mengejutkan, dan belum pernah diceritakan sebelumnya seputar penemuan teknologi, fisika sehari-hari, atau kebiasaan modern.`;

  const rawJson = await callLLM({
    ...config,
    temperature: 0.85,
    jsonMode: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  try {
    // Parse JSON safely (stripping any accidental markdown code fence)
    const cleaned = rawJson.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    const list = Array.isArray(parsed) ? parsed : (parsed.stories || parsed.candidates || []);
    if (!list || list.length === 0) throw new Error('Format JSON dari AI tidak memiliki array cerita.');
    return list;
  } catch (err) {
    console.error('Failed to parse AI story JSON:', rawJson);
    throw new Error(`Gagal memproses format cerita dari AI: ${err.message}`);
  }
}

/**
 * Generate Broadcast-Grade Director Treatment & 15-25 Micro-Shots
 * Adhering to Lemo-Opuscar Directorial Mandates:
 * - 15 to 25 distinct micro-shots per 60s
 * - Average Shot Length: 2.2s - 3.8s
 * - Camera Grammar: Wide Establishing, Subject Action, Extreme Macro Detail, Reaction POV, Isometric Diagram
 * - Word-Chunk Subtitles: 2 to 5 words max per chunk (single line, no stacking)
 */
export async function generateDirectorTreatment(config, { story, style, language = 'id', aspectRatio = '16:9' }) {
  const systemPrompt = `You are the master Lemo-Opuscar Film Director and Procedural Camera Cinematographer.
Generate a complete, broadcast-ready 60-second Director Treatment & Multi-Shot Cue Sheet for the selected story and visual style.

MANDATORY DIRECTORIAL INVARIANTS:
1. TOTAL DURATION: Exactly 60.0 seconds.
2. DYNAMIC MICRO-SHOT PACING: Must contain between 15 to 22 distinct, motivated micro-shots.
   - Max allowable static duration for any angle is 4.0 seconds.
   - Average Shot Length must be 2.5s - 3.8s.
   - Angles must vary between: 'wide_establishing', 'tracking_action', 'macro_detail', 'pov_reaction', 'isometric_diagram', 'reveal'.
3. SINGLE-LINE WORD-CHUNK SUBTITLES:
   - Voiceover must be divided into short, natural phrase chunks of STRICTLY 2 to 5 words each.
   - Single-line only, never multiline.
   - Synchronized to the spoken timing.
4. AUDIO ARCHITECTURE:
   - 4-layer BGM: Bass pulse, harmonic progression, melodic motif, and rhythm.
   - Foley sound cues matching each visual action (gear clicks, paper fold, pop, mechanical slide).
5. FORMAT: Return strictly valid JSON under key "treatment".

Schema:
{
  "treatment": {
    "title": "Film Title",
    "duration": 60,
    "logline": "1-sentence logline",
    "shots": [
      {
        "id": 1,
        "start": 0.0,
        "end": 3.2,
        "type": "wide_establishing",
        "description": "Visual scene description",
        "camera": "Slow crane push-in (FOV 45deg)",
        "focalTarget": "hero_mechanism"
      }
    ],
    "subtitles": [
      {
        "id": "sub_1",
        "start": 0.8,
        "end": 2.4,
        "text": "2 to 5 words"
      }
    ],
    "voiceLines": [
      {
        "t": 0.8,
        "text": "Full sentence for TTS synthesis"
      }
    ],
    "foleyCues": [
      {
        "t": 3.2,
        "sound": "paper_crease"
      }
    ]
  }
}`;

  const userPrompt = `Topic: "${story.title}: ${story.topic}"
Style: "${style}"
Language: "${language === 'id' ? 'Bahasa Indonesia' : 'English'}"
Aspect Ratio: "${aspectRatio}"

Buatkan rancangan film 60 detik lengkap dengan 15-22 micro-shots dan word-chunk subtitles sesuai aturan di atas.`;

  const rawJson = await callLLM({
    ...config,
    temperature: 0.7,
    jsonMode: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]
  });

  try {
    const cleaned = rawJson.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed.treatment || parsed;
  } catch (err) {
    console.error('Failed to parse AI treatment JSON:', rawJson);
    throw new Error(`Gagal memproses format treatment dari AI: ${err.message}`);
  }
}

