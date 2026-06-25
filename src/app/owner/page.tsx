'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { OwnerPanel } from '@/components/OwnerPanel'

export default function OwnerPage() {
  const router = useRouter()
  const store = useAppStore()
  const { isLoggedIn, isOwner, isModerator, isAdmin, userName } = store

  if (!isLoggedIn || (!isOwner && !isModerator && !isAdmin)) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/50 text-xl font-semibold">Access Denied</p>
          <button onClick={() => router.push('/about')} className="px-6 py-2 bg-[#00d4ff]/20 text-[#00d4ff] rounded-xl border border-[#00d4ff]/30 hover:bg-[#00d4ff]/30 transition-colors">Go Home</button>
        </div>
      </div>
    )
  }

  const handlePromote = (userId: number, newRole: string) => {
    store.setOwnerUsers((prev: any[]) => prev.map((u: any) => u.id === userId ? { ...u, role: newRole } : u))
  }
  const handleDemote = (userId: number, newRole: string) => {
    store.setOwnerUsers((prev: any[]) => prev.map((u: any) => u.id === userId ? { ...u, role: newRole } : u))
  }
  const handleTogglePerm = (userId: number, permission: string) => {
    store.setOwnerUsers((prev: any[]) => prev.map((u: any) => {
      if (u.id !== userId) return u
      const perms = u.permissions || {}
      return { ...u, permissions: { ...perms, [permission]: !perms[permission] } }
    }))
  }
  const handleDeleteUser = (userId: number) => {
    store.setOwnerUsers((prev: any[]) => prev.filter((u: any) => u.id !== userId))
  }
  const handleBanUser = (userId: number) => {
    store.setOwnerUsers((prev: any[]) => prev.map((u: any) => u.id === userId ? { ...u, isBanned: true } : u))
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-4">
      <OwnerPanel
        isOpen={true}
        onClose={() => router.back()}
        currentUserName={userName}
        currentUserRole={isOwner ? 'owner' : isAdmin ? 'admin' : 'moderator'}
        users={store.ownerUsers}
        onPromoteUser={handlePromote}
        onDemoteUser={handleDemote}
        onTogglePermission={handleTogglePerm}
        onDeleteUser={handleDeleteUser}
        onBanUser={handleBanUser}
        onUnbanUser={(userId) => store.setOwnerUsers((prev: any[]) => prev.map((u: any) => u.id === userId ? { ...u, isBanned: false } : u))}
        activityLogs={store.activityLogs}
        settings={store.adminSettings}
        onUpdateSettings={(v: any) => store.set({ adminSettings: v })}
        pendingTournaments={store.pendingTournaments}
        onApproveTournament={(id) => store.set({ pendingTournaments: store.pendingTournaments.map((t: any) => t.id === id ? { ...t, status: 'active' } : t) })}
        onRejectTournament={(id) => store.set({ pendingTournaments: store.pendingTournaments.filter((t: any) => t.id !== id) })}
        supportConversations={store.supportConversations}
        closedSupportConversations={store.closedSupportConversations}
        selectedSupportUser={store.selectedSupportUser}
        onSelectSupportUser={(v: any) => store.set({ selectedSupportUser: v })}
        onSendSupportMessage={store.handleSupportMessage}
        onCloseSupportConversation={store.handleCloseSupportConversation}
        onReopenSupportConversation={store.handleReopenSupportConversation}
        externalReports={store.adminReports}
        onUpdateExternalReports={(v: any) => store.set({ adminReports: v })}
        onDeletePost={(postId) => store.set({ adminPosts: store.adminPosts.filter((p: any) => p.id !== postId) })}
      />
    </div>
  )
}
