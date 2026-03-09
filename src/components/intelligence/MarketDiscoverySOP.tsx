'use client';

/**
 * @fileOverview Institutional Market Discovery SOP.
 * Provides a high-intensity professional dialog explaining the global matrix discovery logic.
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
  Search,
  Terminal,
  Crosshair,
  Waves,
  Cpu,
  Clock,
  Skull,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function MarketDiscoverySOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Protocol Handshake Verified',
      description: 'Market Discovery briefing acknowledged. Compliance status: NOMINAL.',
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
              Market Discovery <br />
              Protocol Briefing.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: GLOBAL_SWEEP_V4 • AUDIT_LEVEL: NOMINAL
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Market Discovery Node (/markets) is the platform's wide-angle monitoring environment. Its purpose is to harvest categorical liquidity and identify trending volume clusters across the entire prediction matrix, providing a breadth-first view of global sentiment shifts.
                </p>
              </div>

              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Operational Logic
                </h3>
                
                <div className="space-y-8">
                  {[
                    { 
                      id: '01', 
                      title: 'The Node Harvesting Engine', 
                      icon: Database,
                      desc: 'Discovery nodes are geographically distributed to harvest real-time ticks from decentralized (Polymarket) and regulated (Kalshi) protocols. This ensures sub-second normalization of diverse orderbook structures into a single unified matrix.' 
                    },
                    { 
                      id: '02', 
                      title: 'Categorical Sweep Protocol', 
                      icon: Layers,
                      desc: 'The engine automatically categorizes nodes using a multi-factor linguistic and meta-data parser. This allows professional users to isolate specific domains while identifying trending "Hot Clusters".',
                      sub: '• Sweep Depth: 1,482+ active nodes monitored concurrently.'
                    },
                    { 
                      id: '03', 
                      title: 'Behavioral Toxicity Filter', 
                      icon: ShieldAlert,
                      desc: 'The discovery matrix now labels every node with a behavioral risk status. This allows users to identify organic discovery nodes vs. whale-dominated clusters before deep-diving into the audit.',
                      sub: '• Risk Overlay: Low (🟢), Active (🟡), Toxic (🔴).'
                    },
                    { 
                      id: '04', 
                      title: 'Discovery Pulse Ingestion', 
                      icon: Activity,
                      desc: 'The "Recently Ingested" feed in the sidebar visualizes the optic-sync cycle. New contracts are added to the matrix within 12ms of venue discovery, ensuring users catch early-stage alpha.',
                      sub: '• Latency: 12ms Optic Sync (AES-256 Verified).'
                    },
                    { 
                      id: '05', 
                      title: 'Breadth Over Conviction', 
                      icon: Search,
                      desc: 'Unlike the Alpha Stream, the Discovery layer prioritizes breadth. It surfaces nodes across all risk profiles, allowing professionals to monitor the evolution of mechanical pinning events.'
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
                  <Crosshair className="w-4 h-4" /> Tactical Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'MATRIX SCAN', icon: Globe, desc: 'Use the Discovery Feed to identify volume leaders. Pay attention to the behavioral risk labels; prioritize 🟢 Low risk nodes for high-conviction alpha.' },
                    { step: '02', label: 'TOXICITY AUDIT', icon: Skull, desc: 'Avoid "Hot Clusters" that are 🔴 Whale-Dominated. These nodes are likely in a mechanical pinning regime where price discovery is artificial.' },
                    { step: '03', label: 'NODE ISOLATION', icon: Target, desc: 'Click any market to expand the "Price Discovery Curve". Verify that the orderbook depth supports your intended execution size.' },
                    { step: '04', label: 'ALERT INITIALIZATION', icon: Zap, desc: 'For markets in a WAIT status, set a custom θ_bet alert. This ensures you are notified the millisecond the node crosses into a high-conviction state.' },
                    { step: '05', label: 'EXECUTION HANDOFF', icon: TrendingUp, desc: 'Once a target is identified, use the "Launch Execution" button to open the Intelligence Terminal for real-time TQS-adjusted entry.' },
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
                  "Market Discovery is the wide-angle radar of the terminal. It identifies where the money is moving before the Stance Engine identifies why it is moving."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Discovery SOP v4.2</span>
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
