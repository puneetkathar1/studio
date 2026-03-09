'use client';

/**
 * @fileOverview Institutional Performance Ledger SOP.
 * Provides a high-intensity professional dialog explaining the historical audit logic 
 * and Zero-Knowledge Proof protocol.
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
  Database,
  Lock,
  BarChart3,
  Cpu,
  Terminal,
  Crosshair,
  History,
  Clock,
  Waves,
  Search,
  BrainCircuit,
  Skull,
  Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function PerformanceLedgerSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Audit Protocol Handshake Verified',
      description: 'Performance Ledger & ZK-Proof methodology briefing acknowledged.',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="secondary" 
          className="h-8 gap-2 bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-accent/20 border-0"
        >
          <BookOpen className="w-3.5 h-3.5" /> View Ledger SOP
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
              Performance Ledger <br />
              & ZK-Audit Proofs.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: IMMUTABLE_AUDIT_V4 • AUDIT_LEVEL: ABSOLUTE
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Performance Ledger (/ledger) is the platform's immutable record of authority. It utilizes **Zero-Knowledge Audit Proofs** to prove that every signal was issued in real-time based on deterministic multi-factor convergence, eliminating the possibility of back-filling or tampering.
                </p>
              </div>

              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Cryptographic Standards
                </h3>
                
                <div className="space-y-8">
                  {[
                    { 
                      id: '01', 
                      title: 'Zero-Knowledge Audit Proofs', 
                      icon: Fingerprint,
                      desc: 'Every signal is hashed to the ledger the microsecond the θ_bet threshold is crossed. These proofs allow institutional users to verify the integrity of the data without exposing proprietary model weights.',
                      sub: '• Proof Basis: Unique hash 0x... committed to decentralized consensus.'
                    },
                    { 
                      id: '02', 
                      title: 'Oracle Consensus Quorum', 
                      icon: ShieldCheck,
                      desc: 'A 12-node geographically distributed quorum must confirm the venue state before a signal is finalized. This prevents "Selective Reporting" and ensures absolute mathematical finality.' 
                    },
                    { 
                      id: '03', 
                      title: 'Standardized Unit Model', 
                      icon: TrendingUp,
                      desc: 'PnL is calculated using a standardized 1-unit stake. This isolates the raw "Edge" from bankroll management, proving the platform\'s structural predictive authority.',
                      sub: '• Formula: PnL = (Final_Payout - Stake_Price) / Stake_Price'
                    },
                    { 
                      id: '04', 
                      title: 'Calibration Audit (Brier)', 
                      icon: Target,
                      desc: 'The Ledger calculates a rolling Brier Score to measure probabilistic precision. This proves the terminal is winning for the right reasons by comparing forecasted bands to outcomes.',
                      sub: '• Platform Target: < 0.150 (Institutional Precision).'
                    },
                    { 
                      id: '05', 
                      title: 'The Mirror of Truth', 
                      icon: Skull,
                      desc: 'The Ledger includes "Inhibited Nodes"—situations where the engine correctly avoided BET signals in mechanical whale traps. This proves the value of our Behavioral Inhibition logic.'
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
                  <History className="w-4 h-4" /> Professional Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'AUTHORITY CHECK', icon: Lock, desc: 'Review the "Aggregate PnL" and "Avg Win Rate" cards. These represent the platform\'s verified performance since protocol launch.' },
                    { step: '02', label: 'VERIFY AUDIT PROOF', icon: Fingerprint, desc: 'Expand any ledger entry and click "Verify Audit Proof". This performs a sub-second cryptographic check against the oracle quorum.' },
                    { step: '03', label: 'SECTOR ATTRIBUTION', icon: BarChart3, desc: 'Analyze the "Sector Accuracy" chart. Prioritize execution in categories where the engine exhibits the highest informational density.' },
                    { step: '04', label: 'SIGNAL TRACING', icon: Waves, desc: 'For unresolved signals, enter the "Audit Journey" to track real-time price discovery and target convergence progress.' },
                    { step: '05', label: 'BENCHMARKING', icon: Target, desc: 'Compare the platform\'s Brier Score precision against your personal portfolio audit to refine your own predictive calibration.' },
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
                  "In prediction markets, trust is built on math, not narrative. The ZK-Audit protocol ensures that our performance data is a verifiable mathematical constant."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Ledger SOP v4.2</span>
            <DialogClose asChild>
              <Button 
                className="bg-black text-accent hover:bg-black/90 font-black text-[10px] uppercase h-10 px-8 rounded-none tracking-widest"
                onClick={handleAcknowledge}
              >
                AUTHORIZE AUDIT
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
