'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, where, doc } from 'firebase/firestore';
import { Whale, WhalePosition, MarketState } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Anchor, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Waves,
  Fingerprint,
  Layers,
  ArrowUpRight,
  Target,
  Search,
  ShieldAlert,
  Skull,
  Info,
  Scale,
  Lock,
  Loader2,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Radio,
  Globe,
  PieChart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { WhaleMatrixSOP } from '@/components/intelligence/WhaleMatrixSOP';
import { IntelligenceProtocolSOP } from '@/components/intelligence/IntelligenceProtocolSOP';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ProGateway } from '@/app/alpha-stream/page';

function WhaleRiskLabel({ risk, mode }: { risk: MarketState['whaleRisk'], mode?: MarketState['whaleMode'] }) {
  if (risk === 'low') return <div className="flex items-center gap-1.5 text-[9px] font-black text-accent uppercase"><div className="w-2 h-2 rounded-full bg-accent" /> Low Whale Influence</div>;
  if (risk === 'med') return <div className="flex items-center gap-1.5 text-[9px] font-black text-yellow-500 uppercase"><div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" /> Active Large Flow {mode && mode !== 'none' && `(${mode.toUpperCase()})`}</div>;
  return <div className="flex items-center gap-1.5 text-[9px] font-black text-destructive uppercase"><div className="w-2 h-2 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--destructive))]" /> Whale-Dominated / {mode?.toUpperCase() || 'TOXIC'}</div>;
}

function WhalePositionRow({ pos }: { pos: WhalePosition }) {
  const firestore = useFirestore();
  const stateRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'marketState', pos.marketId) : null),
    [firestore, pos.marketId]
  );
  const { data: state } = useDoc<MarketState>(stateRef);

  return (
    <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-primary/30 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className="space-y-1 flex-1 text-left">
          <h4 className="text-xs font-bold leading-tight line-clamp-1 group-hover:text-primary transition-colors">{pos.marketTitle}</h4>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[8px] h-4 font-black px-1", pos.side === 'YES' ? "text-accent border-accent/20" : "text-destructive border-destructive/20")}>
              {pos.side}
            </Badge>
            <span className="text-[10px] text-muted-foreground font-mono">Basis: ${pos.avgEntry.toFixed(3)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black font-mono text-primary">${pos.size.toLocaleString()}</div>
          <span className="text-[8px] text-muted-foreground uppercase font-bold">Exposure</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5 mb-3 text-left">
        <div>
          <span className="text-[8px] font-black text-muted-foreground uppercase block mb-1">Risk Assessment</span>
          <WhaleRiskLabel risk={state?.whaleRisk || 'low'} mode={state?.whaleMode} />
        </div>
        <div className="text-right">
          <span className="text-[8px] font-black text-muted-foreground uppercase block mb-1">Move Type</span>
          <Badge variant="outline" className={cn(
            "text-[8px] font-black h-4 uppercase",
            state?.moveType === 'mechanical' ? "border-destructive/30 text-destructive bg-destructive/5" : "border-white/10"
          )}>
            {state?.moveType || 'INFORMATIONAL'}
          </Badge>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-black text-muted-foreground uppercase">Integrity</span>
          <Badge className={cn(
            "text-[8px] h-4 font-black",
            state?.marketTradeability === 'toxic' ? "bg-destructive" : state?.marketTradeability === 'monitor' ? "bg-yellow-600" : "bg-accent text-accent-foreground"
          )}>
            {state?.marketTradeability?.toUpperCase() || 'TRADEABLE'}
          </Badge>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[8px] font-black text-muted-foreground uppercase">Unrealized PnL</span>
          <div className={cn("text-xs font-black font-mono", pos.unrealizedPnl >= 0 ? "text-accent" : "text-destructive")}>
            {pos.unrealizedPnl >= 0 ? '+' : ''}{pos.unrealizedPnl.toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
}

function WhaleDetailSheet({ whale, onClose }: { whale: Whale, onClose: () => void }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const positionsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'whales', whale.id, 'positions'), orderBy('updatedAt', 'desc')) : null,
    [firestore, whale.id]
  );
  const { data: positions, isLoading } = useCollection<WhalePosition>(positionsQuery);

  const handleSetAlert = () => {
    toast({
      title: 'Whale Alert Initialized',
      description: `Real-time monitoring established for node ${whale.label}. You will be notified of all future position delta.`,
    });
  };

  return (
    <Sheet open={!!whale} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-[500px] bg-[#05070A] border-white/10 text-foreground overflow-y-auto no-scrollbar">
        <SheetHeader className="space-y-4 mb-8 text-left">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase px-2">Whale Audit v4.2</Badge>
            <Badge variant="outline" className="text-[9px] uppercase font-mono opacity-50">TYPE: {whale.type}</Badge>
          </div>
          <SheetTitle className="text-3xl font-black font-headline tracking-tighter italic leading-none uppercase flex items-center gap-3">
            <Fingerprint className="w-8 h-8 text-primary" />
            {whale.label}
          </SheetTitle>
          <SheetDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
            {whale.identity}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 pb-20 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Predictive Hit Rate</span>
              <div className="text-2xl font-black font-mono text-accent">{whale.hitRate.toFixed(1)}%</div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-accent" style={{ width: `${whale.hitRate}%` }} />
              </div>
            </div>
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl space-y-1 text-right">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Historical ROI</span>
              <div className="text-2xl font-black font-mono text-primary">+{whale.roi.toFixed(1)}%</div>
              <p className="text-[8px] text-muted-foreground uppercase font-bold mt-1 italic">Realized Basis</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Target className="w-4 h-4" />
              <h3 className="text-[10px] font-black uppercase tracking-widest">Behavioral Archetype</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(whale.tags || []).map(tag => (
                <Badge key={tag} className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase px-2 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-muted-foreground uppercase">Timing Skill Scalar</span>
                <span className="text-xs font-black font-mono text-accent">{(whale.timingSkill || 85).toFixed(1)}%</span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                This entity consistently enters positions when Market Inefficiency (MIS) is high, preceding major venue re-pricing events.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <Layers className="w-4 h-4" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Active Reconstruction</h3>
              </div>
              <span className="text-[9px] font-mono text-muted-foreground opacity-50">SYNC: REAL-TIME</span>
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full bg-white/5 rounded-xl" />)
              ) : positions && positions.length > 0 ? (
                positions.map(pos => <WhalePositionRow key={pos.id} pos={pos} />)
              ) : (
                <div className="py-12 text-center opacity-20 space-y-4">
                  <Waves className="w-12 h-12 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No active positions detected</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <Button 
              onClick={handleSetAlert}
              className="w-full h-12 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
            >
              Set Pro Alert for this Node <Zap className="w-4 h-4 fill-current" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default function WhaleMatrixPage() {
  const firestore = useFirestore();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const [selectedWhale, setSelectedWhale] = useState<Whale | null>(null);
  const [search, setSearch] = useState('');
  const [sortByHitRate, setSortByHitRate] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'wallet' | 'public_trader' | 'flow_cluster'>('all');
  const [activeArchetype, setActiveArchetype] = useState<string | null>(null);

  const whalesQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'whales'), orderBy('totalVolume', 'desc'), limit(50)) : null,
    [firestore]
  );
  const { data: whales, isLoading } = useCollection<Whale>(whalesQuery);

  const archetypeStats = useMemo(() => {
    if (!whales) return { absorber: 0, aggressor: 0, sniper: 0, pinner: 0 };
    return {
      absorber: whales.filter(w => w.tags?.includes('Absorber')).length,
      aggressor: whales.filter(w => w.tags?.includes('Aggressor') || w.label.includes('Aggressor')).length,
      sniper: whales.filter(w => w.tags?.includes('Sniper') || w.label.includes('Sniper')).length,
      pinner: whales.filter(w => w.tags?.includes('Pinner')).length,
    };
  }, [whales]);

  const filteredWhales = useMemo(() => {
    if (!whales) return [];
    let result = whales.filter(w => {
      const matchesSearch = w.label.toLowerCase().includes(search.toLowerCase()) || 
                            w.identity.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || w.type === typeFilter;
      const matchesArchetype = !activeArchetype || w.tags?.includes(activeArchetype) || w.label.includes(activeArchetype);
      return matchesSearch && matchesType && matchesArchetype;
    });
    if (sortByHitRate) result = [...result].sort((a, b) => b.hitRate - a.hitRate);
    else result = [...result].sort((a, b) => b.totalVolume - a.totalVolume);
    return result;
  }, [whales, search, sortByHitRate, typeFilter, activeArchetype]);

  const isPro = profile?.plan === 'pro' || profile?.plan === 'internal';

  if (!isProfileLoading && !isPro) {
    return (
      <ProGateway 
        title="Whale Recon"
        subtitle="Identify institutional fingerprints and separate organic discovery from mechanical whale manipulation."
        benefits={[
          { title: "On-Chain Reconstruction", description: "Real-time tracking of high-volume wallet activity and position clustering." },
          { title: "Flow Inference Engine", description: "Classify actor intent as 'Informational' (News) or 'Mechanical' (Pinning)." },
          { title: "Behavioral Toxicity Radar", description: "Automated flagging of toxic nodes to inhibit high-risk automated signals." }
        ]}
        stats={[
          { label: "Entities Tracked", value: "1,284", icon: Fingerprint },
          { label: "Informational Density", value: "84%", icon: Activity },
          { label: "Matrix Nodes", value: "1.4k", icon: Cpu }
        ]}
        requiredTier="PRO"
      />
    );
  }

  if (isProfileLoading) return (
    <div className="h-[600px] flex items-center justify-center text-left">
      <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
    </div>
  );

  const archetypes = [
    { id: 'Absorber', label: 'The Absorber', icon: Layers, desc: 'Passive limit walls holding price steady.', color: 'text-blue-400', count: archetypeStats.absorber },
    { id: 'Aggressor', label: 'The Aggressor', icon: Zap, desc: 'Active market orders moving price vertically.', color: 'text-primary', count: archetypeStats.aggressor },
    { id: 'Sniper', label: 'The Sniper', icon: Target, desc: 'HFT nodes entering at news inflection.', color: 'text-accent', count: archetypeStats.sniper },
    { id: 'Pinner', label: 'The Pinner', icon: Anchor, desc: 'Artificial stabilization at specific strikes.', color: 'text-orange-400', count: archetypeStats.pinner },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-[1600px] mx-auto pb-20 text-left">
      <header className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10"><Anchor className="w-64 h-64 text-primary animate-pulse" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-[0.3em] px-3 py-1">Whale Activity Scanner</Badge>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20"><Activity className="w-3 h-3 text-primary animate-pulse" /><span className="text-[9px] font-bold text-primary uppercase tracking-widest">Protocol: Behavioral Recon Active</span></div>
            </div>
            <h1 className="text-5xl font-black font-headline tracking-tighter uppercase italic leading-none">Whale <span className="text-primary">Matrix</span>.</h1>
            <p className="text-muted-foreground text-sm max-xl font-medium leading-relaxed text-left">Separate news from noise. Identifying actor archetypes: Absorber, Aggressor, Sniper, and Pinner. Reconstructing intent to inhibit mechanical price traps.</p>
            <div className="pt-2 flex items-center gap-3">
              <WhaleMatrixSOP />
              <IntelligenceProtocolSOP />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="p-4 bg-background/50 border rounded-xl backdrop-blur-md min-w-[160px] text-left"><span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-left">Whales Tracked</span><div className="text-2xl font-black font-mono text-accent">{whales?.length || 0}</div><div className="flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3 text-accent" /><span className="text-[8px] font-bold uppercase text-accent/70">Verified Identities</span></div></div>
            <div className="p-4 bg-background/50 border rounded-xl backdrop-blur-md min-w-[160px] text-left"><span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-left">Inhibition Engine</span><div className="text-2xl font-black font-mono text-primary">ACTIVE</div><div className="flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3 text-primary" /><span className="text-[8px] font-bold uppercase text-primary/70">Signature Check: OK</span></div></div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {archetypes.map((sig) => (
          <button 
            key={sig.id} 
            onClick={() => setActiveArchetype(activeArchetype === sig.id ? null : sig.id)}
            className={cn(
              "p-4 bg-card border rounded-xl space-y-3 transition-all text-left relative overflow-hidden group",
              activeArchetype === sig.id 
                ? "border-primary ring-1 ring-primary/50 bg-primary/[0.03] shadow-[0_0_20px_rgba(63,81,181,0.15)]" 
                : "border-white/5 hover:border-primary/30"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <sig.icon className={cn("w-4 h-4", sig.color)} />
                <h4 className="text-[10px] font-black uppercase tracking-widest">{sig.label}</h4>
              </div>
              <Badge variant="outline" className={cn("text-[9px] font-mono", activeArchetype === sig.id ? "border-primary text-primary" : "border-white/10")}>
                {sig.count} ACTIVE
              </Badge>
            </div>
            <p className="text-[9px] text-muted-foreground italic leading-tight">{sig.desc}</p>
            {activeArchetype === sig.id && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-pulse" />
            )}
          </button>
        ))}
      </section>

      <div className="bg-card border border-white/5 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center text-left">
        <div className="flex-1 relative w-full"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input placeholder="SEARCH WALLET, TRADER, OR FLOW CLUSTER..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-11 bg-background/50 border border-white/10 rounded-lg pl-10 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary/50" /></div>
        <div className="flex gap-2 w-full md:w-auto">
          {activeArchetype && (
            <Button variant="ghost" onClick={() => setActiveArchetype(null)} className="text-[9px] font-black uppercase h-11 px-4 gap-2 text-primary border border-primary/20 bg-primary/5">
              Clear Filter <Waves className="w-3 h-3" />
            </Button>
          )}
          <Button variant={typeFilter === 'all' ? 'default' : 'outline'} onClick={() => setTypeFilter('all')} className={cn("flex-1 md:flex-none text-[10px] font-black uppercase h-11 px-6 border-white/10", typeFilter === 'all' && "bg-primary text-primary-foreground")}>All Entities</Button>
          <Button variant={sortByHitRate ? 'default' : 'outline'} onClick={() => setSortByHitRate(!sortByHitRate)} className={cn("flex-1 md:flex-none text-[10px] font-black uppercase h-11 px-6 border-white/10 transition-all", sortByHitRate ? "bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20" : "hover:border-accent/50")}><TrendingUp className={cn("w-3 h-3 mr-2", sortByHitRate && "animate-pulse")} />Top Hit Rate</Button>
        </div>
      </div>

      <div className="rounded-2xl border bg-card/30 overflow-hidden shadow-2xl backdrop-blur-sm text-left"><div className="flex justify-between items-center px-6 py-4 border-b bg-muted/10"><div className="flex items-center gap-4"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent animate-pulse" /><span className="text-[10px] font-black uppercase tracking-widest text-foreground text-left">Active Smart Money Stream</span></div><div className="h-3 w-px bg-border" /><span className="text-[10px] font-bold text-muted-foreground uppercase">Showing {filteredWhales.length} Entities</span></div><Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary">Encryption: AES-256 Verified</Badge></div><div className="overflow-x-auto text-left"><table className="w-full text-sm text-left"><thead className="text-[10px] uppercase tracking-widest font-black h-12 bg-muted/30 border-b"><tr><th className="px-6">Whale Entity</th><th className="px-6">Archetype</th><th className="px-6 text-center">Hit Rate</th><th className="px-6 text-center">ROI Basis</th><th className="px-6 text-right">Volume 30D</th><th className="px-6 text-right">Action</th></tr></thead><tbody className="divide-y divide-white/5">{isLoading ? ([...Array(8)].map((_, i) => (<tr key={i} className="animate-pulse h-16"><td colSpan={6} className="bg-white/5" /></tr>))) : filteredWhales.length > 0 ? (filteredWhales.map((whale) => (<tr key={whale.id} className="group hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelectedWhale(whale)}><td className="px-6 py-4"><div className="flex items-center gap-3 text-left"><div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary text-left"><Fingerprint className="w-4 h-4" /></div><div className="flex flex-col text-left"><span className="font-bold text-sm group-hover:text-primary transition-colors">{whale.label}</span><span className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">{whale.identity}</span></div></div></td><td className="px-6 py-4"><div className="flex flex-col gap-1 text-left"><Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest w-fit">{whale.type}</Badge>{whale.tags && whale.tags.length > 0 && (<span className="text-[7px] text-muted-foreground font-black uppercase tracking-tighter italic">{whale.tags[0]}</span>)}</div></td><td className="px-6 py-4 text-center"><div className="flex flex-col items-center"><span className={cn("font-mono font-black text-accent")}>{whale.hitRate.toFixed(1)}%</span><div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden"><div className="h-full bg-accent" style={{ width: `${whale.hitRate}%` }} /></div></div></td><td className="px-6 py-4 text-center"><span className="font-mono font-black text-primary">+{whale.roi.toFixed(1)}%</span></td><td className="px-6 py-4 text-right font-mono font-black tabular-nums">${(whale.totalVolume / 1000).toFixed(1)}K</td><td className="px-6 py-4 text-right"><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4" /></Button></td></tr>))) : (<tr><td colSpan={6} className="h-64 text-center opacity-30"><Waves className="w-12 h-12 mx-auto" /><p className="text-[10px] font-black uppercase tracking-widest">No entities discovered</p></td></tr>)}</tbody></table></div></div>

      {selectedWhale && (<WhaleDetailSheet whale={selectedWhale} onClose={() => setSelectedWhale(null)} />)}

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40 text-left">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em]"><span>On-Chain Reconstruction</span><div className="w-1.5 h-1.5 rounded-full bg-primary" /><span>Archetype Signature</span><div className="w-1.5 h-1.5 rounded-full bg-primary" /><span>Behavioral Mode Engine</span></div>
        <p className="text-[8px] text-center max-w-2xl font-medium leading-relaxed italic px-4 text-left">"Whale Matrix signatures separate news from mechanical pressure. Trust signals only when the signature mode is Informational. Markets flagged as Pinner or Absorber are inhibited to preserve capital."</p>
      </footer>
    </div>
  );
}