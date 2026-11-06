import React from 'react';
import { Volume2, Mic, Sliders, Globe } from 'lucide-react';

export default function AudioPanel({ audioConfig, setAudioConfig }) {
  const updateBgm = (layer, val) => {
    setAudioConfig(prev => ({
      ...prev,
      bgm_layers: {
        ...prev.bgm_layers,
        [layer]: parseFloat(val)
      }
    }));
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
            <Volume2 className="w-5 h-5" />
            Voiceover & Multi-Layer BGM Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Narasi neural (Edge-TTS / ElevenLabs) + Skor musik deterministik 4 layer dengan ducking -3.5 dB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voiceover Settings */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3">
            <Mic className="w-4 h-4 text-amber-400" />
            Pengaturan Vokal & Narator
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Pilihan Bahasa</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAudioConfig(p => ({ ...p, language: 'id', voice: 'id-ID-ArdiNeural' }))}
                  className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer ${
                    audioConfig.language === 'id'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                      : 'border-slate-800 text-slate-400 bg-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Bahasa Indonesia
                </button>
                <button
                  type="button"
                  onClick={() => setAudioConfig(p => ({ ...p, language: 'en', voice: 'en-US-GuyNeural' }))}
                  className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer ${
                    audioConfig.language === 'en'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400 font-semibold'
                      : 'border-slate-800 text-slate-400 bg-slate-900'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  English (International)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Preset Emosi Narasi</label>
              <select
                value={audioConfig.emotion}
                onChange={(e) => setAudioConfig(p => ({ ...p, emotion: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-800 text-xs px-3 py-2 rounded-lg text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="storyteller">Storyteller (Hangat & Mengalir)</option>
                <option value="curious">Curious (Penuh Rasa Ingin Tahu)</option>
                <option value="dramatic">Dramatic (Tegang & Sinematik)</option>
                <option value="serious">Serious (Dokumenter Otoritatif)</option>
                <option value="whisper">Whisper (Misteri & Tenang)</option>
              </select>
            </div>
          </div>
        </div>

        {/* BGM 4-Track Soundboard */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4">
          <h3 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3">
            <Sliders className="w-4 h-4 text-amber-400" />
            4-Layer BGM Mix Balancer
          </h3>

          <div className="space-y-2.5">
            {[
              { key: 'bass', label: 'Bass & Sub-pad' },
              { key: 'harmony', label: 'Harmony Chords (Piano/Strings)' },
              { key: 'melody', label: 'Melodic Plucks (Glockenspiel/Pluck)' },
              { key: 'rhythm', label: 'Rhythm (Shaker/Foley)' }
            ].map((track) => (
              <div key={track.key} className="flex items-center justify-between text-xs gap-3">
                <span className="text-slate-400 text-[11px] w-36 truncate">{track.label}</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioConfig.bgm_layers[track.key]}
                  onChange={(e) => updateBgm(track.key, e.target.value)}
                  className="flex-1 accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <span className="text-[10px] font-mono text-slate-500 w-8 text-right">
                  {(audioConfig.bgm_layers[track.key] * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

