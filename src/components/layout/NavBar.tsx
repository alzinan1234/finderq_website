// @ts-nocheck
'use client'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter, usePathname } from 'next/navigation'
import { User, ChevronDown, Bell, Crown, Shield, LogOut, FileText, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'
import gsap from 'gsap'
import { useAppStore } from '@/store/appStore'
import { useTranslation } from '@/hooks/useTranslation'

const REGIONS = [
  { label: 'EUW',  href: '/euw' },
  { label: 'EUNE', href: '/eune' },
  { label: 'NA',   href: '/na' },
  { label: 'KR',   href: '/kr' },
  { label: 'BR',   href: '/br' },
]
const REGIONS_MORE = [
  { label: 'LAN + LAS', href: '/lan-las' },
  { label: 'OCE',        href: '/oce' },
  { label: 'TR',         href: '/tr' },
  { label: 'JP',         href: '/jp' },
  { label: 'ME / SEA',   href: '/me-sea' },
]

const PATH_TO_LABEL: Record<string, string> = {
  '/euw': 'EUW', '/eune': 'EUNE', '/na': 'NA', '/kr': 'KR', '/br': 'BR',
  '/lan-las': 'LAN/LAS', '/oce': 'OCE', '/tr': 'TR', '/jp': 'JP', '/me-sea': 'ME/SEA',
}

// ── Riot disclaimer text — duplicated inside the marquee track for a seamless loop ──
const DISCLAIMER_TEXT =
  'This website is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games and League of Legends are trademarks or registered trademarks of Riot Games, Inc.'

// ── Issue #8: logo asset paths (replace these strings with the real paths) ──
// "Post an Ad" button logo  →  /assets/YOUR_POST_AD_LOGO.png
// "Connect Riot Account"    →  /assets/Riot_Games_logo_icon.webp
const POST_AD_LOGO   = '/assets/YOUR_POST_AD_LOGO.png'          // ← replace
const RIOT_LOGO      = '/assets/Riot_Games_logo_icon.webp'      // ← replace

export function NavBar() {
  const router = useRouter()
  const pathname = usePathname()
  const store = useAppStore()
  const { t } = useTranslation()

  const {
    isRegionDropdownOpen, isLoggedIn, userName, userEmail, userAvatar,
    userStatus, setUserStatus, userNameColor, hasPremium, notifications,
    isAdmin, isOwner, isModerator, set, logout,
  } = store

  const currentRegionLabel = PATH_TO_LABEL[pathname] || 'EUW'
  const unreadCount = notifications.filter(n => !n.read).length
  const isProfileDropdownOpen = (store as any).isProfileDropdownOpen

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // ── Issue #17: hide navbar on scroll down, show on scroll up ──
  const [navVisible, setNavVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      if (currentY < 60) {
        // Always show near the top
        setNavVisible(true)
      } else if (currentY > lastScrollY.current) {
        // Scrolling down → hide
        setNavVisible(false)
      } else {
        // Scrolling up → show
        setNavVisible(true)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navRef          = useRef(null)
  const disclaimerRef   = useRef(null)
  const mobileMenuRef   = useRef(null)
  const hamburgerBtnRef = useRef(null)
  const line1Ref        = useRef(null)
  const line2Ref        = useRef(null)
  const line3Ref        = useRef(null)

  // ── GSAP: Riot disclaimer — infinite left-to-right marquee ──
  useEffect(() => {
    if (!disclaimerRef.current) return
    const tween = gsap.fromTo(
      disclaimerRef.current,
      { xPercent: -50 },
      { xPercent: 0, duration: 30, ease: 'none', repeat: -1 } // duration = scroll speed; lower = faster
    )
    return () => { tween.kill() }
  }, [])

  // Navbar entrance
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.1 }
      )
    }
  }, [])

  // Hamburger morph
  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current || !line3Ref.current) return
    if (isMobileMenuOpen) {
      gsap.to(line1Ref.current, { rotate: 45,  y: 6,  duration: 0.3, ease: 'power2.inOut' })
      gsap.to(line2Ref.current, { opacity: 0,         duration: 0.2 })
      gsap.to(line3Ref.current, { rotate: -45, y: -6, duration: 0.3, ease: 'power2.inOut' })
    } else {
      gsap.to(line1Ref.current, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
      gsap.to(line2Ref.current, { opacity: 1,         duration: 0.2, delay: 0.1 })
      gsap.to(line3Ref.current, { rotate: 0, y: 0, duration: 0.3, ease: 'power2.inOut' })
    }
  }, [isMobileMenuOpen])

  // Drawer open animation
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(mobileMenuRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' }
      )
    }
  }, [isMobileMenuOpen])

  const openMobileMenu = () => setIsMobileMenuOpen(true)
  const closeMobileMenu = () => {
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        height: 0, opacity: 0, duration: 0.3, ease: 'power2.in',
        onComplete: () => setIsMobileMenuOpen(false),
      })
    } else {
      setIsMobileMenuOpen(false)
    }
  }
  const toggleMobileMenu = () => isMobileMenuOpen ? closeMobileMenu() : openMobileMenu()

  // Auto-close on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) closeMobileMenu()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobileMenuOpen])

  // Outside click for mobile drawer
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current && !mobileMenuRef.current.contains(e.target) &&
        hamburgerBtnRef.current && !hamburgerBtnRef.current.contains(e.target)
      ) closeMobileMenu()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

  // ── Issue #20: close region dropdown on outside click ──
  const regionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!isRegionDropdownOpen) return
    function handleOutside(e: MouseEvent) {
      if (regionRef.current && !regionRef.current.contains(e.target as Node)) {
        set({ isRegionDropdownOpen: false })
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [isRegionDropdownOpen, set])

  return (
    <>
      {/* ── Issue #9: Riot Games disclaimer bar (pink line) — GSAP infinite left-to-right marquee ── */}
      {/* <div
        className="fixed top-0 left-0 right-0 z-[60] overflow-hidden text-[10px] sm:text-xs text-white/50 bg-[#0a0e27]/90 backdrop-blur-sm border-b border-pink-500/30 py-3 leading-tight"
        style={{ borderBottomColor: '#ff69b4' }}
      > */}
        {/* <div ref={disclaimerRef} className="flex whitespace-nowrap will-change-transform">
          <span className="flex-shrink-0 pr-16">{DISCLAIMER_TEXT}</span>
          <span className="flex-shrink-0 pr-16">{DISCLAIMER_TEXT}</span>
        </div> */}
      {/* </div> */}

      <nav
        id="main-navbar"
        ref={navRef}
        className="fixed left-0 right-0 flex items-center justify-between px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 z-50 transition-transform duration-300"
        style={{
          top: '28px', // offset below disclaimer bar
          transform: navVisible ? 'translateY(0)' : 'translateY(-110%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ───── Left: Logo + Region ───── */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">

          {/* Logo */}
          <Link href="/about">
            <motion.div
              className="group relative flex items-center gap-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/20 to-[#c89b3c]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-2" />
              <div className="relative flex items-center -my-2 sm:-my-3 md:-my-4">
                <img
                  src="/assets/999999-Photoroom.png"
                  alt="FinderQ Logo"
                  className="h-16 sm:h-24 md:h-36 lg:h-44 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          </Link>

          {/* ── Issue #20: Region Dropdown with outside-click-close ── */}
          {/* Nudged down a bit (responsive) so it doesn't sit too close to the disclaimer bar */}
          <div className="relative mt-1 sm:mt-1.5 md:mt-2 lg:mt-2.5" ref={regionRef}>
            <button
              className="group relative flex items-center gap-0.5 pl-0.5 pr-1.5 py-0.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00d4ff]/40 overflow-visible"
              onClick={() => set({ isRegionDropdownOpen: !isRegionDropdownOpen })}
            >
              <img
                src="/assets/2xko-teemo-removebg-preview.png"
                alt="Region"
                className="w-7 h-7 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain -my-1 sm:-my-4 md:-my-5 lg:-my-7 -mr-0.5 sm:-mr-1 lg:-mr-2"
              />
              <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg">{currentRegionLabel}</span>
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-[#00d4ff] transition-transform duration-300 ${isRegionDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isRegionDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 bg-gradient-to-b from-[#1a1d29]/95 to-[#0a0e27]/95 backdrop-blur-xl rounded-xl shadow-2xl py-3 min-w-[140px] sm:min-w-[160px] max-w-[80vw] border border-[#00d4ff]/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/10 via-transparent to-[#c89b3c]/10 pointer-events-none" />
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/50 to-transparent" />

                  {REGIONS.map(r => (
                    <Link
                      key={r.href} href={r.href}
                      onClick={() => set({ isRegionDropdownOpen: false })}
                      className="relative block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-white/80 hover:text-white transition-all duration-200 group/item"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                      <span className="relative font-semibold text-sm sm:text-base">{r.label}</span>
                    </Link>
                  ))}

                  <div className="mx-3 h-px bg-gradient-to-r from-transparent via-[#c89b3c]/30 to-transparent my-2" />

                  {REGIONS_MORE.map(r => (
                    <Link
                      key={r.href} href={r.href}
                      onClick={() => set({ isRegionDropdownOpen: false })}
                      className="relative block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-white/80 hover:text-white transition-all duration-200 group/item"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/20 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-200" />
                      <span className="relative font-semibold text-sm sm:text-base">{r.label}</span>
                    </Link>
                  ))}

                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c89b3c]/50 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ───── Right: actions ───── */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 lg:gap-3">

          {/* Hamburger — mobile/tablet only */}
          <button
            ref={hamburgerBtnRef}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            className="md:hidden relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-[#00d4ff]/40 flex items-center justify-center transition-all duration-300"
          >
            <div className="flex flex-col items-center justify-center gap-[5px] w-5">
              <span ref={line1Ref} className="block h-0.5 w-5 bg-[#00d4ff] rounded-full origin-center" />
              <span ref={line2Ref} className="block h-0.5 w-5 bg-[#00d4ff] rounded-full origin-center" />
              <span ref={line3Ref} className="block h-0.5 w-5 bg-[#00d4ff] rounded-full origin-center" />
            </div>
          </button>

          {/* Tournaments — desktop only */}
          <Link
            href="/tournaments"
            className="hidden md:flex items-center gap-0 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00d4ff]/40 cursor-pointer overflow-visible"
          >
            <img
              src="/assets/bad3e7b50eef2663c37644cbb4e2dd7f01819802-3840x2160-removebg-preview.png"
              alt="Tournaments"
              className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain -mt-8 -mb-6 -mr-3 md:-mt-10 md:-mb-8 md:-mr-4 lg:-mt-12 lg:-mb-10 lg:-mr-6"
            />
            <span className="text-white font-semibold text-sm">{t('tournaments')}</span>
          </Link>

          {/* Media — desktop only */}
          <Link
            href="/media"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#c89b3c]/40 cursor-pointer overflow-visible"
          >
            <img
              src="/assets/Teemo_cs.png"
              alt="Media"
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 object-contain -my-3 md:-my-4 lg:-my-5"
            />
            <span className="text-white font-semibold text-sm">Media</span>
          </Link>

          {/* Challenges — desktop only */}
          <Link
            href="/challenges"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-yellow-500/40 cursor-pointer"
          >
            <span className="text-xl">⚡</span>
            <span className="text-white font-semibold text-sm">Challenges</span>
          </Link>

          {/* ── Issue #9: Missing tabs (Terms + FAQ) — desktop only ── */}
          <Link
            href="/terms"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/30 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-white/60" />
            <span className="text-white/80 font-semibold text-sm">Terms</span>
          </Link>

          <Link
            href="/faq"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/30 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-white/60" />
            <span className="text-white/80 font-semibold text-sm">FAQ</span>
          </Link>

          {/* ── Issue #8: Post an Ad button with replaced logo ── */}
          {isLoggedIn && (
            <button
              onClick={() => set({ isPostAdOpen: true } as any)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00d4ff]/40 cursor-pointer overflow-visible"
            >
              <img
                src={POST_AD_LOGO}
                alt="Post Ad"
                className="w-6 h-6 object-contain"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              <span className="text-white font-semibold text-sm">{t('postAd') || 'Post an Ad'}</span>
            </button>
          )}

          {/* Bell */}
          {isLoggedIn && (
            <button
              onClick={() => set({ isNotificationPanelOpen: true })}
              className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 border border-white/10 hover:border-[#c89b3c]/40 flex items-center justify-center transition-all duration-300"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89b3c]" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center border-2 border-[#0a0e27] animate-pulse">
                  <span className="text-white text-[10px] sm:text-xs font-bold">{unreadCount}</span>
                </div>
              )}
            </button>
          )}

          {/* Sign Up (guest) */}
          {!isLoggedIn && (
            <button
              className="flex items-center gap-0 px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00d4ff]/40 text-white font-semibold text-xs sm:text-sm overflow-visible"
              onClick={() => set({ isSignUpOpen: true })}
            >
              <img
                src="/assets/2xko-official-teemo-the-swift-scout-dev-update-gameplay-over_z3fk.1200-removebg-preview.png"
                alt="Sign Up"
                className="w-10 h-10 sm:w-16 sm:h-16 md:w-[5rem] md:h-[5rem] object-contain -my-3 sm:-my-5 md:-my-8 -mr-1 sm:-mr-2 md:-mr-4 -ml-1 sm:-ml-2 md:-ml-4"
              />
              {t('signUp')}
            </button>
          )}

          {/* Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                if (isLoggedIn) set({ isProfileDropdownOpen: !isProfileDropdownOpen } as any)
                else set({ isLoginOpen: true })
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 flex items-center justify-center overflow-hidden border border-white/10 hover:border-[#00d4ff]/40"
            >
              {isLoggedIn && userName
                ? userAvatar
                  ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                  : <span className="text-white font-bold text-xs sm:text-sm">{userName.slice(0, 2).toUpperCase()}</span>
                : <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              }
            </button>

            {/* Online status dot */}
            {isLoggedIn && (
              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border-2 border-[#0a0e27] ${userStatus === 'online' ? 'bg-yellow-400' : userStatus === 'busy' ? 'bg-red-500' : 'bg-white'}`} />
            )}

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isLoggedIn && isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-11 sm:top-12 w-[calc(100vw-2rem)] max-w-[18rem] sm:w-64 bg-gradient-to-br from-[#1a1d29] to-[#0a0e27] rounded-xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="p-3 sm:p-4 border-b border-white/10 bg-gradient-to-br from-[#00d4ff]/10 to-transparent">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border-2 border-[#00d4ff]/30">
                          {userAvatar
                            ? <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                            : <span className="text-white font-bold text-sm sm:text-base">{userName?.slice(0, 2).toUpperCase()}</span>
                          }
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const statuses = ['online', 'busy', 'offline'] as const
                            const next = statuses[(statuses.indexOf(userStatus) + 1) % 3]
                            setUserStatus(next)
                            const msgs = { online: 'You are now Online', busy: 'Status set to Busy', offline: 'You appear Offline' }
                            toast.success(`Status: ${next}`, { description: msgs[next], duration: 2000 })
                          }}
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border-2 border-[#1a1d29] cursor-pointer hover:scale-110 transition-transform ${userStatus === 'online' ? 'bg-yellow-400' : userStatus === 'busy' ? 'bg-red-500' : 'bg-white'}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-base sm:text-lg bg-gradient-to-r ${userNameColor} bg-clip-text text-transparent truncate`}>{userName}</p>
                        <p className="text-white/50 text-xs truncate">{userEmail}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 sm:mt-1">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${userStatus === 'online' ? 'bg-yellow-400' : userStatus === 'busy' ? 'bg-red-500' : 'bg-white'}`} />
                          <span className="text-white/40 text-xs capitalize">{userStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="py-1 sm:py-2">
                    <button
                      onClick={() => { set({ isProfileOpen: true, isProfileDropdownOpen: false } as any) }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <User className="w-4 h-4 text-white/60 group-hover:text-[#00d4ff] transition-colors flex-shrink-0" />
                      <span className="text-white/80 group-hover:text-white text-sm">{t('viewProfile')}</span>
                    </button>

                    <button
                      onClick={() => { set({ isPremiumOpen: true, isProfileDropdownOpen: false } as any) }}
                      className="w-full px-3 sm:px-4 py-0 flex items-center gap-2 sm:gap-3 hover:bg-gradient-to-r hover:from-[#c89b3c]/10 hover:to-[#00d4ff]/10 transition-all text-left group"
                    >
                      <img
                        src="/assets/ChatGPT_Image_Jun_10__2026__09_38_34_AM-removebg-preview-1.png"
                        alt="Premium"
                        style={{ width: 44, height: 44, flexShrink: 0, marginBottom: -8, marginLeft: -16 }}
                        className="object-contain"
                      />
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0" style={{ marginLeft: -12 }}>
                        <span className="text-transparent bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] bg-clip-text group-hover:from-[#00d4ff] group-hover:to-[#c89b3c] text-xs sm:text-sm font-semibold truncate">FinderQ Premium</span>
                        {hasPremium && <span className="flex-shrink-0 px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full">ACTIVE</span>}
                      </div>
                    </button>

                    <div className="my-1 sm:my-2 border-t border-white/10" />

                    <button
                      onClick={() => { set({ isWalletOpen: true, isProfileDropdownOpen: false } as any) }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 transition-all text-left group"
                    >
                      <img
                        src="/assets/ChatGPT_Image_Jun_10__2026__11_30_49_AM-removebg-preview.png"
                        alt="Wallet"
                        style={{ width: 44, height: 44, flexShrink: 0 }}
                        className="object-contain"
                      />
                      <span className="text-green-400 group-hover:text-green-300 text-xs sm:text-sm font-semibold" style={{ marginLeft: -32, marginTop: -6 }}>{t('wallet')}</span>
                    </button>

                    {/* ── Issue #8: Connect Riot Account with Riot logo ── */}
                    <button
                      onClick={() => { set({ isRiotSyncOpen: true, isProfileDropdownOpen: false } as any) }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-white/5 transition-colors text-left group"
                    >
                      <img
                        src={RIOT_LOGO}
                        alt="Riot Games"
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                      />
                      <span className="text-white/80 group-hover:text-white text-xs sm:text-sm">Connect Riot Account</span>
                    </button>

                    {isOwner && (
                      <>
                        <div className="my-1 sm:my-2 border-t border-white/10" />
                        <button
                          onClick={() => { set({ isOwnerPanelOpen: true, isProfileDropdownOpen: false } as any) }}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-orange-500/10 transition-all text-left"
                        >
                          <Crown className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span className="text-yellow-400 text-xs sm:text-sm font-semibold">{t('ownerPanel')}</span>
                        </button>
                      </>
                    )}

                    {isAdmin && !isOwner && (
                      <>
                        <div className="my-1 sm:my-2 border-t border-white/10" />
                        <button
                          onClick={() => { set({ isAdminPanelOpen: true, isProfileDropdownOpen: false } as any) }}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-gradient-to-r hover:from-[#c89b3c]/10 hover:to-[#a67c2f]/10 transition-all text-left"
                        >
                          <Shield className="w-4 h-4 text-[#c89b3c] flex-shrink-0" />
                          <span className="text-[#c89b3c] text-xs sm:text-sm font-semibold">{t('adminPanel')}</span>
                        </button>
                      </>
                    )}

                    {isModerator && !isAdmin && !isOwner && (
                      <>
                        <div className="my-1 sm:my-2 border-t border-white/10" />
                        <button
                          onClick={() => { set({ isOwnerPanelOpen: true, isProfileDropdownOpen: false } as any) }}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-blue-500/10 transition-all text-left"
                        >
                          <Shield className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="text-blue-400 text-xs sm:text-sm font-semibold">Moderator Panel</span>
                        </button>
                      </>
                    )}

                    <div className="my-1 sm:my-2 border-t border-white/10" />
                    <button
                      onClick={() => {
                        const name = userName
                        logout()
                        set({ isProfileDropdownOpen: false } as any)
                        router.push('/about')
                        toast.success('Logged out!', { description: `See you soon, ${name}! 👋`, duration: 3000 })
                      }}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 hover:bg-red-500/10 transition-colors text-left group"
                    >
                      <LogOut className="w-4 h-4 text-white/60 group-hover:text-red-400 transition-colors flex-shrink-0" />
                      <span className="text-white/80 group-hover:text-red-400 text-xs sm:text-sm">{t('logout')}</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ───── Mobile/tablet drawer ───── */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden absolute top-full inset-x-0 mx-2 mt-1.5 bg-gradient-to-b from-[#1a1d29]/98 to-[#0a0e27]/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-[#00d4ff]/20 overflow-hidden"
            style={{ height: 0, opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/10 via-transparent to-[#c89b3c]/10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00d4ff]/40 to-transparent" />

            <div className="relative flex flex-col py-2 px-2 gap-0.5">
              {/* Tournaments */}
              <Link href="/tournaments" onClick={closeMobileMenu} className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/8 active:bg-white/15 transition-all duration-200">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex-shrink-0">
                  <img src="/assets/bad3e7b50eef2663c37644cbb4e2dd7f01819802-3840x2160-removebg-preview.png" alt="Tournaments" className="w-7 h-7 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:text-[#00d4ff] transition-colors">{t('tournaments')}</p>
                  <p className="text-white/40 text-xs">Compete & win prizes</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/30 -rotate-90 group-hover:text-[#00d4ff] transition-colors flex-shrink-0" />
              </Link>

              {/* Media */}
              <Link href="/media" onClick={closeMobileMenu} className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/8 active:bg-white/15 transition-all duration-200">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-[#c89b3c]/10 border border-[#c89b3c]/20 flex-shrink-0">
                  <img src="/assets/Teemo_cs.png" alt="Media" className="w-7 h-7 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:text-[#c89b3c] transition-colors">Media</p>
                  <p className="text-white/40 text-xs">Clips, highlights & more</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/30 -rotate-90 group-hover:text-[#c89b3c] transition-colors flex-shrink-0" />
              </Link>

              {/* Challenges */}
              <Link href="/challenges" onClick={closeMobileMenu} className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/8 active:bg-white/15 transition-all duration-200">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex-shrink-0">
                  <span className="text-xl leading-none">⚡</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:text-yellow-400 transition-colors">Challenges</p>
                  <p className="text-white/40 text-xs">Daily & weekly goals</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/30 -rotate-90 group-hover:text-yellow-400 transition-colors flex-shrink-0" />
              </Link>

              {/* ── Issue #9: Terms & FAQ in mobile drawer too ── */}
              <Link href="/terms" onClick={closeMobileMenu} className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/8 active:bg-white/15 transition-all duration-200">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                  <FileText className="w-5 h-5 text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:text-white transition-colors">Terms</p>
                  <p className="text-white/40 text-xs">Terms & conditions</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/30 -rotate-90 flex-shrink-0" />
              </Link>

              <Link href="/faq" onClick={closeMobileMenu} className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/8 active:bg-white/15 transition-all duration-200">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-white/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:text-white transition-colors">FAQ</p>
                  <p className="text-white/40 text-xs">Frequently asked questions</p>
                </div>
                <ChevronDown className="w-4 h-4 text-white/30 -rotate-90 flex-shrink-0" />
              </Link>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c89b3c]/30 to-transparent" />
          </div>
        )}
      </nav>
    </>
  )
}