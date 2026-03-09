'use client';

/**
 * @fileOverview Institutional Guardrails SOP.
 * Explains the Discipline Enforcement Engine and behavioral control logic.
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
  ShieldAlert, 
  Zap, 
  Activity, 
  Target, 
  Terminal,
  Scale,
  BrainCircuit,
  Lock,
  Skull,
  ShieldCheck,
  History,
  AlertTriangle,
  Crosshair,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function GuardrailsSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Discipline Protocol Handshake Verified',
      description: 'Guardrail briefing acknowledged. Compliance status: SECURE.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className="h-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-accent/20 border-0"
        >
          <BookOpen className="w-3.5 h-3.5" /> View Discipline SOP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-accent border-0 p-0 overflow-hidden shadow-2xl">
        <div className="bg-accent p-8 text-black selection:bg-black selection:text-accent">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-black text-accent px-3 py-1 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                DISCIPLINE SNAPSHOT
              </div>
              <div className="h-px flex-1 bg-black/20" />
            </div>
            <DialogTitle className="text-4xl font-black font-headline leading-[0.9] text-black uppercase italic tracking-tighter">
              Guardrails <br />
              & Process Enforcement.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: BEHAVIORAL_CONTROL_V4 • AUDIT_LEVEL: PRO_ONLY
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Discipline Enforcement Engine (/guardrails) transitions Pro users from "Information Search" to "Process Enforcement". It solves the fundamental trader problem: knowing the rules but failing to follow them during high-volatility events.
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
                      title: 'Deterministic Hard Constraints', 
                      icon: ShieldAlert,
                      desc: 'Users define machine-readable rules (e.g., "Min EVS > 3%", "No Late TVS"). These constraints are checked in sub-second intervals against the marketState node before any trade logging occurs.' 
                    },
                    { 
                      id: '02', 
                      title: 'Discipline Score (DSP)', 
                      icon: Target,
                      desc: 'A rolling 30-day performance metric. Your score is penalized for every "Override" or "Flagged Violation". It distinguishes between Alpha built on Process vs. Alpha built on Luck.',
                      sub: '• Grade: A (95%+), B (85%+), C (Risk Limit Warning).'
                    },
                    { 
                      id: '03', 
                      title: 'The Soft-Block Warning', 
                      icon: Zap,
                      desc: 'The engine does not hard-block trades. Instead, it surfaces high-intensity warnings during the execution phase, forcing you to acknowledge the deviation from your framework.',
                      sub: '• Goal: Create friction at the moment of emotional impulse.'
                    },
                    { 
                      id: '04', 
                      title: 'Violation Registry', 
                      icon: History,
                      desc: 'Every override is timestamped and logged. This Registry provides a "Mirror of Truth" for your trading habits, identifying the specific regimes where your discipline fails most often.'
                    },
                    { 
                      id: '05', 
                      title: 'Process vs. Alpha Matrix', 
                      icon: BarChart3,
                      desc: 'Visualize the correlation between your discipline and your profit. Professional authority is built on maintaining high DSP even during drawdowns.'
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
                  <Skull className="w-4 h-4" /> Recommended Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'FRAMEWORK DEFINITION', icon: BrainCircuit, desc: 'Define your trading rules during a calm regime. Avoid editing rules during active trading sessions.' },
                    { step: '02', label: 'NODE EXECUTION', icon: Crosshair, desc: 'Log your entry price. If a guardrail is violated, the "Soft Block" will trigger. Ask yourself: "Am I trading the market or my impulse?"' },
                    { step: '03', label: 'OVERRIDE AUDIT', icon: AlertTriangle, desc: 'If you choose to override, the Registry will log the snapshot. Review these logs weekly to identify behavioral patterns.' },
                    { step: '04', label: 'DIVERSIFICATION ENFORCEMENT', icon: Activity, desc: 'Use the "Regime Cap" guardrail to prevent thematic overexposure discovered by the Portfolio EV Monitor.' },
                    { step: '05', label: 'DISCIPLINE REFINEMENT', icon: ShieldCheck, desc: 'Strive for a 95+ Discipline Score. Professional authority is built on repeatable process, not lucky individual hits.' },
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
                  <Lock className="w-5 h-5 fill-current" />
                  <h4 className="text-sm font-black uppercase tracking-widest">Protocol Summary</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed italic">
                  "Discipline is the engine of authority. Data identifies the trade; Guardrails protect the trader. Stop being your own worst enemy."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Guardrails SOP v4.2</span>
            <DialogClose asChild>
              <Button 
                className="bg-black text-accent hover:bg-black/90 font-black text-[10px] uppercase h-10 px-8 rounded-none tracking-widest"
                onClick={handleAcknowledge}
              >
                INITIALIZE DISCIPLINE
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
