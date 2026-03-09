'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { Market, MarketTick, PublicLedgerEntry, MarketState } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Zap, 
  Activity, 
  Clock, 
  BrainCircuit, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck, 
  Scale, 
  Target,
  Waves,
  History,
  AlertTriangle,
  Loader2,
  Crosshair,
  TrendingUp,
  BarChart3,
  Cpu,
  Info,
  Maximize2,
  ExternalLink,
  ShieldAlert,
  PieChart,
  Anchor,
  Fingerprint,
  ChevronRight,
  Layers,
  Network
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildVenueUrl } from '@/lib/venue-url';
import { format, subHours, subDays } from 'date-fns';
import { getEffectiveStance } from '@/lib/intelligence';
import { useCountdown } from '@/hooks/use-countdown';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartContainer, type ChartConfig } from '@/components/ui/chart';
import { ProbabilityDecompositionHUD } from '@/app/terminal-pro/page';
import { LogExecutionDialog } from '@/components/intelligence/LogExecutionDialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AlphaJourneySOP } from '@/components/intelligence/AlphaJourneySOP';

const chartConfig = {
  price: { label: 'Alpha Path', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black border border-white/10 p-3 rounded shadow-2xl animate-in fade-in zoom-in-95">
        <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest mb-1">Live Discovery Basis</div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-black font-mono text-primary">{payload[0].value.toFixed(2)}%</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">Chance</span>
        </div>
        <div className="text-[8px] font-mono text-muted-foreground/60 mt-1">
          {format(new Date(payload[0].payload.time), 'HH:mm:ss.SSS')}
        </div>
      </div>
    );
  }
  return null;
};

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

function AuditPanel({ title, icon: Icon, children, color = 'primary' }: any) {
  return (
    <div className={cn(
      "bg-card border rounded-2xl p-6 space-y-6 shadow-2xl h-full flex flex-col relative overflow-hidden text-left transition-all hover:border-primary/20",
      color === 'accent' ? "border-accent/20" : "border-white/5"
    )}>
      <div className="flex items-center gap-3 border-b border-white/5 pb-4 relative z-10 text-left">
        <div className={cn(
          "p-2 rounded border",
          color === 'accent' ? "bg-accent/10 border-accent/20 text-accent" : "bg-primary/10 border-primary/20 text-primary"
        )}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-black uppercase tracking-widest italic text-left">{title}</h3>
      </div>
      <div className="flex-1 space-y-6 relative z-10 text-left">
        {children}
      </div>
    </div>
  );
}

export default function IntelligenceJourneyPage() {
  const params = useParams();
  const router = useRouter();
  const marketId = params.marketId as string;
  const firestore = useFirestore();
  const [timeframe, setTimeframe] = useState<'1h' | '5h' | '5d' | 'all'>('1h');

  const marketRef = useMemoFirebase(() => firestore ? doc(firestore, 'markets', marketId) : null, [firestore, marketId]);
  const { data: market, isLoading: isMarketLoading } = useDoc<Market>(marketRef);

  const stateRef = useMemoFirebase(() => firestore ? doc(firestore, 'marketState', marketId) : null, [firestore, marketId]);
  const { data: marketState } = useDoc<MarketState>(stateRef);

  const signalQuery = useMemoFirebase(() => firestore ? query(collection(firestore, 'publicLedger'), where('marketId', '==', marketId), orderBy('tsIssued', 'desc'), limit(1)) : null, [firestore, marketId]);
  const { data: signals } = useCollection<PublicLedgerEntry>(signalQuery);

  const ticksQuery = useMemoFirebase(() => firestore ? query(
    collection(firestore, 'marketTicks'), 
    where('marketId', '==', marketId), 
    orderBy('ts', 'asc'), 
    limit(500)
  ) : null, [firestore, marketId]);
  const { data: ticks } = useCollection<MarketTick>(ticksQuery);

  const intel = useMemo(() => {
    if (!market) return null;
    return getEffectiveStance(market, signals?.[0], marketState);
  }, [market, signals, marketState]);

  const chartData = useMemo(() => {
    if (!ticks || ticks.length === 0) return [];
    
    const now = new Date();
    let threshold = subHours(now, 1);
    if (timeframe === '5h') threshold = subHours(now, 5);
    if (timeframe === '5d') threshold = subDays(now, 5);
    if (timeframe === 'all') threshold = new Date(0);

    const filtered = ticks.filter(t => {
      const date = t.ts instanceof Timestamp ? t.ts.toDate() : new Date(t.ts);
      return date >= threshold;
    });

    return (filtered.length > 0 ? filtered : ticks.slice(-20)).map(t => ({
      time: t.ts instanceof Timestamp ? t.ts.toDate().getTime() : new Date(t.ts).getTime(),
      price: t.priceProb * 100
    }));
  }, [ticks, timeframe]);

  const countdown = useCountdown(market?.closeTime?.toDate ? market.closeTime.toDate() : new Date());

  if (isMarketLoading) return <div className="p-8 h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin text-primary opacity-20" /></div>;
  if (!market || !intel) return <div className="h-96 flex flex-col items-center justify-center opacity-20 gap-4"><Waves className="w-16 h-16 animate-pulse" /><p className="uppercase font-black tracking-widest">Node Isolation Failed</p></div>;

  const getVenueUrl = () => {
    return buildVenueUrl({
      venue: market.venue,
      venueMarketId: market.venueMarketId || market.id,
      venueUrl: market.venueUrl,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-[1600px] mx-auto text-left pb-32">
      {/* 1. JOURNEY HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 border-b border-white/5 pb-6 text-left">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 border border-white/10 hover:bg-white/5" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] px-3 py-1 uppercase tracking-widest italic">Alpha Journey Protocol v4.2</Badge>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-[9px] font-bold text-accent uppercase">Basis Verified</span>
            </div>
          </div>
          <h1 className="text-xl lg:text-3xl font-black font-headline uppercase italic tracking-tighter leading-none text-left">{market.title}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <RegimeBadge regime={intel.regime} />
              <span className="text-[10px] font-mono text-muted-foreground uppercase opacity-40 tracking-widest">NODE_{ (market.venueMarketId || market.id).toUpperCase().slice(-8)}</span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <AlphaJourneySOP />
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full lg:w-auto text-left">
          <div className="p-4 bg-card/50 border border-white/5 rounded-2xl space-y-1 shadow-xl text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Issue Basis</span>
            <div className="text-xl font-black font-mono text-foreground">${(intel.fairMu || market.priceProb || 0).toFixed(3)}</div>
          </div>
          <div className="p-4 bg-card/50 border border-white/5 rounded-2xl space-y-1 shadow-xl text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">TQS Scalar</span>
            <div className="text-xl font-black font-mono text-accent">{(intel.tqs || 0).toFixed(0)} / 100</div>
          </div>
          <div className="hidden sm:block p-4 bg-card/50 border border-white/5 rounded-2xl space-y-1 shadow-xl text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Horizon</span>
            <div className="text-sm font-black font-mono text-primary uppercase">{countdown || 'SYNC...'}</div>
          </div>
        </div>
      </header>

      {/* 2. CORE AUDIT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* ROW 1: THE ALPHA PATH TRACE */}
        <div className="lg:col-span-12">
          <div className="bg-card/30 border border-white/5 rounded-[2.5rem] p-8 space-y-8 relative overflow-hidden shadow-2xl backdrop-blur-xl group text-left">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000">
              <Activity className="w-64 h-64 text-primary" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 gap-6">
              <div className="flex items-center gap-4 text-left">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 text-left">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-black uppercase tracking-widest italic text-left">Alpha Path Trace</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] text-left">Sub-Second Price Discovery Curve</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-[#0A0C12] border border-white/5 p-1 rounded-lg">
                {[
                  { id: '1h', label: '1 Hour' },
                  { id: '5h', label: '5 Hours' },
                  { id: '5d', label: '5 Days' },
                  { id: 'all', label: 'All' }
                ].map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setTimeframe(tf.id as any)}
                    className={cn(
                      "px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded transition-all",
                      timeframe === tf.id ? "bg-white/10 text-white shadow-inner" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              <div className="flex gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-muted-foreground uppercase">Target Fair Value</span>
                  <span className="text-xs font-black font-mono text-primary">${(intel.fairMu || 0.5).toFixed(3)}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-muted-foreground uppercase">Confidence Sigma</span>
                  <span className="text-xs font-black font-mono text-accent">±{(intel.lambda || 0).toFixed(3)}</span>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] w-full mt-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 60, left: 0, bottom: 20 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="time" 
                      type="number"
                      domain={['auto', 'auto']}
                      tickFormatter={(unixTime) => format(new Date(unixTime), timeframe === '5d' || timeframe === 'all' ? 'MM/dd HH:mm' : 'HH:mm')}
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                      axisLine={false}
                      tickLine={false}
                      dy={10}
                    />
                    <YAxis 
                      domain={[0, 100]} 
                      tickFormatter={(val) => `${val.toFixed(0)}%`}
                      tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 'bold' }}
                      axisLine={false}
                      tickLine={false}
                      orientation="right"
                      dx={10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="step" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                      strokeWidth={4} 
                      isAnimationActive={false} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            <div className="relative z-10 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-left">
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-accent">
                  <ShieldCheck className="w-5 h-5" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-left">Oracle Consensus Basis</h4>
                </div>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed italic text-left">
                  "Price discovery is verified across {market.venue === 'polymarket' ? 'CLOB' : 'V2'} protocol layers. Structural discontinuity (λt) is updated in sub-second compute cycles."
                </p>
              </div>
              <div className="flex gap-3 text-left">
                <Button variant="outline" className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest border-white/10 hover:bg-white/5 gap-2" asChild>
                  <a href={getVenueUrl()} target="_blank" rel="noopener noreferrer">
                    Open Venue Contract <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20">
                      Execute Journey <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </DialogTrigger>
                  <LogExecutionDialog market={market} />
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: ANALYSIS HUB */}
        <div className="lg:col-span-6">
          <AuditPanel title="Behavioral Integrity" icon={Anchor} color="accent">
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-1 text-left">
                  <span className="text-[9px] font-black text-muted-foreground uppercase">Whale Mode</span>
                  <Badge className="bg-accent/20 text-accent font-black text-[10px] h-5 uppercase">
                    {intel.whaleMode?.toUpperCase() || 'INFORMATIONAL'}
                  </Badge>
                </div>
                <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-1 text-right">
                  <span className="text-[9px] font-black text-muted-foreground uppercase">Inhibition Risk</span>
                  <Badge variant="outline" className={cn("text-[10px] font-black h-5 uppercase", intel.marketTradeability === 'toxic' ? "text-destructive border-destructive/20" : "text-accent border-accent/20")}>
                    {intel.marketTradeability?.toUpperCase() || 'NOMINAL'}
                  </Badge>
                </div>
              </div>
              <div className="p-5 bg-accent/5 border border-accent/20 rounded-2xl italic text-xs leading-relaxed text-foreground/80 text-left">
                "Node identified as news-driven discovery. Low probability of mechanical whale traps in current regime."
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/5 text-left">
                <span className="text-[8px] font-black text-muted-foreground uppercase">Signature Check</span>
                <div className="flex items-center gap-1.5 text-accent">
                  <Fingerprint className="w-3 h-3" />
                  <span className="text-[9px] font-bold font-mono">0xBE...AD42</span>
                </div>
              </div>
            </div>
          </AuditPanel>
        </div>

        <div className="lg:col-span-6">
          <ProbabilityDecompositionHUD decomposition={intel.decomposition} total={market.priceProb || 0.5} />
        </div>

        {/* ROW 3: FINAL ALIGNMENT ROW */}
        <div className="lg:col-span-8">
          <AuditPanel title="Structural Risk" icon={ShieldAlert}>
            <div className="space-y-8 text-left pb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/40 border border-white/5 rounded-xl p-5 space-y-3 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Activity className="w-10 h-10 text-primary" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Stress State (λt)</span>
                    <RegimeBadge regime={intel.regime} />
                  </div>
                  <div className="text-3xl font-black font-mono text-primary tabular-nums">
                    {(intel.lambda).toFixed(4)}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[7px] font-black uppercase text-muted-foreground/60">
                      <span>Inhibition Level</span>
                      <span>{intel.regime === 'STRESS' ? 'CRITICAL' : 'NOMINAL'}</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full transition-all duration-1000", intel.regime === 'STRESS' ? "bg-destructive" : "bg-primary")} style={{ width: `${Math.min(100, (intel.lambda * 100))}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-5 space-y-3 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Zap className="w-10 h-10 text-accent" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Jump Probability (pt)</span>
                  <div className="text-3xl font-black font-mono text-accent tabular-nums">
                    {(intel.jumpProb).toFixed(4)}
                  </div>
                  <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tight italic">
                    Endogenous Discontinuity Detection
                  </p>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-5 space-y-3 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Network className="w-10 h-10 text-white" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">Liquidity Quality (LQS)</span>
                  <div className="text-3xl font-black font-mono text-white tabular-nums">
                    0.842
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    <span className="text-[8px] font-black uppercase text-accent tracking-widest">Protocol Sync: Active</span>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-primary/5 border border-primary/10 rounded-2xl space-y-3 text-left">
                <div className="flex items-center gap-2 text-primary text-left">
                  <Scale className="w-4 h-4 text-left" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-left">Risk Penalty Protocol</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed italic font-medium">
                  "Current TQS conviction assumes a γ-penalty of {(intel.lambda * 0.15).toFixed(3)} units to account for structural stress and λt-drift."
                </p>
              </div>
            </div>
          </AuditPanel>
        </div>

        <div className="lg:col-span-4">
          <AuditPanel title="Stance Basis" icon={Target}>
            <div className="space-y-8 text-left">
              <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-[2.5rem] border-2 border-dashed border-primary/20 relative overflow-hidden group text-left">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                  <Zap className="w-24 h-24 text-primary fill-primary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary mb-2">Decision Engine Cue</span>
                <div className="text-7xl font-black font-headline italic tracking-tighter text-white mix-blend-plus-lighter text-left">
                  {intel.stance}
                </div>
                {intel.stance === 'BET' && (
                  <Badge className="mt-4 px-6 py-1 bg-primary text-primary-foreground font-black text-lg italic shadow-xl">
                    {intel.direction}
                  </Badge>
                )}
              </div>

              <div className="space-y-4 text-left">
                <div className="flex items-center gap-2 text-primary">
                  <BrainCircuit className="w-4 h-4" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-left">Intelligence Briefing</h4>
                </div>
                <div className="p-5 bg-[#0A0C12] border border-white/5 rounded-2xl italic text-sm leading-relaxed text-foreground/90 font-medium text-left">
                  "{intel.rationale}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-left">
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-black text-muted-foreground uppercase text-left">Expected Value</span>
                  <div className="text-xl font-black font-mono text-accent text-left">+{ (intel.edge * 100).toFixed(2) }%</div>
                </div>
                <div className="space-y-1 text-right">
                  <span className="text-[9px] font-black text-muted-foreground uppercase">TQS Scalar</span>
                  <div className="text-xl font-black font-mono text-primary">{(intel.tqs).toFixed(0)}</div>
                </div>
              </div>
            </div>
          </AuditPanel>
        </div>
      </div>

      {/* 3. JOURNEY FOOTER */}
      <footer className="py-16 border-t border-dashed border-white/10 flex flex-col items-center gap-12 mt-12 opacity-40 text-left">
        <div className="flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/60">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span>Audit Immutable</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="flex items-center gap-3">
            <Fingerprint className="w-4 h-4 text-primary" />
            <span>Trace Hashed</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="flex items-center gap-3">
            <Target className="w-4 h-4 text-accent" />
            <span>Goal Calibrated</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4 text-center max-w-2xl text-left">
          <div className="flex items-center gap-3">
            <BrainCircuit className="w-5 h-5 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Autonomous Intelligence Journey v4.2 Active</span>
          </div>
          <p className="text-[9px] font-medium leading-relaxed italic uppercase tracking-widest max-w-2xl mx-auto px-4 text-center">
            "Alpha Journey nodes provide institutional decision support. Every state shift is finalized within the geographically distributed extraction cluster. Subscriber keys are hashed and never stored in plain text."
          </p>
        </div>
      </footer>
    </div>
  );
}
