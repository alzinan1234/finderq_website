// @ts-nocheck
'use client'
import { useEffect, useRef } from 'react'
import { useAppStore } from '@/store/appStore'

// Google Translate language code mapping
const googleLangMap: Record<string, string> = {
  'en': 'en', 'ro': 'ro', 'pl': 'pl', 'tr': 'tr', 'fr': 'fr',
  'de': 'de', 'es': 'es', 'it': 'it', 'pt': 'pt', 'pt-br': 'pt',
  'ru': 'ru', 'el': 'el', 'hu': 'hu', 'cs': 'cs', 'sk': 'sk',
  'nl': 'nl', 'sv': 'sv', 'da': 'da', 'no': 'no', 'fi': 'fi',
  'bg': 'bg', 'uk': 'uk', 'sr': 'sr', 'hr': 'hr', 'sl': 'sl',
  'ko': 'ko', 'ja': 'ja', 'ar': 'ar', 'vi': 'vi', 'zh-tw': 'zh-TW',
  'tl': 'tl', 'ms': 'ms', 'id': 'id',
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void
    google?: any
  }
}

export function GoogleTranslateProvider() {
  const selectedLanguage = useAppStore(s => s.selectedLanguage)
  const isReady = useRef(false)
  const initAttempts = useRef(0)

  const applyLanguage = (lang: string) => {
    const googleLang = googleLangMap[lang] || lang

    if (lang === 'en') {
      // Reset to English
      try {
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement
        if (combo) {
          combo.value = 'en'
          combo.dispatchEvent(new Event('change'))
        }
        // Also try the cookie method
        document.cookie = 'googtrans=/en/en; path=/; domain=' + window.location.hostname
        document.cookie = 'googtrans=/en/en; path=/'
      } catch {}
      return
    }

    // Set Google Translate cookie directly (most reliable method)
    document.cookie = `googtrans=/en/${googleLang}; path=/; domain=${window.location.hostname}`
    document.cookie = `googtrans=/en/${googleLang}; path=/`

    const tryApply = (attempts = 0) => {
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (combo) {
        combo.value = googleLang
        combo.dispatchEvent(new Event('change'))
      } else if (attempts < 20) {
        setTimeout(() => tryApply(attempts + 1), 300)
      }
    }
    tryApply()
  }

  useEffect(() => {
    // Create hidden Google Translate widget container
    if (!document.getElementById('google-translate-container')) {
      const div = document.createElement('div')
      div.id = 'google-translate-container'
      div.style.cssText = 'position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;'
      document.body.appendChild(div)
    }

    // Hide Google Translate banner/bar with CSS
    const style = document.createElement('style')
    style.id = 'gt-hide-style'
    style.textContent = `
      .goog-te-banner-frame, .skiptranslate, #goog-gt-tt,
      .goog-te-balloon-frame, div#goog-gt-tt, .goog-te-menu-value span,
      .VIpgJd-ZVi9od-aZ2wEe-wOHMyf { display: none !important; }
      body { top: 0 !important; }
      .goog-te-gadget { font-size: 0 !important; }
      iframe.skiptranslate { display: none !important; }
    `
    if (!document.getElementById('gt-hide-style')) {
      document.head.appendChild(style)
    }

    // Init callback
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            autoDisplay: false,
            multilanguagePage: true,
            gaTrack: false,
          },
          'google-translate-container'
        )
        isReady.current = true
        // Apply current language after init
        setTimeout(() => applyLanguage(selectedLanguage), 800)
      } catch (e) {
        console.warn('Google Translate init error:', e)
      }
    }

    // Load Google Translate script
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script')
      script.id = 'google-translate-script'
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      script.async = true
      script.onerror = () => console.warn('Google Translate script failed to load')
      document.head.appendChild(script)
    }

    return () => {}
  }, [])

  // Apply language when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    const timer = setTimeout(() => applyLanguage(selectedLanguage), 300)
    return () => clearTimeout(timer)
  }, [selectedLanguage])

  return null
}