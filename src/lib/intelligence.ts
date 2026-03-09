/**
 * @fileOverview Intelligence Engine for Predictive Insights Pro.
 * Implements GAD Regimes and TQS Execution Gate logic.
 */

import { Market, MarketTick, ExternalSignal, PublicLedgerEntry, MarketState, ProbabilityDecomposition } from './types';

/**
 * Intelligence Metrics Type
 */
export type IntelligenceMetrics = {
  tqs: number;
  convictionFloor: number;
  fairMu: number;
  fairLow: number;
  fairHigh: number;
  fairSigma: number;
  evEst: number;
  cmci: number;
  lambda: number;
  jumpProb: number;
  regime: 'CALM' | 'NORMAL' | 'STRESS';
  tags: string[];
  intelligenceScore: number;
  whaleRisk: 'low' | 'med' | 'high';
  moveType: string;
  rationale: string;
  classification?: 'BET' | 'NO_BET' | 'WAIT';
};

/**
 * TQS Stance Decision Logic
 * Returns the intended stance based on TQS vs Conviction Floor.
 */
export function calculateStance(tqs: number, floor: number = 25): 'BET' | 'WAIT' | 'NO_BET' {
  if (tqs >= floor) return 'BET';
  if (tqs >= floor - 10) return 'WAIT';
  return 'NO_BET';
}

/**
 * Probability Decomposition Engine
 */
export function calculateDecomposition(marketId: string, totalProb: number, tqs: number): ProbabilityDecomposition {
  const seed = marketId.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  const total = (totalProb || 0.5) * 100;

  const informedBase = Math.min(0.4, 0.15 + ((tqs || 0) / 200));
  let informed = Math.floor(total * informedBase);
  let whales = Math.floor(total * (0.1 + (seed % 20) / 100));
  let momentum = Math.floor(total * (0.15 + (seed % 15) / 100));
  let noise = Math.max(0, total - informed - whales - momentum);

  return { informed, momentum, whales, noise };
}

/**
 * Deterministic Intelligence Derivation (GAD + TQS Protocol)
 * Used by the frontend for real-time analysis simulations.
 */
export function deriveIntelligence(
  currentPrice: number,
  ticks: MarketTick[],
  category: string,
  macroSignals: ExternalSignal[]
): IntelligenceMetrics {
  // Use category + a secondary seed for more unique variance per node
  const seed = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 1. GAD: REGIME DETECTION (Simulated Affine Filter)
  // Dynamic base lambda between 0.08 and 0.33
  let lambda = 0.08 + (seed % 25) / 100;
  let v = 0.01 + (seed % 15) / 1000;
  
  if (ticks && ticks.length > 5) {
    const prices = ticks.slice(-5).map(t => t.priceProb);
    const variance = prices.reduce((a, b) => a + Math.pow(b - currentPrice, 2), 0) / 5;
    v = Math.max(0.01, variance);
    lambda = Math.min(0.9, lambda + (v * 10));
  }

  const jumpProb = 1 - Math.exp(-1 * (0.01 + 0.5 * lambda));
  const regime: 'CALM' | 'NORMAL' | 'STRESS' = lambda < 0.2 ? 'CALM' : lambda > 0.5 ? 'STRESS' : 'NORMAL';

  // 2. GAD: FAIR ENVELOPE
  const sigma = Math.sqrt(v);
  const width = regime === 'STRESS' ? 2.5 * sigma : regime === 'CALM' ? 1.5 * sigma : 2.0 * sigma;
  
  const fairMu = currentPrice + (seed % 10 - 5) / 100; // Fair value drift
  const fairLow = Math.max(0.001, fairMu - width);
  const fairHigh = Math.min(0.999, fairMu + width);

  // 3. TQS: EXECUTION GATE
  const edge = fairMu - currentPrice;
  const riskPenalty = (0.15 * jumpProb) + (0.25 * v) + (0.05 * Math.max(0, lambda - 0.4));
  const executionPenalty = 0.01; // Base friction

  const rawTqs = (Math.abs(edge) - riskPenalty - executionPenalty) * 1000;
  const tqs = Math.max(0, Math.min(100, Math.round(rawTqs)));
  const convictionFloor = regime === 'STRESS' ? 40 : regime === 'CALM' ? 15 : 25;

  // 4. MACRO CONFIRMATION (CMCI)
  const macroDelta = macroSignals && macroSignals.length > 0 
    ? macroSignals.reduce((acc, s) => acc + Math.abs(s.delta || 0), 0) / macroSignals.length 
    : 0.02;
  const cmci = Math.min(0.99, 0.6 + macroDelta * 5);

  const tags = [
    `${regime} REGIME`,
    tqs >= convictionFloor ? 'CONVICTION PASS' : 'CONVICTION FAIL',
    cmci > 0.7 ? 'MACRO CONFIRMED' : 'RETAIL BIAS'
  ];

  return {
    tqs,
    convictionFloor,
    fairMu,
    fairLow,
    fairHigh,
    fairSigma: sigma,
    evEst: edge,
    cmci,
    lambda,
    jumpProb,
    regime,
    tags,
    intelligenceScore: Math.round(tqs * 0.8 + cmci * 20),
    whaleRisk: lambda > 0.4 ? 'med' : 'low',
    moveType: 'informational',
    rationale: 'Protocol Handshake: Nominal.'
  };
}

/**
 * Unified Stance Priority Protocol
 */
export function getEffectiveStance(market: Market, ledgerSignal?: PublicLedgerEntry | null, marketState?: MarketState | null) {
  const currentPrice = market.priceProb || 0.5;
  const fallback = deriveIntelligence(currentPrice, [], (market.id + (market.category || 'General')), []);

  // 1. Priority: Issued Public Signal
  if (ledgerSignal) {
    return {
      stance: ledgerSignal.stance,
      direction: ledgerSignal.direction,
      tqs: Number(ledgerSignal.tqs) || 0,
      convictionFloor: ledgerSignal.regime === 'STRESS' ? 40 : 25,
      regime: ledgerSignal.regime || 'NORMAL',
      edge: ledgerSignal.evEst || 0,
      fairLow: ledgerSignal.fairLow || 0.4,
      fairHigh: ledgerSignal.fairHigh || 0.6,
      lambda: ledgerSignal.lambda || fallback.lambda,
      jumpProb: ledgerSignal.jumpProb || fallback.jumpProb,
      rationale: ledgerSignal.rationaleShort || 'Intelligence basis verified.',
      isIssued: true,
      decomposition: ledgerSignal.decomposition || calculateDecomposition(market.id, currentPrice, Number(ledgerSignal.tqs) || 0)
    };
  }

  // 2. Secondary: Live MarketState from GAD Function
  if (marketState) {
    let tqsVal = 0;
    let floor = 25;
    let edge = 0;

    if (typeof marketState.tqs === 'object') {
      tqsVal = Number(marketState.tqs.tqs) || 0;
      floor = Number(marketState.tqs.convictionFloor) || 25;
      edge = Number(marketState.tqs.edge) || 0;
    } else {
      tqsVal = Number(marketState.tqs) || 0;
    }

    // Endogenous picking of GAD vitals from root or nested object
    const finalLambda = (marketState as any).lambda || marketState.gad?.lambda || fallback.lambda;
    const finalJumpProb = (marketState as any).jumpProb || marketState.gad?.jumpProb || fallback.jumpProb;

    return {
      stance: marketState.classification || 'WAIT',
      direction: marketState.direction || null,
      tqs: tqsVal,
      convictionFloor: floor,
      regime: marketState.gad?.regime || (marketState as any).regime || 'NORMAL',
      edge: edge,
      fairLow: marketState.gad?.fairLow || (marketState as any).fairLow || 0.4,
      fairHigh: marketState.gad?.fairHigh || (marketState as any).fairHigh || 0.6,
      lambda: finalLambda,
      jumpProb: finalJumpProb,
      rationale: marketState.classification === 'BET' ? 'TQS Execution Gate Passed.' : 'Monitoring structural risk...',
      isIssued: false,
      decomposition: marketState.decomposition || calculateDecomposition(market.id, currentPrice, tqsVal)
    };
  }

  // 3. Fallback: Seeded Proxy (Ensures every node is unique)
  const stance = fallback.tqs >= fallback.convictionFloor ? 'BET' : (fallback.tqs >= fallback.convictionFloor - 10 ? 'WAIT' : 'NO_BET');

  return {
    stance,
    direction: fallback.evEst > 0 ? 'YES' : 'NO',
    tqs: Number(fallback.tqs) || 0,
    convictionFloor: fallback.convictionFloor || 25,
    regime: fallback.regime || 'NORMAL',
    edge: fallback.evEst || 0,
    fairLow: fallback.fairLow || 0.4,
    fairHigh: fallback.fairHigh || 0.6,
    lambda: fallback.lambda,
    jumpProb: fallback.jumpProb,
    rationale: 'Initializing Discovery Node...',
    isIssued: false,
    decomposition: calculateDecomposition(market.id, currentPrice, Number(fallback.tqs) || 0)
  };
}

/**
 * Execution Reality Simulator
 */
export function calculateExecutionReality(price: number, size: number, liquidity: number) {
  const depthFactor = size / (liquidity || 5000);
  const slippage = depthFactor * 0.02; // 2% per depth unit
  const estimatedPrice = price + slippage;
  return {
    estimatedPrice,
    alphaErosion: (slippage * 100).toFixed(2),
    leakage: (size * slippage).toFixed(2)
  };
}

/**
 * Deterministic Fallback Intelligence (LEGACY COMPAT)
 */
export function getDeterministicIntelligence(marketId: string, currentPrice: number = 0.5) {
  const seed = marketId.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  const now = typeof Date !== 'undefined' ? Date.now() : 0;
  const drift = Math.sin(now / 10000 + seed) * 0.01;
  
  const tqs = Math.max(5, Math.min(95, (seed % 100) + drift * 20));
  const lambda = Math.max(0.01, Math.min(0.9, 0.08 + (seed % 25) / 100 + drift));
  const jumpProb = 1 - Math.exp(-1 * (0.01 + 0.5 * lambda));
  
  return {
    tqs,
    lambda,
    jumpProb,
    stance: tqs > 40 ? 'BET' : 'WAIT',
    direction: seed % 2 === 0 ? 'YES' : 'NO',
    cvs: Math.round(70 + (seed % 20)),
    ev: (seed % 15) / 100,
    whaleRisk: (seed % 100) > 85 ? 'high' : 'low',
    moveType: 'informational',
    rationale: 'Discovery Cluster processing ticks...',
    diagnostic: { who: 'Retail Flow', why: 'Liquidity Depth', integrity: 'SIGNAL' },
    decomposition: calculateDecomposition(marketId, currentPrice, tqs)
  };
}
