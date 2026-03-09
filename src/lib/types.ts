import { Timestamp } from 'firebase/firestore';

export type Event = {
  id: string;
  ticker?: string;
  slug?: string;
  title: string;
  description?: string;
  startDate?: any;
  creationDate?: any;
  endDate?: any;
  image?: string;
  icon?: string;
  active?: boolean;
  closed?: boolean;
  archived?: boolean;
  new?: boolean;
  featured?: boolean;
  restricted?: boolean;
  liquidity?: number;
  volume?: number;
  volume24hr?: number;
  enableOrderBook?: boolean;
  liquidityClob?: number;
  competitive?: number;
  _sync?: boolean;
  negRisk?: boolean;
  negRiskMarketID?: string;
  commentCount?: number;
  venue: 'polymarket' | 'kalshi';
  venueEventId: string;
  status: 'open' | 'closed' | 'resolved';
  createdAt: any;
  updatedAt: any;
  category?: string;
  markets?: Market[];
  normalizedTitleKey?: string; 
}

export type Market = {
  id: string;
  eventId?: string;
  venue: 'polymarket' | 'kalshi' | 'other';
  venueMarketId: string;
  venueUrl?: string;
  title: string;
  question?: string;
  conditionId?: string;
  slug?: string;
  resolutionSource?: string;
  category: string;
  outcomeType: 'binary';
  openTime: any; 
  closeTime: any; 
  resolutionTime: any | null; 
  resolvedOutcome: number | null;
  status: 'open' | 'closed' | 'resolved';
  clobYesTokenId?: string | null;
  clobNoTokenId?: string | null;
  clobTokenIds?: string[];
  volume: number | null;
  volumeNum?: number | null;
  volume24hr?: number | null;
  liquidity: number | null;
  liquidityClob?: number | null;
  priceProb: number | null;
  lastTradePrice?: number | null;
  bestBid?: number | null;
  bestAsk?: number | null;
  spread?: number | null;
  oneDayPriceChange?: number | null;
  negRisk?: boolean;
  negRiskMarketID?: string;
  negRiskRequestID?: string;
  negRiskOther?: boolean;
  outcomes?: string[];
  outcomePrices?: string[];
  groupItemTitle?: string;
  groupItemThreshold?: string;
  questionID?: string;
  umaEndDate?: any;
  umaResolutionStatus?: string;
  umaBond?: string;
  umaReward?: string;
  fpmmLive?: boolean;
  acceptingOrders?: boolean;
  ready?: boolean;
  funded?: boolean;
  cyom?: boolean;
  approved?: boolean;
  submitted_by?: string;
  resolvedBy?: string;
  marketMakerAddress?: string;
  orderPriceMinTickSize?: number;
  orderMinSize?: number;
  hasReviewedDates?: boolean;
  volumeClob?: number;
  pagerDutyNotificationEnabled?: boolean;
  automaticallyResolved?: boolean;
  automaticallyActive?: boolean;
  clearBookOnStart?: boolean;
  manualActivation?: boolean;
  clobRewards?: any[];
  createdAt: any; 
  updatedAt: any; 
  normalizedTitleKey?: string;
  searchText?: string;
}

export type GadState = {
  id: string; // marketId
  marketId: string;
  ts: any;
  lambda: number; // discontinuity state
  v: number; // predictive variance
  jumpProb: number;
  regime: 'CALM' | 'NORMAL' | 'STRESS';
  fairLow: number;
  fairHigh: number;
  fairCenter: number;
  updatedAt: any;
}

export type TqsState = {
  id: string; // marketId
  tqs: number; // 0-100
  convictionFloor: number;
  executionGate: 'PASS' | 'FAIL';
  edge: number;
  riskPenalty: number;
  updatedAt: any;
}

export type ProbabilityDecomposition = {
  informed: number;
  momentum: number;
  whales: number;
  noise: number;
}

export type MarketState = {
  id: string; 
  marketId: string;
  ts: any;
  currentPriceProb: number;
  // GAD Outputs
  gad: GadState;
  // TQS Outputs
  tqs: TqsState;
  // Final Stance
  classification: 'BET' | 'NO_BET' | 'WAIT';
  direction: 'YES' | 'NO' | null;
  tags: string[];
  version: string;
  updatedAt: any;
  decomposition?: ProbabilityDecomposition;
}

export type PublicLedgerEntry = {
  id: string;
  marketId: string;
  tsIssued: any; 
  marketTitle: string;
  venue: string;
  venueMarketId: string;
  marketPriceAtIssue: number;
  stance: 'BET' | 'NO_BET' | 'WAIT';
  direction: 'YES' | 'NO' | null;
  // Unified GAD+TQS Meta
  fairLow: number;
  fairHigh: number;
  fairCenter: number;
  evEst: number;
  tqs: number;
  regime: string;
  lambda: number;
  jumpProb: number;
  rationaleShort: string;
  resolved: boolean;
  outcome: number | null;
  realizedPnlUnits: number | null;
  version: string;
  sourceSignalId: string;
  createdAt: any; 
  updatedAt: any;
}

export type MarketTick = {
  id: string;
  marketId: string;
  ts: any;
  priceProb: number;
  volume: number | null;
  tradeCount: number | null;
  bid: number | null;
  ask: number | null;
  mid: number | null;
  liquidityProxy: number | null;
  createdAt: any;
  expireAt: any;
}

export type ExternalSignal = {
  id: string;
  signalName: string;
  signalType: 'macro' | 'polls' | 'finance' | 'news';
  ts: any;
  value: number;
  delta: number | null;
  source: string;
  createdAt: any;
}

export type UserTrade = {
  id: string;
  marketId: string;
  marketTitle: string;
  venue: string;
  entryPrice: number;
  direction: 'YES' | 'NO';
  units: number; 
  tsLogged: any;
  resolved: boolean;
  outcome: number | null;
  realizedPnlUnits: number | null;
  createdAt: any;
}

export type UserProfile = {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'user' | 'admin';
  plan: 'free' | 'pro' | 'internal';
  status: 'active' | 'inactive';
  createdAt: any; 
  updatedAt: any; 
}

export type WatchlistItem = {
  id: string; 
  marketId: string;
  title: string;
  venue: string;
  targetTqs: number;
  minLiquidity: number;
  createdAt: any;
}

export type GuardrailRule = {
  id: string;
  userId: string;
  name: string;
  description: string;
  conditionExpression: string;
  enforcementAction: 'FLAG' | 'WARN' | 'SOFT_BLOCK';
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
}

export type BacktestResult = {
  id: string;
  runId: string;
  marketId: string;
  marketTitle?: string;
  hitRate: number;
  expectedValueRealized: number;
  drawdown: number;
  brierScore: number;
  noBetValue: number;
  strategy: 'gad' | 'naive';
  tsCompleted: any;
}

export type Whale = {
  id: string;
  identity: string;
  type: 'wallet' | 'public_trader' | 'flow_cluster';
  label: string;
  hitRate: number;
  roi: number;
  totalVolume: number;
  lastActiveAt: any;
  createdAt: any;
  tags: string[];
  timingSkill?: number;
}

export type WhalePosition = {
  id: string;
  whaleId: string;
  marketId: string;
  marketTitle: string;
  side: 'YES' | 'NO';
  size: number;
  avgEntry: number;
  currentPrice: number;
  unrealizedPnl: number;
  updatedAt: any;
}
