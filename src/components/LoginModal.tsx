// @ts-nocheck
'use client'
import React from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

interface OwnerUser {
  id: number;
  username: string;
  email?: string;
  role: string;
  status: string;
  [key: string]: any;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  
  
  loginEmail: string;
  setLoginEmail: (v: string) => void;
  loginPassword: string;
  setLoginPassword: (v: string) => void;
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
  adminUsers: any[];
  ownerUsers: OwnerUser[];
  onOpenSignUp: () => void;
  onOpenForgotPassword: () => void;
  setForgotPasswordEmail: (v: string) => void;
  setForgotPasswordSent: (v: boolean) => void;
  setIsBannedModalOpen: (v: boolean) => void;
  setVerificationCode: (v: string) => void;
  setVerificationEmail: (v: string) => void;
  setIsFromGoogle: (v: boolean) => void;
  setPendingUserData: (v: any) => void;
  setIsVerificationOpen: (v: boolean) => void;
  setGoogleEmail: (v: string) => void;
  setIsGoogleSignUp: (v: boolean) => void;
  setIsGoogleNamePromptOpen: (v: boolean) => void;
}

export function LoginModal({
  isOpen,
  onClose,
  t,


  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  rememberMe,
  setRememberMe,
  adminUsers,
  ownerUsers,
  onOpenSignUp,
  onOpenForgotPassword,
  setForgotPasswordEmail,
  setForgotPasswordSent,
  setIsBannedModalOpen,
  setVerificationCode,
  setVerificationEmail,
  setIsFromGoogle,
  setPendingUserData,
  setIsVerificationOpen,
  setGoogleEmail,
  setIsGoogleSignUp,
  setIsGoogleNamePromptOpen,
}: LoginModalProps) {
  if (!isOpen) return null;

  const handleLogin = () => {
    if (loginEmail && loginPassword) {
      const username = loginEmail.split('@')[0];
      const allUsers = [...adminUsers, ...ownerUsers];
      const foundUser = allUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase() ||
          (u as any).email?.toLowerCase() === loginEmail.toLowerCase()
      );
      if (foundUser && foundUser.status === 'banned') {
        onClose();
        setIsBannedModalOpen(true);
        setLoginEmail('');
        setLoginPassword('');
        return;
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      setVerificationEmail(loginEmail);
      setIsFromGoogle(false);

      const loginFoundUser = ownerUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
      const userRole = loginFoundUser?.role || (
        username.toLowerCase().includes('owner') ? 'owner' :
        username.toLowerCase().includes('admin') ? 'admin' : 'user'
      );

      setPendingUserData({
        username: username,
        email: loginEmail,
        region: 'Not set',
        isOwner: userRole === 'owner',
        isAdmin: userRole === 'admin',
        isSignUp: false
      });

      onClose();
      setIsVerificationOpen(true);

      toast.success('Verification code sent!', {
        description: `Code: ${code} (Check your email)`,
        duration: 10000,
      });

      setLoginEmail('');
      setLoginPassword('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 overflow-y-auto p-3 sm:p-4">
      <div
        className="rounded-2xl max-w-md w-full p-8 relative border-2 border-[#00d4ff]/30 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `url(/assets/a78867c7-e653-4dc1-a775-af0dacbbb6ef-1.png)`,
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
          <h2 className="text-white text-3xl mb-2">{t('welcomeBack')}</h2>
          <p className="text-white/60">{t('logInToAccount')}</p>
        </div>

        {/* Form */}
        <div className="space-y-5 relative z-10">
          {/* Email */}
          <div>
            <label className="block text-white/80 text-sm mb-2">{t('email')}</label>
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white placeholder:text-white/40"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-white/80 text-sm">{t('password')}</label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setForgotPasswordEmail("");
                  setForgotPasswordSent(false);
                  onOpenForgotPassword();
                }}
                className="text-[#00d4ff] hover:text-[#00b8e6] text-xs transition-colors"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white placeholder:text-white/40"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          {/* Remember Me + Login Button grouped */}
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-3 cursor-pointer w-fit"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setRememberMe(prev => !prev); }}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all pointer-events-none ${
                  rememberMe
                    ? 'bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] border-transparent'
                    : 'border-white/20 bg-transparent'
                }`}
              >
                {rememberMe && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-white/70 text-sm select-none pointer-events-none">
                Stay logged in
              </span>
            </div>

            <button
              onClick={handleLogin}
              className="relative mt-2 bg-transparent border-0 p-0"
              style={{ marginLeft: '13%', width: '75%' }}
            >
              <img src="/assets/ChatGPT_Image_Jun_6__2026__09_56_39_PM.png" alt="Log In" className="w-full h-auto object-contain pointer-events-none" />
              <div
                className="absolute inset-0 w-2/5 h-2/5 mx-auto my-auto cursor-pointer hover:scale-105 transition-all"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
              />
            </button>
          </div>

          {/* Divider */}
          <div className="relative -mt-18">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#242836] px-2 text-white/40">{t('or')}</span>
            </div>
          </div>

          {/* Google Login Button */}
          <button
            onClick={() => {
              const email = `user${Math.floor(Math.random() * 10000)}@gmail.com`;
              setGoogleEmail(email);
              setIsGoogleSignUp(false);
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

          {/* Sign Up Link */}
          <p className="text-center text-white/60 text-sm mt-4">
            {t('dontHaveAccount')}{' '}
            <button
              onClick={() => {
                onClose();
                onOpenSignUp();
              }}
              className="text-[#00d4ff] hover:text-[#00b8e6] transition-colors"
            >
              {t('signUp')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
