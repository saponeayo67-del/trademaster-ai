import React, { useEffect, useRef, useState } from 'react';
import { X, ExternalLink, Camera, HelpCircle, AlertTriangle } from 'lucide-react';
import { ALL_ASSETS } from '../data/assets';

interface TradingViewWidgetProps {
  symbolId: string;
  onClose: () => void;
}

function mapToTvSymbol(id: string): string {
  const matched = ALL_ASSETS.find((a) => a.id === id);
  if (matched) return matched.tvSymbol;

  switch (id) {
    case 'US30':
      return 'OANDA:US30USD';
    case 'US100':
      return 'CME_MINI:NQ1!';
    case 'NAS100':
      return 'NASDAQ:NDX';
    case 'US500':
      return 'SP:SPX';
    case 'GER40':
      return 'TVC:DEU40';
    case 'UK100':
      return 'TVC:UKX';
    case 'FRA40':
      return 'TVC:CAC40';
    case 'JP225':
      return 'TVC:NI225';
    case 'XAUUSD':
      return 'OANDA:XAUUSD';
    case 'EURUSD':
      return 'FX:EURUSD';
    case 'BTCUSD':
      return 'BINANCE:BTCUSDT';
    default:
      return 'OANDA:US30USD';
  }
}

export const TradingViewWidget: React.FC<TradingViewWidgetProps> = ({
  symbolId,
  onClose,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const tvSymbol = mapToTvSymbol(symbolId);
  const [widgetError, setWidgetError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    setWidgetError(false);
    container.innerHTML = '';

    const chartDiv = document.createElement('div');
    chartDiv.id = 'tradingview_chart_container';
    chartDiv.className = 'h-full w-full';
    container.appendChild(chartDiv);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if (typeof window.TradingView !== 'undefined' && containerRef.current) {
        // @ts-ignore
        new window.TradingView.widget({
          autosize: true,
          symbol: tvSymbol,
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'fr',
          toolbar_bg: '#0f172a',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: 'tradingview_chart_container',
          studies: ['RSI@tv-basicstudies', 'MASimple@tv-basicstudies'],
        });
      } else {
        setWidgetError(true);
      }
    };

    script.onerror = () => {
      setWidgetError(true);
    };

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [tvSymbol]);

  return (
    <div className="luxury-card rounded-2xl overflow-hidden flex flex-col">
      {/* Widget Header */}
      <div className="bg-[#0A0A12]/95 px-4 py-2.5 border-b border-[#FFD700]/30 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              widgetError ? 'bg-rose-500' : 'bg-emerald-400 animate-ping'
            }`}
          />
          <h3 className="text-xs font-bold text-slate-200">
            Graphique TradingView Direct • {symbolId} ({tvSymbol})
          </h3>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            Timeframe 15m
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
            <Camera className="w-3.5 h-3.5" />
            <span>Prends une capture d&apos;écran puis colle-la (Ctrl+V)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
            title="Fermer le graphique direct"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart container or Big Error Banner */}
      {widgetError ? (
        <div className="h-[260px] w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center gap-3">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
          <p className="text-lg sm:text-2xl font-black text-rose-300">
            PRIX NON DISPONIBLE - Envoie une capture TradingView
          </p>
          <p className="text-xs text-slate-400 max-w-md">
            Le chargement du graphique TradingView a été bloqué ou a échoué. Importe ou colle (Ctrl+V) une capture d&apos;écran TradingView pour obtenir une analyse.
          </p>
        </div>
      ) : (
        <div className="h-[380px] sm:h-[420px] w-full bg-slate-950 relative" ref={containerRef}>
          <div id="tradingview_chart_container" className="h-full w-full" />
        </div>
      )}

      {/* Widget Footer */}
      <div className="bg-slate-950/80 px-4 py-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Visualise les bougies M15, identifie le prix réel, ou capture la vue pour TRADEMASTER AI.
        </span>
        <a
          href={`https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSymbol)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
        >
          Ouvrir sur TradingView <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
