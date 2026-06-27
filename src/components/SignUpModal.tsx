// @ts-nocheck
'use client'
import React, { useEffect, useState } from "react";
import { X, Globe } from "lucide-react";
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

const LANGUAGES = [
  { value: "en", label: "🇬🇧 English" },
  { value: "ro", label: "🇷🇴 Română" },
  { value: "pl", label: "🇵🇱 Polski" },
  { value: "tr", label: "🇹🇷 Türkçe" },
  { value: "fr", label: "🇫🇷 Français" },
  { value: "de", label: "🇩🇪 Deutsch" },
  { value: "es", label: "🇪🇸 Español" },
  { value: "it", label: "🇮🇹 Italiano" },
  { value: "pt", label: "🇵🇹 Português" },
  { value: "ru", label: "🇷🇺 Русский" },
  { value: "el", label: "🇬🇷 Ελληνικά" },
  { value: "hu", label: "🇭🇺 Magyar" },
  { value: "cs", label: "🇨🇿 Čeština" },
  { value: "sk", label: "🇸🇰 Slovenčina" },
  { value: "nl", label: "🇳🇱 Nederlands" },
  { value: "sv", label: "🇸🇪 Svenska" },
  { value: "da", label: "🇩🇰 Dansk" },
  { value: "no", label: "🇳🇴 Norsk" },
  { value: "fi", label: "🇫🇮 Suomi" },
  { value: "bg", label: "🇧🇬 Български" },
  { value: "uk", label: "🇺🇦 Українська" },
  { value: "sr", label: "🇷🇸 Srpski" },
  { value: "hr", label: "🇭🇷 Hrvatski" },
  { value: "sl", label: "🇸🇮 Slovenščina" },
];

// Valid email domains - Issue #4
const VALID_EMAIL_DOMAINS = [
  "gmail.com", "yahoo.com", "yahoo.fr", "yahoo.co.uk", "yahoo.ro",
  "hotmail.com", "outlook.com", "live.com", "icloud.com", "me.com",
  "protonmail.com", "proton.me", "mail.com", "gmx.com", "aol.com",
  "yandex.com", "yandex.ru", "msn.com", "web.de", "orange.fr",
];

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  const domain = email.trim().toLowerCase().split("@")[1] || "";
  // Accept any domain that looks like a real email domain
  return domain.includes(".") && domain.length > 3;
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
  const [showLangPrompt, setShowLangPrompt] = useState(false);

  // Issue #7: Show language selection notice on open
  useEffect(() => {
    if (isOpen) {
      setShowLangPrompt(true);
    } else {
      setShowLangPrompt(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    // Issue #4: Validate email
    if (!signUpEmail || !isValidEmail(signUpEmail)) {
      toast.error("Email invalid!", {
        description:
          "Te rugăm să introduci o adresă de email validă (ex: @gmail.com, @yahoo.com, @outlook.com).",
        duration: 4000,
      });
      return;
    }

    // Issue #7: Language required
    if (!signUpLanguage) {
      toast.error("Selectează o limbă!", {
        description: "PLEASE SELECT THE LANGUAGE YOU SPEAK MOST FLUENTLY.",
        duration: 3000,
      });
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      toast.error("Acceptă termenii!", {
        description:
          "Trebuie să accepți Termenii și Politica de Confidențialitate.",
        duration: 3000,
      });
      return;
    }

    if (!signUpUsername || !signUpEmail || !signUpPassword) {
      toast.error("Completează toate câmpurile!", { duration: 3000 });
      return;
    }

    if (signUpPassword.length < 6) {
      toast.error("Parolă prea scurtă!", {
        description: "Parola trebuie să aibă cel puțin 6 caractere.",
        duration: 3000,
      });
      return;
    }

    // Check username taken
    const takenUsernames: string[] = JSON.parse(
      localStorage.getItem("finderq_registered_usernames") || "[]"
    );
    if (
      takenUsernames
        .map((u: string) => u.toLowerCase())
        .includes(signUpUsername.toLowerCase())
    ) {
      toast.error("Username already taken!", {
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
      region: "Not set",
      language: signUpLanguage,
      isOwner: signUpUsername.toLowerCase().includes("owner"),
      isAdmin: signUpUsername.toLowerCase().includes("admin"),
      isSignUp: true,
      joinDate: new Date().toISOString().split("T")[0],
    });

    // Save preferred language
    if (typeof window !== "undefined") {
      localStorage.setItem("finderq_language", signUpLanguage);
      localStorage.setItem("finderq_account_language", signUpLanguage);
    }

    toast.info("📋 Your Verification Code", {
      description: code,
      duration: 30000,
      style: {
        background: "linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)",
        border: "2px solid #00d4ff",
        color: "#00d4ff",
        fontSize: "20px",
        fontWeight: "bold",
        letterSpacing: "4px",
        padding: "20px",
      },
    });

    onClose();
    setIsVerificationOpen(true);

    setSignUpUsername("");
    setSignUpEmail("");
    setSignUpPassword("");
    setSignUpLanguage("en");
    setAgreedToTerms(false);
    setAgreedToPrivacy(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 overflow-y-auto p-3 sm:p-4">
      <div
        className="rounded-2xl max-w-md w-full mx-auto relative border-2 border-[#00d4ff]/30 shadow-2xl overflow-hidden my-4"
        style={{
          backgroundImage: `url(/assets/a78867c7-e653-4dc1-a775-af0dacbbb6ef.png)`,
          backgroundSize: "cover",
          backgroundPosition: "70% center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#242836]/80 via-[#242836]/40 to-[#242836]/80" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-20 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative z-10 p-6 sm:p-8">
          {/* Issue #7: Language notice banner */}
          {showLangPrompt && (
            <div className="mb-5 flex items-start gap-3 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-xl p-3">
              <Globe className="w-5 h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[#00d4ff] text-sm font-semibold">
                  PLEASE SELECT THE LANGUAGE YOU SPEAK MOST FLUENTLY
                </p>
                <p className="text-white/50 text-xs mt-0.5">
                  Language selection is required to create your account.
                </p>
              </div>
              <button
                onClick={() => setShowLangPrompt(false)}
                className="text-white/30 hover:text-white/60 ml-auto flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-1">
              {t("joinFinderQ")}
            </h2>
            <p className="text-white/60 text-sm">{t("createAccountStart")}</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-white/80 text-sm mb-1.5 font-medium">
                {t("username")}
              </label>
              <input
                type="text"
                placeholder={t("enterUsername")}
                className="w-full px-4 py-2.5 bg-[#1a1d29]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 focus:border-[#00d4ff]/50 text-white placeholder:text-white/30 text-sm transition-all"
                value={signUpUsername}
                onChange={(e) => setSignUpUsername(e.target.value)}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white/80 text-sm mb-1.5 font-medium">
                {t("email")}
              </label>
              <input
                type="email"
                placeholder="example@gmail.com"
                className="w-full px-4 py-2.5 bg-[#1a1d29]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 focus:border-[#00d4ff]/50 text-white placeholder:text-white/30 text-sm transition-all"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
              />
              <p className="text-white/30 text-xs mt-1">
                Accepted: @gmail.com, @yahoo.com, @outlook.com, etc.
              </p>
            </div>

            {/* Language Selection - Issue #7 */}
            <div>
              <label className="block text-white/80 text-sm mb-1.5 font-medium">
                {t("selectLanguage")}{" "}
                <span className="text-red-400">*</span>
              </label>
              <select
                value={signUpLanguage}
                onChange={(e) => setSignUpLanguage(e.target.value)}
                className={`w-full px-4 py-2.5 bg-[#1a1d29]/80 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 text-white text-sm transition-all appearance-none cursor-pointer ${
                  signUpLanguage === ""
                    ? "border-red-500/50"
                    : "border-white/10 focus:border-[#00d4ff]/50"
                }`}
              >
                <option value="" disabled className="bg-[#1a1d29]">
                  -- Select your language --
                </option>
                {LANGUAGES.map((lang) => (
                  <option
                    key={lang.value}
                    value={lang.value}
                    className="bg-[#1a1d29]"
                  >
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/80 text-sm mb-1.5 font-medium">
                {t("password")}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-[#1a1d29]/80 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 focus:border-[#00d4ff]/50 text-white placeholder:text-white/30 text-sm transition-all"
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
              />
            </div>

            {/* Terms & Privacy - Issue: privacy link fixed */}
            <div className="space-y-2.5 pt-1">
              {/* Terms */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setAgreedToTerms((prev) => !prev)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    agreedToTerms
                      ? "bg-[#00d4ff] border-[#00d4ff]"
                      : "border-white/30 bg-transparent hover:border-white/50"
                  }`}
                >
                  {agreedToTerms && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <p className="text-white/60 text-xs leading-relaxed">
                  Am citit și sunt de acord cu{" "}
                  <button
                    type="button"
                    className="text-[#00d4ff] hover:text-[#00b8e6] hover:underline font-medium transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (typeof onOpenTerms === "function") {
                        onOpenTerms();
                      }
                    }}
                  >
                    Termenii și Condițiile
                  </button>
                </p>
              </div>

              {/* Privacy Policy - FIXED */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setAgreedToPrivacy((prev) => !prev)}
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    agreedToPrivacy
                      ? "bg-[#00d4ff] border-[#00d4ff]"
                      : "border-white/30 bg-transparent hover:border-white/50"
                  }`}
                >
                  {agreedToPrivacy && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <p className="text-white/60 text-xs leading-relaxed">
                  Am citit și sunt de acord cu{" "}
                  {/* Privacy Policy link - properly isolated from checkbox click */}
                  <button
                    type="button"
                    className="text-[#00d4ff] hover:text-[#00b8e6] hover:underline font-medium transition-colors relative z-30"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (typeof onOpenPrivacyPolicy === "function") {
                        onOpenPrivacyPolicy();
                      } else {
                        console.error("onOpenPrivacyPolicy is not a function", onOpenPrivacyPolicy);
                      }
                    }}
                  >
                    Politica de Confidențialitate
                  </button>
                </p>
              </div>
            </div>

            {/* Submit Button - Issue #5: basic button instead of image */}
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-3 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[#00d4ff]/20 text-sm sm:text-base mt-2"
            >
              {t("createAccount") || "Create Account"}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-3 text-white/40">
                  {t("or") || "or"}
                </span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={() => {
                const email = `user${Math.floor(Math.random() * 10000)}@gmail.com`;
                setGoogleEmail(email);
                setIsGoogleSignUp(true);
                onClose();
                setIsGoogleNamePromptOpen(true);
              }}
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-800 rounded-xl transition-all shadow-md flex items-center justify-center gap-3 font-semibold text-sm border border-gray-200"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t("continueWithGoogle") || "Continue with Google"}
            </button>

            {/* Login Link */}
            <p className="text-center text-white/50 text-sm">
              {t("alreadyHaveAccount") || "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="text-[#00d4ff] hover:text-[#00b8e6] font-semibold transition-colors"
              >
                {t("logIn") || "Log In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}