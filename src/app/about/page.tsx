// @ts-nocheck
'use client'
import { AboutPage } from '@/components/AboutPage'
import { useAppStore } from '@/store/appStore'

export default function AboutRoute() {
  const { set, selectedLanguage } = useAppStore()
  return (
    <AboutPage
      onGetStarted={() => set({ isSignUpOpen: true })}
      language={selectedLanguage}
    />
  )
}
