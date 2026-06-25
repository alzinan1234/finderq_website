'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { ColorPickerModal } from '@/components/ColorPickerModal'
import { GuestWall } from '@/components/GuestWall'
export default function ColorsPage() {
  const router = useRouter()
  const store = useAppStore()
  if (!store.isLoggedIn) return <GuestWall currentPage="settings" isLoggedIn={false} onSignUp={() => store.set({ isSignUpOpen: true })} onLogin={() => router.push('/auth/login')} />
  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <ColorPickerModal isOpen={true} onClose={() => router.back()} currentColor={store.userNameColor} onSave={(v) => { store.setUserNameColor(v); router.back() }} />
    </div>
  )
}
