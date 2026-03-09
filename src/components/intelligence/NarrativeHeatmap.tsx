'use client';

/**
 * @fileOverview Narrative Momentum Heatmap.
 * A high-fidelity scanner for Global Alpha Density based on MIS (Market Inefficiency) scores.
 */

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  Radar, 
  Layers,
  Search,
  Cpu,
  ShieldCheck,
  Target,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'politics', label: 'Politics', baseMis: 0.72, vol: '$42M' },
  { id: 'crypto', label: 'Crypto', baseMis: 0.88, vol: '$12M' },
  { id: 'macro', label: 'Macro', baseMis: 0.45, vol: '$8M' },
  { id: 'tech', label: 'Tech', baseMis: 0.64, vol: '$15M' },
  { id: 'biotech', label: 'Biotech', baseMis: 0.78, vol: '$6M' },
  { id: 'energy', label: 'Energy', baseMis: 0.55, vol: '$9M' },
  { id: 'world', label: 'World', baseMis: 0.39, vol: '$4M' },
  { id: 'finance', label: 'Finance', baseMis: 0.42, vol: '$11M' },
];

function HeatmapCell({ category, tick }: { category: typeof CATEGORIES[0], tick: number }) {
  const currentMis = useMemo(() => {
    // Simulate real-time MIS drift
    const drift = (Math.sin(tick * 0.4 + category.id.length) * 0.05);
    return Math.max(0.1, category.baseMis + drift).toFixed(2);
  }, [tick, category]);

  const isHot = parseFloat(currentMis) > 0.75;

  return (
    <div className={cn(
      "relative p-5 border border-white/5 bg-white/[0.02] flex flex-col justify-between h-36 transition-all duration-1000 overflow-hidden group",
      isHot ? "border-primary/40 bg-primary/[0.03]" : "hover:bg-white/[0.05]"
    )}>
      {isHot && (
        <div className="absolute top-0 right-0 p-2">
          <div className="flex items-center gap-1">
            <span className="text-[7px] font-black text-primary animate-pulse uppercase tracking-widest">Alpha Node</span>
            <Zap className="w-3 h-3 text-primary animate-pulse fill-primary" />
          </div>
        </div>
      )}
      
      <div className="space-y-1">
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{category.label}</span>
        <div className={cn(
          "text-3xl font-black font-mono tracking-tighter tabular-nums",
          isHot ? "text-primary" : "text-foreground/80"
        )}>
          {currentMis}
        </div>
        <span className="text-[8px] font-bold text-muted-foreground/40 uppercase">MIS SCORE</span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-[7px] font-bold text-muted-foreground/40 uppercase">
          <span>Alpha Density</span>
          <span className={cn(isHot ? "text-primary" : "text-muted-foreground")}>
            {isHot ? 'CRITICAL' : 'NOMINAL'}
          </span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              isHot ? "bg-primary shadow-[0_0_10px_hsl(var(--primary))]" : "bg-muted-foreground/40"
            )}
            style={{ width: `${(parseFloat(currentMis)) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[8px] font-black text-muted-foreground/60">
          <span className="uppercase tracking-tighter">Vol: {category.vol}</span>
          {isHot && <TrendingUp className="w-2.5 h-2.5 text-primary" />}
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 opacity-[0.03] rotate-12 pointer-events-none group-hover:opacity-10 transition-opacity">
        <Layers className="w-20 h-20" />
      </div>
    </div>
  );
}

export function NarrativeHeatmap() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group">
      <div className="bg-[#0A0C12] border-b border-white/5 px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded border border-primary/20 text-primary">
            <Radar className="w-6 h-6 animate-spin-slow" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-black uppercase tracking-widest italic">Narrative Momentum Heatmap</h3>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">Global Alpha Density Scanner • Protocol v4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-primary/10 border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_hsl(var(--primary))]" />
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">Scanning Inefficiencies...</span>
          </div>
          <Badge variant="outline" className="text-[10px] font-black uppercase border-white/10 px-3 h-8">Depth: 1.4k Nodes</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 bg-[#05070A] gap-px border-b border-white/5">
        {CATEGORIES.map((cat) => (
          <HeatmapCell key={cat.id} category={cat} tick={tick} />
        ))}
      </div>

      <div className="bg-black/40 p-6 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1 w-full">
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Avg MIS Basis</span>
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-xl font-black font-mono text-foreground">0.542</span>
            </div>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Convergence Delta</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xl font-black font-mono text-accent">+12.4%</span>
            </div>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Hot Clusters</span>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xl font-black font-mono text-foreground">3 NODES</span>
            </div>
          </div>
          <div className="space-y-1 text-left">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Status</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-xl font-black font-mono text-foreground uppercase">NOMINAL</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto shrink-0">
          <div className="hidden sm:flex items-center gap-3 pr-6 border-r border-white/10 text-right">
            <Target className="w-5 h-5 text-primary animate-pulse" />
            <p className="text-[10px] text-muted-foreground font-black uppercase leading-tight italic">
              "Easy Alpha" detected in <br/>
              Politics + Crypto clusters.
            </p>
          </div>
          <Button className="flex-1 lg:flex-none h-12 px-10 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20" asChild>
            <Link href="/knowledge-sphere">Explore Sphere <ChevronRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>

      <div className="h-10 bg-white/[0.02] border-t border-white/5 flex items-center px-6 justify-between opacity-40">
        <div className="flex gap-6 text-[9px] font-black uppercase tracking-widest">
          <span>Audit Node: X-NARRATIVE-SCAN-V4</span>
          <span>Optic Sync: Active</span>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
          <span>Identifying Mispricing Basis</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
        </div>
      </div>
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
}
