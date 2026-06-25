'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { EmailVerificationModal } from '@/components/EmailVerificationModal'

export default function VerifyPage() {
  const router = useRouter()
  const store = useAppStore()

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <EmailVerificationModal
        isOpen={true}
        onClose={() => router.back()}
        verificationEmail={store.verificationEmail}
        verificationCode={store.verificationCode}
        setVerificationCode={(v) => store.set({ verificationCode: v })}
        enteredCode={store.enteredCode}
        setEnteredCode={(v) => store.set({ enteredCode: v })}
        pendingUserData={store.pendingUserData}
        setPendingUserData={(v) => store.set({ pendingUserData: v })}
        ownerUsers={store.ownerUsers}
        rememberMe={store.rememberMe}
        setUserName={store.setUserName}
        setUserEmail={store.setUserEmail}
        setUserRegion={(v) => store.set({ userRegion: v })}
        setUserLanguage={(v) => store.set({ userLanguage: v })}
        setSelectedLanguage={store.setSelectedLanguage}
        setUserAccountLanguage={(v) => store.set({ userAccountLanguage: v })}
        setUserJoinDate={(v) => store.set({ userJoinDate: v })}
        setIsLoggedIn={(v) => { store.set({ isLoggedIn: v }); if (v) router.push('/about') }}
        setIsVerificationOpen={(v) => { if (!v) router.back() }}
        setIsOwner={(v) => store.set({ isOwner: v })}
        setIsAdmin={(v) => store.set({ isAdmin: v })}
        setIsModerator={(v) => store.set({ isModerator: v })}
        setIsProfileOpen={(v) => store.set({ isProfileOpen: v })}
      />
    </div>
  )
}
