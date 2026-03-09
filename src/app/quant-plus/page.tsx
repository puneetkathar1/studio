'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BrainCircuit, 
  Target, 
  ShieldCheck, 
  Zap, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Monitor,
  ArrowRight,
  Waves,
  Fingerprint,
  Layers,
  History,
  Repeat,
  Crosshair,
  Radar,
  Lock,
  Scale,
  Clock,
  Orbit,
  Network,
  BarChart3,
  Server,
  Globe,
  Database,
  ArrowUpRight,
  ShieldAlert,
  Search,
  CheckCircle2,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { TickerTape } from '@/components/terminal/ticker-tape';
import { IntersectionReveal } from '@/components/landing/IntersectionReveal';

const GAD_SOP = [
  { step: '01', title: 'NORMALIZATION', icon: Fingerprint, desc: 'Ingest raw ticks and apply Log-Odds transform (rt) + Liquidity proxies.', color: 'text-[hsl(var(--quant-primary))]' },
  { step: '02', title: 'STATE FILTER', icon: Cpu, desc: 'Run affine-tractable filter to estimate latent variance (vt) and adaptive discontinuity (λt).', color: 'text-primary' },
  { step: '03', title: 'JUMP AUDIT', icon: Zap, desc: 'Identify discontinuity probability (pt) endogenously governed by the current λt stress state.', color: 'text-accent' },
  { step: '04', title: 'FAIR ENVELOPE', icon: Radar, desc: 'Convert predictive distributions to probability q. Expand bands during high-stress regimes.', color: 'text-[hsl(var(--quant-primary))]' },
  { step: '05', title: 'RISK PENALTY', icon: Scale, desc: 'Apply γ-penalties for jump risk and entropy before issuing a high-conviction BET stance.', color: 'text-primary' },
  { step: '06', title: 'SIGNAL HASH', icon: Lock, desc: 'Commit deterministic GAD signals to the immutable institutional ledger via ZK-Proof.', color: 'text-accent' },
];

const CAPABILITIES = [
  {
    title: "Structural Discontinuity",
    desc: "Move beyond midpoint tracking. GAD identifies the mathematical breaks in price discovery caused by informed capital.",
    icon: Network,
    metric: "λt Trace",
    value: "Active"
  },
  {
    title: "Endogenous Jump Risk",
    desc: "Predictive modeling of price 'gaps' before they occur by monitoring sub-second pressure delta.",
    icon: Zap,
    metric: "pt Goal",
    value: "< 0.05"
  },
  {
    title: "Regime-Aware Envelopes",
    desc: "Adaptive sigma-bands that widen automatically during whale pinning events to preserve capital integrity.",
    icon: Layers,
    metric: "Confidence",
    value: "99.2%"
  }
];

export default function QuantPlusLandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#05070A] text-[#E0E0E0] font-mono selection:bg-[hsl(var(--quant-primary)/0.3)] pb-20 relative overflow-x-hidden">
      {/* 0. DYNAMIC QUANT+ BACKGROUND SUBSTRATE */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[hsl(var(--quant-primary)/0.15)] rounded-full blur-[160px] animate-mesh-slow" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[hsl(var(--quant-accent)/0.1)] rounded-full blur-[140px] animate-mesh-slow" style={{ animationDelay: '-8s' }} />
        <div className="absolute top-[30%] right-[-5%] w-[40%] h-[40%] bg-[hsl(var(--quant-primary)/0.05)] rounded-full blur-[140px] animate-mesh-slow" style={{ animationDelay: '-15s' }} />
      </div>

      {/* 1. TOP TICKER IMMERSION */}
      <div className="sticky top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <TickerTape entries={[]} />
      </div>

      {/* 2. HERO NODE: THE HANDSHAKE */}
      <section className="relative pt-24 pb-20 px-4 text-left max-w-[1600px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[hsl(var(--quant-primary)/0.1)] rounded-xl border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))] shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <Badge className="bg-[hsl(var(--quant-primary))] text-white font-black text-[10px] uppercase tracking-[0.4em] px-3 py-1 w-fit">
                    Institutional Protocol v1.4
                  </Badge>
                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.5em] mt-1 ml-1">Substrate Node: PRO_AUTHORIZED</span>
                </div>
              </div>
              
              <h1 className="text-6xl lg:text-[10rem] font-black font-headline tracking-[calc(-0.06em)] italic uppercase leading-[0.8] mix-blend-plus-lighter">
                Quant <span className="text-[hsl(var(--quant-primary))]">+</span> <br />
                <span className="text-foreground/20">The GAD Substrate.</span>
              </h1>
              
              <p className="text-muted-foreground text-lg lg:text-2xl font-medium leading-relaxed max-w-2xl border-l-4 border-[hsl(var(--quant-primary)/0.3)] pl-8 italic">
                Authorized access to the Generalized Adaptive Discontinuity state engine. 
                Move beyond retail midpoint tracking into endogenously governed risk filtering.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-16 px-12 text-xs font-black uppercase tracking-[0.3em] shadow-2xl bg-[hsl(var(--quant-primary))] hover:bg-[hsl(var(--quant-primary)/0.9)] text-white gap-4 shadow-[hsl(var(--quant-primary)/0.4)] transition-all hover:scale-[1.02] border-0" asChild>
                <Link href="/quant-plus/terminal">Initialize GAD Matrix <Monitor className="w-5 h-5" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-16 px-12 text-xs font-black uppercase tracking-[0.3em] border-[hsl(var(--quant-primary)/0.3)] bg-white/5 hover:bg-white/10 text-[hsl(var(--quant-primary))] gap-4 transition-all" asChild>
                <Link href="/quant-plus/backtest">Review Replays <History className="w-5 h-5" /></Link>
              </Button>
            </div>

            <div className="flex items-center gap-12 pt-8 opacity-40">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest">Network Health</span>
                <span className="text-sm font-bold text-white">99.98% NOMINAL</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest">Latency</span>
                <span className="text-sm font-bold text-accent">12ms (Optic Sync)</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest">Oracle Status</span>
                <span className="text-sm font-bold text-[hsl(var(--quant-primary))]">QUORUM FINALIZED</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            {/* Vitals HUD Component */}
            <IntersectionReveal delay={400}>
              <div className="bg-[#0A0C12] border border-[hsl(var(--quant-primary)/0.2)] rounded-[3rem] p-10 shadow-[0_0_80px_rgba(168,85,247,0.15)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity duration-1000"><BrainCircuit className="w-64 h-64 text-[hsl(var(--quant-primary))]" /></div>
                <div className="space-y-10 relative z-10">
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[hsl(var(--quant-primary)/0.1)] rounded-2xl text-[hsl(var(--quant-primary))] animate-pulse">
                        <Activity className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-base font-black uppercase tracking-widest">State Vitals</h3>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Live Engine Trace • PIP-GAD v1.4</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-[9px] font-mono border-[hsl(var(--quant-primary)/0.3)] text-[hsl(var(--quant-primary))] font-black">STABLE</Badge>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {[
                      { label: 'Stress State (λt)', val: '0.1482', color: 'text-[hsl(var(--quant-primary))]', p: 45 },
                      { label: 'Latent Variance (vt)', val: '0.0241', color: 'text-white', p: 62 },
                      { label: 'Jump Probability (pt)', val: '0.042', color: 'text-[hsl(var(--quant-accent))]', p: 15 }
                    ].map(vital => (
                      <div key={vital.label} className="space-y-3">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                          <span className="text-muted-foreground">{vital.label}</span>
                          <span className={cn("text-lg font-black font-mono", vital.color)}>{vital.val}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-[2000ms] ease-in-out", vital.color.replace('text-', 'bg-'))} 
                            style={{ width: `${vital.p}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6">
                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1 text-left">
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Signal Quorum</span>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-accent" />
                        <span className="text-xs font-black font-mono">12 / 12 OK</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5 space-y-1 text-left">
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest block">Finality Hash</span>
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-3 h-3 text-[hsl(var(--quant-primary))]" />
                        <span className="text-[10px] font-mono font-bold truncate">0xGAD_PRO_42</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </IntersectionReveal>
          </div>
        </div>
      </section>

      {/* 3. CAPABILITIES GRID: RESEARCH SUBSTRATE */}
      <section className="py-32 px-4 max-w-[1600px] mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-4 space-y-8">
            <IntersectionReveal>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[hsl(var(--quant-primary)/0.1)] rounded-xl border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))]">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-[hsl(var(--quant-primary))]">Research Capability</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black font-headline tracking-tighter uppercase italic leading-[0.9]">
                  Engineered for <br/> <span className="text-[hsl(var(--quant-primary))]">Rationality.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                  The GAD Engine identifies structural discontinuities caused by informed capital commitment before they manifest as retail sentiment shifts.
                </p>
              </div>
            </IntersectionReveal>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAPABILITIES.map((cap, idx) => (
              <IntersectionReveal key={cap.title} delay={idx * 150}>
                <div className="p-8 bg-[#0A0C12] border border-white/5 rounded-[2.5rem] space-y-8 hover:border-[hsl(var(--quant-primary)/0.4)] transition-all group h-full shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-10 transition-opacity duration-700">
                    <cap.icon className="w-32 h-32 text-[hsl(var(--quant-primary))]" />
                  </div>
                  <div className="space-y-6 relative z-10">
                    <div className="p-4 bg-[hsl(var(--quant-primary)/0.1)] rounded-2xl w-fit text-[hsl(var(--quant-primary))] group-hover:scale-110 transition-transform">
                      <cap.icon className="w-8 h-8" />
                    </div>
                    <div className="space-y-3 text-left">
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter">{cap.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {cap.desc}
                      </p>
                    </div>
                  </div>
                  <div className="pt-6 flex items-center justify-between border-t border-white/5 relative z-10">
                    <span className="text-10px font-black text-muted-foreground uppercase tracking-widest">{cap.metric}</span>
                    <Badge className="bg-[hsl(var(--quant-primary))] text-white font-black text-[10px] px-3">{cap.value}</Badge>
                  </div>
                </div>
              </IntersectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. GAD SOP SECTION: THE STRUCTURAL LOOP */}
      <section className="py-32 px-4 max-w-[1600px] mx-auto border-t border-white/5 bg-white/[0.01]">
        <IntersectionReveal>
          <div className="flex flex-col items-center justify-center text-center space-y-6 mb-20">
            <div className="flex justify-center">
              <Badge variant="outline" className="border-[hsl(var(--quant-primary)/0.3)] text-[hsl(var(--quant-primary))] font-black text-[10px] tracking-[0.5em] px-6 py-2 uppercase bg-[hsl(var(--quant-primary)/0.05)]">The Substrate Operational Loop</Badge>
            </div>
            <h2 className="text-5xl lg:text-8xl font-black font-headline tracking-tighter uppercase italic leading-tight text-white">
              Procedural <span className="text-[hsl(var(--quant-primary))]">Finality</span>.
            </h2>
            <p className="text-muted-foreground text-lg lg:text-xl font-medium max-w-2xl leading-relaxed">
              Every market tick is processed through an immutable 6-step GAD pipeline before a high-conviction signal is issued to the institutional stream.
            </p>
          </div>
        </IntersectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {GAD_SOP.map((item, idx) => (
            <IntersectionReveal key={item.step} delay={idx * 100}>
              <div className="p-8 bg-[#0A0C12] border border-white/5 rounded-3xl space-y-6 group hover:border-[hsl(var(--quant-primary)/0.4)] transition-all hover:bg-white/[0.02] relative overflow-hidden h-full shadow-xl">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <item.icon className="w-20 h-20" />
                </div>
                <div className="flex justify-between items-center relative z-10">
                  <span className="text-[11px] font-black text-muted-foreground/40 font-mono tracking-widest">{item.step}</span>
                  <div className={cn("p-2.5 rounded-xl bg-black/40 border border-white/10", item.color)}>
                    <item.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="space-y-2 text-left relative z-10">
                  <h4 className="text-base font-black uppercase italic tracking-tighter text-foreground group-hover:text-[hsl(var(--quant-primary))] transition-colors">{item.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-bold uppercase tracking-tight">{item.desc}</p>
                </div>
              </div>
            </IntersectionReveal>
          ))}
        </div>
      </section>

      {/* 5. DATA CLUSTER INFO: COMPUTATION SUBSTRATE */}
      <section className="py-32 px-4 max-w-[1600px] mx-auto">
        <IntersectionReveal>
          <div className="bg-[hsl(var(--quant-primary)/0.05)] border border-[hsl(var(--quant-primary)/0.2)] rounded-[4rem] p-10 lg:p-24 relative overflow-hidden group shadow-[0_0_100px_rgba(168,85,247,0.1)]">
            <div className="absolute top-0 right-0 p-16 opacity-[0.02] group-hover:opacity-10 transition-opacity pointer-events-none duration-[2000ms]">
              <Server className="w-[40rem] h-[40rem] text-[hsl(var(--quant-primary))]" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
              <div className="space-y-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-[hsl(var(--quant-primary)/0.1)] rounded-2xl border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                      <Cpu className="w-8 h-8 animate-pulse" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Institutional Substrate</h3>
                      <p className="text-[10px] text-[hsl(var(--quant-primary))] font-black uppercase tracking-[0.4em]">1,482 Physical Computation Nodes</p>
                    </div>
                  </div>
                  <p className="text-lg lg:text-2xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-[hsl(var(--quant-primary)/0.3)] pl-8">
                    "The GAD Engine utilizes a geographically distributed cluster to harvest and normalize liquidity. Every tick is hashed to the ZK-Audit ledger within 12ms of discovery finality."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-2 group/stat hover:border-[hsl(var(--quant-primary)/0.3)] transition-all text-left">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] block">Throughput</span>
                    <div className="text-4xl font-black font-mono text-white group-hover/stat:text-[hsl(var(--quant-primary))] transition-colors">1.4K<span className="text-primary text-sm ml-2">MSG/S</span></div>
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-[hsl(var(--quant-primary))] animate-pulse" style={{ width: '84%' }} />
                    </div>
                  </div>
                  <div className="p-8 bg-black/40 border border-white/5 rounded-[2rem] space-y-2 group/stat hover:border-accent/30 transition-all text-left">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.3em] block">Oracle Quorum</span>
                    <div className="text-4xl font-black font-mono text-white group-hover/stat:text-accent transition-colors">12/12<span className="text-accent text-sm ml-2">OK</span></div>
                    <div className="flex gap-1 mt-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-1 flex-1 bg-accent/40 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-10 bg-[#0A0C12] rounded-[3rem] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden group/box">
                  <div className="absolute inset-0 bg-[hsl(var(--quant-primary)/0.02)] pointer-events-none" />
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white">
                    <ShieldCheck className="w-6 h-6 text-accent animate-pulse" /> Zero-Knowledge Proof Substrate
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center text-left border-b border-white/5 pb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Encryption Standard</span>
                        <div className="text-sm font-black font-mono text-white">AES-256-GCM-RSA4096</div>
                      </div>
                      <Badge className="bg-accent/20 text-accent font-black text-[9px] px-3 h-5 border border-accent/20">NOMINAL</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center text-left border-b border-white/5 pb-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Verification Pulse</span>
                        <div className="text-sm font-black font-mono text-white">12.4ms Optic Sync</div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[hsl(var(--quant-primary)/0.1)] border border-[hsl(var(--quant-primary)/0.2)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--quant-primary))] animate-ping" />
                        <span className="text-[8px] font-black text-[hsl(var(--quant-primary))] uppercase">LIVE</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-left">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">Authorized Access Key</span>
                        <div className="text-sm font-black font-mono text-[hsl(var(--quant-primary))] tracking-widest">X-PRO-NODE-AUDIT-42</div>
                      </div>
                      <Lock className="w-5 h-5 text-muted-foreground/20" />
                    </div>
                  </div>

                  <Button className="w-full h-16 bg-[hsl(var(--quant-primary))] hover:bg-[hsl(var(--quant-primary)/0.9)] text-white font-black uppercase text-xs tracking-[0.3em] shadow-2xl shadow-[hsl(var(--quant-primary)/0.3)] transition-all hover:scale-[1.02] border-0" asChild>
                    <Link href="/quant-plus/terminal">Enter GAD Matrix Node</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </IntersectionReveal>
      </section>

      {/* 6. IMMUTABLE PERFORMANCE PROOF: THE BRIER CALIBRATION */}
      <section className="py-32 px-4 max-w-[1600px] mx-auto border-t border-white/5 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-center">
          <div className="lg:col-span-5 space-y-10">
            <IntersectionReveal>
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-accent/10 rounded-xl border border-accent/20 text-accent">
                    <Target className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-accent">Performance Audit</span>
                </div>
                <h2 className="text-4xl lg:text-6xl font-black font-headline tracking-tighter uppercase italic leading-[0.9]">
                  Calibration <br /> <span className="text-accent">Precision.</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium leading-relaxed italic border-l-4 border-accent/30 pl-8">
                  "Institutional alpha is a function of calibration. Our GAD substrate maintains a Brier Score delta of -42% relative to retail consensus nodes."
                </p>
              </div>
            </IntersectionReveal>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2 group hover:border-accent/30 transition-all text-left">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Avg Brier Target</span>
                <div className="text-3xl font-black font-mono text-accent">0.134</div>
                <p className="text-[8px] font-bold text-accent/60 uppercase italic">Institutional Floor</p>
              </div>
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-2 group hover:border-primary/30 transition-all text-left">
                <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Alpha Capture</span>
                <div className="text-3xl font-black font-mono text-primary">1.42x</div>
                <p className="text-[8px] font-bold text-primary/60 uppercase italic">Vs. Naive Baseline</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <IntersectionReveal delay={300}>
              <div className="bg-[#0A0C12] border border-white/5 rounded-[3rem] p-1 lg:p-2 overflow-hidden shadow-2xl">
                <div className="bg-black/40 rounded-[2.8rem] p-10 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03]"><TrendingUp className="w-64 h-64 text-accent" /></div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent/10 rounded-2xl text-accent">
                        <Radar className="w-6 h-6 animate-spin-slow" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-black uppercase tracking-widest italic text-white">Calibration Trace Audit</h3>
                        <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Sector Attribution Matrix v4.2</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-black border-accent/20 text-accent uppercase">PROOF: ABSOLUTE</Badge>
                  </div>

                  <div className="space-y-8 relative z-10">
                    {[
                      { label: 'Politics (US Election)', brier: '0.122', rel: 94, c: 'text-accent' },
                      { label: 'Crypto (ETF Convergence)', brier: '0.145', rel: 88, c: 'text-primary' },
                      { label: 'Macro (Fed Variance)', brier: '0.118', rel: 96, c: 'text-accent' },
                      { label: 'World (Geopolitics)', brier: '0.132', rel: 91, c: 'text-primary' }
                    ].map(sector => (
                      <div key={sector.label} className="space-y-3 group/item text-left">
                        <div className="flex justify-between items-end">
                          <div className="space-y-1 text-left">
                            <span className="text-[10px] font-black uppercase italic text-foreground group-hover/item:text-white transition-colors">{sector.label}</span>
                            <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Brier Basis: {sector.brier}</div>
                          </div>
                          <div className="text-right">
                            <span className={cn("text-lg font-black font-mono", sector.c)}>{sector.rel}%</span>
                            <span className="text-[8px] font-black text-muted-foreground uppercase block">RELIABILITY</span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full transition-all duration-[2000ms] group-hover/item:opacity-80", sector.c.replace('text-', 'bg-'))} style={{ width: `${sector.rel}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5 flex justify-center">
                    <Button variant="ghost" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-accent gap-3 group/btn h-10 border-0" asChild>
                      <Link href="/quant-plus/backtest">Launch Sequential Replay Cycle <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            </IntersectionReveal>
          </div>
        </div>
      </section>

      {/* FINAL FOOTER PROTOCOL */}
      <footer className="py-32 border-t border-dashed border-white/10 flex flex-col items-center gap-12 mt-20 opacity-40 overflow-hidden">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground/60">
          <span>GAD_V1.4_STABLE</span>
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--quant-primary))] animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <span>ZERO_KNOWLEDGE_SUBSTRATE</span>
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--quant-primary))] animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <span>INSTITUTIONAL_AUTHORITY_VERIFIED</span>
        </div>
        
        <div className="flex flex-col items-center gap-6 text-center max-w-3xl px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[hsl(var(--quant-primary))] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(168,85,247,0.4)]">Q</div>
            <span className="text-2xl font-black font-headline tracking-tighter uppercase italic text-white">Quant <span className="text-[hsl(var(--quant-primary))]">+</span> Substrate</span>
          </div>
          <p className="text-[9px] font-medium leading-relaxed italic uppercase tracking-widest max-w-2xl mx-auto">
            "The Quant+ Protocol is a restricted institutional decision support environment. All GAD state signals and λt trace logs are cryptographically finalized within the distributed extraction cluster. Subscriber authorization is mandatory for terminal initialization."
          </p>
          <div className="flex items-center gap-4 text-[8px] font-black uppercase text-muted-foreground tracking-[0.4em]">
            <span>NODE_ID: 0xBE...AD42</span>
            <span>|</span>
            <span>SECURED BY AES-256 GCM</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .animate-mesh-slow {
          animation: mesh-float 30s ease-in-out infinite;
        }
        @keyframes mesh-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(5%, 10%) scale(1.1); }
          66% { transform: translate(-5%, -5%) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
