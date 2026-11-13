import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertOctagon,
  Trophy,
  RotateCcw,
  Percent,
  Calculator,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { AssetInfo } from '../types';

interface RiskCalculatorProps {
  selectedAsset: AssetInfo;
}

export const RiskCalculator: React.FC<RiskCalculatorProps> = ({ selectedAsset }) => {
  const [capital, setCapital] = useState<number>(1000);
  const [slPoints, setSlPoints] = useState<number>(selectedAsset.isGold ? 200 : 50);
  const [consecutiveLosses, setConsecutiveLosses] = useState<number>(0);
  const [consecutiveWins, setConsecutiveWins] = useState<number>(0);
  const [isBeProtected, setIsBeProtected] = useState<boolean>(false);

  // Sacred 1% rule
  const maxRiskDollar = capital * 0.01;

  // Lot size estimation
  // For Gold: 1 lot = 100 oz. 1 point = $0.01 change per oz = $1 per 100 points per 1.0 lot.
  // Standard MT4/MT5: 0.01 lot = $0.10 per pip ($1 move = 100 pips = $10 per 1.0 lot).
  // So if SL is $2.00 (200 points):
  // Risk = LotSize * 100 * $2 = LotSize * 200
  // LotSize = maxRiskDollar / SL in dollars
  const slInDollars = selectedAsset.isGold ? slPoints / 100 : slPoints;
  const calculatedLot =
    slInDollars > 0
      ? (maxRiskDollar / (selectedAsset.isGold ? slPoints * 0.1 : slPoints * 1)).toFixed(2)
      : '0.01';

  const isStopLossCircuitBreaker = consecutiveLosses >= 2;
  const isStopWinCircuitBreaker = consecutiveWins >= 3;

  const handleWin = () => {
    setConsecutiveLosses(0);
    setConsecutiveWins((prev) => Math.min(prev + 1, 3));
  };

  const handleLoss = () => {
    setConsecutiveWins(0);
    setConsecutiveLosses((prev) => Math.min(prev + 1, 2));
  };

  const handleResetStreak = () => {
    setConsecutiveLosses(0);
    setConsecutiveWins(0);
  };

  return (
    <div className="luxury-card rounded-2xl p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#FFD700]/25 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#FFD700]/15 text-[#FFD700] border border-[#FFD700]/40">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Gestion du Risque Sacrée (1% Règle Absolue)
            </h3>
            <p className="text-[10px] text-slate-400">
              Protection maximale du capital • Pas de martingale • Règle des 2 pertes / 3 gains
            </p>
          </div>
        </div>
      </div>

      {/* Circuit Breaker Banners */}
      {isStopLossCircuitBreaker && (
        <div className="p-3 rounded-xl bg-rose-500/15 border-2 border-rose-500 text-rose-300 flex items-start gap-2.5 animate-pulse">
          <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-black text-rose-200 block text-sm">
              🛑 STOP JOURNÉE DÉCLENCHÉ (2 Pertes d'affilée) !
            </span>
            <p className="mt-1 text-[11px] text-rose-200/90">
              Règle Suprême v6 : Tu as pris 2 pertes consécutives. <strong>Éteins les écrans.</strong> Le marché est soit trop vicieux aujourd'hui, soit ton état d'esprit glisse vers le revenge trading. Reviens demain à froid.
            </p>
          </div>
        </div>
      )}

      {isStopWinCircuitBreaker && (
        <div className="p-3 rounded-xl bg-amber-500/15 border-2 border-amber-500 text-amber-300 flex items-start gap-2.5 animate-bounce">
          <Trophy className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-black text-amber-200 block text-sm">
              🏆 STOP JOURNÉE (3 Gains d'affilée) !
            </span>
            <p className="mt-1 text-[11px] text-amber-200/90">
              Journée exceptionnelle ! Tu as sécurisé 3 victoires consécutives. <strong>Ne sois pas gourmand.</strong> 90% des traders rendent leurs gains en forçant un 4ème trade en surconfiance. Ferme TradingView et savoure.
            </p>
          </div>
        </div>
      )}

      {/* Capital & 1% Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Capital du Compte ($)
          </label>
          <div className="flex items-center gap-1">
            <span className="text-xs font-mono text-slate-500">$</span>
            <input
              type="number"
              min="10"
              max="1000000"
              value={capital}
              onChange={(e) => setCapital(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full bg-transparent font-mono font-bold text-slate-100 text-sm outline-none"
            />
          </div>
          {/* Quick chips */}
          <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-slate-800/80">
            {[100, 500, 1000, 5000].map((v) => (
              <button
                key={v}
                onClick={() => setCapital(v)}
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  capital === v
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                ${v}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/30">
          <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center justify-between">
            <span>Risque Max Sacré (1%)</span>
            <Percent className="w-3 h-3 text-emerald-400" />
          </label>
          <div className="text-lg font-mono font-black text-emerald-400">
            ${maxRiskDollar.toFixed(2)}
          </div>
          <p className="text-[9px] text-slate-400 mt-1">
            Strictement 1$ pour 100$ • 10$ pour 1000$. Jamais plus !
          </p>
        </div>
      </div>

      {/* Lot Size Calculator */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
            <span>Calculateur de Taille de Position ({selectedAsset.id})</span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">
            {selectedAsset.isGold ? 'SL en pts (1.5$-3$ max)' : 'SL en points'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block mb-1">
              Distance au Stop Loss ({selectedAsset.isGold ? 'pts' : 'pts'})
            </span>
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min="5"
                max="5000"
                value={slPoints}
                onChange={(e) => setSlPoints(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full bg-transparent font-mono font-bold text-slate-200 outline-none"
              />
              <span className="text-[10px] text-slate-500 font-mono">
                {selectedAsset.isGold ? 'pts ($' + (slPoints / 100).toFixed(2) + ')' : 'pts'}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-1">
              Lot Recommandé (Risk 1%)
            </span>
            <div className="bg-cyan-950/40 border border-cyan-800/60 rounded-lg px-2.5 py-1.5 font-mono font-bold text-cyan-300 text-sm flex items-center justify-between">
              <span>{Math.max(0.01, parseFloat(calculatedLot))} Lot</span>
              <span className="text-[9px] text-slate-500">Auto-1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Streak & Discipline Circuit Breaker Controller */}
      <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Discipline Journalière
          </span>
          <button
            onClick={handleResetStreak}
            className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Réinitialiser
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Losses streak */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Pertes consécutives</span>
              <span className="font-mono font-bold text-rose-400">
                {consecutiveLosses}/2
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`flex-1 h-2 rounded-full ${
                  consecutiveLosses >= 1 ? 'bg-rose-500' : 'bg-slate-800'
                }`}
              />
              <div
                className={`flex-1 h-2 rounded-full ${
                  consecutiveLosses >= 2 ? 'bg-rose-500 animate-pulse' : 'bg-slate-800'
                }`}
              />
            </div>
            <button
              onClick={handleLoss}
              className="mt-1 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-bold border border-rose-500/30 transition"
            >
              +1 Perte
            </button>
          </div>

          {/* Wins streak */}
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Gains consécutifs</span>
              <span className="font-mono font-bold text-emerald-400">
                {consecutiveWins}/3
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div
                className={`flex-1 h-2 rounded-full ${
                  consecutiveWins >= 1 ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
              <div
                className={`flex-1 h-2 rounded-full ${
                  consecutiveWins >= 2 ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
              <div
                className={`flex-1 h-2 rounded-full ${
                  consecutiveWins >= 3 ? 'bg-amber-400 animate-pulse' : 'bg-slate-800'
                }`}
              />
            </div>
            <button
              onClick={handleWin}
              className="mt-1 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition"
            >
              +1 Gain
            </button>
          </div>
        </div>
      </div>

      {/* Break Even Sacred Rule Check */}
      <button
        onClick={() => setIsBeProtected(!isBeProtected)}
        className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between transition-all ${
          isBeProtected
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
            : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <CheckCircle className={`w-4 h-4 ${isBeProtected ? 'text-emerald-400' : 'text-slate-600'}`} />
          <span>Après TP1 : Déplace ton SL à Break Even (BE)</span>
        </div>
        <span className="text-[10px] font-mono font-bold text-amber-400">
          {isBeProtected ? 'RISK-FREE ACTIF' : 'À COCHER'}
        </span>
      </button>
    </div>
  );
};
