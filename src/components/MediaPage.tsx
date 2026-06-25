// @ts-nocheck
'use client'
import { useState, useEffect } from "react";
const mediaBackground = '/assets/League_Of_Legends_Mostly_HD_Wallpaper_Album_Over.jpg';
const mediaTabLogo = '/assets/Teemo_cs.png';
const mediaPremiumLogo = '/assets/ChatGPT_Image_Jun_17__2026__11_49_47_PM_1_-removebg-preview-1.png';
import {
  Image,
  Video,
  Smile,
  Zap,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Upload,
  Plus,
  Play,
  Send,
  MoreHorizontal,
  X,
  Flag,
} from "lucide-react";
import { toast } from "sonner";

const LANG_FLAGS: Record<string, string> = {
  en: "🇬🇧", ro: "🇷🇴", pl: "🇵🇱", tr: "🇹🇷", fr: "🇫🇷", de: "🇩🇪",
  es: "🇪🇸", it: "🇮🇹", pt: "🇵🇹", ru: "🇷🇺", el: "🇬🇷", hu: "🇭🇺",
  cs: "🇨🇿", sk: "🇸🇰", nl: "🇳🇱", sv: "🇸🇪", da: "🇩🇰", no: "🇳🇴",
  fi: "🇫🇮", bg: "🇧🇬", uk: "🇺🇦", sr: "🇷🇸", hr: "🇭🇷", sl: "🇸🇮",
};
const getLangFlag = (lang: string) => LANG_FLAGS[lang] || "🌐";

export interface PlayerProfileData {
  username: string;
  color: string;
  avatar?: string;
  banner?: string;
  riotVerified?: boolean;
  isPremium?: boolean;
  userNameColor?: string;
  userProfileBackground?: string;
  tags?: { text: string }[];
}

interface PublicProfile {
  author: string;
  authorColor: string;
}

type UserStatusType = 'online' | 'busy' | 'offline' | null;

function seededRand(seed: string, max: number, offset = 0) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  return (Math.abs(h) % max) + offset;
}

function UserProfileModal({ profile, playerData, onClose, getUserStatus }: { profile: PublicProfile; playerData?: PlayerProfileData; onClose: () => void; getUserStatus?: (u: string) => UserStatusType }) {
  const s = profile.author;

  const BADGES = [
    { label: "Top Poster", color: "bg-red-500/20 text-red-300 border-red-500/30" },
    { label: "Meme Lord", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
    { label: "Highlight Reel", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { label: "Early Adopter", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    { label: "Clip Master", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  ];

  const POST_TITLES = ["Pentakill insane", "Baron steal clutch", "Best play ever", "1v5 carry", "Perfect CS game", "Dragon soul secured", "Insane Zed outplay", "Ranked anxiety meme", "Jungle diff"];
  const CATEGORIES: Category[] = ["screenshot", "clip", "meme", "highlight"];

  const hasPremium = seededRand(s + "prem", 3) === 0;
  const liveStatus = getUserStatus ? getUserStatus(profile.author) : null;
  const status = liveStatus ?? null;
  const totalPosts = seededRand(s + "p", 120, 5);
  const followers = seededRand(s + "fol", 800, 20);
  const following = seededRand(s + "fing", 300, 10);
  const totalQ = seededRand(s + "q", 8000, 200);
  const joinedDaysAgo = seededRand(s + "j", 600, 30);

  const catCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat, i) => {
    acc[cat] = seededRand(s + "cat" + i, 40, 1);
    return acc;
  }, {});

  const userBadges = BADGES.filter((_, i) => seededRand(s + "b" + i, 3) === 0).slice(0, 3);

  const recentPosts = Array.from({ length: 2 }, (_, i) => ({
    id: i,
    title: POST_TITLES[seededRand(s + "rp" + i, POST_TITLES.length)],
    category: CATEGORIES[seededRand(s + "rc" + i, 4)],
    q: seededRand(s + "rq" + i, 600, 5),
    comments: seededRand(s + "rcm" + i, 50, 0),
    timeAgo: ["1h", "3h", "1d", "2d", "5d", "1w"][seededRand(s + "rt" + i, 6)] + " ago",
    imgColor: ["1a1d29/00d4ff", "242836/c89b3c", "0a0e27/ff4444", "1a1d29/00ff88"][seededRand(s + "rimg" + i, 4)],
  }));

  const mostPosted = CATEGORIES.reduce((a, b) => catCounts[a] > catCounts[b] ? a : b);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4" onClick={onClose}>
      <div className="w-full max-w-md bg-[#0a0e1f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
      <UserProfileContent profile={profile} playerData={playerData} getUserStatus={getUserStatus} />
      <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-full bg-black/50 text-white/60 hover:text-white transition-colors z-10">
        <X size={16} />
      </button>
    </div>
    </div>
  );
}

function UserProfileContent({ profile, playerData, getUserStatus, onClose, onReportProfile }: { profile: PublicProfile; playerData?: PlayerProfileData; getUserStatus?: (u: string) => UserStatusType; onClose?: () => void; onReportProfile?: (username: string, avatarUrl?: string, bannerUrl?: string, reason?: string, details?: string) => void }) {
  const s = profile.author;
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportError, setReportError] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const BADGES = [
    { label: "Top Poster", color: "bg-red-500/20 text-red-300 border-red-500/30" },
    { label: "Meme Lord", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
    { label: "Highlight Reel", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
    { label: "Early Adopter", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
    { label: "Clip Master", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  ];

  const POST_TITLES = ["Pentakill insane", "Baron steal clutch", "Best play ever", "1v5 carry", "Perfect CS game", "Dragon soul secured", "Insane Zed outplay", "Ranked anxiety meme", "Jungle diff"];
  const CATEGORIES: Category[] = ["screenshot", "clip", "meme", "highlight"];

  const hasPremium = seededRand(s + "prem", 3) === 0;
  const liveStatus = getUserStatus ? getUserStatus(profile.author) : null;
  const status = liveStatus ?? null;
  const totalPosts = seededRand(s + "p", 120, 5);
  const followers = seededRand(s + "fol", 800, 20);
  const following = seededRand(s + "fing", 300, 10);
  const totalQ = seededRand(s + "q", 8000, 200);
  const joinedDaysAgo = seededRand(s + "j", 600, 30);

  const catCounts = CATEGORIES.reduce<Record<string, number>>((acc, cat, i) => {
    acc[cat] = seededRand(s + "cat" + i, 40, 1);
    return acc;
  }, {});

  const userBadges = BADGES.filter((_, i) => seededRand(s + "b" + i, 3) === 0).slice(0, 3);

  const recentPosts = Array.from({ length: 2 }, (_, i) => ({
    id: i,
    title: POST_TITLES[seededRand(s + "rp" + i, POST_TITLES.length)],
    category: CATEGORIES[seededRand(s + "rc" + i, 4)],
    q: seededRand(s + "rq" + i, 600, 5),
    comments: seededRand(s + "rcm" + i, 50, 0),
    timeAgo: ["1h", "3h", "1d", "2d", "5d", "1w"][seededRand(s + "rt" + i, 6)] + " ago",
    imgColor: ["1a1d29/00d4ff", "242836/c89b3c", "0a0e27/ff4444", "1a1d29/00ff88"][seededRand(s + "rimg" + i, 4)],
  }));

  const mostPosted = CATEGORIES.reduce((a, b) => catCounts[a] > catCounts[b] ? a : b);

  return (
    <div className="w-full h-full bg-[#0a0e1f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
      {/* Banner */}
      <div className="relative h-32 flex-shrink-0 overflow-hidden">
        {playerData?.banner ? (
          <img src={playerData.banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            <div className={`absolute inset-0 bg-gradient-to-br ${profile.authorColor}`} style={{ opacity: 0.45 }} />
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`absolute rounded-full bg-gradient-to-br ${profile.authorColor}`}
                style={{ opacity: 0.25, width: seededRand(s+"dw"+i,50,10)+"px", height: seededRand(s+"dh"+i,50,10)+"px", left: seededRand(s+"dx"+i,90)+"%", top: seededRand(s+"dy"+i,90)+"%" }} />
            ))}
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0e1f]" />
      </div>

      {/* Avatar + info */}
      <div className="px-4 pt-2 pb-3 flex-shrink-0 bg-[#0a0e1f]">
        <div className="flex items-end gap-3 -mt-10">
          <div className="relative flex-shrink-0">
            {playerData?.avatar ? (
              <img src={playerData.avatar} alt={profile.author} className="w-20 h-20 rounded-2xl object-cover shadow-2xl border-4 border-[#0a0e1f]" />
            ) : (
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${profile.authorColor} flex items-center justify-center text-3xl font-black text-white shadow-2xl border-4 border-[#0a0e1f]`}>
                {profile.author[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="pb-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold bg-gradient-to-r ${playerData?.userNameColor ?? profile.authorColor} bg-clip-text text-transparent`}>{profile.author}</span>
              {(playerData?.isPremium || hasPremium) && (
                <div className="flex items-center gap-1">
                  <img src={mediaPremiumLogo} alt="Premium" className="w-8 h-8 object-contain -ml-1" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] font-bold text-[10px]">Premium</span>
                </div>
              )}
              {playerData?.riotVerified && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">✓ Riot Verified</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs flex-wrap">
              {playerData?.tags?.slice(0, 2).map((t, i) => (
                <span key={i} className="text-white/40">{t.text}{i < Math.min((playerData.tags?.length ?? 0), 2) - 1 ? " ·" : ""}</span>
              ))}
              {!playerData?.tags?.length && (
                <>
                  {status === 'online' && <span className="text-yellow-400">● Online</span>}
                  {status === 'busy' && <span className="text-red-400">● Busy</span>}
                  {status === 'offline' && <span className="text-white/30">● Offline</span>}
                  {!status && <span className="text-white/30">Joined {joinedDaysAgo}d ago</span>}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        {userBadges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {userBadges.map((b) => (
              <span key={b.label} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${b.color}`}>{b.label}</span>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 pb-4 overflow-y-auto">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-3">
          <div className="bg-[#12152a] rounded-xl py-2 text-center border border-white/5">
            <p className="text-sm font-bold text-white leading-none">{totalPosts}</p>
            <p className="text-white/35 text-[10px] mt-0.5">Posts</p>
          </div>
          <button
            onClick={() => setShowFollowersModal(true)}
            className="bg-[#12152a] rounded-xl py-2 text-center border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer"
          >
            <p className="text-sm font-bold text-white leading-none">{followers}</p>
            <p className="text-white/35 text-[10px] mt-0.5">Followers</p>
          </button>
          <button
            onClick={() => setShowFollowingModal(true)}
            className="bg-[#12152a] rounded-xl py-2 text-center border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all cursor-pointer"
          >
            <p className="text-sm font-bold text-white leading-none">{following}</p>
            <p className="text-white/35 text-[10px] mt-0.5">Following</p>
          </button>
        </div>

        {/* Total Q */}
        <div className="mb-3 rounded-xl px-3 py-2 bg-gradient-to-r from-[#00d4ff]/10 to-transparent border border-[#00d4ff]/15 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-[10px]">Total Q received</p>
            <p className="text-xl font-bold text-white mt-0.5">{totalQ.toLocaleString()} <span className="text-sm font-black italic text-[#00d4ff]">Q</span></p>
          </div>
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black italic text-[#00d4ff] opacity-10 select-none">Q</span>
        </div>

        {/* Category breakdown */}
        <div className="mb-3 bg-[#12152a] rounded-xl p-3 border border-white/5">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Content Breakdown</p>
          <div className="space-y-2">
            {CATEGORIES.map((cat) => {
              const pct = Math.round((catCounts[cat] / totalPosts) * 100);
              const badge = CATEGORY_BADGE[cat];
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${badge.className} w-20 text-center flex-shrink-0`}>{badge.label}</span>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${profile.authorColor} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-white/30 text-[10px] w-6 text-right">{catCounts[cat]}</span>
                </div>
              );
            })}
          </div>
          <p className="text-white/25 text-[10px] mt-3">Most posts in <span className={`font-semibold ${CATEGORY_BADGE[mostPosted].className.split(" ")[1]}`}>{CATEGORY_BADGE[mostPosted].label}</span></p>
        </div>

        {/* Recent posts */}
        <div className="mb-3">
          <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">Recent Posts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recentPosts.map((rp) => (
              <div key={rp.id} className="bg-[#12152a] rounded-xl overflow-hidden border border-white/5 group cursor-pointer hover:border-white/15 transition-colors">
                <div className="h-16 overflow-hidden relative">
                  <img src={`https://placehold.co/300x160/${rp.imgColor}?text=`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className={`absolute top-1.5 left-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${CATEGORY_BADGE[rp.category].className}`}>{CATEGORY_BADGE[rp.category].label}</span>
                </div>
                <div className="px-2.5 py-2">
                  <p className="text-white/80 text-xs font-medium truncate">{rp.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 text-white/30 text-[10px]">
                      <MessageCircle size={9} />
                      {rp.comments}
                    </div>
                    <div className="flex items-center gap-0.5 text-white/30 text-[10px]">
                      {rp.q} <span className="font-black italic text-[#00d4ff] text-[10px]">Q</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => toast.success(`Message sent to ${profile.author}!`)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#00d4ff]/20 to-[#00d4ff]/5 border border-[#00d4ff]/30 text-[#00d4ff] text-sm font-medium hover:border-[#00d4ff]/60 transition-colors"
          >
            <MessageCircle size={15} />
            Message
          </button>
          <button
            onClick={() => {
              setIsFollowing(!isFollowing);
              toast.success(isFollowing ? `Unfollowed ${profile.author}` : `Following ${profile.author}!`);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              isFollowing
                ? "bg-white/5 border-white/20 text-white/70 hover:bg-white/10"
                : `bg-gradient-to-r ${profile.authorColor} text-white hover:opacity-90`
            }`}
          >
            {isFollowing ? "✓ Following" : "+ Follow"}
          </button>
          <button
            onClick={() => setShowReportModal(true)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/30 transition-colors"
            title="Report"
          >
            <Flag size={15} />
          </button>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowFollowersModal(false)}>
          <div className="bg-[#0a0e1f] rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Followers</h3>
            <div className="space-y-3">
              {Array.from({ length: Math.min(followers, 15) }, (_, i) => {
                const mockNames = ["Player" + (i + 1), "Gamer" + (i + 1), "Pro" + (i + 1), "User" + (i + 1)];
                const name = mockNames[seededRand(s + "fol" + i, mockNames.length)];
                const color = ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-yellow-500 to-orange-500", "from-green-500 to-emerald-500"][seededRand(s + "folc" + i, 4)];
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm`}>
                        {name[0]}
                      </div>
                      <span className={`text-sm font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{name}</span>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#c89b3c] to-yellow-500 text-black text-xs font-semibold hover:opacity-90">
                      Follow
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowFollowersModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowFollowingModal(false)}>
          <div className="bg-[#0a0e1f] rounded-2xl border border-white/10 p-6 max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Following</h3>
            <div className="space-y-3">
              {Array.from({ length: Math.min(following, 15) }, (_, i) => {
                const mockNames = ["Player" + (i + 1), "Gamer" + (i + 1), "Pro" + (i + 1), "User" + (i + 1)];
                const name = mockNames[seededRand(s + "fing" + i, mockNames.length)];
                const color = ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-yellow-500 to-orange-500", "from-green-500 to-emerald-500"][seededRand(s + "fingc" + i, 4)];
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold text-sm`}>
                        {name[0]}
                      </div>
                      <span className={`text-sm font-semibold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{name}</span>
                    </div>
                    <button className="px-3 py-1 rounded-lg bg-white/5 border border-white/20 text-white/70 text-xs font-semibold hover:bg-white/10">
                      Following
                    </button>
                  </div>
                );
              })}
            </div>
            <button
              onClick={() => setShowFollowingModal(false)}
              className="w-full mt-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-[#0a0e1f] rounded-2xl border border-red-500/20 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-1">Raportează profil</h3>
            <p className="text-white/50 text-sm mb-4">Profil: <span className="text-[#00d4ff]">{profile.author}</span></p>

            {/* Reason */}
            <p className="text-white/70 text-sm font-medium mb-2">Motiv <span className="text-red-400">*</span></p>
            <div className="space-y-2 mb-4">
              {[
                { label: "Spam", icon: "📢" },
                { label: "Hărțuire / Bullying", icon: "⚠️" },
                { label: "Discurs de ură", icon: "🚫" },
                { label: "Conținut nuditate / inadecvat", icon: "🔞" },
                { label: "Informații false", icon: "❌" },
                { label: "Escrocherie / Fraudă", icon: "💰" },
                { label: "Altul", icon: "📝" },
              ].map((reason) => (
                <button
                  key={reason.label}
                  onClick={() => { setReportReason(reason.label); setReportError(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                    reportReason === reason.label
                      ? 'bg-red-500/10 border-red-500/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-red-400/30 hover:text-red-400'
                  }`}
                >
                  <span className="text-lg">{reason.icon}</span>
                  <span className="text-sm font-medium">{reason.label}</span>
                  {reportReason === reason.label && <span className="ml-auto text-red-400">✓</span>}
                </button>
              ))}
            </div>

            {/* Details */}
            <p className="text-white/70 text-sm font-medium mb-2">Detalii <span className="text-red-400">*</span> <span className="text-white/40 font-normal text-xs">(obligatoriu)</span></p>
            <textarea
              value={reportDetails}
              onChange={(e) => { setReportDetails(e.target.value); setReportError(false); }}
              placeholder="Descrie problema în detaliu..."
              className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder:text-white/30 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-red-500/40 mb-1 ${
                reportError && !reportDetails.trim() ? 'border-red-500/60' : 'border-white/10'
              }`}
            />
            {reportError && (!reportReason || !reportDetails.trim()) && (
              <p className="text-red-400 text-xs mb-3">Te rugăm să selectezi un motiv și să adaugi detalii.</p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setShowReportModal(false); setReportReason(''); setReportDetails(''); setReportError(false); }}
                className="flex-1 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors text-sm"
              >
                Anulează
              </button>
              <button
                onClick={() => {
                  if (!reportReason || !reportDetails.trim()) { setReportError(true); return; }
                  if (onReportProfile) {
                    onReportProfile((profile as any).author, (profile as any).avatar, undefined, reportReason, reportDetails);
                  }
                  toast.success(`Profil raportat! Echipa de moderare va verifica în curând.`);
                  setShowReportModal(false);
                  setReportReason('');
                  setReportDetails('');
                  setReportError(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium text-sm transition-all"
              >
                Trimite raport
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MediaPageProps{
  isLoggedIn: boolean;
  userName: string;
  userNameColor: string;
  hasPremium: boolean;
  userAvatar?: string;
  userBanner?: string;
  userProfileBackground?: string;
  riotVerified?: boolean;
  playerProfiles?: Record<string, PlayerProfileData>;
  getUserStatus?: (u: string) => UserStatusType;
  onReportPost?: (postId: number, author: string, content: string) => void;
  onReportProfile?: (username: string, avatarUrl?: string, bannerUrl?: string, reason?: string, details?: string) => void;
  selectedLanguage?: string;
  userAccountLanguage?: string;
}

type Category = "screenshot" | "clip" | "meme" | "highlight";

interface Reply {
  id: number;
  author: string;
  authorColor: string;
  text: string;
  timeAgo: string;
}

type ReactionKey = "Q" | "😂" | "😮" | "😢" | "😡" | "🔥";

interface Comment {
  id: number;
  author: string;
  authorColor: string;
  text: string;
  timeAgo: string;
  replies: Reply[];
  reactions?: Partial<Record<ReactionKey, number>>;
}

interface Post {
  id: number;
  author: string;
  authorColor: string;
  timeAgo: string;
  category: Category;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  comments: Comment[];
  views: number;
  isPremium?: boolean;
  userLanguages?: string[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    author: "VoidWalker99",
    authorColor: "from-purple-500 to-pink-500",
    timeAgo: "2h ago",
    category: "screenshot",
    title: "Pentakill with Katarina",
    description: "Pulled off the cleanest Katarina pentakill in Platinum ranked. Everything just lined up perfectly.",
    imageUrl: "https://placehold.co/600x400/1a1d29/00d4ff?text=Katarina+Pentakill",
    likes: 142,
    comments: [
      { id: 1, author: "GoldShield", authorColor: "from-yellow-500 to-orange-500", text: "Insane play bro!", timeAgo: "1h ago", replies: [
        { id: 11, author: "VoidWalker99", authorColor: "from-purple-500 to-pink-500", text: "ty man was clean 😤", timeAgo: "55m ago" },
      ]},
      { id: 2, author: "MidOrFeed", authorColor: "from-cyan-500 to-blue-500", text: "How did you not die lol", timeAgo: "45m ago", replies: [] },
    ],
    views: 1840,
    userLanguages: ["en"],
    isPremium: true,
  },
  {
    id: 2,
    author: "GoldShield",
    authorColor: "from-yellow-500 to-orange-500",
    timeAgo: "4h ago",
    category: "highlight",
    title: "Baron Steal at 40 Minutes",
    description: "We were completely behind and managed to steal baron with Lee Sin's Q. Game-winning play.",
    imageUrl: "https://placehold.co/600x400/242836/c89b3c?text=Baron+Steal",
    likes: 389,
    comments: [
      { id: 1, author: "TopDiff", authorColor: "from-orange-400 to-amber-400", text: "GOAT move", timeAgo: "3h ago", replies: [
        { id: 11, author: "GoldShield", authorColor: "from-yellow-500 to-orange-500", text: "couldn't have done it without the team ngl", timeAgo: "2h ago" },
      ]},
    ],
    views: 5210,
    userLanguages: ["en"],
    isPremium: true,
  },
  {
    id: 3,
    author: "MidOrFeed",
    authorColor: "from-cyan-500 to-blue-500",
    timeAgo: "6h ago",
    category: "meme",
    title: "When your support roams",
    description: "Every ADC main knows this feeling all too well. You blink and your support is gone.",
    imageUrl: "https://placehold.co/600x500/1a1d29/c89b3c?text=Support+Roam+Meme",
    likes: 521,
    comments: [
      { id: 1, author: "RuneForge", authorColor: "from-emerald-500 to-teal-500", text: "TOO REAL 😭", timeAgo: "5h ago", replies: [
        { id: 11, author: "MidOrFeed", authorColor: "from-cyan-500 to-blue-500", text: "literally every single game bro", timeAgo: "4h ago" },
        { id: 12, author: "RuneForge", authorColor: "from-emerald-500 to-teal-500", text: "and they come back when you die 😭", timeAgo: "4h ago" },
      ]},
      { id: 2, author: "DuskbladeDuo", authorColor: "from-indigo-500 to-violet-500", text: "This is me every game", timeAgo: "4h ago", replies: [] },
    ],
    views: 8900,
    userLanguages: ["ro"],
  },
  {
    id: 4,
    author: "IronToChallenger",
    authorColor: "from-red-500 to-rose-500",
    timeAgo: "8h ago",
    category: "clip",
    title: "Insane Zed Outplay",
    description: "1v3 outplay with Zed under tower. Shadow mechanics at their finest.",
    imageUrl: "https://placehold.co/600x400/0a0e27/ff4444?text=Zed+Outplay+Clip",
    likes: 278,
    comments: [] as Comment[],
    views: 3760,
    userLanguages: ["ro"],
  },
  {
    id: 5,
    author: "RuneForge",
    authorColor: "from-emerald-500 to-teal-500",
    timeAgo: "10h ago",
    category: "screenshot",
    title: "Perfect CS Score at 10 Min",
    description: "Finally hit 100 CS at 10 minutes on Kassadin. Long road but we got there.",
    imageUrl: "https://placehold.co/600x400/1a1d29/00ff88?text=Perfect+CS+Score",
    likes: 95,
    comments: [
      { id: 1, author: "FlashThunder", authorColor: "from-sky-400 to-blue-500", text: "Respect the grind", timeAgo: "9h ago", replies: [] },
    ],
    views: 1240,
    userLanguages: ["en"],
    isPremium: true,
  },
  {
    id: 6,
    author: "DuskbladeDuo",
    authorColor: "from-indigo-500 to-violet-500",
    timeAgo: "12h ago",
    category: "meme",
    title: "Ranked Anxiety at Promos",
    description: "Me at placement games every single season without fail. Why do I keep doing this to myself.",
    imageUrl: "https://placehold.co/600x500/242836/9945ff?text=Promo+Anxiety+Meme",
    likes: 743,
    comments: [
      { id: 1, author: "JungleTimer", authorColor: "from-lime-500 to-green-500", text: "Every. Single. Time.", timeAgo: "11h ago", replies: [] },
    ],
    views: 12400,
    userLanguages: ["en"],
  },
];

const CATEGORY_BADGE: Record<Category, { label: string; className: string }> = {
  screenshot: { label: "Screenshot", className: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" },
  clip: { label: "Clip", className: "bg-purple-500/20 text-purple-400 border border-purple-500/30" },
  meme: { label: "Meme", className: "bg-yellow-500/20 text-[#c89b3c] border border-yellow-500/30" },
  highlight: { label: "Highlight", className: "bg-red-500/20 text-red-400 border border-red-500/30" },
};

const CATEGORY_ICON: Record<Category, React.ReactNode> = {
  screenshot: <Image size={10} />,
  clip: <Play size={10} />,
  meme: <Smile size={10} />,
  highlight: <Zap size={10} />,
};

function formatCount(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function Avatar({ name, colorClass, size = "md", avatarUrl }: { name: string; colorClass: string; size?: "sm" | "md"; avatarUrl?: string }) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  if (avatarUrl) {
    return (
      <img src={avatarUrl} alt={name} className={`${sz} rounded-full object-cover flex-shrink-0`} />
    );
  }
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center font-bold text-white flex-shrink-0 shadow-md`}>
      {name[0].toUpperCase()}
    </div>
  );
}

interface FeedCardProps {
  post: Post;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  isLoggedIn: boolean;
  userName: string;
  userNameColor: string;
  playerProfiles?: Record<string, PlayerProfileData>;
  getUserStatus?: (u: string) => UserStatusType;
  onProfileClick?: (profile: PublicProfile) => void;
  onReportPost?: (postId: number, author: string, content: string) => void;
}

function FeedCard({ post, liked, saved, onLike, onSave, isLoggedIn, userName, userNameColor, playerProfiles, getUserStatus, onProfileClick, onReportPost }: FeedCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(post.comments);
  const [replyingTo, setReplyingTo] = useState<{ commentId: number; replyId?: number; targetAuthor: string } | null>(null);
  const [replyText, setReplyText] = useState("");
  const [expandedReplies, setExpandedReplies] = useState<Set<number>>(new Set());
  const [commentReactions, setCommentReactions] = useState<Record<number, Partial<Record<ReactionKey, number>>>>(() =>
    Object.fromEntries(post.comments.map((c) => [c.id, c.reactions ?? {}]))
  );
  const [myReactions, setMyReactions] = useState<Record<number, ReactionKey | null>>({});
  const [pickerOpen, setPickerOpen] = useState<number | null>(null);
  // reply reactions — key is `${commentId}_${replyId}`
  const [replyReactions, setReplyReactions] = useState<Record<string, Partial<Record<ReactionKey, number>>>>({});
  const [myReplyReactions, setMyReplyReactions] = useState<Record<string, ReactionKey | null>>({});
  const [replyPickerOpen, setReplyPickerOpen] = useState<string | null>(null);
  const [showPostMenu, setShowPostMenu] = useState(false);
  const badge = CATEGORY_BADGE[post.category];

  const REACTIONS: { key: ReactionKey; label: string }[] = [
    { key: "Q", label: "Q" },
    { key: "😂", label: "Haha" },
    { key: "😮", label: "Wow" },
    { key: "😢", label: "Sad" },
    { key: "😡", label: "Angry" },
    { key: "🔥", label: "Fire" },
  ];

  function toggleReaction(commentId: number, reaction: ReactionKey) {
    setCommentReactions((prev) => {
      const current = { ...(prev[commentId] ?? {}) };
      const myPrev = myReactions[commentId];
      if (myPrev) current[myPrev] = Math.max(0, (current[myPrev] ?? 1) - 1);
      if (myPrev !== reaction) current[reaction] = (current[reaction] ?? 0) + 1;
      return { ...prev, [commentId]: current };
    });
    setMyReactions((prev) => ({ ...prev, [commentId]: prev[commentId] === reaction ? null : reaction }));
    setPickerOpen(null);
  }

  function toggleReplyReaction(commentId: number, replyId: number, reaction: ReactionKey) {
    const key = `${commentId}_${replyId}`;
    setReplyReactions((prev) => {
      const current = { ...(prev[key] ?? {}) };
      const myPrev = myReplyReactions[key];
      if (myPrev) current[myPrev] = Math.max(0, (current[myPrev] ?? 1) - 1);
      if (myPrev !== reaction) current[reaction] = (current[reaction] ?? 0) + 1;
      return { ...prev, [key]: current };
    });
    setMyReplyReactions((prev) => ({ ...prev, [key]: prev[key] === reaction ? null : reaction }));
    setReplyPickerOpen(null);
  }

  function submitComment() {
    if (!commentText.trim()) return;
    const c: Comment = {
      id: Date.now(),
      author: userName || "You",
      authorColor: userNameColor || "from-blue-500 to-indigo-500",
      text: commentText.trim(),
      timeAgo: "Just now",
      replies: [],
    };
    setLocalComments((prev) => [...prev, c]);
    setCommentText("");
  }

  function submitReply(commentId: number, targetAuthor: string) {
    if (!replyText.trim()) return;
    const r: Reply = {
      id: Date.now(),
      author: userName || "You",
      authorColor: userNameColor || "from-blue-500 to-indigo-500",
      text: `@${targetAuthor} ${replyText.trim()}`,
      timeAgo: "Just now",
    };
    setLocalComments((prev) =>
      prev.map((c) =>
        c.id === commentId ? { ...c, replies: [...(c.replies ?? []), r] } : c
      )
    );
    setExpandedReplies((prev) => new Set(prev).add(commentId));
    setReplyingTo(null);
    setReplyText("");
  }

  function toggleReplies(commentId: number) {
    setExpandedReplies((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) next.delete(commentId); else next.add(commentId);
      return next;
    });
  }

  return (
    <div className="bg-[#12152a]/70 backdrop-blur-md border border-white/8 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => onProfileClick?.({ author: post.author, authorColor: post.authorColor })} className="hover:opacity-80 transition-opacity">
            <Avatar name={post.author} colorClass={post.authorColor} avatarUrl={playerProfiles?.[post.author]?.avatar} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onProfileClick?.({ author: post.author, authorColor: post.authorColor })}
                className={`text-sm font-semibold bg-gradient-to-r ${post.authorColor} bg-clip-text text-transparent hover:opacity-80 transition-opacity`}
              >
                {post.author}
              </button>
              {(post.isPremium || playerProfiles?.[post.author]?.isPremium) && (
                <div className="flex items-center gap-1">
                  <img src={mediaPremiumLogo} alt="Premium" className="w-10 h-10 object-contain -ml-2 -mr-2" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] font-bold text-[10px]">Premium</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {post.userLanguages && post.userLanguages.length > 0 && (
                <span className="text-base leading-none" title={post.userLanguages[0]}>
                  {getLangFlag(post.userLanguages[0])}
                </span>
              )}
              <span className="text-white/40 text-xs">{post.timeAgo}</span>
              <span className="text-white/20 text-xs">·</span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${badge.className} px-1.5 py-0.5 rounded-full`}>
                {CATEGORY_ICON[post.category]}
                {badge.label}
              </span>
            </div>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowPostMenu(!showPostMenu)}
            className="p-1.5 rounded-full hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-colors"
            title="Report post"
          >
            <Flag size={16} />
          </button>

          {showPostMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowPostMenu(false)} />
              <div className="absolute right-0 top-8 z-20 w-56 bg-[#12152a] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-xs font-semibold text-white/60">Report this post</p>
                </div>
                {['Spam', 'Harassment', 'Hate speech', 'False information', 'Nudity / Inappropriate content'].map(reason => (
                  <button
                    key={reason}
                    onClick={() => {
                      if (onReportPost) {
                        onReportPost(post.id, (post as any).author, (post as any).caption || post.category);
                      }
                      toast.success(`Post raportat pentru: ${reason}`);
                      setShowPostMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 transition-colors"
                  >
                    {reason}
                  </button>
                ))}
                <button
                  onClick={() => {
                    toast.success("Post reported for False information");
                    setShowPostMenu(false);
                  }}
                  className="hidden"
                >
                  False information
                </button>
                <button
                  onClick={() => {
                    toast.success("Post reported for Inappropriate content");
                    setShowPostMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 transition-colors"
                >
                  Inappropriate content
                </button>
                <button
                  onClick={() => {
                    toast.success("Post reported for Scam");
                    setShowPostMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 transition-colors"
                >
                  Scam
                </button>
                <button
                  onClick={() => {
                    toast.success("Post reported");
                    setShowPostMenu(false);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/5 transition-colors"
                >
                  Other
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Caption */}
      {post.title && (
        <div className="px-4 pb-2.5">
          <span className="text-white/80 text-sm">{post.title}</span>
          {post.description && (
            <p className="text-white/50 text-xs mt-0.5 leading-relaxed">{post.description}</p>
          )}
        </div>
      )}

      {/* Image */}
      <div className="relative bg-[#0a0e1f]">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full object-cover max-h-[480px]"
          onDoubleClick={onLike}
        />
        {post.category === "clip" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Play size={22} className="text-white ml-1" fill="white" />
            </div>
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <button
              onClick={onLike}
              className="p-1.5 transition-all hover:scale-125 active:scale-90 select-none"
              title="Q"
            >
              <span
                className={`text-2xl font-bold leading-none tracking-tight transition-all duration-300 ${
                  liked
                    ? "bg-gradient-to-r from-[#00d4ff] via-[#00b8e6] to-[#00d4ff] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,212,255,0.7)]"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                Q
              </span>
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 rounded-full text-white/60 hover:text-white transition-colors"
            >
              <MessageCircle size={22} />
            </button>
            <button
              onClick={() => {
                const text = `${post.author}: "${post.title}" — FinderQ Media`;
                const url = window.location.href;

                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: text,
                    url: url
                  })
                  .then(() => toast.success("Shared successfully!"))
                  .catch((err) => {
                    if (err.name !== 'AbortError') {
                      navigator.clipboard.writeText(`${text}\n${url}`)
                        .then(() => toast.success("Link copied to clipboard!"))
                        .catch(() => toast.error("Failed to share"));
                    }
                  });
                } else {
                  navigator.clipboard.writeText(`${text}\n${url}`)
                    .then(() => toast.success("Link copied to clipboard!"))
                    .catch(() => toast.error("Failed to copy link"));
                }
              }}
              className="p-2 rounded-full text-white/60 hover:text-white transition-colors"
              title="Share"
            >
              <Share2 size={20} />
            </button>
          </div>
          <button
            onClick={onSave}
            className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 ${saved ? "text-[#c89b3c]" : "text-white/60 hover:text-white"}`}
          >
            <Bookmark size={22} fill={saved ? "currentColor" : "none"} strokeWidth={saved ? 0 : 2} />
          </button>
        </div>

        {/* Q count */}
        <p className="text-sm font-semibold text-white mb-1">
          {formatCount(post.likes + (liked ? 1 : 0))} <span className="font-black italic text-[#00d4ff]">Q</span>
        </p>

        {/* Comments toggle */}
        {localComments.length > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-white/40 text-xs hover:text-white/60 transition-colors mb-2"
          >
            View all {localComments.length} comment{localComments.length !== 1 ? "s" : ""}
          </button>
        )}

        {/* Comments */}
        {showComments && (
          <div className="mt-1 mb-2 space-y-3 border-t border-white/5 pt-2">
            {localComments.map((c) => (
              <div key={c.id}>
                {/* Comment row */}
                <div className="flex items-start gap-2">
                  <Avatar name={c.author} colorClass={c.authorColor} size="sm" avatarUrl={playerProfiles?.[c.author]?.avatar} />
                  <div className="flex-1 min-w-0">
                    <div className="bg-[#1a1d29] rounded-xl px-3 py-2">
                      <span className={`text-xs font-semibold bg-gradient-to-r ${c.authorColor} bg-clip-text text-transparent`}>
                        {c.author}
                      </span>
                      <p className="text-white/70 text-xs mt-0.5">{c.text}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 pl-1 flex-wrap">
                      <span className="text-white/25 text-[10px]">{c.timeAgo}</span>

                      {/* Reaction picker trigger */}
                      <div className="relative">
                        <button
                          onClick={() => setPickerOpen(pickerOpen === c.id ? null : c.id)}
                          className="transition-all hover:scale-125 active:scale-90 leading-none"
                        >
                          {myReactions[c.id] && myReactions[c.id] !== "Q" ? (
                            <span className="text-lg leading-none">{myReactions[c.id]}</span>
                          ) : (
                            <span className={`text-base font-black italic leading-none transition-all duration-200 ${myReactions[c.id] === "Q" ? "text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.9)]" : "text-white/35 hover:text-white/60"}`}>Q</span>
                          )}
                        </button>

                        {/* Picker popup */}
                        {pickerOpen === c.id && (
                          <div className="absolute bottom-8 left-0 z-20 flex items-center gap-2 bg-[#0e1122] border border-white/12 rounded-2xl px-3 py-2 shadow-2xl shadow-black/50">
                            {REACTIONS.map((r) => (
                              <button
                                key={r.key}
                                onClick={() => toggleReaction(c.id, r.key)}
                                title={r.label}
                                className={`flex flex-col items-center gap-0.5 transition-all hover:scale-130 active:scale-95 ${myReactions[c.id] === r.key ? "scale-115" : ""}`}
                              >
                                {r.key === "Q" ? (
                                  <span className={`text-xl font-black italic leading-none ${myReactions[c.id] === "Q" ? "text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.9)]" : "text-white/70 hover:text-[#00d4ff]"}`}>Q</span>
                                ) : (
                                  <span className="text-xl leading-none">{r.key}</span>
                                )}
                                <span className="text-[9px] text-white/30">{r.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reaction counts */}
                      {Object.entries(commentReactions[c.id] ?? {}).filter(([, v]) => (v ?? 0) > 0).map(([emoji, count]) => (
                        <button
                          key={emoji}
                          onClick={() => toggleReaction(c.id, emoji as ReactionKey)}
                          className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 transition-all border ${myReactions[c.id] === emoji ? "border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}
                        >
                          {emoji === "Q" ? <span className="font-black italic text-xs">Q</span> : <span className="text-sm">{emoji}</span>}
                          <span>{count}</span>
                        </button>
                      ))}

                      {isLoggedIn && (
                        <button
                          onClick={() => { setReplyingTo(replyingTo?.commentId === c.id && !replyingTo.replyId ? null : { commentId: c.id, targetAuthor: c.author }); setReplyText(""); }}
                          className="text-[10px] text-white/40 hover:text-[#00d4ff] transition-colors font-medium"
                        >
                          Reply
                        </button>
                      )}
                      {(c.replies?.length ?? 0) > 0 && (
                        <button
                          onClick={() => toggleReplies(c.id)}
                          className="text-[10px] text-white/40 hover:text-white/70 transition-colors"
                        >
                          {expandedReplies.has(c.id) ? "Hide" : `View`} {(c.replies?.length ?? 0)} {(c.replies?.length ?? 0) === 1 ? "reply" : "replies"}
                        </button>
                      )}
                    </div>

                    {/* Reply input on comment */}
                    {replyingTo?.commentId === c.id && !replyingTo.replyId && (
                      <div className="flex items-center gap-2 mt-2 pl-1">
                        <Avatar name={userName || "Y"} colorClass={userNameColor || "from-blue-500 to-indigo-500"} size="sm" avatarUrl={playerProfiles?.[userName]?.avatar} />
                        <div className="flex-1 flex items-center gap-1 bg-[#1a1d29] border border-[#00d4ff]/20 rounded-xl px-3 py-1.5">
                          <span className={`text-[10px] font-semibold bg-gradient-to-r ${c.authorColor} bg-clip-text text-transparent mr-1 flex-shrink-0`}>
                            @{c.author}
                          </span>
                          <input
                            autoFocus
                            type="text"
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && submitReply(c.id, c.author)}
                            className="flex-1 bg-transparent text-xs text-white/70 placeholder-white/25 focus:outline-none"
                          />
                          {replyText.trim() && (
                            <button onClick={() => submitReply(c.id, c.author)} className="text-[#00d4ff] hover:text-white transition-colors ml-1">
                              <Send size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Replies list */}
                    {expandedReplies.has(c.id) && (c.replies?.length ?? 0) > 0 && (
                      <div className="mt-2 pl-4 space-y-2 border-l-2 border-white/5 ml-1">
                        {(c.replies ?? []).map((r) => (
                          <div key={r.id}>
                            <div className="flex items-start gap-2">
                              <Avatar name={r.author} colorClass={r.authorColor} size="sm" avatarUrl={playerProfiles?.[r.author]?.avatar} />
                              <div className="flex-1 min-w-0">
                                <div className="bg-[#1a1d29] rounded-xl px-3 py-2">
                                  <span className={`text-xs font-semibold bg-gradient-to-r ${r.authorColor} bg-clip-text text-transparent`}>
                                    {r.author}
                                  </span>
                                  <p className="text-white/70 text-xs mt-0.5">{r.text}</p>
                                </div>
                                <div className="flex items-center gap-3 mt-1 pl-1 flex-wrap">
                                  <span className="text-white/25 text-[10px]">{r.timeAgo}</span>

                                  {/* Reply reaction picker */}
                                  <div className="relative">
                                    <button
                                      onClick={() => setReplyPickerOpen(replyPickerOpen === `${c.id}_${r.id}` ? null : `${c.id}_${r.id}`)}
                                      className="transition-all hover:scale-125 active:scale-90 leading-none"
                                    >
                                      {myReplyReactions[`${c.id}_${r.id}`] && myReplyReactions[`${c.id}_${r.id}`] !== "Q" ? (
                                        <span className="text-lg leading-none">{myReplyReactions[`${c.id}_${r.id}`]}</span>
                                      ) : (
                                        <span className={`text-base font-black italic leading-none transition-all duration-200 ${myReplyReactions[`${c.id}_${r.id}`] === "Q" ? "text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.9)]" : "text-white/35 hover:text-white/60"}`}>Q</span>
                                      )}
                                    </button>
                                    {replyPickerOpen === `${c.id}_${r.id}` && (
                                      <div className="absolute bottom-8 left-0 z-30 flex items-center gap-2 bg-[#0e1122] border border-white/12 rounded-2xl px-3 py-2 shadow-2xl shadow-black/50">
                                        {REACTIONS.map((rx) => (
                                          <button
                                            key={rx.key}
                                            onClick={() => toggleReplyReaction(c.id, r.id, rx.key)}
                                            title={rx.label}
                                            className={`flex flex-col items-center gap-0.5 transition-all hover:scale-125 active:scale-95 ${myReplyReactions[`${c.id}_${r.id}`] === rx.key ? "scale-110" : ""}`}
                                          >
                                            {rx.key === "Q" ? (
                                              <span className={`text-xl font-black italic leading-none ${myReplyReactions[`${c.id}_${r.id}`] === "Q" ? "text-[#00d4ff] drop-shadow-[0_0_8px_rgba(0,212,255,0.9)]" : "text-white/70"}`}>Q</span>
                                            ) : (
                                              <span className="text-xl leading-none">{rx.key}</span>
                                            )}
                                            <span className="text-[9px] text-white/30">{rx.label}</span>
                                          </button>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Reply reaction counts */}
                                  {Object.entries(replyReactions[`${c.id}_${r.id}`] ?? {}).filter(([, v]) => (v ?? 0) > 0).map(([emoji, count]) => (
                                    <button
                                      key={emoji}
                                      onClick={() => toggleReplyReaction(c.id, r.id, emoji as ReactionKey)}
                                      className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 transition-all border ${myReplyReactions[`${c.id}_${r.id}`] === emoji ? "border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]" : "border-white/10 bg-white/5 text-white/50 hover:border-white/20"}`}
                                    >
                                      {emoji === "Q" ? <span className="font-black italic text-xs">Q</span> : <span className="text-sm">{emoji}</span>}
                                      <span>{count}</span>
                                    </button>
                                  ))}

                                  {isLoggedIn && (
                                    <button
                                      onClick={() => { setReplyingTo(replyingTo?.replyId === r.id ? null : { commentId: c.id, replyId: r.id, targetAuthor: r.author }); setReplyText(""); }}
                                      className="text-[10px] text-white/40 hover:text-[#00d4ff] transition-colors font-medium"
                                    >
                                      Reply
                                    </button>
                                  )}
                                </div>
                                {/* Reply input on reply */}
                                {replyingTo?.replyId === r.id && (
                                  <div className="flex items-center gap-2 mt-2">
                                    <Avatar name={userName || "Y"} colorClass={userNameColor || "from-blue-500 to-indigo-500"} size="sm" avatarUrl={playerProfiles?.[userName]?.avatar} />
                                    <div className="flex-1 flex items-center gap-1 bg-[#1a1d29] border border-[#00d4ff]/20 rounded-xl px-3 py-1.5">
                                      <span className={`text-[10px] font-semibold bg-gradient-to-r ${r.authorColor} bg-clip-text text-transparent mr-1 flex-shrink-0`}>
                                        @{r.author}
                                      </span>
                                      <input
                                        autoFocus
                                        type="text"
                                        placeholder="Write a reply..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && submitReply(c.id, r.author)}
                                        className="flex-1 bg-transparent text-xs text-white/70 placeholder-white/25 focus:outline-none"
                                      />
                                      {replyText.trim() && (
                                        <button onClick={() => submitReply(c.id, r.author)} className="text-[#00d4ff] hover:text-white transition-colors ml-1">
                                          <Send size={12} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add comment */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2 border-t border-white/5 pt-2 pb-1">
            <Avatar name={userName || "Y"} colorClass={userNameColor || "from-blue-500 to-indigo-500"} size="sm" avatarUrl={playerProfiles?.[userName]?.avatar} />
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              className="flex-1 bg-transparent text-xs text-white/70 placeholder-white/25 focus:outline-none"
            />
            {commentText.trim() && (
              <button
                onClick={submitComment}
                className="text-[#c89b3c] hover:text-yellow-400 transition-colors"
              >
                <Send size={14} />
              </button>
            )}
          </div>
        ) : (
          <p className="text-white/25 text-xs border-t border-white/5 pt-2 pb-1">Log in to comment</p>
        )}
      </div>
    </div>
  );
}

const CATEGORY_TABS: { label: string; value: "all" | Category | "saved" }[] = [
  { label: "All", value: "all" },
  { label: "Screenshots", value: "screenshot" },
  { label: "Clips", value: "clip" },
  { label: "Memes", value: "meme" },
  { label: "Highlights", value: "highlight" },
  { label: "Saved", value: "saved" },
];

export function MediaPage({ isLoggedIn, userName, userNameColor, hasPremium, userAvatar, userBanner, userProfileBackground, riotVerified, playerProfiles, getUserStatus, onReportPost, onReportProfile, selectedLanguage = 'en', userAccountLanguage = 'en' }: MediaPageProps) {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<"all" | Category | "saved">("all");
  const [likedSet, setLikedSet] = useState<Set<number>>(new Set());
  const [savedSet, setSavedSet] = useState<Set<number>>(() => {
    // Load saved posts from localStorage on mount
    try {
      const saved = localStorage.getItem('finderq_saved_posts');
      if (saved) {
        return new Set(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load saved posts:', e);
    }
    return new Set();
  });
  const [viewingProfile, setViewingProfile] = useState<PublicProfile | null>(null);

  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadCategory, setUploadCategory] = useState<Category>("screenshot");
  const [uploadDescription, setUploadDescription] = useState("");

  const languageFilteredPosts = posts.filter(post => {
    const postLangs = post.userLanguages || ['en'];
    return postLangs.includes(selectedLanguage);
  });

  const filteredPosts = activeTab === "all"
    ? languageFilteredPosts
    : activeTab === "saved"
      ? languageFilteredPosts.filter((p) => savedSet.has(p.id))
      : languageFilteredPosts.filter((p) => p.category === activeTab);

  // Save savedSet to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('finderq_saved_posts', JSON.stringify(Array.from(savedSet)));
    } catch (e) {
      console.error('Failed to save posts:', e);
    }
  }, [savedSet]);

  // Block scroll when profile is open
  useEffect(() => {
    if (viewingProfile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [viewingProfile]);

  // Merge current user's real profile into playerProfiles so their posts show real data
  // Also include isPremium from posts
  const postsWithPremium = INITIAL_POSTS.filter(p => p.isPremium).reduce((acc, p) => {
    acc[p.author] = {
      username: p.author,
      color: p.authorColor,
      isPremium: true,
    };
    return acc;
  }, {} as Record<string, PlayerProfileData>);

  // Merge profiles, keeping isPremium from posts even if playerProfiles has the user
  const allPlayerProfiles: Record<string, PlayerProfileData> = {};

  // Start with playerProfiles
  Object.entries(playerProfiles ?? {}).forEach(([key, value]) => {
    allPlayerProfiles[key] = { ...value };
  });

  // Merge premium status from posts
  Object.entries(postsWithPremium).forEach(([key, value]) => {
    allPlayerProfiles[key] = {
      ...(allPlayerProfiles[key] ?? {}),
      ...value,
      isPremium: true, // Always keep premium from posts
    };
  });

  // Add current user
  if (isLoggedIn && userName) {
    allPlayerProfiles[userName] = {
      ...(allPlayerProfiles[userName] ?? {}),
      username: userName,
      color: userNameColor,
      avatar: userAvatar || undefined,
      banner: userBanner || undefined,
      riotVerified: riotVerified,
      isPremium: hasPremium,
      userNameColor: userNameColor,
      userProfileBackground: userProfileBackground,
    };
  }

  function toggleLike(id: number) {
    setLikedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function toggleSave(id: number) {
    setSavedSet((prev) => {
      const next = new Set(prev);
      const wasSaved = next.has(id);
      if (wasSaved) {
        next.delete(id);
        toast.success("Removed from saved");
      } else {
        next.add(id);
        toast.success("Post saved!");
      }
      return next;
    });
  }

  function handleSubmit() {
    if (!uploadTitle.trim()) {
      toast.error("Please enter a title for your post.");
      return;
    }
    const imageUrl = uploadUrl.trim() || `https://placehold.co/600x400/1a1d29/00d4ff?text=${encodeURIComponent(uploadTitle)}`;
    const newPost: Post = {
      id: Date.now(),
      author: userName || "You",
      authorColor: userNameColor || "from-blue-500 to-indigo-500",
      timeAgo: "Just now",
      category: uploadCategory,
      title: uploadTitle,
      description: uploadDescription,
      imageUrl,
      likes: 0,
      comments: [],
      views: 0,
      userLanguages: [userAccountLanguage],
    };
    setPosts((prev) => [newPost, ...prev]);
    setUploadUrl("");
    setUploadTitle("");
    setUploadDescription("");
    toast.success("Post uploaded!");
  }

  return (
    <div className="min-h-screen text-white relative">
      {/* Background image with overlay */}
      <div
        className="fixed inset-0 bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${mediaBackground})`, backgroundPosition: '70% center' }}
      />
      <div className="fixed inset-0 bg-[#0a0e27]/30" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-40 pb-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src={mediaTabLogo} alt="Media" className="w-20 h-20 object-contain -mt-4" />
          <div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight leading-none">Media</h1>
          </div>
        </div>

        {/* Upload box */}
        {isLoggedIn ? (
          <div className="mb-6 p-4 rounded-2xl bg-[#12152a]/70 backdrop-blur-md border border-white/8 shadow-xl">
            <div className="flex items-center gap-3 mb-3">
              <Avatar name={userName || "Y"} colorClass={userNameColor || "from-blue-500 to-indigo-500"} avatarUrl={playerProfiles?.[userName]?.avatar} />
              <input
                type="text"
                placeholder="Title..."
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                className="flex-1 bg-[#1a1d29] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#c89b3c]/40 transition-colors"
              />
            </div>
            <div className="mb-2">
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value as Category)}
                className="bg-[#1a1d29] border border-white/10 rounded-xl px-3 py-2 text-xs text-white/70 focus:outline-none focus:border-[#c89b3c]/40 transition-colors w-full"
              >
                <option value="screenshot">Screenshot</option>
                <option value="clip">Clip</option>
                <option value="meme">Meme</option>
                <option value="highlight">Highlight</option>
              </select>
            </div>
            <textarea
              placeholder="Description..."
              value={uploadDescription}
              onChange={(e) => setUploadDescription(e.target.value)}
              rows={2}
              className="w-full bg-[#1a1d29] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#00d4ff]/40 transition-colors mb-2 resize-none"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1d29] border border-white/10 text-white/50 text-xs cursor-pointer hover:text-white/70 hover:border-white/20 transition-colors">
                  <Upload size={12} />
                  Upload File
                  <input type="file" accept="image/*,video/*" className="hidden" />
                </label>
              </div>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#c89b3c] to-yellow-500 text-black text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <Plus size={13} />
                Post
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl bg-[#12152a]/70 backdrop-blur-md border border-[#c89b3c]/15 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c89b3c]/10 border border-[#c89b3c]/20">
              <Upload size={16} className="text-[#c89b3c]" />
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium">Log in to post media</p>
              <p className="text-white/35 text-xs">Share screenshots, clips, and highlights.</p>
            </div>
          </div>
        )}

        {/* Feed */}
        <div className="w-full">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    activeTab === tab.value
                      ? "bg-gradient-to-r from-[#c89b3c] to-yellow-500 text-black shadow-lg"
                      : "bg-[#12152a] border border-white/8 text-white/50 hover:text-white/80 hover:border-white/15"
                  }`}
                >
                  {tab.value === "saved" && <Bookmark size={12} fill={activeTab === tab.value ? "currentColor" : "none"} />}
                  {tab.label}
                  {tab.value !== "all" && tab.value !== "saved" && (
                    <span className={`ml-1 ${activeTab === tab.value ? "text-black/50" : "text-white/25"}`}>
                      {posts.filter((p) => p.category === tab.value).length}
                    </span>
                  )}
                  {tab.value === "saved" && savedSet.size > 0 && (
                    <span className={`${activeTab === tab.value ? "text-black/50" : "text-white/25"}`}>
                      {savedSet.size}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="p-5 rounded-2xl bg-[#12152a]/70 backdrop-blur-md border border-white/8 mb-4">
                  {activeTab === "saved" ? (
                    <Bookmark size={32} className="text-white/15" />
                  ) : (
                    <Image size={32} className="text-white/15" />
                  )}
                </div>
                <p className="text-white/35 text-sm">
                  {activeTab === "saved" ? "No saved posts yet." : "No posts in this category yet."}
                </p>
                {activeTab === "saved" && (
                  <p className="text-white/20 text-xs mt-1">Save posts to view them here later.</p>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {filteredPosts.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    liked={likedSet.has(post.id)}
                    saved={savedSet.has(post.id)}
                    onLike={() => toggleLike(post.id)}
                    onSave={() => toggleSave(post.id)}
                    isLoggedIn={isLoggedIn}
                    userName={userName}
                    userNameColor={userNameColor}
                    playerProfiles={allPlayerProfiles}
                    getUserStatus={getUserStatus}
                    onProfileClick={setViewingProfile}
                    onReportPost={onReportPost}
                  />
                ))}
              </div>
            )}
          </div>

        {/* Profile Sidebar - Fixed Overlay */}
        {viewingProfile && (
          <>
            {/* Invisible backdrop for closing */}
            <div
              className="fixed inset-0 z-30"
              onClick={() => setViewingProfile(null)}
            />
            {/* Profile */}
            <div className="fixed top-20 left-12 w-80 max-h-[85vh] z-40" onClick={(e) => e.stopPropagation()}>
              <UserProfileContent
                profile={viewingProfile}
                playerData={allPlayerProfiles?.[viewingProfile.author]}
                getUserStatus={getUserStatus}
                onClose={() => setViewingProfile(null)}
                onReportProfile={onReportProfile}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
