'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface ProtocolStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  nextStepLabel: string;
  nextStepHref: string;
  icon: LucideIcon;
  className?: string;
}

export function ProtocolStep({
  step,
  totalSteps,
  title,
  description,
  nextStepLabel,
  nextStepHref,
  icon: Icon,
  className
}: ProtocolStepProps) {
  return (
    <div className={cn(
      "p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4 relative overflow-hidden group",
      className
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <Icon className="w-24 h-24 text-primary" />
      </div>
      
      <div className="flex items-center gap-3 relative z-10">
        <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase px-2 py-0.5">
          STEP {step.toString().padStart(2, '0')} / {totalSteps.toString().padStart(2, '0')}
        </Badge>
        <div className="h-px flex-1 bg-primary/20" />
      </div>

      <div className="space-y-2 relative z-10">
        <h3 className="text-lg font-black uppercase italic tracking-tighter text-primary">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground font-medium leading-relaxed max-w-md">
          {description}
        </p>
      </div>

      <div className="pt-2 relative z-10">
        <Button size="sm" className="h-9 px-6 text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg shadow-primary/20" asChild>
          <Link href={nextStepHref}>
            {nextStepLabel} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
