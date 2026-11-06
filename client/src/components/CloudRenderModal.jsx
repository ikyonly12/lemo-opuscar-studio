import React, { useState, useEffect, useRef } from 'react';
import { CloudLightning, X, ExternalLink, CheckCircle, AlertCircle, Loader2, Key, Download, Film, Sparkles } from 'lucide-react';

export default function CloudRenderModal({ isOpen, onClose, renderParams }) {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('ikyonly12');
  const [repo, setRepo] = useState('lemo-opuscar-studio');
  const [status, setStatus] = useState('IDLE'); // IDLE, DISPATCHING, RUNNING, SUCCESS, ERROR
  const [message, setMessage] = useState('');
  const [activeRun, setActiveRun] = useState(null);
  const [directVideoUrl, setDirectVideoUrl] = useState('');
  
  const pollTimerRef = useRef(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('GITHUB_STUDIO_PAT');
    if (savedToken) setToken(savedToken);
    
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  // Poll GitHub Actions run status until completed
  const startPolling = (targetRunId) => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner.trim()}/${repo.trim()}/actions/runs/${targetRunId}`, {
          headers: {
            'Accept': 'application/vnd.github+json',
            'Authorization': `Bearer ${token.trim()}`
          }
        });
        if (res.ok) {
          const runData = await res.json();
          setActiveRun(runData);

          if (runData.status === 'completed') {
            clearInterval(pollTimerRef.current);
            if (runData.conclusion === 'success') {
              setStatus('SUCCESS');
              // Direct 1-click download URL from GitHub Release asset
              const mp4Url = `https://github.com/${owner.trim()}/${repo.trim()}/releases/download/render-${targetRunId}/final_film.mp4`;
              setDirectVideoUrl(mp4Url);
            } else {
              setStatus('ERROR');
              setMessage(`Proses cloud selesai dengan status: ${runData.conclusion}. Silakan periksa log detail di GitHub.`);
            }
          }
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 5000);
  };

  const handleDispatch = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      alert('Harap masukkan Personal Access Token (PAT) GitHub Anda!');
      return;
    }

    if (!renderParams?.story) {
      alert('Pilih atau tulis ide cerita terlebih dahulu di studio sebelum memulai render!');
      return;
    }

    setStatus('DISPATCHING');
    setMessage('Menghubungkan ke GitHub Actions Cloud Runner...');
    setActiveRun(null);
    setDirectVideoUrl('');

    try {
      localStorage.setItem('GITHUB_STUDIO_PAT', token.trim());

      // Serialize dynamic treatment to Base64 (Zero Dummy Data)
      let treatmentB64 = '';
      const payload = {
        title: renderParams.treatment?.title || renderParams.story?.title || 'Studio Film',
        topic: renderParams.story?.topic || renderParams.story?.title || '',
        style: renderParams.style || 'paper-popup',
        aspectRatio: renderParams.aspectRatio || '16:9',
        language: renderParams.language || 'id',
        shots: renderParams.treatment?.shots || [],
        subtitles: renderParams.treatment?.subtitles || [],
        voiceLines: renderParams.treatment?.voiceLines || [],
        foleyCues: renderParams.treatment?.foleyCues || []
      };

      const jsonStr = JSON.stringify(payload);
      treatmentB64 = btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));

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
            topic: renderParams.story?.topic || renderParams.story?.title || 'Inovasi Sejarah Tersembunyi',
            treatment_b64: treatmentB64
          }
        })
      });

      if (response.status === 204 || response.status === 200) {
        setStatus('RUNNING');
        setMessage('Job rendering diterima! Menunggu cloud worker menyala...');

        // Fetch newest run after 3 seconds
        setTimeout(async () => {
          try {
            const runsRes = await fetch(`https://api.github.com/repos/${owner.trim()}/${repo.trim()}/actions/workflows/render.yml/runs?per_page=1`, {
              headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${token.trim()}`
              }
            });
            if (runsRes.ok) {
              const runsData = await runsRes.json();
              if (runsData.workflow_runs?.length > 0) {
                const latestRun = runsData.workflow_runs[0];
                setActiveRun(latestRun);
                startPolling(latestRun.id);
              }
            }
          } catch (e) {}
        }, 3000);

      } else {
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
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
              Render film di cloud server Linux 4 vCPU 16GB RAM & Download langsung di website
            </p>
          </div>
        </div>

        {/* Selected Specs Summary */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-4 text-xs space-y-2 text-slate-300">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-1.5">
            <span className="text-slate-400 font-semibold">Proyek Aktif:</span>
            <span className="text-amber-400 font-bold truncate max-w-xs">
              {renderParams.story?.title || 'Belum Ada Cerita Dipilih'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><span className="text-slate-500">Style:</span> <b className="text-amber-400">{renderParams.style}</b></div>
            <div><span className="text-slate-500">Rasio:</span> <b>{renderParams.aspectRatio}</b></div>
            <div><span className="text-slate-500">Bahasa:</span> <b>{renderParams.language.toUpperCase()}</b></div>
            <div>
              <span className="text-slate-500">AI Treatment:</span>{' '}
              {renderParams.treatment?.shots?.length > 0 ? (
                <b className="text-emerald-400">{renderParams.treatment.shots.length} Micro-Shots</b>
              ) : (
                <b className="text-purple-400">Topik Dinamis</b>
              )}
            </div>
          </div>
        </div>

        {/* RUNNING STATE */}
        {status === 'RUNNING' && (
          <div className="py-6 text-center space-y-4">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Sedang Merender di Cloud...</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {activeRun?.status === 'queued'
                  ? 'Menunggu alokasi runner server Ubuntu...'
                  : 'Playwright headless browser sedang merender 24 FPS & mixing audio... Halaman akan otomatis menampilkan tombol download begitu selesai!'}
              </p>
            </div>
            <div className="pt-2">
              <a
                href={`https://github.com/${owner}/${repo}/actions`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 text-[11px] rounded-lg border border-slate-800 transition"
              >
                Intip log terminal di tab GitHub
                <ExternalLink className="w-3 h-3 text-amber-400" />
              </a>
            </div>
          </div>
        )}

        {/* SUCCESS STATE: DIRECT IN-WEBSITE PLAYER & DOWNLOAD */}
        {status === 'SUCCESS' && (
          <div className="py-4 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Film Berhasil Dirender!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tonton video hasil render di bawah ini dan klik tombol untuk mendownload langsung file MP4:
              </p>
            </div>

            {/* In-Website Video Player */}
            {directVideoUrl && (
              <div className="bg-black rounded-xl overflow-hidden border border-slate-800 shadow-xl my-3">
                <video
                  src={directVideoUrl}
                  controls
                  autoPlay
                  className="w-full max-h-[320px] mx-auto object-contain"
                />
              </div>
            )}

            {/* Direct Download Button */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={directVideoUrl}
                download="final_film.mp4"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                Download Video Master (.MP4)
              </a>
              <button
                onClick={() => setStatus('IDLE')}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition cursor-pointer"
              >
                Render Film Baru
              </button>
            </div>
          </div>
        )}

        {/* IDLE / FORM STATE */}
        {(status === 'IDLE' || status === 'DISPATCHING' || status === 'ERROR') && (
          <form onSubmit={handleDispatch} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3 h-3 text-amber-400" />
                  GitHub Personal Access Token (PAT)
                </span>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=Lemo-Opuscar-Studio-Cloud-Renderer"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                >
                  Link Buat Token (Scopes Auto-Checked)
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <input
                type="password"
                placeholder="ghp_... atau gho_..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs px-3.5 py-2.5 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Target Repositori: <code className="text-amber-400 font-mono font-bold">ikyonly12/lemo-opuscar-studio</code> · Memerlukan scope: <code className="text-emerald-400 font-mono">repo</code> dan <code className="text-emerald-400 font-mono">workflow</code>
              </p>
            </div>

            {status === 'ERROR' && (
              <div className="p-3 bg-red-950/40 border border-red-800/80 rounded-xl text-xs text-red-300 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Gagal Mengirim ke GitHub</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {message || "Token Anda tidak valid atau belum memiliki izin 'repo' dan 'workflow'."}
                </p>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'DISPATCHING' || !renderParams.story}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-40 text-black font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {status === 'DISPATCHING' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Menghubungkan ke GitHub Actions...
                  </>
                ) : (
                  <>
                    <CloudLightning className="w-4 h-4 fill-current" />
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
