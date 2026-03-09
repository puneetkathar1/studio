'use client';

/**
 * @fileOverview Institutional Pro Audit Guide.
 * Provides a high-intensity green dialog explaining the Pro Audit logic and workflow.
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
  Scale, 
  BrainCircuit,
  History,
  Terminal,
  Crosshair,
  ShieldAlert,
  Skull
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ProAuditGuide() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Protocol Handshake Verified',
      description: 'Pro Audit methodology briefing acknowledged. Compliance status: NOMINAL.',
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
              Pro Audit Protocol <br />
              Briefing.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: UNIFIED_STANCE_V4 • AUDIT_LEVEL: ABSOLUTE
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Pro Audit Page (/pro-audit) functions as the institutional accountability layer of the platform. Its primary purpose is to pull back the curtain on the AI Stance Engine and provide mathematical proof that signals are calibrated, high-integrity, and free of mechanical whale manipulation.
                </p>
              </div>

              <section className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] border-b border-black/10 pb-2 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Functional Breakdown
                </h3>
                
                <div className="space-y-8">
                  {[
                    { 
                      id: '01', 
                      title: 'Behavioral Mode Audit', 
                      icon: ShieldAlert,
                      desc: 'The 16-indicator engine now includes a "Behavioral Dimension." It audits the mechanical vs. informational density of every signal. Signals issued in 🔴 Whale-Dominated clusters are flagged as "Toxic Flow" in the audit journey.',
                      sub: '• Dimension: Detected intent (Impact, Absorber, Pinning, Thin-Push).'
                    },
                    { 
                      id: '02', 
                      title: 'The Alpha Momentum Engine', 
                      icon: TrendingUp,
                      desc: 'The chart tracks "Live Alpha Momentum" by scanning the publicLedger. It proves the cumulative profit of the engine using a standardized 1-unit stake model, excluding inhibited WAIT signals.' 
                    },
                    { 
                      id: '03', 
                      title: 'Intelligence Balance (Radar Audit)', 
                      icon: RadarIcon,
                      desc: 'The radar chart visualizes the Multi-Factor Convergence. Professional users check this to see if the current alpha regime is driven by Structural Pressure (SPS) or Informational Discovery.',
                      sub: '• SPS Dominance: Suggests high-volume capital flow/Whale presence.'
                    },
                    { 
                      id: '04', 
                      title: 'Calibration Metrics (Brier Score)', 
                      icon: Target,
                      desc: 'The industry-standard Brier Score measures probabilistic precision. The Pro Audit proves that the engine is winning for the right reasons by comparing predicted probability against verified finality.',
                      sub: '• Target < 0.150: Proving predictive authority over consensus.'
                    },
                    { 
                      id: '05', 
                      title: 'Live Thesis Drift Monitor', 
                      icon: Activity,
                      desc: 'Monitors stability across Thesis Stability, Model Entropy, and Orderbook Depth. If entropy moves to MONITOR, the system identifies a regime shift requiring re-calibration.'
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
                  <Crosshair className="w-4 h-4" /> Recommended Workflow
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { step: '01', label: 'INTEGRITY AUDIT', icon: Skull, desc: 'Daily check of the "Live Thesis Drift". If Toxic Flow percentage is increasing, tighten execution parameters and reduce unit stake sizing.' },
                    { step: '02', label: 'REGIME ALIGNMENT', icon: History, desc: 'Review the Alpha Momentum Chart. Trust the current math weights only if the Equity Curve exhibits positive cumulative drift.' },
                    { step: '03', label: 'INDICATOR BALANCE', icon: Scale, desc: 'Analyze the Radar Audit. If LQS (Liquidity Quality) is trending lower, prepare for increased slippage regardless of alpha basis.' },
                    { step: '04', label: 'DIAGNOSTIC TRACE', icon: Target, desc: 'When θ_bet crosses, click the stream to open the Quant Audit. Verify the Behavioral Mode is "Informational" before executing.' },
                    { step: '05', label: 'BENCHMARK PERFORMANCE', icon: ShieldCheck, desc: 'Compare platform Brier Score vs. your Personal Audit. Accountability is the primary substrate of alpha capture.' },
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
                  "The Pro Audit transforms probabilistic AI signals into verifiable mathematical performance. Use it to confirm the terminal is winning for the right reasons."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Audit SOP v4.2</span>
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

function RadarIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19.07 4.93a10 10 0 0 0-14.14 0" />
      <path d="M16.24 7.76a6 6 0 0 0-8.48 0" />
      <circle cx="12" cy="12" r="1" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m19.07 19.07-1.41-1.41" />
      <path d="m6.34 6.34-1.41-1.41" />
      <path d="m17.66 6.34 1.41-1.41" />
      <path d="m4.93 19.07 1.41-1.41" />
    </svg>
  )
}
