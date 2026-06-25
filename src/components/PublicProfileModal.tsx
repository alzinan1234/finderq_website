// @ts-nocheck
'use client'
import { X, Shield, Flag, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { RankBadge } from "./RankBadge";
import { TrophyBadge } from "./TrophyBadge";
import { ReputationSystem } from "./ReputationSystem";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
const statusOnline = "/assets/89acff5e3f002bca6acbad8bdee1a214d46ccb3f.png";
const statusBusy = "/assets/413093ab215ae8d33c2f5f1e67792773d08b8f4e.png";
const statusOffline = "/assets/a9647b068cbf551f7448b9bb446d6d970434682f.png";
const riotVerifiedLogo = "/assets/33708fce311884f26222c2c97c0f96973f9fc01a.png";
const premiumProfileLogo = '/assets/ChatGPT_Image_Jun_17__2026__11_49_47_PM_1_-removebg-preview-1.png';
const bronzeRankIcon = '/assets/76c991537ef52da8c2515e7316b6070625d76309.png';
const silverRankIcon = '/assets/572ffcd7047b7654d8b08685d6b6b4850a76fa4a.png';
const ironRankIcon = '/assets/56c86ec8d49dc5439b990f985a6f4be72f5bde60.png';
const goldRankIcon = '/assets/447bec941d7526f11817bb66461d064ce59f5f48.png';
const platinumRankIcon = '/assets/951dc9449bd0843f7caa55a73bcfea5b40620965.png';
const emeraldRankIcon = '/assets/2ad3dca7cb7c74805ef5824f8dea9db9b9cce06c.png';
const diamondRankIcon = '/assets/848422b6f23bf3791285194b26d780ee89cec35d.png';
const masterRankIcon = '/assets/8ffdaf21013b18ddacb683f57d89491499994956.png';
const grandmasterRankIcon = '/assets/25ac6ba24944dfdc7a6273015725d30e86cc831c.png';
const challengerRankIcon = '/assets/3b18a1b73fd7fb4417ab4dba05421862984edbbe.png';

interface PublicProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  publicProfileSeasonRanks: any[];
  activePublicProfileTab: string;
  setActivePublicProfileTab: (tab: string) => void;
  getUserStatus: (username: string) => string | null;
  setIsReportProfileModalOpen: (v: boolean) => void;
  isLoggedIn: boolean;
  userName: string;
  userStatus: string;
  userJoinDate: string | null;
}

export function PublicProfileModal({
  isOpen,
  onClose,
  profile,
  publicProfileSeasonRanks,
  activePublicProfileTab,
  setActivePublicProfileTab,
  getUserStatus,
  setIsReportProfileModalOpen,
  isLoggedIn,
  userName,
  userStatus,
  userJoinDate,
}: PublicProfileModalProps) {
  if (!isOpen || !profile) return null;

  return (
<div
  className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
  onClick={() => onClose()}
>
  <div
    className={`rounded-2xl max-w-7xl w-full h-[95vh] relative border border-white/10 shadow-2xl overflow-hidden flex flex-col ${
      !profile.userProfileBackground?.startsWith('CUSTOM:')
        ? `bg-gradient-to-br ${profile.userProfileBackground || 'from-[#0a0e27] via-[#1a1d29] to-[#0a0e27]'}`
        : ''
    }`}
    style={profile.userProfileBackground?.startsWith('CUSTOM:') ? {
      background: profile.userProfileBackground.replace('CUSTOM:', '')
    } : undefined}
    onClick={(e) => e.stopPropagation()}
  >
    
    {/* Content wrapper with relative positioning */}
    <div className="relative z-10 flex flex-col h-full">
    
    {/* Close Button */}
    <button
      onClick={() => onClose()}
      className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10 bg-black/30 hover:bg-black/50 rounded-full p-2 backdrop-blur-sm"
    >
      <X className="w-6 h-6" />
    </button>


    {/* Header Banner - Full Height */}
    <div className="relative">
      {/* Banner */}
      {profile.banner ? (
        <div className="h-36 relative overflow-hidden">
          <img src={profile.banner} alt="Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#242836]/80"></div>
        </div>
      ) : (
        <div className="h-36 bg-gradient-to-r from-[#00d4ff] via-[#00b8e6] to-[#0099cc] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute top-10 right-10 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-20 translate-y-20"></div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#242836]/80"></div>
        </div>
      )}

      {/* Avatar - Positioned over banner */}
      <div className="absolute bottom-0 left-8 translate-y-1/2 z-10">
        <div className="relative">
          
          {profile.riotVerified && profile.rank && profile.rank !== 'Unranked' ? (
            <RankBadge rank={profile.rank} size="large">
              {profile.avatar ? (
                <div className="w-28 h-28 rounded-full border-4 border-[#242836] overflow-hidden shadow-2xl">
                  <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className={`w-28 h-28 bg-gradient-to-br ${profile.color} rounded-full border-4 border-[#242836] flex items-center justify-center shadow-2xl`}>
                  <span className="text-white text-3xl font-bold">{profile.initials}</span>
                </div>
              )}
            </RankBadge>
          ) : (
            profile.avatar ? (
              <div className="w-28 h-28 rounded-full border-4 border-[#242836] overflow-hidden shadow-2xl">
                <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-28 h-28 bg-gradient-to-br ${profile.color} rounded-full border-4 border-[#242836] flex items-center justify-center shadow-2xl`}>
                <span className="text-white text-3xl font-bold">{profile.initials}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>

    {/* Profile Content - Header (Fixed) */}
    <div className="pt-16 px-8 pb-3 flex-shrink-0">
      {/* User Info Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {profile.userNameColor ? (
                <h2 className={`text-3xl font-bold bg-gradient-to-r ${profile.userNameColor} bg-clip-text text-transparent`}>
                  {profile.username}
                </h2>
              ) : (
                <h2 className="text-white text-3xl">{profile.username}</h2>
              )}
              {profile.isPremium && (
                <div className="flex items-center gap-1">
                  <img src={premiumProfileLogo} alt="Premium" className="w-16 h-16 object-contain" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] font-bold text-xs">Premium</span>
                </div>
              )}
              {/* Show online status - yellow for online, red for busy, grey for offline */}
              {/* If viewing own profile, use userStatus; otherwise use getUserStatus */}
              {(() => {
                const displayStatus = isLoggedIn && profile.username === userName 
                  ? userStatus 
                  : getUserStatus(profile.username);
                
                if (displayStatus === 'online') {
                  return <img src={statusOnline} alt="Online" className="w-14 h-14 rounded-full aspect-square object-cover relative top-1.5 -left-4" />;
                } else if (displayStatus === 'busy') {
                  return <img src={statusBusy} alt="Busy" className="w-14 h-14 rounded-full aspect-square object-cover relative top-1.5 -left-4" />;
                } else if (displayStatus === 'offline') {
                  return <img src={statusOffline} alt="Offline" className="w-14 h-14 rounded-full aspect-square object-cover relative top-1.5 -left-4" />;
                }
                return null;
              })()}
            </div>
            {/* Join Date - directly under username */}
            {(() => {
              // Use userJoinDate if viewing own profile, otherwise use profile's joinDate
              const joinDate = isLoggedIn && profile.username === userName
                ? userJoinDate
                : profile.joinDate;
              
              if (joinDate) {
                const date = new Date(joinDate);
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return (
                  <p className="text-white/50 text-sm mb-2">
                    Joined {date.getDate()} {months[date.getMonth()]} {date.getFullYear()}
                  </p>
                );
              }
              return null;
            })()}
            <div className="flex items-center gap-2">
              <p className="text-white/60">League of Legends Player</p>
              {profile.riotVerified && (
                <>
                  <span className="text-white/40">•</span>
                  <div className="flex items-center gap-1.5">
                    <img src={riotVerifiedLogo} alt="Riot Verified" className="w-4 h-4 object-contain" />
                    <span className="text-[#00d4ff] font-semibold text-xs">Riot Verified</span>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <div className="flex gap-2">
              <button className="px-5 py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg hover:from-[#00b8e6] hover:to-[#009ac7] transition-all shadow-lg text-sm">
                Add Friend
              </button>
              <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10 text-sm">
                Message
              </button>
            </div>
            {isLoggedIn && profile.username !== userName && (
              <button
                onClick={() => setIsReportProfileModalOpen(true)}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-500/20 hover:border-red-500/40 text-sm flex items-center gap-1.5"
                title="Raportează profil"
              >
                <Flag className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        {profile.riotVerified && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-lg text-sm border border-[#00d4ff]/20 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {profile.region}
            </span>
          </div>
        )}
        {/* Trophy Badge - below region tag */}
        {profile.tournamentEarnings !== undefined && profile.tournamentEarnings >= 5 && (
          <div className="mt-2">
            <TrophyBadge earnings={profile.tournamentEarnings} size="medium" showAmount={true} tournamentName={profile.tournamentName} offsetX="60px" />
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="mb-0 border-b border-white/10 mt-16">
        <div className="flex gap-1">
          <button
            onClick={() => setActivePublicProfileTab('overview')}
            className={`px-6 py-3 text-sm font-semibold transition-all relative ${
              activePublicProfileTab === 'overview'
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Overview
            {activePublicProfileTab === 'overview' && (
              <motion.div 
                layoutId="activePublicTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]"
                transition={{ duration: 0.3 }}
              ></motion.div>
            )}
          </button>
          <button
            onClick={() => setActivePublicProfileTab('reputation')}
            className={`px-6 py-3 text-sm font-semibold transition-all relative ${
              activePublicProfileTab === 'reputation'
                ? 'text-[#00d4ff]'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            Reputation
            {activePublicProfileTab === 'reputation' && (
              <motion.div 
                layoutId="activePublicTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]"
                transition={{ duration: 0.3 }}
              ></motion.div>
            )}
          </button>
        </div>
      </div>
    </div>

    {/* Tab Content - Scrollable */}
    <div className="flex-1 overflow-y-auto px-8 pb-8 min-h-0">
        {/* Overview Tab */}
        {activePublicProfileTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >

          {/* Season Rank History - Only for Riot Verified */}
          {profile.riotVerified && (
            <div className="bg-black/20 rounded-lg p-2.5 border border-white/5 -mt-3">
              <div className="flex flex-wrap gap-1.5">
                {publicProfileSeasonRanks.filter(rank => rank.tier !== 'UNRANKED').map((rank, index) => {
                  const isCurrentSeason = rank.season === 'S15';
                  
                  const getRankColor = (tier: string) => {
                    const tierUpper = tier.toUpperCase();
                    switch (tierUpper) {
                      case 'IRON': return 'text-gray-400';
                      case 'BRONZE': return 'text-orange-700';
                      case 'SILVER': return 'text-gray-300';
                      case 'GOLD': return 'text-yellow-500';
                      case 'PLATINUM': return 'text-teal-400';
                      case 'EMERALD': return 'text-emerald-400';
                      case 'DIAMOND': return 'text-blue-400';
                      case 'MASTER': return 'text-purple-400';
                      case 'GRANDMASTER': return 'text-red-400';
                      case 'CHALLENGER': return 'text-cyan-400';
                      default: return 'text-white/60';
                    }
                  };
                  
                  return (
                    <div
                      key={`${rank.season}-${index}`}
                      className={`
                        relative px-2 py-1 rounded border bg-black/20 cursor-pointer
                        transition-all duration-200 hover:bg-black/40 group/rank
                        ${isCurrentSeason ? 'border-[#00d4ff]/60 hover:border-[#00d4ff]' : 'border-white/10 hover:border-white/20'}
                      `}
                      title={rank.lp !== undefined ? `${rank.lp} LP` : 'LP info not available'}
                    >
                      {isCurrentSeason && (
                        <div className="absolute -top-0.5 -right-0.5 w-1 h-1 bg-[#00d4ff] rounded-full animate-pulse" />
                      )}
                      <div className={`text-[10px] font-bold ${getRankColor(rank.tier)}`}>
                        {rank.season}: {rank.tier.charAt(0)}{rank.tier.slice(1).toLowerCase()} {rank.division}
                        {isCurrentSeason && rank.lp !== undefined && ` • ${rank.lp}LP`}
                      </div>
                      
                      {/* Hover Tooltip */}
                      {rank.lp !== undefined && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/90 rounded text-[9px] text-white/80 whitespace-nowrap opacity-0 group-hover/rank:opacity-100 pointer-events-none transition-opacity duration-200 border border-white/10">
                          {rank.lp} LP
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Main Stats Grid - Rank & Core Performance */}
          <div className="mb-6">
            {/* Current Rank Card - Ultra Premium */}
            {profile.riotVerified ? (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#cd7f32]/20 via-orange-500/10 to-transparent rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-[#1a1d29]/90 to-[#0f1117]/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/5 group-hover:border-[#cd7f32]/30 transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(205,127,50,0.3)]">
                <div className="relative flex flex-col items-start gap-4">
                  
                  {/* Main Role Badge - Top Right */}
                  <div className="absolute top-0 right-0 flex items-center gap-2 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-cyan-400/30 rounded-2xl px-4 py-2 shadow-lg">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
                      <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-white/50 text-[10px] font-medium uppercase tracking-wider">Main Role</p>
                      <p className="text-cyan-400 text-sm font-bold">Support</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className={`absolute inset-0 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse ${
                      profile.rank?.toLowerCase().includes('challenger')
                        ? 'bg-[#0ea5e9]'
                        : profile.rank?.toLowerCase().includes('grandmaster')
                        ? 'bg-[#dc2626]'
                        : profile.rank?.toLowerCase().includes('master')
                        ? 'bg-[#8b5cf6]'
                        : profile.rank?.toLowerCase().includes('diamond')
                        ? 'bg-[#3b82f6]'
                        : profile.rank?.toLowerCase().includes('emerald')
                        ? 'bg-[#00ff94]'
                        : profile.rank?.toLowerCase().includes('plat')
                        ? 'bg-[#00d4c4]'
                        : profile.rank?.toLowerCase().includes('gold')
                        ? 'bg-[#ffd700]'
                        : profile.rank?.toLowerCase().includes('iron')
                        ? 'bg-[#4a4a4a]'
                        : profile.rank?.toLowerCase().includes('silver') 
                        ? 'bg-[#c0c0c0]' 
                        : 'bg-[#cd7f32]'
                    }`}></div>
                    <img 
                      src={
                        profile.rank?.toLowerCase().includes('challenger')
                          ? challengerRankIcon
                          : profile.rank?.toLowerCase().includes('grandmaster')
                          ? grandmasterRankIcon
                          : profile.rank?.toLowerCase().includes('master')
                          ? masterRankIcon
                          : profile.rank?.toLowerCase().includes('diamond')
                          ? diamondRankIcon
                          : profile.rank?.toLowerCase().includes('emerald')
                          ? emeraldRankIcon
                          : profile.rank?.toLowerCase().includes('plat')
                          ? platinumRankIcon
                          : profile.rank?.toLowerCase().includes('gold')
                          ? goldRankIcon
                          : profile.rank?.toLowerCase().includes('iron') 
                          ? ironRankIcon 
                          : profile.rank?.toLowerCase().includes('silver') 
                          ? silverRankIcon 
                          : bronzeRankIcon
                      } 
                      alt={`${profile.rank || 'Bronze'} Rank`}
                      className={`relative w-36 h-36 object-contain group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${
                        profile.rank?.toLowerCase().includes('challenger')
                          ? 'drop-shadow-[0_0_40px_rgba(14,165,233,0.8)]'
                          : profile.rank?.toLowerCase().includes('grandmaster')
                          ? 'drop-shadow-[0_0_40px_rgba(220,38,38,0.8)]'
                          : profile.rank?.toLowerCase().includes('master')
                          ? 'drop-shadow-[0_0_40px_rgba(139,92,246,0.8)]'
                          : profile.rank?.toLowerCase().includes('diamond')
                          ? 'drop-shadow-[0_0_40px_rgba(59,130,246,0.8)]'
                          : profile.rank?.toLowerCase().includes('emerald')
                          ? 'drop-shadow-[0_0_40px_rgba(0,255,148,0.8)]'
                          : profile.rank?.toLowerCase().includes('plat')
                          ? 'drop-shadow-[0_0_40px_rgba(0,212,196,0.8)]'
                          : profile.rank?.toLowerCase().includes('gold')
                          ? 'drop-shadow-[0_0_40px_rgba(255,215,0,0.8)]'
                          : profile.rank?.toLowerCase().includes('iron')
                          ? 'drop-shadow-[0_0_40px_rgba(74,74,74,0.8)]'
                          : profile.rank?.toLowerCase().includes('silver')
                          ? 'drop-shadow-[0_0_40px_rgba(192,192,192,0.8)]'
                          : 'drop-shadow-[0_0_40px_rgba(205,127,50,0.8)]'
                      }`}
                    />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-3 mb-4">
                      <p className="text-white text-4xl font-black drop-shadow-2xl">{profile.rank || 'Bronze II'}</p>
                      <div className={`px-3 py-1 rounded-full ${
                        profile.rank?.toLowerCase().includes('challenger')
                          ? 'bg-[#0ea5e9]/20 border border-[#0ea5e9]/30'
                          : profile.rank?.toLowerCase().includes('grandmaster')
                          ? 'bg-[#dc2626]/20 border border-[#dc2626]/30'
                          : profile.rank?.toLowerCase().includes('master')
                          ? 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/30'
                          : profile.rank?.toLowerCase().includes('diamond')
                          ? 'bg-[#3b82f6]/20 border border-[#3b82f6]/30'
                          : profile.rank?.toLowerCase().includes('emerald')
                          ? 'bg-[#00ff94]/20 border border-[#00ff94]/30'
                          : profile.rank?.toLowerCase().includes('plat')
                          ? 'bg-[#00d4c4]/20 border border-[#00d4c4]/30'
                          : profile.rank?.toLowerCase().includes('gold')
                          ? 'bg-[#ffd700]/20 border border-[#ffd700]/30'
                          : profile.rank?.toLowerCase().includes('iron')
                          ? 'bg-[#4a4a4a]/20 border border-[#4a4a4a]/30'
                          : profile.rank?.toLowerCase().includes('silver')
                          ? 'bg-[#c0c0c0]/20 border border-[#c0c0c0]/30'
                          : 'bg-[#cd7f32]/20 border border-[#cd7f32]/30'
                      }`}>
                        <span className={`text-xs font-bold tracking-wider ${
                          profile.rank?.toLowerCase().includes('challenger')
                            ? 'text-[#0ea5e9]'
                            : profile.rank?.toLowerCase().includes('grandmaster')
                            ? 'text-[#dc2626]'
                            : profile.rank?.toLowerCase().includes('master')
                            ? 'text-[#8b5cf6]'
                            : profile.rank?.toLowerCase().includes('diamond')
                            ? 'text-[#3b82f6]'
                            : profile.rank?.toLowerCase().includes('emerald')
                            ? 'text-[#00ff94]'
                            : profile.rank?.toLowerCase().includes('plat')
                            ? 'text-[#00d4c4]'
                            : profile.rank?.toLowerCase().includes('gold')
                            ? 'text-[#ffd700]'
                            : profile.rank?.toLowerCase().includes('iron')
                            ? 'text-[#4a4a4a]'
                            : profile.rank?.toLowerCase().includes('silver')
                            ? 'text-[#c0c0c0]'
                            : 'text-[#cd7f32]'
                        }`}>RANKED</span>
                      </div>
                    </div>
                    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-3 border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-green-400 text-base font-bold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></span>
                          Win Rate: 53%
                        </p>
                        <p className="text-white/60 text-xs font-medium">284 Games</p>
                      </div>
                      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5 mb-2">
                        <div className="h-full w-[53%] bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-400/50 transition-all duration-1000"></div>
                      </div>
                      <p className="text-white/90 text-xs font-semibold text-center">151W / 133L</p>
                    </div>
                    
                    {/* LP Progress Chart */}
                    <div className="mt-6 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-cyan-400" />
                          Season LP Progress
                        </h3>
                        <div className="text-right">
                          <p className="text-white/50 text-xs">Current LP</p>
                          <p className="text-cyan-400 font-bold text-lg">47 LP</p>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart 
                          key="lp-progress-chart"
                          data={[
                            { game: 1, lp: 0 },
                            { game: 20, lp: 15 },
                            { game: 40, lp: 32 },
                            { game: 60, lp: 48 },
                            { game: 80, lp: 35 },
                            { game: 100, lp: 52 },
                            { game: 120, lp: 41 },
                            { game: 140, lp: 58 },
                            { game: 160, lp: 45 },
                            { game: 180, lp: 62 },
                            { game: 200, lp: 51 },
                            { game: 220, lp: 38 },
                            { game: 240, lp: 55 },
                            { game: 260, lp: 43 },
                            { game: 284, lp: 47 },
                          ]} 
                          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                        >
                          <XAxis 
                            key="xaxis-lp"
                            dataKey="game" 
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
                          />
                          <YAxis 
                            key="yaxis-lp"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }}
                          />
                          <Tooltip 
                            key="tooltip-lp"
                            contentStyle={{ 
                              backgroundColor: 'rgba(0,0,0,0.9)', 
                              border: '1px solid rgba(6,182,212,0.3)',
                              borderRadius: '8px'
                            }}
                            labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                          />
                          <Line 
                            key="line-lp"
                            type="monotone" 
                            dataKey="lp" 
                            stroke="#06b6d4" 
                            strokeWidth={3}
                            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: '#06b6d4', strokeWidth: 2, stroke: '#fff' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <div className="text-center flex-1">
                          <p className="text-white/50 text-xs mb-1">Peak LP</p>
                          <p className="text-green-400 font-bold">62 LP</p>
                        </div>
                        <div className="text-center flex-1 border-x border-white/5">
                          <p className="text-white/50 text-xs mb-1">Lowest LP</p>
                          <p className="text-red-400 font-bold">0 LP</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-white/50 text-xs mb-1">Avg LP Gain</p>
                          <p className="text-cyan-400 font-bold">+18 LP</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            ) : (
              <div className="relative bg-gradient-to-br from-[#1a1d29]/90 to-[#0f1117]/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/5 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-[#00d4ff]/10 flex items-center justify-center border border-[#00d4ff]/30">
                    <Shield className="w-10 h-10 text-[#00d4ff]" />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold mb-2">Riot Account Not Connected</h3>
                    <p className="text-white/60 text-sm">This user hasn't connected their League of Legends account yet.</p>
                    <p className="text-white/40 text-xs mt-2">Rank, stats, and match history are only visible for verified accounts.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          </motion.div>
        )}

      {/* Reputation Tab */}
      {activePublicProfileTab === 'reputation' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ReputationSystem 
            username={profile.username}
            totalMatches={284}
            winRate={67}
            rank={profile.rank}
            riotVerified={profile.riotVerified}
          />
        </motion.div>
      )}

    </div>
    </div>
  </div>
</div>
  );
}
