import React, { useRef, useEffect, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  DollarSign,
  CheckCircle2,
  X,
  Layers,
  HelpCircle,
  BarChart2,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import { AssetInfo, LiveMarketQuote } from '../types';
import { ALL_ASSETS } from '../data/assets';

interface CaptureHubProps {
  selectedAsset: AssetInfo;
  onSelectAsset: (asset: AssetInfo) => void;
  uploadedImage: string | null;
  onImageChange: (base64: string | null, mimeType?: string) => void;
  liveQuote: LiveMarketQuote | null;
  feedStatus: 'loading' | 'live' | 'error';
  onToggleTradingViewEmbed: () => void;
  isTradingViewEmbedOpen: boolean;
}

export const CaptureHub: React.FC<CaptureHubProps> = ({
  selectedAsset,
  onSelectAsset,
  uploadedImage,
  onImageChange,
  liveQuote,
  feedStatus,
  onToggleTradingViewEmbed,
  isTradingViewEmbedOpen,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteNotice, setPasteNotice] = useState(false);

  // Global paste handler so user can press Ctrl+V / Cmd+V anywhere to paste a screenshot
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (loadEvent) => {
              const result = loadEvent.target?.result as string;
              onImageChange(result, file.type);
              setPasteNotice(true);
              setTimeout(() => setPasteNotice(false), 3000);
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onImageChange]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      onImageChange(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const isPriceUnavailable =
    feedStatus === 'error' || (!liveQuote && feedStatus === 'live');

  return (
    <div
      id="capture-upload-zone"
      className="luxury-card rounded-2xl p-4 flex flex-col gap-4"
    >
      {/* 1. Asset Selection Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Sélectionne ton Marché / Indice</span>
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {selectedAsset.category === 'INDICES'
              ? 'Indice Boursier'
              : selectedAsset.isGold
              ? 'Métal Précieux'
              : selectedAsset.category === 'CRYPTO'
              ? 'Crypto'
              : 'Forex'}
          </span>
        </div>

        {/* Horizontal scrollable asset badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-700">
          {ALL_ASSETS.map((asset) => {
            const isSelected = asset.id === selectedAsset.id;
            return (
              <button
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? asset.isGold
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm shadow-amber-500/20 scale-105'
                      : 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm shadow-cyan-500/20 scale-105'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {asset.id}
                {asset.isGold && ' 🥇'}
              </button>
            );
          })}
        </div>

        {/* Selected asset note */}
        <div className="mt-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-slate-200">{selectedAsset.name}</span>
            <span className="text-slate-500">•</span>
            <span>{selectedAsset.description}</span>
          </div>
          {selectedAsset.isGold && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] border border-amber-500/40">
              RÈGLE OR : SL 1.5$-3$ max
            </span>
          )}
        </div>
      </div>

      {/* 2. TradingView Live Chart Toggle Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <button
          onClick={onToggleTradingViewEmbed}
          className={`btn-glow-gold flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border transition cursor-pointer ${
            isTradingViewEmbedOpen
              ? 'bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#0A0A12] border-[#FFD700]'
              : 'bg-[#0A0A12] text-[#FFD700] border-[#FFD700]/40 hover:border-[#FFD700]'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-left">
            {isTradingViewEmbedOpen
              ? 'Masquer le graphique live'
              : 'Afficher le graphique TradingView en direct'}
          </span>
        </button>

        <span className="text-[11px] text-slate-500 font-mono">
          {pasteNotice && (
            <span className="text-emerald-400 font-semibold animate-bounce">
              Capture collée (Ctrl+V) !
            </span>
          )}
        </span>
      </div>

      {/* 3. Drag & Drop / Paste Screenshot Zone */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-1">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-emerald-400" />
            <span>Capture TradingView (15m Recommandé)</span>
          </label>
          <span className="text-[11px] text-slate-400">
            Colle avec Ctrl+V ou glisse-dépose
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />

        {uploadedImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 shadow-inner">
            <img
              src={uploadedImage}
              alt="Capture de marché TradingView"
              className="w-full max-h-[220px] object-contain mx-auto bg-slate-950"
            />
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded bg-emerald-500/90 text-slate-950 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Capture Chargée
              </span>
              <button
                onClick={() => onImageChange(null)}
                className="p-1 rounded-md bg-rose-500/90 hover:bg-rose-600 text-white transition cursor-pointer"
                title="Supprimer la capture"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-2 bg-slate-900/95 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between gap-2">
              <span>Le robot va scanner les Order Blocks, FVG et BOS sur cette image.</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-cyan-400 hover:underline font-semibold flex-shrink-0 cursor-pointer"
              >
                Changer d&apos;image
              </button>
            </div>
          </div>
        ) : (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
                : 'border-slate-700 hover:border-slate-500 bg-slate-950/60'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
              <Upload className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Glisse ta capture TradingView ou clique pour importer
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Règle Suprême #1 : TRADEMASTER AI utilise UNIQUEMENT le prix réel TradingView ou ta capture.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-400/90 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/40">
              <span>💡 Raccourci : Presse Ctrl + V pour coller directement</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Exact Live Price from Official TradingView Widget (100% Real-Time, Never Invented) */}
      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/90">
        <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Prix réel TradingView (En direct)</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {selectedAsset.tvSymbol} • {selectedAsset.pointValue}
          </span>
        </div>

        {liveQuote ? (
          <div className="bg-[#0A0A12] border border-[#FFD700]/50 rounded-2xl px-4 py-3 flex items-center justify-between gap-2 shadow-[0_0_20px_rgba(255,215,0,0.12)]">
            <div>
              <span className="text-[10px] font-mono text-[#00FF88] uppercase font-bold block">
                ● Widget TradingView Sync 1s
              </span>
              <span
                className={`font-mono font-black tabular-nums ${
                  selectedAsset.isGold
                    ? 'text-3xl sm:text-4xl gold-gradient-text'
                    : 'text-2xl sm:text-3xl text-[#FFD700]'
                }`}
              >
                {liveQuote.formattedPrice}
              </span>
            </div>

            <div className="text-right font-mono">
              <span className="text-xs text-slate-300 font-bold block">{selectedAsset.id}</span>
              {liveQuote.changePercent !== null && (
                <span
                  className={`text-xs font-bold ${
                    liveQuote.changePercent >= 0 ? 'text-[#00FF88]' : 'text-[#FF3B3B]'
                  }`}
                >
                  {liveQuote.changePercent >= 0 ? '+' : ''}
                  {liveQuote.changePercent.toFixed(2)}%
                </span>
              )}
            </div>
          </div>
        ) : isPriceUnavailable ? (
          <div className="bg-rose-500/15 border-2 border-rose-500 rounded-xl p-3 text-center space-y-1">
            <div className="flex items-center justify-center gap-2 text-rose-300 font-black text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>PRIX NON DISPONIBLE - Envoie une capture TradingView</span>
            </div>
            <p className="text-[11px] text-rose-200/80">
              Aucun signal ne sera généré sans prix réel TradingView ou capture.
            </p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-3 flex items-center gap-2 text-xs font-mono text-amber-300">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>Récupération du prix réel TradingView...</span>
          </div>
        )}

        <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-400 flex-shrink-0" />
          Zéro prix inventé : Entrée, SL et TP sont calculés uniquement depuis le prix réel affiché ci-dessus ou ta capture.
        </p>

        {/* 6 Mandatory Pillars Checklist (v5) */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-[10px] font-mono text-slate-400">
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            ✓ EMA 50/200
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            ✓ RSI 14
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            ✓ MACD
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            ✓ VWAP
          </span>
          <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
            ✓ ATR &amp; Volume
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
            ★ Min 3 Confluences
          </span>
        </div>
      </div>
    </div>
  );
};
