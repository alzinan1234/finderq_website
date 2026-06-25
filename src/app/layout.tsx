import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { AppProviders } from '@/components/layout/AppProviders'
import { SiteShell } from '@/components/layout/SiteShell'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'FinderQ - League of Legends Player Finder',
  description: 'Find your perfect duo, team, or coaching partner on FinderQ.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
        <AppProviders>
          <SiteShell>{children}</SiteShell>
          <Toaster position="top-center" richColors closeButton theme="dark" />
        </AppProviders>
      </body>
    </html>
  )
}
