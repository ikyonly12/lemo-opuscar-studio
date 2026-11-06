import React, { useState } from 'react';
import { Bot, Key, CheckCircle2, AlertCircle, Loader2, ExternalLink, X, Eye, EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import { LLM_PROVIDERS, saveLLMConfig, testLLMConnection } from '../services/llm';

export default function AISettingsModal({ isOpen, onClose, currentConfig, onSaveConfig }) {
  const [provider, setProvider] = useState(currentConfig.provider || 'gemini');
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [model, setModel] = useState(currentConfig.model || 'gemini-2.0-flash');
  const [baseUrl, setBaseUrl] = useState(currentConfig.baseUrl || '');
  const [showKey, setShowKey] = useState(false);

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const activeProviderMeta = LLM_PROVIDERS.find(p => p.id === provider) || LLM_PROVIDERS[0];

  const handleProviderChange = (newProviderId) => {
    setProvider(newProviderId);
    const meta = LLM_PROVIDERS.find(p => p.id === newProviderId);
    if (meta) {
      setModel(meta.defaultModel);
    }
    setTestResult(null);
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: 'Harap masukkan API Key terlebih dahulu sebelum menguji!' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const result = await testLLMConnection({
      provider,
      apiKey: apiKey.trim(),
      model,
      baseUrl
    });

    setTesting(false);
    setTestResult(result);
  };

  const handleSave = () => {
    const newConfig = {
      provider,
      apiKey: apiKey.trim(),
      model,
      baseUrl: baseUrl.trim()
    };
    saveLLMConfig(newConfig);
    onSaveConfig(newConfig);
    onClose();
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

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Pengaturan AI Studio (BYOK)
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30">
                Multi-Provider
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Hubungkan LLM pilihan Anda untuk menghasilkan cerita & mengarahkan naskah sinematik
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Provider Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Pilih Provider LLM
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {LLM_PROVIDERS.map((p) => {
                const isSelected = provider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderChange(p.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-purple-950/40 border-purple-500 text-purple-200 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-xs truncate text-slate-200">{p.name}</div>
                    <span className="text-[9px] text-purple-400 font-mono mt-1">{p.badge}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">
              Model
            </label>
            {activeProviderMeta.models?.length > 1 ? (
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition"
              >
                {activeProviderMeta.models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="misal: gpt-4o, gemini-2.0-flash, llama3"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition font-mono"
              />
            )}
          </div>

          {/* Custom Base URL (if custom provider) */}
          {activeProviderMeta.requiresBaseUrl && (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Base URL
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://localhost:11434/v1"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition font-mono"
              />
            </div>
          )}

          {/* API Key Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-purple-400" />
                API Key / Access Token
              </label>
              {activeProviderMeta.keyHelpUrl && (
                <a
                  href={activeProviderMeta.keyHelpUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-purple-400 hover:underline flex items-center gap-0.5"
                >
                  {activeProviderMeta.keyHelpText}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={activeProviderMeta.keyPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 pr-10 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Key disimpan lokal di browser (localStorage) Anda dan tidak pernah dikirim ke server kami.
            </p>
          </div>

          {/* Test Connection Button & Status */}
          <div className="pt-1">
            <button
              type="button"
              disabled={testing}
              onClick={handleTestConnection}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition cursor-pointer"
            >
              {testing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  Menguji Koneksi ke {activeProviderMeta.name}...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Uji Koneksi API Key Sekarang
                </>
              )}
            </button>

            {testResult && (
              <div
                className={`mt-2.5 p-3 rounded-xl text-xs flex items-start gap-2 border ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                    : 'bg-red-950/40 border-red-500/50 text-red-300'
                }`}
              >
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                )}
                <div className="flex-1 break-words leading-relaxed font-mono text-[11px]">
                  {testResult.message}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end mt-6 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl font-medium transition cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/20 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simpan Konfigurasi AI
          </button>
        </div>
      </div>
    </div>
  );
}

