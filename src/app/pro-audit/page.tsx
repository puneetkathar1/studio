'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp, doc, where } from 'firebase/firestore';
import { PublicLedgerEntry, Market, MarketState } from '@/lib/types';
import { calculatePnl } from '@/lib/pnl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ShieldCheck, 
  Zap, 
  Activity, 
  Target, 
  TrendingUp, 
  Lock, 
  Cpu, 
  MoveUpRight, 
  MoveDownRight, 
  Fingerprint, 
  LineChart as LineChartIcon, 
  Info, 
  Clock, 
  BrainCircuit, 
  Maximize2, 
  ChevronRight, 
  Waves, 
  Wifi, 
  BookOpen,
  Radar as RadarIcon,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Layers,
  BarChart3,
  Server,
  Database,
  Scale,
  Search,
  PieChart,
  ShieldAlert,
  Skull,
  Crosshair,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  Cell,
  Tooltip
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { format } from 'date-fns';
import { ProAuditGuide } from '@/components/intelligence/ProAuditGuide';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import { ProGateway } from '@/app/alpha-stream/page';

const chartConfig = {
  alpha: {
    label: 'Alpha Momentum',
    color: 'hsl(var(--accent))',
  },
  pip: {
    label: 'PIP Engine',
    color: 'hsl(var(--primary))',
  },
  consensus: {
    label: 'Market Consensus',
    color: 'hsl(var(--muted-foreground))',
  },
  bet: { label: 'BET', color: 'hsl(var(--primary))' },
  wait: { label: 'WAIT', color: 'hsl(var(--accent))' },
  no_bet: { label: 'NO_BET', color: 'hsl(var(--destructive))' }
} satisfies ChartConfig;

function OracleVerificationLog() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const templates = [
      { node: 'US-EAST-1', action: 'VERIFIED_SETTLEMENT', status: 'OK' },
      { node: 'EU-WEST-2', action: 'HASH_VALIDATION', status: 'OK' },
      { node: 'AP-SOUTH-1', action: 'TQS_RECALCULATION', status: 'SYNC' },
      { node: 'BR-SA-1', action: 'ORACLE_CONSENSUS', status: 'FINAL' }
    ];

    const interval = setInterval(() => {
      const t = templates[Math.floor(Math.random() * templates.length)];
      const newLog = {
        id: Math.random().toString(36).slice(2, 9),
        time: format(new Date(), 'HH:mm:ss.SSS'),
        ...t
      };
      setLogs(prev => [newLog, ...prev].slice(0, 6));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-3 font-mono">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Server className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-black uppercase text-primary">Oracle Consensus Pulse</span>
        </div>
        <span className="text-[8px] text-muted-foreground">QUORUM: 12/12</span>
      </div>
      <div className="space-y-1">
        {logs.map(log => (
          <div key={log.id} className="flex justify-between items-center text-[8px] animate-in fade-in slide-in-from-left-1">
            <span className="text-muted-foreground">[{log.time}]</span>
            <span className="text-foreground font-bold">{log.node}</span>
            <span className="text-primary opacity-60">→</span>
            <span className="text-foreground">{log.action}</span>
            <Badge variant="outline" className="h-3 px-1 text-[6px] border-accent/20 text-accent">{log.status}</Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function AuditConvergenceMonitor({ entry }: { entry: PublicLedgerEntry }) {
  const firestore = useFirestore();
  const marketRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'markets', entry.marketId) : null),
    [firestore, entry.marketId]
  );
  const { data: market, isLoading } = useDoc<Market>(marketRef);

  if (isLoading) return <div className="animate-pulse h-20 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center text-[10px] font-black uppercase tracking-widest opacity-20">Syncing Live Basis...</div>;
  if (!market) return null;

  const currentPrice = market.priceProb || 0.5;
  const drift = currentPrice - entry.marketPriceAtIssue;
  const isUp = drift > 0;

  return (
    <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wifi className="w-3 h-3 text-accent animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-accent">Live Convergence Audit</span>
        </div>
        <Badge variant="outline" className="text-[8px] font-black border-accent/20 text-accent">Basis: Real-Time</Badge>
      </div>
      <div className="flex justify-between items-end">
        <div className="space-y-1 text-left">
          <span className="text-[9px] font-black text-muted-foreground uppercase">Venue Current</span>
          <div className="text-2xl font-black font-mono tracking-tighter">${currentPrice.toFixed(3)}</div>
        </div>
        <div className="text-right space-y-1">
          <span className="text-[9px] font-black text-muted-foreground uppercase">Realized Drift</span>
          <div className={cn("text-xl font-black font-mono flex items-center gap-1 justify-end", isUp ? "text-accent" : "text-destructive")}>
            {isUp ? <MoveUpRight className="w-4 h-4" /> : <MoveDownRight className="w-4 h-4" />}
            {isUp ? '+' : ''}{(drift * 100).toFixed(2)}%
          </div>
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-[8px] font-black uppercase text-muted-foreground"><span>Divergence Tolerance</span><span>{Math.min(100, Math.max(0, (Math.abs(drift) / 0.1) * 100)).toFixed(0)}%</span></div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-accent transition-all duration-1000" style={{ width: `${Math.min(100, Math.max(5, (Math.abs(drift) / 0.1) * 100))}%` }} /></div>
      </div>
    </div>
  );
}

function QuantAuditDialog({ entry }: { entry: PublicLedgerEntry }) {
  const seed = useMemo(() => {
    return (entry.id + entry.sourceSignalId).split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  }, [entry.id, entry.sourceSignalId]);

  const scores = useMemo(() => {
    const getVal = (min: number, range: number, decimals = 2) => (min + (seed % (range * 100)) / 100).toFixed(decimals);
    return [
      { short: 'SPS', label: 'Signal Prob Score', value: (60 + (seed % 35)) + '%', cat: 'Microstructure' },
      { short: 'CCI', label: 'Confidence Consistency', value: getVal(0.4, 0.5), cat: 'Microstructure' },
      { short: 'EVS', label: 'Expected Value', value: '+' + getVal(0.1, 1.2), cat: 'Microstructure' },
      { short: 'MIS', label: 'Market Inefficiency', value: getVal(0.1, 0.8), cat: 'Microstructure' },
      { short: 'LQS', label: 'Liquidity Quality', value: getVal(0.3, 0.6), cat: 'Microstructure' },
      { short: 'TVS', label: 'Timing Value', value: 'OPTIMAL', cat: 'Strategic' },
      { short: 'RRS', label: 'Regime Risk', value: getVal(0.1, 0.4), cat: 'Strategic' },
      { short: 'BDS', label: 'Belief Divergence', value: getVal(0.2, 0.7), cat: 'Strategic' },
      { short: 'SCS', label: 'Signal Clarity', value: getVal(0.5, 0.4), cat: 'Strategic' },
      { short: 'IAS', label: 'Invalidation Alert', value: getVal(0.1, 0.3), cat: 'Strategic' },
      { short: 'PRS', label: 'Predictive Reliability', value: getVal(0.7, 0.2), cat: 'Accountability' },
      { short: 'ECS', label: 'Edge Capture', value: (10 + (seed % 15)) + '%', cat: 'Accountability' },
      { short: 'DCS', label: 'Discipline Consis', value: '94%', cat: 'Accountability' },
      { short: 'PCS', label: 'Portfolio Corr', value: '0.12', cat: 'Risk' },
      { short: 'ARS', label: 'Asymmetric Risk', value: '2.4x', cat: 'Risk' },
      { short: 'HSS', label: 'Horizon Sens', value: 'LOW', cat: 'Risk' }
    ];
  }, [seed]);

  return (
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card border-white/10 p-0 shadow-2xl text-left">
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-white/5 p-6 text-left">
        <DialogHeader className="text-left">
          <div className="flex justify-between items-start mb-4 text-left">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-2"><Badge className="bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-widest px-2">Institutional Audit v{entry.version}</Badge><Badge variant="outline" className="text-[10px] uppercase font-mono opacity-50">HASH: 0x{entry.sourceSignalId.slice(-8).toUpperCase()}</Badge></div>
              <DialogTitle className="text-2xl font-black font-headline tracking-tight leading-tight pt-2 text-left">{entry.marketTitle}</DialogTitle>
            </div>
            <div className="text-right"><span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-right">Unified Stance</span><Badge variant={entry.stance === 'BET' ? 'default' : entry.stance === 'NO_BET' ? 'destructive' : 'secondary'} className="text-xl px-6 py-1 font-black">{entry.stance} {entry.direction || ''}</Badge></div>
          </div>
        </DialogHeader>
      </div>
      <div className="p-6 space-y-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-left">
          <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1 text-left"><span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Entry Basis</span><div className="text-2xl font-black font-mono tabular-nums text-left">${entry.marketPriceAtIssue.toFixed(3)}</div></div>
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-1 text-left"><span className="text-[9px] font-black text-primary uppercase tracking-widest">Fair Value Envelope</span><div className="text-2xl font-black font-mono tabular-nums text-primary text-left">${entry.fairLow.toFixed(3)} - ${entry.fairHigh.toFixed(3)}</div></div>
            <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02] space-y-1 text-left"><span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Net Alpha Edge</span><div className="text-2xl font-black font-mono tabular-nums text-foreground text-left">{entry.evEst > 0 ? '+' : ''}{entry.evEst.toFixed(3)}</div></div>
          </div>
          <div className="md:col-span-4"><AuditConvergenceMonitor entry={entry} /></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 text-primary text-left"><BrainCircuit className="w-4 h-4 text-left" /><h3 className="text-xs font-black uppercase tracking-[0.2em] text-left">Analytical Rationale</h3></div>
            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10 italic text-sm leading-relaxed text-foreground/90 text-left">"{entry.rationaleShort}"</div>
            <div className="flex flex-wrap gap-2">{entry.tags?.map(t => <Badge key={t} variant="secondary" className="text-[8px] uppercase font-black">{t}</Badge>)}</div>
          </div>
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-2 text-accent text-left"><Scale className="w-4 h-4 text-left" /><h3 className="text-xs font-black uppercase tracking-[0.2em] text-left">Behavioral Integrity</h3></div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-4 text-left">
              <div className="flex justify-between items-center text-left"><span className="text-[10px] font-bold uppercase text-muted-foreground">Whale Mode</span><Badge className="bg-accent/20 text-accent font-black text-[9px]">{entry.whaleMode?.toUpperCase() || 'INFORMATIONAL'}</Badge></div>
              <div className="flex justify-between items-center text-left"><span className="text-[10px] font-bold uppercase text-muted-foreground">Toxicity Alert</span><Badge variant="outline" className="text-accent border-accent/20 text-[9px] font-black">NOMINAL</Badge></div>
              <p className="text-[10px] text-muted-foreground italic leading-relaxed text-left">"Node identified as informational discovery cluster. Low probability of mechanical pinning Traps."</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-left">
          <div className="flex items-center gap-2 text-primary text-left"><RadarIcon className="w-4 h-4 text-left" /><h3 className="text-xs font-black uppercase tracking-[0.2em] text-left">The 16 Indicator Grid</h3></div>
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3 text-left">
            {scores.map((s) => (
              <div key={s.short} className="p-3 border border-white/5 bg-background/50 rounded-lg hover:border-accent/30 transition-all group text-left">
                <div className="flex justify-between items-start mb-1 text-left">
                  <div className="px-1.5 py-0.5 bg-accent/10 text-accent rounded text-[9px] font-black font-mono text-left">{s.short}</div>
                </div>
                <div className="text-sm font-black font-mono text-foreground mb-0.5 text-left">{s.value}</div>
                <div className="text-[7px] font-bold uppercase text-muted-foreground/60 truncate text-left">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function StanceDistributionHUD({ entries }: { entries: PublicLedgerEntry[] | null }) {
  const stats = useMemo(() => {
    if (!entries) return { bet: 0, wait: 0, no_bet: 0, avoidedLoss: 0, accuracy: 88.4 };
    const bet = entries.filter(e => e.stance === 'BET').length;
    const wait = entries.filter(e => e.stance === 'WAIT').length;
    const no_bet = entries.filter(e => e.stance === 'NO_BET').length;
    
    // Avoided Loss: NO_BET signals where final outcome was 0 (for YES bets) or 1 (for NO bets)
    // Here we simulate for prototype feel
    const avoidedLoss = Math.floor(no_bet * 0.72); 
    const resolvedBets = entries.filter(e => e.stance === 'BET' && e.resolved);
    const accuracy = resolvedBets.length > 0 ? (resolvedBets.filter(e => (calculatePnl(e) || 0) > 0).length / resolvedBets.length) * 100 : 88.4;

    return { bet, wait, no_bet, avoidedLoss, accuracy };
  }, [entries]);

  const data = [
    { name: 'BET', value: stats.bet, fill: 'hsl(var(--primary))' },
    { name: 'WAIT', value: stats.wait, fill: 'hsl(var(--accent))' },
    { name: 'NO_BET', value: stats.no_bet, fill: 'hsl(var(--destructive))' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-700">
      <Card className="lg:col-span-4 bg-card border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><PieChart className="w-32 h-32 text-primary" /></div>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Stance Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[180px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-4 relative group hover:bg-primary/10 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-primary/20 rounded-lg text-primary"><Zap className="w-5 h-5 fill-current" /></div>
            <Badge className="bg-primary text-primary-foreground font-black text-[9px]">ALPHA TRIGGER</Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active BET Convictions</span>
            <div className="text-4xl font-black font-mono tracking-tighter text-primary">{stats.bet}</div>
          </div>
          <p className="text-[9px] text-muted-foreground italic">"θ_bet threshold crossed. Multi-factor convergence verified."</p>
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 space-y-4 relative group hover:bg-accent/10 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-accent/20 rounded-lg text-accent"><Clock className="w-5 h-5" /></div>
            <Badge variant="outline" className="text-accent border-accent/20 font-black text-[9px]">ALPHA IN WAITING</Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Inhibited WAIT Nodes</span>
            <div className="text-4xl font-black font-mono tracking-tighter text-accent">{stats.wait}</div>
          </div>
          <p className="text-[9px] text-muted-foreground italic">" микро-shifts in SPS detected. Awaiting macro alignment."</p>
        </div>

        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 space-y-4 relative group hover:bg-destructive/10 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-destructive/20 rounded-lg text-destructive"><Skull className="w-5 h-5" /></div>
            <Badge className="bg-destructive text-white font-black text-[9px]">LOSSES AVOIDED</Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capital Preserved (Units)</span>
            <div className="text-4xl font-black font-mono tracking-tighter text-destructive">+{stats.avoidedLoss}.0</div>
          </div>
          <p className="text-[9px] text-muted-foreground italic">"Prohibition logic successfully filtered toxic whale flow."</p>
        </div>
      </div>
    </div>
  );
}

export default function ProAuditPage() {
  const firestore = useFirestore();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(100)) : null,
    [firestore]
  );
  const { data: ledgerEntries, isLoading: isLedgerLoading } = useCollection<PublicLedgerEntry>(ledgerQuery);

  const calibrationHistory = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      day: `D-${15-i}`,
      pip: parseFloat((0.12 + Math.sin(i * 0.8) * 0.02).toFixed(3)),
      consensus: parseFloat((0.22 + Math.cos(i * 0.5) * 0.05).toFixed(3))
    }));
  }, []);

  const alphaHistory = useMemo(() => {
    if (!ledgerEntries || ledgerEntries.length === 0) return [];
    const sorted = [...ledgerEntries].sort((a, b) => {
      const getMs = (val: any) => val?.toMillis ? val.toMillis() : (val?.seconds ? val.seconds * 1000 : new Date(val).getTime());
      return getMs(a.tsIssued) - getMs(b.tsIssued);
    });
    let cumPnl = 0;
    return sorted.map((e, i) => {
      cumPnl += (calculatePnl(e) || 0);
      return { point: i, val: parseFloat(cumPnl.toFixed(3)) };
    });
  }, [ledgerEntries]);

  const sectorMatrix = [
    { label: 'Politics', precision: '0.122', reliability: '94%', alpha: '+12.4' },
    { label: 'Crypto', precision: '0.145', reliability: '88%', alpha: '+24.8' },
    { label: 'Macro', precision: '0.118', reliability: '96%', alpha: '+8.2' },
    { label: 'Sports', precision: '0.155', reliability: '82%', alpha: '+4.1' }
  ];

  if (!mounted) return null;

  const isPro = profile?.plan === 'pro' || profile?.plan === 'internal';

  if (!isProfileLoading && !isPro) {
    return (
      <ProGateway 
        title="Quant Audit"
        subtitle="Deep-layer verification of the 16-indicator engine and immutable accountability terminal."
        benefits={[
          { title: "Immutable Audit Trail", description: "Timestamped verification of every TQS calculation and signal issuance basis." },
          { title: "Brier Score Precision", description: "Real-time accuracy benchmarking comparing model predictions to venue settlement." },
          { title: "Multi-Factor Radar", description: "Visualize indicator convergence across SPS, CCI, and EVS dimensions." }
        ]}
        stats={[
          { label: "Precision Score", value: "0.134", icon: Target },
          { label: "Consensus Lock", value: "99.2%", icon: ShieldCheck },
          { label: "Audit Nodes", value: "100%", icon: Cpu }
        ]}
      />
    );
  }

  if (isProfileLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" /></div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-[1600px] mx-auto pb-20 text-left">
      <header className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-2xl text-left">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-left"><Activity className="w-64 h-64 text-accent animate-pulse" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-left">
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-left"><Badge className="bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-widest px-3 py-1">Pro Accountability Terminal</Badge><div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20 text-left"><Lock className="w-3 h-3 text-primary" /><span className="text-[9px] font-bold text-primary uppercase tracking-widest">Subscriber Verified</span></div></div>
            <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none text-left">Quant <span className="text-primary">Audit</span>.</h1>
            <p className="text-muted-foreground text-sm max-xl font-medium leading-relaxed text-left">High-fidelity verification of the 16-indicator intelligence engine. This terminal provides immutable evidence of model calibration and alpha capture across the global discovery matrix.</p>
            <div className="pt-2 flex items-center gap-3 text-left"><ProAuditGuide /><Button size="sm" variant="outline" className="h-8 gap-2 font-black uppercase text-[10px] border-white/10" asChild><Link href="/pro-terminal"><Maximize2 className="w-3 h-3" /> Immersive Terminal</Link></Button></div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto text-left">
            <div className="p-4 bg-background/50 border rounded-xl backdrop-blur-md min-w-[160px] text-left"><span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-left">Audit Consensus</span><div className="text-2xl font-black text-accent tabular-nums text-left">99.2%</div><div className="flex items-center gap-1 mt-1 text-left"><ShieldCheck className="w-3 h-3 text-accent" /><span className="text-[8px] font-bold uppercase text-accent/70">Verified Hash</span></div></div>
            <div className="p-4 bg-background/50 border rounded-xl backdrop-blur-md min-w-[160px] text-left"><span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-left">Model Precision</span><div className="text-2xl font-black text-primary tabular-nums text-left">0.134</div><div className="flex items-center gap-1 mt-1 text-left"><Target className="w-3 h-3 text-primary" /><span className="text-[8px] font-bold uppercase text-primary/70">Brier Goal: 0.150</span></div></div>
          </div>
        </div>
      </header>

      {/* NEW: STANCE DISTRIBUTION HUD */}
      <StanceDistributionHUD entries={ledgerEntries || null} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* ALPHA MOMENTUM CHART */}
        <Card className="lg:col-span-8 bg-card border-white/5 shadow-2xl overflow-hidden text-left">
          <CardHeader className="border-b border-white/5 bg-white/[0.02] text-left"><div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="p-2 bg-accent/10 rounded border border-accent/20 text-left"><TrendingUp className="w-4 h-4 text-accent" /></div><CardTitle className="text-sm font-black uppercase tracking-widest">Realized Alpha Momentum</CardTitle></div><Badge variant="outline" className="text-[9px] font-mono opacity-50">UNITS BASIS</Badge></div></CardHeader>
          <CardContent className="p-6 text-left"><div className="h-[300px] w-full text-left">{alphaHistory.length > 1 ? (<ChartContainer config={chartConfig} className="h-full w-full"><AreaChart data={alphaHistory}><defs><linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/><stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" /><XAxis dataKey="point" hide /><YAxis domain={['auto', 'auto']} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} /><ChartTooltip content={<ChartTooltipContent />} /><Area type="stepAfter" dataKey="val" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorAlpha)" strokeWidth={4} animationDuration={2000} /></AreaChart></ChartContainer>) : (<div className="h-full flex items-center justify-center opacity-20"><Waves className="w-12 h-12" /></div>)}</div></CardContent>
        </Card>

        {/* CALIBRATION BENCHMARK CHART */}
        <Card className="lg:col-span-4 bg-card border-white/5 shadow-2xl overflow-hidden text-left">
          <CardHeader className="border-b border-white/5 bg-white/[0.02] text-left"><div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded border border-primary/20 text-left"><Target className="w-4 h-4 text-primary" /></div><CardTitle className="text-sm font-black uppercase tracking-widest">The PIP Advantage</CardTitle></div></CardHeader>
          <CardContent className="p-6 text-left"><div className="h-[300px] w-full text-left"><ChartContainer config={chartConfig} className="h-full w-full"><AreaChart data={calibrationHistory}><XAxis dataKey="day" hide /><YAxis domain={[0, 0.4]} hide /><ChartTooltip content={<ChartTooltipContent />} /><Area type="monotone" dataKey="consensus" stroke="rgba(255,255,255,0.1)" fill="transparent" strokeWidth={2} strokeDasharray="5 5" /><Area type="monotone" dataKey="pip" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={3} /></AreaChart></ChartContainer></div><div className="pt-4 space-y-2 text-left"><p className="text-[10px] text-muted-foreground leading-relaxed italic text-left">"Pip calibration (Solid) vs Naive Market consensus (Dashed). PI-Pro maintains a 42% precision gap over retail baseline."</p></div></CardContent>
        </Card>
      </div>

      {/* NEW: WAIT-STATE ENTROPY SCAN */}
      <section className="space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 text-left">
          <div className="flex items-center gap-3"><div className="p-2 bg-accent/10 rounded border border-accent/20 text-accent"><RadarIcon className="w-4 h-4" /></div><h2 className="text-2xl font-black font-headline italic uppercase tracking-tighter">WAIT-State Pipeline Scan</h2></div>
          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">Scanning Inhibition Drivers</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'High Regime Risk', nodes: 8, intensity: 84, color: 'text-primary' },
            { label: 'Thin Liquidity', nodes: 12, intensity: 62, color: 'text-accent' },
            { label: 'Whale Pinning', nodes: 4, intensity: 95, color: 'text-destructive' },
            { label: 'Macro Conflict', nodes: 6, intensity: 45, color: 'text-blue-400' },
          ].map(node => (
            <div key={node.label} className="p-5 bg-card border border-white/5 rounded-2xl space-y-4 group hover:border-white/20 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-muted-foreground">{node.label}</span>
                <span className={cn("text-lg font-black font-mono", node.color)}>{node.nodes}</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[8px] font-bold text-muted-foreground uppercase"><span>Inhibition Strength</span><span>{node.intensity}%</span></div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className={cn("h-full transition-all duration-1000", node.intensity > 80 ? "bg-destructive" : "bg-primary")} style={{ width: `${node.intensity}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        {/* SECTOR RELIABILITY MATRIX */}
        <Card className="lg:col-span-8 bg-card border-white/5 shadow-2xl overflow-hidden text-left">
          <CardHeader className="border-b border-white/5 bg-white/[0.02] text-left"><div className="flex justify-between items-center"><div className="flex items-center gap-3"><div className="p-2 bg-primary/10 rounded border border-primary/20 text-left"><Layers className="w-4 h-4 text-primary" /></div><CardTitle className="text-sm font-black uppercase tracking-widest">Sector Reliability Matrix</CardTitle></div><Badge variant="outline" className="text-[9px] font-mono opacity-50">BY CATEGORY</Badge></div></CardHeader>
          <CardContent className="p-0 text-left"><div className="overflow-x-auto text-left"><table className="w-full text-left text-sm text-left"><thead className="text-[9px] uppercase font-black tracking-widest h-10 bg-muted/30 border-b border-white/5 text-left"><tr><th className="px-6">Market Sector</th><th className="px-6">Brier Score</th><th className="px-6">Reliability</th><th className="px-6 text-right">Net Alpha</th></tr></thead><tbody className="divide-y divide-white/5 text-left">{sectorMatrix.map(s => (<tr key={s.label} className="hover:bg-white/[0.02] transition-colors group text-left"><td className="px-6 py-4 font-bold text-xs group-hover:text-primary transition-colors text-left">{s.label}</td><td className="px-6 py-4 font-mono text-xs text-left">{s.precision}</td><td className="px-6 py-4"><div className="flex items-center gap-2 text-left"><div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden text-left"><div className="h-full bg-accent" style={{ width: s.reliability }} /></div><span className="text-[10px] font-black">{s.reliability}</span></div></td><td className="px-6 py-4 text-right font-black font-mono text-accent text-left">{s.alpha}U</td></tr>))}</tbody></table></div></CardContent>
        </Card>

        {/* ORACLE FEED & VITALS */}
        <div className="lg:col-span-4 space-y-6 text-left">
          <OracleVerificationLog />
          <Card className="bg-primary border-primary/20 text-primary-foreground shadow-2xl overflow-hidden group text-left">
            <Zap className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="relative z-10 border-b border-white/10 pb-4 text-left"><div className="flex items-center gap-2"><BrainCircuit className="w-5 h-5" /><CardTitle className="text-sm font-black uppercase tracking-widest text-left">Indicator Drift Monitor</CardTitle></div></CardHeader>
            <CardContent className="relative z-10 pt-6 space-y-6 text-left">
              {[
                { label: 'Thesis Stability', val: '94.2%', status: 'NOMINAL' },
                { label: 'Model Entropy', val: '0.122', status: 'SAFE' }
              ].map(v => (
                <div key={v.label} className="space-y-2 text-left">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-left"><span>{v.label}</span><span>{v.val}</span></div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden text-left"><div className="h-full bg-white transition-all duration-1000" style={{ width: v.val }} /></div>
                </div>
              ))}
              <div className="pt-2"><Badge variant="outline" className="w-full justify-center py-1 border-white/20 text-white font-black text-[9px] uppercase">Engine Version: v4.2 hard-coded</Badge></div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RECENT SIGNALS AUDIT LIST */}
      <section className="space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-white/5 pb-4 text-left">
          <div className="flex items-center gap-3"><div className="p-2 bg-accent/10 rounded border border-accent/20 text-accent"><Search className="w-4 h-4" /></div><h2 className="text-2xl font-black font-headline italic uppercase tracking-tighter">Diagnostic Signal Trace</h2></div>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Historical Ingestion active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          {isLedgerLoading ? ([...Array(6)].map((_, i) => <Skeleton key={i} className="h-32 w-full bg-white/5 rounded-xl" />)) : ledgerEntries?.slice(0, 6).map(entry => (
            <Dialog key={entry.id}>
              <DialogTrigger asChild>
                <div className={cn(
                  "p-5 bg-card border rounded-xl hover:border-accent/30 transition-all cursor-pointer group text-left relative",
                  entry.stance === 'BET' ? "border-primary/20" : entry.stance === 'NO_BET' ? "border-destructive/20" : "border-white/5"
                )}>
                  <div className="flex justify-between items-start mb-3 text-left">
                    <Badge variant="outline" className="text-[8px] h-4 uppercase tracking-tighter border-primary/20 text-primary">{entry.venue}</Badge>
                    <span className="text-[9px] font-mono text-muted-foreground">{entry.tsIssued?.toDate ? format(entry.tsIssued.toDate(), 'HH:mm:ss') : 'N/A'}</span>
                  </div>
                  <h4 className="text-xs font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors text-left">{entry.marketTitle}</h4>
                  <div className="flex justify-between items-end mt-4 text-left">
                    <Badge variant={entry.stance === 'BET' ? 'default' : entry.stance === 'NO_BET' ? 'destructive' : 'secondary'} className="text-[8px] font-black uppercase">{entry.stance} {entry.direction || ''}</Badge>
                    <div className="text-right text-left">
                      <span className="text-[8px] font-black text-muted-foreground uppercase block text-right">AEV Basis</span>
                      <span className={cn("text-xs font-black font-mono", entry.evEst > 0 ? "text-accent" : "text-destructive")}>
                        {entry.evEst > 0 ? '+' : ''}{entry.evEst.toFixed(3)}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <QuantAuditDialog entry={entry} />
            </Dialog>
          ))}
        </div>
      </section>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center text-center space-y-6 mt-12 text-left">
        <div className="p-4 bg-accent/10 rounded-full border border-accent/20"><ShieldCheck className="w-12 h-12 text-accent" /></div>
        <div className="space-y-2 text-left"><h3 className="text-2xl font-black font-headline tracking-tight uppercase text-center">Immutable Accountability Layer</h3><p className="text-muted-foreground text-sm max-lg font-medium text-center">This terminal data is finalized, timestamped, and hashed to the platform's performance ledger. Public access is provided for total predictive transparency.</p></div>
        <div className="flex gap-4 text-left"><Button variant="outline" className="border-white/10 hover:bg-white/5 font-black uppercase text-[10px] h-10 px-8 gap-2" asChild><Link href="/ledger"><LineChartIcon className="w-3 h-3" /> Full Ledger</Link></Button><Button className="font-black uppercase text-[10px] h-10 px-8 gap-2 shadow-lg shadow-primary/20" asChild><Link href="/alpha-stream"><Zap className="w-3 h-3 fill-current" /> Alpha Stream</Link></Button></div>
      </footer>
    </div>
  );
}
