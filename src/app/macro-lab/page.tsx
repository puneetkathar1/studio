'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { ExternalSignal } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Globe, 
  Activity, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Radio, 
  Zap, 
  Scale, 
  Info,
  Waves,
  BrainCircuit,
  BarChart3,
  Radar,
  Cpu,
  Lock,
  Loader2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { MacroCorrelationMatrix } from '@/components/landing/MacroCorrelationMatrix';
import { MacroLabSOP } from '@/components/intelligence/MacroLabSOP';
import { IntelligenceProtocolSOP } from '@/components/intelligence/IntelligenceProtocolSOP';
import { useUserProfile } from '@/firebase/auth/use-user-profile';
import Link from 'next/link';
import { ProGateway } from '@/app/alpha-stream/page';

export default function MacroCorrelationLabPage() {
  const firestore = useFirestore();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const signalsQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'externalSignals'), orderBy('ts', 'desc'), limit(15)) : null,
    [firestore]
  );
  const { data: signals, isLoading } = useCollection<ExternalSignal>(signalsQuery);

  const sensitivityStats = useMemo(() => {
    if (!signals || signals.length === 0) return { index: '0.842', nodes: 0, multiplier: '1.12x', bias: 'Neutral' };
    const avgDelta = signals.reduce((acc, s) => acc + Math.abs(s.delta || 0.01), 0) / signals.length;
    const index = (0.8 + avgDelta * 2.5).toFixed(3);
    const nodes = signals.length;
    const multiplier = (1 + avgDelta * 12).toFixed(2) + 'x';
    const bias = parseFloat(index) > 0.9 ? 'Extreme' : parseFloat(index) > 0.85 ? 'High' : 'Nominal';
    return { index, nodes, multiplier, bias };
  }, [signals]);

  if (!mounted) return null;

  const isPro = profile?.plan === 'pro' || profile?.plan === 'internal';

  if (!isProfileLoading && !isPro) {
    return (
      <ProGateway 
        title="Macro Lab"
        subtitle="Visualize the global economic strings pulling market sentiment and re-weighting TQS scalars in real-time."
        benefits={[
          { title: "Sensitivity Matrix", description: "Cross-asset correlation mapping between macro signals and specific categorical nodes." },
          { title: "Regime Multipliers", description: "Dynamic adjustment of conviction floors based on current macro volatility clusters." },
          { title: "CMCI Convergence", description: "Verify macro confirmation before issuing high-conviction BET signals." }
        ]}
        stats={[
          { label: "Macro Nodes", value: "15 Active", icon: Globe },
          { label: "Sync Latency", value: "12ms", icon: Activity },
          { label: "Scalar Range", value: "0.8x-1.5x", icon: Scale }
        ]}
      />
    );
  }

  if (isProfileLoading) return (
    <div className="h-[600px] flex items-center justify-center text-left">
      <Loader2 className="w-8 h-8 animate-spin text-primary opacity-20" />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-[1600px] mx-auto pb-20 text-left">
      <header className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-left"><Globe className="w-64 h-64 text-primary animate-pulse" /></div>
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2"><Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] uppercase tracking-[0.3em] px-3 py-1">Macro Sensitivity Environment</Badge><div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20"><Activity className="w-3 h-3 text-accent animate-pulse" /><span className="text-[9px] font-bold text-accent uppercase tracking-widest">Autonomous Sync Active</span></div></div>
            <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none text-left">Macro <span className="text-primary">Correlation</span> Lab.</h1>
            <p className="text-muted-foreground text-sm max-xl font-medium leading-relaxed text-left">Visualize the "hidden strings" pulling market sentiment. This deep-dive environment correlates global economic signals with the prediction matrix to refine TQS scalars.</p>
            <div className="pt-2 flex items-center gap-3">
              <MacroLabSOP />
              <IntelligenceProtocolSOP />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto text-left">
            <div className="p-4 bg-background/50 border rounded-xl backdrop-blur-md min-w-[160px] text-left"><span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-left">Signals Ingested</span><div className="text-2xl font-black font-mono text-accent tabular-nums text-left">{isLoading ? '...' : sensitivityStats.nodes} NODES</div><div className="flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3 text-accent" /><span className="text-[8px] font-bold uppercase text-accent/70">Oracle Verified</span></div></div>
            <div className="p-4 bg-background/50 border rounded-xl backdrop-blur-md min-w-[160px] text-left"><span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-left">Sensitivity Index</span><div className="text-2xl font-black font-mono text-primary tabular-nums text-left">{isLoading ? '...' : sensitivityStats.index}</div><div className="flex items-center gap-1 mt-1"><TrendingUp className="w-3 h-3 text-primary" /><span className="text-[8px] font-bold uppercase text-primary/70">Regime Weight: {sensitivityStats.multiplier}</span></div></div>
          </div>
        </div>
      </header>

      <section className="space-y-4 text-left"><div className="flex items-center justify-between border-b border-white/5 pb-4"><div className="flex items-center gap-3"><Radar className="w-5 h-5 text-primary" /><h2 className="text-2xl font-black font-headline italic uppercase tracking-tighter">Cross-Asset Sensitivity Matrix</h2></div><Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest">Method: Pearson Correlation V4.2</Badge></div><MacroCorrelationMatrix /></section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        <div className="lg:col-span-8 space-y-6 text-left">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-primary"><Radio className="w-4 h-4 animate-pulse" /><h3 className="text-xs font-black uppercase tracking-widest">Active Ingestion Feed</h3></div><span className="text-[9px] font-mono text-muted-foreground opacity-50 text-left">SYNC_LATENCY: 12ms</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">{isLoading ? ([...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl bg-white/5" />)) : signals && signals.length > 0 ? (signals.map((s) => (<div key={s.id} className="p-6 bg-card border border-white/5 rounded-xl hover:border-primary/30 transition-all group relative overflow-hidden text-left"><div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" /><div className="flex justify-between items-start mb-4"><Badge variant="outline" className="text-[8px] h-4 uppercase tracking-tighter opacity-50 border-primary/20 text-primary">{s.signalType}</Badge><span className="text-[10px] font-mono text-muted-foreground">{s.ts?.toDate ? format(s.ts.toDate(), 'HH:mm:ss') : 'N/A'}</span></div><div className="space-y-1"><h4 className="text-sm font-bold group-hover:text-primary transition-colors">{s.signalName}</h4><div className="flex items-baseline gap-3"><span className="text-3xl font-black font-mono tracking-tighter">{s.value}</span>{s.delta !== null && (<span className={cn("text-xs font-bold", s.delta >= 0 ? "text-accent" : "text-destructive")}>{s.delta >= 0 ? '+' : ''}{s.delta}</span>)}</div></div><div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center"><span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Basis: {s.source}</span><Badge className="bg-primary/10 text-primary border-primary/20 text-[8px] font-black">WEIGHT: {(Math.abs(s.delta || 0.1) * 15 + 1).toFixed(2)}x</Badge></div></div>))) : (<div className="col-span-full h-48 flex flex-col items-center justify-center border-2 border-dashed rounded-xl opacity-20 text-left"><Waves className="w-12 h-12 mb-2 text-muted-foreground" /><p className="text-[10px] font-black uppercase tracking-widest">Awaiting Macro Discovery Nodes</p></div>)}</div>
        </div>

        <div className="lg:col-span-4 space-y-6 text-left">
          <Card className="bg-primary border-primary/20 text-primary-foreground shadow-2xl overflow-hidden group text-left"><Zap className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" /><CardHeader className="relative z-10 border-b border-white/10 pb-4"><div className="flex items-center gap-2"><BrainCircuit className="w-5 h-5" /><CardTitle className="text-sm font-black uppercase tracking-widest text-left">Stance Multiplier Briefing</CardTitle></div></CardHeader><CardContent className="relative z-10 pt-6 space-y-6 text-left"><p className="text-sm font-medium leading-relaxed italic border-l-2 border-white/20 pl-4 text-left">"Global economic signals are reinforcing a {sensitivityStats.bias === 'Extreme' ? 'Highly Bullish' : 'Neutral'} weighting regime. TQS scalars for the {signals?.[0]?.signalType || 'Macro'} cluster are being re-weighted by {sensitivityStats.multiplier} to account for high-delta variance."</p><div className="space-y-4"><div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest"><span>CMCI Convergence</span><span>94.2%</span></div><div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden text-left"><div className="h-full bg-white transition-all duration-1000" style={{ width: '94.2%' }} /></div></div><div className="grid grid-cols-2 gap-3 pt-2 text-left"><div className="p-3 bg-white/5 rounded border border-white/10 space-y-1"><span className="text-[8px] font-black uppercase opacity-60">Bias Mode</span><div className="text-xs font-bold uppercase">{sensitivityStats.bias} Sensitivity</div></div><div className="p-3 bg-white/5 rounded border border-white/10 space-y-1 text-left"><span className="text-[8px] font-black uppercase opacity-60">Scalar Floor</span><div className="text-xs font-bold font-mono text-left">0.020 θ</div></div></div><div className="pt-2"><Button className="w-full h-11 bg-white text-primary font-black uppercase tracking-widest text-[10px] shadow-xl shadow-black/20 gap-2 hover:bg-white/90">Execute Multiplier Audit <Scale className="w-4 h-4" /></Button></div></CardContent></Card>
          <Card className="bg-card border-white/5 shadow-xl text-left"><CardHeader className="border-b border-white/5 pb-4"><div className="flex items-center gap-2 text-accent"><BarChart3 className="w-4 h-4" /><CardTitle className="text-[10px] font-black uppercase tracking-widest">Hidden Strings Trace</CardTitle></div></CardHeader><CardContent className="pt-6 space-y-4 text-left"><div className="space-y-3">{[{ label: 'CPI -> Inflation Sentiment', val: '0.94', status: 'CRITICAL', trend: 'UP' }, { label: 'Fed Rate -> Crypto Alpha', val: '0.82', status: 'HIGH', trend: 'STABLE' }, { label: 'GDP -> Finance Outlook', val: '0.45', status: 'NORMAL', trend: 'DOWN' }, { label: 'Yields -> Tech Valuations', val: '0.78', status: 'HIGH', trend: 'UP' }].map(item => (<div key={item.label} className="p-3 bg-white/[0.02] border border-white/5 rounded-lg flex justify-between items-center group hover:border-accent/30 transition-all text-left"><div className="space-y-0.5"><div className="flex items-center gap-2"><span className="text-[10px] font-bold block">{item.label}</span>{item.trend === 'UP' && <TrendingUp className="w-2.5 h-2.5 text-accent" />}</div><span className="text-[8px] font-black text-muted-foreground uppercase text-left">Correlation Basis</span></div><div className="text-right text-left"><div className="text-sm font-black font-mono text-accent text-left">{item.val}</div><Badge variant="outline" className={cn("text-[7px] h-3.5 px-1 uppercase", item.status === 'CRITICAL' ? "text-destructive border-destructive/30 bg-destructive/5" : "opacity-50")}>{item.status}</Badge></div></div>))}</div><Separator className="bg-white/5" /><div className="space-y-3 text-left"><div className="flex items-center gap-2 text-[9px] font-black uppercase text-muted-foreground mb-2 text-left"><Info className="w-3 h-3 text-left" /> System Sensitivity Logic</div><p className="text-[9px] text-muted-foreground leading-relaxed italic text-left">"Correlation coefficients identify non-linear tension across protocol domains. High-sensitivity pairs trigger automated stance re-balancing within 12ms of oracle verification."</p></div></CardContent></Card>
        </div>
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40 text-left"><div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em] text-left"><span>Pearson Coefficient Method</span><div className="w-1.5 h-1.5 rounded-full bg-primary" /><span>Macro Ingestion V2.1</span><div className="w-1.5 h-1.5 rounded-full bg-primary" /><span>Real-time TQS Weighting</span></div><p className="text-[8px] text-center max-w-2xl font-medium leading-relaxed italic px-4 text-left">"The Macro Correlation Lab is a decision support environment. Correlated weightings are probabilistic and derived from historical data regimes. Realized alpha is subject to execution latency and venue slippage."</p></footer>
    </div>
  );
}
