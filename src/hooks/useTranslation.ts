// @ts-nocheck
'use client'
import { useAppStore } from '@/store/appStore'
import { translations, TranslationKey, LanguageCode } from '@/utils/translations'

export function useTranslation() {
  const selectedLanguage = useAppStore(s => s.selectedLanguage)
  const setSelectedLanguage = useAppStore(s => s.setSelectedLanguage)

  const t = (key: TranslationKey): string => {
    try {
      const lang = selectedLanguage as LanguageCode
      return translations[lang]?.[key] || translations.en[key] || key
    } catch {
      return key
    }
  }

  return { t, language: selectedLanguage, setLanguage: setSelectedLanguage }
}
