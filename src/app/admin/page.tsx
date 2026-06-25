'use client'
// @ts-nocheck
export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/appStore'
import { AdminPanel } from '@/components/AdminPanel'

export default function AdminPage() {
  const router = useRouter()
  const store = useAppStore()
  const { isLoggedIn, isAdmin, isOwner, isModerator } = store

  if (!isLoggedIn || (!isAdmin && !isOwner && !isModerator)) {
    return (
      <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/50 text-xl font-semibold">Access Denied</p>
          <button onClick={() => router.push('/about')} className="px-6 py-2 bg-[#00d4ff]/20 text-[#00d4ff] rounded-xl border border-[#00d4ff]/30 hover:bg-[#00d4ff]/30 transition-colors">Go Home</button>
        </div>
      </div>
    )
  }

  const handleBanUser = (userId: number) => {
    store.set({ adminUsers: store.adminUsers.map((u: any) => u.id === userId ? { ...u, isBanned: true, status: 'banned' } : u) })
  }
  const handleDeleteUser = (userId: number) => {
    store.set({ adminUsers: store.adminUsers.filter((u: any) => u.id !== userId) })
  }
  const handleApprovePost = (postId: number) => {
    store.set({ adminPosts: store.adminPosts.map((p: any) => p.id === postId ? { ...p, status: 'approved' } : p) })
  }
  const handleDeletePost = (postId: number) => {
    store.set({ adminPosts: store.adminPosts.filter((p: any) => p.id !== postId) })
  }
  const handleResolveReport = (reportId: number) => {
    store.set({ adminReports: store.adminReports.map((r: any) => r.id === reportId ? { ...r, status: 'resolved' } : r) })
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-4">
      <AdminPanel
        isOpen={true}
        onClose={() => router.back()}
        activeTab={store.adminTab}
        onTabChange={(v: any) => store.set({ adminTab: v })}
        users={store.adminUsers}
        posts={store.adminPosts}
        reports={store.adminReports}
        settings={store.adminSettings}
        pendingTournaments={store.pendingTournaments}
        onBanUser={handleBanUser}
        onDeleteUser={handleDeleteUser}
        onViewUserProfile={(userId: number) => {}}
        onApprovePost={handleApprovePost}
        onDeletePost={handleDeletePost}
        onResolveReport={handleResolveReport}
        onTakeAction={handleResolveReport}
        onApproveTournament={(id: number) => store.set({ pendingTournaments: store.pendingTournaments.map((t: any) => t.id === id ? { ...t, status: 'active' } : t) })}
        onRejectTournament={(id: number) => store.set({ pendingTournaments: store.pendingTournaments.filter((t: any) => t.id !== id) })}
        onUpdateSettings={(v: any) => store.set({ adminSettings: v })}
        userRole={isOwner ? 'owner' : isAdmin ? 'admin' : 'moderator'}
        supportConversations={store.supportConversations}
        closedSupportConversations={store.closedSupportConversations}
        selectedSupportUser={store.selectedSupportUser}
        onSelectSupportUser={(v: any) => store.set({ selectedSupportUser: v })}
        onSendSupportMessage={store.handleSupportMessage}
        onCloseSupportConversation={store.handleCloseSupportConversation}
        onReopenSupportConversation={store.handleReopenSupportConversation}
      />
    </div>
  )
}
