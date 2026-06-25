'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { SignUpModal } from '@/components/SignUpModal'
import { translations, LanguageCode } from '@/utils/translations'

export default function SignupPage() {
  const router = useRouter()
  const store = useAppStore()
  const { selectedLanguage, isLoggedIn, set } = store
  const t = (key: string) => (translations[selectedLanguage as LanguageCode] as any)?.[key] || (translations.en as any)[key] || key

  useEffect(() => { if (isLoggedIn) router.push('/about') }, [isLoggedIn])

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <SignUpModal
        isOpen={true}
        onClose={() => router.back()}
        t={t}
        signUpUsername={store.signUpUsername}
        setSignUpUsername={(v) => set({ signUpUsername: v })}
        signUpEmail={store.signUpEmail}
        setSignUpEmail={(v) => set({ signUpEmail: v })}
        signUpPassword={store.signUpPassword}
        setSignUpPassword={(v) => set({ signUpPassword: v })}
        signUpLanguage={store.signUpLanguage}
        setSignUpLanguage={(v) => set({ signUpLanguage: v })}
        agreedToTerms={store.agreedToTerms}
        setAgreedToTerms={(v) => set({ agreedToTerms: typeof v === 'function' ? v(store.agreedToTerms) : v })}
        agreedToPrivacy={store.agreedToPrivacy}
        setAgreedToPrivacy={(v) => set({ agreedToPrivacy: typeof v === 'function' ? v(store.agreedToPrivacy) : v })}
        onOpenTerms={() => router.push('/terms')}
        onOpenPrivacyPolicy={() => router.push('/privacy')}
        onOpenLogin={() => router.push('/auth/login')}
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
