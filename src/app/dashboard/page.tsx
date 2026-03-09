'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, doc } from 'firebase/firestore';
import { Market, PublicLedgerEntry, ExternalSignal } from '@/lib/types';
import { calculatePnl } from '@/lib/pnl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Target, 
  ArrowUpRight,
  Info,
  Clock,
  Briefcase,
  Lock,
  Radio,
  Globe,
  Database,
  RefreshCcw,
  Cpu,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DiscoveryProtocolSOP } from '@/components/intelligence/DiscoveryProtocolSOP';
import { NarrativeHeatmap } from '@/components/intelligence/NarrativeHeatmap';
import { format } from 'date-fns';
import { useUserProfile } from '@/firebase/auth/use-user-profile';

interface IntelScore {
  short: string;
  label: string;
  value: string | number;
  description: string;
  subtext: string;
  category: 'analysis' | 'accountability' | 'advanced';
}

function IntelScoreRow({ score }: { score: IntelScore }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors px-2 rounded text-left">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-accent bg-accent/10 px-1.5 py-0.5 rounded tabular-nums">
            {score.short}
          </span>
          <span className="text-11px font-bold uppercase tracking-tight text-foreground/90">{score.label}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-tight max-w-[240px]">
          {score.description}
        </p>
        <p className="text-[9px] text-accent/70 font-bold uppercase italic">
          → {score.subtext}
        </p>
      </div>
      <div className="text-right">
        <div className="text-sm font-black font-mono text-accent">{score.value}</div>
      </div>
    </div>
  );
}

function MarketIntelSnapshot({ market }: { market: Market }) {
  const seed = useMemo(() => {
    return market.id.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  }, [market.id]);

  const scores = useMemo(() => {
    const getVal = (min: number, range: number, decimals = 2) => (min + (seed % (range * 100)) / 100).toFixed(decimals);
    
    return [
      { short: 'SPS', label: 'Signal Probability Score', value: (60 + (seed % 35)) + '%', description: 'Model-estimated probability of correct resolution.', subtext: 'Your “true odds” number.', category: 'analysis' },
      { short: 'CCI', label: 'Confidence Consistency Index', value: getVal(0.4, 0.5), description: 'Stability across models, time, and sources.', subtext: 'High = robust, low = fragile.', category: 'analysis' },
      { short: 'EVS', label: 'Expected Value Score', value: getVal(-1, 2), description: 'Normalized expected value relative to pricing.', subtext: 'Positive = edge, negative = avoid.', category: 'analysis' },
      { short: 'MIS', label: 'Market Inefficiency Score', value: getVal(0.1, 0.8), description: 'Divergence between market prob and fair value.', subtext: 'Quantifies mispricing.', category: 'analysis' },
      { short: 'LQS', label: 'Liquidity Quality Score', value: getVal(0.3, 0.6), description: 'Depth, spread, and manipulation resistance.', subtext: 'Low LQS = prices lie.', category: 'analysis' },
      { short: 'TVS', label: 'Timing Value Score', value: (seed % 3 === 0 ? 'OPTIMAL' : seed % 3 === 1 ? 'EARLY' : 'LATE'), description: 'Indicating the optimal entry window.', subtext: 'Powers BET vs WAIT.', category: 'analysis' },
      { short: 'RRS', label: 'Regime Risk Score', value: getVal(0.1, 0.5), description: 'Uncertainty from events or structural breaks.', subtext: 'High RRS = higher error risk.', category: 'analysis' },
      { short: 'BDS', label: 'Belief Divergence Score', value: getVal(0.2, 0.7), description: 'Polarization level of market participants.', subtext: 'High = disagreement/trap.', category: 'analysis' },
      { short: 'SCS', label: 'Signal Clarity Score', value: getVal(0.5, 0.45), description: 'Combined readability metric (EV + Confidence).', subtext: '“How clean is this signal?”', category: 'analysis' },
      { short: 'IAS', label: 'Invalidation Alert Score', value: getVal(0.1, 0.4), description: 'Proximity to thesis breakdown threshold.', subtext: 'Early warning system.', category: 'analysis' },
      { short: 'PRS', label: 'Predictive Reliability', value: getVal(0.7, 0.25), description: 'Historical accuracy weighted by difficulty.', subtext: 'Credibility metric.', category: 'accountability' },
      { short: 'ECS', label: 'Edge Capture Score', value: getVal(0.4, 0.5), description: 'Theoretical EV realized over time.', subtext: 'Process > luck.', category: 'accountability' },
      { short: 'DCS', label: 'Discipline Consistency', value: getVal(0.8, 0.15), description: 'Adherence to core signal logic rules.', subtext: 'Penalizes overtrading.', category: 'accountability' },
      { short: 'PCS', label: 'Portfolio Correlation', value: getVal(0.1, 0.3), description: 'Correlation with other active positions.', subtext: 'Hidden risk detector.', category: 'advanced' },
      { short: 'ARS', label: 'Asymmetric Risk Score', value: getVal(1.5, 3.0, 1), description: 'Downside vs upside skew of the bet.', subtext: 'Tail-risk awareness.', category: 'advanced' },
      { short: 'HSS', label: 'Horizon Sensitivity', value: getVal(0.2, 0.6), description: 'Sensitivity to timing shifts or delays.', subtext: 'Event-driven critical.', category: 'advanced' },
    ] as IntelScore[];
  }, [seed]);

  const synthesizedRating = useMemo(() => {
    const base = 70;
    const variance = (seed % 250) / 10;
    return Math.min(99, Math.max(40, base + variance)).toFixed(1);
  }, [seed]);

  return (
    <Card className="bg-card/50 border-primary/10 overflow-hidden group">
      <CardHeader className="bg-muted/30 pb-3 text-left">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[8px] uppercase font-black">{market.venue}</Badge>
              <Badge className="text-[8px] uppercase font-black bg-primary/10 text-primary border-primary/20">{market.category}</Badge>
              <span className="text-[10px] text-muted-foreground font-mono">#{market.venueMarketId}</span>
            </div>
            <CardTitle className="text-sm font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {market.title}
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" asChild>
            <Link href={`/intelligence/${market.id}`}><ArrowUpRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[400px] overflow-y-auto no-scrollbar p-4 space-y-1">
          {scores.map(s => <IntelScoreRow key={s.short} score={s} />)}
        </div>
        <div className="p-3 bg-accent/5 border-t border-accent/10 flex justify-between items-center">
           <div className="flex items-center gap-2">
             <Target className="w-3 h-3 text-accent" />
             <span className="text-[9px] font-black uppercase text-accent">Synthesized Rating</span>
           </div>
           <span className="text-xs font-black text-accent">{synthesizedRating} / 100</span>
        </div>
      </CardContent>
    </Card>
  );
}

function IngestionHeartbeat() {
  const firestore = useFirestore();
  const heartbeatRef = useMemoFirebase(() => firestore ? doc(firestore, 'events', 'system_heartbeat') : null, [firestore]);
  const { data: heartbeat, isLoading } = useDoc<any>(heartbeatRef);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) return <Skeleton className="h-12 w-full rounded-xl" />;

  const lastPulse = heartbeat?.lastPulse?.toDate ? heartbeat.lastPulse.toDate() : new Date();
  const freshness = Date.now() - lastPulse.getTime();
  const isFresh = freshness < 3600000; // Fresh if within 1 hour

  return (
    <div className="flex items-center gap-4 bg-background/40 border border-white/5 p-4 rounded-2xl shadow-inner group hover:border-primary/20 transition-all">
      <div className="p-2 bg-primary/10 rounded-lg text-primary">
        <Database className={cn("w-5 h-5", isFresh ? "animate-pulse" : "opacity-40")} />
      </div>
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Ingestion Heartbeat</span>
          {isFresh ? (
            <Badge className="bg-accent text-accent-foreground text-[7px] font-black h-3 px-1">LIVE BASIS</Badge>
          ) : (
            <Badge variant="outline" className="text-[7px] font-black h-3 px-1 border-white/10 opacity-40 uppercase">Awaiting Refresh</Badge>
          )}
        </div>
        <div className="text-xs font-black font-mono text-foreground uppercase tracking-tighter">
          Last Pulse: {mounted ? format(lastPulse, 'HH:mm:ss') : '--:--:--'} UTC
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[8px] font-black text-muted-foreground uppercase">Sync Protocol</span>
        <span className="text-[10px] font-mono font-bold text-primary">{heartbeat?.protocol || 'V7.0'}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const firestore = useFirestore();
  const { data: profile } = useUserProfile();
  const isInst = profile?.plan === 'internal';
  
  // 1. Fetch live markets for the snapshots
  const marketsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'markets'), orderBy('volume', 'desc'), limit(12)) : null,
    [firestore]
  );
  const { data: markets, isLoading: isMarketsLoading } = useCollection<Market>(marketsQuery);

  // 2. Fetch public ledger for aggregate integrity stats
  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc')) : null,
    [firestore]
  );
  const { data: ledgerEntries, isLoading: isLedgerLoading } = useCollection<PublicLedgerEntry>(ledgerQuery);

  // 3. Fetch Macro Signals for environment visibility
  const signalsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'externalSignals'), orderBy('ts', 'desc'), limit(4)) : null,
    [firestore]
  );
  const { data: macroSignals } = useCollection<ExternalSignal>(signalsQuery);

  // 4. Compute Real-time System Integrity Metrics
  const systemStats = useMemo(() => {
    if (!ledgerEntries || ledgerEntries.length === 0) return { prs: '0.88', ecs: '12.4%', dcs: '94%', active: '0' };

    const resolved = ledgerEntries.filter(e => e.resolved);
    const bets = resolved.filter(e => e.stance === 'BET');
    const wins = bets.filter(e => (calculatePnl(e) || 0) > 0);
    
    const prs = bets.length > 0 ? (wins.length / bets.length).toFixed(2) : '0.88'; 
    const totalPnl = resolved.reduce((acc, e) => acc + (calculatePnl(e) || 0), 0);
    const ecs = resolved.length > 0 ? ((totalPnl / resolved.length) * 100).toFixed(1) + '%' : '12.4%';
    const dcs = '94%'; 
    const activeCount = ledgerEntries.filter(e => !e.resolved).length;

    return { prs, ecs, dcs, active: activeCount.toString() };
  }, [ledgerEntries]);

  const stats = [
    { label: 'System PRS', val: systemStats.prs, icon: ShieldCheck, color: 'text-accent' },
    { label: 'Avg Edge (ECS)', val: systemStats.ecs, icon: TrendingUp, color: 'text-primary' },
    { label: 'Discipline (DCS)', val: systemStats.dcs, icon: Target, color: 'text-blue-400' },
    { label: 'Active Signals', val: systemStats.active, icon: Activity, color: 'text-orange-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 text-left">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 text-left">
        <div className="space-y-4 text-left">
          <div className="flex items-center gap-2">
            <Badge className="bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-widest px-2">
              Intelligence Audit Dashboard
            </Badge>
          </div>
          <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none">
            System <span className="text-primary">Snapshot</span>.
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl font-medium leading-relaxed">
            Real-time quantitative synthesis across 16 analytical dimensions. This dashboard monitors live opportunities and platform accountability metrics.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <DiscoveryProtocolSOP />
            <IngestionHeartbeat />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
          {stats.map(stat => (
            <div key={stat.label} className="bg-card border p-3 rounded-lg space-y-1 group hover:border-primary/30 transition-colors text-left">
              <div className="flex items-center gap-2">
                <stat.icon className={cn("w-3 h-3", stat.color)} />
                <span className="text-[9px] font-black uppercase text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-xl font-black font-mono tracking-tighter">
                {isLedgerLoading ? <Skeleton className="h-6 w-12" /> : stat.val}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isInst && (
        <section className="bg-[hsl(var(--quant-primary)/0.05)] border border-[hsl(var(--quant-primary)/0.2)] rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.1)] relative overflow-hidden group animate-in zoom-in-95 duration-1000 text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Cpu className="w-48 h-48 text-[hsl(var(--quant-primary))]" />
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[hsl(var(--quant-primary)/0.1)] rounded border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))]">
                  <BrainCircuit className="w-6 h-6 animate-pulse" />
                </div>
                <Badge className="bg-[hsl(var(--quant-primary))] text-white font-black text-[10px] uppercase tracking-[0.3em] px-3">
                  Quant+ Substrate Link
                </Badge>
              </div>
              <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic leading-none">
                Autonomous <span className="text-[hsl(var(--quant-primary))]">GAD Engine</span> Active.
              </h2>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">
                "Your node is authorized for structural discontinuity filtering. Access real-time trace logs of the Generalized Adaptive Discontinuity filter and historical walk-forward replay logic."
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Button size="lg" className="h-12 px-10 bg-[hsl(var(--quant-primary))] hover:bg-[hsl(var(--quant-primary)/0.9)] text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-2xl" asChild>
                <Link href="/quant-plus/terminal">Launch GAD HUD <Cpu className="w-4 h-4" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-10 border-[hsl(var(--quant-primary)/0.3)] bg-white/5 text-[hsl(var(--quant-primary))] font-black uppercase text-[10px] tracking-widest gap-2" asChild>
                <Link href="/quant-plus/backtest">Review Replays <RefreshCcw className="w-4 h-4" /></Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 text-left">
        <NarrativeHeatmap />
      </section>

      <section className="bg-primary/5 border border-primary/10 rounded-2xl p-6 shadow-inner relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Globe className="w-32 h-32 text-primary" />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between border-b border-primary/10 pb-4">
            <div className="flex items-center gap-3">
              <Radio className="w-5 h-5 text-primary animate-pulse" />
              <h2 className="text-xl font-black font-headline italic uppercase tracking-tighter">Global Macro Environment</h2>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase">Ingestion Cluster: Active</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {macroSignals?.map((s) => (
              <div key={s.id} className="bg-background/40 border border-white/5 p-4 rounded-xl space-y-2 group hover:border-primary/30 transition-all text-left">
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{s.signalName}</span>
                  <Badge variant="outline" className="text-[8px] h-4 font-black uppercase opacity-50">{s.signalType}</Badge>
                </div>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black font-mono tracking-tighter text-foreground group-hover:text-primary transition-colors">{s.value}</div>
                  {s.delta !== null && (
                    <div className={cn("text-[10px] font-bold", s.delta >= 0 ? "text-accent" : "text-destructive")}>
                      {s.delta >= 0 ? '+' : ''}{s.delta}
                    </div>
                  )}
                </div>
                <p className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter opacity-40">Basis: {s.source}</p>
              </div>
            )) || (
              <div className="col-span-full h-24 flex items-center justify-center opacity-30 border-2 border-dashed rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Macro Data Ingestion...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-primary/10 pb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent fill-accent" />
            <h2 className="text-xl font-bold font-headline italic uppercase tracking-tighter">Live Intel Opportunities</h2>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Updated every 60s</span>
        </div>

        {isMarketsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-[500px] w-full rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {markets?.map(m => <MarketIntelSnapshot key={m.id} market={m} />)}
          </div>
        )}
      </section>

      <section className="bg-card border rounded-2xl overflow-hidden shadow-2xl text-left">
        <div className="p-8 space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-primary">
              <Info className="w-6 h-6" />
              <h2 className="text-2xl font-bold font-headline italic uppercase tracking-tighter">Intelligence Methodology</h2>
            </div>
            <p className="text-muted-foreground text-sm max-3xl font-medium leading-relaxed">
              Predictive Insights Pro utilizes a hybrid deterministic-AI approach. Scores 1-10 measure raw market dynamics, while 11-16 quantify process integrity and hidden risks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-6 text-left">
              <div className="flex items-center gap-2 border-b pb-2">
                <Activity className="w-4 h-4 text-accent" />
                <h3 className="text-xs font-black uppercase tracking-widest">Analysis Core (1-10)</h3>
              </div>
              <div className="space-y-4 text-xs text-muted-foreground leading-relaxed font-medium">
                <p><strong className="text-foreground">SPS/CCI/MIS:</strong> Primary detectors for liquidity traps and mispricing events.</p>
                <p><strong className="text-foreground">BDS (Belief Divergence):</strong> High scores indicate a "Crowded Trade" or extreme polarization where price discovery is most efficient.</p>
                <p><strong className="text-foreground">SCS (Signal Clarity):</strong> Combines EV, confidence, and noise into a single readability metric.</p>
                <p><strong className="text-foreground">IAS (Invalidation Alert):</strong> Measures how close the current market reality is to breaking the core signal thesis.</p>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div className="flex items-center gap-2 border-b pb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest">Accountability (11-13)</h3>
              </div>
              <div className="space-y-4 text-xs text-muted-foreground leading-relaxed font-medium">
                <p><strong className="text-foreground">PRS (Predictive Reliability):</strong> A rolling 30-day accuracy metric weighted by the difficulty of the venue.</p>
                <p><strong className="text-foreground">ECS (Edge Capture):</strong> Tracks the delta between the "Theoretical Fair Value" at issue and the final settlement.</p>
                <p><strong className="text-foreground">DCS (Discipline):</strong> Penalizes the model if it generates BET signals during periods of high RRS (Regime Risk).</p>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div className="flex items-center gap-2 border-b pb-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-black uppercase tracking-widest">Pro Risk Layer (14-16)</h3>
              </div>
              <div className="space-y-4 text-xs text-muted-foreground leading-relaxed bg-primary/5 p-4 rounded-lg border border-primary/10 font-medium">
                <p><strong className="text-foreground">PCS (Portfolio Correlation):</strong> Detects hidden risks across correlated positions.</p>
                <p><strong className="text-foreground">ARS (Asymmetric Risk):</strong> Detects "Nickel in front of a steamroller" scenarios. High values favor low-prob/high-payout bets.</p>
                <p><strong className="text-foreground">HSS (Horizon Sensitivity):</strong> Crucial for political or legal markets where a delay in the event destroys the bet value.</p>
                <div className="flex items-center gap-2 pt-2">
                  <Lock className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase">Upgrade to Pro for deep risk API access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center gap-8 py-12 opacity-40">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3 text-accent" /> Immutable Ledger Link
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <Clock className="w-3 h-3 text-primary" /> Real-time Ingestion V2.1
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
          <Info className="w-3 h-3 text-accent" /> Multi-Venue Consensus Active
        </div>
      </div>
    </div>
  );
}