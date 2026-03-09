'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LogOut, 
  Settings, 
  Activity, 
  ChevronDown,
  Globe,
  Zap,
  ShieldCheck,
  Lock,
  Cpu,
  Star,
  Monitor,
  Scale,
  BrainCircuit,
  TrendingUp,
  Fingerprint
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth, useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { signOut } from 'firebase/auth'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useUserProfile } from '@/firebase/auth/use-user-profile'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import { PublicLedgerEntry } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

function NavTicker() {
  const firestore = useFirestore();
  const ledgerQuery = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'publicLedger'), orderBy('tsIssued', 'desc'), limit(10)) : null,
    [firestore]
  );
  const { data: entries } = useCollection<PublicLedgerEntry>(ledgerQuery);

  if (!entries || entries.length === 0) return null;

  // Double items for seamless loop
  const tickerItems = [...entries, ...entries];

  return (
    <div className="absolute inset-0 flex items-center overflow-hidden pointer-events-none opacity-5">
      <div className="flex animate-ticker-infinite whitespace-nowrap">
        {tickerItems.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex items-center gap-2 px-12 text-[7px] font-black uppercase tracking-[0.3em] text-muted-foreground">
            <span className="text-primary">{item.venue}</span>
            <span className="text-foreground truncate max-w-[120px]">{item.marketTitle}</span>
            <span className={cn(item.stance === 'BET' ? "text-accent" : "text-destructive")}>
              {item.stance} {item.evEst > 0 ? `+${item.evEst.toFixed(3)}` : item.evEst.toFixed(3)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopNav() {
  const pathname = usePathname()
  const { user, isUserLoading } = useUser()
  const { data: profile } = useUserProfile()
  const auth = useAuth()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const plan = profile?.plan || 'free';
  const isPro = plan === 'pro' || plan === 'internal';
  const isInst = plan === 'internal';

  // Render a stable shell on server + first client pass to avoid hydration
  // mismatches when browser extensions mutate anchor attributes pre-hydration.
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden" suppressHydrationWarning>
        <div className="max-w-[1600px] mx-auto relative px-4 py-2" suppressHydrationWarning>
          <div className="h-[3.5rem] rounded border border-white/5 bg-background/40" />
        </div>
      </nav>
    );
  }

  const navGroups = [
    {
      label: 'DISCOVERY',
      icon: Globe,
      tier: 'FREE',
      items: [
        { href: '/markets', label: 'Markets Feed' },
        { href: '/knowledge-sphere', label: 'Knowledge Sphere' },
        { href: '/ledger', label: 'Public Ledger' },
        { href: '/dashboard', label: 'System Dashboard' },
      ]
    },
    {
      label: 'INTELLIGENCE',
      icon: Zap,
      tier: 'PRO',
      items: [
        { href: '/alpha-stream', label: 'Alpha Stream', req: 'pro' },
        { href: '/terminal-pro', label: 'Intelligence Terminal', req: 'pro' },
        { href: '/whale-matrix', label: 'Whale Matrix', req: 'pro' },
        { href: '/macro-lab', label: 'Macro Lab', req: 'pro' },
      ]
    },
    {
      label: 'QUANT+',
      icon: BrainCircuit,
      tier: 'INST',
      items: [
        { href: '/quant-plus', label: 'GAD Landing', req: 'inst' },
        { href: '/quant-plus/terminal', label: 'GAD Terminal', req: 'inst' },
        { href: '/quant-plus/backtest', label: 'GAD Backtest', req: 'inst' },
        { href: '/quant-plus/audit', label: 'GAD State Audit', req: 'inst' },
      ]
    },
    {
      label: 'PROTOCOLS',
      icon: ShieldCheck,
      tier: 'INST',
      items: [
        { href: '/pro-champion', label: 'Arb Matrix', req: 'inst' },
        { href: '/guardrails', label: 'Trade Guardrails', req: 'pro' },
        { href: '/execution-lab', label: 'Execution Lab', req: 'pro' },
        { href: '/portfolio', label: 'Portfolio Audit' },
        { href: '/docs', label: 'System Briefing' },
      ]
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast({ 
        variant: 'protocol',
        title: 'Protocol Terminated', 
        description: 'Access node disconnected.' 
      })
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error disconnecting node' })
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden" suppressHydrationWarning>
      <div className="max-w-[1600px] mx-auto relative" suppressHydrationWarning>
        <NavTicker />
        
        <div className="flex h-auto min-h-[3.5rem] items-center px-4 relative z-10 py-2">
          {/* BRAND NODE */}
          <Link href="/" className="flex items-center gap-3 group shrink-0 mr-4" prefetch={false}>
            <div className="flex aspect-square w-8 items-center justify-center rounded bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
              P
            </div>
            <div className="hidden xs:flex flex-col leading-none">
              <span className="font-headline font-bold tracking-tighter text-xs uppercase text-foreground">
                PREDICTIVE<span className="text-primary">INSIGHTS</span>
              </span>
              <span className="text-[7px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-0.5">Terminal v4.2</span>
            </div>
          </Link>

          <div className="h-8 w-px bg-white/5 mx-2 hidden lg:block" />

          {/* NAVIGATION GATEWAYS - WRAPPING ENABLED */}
          <div className="flex-1 flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            {navGroups.map((group) => {
              const hasActiveChild = group.items.some(item => pathname.startsWith(item.href));
              const isQuantGroup = group.label === 'QUANT+';
              
              return (
                <DropdownMenu key={group.label}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={cn(
                        "h-9 px-3 gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                        hasActiveChild 
                          ? (isQuantGroup ? "text-[#A855F7] bg-[#A855F7]/5" : "text-primary bg-primary/5") 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <group.icon className={cn("w-3.5 h-3.5", hasActiveChild ? (isQuantGroup ? "text-[#A855F7]" : "text-primary") : "text-muted-foreground/40")} />
                      <span>{group.label}</span>
                      <ChevronDown className="w-3 h-3 opacity-20" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-[#0A0C12] border-white/10 shadow-2xl p-2" align="center">
                    <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                      <span className="text-[8px] font-black uppercase text-muted-foreground tracking-[0.3em]">
                        {group.label}
                      </span>
                      <Badge variant="outline" className={cn(
                        "text-[7px] font-black px-1.5 h-4 border-none uppercase",
                        group.tier === 'PRO' ? "bg-accent/10 text-accent" : 
                        group.tier === 'INST' ? "bg-primary/10 text-primary" : 
                        "bg-white/5 text-muted-foreground"
                      )}>
                        {group.tier}
                      </Badge>
                    </div>
                    <DropdownMenuSeparator className="bg-white/5" />
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;
                      const isRestricted = (item.req === 'pro' && !isPro) || (item.req === 'inst' && !isInst);
                      
                      return (
                        <DropdownMenuItem 
                          key={item.href} 
                          asChild
                          disabled={isRestricted}
                          className={cn(
                            "h-9 rounded-md cursor-pointer text-[10px] font-bold uppercase tracking-widest focus:bg-primary/10",
                            isActive && (isQuantGroup ? "text-[#A855F7] bg-[#A855F7]/5" : "text-primary bg-primary/5"),
                            isRestricted && "opacity-30 grayscale"
                          )}
                        >
                          <Link href={item.href} className="w-full flex justify-between items-center" prefetch={false}>
                            {item.label}
                            {isRestricted && (
                              item.req === 'inst' ? <Cpu className="w-2.5 h-2.5 ml-2" /> : <Lock className="w-2.5 h-2.5 ml-2" />
                            )}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </div>

          <div className="h-8 w-px bg-white/5 mx-2 hidden lg:block" />

          {/* USER & SYSTEM HUD */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {!isUserLoading && (
              user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 px-2 rounded-lg border border-white/10 hover:bg-white/5 flex items-center gap-2">
                      <Avatar className="h-6 w-6 border border-primary/20">
                        <AvatarImage src={profile?.photoURL || user.photoURL || ''} />
                        <AvatarFallback className="bg-[#0A0C12] text-[10px] font-black text-primary">
                          {(profile?.displayName || user.email)?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-3 h-3 text-muted-foreground opacity-40" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 border-white/10 bg-[#0A0C12] shadow-2xl p-2">
                    <DropdownMenuLabel className="px-3 py-2">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest truncate">{user.email}</span>
                        <div className="flex items-center gap-2">
                          <Badge className={cn(
                            "text-[7px] font-black uppercase px-1.5 h-4",
                            isInst ? "bg-primary text-primary-foreground" : 
                            isPro ? "bg-accent text-accent-foreground" : 
                            "bg-muted text-muted-foreground"
                          )}>
                            {plan.toUpperCase()}
                          </Badge>
                          <span className="text-[7px] font-bold text-muted-foreground uppercase">NODE_AUTHORIZED</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem asChild className="rounded-md h-10 px-3 cursor-pointer gap-3 text-[10px] font-bold uppercase tracking-widest focus:bg-primary/10">
                      <Link href="/settings" prefetch={false}><Settings className="w-4 h-4 text-primary" /> Node Identity</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-md h-10 px-3 cursor-pointer gap-3 text-[10px] font-bold uppercase tracking-widest focus:bg-primary/10">
                      <Link href="/portfolio" prefetch={false}><Activity className="w-4 h-4 text-primary" /> Performance Audit</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5" />
                    <DropdownMenuItem onClick={handleLogout} className="rounded-md h-10 px-3 cursor-pointer gap-3 text-destructive text-[10px] font-bold uppercase tracking-widest focus:bg-destructive/10">
                      <LogOut className="mr-2 h-4 w-4" /> Disconnect Node
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <Button size="sm" asChild className="h-9 text-[9px] font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 border-0 px-4">
                    <Link href="/login?tab=signup" prefetch={false}>Initialize</Link>
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
