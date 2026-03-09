'use client';

/**
 * @fileOverview Institutional Pro Champion SOP.
 * Provides a high-intensity professional dialog explaining the arbitrage and basis matrix logic.
 */

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, 
  Target, 
  ShieldCheck, 
  Zap, 
  Activity, 
  TrendingUp, 
  Cpu, 
  ArrowRightLeft,
  DollarSign,
  Scale,
  Terminal,
  Crosshair,
  History,
  Repeat,
  ShieldAlert,
  Skull,
  Split,
  Copy,
  ExternalLink,
  Layers,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ProChampionSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Protocol Handshake Verified',
      description: 'Pro Champion terminal briefing acknowledged. Compliance status: NOMINAL.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className="h-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-accent/20 border-0"
        >
          <BookOpen className="w-3.5 h-3.5" /> View Terminal SOP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-accent border-0 p-0 overflow-hidden shadow-2xl">
        <div className="bg-accent p-8 text-black selection:bg-black selection:text-accent">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-black text-accent px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                INTEL SNAPSHOT
              </div>
              <div className="h-px flex-1 bg-black/20" />
            </div>
            <DialogTitle className="text-4xl font-black font-headline leading-[0.9] text-black uppercase italic tracking-tighter">
              Arb & Basis Matrix <br />
              Execution SOP.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: VENUE_DECOUPLING_V4 • AUDIT_LEVEL: ABSOLUTE
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Pro Champion Terminal (/pro-champion) is the platform's high-frequency execution environment. It is re-engineered to facilitate large-volume entries across thin venues using Consolidated Depth and Smart Order Router (SOR).
                </p>
              </div>

              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Operational Core
                </h3>
                
                <div className="space-y-8">
                  {[
                    { 
                      id: '01', 
                      title: 'Smart Order Router (SOR)', 
                      icon: Split,
                      desc: 'The SOR engine performs a dynamic proportional split based on real-time venue depth. It calculates the exact capital allocation needed across Polymarket and Kalshi to achieve the best aggregate VWAP.',
                      sub: '• Logic: Allocation = (Venue_Liquidity / Total_Cluster_Liquidity)'
                    },
                    { 
                      id: '02', 
                      title: 'Consolidated Liquidity Aggregator', 
                      icon: Layers,
                      desc: 'Identical markets are paired using the institutional Title Normalization key. The terminal merges these order books to visualize "Combined Depth," allowing for trade sizes that far exceed a single venue\'s capacity.' 
                    },
                    { 
                      id: '03', 
                      title: 'AEV (Execution-Adjusted EV)', 
                      icon: TrendingUp,
                      desc: 'Calculates the net profit potential after accounting for venue-side fees and estimated depth slippage. This represents the absolute mathematical edge of the atomic path.',
                      sub: '• Calculation: Gross Spread - Cumulative Fees - Impact Slippage.'
                    },
                    { 
                      id: '04', 
                      title: 'LBS (Liquidity-Bound Size)', 
                      icon: Scale,
                      desc: 'Identifies the "Depth Wall." It warns the user if their intended trade size exceeds the combined liquidity available before alpha is completely eroded by slippage.',
                    },
                    { 
                      id: '05', 
                      title: 'Kinetic Weighting Pulse', 
                      icon: Activity,
                      desc: 'Order book data "breathes" in real-time. The SOR split percentages and Δ-Basis metrics are sensitive to sub-second micro-shifts in limit order concentration across the cluster.'
                    },
                  ].map((item) => (
                    <div key={item.id} className="relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-black text-accent rounded">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-lg font-black uppercase italic leading-none">{item.title}</h4>
                        </div>
                        <span className="text-[10px] font-mono font-black opacity-20">{item.id}</span>
                      </div>
                      <p className="text-xs font-bold leading-relaxed opacity-80 mb-2">{item.desc}</p>
                      {item.sub && (
                        <div className="bg-black/5 p-3 rounded border border-black/10 text-[10px] font-bold whitespace-pre-line leading-relaxed">
                          {item.sub}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2 flex items-center gap-2">
                  <History className="w-4 h-4" /> Tactical Execution Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'CAPITAL CALIBRATION', icon: DollarSign, desc: 'Use the "Arb Engine Controls" to set your intended trade size. The terminal will immediately re-calculate the SOR split and Net Alpha profit.' },
                    { step: '02', label: 'NODE AUDIT', icon: Search, desc: 'Sort by "AEV %" to identify high-fidelity spreads. Click an opportunity to expand the "Consolidated Depth" audit sheet.' },
                    { step: '03', label: 'CAPTURE INTENT', icon: Copy, desc: 'Use the "Copy" icon on each leg to capture the precise instruction set (Side, Size, and Limit Price) for your clipboard.' },
                    { step: '04', label: 'TACTICAL BRIDGE', icon: ExternalLink, desc: 'Click "Bridge to Venue" for each leg to open the secure market interfaces. Simultaneously paste the intent payloads to lock in the spread.' },
                    { step: '05', label: 'ATOMIC FINALITY', icon: Target, desc: 'Click "Initiate Atomic Sequence" to commit your intent to the platform\'s private audit node for realized performance verification.' },
                  ].map((item) => (
                    <div key={item.step} className="p-4 bg-black/5 border border-black/10 rounded-xl flex gap-4">
                      <div className="text-xl font-black italic opacity-20">{item.step}</div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest">{item.label}</div>
                        <p className="text-[11px] font-bold leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 bg-black text-accent rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 fill-current" />
                  <h4 className="text-sm font-black uppercase tracking-widest">Execution Warning</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed italic">
                  "Speed is the only edge. The Δ-Basis spread has an execution half-life. Use the SOR split basis to distribute size across venues concurrently to minimize directional risk."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Champion SOP v4.2</span>
            <DialogClose asChild>
              <Button 
                className="bg-black text-accent hover:bg-black/90 font-black text-[10px] uppercase h-10 px-8 rounded-none tracking-widest"
                onClick={handleAcknowledge}
              >
                AUTHORIZE PROTOCOL
              </Button>
            </DialogClose>
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
