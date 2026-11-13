export type TradingMode = 'SCALPING' | 'SWING' | 'LES_DEUX';

export type AssetCategory = 'INDICES' | 'METALS_FOREX' | 'CRYPTO';

export interface AssetInfo {
  id: string;
  name: string;
  symbol: string;
  tvSymbol: string;
  decimals: number;
  category: AssetCategory;
  description: string;
  pointValue: string;
  isGold?: boolean;
}

export interface LiveMarketQuote {
  assetId: string;
  tvSymbol: string;
  price: number;
  formattedPrice: string;
  changePercent: number | null;
  changeAbs: number | null;
  high?: number | null;
  low?: number | null;
  support?: number | null;
  resistance?: number | null;
  formattedSupport?: string | null;
  formattedResistance?: string | null;
  updatedAt: string;
}

export interface TradeSignal {
  asset: string;
  mode: TradingMode;
  direction: 'BUY' | 'SELL' | 'PAS DE TRADE';
  entry: string;
  sl: string;
  tp1: string;
  tp2?: string;
  tp3?: string;
  riskReward: string;
  confidence: number;
  validUntil?: string;
  why: string;
  isGold?: boolean;
}

export interface CoachDebrief {
  trendAndProofs?: string; // 1. Tendance et preuves (HH/HL ou LH/LL)
  top3Zones?: string; // 2. Les 3 zones les plus importantes à tracer
  setupStatus?: string; // 3. Y a-t-il un setup ? Si oui Entry/SL/TP, sinon qu'est-ce qu'on attend
  errorCorrection?: string; // 4. Corriger mes erreurs : ce que j'ai mal vu
  lesson: string; // 5. 1 leçon à retenir
  exercise: string; // 5. 1 exercice à faire demain
  visualObservations?: string;
  zoneImportance?: string;
  beginnerTrap?: string;
  indicatorsNote?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'trademaster';
  timestamp: string;
  text: string;
  imageBase64?: string;
  imagePreview?: string;
  priceUsed?: string;
  assetUsed?: string;
  modeUsed?: TradingMode;
  parsedSignal?: TradeSignal;
  parsedDebrief?: CoachDebrief;
}

export interface RiskState {
  capital: number;
  riskPercent: number; // strictly 1%
  dailyWins: number;
  dailyLosses: number;
  isStoppedForDay: boolean;
  stopReason?: string;
}
