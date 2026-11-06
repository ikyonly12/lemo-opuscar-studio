import React, { useState } from 'react';
import { CloudLightning, X, ExternalLink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function CloudRenderModal({ isOpen, onClose, renderParams }) {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('lemo-opuscar-studio');
  const [status, setStatus] = useState('IDLE'); // IDLE, DISPATCHING, SUCCESS, ERROR
  const [message, setMessage] = useState('');
  const [actionUrl, setActionUrl] = useState('');

  if (!isOpen) return null;

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!token || !owner || !repo) {
      alert('Harap isi GitHub Token, Username (Owner), dan Nama Repository!');
      return;
    }

    setStatus('DISPATCHING');
    setMessage('Menghubungkan ke GitHub Actions Cloud Runner...');

    try {
      const res = await fetch('/api/render/cloud-dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          github_token: token,
          owner: owner.trim(),
          repo: repo.trim(),
          inputs: {
            style: renderParams.style,
            aspect_ratio: renderParams.aspectRatio,
            language: renderParams.language,
            topic: renderParams.story?.topic || 'Unknown Invention'
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus('SUCCESS');
        setMessage('Job rendering berhasil dikirim ke Cloud Runner GitHub Actions!');
        setActionUrl(data.workflow_url);
      } else {
        setStatus('ERROR');
        setMessage(data.error || 'Gagal mengirim job render.');
      }
    } catch (err) {
      setStatus('ERROR');
      setMessage(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <CloudLightning className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              Cloud Render Farm (GitHub Actions)
            </h2>
            <p className="text-xs text-slate-400">
              Render film di cloud server Linux 4 vCPU 16GB RAM tanpa membebani laptop
            </p>
          </div>
        </div>

        {/* Selected Specs Summary */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-5 text-xs grid grid-cols-2 gap-2 text-slate-300">
          <div><span className="text-slate-500">Style:</span> <b className="text-amber-400">{renderParams.style}</b></div>
          <div><span className="text-slate-500">Rasio:</span> <b>{renderParams.aspectRatio}</b></div>
          <div><span className="text-slate-500">Bahasa:</span> <b>{renderParams.language.toUpperCase()}</b></div>
          <div><span className="text-slate-500">Worker:</span> <b className="text-emerald-400">Ubuntu Latest (4 vCPU)</b></div>
        </div>

        {status === 'SUCCESS' ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Rendering Sedang Berjalan di Cloud!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Playwright, Three.js, dan FFmpeg sedang memproses frame di server cloud GitHub Actions.
              </p>
            </div>
            {actionUrl && (
              <a
                href={actionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl shadow transition"
              >
                Lihat Live Progress di GitHub
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                GitHub Username / Organization
              </label>
              <input
                type="text"
                placeholder="misal: kenziekafi"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Repository Name
              </label>
              <input
                type="text"
                placeholder="lemo-opuscar-studio"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                <span>Personal Access Token (PAT)</span>
                <span className="text-[10px] text-slate-500">Izin: repo / workflow</span>
              </label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
            </div>

            {status === 'ERROR' && (
              <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{message}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'DISPATCHING'}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {status === 'DISPATCHING' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghubungkan ke GitHub Actions...
                  </>
                ) : (
                  <>
                    <CloudLightning className="w-4 h-4" />
                    Mulai Render di Cloud (0% Beban Laptop)
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
