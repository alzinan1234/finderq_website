// @ts-nocheck
'use client'
import { X, Mail } from "lucide-react";
import { toast } from "sonner";

interface PendingUserData {
  username: string;
  email: string;
  region: string;
  language?: string;
  joinDate?: string;
  isOwner: boolean;
  isAdmin: boolean;
  isSignUp: boolean;
}

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  verificationEmail: string;
  verificationCode: string;
  setVerificationCode: (v: string) => void;
  enteredCode: string;
  setEnteredCode: (v: string) => void;
  pendingUserData: PendingUserData | null;
  setPendingUserData: (v: PendingUserData | null) => void;
  ownerUsers: any[];
  rememberMe: boolean;
  // State setters called on successful verification
  setUserName: (v: string) => void;
  setUserEmail: (v: string) => void;
  setUserRegion: (v: string) => void;
  setUserLanguage: (v: string) => void;
  setSelectedLanguage: (v: string) => void;
  setUserAccountLanguage: (v: string) => void;
  setUserJoinDate: (v: string) => void;
  setIsLoggedIn: (v: boolean) => void;
  setIsVerificationOpen: (v: boolean) => void;
  setIsOwner: (v: boolean) => void;
  setIsAdmin: (v: boolean) => void;
  setIsModerator: (v: boolean) => void;
  setIsProfileOpen: (v: boolean) => void;
}

// Guard: if a parent ever passes a non-function (undefined, wrong prop name,
// state value swapped with its setter, etc.) this prevents a hard crash and
// instead logs exactly which prop is broken, so it's easy to trace upstream.
function safeCall(fn: unknown, ...args: any[]) {
  if (typeof fn === 'function') {
    (fn as (...a: any[]) => void)(...args);
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      `[EmailVerificationModal] Expected a function prop but received "${typeof fn}". Check the parent component is passing the setter correctly.`,
      fn
    );
  }
}

export function EmailVerificationModal({
  isOpen,
  onClose,
  verificationEmail,
  verificationCode,
  setVerificationCode,
  enteredCode,
  setEnteredCode,
  pendingUserData,
  setPendingUserData,
  ownerUsers,
  rememberMe,
  setUserName,
  setUserEmail,
  setUserRegion,
  setUserLanguage,
  setSelectedLanguage,
  setUserAccountLanguage,
  setUserJoinDate,
  setIsLoggedIn,
  setIsVerificationOpen,
  setIsOwner,
  setIsAdmin,
  setIsModerator,
  setIsProfileOpen,
}: EmailVerificationModalProps) {
  if (!isOpen) return null;

  const handleVerify = () => {
    const code = enteredCode ?? '';
    if (code.length !== 6) return;

    if (enteredCode === verificationCode) {
      if (pendingUserData) {
        safeCall(setUserName, pendingUserData.username);
        safeCall(setUserEmail, pendingUserData.email);
        safeCall(setUserRegion, pendingUserData.region);
        if (pendingUserData.language) {
          safeCall(setUserLanguage, pendingUserData.language);
          safeCall(setSelectedLanguage, pendingUserData.language);
          localStorage.setItem('finderq_language', pendingUserData.language);
          if (pendingUserData.isSignUp) {
            safeCall(setUserAccountLanguage, pendingUserData.language);
            localStorage.setItem('finderq_account_language', pendingUserData.language);
          }
        }
        if (pendingUserData.joinDate) {
          safeCall(setUserJoinDate, pendingUserData.joinDate);
        }
        if (rememberMe) {
          localStorage.setItem('finderq_remember_me', 'true');
          localStorage.setItem('finderq_saved_username', pendingUserData.username);
          localStorage.setItem('finderq_saved_email', pendingUserData.email);
          localStorage.setItem('finderq_saved_region', pendingUserData.region);
        }
        safeCall(setIsLoggedIn, true);
        safeCall(setIsVerificationOpen, false);

        if (pendingUserData.isOwner) {
          safeCall(setIsOwner, true);
          safeCall(setIsAdmin, false);
          safeCall(setIsModerator, false);
        } else if (pendingUserData.isAdmin) {
          safeCall(setIsAdmin, true);
          safeCall(setIsOwner, false);
          safeCall(setIsModerator, false);
        } else {
          const foundMod = ownerUsers.find((u: any) => u.username.toLowerCase() === pendingUserData.username.toLowerCase() && u.role === 'moderator');
          safeCall(setIsModerator, !!foundMod);
          safeCall(setIsAdmin, false);
          safeCall(setIsOwner, false);
        }

        if (pendingUserData.isSignUp) {
          const taken: string[] = JSON.parse(localStorage.getItem('finderq_registered_usernames') || '[]');
          if (!taken.map((u: string) => u.toLowerCase()).includes(pendingUserData.username.toLowerCase())) {
            taken.push(pendingUserData.username);
            localStorage.setItem('finderq_registered_usernames', JSON.stringify(taken));
          }
          safeCall(setIsProfileOpen, true);
          toast.success('Account created successfully!', {
            description: `Welcome to FinderQ, ${pendingUserData.username}! 🎮`,
            duration: 3000,
          });
        } else {
          toast.success('Login successful!', {
            description: `Welcome back, ${pendingUserData.username}! 🎮`,
            duration: 3000,
          });
        }

        safeCall(setEnteredCode, '');
        safeCall(setPendingUserData, null);
      }
    } else {
      toast.error('Invalid code!', {
        description: 'Please check your email and try again.',
        duration: 3000,
      });
      safeCall(setEnteredCode, '');
    }
  };

  const handleResend = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    safeCall(setVerificationCode, code);
    safeCall(setEnteredCode, '');
    toast.success('Code resent!', {
      description: `New code: ${code}`,
      duration: 10000,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#242836] rounded-2xl max-w-md w-full p-8 relative border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#00d4ff] to-[#00b8e6] rounded-full flex items-center justify-center shadow-lg shadow-[#00d4ff]/50">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-white text-2xl mb-2">Verify Your Email</h2>
          <p className="text-white/60 text-sm">We've sent a 6-digit code to</p>
          <p className="text-[#00d4ff] text-sm font-medium mt-1">{verificationEmail}</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-white/80 text-sm mb-2">Verification Code</label>
            <input
              type="text"
              placeholder="000000"
              maxLength={6}
              className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white placeholder:text-white/40 text-center text-2xl tracking-widest font-mono"
              value={enteredCode ?? ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                safeCall(setEnteredCode, value);
              }}
              onKeyPress={(e) => { if (e.key === 'Enter' && (enteredCode ?? '').length === 6) handleVerify(); }}
              autoFocus
            />
            <p className="text-white/40 text-xs mt-2 text-center">
              Enter the 6-digit code from your email
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={(enteredCode ?? '').length !== 6}
            className="w-full py-3 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg hover:from-[#00b8e6] hover:to-[#009ac7] transition-all shadow-lg shadow-[#00d4ff]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify Email
          </button>

          <button
            onClick={handleResend}
            className="w-full text-[#00d4ff] hover:text-[#00b8e6] transition-colors text-sm"
          >
            Didn't receive the code? <span className="underline">Resend</span>
          </button>
        </div>
      </div>
    </div>
  );
}