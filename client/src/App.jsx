import React, { useState } from 'react';
import { Clapperboard, CloudLightning, Github, Sparkles } from 'lucide-react';
import StyleGallery from './components/StyleGallery';
import StoryPitcher from './components/StoryPitcher';
import AudioPanel from './components/AudioPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CloudRenderModal from './components/CloudRenderModal';

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState('paper-popup');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [selectedStory, setSelectedStory] = useState(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);

  const [audioConfig, setAudioConfig] = useState({
    language: 'id',
    voice: 'id-ID-ArdiNeural',
    emotion: 'storyteller',
    bgm_layers: {
      bass: 0.75,
      harmony: 0.80,
      melody: 0.65,
      rhythm: 0.50
    }
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Studio Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-white">
                  Lemo-Opuscar Studio
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Cloud GUI v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Deterministic Code-Driven Animation & Cloud Render Farm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-300">Cloud Runner Ready</span>
            </div>

            <button
              onClick={() => setIsCloudModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <CloudLightning className="w-4 h-4 fill-current" />
              Render di Cloud
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Selected Project Banner */}
        {selectedStory && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-black">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Cerita Aktif</span>
                <h3 className="font-bold text-sm text-slate-100">{selectedStory.title}</h3>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              Style: <b className="text-amber-400">{selectedStyle}</b> | Rasio: <b>{aspectRatio}</b> | Bahasa: <b>{audioConfig.language.toUpperCase()}</b>
            </div>
          </div>
        )}

        {/* Top Grid: Interactive Scrubber Viewport & Audio Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <TimelineScrubber
              selectedStyle={selectedStyle}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <AudioPanel
              audioConfig={audioConfig}
              setAudioConfig={setAudioConfig}
            />
          </div>
        </div>

        {/* Middle Grid: Story Pitcher */}
        <StoryPitcher
          onSelectStory={setSelectedStory}
          currentStory={selectedStory}
        />

        {/* Bottom Section: 66 Style Showcase */}
        <StyleGallery
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
        />
      </main>

      {/* Cloud Render Modal */}
      <CloudRenderModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        renderParams={{
          style: selectedStyle,
          aspectRatio,
          language: audioConfig.language,
          story: selectedStory
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        Lemo-Opuscar Web Studio · Powered by Playwright, Three.js, FFmpeg & GitHub Actions
      </footer>
    </div>
  );
}

