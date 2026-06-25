// @ts-nocheck
'use client'
import { useAppStore } from '@/store/appStore'
import { RegionPage } from '@/components/RegionPage'
import { GuestWall } from '@/components/GuestWall'
import { useOnlinePresence } from '@/hooks/useOnlinePresence'
import { usePostActions } from '@/hooks/usePostActions'

const RESTRICTED = ['EUW', 'EUNE', 'NA', 'KR', 'BR']

type Region = 'EUW' | 'EUNE' | 'NA' | 'KR' | 'BR' | 'LAN/LAS' | 'OCE' | 'TR' | 'JP' | 'ME/SEA'

const REGION_TO_STORE_KEY: Record<string, string> = {
  EUW: 'postsEUW', EUNE: 'postsEUNE', NA: 'postsNA', KR: 'postsKR', BR: 'postsBR',
  'LAN/LAS': 'postsLANLAS', OCE: 'postsOCE', TR: 'postsTR', JP: 'postsJP', 'ME/SEA': 'postsMESEA',
}

const REGION_TO_PAGE: Record<string, string> = {
  EUW: 'euw', EUNE: 'eune', NA: 'na', KR: 'kr', BR: 'br',
  'LAN/LAS': 'lan_las', OCE: 'oce', TR: 'tr', JP: 'jp', 'ME/SEA': 'me_sea',
}

export function RegionPageWrapper({ region }: { region: Region }) {
  const store = useAppStore()
  const { handleCreatePost } = usePostActions()
  const { getUserStatus } = useOnlinePresence(store.isLoggedIn ? store.userName : null)

  const {
    isLoggedIn, userName, userRank, riotAccountLinked, userStatus,
    hasPremium, userPostBackground, postContent, postImage, showPostForm,
    selectedRanks, selectedRoles, selectedTypes, postCooldownRemaining,
    selectedLanguage, userAccountLanguage,
    set, addFriend, deletePost,
  } = store

  const isRestricted = RESTRICTED.includes(region) && !isLoggedIn
  if (isRestricted) {
    return (
      <GuestWall
        currentPage={REGION_TO_PAGE[region]}
        isLoggedIn={false}
        onSignUp={() => set({ isSignUpOpen: true })}
        onLogin={() => set({ isLoginOpen: true })}
      />
    )
  }

  const storeKey = REGION_TO_STORE_KEY[region]
  const allPosts = (store as any)[storeKey] || []
  const filteredPosts = selectedLanguage && selectedLanguage !== 'all'
    ? allPosts.filter((p: any) => !p.userLanguages || p.userLanguages.includes(selectedLanguage) || p.language === selectedLanguage)
    : allPosts

  return (
    <RegionPage
      region={region}
      currentPage={REGION_TO_PAGE[region]}
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
      filteredPosts={filteredPosts}
      onProfileClick={(p: any) => set({ isPublicProfileOpen: true, selectedUserProfile: p })}
      onMessageClick={(username: string, initials: string, color: string) => {
        addFriend({ username, initials, color })
        set({ openThreadRequest: { username, initials, color } })
      }}
      onReportClick={(postId: number, author: string, content: string) =>
        set({ isReportModalOpen: true, reportPostId: postId, reportAuthor: author, reportContent: content })
      }
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
}
