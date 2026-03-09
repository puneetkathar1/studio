
'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Globe, Clock, Activity } from 'lucide-react';

export function TerminalHeader({ status, latency }: { status: 'LIVE' | 'OFFLINE', latency: number }) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time and start interval only after hydration to avoid mismatches
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-10 bg-[#0B0E14] border-b border-[#2A2D35] px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded flex items-center justify-center text-primary-foreground font-black text-xs">P</div>
          <span className="text-xs font-black tracking-tighter uppercase">Predictive<span className="text-primary">Insights</span></span>
        </div>
        <div className="h-4 w-px bg-[#2A2D35]" />
        <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">LIVE LEDGER (FREE)</span>
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <Clock className="w-3 h-3" />
        <span className="text-[11px] font-mono tabular-nums">
          {time ? time.toISOString().slice(11, 19) : '--:--:--'} UTC
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Activity className="w-3 h-3 text-muted-foreground" />
          <span className="text-[9px] uppercase font-bold text-muted-foreground">Latency</span>
          <span className="text-[11px] font-mono tabular-nums text-foreground">{latency}ms</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", status === 'LIVE' ? "bg-accent shadow-[0_0_8px_hsl(var(--accent))]" : "bg-destructive")} />
          <span className={cn("text-[9px] uppercase font-black tracking-widest", status === 'LIVE' ? "text-accent" : "text-destructive")}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
}
