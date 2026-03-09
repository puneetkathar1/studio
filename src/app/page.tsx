
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  ShieldCheck, 
  TrendingUp, 
  Activity, 
  BrainCircuit, 
  Target, 
  ArrowRight, 
  Globe, 
  Database, 
  Cpu, 
  Maximize2, 
  BarChart3, 
  Scale, 
  Lock,
  ChevronRight,
  Waves,
  Radar,
  Loader2,
  Terminal,
  Eye,
  ArrowUpRight,
  ArrowRightLeft,
  CircleCheck,
  Timer,
  Layers,
  Crosshair,
  Anchor,
  Fingerprint,
  PieChart,
  DollarSign,
  ShieldAlert,
  Skull,
  AlertTriangle,
  Search,
  BookOpen,
  Briefcase,
  LineChart,
  History,
  Repeat,
  CheckCircle2,
  Orbit
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TickerTape } from '@/components/terminal/ticker-tape';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { PublicLedgerEntry } from '@/lib/types';
import { ModelThoughtStream } from '@/components/landing/ModelThoughtStream';
import { SlippageSimulator } from '@/components/landing/SlippageSimulator';
import { CalibrationProof } from '@/components/landing/CalibrationProof';
import { DeltaBasisMonitor } from '@/components/landing/DeltaBasisMonitor';
import { MacroCorrelationMatrix } from '@/components/landing/MacroCorrelationMatrix';
import { StanceTransitionAlert } from '@/components/landing/StanceTransitionAlert';
import { InstitutionalSecurityProof } from '@/components/landing/InstitutionalSecurityProof';
import { AlphaHeatmap } from '@/components/landing/AlphaHeatmap';
import { ComparativeMatrix } from '@/components/landing/ComparativeMatrix';
import { AlphaCapturedCounter } from '@/components/landing/AlphaCapturedCounter';
import { InfrastructureDiagrams } from '@/components/landing/InfrastructureDiagrams';
import { IntersectionReveal } from '@/components/landing/IntersectionReveal';
import { ArchetypePathways } from '@/components/landing/ArchetypePathways';
import { ScrollIlluminatedIcon } from '@/components/landing/ScrollIlluminatedIcon';

const SOP_ITEMS = [
  { step: '01', title: 'DISCOVER', icon: Globe, desc: 'Scan the Global Matrix for volume leaders and liquidity nodes.', color: 'primary' },
  { step: '02', title: 'AUDIT', icon: Radar, desc: 'Analyze the Intelligence Basis and TQS scalar before execution.', color: 'accent' },
  { step: '03', title: 'LOG', icon: Crosshair, desc: 'Hash your personal venue fill price to your private audit node.', color: 'accent' },
  { step: '04', title: 'MONITOR', icon: Activity, desc: 'Track real-time divergence and target convergence in the terminal.', color: 'primary' },
  { step: '05', title: 'REFINE', icon: Target, desc: 'Calibrate your Brier Score precision against platform benchmarks.', color: 'primary' },
  { step: '06', title: 'EXECUTE', icon: CheckCircle2, desc: 'Finalize results upon verified settlement at the venue layer.', color: 'accent' },
];

function SOPStepCard({ item, index }: { item: typeof SOP_ITEMS[0], index: number }) {
  return (
    <IntersectionReveal delay={index * 150}>
      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4 group hover:border-primary/30 transition-all hover:bg-white/[0.04] relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity pointer-events-none">
          <item.icon className="w-16 h-16" />
        </div>
        <div className="flex justify-between items-center relative z-10">
          <span className="text-xs font-black text-muted-foreground/40">{item.step}</span>
          <ScrollIlluminatedIcon color={item.color as any} className="p-2">
            <item.icon className="w-6 h-6" />
          </ScrollIlluminatedIcon>
        </div>
        <h4 className="text-sm font-black uppercase italic tracking-tighter relative z-10 group-hover:text-foreground transition-colors">{item.title}</h4>
        <p className="text-[10px] text-muted-foreground leading-relaxed font-medium relative z-10">{item.desc}</p>
      </div>
    </IntersectionReveal>
  );
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => { setMounted(true); }, []);

  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(20)) : null,
    [firestore]
  );
  const { data: ledgerEntries } = useCollection<PublicLedgerEntry>(ledgerQuery);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#05070A] text-[#E0E0E0] font-mono selection:bg-primary/30 pb-20 relative">
      {/* 0. DYNAMIC MESH BACKGROUND SUBSTRATE */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[140px] animate-mesh-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[140px] animate-mesh-slow" style={{ animationDelay: '-5s' }} />
        <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[140px] animate-mesh-slow" style={{ animationDelay: '-12s' }} />
        <div className="absolute bottom-[20%] left-[-5%] w-[35%] h-[35%] bg-accent/5 rounded-full blur-[140px] animate-mesh-slow" style={{ animationDelay: '-18s' }} />
      </div>

      {/* 1. TOP TICKER IMMERSION */}
      <div className="fixed top-14 left-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-white/5">
        <TickerTape entries={ledgerEntries || []} />
      </div>

      {/* 2. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4 text-center">
        <div className="max-w-6xl mx-auto relative z-10 space-y-8">
          <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Global Intelligence Node Active</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black font-headline tracking-[calc(-0.05em)] leading-[0.9] uppercase italic">
              The <span className="text-primary">Intelligence</span> Layer <br />
              <span className="text-foreground/40">For Prediction Markets.</span>
            </h1>
            <p className="text-muted-foreground text-sm lg:text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              Institutional-grade signals derived from real-time multi-venue ingestion. 
              Powered by the <span className="text-foreground">TQS Scalar Engine</span> and 16 unique quantitative indicators.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <Button size="lg" className="h-14 px-10 text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 gap-3 min-w-[280px]" asChild>
              <Link href={user ? "/terminal" : "/login?tab=signup"}>
                {isUserLoading ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> VERIFYING...</>
                ) : user ? (
                  <><Maximize2 className="w-4 h-4" /> Launch Live Matrix</>
                ) : (
                  <><ArrowRight className="w-4 h-4" /> Establish Node Connection</>
                )}
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-10 text-xs font-black uppercase tracking-[0.2em] border-primary/20 bg-primary/5 hover:bg-primary/10 text-primary gap-3 min-w-[280px]" asChild>
              <Link href="/knowledge-sphere">
                <Orbit className="w-4 h-4" /> Knowledge Sphere
              </Link>
            </Button>
            {!user && (
              <Button variant="outline" size="lg" className="h-14 px-10 text-xs font-black uppercase tracking-[0.2em] border-white/10 bg-white/[0.02] hover:bg-white/5 gap-3" asChild>
                <Link href="/ledger"><Database className="w-4 h-4" /> View Public Ledger</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 3. 6-STEP SOP SECTION */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto space-y-16 border-t border-white/5 relative">
        <IntersectionReveal>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className="border-primary/30 text-primary font-black text-[10px] tracking-[0.3em]">Institutional Protocol SOP</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-tight">The Path to Authority.</h2>
          </div>
        </IntersectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {SOP_ITEMS.map((item, index) => (
            <SOPStepCard key={item.step} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* 4. COMPARATIVE MATRIX SECTION */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto border-t border-white/5 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-6">
            <IntersectionReveal>
              <div className="flex items-center gap-3">
                <ScrollIlluminatedIcon className="p-2">
                  <Layers className="w-5 h-5 text-primary" />
                </ScrollIlluminatedIcon>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Capability Benchmarking</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
                Protocol <br />
                <span className="text-primary">Capabilities.</span>
              </h2>
              <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed">
                Institutional comparison of the Predictive Insights substrate against standard retail interfaces. 
                Explicitly benchmarking the unique value of the θ_bet threshold and Institutional API access.
              </p>
            </IntersectionReveal>
          </div>
          <div className="lg:col-span-8">
            <IntersectionReveal delay={200}>
              <ComparativeMatrix />
            </IntersectionReveal>
          </div>
        </div>
      </section>

      {/* 5. ALPHA CAPTURED COUNTER */}
      <section className="py-12 px-4 max-w-[1600px] mx-auto border-t border-white/5 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-6">
            <IntersectionReveal>
              <div className="flex items-center gap-3">
                <ScrollIlluminatedIcon color="accent" className="p-2">
                  <Activity className="w-5 h-5 text-accent animate-pulse" />
                </ScrollIlluminatedIcon>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Proof of Authority</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
                Alpha <br />
                <span className="text-accent">Extracted.</span>
              </h2>
              <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed italic border-l-2 border-accent/30 pl-6">
                "Every decimal represents verified capital efficiency. This counter tracks the cumulative realized alpha committed to the public ledger in the last 24-hour discovery cycle."
              </p>
            </IntersectionReveal>
          </div>
          <div className="lg:col-span-8">
            <IntersectionReveal delay={200}>
              <AlphaCapturedCounter />
            </IntersectionReveal>
          </div>
        </div>
      </section>

      {/* 6. ARCHETYPE PATHWAYS */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto border-t border-white/5 relative">
        <IntersectionReveal>
          <ArchetypePathways />
        </IntersectionReveal>
      </section>

      {/* 7. PROTOCOL SELECTOR ( GATEWAY ) */}
      <section className="py-12 px-4 max-w-[1600px] mx-auto border-t border-white/5 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <IntersectionReveal>
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 lg:p-12 space-y-8 relative overflow-hidden group hover:border-primary/30 transition-all shadow-2xl h-full">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
                <Globe className="w-48 h-48 text-foreground" />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <ScrollIlluminatedIcon className="p-2">
                    <Globe className="w-6 h-6 text-muted-foreground" />
                  </ScrollIlluminatedIcon>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter">Discovery Protocol</h3>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  Wide-angle market research and performance verification. Open to all session nodes.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <Link href="/markets" className="p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all group/node">
                  <div className="flex justify-between items-start mb-2">
                    <LineChart className="w-4 h-4 text-primary" />
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/node:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block">Markets Feed</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-bold">1.4k Nodes Active</span>
                </Link>
                <Link href="/ledger" className="p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-primary/5 hover:border-primary/20 transition-all group/node">
                  <div className="flex justify-between items-start mb-2">
                    <Database className="w-4 h-4 text-primary" />
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/node:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block">Public Ledger</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-bold">Immutable Audit</span>
                </Link>
              </div>
            </div>
          </IntersectionReveal>

          <IntersectionReveal delay={200}>
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 lg:p-12 space-y-8 relative overflow-hidden group hover:border-accent/30 transition-all shadow-[0_0_50px_rgba(63,81,181,0.1)] h-full">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform">
                <Zap className="w-48 h-48 text-accent" />
              </div>
              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-3">
                  <ScrollIlluminatedIcon color="accent" className="p-2">
                    <Lock className="w-4 h-4 text-accent" />
                  </ScrollIlluminatedIcon>
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-accent">Institutional Protocol</h3>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                  High-conviction execution layer and institutional API access. Restricted to Pro nodes.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <Link href="/alpha-stream" className="p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-accent/5 hover:border-accent/20 transition-all group/node">
                  <div className="flex justify-between items-start mb-2">
                    <Zap className="w-4 h-4 text-accent fill-accent" />
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/node:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block text-accent">Alpha Stream</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-bold">θ_bet Crossings</span>
                </Link>
                <Link href="/whale-matrix" className="p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-accent/5 hover:border-accent/20 transition-all group/node">
                  <div className="flex justify-between items-start mb-2">
                    <Anchor className="w-4 h-4 text-accent" />
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/node:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest block text-accent">Whale Matrix</span>
                  <span className="text-[8px] text-muted-foreground uppercase font-bold">Behavioral Recon</span>
                </Link>
              </div>
            </div>
          </IntersectionReveal>
        </div>
      </section>

      {/* 8. ALPHA STREAM SECTION */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center border-t border-white/5 relative">
        <div className="lg:col-span-5 space-y-6">
          <IntersectionReveal>
            <div className="flex items-center gap-3">
              <ScrollIlluminatedIcon color="accent" className="p-2">
                <Zap className="w-5 h-5 text-accent fill-accent" />
              </ScrollIlluminatedIcon>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">High-Conviction Broadcast</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
              The Alpha <br />
              <span className="text-accent">Stream Protocol.</span>
            </h2>
            <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed">
              Broadcasts only the nodes that have crossed the deterministic <span className="text-foreground">θ_bet threshold (0.020)</span>. Filtered for whale toxicity and multi-factor alignment to ensure execution readiness.
            </p>
            <div className="pt-4">
              <Button className="h-12 px-8 bg-accent text-accent-foreground font-black uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20" asChild>
                <Link href="/alpha-stream">Explore the Stream <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </IntersectionReveal>
        </div>
        <div className="lg:col-span-7">
          <IntersectionReveal delay={300}>
            <div className="relative bg-accent/5 border border-accent/20 rounded-3xl p-1 overflow-hidden shadow-2xl">
              <div className="bg-black/40 rounded-[22px] overflow-hidden">
                <StanceTransitionAlert />
              </div>
            </div>
          </IntersectionReveal>
        </div>
      </section>

      {/* 9. WHALE MATRIX SECTION */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center border-t border-white/5 relative">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <IntersectionReveal>
            <div className="relative bg-primary/5 border border-primary/20 rounded-3xl p-8 overflow-hidden shadow-2xl flex flex-col gap-8">
              <div className="flex items-center justify-between border-primary/10 pb-4">
                <div className="flex items-center gap-3">
                  <ScrollIlluminatedIcon className="p-2">
                    <Anchor className="w-6 h-6 text-primary" />
                  </ScrollIlluminatedIcon>
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Smart Money Trace</span>
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[8px]">REC: NOMINAL</Badge>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'Informational Density', val: 84, color: 'bg-accent' },
                  { label: 'Mechanical Pinning', val: 12, color: 'bg-destructive' },
                  { label: 'Exit Burst Pressure', val: 4, color: 'bg-primary' }
                ].map(item => (
                  <div key={item.label} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[9px] font-bold uppercase text-muted-foreground">{item.label}</span>
                      <span className="text-[10px] font-black font-mono">{item.val}%</span>
                    </div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: `${item.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[8px] font-black uppercase text-muted-foreground">Detected Mode</span>
                  <div className="text-sm font-black text-accent uppercase">Informational Absorption</div>
                </div>
                <div className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[8px] font-black uppercase text-muted-foreground">Risk Status</span>
                  <div className="text-sm font-black text-primary uppercase">Tradeable Node</div>
                </div>
              </div>
            </div>
          </IntersectionReveal>
        </div>
        <div className="lg:col-span-5 space-y-6 order-1 lg:order-2">
          <IntersectionReveal delay={200}>
            <div className="flex items-center gap-3">
              <ScrollIlluminatedIcon className="p-2">
                <Anchor className="w-5 h-5 text-primary" />
              </ScrollIlluminatedIcon>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Behavioral Recon Engine</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
              Whale <br />
              <span className="text-primary">Matrix Recon.</span>
            </h2>
            <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed">
              Separate news from noise. We reconstruct on-chain holdings and infer flow intent to identify <span className="text-foreground">🔴 Toxic Nodes</span> where mechanical pinning exceeds informational discovery.
            </p>
            <div className="pt-4">
              <Button variant="outline" className="h-12 px-8 border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[10px]" asChild>
                <Link href="/whale-matrix">Enter the Matrix <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          </IntersectionReveal>
        </div>
      </section>

      {/* 10. FEATURE INTENSITY SCANNER (HEATMAP) */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center border-t border-white/5 relative">
        <div className="lg:col-span-4 space-y-6">
          <IntersectionReveal>
            <div className="flex items-center gap-3">
              <ScrollIlluminatedIcon className="p-2">
                <Radar className="w-5 h-5 text-primary" />
              </ScrollIlluminatedIcon>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Market Intensity Scanner</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
              Categorical <br />
              <span className="text-primary">Alpha Density.</span>
            </h2>
            <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed">
              Identify where the mispricing is highest. Our global sweep monitors 1,400+ nodes to visualize liquidity clusters and trending narratives in real-time.
            </p>
          </IntersectionReveal>
        </div>
        <div className="lg:col-span-8">
          <IntersectionReveal delay={300}>
            <AlphaHeatmap />
          </IntersectionReveal>
        </div>
      </section>

      {/* 11. DELTA BASIS MONITOR */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto space-y-12 border-t border-white/5 relative">
        <IntersectionReveal>
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Badge variant="outline" className="border-accent/30 text-accent font-black text-[10px] tracking-[0.3em]">Arbitrage Recognition Engine</Badge>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-tight">Cross-Venue Decoupling.</h2>
          </div>
        </IntersectionReveal>
        <IntersectionReveal delay={200}>
          <DeltaBasisMonitor />
        </IntersectionReveal>
      </section>

      {/* 12. PERFORMANCE PROOFS (CALIBRATION & TRANSITION) */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto space-y-24 border-t border-white/5 relative">
        <IntersectionReveal>
          <CalibrationProof />
        </IntersectionReveal>
      </section>

      {/* 13. SLIPPAGE & EXECUTION REALISM */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto border-t border-white/5 relative">
        <IntersectionReveal>
          <SlippageSimulator />
        </IntersectionReveal>
      </section>

      {/* 14. MACRO LAB PREVIEW */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto space-y-12 border-t border-white/5 relative">
        <div className="max-w-3xl space-y-4">
          <IntersectionReveal>
            <div className="flex items-center gap-3">
              <ScrollIlluminatedIcon className="p-2">
                <Globe className="w-6 h-6 text-primary" />
              </ScrollIlluminatedIcon>
              <span className="text-xs font-black uppercase tracking-[0.3em]">Regime Sensitivity Lab</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
              Global <br />
              <span className="text-primary">Macro Strings.</span>
            </h2>
            <p className="text-muted-foreground text-lg font-medium">
              Visualize the correlation between global economic signals and specific market outcomes to refine trade conviction.
            </p>
          </IntersectionReveal>
        </div>
        <IntersectionReveal delay={300}>
          <MacroCorrelationMatrix />
        </IntersectionReveal>
      </section>

      {/* 15. TECH STACK (THOUGHT STREAM & SECURITY) */}
      <section className="py-24 px-4 max-w-[1600px] mx-auto space-y-16 border-t border-white/5 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-4 space-y-6">
            <IntersectionReveal>
              <div className="flex items-center gap-3">
                <ScrollIlluminatedIcon className="p-2">
                  <Terminal className="w-5 h-5 text-primary" />
                </ScrollIlluminatedIcon>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Computational Substrate</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
                Autonomous <br />
                <span className="text-primary">Intelligence Feed.</span>
              </h2>
              <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed">
                Witness the raw computational substrate. Every market tick, macro ingestion, and TQS recalculation is processed by our geographically distributed node cluster.
              </p>
            </IntersectionReveal>
          </div>
          <div className="lg:col-span-8">
            <IntersectionReveal delay={300}>
              <ModelThoughtStream />
            </IntersectionReveal>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-8 order-2 lg:order-1">
            <IntersectionReveal>
              <InfrastructureDiagrams />
            </IntersectionReveal>
          </div>
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <IntersectionReveal delay={200}>
              <div className="flex items-center gap-3">
                <ScrollIlluminatedIcon color="accent" className="p-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                </ScrollIlluminatedIcon>
                <span className="text-xs font-black uppercase tracking-[0.3em] text-accent">Security Protocol Node</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black font-headline tracking-tighter uppercase italic leading-none">
                Zero-Trust <br />
                <span className="text-accent">Architecture.</span>
              </h2>
              <p className="text-muted-foreground text-sm lg:text-lg font-medium leading-relaxed">
                Bank-grade security for the prediction matrix. Every signal is verified via decentralized oracle quorum and secured with AES-256 GCM encryption.
              </p>
            </IntersectionReveal>
          </div>
        </div>
      </section>

      {/* 16. FINAL FOOTER */}
      <footer className="py-20 border-t border-white/5 bg-[#030508] relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-black text-lg">P</div>
              <span className="text-xl font-headline font-bold tracking-tighter uppercase">Predictive<span className="text-primary">Insights</span></span>
            </div>
            <p className="text-muted-foreground text-xs font-medium leading-relaxed italic">
              "The most powerful decision support terminal for the global prediction matrix. Real-time alpha, quantitatively verified."
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Protocol Access</span>
            <Link href="/markets" className="text-xs font-bold hover:text-primary transition-colors uppercase">Markets Feed</Link>
            <Link href="/ledger" className="text-xs font-bold hover:text-primary transition-colors uppercase">Public Ledger</Link>
            <Link href="/terminal" className="text-xs font-bold hover:text-primary transition-colors uppercase">Intelligence HUD</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Institutional</span>
            <Link href="/alpha-stream" className="text-xs font-bold hover:text-accent transition-colors uppercase">Alpha Stream</Link>
            <Link href="/whale-matrix" className="text-xs font-bold hover:text-accent transition-colors uppercase">Whale Recon</Link>
            <Link href="/pro-champion" className="text-xs font-bold hover:text-accent transition-colors uppercase">Arb Matrix</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
