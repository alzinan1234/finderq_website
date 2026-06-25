// @ts-nocheck
'use client'
import React, { useEffect, useRef } from 'react'
import { MessageCircle, Shield, Sparkles } from 'lucide-react'
import gsap from 'gsap'
import { translations, LanguageCode } from '@/utils/translations'

const backgroundImage = '/assets/aY1Un5.jpg'
const finderQLogo = '/assets/999999-Photoroom.png'

interface AboutPageProps {
  onGetStarted: () => void
  language?: string
}

export function AboutPage({ onGetStarted, language = 'en' }: AboutPageProps) {
  const t = (key: string): string => {
    const lang = language as LanguageCode
    return (translations[lang] as any)?.[key] || (translations.en as any)[key] || key
  }

  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-gsap="hero-item"]', {
        y: 40, opacity: 0, duration: 0.8, ease: 'power2.out',
        stagger: 0.15, delay: 0.1,
      })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0e27] overflow-x-hidden">
      {/* Hero */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e27]/40 via-[#0a0e27]/20 to-[#0a0e27]/90" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-[#00d4ff]/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-[#c89b3c]/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto pt-20 sm:pt-24">
          <div data-gsap="hero-item" className="flex justify-center mb-4 sm:mb-8">
            <img src={finderQLogo} alt="FinderQ Logo" className="h-32 sm:h-48 md:h-64 lg:h-80 w-auto object-contain" />
          </div>
          <div data-gsap="hero-item" className="mb-4 sm:mb-8">
            <h1 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 font-bold leading-tight">{t('heroTitle')}</h1>
            <p className="text-[#c89b3c] text-base sm:text-lg md:text-xl font-medium">{t('heroSubtitle')}</p>
          </div>
          <p data-gsap="hero-item" className="text-white/70 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2">
            {t('heroDescription')}
          </p>
          <div data-gsap="hero-item">
            <button onClick={onGetStarted}
              className="group px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white rounded-xl hover:from-[#0066ff] hover:to-[#00d4ff] transition-all shadow-xl hover:shadow-[#00d4ff]/40 hover:scale-105 duration-300 text-sm sm:text-base font-bold">
              <span className="flex items-center gap-2">Get Started Now <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /></span>
            </button>
            <p className="text-white/40 text-xs sm:text-sm mt-3">Free to join · No credit card required</p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 sm:h-32 bg-gradient-to-t from-[#0a0e27] to-transparent" />
      </div>

      {/* How It Works */}
      <div className="relative py-12 sm:py-20 px-4 sm:px-6 bg-[#0a0e27]">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-[#00d4ff]/10 rounded-full blur-[80px] sm:blur-[120px]" />
          <div className="absolute bottom-0 right-1/3 w-64 sm:w-96 h-64 sm:h-96 bg-[#c89b3c]/10 rounded-full blur-[80px] sm:blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">HOW IT WORKS?</h2>
            <p className="text-white/50 text-sm sm:text-base md:text-xl">Get started in just a few simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Post an Ad */}
            <div className="group relative bg-gradient-to-br from-[#1a1d29] to-[#0a0e27] rounded-2xl p-5 sm:p-8 border border-[#00d4ff]/20 hover:border-[#00d4ff]/60 transition-all duration-300">
              <div className="absolute inset-0 bg-[#00d4ff]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#00d4ff] to-[#00b8e6] rounded-xl flex items-center justify-center shadow-lg shadow-[#00d4ff]/30 flex-shrink-0">
                    <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-white text-xl sm:text-2xl font-bold">Post an Ad</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { n: 1, title: 'Select Your Region', desc: 'Choose EUW, EUNE, NA, KR, or BR from the region selector' },
                    { n: 2, title: 'Click "Create New Post"', desc: 'Fill in your rank, preferred roles, and game modes' },
                    { n: 3, title: 'Write Your Message', desc: 'Describe what you\'re looking for and publish your ad' },
                    { n: 4, title: 'Connect with Players', desc: 'Receive messages and start playing together!' },
                  ].map(s => (
                    <div key={s.n} className="flex items-start gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#00d4ff]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#00d4ff] font-bold text-xs sm:text-sm">{s.n}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm sm:text-base mb-0.5">{s.title}</h4>
                        <p className="text-white/50 text-xs sm:text-sm">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connect Riot Account */}
            <div className="group relative bg-gradient-to-br from-[#1a1d29] to-[#0a0e27] rounded-2xl p-5 sm:p-8 border border-[#c89b3c]/20 hover:border-[#c89b3c]/60 transition-all duration-300">
              <div className="absolute inset-0 bg-[#c89b3c]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#c89b3c] to-[#8b6914] rounded-xl flex items-center justify-center shadow-lg shadow-[#c89b3c]/30 flex-shrink-0">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-white text-xl sm:text-2xl font-bold">Connect Riot Account</h3>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { n: 1, title: 'Open Your Profile', desc: 'Click on your avatar in the top-right corner' },
                    { n: 2, title: 'Click "Link Riot Account"', desc: 'Enter your Riot ID and tagline (e.g., Username#EUW)' },
                    { n: 3, title: 'Get Verified', desc: 'Your rank, champions, and stats will be synced automatically' },
                    { n: 4, title: 'Unlock Riot Verified Badge', desc: 'Show others you\'re a verified player with exclusive features' },
                  ].map(s => (
                    <div key={s.n} className="flex items-start gap-3">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#c89b3c]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[#c89b3c] font-bold text-xs sm:text-sm">{s.n}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm sm:text-base mb-0.5">{s.title}</h4>
                        <p className="text-white/50 text-xs sm:text-sm">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-10 sm:mt-14">
            <button onClick={onGetStarted}
              className="group px-8 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white rounded-xl hover:scale-105 transition-all shadow-xl hover:shadow-[#00d4ff]/40 duration-300 text-sm sm:text-base font-bold">
              <span className="flex items-center gap-2">Get Started Now <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" /></span>
            </button>
          </div>
        </div>
      </div>
      <div className="h-10 sm:h-16 bg-[#0a0e27]" />
    </div>
  )
}
