'use client';

import { useState, useEffect, useMemo } from 'react';
import { MarketsTable } from '@/app/markets/markets-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  Maximize2, 
  Search, 
  LayoutDashboard,
  Layers,
  Activity,
  Globe,
  Database,
  ArrowRight,
  BookOpen,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Market, Event } from '@/lib/types';
import { HeroMarket } from '@/components/terminal/hero-market';
import { cn } from '@/lib/utils';
import { ProtocolStep } from '@/components/intelligence/ProtocolStep';
import { IntelligenceProtocolSOP } from '@/components/intelligence/IntelligenceProtocolSOP';
import { buildVenueUrl } from '@/lib/venue-url';

export default function TerminalDashboardPage() {
  const firestore = useFirestore();
  const [selectedHeroMarket, setSelectedHeroMarket] = useState<Market | null>(null);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all-markets');
  const [viewMode, setViewMode] = useState<'events' | 'markets'>('events');
  const [venueFilter, setVenueFilter] = useState<'all' | 'polymarket' | 'kalshi'>('all');

  // Fetch top market for hero basis
  const topMarketQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'markets'), where('status', '==', 'open'), orderBy('volume', 'desc'), limit(1)) : null,
    [firestore]
  );
  const { data: topMarkets } = useCollection<Market>(topMarketQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (topMarkets && topMarkets.length > 0 && !selectedHeroMarket) {
      setSelectedHeroMarket(topMarkets[0]);
    }
  }, [topMarkets, selectedHeroMarket]);

  const handleMarketSelection = (market: Market) => {
    setSelectedHeroMarket(market);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { id: 'all-markets', label: 'Global Matrix' },
    { id: 'politics', label: 'Politics' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'finance', label: 'Finance' },
    { id: 'economics', label: 'Economics' },
    { id: 'tech', label: 'Tech' },
    { id: 'world', label: 'World' },
    { id: 'science', label: 'Science' },
    { id: 'culture', label: 'Culture' },
    { id: 'weather', label: 'Weather' },
  ];

  const autoTradeHref = selectedHeroMarket
    ? buildVenueUrl({
        venue: selectedHeroMarket.venue,
        venueMarketId: selectedHeroMarket.venueMarketId,
        venueUrl: selectedHeroMarket.venueUrl,
      })
    : '#';

  if (!mounted) {
    return (
      <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-4 text-left">
        <div className="h-96 w-full rounded-xl border border-dashed border-white/10 bg-card/20" />
        <div className="h-40 w-full rounded-xl border border-dashed border-white/10 bg-card/20" />
        <div className="h-[520px] w-full rounded-xl border border-dashed border-white/10 bg-card/20" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-[1600px] mx-auto px-4 text-left">
      {/* 1. INTELLIGENCE HERO */}
      {selectedHeroMarket ? (
        <HeroMarket market={selectedHeroMarket} />
      ) : (
        <div className="h-96 w-full rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center opacity-20 space-y-4">
          <Zap className="w-12 h-12" />
          <p className="text-sm font-black uppercase tracking-[0.5em]">Initializing Discovery Basis...</p>
        </div>
      )}

      {/* 2. COMMAND BAR */}
      <div className="bg-card border border-white/5 rounded-xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="F SEARCH THE HIERARCHICAL MATRIX..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-background/50 border-white/10 text-sm font-bold uppercase tracking-widest"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2">
              <IntelligenceProtocolSOP />
            </div>
            <Button variant="outline" className="h-12 text-[10px] font-black uppercase border-white/10 gap-2 px-6" asChild>
              <Link href="/terminal-pro"><Maximize2 className="w-4 h-4" /> Full Screen Pro</Link>
            </Button>
            <Button
              className="h-12 text-[10px] font-black uppercase gap-2 shadow-lg shadow-primary/20 px-6"
              asChild
              disabled={!selectedHeroMarket}
            >
              <a href={autoTradeHref} target="_blank" rel="noopener noreferrer">
                <Zap className="w-4 h-4 fill-current" /> Auto-Trade
              </a>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between border-t border-white/5 pt-4 gap-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <LayoutDashboard className="w-3 h-3" /> Matrix Mode
              </span>
              <div className="flex items-center gap-1 bg-background/50 border border-white/10 rounded-lg p-1 group hover:border-primary/30 transition-all">
                <button 
                  onClick={() => setViewMode('events')} 
                  className={cn(
                    "text-[8px] font-black px-3 py-1.5 rounded uppercase transition-all", 
                    viewMode === 'events' ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Hierarchical
                </button>
                <button 
                  onClick={() => setViewMode('markets')} 
                  className={cn(
                    "text-[8px] font-black px-3 py-1.5 rounded uppercase transition-all", 
                    viewMode === 'markets' ? "bg-accent text-accent-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Flat Matrix
                </button>
              </div>
            </div>

            <div className="h-4 w-px bg-white/5 hidden md:block" />

            {/* VENUE FILTER SWITCH */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <Filter className="w-3 h-3" /> Venue Decoder
              </span>
              <div className="flex items-center gap-1 bg-background/50 border border-white/10 rounded-lg p-1 group hover:border-primary/30 transition-all">
                <button 
                  onClick={() => setVenueFilter('all')} 
                  className={cn(
                    "text-[8px] font-black px-3 py-1.5 rounded uppercase transition-all", 
                    venueFilter === 'all' ? "bg-white/10 text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  All
                </button>
                <button 
                  onClick={() => setVenueFilter('polymarket')} 
                  className={cn(
                    "text-[8px] font-black px-3 py-1.5 rounded uppercase transition-all", 
                    venueFilter === 'polymarket' ? "bg-primary/20 text-primary shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Polymarket
                </button>
                <button 
                  onClick={() => setVenueFilter('kalshi')} 
                  className={cn(
                    "text-[8px] font-black px-3 py-1.5 rounded uppercase transition-all", 
                    venueFilter === 'kalshi' ? "bg-accent/20 text-accent shadow-lg" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Kalshi
                </button>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="h-4 w-px bg-white/5" />
              <div className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Multi-Venue Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <Database className="w-3 h-3 text-accent" />
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Oracle Verified</span>
              </div>
            </div>
          </div>
          
          <Badge variant="outline" className="text-[9px] font-black uppercase border-accent/20 text-accent bg-accent/5">
            Active Ingestion Node: GLOBAL_SWEEP
          </Badge>
        </div>
      </div>

      {/* 3. MATRIX TABLE */}
      <div className="w-full border border-white/5 bg-card/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#0A0C12] h-14 flex items-center justify-between px-0 w-full rounded-none border-b border-white/5">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="flex-1 bg-transparent text-[10px] font-black uppercase tracking-[0.2em] border-none data-[state=active]:text-primary data-[state=active]:shadow-[inset_0_-2px_0_0_hsl(var(--primary))] rounded-none px-0 pb-2 h-full transition-all hover:bg-white/5"
              >
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="p-0">
          <MarketsTable 
            terminalView={true} 
            viewMode={viewMode}
            onSelectMarketForHero={handleMarketSelection}
            selectedId={selectedHeroMarket?.id}
            filters={{ 
              searchTerm, 
              activeCategory: activeTab,
              venueFilter
            }}
          />
        </div>
      </div>

      {/* PROTOCOL NEXT STEP: Step 3 -> Step 4 */}
      <div className="max-w-2xl">
        <ProtocolStep 
          step={3}
          totalSteps={4}
          title="Terminal Observation"
          description="You are observing live probability discovery. The final protocol step is to understand the mathematical framework behind these curves."
          nextStepLabel="Review Intelligence Briefing"
          nextStepHref="/docs"
          icon={BookOpen}
        />
      </div>

      {/* 4. FOOTER STATUS */}
      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 opacity-40">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em]">
          <span>Intelligence Layer v4.2</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Multi-Venue Verified</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Subscriber Key Valid</span>
        </div>
        <p className="text-[8px] text-center max-w-md font-medium leading-relaxed italic">
          "The hierarchical terminal organizes sub-second market data into logical discovery nodes. Relationships between parent events and child markets are maintained via the Optic Sync Protocol."
        </p>
      </footer>
    </div>
  );
}
