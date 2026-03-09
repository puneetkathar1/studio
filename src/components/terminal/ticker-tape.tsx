'use client';

import { PublicLedgerEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

const FALLBACK_ITEMS = [
  { id: 'f1', venue: 'POLYMARKET', marketTitle: 'BTC Threshold Audit', stance: 'BET', direction: 'UP', evEst: 0.042, resolved: false },
  { id: 'f2', venue: 'KALSHI', marketTitle: 'FED Rate Multi-Leg', stance: 'WAIT', direction: 'DOWN', evEst: 0.012, resolved: false },
  { id: 'f3', venue: 'POLYMARKET', marketTitle: 'US Election Basis', stance: 'BET', direction: 'YES', evEst: 0.084, resolved: true, outcome: 1 },
  { id: 'f4', venue: 'KALSHI', marketTitle: 'GDP Variance Scan', stance: 'WAIT', direction: 'UP', evEst: 0.005, resolved: false },
  { id: 'f5', venue: 'POLYMARKET', marketTitle: 'ETH ETF Convergence', stance: 'BET', direction: 'UP', evEst: 0.061, resolved: false }
];

export function TickerTape({ entries }: { entries: PublicLedgerEntry[] }) {
  // Use real entries if available, otherwise provide professional mock data
  const displayEntries = (entries && entries.length > 0) ? entries : FALLBACK_ITEMS;
  
  // Double items for a seamless loop with translateX(-50%)
  const tickerItems = [...displayEntries, ...displayEntries];

  return (
    <div className="h-7 bg-[#1A1D23] border-b border-[#2A2D35] flex items-center overflow-hidden relative w-full z-50">
      <div className="flex animate-ticker-infinite whitespace-nowrap">
        {tickerItems.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex items-center gap-2 px-8 border-r border-[#2A2D35] text-[10px] uppercase font-black">
            <span className="text-muted-foreground/60">{item.venue}</span>
            <span className="text-foreground max-w-[200px] truncate">{item.marketTitle}</span>
            <span className={cn(
              "font-black",
              item.stance === 'BET' ? "text-primary" : item.stance === 'NO_BET' ? "text-destructive" : "text-secondary"
            )}>
              {item.stance} {item.direction}
            </span>
            <span className="text-accent font-mono font-bold">
              EV: {(item.evEst || 0) > 0 ? '+' : ''}{(item.evEst || 0).toFixed(3)}
            </span>
            {item.resolved && (
              <span className={cn("px-1 rounded text-[8px]", item.outcome === 1 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive")}>
                {item.outcome === 1 ? 'WIN' : 'LOSS'}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
