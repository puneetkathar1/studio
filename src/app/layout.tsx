import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { FirebaseClientProvider } from '@/firebase/client-provider'
import { ClientSideLogic } from '@/components/layout/ClientSideLogic'
import { TopNavShell } from '@/components/layout/top-nav-shell'

export const metadata: Metadata = {
  title: 'Predictive Insights Pro | Intelligence Terminal',
  description: 'AI-powered signals and quantitative audit for prediction markets.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist+Sans:wght@400;600;700&family=Geist+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body min-h-screen flex flex-col overflow-x-hidden" suppressHydrationWarning>
        <FirebaseClientProvider>
          <ClientSideLogic />
          <TopNavShell />
          <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-4 lg:py-6">
            {children}
          </main>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  )
}
