// @ts-nocheck
'use client'
import { useState, useEffect, useCallback } from 'react'

const HEARTBEAT_INTERVAL = 30000
const OFFLINE_THRESHOLD = 120000
type UserStatus = 'online' | 'busy'

let onlineUsers: Map<string, { lastSeen: number; status: UserStatus }> = new Map()
let listeners: Set<() => void> = new Set()

const mockOnlineUsersList = [
  'BronzeWarrior','EmeraldGamer','AlexDarius','MidGodess','SupportLife',
  'MasterPlayer','GrandmasterADC','SilverVerified','PlatinumVerified',
  'ShadowKnight','FlashLux','Player123','SupportMain',
  'VoidWalker99','GoldShield','RuneForge','MidOrFeed',
]
const mockBusyUsersList = [
  'ChallengerXpert','EmeraldVerified','JungleMaster','NewPlayer',
  'IronWarrior','TopPlayer99','CasualPlayer',
  'IronToChallenger','TopDiff','JungleTimer',
]

function initializeMockOnlineUsers() {
  const now = Date.now()
  mockOnlineUsersList.forEach(u => onlineUsers.set(u, { lastSeen: now, status: 'online' }))
  mockBusyUsersList.forEach(u => onlineUsers.set(u, { lastSeen: now, status: 'busy' }))
}

if (typeof window !== 'undefined' && onlineUsers.size === 0) {
  initializeMockOnlineUsers()
}

function notifyListeners() { listeners.forEach(l => l()) }

function cleanupOfflineUsers() {
  const now = Date.now()
  let changed = false
  onlineUsers.forEach((user, id) => {
    if (now - user.lastSeen > OFFLINE_THRESHOLD) { onlineUsers.delete(id); changed = true }
  })
  if (changed) notifyListeners()
}

if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    mockOnlineUsersList.forEach(u => onlineUsers.set(u, { lastSeen: now, status: 'online' }))
    mockBusyUsersList.forEach(u => onlineUsers.set(u, { lastSeen: now, status: 'busy' }))
    notifyListeners()
  }, 60000)
  setInterval(cleanupOfflineUsers, 10000)
}

export function useOnlinePresence(currentUserId: string | null) {
  const [, forceUpdate] = useState({})

  const updatePresence = useCallback(() => {
    if (currentUserId) {
      onlineUsers.set(currentUserId, { lastSeen: Date.now(), status: 'online' })
      notifyListeners()
    }
  }, [currentUserId])

  useEffect(() => {
    if (!currentUserId) return
    updatePresence()
    const interval = setInterval(updatePresence, HEARTBEAT_INTERVAL)
    const onVisibility = () => { if (document.visibilityState === 'visible') updatePresence() }
    const onActivity = () => updatePresence()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('mousemove', onActivity)
    window.addEventListener('keydown', onActivity)
    window.addEventListener('click', onActivity)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('mousemove', onActivity)
      window.removeEventListener('keydown', onActivity)
      window.removeEventListener('click', onActivity)
    }
  }, [currentUserId, updatePresence])

  useEffect(() => {
    const listener = () => forceUpdate({})
    listeners.add(listener)
    return () => { listeners.delete(listener) }
  }, [])

  const isUserOnline = useCallback((userId: string) => {
    const u = onlineUsers.get(userId)
    return !!u && Date.now() - u.lastSeen < OFFLINE_THRESHOLD
  }, [])

  const isUserBusy = useCallback((userId: string) => {
    const u = onlineUsers.get(userId)
    return !!u && u.status === 'busy' && Date.now() - u.lastSeen < OFFLINE_THRESHOLD
  }, [])

  const getUserStatus = useCallback((userId: string): 'online' | 'busy' | 'offline' => {
    const u = onlineUsers.get(userId)
    if (!u) return 'offline'
    if (Date.now() - u.lastSeen >= OFFLINE_THRESHOLD) return 'offline'
    return u.status
  }, [])

  const getOnlineUsers = useCallback(() => {
    const now = Date.now()
    return Array.from(onlineUsers.entries())
      .filter(([, u]) => now - u.lastSeen < OFFLINE_THRESHOLD)
      .map(([id]) => id)
  }, [])

  return { isUserOnline, isUserBusy, getUserStatus, getOnlineUsers, onlineCount: getOnlineUsers().length }
}
