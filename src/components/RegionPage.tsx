// @ts-nocheck
'use client'
import { PostCard } from '@/components/PostCard';
import { Trophy, Swords, Gamepad2, Shield, Target, Zap, Star, Crown, Flame } from 'lucide-react';
const euneBackground = '/assets/strongest-champion-in-lol-teemo.jpg';
const teemoRegionIcon = '/assets/2xko-teemo-removebg-preview.png';
const lolLogo = '/assets/f9c7834eeb985de379e1ffa993c6e066e49c8aa0.png';
const clashLogo = '/assets/9ec3b1a9a2043361973b94eb0efd4e78f52d8ba7.png';
const aramLogo = '/assets/fb115a3033de860a3207e6e388e2ed1a772e92d3.png';
const riotVerifiedLogo = '/assets/33708fce311884f26222c2c97c0f96973f9fc01a.png';
import { useTranslation } from '@/hooks/useTranslation';

interface RegionPageProps {
  region: 'EUW' | 'EUNE';
  showPostForm: boolean;
  setShowPostForm: (show: boolean) => void;
  postContent: string;
  setPostContent: (content: string) => void;
  postImage: string;
  setPostImage: (image: string) => void;
  selectedRanks: string[];
  setSelectedRanks: (ranks: string[]) => void;
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  handleCreatePost: () => void;
  filteredPosts: any[];
  currentPage: string;
  onProfileClick: (profile: any) => void;
  onMessageClick: (username: string, initials: string, color: string) => void;
  onReportClick?: (postId: number, author: string, content: string) => void;
  riotAccountLinked?: boolean;
  userRank?: string | null;
  userName?: string;
  userStatus?: 'online' | 'busy' | 'offline';
  getUserStatus?: (username: string) => 'online' | 'busy' | 'offline' | null;
  postCooldownRemaining?: number;
  hasPremium?: boolean;
  userPostBackground?: string;
  setIsPostBackgroundPickerOpen?: (open: boolean) => void;
}

export function RegionPage({
  region,
  showPostForm,
  setShowPostForm,
  postContent,
  setPostContent,
  postImage,
  setPostImage,
  selectedRanks,
  setSelectedRanks,
  selectedRoles,
  setSelectedRoles,
  selectedTypes,
  setSelectedTypes,
  handleCreatePost,
  filteredPosts,
  currentPage,
  onProfileClick,
  onMessageClick,
  onReportClick,
  riotAccountLinked,
  userRank,
  userName,
  userStatus,
  getUserStatus,
  postCooldownRemaining = 0,
  hasPremium = false,
  userPostBackground = "from-[#1a1d29] to-[#242836]",
  setIsPostBackgroundPickerOpen
}: RegionPageProps) {
  const { t } = useTranslation();

  const formatCooldownTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const regionColor = region === 'EUW' ? '#00d4ff' : '#c89b3c';
  const regionGradient = region === 'EUW'
    ? 'from-[#00d4ff]/20 to-[#c89b3c]/20'
    : 'from-[#c89b3c]/20 to-[#00d4ff]/20';

  const toggleRank = (rank: string) => {
    if (selectedRanks.includes(rank)) {
      setSelectedRanks((prev: any) => prev.filter(r => r !== rank));
    } else if (selectedRanks.length < 2) {
      setSelectedRanks((prev: any) => [...prev, rank]);
    }
  };

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles((prev: any) => prev.filter(r => r !== role));
    } else if (selectedRoles.length < 5) {
      setSelectedRoles((prev: any) => [...prev, role]);
    }
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes([type]);
    }
  };

  return (
    <div className="relative min-h-screen pb-20 overflow-hidden">
      {/* Background with overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${euneBackground})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-[#0a0e27]/60" />
      </div>

      {/* Main content wrapper — responsive horizontal padding and top spacing */}
      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-4 md:px-6 pt-24 sm:pt-32 md:pt-40 pb-8">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 overflow-visible">
            <img
              src={teemoRegionIcon}
              alt="Region"
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain -my-6 sm:-my-7 md:-my-8 -mr-1 sm:-mr-2 md:-mr-3"
            />
            <h1 className="text-white text-base sm:text-lg md:text-xl font-bold">
              {region === 'EUW' ? t('postsEUW') : t('postsEUNE')}
            </h1>
          </div>
          <p className="text-white/60 text-sm sm:text-base md:text-lg ml-1 sm:ml-2">{t('findPlayers')}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-8 sm:space-y-10 md:space-y-12">

          {/* Create Post Card */}
          <div className="bg-gradient-to-br from-[#0a0e27]/40 via-[#1a1d29]/30 to-[#0a0e27]/40 rounded-2xl overflow-hidden border-2 border-[#c89b3c]/40 shadow-2xl shadow-[#00d4ff]/20 hover:shadow-[#00d4ff]/40 transition-all duration-500">
            {!showPostForm ? (
              <button
                onClick={() => setShowPostForm(true)}
                className="group relative w-full p-4 sm:p-6 md:p-8 text-left transition-all duration-500 overflow-hidden hover:scale-[1.02]"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff]/10 via-[#c89b3c]/20 to-[#00d4ff]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/10 via-transparent to-[#c89b3c]/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1500" />
                </div>

                {/* Glow orbs */}
                <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-[#00d4ff]/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-[#c89b3c]/10 rounded-full blur-[100px] animate-pulse" />

                <div className="relative flex items-center gap-3 sm:gap-4 md:gap-6">
                  {/* Premium Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff] to-[#c89b3c] rounded-2xl blur-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#00d4ff] via-[#00b8e6] to-[#c89b3c] rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-2 border-white/30">
                      <Swords className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white drop-shadow-2xl" />
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 group-hover:text-[#00d4ff] transition-colors duration-300 drop-shadow-lg truncate">
                      {t('createPost')}
                    </h3>
                    <p className="text-white/70 text-sm sm:text-base md:text-lg group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                      {t('findPlayers')} • {t('createAccountStart')}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[#00d4ff] drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#00d4ff] to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500 shadow-lg shadow-[#00d4ff]/50" />
              </button>
            ) : (
              <div className="p-4 sm:p-6 md:p-8">
                {/* Header with close button */}
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff] to-[#c89b3c] rounded-xl blur-lg opacity-60 animate-pulse" />
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#00d4ff] to-[#c89b3c] rounded-xl flex items-center justify-center shadow-xl">
                        <Swords className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-[#00d4ff] to-white bg-clip-text truncate">
                        {t('createPost')}
                      </h3>
                      <p className="text-white/50 text-xs sm:text-sm mt-0.5">{t('findPlayers')}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setShowPostForm(false);
                      setPostContent('');
                      setPostImage('');
                      setSelectedRanks([]);
                      setSelectedRoles([]);
                      setSelectedTypes([]);
                    }}
                    className="group flex-shrink-0 p-2 hover:bg-white/5 rounded-lg transition-all duration-300 ml-2"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white/40 group-hover:text-white/80 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Progress indicator */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-white/60 text-xs sm:text-sm">{t('loading')}</div>
                    <div className="text-[#00d4ff] text-xs sm:text-sm font-medium">
                      {[postContent, selectedTypes.length > 0].filter(Boolean).length}/2
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00d4ff] via-[#00b8e6] to-[#c89b3c] rounded-full transition-all duration-500 shadow-lg shadow-[#00d4ff]/50"
                      style={{ width: `${([postContent, selectedTypes.length > 0].filter(Boolean).length / 2) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Cooldown Warning or Premium Badge */}
                {!hasPremium && postCooldownRemaining > 0 && (
                  <div className="mb-4 sm:mb-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-orange-400 text-xs sm:text-sm font-medium">Post Cooldown Active</p>
                        <p className="text-white/60 text-xs mt-0.5">
                          You can post again in {formatCooldownTime(postCooldownRemaining)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {hasPremium && (
                  <div className="mb-4 sm:mb-6 bg-gradient-to-r from-[#c89b3c]/10 to-[#00d4ff]/10 border border-[#c89b3c]/30 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89b3c] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <div className="min-w-0">
                        <p className="text-transparent bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] bg-clip-text text-xs sm:text-sm font-bold">Premium Active</p>
                        <p className="text-white/60 text-xs mt-0.5">
                          No cooldowns - Post as many times as you want!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Description textarea */}
                <div className="mb-6 sm:mb-8">
                  <label className="flex items-center gap-2 text-white/90 mb-2 sm:mb-3 font-medium text-sm sm:text-base">
                    <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00d4ff] flex-shrink-0" />
                    <span>{t('postPlaceholder')}</span>
                    <span className="text-xs text-white/40">({t('confirm')})</span>
                  </label>
                  <div className="relative">
                    <textarea
                      placeholder={t('postPlaceholder')}
                      className="w-full px-3 sm:px-5 py-3 sm:py-4 bg-[#1a1d29]/60 border-2 border-[#c89b3c]/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-[#00d4ff]/50 resize-none text-white text-sm sm:text-base placeholder:text-white/30 transition-all duration-300 hover:border-[#c89b3c]/40"
                      rows={4}
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </div>
                </div>

                {/* Riot Verified Rank Info Banner */}
                {riotAccountLinked && userRank && (
                  <div className="mb-6 sm:mb-8 bg-gradient-to-br from-[#00d4ff]/10 to-[#00b8e6]/5 border border-[#00d4ff]/30 rounded-xl p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#00d4ff]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <img src={riotVerifiedLogo} alt="Riot Verified" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[#00d4ff] text-xs sm:text-sm font-bold mb-1 flex flex-wrap items-center gap-1 sm:gap-2">
                          {t('riotVerified')}
                          <span className="px-2 py-0.5 bg-[#00d4ff]/20 text-[#00d4ff] text-xs rounded border border-[#00d4ff]/30">{userRank}</span>
                        </h4>
                        <p className="text-white/60 text-xs leading-relaxed">
                          {t('riotVerifiedDesc')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Type Selection */}
                <div className="mb-6 sm:mb-8">
                  <label className="flex items-center gap-2 text-white/90 mb-3 sm:mb-4 font-medium text-sm sm:text-base">
                    <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#c89b3c] flex-shrink-0" />
                    <span>{t('selectType')}</span>
                    <span className="text-xs text-white/40">({t('selectType')})</span>
                  </label>
                  {/* Game mode buttons — wraps naturally on all screen sizes */}
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {['Ranked Solo/Duo', 'Ranked Flex', 'Normal Draft', 'SwiftPlay', 'Aram', 'Mayhem', 'Clash'].map((type) => {
                      const getGameModeLogo = (gameMode: string) => {
                        if (gameMode === 'Clash') return clashLogo;
                        if (gameMode === 'Aram' || gameMode === 'Mayhem') return aramLogo;
                        return lolLogo;
                      };

                      return (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          disabled={!selectedTypes.includes(type) && selectedTypes.length >= 7}
                          className={`group relative px-3 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 overflow-hidden flex items-center gap-1.5 sm:gap-2 justify-center ${
                            selectedTypes.includes(type)
                              ? 'bg-gradient-to-r from-[#c89b3c] to-[#daa520] text-white shadow-2xl shadow-[#c89b3c]/50 scale-105 border-2 border-white/20'
                              : selectedTypes.length >= 7
                              ? 'bg-white/5 text-white/30 border-2 border-white/10 cursor-not-allowed'
                              : 'bg-white/5 text-white/70 hover:bg-white/10 border-2 border-white/10 hover:border-[#c89b3c]/30 hover:scale-105'
                          }`}
                        >
                          {selectedTypes.includes(type) && (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 animate-pulse" />
                              <div className="absolute -inset-1 bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] opacity-30 blur-lg animate-pulse" />
                            </>
                          )}
                          <img src={getGameModeLogo(type)} alt={type} className="w-4 h-4 sm:w-5 sm:h-5 object-contain relative z-10 flex-shrink-0" />
                          <span className="relative z-10 whitespace-nowrap">{type}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-4 justify-end pt-4 sm:pt-6 border-t border-white/10">
                  <button
                    onClick={() => {
                      setShowPostForm(false);
                      setPostContent('');
                      setSelectedRanks([]);
                      setSelectedRoles([]);
                      setSelectedTypes([]);
                    }}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 rounded-lg text-white/70 hover:bg-white/10 border border-white/10 transition-all duration-300 text-sm sm:text-base text-center"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!postContent.trim() || selectedTypes.length === 0 || (!hasPremium && postCooldownRemaining > 0)}
                    className="w-full sm:w-auto relative px-5 sm:px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white hover:from-[#00b8e6] hover:to-[#009ac7] transition-all shadow-lg shadow-[#00d4ff]/50 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base text-center"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative font-medium">
                      {!hasPremium && postCooldownRemaining > 0
                        ? `Cooldown: ${formatCooldownTime(postCooldownRemaining)}`
                        : t('publish')
                      }
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Posts list */}
          {filteredPosts.map(post => (
            <PostCard
              key={`${region}-${post.id}`}
              post={post}
              currentPage={currentPage}
              onProfileClick={onProfileClick}
              onMessageClick={onMessageClick}
              onReportClick={onReportClick}
              userName={userName}
              userStatus={userStatus}
              getUserStatus={getUserStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}