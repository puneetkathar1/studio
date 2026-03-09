'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, limit, where, doc } from 'firebase/firestore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  ArrowLeft, 
  Database, 
  BarChart3, 
  Cpu, 
  Loader2, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Waves,
  Maximize2,
  Clock,
  Target,
  BrainCircuit,
  Info,
  Bell,
  BellRing,
  Settings2,
  Layers,
  ArrowRight,
  ShieldAlert,
  Globe,
  Monitor,
  History,
  FolderOpen,
  ChevronDown,
  ChevronUp,
  Radar,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildVenueUrl } from '@/lib/venue-url';
import { TickerTape } from '@/components/terminal/ticker-tape';
import { Market, PublicLedgerEntry, WatchlistItem, Event } from '@/lib/types';
import { useCountdown } from '@/hooks/use-countdown';
import Link from 'next/link';
import { IntelligenceScorecard } from '@/app/markets/intelligence-dialog';
import { AnalysisDialog } from '@/app/markets/analysis-dialog';
import { WatchlistSidebar } from '@/components/intelligence/WatchlistSidebar';
import { AlertConfigDialog } from '@/components/intelligence/AlertConfigDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useDoc } from '@/firebase/firestore/use-doc';

const CATEGORY_MAP: Record<string, string[]> = {
  "politics": ["politics", "elections", "government", "trump", "white house", "policy", "election"],
  "crypto": ["crypto", "cryptocurrency", "bitcoin", "ethereum", "digital assets", "blockchain", "web3"],
  "finance": ["finance", "business", "stocks", "markets", "wall street", "banking"],
  "economics": ["economics", "economy", "macro", "inflation", "gdp", "fed"],
  "tech": ["tech", "technology", "ai", "artificial intelligence", "software", "silicon valley"],
  "culture": ["culture", "entertainment", "movies", "music", "pop culture", "media", "entertainment"],
  "science": ["science", "health", "biotech", "medical"],
  "sports": ["sports", "nba", "nfl", "mlb", "soccer", "basketball", "football"],
  "world": ["world", "global", "international", "geopolitics", "europe", "asia"],
  "weather": ["weather", "climate", "environment", "hurricane", "temperature"],
  "general": ["general", "other", "misc", "miscellaneous"]
};

function VenueIcon({ venue }: { venue: string }) {
  const isPoly = venue.toLowerCase() === 'polymarket';
  return (
    <div className={cn(
      "relative flex aspect-square w-6 h-6 items-center justify-center rounded border font-black shrink-0 transition-all",
      isPoly ? "border-primary/30 bg-primary/10 text-primary" : "border-blue-500/30 bg-blue-500/10 text-blue-400"
    )}>
      {isPoly ? 'P' : 'K'}
      <span className={cn(
        "absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full animate-pulse",
        isPoly ? "bg-accent shadow-[0_0_8px_hsl(var(--accent))]" : "bg-blue-400 shadow-[0_0_8px_#60a5fa]"
      )} />
    </div>
  );
}

function GlobalMatrixSnapshot({ count, activeCategory }: { count: number, activeCategory: string }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded border border-primary/20">
            <Globe className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em]">Global Matrix</h3>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Aggregate Intelligence Basis</p>
          </div>
        </div>
        
        <div className="bg-white/[0.02] border border-white/5 rounded-xl p-5 space-y-4 shadow-inner">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Nodes Synced</span>
              <div className="text-2xl font-black font-mono text-foreground">{count}</div>
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Active Category</span>
              <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase">{activeCategory}</Badge>
            </div>
          </div>
          <div className="pt-4 border-t border-white/5">
            <div className="flex justify-between items-center text-[9px] font-black uppercase mb-2">
              <span className="text-muted-foreground">Cluster Sync Health</span>
              <span className="text-accent">99.98% Nominal</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-1000" style={{ width: '99.98%' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-accent">
          <TrendingUp className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Alpha Concentration</h3>
        </div>
        <div className="space-y-2">
          {[
            { label: 'Politics', val: '84%', color: 'bg-accent' },
            { label: 'Crypto', val: '72%', color: 'bg-primary' },
            { label: 'Economics', val: '45%', color: 'bg-primary/40' },
            { label: 'Tech', val: '38%', color: 'bg-primary/20' }
          ].map((item) => (
            <div key={item.label} className="p-3 bg-black/20 border border-white/5 rounded flex justify-between items-center group hover:border-accent/30 transition-all">
              <span className="text-[10px] font-bold uppercase italic">{item.label}</span>
              <div className="flex items-center gap-3">
                <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full", item.color)} style={{ width: item.val }} />
                </div>
                <span className="text-[10px] font-mono font-black">{item.val}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <ShieldCheck className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">System Status</h3>
        </div>
        <div className="bg-[#0A0C12] border border-white/10 rounded-xl p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Cpu className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold leading-tight">TQS SCALAR: theta_bet crossed in 12 nodes.</p>
              <p className="text-[8px] text-muted-foreground uppercase font-black">Execution Readiness Level: HIGH</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Activity className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-[10px] font-bold leading-tight">MATRIX DRIFT: Non-linear pressure in Politics cluster.</p>
              <p className="text-[8px] text-muted-foreground uppercase font-black">Scanning Behavioral Mode fingerprints...</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
        <p className="text-[9px] text-muted-foreground leading-relaxed italic text-center px-4">
          Select a node from the matrix to initialize a deep-dive audit and initiate execution sequences.
        </p>
        <div className="flex justify-center">
          <Waves className="w-12 h-8 text-primary/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function MarketsTerminalPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'events' | 'markets'>('events');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [tick, setTick] = useState(0);

  const firestore = useFirestore();
  const { user } = useUser();

  const eventsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'events'), orderBy('updatedAt', 'desc'), limit(500)) : null, [firestore]);
  const { data: events, isLoading: isEventsLoading } = useCollection<Event>(eventsQuery);

  const marketsQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'markets'), where('status', '==', 'open'), orderBy('volume', 'desc'), limit(1000)) : null, [firestore]);
  const { data: markets, isLoading: isMarketsLoading } = useCollection<Market>(marketsQuery);

  const ledgerQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(20)) : null, [firestore]);
  const { data: ledgerEntries } = useCollection<PublicLedgerEntry>(ledgerQuery);

  const watchlistQuery = useMemoFirebase(() => (firestore && user ? collection(firestore, 'users', user.uid, 'watchlist') : null), [firestore, user]);
  const { data: watchlist } = useCollection<WatchlistItem>(watchlistQuery);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const categories = ["all", "Politics", "Crypto", "Finance", "Economics", "Tech", "Science", "Culture", "Sports", "World", "Weather", "General"];

  const filteredMarkets = useMemo(() => {
    if (!markets) return [];
    const activeSearch = search.trim().toLowerCase();

    return markets.filter(m => {
      const parentEvent = events?.find(e => e.id === m.eventId);
      const mTitle = m.title.toLowerCase();
      const mCat = (m.category || 'general').toLowerCase();
      const eTitle = (parentEvent?.title || '').toLowerCase();
      
      const matchesSearch = !activeSearch || 
        mTitle.includes(activeSearch) || 
        mCat.includes(activeSearch) || 
        eTitle.includes(activeSearch) ||
        m.venueMarketId.toLowerCase().includes(activeSearch);

      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      const catKey = activeCategory.toLowerCase();
      const allowedAliases = CATEGORY_MAP[catKey] || [catKey];
      
      return allowedAliases.some(alias => 
        mCat.includes(alias) || alias.includes(mCat) || mTitle.includes(alias) || eTitle.includes(alias)
      );
    });
  }, [markets, events, search, activeCategory]);

  const groupedData = useMemo(() => {
    if (viewMode !== 'events') return [];
    const eventMap: Record<string, { event: Event | null, markets: Market[] }> = {};
    
    filteredMarkets.forEach(m => {
      const eId = m.eventId || `unassigned_${m.venue}`;
      if (!eventMap[eId]) {
        eventMap[eId] = { event: events?.find(e => e.id === eId) || null, markets: [] };
      }
      eventMap[eId].markets.push(m);
    });

    return Object.values(eventMap).sort((a, b) => {
      const volA = a.markets.reduce((acc, m) => acc + (m.volume || 0), 0);
      const volB = b.markets.reduce((acc, m) => acc + (m.volume || 0), 0);
      return volB - volA;
    });
  }, [filteredMarkets, events, viewMode]);

  const selectedMarket = useMemo(() => markets?.find(m => m.id === selectedId) || null, [markets, selectedId]);
  const isWatched = useMemo(() => watchlist?.some(w => w.marketId === selectedId), [watchlist, selectedId]);

  const toggleEvent = (id: string) => {
    const next = new Set(expandedEvents);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedEvents(next);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const list = filteredMarkets;
      const idx = list.findIndex(m => m.id === selectedId);
      if (idx < list.length - 1) setSelectedId(list[idx + 1].id);
      else if (selectedId === null && list.length > 0) setSelectedId(list[0].id);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const list = filteredMarkets;
      const idx = list.findIndex(m => m.id === selectedId);
      if (idx > 0) setSelectedId(list[idx - 1].id);
    } else if (e.key === 'f') {
      e.preventDefault();
      document.getElementById('matrix-search')?.focus();
    }
  }, [filteredMarkets, selectedId]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 bg-[#05070A] text-[#E0E0E0] font-mono flex flex-col overflow-hidden select-none z-[100]">
      <TickerTape entries={ledgerEntries || []} />

      <div className="h-12 border-b border-white/5 bg-[#0A0C12] px-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/5" asChild>
            <Link href="/terminal"><ArrowLeft className="w-4 h-4" /></Link>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-xs font-black text-primary-foreground">M</div>
            <span className="hidden xs:inline-block text-xs font-black tracking-tighter uppercase">Hierarchical Matrix Terminal</span>
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-black uppercase text-accent tracking-widest hidden xs:inline-block">Live Optic Sync</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-8">
          <div className="hidden md:flex items-center gap-2 bg-background/50 border border-white/10 rounded-lg p-1 group hover:border-primary/30 transition-all">
            <button onClick={() => setViewMode('events')} className={cn("text-[8px] font-black px-2 py-1 rounded uppercase", viewMode === 'events' ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>Hierarchy</button>
            <button onClick={() => setViewMode('markets')} className={cn("text-[8px] font-black px-2 py-1 rounded uppercase", viewMode === 'markets' ? "bg-accent text-accent-foreground" : "text-muted-foreground")}>Flat</button>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest hidden sm:block">Filtered Nodes</span>
            <span className="text-[10px] sm:text-xs font-bold font-mono">{filteredMarkets.length} SYNCED</span>
          </div>
          <div className="h-8 w-px bg-white/10 hidden sm:block" />
          <Clock className="w-4 h-4 text-muted-foreground hidden xs:block" />
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* MOBILE CATEGORY SCROLLER */}
        <div className="lg:hidden p-2 bg-[#080A0F] border-b border-white/5 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {categories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={cn("px-3 h-8 rounded text-[8px] font-black uppercase whitespace-nowrap border border-white/5", activeCategory === cat ? "bg-primary text-white" : "bg-white/5 text-muted-foreground")}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex w-64 border-r border-white/5 bg-[#080A0F] flex flex-col shrink-0">
          <Tabs defaultValue="filters" className="flex-1 flex flex-col h-full">
            <TabsList className="bg-transparent border-b border-white/5 rounded-none p-0 h-10 w-full">
              <TabsTrigger value="filters" className="flex-1 text-[9px] font-black uppercase rounded-none h-full data-[state=active]:bg-white/5">Discovery</TabsTrigger>
              <TabsTrigger value="watchlist" className="flex-1 text-[9px] font-black uppercase rounded-none h-full data-[state=active]:bg-white/5 gap-2">
                Watchlist {watchlist && watchlist.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="filters" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
              <div className="p-4 border-b border-white/5 space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                  <input 
                    id="matrix-search"
                    placeholder="F SEARCH MATRIX..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-8 bg-white/[0.03] border border-white/5 rounded text-[9px] pl-7 focus:outline-none focus:border-primary/50 uppercase font-bold"
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all",
                        activeCategory === cat 
                          ? "bg-primary text-primary-foreground shadow-lg" 
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="watchlist" className="flex-1 flex flex-col m-0 data-[state=inactive]:hidden">
              <WatchlistSidebar />
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 bg-[#05070A] overflow-hidden flex flex-col min-w-0">
          <div className="h-8 bg-[#0A0C12]/50 border-b border-white/5 flex items-center px-4 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground shrink-0">
            <div className="w-10 sm:w-12">Venue</div>
            <div className="flex-1">Intelligence Target Cluster</div>
            <div className="w-16 sm:w-24 text-right">Chance</div>
            <div className="hidden xs:block w-24 text-right">Vol (30D)</div>
            <div className="hidden md:block w-24 text-right pr-4">Node Hash</div>
          </div>
          <ScrollArea className="flex-1">
            <div className="divide-y divide-white/5">
              {isMarketsLoading || isEventsLoading ? (
                <div className="p-20 text-center flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20">Synchronizing Matrix...</span>
                </div>
              ) : viewMode === 'events' ? (
                groupedData.map((group, idx) => {
                  const e = group.event || { id: `unassigned-${idx}`, title: `${group.markets[0].venue.toUpperCase()} Uncategorized`, venue: group.markets[0].venue } as any;
                  const isExpanded = expandedEvents.has(e.id);
                  return (
                    <div key={e.id} className="flex flex-col">
                      <div 
                        onClick={() => toggleEvent(e.id)}
                        className="h-12 sm:h-14 flex items-center px-4 cursor-pointer bg-muted/20 hover:bg-muted/30 border-b border-white/5 transition-all group"
                      >
                        <div className="w-10 sm:w-12">
                          <VenueIcon venue={e.venue} />
                        </div>
                        <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
                          <div className="p-1 sm:p-1.5 bg-primary/10 rounded border border-primary/20 text-primary shrink-0">
                            {isExpanded ? <FolderOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[11px] sm:text-[13px] font-black uppercase italic text-primary group-hover:text-primary/80 truncate">{e.title}</span>
                            <Badge variant="outline" className="text-[6px] sm:text-[7px] h-3 px-1 w-fit opacity-50 uppercase">{e.category || 'General'}</Badge>
                          </div>
                        </div>
                        <div className="w-16 sm:w-24 text-right">
                          <Badge className="bg-primary/20 text-primary border-primary/30 text-[7px] sm:text-[8px] font-black px-1.5 sm:px-2 uppercase">
                            {group.markets.length} NODES
                          </Badge>
                        </div>
                        <div className="w-8 sm:w-24 text-right">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-auto opacity-20" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto opacity-20" />}
                        </div>
                      </div>
                      {isExpanded && group.markets.map(m => (
                        <div 
                          key={m.id}
                          onClick={() => setSelectedId(m.id)}
                          className={cn(
                            "h-10 sm:h-12 flex items-center px-4 cursor-pointer transition-all border-l-[8px] sm:border-l-[12px] border-b border-white/5",
                            selectedId === m.id ? "bg-primary/10 border-l-primary" : "hover:bg-white/[0.02] border-l-muted/20"
                          )}
                        >
                          <div className="w-6 sm:w-8" />
                          <div className="flex-1 flex flex-col min-w-0 pr-4 pl-2 sm:pl-4 border-l border-white/5">
                            <span className={cn(
                              "text-[10px] sm:text-[11px] font-bold truncate group-hover:text-primary transition-colors",
                              selectedId === m.id ? "text-primary" : "text-foreground/80"
                            )}>
                              {m.title}
                            </span>
                            <span className="text-[7px] sm:text-[8px] font-black uppercase text-muted-foreground tracking-tighter">
                              NODE_{(m.venueMarketId || m.id).slice(-8)}
                            </span>
                          </div>
                          <div className="w-16 sm:w-24 text-right">
                            <span className={cn(
                              "text-[10px] sm:text-[11px] font-mono font-black",
                              (m.priceProb || 0.5) > 0.5 ? "text-accent" : "text-destructive"
                            )}>
                              {((m.priceProb || 0.5) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="hidden xs:block w-24 text-right text-[10px] font-mono font-bold text-primary">
                            ${((m.volume || 0) / 1000).toFixed(1)}K
                          </div>
                          <div className="hidden md:block w-24 text-right text-[9px] font-black text-muted-foreground opacity-40 uppercase pr-4">
                            X-{(m.venueMarketId || m.id).slice(-4)}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })
              ) : (
                filteredMarkets.map((m) => {
                  const isSelected = selectedId === m.id;
                  const prob = (m.priceProb || 0.5) * 100;
                  return (
                    <div 
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                      className={cn(
                        "h-12 flex items-center px-4 cursor-pointer transition-all border-l-2",
                        isSelected ? "bg-primary/10 border-l-primary" : "hover:bg-white/[0.02] border-l-transparent"
                      )}
                    >
                      <div className="w-10 sm:w-12">
                        <VenueIcon venue={m.venue} />
                      </div>
                      <div className="flex-1 flex flex-col min-w-0 pr-4">
                        <span className={cn(
                          "text-[11px] font-bold truncate",
                          isSelected ? "text-primary" : "text-foreground/80"
                        )}>
                          {m.title}
                        </span>
                        <span className="text-[8px] font-black uppercase text-muted-foreground tracking-tighter italic">{m.category}</span>
                      </div>
                      <div className="w-16 sm:w-24 text-right">
                        <span className={cn("text-[11px] font-mono font-black text-accent")}>
                          {prob.toFixed(1)}%
                        </span>
                      </div>
                      <div className="hidden xs:block w-24 text-right text-[10px] font-mono font-bold text-primary">${((m.volume || 0) / 1000).toFixed(1)}K</div>
                      <div className="hidden md:block w-24 text-right text-[9px] font-black text-muted-foreground opacity-40 uppercase pr-4">NODE_{m.id.slice(-4)}</div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* DETAILS SIDEBAR - Stacks on mobile */}
        <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-white/5 bg-[#080A0F] flex flex-col p-4 sm:p-6 gap-6 sm:gap-8 overflow-y-auto no-scrollbar max-h-[50vh] lg:max-h-none shrink-0">
          {selectedMarket ? (
            <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/30 text-primary">
                    Target Intelligence
                  </Badge>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className={cn("h-7 text-[9px] font-black uppercase border px-2", isWatched ? "bg-primary/10 border-primary/30 text-primary" : "border-white/10")}>
                        {isWatched ? <BellRing className="w-3 h-3" /> : <Bell className="w-3 h-3" />} Alert
                      </Button>
                    </DialogTrigger>
                    <AlertConfigDialog market={selectedMarket} isWatched={isWatched} />
                  </Dialog>
                </div>
                <h2 className="text-lg sm:text-xl font-black font-headline tracking-tighter leading-tight uppercase italic line-clamp-3">{selectedMarket.title}</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 sm:p-3 bg-white/[0.02] border border-white/5 rounded">
                    <span className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Matrix Prob</span>
                    <span className="text-base sm:text-lg font-black font-mono text-accent">{((selectedMarket.priceProb || 0.5) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="p-2 sm:p-3 bg-white/[0.02] border border-white/5 rounded">
                    <span className="text-[7px] sm:text-[8px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Vol (30D)</span>
                    <span className="text-base sm:text-lg font-black font-mono text-primary">${((selectedMarket.volume || 0) / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <BrainCircuit className="w-4 h-4" />
                  <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Intelligence Node</h3>
                </div>
                <div className="bg-black/40 p-3 sm:p-4 rounded border border-white/5 italic text-[10px] sm:text-[11px] leading-relaxed text-foreground/90">
                  "Hierarchical discovery matrix indexing multi-factor metadata. Venue leg synchronization: ACTIVE."
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-6 border-t border-white/5 pb-4">
                <div className="flex gap-2">
                  <IntelligenceScorecard market={selectedMarket} />
                  <AnalysisDialog market={selectedMarket} />
                </div>
                <Button variant="outline" className="w-full text-[9px] sm:text-[10px] font-black uppercase border-white/10 hover:bg-white/5 h-10 gap-2" asChild>
                  <a
                    href={buildVenueUrl({
                      venue: selectedMarket.venue,
                      venueMarketId: selectedMarket.venueMarketId,
                      venueUrl: selectedMarket.venueUrl,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Venue Contract <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
                <Button className="w-full h-10 text-[9px] sm:text-[10px] font-black uppercase gap-2 shadow-lg shadow-primary/20" asChild>
                  <Link href={`/intelligence/${selectedMarket.id}`}>
                    Audit Journey <History className="w-3.5 h-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <GlobalMatrixSnapshot count={filteredMarkets.length} activeCategory={activeCategory} />
          )}
        </div>
      </div>

      <div className="h-8 bg-[#0A0C12] border-t border-white/5 flex items-center justify-between px-4 text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 shrink-0">
        <div className="flex gap-4 sm:gap-8">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-accent" />
            <span className="hidden sm:inline">Hierarchy Health: NOMINAL</span><span className="sm:hidden">HEALTHY</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" />
            <span className="hidden xs:inline">Optic Sync: 12ms</span><span className="xs:hidden">12ms</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-accent hidden sm:inline">Real-time Matrix Feed Active</span>
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
