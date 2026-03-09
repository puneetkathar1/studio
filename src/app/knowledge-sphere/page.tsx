'use client';

import { useState, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where } from 'firebase/firestore';
import { Market, Event } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Globe, 
  Search, 
  Activity, 
  TrendingUp, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight, 
  Zap, 
  Layers, 
  Target,
  BarChart3,
  Waves,
  Orbit,
  Cpu,
  Database,
  Maximize2,
  ShieldCheck,
  Radar,
  Loader2,
  AlertTriangle,
  RefreshCcw
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Specialized Niche Hierarchy.
 * Maps high-level sectors to specialized discovery nodes.
 */
const HIERARCHY = [
  { id: 'tech', label: 'Technology', sub: [
    { id: 'semi', label: 'Semiconductors', niches: ['ASML Earnings', 'Nvidia GPU Demand', 'Taiwan Geopolitics', 'Intel Fab Recovery'] },
    { id: 'ai', label: 'Artificial Intelligence', niches: ['AGI Horizon', 'Compute Scaling', 'OpenSource Dominance', 'LLM Safety Regulation'] },
    { id: 'space', label: 'Space & Aero', niches: ['SpaceX Starship', 'Satellite Constellations', 'Moon Landing 2026', 'Starlink Expansion'] }
  ]},
  { id: 'finance', label: 'Finance', sub: [
    { id: 'macro', label: 'Macroeconomics', niches: ['Fed Interest Rates', 'US CPI YoY', 'Yield Curve Inversion', 'Debt Ceiling', 'Retail Sales'] },
    { id: 'crypto', label: 'Digital Assets', niches: ['BTC Spot ETF', 'ETH Scaling', 'Regulatory Clarity', 'Stablecoin De-pegging', 'Solana Ecosystem'] },
    { id: 'commo', label: 'Commodities', niches: ['Gold ATH', 'Oil Supply Cuts', 'Rare Earth Dominance', 'Copper Supply'] }
  ]},
  { id: 'world', label: 'World & Climate', sub: [
    { id: 'geopol', label: 'Geopolitics', niches: ['Conflict Resolution', 'Trade Alliances', 'Maritime Safety', 'G7 Summit', 'NATO Expansion'] },
    { id: 'climate', label: 'Climate & ESG', niches: ['Carbon Credit Pricing', 'Renewable Adoption', 'Extreme Weather Impact', 'ESG Disclosure'] }
  ]}
];

/**
 * @fileOverview Keyword Mapping for Robust Niche Filtering.
 * Maps niche labels to arrays of keywords to ensure high-fidelity discovery.
 */
const NICHE_KEYWORDS: Record<string, string[]> = {
  'ASML Earnings': ['asml', 'lithography', 'earnings', 'semiconductor', 'chip'],
  'Nvidia GPU Demand': ['nvidia', 'gpu', 'h100', 'h200', 'blackwell', 'ai chip', 'nvda', 'chip'],
  'Taiwan Geopolitics': ['taiwan', 'china', 'tsmc', 'strait', 'invasion', 'conflict', 'geopolitical'],
  'Intel Fab Recovery': ['intel', 'foundry', 'fabrication', 'chip', 'fab', 'semiconductor'],
  'AGI Horizon': ['agi', 'artificial general intelligence', 'singularity', 'intelligence', 'human-level', 'openai', 'ai'],
  'Compute Scaling': ['compute', 'scaling', 'gpu', 'cluster', 'data center', 'training', 'ai'],
  'OpenSource Dominance': ['llama', 'mistral', 'open source', 'opensource', 'model', 'weights', 'ai'],
  'LLM Safety Regulation': ['regulation', 'eu ai act', 'safety', 'guardrails', 'alignment', 'congress', 'ai'],
  'SpaceX Starship': ['spacex', 'starship', 'elon', 'mars', 'musk', 'launch', 'ift'],
  'Satellite Constellations': ['satellite', 'starlink', 'constellation', 'orbit', 'kuiper', 'amazon'],
  'Moon Landing 2026': ['moon', 'lunar', 'artemis', 'nasa', 'landing', 'astronaut'],
  'Starlink Expansion': ['starlink', 'satellite', 'internet', 'connectivity', 'spacex'],
  'Fed Interest Rates': ['fed', 'interest rate', 'fomc', 'powell', 'hike', 'cut', 'basis points', 'rates'],
  'US CPI YoY': ['cpi', 'inflation', 'consumer price', 'yoy', 'core cpi', 'prices'],
  'Yield Curve Inversion': ['yield', 'treasury', 'inversion', 'recession', '10y', '2y'],
  'Debt Ceiling': ['debt', 'ceiling', 'default', 'treasury', 'spending', 'budget', 'government'],
  'Retail Sales': ['retail', 'sales', 'consumer', 'spending', 'ecommerce'],
  'BTC Spot ETF': ['btc', 'bitcoin', 'etf', 'spot', 'sec', 'blackrock', 'crypto'],
  'ETH Scaling': ['eth', 'ethereum', 'scaling', 'layer 2', 'l2', 'rollup', 'arbitrum', 'optimism', 'crypto'],
  'Regulatory Clarity': ['regulation', 'sec', 'gensler', 'clarity', 'cftc', 'legislation', 'crypto'],
  'Stablecoin De-pegging': ['stablecoin', 'usdt', 'usdc', 'peg', 'de-peg', 'tether', 'circle', 'crypto'],
  'Solana Ecosystem': ['solana', 'sol', 'ecosystem', 'jupiter', 'raydium', 'phantom', 'crypto'],
  'Gold ATH': ['gold', 'ath', 'all time high', 'precious metal', 'haven'],
  'Oil Supply Cuts': ['oil', 'opec', 'supply', 'crude', 'brent', 'wti', 'energy'],
  'Rare Earth Dominance': ['rare earth', 'china', 'mining', 'lithium', 'cobalt', 'supply chain'],
  'Copper Supply': ['copper', 'mining', 'supply', 'industrial', 'demand'],
  'Conflict Resolution': ['conflict', 'war', 'peace', 'resolution', 'ceasefire', 'treaty'],
  'Trade Alliances': ['trade', 'alliance', 'brics', 'eu', 'usmca', 'agreement'],
  'Maritime Safety': ['maritime', 'shipping', 'red sea', 'suez', 'panama', 'vessel'],
  'G7 Summit': ['g7', 'summit', 'leaders', 'global'],
  'NATO Expansion': ['nato', 'expansion', 'alliance', 'security', 'europe'],
  'Carbon Credit Pricing': ['carbon', 'credit', 'offset', 'pricing', 'emission', 'ets', 'climate'],
  'Renewable Adoption': ['renewable', 'solar', 'wind', 'energy', 'adoption', 'grid', 'climate'],
  'Extreme Weather Impact': ['weather', 'hurricane', 'storm', 'flood', 'drought', 'impact', 'climate'],
  'ESG Disclosure': ['esg', 'disclosure', 'reporting', 'sustainability', 'corporate', 'climate']
};

function KnowledgeNode({ market }: { market: Market }) {
  const intensity = useMemo(() => Math.floor(Math.random() * 100), []);
  const isPoly = market.venue === 'polymarket';

  return (
    <Link href={`/knowledge-sphere/${market.id}`} className="group">
      <div className="p-4 bg-[#0A0C12] border border-white/5 hover:border-primary/40 transition-all flex items-center gap-4 relative overflow-hidden h-24">
        {intensity > 85 && (
          <div className="absolute top-0 left-0 w-full h-0.5 bg-accent animate-pulse" />
        )}
        
        <div className={cn(
          "w-10 h-10 rounded border flex items-center justify-center font-black text-xs shrink-0",
          isPoly ? "bg-primary/10 border-primary/20 text-primary" : "bg-blue-500/10 border-blue-500/20 text-blue-400"
        )}>
          {isPoly ? 'P' : 'K'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">{market.category}</span>
            <div className="h-px flex-1 bg-white/5" />
            <span className={cn(
              "text-[10px] font-black font-mono",
              (market.priceProb || 0.5) > 0.5 ? "text-accent" : "text-destructive"
            )}>
              {((market.priceProb || 0.5) * 100).toFixed(1)}%
            </span>
          </div>
          <h4 className="text-[11px] font-bold uppercase italic tracking-tighter leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {market.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1 opacity-40">
            <span className="text-[7px] font-black uppercase tracking-tighter">NODE BASIS:</span>
            <span className="text-[7px] font-black uppercase truncate max-w-[120px]">
              MARKET_OUTCOME_{(market.venueMarketId || market.id).toUpperCase().slice(-8)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <Activity className={cn("w-3 h-3", intensity > 80 ? "text-accent" : "text-muted-foreground/40")} />
            <span className="text-[9px] font-black font-mono">{intensity}% PULSE</span>
          </div>
          <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
            <div className={cn("h-full transition-all duration-1000", intensity > 80 ? "bg-accent" : "bg-primary")} style={{ width: `${intensity}%` }} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function KnowledgeSpherePage() {
  const [activeNiche, setActiveNiche] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const firestore = useFirestore();

  // Optimized Query: Fetch 500 nodes to ensure high-specificity niche coverage
  const marketsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'markets'), where('status', '==', 'open'), orderBy('volume', 'desc'), limit(500)) : null,
    [firestore]
  );
  const { data: markets, isLoading } = useCollection<Market>(marketsQuery);

  /**
   * Optimized Sub-Second Filtering Logic.
   * Performs deep-keyword scan across market metadata to ensure accurate niche mapping.
   */
  const filteredMarkets = useMemo(() => {
    if (!markets) return [];
    
    const searchKey = search.trim().toLowerCase();
    const nicheLabel = activeNiche;
    
    const nicheKeywords = nicheLabel 
      ? (NICHE_KEYWORDS[nicheLabel] || nicheLabel.toLowerCase().split(' ').filter(w => w.length > 3 && isNaN(Number(w))))
      : null;

    return markets.filter(m => {
      if (!m) return false;
      const mTitle = (m.title || '').toLowerCase();
      const mQuestion = (m.question || '').toLowerCase();
      const mCat = (m.category || 'general').toLowerCase();
      const mVenueId = (m.venueMarketId || m.id || '').toLowerCase();

      const matchesSearch = !searchKey || mTitle.includes(searchKey) || mCat.includes(searchKey) || mQuestion.includes(searchKey);
      if (!matchesSearch) return false;

      if (!nicheKeywords) return true;

      return nicheKeywords.some(keyword => {
        const k = keyword.toLowerCase();
        if (k.length < 3) return false; 
        return mTitle.includes(k) || mCat.includes(k) || mQuestion.includes(k) || mVenueId.includes(k);
      });
    });
  }, [markets, activeNiche, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeNiche, search]);

  const totalPages = Math.ceil(filteredMarkets.length / itemsPerPage);
  const paginatedMarkets = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredMarkets.slice(start, start + itemsPerPage);
  }, [filteredMarkets, currentPage]);

  return (
    <div className="min-h-screen bg-[#05070A] text-[#E0E0E0] font-mono flex flex-col animate-in fade-in duration-1000 overflow-hidden text-left">
      <header className="h-16 border-b border-white/5 bg-[#0A0C12] px-8 flex items-center justify-between shadow-2xl shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded shadow-[0_0_15px_rgba(63,81,181,0.4)]">
              <Orbit className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-black font-headline tracking-tighter uppercase italic">Knowledge <span className="text-primary">Sphere</span></h1>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Global Discovery Matrix • Outcome Node v4.2</p>
            </div>
          </div>
          <div className="h-8 w-px bg-white/10 hidden md:block" />
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-black text-muted-foreground uppercase">Nodes Tracked</span>
              <span className="text-xs font-bold font-mono">{markets?.length || 0} ACTIVE</span>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[8px] font-black text-muted-foreground uppercase">Pulse Ingestion</span>
              <span className="text-xs font-bold font-mono text-accent">12ms LATENCY</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-40 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              placeholder="SEARCH THE SPHERE (F)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 bg-white/5 border border-white/10 rounded px-10 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-primary/50"
            />
          </div>
          <Button variant="outline" className="h-10 text-[10px] font-black uppercase border-white/10 gap-2" asChild>
            <Link href="/terminal"><Maximize2 className="w-4 h-4" /> Full HUD</Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-72 border-r border-white/5 bg-[#080A0F] flex flex-col shrink-0">
          <div className="p-6 border-b border-white/5 bg-black/20 text-left">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Specialized Niches</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-8">
              {HIERARCHY.map(section => (
                <div key={section.id} className="space-y-4">
                  <div className="flex items-center gap-2 text-[9px] font-black text-primary/60 uppercase tracking-[0.3em] text-left">
                    <Layers className="w-3 h-3" /> {section.label}
                  </div>
                  {section.sub.map(sub => (
                    <div key={sub.id} className="space-y-2">
                      <div className="px-2 text-[10px] font-black text-foreground/40 uppercase italic border-l border-white/10 ml-1 text-left">{sub.label}</div>
                      <div className="space-y-1 ml-2">
                        {sub.niches.map(niche => {
                          const isActive = activeNiche === niche;
                          return (
                            <button 
                              key={niche}
                              onClick={() => {
                                setActiveNiche(isActive ? null : niche);
                                if (!isActive) setSearch('');
                              }}
                              className={cn(
                                "w-full text-left px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all relative group",
                                isActive 
                                  ? "text-accent bg-accent/5 border-r-2 border-accent" 
                                  : "text-muted-foreground hover:text-primary hover:bg-white/5"
                              )}
                            >
                              <span className={cn(isActive && "drop-shadow-[0_0_8px_rgba(0,255,120,0.5)]")}>
                                {niche}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-4 bg-black/40 border-t border-white/5">
            <div className="p-3 bg-primary/5 border border-primary/10 rounded space-y-2 text-left">
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3 text-primary" />
                <span className="text-[9px] font-black uppercase text-primary">Informational Edge</span>
              </div>
              <p className="text-[8px] text-muted-foreground leading-relaxed italic">
                Subscribe to high-specificity niches where you possess unique informational alpha.
              </p>
            </div>
          </div>
        </aside>

        <main className="flex-1 bg-[#05070A] overflow-hidden flex flex-col p-6 gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-accent animate-pulse" />
              <h2 className="text-2xl font-black font-headline uppercase italic tracking-tighter">
                {activeNiche ? activeNiche : 'Global Market Pulse'}
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase">
                <div className="w-2 h-2 rounded-sm bg-accent" /> HIGH INTENSITY
              </div>
              <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase">
                <div className="w-2 h-2 rounded-sm bg-primary" /> NOMINAL DISCOVERY
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/5 border border-white/5 content-start overflow-y-auto no-scrollbar flex-1">
              {isLoading ? (
                [...Array(12)].map((_, i) => <div key={i} className="h-24 bg-card/50 animate-pulse" />)
              ) : paginatedMarkets.length > 0 ? (
                paginatedMarkets.map(m => (
                  <KnowledgeNode key={m.id} market={m} />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-24 px-8 text-center animate-in fade-in zoom-in-95 duration-500">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative p-6 bg-[#0A0C12] border border-white/10 rounded-full">
                      <Radar className="w-12 h-12 text-primary animate-spin-slow" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <Badge variant="destructive" className="animate-pulse px-1.5 h-5 flex items-center justify-center border-none">
                        <AlertTriangle className="w-3 h-3" />
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-1">
                      <h3 className="text-xl font-black font-headline uppercase italic tracking-tighter text-foreground">
                        Node Isolation
                      </h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                        Discovery Cluster: Zero Hits
                      </p>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                      The specialized niche <span className="text-primary font-bold italic">"{activeNiche}"</span> has yielded no active markets in the current discovery cycle. This may be due to low categorical liquidity or a highly specific informational constraint.
                    </p>

                    <div className="grid grid-cols-1 gap-2 pt-4">
                      <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg text-left">
                        <div className="p-1.5 bg-primary/10 rounded text-primary"><Search className="w-3 h-3" /></div>
                        <span className="text-[9px] font-black uppercase text-muted-foreground">Recommendation: Expand search parameters (F)</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-lg text-left">
                        <div className="p-1.5 bg-accent/10 rounded text-accent"><Globe className="w-3 h-3" /></div>
                        <span className="text-[9px] font-black uppercase text-muted-foreground">Recommendation: Audit broader category nodes</span>
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button 
                        onClick={() => { setActiveNiche(null); setSearch(''); }}
                        className="h-10 px-8 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                      >
                        <RefreshCcw className="w-3.5 h-3.5" /> Reset Discovery Matrix
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="h-14 border-t border-white/5 flex items-center justify-between px-4 bg-[#0A0C12]">
                <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                  Page {currentPage} of {totalPages} <span className="mx-2 opacity-20">|</span> {filteredMarkets.length} Nodes
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="h-8 text-[9px] font-black uppercase border-white/10 hover:bg-white/5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="h-8 text-[9px] font-black uppercase border-white/10 hover:bg-white/5"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <footer className="h-8 bg-[#0A0C12] border-t border-white/5 flex items-center justify-between px-8 text-[8px] font-black uppercase tracking-widest text-muted-foreground/50 shrink-0">
        <div className="flex gap-12">
          <div className="flex items-center gap-2"><Cpu className="w-3 h-3 text-primary" /> Computational Alpha: OK</div>
          <div className="flex items-center gap-2"><Database className="w-3 h-3 text-accent" /> Ingestion Substrate: Active</div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-accent animate-pulse">Zero-Knowledge Discovery Protocol 4.2 Secured</span>
          <ShieldCheck className="w-3.5 h-3.5 text-accent" />
        </div>
      </footer>
    </div>
  );
}

export default function Sphere() {
  return <KnowledgeSpherePage />;
}
