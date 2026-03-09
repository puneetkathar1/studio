'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Globe, 
  Activity, 
  Zap, 
  Cpu, 
  Database,
  Lock,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

function NodePulse({ x, y, delay = 0 }: { x: string, y: string, delay?: number }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <circle r="3" className="fill-primary animate-pulse" style={{ animationDelay: `${delay}s` }} />
      <circle r="8" className="fill-primary/20 animate-ping" style={{ animationDelay: `${delay}s` }} />
    </g>
  );
}

function DataPath({ d, delay = 0 }: { d: string, delay?: number }) {
  return (
    <path 
      d={d} 
      className="stroke-primary/10 fill-none stroke-1" 
      strokeDasharray="4 4"
    >
      <animate
        attributeName="stroke-dashoffset"
        from="100"
        to="0"
        dur="10s"
        repeatCount="indefinite"
      />
    </path>
  );
}

export function InfrastructureDiagrams() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
      {/* DIAGRAM 1: DISTRIBUTED NODE CLUSTER */}
      <div className="bg-black/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">Distributed Cluster</h3>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">1,482 Physical Extraction Nodes</p>
          </div>
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[8px] font-black uppercase">Sync: 12ms</Badge>
        </div>

        <div className="relative aspect-[16/9] w-full border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden">
          <svg viewBox="0 0 400 200" className="w-full h-full opacity-60">
            {/* Abstract World Path */}
            <path 
              d="M50,100 Q100,50 150,100 T250,100 T350,100" 
              className="stroke-white/5 fill-none stroke-[0.5]" 
            />
            
            {/* Data Paths */}
            <DataPath d="M80,60 Q200,20 320,60" />
            <DataPath d="M80,140 Q200,180 320,140" />
            <DataPath d="M40,100 Q200,100 360,100" />

            {/* Clusters */}
            <NodePulse x="80" y="60" delay={0} />
            <NodePulse x="320" y="60" delay={1} />
            <NodePulse x="80" y="140" delay={2} />
            <NodePulse x="320" y="140" delay={0.5} />
            <NodePulse x="200" y="100" delay={1.5} />
          </svg>

          {/* Diagnostic Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[8px] font-black text-accent uppercase tracking-widest">Global Ingestion: Active</span>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground/60">NODE_GROUP: ALPHA_PRIME</div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-1/2 w-full bg-primary animate-bounce" />
              </div>
              <div className="h-8 w-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-3/4 w-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
              <div className="h-8 w-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-1/3 w-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-muted-foreground leading-relaxed italic font-medium">
          "Geographically distributed harvesting nodes ensure sub-second normalization of venue data, eliminating latency-based alpha erosion across global jurisdictions."
        </p>
      </div>

      {/* DIAGRAM 2: ORACLE CONSENSUS QUORUM */}
      <div className="bg-black/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest text-accent">Oracle Quorum</h3>
            </div>
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Multi-Oracle Finality Verification</p>
          </div>
          <Badge variant="outline" className="bg-accent/5 text-accent border-accent/20 text-[8px] font-black uppercase">Trust: Zero</Badge>
        </div>

        <div className="relative aspect-[16/9] w-full border border-white/5 rounded-2xl bg-white/[0.02] overflow-hidden flex items-center justify-center">
          <div className="relative w-48 h-48">
            {/* Center Node */}
            <div className="absolute inset-0 m-auto w-16 h-16 bg-accent/10 border-2 border-accent rounded-xl flex items-center justify-center z-10 shadow-[0_0_30px_rgba(0,255,120,0.2)]">
              <ShieldCheck className="w-8 h-8 text-accent animate-pulse" />
            </div>

            {/* Orbiting Oracles */}
            {[0, 60, 120, 180, 240, 300].map((deg, i) => (
              <div 
                key={i}
                className="absolute inset-0 m-auto w-8 h-8 bg-black border border-white/10 rounded flex items-center justify-center transition-all duration-500 hover:border-accent"
                style={{ transform: `rotate(${deg}deg) translateY(-70px) rotate(-${deg}deg)` }}
              >
                <Database className="w-4 h-4 text-primary/40" />
                
                {/* Connecting Lines */}
                <div 
                  className="absolute w-12 h-px bg-gradient-to-r from-accent/40 to-transparent origin-left"
                  style={{ left: '100%', transform: `rotate(${deg + 180}deg)` }}
                />
              </div>
            ))}

            {/* Verification Beams */}
            <div className="absolute inset-0 m-auto w-40 h-40 border border-white/5 rounded-full animate-spin-slow" />
          </div>

          {/* Diagnostics */}
          <div className="absolute top-4 right-4 text-right">
            <div className="flex items-center gap-2 justify-end mb-1">
              <span className="text-[8px] font-black uppercase text-accent">Quorum Verified</span>
              <CheckCircle2 className="w-3 h-3 text-accent" />
            </div>
            <div className="text-[10px] font-mono text-muted-foreground">HASH: 0xBE...AD42</div>
          </div>
        </div>

        <p className="mt-6 text-[10px] text-muted-foreground leading-relaxed italic font-medium">
          "No signal is committed to the public ledger without a 2/3 oracle consensus. Finality is achieved through redundant validation of venue settlement contracts."
        </p>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
