
'use client';

import { ShieldCheck, Zap, Globe, Target, Scale, Cpu } from 'lucide-react';
import { cn } from '@/lib/utils';

const FEATURES = [
  {
    name: 'Price Discovery Basis',
    retail: 'Static Midpoint',
    free: 'Optic Sync (12ms)',
    pro: 'Depth-Adjusted VWAP',
    icon: Globe
  },
  {
    name: 'Conviction Protocol',
    retail: 'Public Sentiment',
    free: 'TQS Scalar Basis',
    pro: 'θ_bet Threshold (0.020)',
    icon: Target
  },
  {
    name: 'Whale Risk Monitoring',
    retail: 'Hidden (Toxic Flow)',
    free: 'Labelled Clusters',
    pro: 'Inhibition Engine Active',
    icon: ShieldCheck
  },
  {
    name: 'Institutional API',
    retail: 'None',
    free: 'Documentation Only',
    pro: 'Full WebSocket + REST',
    icon: Cpu
  },
  {
    name: 'Execution Logic',
    retail: 'Standard Order',
    free: 'Audit Node',
    pro: 'Deterministic Arb',
    icon: Scale
  }
];

export function ComparativeMatrix() {
  return (
    <div className="w-full bg-card/30 border border-white/5 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black/40 border-b border-white/5">
              <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/4">Feature Node</th>
              <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground w-1/4">Standard</th>
              <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-primary w-1/4">Discovery</th>
              <th className="p-6 text-center text-[10px] font-black uppercase tracking-widest text-accent w-1/4">Institutional (Pro)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {FEATURES.map((f) => (
              <tr key={f.name} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <f.icon className="w-4 h-4 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                    <span className="text-xs font-bold uppercase tracking-tight">{f.name}</span>
                  </div>
                </td>
                <td className="p-6 text-center text-[10px] font-medium text-muted-foreground/60 italic border-x border-white/5">{f.retail}</td>
                <td className="p-6 text-center text-[11px] font-black text-primary/80">{f.free}</td>
                <td className="p-6 text-center bg-accent/5">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[11px] font-black text-accent uppercase tracking-wider">{f.pro}</span>
                    <ShieldCheck className="w-3 h-3 text-accent" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="bg-white/[0.02] p-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] text-muted-foreground italic font-medium">
          * Protocol capabilities verified via the decentralized oracle quorum. 
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-widest text-accent">Protocol Advantage Verified</span>
        </div>
      </div>
    </div>
  );
}
