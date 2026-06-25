'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { PrivacyPolicyModal } from '@/components/PrivacyPolicyModal'
export default function PrivacyPage() {
  const router = useRouter()
  return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center"><PrivacyPolicyModal isOpen={true} onClose={() => router.back()} /></div>
}
