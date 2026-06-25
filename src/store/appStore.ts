// @ts-nocheck
import { create } from 'zustand'
import { initialAdminUsers, initialAdminPosts, initialAdminReports, initialAdminSettings, defaultOwnerUsers } from '@/utils/adminData'
import { demoPosts } from '@/utils/demoPosts'

export type UserStatus = 'online' | 'busy' | 'offline'
export type AdminTab = 'dashboard' | 'users' | 'posts' | 'reports' | 'support' | 'tournaments'
export type LanguageCode = string

export interface Friend {
  username: string
  initials: string
  color: string
  lastMessage?: string
  unreadCount?: number
  isOnline?: boolean
}

export interface Notification {
  id: number
  type: 'message' | 'warn' | 'verification' | 'tournament' | 'friend' | 'ban' | 'system'
  title: string
  message: string
  time: string
  read: boolean
}

export interface Post {
  id: number
  initials: string
  color: string
  username: string
  time: string
  content: string
  tags: { text: string; bg: string; color: string }[]
  riotVerified?: boolean
  language?: string
  userLanguages?: string[]
  avatar?: string
  banner?: string
  joinDate?: string
  userNameColor?: string
  userProfileBackground?: string
  userPostBackground?: string
  isPremium?: boolean
  userPostBorder?: string
  tournamentEarnings?: number
  tournamentName?: string
  image?: string
  imageZoom?: number
  imagePositionX?: number
  imagePositionY?: number
  rank?: string
  lp?: number
}

function getLS(key: string, fallback: string = '') {
  if (typeof window === 'undefined') return fallback
  return localStorage.getItem(key) ?? fallback
}
function setLS(key: string, val: string) {
  if (typeof window !== 'undefined') localStorage.setItem(key, val)
}

interface AppState {
  // UI
  currentPage: string
  selectedRegion: string
  searchQuery: string
  isRegionDropdownOpen: boolean

  // Auth
  isLoggedIn: boolean
  userName: string
  userEmail: string
  userRegion: string
  userAvatar: string
  userBanner: string
  userJoinDate: string
  isAdmin: boolean
  isModerator: boolean
  isOwner: boolean
  rememberMe: boolean
  userStatus: UserStatus

  // User prefs
  selectedLanguage: string
  userLanguage: string
  userAccountLanguage: string
  userNameColor: string
  userProfileBackground: string
  userPostBackground: string
  postBorder: string
  hasPremium: boolean

  // Riot
  riotAccountLinked: boolean
  riotProfileData: any
  riotDataIsReal: boolean
  riotSummonerName: string
  riotSelectedRegion: 'euw' | 'eune'
  riotLinkedRegion: 'euw' | 'eune' | null
  userRank: string | null
  userRole: string | null
  seasonRanks: any[]
  publicProfileSeasonRanks: any[]

  // Post form
  showPostForm: boolean
  postContent: string
  postImage: string
  tempPostImage: string
  imageZoom: number
  imagePositionX: number
  imagePositionY: number
  selectedRanks: string[]
  selectedRoles: string[]
  selectedTypes: string[]
  lastPostTime: number
  postCooldownRemaining: number

  // Wallet
  walletBalance: number
  userTournamentEarnings: number
  userTournamentName: string

  // Posts per region
  postsEUW: Post[]
  postsEUNE: Post[]
  postsNA: Post[]
  postsKR: Post[]
  postsBR: Post[]
  postsLANLAS: Post[]
  postsOCE: Post[]
  postsTR: Post[]
  postsJP: Post[]
  postsMESEA: Post[]

  // Notifications
  notifications: Notification[]
  isNotificationPanelOpen: boolean

  // Friends & messages
  friends: Friend[]
  openThreadRequest: { username: string; initials: string; color: string } | null

  // Modals open state
  isSignUpOpen: boolean
  isLoginOpen: boolean
  isProfileOpen: boolean
  isPremiumOpen: boolean
  isWalletOpen: boolean
  isAdminPanelOpen: boolean
  isOwnerPanelOpen: boolean
  isColorPickerOpen: boolean
  isBackgroundPickerOpen: boolean
  isPostBackgroundPickerOpen: boolean
  isRiotSyncOpen: boolean
  isPublicProfileOpen: boolean
  isReportModalOpen: boolean
  isReportProfileModalOpen: boolean
  isBannedModalOpen: boolean
  isPrivacyPolicyOpen: boolean
  isTermsOpen: boolean
  isAboutModalOpen: boolean
  isContactModalOpen: boolean
  isForgotPasswordOpen: boolean
  isGoogleNamePromptOpen: boolean
  isVerificationOpen: boolean
  isTournamentDetailsOpen: boolean
  isCreateTournamentOpen: boolean
  isSupportChatOpen: boolean
  isSupportMinimized: boolean

  // Report modal data
  reportPostId: number
  reportAuthor: string
  reportContent: string

  // Profile viewing
  selectedUserProfile: any
  activePublicProfileTab: 'overview' | 'reputation'

  // Login/signup form state
  loginEmail: string
  loginPassword: string
  signUpUsername: string
  signUpEmail: string
  signUpPassword: string
  signUpRegion: string
  signUpLanguage: string
  agreedToTerms: boolean
  agreedToPrivacy: boolean
  forgotPasswordEmail: string
  forgotPasswordSent: boolean
  googleEmail: string
  googleUsername: string
  isGoogleSignUp: boolean
  verificationEmail: string
  verificationCode: string
  enteredCode: string
  pendingUserData: any
  isFromGoogle: boolean

  // Tournament
  selectedTournamentId: number | null
  selectedTournamentStatus: string
  pendingTournaments: any[]

  // Admin/Owner
  adminUsers: any[]
  adminPosts: any[]
  adminReports: any[]
  adminSettings: any
  ownerUsers: any[]
  activityLogs: any[]
  adminTab: AdminTab

  // Support
  supportConversations: Record<string, any[]>
  selectedSupportUser: string | null
  closedSupportConversations: Set<string>
  supportInputMessage: string

  // Actions
  set: (partial: Partial<AppState>) => void
  setCurrentPage: (page: string) => void
  setSelectedRegion: (region: string) => void
  setIsLoggedIn: (v: boolean) => void
  setUserName: (v: string) => void
  setUserEmail: (v: string) => void
  setUserStatus: (v: UserStatus) => void
  setSelectedLanguage: (v: string) => void
  setUserNameColor: (v: string) => void
  setUserProfileBackground: (v: string) => void
  setUserPostBackground: (v: string) => void
  setHasPremium: (v: boolean) => void
  setWalletBalance: (updater: ((prev: number) => number) | number) => void
  addPost: (region: string, post: Post) => void
  deletePost: (postId: number) => void
  setOwnerUsers: (updater: any) => void
  addNotification: (n: Notification) => void
  markNotificationRead: (id: number) => void
  markAllNotificationsRead: () => void
  clearAllNotifications: () => void
  addFriend: (f: Friend) => void
  removeFriend: (username: string) => void
  handleSupportMessage: (userId: string, message: any) => void
  handleCloseSupportConversation: (userId: string) => void
  handleReopenSupportConversation: (userId: string) => void
  handleStartNewSupportConversation: () => void
  logout: () => void
  openModal: (modal: string) => void
  closeModal: (modal: string) => void
  initFromLocalStorage: () => void
}

const defaultNotifications: Notification[] = [
  { id: 1, type: 'message', title: 'New Message', message: 'ShadowKnight sent you a message about duo queue: "Hey! I saw your post looking for a duo partner. I\'m Gold II ADC main, peak Platinum IV last season."', time: 'acum 2 min', read: false },
  { id: 2, type: 'warn', title: 'Warning Received', message: 'You have received a warning for inappropriate language in chat. This is your first warning. Please review our community guidelines.', time: 'acum 10 min', read: false },
  { id: 3, type: 'verification', title: 'Riot Verified', message: 'Congratulations! Your account has been successfully verified by Riot Games! Your profile now displays the official Riot Verified badge.', time: 'acum 15 min', read: false },
  { id: 4, type: 'tournament', title: 'Tournament Starting Soon', message: 'Spring Championship 2026 starts in 30 minutes! Please ensure you are ready and have checked in. Prize pool: €5,000.', time: 'acum 1 oră', read: false },
  { id: 5, type: 'friend', title: 'New Connection', message: 'ProPlayer99 accepted your friend request. You can now see their online status and send them direct messages.', time: 'acum 3 ore', read: true },
  { id: 6, type: 'ban', title: 'Account Suspended - 24 Hours', message: 'Your account has been temporarily suspended for 24 hours due to multiple community guideline violations.', time: 'acum 1 zi', read: true },
  { id: 7, type: 'system', title: 'System Update - New Features', message: 'FinderQ has been updated with exciting new features! Enhanced notification system, improved tournament bracket visualization.', time: 'acum 2 zile', read: true },
]

const defaultFriends: Friend[] = [
  { username: 'ShadowADC', initials: 'SA', color: 'from-blue-500 to-cyan-500', lastMessage: 'gg wp bro, let\'s play again!', unreadCount: 2, isOnline: true },
  { username: 'IronWolf99', initials: 'IW', color: 'from-red-500 to-orange-500', lastMessage: 'u free for clash this weekend?', unreadCount: 0, isOnline: true },
  { username: 'NightOwlTop', initials: 'NO', color: 'from-purple-500 to-pink-500', lastMessage: 'that was a crazy game lol', unreadCount: 1, isOnline: false },
  { username: 'MidLaneMaster', initials: 'MM', color: 'from-yellow-500 to-amber-500', lastMessage: 'need a support for ranked', unreadCount: 0, isOnline: true },
  { username: 'JungleKing88', initials: 'JK', color: 'from-green-500 to-emerald-500', lastMessage: 'gank bot next plz', unreadCount: 3, isOnline: false },
]

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'about',
  selectedRegion: 'EUW',
  searchQuery: '',
  isRegionDropdownOpen: false,

  isLoggedIn: false,
  userName: '',
  userEmail: '',
  userRegion: 'euw',
  userAvatar: '',
  userBanner: '',
  userJoinDate: '',
  isAdmin: false,
  isModerator: false,
  isOwner: false,
  rememberMe: false,
  userStatus: 'online',

  selectedLanguage: 'en',
  userLanguage: 'en',
  userAccountLanguage: 'en',
  userNameColor: 'from-blue-500 to-indigo-500',
  userProfileBackground: 'from-[#0a0e27] via-[#1a1d29] to-[#0a0e27]',
  userPostBackground: 'from-[#1a1d29] to-[#242836]',
  postBorder: 'default',
  hasPremium: false,

  riotAccountLinked: false,
  riotProfileData: null,
  riotDataIsReal: false,
  riotSummonerName: '',
  riotSelectedRegion: 'euw',
  riotLinkedRegion: null,
  userRank: null,
  userRole: null,
  seasonRanks: [],
  publicProfileSeasonRanks: [],

  showPostForm: false,
  postContent: '',
  postImage: '',
  tempPostImage: '',
  imageZoom: 100,
  imagePositionX: 50,
  imagePositionY: 50,
  selectedRanks: [],
  selectedRoles: [],
  selectedTypes: [],
  lastPostTime: 0,
  postCooldownRemaining: 0,

  walletBalance: 1250.50,
  userTournamentEarnings: 0,
  userTournamentName: '',

  postsEUW: demoPosts.EUW,
  postsEUNE: demoPosts.EUNE,
  postsNA: demoPosts.NA,
  postsKR: demoPosts.KR,
  postsBR: demoPosts.BR,
  postsLANLAS: demoPosts.LANLAS,
  postsOCE: demoPosts.OCE,
  postsTR: demoPosts.TR,
  postsJP: demoPosts.JP,
  postsMESEA: demoPosts.MESEA,

  notifications: defaultNotifications,
  isNotificationPanelOpen: false,

  friends: defaultFriends,
  openThreadRequest: null,

  isSignUpOpen: false,
  isLoginOpen: false,
  isProfileOpen: false,
  isPremiumOpen: false,
  isWalletOpen: false,
  isAdminPanelOpen: false,
  isOwnerPanelOpen: false,
  isColorPickerOpen: false,
  isBackgroundPickerOpen: false,
  isPostBackgroundPickerOpen: false,
  isRiotSyncOpen: false,
  isPublicProfileOpen: false,
  isReportModalOpen: false,
  isReportProfileModalOpen: false,
  isBannedModalOpen: false,
  isPrivacyPolicyOpen: false,
  isTermsOpen: false,
  isAboutModalOpen: false,
  isContactModalOpen: false,
  isForgotPasswordOpen: false,
  isGoogleNamePromptOpen: false,
  isVerificationOpen: false,
  isTournamentDetailsOpen: false,
  isCreateTournamentOpen: false,
  isSupportChatOpen: false,
  isSupportMinimized: false,

  reportPostId: 0,
  reportAuthor: '',
  reportContent: '',

  selectedUserProfile: null,
  activePublicProfileTab: 'overview',

  loginEmail: '',
  loginPassword: '',
  signUpUsername: '',
  signUpEmail: '',
  signUpPassword: '',
  signUpRegion: 'euw',
  signUpLanguage: '',
  agreedToTerms: false,
  agreedToPrivacy: false,
  forgotPasswordEmail: '',
  forgotPasswordSent: false,
  googleEmail: '',
  googleUsername: '',
  isGoogleSignUp: true,
  verificationEmail: '',
  verificationCode: '',
  enteredCode: '',
  pendingUserData: null,
  isFromGoogle: false,

  selectedTournamentId: null,
  selectedTournamentStatus: 'registration',
  pendingTournaments: [],

  adminUsers: initialAdminUsers,
  adminPosts: initialAdminPosts,
  adminReports: initialAdminReports,
  adminSettings: initialAdminSettings,
  ownerUsers: defaultOwnerUsers,
  activityLogs: [
    { id: 1, user: 'AdminUser', action: 'banned user', target: 'ToxicPlayer', timestamp: '2026-01-06 10:30', role: 'admin' },
    { id: 2, user: 'ModUser', action: 'deleted post', target: 'Post #42', timestamp: '2026-01-06 09:15', role: 'moderator' },
    { id: 3, user: 'AdminUser', action: 'resolved report', target: 'Report #12', timestamp: '2026-01-06 08:45', role: 'admin' },
    { id: 4, user: 'ModUser', action: 'warned user', target: 'ToxicUser', timestamp: '2026-01-05 16:20', role: 'moderator' },
    { id: 5, user: 'AdminUser', action: 'promoted user', target: 'ModUser to Moderator', timestamp: '2025-12-15 14:00', role: 'admin' },
  ],
  adminTab: 'dashboard',

  supportConversations: {},
  selectedSupportUser: null,
  closedSupportConversations: new Set(),
  supportInputMessage: '',

  set: (partial) => set(partial as any),

  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedRegion: (region) => set({ selectedRegion: region }),

  setIsLoggedIn: (v) => set({ isLoggedIn: v }),
  setUserName: (v) => set({ userName: v }),
  setUserEmail: (v) => set({ userEmail: v }),
  setUserStatus: (v) => {
    set({ userStatus: v })
    setLS('userStatus', v)
  },
  setSelectedLanguage: (v) => {
    set({ selectedLanguage: v, userLanguage: v })
    setLS('finderq_language', v)
  },
  setUserNameColor: (v) => {
    set({ userNameColor: v })
    setLS('finderq_username_color', v)
  },
  setUserProfileBackground: (v) => {
    set({ userProfileBackground: v })
    setLS('finderq_profile_background', v)
  },
  setUserPostBackground: (v) => {
    set({ userPostBackground: v })
    setLS('finderq_post_background', v)
  },
  setHasPremium: (v) => {
    set({ hasPremium: v })
    setLS('finderq_premium', v.toString())
  },
  setWalletBalance: (updater) => {
    const current = get().walletBalance
    const next = typeof updater === 'function' ? updater(current) : updater
    set({ walletBalance: next })
    setLS('finderq_wallet_balance', next.toString())
  },

  addPost: (region, post) => {
    const regionMap: Record<string, keyof AppState> = {
      EUW: 'postsEUW', EUNE: 'postsEUNE', NA: 'postsNA', KR: 'postsKR',
      BR: 'postsBR', 'LAN/LAS': 'postsLANLAS', OCE: 'postsOCE',
      TR: 'postsTR', JP: 'postsJP', 'ME/SEA': 'postsMESEA',
    }
    const key = regionMap[region]
    if (key) {
      set((state: any) => ({ [key]: [post, ...state[key]] }))
    }
  },

  deletePost: (postId) => {
    const filter = (arr: Post[]) => arr.filter(p => p.id !== postId)
    set(state => ({
      postsEUW: filter(state.postsEUW), postsEUNE: filter(state.postsEUNE),
      postsNA: filter(state.postsNA), postsKR: filter(state.postsKR),
      postsBR: filter(state.postsBR), postsLANLAS: filter(state.postsLANLAS),
      postsOCE: filter(state.postsOCE), postsTR: filter(state.postsTR),
      postsJP: filter(state.postsJP), postsMESEA: filter(state.postsMESEA),
    }))
  },

  setOwnerUsers: (updater) => {
    const current = get().ownerUsers
    const next = typeof updater === 'function' ? updater(current) : updater
    set({ ownerUsers: next })
    setLS('finderq_owner_users', JSON.stringify(next))
  },

  addNotification: (n) => set(state => ({ notifications: [n, ...state.notifications] })),
  markNotificationRead: (id) => set(state => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  markAllNotificationsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  clearAllNotifications: () => set({ notifications: [], isNotificationPanelOpen: false }),

  addFriend: (f) => set(state => ({
    friends: state.friends.find(fr => fr.username === f.username) ? state.friends : [...state.friends, f]
  })),
  removeFriend: (username) => set(state => ({
    friends: state.friends.filter(f => f.username !== username)
  })),

  handleSupportMessage: (userId, message) => set(state => ({
    supportConversations: {
      ...state.supportConversations,
      [userId]: [...(state.supportConversations[userId] || []), message]
    }
  })),

  handleCloseSupportConversation: (userId) => {
    const state = get()
    const closedMsg = {
      id: (state.supportConversations[userId]?.length || 0) + 1,
      sender: 'support' as const,
      senderName: 'System',
      content: 'This conversation has been closed by support. If you need further assistance, please contact us again.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const newClosed = new Set(state.closedSupportConversations)
    newClosed.add(userId)
    set({
      closedSupportConversations: newClosed,
      supportConversations: {
        ...state.supportConversations,
        [userId]: [...(state.supportConversations[userId] || []), closedMsg]
      }
    })
  },

  handleReopenSupportConversation: (userId) => {
    const state = get()
    const reopenMsg = {
      id: (state.supportConversations[userId]?.length || 0) + 1,
      sender: 'support' as const,
      senderName: 'System',
      content: 'This conversation has been reopened. How can we help you?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    const newClosed = new Set(state.closedSupportConversations)
    newClosed.delete(userId)
    set({
      closedSupportConversations: newClosed,
      supportConversations: {
        ...state.supportConversations,
        [userId]: [...(state.supportConversations[userId] || []), reopenMsg]
      }
    })
  },

  handleStartNewSupportConversation: () => {
    const { userName, closedSupportConversations } = get()
    if (!userName) return
    const newClosed = new Set(closedSupportConversations)
    newClosed.delete(userName)
    const welcomeMsg = {
      id: 1,
      sender: 'support' as const,
      senderName: 'FinderQ Support',
      content: `Hello ${userName}! Welcome back to FinderQ Support. How can we help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    set(state => ({
      closedSupportConversations: newClosed,
      supportConversations: { ...state.supportConversations, [userName]: [welcomeMsg] }
    }))
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('finderq_remember_me')
      localStorage.removeItem('finderq_saved_username')
      localStorage.removeItem('finderq_saved_email')
      localStorage.removeItem('finderq_saved_region')
    }
    set({
      isLoggedIn: false, userName: '', userEmail: '',
      isAdmin: false, isOwner: false, isModerator: false,
      rememberMe: false, currentPage: 'about', isProfileDropdownOpen: false,
    } as any)
  },

  openModal: (modal) => set({ [`is${modal}Open`]: true } as any),
  closeModal: (modal) => set({ [`is${modal}Open`]: false } as any),

  initFromLocalStorage: () => {
    if (typeof window === 'undefined') return
    const rememberMe = localStorage.getItem('finderq_remember_me') === 'true'
    const updates: Partial<AppState> = {
      selectedLanguage: getLS('finderq_language', 'en'),
      userAccountLanguage: getLS('finderq_account_language', 'en'),
      userNameColor: getLS('finderq_username_color', 'from-blue-500 to-indigo-500'),
      userProfileBackground: getLS('finderq_profile_background', 'from-[#0a0e27] via-[#1a1d29] to-[#0a0e27]'),
      userPostBackground: getLS('finderq_post_background', 'from-[#1a1d29] to-[#242836]'),
      postBorder: getLS('finderq_post_border', 'default'),
      hasPremium: getLS('finderq_premium') === 'true',
      userStatus: (getLS('userStatus', 'online') as UserStatus),
      walletBalance: parseFloat(getLS('finderq_wallet_balance', '1250.50')),
      userTournamentEarnings: parseFloat(getLS('finderq_tournament_earnings', '0')),
      userTournamentName: getLS('finderq_tournament_name', ''),
      lastPostTime: parseInt(getLS('finderq_last_post_time', '0')),
      postImage: getLS('finderq_post_image', ''),
      tempPostImage: getLS('finderq_post_image', ''),
      imageZoom: parseInt(getLS('finderq_post_image_zoom', '100')),
      imagePositionX: parseInt(getLS('finderq_post_image_x', '50')),
      imagePositionY: parseInt(getLS('finderq_post_image_y', '50')),
    }
    if (rememberMe) {
      updates.isLoggedIn = true
      updates.userName = getLS('finderq_saved_username')
      updates.userEmail = getLS('finderq_saved_email')
      updates.userRegion = getLS('finderq_saved_region', 'euw')
      updates.rememberMe = true
    }
    try {
      const savedOwner = localStorage.getItem('finderq_owner_users')
      if (savedOwner) updates.ownerUsers = JSON.parse(savedOwner)
    } catch {}
    set(updates as any)
  },

  // Extra state needed
  isProfileDropdownOpen: false,
}))
