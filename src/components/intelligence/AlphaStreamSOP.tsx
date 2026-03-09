'use client';

/**
 * @fileOverview Institutional Alpha Stream SOP.
 * Provides a high-intensity professional dialog explaining the high-conviction feed logic.
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
  Layers,
  Cpu,
  Terminal,
  Crosshair,
  History,
  Clock,
  Waves,
  BrainCircuit,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function AlphaStreamSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Protocol Handshake Verified',
      description: 'Alpha Stream broadcast node acknowledged. Compliance status: NOMINAL.',
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
              Alpha Stream <br />
              Protocol Briefing.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: ALPHA_BROADCAST_V4 • AUDIT_LEVEL: ABSOLUTE
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Alpha Stream (/alpha-stream) is the platform's high-conviction broadcast node. It filters the global discovery matrix to isolate only the events that have crossed the deterministic θ_bet threshold with multi-factor convergence and high informational density.
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
                      title: 'θ_bet Threshold Protocol', 
                      icon: Target,
                      desc: 'The stream utilizes a deterministic inhibitor. No signal is committed to the feed unless the Trade Quality Score (TQS) crosses the θ_bet floor (0.020). This ensures the feed remains free of retail noise and "Paper Alpha".' 
                    },
                    { 
                      id: '02', 
                      title: 'Behavioral Integrity Filter', 
                      icon: ShieldAlert,
                      desc: 'The feed now automatically inhibits nodes flagged as 🔴 Whale-Dominated. This ensures that the stream only broadcasts Informational moves (News-driven) rather than Mechanical moves (Whale-driven).',
                      sub: '• Filter: 🔴 Dominated nodes are blocked from the broadcast node.'
                    },
                    { 
                      id: '03', 
                      title: 'Multi-Factor Convergence', 
                      icon: Layers,
                      desc: 'Every broadcast represents a convergence event. The engine verifies that Price Microstructure (SPS), Confidence Consistency (CCI), and Expected Value (EVS) are all aligned with the current Macro Regime.',
                      sub: '• Alignment Verification: 94%+ required for broadcast commitment.'
                    },
                    { 
                      id: '04', 
                      title: 'Optic Sync Ingestion', 
                      icon: Activity,
                      desc: 'Discovery nodes harvest liquidity across global protocols with 12ms latency. The Alpha Stream broadcasts these triggers the millisecond they are verified by the decentralized oracle quorum.'
                    },
                    { 
                      id: '05', 
                      title: 'Execution Readiness Audit', 
                      icon: Cpu,
                      desc: 'Signals include a "Diagnostic Trace". Clicking "Execute" opens the Alpha Audit, allowing professional users to verify the original intelligence basis and real-time thesis drift before committing capital.'
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
                  <History className="w-4 h-4" /> Tactical Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'FEED MONITORING', icon: Waves, desc: 'Scan the live stream for "Alpha Triggers". Signals are already pre-filtered for whale-driven toxicity and low informational density.' },
                    { step: '02', label: 'CONVERGENCE AUDIT', icon: TrendingUp, desc: 'Open the Audit Journey for a target node. Verify that current price drift is minimal and the "Alpha Basis" remains intact.' },
                    { step: '03', label: 'WHALE MODE CHECK', icon: BrainCircuit, desc: 'Review the Whale Detail Sheet within the Journey. Ensure no "Absorber" or "Pinning" modes have emerged post-broadcast.' },
                    { step: '04', label: 'EXECUTION LOGGING', icon: Crosshair, desc: 'Record your venue fill price immediately. This hashes the entry to your private performance node for predictive precision auditing.' },
                    { step: '05', label: 'SETTLEMENT VERIFICATION', icon: ShieldCheck, desc: 'Finalize results only upon venue resolution. Compare your realized PnL against the platform\'s theoretical alpha.' },
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
                  <h4 className="text-sm font-black uppercase tracking-widest">Protocol Summary</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed italic">
                  "The Alpha Stream is a low-latency execution support service. Trust the θ_bet threshold and Behavioral Filter; they are the deterministic boundaries of conviction."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Alpha Stream SOP v4.2</span>
            <DialogClose asChild>
              <Button 
                className="bg-black text-accent hover:bg-black/90 font-black text-[10px] uppercase h-10 px-8 rounded-none tracking-widest"
                onClick={handleAcknowledge}
              >
                ACKNOWLEDGE BRIEFING
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
