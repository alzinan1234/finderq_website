// @ts-nocheck
'use client'
import React, { useState } from 'react';
import { Trophy, Calendar, Users, DollarSign, Clock, MapPin, ChevronRight, Plus, Filter, Search, Medal, Crown, Swords, Target } from 'lucide-react';
const tournamentBg = '/assets/177a46f56470ddfff1961b8b4fcd7efee7b13642.png';
const teemoTournamentsIcon = '/assets/bad3e7b50eef2663c37644cbb4e2dd7f01819802-3840x2160-removebg-preview.png';

interface Tournament {
  id: number;
  name: string;
  organizer: string;
  organizerAvatar?: string;
  prize: number; // in EUR
  currency: string;
  startDate: string;
  registrationDeadline: string;
  format: 'Single Elimination' | 'Double Elimination';
  teamSize: '1v1' | '5v5';
  maxTeams: number;
  registeredTeams: number;
  status: 'upcoming' | 'registration' | 'ongoing' | 'completed';
  region: 'EUW' | 'EUNE' | 'NA' | 'KR' | 'BR' | 'LAN + LAS' | 'OCE' | 'TR' | 'JP' | 'ME / SEA' | 'All Regions';
  rankRequirement?: string;
  banner?: string;
  rules: string[];
}

interface TournamentsProps {
  onCreateTournament: () => void;
  onViewTournament: (tournamentId: number, status?: string) => void;
}

export function Tournaments({ onCreateTournament, onViewTournament }: TournamentsProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'EUW' | 'EUNE' | 'NA' | 'KR' | 'BR' | 'LAN + LAS' | 'OCE' | 'TR' | 'JP' | 'ME / SEA'>('all');

  // Mock tournaments data
  const tournaments: Tournament[] = [
    {
      id: 1,
      name: "FinderQ Spring Championship 2025",
      organizer: "FinderQ Official",
      organizerAvatar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      prize: 5000,
      currency: "EUR",
      startDate: "2025-04-15",
      registrationDeadline: "2025-04-10",
      format: "Double Elimination",
      teamSize: "5v5",
      maxTeams: 32,
      registeredTeams: 24,
      status: "registration",
      region: "Both",
      rankRequirement: "Platinum+",
      banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=300&fit=crop",
      rules: [
        "All teams must be Platinum rank or higher",
        "Standard competitive draft rules apply",
        "Best of 3 format for all matches",
        "Prize split: 1st: 50%, 2nd: 30%, 3rd: 20%"
      ]
    },
    {
      id: 2,
      name: "EUW Diamond Clash",
      organizer: "ProGamer123",
      organizerAvatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?w=100&h=100&fit=crop",
      prize: 2500,
      currency: "EUR",
      startDate: "2025-04-08",
      registrationDeadline: "2025-04-05",
      format: "Single Elimination",
      teamSize: "5v5",
      maxTeams: 16,
      registeredTeams: 16,
      status: "ongoing",
      region: "EUW",
      rankRequirement: "Diamond+",
      banner: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&h=300&fit=crop",
      rules: [
        "Diamond rank minimum requirement",
        "Single elimination bracket",
        "Best of 5 for finals",
        "All matches streamed live"
      ]
    },
    {
      id: 3,
      name: "EUNE Rising Stars Tournament",
      organizer: "EsportsHub",
      organizerAvatar: "https://images.unsplash.com/photo-1571169186019-18acfb7036bb?w=100&h=100&fit=crop",
      prize: 1000,
      currency: "EUR",
      startDate: "2025-05-01",
      registrationDeadline: "2025-04-25",
      format: "Swiss",
      teamSize: "5v5",
      maxTeams: 24,
      registeredTeams: 12,
      status: "upcoming",
      region: "EUNE",
      rankRequirement: "Gold+",
      banner: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=800&h=300&fit=crop",
      rules: [
        "Open to Gold rank and above",
        "Swiss format - 5 rounds",
        "Top 8 advance to playoffs",
        "Beginner-friendly tournament"
      ]
    },
    {
      id: 4,
      name: "Winter Championship Finals 2024",
      organizer: "FinderQ Official",
      organizerAvatar: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop",
      prize: 10000,
      currency: "EUR",
      startDate: "2024-12-20",
      registrationDeadline: "2024-12-15",
      format: "Double Elimination",
      teamSize: "5v5",
      maxTeams: 32,
      registeredTeams: 32,
      status: "completed",
      region: "Both",
      rankRequirement: "Diamond+",
      banner: "https://images.unsplash.com/photo-1551817958-20932862a998?w=800&h=300&fit=crop",
      rules: [
        "Top tier professional tournament",
        "Diamond+ only",
        "Double elimination bracket",
        "Grand finals Best of 7"
      ]
    }
  ];

  // Filter tournaments
  const filteredTournaments = tournaments.filter(tournament => {
    const matchesTab = activeTab === 'all' || tournament.status === activeTab;
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || tournament.region === selectedRegion || tournament.region === 'All Regions';
    
    return matchesTab && matchesSearch && matchesRegion;
  });

  const getStatusColor = (status: Tournament['status']) => {
    switch (status) {
      case 'registration': return 'bg-[#00d4ff]/10 text-[#00d4ff] border-[#00d4ff]/30';
      case 'ongoing': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'upcoming': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      case 'completed': return 'bg-white/5 text-white/50 border-white/10';
    }
  };

  const getStatusText = (status: Tournament['status']) => {
    switch (status) {
      case 'registration': return 'Registration Open';
      case 'ongoing': return 'Live Now';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] relative">
      {/* Full Page Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${tournamentBg})` }}
      ></div>
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0e1a]/40 via-[#0a0e1a]/30 to-[#0a0e1a]/50"></div>
      <div className="fixed inset-0 bg-gradient-to-r from-[#00d4ff]/5 via-transparent to-purple-500/5"></div>
      
      {/* Content Container */}
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-32 lg:pt-40 pb-10 sm:pb-12 md:pb-16">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <img
                    src={teemoTournamentsIcon}
                    alt="Tournaments"
                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-44 lg:h-44 object-contain -my-4 sm:-my-6 md:-my-8 lg:-my-12 -mr-2 sm:-mr-4 md:-mr-6 lg:-mr-8"
                  />
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white font-bold">Tournaments</h1>
                </div>
                <p className="text-white/60 text-sm sm:text-base md:text-lg">Compete for glory and real cash prizes in League of Legends tournaments</p>
              </div>
              
              <button
                onClick={onCreateTournament}
                className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#00d4ff] to-[#00a3cc] text-white rounded-xl hover:shadow-lg hover:shadow-[#00d4ff]/30 transition-all duration-300 group text-sm sm:text-base w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
                Create Tournament
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-5 h-5 text-[#00d4ff]" />
                  <span className="text-white/50 text-sm">Active Tournaments</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{tournaments.filter(t => t.status === 'ongoing' || t.status === 'registration').length}</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-white/50 text-sm">Total Prize Pool</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">€{tournaments.reduce((sum, t) => sum + t.prize, 0).toLocaleString()}</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white/50 text-sm">Registered Teams</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{tournaments.reduce((sum, t) => sum + t.registeredTeams, 0)}</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 border border-white/5">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <span className="text-white/50 text-sm">Completed</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{tournaments.filter(t => t.status === 'completed').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl p-4 sm:p-6 border border-white/5 mb-6">
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              {/* Tabs - horizontally scrollable on mobile */}
              <div className="flex items-center gap-2 bg-[#0a0e1a]/50 rounded-lg p-1 overflow-x-auto max-w-full">
                {(['all', 'registration', 'ongoing', 'completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab
                        ? 'bg-[#00d4ff] text-white shadow-lg shadow-[#00d4ff]/20'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    {tab === 'all' ? 'All Tournaments' : tab === 'registration' ? 'Open Registration' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Region Filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-white/50 flex-shrink-0" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value as any)}
                  className="flex-1 sm:flex-initial bg-[#0a0e1a]/50 border border-white/10 rounded-lg px-3 sm:px-4 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50"
                >
                  <option value="all">All Regions</option>
                  <option value="EUW">EUW</option>
                  <option value="EUNE">EUNE</option>
                  <option value="NA">NA</option>
                  <option value="KR">KR</option>
                  <option value="BR">BR</option>
                  <option value="LAN + LAS">LAN + LAS</option>
                  <option value="OCE">OCE</option>
                  <option value="TR">TR</option>
                  <option value="JP">JP</option>
                  <option value="ME / SEA">ME / SEA</option>
                </select>
              </div>

              {/* Search */}
              <div className="flex-1 w-full sm:min-w-[240px] relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                <input
                  type="text"
                  placeholder="Search tournaments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0a0e1a]/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50"
                />
              </div>
            </div>
          </div>

          {/* Tournaments Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {filteredTournaments.map((tournament) => (
              <div
                key={tournament.id}
                className="bg-gradient-to-br from-[#1a1d29] to-[#151821] rounded-xl overflow-hidden border border-white/5 hover:border-[#00d4ff]/30 transition-all duration-300 group cursor-pointer"
                onClick={() => onViewTournament(tournament.id, tournament.status)}
              >
                {/* Banner */}
                <div className="relative h-32 sm:h-36 md:h-40 overflow-hidden">
                  <img 
                    src={tournament.banner} 
                    alt={tournament.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151821] via-[#151821]/50 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-medium border ${getStatusColor(tournament.status)}`}>
                      {getStatusText(tournament.status)}
                    </span>
                  </div>

                  {/* Prize */}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg shadow-lg shadow-yellow-500/20">
                      <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      <span className="text-white font-bold text-sm sm:text-lg">€{tournament.prize.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-white text-lg sm:text-xl font-bold mb-3 group-hover:text-[#00d4ff] transition-colors">
                    {tournament.name}
                  </h3>

                  {/* Organizer */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                    {tournament.organizerAvatar ? (
                      <img 
                        src={tournament.organizerAvatar} 
                        alt={tournament.organizer}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{tournament.organizer[0]}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-white/50 text-xs">Organized by</p>
                      <p className="text-white text-sm font-medium">{tournament.organizer}</p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#00d4ff] flex-shrink-0" />
                      <div>
                        <p className="text-white/50 text-xs">Start Date</p>
                        <p className="text-white text-sm font-medium">
                          {new Date(tournament.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <div>
                        <p className="text-white/50 text-xs">Format</p>
                        <p className="text-white text-sm font-medium">{tournament.format}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <div>
                        <p className="text-white/50 text-xs">Teams</p>
                        <p className="text-white text-sm font-medium">{tournament.registeredTeams}/{tournament.maxTeams}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                      <div>
                        <p className="text-white/50 text-xs">Region</p>
                        <p className="text-white text-sm font-medium">{tournament.region}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-[#00d4ff]/10 text-[#00d4ff] rounded text-xs border border-[#00d4ff]/20">
                      {tournament.teamSize}
                    </span>
                    {tournament.rankRequirement && (
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-xs border border-purple-500/20">
                        {tournament.rankRequirement}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {tournament.status === 'registration' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/50 text-xs">Registration Progress</span>
                        <span className="text-white text-xs font-medium">
                          {Math.round((tournament.registeredTeams / tournament.maxTeams) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00a3cc] transition-all duration-500"
                          style={{ width: `${(tournament.registeredTeams / tournament.maxTeams) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-[#00d4ff]/10 to-[#00a3cc]/10 border border-[#00d4ff]/20 text-[#00d4ff] rounded-lg hover:border-[#00d4ff]/50 hover:shadow-lg hover:shadow-[#00d4ff]/20 transition-all duration-300 group">
                    <span className="font-medium text-sm sm:text-base">View Details</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTournaments.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00d4ff]/10 to-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white/20" />
              </div>
              <p className="text-white/50 text-lg mb-2">No tournaments found</p>
              <p className="text-white/30 text-sm">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}