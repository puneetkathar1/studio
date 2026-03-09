'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { proFeedSignals } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Lock } from 'lucide-react'
import { useUser } from '@/firebase'

export default function ProFeedPage() {
  const { user, isUserLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/pro-feed')
    }
  }, [user, isUserLoading, router])

  if (isUserLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading & verifying access...</p>
      </div>
    )
  }

  // TODO: Check for pro subscription status from user object
  const isProSubscriber = true // Placeholder

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Pro Feed</h1>
        <p className="text-muted-foreground">
          Enhanced data and premium signals for paying subscribers.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {proFeedSignals.map((signal) => (
          <Card key={signal.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge>{signal.platform}</Badge>
                {signal.isPro && <Badge variant="secondary">PRO</Badge>}
              </div>
              <CardTitle className="pt-2 font-headline !mt-2">
                {signal.contract}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow relative">
              <div
                className={cn(
                  'space-y-4',
                  signal.isPro && !isProSubscriber && 'blur-sm'
                )}
              >
                <p className="text-sm text-muted-foreground">{signal.reason}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Market Price</span>
                  <span>${signal.marketPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Fair Probability
                  </span>
                  <span>
                    ${signal.probabilityEnvelope.lower.toFixed(2)} - $
                    {signal.probabilityEnvelope.upper.toFixed(2)}
                  </span>
                </div>
              </div>

              {signal.isPro && !isProSubscriber && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 rounded-lg">
                  <Lock className="w-8 h-8 text-accent-foreground mb-2" />
                  <p className="font-bold text-center mb-2 font-headline">
                    Unlock Pro Signal
                  </p>
                  <Button size="sm">Subscribe</Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {signal.timestamp}
              </span>
              <Badge
                variant={
                  signal.signal === 'BET'
                    ? 'default'
                    : signal.signal === 'NO_BET'
                    ? 'destructive'
                    : 'secondary'
                }
              >
                {signal.signal}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
