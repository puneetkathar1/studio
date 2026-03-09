'use client';

/**
 * @fileOverview Institutional Portfolio SOP.
 * Provides a high-intensity professional dialog explaining the personal performance audit 
 * and the Portfolio EV Monitor risk aggregation logic.
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
  Briefcase,
  Fingerprint,
  Crosshair,
  History,
  Terminal,
  Scale,
  BrainCircuit,
  Waves,
  Skull,
  PieChart,
  Layers,
  DollarSign,
  ShieldAlert as LucideShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function PortfolioSOP() {
  const { toast } = useToast();

  const handleAcknowledge = () => {
    toast({
      title: 'Protocol Handshake Verified',
      description: 'Portfolio Risk & Performance briefing acknowledged. Compliance status: NOMINAL.',
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
              Portfolio & Risk <br />
              Audit Protocol.
            </DialogTitle>
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mt-2">
              PROTOCOL: RISK_AGGREGATION_V4 • AUDIT_LEVEL: ABSOLUTE
            </div>
          </DialogHeader>

          <ScrollArea className="h-[500px] pr-6 custom-scrollbar-black">
            <div className="space-y-10">
              <div className="space-y-4">
                <p className="text-sm font-bold leading-relaxed border-l-4 border-black pl-4">
                  The Portfolio Node (/portfolio) is the platform's professional accountability and risk management substrate. It transitions you from "Bet-by-bet gambling" to "Portfolio-level probabilistic management" by aggregating Expected Value (EV) and detecting hidden narrative correlations.
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
                      title: 'Portfolio EV Aggregator', 
                      icon: DollarSign,
                      desc: 'Calculates the total expected edge across all open positions. It compares your Entry Price (P_entry) to the real-time Model Probability (P_model) derived from the TQS engine.',
                      sub: '• Formula: EV_total = Σ (EV_unit × Position_Size)'
                    },
                    { 
                      id: '02', 
                      title: 'Correlation Adjustment', 
                      icon: Layers,
                      desc: 'Identifies "False Diversification". If multiple positions share the same underlying event or narrative category, the engine applies a Concentration Factor to penalize effective EV.',
                      sub: '• Insight: Prevents overexposure to a single point of failure.'
                    },
                    { 
                      id: '03', 
                      title: 'Stress Scenario Loss', 
                      icon: Skull,
                      desc: 'Models the impact of a thematic collapse. It simulates the drawdown percentage if your largest correlated narrative group (e.g., "Politics") fails simultaneously.',
                      sub: '• Goal: Visualize the downside of narrative clustering.'
                    },
                    { 
                      id: '04', 
                      title: 'Predictive Precision (Brier Score)', 
                      icon: Target,
                      desc: 'Measures your personal "calibration". It tracks how closely your entry probabilities align with final venue settlement outcomes.',
                      sub: '• Target: < 0.150. Lower scores indicate institutional-grade accuracy.'
                    },
                    { 
                      id: '05', 
                      title: 'Regime Concentration Audit', 
                      icon: PieChart,
                      desc: 'Visualizes capital allocation across market sectors (Event-Driven, Macro, High-Entropy). Used to verify if you are running a rational, diversified matrix.'
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
                    { step: '01', label: 'BASIS LOGGING', icon: Crosshair, desc: 'Record your exact fill price via "Log Personal Entry". This initializes the EV tracking for that specific node.' },
                    { step: '02', label: 'EV MONITORING', icon: TrendingUp, desc: 'Review your Portfolio EV Return. If it is shrinking while market prices are stable, your "Edge" is decaying.' },
                    { step: '03', label: 'CORRELATION CHECK', icon: CustomShieldAlert, desc: 'If Correlation Risk is 🔴 High, identify overlapping event drivers and reduce position sizing to re-balance the matrix.' },
                    { step: '04', label: 'STRESS AUDIT', icon: Activity, desc: 'Review the "Stress Scenario Loss". Ensure your current drawdown exposure is within your institutional risk parameters.' },
                    { step: '05', label: 'CALIBRATION REFINEMENT', icon: ShieldCheck, desc: 'Benchmark your Brier Score against the platform. Use sector attribution to find categories where your precision is highest.' },
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
                  "Individual signals win battles; portfolio risk management wins wars. Use the EV Aggregator to ensure your capital is working for your Edge, not your Biases."
                </p>
              </div>
            </div>
          </ScrollArea>

          <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">Predictive Insights Pro • Portfolio Audit SOP v4.2</span>
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

function CustomShieldAlert(props: any) {
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  )
}
