
'use client';

import { Button } from '@/components/ui/button';
import { ShieldCheck, UserPlus, BookCopy } from 'lucide-react';
import Link from 'next/link';

export function TerminalFooter() {
  return (
    <div className="h-16 bg-[#1A1D23] border-t border-[#2A2D35] px-6 flex items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.5)] z-20">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Public Ledger Active
          </span>
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Timestamped signals • Unit PnL • Real-time transparency</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2 border-[#2A2D35]" asChild>
          <Link href="/ledger">
            <BookCopy className="w-3.5 h-3.5" /> Open Full Ledger
          </Link>
        </Button>
        <Button variant="default" className="h-10 text-[10px] font-black uppercase tracking-widest gap-2 px-6 shadow-lg shadow-primary/20" asChild>
          <Link href="/login?tab=signup">
            <UserPlus className="w-3.5 h-3.5" /> Create Free Account
          </Link>
        </Button>
      </div>
    </div>
  );
}
