// @ts-nocheck
'use client'
import { X, Crown, Check, Palette, Upload, ZoomIn, ZoomOut, MoveHorizontal, MoveVertical, Square, CreditCard } from "lucide-react";
import { useState, useRef } from "react";
const premiumLogo = '/assets/ChatGPT_Image_Jun_10__2026__09_38_34_AM-removebg-preview-1.png';
const subscribeLogo = '/assets/ChatGPT_Image_Jun_10__2026__09_38_34_AM-removebg-preview-2.png';
import { toast } from "sonner";
import { BorderPickerModal } from "./BorderPickerModal";

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userNameColor: string;
  setUserNameColor: (color: string) => void;
  setIsColorPickerOpen: (open: boolean) => void;
  userProfileBackground: string;
  setIsBackgroundPickerOpen: (open: boolean) => void;
  userPostBackground: string;
  setIsPostBackgroundPickerOpen: (open: boolean) => void;
  postImage: string;
  setPostImage: (image: string) => void;
  tempPostImage: string;
  setTempPostImage: (v: string) => void;
  imageZoom: number;
  setImageZoom: (v: number) => void;
  imagePositionX: number;
  setImagePositionX: (v: number) => void;
  imagePositionY: number;
  setImagePositionY: (v: number) => void;
  hasPremium: boolean;
  setHasPremium: (premium: boolean) => void;
  postBorder: string;
  setPostBorder: (border: string) => void;
}

const BENEFITS = [
  { icon: <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />, title: "No Post Cooldowns", desc: "Post unlimited announcements instantly" },
  { icon: <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89b3c] flex-shrink-0 mt-0.5" />, title: "Custom Username Colors", desc: "Stand out with unique gradient colors" },
  { icon: <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />, title: "Custom Backgrounds", desc: "Personalize profile & posts with custom gradients" },
  { icon: <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89b3c] flex-shrink-0 mt-0.5" />, title: "Custom Post Borders", desc: "Gold, glow, rainbow and more frame effects" },
  { icon: <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d4ff] flex-shrink-0 mt-0.5" />, title: "Premium Badge & Priority Support", desc: "Show your status & get faster response times" },
];

const borderStyle = (postBorder: string): React.CSSProperties => {
  const animGradients: Record<string, string> = {
    rainbow: 'linear-gradient(90deg, #ff0080, #ff8c00, #ffe500, #00ff80, #00d4ff, #a855f7, #ff0080)',
    fire:    'linear-gradient(90deg, #ff4500, #ff8c00, #ffd700, #ff4500)',
    aurora:  'linear-gradient(90deg, #00d4ff, #a855f7, #ec4899, #00d4ff)',
  };
  const staticStyles: Record<string, React.CSSProperties> = {
    default:      { borderColor: 'rgba(0,212,255,0.5)',   boxShadow: '0 0 10px rgba(0,212,255,0.2)',   border: '2px solid' },
    gold:         { borderColor: 'rgba(200,155,60,0.8)',  boxShadow: '0 0 12px rgba(200,155,60,0.4)',  border: '2px solid' },
    silver:       { borderColor: 'rgba(192,192,192,0.7)', boxShadow: '0 0 12px rgba(192,192,192,0.3)', border: '2px solid' },
    purple:       { borderColor: 'rgba(168,85,247,0.8)',  boxShadow: '0 0 12px rgba(168,85,247,0.4)',  border: '2px solid' },
    red:          { borderColor: 'rgba(239,68,68,0.8)',   boxShadow: '0 0 12px rgba(239,68,68,0.4)',   border: '2px solid' },
    green:        { borderColor: 'rgba(34,197,94,0.8)',   boxShadow: '0 0 12px rgba(34,197,94,0.4)',   border: '2px solid' },
    pink:         { borderColor: 'rgba(236,72,153,0.8)',  boxShadow: '0 0 12px rgba(236,72,153,0.4)',  border: '2px solid' },
    orange:       { borderColor: 'rgba(249,115,22,0.8)',  boxShadow: '0 0 12px rgba(249,115,22,0.4)',  border: '2px solid' },
    glow:         { borderColor: 'rgba(0,212,255,0.9)',   boxShadow: '0 0 20px rgba(0,212,255,0.7), 0 0 40px rgba(0,212,255,0.3)',   border: '2px solid' },
    'glow-gold':  { borderColor: 'rgba(200,155,60,0.9)',  boxShadow: '0 0 20px rgba(200,155,60,0.7), 0 0 40px rgba(200,155,60,0.3)',  border: '2px solid' },
    'glow-purple':{ borderColor: 'rgba(168,85,247,0.9)',  boxShadow: '0 0 20px rgba(168,85,247,0.7), 0 0 40px rgba(168,85,247,0.3)', border: '2px solid' },
    'glow-green': { borderColor: 'rgba(34,197,94,0.9)',   boxShadow: '0 0 20px rgba(34,197,94,0.7), 0 0 40px rgba(34,197,94,0.3)',   border: '2px solid' },
    'glow-red':   { borderColor: 'rgba(239,68,68,0.9)',   boxShadow: '0 0 20px rgba(239,68,68,0.7), 0 0 40px rgba(239,68,68,0.3)',   border: '2px solid' },
    'glow-pink':  { borderColor: 'rgba(236,72,153,0.9)',  boxShadow: '0 0 20px rgba(236,72,153,0.7), 0 0 40px rgba(236,72,153,0.3)', border: '2px solid' },
    none:         { border: 'none' },
  };
  if (animGradients[postBorder]) {
    return {
      border: '2px solid transparent',
      background: `linear-gradient(#0a0e27, #0a0e27) padding-box, ${animGradients[postBorder]} border-box`,
      boxShadow: '0 0 10px rgba(168,85,247,0.4)',
    };
  }
  return staticStyles[postBorder] ?? staticStyles.default;
};

export function PremiumModal({
  isOpen, onClose, userName, userNameColor, setUserNameColor,
  setIsColorPickerOpen, userProfileBackground, setIsBackgroundPickerOpen,
  userPostBackground, setIsPostBackgroundPickerOpen, postImage, setPostImage,
  tempPostImage, setTempPostImage, imageZoom, setImageZoom,
  imagePositionX, setImagePositionX, imagePositionY, setImagePositionY,
  hasPremium, setHasPremium, postBorder, setPostBorder
}: PremiumModalProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isBorderPickerOpen, setIsBorderPickerOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // FIX: these props can arrive as undefined for a render or two (e.g. before
  // localStorage/profile data has loaded in the parent), which crashed
  // .startsWith() / .replace() below. Fall back to safe defaults so the modal
  // never throws — it just shows the same "default" look until the real
  // value lands.
  const safeProfileBackground = userProfileBackground ?? '';
  const safePostBackground = userPostBackground ?? '';
  const safePostBorder = postBorder ?? 'default';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setTempPostImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSavePostImage = () => {
    setPostImage(tempPostImage);
    localStorage.setItem('finderq_post_image', tempPostImage);
    localStorage.setItem('finderq_post_image_zoom', String(imageZoom));
    localStorage.setItem('finderq_post_image_x', String(imagePositionX));
    localStorage.setItem('finderq_post_image_y', String(imagePositionY));
    toast.success('Post background image saved!');
  };

  const handleSubscribe = () => {
    setHasPremium(true);
    localStorage.setItem('finderq_premium', 'true');
    setShowPaymentModal(false);
    toast.success('Premium activated! Unlimited posting and full customization unlocked.');
  };

  const handleCancelSubscription = () => {
    setHasPremium(false);
    localStorage.setItem('finderq_premium', 'false');
    toast.success('Premium subscription cancelled.');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-2 sm:p-4">
      <div className="bg-gradient-to-br from-[#1a1d29] via-[#242836] to-[#1a1d29] rounded-2xl w-full max-w-6xl border-2 border-[#c89b3c]/40 shadow-2xl shadow-[#c89b3c]/20 relative overflow-hidden my-2 sm:my-4">

        {/* Animated bg blobs */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#c89b3c]/5 via-transparent to-[#00d4ff]/5 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#c89b3c]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-[#00d4ff]/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="relative border-b border-[#c89b3c]/20 bg-gradient-to-r from-[#1a1d29]/80 to-[#242836]/80 backdrop-blur-sm">
          <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <img
                src={premiumLogo}
                alt="FinderQ Premium"
                className="w-12 h-12 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain flex-shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-transparent bg-gradient-to-r from-[#c89b3c] via-[#00d4ff] to-[#c89b3c] bg-clip-text text-lg sm:text-2xl md:text-3xl font-bold leading-tight">
                  FinderQ Premium
                </h2>
                <p className="text-white/60 text-xs sm:text-sm mt-0.5">Customize your profile with premium features</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-2 sm:p-3 hover:bg-white/5 rounded-lg transition-all flex-shrink-0"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-white/60 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="relative p-3 sm:p-5 md:p-8 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
          <div className="space-y-5 sm:space-y-6">

            {/* ── NOT PREMIUM: upgrade card ── */}
            {!hasPremium ? (
              <div className="bg-[#1a1d29] rounded-xl p-4 sm:p-6 md:p-8 border border-[#c89b3c]/30">
                <div className="text-center mb-6 sm:mb-8">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <img src={premiumLogo} alt="FinderQ Premium" className="w-28 sm:w-40 md:w-56 h-28 sm:h-40 md:h-56 object-contain drop-shadow-lg" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2">Upgrade to Premium</h3>
                  <p className="text-white/60 text-xs sm:text-sm">Unlock exclusive features and remove all limitations</p>
                </div>

                {/* Price */}
                <div className="bg-[#0a0e27] rounded-lg p-4 sm:p-6 mb-5 sm:mb-6 border border-[#c89b3c]/20">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">€10</span>
                    <span className="text-white/60 text-base sm:text-lg">/month</span>
                  </div>
                  <p className="text-white/50 text-xs text-center">Cancel anytime · No hidden fees</p>
                </div>

                {/* Benefits */}
                <div className="space-y-3 mb-5 sm:mb-6">
                  {BENEFITS.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 sm:gap-3">
                      {b.icon}
                      <div>
                        <p className="text-white font-medium text-xs sm:text-sm">{b.title}</p>
                        <p className="text-white/60 text-xs">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] hover:from-[#00d4ff] hover:to-[#c89b3c] text-white rounded-lg transition-all font-bold text-base sm:text-lg flex items-center justify-center gap-2"
                >
                  <Crown className="w-5 h-5" />
                  Subscribe Now
                </button>
              </div>
            ) : (
              /* ── PREMIUM ACTIVE STATUS ── */
              <div className="bg-green-500/10 rounded-xl p-4 sm:p-6 border border-green-500/30">
                <div className="flex items-start gap-3 sm:gap-4">
                  <img src={premiumLogo} alt="Premium" className="w-14 h-14 sm:w-20 sm:h-20 md:w-[130px] md:h-[130px] object-contain flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-green-400 font-bold text-base sm:text-lg mb-1">Premium Active</h3>
                    <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3">You have access to all premium features</p>
                    <div className="flex items-start gap-2 text-xs text-white/60 mb-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>No cooldowns · Custom colors · Custom borders · Priority support</span>
                    </div>
                    <button
                      onClick={handleCancelSubscription}
                      className="text-red-400 hover:text-red-300 text-xs sm:text-sm font-medium transition-colors"
                    >
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Divider */}
            {hasPremium && (
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/60 text-xs sm:text-sm font-semibold">Customization</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}

            {/* ── CUSTOMIZATION OPTIONS ── */}
            {hasPremium && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

                {/* 1. USERNAME COLOR */}
                <div className="bg-[#1a1d29] rounded-xl p-4 sm:p-5 border border-[#c89b3c]/20">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89b3c]" />
                      Username Color
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/30 rounded-full px-2 py-0.5">
                      <Check className="w-3 h-3" /> Applied
                    </span>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-white/50 text-xs mb-2">Current:</p>
                    <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">{userName?.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <p className={`font-bold text-base sm:text-lg bg-gradient-to-r ${userNameColor} bg-clip-text text-transparent truncate`}>
                        {userName}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsColorPickerOpen(true)}
                    className="w-full py-2.5 sm:py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    Change Color
                  </button>
                </div>

                {/* 2. PROFILE BACKGROUND */}
                <div className="bg-[#1a1d29] rounded-xl p-4 sm:p-5 border border-[#00d4ff]/20">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                      <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d4ff]" />
                      Profile Background
                    </h3>
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/30 rounded-full px-2 py-0.5">
                      <Check className="w-3 h-3" /> Applied
                    </span>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-white/50 text-xs mb-2">Current:</p>
                    <div
                      className={`p-6 sm:p-8 rounded-lg border border-white/10 ${!safeProfileBackground.startsWith('CUSTOM:') ? `bg-gradient-to-br ${safeProfileBackground}` : ''}`}
                      style={safeProfileBackground.startsWith('CUSTOM:') ? { background: safeProfileBackground.replace('CUSTOM:', '') } : undefined}
                    >
                      <div className="flex items-center justify-center">
                        <p className="text-white/80 text-xs font-medium">Preview</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsBackgroundPickerOpen(true)}
                    className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] hover:from-[#00d4ff] hover:to-[#c89b3c] text-white rounded-lg transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    Change Background
                  </button>
                </div>
              </div>
            )}

            {/* 3. POST BORDER */}
            {hasPremium && (
              <div className="bg-[#1a1d29] rounded-xl p-4 sm:p-6 border border-[#a855f7]/20">
                <h3 className="text-white font-semibold text-base sm:text-lg mb-1 flex items-center gap-2">
                  <Square className="w-4 h-4 sm:w-5 sm:h-5 text-[#a855f7]" />
                  Post Border
                </h3>
                <p className="text-white/50 text-xs sm:text-sm mb-4 sm:mb-5">Choose a frame style for your announcements</p>

                <div className="mb-3 sm:mb-4">
                  <p className="text-white/50 text-xs mb-2">Current:</p>
                  <div className="flex items-center gap-3 p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex-shrink-0 bg-[#0a0e27]"
                      style={borderStyle(safePostBorder)}
                    />
                    <p className="text-white font-semibold text-xs sm:text-sm capitalize">
                      {safePostBorder === 'none' ? 'No Border' : safePostBorder.replace('-', ' ')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsBorderPickerOpen(true)}
                  className="w-full py-2.5 sm:py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                >
                  <Square className="w-4 h-4 text-[#a855f7]" />
                  Change Border
                </button>
              </div>
            )}

            {/* 4. POST BACKGROUND */}
            {hasPremium && (
              <div className="bg-[#1a1d29] rounded-xl p-4 sm:p-6 border border-[#c89b3c]/20">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white font-semibold text-base sm:text-lg flex items-center gap-2">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89b3c]" />
                    Post Background
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-semibold text-green-400 bg-green-400/10 border border-green-400/30 rounded-full px-2 py-0.5">
                    <Check className="w-3 h-3" /> Applied
                  </span>
                </div>
                <p className="text-white/50 text-xs sm:text-sm mb-4 sm:mb-5">Customize backgrounds for your announcements</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {/* Left: Preview & Color */}
                  <div>
                    <p className="text-white/50 text-xs mb-2">Current style:</p>
                    <div
                      className={`p-8 sm:p-12 rounded-lg border border-white/10 mb-3 sm:mb-4 ${!safePostBackground.startsWith('CUSTOM:') ? `bg-gradient-to-br ${safePostBackground}` : ''}`}
                      style={safePostBackground.startsWith('CUSTOM:') ? { background: safePostBackground.replace('CUSTOM:', '') } : undefined}
                    >
                      <div className="flex items-center justify-center">
                        <p className="text-white/80 text-xs font-medium">Post Preview</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPostBackgroundPickerOpen(true)}
                      className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] hover:from-[#00d4ff] hover:to-[#c89b3c] text-white rounded-lg transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <Palette className="w-4 h-4" />
                      Change Background Color
                    </button>
                  </div>

                  {/* Right: Image Controls */}
                  <div className="space-y-3">
                    <p className="text-white/60 text-xs sm:text-sm font-semibold">Add Image Background</p>

                    {postImage && (
                      <div className="flex items-start sm:items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-xs font-semibold">Image active</p>
                          <p className="text-white/50 text-xs">This image is overriding your background color</p>
                        </div>
                        <button
                          onClick={() => {
                            setPostImage('');
                            setTempPostImage('');
                            localStorage.removeItem('finderq_post_image');
                          }}
                          className="px-2.5 sm:px-3 py-1.5 bg-red-500/20 hover:bg-red-500/40 border border-red-500/50 rounded-lg text-red-400 text-xs font-semibold transition-all flex items-center gap-1 flex-shrink-0"
                        >
                          <X className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    )}

                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all text-white text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload from PC
                    </button>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-white/20" />
                      <span className="text-white/50 text-xs">OR</span>
                      <div className="flex-1 h-px bg-white/20" />
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Paste image URL"
                        className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#c89b3c] focus:border-[#c89b3c]/50 text-white placeholder:text-white/30 transition-all text-xs sm:text-sm"
                        value={tempPostImage || ''}
                        onChange={(e) => setTempPostImage(e.target.value)}
                      />
                      {tempPostImage && (
                        <button
                          onClick={() => setTempPostImage('')}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded transition-colors"
                        >
                          <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/40 hover:text-white/80" />
                        </button>
                      )}
                    </div>

                    {tempPostImage && (
                      <div className="space-y-3 mt-3 sm:mt-4">
                        {/* Preview */}
                        <div className="relative h-36 sm:h-48 rounded-lg overflow-hidden border border-white/10">
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundImage: `url(${tempPostImage})`,
                              backgroundSize: `${imageZoom}%`,
                              backgroundPosition: `${imagePositionX}% ${imagePositionY}%`,
                              backgroundRepeat: 'no-repeat'
                            }}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <p className="text-white/90 text-xs font-semibold bg-black/50 px-3 py-1.5 rounded">Live Preview</p>
                          </div>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-2">
                          {[
                            { label: 'Zoom', icon: <ZoomIn className="w-3.5 h-3.5" />, value: imageZoom, min: 50, max: 200, onChange: setImageZoom },
                            { label: 'Horizontal', icon: <MoveHorizontal className="w-3.5 h-3.5" />, value: imagePositionX, min: 0, max: 100, onChange: setImagePositionX },
                            { label: 'Vertical', icon: <MoveVertical className="w-3.5 h-3.5" />, value: imagePositionY, min: 0, max: 100, onChange: setImagePositionY },
                          ].map(s => (
                            <div key={s.label}>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-white/70 text-xs flex items-center gap-1">
                                  {s.icon} {s.label}
                                </label>
                                <span className="text-white text-xs font-semibold">{s.value}%</span>
                              </div>
                              <input
                                type="range"
                                min={s.min}
                                max={s.max}
                                value={s.value}
                                onChange={(e) => s.onChange(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                              />
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={handleSavePostImage}
                          className="w-full py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-lg transition-all text-xs sm:text-sm font-semibold flex items-center justify-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Save Image Background
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <BorderPickerModal
        isOpen={isBorderPickerOpen}
        onClose={() => setIsBorderPickerOpen(false)}
        currentBorder={safePostBorder}
        onSave={(border) => {
          setPostBorder(border);
          toast.success('Post border saved!');
        }}
      />

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[60] p-2 sm:p-4">
          <div className="bg-[#1a1d29] rounded-2xl w-full max-w-md border border-[#c89b3c]/30 p-4 sm:p-6 my-4 sm:my-0">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89b3c]" />
                Complete Payment
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-white/60 hover:text-white transition-colors p-1">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
              <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-white/70 text-xs sm:text-sm">FinderQ Premium</span>
                  <span className="text-white font-bold text-sm sm:text-base">€10.00</span>
                </div>
                <div className="text-white/50 text-xs">Monthly subscription · Billed monthly</div>
              </div>

              <div className="bg-[#c89b3c]/10 rounded-lg p-2.5 sm:p-3 border border-[#c89b3c]/30">
                <p className="text-white/70 text-xs text-center flex items-center justify-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[#c89b3c]" />
                  Demo Mode: Click "Activate Premium" to simulate payment
                </p>
              </div>
            </div>

            <button
              onClick={handleSubscribe}
              className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] hover:from-[#00d4ff] hover:to-[#c89b3c] text-white rounded-lg transition-all font-bold text-sm sm:text-base flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              Activate Premium
            </button>
          </div>
        </div>
      )}
    </div>
  );
}