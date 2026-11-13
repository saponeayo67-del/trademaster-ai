import React, { useEffect, useRef, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Camera,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { AssetInfo, LiveMarketQuote } from '../types';
import { ALL_ASSETS, HOME_WIDGET_ASSET_IDS } from '../data/assets';

interface TradingViewLiveBoardProps {
  selectedAsset: AssetInfo;
  onSelectAsset: (asset: AssetInfo) => void;
  liveQuotes: Record<string, LiveMarketQuote>;
  feedStatus: 'loading' | 'live' | 'error';
  lastUpdatedAt: string | null;
  onOpenChart: () => void;
  isChartOpen: boolean;
  onJumpToCapture: () => void;
}

const OFFICIAL_TICKER_TAPE_SYMBOLS = [
  { proName: 'OANDA:US30USD', title: 'US30' },
  { proName: 'CME_MINI:NQ1!', title: 'US100' },
  { proName: 'NASDAQ:NDX', title: 'NAS100' },
  { proName: 'SP:SPX', title: 'US500' },
  { proName: 'TVC:DEU40', title: 'GER40' },
  { proName: 'TVC:UKX', title: 'UK100' },
  { proName: 'TVC:CAC40', title: 'FRA40' },
  { proName: 'TVC:NI225', title: 'JP225' },
  { proName: 'OANDA:XAUUSD', title: 'XAUUSD (OR)' },
  { proName: 'FX:EURUSD', title: 'EURUSD' },
  { proName: 'BINANCE:BTCUSDT', title: 'BTCUSD' },
];

export const TradingViewLiveBoard: React.FC<TradingViewLiveBoardProps> = ({
  selectedAsset,
  onSelectAsset,
  liveQuotes,
  feedStatus,
  lastUpdatedAt,
  onOpenChart,
  isChartOpen,
  onJumpToCapture,
}) => {
  const tickerContainerRef = useRef<HTMLDivElement>(null);
  const [embedError, setEmbedError] = useState(false);

  useEffect(() => {
    const container = tickerContainerRef.current;
    if (!container) return;

    container.innerHTML = '';
    setEmbedError(false);

    const widgetInner = document.createElement('div');
    widgetInner.className = 'tradingview-widget-container__widget';
    container.appendChild(widgetInner);

    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: OFFICIAL_TICKER_TAPE_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'fr',
    });
    script.onerror = () => {
      setEmbedError(true);
    };

    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

  const homeAssets = HOME_WIDGET_ASSET_IDS.map((id) =>
    ALL_ASSETS.find((a) => a.id === id)
  ).filter((a): a is AssetInfo => Boolean(a));

  const selectedQuote = liveQuotes[selectedAsset.id];
  const isSelectedUnavailable =
    feedStatus === 'error' ||
    embedError ||
    (feedStatus === 'live' && !selectedQuote);

  return (
    <section
      aria-label="Widget Officiel TradingView en direct"
      className="luxury-card rounded-2xl overflow-hidden flex flex-col"
    >
      {/* Top Bar */}
      <div className="bg-[#0A0A12]/90 px-3 sm:px-4 py-2.5 border-b border-[#FFD700]/25 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
              feedStatus === 'live' && !embedError
                ? 'bg-emerald-400 animate-ping'
                : feedStatus === 'loading'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-rose-500'
            }`}
          />
          <h2 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
            Widget Officiel TradingView en Direct
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1">
            <RefreshCw
              className={`w-3 h-3 ${feedStatus === 'live' ? 'animate-spin' : ''}`}
            />
            MAJ 1s
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {lastUpdatedAt && feedStatus === 'live' && (
            <span className="text-[10px] font-mono text-slate-400">
              Synchro :{' '}
              {new Date(lastUpdatedAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          )}

          <button
            type="button"
            onClick={onOpenChart}
            className={`btn-glow-gold flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold border transition cursor-pointer ${
              isChartOpen
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#0A0A12] border-[#FFD700]'
                : 'bg-[#0A0A12] hover:border-[#FFD700]/70 text-[#FFD700] border-[#FFD700]/35'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>{isChartOpen ? 'Masquer Graphique' : 'Graphique Live'}</span>
          </button>
        </div>
      </div>

      {/* Official TradingView Ticker Tape Embed */}
      {!embedError && (
        <div className="bg-slate-950/70 border-b border-slate-800/80 min-h-[46px]">
          <div
            ref={tickerContainerRef}
            className="tradingview-widget-container w-full"
          />
        </div>
      )}

      {/* Big Error Alert when Widget fails or Real Price Unavailable */}
      {isSelectedUnavailable && (
        <div className="m-3 p-4 rounded-xl bg-rose-500/15 border-2 border-rose-500 text-rose-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-7 h-7 text-rose-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base sm:text-xl font-black tracking-wide text-rose-200">
                PRIX NON DISPONIBLE - Envoie une capture TradingView
              </p>
              <p className="text-xs text-rose-200/80 mt-1">
                Le widget TradingView ne retourne pas le prix réel pour{' '}
                <strong>{selectedAsset.id}</strong>. Aucun prix ne sera inventé et aucun signal ne sera donné sans prix réel ou capture.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onJumpToCapture}
            className="px-3.5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Envoyer une capture</span>
          </button>
        </div>
      )}

      {/* 1-Second Live Price Cards Grid for the 11 Official Symbols */}
      <div className="p-3 bg-[#0A0A12]/60">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-2">
          {homeAssets.map((asset) => {
            const quote = liveQuotes[asset.id];
            const isSelected = asset.id === selectedAsset.id;
            const isUp = (quote?.changePercent ?? 0) >= 0;

            return (
              <button
                key={asset.id}
                type="button"
                onClick={() => onSelectAsset(asset)}
                className={`text-left p-2.5 rounded-xl border transition-all flex flex-col justify-between gap-1 cursor-pointer ${
                  isSelected
                    ? asset.isGold
                      ? 'bg-[#FFD700]/15 border-[#FFD700] shadow-[0_0_16px_rgba(255,215,0,0.3)]'
                      : 'bg-[#00E5FF]/15 border-[#00E5FF] shadow-[0_0_16px_rgba(0,229,255,0.25)]'
                    : asset.isGold
                    ? 'bg-[#0A0A12]/90 border-[#FFD700]/45 hover:border-[#FFD700]'
                    : 'bg-[#0A0A12]/80 border-[#FFD700]/20 hover:border-[#A855F7]/60'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[11px] font-black truncate ${
                      asset.isGold ? 'gold-gradient-text' : 'text-slate-100'
                    }`}
                  >
                    {asset.id}
                  </span>
                  {quote?.changePercent !== null &&
                    quote?.changePercent !== undefined && (
                      <span
                        className={`text-[9px] font-mono font-bold flex items-center gap-0.5 ${
                          isUp ? 'text-[#00FF88]' : 'text-[#FF3B3B]'
                        }`}
                      >
                        {isUp ? (
                          <TrendingUp className="w-2.5 h-2.5" />
                        ) : (
                          <TrendingDown className="w-2.5 h-2.5" />
                        )}
                        {isUp ? '+' : ''}
                        {quote.changePercent.toFixed(2)}%
                      </span>
                    )}
                </div>

                {quote ? (
                  <div
                    className={`text-xs sm:text-[13px] font-mono font-black tabular-nums ${
                      asset.isGold ? 'gold-gradient-text' : 'text-slate-100'
                    }`}
                  >
                    {quote.formattedPrice}
                  </div>
                ) : (
                  <div className="text-[10px] font-mono font-bold text-[#FF3B3B] flex items-center gap-1">
                    <Activity className="w-3 h-3" />
                    {feedStatus === 'loading' ? 'Chargement...' : 'INDISP.'}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
