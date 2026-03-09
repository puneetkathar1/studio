'use client';

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Radar, 
  Cpu, 
  Maximize2,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'politics', label: 'Politics', baseAlpha: 4.2 },
  { id: 'crypto', label: 'Crypto', baseAlpha: 8.4 },
  { id: 'macro', label: 'Macro', baseAlpha: 2.1 },
  { id: 'biotech', label: 'Biotech', baseAlpha: 5.7 },
  { id: 'geopolitics', label: 'Geopolitics', baseAlpha: 3.9 },
  { id: 'finance', label: 'Finance', baseAlpha: 1.8 },
  { id: 'energy', label: 'Energy', baseAlpha: 6.2 },
  { id: 'sports', label: 'Sports', baseAlpha: 3.1 },
  { id: 'tech', label: 'Tech', baseAlpha: 4.8 },
  { id: 'commodities', label: 'Commodities', baseAlpha: 2.5 },
];

function HeatmapCell({ category, tick }: { category: typeof CATEGORIES[0], tick: number }) {
  const currentAlpha = useMemo(() => {
    const drift = (Math.sin(tick * 0.3 + category.id.length) * 0.5);
    return Math.max(0.1, category.baseAlpha + drift).toFixed(1);
  }, [tick, category]);

  const isHot = parseFloat(currentAlpha) > 5.0;

  return (
    <div className={cn(
      "relative p-4 border border-white/5 bg-white/[0.02] flex flex-col justify-between h-32 transition-all duration-1000 overflow-hidden group",
      isHot ? "border-accent/30 bg-accent/[0.03]" : "hover:bg-white/[0.05]"
    )}>
      {isHot && (
        <div className="absolute top-0 right-0 p-1">
          <Zap className="w-3 h-3 text-accent animate-pulse fill-accent" />
        </div>
      )}
      
      <div className="space-y-1">
        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{category.label}</span>
        <div className={cn(
          "text-2xl font-black font-mono tracking-tighter tabular-nums",
          isHot ? "text-accent" : "text-primary"
        )}>
          {currentAlpha}%
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-[7px] font-bold text-muted-foreground/40 uppercase">
          <span>Alpha Density</span>
          <span>{isHot ? 'CRITICAL' : 'NOMINAL'}</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              isHot ? "bg-accent" : "bg-primary"
            )}
            style={{ width: `${(parseFloat(currentAlpha) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute -bottom-2 -right-2 opacity-5 rotate-12 pointer-events-none">
        <Layers className="w-12 h-12" />
      </div>
    </div>
  );
}

export function AlphaHeatmap() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group">
      <div className="bg-[#0A0C12] border-b border-white/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Global Alpha Density</h3>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Cross-Category Mispricing Matrix v4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20">
            <Activity className="w-3 h-3 text-accent animate-pulse" />
            <span className="text-[8px] font-bold text-accent uppercase">Live Scan Active</span>
          </div>
          <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10">Quorum: 1.4k Nodes</Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-[#05070A]">
        {CATEGORIES.map((cat) => (
          <HeatmapCell key={cat.id} category={cat} tick={tick} />
        ))}
      </div>

      <div className="bg-black/40 p-6 flex flex-col lg:flex-row items-center justify-between gap-6 border-t border-white/5">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Scan Depth</span>
            <div className="flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-black font-mono">14,282 NODES</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Alpha Basis</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              <span className="text-sm font-black font-mono text-accent">+12.4% AVG</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Encryption</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm font-black font-mono">AES-256</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="hidden sm:flex items-center gap-3 pr-4 border-r border-white/10 text-right">
            <AlertTriangle className="w-4 h-4 text-accent animate-pulse" />
            <p className="text-[9px] text-muted-foreground font-bold uppercase leading-tight">
              Extreme mispricing detected in Crypto <br/>
              Legality clusters. Threshold: CRITICAL.
            </p>
          </div>
          <button className="flex-1 lg:flex-none h-10 px-6 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
            Unlock Hot Nodes
          </button>
        </div>
      </div>

      <div className="h-8 bg-white/[0.02] border-t border-white/5 flex items-center px-6 justify-between opacity-40">
        <div className="flex gap-4">
          <span className="text-[8px] font-black uppercase tracking-tighter">Audit Link: X-ALPHA-MATRIX-V4.2</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Confidence: 99.4%</span>
        </div>
        <div className="flex items-center gap-2">
          <Maximize2 className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase tracking-widest">Sub-Second Optic Sync Active</span>
        </div>
      </div>
    </div>
  );
}
