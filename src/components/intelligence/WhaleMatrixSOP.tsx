'use client';

/**
 * @fileOverview Institutional Whale Matrix SOP.
 * Provides a high-intensity professional dialog explaining behavioral monitoring and risk overlays.
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
  Anchor,
  Fingerprint,
  Layers,
  Search,
  Terminal,
  Crosshair,
  Skull,
  ShieldAlert,
  Scale,
  BrainCircuit
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function WhaleMatrixSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Protocol Handshake Verified',
      description: 'Whale Matrix monitoring briefing acknowledged. Compliance status: NOMINAL.',
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
              Whale Monitoring <br />
              Protocol Briefing.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: BEHAVIORAL_RECON_V4 • AUDIT_LEVEL: ABSOLUTE
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Whale Matrix (/whale-matrix) is the platform's professional-layer scanner for mechanical market pressure. It solves the "Informational vs. Mechanical" dilemma by identifying large-actor fingerprints and integrating them as a deterministic inhibitor into the Stance Engine.
                </p>
              </div>

              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Strategic Core
                </h3>
                
                <div className="space-y-8">
                  {[
                    { 
                      id: '01', 
                      title: 'The Whale Risk Overlay', 
                      icon: ShieldAlert,
                      desc: 'Every market is assigned a live Integrity Label based on whale concentration. This is the primary indicator of market toxicity.',
                      sub: '• 🟢 Low: Organic discovery.\n• 🟡 Active: Large flows present.\n• 🔴 Dominated: Unstable/Toxic environment.' 
                    },
                    { 
                      id: '02', 
                      title: 'Informational vs. Mechanical', 
                      icon: BrainCircuit,
                      desc: 'The Integrity Pulse identifies if price discovery is driven by external news (Informational) or by repetitive, high-volume capital flow (Mechanical). Mechanical moves are often traps.',
                      sub: '• Move Index: Calculated via the Structural Pressure Score (SPS) and Macro Alignment.'
                    },
                    { 
                      id: '03', 
                      title: 'Behavioral Whale Modes', 
                      icon: Target,
                      desc: 'Classifies whale intent in real-time. Impact Whales move price vertically, while Absorbers use passive liquidity walls to hold price steady against retail pressure.',
                      sub: '• Pinning: Detected stabilization logic.\n• Exit Burst: Imminent reversal signals.'
                    },
                    { 
                      id: '04', 
                      title: 'Market Tradeability (Toxicity)', 
                      icon: Skull,
                      desc: 'A market is flagged as TOXIC if mechanical pressure exceeds institutional liquidity depth. Executing in toxic nodes results in extreme slippage and high reversal risk.'
                    },
                    { 
                      id: '05', 
                      title: 'Stance Engine Integration', 
                      icon: ShieldCheck,
                      desc: 'Whale risk is a non-optional inhibitor. If Behavioral Risk is 🔴 Dominated, the engine will force a WAIT status even if the alpha basis (EV) is high. This prevents entry into mechanical manipulation.'
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
                  <Scale className="w-4 h-4" /> Tactical Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'RADAR AUDIT', icon: Activity, desc: 'Check the Toxicity Monitor first. Prioritize categories with >90% Safe Matrix Nodes.' },
                    { step: '02', label: 'MODE VERIFICATION', icon: Layers, desc: 'Review the Whale Detail Sheet for active modes. Avoid markets where "Pinning" or "Absorber" modes are detected.' },
                    { step: '03', label: 'INHIBITION CHECK', icon: ShieldCheck, desc: 'Verify that the Stance Engine has not inhibited a target node. A signal with high EV but high Whale Risk is a "Paper Trap".' },
                    { step: '04', label: 'FLOW CROSS-REF', icon: TrendingUp, desc: 'Watch for "News Snipers" entering. If their entry is Informational, conviction is significantly higher.' },
                    { step: '05', label: 'RISK ALERTS', icon: Zap, desc: 'Initialize monitoring for 🔴 Dominated transitions. This alerts you the second a market shifts from Tradeable to Toxic.' },
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
                  <Skull className="w-5 h-5 fill-current" />
                  <h4 className="text-sm font-black uppercase tracking-widest">Execution Warning</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed italic">
                  "Whale Matrix analytics prioritize capital preservation over frequency. Trading in 🔴 Whale-Dominated nodes is considered non-compliant with institutional alpha standards."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Whale SOP v4.2</span>
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
