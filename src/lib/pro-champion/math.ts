
/**
 * @fileOverview Quantitative engine for Pro Champion execution layer.
 * Implements depth-adjusted pricing, execution-EV, and constraint scoring.
 */

import { OrderBookLevel, ProControls } from './types';

/**
 * 3.1 Depth-adjusted expected fill price for a given size
 */
export function calculateExpectedFillPrice(
  levels: OrderBookLevel[],
  targetNotional: number,
  side: 'BUY' | 'SELL'
) {
  // Sort best to worst
  const sortedLevels = [...levels].sort((a, b) => 
    side === 'BUY' ? a.price - b.price : b.price - a.price
  );

  let remaining = targetNotional;
  let cost = 0;
  let filled = 0;

  for (const lvl of sortedLevels) {
    const take = Math.min(remaining, lvl.size);
    cost += lvl.price * take;
    filled += take;
    remaining -= take;
    if (remaining <= 0) break;
  }

  if (filled === 0) return null;
  return {
    price: cost / filled,
    fillable: remaining <= 0,
    filled: filled,
    slippage: (cost / filled) - sortedLevels[0].price
  };
}

/**
 * 3.2 AEV – Execution-Adjusted Expected Value (%)
 */
export function calculateAEV(
  legPrices: number[],
  guaranteedPayout: number,
  fees: number
): number {
  const totalCost = legPrices.reduce((a, b) => a + b, 0);
  if (totalCost === 0) return 0;
  
  const netProfit = guaranteedPayout - totalCost - fees;
  return (netProfit / totalCost) * 100;
}

/**
 * 3.4 LBS – Liquidity-Bound Size ($)
 * Binary search for max size where AEV >= threshold
 */
export function calculateLBS(
  asksByLeg: OrderBookLevel[][],
  threshold: number,
  fees: number,
  maxCap: number = 50000
): number {
  let low = 0;
  let high = maxCap;
  const tolerance = 10;

  while (high - low > tolerance) {
    const mid = (low + high) / 2;
    const legPrices = asksByLeg.map(book => {
      const fill = calculateExpectedFillPrice(book, mid, 'BUY');
      return fill ? fill.price : 1.0;
    });
    
    const aev = calculateAEV(legPrices, 1.0, fees);
    if (aev >= threshold * 100) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return Math.round(low);
}

/**
 * 3.5 CVS – Constraint Violation Score (0–100)
 */
export function calculateCVS(violations: Array<{ type: string; val: number }>): number {
  const weights: Record<string, number> = {
    'LADDER_SUM': 0.35,
    'IMPLICATION': 0.30,
    'MUTUAL_EXCLUSIVE': 0.20,
    'COHERENCE': 0.15
  };

  const k = 2.5;
  const scales: Record<string, number> = {
    'LADDER_SUM': 0.1,
    'IMPLICATION': 0.05,
    'MUTUAL_EXCLUSIVE': 0.05,
    'COHERENCE': 0.05
  };

  let weightedViolation = 0;
  violations.forEach(v => {
    const w = weights[v.type] || 0.1;
    const scale = scales[v.type] || 0.05;
    weightedViolation += w * Math.min(v.val / scale, 1);
  });

  return Math.round(100 * (1 - Math.exp(-k * weightedViolation)));
}

/**
 * 4 Ranking logic
 */
export function calculateOpportunityScore(
  e$: number, 
  aev: number, 
  cvs: number, 
  hl: number, 
  drfNumeric: number
): number {
  // Simple normalization proxies
  const normE = Math.min(e$ / 1000, 1);
  const normAEV = Math.min(aev / 10, 1);
  const normCVS = cvs / 100;
  const normHL = hl > 0 ? Math.min(60 / hl, 1) : 0;
  const normDRF = 1 / drfNumeric;

  return (
    0.45 * normE +
    0.25 * normAEV +
    0.15 * normCVS +
    0.10 * normHL +
    0.05 * normDRF
  );
}
