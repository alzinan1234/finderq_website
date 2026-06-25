'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { TermsModal } from '@/components/TermsModal'
export default function TermsPage() {
  const router = useRouter()
  return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center"><TermsModal isOpen={true} onClose={() => router.back()} /></div>
}
