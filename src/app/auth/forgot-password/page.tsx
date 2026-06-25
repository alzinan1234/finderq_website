'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const store = useAppStore()
  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <ForgotPasswordModal
        isOpen={true}
        onClose={() => router.back()}
        forgotPasswordEmail={store.forgotPasswordEmail}
        setForgotPasswordEmail={(v) => store.set({ forgotPasswordEmail: v })}
        forgotPasswordSent={store.forgotPasswordSent}
        setForgotPasswordSent={(v) => store.set({ forgotPasswordSent: v })}
        onOpenLogin={() => router.push("/auth/login")}
      />
    </div>
  )
}
