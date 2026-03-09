'use client';

/**
 * @fileOverview Institutional Alpha Journey SOP.
 * Provides a high-intensity professional dialog explaining the audit and execution path logic.
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
  Terminal,
  Crosshair,
  Scale,
  BrainCircuit,
  History,
  Clock,
  ArrowRightLeft,
  Skull,
  ShieldAlert,
  Search,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function AlphaJourneySOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Protocol Handshake Verified',
      description: 'Alpha Journey briefing acknowledged. Compliance status: NOMINAL.',
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
              Alpha Journey <br />
              Audit Briefing.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: EXECUTION_AUDIT_V4 • AUDIT_LEVEL: ABSOLUTE
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Alpha Journey (/intelligence/[id]) is the platform's tactical environment for execution and post-facto audit. It provides a sub-second "Price Discovery Curve" and verified "Intelligence Basis," allowing professional users to monitor real-time divergence and execute venue orders with high-conviction timing cues.
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
                      title: 'The Alpha Path Trace', 
                      icon: TrendingUp,
                      desc: 'The Area chart visualizes the real-time price discovery path. The "α-Basis Line" represents the price at which the intelligence node was first issued. This allows for sub-second monitoring of "Realized Drift"—the delta between model entry and current reality.' 
                    },
                    { 
                      id: '02', 
                      title: 'Whale Risk Inhibition', 
                      icon: ShieldAlert,
                      desc: 'The Decision Engine Cue now incorporates a Behavioral Monitor. If a node is flagged as 🔴 Whale-Dominated, execution is inhibited (forced WAIT) regardless of Expected Value (EV) to prevent entry into mechanical manipulation.',
                      sub: '• Risk Overlay: Low (🟢), Active (🟡), Toxic (🔴).'
                    },
                    { 
                      id: '03', 
                      title: 'Original Intelligence Basis', 
                      icon: BrainCircuit,
                      desc: 'This card contains the raw quantitative parameters at the moment of issuance. It explains the "Why" behind the trigger, including the TQS Scalar and multi-factor rationale verified by the Stance Engine.',
                      sub: '• TQS θ_bet crossing: 0.020 minimum threshold for execution readiness.'
                    },
                    { 
                      id: '04', 
                      title: 'Target Convergence Progress', 
                      icon: Target,
                      desc: 'The "Performance Vitals" card calculates your progress toward the model\'s fair value target. This ensures you know exactly how much "Edge" remains in the node before price discovery concludes.'
                    },
                    { 
                      id: '05', 
                      title: 'The Decision Engine Cue', 
                      icon: Zap,
                      desc: 'The primary execution gate. It shifts status dynamically based on divergence. Signals transition from "ALPHA TRIGGER" to "PROFIT ACHIEVED" or "THESIS BROKEN" based on multi-factor regime monitoring.'
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
                  <History className="w-4 h-4" /> Execution Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'BEHAVIORAL CHECK', icon: Skull, desc: 'Review the "Whale Detail Sheet" if Active Large Flow is detected. Verify if the move is Informational (News) or Mechanical (Whale Pinning).' },
                    { step: '02', label: 'NODE AUDIT', icon: Search, desc: 'Review the "Original Intelligence Basis". Ensure the rationale remains valid relative to recent news or macro variance.' },
                    { step: '03', label: 'PERSONAL LOGGING', icon: Crosshair, desc: 'Record your venue fill price immediately. This hashes the entry to your private performance node for predictive accuracy auditing.' },
                    { step: '04', label: 'ORDER EXECUTION', icon: ArrowRightLeft, desc: 'When the Decision Engine signals "PROFIT ACHIEVED" or "ALPHA TRIGGER," use the "Execute Settlement Order" button to finalize at the venue.' },
                    { step: '05', label: 'SETTLEMENT VERIFICATION', icon: ShieldCheck, desc: 'Finalize results upon venue resolution. The system will automatically calculate your realized units and update your Brier Score.' },
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
                  <Cpu className="w-5 h-5 fill-current" />
                  <h4 className="text-sm font-black uppercase tracking-widest">Protocol Summary</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed italic">
                  "The Alpha Journey integrates Behavioral Risk into deterministic execution. Trust the inhibition cues; they are designed to protect capital from mechanical market traps."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Alpha Journey SOP v4.2</span>
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
