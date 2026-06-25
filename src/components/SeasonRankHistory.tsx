// @ts-nocheck
'use client'
import { Trophy } from "lucide-react";
import type { SeasonRank } from "../utils/riotApi";

interface SeasonRankHistoryProps {
  seasonRanks: SeasonRank[];
  isVisible: boolean;
  showBorder?: boolean;
  bgColor?: string;
}

export function SeasonRankHistory({ seasonRanks, isVisible, showBorder = true, bgColor = '#1a1f3a' }: SeasonRankHistoryProps) {
  if (!isVisible || !seasonRanks || seasonRanks.length === 0) {
    return null;
  }

  // Get rank color based on tier
  const getRankColor = (tier: string) => {
    const tierUpper = tier.toUpperCase();
    switch (tierUpper) {
      case 'UNRANKED':
        return 'text-white/40';
      case 'IRON':
        return 'text-gray-400';
      case 'BRONZE':
        return 'text-orange-700';
      case 'SILVER':
        return 'text-gray-300';
      case 'GOLD':
        return 'text-yellow-500';
      case 'PLATINUM':
        return 'text-teal-400';
      case 'DIAMOND':
        return 'text-blue-400';
      case 'MASTER':
        return 'text-purple-400';
      case 'GRANDMASTER':
        return 'text-red-400';
      case 'CHALLENGER':
        return 'text-cyan-400';
      default:
        return 'text-white/60';
    }
  };

  // Get rank background color based on tier
  const getRankBg = (tier: string) => {
    const tierUpper = tier.toUpperCase();
    switch (tierUpper) {
      case 'UNRANKED':
        return 'bg-black/20';
      case 'IRON':
        return 'bg-gray-400/20';
      case 'BRONZE':
        return 'bg-orange-700/20';
      case 'SILVER':
        return 'bg-gray-300/20';
      case 'GOLD':
        return 'bg-yellow-500/20';
      case 'PLATINUM':
        return 'bg-teal-400/20';
      case 'DIAMOND':
        return 'bg-blue-400/20';
      case 'MASTER':
        return 'bg-purple-400/20';
      case 'GRANDMASTER':
        return 'bg-red-400/20';
      case 'CHALLENGER':
        return 'bg-cyan-400/20';
      default:
        return 'bg-black/20';
    }
  };

  // Get rank border color based on tier
  const getRankBorder = (tier: string) => {
    const tierUpper = tier.toUpperCase();
    switch (tierUpper) {
      case 'UNRANKED':
        return 'border-white/10';
      case 'IRON':
        return 'border-gray-400';
      case 'BRONZE':
        return 'border-orange-700';
      case 'SILVER':
        return 'border-gray-300';
      case 'GOLD':
        return 'border-yellow-500';
      case 'PLATINUM':
        return 'border-teal-400';
      case 'DIAMOND':
        return 'border-blue-400';
      case 'MASTER':
        return 'border-purple-400';
      case 'GRANDMASTER':
        return 'border-red-400';
      case 'CHALLENGER':
        return 'border-cyan-400';
      default:
        return 'border-white/10';
    }
  };

  return (
    <div className={`mt-4 ${showBorder ? 'pt-4 border-t border-white/10' : ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-4 h-4 text-[#00d4ff]" />
        <h3 className="text-white/90 text-sm font-semibold">Season Rank History</h3>
      </div>
      
      <div className="relative">
        {/* Scrollable container */}
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <div className="flex gap-2 min-w-max">
            {seasonRanks.map((rank, index) => {
              const isCurrentSeason = index === seasonRanks.length - 1;
              
              return (
                <div
                  key={`${rank.season}-${index}`}
                  className={`
                    relative flex-shrink-0 px-3 py-2 rounded-lg border
                    ${getRankBg(rank.tier)}
                    ${getRankBorder(rank.tier)}
                    ${isCurrentSeason ? 'ring-2 ring-[#00d4ff]/30' : ''}
                    transition-all duration-200 hover:scale-105
                  `}
                >
                  {/* Season label */}
                  <div className="text-[10px] font-bold text-white/40 mb-1">
                    {rank.season}
                  </div>
                  
                  {/* Rank display */}
                  <div className={`text-xs font-bold ${getRankColor(rank.tier)}`}>
                    {rank.tier === 'UNRANKED' ? (
                      'Unranked'
                    ) : (
                      <>
                        {rank.tier.charAt(0) + rank.tier.slice(1).toLowerCase()}
                        {rank.division && ` ${rank.division}`}
                      </>
                    )}
                  </div>
                  
                  {/* LP display for current season */}
                  {isCurrentSeason && rank.lp !== undefined && (
                    <div className="text-[9px] text-white/40 mt-0.5">
                      {rank.lp} LP
                    </div>
                  )}
                  
                  {/* Current season indicator */}
                  {isCurrentSeason && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Gradient fade effects */}
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r to-transparent pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, ${bgColor}, transparent)` }} />
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l to-transparent pointer-events-none" style={{ backgroundImage: `linear-gradient(to left, ${bgColor}, transparent)` }} />
      </div>
      
      <div className="mt-2 text-[9px] text-white/30 text-center">
        Your rank progression through seasons • Current season highlighted
      </div>
    </div>
  );
}