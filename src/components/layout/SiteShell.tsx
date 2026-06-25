// @ts-nocheck
'use client'
import { useEffect, useCallback, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { NavBar } from './NavBar'
import { LanguageSelector } from '@/components/LanguageSelector'
import { NotificationPanel } from '@/components/NotificationPanel'
import { MessagesPanel } from '@/components/MessagesPanel'
import { LiveSupportChat } from '@/components/LiveSupportChat'
import { SignUpModal } from '@/components/SignUpModal'
import { LoginModal } from '@/components/LoginModal'
import { ForgotPasswordModal } from '@/components/ForgotPasswordModal'
import { GoogleNamePromptModal } from '@/components/GoogleNamePromptModal'
import { EmailVerificationModal } from '@/components/EmailVerificationModal'
import { RiotAccountSyncModal } from '@/components/RiotAccountSyncModal'
import { ProfileModal } from '@/components/ProfileModal'
import { PublicProfileModal } from '@/components/PublicProfileModal'
import { PremiumModal } from '@/components/PremiumModal'
import { Wallet } from '@/components/Wallet'
import { AdminPanel } from '@/components/AdminPanel'
import { OwnerPanel } from '@/components/OwnerPanel'
import { ReportModal } from '@/components/ReportModal'
import { ReportProfileModal } from '@/components/ReportProfileModal'
import { BannedAccountModal } from '@/components/BannedAccountModal'
import { ColorPickerModal } from '@/components/ColorPickerModal'
import { BackgroundPickerModal } from '@/components/BackgroundPickerModal'
import { PrivacyPolicyModal } from '@/components/PrivacyPolicyModal'
import { TermsModal } from '@/components/TermsModal'
import { AboutModal } from '@/components/AboutModal'
import { ContactModal } from '@/components/ContactModal'
import { TournamentDetails } from '@/components/TournamentDetails'
import { CreateTournamentModal } from '@/components/CreateTournamentModal'
import { useOnlinePresence } from '@/hooks/useOnlinePresence'
import { useTranslation } from '@/hooks/useTranslation'
import { translations, LanguageCode } from '@/utils/translations'
import { toast } from 'sonner'

function makeT(lang: string) {
  return (key: string): string => {
    const l = lang as LanguageCode
    return (translations[l] as any)?.[key] || (translations.en as any)[key] || key
  }
}


function RiotSyncWrapper({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const store = useAppStore()
  const handleSync = async () => {
    setLoading(true)
    try {
      const { getFullPlayerProfile } = await import('@/utils/riotApi')
      const data = await getFullPlayerProfile(store.riotSummonerName, store.riotSelectedRegion)
      store.set({ riotProfileData: data, riotAccountLinked: true, riotLinkedRegion: store.riotSelectedRegion, riotDataIsReal: true, isRiotSyncOpen: false })
      toast.success('Riot account linked!')
    } catch { toast.error('Failed to link Riot account') }
    finally { setLoading(false) }
  }
  return (
    <RiotAccountSyncModal
      isOpen={true} onClose={onClose}
      riotSummonerName={store.riotSummonerName}
      setRiotSummonerName={(v) => store.set({ riotSummonerName: v })}
      riotSelectedRegion={store.riotSelectedRegion}
      setRiotSelectedRegion={(v) => store.set({ riotSelectedRegion: v })}
      handleRiotSync={handleSync}
      loadingRiotData={loading}
    />
  )
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const store = useAppStore()
  const { language } = useTranslation()
  const t = makeT(language)
  const { isUserOnline } = useOnlinePresence(store.isLoggedIn ? store.userName : null)

  const {
    isLoggedIn, userName, userEmail, userRegion, userAvatar, userBanner, userJoinDate,
    isAdmin, isOwner, isModerator, userNameColor, hasPremium, userStatus,
    walletBalance, userAccountLanguage, riotAccountLinked, riotProfileData, riotDataIsReal,
    riotSummonerName, riotSelectedRegion, riotLinkedRegion, userRank, seasonRanks,
    publicProfileSeasonRanks, userProfileBackground, userPostBackground,
    userTournamentEarnings, userTournamentName,
    notifications, isNotificationPanelOpen, friends, openThreadRequest,
    isSignUpOpen, isLoginOpen, isProfileOpen, isPremiumOpen, isWalletOpen,
    isAdminPanelOpen, isOwnerPanelOpen, isColorPickerOpen, isBackgroundPickerOpen,
    isPostBackgroundPickerOpen, isRiotSyncOpen, isPublicProfileOpen, isReportModalOpen,
    isReportProfileModalOpen, isBannedModalOpen, isPrivacyPolicyOpen, isTermsOpen,
    isAboutModalOpen, isContactModalOpen, isForgotPasswordOpen, isGoogleNamePromptOpen,
    isVerificationOpen, isTournamentDetailsOpen, isCreateTournamentOpen,
    isSupportChatOpen, isSupportMinimized, reportPostId, reportAuthor, reportContent,
    selectedUserProfile, activePublicProfileTab, loginEmail, loginPassword,
    signUpUsername, signUpEmail, signUpPassword, signUpRegion, signUpLanguage,
    agreedToTerms, agreedToPrivacy, forgotPasswordEmail, forgotPasswordSent,
    googleEmail, googleUsername, isGoogleSignUp, verificationEmail, verificationCode,
    enteredCode, pendingUserData, selectedTournamentId, selectedTournamentStatus,
    pendingTournaments, adminUsers, adminPosts, adminReports, adminSettings, ownerUsers,
    activityLogs, adminTab, supportConversations, selectedSupportUser,
    closedSupportConversations, supportInputMessage, selectedLanguage,
    set, markNotificationRead, markAllNotificationsRead, clearAllNotifications,
    addFriend, removeFriend, setOwnerUsers, handleSupportMessage,
    handleCloseSupportConversation, handleReopenSupportConversation,
    handleStartNewSupportConversation, setUserName, setUserEmail, setUserNameColor,
    setUserProfileBackground, setUserPostBackground, setHasPremium, setWalletBalance,
    setUserStatus, setSelectedLanguage, logout,
  } = store

  // Cooldown timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasPremium && store.lastPostTime > 0) {
        const remaining = Math.max(0, 10 * 60 * 1000 - (Date.now() - store.lastPostTime))
        set({ postCooldownRemaining: remaining })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [hasPremium, store.lastPostTime, set])

  const handleRegister = (username: string, email: string, password: string, region: string) => {
    const newUser = {
      id: Date.now(), username, name: username, email, password, region,
      role: 'user', isBanned: false,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      avatar: '', banner: '', permissions: {},
    }
    setOwnerUsers((prev: any[]) => [...prev, newUser])
    set({ isLoggedIn: true, userName: username, userEmail: email, userRegion: region, userJoinDate: newUser.joinDate, isSignUpOpen: false, isVerificationOpen: false })
    toast.success(`Welcome to FinderQ, ${username}!`)
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white">
      <NavBar />
      <main className="">{children}</main>

      {/* Notification Panel */}
      {isLoggedIn && (
        <NotificationPanel
          isOpen={isNotificationPanelOpen}
          onClose={() => set({ isNotificationPanelOpen: false })}
          notifications={notifications}
          onMarkAsRead={markNotificationRead}
          onMarkAllAsRead={markAllNotificationsRead}
          onClearAll={clearAllNotifications}
        />
      )}

      {/* Messages */}
      {isLoggedIn && (
        <MessagesPanel
          friends={friends}
          onFriendClick={(username, initials, color) => set({ openThreadRequest: { username, initials, color } })}
          onRemoveFriend={removeFriend}
          openThreadRequest={openThreadRequest}
          onClearThreadRequest={() => set({ openThreadRequest: null })}
        />
      )}

      {/* Support Chat */}
      <LiveSupportChat
        isLoggedIn={isLoggedIn} userName={userName}
        isAdmin={isAdmin} isOwner={isOwner}
        conversations={supportConversations}
        closedConversations={closedSupportConversations}
        isChatOpen={isSupportChatOpen} isMinimized={isSupportMinimized}
        inputMessage={supportInputMessage}
        selectedUser={selectedSupportUser}
        onToggle={() => set({ isSupportChatOpen: !isSupportChatOpen, isSupportMinimized: false })}
        onMinimize={() => set({ isSupportMinimized: true })}
        onMaximize={() => set({ isSupportMinimized: false })}
        onClose={() => set({ isSupportChatOpen: false })}
        onSendMessage={handleSupportMessage}
        onStartNew={handleStartNewSupportConversation}
        onInputChange={(v) => set({ supportInputMessage: v })}
        onSelectUser={(v) => set({ selectedSupportUser: v })}
        onCloseConversation={handleCloseSupportConversation}
        onReopenConversation={handleReopenSupportConversation}
        onLoginClick={() => set({ isLoginOpen: true })}
      />

      {/* Auth Modals */}
      {isSignUpOpen && (
        <SignUpModal
          isOpen={isSignUpOpen} onClose={() => set({ isSignUpOpen: false })} t={t}
          signUpUsername={signUpUsername} setSignUpUsername={(v) => set({ signUpUsername: v })}
          signUpEmail={signUpEmail} setSignUpEmail={(v) => set({ signUpEmail: v })}
          signUpPassword={signUpPassword} setSignUpPassword={(v) => set({ signUpPassword: v })}
          signUpLanguage={signUpLanguage} setSignUpLanguage={(v) => set({ signUpLanguage: v })}
          agreedToTerms={agreedToTerms} setAgreedToTerms={(v) => set({ agreedToTerms: v })}
          agreedToPrivacy={agreedToPrivacy} setAgreedToPrivacy={(v) => set({ agreedToPrivacy: v })}
          onOpenTerms={() => set({ isTermsOpen: true })}
          onOpenPrivacyPolicy={() => set({ isPrivacyPolicyOpen: true })}
          onOpenLogin={() => set({ isSignUpOpen: false, isLoginOpen: true })}
          setVerificationCode={(v) => set({ verificationCode: v })}
          setVerificationEmail={(v) => set({ verificationEmail: v })}
          setIsFromGoogle={(v) => set({ isFromGoogle: v })}
          setPendingUserData={(v) => set({ pendingUserData: v })}
          setIsVerificationOpen={(v) => set({ isVerificationOpen: v })}
          setGoogleEmail={(v) => set({ googleEmail: v })}
          setIsGoogleSignUp={(v) => set({ isGoogleSignUp: v })}
          setIsGoogleNamePromptOpen={(v) => set({ isGoogleNamePromptOpen: v })}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen} onClose={() => set({ isLoginOpen: false })} t={t}
          loginEmail={loginEmail} setLoginEmail={(v) => set({ loginEmail: v })}
          loginPassword={loginPassword} setLoginPassword={(v) => set({ loginPassword: v })}
          rememberMe={store.rememberMe} setRememberMe={(v) => set({ rememberMe: typeof v === 'function' ? v(store.rememberMe) : v })}
          adminUsers={adminUsers} ownerUsers={ownerUsers}
          onOpenSignUp={() => set({ isLoginOpen: false, isSignUpOpen: true })}
          onOpenForgotPassword={() => set({ isLoginOpen: false, isForgotPasswordOpen: true })}
          setForgotPasswordEmail={(v) => set({ forgotPasswordEmail: v })}
          setForgotPasswordSent={(v) => set({ forgotPasswordSent: v })}
          setIsBannedModalOpen={(v) => set({ isBannedModalOpen: v })}
          setVerificationCode={(v) => set({ verificationCode: v })}
          setVerificationEmail={(v) => set({ verificationEmail: v })}
          setIsFromGoogle={(v) => set({ isFromGoogle: v })}
          setPendingUserData={(v) => set({ pendingUserData: v })}
          setIsVerificationOpen={(v) => set({ isVerificationOpen: v })}
          setGoogleEmail={(v) => set({ googleEmail: v })}
          setIsGoogleSignUp={(v) => set({ isGoogleSignUp: v })}
          setIsGoogleNamePromptOpen={(v) => set({ isGoogleNamePromptOpen: v })}
          setIsLoggedIn={(v) => set({ isLoggedIn: v })}
          setUserName={setUserName}
          setUserEmail={setUserEmail}
          setIsAdmin={(v) => set({ isAdmin: v })}
          setIsOwner={(v) => set({ isOwner: v })}
          setIsModerator={(v) => set({ isModerator: v })}
          setUserRegion={(v) => set({ userRegion: v })}
          setUserAvatar={(v) => set({ userAvatar: v })}
          setUserJoinDate={(v) => set({ userJoinDate: v })}
          setIsLoginOpen={(v) => set({ isLoginOpen: v })}
        />
      )}

      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen} onClose={() => set({ isForgotPasswordOpen: false, forgotPasswordSent: false, forgotPasswordEmail: '' })}
          forgotPasswordEmail={forgotPasswordEmail} setForgotPasswordEmail={(v) => set({ forgotPasswordEmail: v })}
          forgotPasswordSent={forgotPasswordSent} setForgotPasswordSent={(v) => set({ forgotPasswordSent: v })}
          onBackToLogin={() => set({ isForgotPasswordOpen: false, isLoginOpen: true })}
        />
      )}

      {isGoogleNamePromptOpen && (
        <GoogleNamePromptModal
          isOpen={isGoogleNamePromptOpen} onClose={() => set({ isGoogleNamePromptOpen: false })}
          googleEmail={googleEmail} googleUsername={googleUsername}
          setGoogleUsername={(v) => set({ googleUsername: v })}
          isGoogleSignUp={isGoogleSignUp}
          setVerificationCode={(v) => set({ verificationCode: v })}
          setVerificationEmail={(v) => set({ verificationEmail: v })}
          setIsFromGoogle={(v) => set({ isFromGoogle: v })}
          setPendingUserData={(v) => set({ pendingUserData: v })}
          setIsGoogleNamePromptOpen={(v) => set({ isGoogleNamePromptOpen: v })}
          setIsVerificationOpen={(v) => set({ isVerificationOpen: v })}
          setIsLoggedIn={(v) => set({ isLoggedIn: v })}
          setUserName={setUserName}
        />
      )}

      {isVerificationOpen && (
        <EmailVerificationModal
          isOpen={isVerificationOpen} onClose={() => set({ isVerificationOpen: false })}
          verificationEmail={verificationEmail}
          verificationCode={verificationCode}
          setVerificationCode={(v) => set({ verificationCode: v })}
          enteredCode={enteredCode}
          setEnteredCode={(v) => set({ enteredCode: v })}
          pendingUserData={pendingUserData}
          rememberMe={store.rememberMe}
          isFromGoogle={store.isFromGoogle}
          onVerificationSuccess={(data) => handleRegister(data.username, data.email, data.password || '', signUpRegion)}
          setIsLoggedIn={(v) => set({ isLoggedIn: v })}
          setIsAdmin={(v) => set({ isAdmin: v })}
          setIsOwner={(v) => set({ isOwner: v })}
          setIsModerator={(v) => set({ isModerator: v })}
          setUserLanguage={(v) => set({ userLanguage: v })}
          setSelectedLanguage={setSelectedLanguage}
          setUserAccountLanguage={(v) => set({ userAccountLanguage: v })}
          setUserName={setUserName}
          setUserEmail={setUserEmail}
          setUserRegion={(v) => set({ userRegion: v })}
          setUserJoinDate={(v) => set({ userJoinDate: v })}
          setIsProfileOpen={(v) => set({ isProfileOpen: v })}
          setIsVerificationOpen={(v) => set({ isVerificationOpen: v })}
          ownerUsers={ownerUsers} setOwnerUsers={setOwnerUsers}
        />
      )}

      {/* Profile */}
      {isProfileOpen && (
        <ProfileModal
          isOpen={isProfileOpen} onClose={() => set({ isProfileOpen: false })}
          userName={userName} userEmail={userEmail} userRegion={userRegion}
          userAvatar={userAvatar} userBanner={userBanner} userJoinDate={userJoinDate}
          hasPremium={hasPremium} userStatus={userStatus} userNameColor={userNameColor}
          userProfileBackground={userProfileBackground} userPostBackground={userPostBackground}
          riotAccountLinked={riotAccountLinked} riotProfileData={riotProfileData}
          riotDataIsReal={riotDataIsReal} seasonRanks={seasonRanks}
          userTournamentEarnings={userTournamentEarnings} userTournamentName={userTournamentName}
          setUserName={setUserName} setUserEmail={setUserEmail}
          setUserAvatar={(v) => set({ userAvatar: v })}
          setUserBanner={(v) => set({ userBanner: v })}
          setUserStatus={setUserStatus}
          setIsPremiumOpen={(v) => set({ isPremiumOpen: v })}
          setIsColorPickerOpen={(v) => set({ isColorPickerOpen: v })}
          setIsBackgroundPickerOpen={(v) => set({ isBackgroundPickerOpen: v })}
          setIsRiotSyncOpen={(v) => set({ isRiotSyncOpen: v })}
          setIsProfileOpen={(v) => set({ isProfileOpen: v })}
        />
      )}

      {isPublicProfileOpen && selectedUserProfile && (
        <PublicProfileModal
          isOpen={isPublicProfileOpen} onClose={() => set({ isPublicProfileOpen: false })}
          profile={selectedUserProfile}
          activeTab={activePublicProfileTab}
          onTabChange={(v) => set({ activePublicProfileTab: v })}
          publicProfileSeasonRanks={publicProfileSeasonRanks}
          isUserOnline={isUserOnline}
          onReportProfile={() => set({ isReportProfileModalOpen: true })}
          onMessageClick={(username, initials, color) => { addFriend({ username, initials, color }); set({ openThreadRequest: { username, initials, color }, isPublicProfileOpen: false }) }}
        />
      )}

      {isPremiumOpen && (
        <PremiumModal
          isOpen={isPremiumOpen} onClose={() => set({ isPremiumOpen: false })}
          userName={userName} userNameColor={userNameColor}
          setUserNameColor={setUserNameColor}
          hasPremium={hasPremium} walletBalance={walletBalance}
          setHasPremium={setHasPremium} setWalletBalance={setWalletBalance}
          onOpenWallet={() => set({ isPremiumOpen: false, isWalletOpen: true })}
        />
      )}

      {isWalletOpen && (
        <Wallet
          isOpen={isWalletOpen} onClose={() => set({ isWalletOpen: false })}
          username={userName} balance={walletBalance}
          onBalanceChange={(v) => setWalletBalance(v)}
        />
      )}

      {isAdminPanelOpen && (
        <AdminPanel
          isOpen={isAdminPanelOpen} onClose={() => set({ isAdminPanelOpen: false })}
          activeTab={adminTab} onTabChange={(v) => set({ adminTab: v })}
          users={adminUsers} onUpdateUsers={(v) => set({ adminUsers: v })}
          posts={adminPosts} onUpdatePosts={(v) => set({ adminPosts: v })}
          reports={adminReports} onUpdateReports={(v) => set({ adminReports: v })}
          settings={adminSettings} onUpdateSettings={(v) => set({ adminSettings: v })}
          supportConversations={supportConversations}
          closedSupportConversations={closedSupportConversations}
          selectedSupportUser={selectedSupportUser}
          onSelectSupportUser={(v) => set({ selectedSupportUser: v })}
          onSendSupportMessage={handleSupportMessage}
          onCloseConversation={handleCloseSupportConversation}
          onReopenConversation={handleReopenSupportConversation}
          pendingTournaments={pendingTournaments}
          onApproveTournament={(id) => set({ pendingTournaments: pendingTournaments.map((t) => t.id === id ? { ...t, status: 'active' } : t) })}
          onRejectTournament={(id) => set({ pendingTournaments: pendingTournaments.filter((t) => t.id !== id) })}
        />
      )}

      {isOwnerPanelOpen && (
        <OwnerPanel
          isOpen={isOwnerPanelOpen} onClose={() => set({ isOwnerPanelOpen: false })}
          currentUserName={userName} currentUserRole={isOwner ? 'owner' : isAdmin ? 'admin' : 'moderator'}
          ownerUsers={ownerUsers} onUpdateOwnerUsers={setOwnerUsers}
          adminUsers={adminUsers} onUpdateAdminUsers={(v) => set({ adminUsers: v })}
          posts={adminPosts} onUpdatePosts={(v) => set({ adminPosts: v })}
          reports={adminReports} onUpdateReports={(v) => set({ adminReports: v })}
          settings={adminSettings} onUpdateSettings={(v) => set({ adminSettings: v })}
          activityLogs={activityLogs}
          supportConversations={supportConversations}
          closedSupportConversations={closedSupportConversations}
          selectedSupportUser={selectedSupportUser}
          onSelectSupportUser={(v) => set({ selectedSupportUser: v })}
          onSendSupportMessage={handleSupportMessage}
          onCloseConversation={handleCloseSupportConversation}
          onReopenConversation={handleReopenSupportConversation}
          pendingTournaments={pendingTournaments}
          onApproveTournament={(id) => set({ pendingTournaments: pendingTournaments.map((t) => t.id === id ? { ...t, status: 'active' } : t) })}
          onRejectTournament={(id) => set({ pendingTournaments: pendingTournaments.filter((t) => t.id !== id) })}
          activeTab={adminTab} onTabChange={(v) => set({ adminTab: v })}
        />
      )}

      {isColorPickerOpen && (
        <ColorPickerModal
          isOpen={isColorPickerOpen} onClose={() => set({ isColorPickerOpen: false })}
          currentColor={userNameColor}
          onSave={(v) => { setUserNameColor(v); set({ isColorPickerOpen: false }) }}
        />
      )}

      {isBackgroundPickerOpen && (
        <BackgroundPickerModal
          isOpen={isBackgroundPickerOpen} onClose={() => set({ isBackgroundPickerOpen: false })}
          currentBackground={userProfileBackground}
          onSave={(v) => { setUserProfileBackground(v); set({ isBackgroundPickerOpen: false }) }}
        />
      )}

      {isPostBackgroundPickerOpen && (
        <BackgroundPickerModal
          isOpen={isPostBackgroundPickerOpen} onClose={() => set({ isPostBackgroundPickerOpen: false })}
          currentBackground={userPostBackground}
          onSave={(v) => { setUserPostBackground(v); set({ isPostBackgroundPickerOpen: false }) }}
        />
      )}

      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen} onClose={() => set({ isReportModalOpen: false })}
          postId={reportPostId} author={reportAuthor} content={reportContent}
          onSubmitReport={(postId, author, reason, details) => {
            const newReport = { id: adminReports.length + 1, type: 'post', reportedUser: author, reportedBy: isLoggedIn ? userName : 'Anonymous', reason, post: `Post #${postId}`, postContent: reportContent, details, date: new Date().toLocaleString(), status: 'pending' }
            set({ adminReports: [newReport, ...adminReports], isReportModalOpen: false })
            toast.success('Report submitted!')
          }}
        />
      )}

      {isReportProfileModalOpen && selectedUserProfile && (
        <ReportProfileModal
          isOpen={isReportProfileModalOpen} onClose={() => set({ isReportProfileModalOpen: false })}
          username={selectedUserProfile?.username || selectedUserProfile?.name || ''}
          avatarUrl={selectedUserProfile?.avatar}
          onSubmitReport={() => { set({ isReportProfileModalOpen: false }); toast.success('Profile report submitted!') }}
        />
      )}

      {isRiotSyncOpen && (
        <RiotSyncWrapper onClose={() => set({ isRiotSyncOpen: false })} />
      )}

      {isTournamentDetailsOpen && selectedTournamentId !== null && (
        <TournamentDetails
          tournamentId={selectedTournamentId}
          onClose={() => set({ isTournamentDetailsOpen: false })}
          userName={userName}
          onTournamentWin={(prizeAmount, tournamentName) => {
            set({ userTournamentEarnings: prizeAmount, userTournamentName: tournamentName })
            if (typeof window !== 'undefined') {
              localStorage.setItem('finderq_tournament_earnings', prizeAmount.toString())
              localStorage.setItem('finderq_tournament_name', tournamentName)
            }
          }}
        />
      )}

      {isCreateTournamentOpen && (
        <CreateTournamentModal
          onClose={() => set({ isCreateTournamentOpen: false })}
          onCreateTournament={(tournament) => {
            set({ pendingTournaments: [...pendingTournaments, { ...tournament, id: Date.now(), status: 'pending', createdBy: userName }], isCreateTournamentOpen: false })
            toast.success('Tournament submitted for review!')
          }}
          organizerName={userName}
          organizerAvatar={userAvatar}
        />
      )}

      {isBannedModalOpen && <BannedAccountModal isOpen={isBannedModalOpen} onClose={() => set({ isBannedModalOpen: false })} />}
      {isPrivacyPolicyOpen && <PrivacyPolicyModal isOpen={isPrivacyPolicyOpen} onClose={() => set({ isPrivacyPolicyOpen: false })} />}
      {isTermsOpen && <TermsModal isOpen={isTermsOpen} onClose={() => set({ isTermsOpen: false })} />}
      {isAboutModalOpen && <AboutModal isOpen={isAboutModalOpen} onClose={() => set({ isAboutModalOpen: false })} />}
      {isContactModalOpen && <ContactModal isOpen={isContactModalOpen} onClose={() => set({ isContactModalOpen: false })} />}

      <LanguageSelector selectedLanguage={selectedLanguage} onLanguageChange={setSelectedLanguage} />
    </div>
  )
}
