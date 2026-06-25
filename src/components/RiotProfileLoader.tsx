// @ts-nocheck
'use client'
import { useState, useEffect } from 'react';
import { getFullPlayerProfile, getMockPlayerData, CHAMPION_NAMES } from '@/utils/riotApi';

interface RiotProfileLoaderProps {
  summonerName: string;
  region: 'EUW' | 'EUNE';
  onDataLoaded?: (data: any) => void;
}

export function RiotProfileLoader({ summonerName, region, onDataLoaded }: RiotProfileLoaderProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      setError(null);

      try {
        // Try to fetch real data from Riot API
        const data = await getFullPlayerProfile(summonerName, region);
        
        if (data) {
          setProfileData(data);
          onDataLoaded?.(data);
        } else {
          // Fallback to mock data if API fails
          const mockData = getMockPlayerData(summonerName);
          setProfileData(mockData);
          onDataLoaded?.(mockData);
          setError('Using demo data. Configure Riot API key for real stats.');
        }
      } catch (err) {
        // Use mock data on error
        const mockData = getMockPlayerData(summonerName);
        setProfileData(mockData);
        onDataLoaded?.(mockData);
        setError('Using demo data. Configure Riot API key for real stats.');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [summonerName, region]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d4ff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-yellow-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}

// Helper component to display champion mastery
export function ChampionMasteryDisplay({ championId, level, points }: { championId: number, level: number, points: number }) {
  const championName = CHAMPION_NAMES[championId] || `Champion ${championId}`;
  
  return (
    <div className="flex items-center justify-between py-2.5 px-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs">
          M{level}
        </div>
        <div>
          <p className="text-white text-sm">{championName}</p>
          <p className="text-white/50 text-xs">{points.toLocaleString()} points</p>
        </div>
      </div>
    </div>
  );
}
