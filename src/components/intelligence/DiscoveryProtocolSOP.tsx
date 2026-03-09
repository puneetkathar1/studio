'use client';

/**
 * @fileOverview Universal Discovery Protocol SOP.
 * Provides a high-intensity briefing on how to use the Free Discovery Node 
 * to solve for What, Who, and Signal vs. Noise.
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
  Database,
  Layers,
  Terminal,
  Crosshair,
  Waves,
  Cpu,
  Clock,
  LayoutDashboard,
  ArrowRight,
  Fingerprint,
  BrainCircuit,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function DiscoveryProtocolSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Discovery Handshake Verified',
      description: 'Institutional Discovery SOP acknowledged. Matrix navigation nodes authorized.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className="h-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 border-0"
        >
          <BookOpen className="w-3.5 h-3.5" /> View Discovery SOP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] bg-[#0A0C12] border-primary/20 p-0 overflow-hidden shadow-2xl">
        <div className="bg-[#0A0C12] p-8 text-[#E0E0E0] selection:bg-primary/30">
          <DialogHeader className="mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary/10 text-primary px-3 py-1 rounded border border-primary/20 text-[10px] font-black uppercase tracking-[0.2em]">
                DISCOVERY BRIEFING
              </div>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <DialogTitle className="text-4xl font-black font-headline leading-[0.9] text-white uppercase italic tracking-tighter">
              Discovery Protocol <br />
              <span className="text-primary">Standard Operating Procedure.</span>
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: VERIFICATION_PIPELINE_V4 • AUDIT_LEVEL: NOMINAL
            </div>
          </DialogHeader>

          <ScrollArea className="h-[450px] pr-6 custom-scrollbar">
            <div className="space-y-10 text-left">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-primary pl-4 text-muted-foreground">
                  The Discovery Protocol is your entry point into the intelligence substrate. Use this workflow to solve for the three fundamental unknowns of any market move: <span className="text-white">What</span> moved, <span className="text-white">Who</span> moved it, and is it <span className="text-white">Signal or Noise</span>.
                </p>
              </div>

              <section className="space-y-6 text-left">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-white/5 pb-2 flex items-center gap-2 text-primary">
                  <Terminal className="w-4 h-4" /> The 4-Step Verification Pipeline
                </h3>
                
                <div className="space-y-8 text-left">
                  {[
                    { 
                      id: '01', 
                      title: 'Identify the "What" (Markets Feed)', 
                      icon: Globe,
                      desc: 'Scan the Global Sweep for volume leaders. Use the Venue Decoder to isolate Polymarket or Kalshi specific nodes. Hierarchy mode clusters related outcomes.',
                      link: '/markets',
                      linkLabel: 'Go to Markets Feed'
                    },
                    { 
                      id: '02', 
                      title: 'Verify Historicals (Public Ledger)', 
                      icon: Database,
                      desc: 'Audit previous signals in the target sector. Verify the ZK-Audit proofs and Brier score calibration. Ensure the platform exhibits authority in this regime.',
                      link: '/ledger',
                      linkLabel: 'View Public Ledger'
                    },
                    { 
                      id: '03', 
                      title: 'Observe Live Discovery (Terminal)', 
                      icon: Activity,
                      desc: 'Launch the Terminal to monitor live probability discovery. Use the TQS Scalar to identify the precise moment conviction crosses the θ_bet floor (0.020).',
                      link: '/terminal',
                      linkLabel: 'Launch Terminal'
                    },
                    { 
                      id: '04', 
                      title: 'Execute Alpha Journey (Audit)', 
                      icon: Target,
                      desc: 'Select a node to enter the tactical journey. Deconstruct behavioral risk via Whale Recon and monitor the sub-second Price Discovery Curve.',
                      link: '/terminal',
                      linkLabel: 'Select a Node'
                    },
                  ].map((item) => (
                    <div key={item.id} className="relative group bg-white/[0.02] border border-white/5 p-5 rounded-2xl text-left">
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
                      <Button variant="outline" size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest border-white/10 hover:bg-primary/10 hover:text-primary gap-2" asChild>
                        <Link href={item.link}>{item.linkLabel} <ArrowRight className="w-2.5 h-2.5" /></Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-3 text-left">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h4 className="text-sm font-black uppercase tracking-widest text-primary">Core Solution</h4>
                </div>
                <p className="text-xs font-bold leading-relaxed italic text-muted-foreground">
                  "The Discovery Protocol transforms raw probability moves into institutional intelligence. By following this pipeline, you eliminate emotional bias and execute based on verified multi-factor convergence."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-left">
            <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest opacity-40">
              <div className="flex items-center gap-1"><Cpu className="w-3 h-3" /> NODE_042</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> SYNC: OK</div>
            </div>
            <DialogClose asChild>
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-black text-[10px] uppercase h-10 px-8 rounded-none tracking-[0.2em] shadow-lg shadow-primary/20"
                onClick={handleAcknowledge}
              >
                INITIALIZE DISCOVERY
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