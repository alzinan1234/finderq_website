// @ts-nocheck
'use client'
import { X, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  forgotPasswordEmail: string;
  setForgotPasswordEmail: (v: string) => void;
  forgotPasswordSent: boolean;
  setForgotPasswordSent: (v: boolean) => void;
  onOpenLogin: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,

  forgotPasswordEmail,
  setForgotPasswordEmail,
  forgotPasswordSent,
  setForgotPasswordSent,
  onOpenLogin,
}: ForgotPasswordModalProps) {
  if (!isOpen) return null;

  const handleSendReset = async () => {
    if (forgotPasswordEmail) {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: window.location.origin,
      });
      if (error) {
        toast.error("Failed to send reset link", { description: error.message });
      } else {
        setForgotPasswordSent(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4">
      <div
        className="rounded-2xl max-w-md w-full p-8 relative border border-white/10 shadow-2xl overflow-hidden"
        style={{
          backgroundImage: `url(/assets/HD-wallpaper-league-of-legends-video-game-teemo-league-of-legends.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: '50% center'
        }}
      >
        <div className="absolute inset-0 bg-[#242836]/50" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {!forgotPasswordSent ? (
          <>
            <div className="mb-8 relative z-10">
              <div className="w-12 h-12 rounded-full bg-[#00d4ff]/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-[#00d4ff]" />
              </div>
              <h2 className="text-white text-2xl mb-2">Reset password</h2>
              <p className="text-white/60 text-sm">Enter your email address and we&apos;ll send you a link to reset your password.</p>
            </div>
            <div className="space-y-5 relative z-10">
              <div>
                <label className="block text-white/80 text-sm mb-2">Email address</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff] text-white placeholder:text-white/40"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === "Enter") await handleSendReset();
                  }}
                />
              </div>
              <button
                onClick={handleSendReset}
                className="w-full py-3 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg hover:from-[#00b8e6] hover:to-[#009ac7] transition-all shadow-lg shadow-[#00d4ff]/30"
              >
                Send reset link
              </button>
              <p className="text-center text-white/60 text-sm">
                Remember your password?{" "}
                <button
                  onClick={() => { onClose(); onOpenLogin(); }}
                  className="text-[#00d4ff] hover:text-[#00b8e6] transition-colors"
                >
                  Log in
                </button>
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-5">
              <Mail className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-white text-2xl mb-3">Check your email</h2>
            <p className="text-white/60 text-sm mb-2">
              We sent a password reset link to
            </p>
            <p className="text-[#00d4ff] text-sm font-medium mb-6">{forgotPasswordEmail}</p>
            <p className="text-white/40 text-xs mb-8">
              Didn&apos;t receive it? Check your spam folder or{" "}
              <button
                onClick={() => setForgotPasswordSent(false)}
                className="text-[#00d4ff] hover:text-[#00b8e6] transition-colors underline"
              >
                try again
              </button>
              .
            </p>
            <button
              onClick={() => { onClose(); onOpenLogin(); }}
              className="w-full py-3 bg-[#1a1d29] border border-white/10 text-white rounded-lg hover:bg-[#1e2130] transition-all"
            >
              Back to log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
