'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  ShieldCheck, 
  BrainCircuit, 
  Globe, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  Target,
  Activity,
  Cpu,
  Terminal,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  {
    title: "Welcome to PI-Pro",
    description: "Establishing link to the global intelligence substrate. This terminal provides deterministic alpha for prediction markets.",
    icon: Terminal,
    color: "text-primary",
    content: (
      <div className="space-y-4">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Predictive Insights Pro is a hybrid AI-deterministic terminal. We normalize data from Polymarket and Kalshi into a single, actionable discovery matrix.
        </p>
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg italic text-[10px]">
          "Intelligence is the ability to adapt to change. Alpha is the ability to predict it."
        </div>
      </div>
    )
  },
  {
    title: "Step 01: Discover",
    description: "Identify volume leaders and trending narratives.",
    icon: Globe,
    color: "text-primary",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Use the <strong>Markets</strong> page to scan 1,400+ nodes. Look for "Hot Clusters" where activity is high but pricing is still inefficient.</p>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[8px] uppercase">Politics</Badge>
          <Badge variant="outline" className="text-[8px] uppercase">Crypto</Badge>
          <Badge variant="outline" className="text-[8px] uppercase">Macro</Badge>
        </div>
      </div>
    )
  },
  {
    title: "Step 02: Verify",
    description: "Trust the math, not the sentiment.",
    icon: ShieldCheck,
    color: "text-accent",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Browse the <strong>Public Ledger</strong>. Every signal we issue is immutable. Verify our Brier Score and win-rate benchmarks before committing to an audit.</p>
        <Badge className="bg-accent text-accent-foreground text-[9px] font-black uppercase tracking-widest">
          Target Brier: &lt; 0.150
        </Badge>
      </div>
    )
  },
  {
    title: "Step 03: Observe",
    description: "Monitor live probability discovery.",
    icon: Activity,
    color: "text-primary",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">Launch the <strong>Terminal</strong> to watch real-time price discovery curves. Use the TQS Scalar to identify the precise moment of conviction (θ_bet).</p>
        <div className="flex items-center gap-2 text-accent font-mono text-[10px] font-black">
          <Zap className="w-3 h-3 fill-current" /> THETA_BET CROSSING: 0.020
        </div>
      </div>
    )
  },
  {
    title: "The 16 Indicators",
    description: "The mathematical substrate of our engine.",
    icon: BrainCircuit,
    color: "text-primary",
    content: (
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground">We analyze 16 unique dimensions including <strong>SPS</strong> (Structural Pressure), <strong>CCI</strong> (Confidence), and <strong>MIS</strong> (Inefficiency).</p>
        <div className="grid grid-cols-3 gap-1">
          {['SPS', 'CCI', 'EVS', 'MIS', 'LQS', 'TVS'].map(s => (
            <div key={s} className="bg-white/5 p-1 rounded text-center text-[8px] font-black">{s}</div>
          ))}
          <div className="col-span-3 text-center text-[7px] text-muted-foreground mt-1 uppercase font-bold">+10 MORE PRO SCALARS</div>
        </div>
      </div>
    )
  },
  {
    title: "Protocol Ready",
    description: "Your terminal connection is fully initialized.",
    icon: Zap,
    color: "text-accent",
    content: (
      <div className="space-y-4">
        <p className="text-xs text-muted-foreground">Complete the protocol by reviewing the <strong>Docs</strong>. You are now authorized to begin your first Alpha Journey.</p>
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-accent" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-accent">Protocol Link Established</span>
            <span className="text-[8px] font-bold text-accent/60">Status: NOMINAL</span>
          </div>
        </div>
      </div>
    )
  }
];

export function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const isComplete = typeof window !== 'undefined' ? localStorage.getItem('pip_onboarding_complete') : 'true';
    if (!isComplete) {
      const timer = setTimeout(() => setOpen(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('pip_onboarding_complete', 'true');
    setOpen(false);
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px] bg-[#0A0C12] border-white/10 text-foreground shadow-2xl p-0 overflow-hidden">
        <div className="p-8 space-y-8">
          <DialogHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <div className={cn("p-2 rounded border transition-all duration-500 bg-white/5 border-white/10", step.color)}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1">
                {STEPS.map((_, i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "h-1 rounded-full transition-all duration-500",
                      i === currentStep ? "w-6 bg-primary" : "w-2 bg-white/10"
                    )} 
                  />
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <DialogTitle className="text-2xl font-black font-headline uppercase italic tracking-tighter">
                {step.title}
              </DialogTitle>
              <DialogDescription className="text-[10px] font-bold uppercase tracking-widest text-primary/60">
                Onboarding Protocol Step {currentStep + 1} of {STEPS.length}
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="min-h-[140px] animate-in fade-in slide-in-from-right-4 duration-500">
            <p className="text-sm font-bold leading-relaxed mb-4 text-foreground/90">
              {step.description}
            </p>
            {step.content}
          </div>

          <DialogFooter className="flex-row items-center justify-between gap-4 border-t border-white/5 pt-6 sm:justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="text-[9px] font-black uppercase tracking-widest h-9 px-4 hover:bg-white/5 disabled:opacity-0"
            >
              <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
            </Button>
            
            <div className="flex gap-2">
              {currentStep < STEPS.length - 1 ? (
                <Button 
                  onClick={handleNext}
                  className="h-9 px-6 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20"
                >
                  Continue <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  className="h-9 px-8 text-[10px] font-black uppercase tracking-widest gap-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/20"
                >
                  Initiate Discovery <Zap className="w-3.5 h-3.5 fill-current" />
                </Button>
              )}
            </div>
          </DialogFooter>
        </div>
        
        <div className="h-1 bg-white/5 flex">
          <div 
            className="h-full bg-primary transition-all duration-1000" 
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
