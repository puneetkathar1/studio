'use client'

import dynamic from 'next/dynamic'

const TopNavNoSSR = dynamic(() => import('@/components/layout/top-nav'), { ssr: false })

export function TopNavShell() {
  return <TopNavNoSSR />
}

