'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { LoginModal } from '@/components/LoginModal'
import { translations, LanguageCode } from '@/utils/translations'

export default function LoginPage() {
  const router = useRouter()
  const store = useAppStore()
  const { selectedLanguage, isLoggedIn, set } = store
  const t = (key: string) => (translations[selectedLanguage as LanguageCode] as any)?.[key] || (translations.en as any)[key] || key

  useEffect(() => { if (isLoggedIn) router.push('/about') }, [isLoggedIn])

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <LoginModal
        isOpen={true}
        onClose={() => router.back()}
        t={t}
        loginEmail={store.loginEmail}
        setLoginEmail={(v) => set({ loginEmail: v })}
        loginPassword={store.loginPassword}
        setLoginPassword={(v) => set({ loginPassword: v })}
        rememberMe={store.rememberMe}
        setRememberMe={(v) => set({ rememberMe: typeof v === 'function' ? v(store.rememberMe) : v })}
        adminUsers={store.adminUsers}
        ownerUsers={store.ownerUsers}
        onOpenSignUp={() => router.push('/auth/signup')}
        onOpenForgotPassword={() => router.push('/auth/forgot-password')}
        setForgotPasswordEmail={(v) => set({ forgotPasswordEmail: v })}
        setForgotPasswordSent={(v) => set({ forgotPasswordSent: v })}
        setIsBannedModalOpen={(v) => set({ isBannedModalOpen: v })}
        setVerificationCode={(v) => set({ verificationCode: v })}
        setVerificationEmail={(v) => set({ verificationEmail: v })}
        setIsFromGoogle={(v) => set({ isFromGoogle: v })}
        setPendingUserData={(v) => set({ pendingUserData: v })}
        setIsVerificationOpen={(v) => { if (v) router.push('/auth/verify') }}
        setGoogleEmail={(v) => set({ googleEmail: v })}
        setIsGoogleSignUp={(v) => set({ isGoogleSignUp: v })}
        setIsGoogleNamePromptOpen={(v) => set({ isGoogleNamePromptOpen: v })}
      />
    </div>
  )
}
