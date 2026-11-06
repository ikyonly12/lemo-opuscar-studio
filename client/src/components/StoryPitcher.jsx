import React, { useState } from 'react';
import { Lightbulb, RefreshCw, CheckCircle2, Wand2, Sparkles, Loader2, AlertCircle, Key, Plus } from 'lucide-react';
import { generateAIStoryConcepts } from '../services/llm';

export default function StoryPitcher({ onSelectStory, currentStory, llmConfig, onOpenAISettings, onSelectStyle }) {
  const [candidates, setCandidates] = useState([]);
  const [customTopic, setCustomTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const hasApiKey = Boolean(llmConfig?.apiKey?.trim());

  const fetchPitches = async () => {
    setErrorMsg('');

    if (!hasApiKey) {
      onOpenAISettings();
      setErrorMsg('Harap masukkan API Key AI Anda terlebih dahulu (Google Gemini Gratis, DeepSeek, Groq, OpenAI). Sistem bekerja 100% online tanpa data dummy.');
      return;
    }

    setLoading(true);
    try {
      const aiStories = await generateAIStoryConcepts(llmConfig, customTopic);
      setCandidates(aiStories);
    } catch (err) {
      console.error('LLM story generation failed:', err);
      setErrorMsg(`Gagal memanggil AI (${llmConfig?.provider || 'LLM'}): ${err.message}. Periksa API Key atau kuota Anda.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    onSelectStory({
      id: 'custom-' + Date.now(),
      title: customTopic.split('.')[0] || 'Topik Kustom Studio',
      topic: customTopic.trim(),
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
            {candidates.length > 0 && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Live AI ({llmConfig?.provider})
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rumus Lemo-Opuscar: Fenomena modern + Asal-usul sejarah/fisika tak terduga + Logika visual
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!hasApiKey ? (
            <button
              onClick={onOpenAISettings}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/80 rounded-xl text-xs font-medium transition cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-purple-400" />
              Hubungkan API Key AI
            </button>
          ) : (
            <button
              onClick={fetchPitches}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-semibold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  AI Sedang Menulis Ide...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  {candidates.length > 0 ? 'Generate 3 Ide Baru (AI)' : 'Generate 3 Ide Cerita (AI)'}
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1 font-mono text-[11px]">{errorMsg}</span>
        </div>
      )}

      {/* No API Key & No Candidates Callout */}
      {!hasApiKey && candidates.length === 0 && (
        <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/50 text-center space-y-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Sistem 100% Online Berbasis AI (Zero Data Dummy)</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Setiap ide cerita dan arahan visual dirancang langsung secara real-time oleh model AI pilihan Anda.
              Hubungkan API Key (misal Google Gemini Gratis di AI Studio) atau tulis topik langsung di bawah.
            </p>
          </div>
          <button
            onClick={onOpenAISettings}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 transition cursor-pointer"
          >
            <Key className="w-3.5 h-3.5" />
            Buka Pengaturan AI (BYOK)
          </button>
        </div>
      )}

      {/* Empty State when Key is configured but haven't clicked generate */}
      {hasApiKey && candidates.length === 0 && !loading && (
        <div className="p-6 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-center space-y-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">AI Siap Digunakan ({llmConfig.provider}: {llmConfig.model})</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Klik tombol di bawah untuk meminta AI menghasilkan 3 konsep cerita orisinal berdasarkan fenomena modern dan sejarah ilmiah, atau masukkan tema kustom Anda.
            </p>
          </div>
          <button
            onClick={fetchPitches}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Generate 3 Ide Cerita (AI)
          </button>
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
          placeholder="Atau tulis tema panduan Anda (misal: Mengapa tombol darurat eskalator dirancang melengkung?)..."
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-800 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 text-slate-200 transition"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition cursor-pointer flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          Pakai Ide Ini
        </button>
        {hasApiKey && (
          <button
            type="button"
            onClick={fetchPitches}
            disabled={loading || !customTopic.trim()}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Kembangkan Tema (AI)
          </button>
        )}
      </form>
    </div>
  );
}
