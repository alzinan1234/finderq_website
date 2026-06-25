'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { AboutModal } from '@/components/AboutModal'
export default function AboutUsPage() {
  const router = useRouter()
  return <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center"><AboutModal isOpen={true} onClose={() => router.back()} /></div>
}
