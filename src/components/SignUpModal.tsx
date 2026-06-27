// @ts-nocheck
'use client'
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  
  
  signUpUsername: string;
  setSignUpUsername: (v: string) => void;
  signUpEmail: string;
  setSignUpEmail: (v: string) => void;
  signUpPassword: string;
  setSignUpPassword: (v: string) => void;
  signUpLanguage: string;
  setSignUpLanguage: (v: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: React.Dispatch<React.SetStateAction<boolean>>;
  agreedToPrivacy: boolean;
  setAgreedToPrivacy: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenTerms: () => void;
  onOpenPrivacyPolicy: () => void;
  onOpenLogin: () => void;
  setVerificationCode: (v: string) => void;
  setVerificationEmail: (v: string) => void;
  setIsFromGoogle: (v: boolean) => void;
  setPendingUserData: (v: any) => void;
  setIsVerificationOpen: (v: boolean) => void;
  setGoogleEmail: (v: string) => void;
  setIsGoogleSignUp: (v: boolean) => void;
  setIsGoogleNamePromptOpen: (v: boolean) => void;
}

export function SignUpModal({
  isOpen,
  onClose,
  t,


  signUpUsername,
  setSignUpUsername,
  signUpEmail,
  setSignUpEmail,
  signUpPassword,
  setSignUpPassword,
  signUpLanguage,
  setSignUpLanguage,
  agreedToTerms,
  setAgreedToTerms,
  agreedToPrivacy,
  setAgreedToPrivacy,
  onOpenTerms,
  onOpenPrivacyPolicy,
  onOpenLogin,
  setVerificationCode,
  setVerificationEmail,
  setIsFromGoogle,
  setPendingUserData,
  setIsVerificationOpen,
  setGoogleEmail,
  setIsGoogleSignUp,
  setIsGoogleNamePromptOpen,
}: SignUpModalProps) {

  // ── Issue #7: language-selection notice, shown each time the modal opens ──
  useEffect(() => {
    if (isOpen) {
      toast.info('🌐 Selectează limba!', {
        description: 'Selectarea limbii este obligatorie pentru a-ți crea contul.',
        duration: 4000,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!signUpLanguage) {
      toast.error('Selectează o limbă!', { description: 'Limba este obligatorie pentru a continua.', duration: 3000 });
      return;
    }
    if (!agreedToTerms || !agreedToPrivacy) {
      toast.error('Acceptă termenii!', { description: 'Trebuie să accepți Termenii și Politica de Confidențialitate.', duration: 3000 });
      return;
    }
    if (signUpUsername && signUpEmail && signUpPassword) {
      // ── Issue #4: only Gmail / Yahoo addresses are accepted ──
      const emailDomain = signUpEmail.trim().toLowerCase().split('@')[1] || '';
      if (!['gmail.com', 'yahoo.com'].includes(emailDomain)) {
        toast.error('Email invalid!', {
          description: 'Trebuie să folosești o adresă Gmail sau Yahoo (ex: @gmail.com sau @yahoo.com).',
          duration: 4000,
        });
        return;
      }

      const takenUsernames: string[] = JSON.parse(localStorage.getItem('finderq_registered_usernames') || '[]');
      if (takenUsernames.map((u: string) => u.toLowerCase()).includes(signUpUsername.toLowerCase())) {
        toast.error('Username already taken!', {
          description: `"${signUpUsername}" is already in use. Please choose a different username.`,
          duration: 4000,
        });
        return;
      }
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      setVerificationEmail(signUpEmail);
      setIsFromGoogle(false);

      setPendingUserData({
        username: signUpUsername,
        email: signUpEmail,
        region: 'Not set',
        language: signUpLanguage,
        isOwner: signUpUsername.toLowerCase().includes('owner'),
        isAdmin: signUpUsername.toLowerCase().includes('admin'),
        isSignUp: true,
        joinDate: new Date().toISOString().split('T')[0]
      });

      try {
        toast.info('📋 Your Verification Code', {
          description: code,
          duration: 30000,
          style: {
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
            border: '2px solid #00d4ff',
            color: '#00d4ff',
            fontSize: '20px',
            fontWeight: 'bold',
            letterSpacing: '4px',
            padding: '20px',
          },
        });
        console.log('%c🔐 VERIFICATION CODE: ' + code, 'background: #00d4ff; color: black; font-size: 24px; padding: 10px; font-weight: bold;');
      } catch (error) {
        console.error('Error displaying code:', error);
        toast.info('📋 Your Verification Code', {
          description: code,
          duration: 30000,
          style: {
            background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
            border: '2px solid #00d4ff',
            color: '#00d4ff',
            fontSize: '20px',
            fontWeight: 'bold',
            letterSpacing: '4px',
            padding: '20px',
          },
        });
        console.log('%c🔐 VERIFICATION CODE: ' + code, 'background: #00d4ff; color: black; font-size: 24px; padding: 10px; font-weight: bold;');
      }

      onClose();
      setIsVerificationOpen(true);

      setSignUpUsername('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpLanguage('en');
      setAgreedToTerms(false);
      setAgreedToPrivacy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 overflow-y-auto p-3 sm:p-4">
      <div
        className="rounded-2xl max-w-md w-full p-8 relative border-2 border-[#00d4ff]/30 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `url(/assets/a78867c7-e653-4dc1-a775-af0dacbbb6ef.png)`,
          backgroundSize: 'cover',
          backgroundPosition: '70% center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#242836]/70 via-[#242836]/20 to-[#242836]/70" />
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-8 relative z-10">
          <h2 className="text-white text-3xl mb-2">{t('joinFinderQ')}</h2>
          <p className="text-white/60">{t('createAccountStart')}</p>
        </div>

        {/* Form */}
        <div className="space-y-5 relative z-10">
          {/* Username */}
          <div>
            <label className="block text-white/80 text-sm mb-2">{t('username')}</label>
            <input
              type="text"
              placeholder={t('enterUsername')}
              className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white placeholder:text-white/40"
              value={signUpUsername}
              onChange={(e) => setSignUpUsername(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-white/80 text-sm mb-2">{t('email')}</label>
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white placeholder:text-white/40"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-white/80 text-sm mb-2">
              {t('selectLanguage')} <span className="text-red-400">*</span>
            </label>
            <select
              value={signUpLanguage}
              onChange={(e) => setSignUpLanguage(e.target.value)}
              className={`w-full px-4 py-3 bg-[#1a1d29] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white ${signUpLanguage === '' ? 'border-red-500/50' : 'border-white/10'}`}
            >
              <option value="" disabled>-- Selectează limba --</option>
              <option value="en">🇬🇧 English</option>
              <option value="ro">🇷🇴 Română</option>
              <option value="pl">🇵🇱 Polski</option>
              <option value="tr">🇹🇷 Türkçe</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="es">🇪🇸 Español</option>
              <option value="it">🇮🇹 Italiano</option>
              <option value="pt">🇵🇹 Português</option>
              <option value="ru">🇷🇺 Русский</option>
              <option value="el">🇬🇷 Ελληνικά</option>
              <option value="hu">🇭🇺 Magyar</option>
              <option value="cs">🇨🇿 Čeština</option>
              <option value="sk">🇸🇰 Slovenčina</option>
              <option value="nl">🇳🇱 Nederlands</option>
              <option value="sv">🇸🇪 Svenska</option>
              <option value="da">🇩🇰 Dansk</option>
              <option value="no">🇳🇴 Norsk</option>
              <option value="fi">🇫🇮 Suomi</option>
              <option value="bg">🇧🇬 Български</option>
              <option value="uk">🇺🇦 Українська</option>
              <option value="sr">🇷🇸 Srpski</option>
              <option value="hr">🇭🇷 Hrvatski</option>
              <option value="sl">🇸🇮 Slovenščina</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-white/80 text-sm mb-2">{t('password')}</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white placeholder:text-white/40"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
            />
          </div>

          {/* Terms & Privacy checkboxes */}
          <div className="space-y-2.5">
            <div
              className="flex items-start gap-3 cursor-pointer"
              onClick={() => setAgreedToTerms(prev => !prev)}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreedToTerms ? 'bg-[#00d4ff] border-[#00d4ff]' : 'border-white/30 bg-transparent'}`}>
                {agreedToTerms && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <p className="text-white/60 text-xs leading-relaxed pointer-events-none">
                Am citit și sunt de acord cu{' '}
                <button
                  className="text-[#00d4ff] hover:underline pointer-events-auto"
                  onClick={(e) => { e.stopPropagation(); onOpenTerms(); }}
                >
                  Termenii și Condițiile
                </button>
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all cursor-pointer ${agreedToPrivacy ? 'bg-[#00d4ff] border-[#00d4ff]' : 'border-white/30 bg-transparent'}`}
                onClick={() => setAgreedToPrivacy(prev => !prev)}
              >
                {agreedToPrivacy && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <p className="text-white/60 text-xs leading-relaxed">
                Am citit și sunt de acord cu{' '}
                <button type="button" className="text-[#00d4ff] hover:underline" onClick={() => onOpenPrivacyPolicy()}>
                  Politica de Confidențialitate
                </button>
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="relative w-3/4 -mt-12 bg-transparent border-0 p-0"
            style={{ marginLeft: '12%' }}
          >
            <img src="/assets/ChatGPT_Image_Jun_6__2026__08_17_08_PM.png" alt="Create Account" className="w-full h-auto object-contain pointer-events-none" />
            <div
              className="absolute inset-0 w-2/5 h-2/5 mx-auto my-auto cursor-pointer hover:scale-105 transition-all"
              onClick={handleSubmit}
            />
          </button>

          {/* Divider */}
          <div className="relative -mt-16">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#242836] px-2 text-white/40">{t('or')}</span>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={() => {
              const email = `user${Math.floor(Math.random() * 10000)}@gmail.com`;
              setGoogleEmail(email);
              setIsGoogleSignUp(true);
              onClose();
              setIsGoogleNamePromptOpen(true);
            }}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 rounded-lg transition-all shadow-lg flex items-center justify-center gap-3 font-medium border border-gray-200"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('continueWithGoogle')}
          </button>

          {/* Login Link */}
          <p className="text-center text-white/60 text-sm mt-4">
            {t('alreadyHaveAccount')}{' '}
            <button
              onClick={() => {
                onClose();
                onOpenLogin();
              }}
              className="text-[#00d4ff] hover:text-[#00b8e6] transition-colors"
            >
              {t('logIn')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}