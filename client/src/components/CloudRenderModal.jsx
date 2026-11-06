import React, { useState, useEffect } from 'react';
import { CloudLightning, X, ExternalLink, CheckCircle, AlertCircle, Loader2, Key } from 'lucide-react';

export default function CloudRenderModal({ isOpen, onClose, renderParams }) {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('ikyonly12');
  const [repo, setRepo] = useState('lemo-opuscar-studio');
  const [status, setStatus] = useState('IDLE'); // IDLE, DISPATCHING, SUCCESS, ERROR
  const [message, setMessage] = useState('');
  const [actionUrl, setActionUrl] = useState('');

  // Load saved token from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('GITHUB_STUDIO_PAT');
    if (savedToken) setToken(savedToken);
  }, []);

  if (!isOpen) return null;

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      alert('Harap masukkan Personal Access Token (PAT) GitHub Anda!');
      return;
    }

    setStatus('DISPATCHING');
    setMessage('Menghubungkan ke GitHub Actions Cloud Runner...');

    try {
      // Save token locally for convenience
      localStorage.setItem('GITHUB_STUDIO_PAT', token.trim());

      // Direct Client-to-GitHub REST API dispatch (100% Serverless!)
      const targetUrl = `https://api.github.com/repos/${owner.trim()}/${repo.trim()}/actions/workflows/render.yml/dispatches`;

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${token.trim()}`,
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            style: renderParams.style || 'paper-popup',
            aspect_ratio: renderParams.aspectRatio || '16:9',
            language: renderParams.language || 'id',
            topic: renderParams.story?.topic || renderParams.story?.title || 'Unknown Invention'
          }
        })
      });

      if (response.status === 204 || response.status === 200) {
        setStatus('SUCCESS');
        setMessage('Job rendering berhasil dikirim ke Cloud Runner GitHub Actions!');
        setActionUrl(`https://github.com/${owner.trim()}/${repo.trim()}/actions`);
      } else {
        const errText = await response.text();
        setStatus('ERROR');
        setMessage(`Gagal mengirim ke GitHub (Status ${response.status}): Pastikan Token memiliki izin 'repo' dan 'workflow'.`);
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
              Serverless: Menjalankan Playwright & FFmpeg langsung di Cloud Linux 4 vCPU 16GB
            </p>
          </div>
        </div>

        {/* Selected Specs Summary */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-5 text-xs grid grid-cols-2 gap-2 text-slate-300">
          <div><span className="text-slate-500">Style:</span> <b className="text-amber-400">{renderParams.style}</b></div>
          <div><span className="text-slate-500">Rasio:</span> <b>{renderParams.aspectRatio}</b></div>
          <div><span className="text-slate-500">Bahasa:</span> <b>{renderParams.language.toUpperCase()}</b></div>
          <div><span className="text-slate-500">Cloud Worker:</span> <b className="text-emerald-400">Ubuntu 24.04 (4 vCPU)</b></div>
        </div>

        {status === 'SUCCESS' ? (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Rendering Berhasil Dimulai di Cloud!</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                GitHub Actions sedang merender animasi Three.js/Canvas frame demi frame dan menyatukan audio menjadi MP4.
              </p>
            </div>
            {actionUrl && (
              <a
                href={actionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl shadow transition"
              >
                Lihat Progress di GitHub Actions
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleDispatch} className="space-y-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3 h-3 text-amber-400" />
                  GitHub Personal Access Token (PAT)
                </span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=Lemo-Opuscar-Studio-Cloud-Renderer"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  Buat Token Baru (1 Klik)
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </label>
              <input
                type="password"
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Token disimpan aman di browser lokal Anda untuk memicu Cloud Runner secara langsung.
              </p>
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
