'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { RiotAccountSyncModal } from '@/components/RiotAccountSyncModal'
import { GuestWall } from '@/components/GuestWall'
import { getFullPlayerProfile } from '@/utils/riotApi'
import { toast } from 'sonner'

export default function RiotSyncPage() {
  const router = useRouter()
  const store = useAppStore()
  const [loading, setLoading] = useState(false)

  if (!store.isLoggedIn) return <GuestWall currentPage="settings" isLoggedIn={false} onSignUp={() => store.set({ isSignUpOpen: true })} onLogin={() => router.push('/auth/login')} />

  const handleSync = async () => {
    setLoading(true)
    try {
      const data = await getFullPlayerProfile(store.riotSummonerName, store.riotSelectedRegion.toUpperCase() as any)
      store.set({ riotProfileData: data, riotAccountLinked: true, riotLinkedRegion: store.riotSelectedRegion, riotDataIsReal: true })
      toast.success('Riot account linked!')
      router.back()
    } catch {
      toast.error('Failed to link Riot account')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <RiotAccountSyncModal
        isOpen={true} onClose={() => router.back()}
        riotSummonerName={store.riotSummonerName}
        setRiotSummonerName={(v) => store.set({ riotSummonerName: v })}
        riotSelectedRegion={store.riotSelectedRegion}
        setRiotSelectedRegion={(v) => store.set({ riotSelectedRegion: v })}
        handleRiotSync={handleSync}
        loadingRiotData={loading}
      />
    </div>
  )
}
