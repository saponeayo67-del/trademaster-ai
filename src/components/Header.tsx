import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Clock,
  Radio,
  BookOpen,
  VolumeX,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Mail,
  LogOut,
} from 'lucide-react';
import { LiveMarketQuote, TradingMode } from '../types';
import { CoachVoice } from '../utils/speech';
import { AnimatedRobotLogo } from './AnimatedRobotLogo';
import { SiriRobot } from './SiriRobot';

interface HeaderProps {
  currentMode: TradingMode;
  onModeChange: (mode: TradingMode) => void;
  isRedNewsUpcoming: boolean;
  onToggleRedNews: () => void;
  onOpenGuide: () => void;
  isGmailConnected: boolean;
  onOpenGmailPanel: () => void;
  userEmail?: string | null;
  onAppLogout?: () => void;
  xauQuote?: LiveMarketQuote | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onModeChange,
  isRedNewsUpcoming,
  onToggleRedNews,
  onOpenGuide,
  isGmailConnected,
  onOpenGmailPanel,
  userEmail,
  onAppLogout,
  xauQuote,
}) => {
  const [gmtTime, setGmtTime] = useState<string>('');
  const [gmtHour, setGmtHour] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [headerSiriFacing, setHeaderSiriFacing] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getUTCHours();
      const m = now.getUTCMinutes().toString().padStart(2, '0');
      const s = now.getUTCSeconds().toString().padStart(2, '0');
      setGmtTime(`${h.toString().padStart(2, '0')}:${m}:${s} GMT`);
      setGmtHour(h);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const listener = (speaking: boolean) => setIsSpeaking(speaking);
    CoachVoice.addListener(listener);
    return () => CoachVoice.removeListener(listener);
  }, []);

  // Flip Siri direction halfway through its 18s header patrol cycle
  useEffect(() => {
    const flipInterval = setInterval(() => {
      setHeaderSiriFacing((prev) => (prev === 'right' ? 'left' : 'right'));
    }, 9000);
    return () => clearInterval(flipInterval);
  }, []);

  const isLondonActive = gmtHour >= 8 && gmtHour < 11;
  const isNyActive = gmtHour >= 13 && gmtHour < 17;
  const isDeadZone = gmtHour >= 22 || gmtHour < 7;

  const isXauUp = (xauQuote?.changePercent ?? 0) >= 0;
  const marqueeText = xauQuote
    ? `🥇 XAUUSD (OR) LIVE : ${xauQuote.formattedPrice} (${
        xauQuote.changePercent !== null
          ? `${isXauUp ? '+' : ''}${xauQuote.changePercent.toFixed(2)}%`
          : 'DIRECT'
      })${xauQuote.formattedSupport ? `  •  🟢 SUPPORT : ${xauQuote.formattedSupport}` : ''}${
        xauQuote.formattedResistance ? `  •  🔴 RÉSISTANCE : ${xauQuote.formattedResistance}` : ''
      }  •  ⚡ TRADEMASTER AI ULTIMATE v5  •  🛡️ RISQUE MAX 1%`
    : '🥇 XAUUSD (OR) TRADINGVIEW LIVE  •  ⏳ SYNCHRONISATION DES PRIX EN COURS...  •  ⚡ TRADEMASTER AI ULTIMATE v5';

  return (
    <header className="bg-[#0A0A12]/90 border-b border-[#FFD700]/30 backdrop-blur-xl sticky top-0 z-40 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      {/* Top Patrol Track: Siri walks left-to-right across the top of the page + Scrolling XAUUSD Ticker */}
      <div className="relative h-10 sm:h-11 bg-gradient-to-r from-[#0A0A12] via-[#131124] to-[#0A0A12] border-b border-[#FFD700]/20 overflow-hidden flex items-center">
        {/* Scrolling XAUUSD Price Marquee */}
        <div className="animate-xau-marquee items-center gap-8 text-[11px] sm:text-xs font-mono font-extrabold whitespace-nowrap">
          <span className="gold-gradient-text flex items-center gap-2 px-4">
            {isXauUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#00FF88]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#FF3B3B]" />
            )}
            {marqueeText}
          </span>
          <span className="gold-gradient-text flex items-center gap-2 px-4">
            {isXauUp ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#00FF88]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#FF3B3B]" />
            )}
            {marqueeText}
          </span>
        </div>

        {/* Siri walking left-to-right across the top of the page */}
        <div className="animate-siri-header-patrol absolute top-0.5 pointer-events-none z-10">
          <SiriRobot
            mood={xauQuote ? (isXauUp ? 'dance' : 'walk') : 'wave'}
            facing={headerSiriFacing}
            size="xs"
          />
        </div>
      </div>

      {/* Main Header Controls */}
      <div className="max-w-7xl mx-auto px-3 py-2.5 sm:px-6 flex flex-col lg:flex-row items-center justify-between gap-2.5 sm:gap-3">
        {/* Brand & Identity with Animated Robot Logo */}
        <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <AnimatedRobotLogo size="sm" className="flex-shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="font-black tracking-wider text-sm sm:text-lg gold-gradient-text truncate">
                  TRADEMASTER AI
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#A855F7]/20 text-[#E9D5FF] border border-[#A855F7]/50">
                  ULTIMATE v5
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                Robot &amp; Coach d&apos;élite Indices • XAUUSD • Scalping M5/M15 &amp; Swing H1/H4/D1
              </p>
            </div>
          </div>

          {/* Quick Voice, Guide & Logout buttons on mobile */}
          <div className="flex items-center gap-1.5 lg:hidden flex-shrink-0">
            {isSpeaking && (
              <button
                onClick={() => CoachVoice.stop()}
                className="p-2 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 animate-pulse text-xs flex items-center gap-1"
                title="Arrêter la voix"
              >
                <VolumeX className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onOpenGuide}
              className="btn-glow-gold p-2 rounded-full bg-[#0A0A12] text-[#FFD700] border border-[#FFD700]/40 text-xs"
              title="Guide SMC & Règles v6"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            {onAppLogout && (
              <button
                onClick={onAppLogout}
                className="p-2 rounded-full bg-[#0A0A12] text-slate-300 hover:text-[#FF3B3B] border border-[#FFD700]/30 text-xs"
                title="Se déconnecter"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Center: Mode Selector Toggle */}
        <div className="w-full lg:w-auto flex items-center justify-center bg-[#0A0A12]/90 p-1 rounded-full border border-[#FFD700]/35 shadow-[0_0_16px_rgba(255,215,0,0.12)]">
          <button
            onClick={() => onModeChange('SCALPING')}
            className={`btn-glow-gold flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'SCALPING'
                ? 'bg-gradient-to-r from-[#FFD700] to-[#FFAA00] text-[#0A0A12] shadow-md shadow-[#FFD700]/30'
                : 'text-slate-400 hover:text-[#FFD700]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">SCALPING</span>
            <span className="hidden sm:inline">(M5/M15)</span>
          </button>

          <button
            onClick={() => onModeChange('SWING')}
            className={`btn-glow-cyan flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'SWING'
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#3B82F6] text-[#0A0A12] shadow-md shadow-[#00E5FF]/30'
                : 'text-slate-400 hover:text-[#00E5FF]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">SWING</span>
            <span className="hidden sm:inline">(H1/H4)</span>
          </button>

          <button
            onClick={() => onModeChange('LES_DEUX')}
            className={`btn-glow-purple flex-1 sm:flex-initial flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${
              currentMode === 'LES_DEUX'
                ? 'bg-gradient-to-r from-[#A855F7] to-[#EC4899] text-white shadow-md shadow-[#A855F7]/30'
                : 'text-slate-400 hover:text-[#A855F7]'
            }`}
          >
            <span className="truncate">⚡🌊 LES DEUX</span>
          </button>
        </div>

        {/* Right: Live Sessions, News Alert, Guide & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center lg:justify-end w-full lg:w-auto">
          {/* Live GMT Clock */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0A0A12] border border-[#FFD700]/30 text-[11px] sm:text-xs font-mono text-[#FFD700]">
            <Clock className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>{gmtTime || '00:00:00 GMT'}</span>
          </div>

          {/* Session Badges */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px]">
            <span
              className={`px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border ${
                isLondonActive
                  ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/50 animate-pulse'
                  : 'bg-[#0A0A12] text-slate-400 border-slate-800'
              }`}
              title="Londres : 08h-11h GMT (Session Recommandée)"
            >
              <Radio className="w-2.5 h-2.5" /> LON {isLondonActive ? 'ACTIF' : '08-11'}
            </span>

            <span
              className={`px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 border ${
                isNyActive
                  ? 'bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/50 animate-pulse'
                  : 'bg-[#0A0A12] text-slate-400 border-slate-800'
              }`}
              title="New York : 13h-17h GMT (Session Recommandée)"
            >
              <Radio className="w-2.5 h-2.5" /> NY {isNyActive ? 'ACTIF' : '13-17'}
            </span>

            {isDeadZone && (
              <span
                className="px-2 py-0.5 rounded-full font-mono font-bold bg-[#FF3B3B]/20 text-[#FF3B3B] border border-[#FF3B3B]/50 flex items-center gap-1"
                title="Règle v6 : Jamais de trade entre 22h et 07h GMT"
              >
                <AlertTriangle className="w-2.5 h-2.5" /> ZONE MORTE
              </span>
            )}
          </div>

          {/* Red News Alert Toggle */}
          <button
            onClick={onToggleRedNews}
            className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              isRedNewsUpcoming
                ? 'bg-[#FF3B3B] text-white border-[#FF3B3B] shadow-md shadow-[#FF3B3B]/40 animate-pulse'
                : 'bg-[#0A0A12] text-slate-300 border-[#FFD700]/25 hover:border-[#FF3B3B]/60'
            }`}
            title="Activer si une news rouge (NFP, CPI, FOMC, Powell) arrive dans l'heure"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isRedNewsUpcoming ? 'NEWS ROUGE' : 'News Rouge ?'}
            </span>
          </button>

          {/* Gmail Status Quick Button */}
          <button
            type="button"
            onClick={onOpenGmailPanel}
            className={`btn-glow-cyan px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              isGmailConnected
                ? 'bg-[#00FF88]/15 text-[#00FF88] border-[#00FF88]/50'
                : 'bg-[#A855F7]/15 text-[#E9D5FF] border-[#A855F7]/50'
            }`}
            title={isGmailConnected ? 'Notifications Gmail actives' : 'Connecter Gmail pour recevoir les notifications'}
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isGmailConnected ? 'Gmail Actif' : 'Connecter Gmail'}
            </span>
          </button>

          {/* Voice status, Guide & Account Logout (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            {isSpeaking && (
              <button
                onClick={() => CoachVoice.stop()}
                className="px-2.5 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/50 text-xs font-bold flex items-center gap-1 animate-pulse cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" /> Couper Coach
              </button>
            )}

            <button
              onClick={onOpenGuide}
              className="btn-glow-gold flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0A12] text-[#FFD700] border border-[#FFD700]/45 text-xs font-semibold transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guide v6</span>
            </button>

            {onAppLogout && (
              <button
                type="button"
                onClick={onAppLogout}
                title={userEmail ? `Déconnecter ${userEmail}` : 'Se déconnecter'}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A0A12] hover:bg-[#FF3B3B]/20 text-slate-300 hover:text-[#FF3B3B] border border-[#FFD700]/25 hover:border-[#FF3B3B]/50 text-xs font-semibold transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Déconnexion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
