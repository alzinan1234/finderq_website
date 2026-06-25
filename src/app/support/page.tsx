'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useEffect } from 'react'
import { useAppStore } from '@/store/appStore'
import { LiveSupportChat } from '@/components/LiveSupportChat'
import { useRouter } from 'next/navigation'

export default function SupportPage() {
  const router = useRouter()
  const store = useAppStore()

  useEffect(() => {
    store.set({ isSupportChatOpen: true, isSupportMinimized: false })
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">FinderQ Support</h1>
        <p className="text-white/50">The support chat is open in the bottom-right corner.</p>
        <button onClick={() => router.push('/about')} className="px-6 py-2 bg-[#00d4ff]/20 text-[#00d4ff] rounded-xl border border-[#00d4ff]/30 hover:bg-[#00d4ff]/30 transition-colors">Go Home</button>
      </div>
    </div>
  )
}
