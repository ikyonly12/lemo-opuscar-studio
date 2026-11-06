import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Smartphone, Monitor, Film, Layers, Sparkles } from 'lucide-react';

const DEFAULT_SHOTS = [
  { id: 1, start: 0.0, end: 3.5, type: 'Wide Establishing', desc: 'Overview of entire world / set' },
  { id: 2, start: 3.5, end: 6.8, type: 'Extreme Macro', desc: 'Macro close-up on primary mechanical element' },
  { id: 3, start: 6.8, end: 10.2, type: 'Subject Tracking', desc: 'Camera glides along moving trajectory' },
  { id: 4, start: 10.2, end: 13.5, type: 'Reaction / POV', desc: 'Character reaction / mechanical response' },
  { id: 5, start: 13.5, end: 17.0, type: 'Isometric Cut', desc: 'Orthogonal diagrammatic blueprint view' },
  { id: 6, start: 17.0, end: 20.4, type: 'Push-in Detail', desc: 'Fast dynamic push-in on key turning point' },
  { id: 7, start: 20.4, end: 24.0, type: 'Dutch Tilt', desc: 'Tension angle reflecting the central conflict' },
  { id: 8, start: 24.0, end: 27.5, type: 'Extreme Close-up', desc: 'Critical physical detail in high focus' },
  { id: 9, start: 27.5, end: 31.0, type: 'Tracking Action', desc: 'Fast motion tracking with secondary bounces' },
  { id: 10, start: 31.0, end: 34.5, type: 'Wide Set Rebuild', desc: 'Physical transformation of the set' },
  { id: 11, start: 34.5, end: 38.0, type: 'Macro Insert', desc: 'Key mechanism locking into place' },
  { id: 12, start: 38.0, end: 41.5, type: 'High Angle', desc: 'Expansive overview of completed structure' },
  { id: 13, start: 41.5, end: 45.0, type: 'Subject POV', desc: 'Point of view looking through the device' },
  { id: 14, start: 45.0, end: 48.5, type: 'Orbit Inspection', desc: 'Continuous camera orbit around hero element' },
  { id: 15, start: 48.5, end: 52.0, type: 'Climactic Reveal', desc: 'Dramatic pull-back revealing scale' },
  { id: 16, start: 52.0, end: 56.0, type: 'Thematic Culmination', desc: 'Final narrative resolution' },
  { id: 17, start: 56.0, end: 60.0, type: 'Clean End Title', desc: 'Punchy payoff title with zero credits' }
];

export default function TimelineScrubber({ selectedStyle, aspectRatio, setAspectRatio, treatment, selectedStory }) {
  const [currentTime, setCurrentTime] = useState(1.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const totalDuration = 60.0;

  // Active shots list (from AI treatment or default broadcast blueprint)
  const shots = treatment?.shots?.length > 0
    ? treatment.shots.map((s, idx) => ({
        id: s.id || idx + 1,
        start: s.start ?? (idx * (60 / treatment.shots.length)),
        end: s.end ?? ((idx + 1) * (60 / treatment.shots.length)),
        type: s.type || 'Cinematic Shot',
        desc: s.description || s.camera || 'Motivated camera angle'
      }))
    : DEFAULT_SHOTS;

  // Active shot at current time
  const activeShot = shots.find(s => currentTime >= s.start && currentTime < s.end) || shots[shots.length - 1];

  // Active subtitle at current time (if treatment has subtitles)
  const activeSub = treatment?.subtitles?.find(sub => currentTime >= sub.start && currentTime < sub.end);

  // Play animation loop
  useEffect(() => {
    let animationFrame;
    if (isPlaying) {
      const startWallTime = performance.now();
      const startAnimTime = currentTime;

      const loop = (now) => {
        const delta = (now - startWallTime) / 1000;
        const nextTime = (startAnimTime + delta) % totalDuration;
        setCurrentTime(nextTime);
        animationFrame = requestAnimationFrame(loop);
      };
      animationFrame = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying, totalDuration]);

  const isPortrait = aspectRatio === '9:16';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
            <Monitor className="w-5 h-5" />
            Interactive Viewport & Dynamic Shot Scrubber
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mandat Lemo-Opuscar: <b className="text-amber-300">{shots.length} Micro-Shots</b> (ASL: {(60 / shots.length).toFixed(1)}s per shot)
          </p>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setAspectRatio('16:9')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              aspectRatio === '16:9'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            16:9 Landscape
          </button>
          <button
            onClick={() => setAspectRatio('9:16')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition cursor-pointer ${
              aspectRatio === '9:16'
                ? 'bg-amber-500 text-black font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            9:16 Portrait
          </button>
        </div>
      </div>

      {/* Main Stage Canvas Viewport */}
      <div className="flex justify-center bg-slate-950 border border-slate-800/80 rounded-xl p-4 overflow-hidden relative">
        <div
          className={`relative border border-slate-800 rounded-lg overflow-hidden bg-slate-900/90 shadow-2xl flex flex-col items-center justify-center transition-all duration-300 ${
            isPortrait ? 'w-[270px] h-[480px]' : 'w-full max-w-[640px] aspect-video'
          }`}
        >
          {/* Active Shot HUD Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
            <span className="px-2 py-1 rounded bg-black/80 backdrop-blur-md text-[10px] font-mono text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <Film className="w-3 h-3 text-amber-400" />
              SHOT {activeShot.id}/{shots.length}: {activeShot.type}
            </span>
          </div>

          <div className="text-center p-6 space-y-3 z-0">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                Style: <span className="text-amber-400">{selectedStyle}</span>
              </p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-1 line-clamp-2">
                {activeShot.desc}
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                Shot Interval: {activeShot.start.toFixed(1)}s – {activeShot.end.toFixed(1)}s
              </p>
            </div>
          </div>

          {/* Subtitle Chunk Simulation Overlay (Strict Word-Chunk: 2 to 5 words) */}
          <div className={`absolute ${isPortrait ? 'bottom-16' : 'bottom-6'} left-0 right-0 px-4 text-center pointer-events-none z-10`}>
            <span className="inline-block bg-black/85 text-amber-300 font-semibold text-xs px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md border border-amber-500/20 max-w-[800px]">
              {activeSub ? activeSub.text : selectedStory ? `"${selectedStory.title.split(':')[0]}"` : '"Inovasi Sejarah Tersembunyi"'}
            </span>
          </div>

          {/* Mobile Safe Area Guideline (Portrait Only) */}
          {isPortrait && (
            <div className="absolute inset-x-2 top-8 bottom-12 border border-dashed border-amber-500/20 rounded pointer-events-none flex items-start justify-end p-1">
              <span className="text-[8px] font-mono text-amber-500/40">SAFE AREA 9:16</span>
            </div>
          )}
        </div>
      </div>

      {/* Multi-Shot Segment Bar */}
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 font-mono">
            <Film className="w-3 h-3 text-amber-400" />
            Timeline Micro-Shots ({shots.length} Angles):
          </span>
          <span className="font-mono text-amber-400">
            t = {currentTime.toFixed(2)}s / 60.0s
          </span>
        </div>

        {/* Visual Multi-Segment Timeline Track */}
        <div className="h-4 w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex">
          {shots.map((shot) => {
            const widthPct = ((shot.end - shot.start) / totalDuration) * 100;
            const isShotActive = currentTime >= shot.start && currentTime < shot.end;
            return (
              <div
                key={shot.id}
                onClick={() => setCurrentTime(shot.start)}
                title={`Shot ${shot.id}: ${shot.type} (${shot.start.toFixed(1)}s - ${shot.end.toFixed(1)}s)`}
                style={{ width: `${widthPct}%` }}
                className={`h-full border-r border-slate-900 transition-colors cursor-pointer ${
                  isShotActive
                    ? 'bg-amber-400'
                    : shot.id % 2 === 0
                    ? 'bg-slate-800 hover:bg-slate-700'
                    : 'bg-slate-700/70 hover:bg-slate-600'
                }`}
              />
            );
          })}
        </div>

        {/* Scrubber Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 2.5))}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 2.5))}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min="0"
            max={totalDuration}
            step="0.04"
            value={currentTime}
            onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
            className="flex-1 accent-amber-500 cursor-pointer h-2 bg-slate-950 rounded-lg"
          />

          <span className="text-xs font-mono text-amber-400 min-w-16 text-right">
            {currentTime.toFixed(2)}s
          </span>
        </div>
      </div>
    </div>
  );
}
