import express from 'express';
import fs from 'fs';
import path from 'path';
import os from 'os';

const router = express.Router();
const lemoHome = process.env.LEMO_OPUSCAR_HOME || path.join(os.homedir(), 'lemo-opuscar');
const elevenConfigPath = 'C:\\Users\\Kenzie kafi\\.gemini\\config\\plugins\\lemo-opuscar\\elevenlabs.json';

router.get('/config', (req, res) => {
  let eleven = null;
  if (fs.existsSync(elevenConfigPath)) {
    try {
      eleven = JSON.parse(fs.readFileSync(elevenConfigPath, 'utf8'));
    } catch { }
  }

  res.json({
    edge_tts_voices: [
      { id: 'id-ID-ArdiNeural', name: 'Ardi (Indonesian Male Neural)', lang: 'id' },
      { id: 'id-ID-GadisNeural', name: 'Gadis (Indonesian Female Neural)', lang: 'id' },
      { id: 'en-US-GuyNeural', name: 'Guy (US English Male Neural)', lang: 'en' },
      { id: 'en-US-JennyNeural', name: 'Jenny (US English Female Neural)', lang: 'en' }
    ],
    elevenlabs_available: !!(eleven && eleven.api_key),
    elevenlabs_voices: eleven ? Object.keys(eleven.voices || {}).map(k => ({
      id: eleven.voices[k],
      name: k.replace(/_/g, ' ').toUpperCase(),
      key: k
    })) : [],
    emotional_presets: eleven ? Object.keys(eleven.emotional_presets || {}) : [
      'storyteller', 'curious', 'dramatic', 'cheerful', 'serious', 'whisper'
    ]
  });
});

export default router;
