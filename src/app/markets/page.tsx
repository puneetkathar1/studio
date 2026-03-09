'use client';

import { useState } from 'react';
import { MarketsTable } from './markets-table';
import { Badge } from '@/components/ui/badge';
import { Activity, Globe, Layers, Zap, TrendingUp, Search, Filter, Loader2, ArrowUpRight, Radio, Database, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { Market } from '@/lib/types';
import { cn } from '@/lib/utils';
import { DiscoveryProtocolSOP } from '@/components/intelligence/DiscoveryProtocolSOP';
import { ProtocolStep } from '@/components/intelligence/ProtocolStep';
import Link from 'next/link';

export default function MarketsPage() {
  const [activeCategory, setActiveCategory] = useState('all-markets');
  const [search, setSearch] = useState('');
  const [venueFilter, setVenueFilter] = useState<'all' | 'polymarket' | 'kalshi'>('all');
  const firestore = useFirestore();

  const categories = [
    { id: 'all-markets', label: 'Global Feed' },
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

  // Fetch recent markets for the "Discovery Pulse"
  const recentMarketsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'markets'), orderBy('createdAt', 'desc'), limit(5)) : null,
    [firestore]
  );
  const { data: recentMarkets } = useCollection<Market>(recentMarketsQuery);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 w-full max-w-none">
      {/* DISCOVERY HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1">
              Discovery Node: GLOBAL_SWEEP
            </Badge>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
              <Globe className="w-3 h-3 text-accent" />
              <span className="text-[9px] font-bold text-accent uppercase">Multi-Venue Link</span>
            </div>
          </div>
          <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none">
            Market <span className="text-primary">Discovery</span>.
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl font-medium leading-relaxed">
            Wide-angle monitoring of the global prediction matrix. Identify volume leaders, liquidity clusters, and trending categorical nodes across decentralized and regulated protocols.
          </p>
          <div className="pt-2">
            <DiscoveryProtocolSOP />
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 w-full md:w-auto">
          <Card className="bg-card/50 border-white/5 shadow-xl p-4 flex flex-col justify-between min-w-[140px]">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Global Volume</span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase text-foreground">$142.8M</span>
            </div>
          </Card>
          <Card className="bg-card/50 border-white/5 shadow-xl p-4 flex flex-col justify-between min-w-[140px]">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Active Nodes</span>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-accent" />
              <span className="text-xs font-black uppercase text-foreground">1,482 NODES</span>
            </div>
          </Card>
          <Card className="hidden lg:flex bg-card/50 border-white/5 shadow-xl p-4 flex flex-col justify-between min-w-[140px]">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Venue Lead</span>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-xs font-black uppercase text-foreground">POLY (62%)</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9 2xl:col-span-10 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                placeholder="F SEARCH THE DISCOVERY MATRIX..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 bg-card/50 border border-white/10 rounded-lg pl-10 text-sm font-black uppercase tracking-widest focus:outline-none focus:border-primary/50"
              />
            </div>
            
            {/* VENUE DECODER SWITCH */}
            <div className="flex items-center gap-3 bg-card/50 border border-white/10 rounded-lg p-1.5 shrink-0">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest ml-2 flex items-center gap-2">
                <Filter className="w-3 h-3" /> Venue
              </span>
              <div className="flex items-center gap-1">
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
          </div>

          {/* FUNCTIONAL CATEGORY TABS */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button 
                key={cat.id} 
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "h-10 px-4 rounded text-[10px] font-black uppercase tracking-widest transition-all border",
                  activeCategory === cat.id 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                    : "bg-card/50 border-white/5 text-muted-foreground hover:border-primary/30"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <MarketsTable 
            terminalView={false} 
            filters={{ searchTerm: search, activeCategory, venueFilter }} 
          />
        </div>

        {/* DISCOVERY INSIGHTS SIDEBAR */}
        <div className="lg:col-span-3 2xl:col-span-2 space-y-6">
          {/* PROTOCOL NEXT STEP */}
          <ProtocolStep 
            step={1}
            totalSteps={4}
            title="Market Discovery"
            description="You are currently identifying volume leaders. The next step is to verify if these trends are credible."
            nextStepLabel="Verify in Public Ledger"
            nextStepHref="/ledger"
            icon={ShieldCheck}
          />

          <div className="bg-card border border-white/5 rounded-xl p-6 space-y-6 shadow-2xl sticky top-20">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <div className="p-2 bg-accent/10 rounded border border-accent/20 text-accent">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest">Discovery Pulse</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Recently Ingested</span>
                <div className="space-y-3">
                  {recentMarkets?.map((m) => (
                    <div key={m.id} className="group cursor-pointer">
                      <h4 className="text-[10px] font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {m.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[7px] h-3 px-1 border-white/10 uppercase">{m.venue}</Badge>
                        <span className="text-[8px] text-muted-foreground font-mono">NODE_{m.venueMarketId.slice(-6)}</span>
                      </div>
                    </div>
                  )) || <Loader2 className="w-4 h-4 animate-spin opacity-20" />}
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Hot Clusters</span>
                <div className="space-y-2">
                  {[
                    { label: 'Politics (Election)', vol: '$42M', status: 'CRITICAL' },
                    { label: 'Crypto (ETF Basis)', vol: '$12M', status: 'HIGH' },
                    { label: 'Finance (Fed Cut)', vol: '$8M', status: 'NORMAL' },
                  ].map((cluster) => (
                    <div key={cluster.label} className="p-3 bg-white/[0.02] border border-white/5 rounded flex justify-between items-center group hover:border-primary/30 transition-all">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold block">{cluster.label}</span>
                        <span className="text-[8px] font-black text-muted-foreground uppercase">{cluster.vol} Volume</span>
                      </div>
                      <Badge className={cn("text-[8px] font-black", cluster.status === 'CRITICAL' ? 'bg-destructive' : 'bg-primary')}>
                        {cluster.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                  Discovery Nodes prioritize breadth over conviction. Real-time alpha is extracted via the Intelligence Terminal.
                </p>
                <Button className="w-full h-10 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2" asChild>
                  <Link href="/terminal">Launch Execution <ArrowUpRight className="w-3.5 h-3.5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-4 opacity-40">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em]">
          <span>Real-time Ingestion V2.1</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Categorical Sweep Active</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Oracle Protocol Verified</span>
        </div>
      </footer>
    </div>
  );
}
