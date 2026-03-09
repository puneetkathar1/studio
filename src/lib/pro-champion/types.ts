
export type Side = 'YES' | 'NO' | 'LADDER' | 'MULTI';

export interface OrderBookLevel {
  price: number;
  size: number; // size in $ (notional)
}

export interface OrderBookSnapshot {
  marketId: string;
  outcomeId: string;
  timestamp: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface MarketConstraint {
  id: string;
  type: 'IMPLIES' | 'MUTUAL_EXCLUSIVE' | 'SUM_TO_ONE' | 'LADDER_SUM';
  marketsInvolved: string[];
  mappingDetails?: {
    ifA: string; // outcomeId
    thenB: string; // outcomeId
  };
}

export interface ProMarket {
  id: string;
  title: string;
  venue: string;
  side: Side;
  status: 'open' | 'closed';
  outcomes: string[];
}

export interface ProOpportunity {
  market: ProMarket;
  cvs: number;
  extractableEdge: number; // E$
  aev: number; // Execution Adjusted EV %
  lbs: number; // Liquidity Bound Size $
  halfLife: number; // HL in seconds
  drf: 'Low' | 'Med' | 'High';
  rationale: string;
  violatedConstraints: Array<{ name: string; magnitude: number }>;
  isArbitrage?: boolean;
  arbDetails?: ArbitrageOpportunity;
}

export interface ArbitrageOpportunity {
  eventTitle: string;
  polyMarketId: string;
  kalshiMarketId: string;
  polyVenueMarketId: string;
  kalshiVenueMarketId: string;
  polyVenueUrl?: string;
  kalshiVenueUrl?: string;
  polyPrice: number;
  kalshiPrice: number;
  polyLiquidity: number;
  kalshiLiquidity: number;
  divergence: number;
  netAlpha: number;
  executionPath: string; // e.g., "BUY Poly / SELL Kalshi"
}

export interface ProControls {
  tradingSize: number;
  minEdgeThreshold: number;
  feeAssumption: number;
  slippageModel: 'simple' | 'conservative';
  hlWindow: '15m' | '1h' | '24h';
  drfFilter: 'all' | 'Low' | 'Med';
}
