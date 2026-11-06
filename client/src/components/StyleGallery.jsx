import React, { useState, useEffect } from 'react';
import { Film, Sparkles, Box, Palette, Terminal, Compass, Check } from 'lucide-react';

export default function StyleGallery({ selectedStyle, onSelectStyle }) {
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/styles')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStyles(data.styles);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching styles:', err);
        setLoading(false);
      });
  }, []);

  const filteredStyles = styles.filter(s => {
    const matchesSearch = s.en.toLowerCase().includes(search.toLowerCase()) || 
                          (s.cn && s.cn.includes(search)) ||
                          (s.cat_en && s.cat_en.toLowerCase().includes(search.toLowerCase()));
    if (!matchesSearch) return false;
    if (filter === 'ALL') return true;
    if (filter === '3D') return s.engine.includes('3D');
    if (filter === '2D') return s.engine.includes('Canvas');
    if (filter === 'SHADER') return s.engine.includes('Shader');
    if (filter === 'VECTOR') return s.engine.includes('Vector');
    return true;
  });

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-amber-400">
            <Film className="w-5 h-5" />
            Katalog 66 Visual Styles
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pilih visual style berbasis kode (Three.js 3D, Canvas 2D, WebGL Shaders)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Cari style (misal: paper, brick, watercolor)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs px-3 py-2 rounded-lg w-64 focus:outline-none focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 text-xs">
        {[
          { id: 'ALL', label: 'Semua (66+)', icon: Sparkles },
          { id: '3D', label: '3D PBR & Diorama', icon: Box },
          { id: '2D', label: 'Canvas 2D & Paint', icon: Palette },
          { id: 'SHADER', label: 'WebGL Shaders', icon: Terminal },
          { id: 'VECTOR', label: 'Vector & Blueprint', icon: Compass },
        ].map(tab => {
          const Icon = tab.icon;
          const active = filter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition cursor-pointer ${
                active
                  ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 font-medium'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Grid of Styles */}
      {loading ? (
        <div className="py-20 text-center text-slate-500 text-sm animate-pulse">
          Memuat katalog visual style dari pustaka Lemo-Opuscar...
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-[460px] overflow-y-auto pr-2">
          {filteredStyles.map(item => {
            const isSelected = selectedStyle === item.slug;
            return (
              <div
                key={item.slug}
                onClick={() => onSelectStyle(item.slug)}
                className={`group relative rounded-xl border p-2.5 transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-500 shadow-lg shadow-amber-500/10'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 hover:bg-slate-950'
                }`}
              >
                <div>
                  <div className="aspect-video w-full rounded-lg bg-slate-900 overflow-hidden relative mb-2 flex items-center justify-center border border-slate-800/80">
                    {item.posterUrl ? (
                      <img
                        src={item.posterUrl}
                        alt={item.en}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-[10px] text-slate-600 font-mono text-center p-2">
                        {item.engine}
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-amber-500 text-black p-0.5 rounded-full shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-xs text-slate-200 truncate group-hover:text-amber-400 transition">
                    {item.en}
                  </h3>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">
                    {item.film || item.cat_en}
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400">
                  <span className="px-1.5 py-0.5 bg-slate-900 rounded font-mono text-amber-500/90 border border-slate-800">
                    {item.engine.split(' ')[0]}
                  </span>
                  <span>{item.dur ? `${item.dur.toFixed(0)}s` : '60s'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
