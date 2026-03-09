'use client';

/**
 * @fileOverview Institutional Intelligence Protocol SOP.
 * Provides a high-intensity briefing on the professional workflow: 
 * Alpha Stream -> Whale Recon -> Macro Lab -> Intelligence Terminal.
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
  ArrowRight,
  Anchor,
  Globe,
  Layers,
  Cpu,
  ShieldAlert,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function IntelligenceProtocolSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Intelligence Handshake Verified',
      description: 'Pro Protocol SOP acknowledged. High-conviction nodes authorized.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-8 gap-2 border-accent/30 text-accent hover:bg-accent/10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-accent/5"
        >
          <Zap className="w-3.5 h-3.5 fill-current" /> VIEW TERMINAL SOP +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-[#05070A] border-accent/20 p-0 overflow-hidden shadow-2xl">
        <div className="bg-[#05070A] p-8 text-[#E0E0E0] selection:bg-accent/30">
          <DialogHeader className="mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-accent/10 text-accent px-3 py-1 rounded border border-accent/20 text-[10px] font-black uppercase tracking-[0.2em]">
                INTELLIGENCE BRIEFING
              </div>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <DialogTitle className="text-4xl font-black font-headline leading-[0.9] text-white uppercase italic tracking-tighter text-left">
              Intelligence Protocol <br />
              <span className="text-accent">Execution Pipeline.</span>
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2 text-left">
              PROTOCOL: CONVICTION_GATE_V4 • AUDIT_LEVEL: PRO_AUTHORIZED
            </div>
          </DialogHeader>

          <ScrollArea className="h-[450px] pr-6 custom-scrollbar-accent">
            <div className="space-y-10 text-left">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-accent pl-4 text-muted-foreground">
                  The Intelligence Protocol transitions Pro users from "Information Search" to "Execution Readiness". This 4-step pipeline utilizes the new high-density HUD to synthesize Alpha Stream, Live Depth, and Macro Sensitivity into a single actionable substrate.
                </p>
              </div>

              <section className="space-y-6 text-left">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/5 pb-2 flex items-center gap-2 text-accent">
                  <Terminal className="w-4 h-4" /> The High-Conviction Pipeline
                </h3>
                
                <div className="space-y-8">
                  {[
                    { 
                      id: '01', 
                      title: 'Threshold Detection (Alpha Stream)', 
                      icon: Zap,
                      desc: 'Isolate nodes where conviction has crossed the θ_bet floor (0.020). This is your primary notification layer for execution-ready alpha.',
                      link: '/alpha-stream',
                      linkLabel: 'Monitor Stream'
                    },
                    { 
                      id: '02', 
                      title: 'Intent Verification (Whale Matrix)', 
                      icon: Anchor,
                      desc: 'Check the behavioral mode. Verify if the move is Informational (News) or Mechanical (Whale Pinning). Inhibit execution if Toxicity is 🔴 High.',
                      link: '/whale-matrix',
                      linkLabel: 'Verify Intent'
                    },
                    { 
                      id: '03', 
                      title: 'Regime Weighting (Macro Lab)', 
                      icon: Globe,
                      desc: 'Audit the global strings. Ensure macro signals confirm the move. Trust BET signals only when CMCI convergence exceeds 0.70.',
                      link: '/macro-lab',
                      linkLabel: 'Audit Macro'
                    },
                    { 
                      id: '04', 
                      title: 'Immersive Execution (Terminal)', 
                      icon: Monitor,
                      desc: 'Launch the high-density HUD to synthesize Alpha Stream, Live Orderbooks, and Macro Lab. Deconstruct the move in a sub-second execution environment.',
                      link: '/terminal-pro',
                      linkLabel: 'Launch Terminal'
                    },
                  ].map((item) => (
                    <div key={item.id} className="relative group bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-accent/30 transition-all text-left">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-accent/10 text-accent rounded border border-accent/20">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-lg font-black uppercase italic leading-none">{item.title}</h4>
                        </div>
                        <span className="text-[10px] font-mono font-black opacity-20">{item.id}</span>
                      </div>
                      <p className="text-xs font-bold leading-relaxed text-muted-foreground mb-4">{item.desc}</p>
                      <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest border border-white/5 hover:bg-accent/10 hover:text-accent gap-2" asChild>
                        <Link href={item.link}>{item.linkLabel} <ArrowRight className="w-2.5 h-2.5" /></Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 bg-accent/5 border border-accent/20 rounded-2xl space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-accent">Strategic Goal</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed italic text-muted-foreground">
                  "The high-density terminal eliminates the 'Context Variable'. By merging behavioral intent, macro alignment, and depth-adjusted pricing into one viewport, you transform raw data into a repeatable execution substrate."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center text-left">
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest opacity-40">
              <div className="flex items-center gap-1"><Cpu className="w-3 h-3 text-accent" /> PRO_NODE_ACTIVE</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-accent" /> SYNC: 12ms</div>
            </div>
            <DialogClose asChild>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-black text-[10px] uppercase h-10 px-8 rounded-none tracking-[0.2em] shadow-lg shadow-accent/20 border-0"
                onClick={handleAcknowledge}
              >
                AUTHORIZE PROTOCOL
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
      <style jsx global>{`
        .custom-scrollbar-accent::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar-accent::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar-accent::-webkit-scrollbar-thumb {
          background: hsl(var(--accent));
          border-radius: 10px;
        }
      `}</style>
    </Dialog>
  );
}