// @ts-nocheck
'use client'
import { useEffect, useCallback } from 'react'
import { useAppStore } from '@/store/appStore'
import { NavBar } from './NavBar'
import { LanguageSelector } from '@/components/LanguageSelector'
import { AboutPage } from '@/components/AboutPage'
import { RegionPage } from '@/components/RegionPage'
import { GuestWall } from '@/components/GuestWall'
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
import { BorderPickerModal } from '@/components/BorderPickerModal'
import { PrivacyPolicyModal } from '@/components/PrivacyPolicyModal'
import { TermsModal } from '@/components/TermsModal'
import { AboutModal } from '@/components/AboutModal'
import { ContactModal } from '@/components/ContactModal'
import { Tournaments } from '@/components/Tournaments'
import { TournamentDetails } from '@/components/TournamentDetails'
import { CreateTournamentModal } from '@/components/CreateTournamentModal'
import { MediaPage } from '@/components/MediaPage'
import { ChallengesPage } from '@/components/ChallengesPage'
import { useOnlinePresence } from '@/hooks/useOnlinePresence'
import { usePostActions } from '@/hooks/usePostActions'
import { useTranslation } from '@/hooks/useTranslation'
import { translations, LanguageCode } from '@/utils/translations'
import { toast } from 'sonner'

const REGION_PAGES = ['euw', 'eune', 'na', 'kr', 'br', 'lan_las', 'oce', 'tr', 'jp', 'me_sea']
const REGION_LABELS: Record<string, string> = {
  euw: 'EUW', eune: 'EUNE', na: 'NA', kr: 'KR', br: 'BR',
  lan_las: 'LAN/LAS', oce: 'OCE', tr: 'TR', jp: 'JP', me_sea: 'ME/SEA',
}
const RESTRICTED = ['euw', 'eune', 'na', 'kr', 'br', 'tournaments', 'media', 'challenges']

function makeT(lang: string) {
  return (key: string): string => {
    const l = lang as LanguageCode
    return (translations[l] as any)?.[key] || (translations.en as any)[key] || key
  }
}

export function MainLayout() {
  const store = useAppStore()
  const { handleCreatePost } = usePostActions()
  const { isUserOnline, isUserBusy, getUserStatus } = useOnlinePresence(
    store.isLoggedIn ? store.userName : null
  )
  const { language } = useTranslation()
  const t = makeT(language)

  const {
    currentPage, isLoggedIn, userName, userEmail, userRegion,
    userAvatar, userBanner, userJoinDate, isAdmin, isOwner, isModerator,
    userNameColor, hasPremium, userStatus, walletBalance, userAccountLanguage,
    riotAccountLinked, riotProfileData, riotDataIsReal, riotSummonerName,
    riotSelectedRegion, riotLinkedRegion, userRank, userRole, seasonRanks,
    publicProfileSeasonRanks, showPostForm, postContent, postImage,
    imageZoom, imagePositionX, imagePositionY, selectedRanks, selectedRoles,
    selectedTypes, lastPostTime, postCooldownRemaining,
    userProfileBackground, userPostBackground, postBorder,
    userTournamentEarnings, userTournamentName,
    postsEUW, postsEUNE, postsNA, postsKR, postsBR, postsLANLAS, postsOCE, postsTR, postsJP, postsMESEA,
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
    googleEmail, googleUsername, isGoogleSignUp, verificationEmail,
    enteredCode, pendingUserData, selectedTournamentId, selectedTournamentStatus,
    pendingTournaments, adminUsers, adminPosts, adminReports, adminSettings, ownerUsers,
    activityLogs, adminTab, supportConversations, selectedSupportUser, closedSupportConversations,
    supportInputMessage, selectedLanguage,
    set, logout, markNotificationRead, markAllNotificationsRead, clearAllNotifications,
    addFriend, removeFriend, deletePost, setOwnerUsers, handleSupportMessage,
    handleCloseSupportConversation, handleReopenSupportConversation,
    handleStartNewSupportConversation, setUserName, setUserEmail, setUserNameColor,
    setUserProfileBackground, setUserPostBackground, setHasPremium, setWalletBalance,
    setUserStatus, setSelectedLanguage,
  } = store

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasPremium && lastPostTime > 0) {
        const remaining = Math.max(0, 10 * 60 * 1000 - (Date.now() - lastPostTime))
        set({ postCooldownRemaining: remaining })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [hasPremium, lastPostTime, set])

  const getPostsForPage = (page: string) => {
    const map: Record<string, any[]> = {
      euw: postsEUW, eune: postsEUNE, na: postsNA, kr: postsKR, br: postsBR,
      lan_las: postsLANLAS, oce: postsOCE, tr: postsTR, jp: postsJP, me_sea: postsMESEA,
    }
    return map[page] || postsEUW
  }

  const getFilteredPosts = (page: string) => {
    const posts = getPostsForPage(page)
    if (!selectedLanguage || selectedLanguage === 'all') return posts
    return posts.filter((p: any) =>
      !p.userLanguages || p.userLanguages.includes(selectedLanguage) || p.language === selectedLanguage
    )
  }

  const isRestricted = (page: string) => RESTRICTED.includes(page) && !isLoggedIn

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

  const guestWall = (page: string) => (
    <GuestWall currentPage={page} isLoggedIn={isLoggedIn} onSignUp={() => set({ isSignUpOpen: true })} onLogin={() => set({ isLoginOpen: true })} />
  )

  return (
    <div className="min-h-screen bg-[#0a0e27] text-white" onClick={() => set({ isRegionDropdownOpen: false, isProfileDropdownOpen: false } as any)}>
      <NavBar />

      <main className="">
        {currentPage === 'about' && (
          <AboutPage onGetStarted={() => set({ isSignUpOpen: true })} language={selectedLanguage} />
        )}

        {REGION_PAGES.includes(currentPage) && (
          isRestricted(currentPage) ? guestWall(currentPage) : (
            <RegionPage
              region={REGION_LABELS[currentPage] as any}
              currentPage={currentPage}
              showPostForm={showPostForm}
              setShowPostForm={(v: boolean) => set({ showPostForm: v })}
              postContent={postContent}
              setPostContent={(v: string) => set({ postContent: v })}
              postImage={postImage}
              setPostImage={(v: string) => { set({ postImage: v, tempPostImage: v }); if (typeof window !== 'undefined') localStorage.setItem('finderq_post_image', v) }}
              selectedRanks={selectedRanks}
              setSelectedRanks={(v: string[]) => set({ selectedRanks: v })}
              selectedRoles={selectedRoles}
              setSelectedRoles={(v: string[]) => set({ selectedRoles: v })}
              selectedTypes={selectedTypes}
              setSelectedTypes={(v: string[]) => set({ selectedTypes: v })}
              handleCreatePost={handleCreatePost}
              filteredPosts={getFilteredPosts(currentPage)}
              onProfileClick={(p: any) => set({ isPublicProfileOpen: true, selectedUserProfile: p })}
              onMessageClick={(username: string, initials: string, color: string) => { addFriend({ username, initials, color }); set({ openThreadRequest: { username, initials, color } }) }}
              onReportClick={(postId: number, author: string, content: string) => set({ isReportModalOpen: true, reportPostId: postId, reportAuthor: author, reportContent: content })}
              riotAccountLinked={riotAccountLinked}
              userRank={userRank}
              userName={userName}
              userStatus={userStatus}
              getUserStatus={getUserStatus}
              postCooldownRemaining={postCooldownRemaining}
              hasPremium={hasPremium}
              userPostBackground={userPostBackground}
              setIsPostBackgroundPickerOpen={(v: boolean) => set({ isPostBackgroundPickerOpen: v })}
            />
          )
        )}

        {currentPage === 'tournaments' && (
          isRestricted(currentPage) ? guestWall(currentPage) : (
            <Tournaments
              onCreateTournament={() => set({ isCreateTournamentOpen: true })}
              onViewTournament={(id: number, status?: string) => set({ selectedTournamentId: id, selectedTournamentStatus: status || 'registration', isTournamentDetailsOpen: true })}
            />
          )
        )}

        {currentPage === 'media' && (
          isRestricted(currentPage) ? guestWall(currentPage) : (
            <MediaPage
              isLoggedIn={isLoggedIn} userName={userName} hasPremium={hasPremium}
              userAvatar={userAvatar} userNameColor={userNameColor}
              selectedLanguage={selectedLanguage} userAccountLanguage={userAccountLanguage}
            />
          )
        )}

        {currentPage === 'challenges' && (
          isRestricted(currentPage) ? guestWall(currentPage) : (
            <ChallengesPage
              isLoggedIn={isLoggedIn} userName={userName} hasPremium={hasPremium}
              onUpgradePremium={() => set({ isPremiumOpen: true })}
            />
          )
        )}
      </main>

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
          onFriendClick={(username: string, initials: string, color: string) => set({ openThreadRequest: { username, initials, color } })}
          onRemoveFriend={removeFriend}
          openThreadRequest={openThreadRequest}
          onClearThreadRequest={() => set({ openThreadRequest: null })}
        />
      )}

      {/* Support */}
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
        onInputChange={(v: string) => set({ supportInputMessage: v })}
        onSelectUser={(v: string) => set({ selectedSupportUser: v })}
        onCloseConversation={handleCloseSupportConversation}
        onReopenConversation={handleReopenSupportConversation}
        onLoginClick={() => set({ isLoginOpen: true })}
      />

      {/* Auth Modals */}
      {isSignUpOpen && (
        <SignUpModal
          isOpen={isSignUpOpen} onClose={() => set({ isSignUpOpen: false })} t={t}
          signUpUsername={signUpUsername} setSignUpUsername={(v: string) => set({ signUpUsername: v })}
          signUpEmail={signUpEmail} setSignUpEmail={(v: string) => set({ signUpEmail: v })}
          signUpPassword={signUpPassword} setSignUpPassword={(v: string) => set({ signUpPassword: v })}
          signUpLanguage={signUpLanguage} setSignUpLanguage={(v: string) => set({ signUpLanguage: v })}
          agreedToTerms={agreedToTerms} setAgreedToTerms={(v: boolean) => set({ agreedToTerms: v })}
          agreedToPrivacy={agreedToPrivacy} setAgreedToPrivacy={(v: boolean) => set({ agreedToPrivacy: v })}
          onOpenTerms={() => set({ isTermsOpen: true })}
          onOpenPrivacyPolicy={() => set({ isPrivacyPolicyOpen: true })}
          onOpenLogin={() => set({ isSignUpOpen: false, isLoginOpen: true })}
          setVerificationCode={(v: string) => set({ verificationCode: v })}
          setVerificationEmail={(v: string) => set({ verificationEmail: v })}
          setIsFromGoogle={(v: boolean) => set({ isFromGoogle: v })}
          setPendingUserData={(v: any) => set({ pendingUserData: v })}
          setIsVerificationOpen={(v: boolean) => set({ isVerificationOpen: v })}
          setGoogleEmail={(v: string) => set({ googleEmail: v })}
          setIsGoogleSignUp={(v: boolean) => set({ isGoogleSignUp: v })}
          setIsGoogleNamePromptOpen={(v: boolean) => set({ isGoogleNamePromptOpen: v })}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          isOpen={isLoginOpen} onClose={() => set({ isLoginOpen: false })} t={t}
          loginEmail={loginEmail} setLoginEmail={(v: string) => set({ loginEmail: v })}
          loginPassword={loginPassword} setLoginPassword={(v: string) => set({ loginPassword: v })}
          rememberMe={store.rememberMe} setRememberMe={(v: any) => set({ rememberMe: typeof v === 'function' ? v(store.rememberMe) : v })}
          adminUsers={adminUsers} ownerUsers={ownerUsers}
          onOpenSignUp={() => set({ isLoginOpen: false, isSignUpOpen: true })}
          onOpenForgotPassword={() => set({ isLoginOpen: false, isForgotPasswordOpen: true })}
          setForgotPasswordEmail={(v: string) => set({ forgotPasswordEmail: v })}
          setForgotPasswordSent={(v: boolean) => set({ forgotPasswordSent: v })}
          setIsBannedModalOpen={(v: boolean) => set({ isBannedModalOpen: v })}
          setVerificationCode={(v: string) => set({ verificationCode: v })}
          setVerificationEmail={(v: string) => set({ verificationEmail: v })}
          setIsFromGoogle={(v: boolean) => set({ isFromGoogle: v })}
          setPendingUserData={(v: any) => set({ pendingUserData: v })}
          setIsVerificationOpen={(v: boolean) => set({ isVerificationOpen: v })}
          setGoogleEmail={(v: string) => set({ googleEmail: v })}
          setIsGoogleSignUp={(v: boolean) => set({ isGoogleSignUp: v })}
          setIsGoogleNamePromptOpen={(v: boolean) => set({ isGoogleNamePromptOpen: v })}
          setIsLoggedIn={(v: boolean) => set({ isLoggedIn: v })}
          setUserName={setUserName}
          setUserEmail={setUserEmail}
          setIsAdmin={(v: boolean) => set({ isAdmin: v })}
          setIsOwner={(v: boolean) => set({ isOwner: v })}
          setIsModerator={(v: boolean) => set({ isModerator: v })}
          setUserRegion={(v: string) => set({ userRegion: v })}
          setUserAvatar={(v: string) => set({ userAvatar: v })}
          setUserJoinDate={(v: string) => set({ userJoinDate: v })}
          setIsLoginOpen={(v: boolean) => set({ isLoginOpen: v })}
        />
      )}

      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          isOpen={isForgotPasswordOpen} onClose={() => set({ isForgotPasswordOpen: false, forgotPasswordSent: false, forgotPasswordEmail: '' })}
          forgotPasswordEmail={forgotPasswordEmail} setForgotPasswordEmail={(v: string) => set({ forgotPasswordEmail: v })}
          forgotPasswordSent={forgotPasswordSent} setForgotPasswordSent={(v: boolean) => set({ forgotPasswordSent: v })}
          onBackToLogin={() => set({ isForgotPasswordOpen: false, isLoginOpen: true })}
        />
      )}

      {isGoogleNamePromptOpen && (
        <GoogleNamePromptModal
          isOpen={isGoogleNamePromptOpen} onClose={() => set({ isGoogleNamePromptOpen: false })}
          googleEmail={googleEmail} googleUsername={googleUsername}
          setGoogleUsername={(v: string) => set({ googleUsername: v })}
          isGoogleSignUp={isGoogleSignUp}
          setIsVerificationOpen={(v: boolean) => set({ isVerificationOpen: v })}
          setVerificationEmail={(v: string) => set({ verificationEmail: v })}
          setPendingUserData={(v: any) => set({ pendingUserData: v })}
          setIsGoogleNamePromptOpen={(v: boolean) => set({ isGoogleNamePromptOpen: v })}
          setIsLoggedIn={(v: boolean) => set({ isLoggedIn: v })}
          setUserName={setUserName}
        />
      )}

      {isVerificationOpen && (
        <EmailVerificationModal
          isOpen={isVerificationOpen} onClose={() => set({ isVerificationOpen: false })}
          verificationEmail={verificationEmail}
          verificationCode={enteredCode}
          setVerificationCode={(v: string) => set({ enteredCode: v })}
          pendingUserData={pendingUserData}
          isFromGoogle={store.isFromGoogle}
          onVerificationSuccess={(data: any) => handleRegister(data.username, data.email, data.password || '', signUpRegion)}
          setIsLoggedIn={(v: boolean) => set({ isLoggedIn: v })}
          setUserName={setUserName}
          setUserEmail={setUserEmail}
          setUserRegion={(v: string) => set({ userRegion: v })}
          setUserJoinDate={(v: string) => set({ userJoinDate: v })}
          setIsVerificationOpen={(v: boolean) => set({ isVerificationOpen: v })}
          ownerUsers={ownerUsers} setOwnerUsers={setOwnerUsers}
        />
      )}

      {/* Profile Modals */}
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
          setUserAvatar={(v: string) => set({ userAvatar: v })}
          setUserBanner={(v: string) => set({ userBanner: v })}
          setUserStatus={setUserStatus}
          setIsPremiumOpen={(v: boolean) => set({ isPremiumOpen: v })}
          setIsColorPickerOpen={(v: boolean) => set({ isColorPickerOpen: v })}
          setIsBackgroundPickerOpen={(v: boolean) => set({ isBackgroundPickerOpen: v })}
          setIsRiotSyncOpen={(v: boolean) => set({ isRiotSyncOpen: v })}
          setIsProfileOpen={(v: boolean) => set({ isProfileOpen: v })}
        />
      )}

      {isPublicProfileOpen && selectedUserProfile && (
        <PublicProfileModal
          isOpen={isPublicProfileOpen} onClose={() => set({ isPublicProfileOpen: false })}
          profile={selectedUserProfile}
          activeTab={activePublicProfileTab}
          onTabChange={(v: any) => set({ activePublicProfileTab: v })}
          publicProfileSeasonRanks={publicProfileSeasonRanks}
          isUserOnline={isUserOnline}
          onReportProfile={(username: string) => set({ isReportProfileModalOpen: true })}
          onMessageClick={(username: string, initials: string, color: string) => { addFriend({ username, initials, color }); set({ openThreadRequest: { username, initials, color }, isPublicProfileOpen: false }) }}
        />
      )}

      {isPremiumOpen && (
        <PremiumModal
          isOpen={isPremiumOpen} onClose={() => set({ isPremiumOpen: false })}
          userName={userName} userNameColor={userNameColor}
          setUserNameColor={setUserNameColor}
          hasPremium={hasPremium} walletBalance={walletBalance}
          setHasPremium={setHasPremium}
          setWalletBalance={setWalletBalance}
          onOpenWallet={() => set({ isPremiumOpen: false, isWalletOpen: true })}
        />
      )}

      {isWalletOpen && (
        <Wallet
          isOpen={isWalletOpen} onClose={() => set({ isWalletOpen: false })}
          username={userName} balance={walletBalance}
          onBalanceChange={(newBal: number) => setWalletBalance(newBal)}
        />
      )}

      {isAdminPanelOpen && (
        <AdminPanel
          isOpen={isAdminPanelOpen} onClose={() => set({ isAdminPanelOpen: false })}
          activeTab={adminTab} onTabChange={(v: any) => set({ adminTab: v })}
          users={adminUsers} onUpdateUsers={(v: any) => set({ adminUsers: v })}
          posts={adminPosts} onUpdatePosts={(v: any) => set({ adminPosts: v })}
          reports={adminReports} onUpdateReports={(v: any) => set({ adminReports: v })}
          settings={adminSettings} onUpdateSettings={(v: any) => set({ adminSettings: v })}
          supportConversations={supportConversations}
          closedSupportConversations={closedSupportConversations}
          selectedSupportUser={selectedSupportUser}
          onSelectSupportUser={(v: any) => set({ selectedSupportUser: v })}
          onSendSupportMessage={handleSupportMessage}
          onCloseConversation={handleCloseSupportConversation}
          onReopenConversation={handleReopenSupportConversation}
          pendingTournaments={pendingTournaments}
          onApproveTournament={(id: number) => set({ pendingTournaments: pendingTournaments.map((t: any) => t.id === id ? { ...t, status: 'active' } : t) })}
          onRejectTournament={(id: number) => set({ pendingTournaments: pendingTournaments.filter((t: any) => t.id !== id) })}
        />
      )}

      {isOwnerPanelOpen && (
        <OwnerPanel
          isOpen={isOwnerPanelOpen} onClose={() => set({ isOwnerPanelOpen: false })}
          currentUserName={userName} currentUserRole={isOwner ? 'owner' : isAdmin ? 'admin' : 'moderator'}
          ownerUsers={ownerUsers} onUpdateOwnerUsers={setOwnerUsers}
          adminUsers={adminUsers} onUpdateAdminUsers={(v: any) => set({ adminUsers: v })}
          posts={adminPosts} onUpdatePosts={(v: any) => set({ adminPosts: v })}
          reports={adminReports} onUpdateReports={(v: any) => set({ adminReports: v })}
          settings={adminSettings} onUpdateSettings={(v: any) => set({ adminSettings: v })}
          activityLogs={activityLogs}
          supportConversations={supportConversations}
          closedSupportConversations={closedSupportConversations}
          selectedSupportUser={selectedSupportUser}
          onSelectSupportUser={(v: any) => set({ selectedSupportUser: v })}
          onSendSupportMessage={handleSupportMessage}
          onCloseConversation={handleCloseSupportConversation}
          onReopenConversation={handleReopenSupportConversation}
          pendingTournaments={pendingTournaments}
          onApproveTournament={(id: number) => set({ pendingTournaments: pendingTournaments.map((t: any) => t.id === id ? { ...t, status: 'active' } : t) })}
          onRejectTournament={(id: number) => set({ pendingTournaments: pendingTournaments.filter((t: any) => t.id !== id) })}
          activeTab={adminTab} onTabChange={(v: any) => set({ adminTab: v })}
        />
      )}

      {isColorPickerOpen && (
        <ColorPickerModal
          isOpen={isColorPickerOpen} onClose={() => set({ isColorPickerOpen: false })}
          currentColor={userNameColor} onSave={(v: string) => { setUserNameColor(v); set({ isColorPickerOpen: false }) }}
        />
      )}

      {isBackgroundPickerOpen && (
        <BackgroundPickerModal
          isOpen={isBackgroundPickerOpen} onClose={() => set({ isBackgroundPickerOpen: false })}
          currentBackground={userProfileBackground}
          onSave={(v: string) => { setUserProfileBackground(v); set({ isBackgroundPickerOpen: false }) }}
        />
      )}

      {isPostBackgroundPickerOpen && (
        <BackgroundPickerModal
          isOpen={isPostBackgroundPickerOpen} onClose={() => set({ isPostBackgroundPickerOpen: false })}
          currentBackground={userPostBackground}
          onSave={(v: string) => { setUserPostBackground(v); set({ isPostBackgroundPickerOpen: false }) }}
        />
      )}

      {isReportModalOpen && (
        <ReportModal
          isOpen={isReportModalOpen} onClose={() => set({ isReportModalOpen: false })}
          postId={reportPostId} author={reportAuthor} content={reportContent}
          onSubmitReport={(postId: number, author: string, reason: string, details: string) => {
            const newReport = { id: adminReports.length + 1, type: 'post', reportedUser: author, reportedBy: isLoggedIn ? userName : 'Anonymous', reason, post: `Post #${postId}`, postContent: reportContent, details, date: new Date().toLocaleString(), status: 'pending' }
            set({ adminReports: [newReport, ...adminReports], isReportModalOpen: false })
            toast.success('Report submitted!')
          }}
        />
      )}

      {isReportProfileModalOpen && selectedUserProfile && (
        <ReportProfileModal
          isOpen={isReportProfileModalOpen} onClose={() => set({ isReportProfileModalOpen: false })}
          username={selectedUserProfile.username || selectedUserProfile.name || ''}
          avatarUrl={selectedUserProfile.avatar}
          onSubmitReport={(username: string, reason: string, details: string) => {
            set({ isReportProfileModalOpen: false }); toast.success('Profile report submitted!')
          }}
        />
      )}

      {isRiotSyncOpen && (
        <RiotAccountSyncModal
          isOpen={isRiotSyncOpen} onClose={() => set({ isRiotSyncOpen: false })}
          riotSummonerName={riotSummonerName} riotSelectedRegion={riotSelectedRegion}
          onSummonerNameChange={(v: string) => set({ riotSummonerName: v })}
          onRegionChange={(v: string) => set({ riotSelectedRegion: v as any })}
          setRiotProfileData={(v: any) => set({ riotProfileData: v })}
          setRiotAccountLinked={(v: boolean) => set({ riotAccountLinked: v })}
          setRiotLinkedRegion={(v: any) => set({ riotLinkedRegion: v })}
          setRiotDataIsReal={(v: boolean) => set({ riotDataIsReal: v })}
          setIsRiotSyncOpen={(v: boolean) => set({ isRiotSyncOpen: v })}
          setUserRank={(v: any) => set({ userRank: v })}
          setUserRole={(v: any) => set({ userRole: v })}
          setSeasonRanks={(v: any) => set({ seasonRanks: v })}
        />
      )}

      {isTournamentDetailsOpen && selectedTournamentId !== null && (
        <TournamentDetails
          tournamentId={selectedTournamentId}
          onClose={() => set({ isTournamentDetailsOpen: false })}
          userName={userName}
          onTournamentWin={(prizeAmount: number, tournamentName: string) => {
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
          onCreateTournament={(tournament: any) => {
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
