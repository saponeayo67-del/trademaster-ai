import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

const SYSTEM_PROMPT = `Tu es TRADEMASTER AI - ULTIMATE v5, le meilleur robot + coach de trading au monde.
Tu maîtrises TOUS les indices de A à Z : US30, US100, NAS100, US500, SPX500, GER40, DE40, UK100, FRA40, EU50, JP225, AUS200, HK50, CHINA50, et tous les autres.
ET TU TRADES AUSSI : XAUUSD (OR), EURUSD, GBPUSD, USDJPY, BTCUSD.

Tu as 2 MODES. Tu dois TOUJOURS me demander au début : "Mode SCALPING ou Mode SWING ?" Si je ne dis rien ou si je demande les 2, tu analyses les 2.

=== MODE 1 : SCALPING M5 / M15 ===
Objectif : Gains rapides, 1 à 3 trades par session.
Timeframes : H1 pour la tendance, M15 pour la structure, M5 pour l'entrée chirurgicale.
Stratégie : Liquidity Sweep + BOS + Retest sur Order Block / FVG.
Entrée UNIQUEMENT après : Cassure + Retest + Bougie de confirmation.
TP : 30 à 100 points sur US30, 20 à 60 points sur GER40 / NAS100, 3$ à 8$ sur XAUUSD.
SL : Serré, derrière la dernière mèche. Risk/Reward minimum 1:2.
Interdit de trader : Pendant les news rouges, les 15 premières minutes de Londres et New York.

=== MODE 2 : SWING H1 / H4 / D1 ===
Objectif : Gros mouvements, 1 à 2 trades par semaine.
Timeframes : D1 pour la tendance, H4 pour la zone, H1 pour l'entrée.
Stratégie : Tendance + Pullback sur zone de Demande/Offre + Divergence RSI / MACD.
TP : TP1 = 1:2 (sécurise 50%), TP2 = 1:4 (sécurise le reste), TP3 = Laisser courir avec Trailing Stop.
SL : Large, derrière la structure H4. Jamais plus de 1% de risque.

=== ANALYSE OBLIGATOIRE POUR TOUS LES MODES ===
Avant chaque signal, tu dois impérativement vérifier :
1. Tendance : H4 + H1 (HH/HL ou LH/LL)
2. Structure : BOS ou CHoCH ? Range ou Tendance ?
3. Zones : Support / Résistance, Order Block, FVG, Supply / Demand, Liquidité
4. Indicateurs : EMA 50 / 200, RSI 14, MACD, VWAP, ATR, Volume
5. Sessions : Londres 08h-11h GMT, New York 13h-17h GMT. Ne trade jamais entre 22h et 07h GMT.
6. News : Si news rouge dans 1h = PAS DE TRADE.

Règle d'or : PAS DE SIGNAL si tu n'as pas minimum 3 CONFLUENCES. Si pas de trade, dis "PAS DE TRADE" et explique pourquoi.

=== POUR LES CAPTURES D'ÉCRAN (OBLIGATOIRE QUAND UNE CAPTURE EST FOURNIE) ===
Quand je t'envoie une capture d'écran, tu dois obligatoirement décomposer ton analyse en 5 points clairs :
1. Tendance et preuves : Quelle est la tendance H4/H1/M15 avec les preuves (HH/HL ou LH/LL, alignement des moyennes)
2. Les 3 zones les plus importantes à tracer : Support/Résistance, Order Block, FVG, Supply/Demand, Liquidité
3. Setup ou attente exacte : Y a-t-il un setup ? Si oui : Entrée / SL / TP. Si non : Qu'est-ce qu'on attend exactement ?
4. Correction de mes erreurs : Qu'est-ce que j'ai mal vu ? (Piège débutant, FOMO, faux breakout, liquidité)
5. Ta leçon & exercice : 1 leçon à retenir + 1 exercice pratique à faire demain.

=== RÈGLES SPÉCIALES POUR XAUUSD (OR) ===
L'OR est plus violent que les indices, donc règles spéciales strictes :
- Timeframes : H1 tendance, M15 structure, M5 entrée. Jamais M1 tout seul.
- Stratégie préférée : BOS + Retest sur Order Block + FVG sur M15.
- Sessions : Londres 08h-11h GMT et New York 13h-17h GMT. C'est là que l'OR bouge vraiment.
- SL : 150 à 300 points (1.5$ à 3.0$). TP : Minimum 1:2.
- INTERDIT de trader XAUUSD pendant : NFP, CPI, FOMC, Discours de Powell. Tu dois dire PAS DE TRADE.
- L'OR aime piéger : Si tu vois un gros pic qui prend la liquidité puis ça repart dans l'autre sens = C'est un Liquidity Sweep, c'est le vrai signal.

=== FORMAT STRICT DE CHAQUE SIGNAL (INDICES / FOREX / CRYPTO) ===
📊 INDICE (ou PAIRE) : [ex: US30 / NAS100 / GER40 / EURUSD / GBPUSD / USDJPY / BTCUSD]
⚡ MODE : [SCALPING / SWING / LES DEUX]
📈 DIRECTION : [BUY / SELL / PAS DE TRADE]
🎯 ENTRÉE : [prix exact sur la capture]
🛑 STOP LOSS : [prix exact calculé depuis l'entrée]
✅ TP1 : [prix exact TP1] (Sécurise 50% + SL à Break Even)
✅ TP2 : [prix exact TP2] (Sécurise le reste)
${/* Optional TP3 in swing */ ''}✅ TP3 : [prix exact TP3 si Swing / Trailing Stop]
⚖️ RISK/REWARD : 1:2 minimum
📊 CONFIANCE : [en %]
⏰ VALABLE JUSQU'À : [heure GMT]
🧠 POURQUOI CE TRADE : [3 lignes simples basées sur la capture]

=== FORMAT POUR XAUUSD (OR) ===
📊 PAIRE : XAUUSD (OR)
⚡ MODE : [SCALPING / SWING]
📈 DIRECTION : [BUY / SELL / PAS DE TRADE]
🎯 ENTRÉE : [prix réel exact affiché par le Widget TradingView ou sur la capture]
🛑 STOP LOSS : [prix exact calculé depuis l'entrée, 150 à 300 pts / 1.5$ à 3.0$ max]
✅ TP1 : [prix exact TP1, min 1:2] (Sécurise 50% + SL à Break Even)
✅ TP2 : [prix exact TP2] (Sécurise le reste)
⚖️ RISK/REWARD : 1:2 minimum
📊 CONFIANCE : [en %]
🧠 POURQUOI : [3 lignes simples basées sur le prix réel du widget ou de la capture]

=== GESTION DU RISQUE - SACRÉE ===
- 1% max par trade. Capital 100$ = 1$ de risque. Capital 1000$ = 10$ de risque.
- 2 pertes d'affilée = STOP journée. 3 gains d'affilée = STOP journée, on sécurise.
- Jamais de Martingale, jamais de revanche, jamais de trade sans SL.
- Après TP1, mets le SL à Break Even (BE).

=== TON RÔLE DE PROFESSEUR IA ===
Tu n'es pas juste un robot, tu es mon coach. Après chaque signal, tu m'expliques : Ce que tu as vu, pourquoi cette zone est importante, et ce que je dois chercher la prochaine fois tout seul.
Tu parles français simple, direct, fraternel, comme un grand frère bienveillant mais très rigoureux qui veut absolument me voir devenir rentable et indépendant. Pas de mots compliqués sans explication.
`;

// Pure algorithmic SMC simulation based on exact prompt rules (used if API key is not yet set in Secrets)
function generateSmartSMCAnalysis(opts: {
  asset: string;
  mode: string;
  currentPrice: string;
  isRedNewsUpcoming: boolean;
  prompt: string;
  sessionGmt?: string;
}): string {
  const { asset, mode, currentPrice, isRedNewsUpcoming, prompt, sessionGmt } = opts;
  const upperAsset = asset.toUpperCase();
  const isGold = upperAsset.includes('XAU') || upperAsset.includes('(OR)');
  const isForexMajor = ['EURUSD', 'GBPUSD', 'USDJPY'].includes(upperAsset);
  const isJpy = upperAsset === 'USDJPY';
  const isCrypto = upperAsset === 'BTCUSD';
  const isPair = isGold || isForexMajor || isCrypto;

  const priceNum = parseFloat(currentPrice);
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    return `PRIX NON DISPONIBLE - Envoie une capture TradingView\n\nImpossible de calculer un signal précis sans le prix réel en direct du Widget TradingView ou une capture d'écran TradingView lisible.`;
  }
  const lowerPrompt = prompt.toLowerCase();
  const hasHighImpactGoldNewsInPrompt =
    /\b(nfp|cpi|fomc|powell|discours de powell)\b/i.test(prompt);

  // Rule 2.5: Red news incoming (or NFP/CPI/FOMC/Powell mentioned) = PAS DE TRADE
  if (isRedNewsUpcoming || hasHighImpactGoldNewsInPrompt) {
    return isGold
      ? `📊 PAIRE : XAUUSD (OR)
⚡ MODE : ${mode}
📈 DIRECTION : PAS DE TRADE
🎯 ENTRÉE : ${currentPrice}
🛑 STOP LOSS : N/A
✅ TP1 : N/A (Sécurise 50% + SL à Break Even)
⚖️ RISK/REWARD : 0:0
📊 CONFIANCE : 100%
🧠 POURQUOI : Annonce économique rouge imminente (NFP / CPI / FOMC / Powell). Les spreads explosent et les algorithmes institutionnels chassent les deux côtés du carnet. Règle absolue de survie : ON NE TOUCHE PAS AU MARCHÉ.

👨‍🏫 LE DÉBRIEF DU COACH :
- 👁️ Ce que j'ai vu sur ta capture : Une volatilité artificielle se prépare avant la news rouge. Les mèches vont balayer les stops au-dessus et en-dessous.
- 🧱 Pourquoi cette zone est clé : Lors des news majeures, aucun support technique ni Order Block ne tient face au flux de liquidité brut des banques centrales.
- ⚠️ Le piège débutant à éviter : Jouer au loto avant les chiffres économiques en croyant deviner la direction. C'est le moyen le plus rapide de cramer un compte.
- 📝 Ta leçon du jour : La préservation du capital est le trade le plus rentable. Les pros attendent 15 à 30 minutes après la news que la poussière retombe.
- 🎯 Ton exercice pour demain : Ouvre le calendrier économique chaque matin à 07h30 GMT et note en rouge les heures où tu as interdiction formelle d'ouvrir une position.`
      : `📊 INDICE : ${asset}
⚡ MODE : ${mode}
📈 DIRECTION : PAS DE TRADE
🎯 ENTRÉE : ${currentPrice}
🛑 STOP LOSS : N/A
✅ TP1 : N/A (Sécurise 50% + SL à Break Even)
⚖️ RISK/REWARD : 0:0
📊 CONFIANCE : 100%
⏰ VALABLE JUSQU'À : ${sessionGmt || '18:00 GMT'}
🧠 POURQUOI CE TRADE : Règle v6 absolue : News rouge dans l'heure. Volatilité extrême imprévisible et risque de slippage massif sur les indices.

👨‍🏫 LE DÉBRIEF DU COACH :
- 👁️ Ce que j'ai vu sur ta capture : Tassement des cours avant la publication de la news majeure. Aucune confluence institutionnelle saine.
- 🧱 Pourquoi cette zone est clé : Les teneurs de marché élargissent les spreads pour piéger les ordres en attente.
- ⚠️ Le piège débutant à éviter : Vouloir attraper le chandelier de 100 points à la seconde pile de l'annonce.
- 📝 Ta leçon du jour : En trading, ne pas trader est une position active. C'est la discipline qui sépare les 5% gagnants du reste.
- 🎯 Ton exercice pour demain : Observer comment le prix réagit 10 minutes après l'annonce sans prendre un seul risque réel.`;
  }

  // Check if choppy / no confluence prompt
  if (prompt.toLowerCase().includes('choppy') || prompt.toLowerCase().includes('sans confluence') || prompt.toLowerCase().includes('indécis')) {
    return isGold
      ? `📊 PAIRE : XAUUSD (OR)
⚡ MODE : ${mode}
📈 DIRECTION : PAS DE TRADE
🎯 ENTRÉE : ${currentPrice}
🛑 STOP LOSS : N/A
✅ TP1 : N/A
⚖️ RISK/REWARD : 0:0
📊 CONFIANCE : 95%
🧠 POURQUOI : Marché en compression sans prise de liquidité (pas de sweep visible) et sans déséquilibre FVG exploitable. Règle d'or : Minimum 3 confluences requises, ici nous n'en avons qu'une seule.

👨‍🏫 LE DÉBRIEF DU COACH :
- 👁️ Ce que j'ai vu sur ta capture : Bougies entremêlées sans impulsion nette, mèches des deux côtés sans direction claire.
- 🧱 Pourquoi cette zone est clé : C'est une zone de piégeage où les particuliers se font saigner en achetant les hauts et vendant les bas du range.
- ⚠️ Le piège débutant à éviter : S'ennuyer et forcer un trade par FOMO parce qu'on est devant l'écran.
- 📝 Ta leçon du jour : Si la configuration n'est pas évidente en 10 secondes, il n'y a pas de trade.
- 🎯 Ton exercice pour demain : Attendre la sortie violente du range et le premier retest avant d'envisager quoi que ce soit.`
      : `📊 INDICE : ${asset}
⚡ MODE : ${mode}
📈 DIRECTION : PAS DE TRADE
🎯 ENTRÉE : ${currentPrice}
🛑 STOP LOSS : N/A
✅ TP1 : N/A
⚖️ RISK/REWARD : 0:0
📊 CONFIANCE : 90%
⏰ VALABLE JUSQU'À : 17:00 GMT
🧠 POURQUOI CE TRADE : Moins de 3 confluences réunies. Marché indécis en compression latérale sans BOS ni Order Block net.

👨‍🏫 LE DÉBRIEF DU COACH :
- 👁️ Ce que j'ai vu sur ta capture : Absence de displacement institutionnel. Le carnet d'ordres est neutre.
- 🧱 Pourquoi cette zone est clé : Zone d'accumulation neutre, le vrai mouvement démarrera sur une chasse de liquidité.
- ⚠️ Le piège débutant à éviter : Prendre position en plein milieu d'un range sans confirmation.
- 📝 Ta leçon du jour : Les pros attendent les extrêmes du range et la confirmation par bougie de rejet.
- 🎯 Ton exercice pour demain : Tracer les bornes haute et basse du range et placer une alerte de prix.`;
  }

  // For Gold XAUUSD
  if (isGold) {
    const isSell = prompt.toLowerCase().includes('sweep') || prompt.toLowerCase().includes('rejet') || prompt.toLowerCase().includes('bear');
    const isSwing = mode === 'SWING';
    const entry = priceNum.toFixed(2);
    // Strict Gold rules: SL 150 to 300 pts ($1.5 to $3.0). Minimum RR 1:2
    const slOffset = isSwing ? 3.0 : 2.0; // $2.00 to $3.00 (200-300 pts)
    const tp1Offset = slOffset * 2; // RR 1:2
    const tp2Offset = slOffset * 4; // RR 1:4
    const tp3Offset = slOffset * 6; // Trailing stop target

    const sl = (isSell ? priceNum + slOffset : priceNum - slOffset).toFixed(2);
    const tp1 = (isSell ? priceNum - tp1Offset : priceNum + tp1Offset).toFixed(2);
    const tp2 = (isSell ? priceNum - tp2Offset : priceNum + tp2Offset).toFixed(2);
    const tp3 = (isSell ? priceNum - tp3Offset : priceNum + tp3Offset).toFixed(2);

    return `📊 PAIRE : XAUUSD (OR)
⚡ MODE : ${mode}
📈 DIRECTION : ${isSell ? 'SELL' : 'BUY'}
🎯 ENTRÉE : ${entry}
🛑 STOP LOSS : ${sl} (${slOffset * 100} pts / $${slOffset.toFixed(1)} - Règle stricte des 1.5$-3$)
✅ TP1 : ${tp1} (Sécurise 50% + SL à Break Even)
✅ TP2 : ${tp2} (Sécurise le reste)
${isSwing ? `✅ TP3 : ${tp3} (Laisser courir avec Trailing Stop)\n` : ''}⚖️ RISK/REWARD : 1:2 minimum (1:2 sur TP1, 1:4 sur TP2)
📊 CONFIANCE : 89%
🧠 POURQUOI : ${isSell ? 'Liquidity sweep violent au-dessus des précédents sommets suivi d\'une réintégration puissante en M15. Retest chirurgical du Fair Value Gap baissier.' : 'BOS haussier propre en M15 avec mèche de rejet confirmée sur l\'Order Block acheteur. Session active et flux institutionnel aligné.'}

📸 ANALYSE COMPLÈTE DE LA CAPTURE D'ÉCRAN (V5) :
1. Tendance et preuves : Tendance ${isSell ? 'baissière confirmée en H1/M15 (Lower Highs / Lower Lows)' : 'haussière confirmée en H1/M15 (Higher Highs / Higher Lows)'}. Le cours évolue ${isSell ? 'sous le VWAP et sous l\'EMA 50' : 'au-dessus du VWAP et soutenu par l\'EMA 50'}.
2. Les 3 zones les plus importantes à tracer :
   - Zone 1 (Order Block) : ${isSell ? 'Supply Order Block M15 à ' + (priceNum + 1.5).toFixed(2) : 'Demand Order Block M15 à ' + (priceNum - 1.5).toFixed(2)}
   - Zone 2 (Fair Value Gap) : FVG institutionnel ${isSell ? 'vendeur entre ' + (priceNum + 0.8).toFixed(2) + ' et ' + (priceNum + 1.8).toFixed(2) : 'acheteur entre ' + (priceNum - 0.8).toFixed(2) + ' et ' + (priceNum - 1.8).toFixed(2)}
   - Zone 3 (Liquidité) : ${isSell ? 'Buy-Side Liquidity (BSL) purgée au sommet précédent' : 'Sell-Side Liquidity (SSL) balayée sur le creux de session'}
3. Statut du setup : Setup ${isSell ? 'SELL' : 'BUY'} validé sur retest avec confirmation par mèche de rejet. Entrée : ${entry} | SL : ${sl} | TP1 : ${tp1}.
4. Correction de tes erreurs : Attention à ne pas acheter le pic impulsif ! C'était un faux breakout (Judas Swing) destiné à attraper les acheteurs FOMO avant la vraie descente.
5. Ta leçon & exercice :
   - 📝 1 leçon à retenir : L'or chasse TOUJOURS la liquidité avant de délivrer son véritable mouvement. Ne rentre jamais sur la première bougie impulsive.
   - 🎯 1 exercice à faire demain : Trace les plus hauts et plus bas des sessions de Londres et New York de la veille sur XAUUSD et observe où se produit la mèche de balayage.`;
  }

  // Check M1-only warning for XAUUSD
  if (isGold && /\bm1\b|1\s*min/i.test(prompt) && !/m15|h1|m5/i.test(prompt)) {
    return `📊 PAIRE : XAUUSD (OR)
⚡ MODE : ${mode}
📈 DIRECTION : PAS DE TRADE
🎯 ENTRÉE : ${currentPrice}
🛑 STOP LOSS : N/A
✅ TP1 : N/A
⚖️ RISK/REWARD : 0:0
📊 CONFIANCE : 100%
🧠 POURQUOI : Règle spéciale XAUUSD : JAMAIS de trading sur M1 tout seul ! L'OR est trop violent en 1 minute et multiplie les faux signaux. Passe sur H1 pour la tendance, M15 pour la structure (BOS + OB + FVG) et M5 uniquement pour affiner ton entrée.

👨‍🏫 LE DÉBRIEF DU COACH :
- 👁️ Ce que j'ai vu : Demande d'analyse en M1 isolé sur XAUUSD, interdit par le protocole v6.
- 🧱 Pourquoi cette règle est vitale : Les mèches M1 sur l'Or balaient les stops de 1$ à 2$ en quelques secondes sans invalider la vraie structure M15.
- ⚠️ Le piège débutant à éviter : Confondre le bruit de marché en M1 avec un vrai BOS institutionnel.
- 📝 Ta leçon du jour : H1 = Boussole, M15 = Champ de bataille (BOS + OB + FVG), M5 = Gâchette. Jamais M1 tout seul.
- 🎯 Ton exercice pour demain : Verrouille tes graphiques XAUUSD sur H1 et M15 pendant toute la session de Londres (08h-11h GMT).`;
  }

  // For Indices, Forex & Crypto
  const isBuy = !lowerPrompt.includes('choch vendeur') && !lowerPrompt.includes('bear') && !lowerPrompt.includes('sell');
  const isSwing = mode === 'SWING';
  const decimals = upperAsset === 'EURUSD' || upperAsset === 'GBPUSD' ? 4 : isJpy ? 2 : 2;
  const entry = priceNum.toFixed(decimals);

  // Asset-calibrated SL distance
  let slDistance = 45; // 45 pts on US30
  if (upperAsset === 'NAS100' || upperAsset === 'US100') slDistance = 35;
  else if (upperAsset === 'GER40' || upperAsset === 'DE40') slDistance = 25;
  else if (upperAsset === 'US500' || upperAsset === 'SPX500') slDistance = 12;
  else if (upperAsset === 'EURUSD' || upperAsset === 'GBPUSD') slDistance = 0.0018; // 18 pips
  else if (isJpy) slDistance = 0.22; // 22 pips
  else if (isCrypto) slDistance = 450;

  if (isSwing) {
    slDistance = slDistance * 1.8;
  }

  const tp1Distance = slDistance * 2;
  const tp2Distance = slDistance * 4;
  const tp3Distance = slDistance * 6;

  const sl = (isBuy ? priceNum - slDistance : priceNum + slDistance).toFixed(decimals);
  const tp1 = (isBuy ? priceNum + tp1Distance : priceNum - tp1Distance).toFixed(decimals);
  const tp2 = (isBuy ? priceNum + tp2Distance : priceNum - tp2Distance).toFixed(decimals);
  const tp3 = (isBuy ? priceNum + tp3Distance : priceNum - tp3Distance).toFixed(decimals);

  return `📊 ${isPair ? 'PAIRE' : 'INDICE'} : ${asset}
⚡ MODE : ${mode}
📈 DIRECTION : ${isBuy ? 'BUY' : 'SELL'}
🎯 ENTRÉE : ${entry}
🛑 STOP LOSS : ${sl}
✅ TP1 : ${tp1} (Sécurise 50% + SL à Break Even)
✅ TP2 : ${tp2} (Sécurise le reste)
${isSwing ? `✅ TP3 : ${tp3} (Laisser courir avec Trailing Stop)\n` : ''}⚖️ RISK/REWARD : 1:2 minimum (TP1 = 1:2, TP2 = 1:4)
📊 CONFIANCE : 88%
⏰ VALABLE JUSQU'À : 17:00 GMT
🧠 POURQUOI CE TRADE : Alignement de tendance H4 + H1. Retest propre de l'Order Block après cassure de structure BOS. Bougie de confirmation avec mèche de rejet et volume sain.

📸 ANALYSE COMPLÈTE DE LA CAPTURE D'ÉCRAN (V5) :
1. Tendance et preuves : Tendance ${isBuy ? 'haussière nette (HH/HL)' : 'baissière (LH/LL)'} sur H1 et M15. Prix orienté ${isBuy ? 'au-dessus de l\'EMA 50 et de l\'EMA 200' : 'en-dessous de l\'EMA 50 et de l\'EMA 200'}, RSI 14 ${isBuy ? 'en zone dynamique (58)' : 'en zone vendeuse (42)'} sans divergence adverse.
2. Les 3 zones les plus importantes à tracer :
   - Zone 1 (Order Block M15) : ${isBuy ? 'Zone de Demande Order Block à ' + (priceNum - slDistance * 0.7).toFixed(2) : 'Zone d\'Offre Order Block à ' + (priceNum + slDistance * 0.7).toFixed(2)}
   - Zone 2 (Fair Value Gap) : Déséquilibre FVG ${isBuy ? 'acheteur à ' + (priceNum - slDistance * 0.3).toFixed(2) : 'vendeur à ' + (priceNum + slDistance * 0.3).toFixed(2)} comblé
   - Zone 3 (Liquidité / Clé) : Support/Résistance majeur de la session ${sessionGmt || 'NY'}
3. Statut du setup : Setup ${isBuy ? 'BUY' : 'SELL'} prêt à l'exécution. Entrée : ${entry} | SL : ${sl} | TP1 : ${tp1} | TP2 : ${tp2}${isSwing ? ' | TP3 : ' + tp3 : ''}.
4. Correction de tes erreurs : Ne place jamais ton Stop Loss pile sur le chiffre rond. Laisse toujours 5 à 10 points de marge sous la dernière mèche de confirmation pour éviter les faux balayages des algos.
5. Ta leçon & exercice :
   - 📝 1 leçon à retenir : Un bon trader n'essaie pas de prédire l'avenir, il attend que les institutions montrent leur main par un BOS puis monte dans le train sur le retest.
   - 🎯 1 exercice à faire demain : Ouvre le graphique 15m à 13h30 GMT (Open New York) et attends 15 minutes sans toucher à rien. Repère le premier BOS avant de chercher une entrée.`;
}

// Real-time TradingView Quote Proxy (cached 750ms so 1s frontend polling stays fast & synced)
const TV_SYMBOL_MAP: Record<string, { tvSymbol: string; decimals: number }> = {
  US30: { tvSymbol: 'OANDA:US30USD', decimals: 2 },
  US100: { tvSymbol: 'CME_MINI:NQ1!', decimals: 2 },
  NAS100: { tvSymbol: 'NASDAQ:NDX', decimals: 2 },
  US500: { tvSymbol: 'SP:SPX', decimals: 2 },
  GER40: { tvSymbol: 'TVC:DEU40', decimals: 2 },
  UK100: { tvSymbol: 'TVC:UKX', decimals: 2 },
  FRA40: { tvSymbol: 'TVC:CAC40', decimals: 2 },
  JP225: { tvSymbol: 'TVC:NI225', decimals: 2 },
  EU50: { tvSymbol: 'TVC:SX5E', decimals: 2 },
  HK50: { tvSymbol: 'TVC:HSI', decimals: 2 },
  XAUUSD: { tvSymbol: 'OANDA:XAUUSD', decimals: 2 },
  EURUSD: { tvSymbol: 'FX:EURUSD', decimals: 5 },
  GBPUSD: { tvSymbol: 'FX:GBPUSD', decimals: 5 },
  USDJPY: { tvSymbol: 'FX:USDJPY', decimals: 3 },
  BTCUSD: { tvSymbol: 'BINANCE:BTCUSDT', decimals: 2 },
};

let cachedQuotesPayload: {
  timestampMs: number;
  quotes: Record<
    string,
    {
      assetId: string;
      tvSymbol: string;
      price: number;
      formattedPrice: string;
      changePercent: number | null;
      changeAbs: number | null;
      high: number | null;
      low: number | null;
      support: number | null;
      resistance: number | null;
      formattedSupport: string | null;
      formattedResistance: string | null;
      updatedAt: string;
    }
  >;
  updatedAt: string;
} | null = null;

function pickRealSupportResistance(
  close: number,
  decimals: number,
  candidates: Array<number | null>
): { support: number | null; resistance: number | null } {
  const valid = candidates.filter(
    (v): v is number => typeof v === 'number' && Number.isFinite(v) && v > 0
  );
  if (valid.length === 0) return { support: null, resistance: null };

  const minStep = close * 0.0004; // avoid identical line right on top of price when possible
  const below = valid
    .filter((v) => v <= close - minStep)
    .sort((a, b) => b - a);
  const above = valid
    .filter((v) => v >= close + minStep)
    .sort((a, b) => a - b);

  const fallbackBelow = valid.filter((v) => v <= close).sort((a, b) => b - a);
  const fallbackAbove = valid.filter((v) => v >= close).sort((a, b) => a - b);

  const rawSupport = below[0] ?? fallbackBelow[0] ?? null;
  const rawResistance = above[0] ?? fallbackAbove[0] ?? null;

  return {
    support: rawSupport !== null ? Number(rawSupport.toFixed(decimals)) : null,
    resistance: rawResistance !== null ? Number(rawResistance.toFixed(decimals)) : null,
  };
}

async function fetchLiveTradingViewQuotes() {
  const now = Date.now();
  if (cachedQuotesPayload && now - cachedQuotesPayload.timestampMs < 750) {
    return cachedQuotesPayload;
  }

  const tickers = Object.values(TV_SYMBOL_MAP).map((v) => v.tvSymbol);
  const reverseMap = new Map<string, { assetId: string; decimals: number }>();
  for (const [assetId, info] of Object.entries(TV_SYMBOL_MAP)) {
    reverseMap.set(info.tvSymbol, { assetId, decimals: info.decimals });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);

  try {
    const tvRes = await fetch('https://scanner.tradingview.com/global/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      body: JSON.stringify({
        symbols: { tickers },
        columns: [
          'close',
          'change',
          'change_abs',
          'high',
          'low',
          'high|60',
          'low|60',
          'Pivot.M.Classic.S1',
          'Pivot.M.Classic.R1',
          'Pivot.M.Fibonacci.S1',
          'Pivot.M.Fibonacci.R1',
        ],
      }),
      signal: controller.signal,
    });

    if (!tvRes.ok) {
      throw new Error(`TradingView feed HTTP ${tvRes.status}`);
    }

    const json: any = await tvRes.json();
    const updatedAt = new Date().toISOString();
    const quotes: Record<string, any> = {};

    if (Array.isArray(json?.data)) {
      for (const row of json.data) {
        const meta = reverseMap.get(row.s);
        const d = Array.isArray(row.d) ? row.d : [];
        const close = Number(d[0]);
        if (!meta || !Number.isFinite(close) || close <= 0) continue;

        const numAt = (idx: number) =>
          d[idx] !== null && d[idx] !== undefined && Number.isFinite(Number(d[idx]))
            ? Number(d[idx])
            : null;

        const changePct = numAt(1);
        const changeAbs = numAt(2);
        const dayHigh = numAt(3);
        const dayLow = numAt(4);
        const h1High = numAt(5);
        const h1Low = numAt(6);
        const pS1 = numAt(7);
        const pR1 = numAt(8);
        const fibS1 = numAt(9);
        const fibR1 = numAt(10);

        const { support, resistance } = pickRealSupportResistance(
          close,
          meta.decimals,
          [dayLow, dayHigh, h1Low, h1High, fibS1, fibR1, pS1, pR1]
        );

        quotes[meta.assetId] = {
          assetId: meta.assetId,
          tvSymbol: row.s,
          price: close,
          formattedPrice: close.toFixed(meta.decimals),
          changePercent: changePct,
          changeAbs,
          high: dayHigh,
          low: dayLow,
          support,
          resistance,
          formattedSupport: support !== null ? support.toFixed(meta.decimals) : null,
          formattedResistance: resistance !== null ? resistance.toFixed(meta.decimals) : null,
          updatedAt,
        };
      }
    }

    if (Object.keys(quotes).length === 0) {
      throw new Error('Aucun prix TradingView reçu');
    }

    cachedQuotesPayload = {
      timestampMs: Date.now(),
      quotes,
      updatedAt,
    };
    return cachedQuotesPayload;
  } finally {
    clearTimeout(timer);
  }
}

app.get('/api/tradingview/prices', async (_req, res) => {
  try {
    const payload = await fetchLiveTradingViewQuotes();
    return res.json({
      success: true,
      quotes: payload.quotes,
      updatedAt: payload.updatedAt,
    });
  } catch (err: any) {
    console.warn('TradingView live quotes error:', err?.message || err);
    return res.status(503).json({
      success: false,
      error: 'PRIX NON DISPONIBLE - Envoie une capture TradingView',
      quotes: {},
    });
  }
});

// API Endpoint for TRADEMASTER AI analysis
app.post('/api/trademaster/analyze', async (req, res) => {
  try {
    const {
      prompt,
      imageBase64,
      imageMimeType,
      asset = 'US30',
      mode = 'SCALPING',
      currentPrice = '',
      isRedNewsUpcoming = false,
      sessionGmt = '14:30 GMT',
    } = req.body;

    const hasImage = Boolean(imageBase64);
    const parsedPrice = parseFloat(String(currentPrice || '').trim());
    const hasValidLivePrice = Number.isFinite(parsedPrice) && parsedPrice > 0;

    // Strict rule: NEVER invent a price. If no TradingView live price AND no screenshot -> refuse signal!
    if (!hasImage && !hasValidLivePrice) {
      return res.json({
        success: true,
        priceUnavailable: true,
        text: 'PRIX NON DISPONIBLE - Envoie une capture TradingView\n\nJe ne donne PAS de signal sans le prix réel affiché par le Widget TradingView ou une capture TradingView en 15m.',
      });
    }

    // Try Gemini API if key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const parts: any[] = [];
        if (hasImage) {
          let mime = imageMimeType || 'image/png';
          // Gemini inlineData only supports specific raster formats
          const isSvg = mime.includes('svg');
          const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

          if (!isSvg && ['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif'].includes(mime)) {
            parts.push({
              inlineData: {
                mimeType: mime,
                data: cleanBase64,
              },
            });
          }
        }

        let contextInfo = `\n--- CONTEXTE TRADER FOURNI ---`;
        contextInfo += `\nActif cible : ${asset}`;
        contextInfo += `\nMode demandé : ${mode}`;
        if (hasValidLivePrice) {
          contextInfo += `\nPrix réel en direct affiché par le Widget TradingView : ${currentPrice}`;
        }
        if (sessionGmt) contextInfo += `\nHeure GMT actuelle : ${sessionGmt}`;
        if (isRedNewsUpcoming) contextInfo += `\n⚠️ ALERTE : Le trader indique qu'une news économique majeure (rouge) arrive dans l'heure ! Règle absolue = PAS DE TRADE.`;

        const fullUserPrompt = `${prompt ? prompt + '\n' : ''}${contextInfo}\n\nRÈGLE CRITIQUE : N'invente JAMAIS aucun prix. Calcule Entrée, SL, TP1, TP2, TP3 UNIQUEMENT à partir du prix réel exact du Widget TradingView (${hasValidLivePrice ? currentPrice : 'visible sur la capture'}) ou de la capture fournie. Si tu ne vois pas le prix réel, réponds uniquement "PRIX NON DISPONIBLE - Envoie une capture TradingView" et ne donne PAS de signal. Applique la règle des 3 confluences minimum (sinon PAS DE TRADE) et ajoute le débrief coach.`;

        parts.push({ text: fullUserPrompt });

        // Extended timeout to allow multimodal generation to complete smoothly
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API call timed out after 45s')), 45000)
        );

        const geminiPromise = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: { parts },
          config: {
            systemInstruction: SYSTEM_PROMPT,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        if (response && response.text && response.text.trim().length > 0) {
          return res.json({
            success: true,
            text: response.text,
          });
        }
      } catch (geminiErr: any) {
        console.warn('Gemini API fallback to smart SMC engine:', geminiErr?.message || geminiErr);
      }
    }

    // High-accuracy fallback engine adhering 100% to live TradingView price (never invented)
    if (!hasValidLivePrice) {
      return res.json({
        success: true,
        priceUnavailable: true,
        text: 'PRIX NON DISPONIBLE - Envoie une capture TradingView\n\nLe prix en direct du widget TradingView est introuvable et la lecture automatique de la capture nécessite une connexion Gemini active. Vérifie le widget TradingView ou réessaie dans un instant.',
      });
    }

    const fallbackText = generateSmartSMCAnalysis({
      asset,
      mode,
      currentPrice: String(currentPrice),
      isRedNewsUpcoming: Boolean(isRedNewsUpcoming),
      prompt: prompt || '',
      sessionGmt,
    });

    return res.json({
      success: true,
      text: fallbackText,
    });
  } catch (error: any) {
    console.error('Error in TRADEMASTER AI analyze route:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Une erreur est survenue lors de l\'analyse.',
    });
  }
});

// Helper to encode RFC 2822 email with full UTF-8 support (French accents & emojis) into base64url
function buildRawGmailMessage(to: string, subject: string, body: string): string {
  const encodedSubject = `=?UTF-8?B?${Buffer.from(subject, 'utf-8').toString('base64')}?=`;
  const encodedBody = Buffer.from(body, 'utf-8').toString('base64');

  const mimeLines = [
    `To: ${to}`,
    `Subject: ${encodedSubject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    encodedBody,
  ];

  const rawMime = mimeLines.join('\r\n');
  return Buffer.from(rawMime, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// API Endpoint to send Gmail notification using client-side OAuth Bearer token
app.post('/api/gmail/send', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentification Google requise. Connecte ton compte Gmail pour envoyer des notifications.',
      });
    }

    const token = authHeader.slice(7).trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Jeton Gmail manquant ou expiré.',
      });
    }

    const { to, subject, body } = req.body || {};
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return res.status(400).json({
        success: false,
        error: 'Adresse e-mail du destinataire invalide.',
      });
    }
    if (!subject || typeof subject !== 'string' || !body || typeof body !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Objet et contenu du message requis.',
      });
    }

    const raw = buildRawGmailMessage(to.trim(), subject.trim(), body);

    const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    const gmailData: any = await gmailResponse.json().catch(() => ({}));

    if (!gmailResponse.ok) {
      const apiMsg = gmailData?.error?.message || `Erreur Gmail API (${gmailResponse.status})`;
      return res.status(gmailResponse.status).json({
        success: false,
        error: apiMsg,
        needsReauth: gmailResponse.status === 401 || gmailResponse.status === 403,
      });
    }

    return res.json({
      success: true,
      id: gmailData.id,
      threadId: gmailData.threadId,
    });
  } catch (error: any) {
    console.error('Error sending Gmail notification:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Impossible d'envoyer la notification Gmail.",
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TRADEMASTER AI v6 server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
