'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { PremiumModal } from '@/components/PremiumModal'
import { GuestWall } from '@/components/GuestWall'

export default function PremiumPage() {
  const router = useRouter()
  const store = useAppStore()
  const { isLoggedIn, set } = store

  if (!isLoggedIn) return <GuestWall currentPage="premium" isLoggedIn={false} onSignUp={() => set({ isSignUpOpen: true })} onLogin={() => router.push('/auth/login')} />

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <PremiumModal
        isOpen={true} onClose={() => router.back()}
        userName={store.userName}
        userNameColor={store.userNameColor}
        setUserNameColor={store.setUserNameColor}
        setIsColorPickerOpen={(v) => set({ isColorPickerOpen: v })}
        userProfileBackground={store.userProfileBackground}
        setIsBackgroundPickerOpen={(v) => set({ isBackgroundPickerOpen: v })}
        userPostBackground={store.userPostBackground}
        setIsPostBackgroundPickerOpen={(v) => set({ isPostBackgroundPickerOpen: v })}
        postImage={store.postImage}
        setPostImage={(v) => set({ postImage: v })}
        tempPostImage={store.tempPostImage}
        setTempPostImage={(v) => set({ tempPostImage: v })}
        imageZoom={store.imageZoom}
        setImageZoom={(v) => set({ imageZoom: v })}
        imagePositionX={store.imagePositionX}
        setImagePositionX={(v) => set({ imagePositionX: v })}
        imagePositionY={store.imagePositionY}
        setImagePositionY={(v) => set({ imagePositionY: v })}
        hasPremium={store.hasPremium}
        setHasPremium={store.setHasPremium}
        postBorder={store.postBorder}
        setPostBorder={(v) => set({ postBorder: v })}
      />
    </div>
  )
}
