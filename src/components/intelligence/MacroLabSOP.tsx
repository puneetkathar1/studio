'use client';

/**
 * @fileOverview Institutional Macro Lab SOP.
 * Provides a high-intensity professional dialog explaining macro correlation logic and weighting.
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
  Globe, 
  Radar,
  BrainCircuit,
  Scale,
  Terminal,
  Crosshair,
  History,
  Fingerprint,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function MacroLabSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Protocol Handshake Verified',
      description: 'Macro Lab briefing acknowledged. Compliance status: NOMINAL.',
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
              Macro Correlation <br />
              Briefing.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: MACRO_SENSITIVITY_V4 • AUDIT_LEVEL: ABSOLUTE
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Macro Correlation Lab (/macro-lab) is the platform's environment for understanding the "hidden strings" pulling market sentiment. It correlates global signals with the matrix, now featuring "Behavioral Cross-Check" to ensure macro momentum isn't being artificially pinned by large flows.
                </p>
              </div>

              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Quantitative Framework
                </h3>
                
                <div className="space-y-8">
                  {[
                    { 
                      id: '01', 
                      title: 'Informational Alignment', 
                      icon: ShieldAlert,
                      desc: 'The engine verifies if macro-driven price discovery is "Informational" or "Mechanical". High macro delta accompanied by high mechanical flow (Whale risk) indicates a regime of artificial pinning rather than true discovery.',
                      sub: '• Constraint: TQS multipliers are only applied to Informational moves.'
                    },
                    { 
                      id: '02', 
                      title: 'The Sensitivity Matrix', 
                      icon: Radar,
                      desc: 'Our matrix utilizes Pearson Correlation Coefficients to identify how closely a macro signal moves in lockstep with a specific market node. This identifies "Sensitive Pairs" where macro variance is a primary driver.' 
                    },
                    { 
                      id: '03', 
                      title: 'Regime Multipliers', 
                      icon: Scale,
                      desc: 'When macro sensitivity is high, the engine applies a multiplier to the TQS of the affected cluster. High-delta macro variance promotes or penalizes alpha conviction in real-time.',
                      sub: '• Multiplier = 1 + (Sensitivity_Scalar * Macro_Delta)'
                    },
                    { 
                      id: '04', 
                      title: 'CMCI Convergence', 
                      icon: BrainCircuit,
                      desc: 'The Confirmation/Momentum Composite Index (CMCI) tracks how well macro signals confirm current market momentum. No high-conviction BET signal is issued without a >0.70 CMCI confirmation.'
                    },
                    { 
                      id: '05', 
                      title: 'Optic Sync Ingestion', 
                      icon: Activity,
                      desc: 'Macro signals are ingested via 1,400+ distributed nodes with 12ms sync latency. Intelligence is verified via a multi-oracle quorum.'
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
                  <Crosshair className="w-4 h-4" /> Analytical Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'MATRIX SCAN', icon: Globe, desc: 'Identify high-coefficient pairs. Look for "Hot Nodes" where macro alignment is strong but behavioral risk is 🟢 Low.' },
                    { step: '02', label: 'MULTIPLIER AUDIT', icon: TrendingUp, desc: 'Verify the current Stance Multipliers. High multipliers in 🔴 Toxic nodes indicate a "Crowded Trade" where reversal risk is extreme.' },
                    { step: '03', label: 'DRIFT MONITORING', icon: Activity, desc: 'Scan the Hidden Strings Trace. If sensitivity is increasing but the Move Type is Mechanical, prepare for an artificial pinning event.' },
                    { step: '04', label: 'CONVERGENCE CHECK', icon: ShieldCheck, desc: 'Cross-reference macro confirmation with the Alpha Stream. Trust signals where macro factors and behavioral integrity align.' },
                    { step: '05', label: 'REGIME RE-BALANCING', icon: History, desc: 'Use the Lab to re-balance your execution. In high-risk regimes, prioritize Informational discovery over mechanical momentum.' },
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
                  "Macro signals define the probability environment. Behavioral risk defines the execution environment. Use this Lab to refine your conviction when both dimensions align."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Macro Lab SOP v4.2</span>
            <DialogClose asChild>
              <Button 
                className="bg-black text-accent hover:bg-black/90 font-black text-[10px] uppercase h-10 px-8 rounded-none tracking-widest"
                onClick={handleAcknowledge}
              >
                FINALIZE BRIEFING
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
