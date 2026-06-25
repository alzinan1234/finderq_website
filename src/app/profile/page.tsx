'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { ProfileModal } from '@/components/ProfileModal'
import { GuestWall } from '@/components/GuestWall'

export default function ProfilePage() {
  const router = useRouter()
  const store = useAppStore()
  const { isLoggedIn, set, setUserName, setUserEmail, setUserStatus } = store

  if (!isLoggedIn) return <GuestWall currentPage="profile" isLoggedIn={false} onSignUp={() => set({ isSignUpOpen: true })} onLogin={() => router.push('/auth/login')} />

  const handleImageUpload = (file: File, type: 'avatar' | 'banner') => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      if (type === 'avatar') set({ userAvatar: result })
      else set({ userBanner: result })
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <ProfileModal
        isOpen={true} onClose={() => router.back()}
        userName={store.userName} userEmail={store.userEmail} userRegion={store.userRegion}
        userAvatar={store.userAvatar} userBanner={store.userBanner} userJoinDate={store.userJoinDate}
        setUserName={setUserName} setUserEmail={setUserEmail}
        setUserAvatar={(v) => set({ userAvatar: v })} setUserBanner={(v) => set({ userBanner: v })}
        isOwner={store.isOwner} isAdmin={store.isAdmin}
        riotProfileData={store.riotProfileData} riotAccountLinked={store.riotAccountLinked}
        riotDataIsReal={store.riotDataIsReal} riotLinkedRegion={store.riotLinkedRegion}
        riotSummonerName={store.riotSummonerName} seasonRanks={store.seasonRanks}
        setRiotAccountLinked={(v) => set({ riotAccountLinked: v })}
        setRiotProfileData={(v) => set({ riotProfileData: v })}
        setRiotDataIsReal={(v) => set({ riotDataIsReal: v })}
        setRiotSummonerName={(v) => set({ riotSummonerName: v })}
        setRiotLinkedRegion={(v) => set({ riotLinkedRegion: v })}
        setRiotSelectedRegion={(v) => set({ riotSelectedRegion: v })}
        setIsRiotSyncOpen={(v) => set({ isRiotSyncOpen: v })}
        setUserRank={(v) => set({ userRank: v })}
        handleImageUpload={handleImageUpload}
        userStatus={store.userStatus} onStatusChange={setUserStatus}
        userNameColor={store.userNameColor} setIsColorPickerOpen={(v) => set({ isColorPickerOpen: v })}
        userProfileBackground={store.userProfileBackground} setIsBackgroundPickerOpen={(v) => set({ isBackgroundPickerOpen: v })}
        hasPremium={store.hasPremium} tournamentEarnings={store.userTournamentEarnings}
      />
    </div>
  )
}
