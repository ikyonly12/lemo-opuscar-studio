import React, { useState } from 'react';
import { Lightbulb, RefreshCw, CheckCircle2, Wand2 } from 'lucide-react';

export default function StoryPitcher({ onSelectStory, currentStory }) {
  const [pitching, setPitching] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [customTopic, setCustomTopic] = useState('');

  const fetchPitches = () => {
    setPitching(true);
    fetch('/api/story/pitch', { method: 'POST' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCandidates(data.stories);
        }
        setPitching(false);
      })
      .catch(err => {
        console.error(err);
        setPitching(false);
      });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customTopic.trim()) return;
    onSelectStory({
      id: 'custom-' + Date.now(),
      title: customTopic.split('.')[0] || 'Custom Studio Project',
      topic: customTopic,
      rationale: 'Topik kustom pengguna dengan arahan visual deterministik.'
    });
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
            <Lightbulb className="w-5 h-5" />
            Ide Cerita & Konsep Naratif
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Rumus Lemo-Opuscar: Fenomena sehari-hari + Asal-usul sejarah tak terduga + Logika mekanik/sains
          </p>
        </div>

        <button
          onClick={fetchPitches}
          disabled={pitching}
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${pitching ? 'animate-spin' : ''}`} />
          {candidates.length > 0 ? 'Acak 3 Ide Baru' : 'Generate 3 Ide Cerita'}
        </button>
      </div>

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

                <div className="mt-3 pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] text-amber-400/90 italic flex items-center gap-1">
                    <Wand2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">{story.rationale}</span>
                  </div>
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
          placeholder="Atau tulis ide cerita kustom Anda sendiri (misal: Mengapa tombol eskalator dirancang melengkung?)..."
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
