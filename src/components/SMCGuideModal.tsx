import React, { useState } from 'react';
import {
  X,
  BookOpen,
  ShieldCheck,
  Zap,
  TrendingUp,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Lock,
  Activity,
  BarChart2,
  Clock,
  Layers,
} from 'lucide-react';

interface SMCGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SMCGuideModal: React.FC<SMCGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'RULES' | 'CAPTURE' | 'INDICATORS' | 'GOLD' | 'RISK'>('RULES');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A0A12]/85 backdrop-blur-md animate-fadeIn">
      <div className="luxury-card rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0A0A12]/95 border-b border-[#FFD700]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>MANUEL OFFICIEL TRADEMASTER AI - ULTIMATE v5 & v6</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                  OFFICIEL
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Guide Indices & XAUUSD • Scalping M5/M15 • Swing H1/H4/D1 • 6 Analyses & Confluences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center bg-slate-950 px-4 pt-2 border-b border-slate-800 gap-1 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('RULES')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'RULES'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📜 Modes & Règles Suprêmes
          </button>
          <button
            onClick={() => setActiveTab('CAPTURE')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'CAPTURE'
                ? 'border-indigo-400 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📸 Protocole Capture 5-Points
          </button>
          <button
            onClick={() => setActiveTab('INDICATORS')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'INDICATORS'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📊 6 Analyses & Indicateurs
          </button>
          <button
            onClick={() => setActiveTab('GOLD')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'GOLD'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            🥇 Protocole XAUUSD (OR)
          </button>
          <button
            onClick={() => setActiveTab('RISK')}
            className={`px-3 py-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'RISK'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚖️ Gestion du Risque Sacrée (1%)
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {activeTab === 'RULES' && (
            <div className="space-y-3">
              {/* Scalping vs Swing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-amber-300 text-sm">=== MODE 1 : SCALPING M5 / M15 ===</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    <li>🎯 <strong>Objectif :</strong> Gains rapides, 1 à 3 trades par session.</li>
                    <li>⏱️ <strong>Timeframes :</strong> H1 pour la tendance, M15 pour la structure, M5 pour l'entrée chirurgicale.</li>
                    <li>⚡ <strong>Stratégie :</strong> Liquidity Sweep + BOS + Retest sur Order Block / FVG.</li>
                    <li>🔒 <strong>Entrée UNIQUEMENT après :</strong> Cassure + Retest + Bougie de confirmation.</li>
                    <li>✅ <strong>TP :</strong> 30 à 100 points sur US30, 20 à 60 points sur GER40 / NAS100, 3$ à 8$ sur XAUUSD.</li>
                    <li>🛑 <strong>SL :</strong> Serré, derrière la dernière mèche. Risk/Reward minimum 1:2.</li>
                    <li>🚫 <strong>Interdit de trader :</strong> Pendant les news rouges, les 15 premières minutes de Londres et New York.</li>
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-cyan-300 text-sm">=== MODE 2 : SWING H1 / H4 / D1 ===</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-300">
                    <li>🎯 <strong>Objectif :</strong> Gros mouvements, 1 à 2 trades par semaine.</li>
                    <li>⏱️ <strong>Timeframes :</strong> D1 pour la tendance, H4 pour la zone, H1 pour l'entrée.</li>
                    <li>🌊 <strong>Stratégie :</strong> Tendance + Pullback sur zone de Demande/Offre + Divergence RSI / MACD.</li>
                    <li>✅ <strong>TP :</strong> TP1 = 1:2 (sécurise 50%), TP2 = 1:4 (sécurise le reste), TP3 = Laisser courir avec Trailing Stop.</li>
                    <li>🛑 <strong>SL :</strong> Large, derrière la structure H4. Jamais plus de 1% de risque.</li>
                  </ul>
                </div>
              </div>

              {/* Regard du marché */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <h4 className="font-bold text-emerald-300 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Règle d'or : Minimum 3 Confluences
                </h4>
                <p>
                  PAS DE SIGNAL si tu n'as pas minimum 3 CONFLUENCES. Si pas de trade, dis "PAS DE TRADE" et explique pourquoi.
                </p>
                <p className="text-slate-400">
                  Le robot regarde TOUJOURS le marché : il n'invente jamais de cours. Envoie ta capture TradingView 15m ou le prix exact.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'CAPTURE' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 space-y-2">
                <h4 className="font-bold text-indigo-300 text-sm">
                  === POUR LES CAPTURES D'ÉCRAN (PROTOCOLE v5) ===
                </h4>
                <p className="text-slate-300">
                  Quand tu envoies une capture d'écran, TRADEMASTER AI décompose automatiquement son analyse en 5 étapes obligatoires :
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">1. Tendance et preuves</span>
                  <p className="text-slate-400">
                    Direction H4 + H1 avec preuves concrètes : Higher Highs / Higher Lows (HH/HL) ou Lower Highs / Lower Lows (LH/LL), et positionnement par rapport au VWAP et aux EMA 50 / 200.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-amber-300 block mb-1">2. Les 3 zones les plus importantes à tracer</span>
                  <p className="text-slate-400">
                    Identification chirurgicale des 3 zones : Support/Résistance, Order Block (OB), Fair Value Gap (FVG), Supply/Demand, et liquidité (BSL/SSL).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-300 block mb-1">3. Setup ou attente exacte</span>
                  <p className="text-slate-400">
                    Y a-t-il un setup actif ? Si oui : Entrée / SL / TP. Si non : Qu'est-ce qu'on attend exactement avant de cliquer ?
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-rose-300 block mb-1">4. Correction de mes erreurs</span>
                  <p className="text-slate-400">
                    Qu'est-ce que j'ai mal vu ? Piège débutant, achat FOMO sur un sommet, faux breakout (Judas Swing) ou Stop Loss trop serré sur un chiffre rond.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-indigo-300 block mb-1">5. 1 leçon à retenir + 1 exercice à faire demain</span>
                  <p className="text-slate-400">
                    Principe de trading professionnel fondamental à ancrer + mission concrète sur le graphique le lendemain.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'INDICATORS' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm">
                  === ANALYSE OBLIGATOIRE POUR TOUS LES MODES ===
                </h4>
                <p className="text-slate-300">
                  Avant chaque signal, TRADEMASTER AI passe au crible les 6 piliers incontournables :
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200 block mb-1">1. Tendance</span>
                  <p className="text-slate-400">H4 + H1 : Recherche des structures HH/HL (haussière) ou LH/LL (baissière).</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200 block mb-1">2. Structure</span>
                  <p className="text-slate-400">BOS (Break of Structure) ou CHoCH (Change of Character) ? Range ou Tendance ?</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200 block mb-1">3. Zones Institutionnelles</span>
                  <p className="text-slate-400">Support / Résistance, Order Block, FVG, Supply / Demand, Liquidité.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200 block mb-1">4. Indicateurs Techniques</span>
                  <p className="text-slate-400">EMA 50 / 200, RSI 14, MACD, VWAP, ATR, Volume.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-slate-200 block mb-1">5. Sessions de Marché</span>
                  <p className="text-slate-400">Londres 08h-11h GMT, New York 13h-17h GMT. <strong>Ne trade jamais entre 22h et 07h GMT.</strong></p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-rose-300 block mb-1">6. News Économiques</span>
                  <p className="text-slate-400">Si news rouge dans l'heure (NFP, CPI, FOMC, Powell) = <strong>PAS DE TRADE</strong>.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'GOLD' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <h4 className="font-bold text-amber-300 text-sm">=== RÈGLES SPÉCIALES POUR XAUUSD (OR) ===</h4>
                <p>
                  L&apos;OR est plus violent que les indices. Stop Loss strictement calibré entre{' '}
                  <strong>150 et 300 points (1.5$ à 3.0$)</strong> et TP minimum <strong>1:2</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-cyan-300 block mb-1">Timeframes &amp; Stratégie Préférée</span>
                  <p className="text-slate-400">
                    <strong>H1</strong> tendance, <strong>M15</strong> structure, <strong>M5</strong> entrée.{' '}
                    <span className="text-rose-300 font-semibold">Jamais M1 tout seul.</span>
                    <br />
                    Stratégie : <strong>BOS + Retest sur Order Block + FVG sur M15</strong>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-emerald-300 block mb-1">Sessions Actives Obligatoires</span>
                  <p className="text-slate-400">
                    <strong>Londres 08h-11h GMT</strong> et <strong>New York 13h-17h GMT</strong>. C&apos;est là que l&apos;OR bouge vraiment.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-amber-300 block mb-1">Liquidity Sweep (Piège de l&apos;OR)</span>
                  <p className="text-slate-400">
                    Si tu vois un gros pic qui prend la liquidité puis ça repart dans l&apos;autre sens = c&apos;est un{' '}
                    <strong>Liquidity Sweep</strong>, c&apos;est le vrai signal !
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="font-bold text-rose-300 block mb-1">Interdiction Événements Majeurs</span>
                  <p className="text-slate-400">
                    INTERDIT de trader XAUUSD pendant : <strong>NFP, CPI, FOMC, Discours de Powell</strong>. Tu dois dire{' '}
                    <strong>PAS DE TRADE</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                <span className="font-bold text-slate-100 block mb-1">Autres paires maîtrisées :</span>
                <p className="text-slate-400">
                  En plus de tous les indices et de <strong>XAUUSD (OR)</strong>, TRADEMASTER AI maîtrise{' '}
                  <span className="font-mono text-cyan-300">EURUSD, GBPUSD, USDJPY, BTCUSD</span>.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'RISK' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <h4 className="font-bold text-emerald-300 text-sm">Gestion du Risque Sacrée (1%)</h4>
                <p>
                  1% max par trade. Capital 100$ = 1$ de risque. Capital 1000$ = 10$ de risque.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span><strong>2 pertes d'affilée = STOP journée :</strong> On éteint les écrans pour protéger son capital.</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span><strong>3 gains d'affilée = STOP journée :</strong> On sécurise les profits, on ne redonne rien au marché.</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span><strong>Après TP1, SL à Break Even :</strong> Zéro risque dès que le premier objectif est validé.</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span><strong>Jamais de Martingale :</strong> Jamais de revanche, jamais de trade sans Stop Loss.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition"
          >
            Fermer le Manuel
          </button>
        </div>
      </div>
    </div>
  );
};
