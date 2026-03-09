
import { ProMarket, OrderBookSnapshot, ProOpportunity, Side } from './types';

export const MOCK_MARKETS: ProMarket[] = [
  {
    id: 'poly-1',
    title: 'Will Bitcoin hit $100k before ETH hits $4k?',
    venue: 'Polymarket',
    side: 'YES',
    status: 'open',
    outcomes: ['YES', 'NO']
  },
  {
    id: 'kalshi-1',
    title: 'Federal Reserve Interest Rate Decision (June)',
    venue: 'Kalshi',
    side: 'MULTI',
    status: 'open',
    outcomes: ['25bps Cut', 'No Change', '25bps Hike']
  },
  {
    id: 'poly-2',
    title: 'NBA: Celtics vs Lakers (Point Spread Ladder)',
    venue: 'Polymarket',
    side: 'LADDER',
    status: 'open',
    outcomes: ['-5.5', '-2.5', 'PK', '+2.5', '+5.5']
  },
  {
    id: 'kalshi-2',
    title: 'Will the S&P 500 close above 5,400 today?',
    venue: 'Kalshi',
    side: 'YES',
    status: 'open',
    outcomes: ['YES', 'NO']
  }
];

export const generateMockOrderBook = (mid: number, liquidity: number = 1000): OrderBookSnapshot => {
  const bids = Array.from({ length: 5 }).map((_, i) => ({
    price: mid - (i + 1) * 0.005,
    size: liquidity * (1 - i * 0.1)
  }));
  const asks = Array.from({ length: 5 }).map((_, i) => ({
    price: mid + (i + 1) * 0.005,
    size: liquidity * (1 - i * 0.1)
  }));
  return {
    marketId: 'mock',
    outcomeId: 'mock',
    timestamp: Date.now(),
    bids,
    asks
  };
};

export const MOCK_OPPORTUNITIES: ProOpportunity[] = [
  {
    market: MOCK_MARKETS[0],
    cvs: 82,
    extractableEdge: 450.20,
    aev: 4.25,
    lbs: 12500,
    halfLife: 42,
    drf: 'High',
    rationale: 'Severe tension between BTC/ETH leg pricing and cross-venue spot arbitrage.',
    violatedConstraints: [{ name: 'COHERENCE', magnitude: 0.08 }]
  },
  {
    market: MOCK_MARKETS[1],
    cvs: 68,
    extractableEdge: 890.00,
    aev: 3.15,
    lbs: 25000,
    halfLife: 15,
    drf: 'Low',
    rationale: 'Pricing inefficiency in the No Change outcome relative to macro indicators.',
    violatedConstraints: [{ name: 'MUTUAL_EXCLUSIVE', magnitude: 0.05 }]
  },
  {
    market: MOCK_MARKETS[2],
    cvs: 45,
    extractableEdge: 120.50,
    aev: 2.10,
    lbs: 5000,
    halfLife: 120,
    drf: 'Med',
    rationale: 'Ladder sum divergence at -2.5 spread levels indicates retail imbalance.',
    violatedConstraints: [{ name: 'LADDER_SUM', magnitude: 0.04 }]
  },
  {
    market: MOCK_MARKETS[3],
    cvs: 15,
    extractableEdge: 45.00,
    aev: 0.95,
    lbs: 3000,
    halfLife: 300,
    drf: 'Low',
    rationale: 'Stable binary pricing with minimal execution slippage.',
    violatedConstraints: []
  }
];
