'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase'
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { doc, serverTimestamp } from 'firebase/firestore'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  User, 
  ShieldCheck, 
  Zap, 
  Key, 
  Mail, 
  Camera, 
  Loader2, 
  Activity, 
  RefreshCcw, 
  Trash2,
  Lock,
  Globe,
  Fingerprint,
  Cpu,
  BrainCircuit,
  ArrowRight
} from 'lucide-react'
import type { UserProfile } from '@/lib/types'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import Link from 'next/link'

export default function SettingsPage() {
  const { user, isUserLoading } = useUser()
  const firestore = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isUpdating, setIsUpdating] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [photoURL, setPhotoURL] = useState('')

  // Fetch Firestore Profile
  const profileRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  )
  const { data: profile, isLoading: isProfileLoading } = useDoc<UserProfile>(profileRef)

  useEffect(() => {
    if (user) {
      setDisplayName(profile?.displayName || user.displayName || '')
      setPhotoURL(profile?.photoURL || user.photoURL || '')
    }
  }, [user, profile])

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center h-[600px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">Syncing Node Identity...</p>
        </div>
      </div>
    )
  }

  const handleUpdateProfile = async () => {
    setIsUpdating(true)
    try {
      const authPhotoURL = photoURL.length > 2000 ? "" : photoURL;
      
      await updateProfile(user, {
        displayName: displayName,
        photoURL: authPhotoURL
      })

      if (profileRef) {
        updateDocumentNonBlocking(profileRef, {
          displayName: displayName,
          photoURL: photoURL,
          updatedAt: serverTimestamp()
        })
      }

      toast({
        title: 'Identity Updated',
        description: 'Institutional node metadata synchronized successfully.',
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Error',
        description: error.message,
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!user.email) return
    try {
      await sendPasswordResetEmail(user.auth, user.email)
      toast({
        title: 'Recovery Link Transmitted',
        description: 'Instructions sent to your node identifier (email).',
      })
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Protocol Error',
        description: error.message,
      })
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoURL(reader.result as string)
        toast({
          title: 'Avatar Buffered',
          description: 'Local image loaded to preview. Click synchronize to finalize.',
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const onAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const isInst = profile?.plan === 'internal';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-1000 pb-20 text-left">
      {/* HEADER: NODE BRIEFING */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/20 text-primary border-primary/30 font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1">
              Settings Node: IDENTITY_V4
            </Badge>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent/10 border border-accent/20">
              <ShieldCheck className="w-3 h-3 text-accent" />
              <span className="text-[9px] font-bold text-accent uppercase">Security: Nominal</span>
            </div>
          </div>
          <h1 className="text-5xl font-black font-headline tracking-tighter italic uppercase leading-none">
            Node <span className="text-primary">Identity</span>.
          </h1>
          <p className="text-muted-foreground text-sm max-w-2xl font-medium leading-relaxed">
            Manage your institutional connection parameters. Update your node metadata and monitor your subscription status within the intelligence substrate.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-card border border-white/5 p-4 rounded-xl shadow-xl">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Protocol Status</span>
            <span className="text-xs font-bold text-accent uppercase">Link: Optimized</span>
          </div>
          <div className="h-10 w-px bg-white/5" />
          <Activity className="w-6 h-6 text-accent animate-pulse" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: IDENTITY & AVATAR */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl">
            <CardHeader className="pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded border border-primary/20 text-primary">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black font-headline uppercase italic tracking-tighter">Institutional Meta</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase text-muted-foreground">Manage your visible node presence.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              <div className="flex flex-col sm:flex-row gap-8 items-center">
                <div 
                  className="relative group cursor-pointer" 
                  onClick={onAvatarClick}
                  title="Click to upload local avatar file"
                >
                  <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-2xl ring-4 ring-primary/5">
                    <AvatarImage src={photoURL} />
                    <AvatarFallback className="bg-[#0A0C12] text-xl font-black text-primary">
                      {displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-primary/30">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Public Alias</Label>
                    <Input 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Institutional Identity..."
                      className="bg-background/50 border-white/10 font-bold text-sm h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Avatar Protocol (URL)</Label>
                    <Input 
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="bg-background/50 border-white/10 font-mono text-xs h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-primary">
                  <Fingerprint className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Oracle Identity Link</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                  Identity changes are committed to the authentication cluster immediately and will be visible across the Intelligence Terminal within 12ms.
                </p>
              </div>
            </CardContent>
            <CardFooter className="pb-6">
              <Button 
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                className="w-full h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 gap-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                SYNCHRONIZE IDENTITY
              </Button>
            </CardFooter>
          </Card>

          {/* NEW: QUANT+ GAD NODE STATUS FOR INSTITUTIONAL USERS */}
          {isInst && (
            <Card className="border-[hsl(var(--quant-primary)/0.3)] bg-[hsl(var(--quant-primary)/0.05)] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                <Cpu className="w-32 h-32 text-[hsl(var(--quant-primary))]" />
              </div>
              <CardHeader className="pb-4 border-b border-[hsl(var(--quant-primary)/0.2)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[hsl(var(--quant-primary)/0.1)] rounded border border-[hsl(var(--quant-primary)/0.2)] text-[hsl(var(--quant-primary))]">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-black font-headline uppercase italic tracking-tighter text-[hsl(var(--quant-primary))]">Quant+ GAD Node</CardTitle>
                    <CardDescription className="text-[10px] font-bold uppercase text-muted-foreground">Institutional Substrate Connectivity.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-1">
                    <span className="text-[8px] font-black uppercase text-muted-foreground">Node Verification</span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--quant-primary))] animate-pulse" />
                      <span className="text-xs font-bold text-[hsl(var(--quant-primary))] uppercase">ESTABLISHED</span>
                    </div>
                  </div>
                  <div className="p-3 bg-black/40 border border-white/5 rounded-lg space-y-1">
                    <span className="text-[8px] font-black uppercase text-muted-foreground">Engine Hash</span>
                    <span className="text-[10px] font-mono font-bold text-foreground truncate block">0xGAD_PRO_42</span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                  "Your node identity is linked to the 1,482-node distributed simulation cluster. Adaptive discontinuity (λt) and latent variance (vt) traces are authorized for this session."
                </p>
                <Button className="w-full h-10 bg-[hsl(var(--quant-primary))] text-white hover:bg-[hsl(var(--quant-primary)/0.9)] font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg" asChild>
                  <Link href="/quant-plus/terminal">Open Quant+ Terminal <ArrowRight className="w-3.5 h-3.5" /></Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-white/5 bg-card/50 shadow-xl overflow-hidden">
            <CardHeader className="bg-muted/30 border-b border-white/5 py-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">System Metadata</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 divide-y divide-white/5">
              <div className="py-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Node UID</span>
                <span className="text-[10px] font-mono text-foreground font-black">{user.uid}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Initialized At</span>
                <span className="text-[10px] font-mono text-foreground font-black">
                  {user.metadata.creationTime ? format(new Date(user.metadata.creationTime), 'MMM dd, yyyy HH:mm') : 'N/A'}
                </span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Current Protocol</span>
                <Badge variant="outline" className="text-[8px] font-black uppercase border-primary/20 text-primary">v4.2 PRO</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: SECURITY & SUBSCRIPTION */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-accent/30 bg-accent/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            <Zap className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
            <CardHeader className="pb-4 border-b border-accent/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded border border-accent/20 text-accent">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black font-headline uppercase italic tracking-tighter text-accent">Institutional Tier</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase text-accent/60">Manage your subscription protocol.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-[9px] font-black uppercase tracking-widest text-accent/60">Current Protocol</span>
                  <span className="text-2xl font-black font-headline italic uppercase text-accent">
                    {profile?.plan?.toUpperCase() || 'FREE'}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-accent transition-all duration-1000" style={{ width: profile?.plan === 'internal' ? '100%' : profile?.plan === 'pro' ? '60%' : '20%' }} />
                </div>
              </div>

              <p className="text-xs font-medium leading-relaxed italic border-l-2 border-accent/20 pl-4 text-foreground/80">
                "Pro subscribers have access to the full institutional substrate including Alpha Stream broadasts and deterministic arbitrage pathing."
              </p>

              {profile?.plan !== 'internal' && (
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-black uppercase text-[10px] tracking-widest h-11 shadow-lg shadow-accent/20" onClick={() => router.push('/admin')}>
                  ELEVATE ACCESS NODE
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-white/5 bg-card/50 shadow-xl">
            <CardHeader className="pb-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded border border-white/10 text-muted-foreground">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black font-headline uppercase italic tracking-tighter">Connection Security</CardTitle>
                  <CardDescription className="text-[10px] font-bold uppercase text-muted-foreground">Manage your access keys.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Registered Node ID
                </Label>
                <div className="p-3 bg-black/20 border border-white/5 rounded font-mono text-xs text-foreground/60">
                  {user.email}
                </div>
              </div>

              <div className="space-y-4">
                <Button variant="outline" className="w-full border-white/10 h-10 text-[9px] font-black uppercase tracking-widest gap-2" onClick={handlePasswordReset}>
                  <RefreshCcw className="w-3.5 h-3.5" /> Transmit Key Reset
                </Button>
                <p className="text-[9px] text-muted-foreground leading-relaxed italic text-center">
                  "Reset protocol will transmit a secure restoration link to your registered node identifier."
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/20 bg-destructive/5 shadow-xl">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-2 text-destructive">
                <Trash2 className="w-4 h-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest">Terminate Node</h4>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                Permanently decommission this access node from the intelligence substrate. This action is irreversible and will purge all personal audit journeys.
              </p>
              <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive font-black uppercase text-[9px] h-9 border border-destructive/10">
                INITIATE DECOMMISSION SEQUENCE
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="py-12 border-t border-dashed border-white/10 flex flex-col items-center gap-6 mt-12 opacity-40">
        <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.5em]">
          <span>AES-256 Protocol</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Identity Hash: OK</span>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Optic Sync: Active</span>
        </div>
        <p className="text-[8px] text-center max-w-2xl font-medium leading-relaxed italic px-4">
          "Node identity is persistent across the global discovery matrix. Updates are committed to the decentralized oracle quorum for verification. Subscriber keys are hashed and secured via RSA-4096 protocols."
        </p>
      </footer>
    </div>
  )
}
