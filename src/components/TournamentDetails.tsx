// @ts-nocheck
'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { X, Trophy, Calendar, Users, MapPin, Target, ChevronRight, Medal, Crown, Award, DollarSign, Clock, FileText, MessageCircle, Send } from 'lucide-react';
const ownerCrownIcon = '/assets/ChatGPT_Image_Jun_9__2026__09_45_23_AM-removebg-preview.png';

interface Team {
  id: number;
  name: string;
  avatar?: string;
  score?: number;
  seed: number;
}

interface Match {
  id: number;
  round: number;
  position: number;
  team1?: Team;
  team2?: Team;
  winner?: number; // team id
  bracket: 'upper' | 'lower' | 'main'; // for double elimination
}

interface TournamentDetailsProps {
  tournamentId: number;
  onClose: () => void;
  isOrganizer?: boolean;
  userName?: string;
  onTournamentWin?: (prizeAmount: number, tournamentName: string) => void;
  initialStatus?: 'registration' | 'ongoing' | 'completed' | 'cancelled';
  canModerateTournaments?: boolean;
}

export function TournamentDetails({ tournamentId, onClose, isOrganizer = false, userName, onTournamentWin, initialStatus = 'registration', canModerateTournaments = false }: TournamentDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bracket' | 'teams' | 'rules' | 'manage'>('overview');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState(['', '', '', '', '']);
  const [teamRoles, setTeamRoles] = useState(['Top', 'Jungle', 'Mid', 'ADC', 'Support']);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredTeamName, setRegisteredTeamName] = useState('');
  const [registeredTeamMembers, setRegisteredTeamMembers] = useState<string[]>([]);
  const [registeredTeamRoles, setRegisteredTeamRoles] = useState<string[]>([]);
  const [tournamentStatus, setTournamentStatus] = useState<'registration' | 'ongoing' | 'completed' | 'cancelled'>(initialStatus);
  const [registrationClosed, setRegistrationClosed] = useState(false);
  const [isDeclareWinnerOpen, setIsDeclareWinnerOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [matchChats, setMatchChats] = useState<Record<number, Array<{ sender: string; message: string; timestamp: Date }>>>({});
  const [chatMessage, setChatMessage] = useState('');

  const [bracketSize, setBracketSize] = useState<8 | 16 | 32 | 64>(8);

  // Mock tournament data
  const tournament = {
    id: tournamentId,
    name: "FinderQ Spring Championship 2025",
    organizer: "FinderQ Official",
    organizerAvatar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
    prize: 5000,
    currency: "EUR",
    startDate: "2025-04-15",
    registrationDeadline: "2025-04-10",
    format: "Single Elimination",
    teamSize: "5v5",
    maxTeams: bracketSize,
    registeredTeams: bracketSize,
    status: "registration",
    region: "Both",
    rankRequirement: "Platinum+",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=400&fit=crop",
    description: "Join the biggest League of Legends tournament of the season! Compete against the best teams from EUW and EUNE for a massive €5,000 prize pool. This double elimination format ensures every team gets a second chance to prove themselves.",
    rules: [
      "All teams must have 5 players with at least Platinum rank",
      "Standard competitive draft rules apply (10 bans, blind pick)",
      "Best of 3 format for all matches except finals (Best of 5)",
      "Prize distribution: 1st 50%, 2nd 30%, 3rd/4th 10% each",
      "All players must be Riot Verified on FinderQ",
      "Matches must be played on the scheduled date/time",
      "No toxic behavior - violations result in disqualification"
    ]
  };

  // Generate teams dynamically based on bracket size
  const generateTeams = (count: number): Team[] => {
    const teamNames = [
      "Team Apex", "Rising Phoenix", "Shadow Legends", "Cyber Warriors", "Elite Gaming", "Thunder Strike",
      "Mystic Force", "Dragon Slayers", "Night Raiders", "Storm Breakers", "Crystal Guardians", "Flame Titans",
      "Void Walkers", "Arctic Wolves", "Solar Eclipse", "Lunar Knights", "Iron Giants", "Neon Strikers",
      "Phantom Squad", "Toxic Legends", "Royal Guards", "Dark Matter", "Star Chasers", "Velocity Gaming",
      "Titan Force", "Crimson Blades", "Golden Dragons", "Silver Bullets", "Bronze Warriors", "Diamond Elite",
      "Platinum Squad", "Emerald Legends", "Ruby Strikers", "Sapphire Knights", "Obsidian Gaming", "Nova Force",
      "Thunder Cats", "Lightning Bolts", "Storm Surge", "Wave Riders", "Ocean Titans", "Desert Hawks",
      "Mountain Kings", "Valley Legends", "Sky Warriors", "Cloud Nine", "Eclipse Gaming", "Nebula Squad",
      "Galaxy Defenders", "Cosmic Force", "Stellar Knights", "Astro Gaming", "Meteor Strike", "Comet Chasers",
      "Rocket Squad", "Orbit Gaming", "Gravity Force", "Quantum Legends", "Atomic Warriors", "Nuclear Gaming",
      "Fusion Force", "Plasma Squad", "Energy Elite", "Power Rangers", "Mega Force", "Ultra Gaming"
    ];

    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: teamNames[i] || `Team ${i + 1}`,
      seed: i + 1,
      avatar: i < 3 ? `https://images.unsplash.com/photo-${1571169186019 + i * 1000}?w=100` : undefined
    }));
  };

  const teams = useMemo(() => generateTeams(bracketSize), [bracketSize]);

  // Generate team members
  const generateTeamMembers = (teamId: number) => {
    const team = teams.find(t => t.id === teamId);

    // If this is the user's registered team, use their data
    if (isRegistered && team && team.name === registeredTeamName && registeredTeamMembers.length === 5) {
      const ranks = ['Diamond I', 'Platinum II', 'Platinum I', 'Diamond III', 'Platinum III'];
      return registeredTeamMembers.map((memberName, index) => ({
        id: teamId * 100 + index,
        name: memberName,
        role: registeredTeamRoles[index] || 'Top',
        rank: ranks[index],
        level: Math.floor(Math.random() * 200) + 100
      }));
    }

    // Otherwise generate mock data
    const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];
    const ranks = ['Diamond I', 'Platinum II', 'Platinum I', 'Diamond III', 'Platinum III'];
    const playerNames = [
      'ShadowStrike', 'DragonSlayer', 'PhoenixFire', 'ThunderBolt', 'IceBreaker',
      'StormRider', 'NightHawk', 'BloodMoon', 'VoidWalker', 'StarGazer'
    ];
    const tags = ['EUW', 'EUNE', 'NA', 'KR', 'BR'];

    return roles.map((role, index) => ({
      id: teamId * 100 + index,
      name: `${playerNames[(teamId + index) % playerNames.length]}#${tags[index]}`,
      role,
      rank: ranks[index],
      level: Math.floor(Math.random() * 200) + 100
    }));
  };

  const [approvedTeams, setApprovedTeams] = useState<Set<number>>(() => new Set(generateTeams(32).slice(0, 5).map(t => t.id)));
  const [disqualifiedTeams, setDisqualifiedTeams] = useState<Set<number>>(new Set());

  // Update approved teams when bracket size changes
  useEffect(() => {
    setApprovedTeams(new Set(teams.slice(0, 5).map(t => t.id)));
    setDisqualifiedTeams(new Set());
  }, [bracketSize, teams]);

  // Generate bracket dynamically based on team count
  const createBracket = (): Match[] => {
    const bracket: Match[] = [];
    const numTeams = teams.length;
    const totalRounds = Math.log2(numTeams);

    let matchId = 1;

    // Round 1 - Initial matches
    const round1Matches = numTeams / 2;
    for (let i = 0; i < round1Matches; i++) {
      bracket.push({
        id: matchId++,
        round: 1,
        position: i,
        team1: teams[i * 2],
        team2: teams[i * 2 + 1],
        bracket: 'main'
      });
    }

    // Subsequent rounds - placeholder matches
    for (let round = 2; round <= totalRounds; round++) {
      const matchesInRound = numTeams / Math.pow(2, round);
      for (let i = 0; i < matchesInRound; i++) {
        bracket.push({
          id: matchId++,
          round: round,
          position: i,
          bracket: 'main'
        });
      }
    }

    return bracket;
  };

  const [bracketMatches, setBracketMatches] = useState<Match[]>(() => createBracket());
  const [declareMatchId, setDeclareMatchId] = useState<number | null>(null);

  const bracket = bracketMatches;
  const maxRound = Math.max(...bracket.map(m => m.round));

  const handleDeclareMatchWinner = (matchId: number, winnerId: number) => {
    setBracketMatches(prev => {
      const updated = prev.map(m => m.id === matchId ? { ...m, winner: winnerId } : m);
      // Advance winner to next round
      const match = prev.find(m => m.id === matchId)!;
      const winnerTeam = winnerId === match.team1?.id ? match.team1 : match.team2;
      if (!winnerTeam) return updated;

      // Find the next round match for this position
      const nextRound = match.round + 1;
      const nextPosition = Math.floor(match.position / 2);
      const slot = match.position % 2 === 0 ? 'team1' : 'team2';

      const result = updated.map(m => {
        if (m.round === nextRound && m.position === nextPosition) {
          return { ...m, [slot]: winnerTeam };
        }
        return m;
      });

      // If this was the final match, trigger prize payout
      if (match.round === maxRound && onTournamentWin) {
        const prizePerPlayer = Math.floor(tournament.prize * 0.5 / 5);
        onTournamentWin(prizePerPlayer, tournament.name);
      }

      return result;
    });
    setDeclareMatchId(null);
  };

  const getMatchesByRound = (round: number) => {
    return bracket.filter(m => m.round === round).sort((a, b) => a.position - b.position);
  };

  const getRoundName = (round: number) => {
    const matchesInRound = getMatchesByRound(round).length;
    if (round === maxRound) return 'Finals';
    if (round === maxRound - 1) return 'Semi Finals';
    if (round === maxRound - 2) return 'Quarter Finals';
    return `Round ${round}`;
  };

  const renderTeamLogo = (team: Team, size: 'small' | 'medium' | 'large') => {
    const sizeClasses = {
      small: 'w-6 h-6 text-[10px]',
      medium: 'w-12 h-12 text-lg',
      large: 'w-16 h-16 text-2xl'
    };

    if (team.avatar) {
      return <img src={team.avatar} alt={team.name} className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`} />;
    }

    return (
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className={`text-white font-bold ${size === 'small' ? 'text-[10px]' : size === 'medium' ? 'text-lg' : 'text-2xl'}`}>
          {team.name[0]}
        </span>
      </div>
    );
  };

  const handleRegisterTeam = () => {
    if (!teamName.trim()) {
      alert('Please enter a team name');
      return;
    }

    if (tournament.teamSize === '5v5') {
      const filledMembers = teamMembers.filter(m => m.trim());
      if (filledMembers.length < 5) {
        alert('Please add all 5 team members for 5v5 tournament');
        return;
      }
    }

    // Save registration data
    setRegisteredTeamName(teamName);
    setRegisteredTeamMembers([...teamMembers]);
    setRegisteredTeamRoles([...teamRoles]);
    setIsRegistered(true);
    setIsRegisterModalOpen(false);
    setIsEditMode(false);

    if (isEditMode) {
      alert(`Team "${teamName}" successfully updated! ✏️`);
    } else {
      alert(`Team "${teamName}" successfully registered for the tournament! 🎉`);
    }
  };

  const openEditModal = () => {
    setTeamName(registeredTeamName);
    setTeamMembers([...registeredTeamMembers]);
    setTeamRoles([...registeredTeamRoles]);
    setIsEditMode(true);
    setIsRegisterModalOpen(true);
  };

  const openRegisterModal = () => {
    setTeamName('');
    setTeamMembers(['', '', '', '', '']);
    setTeamRoles(['Top', 'Jungle', 'Mid', 'ADC', 'Support']);
    setIsEditMode(false);
    setIsRegisterModalOpen(true);
  };

  const fillDemoData = () => {
    setTeamName('Shadow Legends');
    setTeamMembers([
      'Player1#EUW',
      'Player2#EUW',
      'Player3#EUW',
      'Player4#EUW',
      'Player5#EUW'
    ]);
  };

  const handleStartTournament = () => {
    if (tournamentStatus !== 'registration') {
      alert('Tournament has already started or is completed!');
      return;
    }
    if (tournament.registeredTeams < 4) {
      alert('You need at least 4 teams to start the tournament!');
      return;
    }
    const confirmed = confirm('Are you sure you want to start the tournament? This will close registration and generate the bracket.');
    if (confirmed) {
      setTournamentStatus('ongoing');
      setRegistrationClosed(true);
      setActiveTab('bracket');
      alert('🎮 Tournament started! Bracket has been generated. Good luck to all teams!');
    }
  };

  const handleCloseRegistration = () => {
    if (registrationClosed) {
      alert('Registration is already closed!');
      return;
    }
    const confirmed = confirm('Close registration? No more teams will be able to register.');
    if (confirmed) {
      setRegistrationClosed(true);
      alert('✓ Registration closed. Current teams: ' + tournament.registeredTeams);
    }
  };

  const handleDeclareWinner = () => {
    if (tournamentStatus === 'completed') {
      alert('Tournament already has a declared winner!');
      return;
    }
    setIsDeclareWinnerOpen(true);
  };

  const confirmWinner = () => {
    if (!selectedWinner) {
      alert('Please select a winning team!');
      return;
    }
    const winningTeam = teams.find(t => t.id === selectedWinner);
    setTournamentStatus('completed');
    setIsDeclareWinnerOpen(false);
    alert(`🏆 Congratulations to ${winningTeam?.name}! Tournament completed successfully!\n\nPrize distribution will be processed shortly.`);
  };

  const handleCancelTournament = () => {
    const confirmed = confirm('⚠️ Are you sure you want to CANCEL this tournament?\n\nThis action cannot be undone. All registrations will be voided and participants will be notified.');
    if (confirmed) {
      const doubleConfirm = confirm('Final confirmation: Cancel tournament "' + tournament.name + '"?');
      if (doubleConfirm) {
        setTournamentStatus('cancelled');
        alert('❌ Tournament cancelled. All participants will be notified and entry fees will be refunded.');
      }
    }
  };

  const handleApproveTeam = (teamId: number) => {
    if (disqualifiedTeams.has(teamId)) {
      alert('This team has been disqualified and cannot be approved.');
      return;
    }

    setApprovedTeams(prev => {
      const newSet = new Set(prev);
      if (newSet.has(teamId)) {
        newSet.delete(teamId);
        return newSet;
      } else {
        newSet.add(teamId);
        return newSet;
      }
    });
  };

  const handleDisqualifyTeam = (teamId: number, teamName: string) => {
    const confirmed = confirm(`⚠️ Disqualify "${teamName}"?\n\nThis team will be removed from the tournament and cannot participate.`);
    if (confirmed) {
      setDisqualifiedTeams(prev => new Set(prev).add(teamId));
      setApprovedTeams(prev => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });
      alert(`❌ Team "${teamName}" has been disqualified from the tournament.`);
    }
  };

  const handleUndoDisqualify = (teamId: number, teamName: string) => {
    const confirmed = confirm(`Restore "${teamName}" to the tournament?`);
    if (confirmed) {
      setDisqualifiedTeams(prev => {
        const newSet = new Set(prev);
        newSet.delete(teamId);
        return newSet;
      });
      alert(`✓ Team "${teamName}" has been restored to the tournament.`);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim() || selectedMatchId === null) return;

    const match = bracket.find(m => m.id === selectedMatchId);
    if (!match) return;

    const newMessage = {
      sender: userName || 'Anonymous',
      message: chatMessage,
      timestamp: new Date()
    };

    setMatchChats(prev => ({
      ...prev,
      [selectedMatchId]: [...(prev[selectedMatchId] || []), newMessage]
    }));

    setChatMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[9999] p-3 sm:p-4">
      <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden border border-[#00d4ff]/20 shadow-2xl shadow-[#00d4ff]/10">
        {/* Header with Banner */}
        <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden">
          <img 
            src={tournament.banner} 
            alt={tournament.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#151821] via-[#151821]/80 to-transparent"></div>
          
          <button
            onClick={onClose}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 right-3 sm:right-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{tournament.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    {tournament.organizerAvatar && (
                      <img 
                        src={tournament.organizerAvatar} 
                        alt={tournament.organizer}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="text-white/70 text-sm">by {tournament.organizer}</span>
                  </div>
                  <span className="text-white/30">•</span>
                  <span className="px-2 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded text-xs border border-[#00d4ff]/30">
                    Registration Open
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 sm:px-6 py-2 sm:py-3 rounded-xl shadow-lg shadow-yellow-500/30">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                <div>
                  <p className="text-white/80 text-xs">Prize Pool</p>
                  <p className="text-white font-bold text-xl sm:text-2xl">€{tournament.prize.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5 px-3 sm:px-4 md:px-6 bg-[#0a0e1a]/30 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {(['overview', 'bracket', 'teams', 'rules', ...((isOrganizer || canModerateTournaments) ? ['manage' as const] : [])] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200 relative ${
                  activeTab === tab
                    ? 'text-[#00d4ff]'
                    : 'text-white/50 hover:text-white/70'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'manage' && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">OWNER</span>
                )}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4ff]"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-300px)]">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-[#00d4ff]" />
                    <span className="text-white/50 text-sm">Start Date</span>
                  </div>
                  <p className="text-white font-medium">
                    {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-white/50 text-sm">Format</span>
                  </div>
                  <p className="text-white font-medium">{tournament.format}</p>
                </div>

                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-white/50 text-sm">Teams</span>
                  </div>
                  <p className="text-white font-medium">{tournament.registeredTeams}/{tournament.maxTeams}</p>
                </div>

                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/50 text-sm">Region</span>
                  </div>
                  <p className="text-white font-medium">{tournament.region}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 sm:p-6 border border-white/5">
                <h3 className="text-white font-bold text-lg mb-3">About Tournament</h3>
                <p className="text-white/70 leading-relaxed">{tournament.description}</p>
              </div>

              {/* Requirements & Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 sm:p-6 border border-white/5">
                  <h3 className="text-white font-bold text-lg mb-4">Requirements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-[#00d4ff]" />
                      <div>
                        <p className="text-white/50 text-xs">Rank Requirement</p>
                        <p className="text-white font-medium">{tournament.rankRequirement}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-white/50 text-xs">Team Size</p>
                        <p className="text-white font-medium">{tournament.teamSize}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 sm:p-6 border border-white/5">
                  <h3 className="text-white font-bold text-lg mb-4">Prize Distribution</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-400" />
                        <span className="text-white text-sm">1st Place</span>
                      </div>
                      <span className="text-green-400 font-bold">€{(tournament.prize * 0.5).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Medal className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">2nd Place</span>
                      </div>
                      <span className="text-green-400 font-bold">€{(tournament.prize * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Medal className="w-4 h-4 text-amber-600" />
                        <span className="text-white text-sm">3rd Place</span>
                      </div>
                      <span className="text-green-400 font-bold">€{(tournament.prize * 0.2).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Register/Edit Button */}
              {isRegistered ? (
                <div className="space-y-3">
                  <div className="bg-green-600/10 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">✓</span>
                      </div>
                      <div>
                        <p className="text-green-400 font-bold">Team Registered</p>
                        <p className="text-white/60 text-sm">{registeredTeamName}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={openEditModal}
                    className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:shadow-lg hover:shadow-purple-600/30"
                  >
                    ✏️ Edit Team
                  </button>
                </div>
              ) : tournamentStatus === 'completed' || tournamentStatus === 'cancelled' || tournamentStatus === 'ongoing' ? (
                <div className="w-full py-4 rounded-xl text-center bg-white/5 border border-white/10">
                  <p className="text-white/40 font-bold text-lg">
                    {tournamentStatus === 'completed' ? '🏆 Turneu încheiat — Înregistrările sunt închise' : tournamentStatus === 'ongoing' ? '🎮 Turneu în desfășurare — Înregistrările sunt închise' : '❌ Turneu anulat'}
                  </p>
                </div>
              ) : registrationClosed ? (
                <div className="w-full py-4 rounded-xl text-center bg-white/5 border border-white/10">
                  <p className="text-white/40 font-bold text-lg">🔒 Înregistrările sunt închise</p>
                </div>
              ) : (
                <button
                  onClick={openRegisterModal}
                  className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 bg-gradient-to-r from-[#00d4ff] to-[#00a3cc] text-white hover:shadow-lg hover:shadow-[#00d4ff]/30"
                >
                  Register Your Team
                </button>
              )}
            </div>
          )}

          {/* Bracket Tab */}
          {activeTab === 'bracket' && (
            <div className="space-y-6">
              <div className="bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-lg p-4 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-white/70 text-sm">
                      <strong className="text-[#00d4ff]">Tournament Format:</strong> {tournament.format}
                    </p>
                    <p className="text-white/50 text-xs mt-1">
                      {bracketSize} teams, {Math.log2(bracketSize)} rounds total
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-white font-bold text-2xl">{bracketSize}</p>
                    <p className="text-white/50 text-xs">Teams</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-400 text-xs">
                  💡 Scroll horizontally to view all rounds. Bracket shows {Math.log2(bracketSize)} rounds from Round 1 to Finals.
                </p>
              </div>

              {/* Bracket Visualization */}
              <div className="overflow-x-auto bg-[#0a0e1a]/30 rounded-xl p-3 sm:p-4">
                <div className="min-w-max flex gap-8 p-4">
                  {[...Array(maxRound)].map((_, roundIndex) => {
                    const round = roundIndex + 1;
                    const matches = getMatchesByRound(round);
                    const matchHeight = bracketSize <= 16 ? 140 : 100;

                    return (
                      <div key={round} className="flex flex-col justify-around" style={{ minHeight: `${matches.length * matchHeight}px` }}>
                        <div className="text-center mb-4 sticky top-0 bg-[#0a0e1a] z-10 py-2 rounded-lg">
                          <h3 className="text-white font-bold text-sm">{getRoundName(round)}</h3>
                          <p className="text-white/50 text-[10px]">Bo{round === maxRound ? '5' : '3'}</p>
                        </div>

                        <div className="flex flex-col justify-around flex-1" style={{ gap: `${bracketSize <= 16 ? '16px' : '8px'}` }}>
                          {matches.map((match) => {
                            const isCompact = bracketSize > 16;
                            return (
                            <div
                              key={match.id}
                              className={`bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-lg border border-white/10 overflow-hidden ${isCompact ? 'min-w-[200px]' : 'min-w-[280px]'}`}
                            >
                              {/* Team 1 */}
                              <div className={`${isCompact ? 'p-2' : 'p-3'} flex items-center justify-between ${match.winner === match.team1?.id ? 'bg-[#00d4ff]/10 border-l-4 border-[#00d4ff]' : ''} ${match.team1 ? 'cursor-pointer hover:bg-white/5 transition-colors' : ''}`}
                                onClick={() => match.team1 && setSelectedTeamId(match.team1.id)}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {match.team1 ? (
                                    <>
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-white font-medium truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>{match.team1.name}</p>
                                        {!isCompact && <p className="text-white/40 text-[10px]">#{match.team1.seed}</p>}
                                      </div>
                                      {match.team1.score !== undefined && (
                                        <span className={`text-white font-bold ${isCompact ? 'text-sm' : 'text-lg'}`}>{match.team1.score}</span>
                                      )}
                                    </>
                                  ) : (
                                    <span className={`text-white/30 ${isCompact ? 'text-xs' : 'text-sm'}`}>TBD</span>
                                  )}
                                </div>
                              </div>

                              <div className="h-px bg-white/5"></div>

                              {/* Team 2 */}
                              <div className={`${isCompact ? 'p-2' : 'p-3'} flex items-center justify-between ${match.winner === match.team2?.id ? 'bg-[#00d4ff]/10 border-l-4 border-[#00d4ff]' : ''} ${match.team2 ? 'cursor-pointer hover:bg-white/5 transition-colors' : ''}`}
                                onClick={() => match.team2 && setSelectedTeamId(match.team2.id)}
                              >
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                  {match.team2 ? (
                                    <>
                                      <div className="flex-1 min-w-0">
                                        <p className={`text-white font-medium truncate ${isCompact ? 'text-xs' : 'text-sm'}`}>{match.team2.name}</p>
                                        {!isCompact && <p className="text-white/40 text-[10px]">#{match.team2.seed}</p>}
                                      </div>
                                      {match.team2.score !== undefined && (
                                        <span className={`text-white font-bold ${isCompact ? 'text-sm' : 'text-lg'}`}>{match.team2.score}</span>
                                      )}
                                    </>
                                  ) : (
                                    <span className={`text-white/30 ${isCompact ? 'text-xs' : 'text-sm'}`}>TBD</span>
                                  )}
                                </div>
                              </div>

                              {/* Declare Winner - visible when both teams present and no winner yet */}
                              {match.team1 && match.team2 && !match.winner && (
                                <div className="border-t border-white/5 p-2 bg-[#0a0e1a]/30">
                                  <button
                                    onClick={() => setDeclareMatchId(match.id)}
                                    className="w-full px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 border border-yellow-500/30"
                                  >
                                    <Crown className="w-3 h-3" />
                                    Declară Câștigător
                                  </button>
                                </div>
                              )}
                              {/* Winner badge */}
                              {match.winner && (
                                <div className="border-t border-white/5 p-2 bg-green-500/5">
                                  <p className="text-center text-green-400 text-xs font-bold">
                                    ✓ {(match.winner === match.team1?.id ? match.team1 : match.team2)?.name} a câștigat
                                  </p>
                                </div>
                              )}
                              {/* Chat Button - Only visible to participating teams */}
                              {match.team1 && match.team2 && isRegistered &&
                               (registeredTeamName === match.team1.name || registeredTeamName === match.team2.name) && (
                                <div className="border-t border-white/5 p-2 bg-[#0a0e1a]/30">
                                  <button
                                    onClick={() => {
                                      setSelectedMatchId(match.id);
                                      setIsChatOpen(true);
                                    }}
                                    className="w-full px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors text-xs flex items-center justify-center gap-2 border border-blue-500/30"
                                  >
                                    <MessageCircle className="w-3 h-3" />
                                    Team Chat
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-6">
                <h3 className="text-white font-bold text-xl">Registered Teams ({teams.length}/{tournament.maxTeams})</h3>
                <div className="text-white/50 text-sm">
                  {tournament.maxTeams - teams.length} spots remaining
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeamId(team.id)}
                    className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5 hover:border-[#00d4ff]/30 transition-all duration-300 cursor-pointer hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-white font-medium">{team.name}</p>
                        <p className="text-white/50 text-sm">Seed #{team.seed}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <h3 className="text-white font-bold text-xl mb-6">Tournament Rules</h3>
              
              <div className="space-y-3">
                {tournament.rules.map((rule, index) => (
                  <div 
                    key={index}
                    className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-lg p-4 border border-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#00d4ff]/20 text-[#00d4ff] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-white/80 flex-1">{rule}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-medium mb-1">Fair Play Policy</p>
                    <p className="text-white/60 text-sm">
                      All participants are expected to follow the Summoner's Code and demonstrate good sportsmanship. 
                      Any violations may result in disqualification without prize compensation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Manage Tab (Owner Only) */}
          {activeTab === 'manage' && (isOrganizer || canModerateTournaments) && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Tournament Management</h3>
                </div>
                <p className="text-white/60 mb-4">
                  {canModerateTournaments && !isOrganizer
                    ? 'Ai permisiunea de moderare turnee. Poți opri înregistrările, declara câștigători și gestiona bracket-ul complet.'
                    : 'You are the organizer of this tournament. Use this panel to manage registrations, generate brackets, and update match results.'
                  }
                </p>

                {/* Bracket Size Selector */}
                <div className="bg-[#0a0e1a]/50 rounded-lg p-4 border border-white/10">
                  <label className="block text-white font-medium mb-3">Bracket Size (Demo)</label>
                  <div className="flex flex-wrap gap-2">
                    {([8, 16, 32, 64] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setBracketSize(size)}
                        className={`flex-1 min-w-[70px] px-2 sm:px-4 py-2 rounded-lg font-bold text-sm sm:text-base transition-all ${
                          bracketSize === size
                            ? 'bg-[#00d4ff] text-white'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {size} Teams
                      </button>
                    ))}
                  </div>
                  <p className="text-white/40 text-xs mt-2">Change bracket size to see different tournament scales</p>
                </div>
              </div>

              {/* Tournament Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-green-400" />
                    <span className="text-white/50 text-sm">Registered</span>
                  </div>
                  <p className="text-white font-bold text-2xl">{tournament.registeredTeams} / {tournament.maxTeams}</p>
                </div>

                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <span className="text-white/50 text-sm">Status</span>
                  </div>
                  <p className={`font-bold text-lg capitalize ${
                    tournamentStatus === 'cancelled' ? 'text-red-400' :
                    tournamentStatus === 'completed' ? 'text-green-400' :
                    tournamentStatus === 'ongoing' ? 'text-blue-400' :
                    'text-yellow-400'
                  }`}>{tournamentStatus}</p>
                </div>

                <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="w-5 h-5 text-yellow-400" />
                    <span className="text-white/50 text-sm">Prize Pool</span>
                  </div>
                  <p className="text-white font-bold text-2xl">€{tournament.prize.toLocaleString()}</p>
                </div>
              </div>

              {/* Registered Teams Management */}
              <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 sm:p-6 border border-white/5">
                <h4 className="text-white font-bold text-lg mb-4">Registered Teams</h4>
                <div className="space-y-3">
                  {teams.slice(0, 5).map((team, index) => {
                    const isApproved = approvedTeams.has(team.id);
                    const isDisqualified = disqualifiedTeams.has(team.id);

                    return (
                      <div key={team.id} className={`bg-[#0a0e1a]/50 rounded-lg p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isDisqualified ? 'border-red-500/30 opacity-60' : 'border-white/5'
                      }`}>
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff]/20 to-purple-500/20 rounded-full flex items-center justify-center">
                            <span className="text-[#00d4ff] font-bold">#{index + 1}</span>
                          </div>
                          {team.avatar && (
                            <img src={team.avatar} alt={team.name} className="w-10 h-10 rounded-full object-cover" />
                          )}
                          <div>
                            <p className={`font-medium ${isDisqualified ? 'text-white/40 line-through' : 'text-white'}`}>
                              {team.name}
                            </p>
                            <p className="text-white/50 text-sm">Seed #{team.seed}</p>
                          </div>
                          {isDisqualified && (
                            <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded border border-red-500/30">
                              Disqualified
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          {!isDisqualified && (
                            <button
                              onClick={() => handleApproveTeam(team.id)}
                              className={`flex-1 sm:flex-initial text-center px-4 py-2 rounded-lg transition-colors text-sm border ${
                                isApproved
                                  ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-500/30'
                                  : 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/30'
                              }`}
                            >
                              {isApproved ? '✓ Approved' : 'Approve'}
                            </button>
                          )}
                          {!isDisqualified ? (
                            <button
                              onClick={() => handleDisqualifyTeam(team.id, team.name)}
                              className="flex-1 sm:flex-initial text-center px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors text-sm border border-red-500/30"
                            >
                              Disqualify
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUndoDisqualify(team.id, team.name)}
                              className="flex-1 sm:flex-initial text-center px-4 py-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 rounded-lg transition-colors text-sm border border-yellow-500/30"
                            >
                              Undo Disqualification
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setActiveTab('bracket')}
                  className="px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#00d4ff] to-[#00a3cc] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#00d4ff]/30 transition-all flex items-center justify-center gap-2"
                >
                  <Target className="w-5 h-5" />
                  Generate Bracket
                </button>
                <button className="px-3 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-purple-600/30 transition-all flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  Export Results
                </button>
              </div>

              {/* Tournament Status Badge */}
              <div className={`rounded-xl p-4 border ${
                tournamentStatus === 'cancelled' ? 'bg-red-500/10 border-red-500/30' :
                tournamentStatus === 'completed' ? 'bg-green-500/10 border-green-500/30' :
                tournamentStatus === 'ongoing' ? 'bg-blue-500/10 border-blue-500/30' :
                'bg-yellow-500/10 border-yellow-500/30'
              }`}>
                <p className="text-white/60 text-sm mb-1">Tournament Status:</p>
                <p className={`font-bold text-lg capitalize ${
                  tournamentStatus === 'cancelled' ? 'text-red-400' :
                  tournamentStatus === 'completed' ? 'text-green-400' :
                  tournamentStatus === 'ongoing' ? 'text-blue-400' :
                  'text-yellow-400'
                }`}>
                  {tournamentStatus === 'registration' && registrationClosed ? 'Registration Closed - Ready to Start' : tournamentStatus}
                </p>
              </div>

              {/* Update Match Results */}
              <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 sm:p-6 border border-white/5">
                <h4 className="text-white font-bold text-lg mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleStartTournament}
                    disabled={tournamentStatus !== 'registration'}
                    className={`px-4 py-3 rounded-lg transition-colors text-sm border flex items-center justify-center gap-2 ${
                      tournamentStatus === 'registration'
                        ? 'bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border-yellow-500/30 cursor-pointer'
                        : 'bg-gray-600/10 text-gray-600 border-gray-600/20 cursor-not-allowed'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    {tournamentStatus === 'registration' ? 'Start Tournament' : 'Already Started'}
                  </button>
                  <button
                    onClick={handleCloseRegistration}
                    disabled={registrationClosed || tournamentStatus !== 'registration'}
                    className={`px-4 py-3 rounded-lg transition-colors text-sm border flex items-center justify-center gap-2 ${
                      !registrationClosed && tournamentStatus === 'registration'
                        ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-500/30 cursor-pointer'
                        : 'bg-gray-600/10 text-gray-600 border-gray-600/20 cursor-not-allowed'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    {registrationClosed ? 'Registration Closed' : 'Close Registration'}
                  </button>
                  <button
                    onClick={handleDeclareWinner}
                    disabled={tournamentStatus === 'completed' || tournamentStatus === 'cancelled'}
                    className={`px-4 py-3 rounded-lg transition-colors text-sm border flex items-center justify-center gap-2 ${
                      tournamentStatus !== 'completed' && tournamentStatus !== 'cancelled'
                        ? 'bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-500/30 cursor-pointer'
                        : 'bg-gray-600/10 text-gray-600 border-gray-600/20 cursor-not-allowed'
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    {tournamentStatus === 'completed' ? 'Winner Declared' : 'Declare Winner'}
                  </button>
                  <button
                    onClick={handleCancelTournament}
                    disabled={tournamentStatus === 'cancelled' || tournamentStatus === 'completed'}
                    className={`px-4 py-3 rounded-lg transition-colors text-sm border flex items-center justify-center gap-2 ${
                      tournamentStatus !== 'cancelled' && tournamentStatus !== 'completed'
                        ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30 cursor-pointer'
                        : 'bg-gray-600/10 text-gray-600 border-gray-600/20 cursor-not-allowed'
                    }`}
                  >
                    <X className="w-4 h-4" />
                    {tournamentStatus === 'cancelled' ? 'Tournament Cancelled' : 'Cancel Tournament'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[99999] p-3 sm:p-4">
          <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-2xl border border-[#00d4ff]/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-white/10 sticky top-0 bg-gradient-to-br from-[#1a1d29] to-[#151821] z-10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-[#00d4ff]/20 rounded-lg flex-shrink-0">
                    <Trophy className="w-6 h-6 text-[#00d4ff]" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      {isEditMode ? 'Update Team' : 'Register Team'}
                    </h2>
                    <p className="text-white/60 text-sm truncate">
                      {isEditMode ? 'Edit your team details for' : 'Create your team for'} {tournament.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsRegisterModalOpen(false);
                    setIsEditMode(false);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="p-3 sm:p-4 md:p-6 space-y-6">
              {/* Demo Fill Button - Only show in register mode */}
              {!isEditMode && (
                <button
                  onClick={fillDemoData}
                  className="w-full px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded-lg transition-colors text-sm border border-purple-500/30"
                >
                  🎮 Fill with Demo Data (for testing)
                </button>
              )}

              {/* Team Name */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name..."
                  className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/50"
                />
              </div>

              {/* Team Members (5v5 only) */}
              {tournament.teamSize === '5v5' && (
                <div>
                  <label className="block text-white font-medium mb-2">
                    Team Members * (5 players required)
                  </label>

                  {/* Important Notice */}
                  <div className="mb-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                    <p className="text-yellow-400 text-sm font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      Important: Use exact in-game names
                    </p>
                    <p className="text-yellow-300/80 text-xs mt-1">
                      Names must match your Riot ID format: <strong>Username#TAG</strong> (e.g., Evelynn#EUW)
                    </p>
                  </div>

                  <div className="space-y-3">
                    {teamMembers.map((member, index) => {
                      const roles = ['Top', 'Jungle', 'Mid', 'ADC', 'Support'];

                      return (
                        <div key={index} className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#00d4ff]/20 text-[#00d4ff] rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="w-14 sm:w-20 flex-shrink-0">
                            <span className="text-white/60 text-xs sm:text-sm font-medium">{roles[index]}</span>
                          </div>
                          <input
                            type="text"
                            value={member}
                            onChange={(e) => {
                              const newMembers = [...teamMembers];
                              newMembers[index] = e.target.value;
                              setTeamMembers(newMembers);
                            }}
                            placeholder={`${roles[index]} player (e.g., PlayerName#TAG)`}
                            className="flex-1 min-w-0 bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/50"
                          />
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-white/40 text-sm mt-3">
                    All players must meet the {tournament.rankRequirement} requirement
                  </p>
                </div>
              )}

              {/* Tournament Info */}
              <div className="bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-lg p-4">
                <p className="text-white/80 text-sm mb-2">
                  <strong>Tournament Details:</strong>
                </p>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>• Format: {tournament.format}</li>
                  <li>• Team Size: {tournament.teamSize}</li>
                  <li>• Rank Requirement: {tournament.rankRequirement}</li>
                  <li>• Registration Deadline: {new Date(tournament.registrationDeadline).toLocaleDateString()}</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsRegisterModalOpen(false);
                    setIsEditMode(false);
                  }}
                  className="flex-1 px-4 sm:px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegisterTeam}
                  className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all ${
                    isEditMode
                      ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:shadow-purple-600/30'
                      : 'bg-gradient-to-r from-[#00d4ff] to-[#00a3cc] text-white hover:shadow-[#00d4ff]/30'
                  }`}
                >
                  {isEditMode ? 'Update Team' : 'Register Team'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Declare Winner Modal */}
      {isDeclareWinnerOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[99999] p-3 sm:p-4">
          <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-2xl border border-green-500/20 shadow-2xl">
            {/* Header */}
            <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-green-500/20 rounded-lg flex-shrink-0">
                    <Trophy className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Declare Tournament Winner</h2>
                    <p className="text-white/60 text-sm">Select the winning team and finalize the tournament</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsDeclareWinnerOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-6 h-6 text-white/60" />
                </button>
              </div>
            </div>

            {/* Team Selection */}
            <div className="p-3 sm:p-4 md:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-white/80 mb-4">Select the winning team:</p>
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedWinner(team.id)}
                  className={`w-full p-3 sm:p-4 rounded-xl border-2 transition-all text-left ${
                    selectedWinner === team.id
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-white/10 bg-[#0a0e1a]/50 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedWinner === team.id && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {team.avatar && (
                      <img src={team.avatar} alt={team.name} className="w-12 h-12 rounded-full object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold text-base sm:text-lg truncate">{team.name}</p>
                      <p className="text-white/50 text-sm">Seed #{team.seed}</p>
                    </div>
                    {selectedWinner === team.id && (
                      <div className="px-3 py-1 bg-green-500 rounded-lg flex-shrink-0">
                        <span className="text-white text-xs font-bold">WINNER</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Prize Distribution Info */}
            <div className="p-3 sm:p-4 md:p-6 border-t border-white/10">
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                <p className="text-yellow-400 text-sm font-medium mb-2">Prize Distribution:</p>
                <ul className="text-white/60 text-sm space-y-1">
                  <li>🥇 1st Place: €{(tournament.prize * 0.5).toLocaleString()} (50%)</li>
                  <li>🥈 2nd Place: €{(tournament.prize * 0.3).toLocaleString()} (30%)</li>
                  <li>🥉 3rd/4th Place: €{(tournament.prize * 0.1).toLocaleString()} each (10%)</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeclareWinnerOpen(false)}
                  className="flex-1 px-4 sm:px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmWinner}
                  disabled={!selectedWinner}
                  className={`flex-1 px-4 sm:px-6 py-3 rounded-lg font-bold transition-all ${
                    selectedWinner
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-500/30'
                      : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Confirm Winner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Details Modal */}
      {selectedTeamId !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[99999] p-3 sm:p-4">
          <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-2xl border border-[#00d4ff]/20 shadow-2xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const team = teams.find(t => t.id === selectedTeamId);
              const members = generateTeamMembers(selectedTeamId);

              if (!team) return null;

              return (
                <>
                  {/* Header */}
                  <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="min-w-0">
                          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white truncate">{team.name}</h2>
                          <p className="text-white/60 text-sm">Seed #{team.seed}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTeamId(null)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-6 h-6 text-white/60" />
                      </button>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="p-4 sm:p-6">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#00d4ff]" />
                      Team Roster
                    </h3>
                    <div className="space-y-3">
                      {members.map((member, index) => {
                        const isOwner = index === 0;
                        return (
                          <div
                            key={member.id}
                            className={`bg-[#0a0e1a]/50 rounded-lg border transition-all ${
                              isOwner ? 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/5 to-transparent p-2.5 sm:p-3' : 'border-white/5 hover:border-[#00d4ff]/20 p-3 sm:p-4'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  isOwner ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' : 'bg-gradient-to-br from-[#00d4ff]/20 to-purple-500/20'
                                }`}>
                                  <span className={`font-bold ${isOwner ? 'text-yellow-400 text-sm' : 'text-[#00d4ff] text-lg'}`}>{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center flex-wrap">
                                    <p className={`text-white font-medium truncate max-w-[140px] sm:max-w-none ${isOwner ? 'text-sm sm:text-base' : 'text-base sm:text-lg'}`}>{member.name}</p>
                                    {isOwner && (
                                      <div className="relative group -ml-8 sm:-ml-10 md:-ml-14">
                                        <img src={ownerCrownIcon} alt="Owner" className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain -my-5 sm:-my-7 md:-my-10" />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-500/90 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold z-10">
                                          Team Owner
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-white/50 text-sm">{member.role}</p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-[#00d4ff] font-bold">{member.rank}</p>
                                <p className="text-white/40 text-sm">Level {member.level}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Team Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-500/20 rounded-lg p-3 sm:p-4 text-center">
                        <p className="text-blue-400 text-lg sm:text-2xl font-bold">5</p>
                        <p className="text-white/60 text-xs sm:text-sm">Members</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-600/10 to-purple-800/10 border border-purple-500/20 rounded-lg p-3 sm:p-4 text-center">
                        <p className="text-purple-400 text-lg sm:text-2xl font-bold">Platinum+</p>
                        <p className="text-white/60 text-xs sm:text-sm">Avg Rank</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-500/20 rounded-lg p-3 sm:p-4 text-center">
                        <p className="text-green-400 text-lg sm:text-2xl font-bold">#{team.seed}</p>
                        <p className="text-white/60 text-xs sm:text-sm">Seed</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-3 sm:p-4 md:p-6 border-t border-white/10">
                    <button
                      onClick={() => setSelectedTeamId(null)}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#00d4ff] to-[#00a3cc] text-white rounded-lg font-bold hover:shadow-lg hover:shadow-[#00d4ff]/30 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Match Chat Modal */}
      {isChatOpen && selectedMatchId !== null && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[99999] p-3 sm:p-4">
          <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-2xl border border-[#00d4ff]/20 shadow-2xl max-h-[80vh] flex flex-col">
            {(() => {
              const match = bracket.find(m => m.id === selectedMatchId);
              if (!match || !match.team1 || !match.team2) return null;

              // Check if user is part of one of the teams in this match
              const isParticipant = isRegistered && (
                registeredTeamName === match.team1.name ||
                registeredTeamName === match.team2.name
              );

              if (!isParticipant) {
                return (
                  <>
                    <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-red-500/20 rounded-lg">
                            <X className="w-6 h-6 text-red-400" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-white">Access Denied</h2>
                            <p className="text-white/60 text-sm">Unauthorized</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setIsChatOpen(false);
                            setSelectedMatchId(null);
                          }}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <X className="w-6 h-6 text-white/60" />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 md:p-6 text-center">
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                        <p className="text-red-400 font-medium mb-2">🔒 Private Chat</p>
                        <p className="text-white/60 text-sm">
                          This chat is only accessible to the teams playing in this match:<br/>
                          <strong className="text-white">{match.team1.name}</strong> vs <strong className="text-white">{match.team2.name}</strong>
                        </p>
                      </div>
                    </div>
                  </>
                );
              }

              const messages = matchChats[selectedMatchId] || [];

              return (
                <>
                  {/* Header */}
                  <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
                          <MessageCircle className="w-6 h-6 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="text-xl font-bold text-white">Team Chat</h2>
                          <p className="text-white/60 text-sm truncate">{match.team1.name} vs {match.team2.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsChatOpen(false);
                          setSelectedMatchId(null);
                        }}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-6 h-6 text-white/60" />
                      </button>
                    </div>
                  </div>

                  {/* Info Banner */}
                  <div className="px-3 sm:px-4 md:px-6 pt-4">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-400 text-xs">
                        💬 Use this chat to coordinate with your opponent about lobby creation, game setup, or any delays.
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 space-y-3">
                    {messages.length === 0 ? (
                      <div className="text-center text-white/40 py-12">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm">No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((msg, index) => (
                        <div
                          key={index}
                          className="bg-[#0a0e1a]/50 rounded-lg p-3 border border-white/5"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#00d4ff] font-medium text-sm">{msg.sender}</span>
                            <span className="text-white/40 text-xs">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-white text-sm">{msg.message}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-3 sm:p-4 md:p-6 border-t border-white/10">
                    <div className="flex gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 min-w-0 bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#00d4ff]/50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!chatMessage.trim()}
                        className={`px-4 sm:px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
                          chatMessage.trim()
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/30'
                            : 'bg-gray-600/20 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      {/* Declare Match Winner Modal */}
      {declareMatchId !== null && (() => {
        const match = bracketMatches.find(m => m.id === declareMatchId);
        if (!match || !match.team1 || !match.team2) return null;
        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[99999] p-3 sm:p-4">
            <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-2xl w-full max-w-md border border-yellow-500/30 shadow-2xl">
              <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Crown className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Declară Câștigătorul</h2>
                    <p className="text-white/50 text-sm">{getRoundName(match.round)} — Meciul #{match.id}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 md:p-6 space-y-3">
                <p className="text-white/60 text-sm mb-4">Selectează echipa câștigătoare a acestui meci:</p>

                {[match.team1, match.team2].map(team => (
                  <button
                    key={team.id}
                    onClick={() => handleDeclareMatchWinner(match.id, team.id)}
                    className="w-full flex items-center gap-4 p-4 bg-[#0a0e1a]/60 hover:bg-yellow-500/10 border border-white/10 hover:border-yellow-500/50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-400 font-bold text-sm">{team.name[0]}</span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-white font-bold truncate">{team.name}</p>
                      <p className="text-white/40 text-xs">Seed #{team.seed}</p>
                    </div>
                    <Trophy className="w-5 h-5 text-yellow-400/0 group-hover:text-yellow-400 transition-colors flex-shrink-0" />
                  </button>
                ))}
              </div>

              <div className="p-3 sm:p-4 md:p-6 border-t border-white/10">
                <button
                  onClick={() => setDeclareMatchId(null)}
                  className="w-full px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Anulează
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}