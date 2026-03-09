'use client';

import { PublicLedgerEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Search, Filter, TrendingUp, AlertCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';

interface TerminalBodyProps {
  entries: PublicLedgerEntry[];
  selectedEntry: PublicLedgerEntry | undefined;
  isLoading: boolean;
  onSelect: (id: string) => void;
  filters: any;
}

export function TerminalBody({ entries, selectedEntry, isLoading, onSelect, filters }: TerminalBodyProps) {
  // CRITICAL: Robust Deep-Linking logic using venueMarketId
  const getVenueUrl = (entry: PublicLedgerEntry) => {
    const venueIdentifier = entry.venueMarketId;
    if (entry.venue.toLowerCase() === 'polymarket') {
      // SMART ROUTING: Use /market/ for numeric IDs and /event/ for slugs
      return /^\d+$/.test(venueIdentifier)
        ? `https://polymarket.com/market/${venueIdentifier}`
        : `https://polymarket.com/event/${venueIdentifier}`;
    }
    return `https://kalshi.com/markets/${venueIdentifier}`;
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* LEFT PANEL: Filters & Stats */}
      <div className="w-64 border-r border-[#2A2D35] bg-[#0B0E14] flex flex-col p-4 gap-6 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Market Discovery</span>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input 
              id="terminal-search"
              placeholder="F SEARCH..." 
              value={filters.search}
              onChange={(e) => filters.setSearch(e.target.value)}
              className="h-8 text-[10px] bg-[#1A1D23] border-[#2A2D35] pl-7 rounded-none focus-visible:ring-primary/20"
            />
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Top Movers (EV)</span>
          <div className="space-y-2">
            {entries.slice(0, 3).map(e => (
              <div 
                key={`mover-${e.id}`} 
                onClick={() => onSelect(e.id)}
                className="p-2 bg-[#1A1D23] border border-[#2A2D35] hover:border-primary/50 cursor-pointer transition-colors"
              >
                <div className="text-[9px] uppercase font-bold text-muted-foreground truncate">{e.marketTitle}</div>
                <div className="flex justify-between items-end mt-1">
                  <span className="text-[11px] font-mono text-accent">+{e.evEst.toFixed(3)}</span>
                  <Badge variant="outline" className="text-[8px] h-4">{e.venue[0].toUpperCase()}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filters</span>
          <div className="space-y-3">
             <div className="space-y-1">
               <span className="text-[9px] uppercase font-bold text-muted-foreground">Status</span>
               <div className="flex flex-col gap-1">
                 {['all', 'resolved', 'unresolved'].map(s => (
                   <button 
                    key={s}
                    onClick={() => filters.setStatusFilter(s)}
                    className={cn(
                      "text-left text-[10px] uppercase font-bold px-2 py-1 border transition-colors",
                      filters.statusFilter === s ? "bg-primary/20 border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                   >
                     {s}
                   </button>
                 ))}
               </div>
             </div>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="p-3 border border-dashed border-[#2A2D35] text-[10px] text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-3 h-3" />
              <span className="font-bold uppercase">Hotkeys</span>
            </div>
            ↑↓ SELECT<br/>
            ENTER DETAILS<br/>
            F SEARCH<br/>
            R REFRESH<br/>
            ESC CLEAR
          </div>
        </div>
      </div>

      {/* CENTER PANEL: Watchlist Table */}
      <div className="flex-1 flex flex-col bg-[#0B0E14]">
        <div className="h-8 bg-[#1A1D23] border-b border-[#2A2D35] flex items-center px-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
          <div className="w-24">Timestamp</div>
          <div className="flex-1">Market Opportunity</div>
          <div className="w-20">Venue</div>
          <div className="w-20">Stance</div>
          <div className="w-24">Fair Range</div>
          <div className="w-16 text-right">EV</div>
        </div>
        <ScrollArea className="flex-1">
          <div className="divide-y divide-[#1A1D23]">
            {entries.map((entry) => {
              const date = entry.tsIssued instanceof Timestamp ? entry.tsIssued.toDate() : new Date(entry.tsIssued);
              const isSelected = selectedEntry?.id === entry.id;
              
              return (
                <div 
                  key={entry.id}
                  onClick={() => onSelect(entry.id)}
                  className={cn(
                    "h-12 flex items-center px-4 text-[11px] font-mono cursor-pointer transition-colors group",
                    isSelected ? "bg-primary/10 border-l-2 border-l-primary" : "hover:bg-[#1A1D23] border-l-2 border-l-transparent"
                  )}
                >
                  <div className="w-24 text-muted-foreground tabular-nums">{format(date, 'HH:mm:ss')}</div>
                  <div className="flex-1 font-bold truncate pr-4 group-hover:text-primary transition-colors">
                    {entry.marketTitle}
                  </div>
                  <div className="w-20 text-[10px] uppercase font-black opacity-60">{entry.venue}</div>
                  <div className="w-20">
                    <Badge variant={entry.stance === 'BET' ? 'default' : 'destructive'} className="text-[9px] font-black py-0">
                      {entry.stance}
                    </Badge>
                  </div>
                  <div className="w-24 text-muted-foreground">
                    ${entry.fairLow.toFixed(2)}-${entry.fairHigh.toFixed(2)}
                  </div>
                  <div className={cn(
                    "w-16 text-right font-bold",
                    entry.evEst > 0 ? "text-accent" : entry.evEst < 0 ? "text-destructive" : ""
                  )}>
                    {entry.evEst > 0 ? '+' : ''}{entry.evEst.toFixed(3)}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT PANEL: Details */}
      <div className="w-80 border-l border-[#2A2D35] bg-[#0B0E14] flex flex-col p-6 gap-6 overflow-y-auto no-scrollbar">
        {selectedEntry ? (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Intelligence Snapshot
              </span>
              <h2 className="text-lg font-bold leading-tight">{selectedEntry.marketTitle}</h2>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase">
                <Badge variant="outline">{selectedEntry.venue}</Badge>
                <span>Issued {format(selectedEntry.tsIssued instanceof Timestamp ? selectedEntry.tsIssued.toDate() : new Date(selectedEntry.tsIssued), 'MMM dd, HH:mm')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-[#2A2D35] py-4">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-muted-foreground">Fair Value Band</span>
                <div className="text-xs font-bold font-mono">${selectedEntry.fairLow.toFixed(2)}-${selectedEntry.fairHigh.toFixed(2)}</div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-muted-foreground">EV Estimate</span>
                <div className="text-xs font-bold font-mono text-accent">+{selectedEntry.evEst.toFixed(3)}</div>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Rationale</span>
              <p className="text-xs leading-relaxed italic text-foreground/80 bg-[#1A1D23] p-3 border border-[#2A2D35] rounded shadow-inner">
                "{selectedEntry.rationaleShort}"
              </p>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classifiers</span>
              <div className="flex flex-wrap gap-2">
                {selectedEntry.tags?.map(tag => (
                  <Badge key={tag} variant="outline" className="text-[9px] uppercase font-bold border-[#2A2D35]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-6 border-t border-[#2A2D35]">
              <Button variant="outline" className="w-full text-[10px] uppercase font-black gap-2 h-10 border-[#2A2D35]" asChild>
                <a href={getVenueUrl(selectedEntry)} target="_blank" rel="noopener noreferrer">
                  Open Market <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
              <Button variant="default" className="w-full text-[10px] uppercase font-black gap-2 h-10" asChild>
                <Link href="/ledger">
                  Full Ledger <ArrowRight className="w-3 h-3" />
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 space-y-4">
             <TrendingUp className="w-12 h-12" />
             <p className="text-[10px] uppercase font-black tracking-widest">Select an entry for deep audit</p>
          </div>
        )}
      </div>
    </div>
  );
}
