// @ts-nocheck
'use client'
import React from 'react';
const kingTeemoLogo = '/assets/ChatGPT_Image_Jun_9__2026__09_45_23_AM-removebg-preview.png';
const grandmasterTeemoLogo = '/assets/image-removebg-preview_1_-1.png';
const masterTeemoLogo = '/assets/image-removebg-preview_2_.png';
const diamondTeemoLogo = '/assets/image-removebg-preview_3_.png';
const emeraldTeemoLogo = '/assets/image-removebg-preview_6_.png';
const platinumTeemoLogo = '/assets/image-removebg-preview_7_.png';
const goldTeemoLogo = '/assets/image-removebg-preview_8_.png';
const silverTeemoLogo = '/assets/image-removebg-preview_9_.png';
const bronzeTeemoLogo = '/assets/image-removebg-preview_10_.png';
const legendTeemoLogo = '/assets/image-removebg-preview_11_.png';

export interface TrophyTier {
  name: string;
  minEarnings: number;
  maxEarnings: number;
  color: string;
  glowColor: string;
  bgGradient: string;
  borderColor: string;
  emoji: string;
}

export const TROPHY_TIERS: TrophyTier[] = [
  {
    name: 'Bronze',
    minEarnings: 5,
    maxEarnings: 15,
    color: '#cd7f32',
    glowColor: 'rgba(205,127,50,0.4)',
    bgGradient: 'linear-gradient(135deg, #3d2000 0%, #7a3d00 50%, #3d2000 100%)',
    borderColor: '#cd7f32',
    emoji: '🥉',
  },
  {
    name: 'Silver',
    minEarnings: 15,
    maxEarnings: 30,
    color: '#c0c0c0',
    glowColor: 'rgba(192,192,192,0.4)',
    bgGradient: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%)',
    borderColor: '#c0c0c0',
    emoji: '🥈',
  },
  {
    name: 'Gold',
    minEarnings: 30,
    maxEarnings: 50,
    color: '#ffd700',
    glowColor: 'rgba(255,215,0,0.4)',
    bgGradient: 'linear-gradient(135deg, #2a1a00 0%, #6b4c00 50%, #2a1a00 100%)',
    borderColor: '#ffd700',
    emoji: '🥇',
  },
  {
    name: 'Platinum',
    minEarnings: 50,
    maxEarnings: 75,
    color: '#00d4ff',
    glowColor: 'rgba(0,212,255,0.4)',
    bgGradient: 'linear-gradient(135deg, #001a22 0%, #003344 50%, #001a22 100%)',
    borderColor: '#00d4ff',
    emoji: '🏆',
  },
  {
    name: 'Emerald',
    minEarnings: 75,
    maxEarnings: 100,
    color: '#50C878',
    glowColor: 'rgba(80,200,120,0.4)',
    bgGradient: 'linear-gradient(135deg, #001a0a 0%, #003316 50%, #001a0a 100%)',
    borderColor: '#50C878',
    emoji: '💎',
  },
  {
    name: 'Diamond',
    minEarnings: 100,
    maxEarnings: 150,
    color: '#b9f2ff',
    glowColor: 'rgba(185,242,255,0.5)',
    bgGradient: 'linear-gradient(135deg, #001a22 0%, #004455 50%, #001a22 100%)',
    borderColor: '#b9f2ff',
    emoji: '💠',
  },
  {
    name: 'Master',
    minEarnings: 150,
    maxEarnings: 250,
    color: '#e100ff',
    glowColor: 'rgba(225,0,255,0.4)',
    bgGradient: 'linear-gradient(135deg, #1a001f 0%, #44004f 50%, #1a001f 100%)',
    borderColor: '#e100ff',
    emoji: '⚜️',
  },
  {
    name: 'Grandmaster',
    minEarnings: 250,
    maxEarnings: 500,
    color: '#ff4444',
    glowColor: 'rgba(255,68,68,0.4)',
    bgGradient: 'linear-gradient(135deg, #1f0000 0%, #4f0000 50%, #1f0000 100%)',
    borderColor: '#ff4444',
    emoji: '👑',
  },
  {
    name: 'Legend',
    minEarnings: 500,
    maxEarnings: 100000,
    color: '#00ffcc',
    glowColor: 'rgba(0,255,204,0.6)',
    bgGradient: 'linear-gradient(135deg, #001a12 0%, #003828 50%, #001a12 100%)',
    borderColor: '#00ffcc',
    emoji: '🌟',
  },
  {
    name: 'Challenger',
    minEarnings: 100000,
    maxEarnings: Infinity,
    color: '#f4c430',
    glowColor: 'rgba(244,196,48,0.6)',
    bgGradient: 'linear-gradient(135deg, #1a1200 0%, #4a3800 50%, #2a1f00 100%)',
    borderColor: '#f4c430',
    emoji: '👑',
  },
];

export function getTrophyTier(earnings: number): TrophyTier | null {
  if (earnings < 5) return null;
  return TROPHY_TIERS.find(t => earnings >= t.minEarnings && earnings < t.maxEarnings) || TROPHY_TIERS[TROPHY_TIERS.length - 1];
}

interface TrophyBadgeProps {
  earnings: number;
  size?: 'small' | 'medium' | 'large';
  showAmount?: boolean;
  tournamentName?: string;
  offsetX?: string;
}

export function TrophyBadge({ earnings, size = 'small', showAmount = true, tournamentName, offsetX }: TrophyBadgeProps) {
  const tier = getTrophyTier(earnings);
  if (!tier) return null;

  const isSmall = size === 'small';
  const isLarge = size === 'large';

  // Bronze Teemo for earnings 5-15
  if (earnings >= 5 && earnings < 15) {
    const imgSize = isSmall ? 103 : isLarge ? 153 : 123;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `A câștigat un turneu în valoare de €${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/bronzetrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={bronzeTeemoLogo}
          alt="Bronze Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(205,127,50,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/bronzetrophy:scale-110"
        />
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/bronzetrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #3d2000 0%, #7a3d00 100%)',
            border: '1px solid #cd7f32',
            color: '#cd7f32',
            boxShadow: '0 0 12px rgba(205,127,50,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #cd7f32' }} />
        </div>
      </div>
    );
  }

  // Silver Teemo for earnings 15-30
  if (earnings >= 15 && earnings < 30) {
    const imgSize = isSmall ? 103 : isLarge ? 153 : 123;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/silvertrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={silverTeemoLogo}
          alt="Silver Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(192,192,192,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/silvertrophy:scale-110"
        />
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/silvertrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%)',
            border: '1px solid #c0c0c0',
            color: '#c0c0c0',
            boxShadow: '0 0 12px rgba(192,192,192,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #c0c0c0' }} />
        </div>
      </div>
    );
  }

  // Gold Teemo for earnings 30-50
  if (earnings >= 30 && earnings < 50) {
    const imgSize = isSmall ? 103 : isLarge ? 153 : 123;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/goldtrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={goldTeemoLogo}
          alt="Gold Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(255,215,0,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/goldtrophy:scale-110"
        />
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/goldtrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #2a1a00 0%, #6b4c00 100%)',
            border: '1px solid #ffd700',
            color: '#ffd700',
            boxShadow: '0 0 12px rgba(255,215,0,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #ffd700' }} />
        </div>
      </div>
    );
  }

  // Platinum Teemo for earnings 50-75
  if (earnings >= 50 && earnings < 75) {
    const imgSize = isSmall ? 95 : isLarge ? 145 : 115;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/platinumtrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={platinumTeemoLogo}
          alt="Platinum Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(0,212,255,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/platinumtrophy:scale-110"
        />
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/platinumtrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #001a22 0%, #003344 100%)',
            border: '1px solid #00d4ff',
            color: '#00d4ff',
            boxShadow: '0 0 12px rgba(0,212,255,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #00d4ff' }} />
        </div>
      </div>
    );
  }

  // Emerald Teemo (green crown) for earnings 75-100
  if (earnings >= 75 && earnings < 100) {
    const imgSize = isSmall ? 113 : isLarge ? 165 : 133;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/emeraldtrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={emeraldTeemoLogo}
          alt="Emerald Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(80,200,120,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/emeraldtrophy:scale-110"
        />
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/emeraldtrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #001a0a 0%, #003316 100%)',
            border: '1px solid #50C878',
            color: '#50C878',
            boxShadow: '0 0 12px rgba(80,200,120,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #50C878' }} />
        </div>
      </div>
    );
  }

  // Diamond Teemo (blue crown) for earnings 100-150
  if (earnings >= 100 && earnings < 150) {
    const imgSize = isSmall ? 100 : isLarge ? 150 : 120;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/diamondtrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={diamondTeemoLogo}
          alt="Diamond Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(185,242,255,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/diamondtrophy:scale-110"
        />
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/diamondtrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #001a22 0%, #004455 100%)',
            border: '1px solid #b9f2ff',
            color: '#b9f2ff',
            boxShadow: '0 0 12px rgba(185,242,255,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #b9f2ff' }} />
        </div>
      </div>
    );
  }

  // Master Teemo (purple crown) for earnings 150-250
  if (earnings >= 150 && earnings < 250) {
    const imgSize = isSmall ? 100 : isLarge ? 150 : 120;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/mastertrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={masterTeemoLogo}
          alt="Master Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(225,0,255,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/mastertrophy:scale-110"
        />
        {/* Tooltip */}
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/mastertrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #1a001f 0%, #44004f 100%)',
            border: '1px solid #e100ff',
            color: '#e100ff',
            boxShadow: '0 0 12px rgba(225,0,255,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #e100ff' }} />
        </div>
      </div>
    );
  }

  // Grandmaster Teemo (red crown) for earnings 250-500
  if (earnings >= 250 && earnings < 500) {
    const imgSize = isSmall ? 100 : isLarge ? 150 : 120;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/gmtrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={grandmasterTeemoLogo}
          alt="Grandmaster Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(255,68,68,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/gmtrophy:scale-110"
        />
        {/* Tooltip */}
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/gmtrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #1f0000 0%, #4f0000 100%)',
            border: '1px solid #ff4444',
            color: '#ff4444',
            boxShadow: '0 0 12px rgba(255,68,68,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #ff4444' }} />
        </div>
      </div>
    );
  }

  // Legend trophy for earnings 500-100000
  if (earnings >= 500 && earnings < 100000) {
    const imgSize = isSmall ? 113 : isLarge ? 165 : 133;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}"`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/legendtrophy -mb-16 -mt-8" style={{ marginLeft: offsetX ?? '-65px' }}>
        <img
          src={legendTeemoLogo}
          alt="Legend Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 10px rgba(0,255,204,0.9))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/legendtrophy:scale-110"
        />
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/legendtrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #001a12 0%, #003828 100%)',
            border: '1px solid #00ffcc',
            color: '#00ffcc',
            boxShadow: '0 0 12px rgba(0,255,204,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #00ffcc' }} />
        </div>
      </div>
    );
  }

  // King Teemo champion trophy for earnings >= 100000
  if (earnings >= 100000) {
    const imgSize = isSmall ? 156 : isLarge ? 240 : 192;
    const tooltipText = tournamentName
      ? `A câștigat turneul "${tournamentName}" în valoare de €${earnings.toFixed(0)}`
      : `€${earnings.toFixed(0)}`;
    return (
      <div className="relative inline-block group/kingtrophy -ml-40 -mb-16 -mt-8">
        <img
          src={kingTeemoLogo}
          alt="Tournament Champion"
          style={{ width: imgSize, height: imgSize, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(244,196,48,0.8))' }}
          className="cursor-pointer transition-transform duration-200 group-hover/kingtrophy:scale-110"
        />
        {/* Tooltip */}
        <div
          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover/kingtrophy:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #1a1200 0%, #4a3800 100%)',
            border: '1px solid #f4c430',
            color: '#f4c430',
            boxShadow: '0 0 12px rgba(244,196,48,0.6)',
            zIndex: 99999,
          }}
        >
          {tooltipText}
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0" style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid #f4c430' }} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center gap-1.5 rounded-lg font-bold select-none ${
        isSmall ? 'px-2 py-1 text-[10px]' : isLarge ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'
      }`}
      style={{
        background: tier.bgGradient,
        border: `1px solid ${tier.borderColor}`,
        boxShadow: `0 0 ${isLarge ? '14px' : '8px'} ${tier.glowColor}, inset 0 1px 0 rgba(255,255,255,0.1)`,
        color: tier.color,
      }}
      title={`Tournament Trophy: ${tier.name} — €${earnings.toFixed(0)} earned`}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Trophy SVG */}
      <TrophySVG color={tier.color} size={isSmall ? 12 : isLarge ? 18 : 14} />

      {/* Tier name */}
      <span className="relative z-10 tracking-wide">{tier.name}</span>

      {/* Amount */}
      {showAmount && (
        <span className="relative z-10 opacity-80">€{earnings >= 1000 ? `${(earnings / 1000).toFixed(1)}k` : earnings.toFixed(0)}</span>
      )}
    </div>
  );
}

function TrophySVG({ color, size }: { color: string; size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="relative z-10 flex-shrink-0"
      style={{ filter: `drop-shadow(0 0 3px ${color})` }}
    >
      {/* Cup body */}
      <path
        d="M8 21h8M12 17v4M7 3H5C4.4 3 4 3.4 4 4v2c0 2.2 1.8 4 4 4h.2M17 3h2c.6 0 1 .4 1 1v2c0 2.2-1.8 4-4 4h-.2M8 3h8v7a4 4 0 0 1-8 0V3z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Base */}
      <path
        d="M6 21h12"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Stars on cup */}
      <path
        d="M12 6l.5 1.5H14l-1.2.9.5 1.5L12 9l-1.3.9.5-1.5L10 7.5h1.5L12 6z"
        fill={color}
        opacity="0.8"
      />
    </svg>
  );
}

/** Large showcase trophy for profile page */
export function TrophyShowcase({ earnings, tournamentName }: { earnings: number; tournamentName?: string }) {
  const tier = getTrophyTier(earnings);
  if (!tier) return null;

  // Bronze Teemo showcase (5-15€)
  if (earnings >= 5 && earnings < 15) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #3d2000 0%, #7a3d00 50%, #3d2000 100%)',
          border: '1.5px solid #cd7f32',
          boxShadow: '0 0 24px rgba(205,127,50,0.4), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #cd7f32 0%, transparent 70%)' }} />
        <img
          src={bronzeTeemoLogo}
          alt="Bronze Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(205,127,50,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#cd7f32' }}>Bronze</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #cd7f3240', color: '#cd7f32' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // Silver Teemo showcase (15-30€)
  if (earnings >= 15 && earnings < 30) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 50%, #1a1a1a 100%)',
          border: '1.5px solid #c0c0c0',
          boxShadow: '0 0 24px rgba(192,192,192,0.4), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #c0c0c0 0%, transparent 70%)' }} />
        <img
          src={silverTeemoLogo}
          alt="Silver Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(192,192,192,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#c0c0c0' }}>Silver</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #c0c0c040', color: '#c0c0c0' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // Gold Teemo showcase (30-50€)
  if (earnings >= 30 && earnings < 50) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #2a1a00 0%, #6b4c00 50%, #2a1a00 100%)',
          border: '1.5px solid #ffd700',
          boxShadow: '0 0 24px rgba(255,215,0,0.5), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #ffd700 0%, transparent 70%)' }} />
        <img
          src={goldTeemoLogo}
          alt="Gold Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#ffd700' }}>Gold</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #ffd70040', color: '#ffd700' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // Platinum Teemo showcase (50-75€)
  if (earnings >= 50 && earnings < 75) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #001a22 0%, #003344 50%, #001a22 100%)',
          border: '1.5px solid #00d4ff',
          boxShadow: '0 0 24px rgba(0,212,255,0.5), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #00d4ff 0%, transparent 70%)' }} />
        <img
          src={platinumTeemoLogo}
          alt="Platinum Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#00d4ff' }}>Platinum</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #00d4ff40', color: '#00d4ff' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // Emerald Teemo showcase (75-100€)
  if (earnings >= 75 && earnings < 100) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #001a0a 0%, #003316 50%, #001a0a 100%)',
          border: '1.5px solid #50C878',
          boxShadow: '0 0 24px rgba(80,200,120,0.5), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #50C878 0%, transparent 70%)' }} />
        <img
          src={emeraldTeemoLogo}
          alt="Emerald Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(80,200,120,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#50C878' }}>Emerald</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #50C87840', color: '#50C878' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // Diamond Teemo showcase (100-150€)
  if (earnings >= 100 && earnings < 150) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #001a22 0%, #004455 50%, #001a22 100%)',
          border: '1.5px solid #b9f2ff',
          boxShadow: '0 0 24px rgba(185,242,255,0.5), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #b9f2ff 0%, transparent 70%)' }} />
        <img
          src={diamondTeemoLogo}
          alt="Diamond Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(185,242,255,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#b9f2ff' }}>Diamond</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #b9f2ff40', color: '#b9f2ff' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // Master Teemo showcase (150-250€)
  if (earnings >= 150 && earnings < 250) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #1a001f 0%, #44004f 50%, #1a001f 100%)',
          border: '1.5px solid #e100ff',
          boxShadow: '0 0 24px rgba(225,0,255,0.5), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #e100ff 0%, transparent 70%)' }} />
        <img
          src={masterTeemoLogo}
          alt="Master Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(225,0,255,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#e100ff' }}>Master</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #e100ff40', color: '#e100ff' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // Grandmaster Teemo showcase (250-500€)
  if (earnings >= 250 && earnings < 500) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #1f0000 0%, #4f0000 50%, #2a0000 100%)',
          border: '1.5px solid #ff4444',
          boxShadow: '0 0 24px rgba(255,68,68,0.5), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #ff4444 0%, transparent 70%)' }} />
        <img
          src={grandmasterTeemoLogo}
          alt="Grandmaster Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(255,68,68,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#ff4444' }}>Grandmaster</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #ff444440', color: '#ff4444' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // Legend showcase (500-100000€)
  if (earnings >= 500 && earnings < 100000) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #001a12 0%, #003828 50%, #001a12 100%)',
          border: '1.5px solid #00ffcc',
          boxShadow: '0 0 24px rgba(0,255,204,0.5), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #00ffcc 0%, transparent 70%)' }} />
        <img
          src={legendTeemoLogo}
          alt="Legend Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,204,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#00ffcc' }}>Legend</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #00ffcc40', color: '#00ffcc' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  // King Teemo showcase for Challenger tier (100000€+)
  if (earnings >= 100000) {
    return (
      <div
        className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden group/showcase"
        style={{
          background: 'linear-gradient(135deg, #1a1200 0%, #4a3800 50%, #2a1f00 100%)',
          border: '1.5px solid #f4c430',
          boxShadow: '0 0 24px rgba(244,196,48,0.5), 0 4px 16px rgba(0,0,0,0.4)',
        }}
      >
        <div className="absolute inset-0 opacity-20 animate-pulse" style={{ background: 'radial-gradient(circle at 50% 30%, #f4c430 0%, transparent 70%)' }} />
        <img
          src={kingTeemoLogo}
          alt="Tournament Champion"
          className="relative z-10 w-16 h-16 object-contain transition-transform duration-300 group-hover/showcase:scale-110"
          style={{ filter: 'drop-shadow(0 0 10px rgba(244,196,48,0.9))' }}
        />
        <div className="relative z-10 text-center">
          <p className="font-black text-sm tracking-widest uppercase" style={{ color: '#f4c430' }}>Challenger</p>
          <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
        </div>
        <div
          className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
          style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid #f4c43040', color: '#f4c430' }}
        >
          {tournamentName ? `${tournamentName} — €${earnings.toFixed(0)}` : `€${earnings.toFixed(0)} earned`}
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-xl p-4 flex flex-col items-center gap-2 overflow-hidden"
      style={{
        background: tier.bgGradient,
        border: `1.5px solid ${tier.borderColor}`,
        boxShadow: `0 0 20px ${tier.glowColor}, 0 4px 16px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Animated glow pulse */}
      <div
        className="absolute inset-0 opacity-20 animate-pulse"
        style={{ background: `radial-gradient(circle at 50% 30%, ${tier.color} 0%, transparent 70%)` }}
      />

      {/* Large trophy icon */}
      <div className="relative z-10">
        <TrophySVG color={tier.color} size={40} />
      </div>

      {/* Tier name */}
      <div className="relative z-10 text-center">
        <p className="font-black text-sm tracking-widest uppercase" style={{ color: tier.color }}>
          {tier.name}
        </p>
        <p className="text-white/60 text-[10px] mt-0.5">Tournament Champion</p>
      </div>

      {/* Earnings */}
      <div
        className="relative z-10 px-3 py-1 rounded-full text-xs font-bold"
        style={{
          background: `rgba(0,0,0,0.4)`,
          border: `1px solid ${tier.borderColor}40`,
          color: tier.color,
        }}
      >
        €{earnings.toFixed(0)} earned
      </div>
    </div>
  );
}
