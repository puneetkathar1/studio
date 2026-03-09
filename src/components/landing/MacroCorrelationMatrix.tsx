'use client';

import { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Link as LinkIcon, 
  TrendingUp, 
  Activity, 
  Cpu, 
  Zap, 
  Info,
  Scale,
  Radar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const MACRO_SIGNALS = ['US CPI', 'Fed Rate', 'US GDP', 'Oil Basis', '10Y Yield'];
const MARKET_NODES = [
  { id: 'trump-24', title: 'Trump 2024 Winner' },
  { id: 'fed-june', title: 'Fed June Rate Cut' },
  { id: 'btc-100k', title: 'Bitcoin $100k' },
  { id: 'sp-5500', title: 'S&P 500 @ 5,500' },
  { id: 'eth-etf', title: 'ETH ETF Approval' },
];

const CORRELATION_DATA: Record<string, number[]> = {
  'trump-24': [0.12, 0.45, 0.32, 0.68, 0.54],
  'fed-june': [0.94, 0.98, 0.72, 0.42, 0.88],
  'btc-100k': [0.42, 0.65, 0.18, 0.22, 0.74],
  'sp-5500': [0.58, 0.84, 0.92, 0.34, 0.62],
  'eth-etf': [0.22, 0.38, 0.12, 0.15, 0.48],
};

function CorrelationCell({ value }: { value: number }) {
  const intensity = Math.floor(value * 100);
  const isHigh = value >= 0.8;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className={cn(
              "h-12 flex items-center justify-center border border-white/5 transition-all cursor-crosshair group relative",
              intensity > 80 ? "bg-primary/40" : intensity > 50 ? "bg-primary/20" : intensity > 20 ? "bg-primary/5" : "bg-transparent"
            )}
          >
            <span className={cn(
              "text-[10px] font-mono font-black",
              value > 0.7 ? "text-foreground" : "text-muted-foreground/60"
            )}>
              {value.toFixed(2)}
            </span>
            {isHigh && (
              <div className="absolute top-0 right-0 p-0.5">
                <div className="w-1 h-1 rounded-full bg-accent animate-pulse shadow-[0_0_4px_hsl(var(--accent))]" />
              </div>
            )}
            <div className="absolute inset-0 border border-primary/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-black text-white border-white/10 p-2 text-[9px] font-mono">
          <p className="uppercase font-black text-primary mb-1">Sensitivity Analysis</p>
          <p>Correlation: {intensity}%</p>
          <p>TQS Weighting: {(value * 1.5).toFixed(2)}x</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function MacroCorrelationMatrix() {
  return (
    <div className="w-full bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group">
      <div className="bg-[#0A0C12] border-b border-white/5 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
            <Radar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Macro Sensitivity Cluster</h3>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Cross-Asset Correlation Matrix v4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-accent/10 border border-accent/20">
            <Activity className="w-3 h-3 text-accent animate-pulse" />
            <span className="text-[8px] font-bold text-accent uppercase">Engine: Live Weights</span>
          </div>
          <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10">Optic Sync Active</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* THE MATRIX */}
        <div className="lg:col-span-8 p-6 overflow-x-auto no-scrollbar">
          <div className="min-w-[600px] space-y-1">
            {/* Headers */}
            <div className="grid grid-cols-6 mb-4">
              <div className="col-span-1" />
              {MACRO_SIGNALS.map(s => (
                <div key={s} className="text-center">
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground vertical-rl rotate-180 h-16 inline-block">
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {MARKET_NODES.map((node) => (
              <div key={node.id} className="grid grid-cols-6 items-center group/row">
                <div className="col-span-1 pr-4">
                  <span className="text-[10px] font-bold truncate block group-hover/row:text-primary transition-colors uppercase italic">
                    {node.title}
                  </span>
                </div>
                {CORRELATION_DATA[node.id].map((val, idx) => (
                  <CorrelationCell key={`${node.id}-${idx}`} value={val} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR BRIEFING */}
        <div className="lg:col-span-4 border-l border-white/5 bg-black/20 p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary">
              <Scale className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Weighting Logic</h4>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium italic bg-white/[0.02] p-3 rounded border border-white/5">
              "The Stance Engine automatically identifies non-linear links between macro regimes and market pricing. High correlation triggers a TQS scalar boost for predictive conviction."
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Zap className="w-4 h-4" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Current Hot Node</h4>
            </div>
            <div className="p-3 bg-accent/5 border border-accent/20 rounded-xl space-y-2">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black text-foreground uppercase">Fed Rate vs. S&P</span>
                <Badge className="bg-accent text-accent-foreground text-[8px] font-black h-4">0.92</Badge>
              </div>
              <p className="text-[8px] text-accent/70 font-bold uppercase tracking-tighter">Extreme Sensitivity Detected</p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5">
            <Button variant="ghost" className="w-full h-8 text-[9px] font-black uppercase gap-2 hover:bg-primary/10 hover:text-primary transition-all border border-white/10">
              Unlock Macro API <TrendingUp className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="h-8 bg-white/[0.02] border-t border-white/5 flex items-center px-6 justify-between opacity-40">
        <div className="flex gap-4">
          <span className="text-[8px] font-black uppercase tracking-tighter">Audit Link: X-MACRO-CORR-V4.2</span>
          <span className="text-[8px] font-black uppercase tracking-tighter">Confidence: 99.2%</span>
        </div>
        <div className="flex items-center gap-2">
          <Info className="w-3 h-3" />
          <span className="text-[8px] font-black uppercase tracking-widest">Pearson Coefficient Method</span>
        </div>
      </div>
    </div>
  );
}
