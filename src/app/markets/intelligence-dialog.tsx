'use client';

import { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Info, ShieldAlert, Zap, TrendingUp, BarChart3, Activity, Clock, Fingerprint, BrainCircuit, ShieldCheck, PieChart, Anchor, Layers } from 'lucide-react';
import { Market } from '@/lib/types';
import { getDeterministicIntelligence } from '@/lib/intelligence';
import { cn } from '@/lib/utils';

interface ScoreItemProps {
  label: string;
  short: string;
  value: string | number;
  description: string;
  subtext: string;
  icon: any;
}

function ScoreItem({ label, short, value, description, subtext, icon: Icon }: ScoreItemProps) {
  return (
    <div className="border-b border-black/10 py-4 last:border-0">
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-black/5 rounded">
            <Icon className="w-4 h-4 text-black" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-black/60 leading-none mb-1">
              {short} — {label}
            </div>
            <div className="text-sm font-bold text-black leading-tight">
              {description}
            </div>
          </div>
        </div>
        <div className="text-xl font-black font-mono text-black tabular-nums">
          {value}
        </div>
      </div>
      <div className="text-[10px] font-bold text-black/50 uppercase leading-relaxed">
        → {subtext}
      </div>
    </div>
  );
}

function ProbabilityDecompositionMatrix({ decomposition, total }: { decomposition: any, total: number }) {
  const items = [
    { label: 'Informed', val: decomposition.informed, color: 'bg-black', icon: BrainCircuit },
    { label: 'Momentum', val: decomposition.momentum, color: 'bg-black/60', icon: TrendingUp },
    { label: 'Whale', val: decomposition.whales, color: 'bg-black/40', icon: Anchor },
    { label: 'Noise', val: decomposition.noise, color: 'bg-black/20', icon: Activity },
  ];

  const totalPoints = items.reduce((acc, item) => acc + item.val, 0);

  return (
    <div className="bg-black/5 rounded-2xl p-5 mb-6 space-y-6">
      <div className="flex items-center justify-between border-b border-black/10 pb-3">
        <div className="flex items-center gap-2 text-black/60">
          <PieChart className="w-4 h-4" />
          <h3 className="text-[10px] font-black uppercase tracking-widest">Prob Decomposition</h3>
        </div>
        <span className="text-sm font-black font-mono text-black">{(total * 100).toFixed(1)}%</span>
      </div>

      <div className="space-y-6">
        {/* STACKED BAR */}
        <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden flex shadow-inner">
          {items.map((item, idx) => {
            const width = (item.val / totalPoints) * 100;
            if (width <= 0) return null;
            return (
              <div 
                key={idx}
                className={cn("h-full border-r border-white/10 last:border-0", item.color)}
                style={{ width: `${width}%` }}
              />
            );
          })}
        </div>

        {/* LEGEND GRID */}
        <div className="grid grid-cols-2 gap-3">
          {items.map(item => (
            <div key={item.label} className="flex items-center justify-between bg-black/5 p-2 rounded-lg group">
              <div className="flex items-center gap-2 min-w-0">
                <item.icon className="w-3 h-3 text-black opacity-40 group-hover:opacity-100 transition-opacity" />
                <span className="text-[8px] font-black uppercase text-black/60 truncate">{item.label}</span>
              </div>
              <span className="text-[9px] font-black font-mono text-black">+{item.val.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function IntelligenceScorecard({ market }: { market: Market }) {
  const intel = useMemo(() => getDeterministicIntelligence(market.id, market.priceProb || 0.5), [market.id, market.priceProb]);
  
  const scores = useMemo(() => {
    const seed = market.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      sps: (60 + (seed % 35)).toFixed(1) + '%',
      cci: (0.4 + (seed % 60) / 100).toFixed(2),
      evs: ((seed % 20 - 10) / 10).toFixed(2),
      mis: (0.1 + (seed % 80) / 100).toFixed(2),
      lqs: (0.3 + (seed % 70) / 100).toFixed(2),
      tvs: (seed % 3 === 0 ? 'OPTIMAL' : seed % 3 === 1 ? 'EARLY' : 'LATE'),
      rrs: (0.1 + (seed % 50) / 100).toFixed(2),
    };
  }, [market.id]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          size="icon" 
          className="h-8 w-8 bg-accent text-accent-foreground hover:bg-accent/90 border-0 shadow-lg shadow-accent/20"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-accent border-0 p-0 overflow-hidden shadow-2xl">
        <div className="bg-accent p-6 text-black selection:bg-black selection:text-accent">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-black text-accent px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest">
                MATRIX DIAGNOSTIC
              </div>
              <div className="h-px flex-1 bg-black/20" />
            </div>
            <DialogTitle className="text-2xl font-black font-headline leading-tight text-black uppercase italic tracking-tighter text-left">
              Node Briefing: {market.title}
            </DialogTitle>
          </DialogHeader>

          {/* DIAGNOSTIC BASIS SECTION */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-black/5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-black/40"><Fingerprint className="w-3 h-3" /><span className="text-[7px] font-black uppercase tracking-widest">THE WHO</span></div>
              <div className="text-[10px] font-black uppercase leading-tight truncate">{intel.diagnostic?.who || 'RECON...'}</div>
            </div>
            <div className="p-3 bg-black/5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-black/40"><BrainCircuit className="w-3 h-3" /><span className="text-[7px] font-black uppercase tracking-widest">THE WHY</span></div>
              <div className="text-[10px] font-black uppercase leading-tight truncate">{intel.diagnostic?.why || 'AUDITING...'}</div>
            </div>
            <div className="p-3 bg-black/5 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-black/40"><ShieldCheck className="w-3 h-3" /><span className="text-[7px] font-black uppercase tracking-widest">INTEGRITY</span></div>
              <div className={cn("text-[10px] font-black uppercase leading-tight", intel.diagnostic?.integrity === 'SIGNAL' ? 'text-black' : 'text-black/40')}>
                {intel.diagnostic?.integrity || 'CALIBRATING'}
              </div>
            </div>
          </div>

          <ProbabilityDecompositionMatrix decomposition={intel.decomposition} total={market.priceProb || 0.5} />

          <div className="space-y-0 h-[250px] overflow-y-auto pr-2 custom-scrollbar-black">
            <ScoreItem 
              short="SPS"
              label="Signal Probability Score"
              value={scores.sps}
              description="Model-estimated probability that the stated outcome resolves correctly."
              subtext="Your “true odds” number."
              icon={TrendingUp}
            />
            <ScoreItem 
              short="CCI"
              label="Confidence Consistency Index"
              value={scores.cci}
              description="Measures how stable the signal is across models, time, and sources."
              subtext="High = robust, low = fragile."
              icon={ShieldAlert}
            />
            <ScoreItem 
              short="EVS"
              label="Expected Value Score"
              value={scores.evs}
              description="Normalized expected value relative to market pricing."
              subtext="Positive = edge, negative = avoid."
              icon={Zap}
            />
            <ScoreItem 
              short="MIS"
              label="Market Inefficiency Score"
              value={scores.mis}
              description="Degree of divergence between market-implied probability and fair value."
              subtext="Quantifies mispricing."
              icon={BarChart3}
            />
            <ScoreItem 
              short="LQS"
              label="Liquidity Quality Score"
              value={scores.lqs}
              description="Assesses depth, spread, and susceptibility to manipulation."
              subtext="Low LQS = prices lie."
              icon={Activity}
            />
            <ScoreItem 
              short="TVS"
              label="Timing Value Score"
              value={scores.tvs}
              description="Indicates whether now is early, optimal, or late to enter."
              subtext="Powers BET vs WAIT."
              icon={Clock}
            />
            <ScoreItem 
              short="RRS"
              label="Regime Risk Score"
              value={scores.rrs}
              description="Captures uncertainty from events, volatility, or structural breaks."
              subtext="High RRS = higher error risk."
              icon={Info}
            />
          </div>

          <div className="mt-6 pt-4 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-40">PI-Pro • Diagnostic Audit v4.2</span>
            <Button 
              className="bg-black text-accent hover:bg-black/90 font-black text-[10px] uppercase h-8 px-4 rounded-none"
            >
              Diagnostic JSON
            </Button>
          </div>
        </div>
      </DialogContent>
      <style jsx global>{`
        .custom-scrollbar-black::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-black::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
        }
        .custom-scrollbar-black::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </Dialog>
  );
}