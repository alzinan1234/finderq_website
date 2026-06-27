// @ts-nocheck
'use client'
import { useAppStore } from '@/store/appStore'
import { translations, TranslationKey, LanguageCode } from '@/utils/translations'
import { useState, useEffect, useCallback, useRef } from 'react'

// Google Translate API cache
const translateCache: Record<string, string> = {}
const pendingRequests: Record<string, Promise<string>> = {}

async function googleTranslate(text: string, targetLang: string): Promise<string> {
  if (!text || targetLang === 'en') return text
  const cacheKey = `${targetLang}:${text}`
  if (translateCache[cacheKey]) return translateCache[cacheKey]
  if (pendingRequests[cacheKey]) return pendingRequests[cacheKey]

  const promise = (async () => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
      const res = await fetch(url)
      const data = await res.json()
      const translated = data[0]?.map((item: any) => item[0]).join('') || text
      translateCache[cacheKey] = translated
      return translated
    } catch {
      return text
    }
  })()

  pendingRequests[cacheKey] = promise
  promise.finally(() => { delete pendingRequests[cacheKey] })
  return promise
}

// Language code mapping for Google Translate
const googleLangMap: Record<string, string> = {
  'en': 'en', 'ro': 'ro', 'pl': 'pl', 'tr': 'tr', 'fr': 'fr',
  'de': 'de', 'es': 'es', 'it': 'it', 'pt': 'pt', 'pt-br': 'pt',
  'ru': 'ru', 'el': 'el', 'hu': 'hu', 'cs': 'cs', 'sk': 'sk',
  'nl': 'nl', 'sv': 'sv', 'da': 'da', 'no': 'no', 'fi': 'fi',
  'bg': 'bg', 'uk': 'uk', 'sr': 'sr', 'hr': 'hr', 'sl': 'sl',
  'ko': 'ko', 'ja': 'ja', 'ar': 'ar', 'vi': 'vi', 'zh-tw': 'zh-TW',
  'tl': 'tl', 'ms': 'ms', 'id': 'id',
}

export function useTranslation() {
  const selectedLanguage = useAppStore(s => s.selectedLanguage)
  const setSelectedLanguage = useAppStore(s => s.setSelectedLanguage)

  // Static translation from dictionary
  const t = (key: TranslationKey): string => {
    try {
      const lang = selectedLanguage as LanguageCode
      return translations[lang]?.[key] || translations.en[key] || key
    } catch {
      return key
    }
  }

  // Dynamic translation via Google Translate (for custom text not in dictionary)
  const translateText = useCallback(async (text: string): Promise<string> => {
    if (!text || selectedLanguage === 'en') return text
    const googleLang = googleLangMap[selectedLanguage] || selectedLanguage
    return googleTranslate(text, googleLang)
  }, [selectedLanguage])

  return { t, language: selectedLanguage, setLanguage: setSelectedLanguage, translateText }
}

// Hook for auto-translating entire page content via Google Translate
export function usePageTranslation() {
  const selectedLanguage = useAppStore(s => s.selectedLanguage)
  const lastLang = useRef<string>('en')
  const observerRef = useRef<MutationObserver | null>(null)
  const translateTimeoutRef = useRef<any>(null)

  const translatePage = useCallback(async (lang: string) => {
    if (lang === 'en') {
      // Remove Google Translate if switching back to English
      const frame = document.getElementById('google-translate-frame')
      if (frame) frame.remove()
      const existingScript = document.getElementById('google-translate-script')
      if (existingScript) existingScript.remove()
      // Reset any translation
      const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (combo) { combo.value = 'en'; combo.dispatchEvent(new Event('change')) }
      return
    }

    const googleLang = googleLangMap[lang] || lang

    // Use Google Translate Element for full-page translation
    if (!(window as any).google?.translate?.TranslateElement) {
      // Load Google Translate script
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        document.head.appendChild(script)

        ;(window as any).googleTranslateElementInit = () => {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              autoDisplay: false,
              layout: (window as any).google?.translate?.TranslateElement?.InlineLayout?.SIMPLE
            },
            'google-translate-container'
          )
          // Auto-select language
          setTimeout(() => {
            const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement
            if (combo) {
              combo.value = googleLang
              combo.dispatchEvent(new Event('change'))
            }
          }, 1000)
        }
      }

      // Create hidden container for Google Translate widget
      if (!document.getElementById('google-translate-container')) {
        const div = document.createElement('div')
        div.id = 'google-translate-container'
        div.style.cssText = 'position:fixed;top:-9999px;left:-9999px;visibility:hidden;'
        document.body.appendChild(div)
      }
    } else {
      // Already loaded, just change language
      setTimeout(() => {
        const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement
        if (combo) {
          combo.value = googleLang
          combo.dispatchEvent(new Event('change'))
        }
      }, 100)
    }
  }, [])

  useEffect(() => {
    if (selectedLanguage !== lastLang.current) {
      lastLang.current = selectedLanguage
      if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current)
      translateTimeoutRef.current = setTimeout(() => {
        translatePage(selectedLanguage)
      }, 200)
    }
    return () => { if (translateTimeoutRef.current) clearTimeout(translateTimeoutRef.current) }
  }, [selectedLanguage, translatePage])
}