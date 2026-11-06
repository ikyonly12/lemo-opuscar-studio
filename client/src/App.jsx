import React, { useState, useEffect } from 'react';
import { Clapperboard, CloudLightning, Sparkles, Bot, Key, Settings, Film } from 'lucide-react';
import StyleGallery from './components/StyleGallery';
import StoryPitcher from './components/StoryPitcher';
import AudioPanel from './components/AudioPanel';
import TimelineScrubber from './components/TimelineScrubber';
import CloudRenderModal from './components/CloudRenderModal';
import AISettingsModal from './components/AISettingsModal';
import { getStoredLLMConfig, generateDirectorTreatment } from './services/llm';

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState('paper-popup');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [selectedStory, setSelectedStory] = useState(null);
  const [isCloudModalOpen, setIsCloudModalOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);

  // BYOK LLM Configuration state
  const [llmConfig, setLlmConfig] = useState(getStoredLLMConfig());
  const [directorTreatment, setDirectorTreatment] = useState(null);
  const [generatingTreatment, setGeneratingTreatment] = useState(false);

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

  // When selected story changes, if LLM key is configured, generate dynamic Treatment
  useEffect(() => {
    if (!selectedStory) return;

    if (llmConfig?.apiKey?.trim()) {
      setGeneratingTreatment(true);
      generateDirectorTreatment(llmConfig, {
        story: selectedStory,
        style: selectedStyle,
        language: audioConfig.language,
        aspectRatio
      })
        .then((treatment) => {
          setDirectorTreatment(treatment);
          setGeneratingTreatment(false);
        })
        .catch((err) => {
          console.warn('Auto treatment generation fallback:', err);
          setDirectorTreatment(null);
          setGeneratingTreatment(false);
        });
    } else {
      setDirectorTreatment(null);
    }
  }, [selectedStory, selectedStyle, audioConfig.language, aspectRatio, llmConfig]);

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
                  Cloud BYOK v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Deterministic Code-Driven Animation & Multi-Provider AI Studio
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* BYOK AI Status / Settings Trigger */}
            <button
              onClick={() => setIsAISettingsOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                llmConfig?.apiKey?.trim()
                  ? 'bg-purple-950/40 border-purple-500/60 text-purple-200 hover:bg-purple-900/50'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>
                {llmConfig?.apiKey?.trim() ? (
                  <>AI: <b className="text-purple-300 capitalize">{llmConfig.provider}</b></>
                ) : (
                  'Atur AI (BYOK)'
                )}
              </span>
            </button>

            {/* Cloud Render Farm Button */}
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
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500 text-black shrink-0 mt-0.5 sm:mt-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">Cerita Aktif</span>
                  {generatingTreatment && (
                    <span className="text-[10px] font-mono text-purple-400 animate-pulse">
                      (AI Merancang Multi-Shot Treatment...)
                    </span>
                  )}
                  {directorTreatment && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                      <Film className="w-2.5 h-2.5" />
                      {directorTreatment.shots?.length || 18} Micro-Shots Terkunci
                    </span>
                  )}
                </div>
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
              treatment={directorTreatment}
              selectedStory={selectedStory}
            />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <AudioPanel
              audioConfig={audioConfig}
              setAudioConfig={setAudioConfig}
            />
          </div>
        </div>

        {/* Middle Grid: Story Pitcher (Powered by BYOK LLM) */}
        <StoryPitcher
          onSelectStory={setSelectedStory}
          currentStory={selectedStory}
          llmConfig={llmConfig}
          onOpenAISettings={() => setIsAISettingsOpen(true)}
          onSelectStyle={setSelectedStyle}
        />

        {/* Bottom Section: 66 Style Showcase */}
        <StyleGallery
          selectedStyle={selectedStyle}
          onSelectStyle={setSelectedStyle}
        />
      </main>

      {/* BYOK AI Configuration Modal */}
      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
        currentConfig={llmConfig}
        onSaveConfig={setLlmConfig}
      />

      {/* Cloud Render Modal */}
      <CloudRenderModal
        isOpen={isCloudModalOpen}
        onClose={() => setIsCloudModalOpen(false)}
        renderParams={{
          style: selectedStyle,
          aspectRatio,
          language: audioConfig.language,
          story: selectedStory,
          treatment: directorTreatment
        }}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        Lemo-Opuscar Web Studio · Deterministic Algorithmic Cinema Farm · BYOK Multi-LLM Support
      </footer>
    </div>
  );
}
