import { TradeSignal, CoachDebrief, TradingMode } from '../types';

export function parseSignalFromText(text: string): TradeSignal | null {
  if (!text) return null;

  const isGold = /XAUUSD|\(OR\)|PAIRE\s*:\s*(?:XAUUSD|OR)\b/i.test(text);

  // Direction check
  let direction: 'BUY' | 'SELL' | 'PAS DE TRADE' = 'PAS DE TRADE';
  if (/DIRECTION\s*:\s*BUY\b/i.test(text)) {
    direction = 'BUY';
  } else if (/DIRECTION\s*:\s*SELL\b/i.test(text)) {
    direction = 'SELL';
  } else if (/DIRECTION\s*:\s*PAS DE TRADE\b/i.test(text) || /PAS DE TRADE/i.test(text)) {
    direction = 'PAS DE TRADE';
  }

  // Asset name
  let asset = isGold ? 'XAUUSD (OR)' : 'INDICE';
  const assetMatch = text.match(/(?:PAIRE|INDICE)\s*:\s*([^\n\r]+)/i);
  if (assetMatch) {
    asset = assetMatch[1].trim();
  }

  // Mode
  let mode: TradingMode = 'SCALPING';
  const modeMatch = text.match(/MODE\s*:\s*([^\n\r]+)/i);
  if (modeMatch) {
    const m = modeMatch[1].toUpperCase();
    if (m.includes('SWING')) mode = 'SWING';
    else if (m.includes('DEUX') || m.includes('LES DEUX')) mode = 'LES_DEUX';
  }

  // Entry, SL, TP1, TP2, TP3
  const entryMatch = text.match(/ENTR[ÉE]E\s*:\s*([^\n\r]+)/i);
  const slMatch = text.match(/STOP\s*LOSS\s*:\s*([^\n\r]+)/i);
  const tp1Match = text.match(/TP1\s*:\s*([^\n\r]+)/i);
  const tp2Match = text.match(/TP2\s*:\s*([^\n\r]+)/i);
  const tp3Match = text.match(/TP3\s*:\s*([^\n\r]+)/i);
  const rrMatch = text.match(/RISK\/REWARD\s*:\s*([^\n\r]+)/i);
  const confMatch = text.match(/CONFIANCE\s*:\s*(\d+)\s*%/i);
  const validMatch = text.match(/VALABLE JUSQU'[ÀA]\s*:\s*([^\n\r]+)/i);
  const whyMatch = text.match(/POURQUOI(?:\s*CE\s*TRADE)?\s*:\s*([\s\S]*?)(?:===|👨‍🏫|LE DÉBRIEF|1\.\s*Tendance|$)/i);

  // If there's no structured signal detected, return null
  if (!entryMatch && !direction && !slMatch) {
    return null;
  }

  return {
    asset,
    mode,
    direction,
    entry: entryMatch ? entryMatch[1].trim() : 'N/A',
    sl: slMatch ? slMatch[1].trim() : 'N/A',
    tp1: tp1Match ? tp1Match[1].trim() : 'N/A',
    tp2: tp2Match ? tp2Match[1].trim() : undefined,
    tp3: tp3Match ? tp3Match[1].trim() : undefined,
    riskReward: rrMatch ? rrMatch[1].trim() : '1:2 minimum',
    confidence: confMatch ? parseInt(confMatch[1], 10) : (direction === 'PAS DE TRADE' ? 100 : 85),
    validUntil: validMatch ? validMatch[1].trim() : undefined,
    why: whyMatch ? whyMatch[1].trim().slice(0, 350) : '',
    isGold,
  };
}

export function parseCoachDebrief(text: string): CoachDebrief | null {
  if (!text) return null;

  // v5 5-Step Capture Analysis matching
  const trendMatch = text.match(/(?:1\.\s*(?:Tendance et preuves|Tendance)|📈\s*Tendance)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  const zonesMatch = text.match(/(?:2\.\s*(?:Les 3 zones les plus importantes|3 zones à tracer|Zones clés)|🎯\s*Zones clés)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  const setupMatch = text.match(/(?:3\.\s*(?:Setup|Y a-t-il un setup|Statut du setup)|⚡\s*Setup)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  const errorMatch = text.match(/(?:4\.\s*(?:Corriger mes erreurs|Ce que j'ai mal vu|Erreurs à corriger)|⚠️\s*Erreur)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);

  // General Coach Debrief matching
  const visualMatch = text.match(/(?:👁️|Ce que j'ai vu sur ta capture|Ce que j'ai vu)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  const zoneMatch = text.match(/(?:🧱|Pourquoi cette zone est clé|Pourquoi cette zone est importante)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  const trapMatch = text.match(/(?:⚠️|Le piège débutant à éviter|Ce que je dois chercher)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  const lessonMatch = text.match(/(?:📝|Ta leçon du jour|1 leçon à retenir)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  const exerciseMatch = text.match(/(?:🎯|Ton exercice pour demain|1 exercice à faire demain)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);
  const indMatch = text.match(/(?:Indicateurs|EMA 50|RSI 14|MACD|VWAP)\s*:\s*([^\n\r]+(?:\n[^\n\r]+)?)/i);

  if (!visualMatch && !lessonMatch && !exerciseMatch && !trendMatch && !zonesMatch) {
    return null;
  }

  return {
    trendAndProofs: trendMatch ? trendMatch[1].trim() : undefined,
    top3Zones: zonesMatch ? zonesMatch[1].trim() : undefined,
    setupStatus: setupMatch ? setupMatch[1].trim() : undefined,
    errorCorrection: errorMatch ? errorMatch[1].trim() : undefined,
    visualObservations: visualMatch ? visualMatch[1].trim() : (trendMatch ? trendMatch[1].trim() : ''),
    zoneImportance: zoneMatch ? zoneMatch[1].trim() : (zonesMatch ? zonesMatch[1].trim() : ''),
    beginnerTrap: trapMatch ? trapMatch[1].trim() : (errorMatch ? errorMatch[1].trim() : ''),
    lesson: lessonMatch ? lessonMatch[1].trim() : 'Attendre patiemment la 3ème confluence avant toute prise de risque.',
    exercise: exerciseMatch ? exerciseMatch[1].trim() : 'Identifier les Order Blocks M15 de la session et observer la réaction sans forcer.',
    indicatorsNote: indMatch ? indMatch[1].trim() : undefined,
  };
}
