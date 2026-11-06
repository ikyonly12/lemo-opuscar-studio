import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Smartphone, Monitor, Camera } from 'lucide-react';

export default function TimelineScrubber({ selectedStyle, aspectRatio, setAspectRatio }) {
  const [currentTime, setCurrentTime] = useState(1.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const [totalDuration, setTotalDuration] = useState(60.0);
  const [previewImg, setPreviewImg] = useState(null);
  const [loadingStill, setLoadingStill] = useState(false);

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

  const handleCaptureStill = () => {
    setLoadingStill(true);
    fetch(`/api/render/still?style=${selectedStyle}&t=${currentTime.toFixed(2)}`)
      .then(res => {
        if (res.headers.get('content-type')?.includes('image')) {
          return res.blob().then(b => URL.createObjectURL(b));
        }
        return null;
      })
      .then(url => {
        if (url) setPreviewImg(url);
        setLoadingStill(false);
      })
      .catch(() => setLoadingStill(false));
  };

  const isPortrait = aspectRatio === '9:16';

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
            <Monitor className="w-5 h-5" />
            Interactive Viewport & Timeline Scrubber
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulasi fungsi render deterministik <code className="text-amber-300 font-mono">render(t)</code>
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
          {previewImg ? (
            <img src={previewImg} alt="Frame Still" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Live Stage: {selectedStyle}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-1">
                  t = {currentTime.toFixed(2)}s / {totalDuration.toFixed(0)}s (24 FPS)
                </p>
              </div>
              <button
                onClick={handleCaptureStill}
                disabled={loadingStill}
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                {loadingStill ? 'Capturing Still...' : 'Capture Frame-Zero Still'}
              </button>
            </div>
          )}

          {/* Subtitle Chunk Simulation Overlay */}
          <div className="absolute bottom-6 left-0 right-0 px-4 text-center pointer-events-none">
            <span className="inline-block bg-black/75 text-amber-300 font-medium text-xs px-2.5 py-1 rounded shadow backdrop-blur-sm border border-black/40">
              "How Clock Gears Broke Our Biology"
            </span>
          </div>

          {/* Mobile Safe Area Guideline (Portrait Only) */}
          {isPortrait && (
            <div className="absolute inset-x-2 top-8 bottom-12 border border-dashed border-amber-500/20 rounded pointer-events-none flex items-start justify-end p-1">
              <span className="text-[8px] font-mono text-amber-500/40">SAFE AREA</span>
            </div>
          )}
        </div>
      </div>

      {/* Scrubber Controls */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition cursor-pointer shadow-lg shadow-amber-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => setCurrentTime(Math.max(0, currentTime - 1.0))}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 1.0))}
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
