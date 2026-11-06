import React, { useState } from 'react';
import { Lightbulb, RefreshCw, CheckCircle2, Wand2, Bot, Sparkles, Loader2, AlertCircle, Key } from 'lucide-react';
import { generateAIStoryConcepts } from '../services/llm';

const FALLBACK_STORIES = [
  {
    id: 'traffic-light-yellow-physics',
    title: 'The Dilemma Zone: The Mathematical Trap Behind Yellow Traffic Lights',
    topic: 'The 1960s Gazis-Herman-Maradudin mathematical proof demonstrating the physical impossibility of stopping or clearing an intersection at certain speeds, giving birth to the universal yellow-light timing standard.',
    rationale: 'Clean typographic diagrams and vector road layout vectors match mathematical kinematic formulas perfectly.',
    suggestedStyle: 'blueprint'
  },
  {
    id: 'keyboard-qwerty-typewriter-jam',
    title: 'The Slowdown Myth: How Telegraph Morsecodes Built QWERTY',
    topic: 'Why the myth of slowing down fast typists is false, and how E. Remington & Sons designed the 1873 Sholes layout to optimize acoustic decoding of high-speed transatlantic Morse code telegrams.',
    rationale: 'Exploded mechanical linkages and archival telegraph papers capture 19th century industrial engineering.',
    suggestedStyle: 'exploded-teardown'
  },
  {
    id: 'barcode-bullseye-scanner-laser',
    title: 'From Sand Dunes to Supermarkets: The Laser That Saved Retail',
    topic: 'How Norman Joseph Woodland drew Morse code in Miami sand in 1948, creating the bullseye circular barcode that failed under hot incandescent bulbs until helium-neon lasers unlocked the 1974 Wrigley gum pack scan.',
    rationale: 'Retro optical scans and precision line grids reflect the dawn of modern laser automation.',
    suggestedStyle: 'circuit-board'
  },
  {
    id: 'airplane-black-box-orange',
    title: 'The Flight Recorder Mystery: Why the Black Box is Painted Dayglo Orange',
    topic: 'David Warren 1953 Aeronautical Research Laboratories invention of the magnetic wire crash recorder, the aviation establishment skepticism, and the optical contrast physics dictating bright orange paint.',
    rationale: 'Aeronautical CAD diagrams and military briefing boards ground the investigation in real aircraft telemetry.',
    suggestedStyle: 'blueprint'
  },
  {
    id: 'ballpoint-pen-high-altitude-war',
    title: 'The 30,000-Foot Ball: How WWII Bombers Made the Biro Pen Immortal',
    topic: 'Why Laszlo Biro fountain pen alternative was ignored until RAF pilots found fountain pens burst under unpressurized bomber cockpits, turning capillary ink tubes into critical wartime equipment.',
    rationale: 'Capillary ink fluid dynamics and brass ball-bearing tolerances shine in exploded macro visuals.',
    suggestedStyle: 'exploded-teardown'
  },
  {
    id: 'escalator-curved-step-geometry',
    title: 'The Invisible Hinge: How Escalator Steps Disappear Into Geometry',
    topic: 'Jesse Reno 1892 inclined elevator versus Charles Seeberger cleated step patent, solving the dangerous pinch point where mechanical stairs level out into comb plates.',
    rationale: 'CAD cross-sections and synchronized gear tracks visualize internal escalator kinetics.',
    suggestedStyle: 'paper-popup'
  }
];

export default function StoryPitcher({ onSelectStory, currentStory, llmConfig, onOpenAISettings, onSelectStyle }) {
  const [candidates, setCandidates] = useState([]);
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isAiGenerated, setIsAiGenerated] = useState(false);

  const fetchPitches = async () => {
    setErrorMsg('');

    // If API Key is present, call the real AI LLM!
    if (llmConfig?.apiKey?.trim()) {
      setLoading(true);
      try {
        const aiStories = await generateAIStoryConcepts(llmConfig, customTopic);
        setCandidates(aiStories);
        setIsAiGenerated(true);
      } catch (err) {
        console.error('LLM story generation failed:', err);
        setErrorMsg(`Gagal memanggil AI (${llmConfig.provider}): ${err.message}. Menampilkan ide offline fallback.`);
        // Fallback to offline shuffle
        const shuffled = [...FALLBACK_STORIES].sort(() => 0.5 - Math.random());
        setCandidates(shuffled.slice(0, 3));
        setIsAiGenerated(false);
      } finally {
        setLoading(false);
      }
    } else {
      // Offline fallback shuffle
      const shuffled = [...FALLBACK_STORIES].sort(() => 0.5 - Math.random());
      setCandidates(shuffled.slice(0, 3));
      setIsAiGenerated(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    onSelectStory({
      id: 'custom-' + Date.now(),
      title: customTopic.split('.')[0] || 'Custom Studio Project',
      topic: customTopic,
      rationale: 'Topik kustom pengguna dengan arahan visual deterministik.',
      suggestedStyle: null
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
              <Lightbulb className="w-5 h-5" />
              Ide Cerita & Konsep Naratif
            </h2>
            {isAiGenerated ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live AI ({llmConfig?.provider})
              </span>
            ) : (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                Preset Offline
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rumus Lemo-Opuscar: Fenomena sehari-hari + Asal-usul sejarah tak terduga + Logika mekanik/sains
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!llmConfig?.apiKey?.trim() && (
            <button
              onClick={onOpenAISettings}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/80 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              Masukkan API Key AI
            </button>
          )}

          <button
            onClick={fetchPitches}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                AI Sedang Berpikir...
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                {candidates.length > 0 ? 'Generate 3 Ide Baru (AI)' : 'Generate 3 Ide Cerita (AI)'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1 font-mono text-[11px]">{errorMsg}</span>
        </div>
      )}

      {/* Story Cards */}
      {candidates.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {candidates.map((story) => {
            const isSelected = currentStory?.id === story.id;
            return (
              <div
                key={story.id}
                onClick={() => onSelectStory(story)}
                className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-xs font-bold text-slate-100 leading-snug">
                      {story.title}
                    </h3>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                    {story.topic}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="text-[10px] text-amber-400/90 italic flex items-center gap-1">
                    <Wand2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{story.rationale}</span>
                  </div>

                  {story.suggestedStyle && (
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">Rekomendasi Style:</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectStyle) onSelectStyle(story.suggestedStyle);
                        }}
                        className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 font-mono transition cursor-pointer"
                      >
                        {story.suggestedStyle}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Topic Input */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Atau tulis tema panduan untuk AI (misal: Mengapa tombol darurat eskalator dirancang melengkung?)..."
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 text-slate-200 transition"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition cursor-pointer"
        >
          Pakai Ide Ini
        </button>
      </form>
    </div>
  );
}
