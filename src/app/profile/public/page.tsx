'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { PublicProfileModal } from '@/components/PublicProfileModal'
import { useOnlinePresence } from '@/hooks/useOnlinePresence'

export default function PublicProfilePage() {
  const router = useRouter()
  const store = useAppStore()
  const { getUserStatus } = useOnlinePresence(store.isLoggedIn ? store.userName : null)
  const profile = store.selectedUserProfile

  if (!profile) return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <div className="text-center space-y-4">
        <p className="text-white/50 text-lg">No profile selected</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-[#00d4ff]/20 text-[#00d4ff] rounded-xl border border-[#00d4ff]/30 hover:bg-[#00d4ff]/30 transition-colors">Go Back</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <PublicProfileModal
        isOpen={true} onClose={() => router.back()}
        profile={profile}
        publicProfileSeasonRanks={store.publicProfileSeasonRanks}
        activePublicProfileTab={store.activePublicProfileTab as any}
        setActivePublicProfileTab={(v: any) => store.set({ activePublicProfileTab: v as any })}
        getUserStatus={getUserStatus}
        setIsReportProfileModalOpen={(v) => store.set({ isReportProfileModalOpen: v })}
        isLoggedIn={store.isLoggedIn}
        userName={store.userName}
        userStatus={store.userStatus}
        userJoinDate={store.userJoinDate}
      />
    </div>
  )
}
