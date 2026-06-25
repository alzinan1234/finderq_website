// @ts-nocheck
'use client'
import { toast } from 'sonner'
import { useAppStore, Post } from '@/store/appStore'

const REGION_MAP: Record<string, string> = {
  eune: 'EUNE', euw: 'EUW', na: 'NA', kr: 'KR', br: 'BR',
  lan_las: 'LAN/LAS', oce: 'OCE', tr: 'TR', jp: 'JP', me_sea: 'ME/SEA',
}

function getCurrentPosts(page: string, state: any): Post[] {
  switch (page) {
    case 'eune': return state.postsEUNE
    case 'euw': return state.postsEUW
    case 'na': return state.postsNA
    case 'kr': return state.postsKR
    case 'br': return state.postsBR
    case 'lan_las': return state.postsLANLAS
    case 'oce': return state.postsOCE
    case 'tr': return state.postsTR
    case 'jp': return state.postsJP
    case 'me_sea': return state.postsMESEA
    default: return state.postsEUW
  }
}

export function usePostActions() {
  const store = useAppStore()

  const handleCreatePost = () => {
    const {
      postContent, currentPage, isLoggedIn, userName, hasPremium,
      lastPostTime, selectedRanks, selectedRoles, selectedTypes,
      riotAccountLinked, userRank, userRole, userAvatar, userBanner,
      userJoinDate, userNameColor, userProfileBackground, userPostBackground,
      userAccountLanguage, userLanguage, postImage, imageZoom, imagePositionX,
      imagePositionY, postBorder, userTournamentEarnings, userTournamentName,
      addPost, set,
    } = store

    if (!postContent.trim()) return

    if (!hasPremium) {
      const COOLDOWN = 10 * 60 * 1000
      const now = Date.now()
      if (now - lastPostTime < COOLDOWN) {
        const remaining = COOLDOWN - (now - lastPostTime)
        const mins = Math.ceil(remaining / 60000)
        const secs = Math.ceil((remaining % 60000) / 1000)
        toast.error('Post Cooldown Active', {
          description: `Wait ${mins}m ${secs}s before posting again. Upgrade to Premium to remove cooldowns!`,
          duration: 4000,
        })
        return
      }
    }

    const colors = [
      'from-[#00d4ff] to-[#00b8e6]', 'from-purple-500 to-pink-500',
      'from-green-500 to-emerald-500', 'from-orange-500 to-red-500',
      'from-blue-500 to-indigo-500', 'from-red-500 to-pink-500',
      'from-yellow-500 to-orange-500', 'from-teal-500 to-cyan-500',
    ]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const username = isLoggedIn ? userName : 'User' + Math.floor(Math.random() * 1000)
    const initials = username.slice(0, 2).toUpperCase()

    const tags: Post['tags'] = []
    if (isLoggedIn && riotAccountLinked) {
      if (userRank) tags.push({ text: userRank, bg: 'bg-white/5', color: 'text-white/70' })
      if (userRole) tags.push({ text: userRole, bg: 'bg-white/5', color: 'text-white/70' })
    } else {
      selectedRanks.forEach(r => tags.push({ text: r, bg: 'bg-white/5', color: 'text-white/70' }))
    }
    selectedTypes.forEach(t => tags.push({ text: t, bg: 'bg-white/5', color: 'text-white/70' }))

    const state = useAppStore.getState()
    const currentPosts = getCurrentPosts(currentPage, state)
    const existingIds = new Set(currentPosts.map(p => p.id))
    let newId = currentPosts.length > 0 ? Math.max(...currentPosts.map(p => p.id)) + 1 : 1
    while (existingIds.has(newId)) newId++

    const regionName = REGION_MAP[currentPage] || 'EUW'
    const newPost: Post = {
      id: newId, initials, color: randomColor, username, time: 'acum',
      content: postContent, tags,
      riotVerified: isLoggedIn && riotAccountLinked,
      language: userLanguage || 'en',
      userLanguages: isLoggedIn ? [userAccountLanguage || 'en'] : undefined,
      avatar: isLoggedIn ? userAvatar : undefined,
      banner: isLoggedIn ? userBanner : undefined,
      joinDate: isLoggedIn ? userJoinDate : undefined,
      userNameColor: isLoggedIn ? userNameColor : undefined,
      userProfileBackground: isLoggedIn ? userProfileBackground : undefined,
      userPostBackground: isLoggedIn ? userPostBackground : undefined,
      isPremium: isLoggedIn ? hasPremium : undefined,
      userPostBorder: isLoggedIn && hasPremium ? postBorder : undefined,
      tournamentEarnings: isLoggedIn && userTournamentEarnings > 0 ? userTournamentEarnings : undefined,
      tournamentName: isLoggedIn && userTournamentName ? userTournamentName : undefined,
      image: postImage || undefined,
      imageZoom: postImage ? imageZoom : undefined,
      imagePositionX: postImage ? imagePositionX : undefined,
      imagePositionY: postImage ? imagePositionY : undefined,
    }

    addPost(regionName, newPost)

    if (!hasPremium) {
      const now = Date.now()
      set({ lastPostTime: now })
      if (typeof window !== 'undefined') localStorage.setItem('finderq_last_post_time', now.toString())
    }

    toast.success('Post created!', {
      description: hasPremium
        ? 'Your post has been published successfully. Premium users have no cooldown!'
        : 'Your post has been published successfully. You can post again in 10 minutes.',
      duration: 4000,
    })

    set({ showPostForm: false, postContent: '', postImage: '', selectedRanks: [], selectedRoles: [], selectedTypes: [] })
  }

  const handleReportSubmit = (postId: number, author: string, reason: string, details: string) => {
    const { adminReports, isLoggedIn, userName, reportContent, set } = store
    const newReport = {
      id: adminReports.length + 1, type: 'post',
      reportedUser: author, reportedBy: isLoggedIn ? userName : 'Anonymous',
      reason: reason.charAt(0).toUpperCase() + reason.slice(1).replace('_', ' '),
      post: `Post #${postId}`, postContent: reportContent, details,
      date: new Date().toLocaleString(), status: 'pending',
    }
    set({ adminReports: [newReport, ...adminReports] })
    alert('✅ Report submitted successfully! Our moderation team will review it soon.')
  }

  return { handleCreatePost, handleReportSubmit }
}
