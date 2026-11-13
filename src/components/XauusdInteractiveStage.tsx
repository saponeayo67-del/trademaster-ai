import React, { useEffect, useRef, useState } from 'react';
import {
  Maximize2,
  Minimize2,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Hand,
  Camera,
  Zap,
} from 'lucide-react';
import { LiveMarketQuote } from '../types';
import { SiriRobot, SiriMood } from './SiriRobot';

interface XauusdInteractiveStageProps {
  xauQuote: LiveMarketQuote | null;
  feedStatus: 'loading' | 'live' | 'error';
  onJumpToCapture: () => void;
  onTriggerQuickAnalysis?: (direction: 'BUY' | 'SELL') => void;
}

interface GoldenFootprint {
  id: number;
  xPercent: number;
  yPercent: number;
  facing: 'left' | 'right';
}

interface ConfettiPiece {
  id: number;
  leftPercent: number;
  delayMs: number;
  driftPx: number;
  color: string;
  sizePx: number;
}

const FALLING_PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${(i * 5.7 + 3) % 97}%`,
  duration: `${5.5 + (i % 5) * 1.4}s`,
  delay: `${(i % 7) * 0.7}s`,
  size: i % 3 === 0 ? 'w-1.5 h-1.5' : 'w-1 h-1',
}));

const GLOWING_CANDLES = [
  { x: 6, h: 36, bull: true },
  { x: 11, h: 52, bull: true },
  { x: 16, h: 28, bull: false },
  { x: 21, h: 64, bull: true },
  { x: 78, h: 42, bull: false },
  { x: 83, h: 58, bull: true },
  { x: 88, h: 34, bull: false },
  { x: 93, h: 68, bull: true },
];

export const XauusdInteractiveStage: React.FC<XauusdInteractiveStageProps> = ({
  xauQuote,
  feedStatus,
  onJumpToCapture,
  onTriggerQuickAnalysis,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [widgetError, setWidgetError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Price tick pulse & direction tracking
  const prevPriceRef = useRef<number | null>(null);
  const [tickPulseKey, setTickPulseKey] = useState(0);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'neutral'>('neutral');

  // Siri state on widget
  const [siriX, setSiriX] = useState<number>(15);
  const [siriY, setSiriY] = useState<number>(80); // percentage from top (80% = near support/bottom)
  const [siriFacing, setSiriFacing] = useState<'left' | 'right'>('right');
  const [siriMood, setSiriMood] = useState<SiriMood>('walk');
  const [siriSpeech, setSiriSpeech] = useState<string | null>('Coucou ! 👋');
  const [overrideUntil, setOverrideUntil] = useState<number>(0);

  // Footprints (fade out after 2s)
  const [footprints, setFootprints] = useState<GoldenFootprint[]>([]);
  const footprintIdRef = useRef(0);

  // Support 3x blink animation key
  const [supportBlinkKey, setSupportBlinkKey] = useState(0);
  const lastSupportTouchTimeRef = useRef(0);

  // Golden confetti burst on BUY
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [lastClickDirection, setLastClickDirection] = useState<'BUY' | 'SELL' | null>(null);

  // Embed TradingView XAUUSD chart in dark mode
  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    setWidgetError(false);
    container.innerHTML = '';

    const chartId = isFullscreen
      ? 'tv_xauusd_fullscreen_chart'
      : 'tv_xauusd_stage_chart';

    const inner = document.createElement('div');
    inner.id = chartId;
    inner.className = 'w-full h-full';
    container.appendChild(inner);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.type = 'text/javascript';
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      if (typeof window.TradingView !== 'undefined' && chartContainerRef.current) {
        // @ts-ignore
        new window.TradingView.widget({
          autosize: true,
          symbol: 'OANDA:XAUUSD',
          interval: '15',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'fr',
          toolbar_bg: '#0A0A12',
          backgroundColor: '#0A0A12',
          gridColor: 'rgba(255, 215, 0, 0.06)',
          enable_publishing: false,
          hide_top_toolbar: false,
          allow_symbol_change: false,
          container_id: chartId,
          studies: ['RSI@tv-basicstudies', 'MASimple@tv-basicstudies'],
        });
      } else {
        setWidgetError(true);
      }
    };

    script.onerror = () => setWidgetError(true);
    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [isFullscreen]);

  // Trigger Support Touch sequence: Siri runs to support level, touches with finger, support blinks 3 times
  const triggerSupportTouch = (label = 'Support touché ! 👆') => {
    const now = Date.now();
    lastSupportTouchTimeRef.current = now;
    setOverrideUntil(now + 2800);
    setSiriFacing('right');
    setSiriX(22);
    setSiriY(76);
    setSiriMood('touch-support');
    setSiriSpeech(label);
    setSupportBlinkKey((k) => k + 1);
  };

  // React to every XAUUSD live tick
  useEffect(() => {
    if (!xauQuote) return;
    const current = xauQuote.price;
    const prev = prevPriceRef.current;

    setTickPulseKey((k) => k + 1);

    if (prev !== null && current !== prev) {
      const wentUp = current > prev;
      setPriceDirection(wentUp ? 'up' : 'down');

      const now = Date.now();
      if (now > overrideUntil) {
        if (wentUp) {
          setSiriMood('dance');
          setSiriSpeech('Prix monte ! 🕺✨');
          setOverrideUntil(now + 2200);
        } else {
          setSiriMood('point-support');
          setSiriSpeech('Baisse → Support 👇');
          setOverrideUntil(now + 2200);
        }
      }
    }

    // Check if live price touches real TradingView Support
    if (
      xauQuote.support &&
      current <= xauQuote.support + 1.2 &&
      Date.now() - lastSupportTouchTimeRef.current > 10000
    ) {
      triggerSupportTouch('Prix sur Support ! 👆');
    }

    prevPriceRef.current = current;
  }, [xauQuote?.price, xauQuote?.updatedAt]);

  // Continuous patrol walk on the TradingView widget + golden footprints that fade after 2s
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (now < overrideUntil) return;

      setSiriX((prevX) => {
        let nextDir = siriFacing;
        let step = nextDir === 'right' ? 2.8 : -2.8;
        let nextX = prevX + step;

        if (nextX >= 84) {
          nextX = 84;
          nextDir = 'left';
          setSiriFacing('left');
        } else if (nextX <= 8) {
          nextX = 8;
          nextDir = 'right';
          setSiriFacing('right');
        }

        // Leave golden footprint at current spot, auto-remove after 2 seconds
        const id = ++footprintIdRef.current;
        setFootprints((prev) => [
          ...prev.slice(-14),
          { id, xPercent: prevX, yPercent: 84, facing: nextDir },
        ]);
        setTimeout(() => {
          setFootprints((prev) => prev.filter((fp) => fp.id !== id));
        }, 2000);

        return nextX;
      });

      setSiriY(76);
      setSiriMood((prevMood) => {
        // Alternate cute behaviors while patrolling: walk, wave, point-chart, jump
        const tick = footprintIdRef.current % 16;
        if (tick === 5) {
          setSiriSpeech('Coucou trader ! 👋');
          return 'wave';
        }
        if (tick === 10) {
          setSiriSpeech('Regarde le graphe 📈');
          return 'point-chart';
        }
        if (tick === 14) {
          setSiriSpeech('Hopp ! ✨');
          return 'jump';
        }
        if (prevMood !== 'walk') {
          setSiriSpeech(null);
        }
        return 'walk';
      });
    }, 360);

    return () => clearInterval(interval);
  }, [overrideUntil, siriFacing]);

  const handleBuyClick = () => {
    const now = Date.now();
    setOverrideUntil(now + 2600);
    setSiriMood('jump');
    setSiriSpeech('BUY ! Bravo 🚀✨');
    setLastClickDirection('BUY');

    // Spawn falling golden confetti
    const batch = Array.from({ length: 34 }, (_, idx) => ({
      id: now + idx,
      leftPercent: Math.random() * 94 + 3,
      delayMs: Math.random() * 280,
      driftPx: Math.round((Math.random() - 0.5) * 90),
      color: idx % 3 === 0 ? '#FFD700' : idx % 3 === 1 ? '#FFAA00' : '#00FF88',
      sizePx: Math.round(6 + Math.random() * 6),
    }));
    setConfetti(batch);
    setTimeout(() => setConfetti([]), 2500);
  };

  const handleSellClick = () => {
    const now = Date.now();
    setOverrideUntil(now + 1500);
    setSiriMood('salto');
    setSiriSpeech('SELL Salto ! 🤸‍♂️');
    setLastClickDirection('SELL');
  };

  const isPriceUnavailable =
    widgetError || feedStatus === 'error' || (feedStatus === 'live' && !xauQuote);

  const realSupportText = xauQuote?.formattedSupport || xauQuote?.low?.toFixed(2) || null;
  const realResistanceText = xauQuote?.formattedResistance || xauQuote?.high?.toFixed(2) || null;

  return (
    <section
      aria-label="Scène Interactive XAUUSD Plein Écran & Siri le Robot"
      className={
        isFullscreen
          ? 'fixed inset-0 z-50 bg-[#0A0A12] flex flex-col overflow-hidden'
          : 'luxury-card rounded-2xl overflow-hidden flex flex-col'
      }
    >
      {/* Top Luxury XAUUSD Header Bar */}
      <div className="px-3 sm:px-5 py-3 bg-[#0A0A12]/95 border-b border-[#FFD700]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: XAUUSD Title & HUGE Gold Price with Tick Pulse */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFAA00] text-[#0A0A12] font-black flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.5)]">
              OR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-extrabold tracking-wide text-white">
                  XAUUSD • TRADINGVIEW DIRECT
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#A855F7]/20 text-[#E9D5FF] border border-[#A855F7]/50 font-bold">
                  DARK MODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Supports &amp; Résistances automatiques • Siri patrouille sur le graphique
              </p>
            </div>
          </div>

          {/* HUGE GOLD XAUUSD NUMBERS */}
          {xauQuote ? (
            <div
              key={tickPulseKey}
              className="animate-gold-tick flex items-baseline gap-2.5 px-3 py-1 rounded-xl bg-[#FFD700]/8 border border-[#FFD700]/35"
            >
              <span className="text-3xl sm:text-5xl font-mono font-black gold-gradient-text tracking-tight tabular-nums">
                {xauQuote.formattedPrice}
              </span>
              {xauQuote.changePercent !== null && (
                <span
                  className={`text-xs sm:text-sm font-mono font-extrabold flex items-center gap-0.5 ${
                    xauQuote.changePercent >= 0 ? 'text-[#00FF88]' : 'text-[#FF3B3B]'
                  }`}
                >
                  {xauQuote.changePercent >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {xauQuote.changePercent >= 0 ? '+' : ''}
                  {xauQuote.changePercent.toFixed(2)}%
                </span>
              )}
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  priceDirection === 'up'
                    ? 'bg-[#00FF88]/20 text-[#00FF88]'
                    : priceDirection === 'down'
                    ? 'bg-[#FF3B3B]/20 text-[#FF3B3B]'
                    : 'bg-[#FFD700]/20 text-[#FFD700]'
                }`}
              >
                {priceDirection === 'up'
                  ? '▲ TICK UP'
                  : priceDirection === 'down'
                  ? '▼ TICK DOWN'
                  : '● LIVE'}
              </span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl bg-[#FF3B3B]/15 border border-[#FF3B3B]/60 text-[#FF3B3B] font-black text-xs sm:text-sm">
              {feedStatus === 'loading'
                ? 'SYNCHRO XAUUSD...'
                : 'PRIX NON DISPONIBLE - Envoie une capture TradingView'}
            </div>
          )}
        </div>

        {/* Right: Vibrating BUY / SELL Buttons + Support Touch Test + Fullscreen */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleBuyClick}
            className="btn-buy-vibrant px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-black tracking-wider flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <TrendingUp className="w-4 h-4" />
            <span>BUY</span>
          </button>

          <button
            type="button"
            onClick={handleSellClick}
            className="btn-sell-vibrant px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-black tracking-wider flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <TrendingDown className="w-4 h-4" />
            <span>SELL</span>
          </button>

          {lastClickDirection && onTriggerQuickAnalysis && xauQuote && (
            <button
              type="button"
              onClick={() => onTriggerQuickAnalysis(lastClickDirection)}
              className="btn-glow-gold px-3 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#0A0A12] text-xs font-extrabold flex items-center gap-1 cursor-pointer min-h-[44px]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Analyser {lastClickDirection} IA</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => triggerSupportTouch('Siri touche le Support ! 👆')}
            className="btn-glow-cyan px-3 py-2 rounded-full bg-[#0A0A12] text-[#00FF88] border border-[#00FF88]/60 hover:bg-[#00FF88]/10 text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            title="Voir Siri courir toucher le Support et le faire clignoter 3 fois"
          >
            <Hand className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Test Support</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="btn-glow-purple px-3 py-2 rounded-full bg-[#0A0A12] text-[#FFD700] border border-[#FFD700]/50 hover:border-[#FFD700] text-xs font-bold flex items-center gap-1.5 cursor-pointer min-h-[44px]"
            title={isFullscreen ? 'Quitter plein écran' : 'Ouvrir en plein écran'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4" />
                <span>Réduire</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4" />
                <span>Plein Écran</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main TradingView XAUUSD Stage with Animated Overlays */}
      <div
        className={`relative w-full bg-[#0A0A12] overflow-hidden ${
          isFullscreen ? 'flex-1' : 'h-[430px] sm:h-[520px]'
        }`}
      >
        {/* 1. TradingView Dark Chart Embed (or Big Unavailable Banner) */}
        {isPriceUnavailable ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center gap-4 bg-[#0A0A12]">
            <AlertTriangle className="w-12 h-12 text-[#FF3B3B] animate-pulse" />
            <p className="text-lg sm:text-3xl font-black text-[#FF3B3B] tracking-wide">
              PRIX NON DISPONIBLE - Envoie une capture TradingView
            </p>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Le widget TradingView XAUUSD ne retourne pas le prix réel en ce moment. Aucun niveau ni signal n&apos;est inventé.
            </p>
            <button
              type="button"
              onClick={onJumpToCapture}
              className="btn-glow-gold px-5 py-2.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#0A0A12] font-extrabold text-xs flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Envoyer une capture TradingView</span>
            </button>
          </div>
        ) : (
          <div ref={chartContainerRef} className="w-full h-full relative z-0" />
        )}

        {/* 2. Falling Golden Particles Overlay (non-blocking) */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {FALLING_PARTICLES.map((p) => (
            <span
              key={p.id}
              className={`animate-gold-particle absolute -top-2 rounded-full bg-[#FFD700] shadow-[0_0_8px_#FFD700] ${p.size}`}
              style={{
                left: p.left,
                animationDuration: p.duration,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        {/* 3. Subtle Glowing Candles Overlay accents on Left/Right edges */}
        <div className="absolute inset-x-0 bottom-8 h-24 pointer-events-none z-10 opacity-45">
          {GLOWING_CANDLES.map((c, idx) => (
            <div
              key={idx}
              className="animate-candle-glow absolute bottom-0 flex flex-col items-center"
              style={{ left: `${c.x}%`, animationDelay: `${idx * 0.28}s` }}
            >
              <div
                className="w-[1.5px] h-3"
                style={{ backgroundColor: c.bull ? '#00FF88' : '#FF3B3B' }}
              />
              <div
                className="w-2 rounded-sm"
                style={{
                  height: `${c.h}px`,
                  background: c.bull
                    ? 'linear-gradient(180deg, #00FF88 0%, rgba(0,255,136,0.2) 100%)'
                    : 'linear-gradient(180deg, #FF3B3B 0%, rgba(255,59,59,0.2) 100%)',
                  boxShadow: c.bull
                    ? '0 0 10px rgba(0,255,136,0.5)'
                    : '0 0 10px rgba(255,59,59,0.5)',
                }}
              />
            </div>
          ))}
        </div>

        {/* 4. Automatic RESISTANCE Line (#FF3B3B) + Transparent Red Sell Zone + Gold Price Tag */}
        {realResistanceText && !isPriceUnavailable && (
          <div className="absolute inset-x-0 top-[14%] pointer-events-none z-20">
            {/* Transparent Red Sell Zone */}
            <div className="w-full h-11 bg-[#FF3B3B]/14 border-y border-[#FF3B3B]/35 backdrop-blur-[1px] flex items-center justify-between px-3 sm:px-5">
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#FF3B3B] uppercase drop-shadow-[0_0_8px_rgba(255,59,59,0.9)]">
                ZONE DE VENTE • RÉSISTANCE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#0A0A12] text-[10px] sm:text-xs font-mono font-black shadow-[0_0_14px_rgba(255,215,0,0.7)] tabular-nums">
                RÉS : {realResistanceText}
              </span>
            </div>
            {/* Thick Red Line #FF3B3B */}
            <div className="w-full h-[3px] bg-[#FF3B3B] shadow-[0_0_16px_#FF3B3B]" />
          </div>
        )}

        {/* 5. Automatic SUPPORT Line (#00FF88) + Transparent Green Buy Zone + Gold Price Tag (Blinks 3x when touched!) */}
        {realSupportText && !isPriceUnavailable && (
          <div
            key={supportBlinkKey}
            className={`absolute inset-x-0 bottom-[16%] pointer-events-none z-20 ${
              supportBlinkKey > 0 ? 'animate-support-blink-3' : ''
            }`}
          >
            {/* Thick Green Line #00FF88 */}
            <div className="w-full h-[3px] bg-[#00FF88] shadow-[0_0_16px_#00FF88]" />
            {/* Transparent Green Buy Zone */}
            <div className="w-full h-11 bg-[#00FF88]/14 border-y border-[#00FF88]/35 backdrop-blur-[1px] flex items-center justify-between px-3 sm:px-5">
              <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#00FF88] uppercase drop-shadow-[0_0_8px_rgba(0,255,136,0.9)]">
                ZONE D&apos;ACHAT • SUPPORT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#0A0A12] text-[10px] sm:text-xs font-mono font-black shadow-[0_0_14px_rgba(255,215,0,0.7)] tabular-nums">
                SUP : {realSupportText}
              </span>
            </div>
          </div>
        )}

        {/* 6. Siri's Golden Footprints (fade away after 2s) */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {footprints.map((fp) => (
            <div
              key={fp.id}
              className="animate-footprint-2s absolute flex items-center gap-0.5"
              style={{
                left: `${fp.xPercent}%`,
                top: `${fp.yPercent + 6}%`,
              }}
            >
              <span className="w-2 h-1.5 rounded-full bg-[#FFD700] block" />
              <span className="w-2 h-1.5 rounded-full bg-[#FFAA00] translate-y-1 block" />
            </div>
          ))}
        </div>

        {/* 7. Siri the Robot Literally Walking on the Widget! */}
        <div
          className="absolute pointer-events-none z-30 transition-all duration-300 ease-linear"
          style={{
            left: `${siriX}%`,
            top: `${siriY}%`,
            transform: 'translate(-50%, -60%)',
          }}
        >
          <SiriRobot
            mood={siriMood}
            facing={siriFacing}
            size="md"
            speechBubble={siriSpeech}
          />
        </div>

        {/* 8. Golden Confetti Burst when BUY is clicked */}
        {confetti.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
            {confetti.map((c) => (
              <span
                key={c.id}
                className="animate-confetti-fall absolute -top-3 rounded-sm"
                style={
                  {
                    left: `${c.leftPercent}%`,
                    width: `${c.sizePx}px`,
                    height: `${Math.round(c.sizePx * 1.4)}px`,
                    backgroundColor: c.color,
                    animationDelay: `${c.delayMs}ms`,
                    boxShadow: `0 0 8px ${c.color}`,
                    '--confetti-drift': `${c.driftPx}px`,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Legend Bar (Real Support / Resistance Gold Badges) */}
      <div className="px-3 sm:px-5 py-2.5 bg-[#0A0A12]/95 border-t border-[#FFD700]/25 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[#FFD700] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            Siri AI Live :
          </span>
          {realSupportText && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#00FF88]/15 border border-[#00FF88]/50 text-[#00FF88] font-mono font-bold">
              SUPPORT : {realSupportText}
            </span>
          )}
          {realResistanceText && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#FF3B3B]/15 border border-[#FF3B3B]/50 text-[#FF3B3B] font-mono font-bold">
              RÉSISTANCE : {realResistanceText}
            </span>
          )}
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          Niveaux calculés en direct depuis TradingView (OANDA:XAUUSD) • Zéro prix inventé
        </span>
      </div>
    </section>
  );
};
