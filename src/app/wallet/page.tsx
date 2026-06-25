'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { Wallet } from '@/components/Wallet'
import { GuestWall } from '@/components/GuestWall'

export default function WalletPage() {
  const router = useRouter()
  const store = useAppStore()
  const { isLoggedIn, userName, walletBalance, set, setWalletBalance } = store

  if (!isLoggedIn) return <GuestWall currentPage="wallet" isLoggedIn={false} onSignUp={() => set({ isSignUpOpen: true })} onLogin={() => router.push('/auth/login')} />

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
      <Wallet
        isOpen={true} onClose={() => router.back()}
        username={userName} balance={walletBalance}
        onBalanceChange={(v) => setWalletBalance(v)}
      />
    </div>
  )
}
