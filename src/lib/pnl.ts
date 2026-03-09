import type { PublicLedgerEntry } from '@/lib/types';

/**
 * Robust PnL utility for the predictive matrix.
 * Calculates realized alpha based on a standardized 1-unit stake.
 */
export function calculatePnl(entry: PublicLedgerEntry): number {
  if (!entry) return 0;

  // PRIORITY 1: Pre-calculated units from the database (Finalized Audit)
  if (typeof entry.realizedPnlUnits === 'number') {
    return entry.realizedPnlUnits;
  }

  // PRIORITY 2: WAIT or NO_BET signals have zero execution exposure
  if (entry.stance !== 'BET') {
    return 0;
  }

  // PRIORITY 3: Live calculation for resolved but unpopulated units
  if (!entry.resolved || entry.outcome === null) {
    return 0;
  }

  const price = entry.marketPriceAtIssue;
  if (typeof price !== 'number' || price <= 0 || price >= 1) return 0;

  const outcome = Number(entry.outcome);

  // Unit Stake Model: PnL = (Payout - Stake)
  if (entry.direction === 'YES') {
    return outcome === 1 ? (1 / price) - 1 : -1;
  } else if (entry.direction === 'NO') {
    // A "NO" share costs (1 - price)
    return outcome === 0 ? (1 / (1 - price)) - 1 : -1;
  }

  return 0;
}
