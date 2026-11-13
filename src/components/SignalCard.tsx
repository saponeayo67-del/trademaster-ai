import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  Target,
  ArrowRight,
  Flame,
  Clock,
  Sparkles,
  Mail,
} from 'lucide-react';
import { TradeSignal } from '../types';

interface SignalCardProps {
  signal: TradeSignal;
  onSendGmail?: (signal: TradeSignal) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({ signal, onSendGmail }) => {
  const [copied, setCopied] = useState(false);

  const isBuy = signal.direction === 'BUY';
  const isSell = signal.direction === 'SELL';
  const isNoTrade = signal.direction === 'PAS DE TRADE';

  const handleCopy = () => {
    const textToCopy = signal.isGold
      ? `📊 PAIRE : ${signal.asset}
⚡ MODE : ${signal.mode}
📈 DIRECTION : ${signal.direction}
🎯 ENTRÉE : ${signal.entry}
🛑 STOP LOSS : ${signal.sl}
✅ TP1 : ${signal.tp1} (Sécurise 50% + SL à Break Even)
${signal.tp2 ? `✅ TP2 : ${signal.tp2} (Sécurise le reste)\n` : ''}⚖️ RISK/REWARD : ${signal.riskReward}
📊 CONFIANCE : ${signal.confidence}%
🧠 POURQUOI : ${signal.why}`
      : `📊 INDICE : ${signal.asset}
⚡ MODE : ${signal.mode}
📈 DIRECTION : ${signal.direction}
🎯 ENTRÉE : ${signal.entry}
🛑 STOP LOSS : ${signal.sl}
✅ TP1 : ${signal.tp1} (Sécurise 50% + SL à Break Even)
${signal.tp2 ? `✅ TP2 : ${signal.tp2} (Sécurise le reste)\n` : ''}${signal.tp3 ? `✅ TP3 : ${signal.tp3} (Laisser courir avec Trailing Stop)\n` : ''}⚖️ RISK/REWARD : ${signal.riskReward}
📊 CONFIANCE : ${signal.confidence}%
${signal.validUntil ? `⏰ VALABLE JUSQU'À : ${signal.validUntil}\n` : ''}🧠 POURQUOI CE TRADE : ${signal.why}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isPair =
    signal.isGold || /XAUUSD|EURUSD|GBPUSD|USDJPY|BTCUSD/i.test(signal.asset);

  return (
    <div
      className={`luxury-card rounded-2xl p-4 sm:p-5 my-3 transition-all ${
        isNoTrade
          ? 'border-[#FFD700]/60'
          : isBuy
          ? 'border-[#00FF88]/60 shadow-[0_0_24px_rgba(0,255,136,0.14)]'
          : 'border-[#FF3B3B]/60 shadow-[0_0_24px_rgba(255,59,59,0.14)]'
      }`}
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${
              isNoTrade
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/20'
                : isBuy
                ? 'bg-emerald-500 shadow-emerald-500/20'
                : 'bg-rose-500 shadow-rose-500/20'
            }`}
          >
            {isNoTrade ? (
              <AlertTriangle className="w-5 h-5 text-slate-950" />
            ) : isBuy ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">
                {isPair ? '📊 PAIRE :' : '📊 INDICE :'}
              </span>
              <span className="text-sm font-bold text-slate-100">{signal.asset}</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                ⚡ {signal.mode}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-sm sm:text-base font-black tracking-wide ${
                  isNoTrade
                    ? 'text-amber-400'
                    : isBuy
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}
              >
                📈 DIRECTION : {signal.direction}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence Gauge */}
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-slate-400 block">CONFIANCE</span>
            <span
              className={`text-base font-mono font-black ${
                signal.confidence >= 80 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {signal.confidence}%
            </span>
          </div>

          {onSendGmail && (
            <button
              type="button"
              onClick={() => onSendGmail(signal)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-semibold transition"
              title="Envoyer ce signal par notification Gmail"
            >
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline">Gmail</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      </div>

      {isNoTrade ? (
        /* PAS DE TRADE Explanation Card */
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col gap-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4" />
            <span>DISCIPLINE v6 : Pas de trade forcé. Minimum 3 confluences requises !</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans">{signal.why}</p>
          <div className="text-[11px] text-amber-400/90 font-mono bg-amber-950/40 p-2 rounded-lg border border-amber-800/30">
            💡 "Attendre la bonne configuration est aussi un trade gagnant." - TRADEMASTER AI
          </div>
        </div>
      ) : (
        /* ACTIVE SIGNAL NUMERICAL VALUES */
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Entry */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] font-mono font-bold text-slate-400 block mb-0.5">
                🎯 ENTRÉE
              </span>
              <span className="text-sm sm:text-base font-mono font-black text-slate-100">
                {signal.entry}
              </span>
            </div>

            {/* Stop Loss */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-rose-500/30">
              <span className="text-[10px] font-mono font-bold text-rose-400 block mb-0.5 flex items-center justify-between">
                <span>🛑 STOP LOSS</span>
                {signal.isGold && <span className="text-[9px]">1.5$-3$ max</span>}
              </span>
              <span className="text-sm sm:text-base font-mono font-black text-rose-400">
                {signal.sl}
              </span>
            </div>

            {/* TP1 */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-0.5">
                ✅ TP1 (50% + BE)
              </span>
              <span className="text-sm sm:text-base font-mono font-black text-emerald-400">
                {signal.tp1}
              </span>
            </div>

            {/* TP2 */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30">
              <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-0.5">
                ✅ TP2 (Sécurise reste)
              </span>
              <span className="text-sm sm:text-base font-mono font-black text-emerald-300">
                {signal.tp2 || '1:4'}
              </span>
            </div>

            {/* Optional TP3 in Swing */}
            {signal.tp3 && (
              <div className="bg-slate-950 p-2.5 rounded-xl border border-cyan-500/30 col-span-2 sm:col-span-4 flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-cyan-400">
                  ✅ TP3 (Swing Trailing Stop) :
                </span>
                <span className="text-sm font-mono font-black text-cyan-300">
                  {signal.tp3} (Laisser courir)
                </span>
              </div>
            )}
          </div>

          {/* Risk Reward & Validity bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400">⚖️ RISK/REWARD :</span>
              <span className="font-mono font-bold text-emerald-400">{signal.riskReward}</span>
            </div>

            {signal.validUntil && (
              <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px]">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>VALABLE JUSQU'À : {signal.validUntil}</span>
              </div>
            )}
          </div>

          {/* Sacred Break Even instruction */}
          <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              <strong>Règle d'or :</strong> Dès que le prix atteint TP1, sécurise 50% de tes lots et déplace instantanément ton Stop Loss au prix d'entrée (Break Even).
            </span>
          </div>

          {/* Reasoning */}
          {signal.why && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-slate-200 block mb-1">
                🧠 {signal.isGold ? 'POURQUOI (OR) :' : 'POURQUOI CE TRADE :'}
              </span>
              <p className="leading-relaxed whitespace-pre-line">{signal.why}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
