'use client';

import { 
  BrainCircuit, 
  Zap, 
  ShieldAlert, 
  ArrowRight,
  TrendingUp,
  Target,
  Scale,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ScrollIlluminatedIcon } from './ScrollIlluminatedIcon';

const ARCHETYPES = [
  {
    id: 'analyst',
    role: 'The Quantitative Analyst',
    protocol: 'Quant Audit Protocol',
    desc: 'Deep-dive into the 16-indicator engine. Verify model calibration, Brier Score precision, and multi-factor convergence nodes.',
    href: '/pro-audit',
    icon: BrainCircuit,
    color: 'text-primary',
    accent: 'border-primary/20 bg-primary/5',
    metric: 'Brier < 0.150',
    metricLabel: 'Precision Target',
    type: 'primary'
  },
  {
    id: 'arbitrageur',
    role: 'The High-Frequency Arbitrageur',
    protocol: 'Arb Matrix Protocol',
    desc: 'Execute deterministic venue decoupling. Lock in Δ-basis spreads between decentralized and regulated protocols with 12ms sync.',
    href: '/pro-champion',
    icon: Zap,
    color: 'text-accent',
    accent: 'border-accent/20 bg-accent/5',
    metric: 'Δ > 2.0c',
    metricLabel: 'Arb Opportunity',
    type: 'accent'
  },
  {
    id: 'risk-manager',
    role: 'The Risk Manager',
    protocol: 'Guardrail Protocol',
    desc: 'Establish hard logic constraints to inhibit mechanical risk. Soft-block impulsive entries and enforce total process integrity.',
    href: '/guardrails',
    icon: ShieldAlert,
    color: 'text-destructive',
    accent: 'border-destructive/20 bg-destructive/5',
    metric: '95%+',
    metricLabel: 'Discipline Score',
    type: 'destructive'
  }
];

export function ArchetypePathways() {
  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-3xl lg:text-5xl font-black font-headline tracking-tighter uppercase italic">
          What is your <span className="text-primary">Role</span>?
        </h2>
        <p className="text-muted-foreground text-sm font-medium uppercase tracking-[0.2em]">
          Select your specialized execution pathway
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARCHETYPES.map((role) => (
          <div 
            key={role.id}
            className={cn(
              "p-8 border rounded-3xl flex flex-col gap-6 transition-all duration-500 hover:scale-[1.02] shadow-2xl relative overflow-hidden group",
              role.accent
            )}
          >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <role.icon className="w-32 h-32" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <ScrollIlluminatedIcon color={role.type as any} className="p-2">
                  <role.icon className="w-6 h-6" />
                </ScrollIlluminatedIcon>
                <Badge variant="outline" className="text-[8px] font-black uppercase border-white/10 opacity-60">
                  {role.protocol}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-black uppercase italic tracking-tighter">{role.role}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {role.desc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5 relative z-10">
              <div className="space-y-1">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{role.metricLabel}</span>
                <div className={cn("text-lg font-black font-mono", role.color)}>{role.metric}</div>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Authority</span>
                <div className="flex items-center justify-end gap-1 text-[10px] font-bold">
                  <ShieldCheck className={cn("w-3 h-3", role.color)} /> Verified
                </div>
              </div>
            </div>

            <Button 
              className="mt-auto h-12 w-full text-[10px] font-black uppercase tracking-widest gap-2 shadow-lg group-hover:translate-y-[-2px] transition-transform" 
              asChild
            >
              <Link href={role.href}>
                Launch {role.id.split('-').join(' ')} Protocol <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
