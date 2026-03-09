'use client';

/**
 * @fileOverview Institutional Execution Protocol SOP.
 * Provides a high-intensity briefing on the professional workflow for the Protocol section: 
 * Guardrails -> Arb Matrix -> Portfolio Audit -> System Calibration.
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
  ShieldAlert,
  Repeat,
  Briefcase,
  Layers,
  Cpu,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function ExecutionProtocolSOP() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="h-8 gap-2 border-primary/30 text-primary hover:bg-primary/10 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/5"
        >
          <ShieldCheck className="w-3.5 h-3.5" /> VIEW PROTOCOL SOP +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-[#0A0C12] border-primary/20 p-0 overflow-hidden shadow-2xl">
        <div className="bg-[#0A0C12] p-8 text-[#E0E0E0] selection:bg-primary/30">
          <DialogHeader className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em]">
                EXECUTION BRIEFING
              </div>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <DialogTitle className="text-4xl font-black font-headline leading-[0.9] text-white uppercase italic tracking-tighter">
              Execution Protocol <br />
              <span className="text-primary">Operational SOP.</span>
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: DISCIPLINE_ENFORCEMENT_V4 • AUDIT_LEVEL: INSTITUTIONAL
            </div>
          </DialogHeader>

          <ScrollArea className="h-[450px] pr-6 custom-scrollbar">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-primary pl-4 text-muted-foreground">
                  The Execution Protocol transitions Pro users from "Analysis" to "Disciplined Action". This 4-step pipeline utilizes automated guardrails and multi-venue pathing to ensure your realized alpha matches the terminal's predictive authority.
                </p>
              </div>

              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/5 pb-2 flex items-center gap-2 text-primary">
                  <Terminal className="w-4 h-4" /> The Disciplined Execution Loop
                </h3>
                
                <div className="space-y-8">
                  {[
                    { 
                      id: '01', 
                      title: 'Process Enforcement (Guardrails)', 
                      icon: ShieldAlert,
                      desc: 'Establish personal risk boundaries. Use the Guardrails engine to soft-block impulsive entries that violate your established protocol. Adherence is measured by your DSP Score.',
                      link: '/guardrails',
                      linkLabel: 'Set Guardrails'
                    },
                    { 
                      id: '02', 
                      title: 'Venue Decoupling (Arb Matrix)', 
                      icon: Repeat,
                      desc: 'Identify identical nodes across venues. Execute multi-leg sequences to lock in Δ-basis spreads and maximize capital efficiency across fragmented liquidity pools.',
                      link: '/pro-champion',
                      linkLabel: 'Launch Matrix'
                    },
                    { 
                      id: '03', 
                      title: 'Realized Accountability (Portfolio)', 
                      icon: Briefcase,
                      desc: 'Log every fill price to your private audit node. Aggregate EV across all open positions and monitor for narrative correlation risk and thematic overexposure.',
                      link: '/portfolio',
                      linkLabel: 'Audit Portfolio'
                    },
                    { 
                      id: '04', 
                      title: 'System Calibration (Briefing)', 
                      icon: Target,
                      desc: 'Review the mathematical framework of the 16-indicator engine. Verify Brier Score precision and sector attribution to refine your personal predictive calibration.',
                      link: '/docs',
                      linkLabel: 'Review Briefing'
                    },
                  ].map((item) => (
                    <div key={item.id} className="relative group bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-primary/30 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 text-primary rounded border border-primary/20">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <h4 className="text-lg font-black uppercase italic leading-none">{item.title}</h4>
                        </div>
                        <span className="text-[10px] font-mono font-black opacity-20">{item.id}</span>
                      </div>
                      <p className="text-xs font-bold leading-relaxed text-muted-foreground mb-4">{item.desc}</p>
                      <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest border border-white/5 hover:bg-primary/10 hover:text-primary gap-2" asChild>
                        <Link href={item.link}>{item.linkLabel} <ArrowRight className="w-2.5 h-2.5" /></Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-primary">Finality Goal</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed italic text-muted-foreground">
                  "Execution without protocol is gambling. Protocol without execution is research. The PI-Pro operational loop ensures that your realized alpha is a repeatable mathematical outcome."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest opacity-40">
              <div className="flex items-center gap-1"><Cpu className="w-3 h-3 text-primary" /> INST_GATEWAY_ACTIVE</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3 text-primary" /> SYNC: 12ms</div>
            </div>
            <DialogClose asChild>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-black text-[10px] uppercase h-10 px-8 rounded-none tracking-[0.2em] shadow-lg shadow-primary/20 border-0"
              >
                AUTHORIZE EXECUTION
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary));
          border-radius: 10px;
        }
      `}</style>
    </Dialog>
  );
}
