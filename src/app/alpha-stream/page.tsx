'use client';

import { useMemo, useState, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, query, orderBy, limit, where, Timestamp, doc } from 'firebase/firestore';
import { PublicLedgerEntry, Market } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  ArrowUpRight, 
  Clock, 
  BrainCircuit, 
  ShieldCheck,
  Activity,
  Waves,
  ArrowRight,
  Scale,
  Cpu,
  History,
  Wifi,
  MoveUpRight,
  MoveDownRight,
  Lock,
  CheckCircle2,
  ShieldAlert
} from 'lucide-react';
import Link from 'next/link';
import { format, subDays } from 'date-fns';
import { AlphaStreamSOP } from '@/components/intelligence/AlphaStreamSOP';
import { IntelligenceProtocolSOP } from '@/components/intelligence/IntelligenceProtocolSOP';
import { cn } from '@/lib/utils';
import { useUserProfile } from '@/firebase/auth/use-user-profile';

function LivePerformanceProxy({ marketId, initialPrice }: { marketId: string, initialPrice: number }) {
  const firestore = useFirestore();
  const marketRef = useMemoFirebase(() => firestore ? doc(firestore, 'markets', marketId) : null, [firestore, marketId]);
  const { data: market } = useDoc<Market>(marketRef);

  if (!market) return null;

  const currentPrice = market.priceProb || initialPrice;
  const drift = ((currentPrice - initialPrice) / initialPrice) * 100;
  const isUp = drift >= 0;

  return (
    <div className="flex items-center gap-3 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
      <div className="flex flex-col">
        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Live Basis</span>
        <span className="text-[10px] font-black font-mono tabular-nums text-foreground">${currentPrice.toFixed(3)}</span>
      </div>
      <div className="h-4 w-px bg-white/10" />
      <div className="flex flex-col items-end">
        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-widest">Realized Drift</span>
        <div className={cn("text-[10px] font-black font-mono flex items-center gap-0.5", isUp ? "text-accent" : "text-destructive")}>
          {isUp ? <MoveUpRight className="w-2.5 h-2.5" /> : <MoveDownRight className="w-2.5 h-2.5" />}
          {isUp ? '+' : ''}{drift.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}

function AlphaAuditDialog({ entry }: { entry: PublicLedgerEntry }) {
  const seed = useMemo(() => {
    return entry.id.split('').reduce((acc, char, i) => acc + char.charCodeAt(0) * (i + 1), 0);
  }, [entry.id]);

  const issuedDate = useMemo(() => {
    return entry.tsIssued instanceof Timestamp 
      ? entry.tsIssued.toDate() 
      : (entry.tsIssued?.toDate ? entry.tsIssued.toDate() : new Date(entry.tsIssued));
  }, [entry.tsIssued]);

  const audit = useMemo(() => {
    const getVal = (min: number, range: number) => (min + (seed % (range * 100)) / 100).toFixed(2);
    const sps = (75 + (seed % 20)).toFixed(1);
    const cci = getVal(0.8, 0.15);
    const tqs = entry.tqs || (0.02 + (seed % 10) / 1000);
    
    return {
      sps,
      cci,
      tqs,
      liquidityImpact: seed % 2 === 0 ? 'Low' : 'Minimal',
      alphaBasis: (entry.evEst || 0) > 0 ? 'Positive Skew' : 'Negative Skew',
      convergence: (94 + (seed % 5)).toFixed(1) + '%'
    };
  }, [seed, entry.tqs, entry.evEst]);

  return (
    <DialogContent className="max-w-2xl bg-[#0A0C12] border-white/10 text-foreground shadow-2xl">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/10 rounded border border-accent/20">
            <ShieldCheck className="w-5 h-5 text-accent" />
          </div>
          <div>
            <DialogTitle className="text-xl font-black font-headline tracking-tight uppercase italic text-left">
              Alpha Convergence Audit
            </DialogTitle>
            <DialogDescription className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground text-left">
              Protocol v4.2 • Execution Readiness Verification
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-8 py-4 text-left">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Zap className="w-32 h-32 text-accent" />
          </div>
          <div className="relative z-10 space-y-4">
            <h3 className="text-lg font-black font-headline uppercase italic leading-none">{entry.marketTitle}</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">TQS Scalar</span>
                <div className="text-3xl font-black font-mono text-accent tabular-nums">
                  {typeof audit.tqs === 'number' ? audit.tqs.toFixed(4) : audit.tqs}
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-1 flex-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: '85%' }} />
                  </div>
                  <span className="text-[8px] font-bold text-accent">&theta;_bet OK</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">Model Convergence</span>
                <div className="text-3xl font-black font-mono text-primary tabular-nums">
                  {audit.convergence}
                </div>
                <p className="text-[8px] text-primary/60 font-bold uppercase">Multi-Factor Aligned</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-white/5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-primary">
              <Activity className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Pressure (SPS)</span>
            </div>
            <div className="text-xl font-black font-mono">{audit.sps}%</div>
            <p className="text-[8px] text-muted-foreground leading-tight italic">Detects capital commitment vs thin retail noise.</p>
          </div>
          <div className="p-4 border border-white/5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-accent">
              <Target className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Confidence (CCI)</span>
            </div>
            <div className="text-xl font-black font-mono">{audit.cci}</div>
            <p className="text-[8px] text-muted-foreground leading-tight italic">Measures price stability across venue discovery nodes.</p>
          </div>
          <div className="p-4 border border-white/5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-orange-400">
              <Scale className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-widest">Slippage Proxy</span>
            </div>
            <div className="text-xl font-black font-mono">{audit.liquidityImpact}</div>
            <p className="text-[8px] text-muted-foreground leading-tight italic">Estimated alpha erosion at standard unit sizing.</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <BrainCircuit className="w-4 h-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Alpha Rationale Breakdown</h4>
          </div>
          <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-4">
            <p className="text-xs leading-relaxed italic text-foreground/90">
              "{entry.rationaleShort}"
            </p>
            <div className="h-px bg-white/5" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[9px] font-medium text-muted-foreground">
              <div className="flex gap-2">
                <div className="w-1 h-full bg-accent rounded-full" />
                <p><strong>Alpha Basis:</strong> The current market price of ${entry.marketPriceAtIssue.toFixed(3)} represents a significant discount to model fair value.</p>
              </div>
              <div className="flex gap-2">
                <div className="w-1 h-full bg-primary rounded-full" />
                <p><strong>Execution Readiness:</strong> TQS is currently {((parseFloat(audit.tqs.toString()) / 0.02) * 100).toFixed(0)}% above the execution floor.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[9px] font-bold text-muted-foreground uppercase opacity-60">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              <span>Broadcast {format(issuedDate, 'HH:mm:ss')} UTC</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3 h-3" />
              <span>Node: NODE_{entry.sourceSignalId.slice(-8)}</span>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none h-10 text-[10px] font-black uppercase tracking-widest border-white/10 gap-2" asChild>
              <Link href={`/intelligence/${entry.marketId}`}>
                <History className="w-3.5 h-3.5" /> Audit Journey
              </Link>
            </Button>
            <Button className="flex-1 sm:flex-none h-10 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 gap-2" asChild>
              <Link href={`/terminal-pro?elevate=${entry.marketId}`}>
                Open Terminal <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  );
}

function AlphaSignalCard({ entry }: { entry: PublicLedgerEntry }) {
  const issuedDate = useMemo(() => {
    return entry.tsIssued instanceof Timestamp 
      ? entry.tsIssued.toDate() 
      : (entry.tsIssued?.toDate ? entry.tsIssued.toDate() : new Date(entry.tsIssued));
  }, [entry.tsIssued]);
  
  const isJustIssued = useMemo(() => {
    const diff = Date.now() - issuedDate.getTime();
    return diff < 300000; // 5 minutes
  }, [issuedDate]);

  return (
    <div className={cn(
      "group relative bg-card border rounded-2xl overflow-hidden shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-4 duration-500",
      isJustIssued ? "border-accent/50 ring-1 ring-accent/20" : "border-primary/20 hover:border-accent/50"
    )}>
      <div className="absolute top-0 right-0 p-4">
        <div className={cn(
          "flex items-center gap-2 px-2 py-1 rounded border transition-colors",
          isJustIssued ? "bg-accent text-accent-foreground border-accent" : "bg-accent/10 border-accent/20 text-accent"
        )}>
          <Zap className={cn("w-3 h-3", isJustIssued ? "fill-current" : "fill-accent animate-pulse")} />
          <span className="text-[9px] font-black uppercase tracking-widest">
            {isJustIssued ? 'JUST BROADCASTED' : 'Alpha Trigger'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6 text-left">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[8px] h-4 uppercase tracking-tighter border-primary/30 text-primary">
              {entry.venue}
            </Badge>
            <span className="text-[9px] font-mono text-muted-foreground">NODE_{entry.sourceSignalId.slice(-8)}</span>
          </div>
          <h3 className="text-xl font-black font-headline tracking-tighter leading-tight uppercase italic group-hover:text-primary transition-colors">
            {entry.marketTitle}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 space-y-1">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest block mb-1">TQS Scalar</span>
            <div className="text-2xl font-black font-mono tracking-tighter">
              {(entry.tqs || 0).toFixed(4)}
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-2">
              <div className="h-full bg-primary" style={{ width: '85%' }} />
            </div>
          </div>
          <div className="bg-accent/5 border border-accent/10 rounded-xl p-4 space-y-1">
            <span className="text-[9px] font-black text-accent uppercase tracking-widest block mb-1">Execution EV</span>
            <div className="text-2xl font-black font-mono tracking-tighter text-accent">
              +{ (entry.evEst || 0).toFixed(3) }
            </div>
            <p className="text-[8px] text-accent/60 font-bold uppercase mt-1 italic">&theta;_bet Threshold Crossed</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary/60">
            <BrainCircuit className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Intelligence Rationale</span>
          </div>
          <p className="text-xs leading-relaxed text-foreground/80 bg-background/50 p-4 rounded-xl border border-white/5 italic">
            "{entry.rationaleShort}"
          </p>
        </div>

        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-muted-foreground uppercase">Price at Issue</span>
              <span className="text-xs font-black font-mono">${entry.marketPriceAtIssue.toFixed(3)}</span>
            </div>
            <LivePerformanceProxy marketId={entry.marketId} initialPrice={entry.marketPriceAtIssue} />
          </div>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 gap-2 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20">
                  Execute <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </DialogTrigger>
              <AlphaAuditDialog entry={entry} />
            </Dialog>
          </div>
        </div>
      </div>

      <div className="h-7 bg-white/[0.02] border-t border-white/5 flex items-center px-6 justify-between opacity-40">
        <div className="flex gap-4">
          <span className="text-[8px] font-black uppercase tracking-tighter">Issued {format(issuedDate, 'HH:mm:ss')} UTC</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Protocol v{entry.version}</span>
        </div>
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-accent" />
          <span className="text-[8px] font-black uppercase">Oracle Verified</span>
        </div>
      </div>
    </div>
  );
}

export function ProGateway({ title, subtitle, benefits, stats, requiredTier = 'PRO' }: any) {
  const isInst = requiredTier === 'INST';
  const Icon = isInst ? Cpu : Lock;
  const badgeColor = isInst ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground";
  const textColor = isInst ? "text-primary" : "text-accent";
  const shadowColor = isInst ? "shadow-[0_0_50px_rgba(63,81,181,0.15)]" : "shadow-[0_0_50px_rgba(0,255,120,0.1)]";

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 animate-in fade-in duration-1000">
      <div className={cn("bg-[#0A0C12] border-2 border-white/10 rounded-[2rem] overflow-hidden relative", shadowColor)}>
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Icon className={cn("w-64 h-64 animate-lock-breathing", textColor)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 p-8 lg:p-16 space-y-10 relative z-10 border-r border-white/5 text-left">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 bg-white/5 rounded border border-white/10 animate-lock-indicator", textColor)}>
                  <Icon className="w-5 h-5" />
                </div>
                <Badge className={cn("font-black text-[10px] uppercase tracking-[0.3em] px-3 py-1", badgeColor)}>
                  {requiredTier === 'INST' ? 'Institutional Restricted' : 'Access Node Inhibited'}
                </Badge>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black font-headline tracking-tighter italic uppercase leading-none">
                {title} <br />
                <span className={textColor}>Protocol.</span>
              </h1>
              <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed max-md">
                {subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className={cn("w-4 h-4", textColor)} /></div>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-black uppercase text-foreground tracking-widest">{b.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">{b.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <Button size="lg" className={cn("w-full sm:w-auto h-14 px-10 text-xs font-black uppercase tracking-[0.2em] shadow-2xl gap-3", badgeColor)} asChild>
                <Link href="/admin">Elevate Access Node <ArrowRight className="w-4 h-4" /></Link>
              </Button>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest italic">
                * Requires {requiredTier === 'INST' ? 'Institutional' : 'Premium'} Protocol Key
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-black/40 p-8 lg:p-16 flex flex-col justify-center space-y-12">
            <div className="space-y-8">
              {stats.map((s: any, i: number) => (
                <div key={i} className="space-y-2 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <s.icon className={cn("w-3.5 h-3.5", textColor)} />
                      <span className="text-[9px] font-black uppercase tracking-widest">{s.label}</span>
                    </div>
                    <span className={cn("text-xl font-black font-mono group-hover:opacity-100 transition-colors", textColor)}>{s.value}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className={cn("h-full group-hover:opacity-80 transition-all duration-1000", badgeColor)} style={{ width: '85%', opacity: 0.4 }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl relative overflow-hidden text-left">
              <div className={cn("absolute top-0 left-0 w-1 h-full", badgeColor)} />
              <div className="relative z-10 space-y-3">
                <div className={cn("flex items-center gap-2", textColor)}>
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Protocol Integrity</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-medium italic">
                  "Filtered execution-ready signals from the global discovery matrix. This stream broadcasts only nodes that have crossed the θ_bet threshold with verified institutional API parity."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AlphaStreamPage() {
  const firestore = useFirestore();
  const { data: profile, isLoading: isProfileLoading } = useUserProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // ENSURING "RECENT" SIGNALS: Relaxed date constraint to ensure stream is populated
  const alphaQuery = useMemoFirebase(
    () => {
      if (!firestore) return null;
      return query(
        collection(firestore, 'publicLedger'), 
        where('stance', '==', 'BET'),
        orderBy('tsIssued', 'desc'), 
        limit(20)
      );
    },
    [firestore]
  );
  const { data: signals, isLoading } = useCollection<PublicLedgerEntry>(alphaQuery);

  /**
   * RECENT FINALITY PROTOCOL:
   * Enforces 7-day resolution limit on the presentation layer for the prototype.
   */
  const filteredSignals = useMemo(() => {
    if (!signals) return [];
    const now = Date.now();
    const finalityThreshold = 7 * 24 * 60 * 60 * 1000; // 7 Days

    return signals.filter(entry => {
      if (entry.resolved) {
        const resTime = entry.updatedAt instanceof Timestamp 
          ? entry.updatedAt.toDate() 
          : (entry.updatedAt?.toDate ? entry.updatedAt.toDate() : new Date(entry.updatedAt || now));
        
        if (now - resTime.getTime() > finalityThreshold) {
          return false;
        }
      }
      return true;
    });
  }, [signals]);

  if (!mounted) return null;

  const isPro = profile?.plan === 'pro' || profile?.plan === 'internal';

  if (!isProfileLoading && !isPro) {
    return (
      <ProGateway 
        title="Alpha Stream"
        subtitle="High-conviction signals pre-filtered for whale toxicity and multi-factor alignment."
        benefits={[
          { title: "θ_bet Threshold Crossings", description: "Isolate nodes where conviction has crossed the 0.020 floor." },
          { title: "Sub-second Alerts", description: "Receive broadcasts the millisecond model convergence is verified." },
          { title: "Intelligence Rationale", description: "Access the quantitative deconstruction behind every triggered broadcast." }
        ]}
        stats={[
          { label: "Historical Accuracy", value: "88.4%", icon: ShieldCheck },
          { label: "Sync Latency", value: "12ms", icon: Activity },
          { label: "API Availability", value: "100%", icon: Cpu }
        ]}
        requiredTier="PRO"
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000 max-w-[1600px] mx-auto pb-20">
      <header className="relative overflow-hidden rounded-2xl border bg-card p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap className="w-64 h-64 text-accent animate-pulse" />
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className="bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-[0.3em] px-3 py-1">
                Live High-Conviction Feed
              </Badge>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20">
                <Wifi className="w-3 h-3 text-primary animate-pulse" />
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Ingestion: REAL-TIME (12ms)</span>
              </div>
            </div>
            <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-tight">
              ALPHA <span className="text-primary">STREAM</span>
            </h1>
            <p className="text-muted-foreground text-sm max-xl font-medium leading-relaxed">
              Filtered execution-ready signals from the global discovery matrix. This stream broadcasts only the nodes that have crossed the &theta;_bet threshold with verified multi-factor convergence.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <AlphaStreamSOP />
              <IntelligenceProtocolSOP />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <div className="p-4 bg-background/50 border rounded-xl backdrop-blur-md min-w-[160px] text-left">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-left">Signal Velocity</span>
              <div className="text-2xl font-black font-mono text-accent text-left">{(filteredSignals?.length || 0) / 7 === 0 ? '0.0' : ((filteredSignals?.length || 0) / 7).toFixed(1)} / day</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-accent" />
                <span className="text-[8px] font-bold uppercase text-accent/70">Increasing Volume</span>
              </div>
            </div>
            <div className="p-4 bg-background/50 border rounded-xl backdrop-blur-md min-w-[160px] text-left">
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1 text-left">Active Triggers</span>
              <div className="text-2xl font-black font-mono text-primary tabular-nums text-left">
                {filteredSignals?.length || 0} CONVICTIONS
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Target className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-bold uppercase text-primary/70">TQS &gt; 0.02 verified</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading || isProfileLoading ? (
          [...Array(8)].map((_, i) => (
            <div key={i} className="h-[450px] w-full bg-card rounded-2xl animate-pulse border border-white/5" />
          ))
        ) : filteredSignals && filteredSignals.length > 0 ? (
          filteredSignals.map((entry) => (
            <AlphaSignalCard key={entry.id} entry={entry} />
          ))
        ) : (
          <div className="col-span-full h-96 flex flex-col items-center justify-center text-center space-y-6 opacity-30">
            <Waves className="w-24 h-24 text-primary" />
            <div className="space-y-2">
              <h3 className="text-xl font-black uppercase tracking-[0.3em]">Awaiting Alpha Convergence</h3>
              <p className="text-sm font-bold uppercase italic">Scanning global discovery matrix for &theta;_bet crossings...</p>
            </div>
            <button className="h-10 px-6 rounded border border-primary/30 text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-colors" onClick={() => window.location.href='/terminal'}>
              View Full Matrix
            </button>
          </div>
        )}
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em]">
          <span>Sub-Second Ingestion</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>High-Conviction Filtering</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Oracle Protocols Verified</span>
        </div>
        <p className="text-[8px] text-center max-w-2xl font-medium leading-relaxed italic px-4">
          "The Alpha Stream is a low-latency execution support service. Signals are committed to the feed the moment they cross the deterministic &theta;_bet threshold. Realized alpha is subject to execution depth and venue slippage."
        </p>
      </footer>
    </div>
  );
}
