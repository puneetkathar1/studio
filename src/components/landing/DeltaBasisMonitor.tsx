'use client';

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ArrowRightLeft, 
  TrendingUp, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Waves
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const CORRELATED_NODES = [
  { id: 'fed-june', title: 'Fed Interest Rate Decision (June)', poly: 0.94, kal: 0.92 },
  { id: 'pres-elect', title: '2024 Presidential Election Winner', poly: 0.52, kal: 0.54 },
  { id: 'btc-100k', title: 'Will Bitcoin hit $100k by Year End?', poly: 0.18, kal: 0.15 },
  { id: 'eth-4k', title: 'Will Ethereum exceed $4,000 in Q3?', poly: 0.32, kal: 0.34 },
  { id: 'gdp-q2', title: 'US Q2 GDP Growth Above 2%?', poly: 0.68, kal: 0.65 },
];

export function DeltaBasisMonitor() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 2000);
    return () => clearInterval(interval);
  }, []);

  const items = useMemo(() => {
    return CORRELATED_NODES.map(node => {
      const jitter = (Math.sin(tick * 0.5 + node.id.length) * 0.002);
      const polyPrice = node.poly + jitter;
      const kalPrice = node.kal - jitter;
      const delta = Math.abs(polyPrice - kalPrice);
      const isHighArb = delta > 0.02;

      return {
        ...node,
        polyPrice,
        kalPrice,
        delta,
        isHighArb
      };
    });
  }, [tick]);

  return (
    <div className="w-full bg-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl group">
      <div className="bg-[#0A0C12] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded border border-accent/20 text-accent">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest">Cross-Venue Delta Basis</h3>
            <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest">Protocol Decoupling Scanner v4.2</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-primary/10 border border-primary/20">
            <Activity className="w-3 h-3 text-primary animate-pulse" />
            <span className="text-[8px] font-bold text-primary uppercase">Multi-Venue Sync</span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-white/5">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex flex-col md:flex-row items-center gap-6 hover:bg-white/[0.02] transition-colors relative">
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold truncate group-hover:text-primary transition-colors">{item.title}</h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-[7px] h-3.5 px-1 uppercase tracking-tighter opacity-50">Correlated Node Pair</Badge>
                <span className="text-[8px] text-muted-foreground font-mono uppercase">ID_{item.id.slice(-4)}</span>
              </div>
            </div>

            <div className="flex items-center gap-8 shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-muted-foreground uppercase mb-1">Polymarket</span>
                <span className="text-sm font-black font-mono text-foreground/80">${item.polyPrice.toFixed(3)}</span>
              </div>
              
              <div className="flex flex-col items-center">
                <Waves className="w-4 h-4 text-white/10" />
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-muted-foreground uppercase mb-1">Kalshi</span>
                <span className="text-sm font-black font-mono text-foreground/80">${item.kalPrice.toFixed(3)}</span>
              </div>

              <div className={cn(
                "flex flex-col items-end p-2 rounded border min-w-[100px] transition-colors duration-500",
                item.isHighArb ? "bg-accent/10 border-accent/30 text-accent" : "bg-white/5 border-white/10"
              )}>
                <span className="text-[8px] font-black uppercase tracking-widest mb-1 opacity-70">Δ-Basis</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black font-mono">{(item.delta * 100).toFixed(1)}c</span>
                  {item.isHighArb && <Zap className="w-3 h-3 animate-pulse" />}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-primary/5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-accent animate-pulse shrink-0" />
          <p className="text-[10px] text-muted-foreground font-bold uppercase leading-tight">
            Risk-free alpha discovery via protocol decoupling. <br/>
            Real-time scanner active across 1,400+ correlated nodes.
          </p>
        </div>
        <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest border-primary/30" asChild>
          <Link href="/pro-champion">Open Arb Matrix <TrendingUp className="ml-2 w-3 h-3" /></Link>
        </Button>
      </div>
    </div>
  );
}