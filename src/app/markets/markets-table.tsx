'use client'

import React, { useState, useMemo } from 'react'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy, limit, where, doc } from 'firebase/firestore'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Market, Event, MarketState, PublicLedgerEntry } from '@/lib/types'
import { 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  ArrowRight, 
  Target,
  Zap,
  ShieldCheck,
  Loader2,
  TrendingUp,
  Waves,
  Scale,
  FolderOpen,
  Layers
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCountdown } from '@/hooks/use-countdown'
import { getEffectiveStance } from '@/lib/intelligence'
import Link from 'next/link'
import { useDoc } from '@/firebase/firestore/use-doc'

function VenueIcon({ venue, size = 'sm' }: { venue: string, size?: 'sm' | 'md' }) {
  const isPoly = venue.toLowerCase() === 'polymarket';
  return (
    <div className={cn(
      "relative flex items-center justify-center rounded border font-black shrink-0 transition-all",
      size === 'sm' ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs",
      isPoly ? "border-primary/30 bg-primary/10 text-primary" : "border-accent/30 bg-accent/10 text-accent"
    )}>
      {isPoly ? 'P' : 'K'}
      <span className={cn(
        "absolute -top-0.5 -right-0.5 rounded-full animate-pulse shadow-lg",
        size === 'sm' ? "h-1.5 w-1.5" : "h-2 w-2",
        isPoly 
          ? "bg-primary shadow-[0_0_8px_hsl(var(--primary))]" 
          : "bg-accent shadow-[0_0_8px_hsl(var(--accent))]"
      )} />
    </div>
  );
}

function RegimeBadge({ regime }: { regime: string }) {
  const colors: Record<string, string> = {
    'CALM': 'bg-accent/20 text-accent border-accent/30',
    'NORMAL': 'bg-primary/20 text-primary border-primary/30',
    'STRESS': 'bg-destructive/20 text-destructive border-destructive/30 animate-pulse'
  };
  return (
    <Badge variant="outline" className={cn("text-[8px] font-black uppercase px-1.5 h-4", colors[regime] || colors['NORMAL'])}>
      {regime}
    </Badge>
  );
}

function MarketRow({ 
  market, 
  onSelectMarketForHero,
  isSelected,
  isChild = false
}: { 
  market: Market, 
  onSelectMarketForHero?: (m: Market) => void,
  isSelected?: boolean,
  isChild?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const firestore = useFirestore();
  
  const stateRef = useMemoFirebase(() => firestore ? doc(firestore, 'marketState', market.id) : null, [firestore, market.id]);
  const { data: marketState } = useDoc<MarketState>(stateRef);

  const signalQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'publicLedger'), where('marketId', '==', market.id), orderBy('tsIssued', 'desc'), limit(1)) : null, [firestore, market.id]);
  const { data: signals } = useCollection<PublicLedgerEntry>(signalQuery);

  const intel = useMemo(() => getEffectiveStance(market, signals?.[0], marketState), [market, signals, marketState]);

  const countdownText = useCountdown(market.closeTime?.toDate ? market.closeTime.toDate() : new Date(market.closeTime));

  return (
    <>
      <TableRow 
        className={cn(
          "group hover:bg-white/[0.03] border-b border-border/30 transition-all cursor-pointer",
          isSelected && "bg-primary/5",
          isExpanded && "bg-white/[0.02]",
          isChild && "border-l-8 border-l-primary/10"
        )}
        onClick={(e) => {
          e.stopPropagation();
          setIsExpanded(!isExpanded);
          if (onSelectMarketForHero) onSelectMarketForHero(market);
        }}
      >
        <TableCell className="pl-6 w-16">
          <VenueIcon venue={market.venue} />
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className={cn("font-bold text-xs transition-colors line-clamp-1", isSelected ? "text-primary" : "group-hover:text-primary")}>{market.title}</span>
            <span className="text-[8px] text-muted-foreground uppercase font-black opacity-40">ID_{market.venueMarketId.slice(-8)}</span>
          </div>
        </TableCell>
        <TableCell>
          <span className="font-mono text-xs font-black text-foreground">
            {((market.priceProb || 0.5) * 100).toFixed(1)}%
          </span>
        </TableCell>
        <TableCell>
          <Badge variant={intel.stance === 'BET' ? 'default' : 'secondary'} className="text-[9px] font-black uppercase">
            {intel.stance}
          </Badge>
        </TableCell>
        <TableCell className="hidden md:table-cell">
          <div className="flex flex-col">
            <span className="text-[10px] font-black font-mono text-primary">{(intel.tqs ?? 0).toFixed(0)}</span>
            <span className="text-[7px] text-muted-foreground uppercase font-bold">TQS SCORE</span>
          </div>
        </TableCell>
        <TableCell className="hidden lg:table-cell">
          <RegimeBadge regime={intel.regime} />
        </TableCell>
        <TableCell className="text-right pr-6">
          <div className="flex items-center justify-end gap-4">
            <div className="hidden xl:flex flex-col items-end w-24">
              <div className="flex justify-between w-full text-[7px] font-bold text-muted-foreground uppercase mb-1">
                <span>Fair Range</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full relative overflow-hidden">
                <div className="absolute bg-primary/40 h-full" style={{ left: `${intel.fairLow * 100}%`, right: `${(1 - intel.fairHigh) * 100}%` }} />
                <div className="absolute w-1 h-full bg-accent" style={{ left: `${(market.priceProb || 0.5) * 100}%` }} />
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0 rounded-full">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow className="bg-black/20 border-b border-white/5">
          <TableCell colSpan={7} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-top-2">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Target className="w-4 h-4" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Stance Basis</h4>
                </div>
                <div className="bg-background/50 p-4 rounded-xl border border-white/5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Model Edge</span>
                    <span className="text-sm font-black font-mono text-accent">+{ (intel.edge * 100).toFixed(2) }%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">Direction</span>
                    <Badge variant="outline" className="font-black text-[10px]">{intel.direction || 'WAITING'}</Badge>
                  </div>
                  <p className="text-[10px] italic text-muted-foreground leading-relaxed">
                    "{intel.rationale}"
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-accent">
                  <Activity className="w-4 h-4" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">GAD Structural Risk</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-background/50 rounded-xl border border-white/5">
                    <span className="text-[8px] text-muted-foreground uppercase font-black block mb-1">Stress (λt)</span>
                    <div className="text-sm font-black font-mono">{(intel.lambda).toFixed(4)}</div>
                  </div>
                  <div className="p-3 bg-background/50 rounded-xl border border-white/5">
                    <span className="text-[8px] text-muted-foreground uppercase font-black block mb-1">Jump Prob</span>
                    <div className="text-sm font-black font-mono">{(intel.jumpProb).toFixed(4)}</div>
                  </div>
                </div>
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                  <span className="text-[8px] text-primary uppercase font-black block mb-1">Confidence Band</span>
                  <div className="text-xs font-bold font-mono">${intel.fairLow.toFixed(3)} - ${intel.fairHigh.toFixed(3)}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Scale className="w-4 h-4" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest">TQS Execution Gate</h4>
                </div>
                <div className="p-4 bg-background/50 rounded-xl border border-white/5 space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">TQS Scalar</span>
                      <div className="text-2xl font-black font-mono text-accent">{(intel.tqs ?? 0).toFixed(0)}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[9px] font-black text-muted-foreground uppercase">Gate Status</span>
                      <Badge className={cn("text-[9px] font-black", (intel.tqs ?? 0) >= intel.convictionFloor ? "bg-accent text-accent-foreground" : "bg-destructive")}>
                        {(intel.tqs ?? 0) >= intel.convictionFloor ? 'PASS' : 'FAIL'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground">
                      <span>Conviction Floor</span>
                      <span>{intel.convictionFloor}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-1000" style={{ width: `${Math.min(100, ((intel.tqs ?? 0) / 100) * 100)}%` }} />
                    </div>
                  </div>
                  <Button className="w-full h-8 text-[9px] font-black uppercase tracking-widest gap-2" asChild>
                    <Link href={`/intelligence/${market.id}`}>Launch Full Audit <ArrowRight className="w-3.5 h-3.5" /></Link>
                  </Button>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function EventGroup({ 
  event, 
  markets, 
  onSelectMarketForHero, 
  selectedId 
}: { 
  event: Event, 
  markets: Market[], 
  onSelectMarketForHero?: (m: Market) => void, 
  selectedId?: string 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow 
        className="bg-muted/20 hover:bg-muted/30 border-b border-white/5 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <TableCell className="pl-6">
          <div className="p-1.5 bg-primary/10 rounded border border-primary/20 text-primary w-fit">
            {isExpanded ? <FolderOpen className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
          </div>
        </TableCell>
        <TableCell colSpan={5}>
          <div className="flex flex-col text-left">
            <h3 className="text-sm font-black uppercase italic text-primary group-hover:text-primary/80 transition-colors">
              {event.title}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[7px] h-3.5 border-white/10 uppercase opacity-50">{event.venue}</Badge>
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{event.category}</span>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right pr-6">
          <div className="flex items-center justify-end gap-4">
            <Badge className="bg-primary/20 text-primary border-primary/30 text-[8px] font-black px-2">
              {markets.length} NODES
            </Badge>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground/40" /> : <ChevronDown className="w-4 h-4 text-muted-foreground/40" />}
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && markets.map(m => (
        <MarketRow 
          key={m.id} 
          market={m} 
          isChild={true}
          isSelected={selectedId === m.id}
          onSelectMarketForHero={onSelectMarketForHero}
        />
      ))}
    </>
  );
}

export function MarketsTable({ 
  filters,
  terminalView = false,
  viewMode = 'markets',
  onSelectMarketForHero,
  selectedId
}: { 
  filters?: {
    searchTerm?: string;
    activeCategory?: string;
    venueFilter?: 'all' | 'polymarket' | 'kalshi';
  },
  terminalView?: boolean;
  viewMode?: 'events' | 'markets';
  onSelectMarketForHero?: (m: Market) => void;
  selectedId?: string;
}) {
  const firestore = useFirestore()
  
  const eventsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'events'), limit(1000)) : null, [firestore]);
  const { data: events, isLoading: isEventsLoading } = useCollection<Event>(eventsQuery);

  const marketsQuery = useMemoFirebase(
    () =>
      firestore
        ? query(
            collection(firestore, 'markets'),
            where('status', '==', 'open'),
            orderBy('volume', 'desc'),
            limit(5000)
          )
        : null,
    [firestore]
  );
  const { data: markets, isLoading: isMarketsLoading } = useCollection<Market>(marketsQuery);

  const filteredMarkets = useMemo(() => {
    if (!markets) return [];
    const search = (filters?.searchTerm || '').toLowerCase();
    const cat = filters?.activeCategory || 'all-markets';
    const venue = filters?.venueFilter || 'all';

    return markets.filter(m => {
      const matchesSearch = !search || 
        (m.searchText && m.searchText.includes(search)) ||
        m.title.toLowerCase().includes(search) || 
        m.category.toLowerCase().includes(search) || 
        m.venueMarketId.toLowerCase().includes(search);
      const matchesCat = cat === 'all-markets' || cat === 'all' || m.category.toLowerCase().includes(cat.toLowerCase());
      const matchesVenue = venue === 'all' || m.venue.toLowerCase() === venue.toLowerCase();
      return matchesSearch && matchesCat && matchesVenue;
    });
  }, [markets, filters]);

  const groupedData = useMemo(() => {
    if (viewMode !== 'events' || !events) return [];
    
    console.log('[EVENTS VIEW] Starting grouping...');
    console.log('[EVENTS VIEW] Total events:', events.length);
    console.log('[EVENTS VIEW] Total filtered markets:', filteredMarkets.length);
    
    // Count Kalshi markets and events
    const kalshiMarkets = filteredMarkets.filter(m => m.venue === 'kalshi');
    const kalshiEvents = events.filter(e => e.venue === 'kalshi');
    console.log('[EVENTS VIEW] Kalshi markets:', kalshiMarkets.length);
    console.log('[EVENTS VIEW] Kalshi events:', kalshiEvents.length);
    
    // Sample first 3 Kalshi markets to check eventId
    kalshiMarkets.slice(0, 3).forEach((m, i) => {
      console.log(`[KALSHI MARKET ${i}] id: ${m.id}, eventId: ${m.eventId}, title: ${m.title}`);
    });
    
    // Sample first 3 Kalshi events
    kalshiEvents.slice(0, 3).forEach((e, i) => {
      console.log(`[KALSHI EVENT ${i}] id: ${e.id}, title: ${e.title}`);
    });
    
    const eventMap: Record<string, { event: Event, markets: Market[] }> = {};
    
    // Debug: Count unique eventIds in markets
    const uniqueEventIds = new Set<string>();
    const kalshiEventIdsInMarkets = new Set<string>();
    filteredMarkets.forEach(m => {
      if (m.eventId) uniqueEventIds.add(m.eventId);
      if (m.venue === 'kalshi' && m.eventId) kalshiEventIdsInMarkets.add(m.eventId);
    });
    console.log(`[EVENTS VIEW] Unique eventIds in markets: ${uniqueEventIds.size}`);
    console.log(`[EVENTS VIEW] Kalshi eventIds in markets: ${kalshiEventIdsInMarkets.size}`);
    console.log(`[EVENTS VIEW] Sample Kalshi eventIds:`, Array.from(kalshiEventIdsInMarkets).slice(0, 5));
    
    filteredMarkets.forEach(m => {
      const eId = m.eventId;
      if (!eId) {
        if (m.venue === 'kalshi') {
          console.log(`[SKIP] Kalshi market ${m.id} has no eventId`);
        }
        return;
      }
      
      if (!eventMap[eId]) {
        const foundEvent = events.find(e => e.id === eId);
        if (foundEvent) {
          eventMap[eId] = { event: foundEvent, markets: [] };
          if (foundEvent.venue === 'kalshi') {
            console.log(`[MATCH] Created group for Kalshi event: ${eId}`);
          }
        } else {
          if (m.venue === 'kalshi') {
            console.log(`[NO MATCH] Kalshi market ${m.id} has eventId ${eId} but no matching event found in ${events.length} events`);
          }
        }
      }
      if (eventMap[eId]) {
        eventMap[eId].markets.push(m);
      }
    });
    
    const grouped = Object.values(eventMap)
      .filter(group => group.markets.length > 0)
      .sort((a, b) => {
        const volA = a.markets.reduce((acc, m) => acc + (m.volume || 0), 0);
        const volB = b.markets.reduce((acc, m) => acc + (m.volume || 0), 0);
        return volB - volA;
      });
    
    const kalshiGroups = grouped.filter(g => g.event.venue === 'kalshi');
    console.log(`[EVENTS VIEW] Total groups: ${grouped.length}, Kalshi groups: ${kalshiGroups.length}`);
    
    return grouped;
  }, [filteredMarkets, events, viewMode]);

  const isLoading = isMarketsLoading || (viewMode === 'events' && isEventsLoading);

  if (isLoading) return <div className="py-20 text-center flex flex-col items-center gap-4">
    <Loader2 className="animate-spin h-8 w-8 text-primary opacity-20" />
    <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Synchronizing Matrix...</span>
  </div>;

  return (
    <div className="w-full rounded-xl border bg-card/30 shadow-2xl backdrop-blur-sm overflow-hidden text-left">
      <Table>
        <TableHeader className="bg-[#0A0C12] border-b-2 border-white/5">
          <TableRow>
            <TableHead className="w-16 text-[10px] uppercase font-black pl-6">Venue</TableHead>
            <TableHead className="text-[10px] uppercase font-black">Market Node</TableHead>
            <TableHead className="text-[10px] uppercase font-black">Prob</TableHead>
            <TableHead className="text-[10px] uppercase font-black">Stance</TableHead>
            <TableHead className="hidden md:table-cell text-[10px] uppercase font-black">TQS</TableHead>
            <TableHead className="hidden lg:table-cell text-[10px] uppercase font-black">Regime</TableHead>
            <TableHead className="text-right pr-6 text-[10px] uppercase font-black">Visual Basis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {viewMode === 'events' ? (
            groupedData.length > 0 ? (
              groupedData.map(group => (
                <EventGroup 
                  key={group.event.id} 
                  event={group.event} 
                  markets={group.markets} 
                  selectedId={selectedId}
                  onSelectMarketForHero={onSelectMarketForHero}
                />
              ))
            ) : (
              <TableRow><TableCell colSpan={7} className="h-64 text-center opacity-20"><Waves className="mx-auto mb-4" /><p className="text-[10px] font-black uppercase">No Discovery Hits</p></TableCell></TableRow>
            )
          ) : (
            filteredMarkets.length > 0 ? (
              filteredMarkets.map(m => (
                <MarketRow 
                  key={m.id} 
                  market={m} 
                  isSelected={selectedId === m.id}
                  onSelectMarketForHero={onSelectMarketForHero}
                />
              ))
            ) : (
              <TableRow><TableCell colSpan={7} className="h-64 text-center opacity-20"><Waves className="mx-auto mb-4" /><p className="text-[10px] font-black uppercase">No Discovery Hits</p></TableCell></TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}
