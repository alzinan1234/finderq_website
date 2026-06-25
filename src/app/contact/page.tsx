'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { ContactModal } from '@/components/ContactModal'
export default function ContactPage() {
  const router = useRouter()
  const { set } = useAppStore()
  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <ContactModal isOpen={true} onClose={() => router.back()} onOpenSupportChat={() => { set({ isSupportChatOpen: true }); router.push('/support') }} />
    </div>
  )
}
