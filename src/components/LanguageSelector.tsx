// @ts-nocheck
'use client'
import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
const teemoLanguageIcon = '/assets/11111.png';

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'pt-br', name: 'Português (BR)', flag: '🇧🇷' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'zh-tw', name: '繁體中文', flag: '🇹🇼' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'sr', name: 'Srpski', flag: '🇷🇸' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
];

interface LanguageSelectorProps {
  currentLanguage?: string;
  onLanguageChange?: (code: string) => void;
  selectedLanguage?: string;
}

export function LanguageSelector({ currentLanguage, onLanguageChange, selectedLanguage: selectedLanguageProp }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read directly from store so flag always reflects actual state
  const storeLanguage = useAppStore(s => s.selectedLanguage);
  const setSelectedLanguage = useAppStore(s => s.setSelectedLanguage);

  // Use store value as source of truth — prop is ignored for display
  const activeLang = storeLanguage;
  const selectedLangObj = languages.find(lang => lang.code === activeLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (code: string) => {
    // Update store directly
    setSelectedLanguage(code);
    // Also call prop callback if provided
    if (onLanguageChange) onLanguageChange(code);
    setIsOpen(false);
  };

  return (
    <div className="fixed top-38 right-4 z-[60]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-[#00d4ff]/40 cursor-pointer group"
      >
        {/* Flag updates instantly from store — notranslate so Google Translate never touches it */}
        <span className="text-white font-semibold text-sm notranslate" translate="no">{selectedLangObj.flag}</span>
        <ChevronDown className={`w-4 h-4 text-[#00d4ff] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className="notranslate absolute top-full right-0 mt-2 w-64 max-h-96 overflow-y-auto bg-[#0a0e27]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-[70]"
          translate="no"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/5 to-transparent pointer-events-none rounded-xl" />
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleChange(lang.code)}
                className={`relative w-full px-4 py-2.5 text-left transition-all duration-200 ${
                  lang.code === activeLang
                    ? 'bg-white/10 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl notranslate" translate="no">{lang.flag}</span>
                  <span className="font-semibold text-sm notranslate" translate="no">{lang.name}</span>
                  {lang.code === activeLang && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-[#00d4ff]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}