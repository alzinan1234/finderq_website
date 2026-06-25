// @ts-nocheck
'use client'
import { useAppStore } from '@/store/appStore'
import { MediaPage } from '@/components/MediaPage'
import { GuestWall } from '@/components/GuestWall'

export default function MediaRoute() {
  const { isLoggedIn, userName, hasPremium, userAvatar, userNameColor, selectedLanguage, userAccountLanguage, set } = useAppStore()
  if (!isLoggedIn) return <GuestWall currentPage="media" isLoggedIn={false} onSignUp={() => set({ isSignUpOpen: true })} onLogin={() => set({ isLoginOpen: true })} />
  return <MediaPage isLoggedIn={isLoggedIn} userName={userName} hasPremium={hasPremium} userAvatar={userAvatar} userNameColor={userNameColor} selectedLanguage={selectedLanguage} userAccountLanguage={userAccountLanguage} />
}
