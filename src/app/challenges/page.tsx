// @ts-nocheck
'use client'
import { useAppStore } from '@/store/appStore'
import { ChallengesPage } from '@/components/ChallengesPage'
import { GuestWall } from '@/components/GuestWall'

export default function ChallengesRoute() {
  const { isLoggedIn, userName, hasPremium, set } = useAppStore()
  if (!isLoggedIn) return <GuestWall currentPage="challenges" isLoggedIn={false} onSignUp={() => set({ isSignUpOpen: true })} onLogin={() => set({ isLoginOpen: true })} />
  return <ChallengesPage isLoggedIn={isLoggedIn} userName={userName} hasPremium={hasPremium} onUpgradePremium={() => set({ isPremiumOpen: true })} />
}
