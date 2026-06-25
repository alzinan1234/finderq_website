// @ts-nocheck
// Riot Games API Integration
// Documentation: https://developer.riotgames.com/
// FREE API Key: https://developer.riotgames.com/ (Sign in with your Riot account)

const RIOT_API_KEY = 'YOUR_RIOT_API_KEY_HERE'; // Replace with your free API key

// Check if API key is configured
const isApiKeyConfigured = () => {
  return RIOT_API_KEY && RIOT_API_KEY !== 'YOUR_RIOT_API_KEY_HERE' && RIOT_API_KEY.length > 20;
};

// Rate limits for Development API Key (FREE):
// - 20 requests every 1 second
// - 100 requests every 2 minutes

interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
  gameName?: string;
  tagLine?: string;
  riotId?: string;
}

interface RankedData {
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

// Season rank history interface
interface SeasonRank {
  season: string;
  tier: string;
  division: string;
  lp?: number;
  displayName: string; // e.g., "S1 Unranked", "S2 Bronze", etc.
}

interface ChampionMastery {
  championId: number;
  championLevel: number;
  championPoints: number;
  lastPlayTime: number;
}

interface MatchData {
  matchId: string;
  gameMode: string;
  win: boolean;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  timestamp: number;
}

// Region mapping
const REGIONS = {
  EUW: 'euw1',
  EUNE: 'eun1'
};

const REGION_ROUTING = {
  EUW: 'europe',
  EUNE: 'europe'
};

// Fetch summoner data by Riot ID (Game Name + Tag Line)
export async function getSummonerByRiotId(gameName: string, tagLine: string, region: 'EUW' | 'EUNE'): Promise<SummonerData | null> {
  // Return null silently if API key is not configured
  if (!isApiKeyConfigured()) {
    return null;
  }

  try {
    // Step 1: Get account info by Riot ID
    const routingValue = REGION_ROUTING[region];
    const accountResponse = await fetch(
      `https://${routingValue}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );

    if (!accountResponse.ok) {
      return null;
    }

    const accountData = await accountResponse.json();
    const puuid = accountData.puuid;

    // Step 2: Get summoner data by PUUID
    const regionCode = REGIONS[region];
    const summonerResponse = await fetch(
      `https://${regionCode}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );

    if (!summonerResponse.ok) {
      return null;
    }

    const summonerData = await summonerResponse.json();
    
    // Add Riot ID info to summoner data
    return {
      ...summonerData,
      gameName: accountData.gameName,
      tagLine: accountData.tagLine,
      riotId: `${accountData.gameName}#${accountData.tagLine}`
    };
  } catch (error) {
    return null;
  }
}

// Legacy function - kept for backwards compatibility
export async function getSummonerByName(summonerName: string, region: 'EUW' | 'EUNE'): Promise<SummonerData | null> {
  // Parse Riot ID format (Name#TAG)
  if (summonerName.includes('#')) {
    const [gameName, tagLine] = summonerName.split('#');
    return getSummonerByRiotId(gameName.trim(), tagLine.trim(), region);
  }

  // Return null silently if API key is not configured
  if (!isApiKeyConfigured()) {
    return null;
  }

  try {
    const regionCode = REGIONS[region];
    const response = await fetch(
      `https://${regionCode}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    return null;
  }
}

// Fetch ranked stats
export async function getRankedStats(summonerId: string, region: 'EUW' | 'EUNE'): Promise<RankedData[]> {
  try {
    const regionCode = REGIONS[region];
    const response = await fetch(
      `https://${regionCode}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summonerId}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error('Riot API Error:', response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching ranked stats:', error);
    return [];
  }
}

// Fetch champion mastery (top champions)
export async function getChampionMastery(summonerId: string, region: 'EUW' | 'EUNE'): Promise<ChampionMastery[]> {
  try {
    const regionCode = REGIONS[region];
    const response = await fetch(
      `https://${regionCode}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/${summonerId}/top?count=5`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error('Riot API Error:', response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching champion mastery:', error);
    return [];
  }
}

// Fetch recent matches
export async function getRecentMatches(puuid: string, region: 'EUW' | 'EUNE', count: number = 5): Promise<string[]> {
  try {
    const routingValue = REGION_ROUTING[region];
    const response = await fetch(
      `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error('Riot API Error:', response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching recent matches:', error);
    return [];
  }
}

// Fetch match details
export async function getMatchDetails(matchId: string, region: 'EUW' | 'EUNE'): Promise<any> {
  try {
    const routingValue = REGION_ROUTING[region];
    const response = await fetch(
      `https://${routingValue}.api.riotgames.com/lol/match/v5/matches/${matchId}`,
      {
        headers: {
          'X-Riot-Token': RIOT_API_KEY
        }
      }
    );

    if (!response.ok) {
      console.error('Riot API Error:', response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching match details:', error);
    return null;
  }
}

// Champion ID to name mapping (partial - add more as needed)
export const CHAMPION_NAMES: { [key: number]: string } = {
  1: "Annie",
  2: "Olaf",
  3: "Galio",
  4: "Twisted Fate",
  5: "Xin Zhao",
  7: "LeBlanc",
  8: "Vladimir",
  9: "Fiddlesticks",
  10: "Kayle",
  11: "Master Yi",
  12: "Alistar",
  13: "Ryze",
  14: "Sion",
  15: "Sivir",
  16: "Soraka",
  17: "Teemo",
  18: "Tristana",
  19: "Warwick",
  20: "Nunu",
  21: "Miss Fortune",
  22: "Ashe",
  23: "Tryndamere",
  24: "Jax",
  25: "Morgana",
  26: "Zilean",
  27: "Singed",
  28: "Evelynn",
  29: "Twitch",
  30: "Karthus",
  31: "Cho'Gath",
  32: "Amumu",
  33: "Rammus",
  34: "Anivia",
  35: "Shaco",
  36: "Dr. Mundo",
  37: "Sona",
  38: "Kassadin",
  39: "Irelia",
  40: "Janna",
  41: "Gangplank",
  42: "Corki",
  43: "Karma",
  44: "Taric",
  45: "Veigar",
  48: "Trundle",
  50: "Swain",
  51: "Caitlyn",
  53: "Blitzcrank",
  54: "Malphite",
  55: "Katarina",
  56: "Nocturne",
  57: "Maokai",
  58: "Renekton",
  59: "Jarvan IV",
  60: "Elise",
  61: "Orianna",
  62: "Wukong",
  63: "Brand",
  64: "Lee Sin",
  67: "Vayne",
  68: "Rumble",
  69: "Cassiopeia",
  72: "Skarner",
  74: "Heimerdinger",
  75: "Nasus",
  76: "Nidalee",
  77: "Udyr",
  78: "Poppy",
  79: "Gragas",
  80: "Pantheon",
  81: "Ezreal",
  82: "Mordekaiser",
  83: "Yorick",
  84: "Akali",
  85: "Kennen",
  86: "Garen",
  89: "Leona",
  90: "Malzahar",
  91: "Talon",
  92: "Riven",
  96: "Kog'Maw",
  98: "Shen",
  99: "Lux",
  101: "Xerath",
  102: "Shyvana",
  103: "Ahri",
  104: "Graves",
  105: "Fizz",
  106: "Volibear",
  107: "Rengar",
  110: "Varus",
  111: "Nautilus",
  112: "Viktor",
  113: "Sejuani",
  114: "Fiora",
  115: "Ziggs",
  117: "Lulu",
  119: "Draven",
  120: "Hecarim",
  121: "Kha'Zix",
  122: "Darius",
  126: "Jayce",
  127: "Lissandra",
  131: "Diana",
  133: "Quinn",
  134: "Syndra",
  136: "Aurelion Sol",
  141: "Kayn",
  142: "Zoe",
  143: "Zyra",
  145: "Kai'Sa",
  147: "Seraphine",
  150: "Gnar",
  154: "Zac",
  157: "Yasuo",
  161: "Vel'Koz",
  163: "Taliyah",
  164: "Camille",
  166: "Akshan",
  200: "Bel'Veth",
  201: "Braum",
  202: "Jhin",
  203: "Kindred",
  221: "Zeri",
  222: "Jinx",
  223: "Tahm Kench",
  234: "Viego",
  235: "Senna",
  236: "Lucian",
  238: "Zed",
  240: "Kled",
  245: "Ekko",
  246: "Qiyana",
  254: "Vi",
  266: "Aatrox",
  267: "Nami",
  268: "Azir",
  350: "Yuumi",
  360: "Samira",
  412: "Thresh",
  420: "Illaoi",
  421: "Rek'Sai",
  427: "Ivern",
  429: "Kalista",
  432: "Bard",
  497: "Rakan",
  498: "Xayah",
  516: "Ornn",
  517: "Sylas",
  518: "Neeko",
  523: "Aphelios",
  526: "Rell",
  555: "Pyke",
  711: "Vex",
  777: "Yone",
  875: "Sett",
  876: "Lillia",
  887: "Gwen",
  888: "Renata Glasc",
  895: "Nilah",
  897: "K'Sante",
  901: "Smolder",
  902: "Milio",
  910: "Hwei",
  950: "Naafiri"
};

// Champion role mapping for determining main role from champion mastery
const CHAMPION_ROLES: { [key: number]: string } = {
  // TOP LANERS
  2: "Top", 3: "Top", 14: "Top", 23: "Top", 24: "Top", 36: "Top", 48: "Top", 
  54: "Top", 57: "Top", 58: "Top", 68: "Top", 75: "Top", 78: "Top", 80: "Top", 
  82: "Top", 83: "Top", 86: "Top", 92: "Top", 98: "Top", 122: "Top", 126: "Top", 
  150: "Top", 164: "Top", 266: "Top", 420: "Top", 516: "Top", 875: "Top", 897: "Top",
  
  // JUNGLERS
  5: "Jungle", 9: "Jungle", 11: "Jungle", 19: "Jungle", 20: "Jungle", 28: "Jungle", 
  30: "Jungle", 32: "Jungle", 33: "Jungle", 35: "Jungle", 56: "Jungle", 59: "Jungle", 
  60: "Jungle", 62: "Jungle", 64: "Jungle", 72: "Jungle", 76: "Jungle", 77: "Jungle", 
  79: "Jungle", 102: "Jungle", 104: "Jungle", 106: "Jungle", 107: "Jungle", 113: "Jungle", 
  120: "Jungle", 121: "Jungle", 131: "Jungle", 141: "Jungle", 154: "Jungle", 163: "Jungle", 
  203: "Jungle", 234: "Jungle", 245: "Jungle", 421: "Jungle", 427: "Jungle", 876: "Jungle",
  
  // MID LANERS
  1: "Mid", 4: "Mid", 7: "Mid", 8: "Mid", 13: "Mid", 34: "Mid", 38: "Mid", 45: "Mid", 
  55: "Mid", 61: "Mid", 63: "Mid", 69: "Mid", 84: "Mid", 90: "Mid", 91: "Mid", 99: "Mid", 
  101: "Mid", 103: "Mid", 105: "Mid", 112: "Mid", 115: "Mid", 127: "Mid", 131: "Mid", 
  134: "Mid", 136: "Mid", 142: "Mid", 143: "Mid", 157: "Mid", 161: "Mid", 163: "Mid", 
  165: "Mid", 238: "Mid", 245: "Mid", 246: "Mid", 268: "Mid", 517: "Mid", 518: "Mid", 
  711: "Mid", 777: "Mid", 910: "Mid",
  
  // ADC (BOTTOM)
  15: "ADC", 18: "ADC", 21: "ADC", 22: "ADC", 29: "ADC", 42: "ADC", 51: "ADC", 
  67: "ADC", 81: "ADC", 96: "ADC", 110: "ADC", 119: "ADC", 133: "ADC", 145: "ADC", 
  202: "ADC", 222: "ADC", 236: "ADC", 360: "ADC", 429: "ADC", 498: "ADC", 523: "ADC", 
  895: "ADC", 901: "ADC", 950: "ADC",
  
  // SUPPORTS
  12: "Support", 16: "Support", 25: "Support", 26: "Support", 37: "Support", 
  40: "Support", 43: "Support", 44: "Support", 53: "Support", 89: "Support", 
  111: "Support", 117: "Support", 201: "Support", 223: "Support", 235: "Support", 
  267: "Support", 350: "Support", 412: "Support", 432: "Support", 497: "Support", 
  526: "Support", 555: "Support", 888: "Support", 902: "Support"
};

// Helper function to determine main role from champion mastery
export function getMainRoleFromChampions(championMastery: ChampionMastery[]): string {
  if (!championMastery || championMastery.length === 0) {
    return "Mid"; // Default to Mid if no data
  }
  
  // Count roles based on top 5 champions
  const roleCounts: { [key: string]: number } = {
    "Top": 0,
    "Jungle": 0,
    "Mid": 0,
    "ADC": 0,
    "Support": 0
  };
  
  championMastery.slice(0, 5).forEach((champ, index) => {
    const role = CHAMPION_ROLES[champ.championId];
    if (role) {
      // Weight earlier champions more heavily (champion with highest mastery is more important)
      const weight = 5 - index;
      roleCounts[role] += weight;
    }
  });
  
  // Find role with highest count
  let maxRole = "Mid";
  let maxCount = 0;
  
  Object.entries(roleCounts).forEach(([role, count]) => {
    if (count > maxCount) {
      maxCount = count;
      maxRole = role;
    }
  });
  
  return maxRole;
}

// Helper function to get full profile data
export async function getFullPlayerProfile(summonerName: string, region: 'EUW' | 'EUNE') {
  // Return null silently if API key is not configured
  if (!isApiKeyConfigured()) {
    return null;
  }

  try {
    // Step 1: Get summoner basic info
    const summoner = await getSummonerByName(summonerName, region);
    if (!summoner) {
      return null;
    }

    // Step 2: Get ranked stats
    const rankedStats = await getRankedStats(summoner.id, region);
    
    // Step 3: Get champion mastery
    const championMastery = await getChampionMastery(summoner.id, region);
    
    // Step 4: Get recent matches
    const matchIds = await getRecentMatches(summoner.puuid, region, 5);
    
    // Calculate total games and win rate
    const soloQueueStats = rankedStats.find((queue: any) => queue.queueType === 'RANKED_SOLO_5x5');
    const totalGames = soloQueueStats ? soloQueueStats.wins + soloQueueStats.losses : 0;
    const winRate = soloQueueStats && totalGames > 0 
      ? Math.round((soloQueueStats.wins / totalGames) * 100) 
      : 0;
    
    // Calculate main role from champion mastery
    const mainRole = getMainRoleFromChampions(championMastery);

    return {
      summoner,
      rankedStats,
      championMastery,
      matchIds,
      stats: {
        totalGames,
        winRate,
        rank: soloQueueStats ? `${soloQueueStats.tier} ${soloQueueStats.rank}` : 'Unranked',
        lp: soloQueueStats?.leaguePoints || 0,
        mainRole: mainRole  // Add main role to stats
      }
    };
  } catch (error) {
    return null;
  }
}

// Mock data for when API key is not configured
// ⚠️ THIS IS DEMO DATA - NOT YOUR REAL ACCOUNT!
export function getMockPlayerData(username: string) {
  // Extract game name and tag if provided, or use defaults
  let gameName = username;
  let tagLine = 'EUW';
  
  if (username.includes('#')) {
    const parts = username.split('#');
    gameName = parts[0];
    tagLine = parts[1];
  }
  
  // Create consistent hash from username for deterministic "random" data
  const hash = username.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const seed = Math.abs(hash);
  
  // Deterministic "random" using seed
  const seededRandom = (min: number, max: number, offset: number = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * (max - min + 1)) + min;
  };
  
  const ranks = ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
  const divisions = ['IV', 'III', 'II', 'I'];
  
  const championMastery = [
    { championId: 157, championLevel: 7, championPoints: seededRandom(150000, 300000, 8) }, // Yasuo
    { championId: 238, championLevel: 7, championPoints: seededRandom(120000, 200000, 9) }, // Zed
    { championId: 64, championLevel: 6, championPoints: seededRandom(100000, 180000, 10) }   // Lee Sin
  ];
  
  // Calculate main role from champion mastery
  const mainRole = getMainRoleFromChampions(championMastery);
  
  return {
    summoner: {
      name: gameName,
      gameName: gameName,
      tagLine: tagLine,
      riotId: `${gameName}#${tagLine}`,
      summonerLevel: seededRandom(50, 350, 1),
      profileIconId: seededRandom(1, 50, 2)
    },
    stats: {
      totalGames: seededRandom(150, 650, 3),
      winRate: seededRandom(45, 65, 4),
      rank: ranks[seededRandom(0, ranks.length - 1, 5)] + ' ' + divisions[seededRandom(0, divisions.length - 1, 6)],
      lp: seededRandom(0, 99, 7),
      mainRole: mainRole  // Add main role to stats
    },
    championMastery: championMastery,
    matchIds: ['demo-match-1', 'demo-match-2', 'demo-match-3']
  };
}

// Generate realistic season rank history from current rank
// This simulates a player's progression through seasons
export function generateSeasonRankHistory(currentRank: string, currentLP: number): SeasonRank[] {
  const tiers = ['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'MASTER', 'GRANDMASTER', 'CHALLENGER'];
  const divisions = ['IV', 'III', 'II', 'I'];
  
  // Parse current rank
  let currentTier = 'UNRANKED';
  let currentDiv = 'IV';
  
  if (currentRank && currentRank !== 'Unranked') {
    const parts = currentRank.toUpperCase().split(' ');
    currentTier = parts[0];
    currentDiv = parts[1] || 'IV';
  }
  
  const currentTierIndex = tiers.indexOf(currentTier);
  const isRanked = currentTierIndex >= 0;
  
  const history: SeasonRank[] = [];
  
  // Generate 15 seasons (S1 to S15 - current season)
  for (let season = 1; season <= 15; season++) {
    const seasonNum = season;
    
    // Early seasons - progression from low to high
    if (season <= 3) {
      // Start unranked or low rank
      if (season === 1) {
        history.push({
          season: `S${seasonNum}`,
          tier: 'UNRANKED',
          division: '',
          displayName: `S${seasonNum} Unranked`
        });
      } else if (season === 2) {
        // First ranked season - usually Bronze/Silver
        const startTier = isRanked && currentTierIndex >= 1 ? 'BRONZE' : 'BRONZE';
        const startDiv = 'III';
        history.push({
          season: `S${seasonNum}`,
          tier: startTier,
          division: startDiv,
          displayName: `S${seasonNum} ${startTier.charAt(0) + startTier.slice(1).toLowerCase()}`
        });
      } else {
        // Season 3 - slight improvement
        const tier = isRanked && currentTierIndex >= 2 ? 'SILVER' : 'BRONZE';
        const div = 'II';
        history.push({
          season: `S${seasonNum}`,
          tier: tier,
          division: div,
          displayName: `S${seasonNum} ${tier.charAt(0) + tier.slice(1).toLowerCase()}`
        });
      }
    }
    // Mid seasons - gradual progression
    else if (season <= 10) {
      if (!isRanked) {
        // If currently unranked, show bronze/silver progression
        const tier = season <= 6 ? 'BRONZE' : 'SILVER';
        const divIndex = Math.max(0, 3 - Math.floor((season - 4) / 2));
        const div = divisions[divIndex];
        history.push({
          season: `S${seasonNum}`,
          tier: tier,
          division: div,
          displayName: `S${seasonNum} ${tier.charAt(0) + tier.slice(1).toLowerCase()}`
        });
      } else {
        // Progress toward current rank
        const progressPercent = (season - 3) / (15 - 3);
        let targetTierIndex = Math.floor(progressPercent * currentTierIndex);
        targetTierIndex = Math.max(1, Math.min(targetTierIndex, currentTierIndex));
        
        const tier = tiers[targetTierIndex];
        const divIndex = Math.floor((1 - (progressPercent % 0.2) * 5) * 3);
        const div = divisions[Math.max(0, Math.min(3, divIndex))];
        
        history.push({
          season: `S${seasonNum}`,
          tier: tier,
          division: div,
          displayName: `S${seasonNum} ${tier.charAt(0) + tier.slice(1).toLowerCase()}`
        });
      }
    }
    // Recent seasons - near current rank
    else {
      if (!isRanked) {
        history.push({
          season: `S${seasonNum}`,
          tier: 'SILVER',
          division: 'I',
          displayName: `S${seasonNum} Silver`
        });
      } else {
        // Fluctuate around current rank
        let tierIndex = currentTierIndex;
        let div = currentDiv;
        
        if (season === 15) {
          // Current season - exact current rank
          tierIndex = currentTierIndex;
          div = currentDiv;
          history.push({
            season: `S${seasonNum}`,
            tier: tiers[tierIndex],
            division: div,
            lp: currentLP,
            displayName: `S${seasonNum} ${tiers[tierIndex].charAt(0) + tiers[tierIndex].slice(1).toLowerCase()}`
          });
        } else {
          // Previous season - slightly lower or same
          tierIndex = Math.max(0, currentTierIndex - (15 - season) % 2);
          const divIdx = divisions.indexOf(currentDiv);
          const newDivIdx = Math.min(3, divIdx + ((15 - season) % 3));
          div = divisions[newDivIdx];
          
          history.push({
            season: `S${seasonNum}`,
            tier: tiers[tierIndex],
            division: div,
            displayName: `S${seasonNum} ${tiers[tierIndex].charAt(0) + tiers[tierIndex].slice(1).toLowerCase()}`
          });
        }
      }
    }
  }
  
  return history;
}

// Export interface for use in other files
export type { SeasonRank, SummonerData, RankedData, ChampionMastery, MatchData };