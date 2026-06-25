// @ts-nocheck
'use client'
import { X, Crown, Shield, Users, Activity, Settings, Eye, ChevronDown, ChevronUp, TrendingUp, BarChart3, UserCog, Lock, Unlock, Trash2, AlertTriangle, CheckCircle, Ban, UserX, Award, Star, Zap, Clock, Pause, XCircle, MessageCircle, Send, ArrowUp, ArrowDown, Trophy } from "lucide-react";
import { useState, useEffect } from "react";
import { TournamentApproval } from "./TournamentApproval";

interface Warning {
  id: number;
  reason: string;
  date: string;
  issuedBy: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: "owner" | "admin" | "moderator" | "user";
  status: string;
  joinDate: string;
  lastActive: string;
  permissions: string[];
  actions: number;
  warnings: number;
  warningsList?: Warning[];
  timeoutUntil?: string | null;
}

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  role: string;
}

interface RolePermissions {
  [key: string]: {
    name: string;
    color: string;
    icon: any;
    permissions: string[];
  };
}

interface AdminSettings {
  autoApprove: boolean;
  requireRiotVerification: boolean;
  enableReporting: boolean;
  maintenanceMode: boolean;
  siteName: string;
  riotApiKey: string;
}

interface Tournament {
  id: number;
  name: string;
  organizer: string;
  organizerAvatar?: string;
  prize: number;
  currency: string;
  startDate: string;
  registrationDeadline: string;
  format: string;
  teamSize: string;
  maxTeams: number;
  region: string;
  rankRequirement?: string;
  rules: string[];
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  registeredTeams: number;
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

interface OwnerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserName?: string;
  currentUserRole?: string;
  currentUserPermissions?: string[];
  users: User[];
  onPromoteUser: (userId: number, newRole: string) => void;
  onDemoteUser: (userId: number, newRole: string) => void;
  onTogglePermission: (userId: number, permission: string) => void;
  onDeleteUser: (userId: number) => void;
  onBanUser: (userId: number, reason?: string) => void;
  onWarnUser?: (userId: number) => void;
  onTimeoutUser?: (userId: number, hours: number) => void;
  onRemoveWarning?: (userId: number, warningId: number) => void;
  activityLogs: ActivityLog[];
  settings: AdminSettings;
  onUpdateSettings: (settings: AdminSettings) => void;
  pendingTournaments: Tournament[];
  onApproveTournament: (tournamentId: number) => void;
  onRejectTournament: (tournamentId: number, reason: string) => void;
  supportConversations?: any;
  onSendSupportMessage?: (userId: string, message: any) => void;
  selectedSupportUser?: string | null;
  onSelectSupportUser?: (userId: string | null) => void;
  closedSupportConversations?: Set<string>;
  onCloseSupportConversation?: (userId: string) => void;
  onReopenSupportConversation?: (userId: string) => void;
  externalReports?: any[];
  onUpdateExternalReports?: (reports: any[]) => void;
  onDeletePost?: (postId: number) => void;
  onRemoveUserAvatar?: (username: string) => void;
  onRemoveUserBanner?: (username: string) => void;
  onUnbanUser?: (userId: number) => void;
}

export function OwnerPanel({
  isOpen,
  onClose,
  currentUserName,
  currentUserRole = 'owner',
  currentUserPermissions = [],
  users,
  onPromoteUser,
  onDemoteUser,
  onTogglePermission,
  onDeleteUser,
  onBanUser,
  onWarnUser,
  onTimeoutUser,
  onRemoveWarning,
  activityLogs,
  settings,
  onUpdateSettings,
  pendingTournaments,
  onApproveTournament,
  onRejectTournament,
  supportConversations,
  onSendSupportMessage,
  selectedSupportUser,
  onSelectSupportUser,
  closedSupportConversations = new Set(),
  onCloseSupportConversation,
  onReopenSupportConversation,
  externalReports,
  onUpdateExternalReports,
  onDeletePost,
  onRemoveUserAvatar,
  onUnbanUser,
  onRemoveUserBanner
}: OwnerPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "roles" | "warnings" | "activity" | "settings" | "support" | "tournaments" | "reports" | "banned">("overview");

  const tabPermissionMap: Record<string, string> = {
    roles: "manage_users",
    warnings: "view_warnings",
    activity: "view_activity",
    support: "view_support",
    tournaments: "manage_tournaments",
    reports: "manage_reports",
    banned: "view_banned",
    settings: "manage_settings",
  };

  useEffect(() => {
    if (currentUserRole === 'owner') return;
    const requiredPerm = tabPermissionMap[activeTab];
    if (requiredPerm && !currentUserPermissions.includes(requiredPerm)) {
      setActiveTab("overview");
    }
  }, [currentUserPermissions, activeTab, currentUserRole]);
  const [viewPostReport, setViewPostReport] = useState<any | null>(null);
  const [reports, setReports] = useState([
    {
      id: 1, type: 'post', reportedBy: 'Player123', reportedUser: 'ToxicUser99',
      reason: 'Spam / Boost ilegal',
      post: 'Post #47',
      postContent: 'Vand boost ELO ieftin! De la Iron la Diamond garantat in 3 zile. DM pentru pret. Serios si de incredere ✅',
      details: 'Acest user a postat acelasi anunt de 5 ori in aceeasi zi.',
      date: '2026-06-11 14:32', status: 'pending'
    },
    {
      id: 2, type: 'profile', reportedBy: 'EmeraldADC', reportedUser: 'xXxHaterxXx',
      reason: 'Comportament toxic / Hărțuire',
      post: 'Profil utilizator',
      postContent: 'Descriere profil conține insulte directe la adresa altor jucători și limbaj ofensator.',
      details: 'Mi-a trimis si mesaje private cu insulte dupa ce i-am dat report in joc.',
      date: '2026-06-11 12:15', status: 'pending'
    },
    {
      id: 3, type: 'post', reportedBy: 'DiamondSupport', reportedUser: 'FakeCoach',
      reason: 'Informații false / Înșelăciune',
      post: 'Post #31',
      postContent: 'Coach profesionist Diamond 1. 500+ ore coaching. Primul session GRATUIT. Platit = rezultate garantate sau banii inapoi!',
      details: 'Am platit si nu a aparut la sesiune. Profil fals, rank nereal.',
      date: '2026-06-10 22:44', status: 'resolved'
    },
    {
      id: 4, type: 'post', reportedBy: 'GoldJungler', reportedUser: 'SpammerPro',
      reason: 'Spam',
      post: 'Post #58',
      postContent: 'LF duo LF duo LF duo LF duo LF duo LF duo EUW plat+ LF duo LF duo',
      details: 'A postat acelasi mesaj de peste 20 de ori in 10 minute.',
      date: '2026-06-10 18:21', status: 'pending'
    },
    {
      id: 5, type: 'profile', reportedBy: 'SilverMid', reportedUser: 'ImpersonatorGG',
      reason: 'Impersonare jucător cunoscut',
      post: 'Profil utilizator',
      postContent: 'Profil pretinde a fi un streamer cunoscut cu același username și avatar modificat.',
      details: 'Foloseste numele si poza unui streamer cu 100k followeri pentru a atrage lumea.',
      date: '2026-06-09 11:05', status: 'dismissed'
    },
  ]);
  const allReports = externalReports && externalReports.length > 0 ? externalReports : reports;
  const updateReport = (id: number, status: string) => {
    if (externalReports && onUpdateExternalReports) {
      onUpdateExternalReports(externalReports.map((r: any) => r.id === id ? { ...r, status } : r));
    } else {
      setReports((prev: any) => prev.map(r => r.id === id ? { ...r, status } : r));
    }
  };
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [expandedPermissions, setExpandedPermissions] = useState<number | null>(null);

  const [warningsSearchTerm, setWarningsSearchTerm] = useState("");
  
  // Remove Warning Confirmation Modal
  const [warningToRemove, setWarningToRemove] = useState<{userId: number, warningId: number, username: string, reason: string, issuedBy: string} | null>(null);
  const [supportReplyInput, setSupportReplyInput] = useState("");
  const [banModal, setBanModal] = useState<{userId: number, username: string} | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banDetails, setBanDetails] = useState("");
  const [banReasonError, setBanReasonError] = useState(false);
  const [banReasons] = useState([
    "Comportament toxic / Hărțuire",
    "Spam și conținut înșelător",
    "Conținut inadecvat / Nuditate",
    "Escrocherie sau fraudă",
    "Încălcări repetate ale regulamentului",
    "Cont fals / Impersonare",
    "Alt motiv",
  ]);

  // Local Settings State
  const [localSettings, setLocalSettings] = useState(settings);

  // Owner Panel Specific Settings state
  const [maxOwners, setMaxOwners] = useState(1);
  const [maxAdmins, setMaxAdmins] = useState(5);
  const [maxModerators, setMaxModerators] = useState(20);
  const [require2FA, setRequire2FA] = useState(true);
  const [logAdminActions, setLogAdminActions] = useState(true);
  const [requireConfirmation, setRequireConfirmation] = useState(true);

  if (!isOpen) return null;

  const roleHierarchy: RolePermissions = {
    owner: {
      name: "Owner",
      color: "from-yellow-400 via-amber-500 to-orange-600",
      icon: Crown,
      permissions: ["all"]
    },
    admin: {
      name: "Administrator",
      color: "from-red-500 via-pink-500 to-purple-500",
      icon: Shield,
      permissions: ["manage_users", "manage_posts", "manage_reports", "ban_users", "timeout_users", "delete_content", "view_analytics"]
    },
    moderator: {
      name: "Moderator",
      color: "from-blue-500 via-cyan-500 to-teal-500",
      icon: UserCog,
      permissions: ["manage_posts", "manage_reports", "warn_users", "timeout_users", "delete_content"]
    },
    user: {
      name: "User",
      color: "from-gray-400 to-gray-600",
      icon: Users,
      permissions: ["create_posts", "send_messages", "report_content"]
    }
  };

  const allPermissions = [
    { id: "manage_users", name: "Manage Users", desc: "Create, edit, delete users", category: "Utilizatori" },
    { id: "ban_users", name: "Ban Users", desc: "Ban/unban users", category: "Utilizatori" },
    { id: "timeout_users", name: "Timeout Users", desc: "Temporarily mute users (1h, 5h)", category: "Utilizatori" },
    { id: "warn_users", name: "Warn Users", desc: "Send warnings to users", category: "Utilizatori" },
    { id: "view_banned", name: "Conturi Banate", desc: "Vizualizare și gestionare conturi banate", category: "Utilizatori" },
    { id: "manage_posts", name: "Manage Posts", desc: "Approve, delete posts", category: "Conținut" },
    { id: "delete_content", name: "Delete Content", desc: "Delete posts and comments", category: "Conținut" },
    { id: "manage_reports", name: "Report Check", desc: "Vizualizare și rezolvare rapoarte", category: "Moderare" },
    { id: "view_warnings", name: "Warnings", desc: "Vizualizare avertismente utilizatori", category: "Moderare" },
    { id: "view_activity", name: "Activity Logs", desc: "Acces la jurnalul de activitate", category: "Moderare" },
    { id: "view_support", name: "Support Chat", desc: "Acces și răspuns la chat-ul de suport", category: "Suport" },
    { id: "manage_tournaments", name: "Turnee Aprobări", desc: "Aprobare, respingere și gestionare turnee", category: "Turnee" },
    { id: "manage_challenges", name: "Manage Challenges", desc: "Adaugă și gestionează challenges pentru utilizatori", category: "Turnee" },
    { id: "view_analytics", name: "View Analytics", desc: "Access platform analytics", category: "Sistem" },
    { id: "manage_settings", name: "Manage Settings", desc: "Change platform settings", category: "Sistem" },
    { id: "create_posts", name: "Create Posts", desc: "Create new posts", category: "Conținut" },
    { id: "send_messages", name: "Send Messages", desc: "Send private messages", category: "Comunicare" },
    { id: "report_content", name: "Report Content", desc: "Report violations", category: "Moderare" },
  ];

  const filteredUsers = users.filter(user => {
    if (user.status === 'banned') return false;
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    totalUsers: users.length,
    owners: users.filter(u => u.role === "owner").length,
    admins: users.filter(u => u.role === "admin").length,
    moderators: users.filter(u => u.role === "moderator").length,
    regularUsers: users.filter(u => u.role === "user").length,
    bannedUsers: users.filter(u => u.status === "banned").length,
    activeToday: users.filter(u => u.lastActive.includes("today") || u.lastActive.includes("hour") || u.lastActive.includes("min")).length
  };

  const RoleIcon = ({ role }: { role: string }) => {
    const RoleComponent = roleHierarchy[role as keyof RolePermissions]?.icon || Users;
    return <RoleComponent className="w-4 h-4" />;
  };

  const handleSaveSettings = () => {
    onUpdateSettings(localSettings);
    alert(`✅ Settings saved successfully!\n\nMax Owners: ${maxOwners}\nMax Admins: ${maxAdmins}\nMax Moderators: ${maxModerators}\n2FA Required: ${require2FA ? 'Yes' : 'No'}\nLog Admin Actions: ${logAdminActions ? 'Yes' : 'No'}\nRequire Confirmation: ${requireConfirmation ? 'Yes' : 'No'}`);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setMaxOwners(1);
      setMaxAdmins(5);
      setMaxModerators(20);
      setRequire2FA(true);
      setLogAdminActions(true);
      setRequireConfirmation(true);
      alert('⚙️ Settings reset to defaults!');
    }
  };

  const handleRoleChange = (user: User, newRole: string) => {
    if (newRole === user.role) return;
    
    const confirmMsg = `Change ${user.username}'s role from ${roleHierarchy[user.role].name} to ${roleHierarchy[newRole as keyof RolePermissions].name}?`;
    if (confirm(confirmMsg)) {
      if (newRole === "admin" || newRole === "moderator") {
        onPromoteUser(user.id, newRole);
      } else {
        onDemoteUser(user.id, newRole);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4">
      <div className="bg-gradient-to-br from-[#1a1d29] via-[#242836] to-[#1a1d29] rounded-2xl w-full max-w-7xl h-[90vh] flex flex-col border-2 border-yellow-500/30 shadow-2xl shadow-yellow-500/20 relative overflow-hidden">
        
        {/* Animated Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-500/3 to-orange-500/3 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative border-b border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 via-amber-500/5 to-orange-500/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/50">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-white text-3xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                  Owner Control Panel
                </h2>
                <p className="text-yellow-400/80 text-sm flex items-center gap-2 mt-1">
                  <Zap className="w-4 h-4" />
                  Supreme Administrator Access
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {[
              { id: "overview", name: "Overview", icon: BarChart3, requiredPermission: null },
              { id: "roles", name: "Role Management", icon: Crown, requiredPermission: "manage_users" },
              { id: "warnings", name: "Warnings", icon: AlertTriangle, requiredPermission: "view_warnings" },
              { id: "activity", name: "Activity Logs", icon: Activity, requiredPermission: "view_activity" },
              { id: "support", name: "Support Chat", icon: MessageCircle, badge: supportConversations ? Object.keys(supportConversations).length : 0, requiredPermission: "view_support" },
              { id: "tournaments", name: "Tournaments", icon: Trophy, badge: pendingTournaments.length, requiredPermission: "manage_tournaments" },
              { id: "reports", name: "Reports", icon: AlertTriangle, badge: reports.filter(r => r.status === 'pending').length, requiredPermission: "manage_reports" },
              { id: "banned", name: "Conturi Banate", icon: Ban, badge: users.filter((u: any) => u.status === 'banned').length, requiredPermission: "view_banned" },
              { id: "settings", name: "System Settings", icon: Settings, requiredPermission: "manage_settings" }
            ].filter(tab => {
              if (currentUserRole === 'owner') return true;
              if (tab.requiredPermission === null) return true;
              return currentUserPermissions.includes(tab.requiredPermission);
            }).map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-lg transition-all flex items-center gap-2 font-medium ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/30 shadow-lg shadow-yellow-500/20"
                      : "text-white/60 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.name}
                  {(tab as any).badge > 0 && (
                    <span className="bg-[#00d4ff] text-white text-xs px-1.5 py-0.5 rounded-full">
                      {(tab as any).badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: stats.totalUsers, icon: Users, color: "from-blue-500 to-cyan-500" },
                  { label: "Staff Members", value: stats.owners + stats.admins + stats.moderators, icon: Shield, color: "from-purple-500 to-pink-500" },
                  { label: "Active Today", value: stats.activeToday, icon: Activity, color: "from-green-500 to-emerald-500" },
                  { label: "Banned Users", value: stats.bannedUsers, icon: Ban, color: "from-red-500 to-orange-500" }
                ].map((stat, index) => {
                  const StatIcon = stat.icon;
                  return (
                    <div key={index} className="bg-[#1a1d29] border border-white/10 rounded-xl p-6 hover:border-yellow-500/30 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                          <StatIcon className="w-6 h-6 text-white" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-white/60 text-sm">{stat.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Role Distribution */}
              <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                <h3 className="text-white text-xl font-bold mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-400" />
                  Role Distribution
                </h3>
                <div className="space-y-3">
                  {Object.entries(roleHierarchy).map(([roleKey, role]) => {
                    const count = roleKey === "owner" ? stats.owners :
                                 roleKey === "admin" ? stats.admins :
                                 roleKey === "moderator" ? stats.moderators :
                                 stats.regularUsers;
                    const percentage = (count / stats.totalUsers) * 100 || 0;
                    const RoleIconComponent = role.icon;

                    return (
                      <div key={roleKey}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 bg-gradient-to-br ${role.color} rounded-lg flex items-center justify-center`}>
                              <RoleIconComponent className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-medium">{role.name}</span>
                          </div>
                          <span className="text-white/60">{count} users ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${role.color} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-yellow-400" />
                  Recent Administrative Actions
                </h3>
                <div className="space-y-2">
                  {activityLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 bg-gradient-to-br ${roleHierarchy[log.role as keyof RolePermissions]?.color} rounded-lg flex items-center justify-center`}>
                          <RoleIcon role={log.role} />
                        </div>
                        <div>
                          <div className="text-white text-sm">
                            <span className="font-medium">{log.user}</span>
                            <span className="text-white/60"> {log.action} </span>
                            <span className="font-medium">{log.target}</span>
                          </div>
                          <div className="text-white/40 text-xs">{log.timestamp}</div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${roleHierarchy[log.role as keyof RolePermissions]?.color} text-white`}>
                        {roleHierarchy[log.role as keyof RolePermissions]?.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SIMPLIFIED Role Management Tab */}
          {activeTab === "roles" && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder:text-white/40"
                  />
                  <Users className="w-5 h-5 text-white/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-3 bg-[#1a1d29] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white"
                >
                  <option value="all">All Roles</option>
                  <option value="owner">Owners</option>
                  <option value="admin">Administrators</option>
                  <option value="moderator">Moderators</option>
                  <option value="user">Users</option>
                </select>
              </div>

              {/* Simplified Users Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {filteredUsers.map((user) => (
                  <div 
                    key={user.id} 
                    className="bg-[#1a1d29] border border-white/10 rounded-xl p-5 hover:border-yellow-500/30 transition-all"
                  >
                    {/* User Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 bg-gradient-to-br ${roleHierarchy[user.role as keyof RolePermissions]?.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <RoleIcon role={user.role} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold text-lg">{user.username}</span>
                            {user.status === "banned" && (
                              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                                <Ban className="w-3 h-3" />
                                Banned
                              </span>
                            )}
                            {user.timeoutUntil && new Date(user.timeoutUntil) > new Date() && (
                              <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full text-xs font-medium flex items-center gap-1">
                                <Pause className="w-3 h-3" />
                                Timeout
                              </span>
                            )}
                          </div>
                          <div className="text-white/60 text-sm">{user.email}</div>
                          <div className="text-white/40 text-xs mt-1">Last active: {user.lastActive}</div>
                        </div>
                      </div>
                    </div>

                    {/* Role Selector - only for owner */}
                    {currentUserRole === 'owner' && (
                      <div className="mb-4">
                        <label className="block text-white/70 text-xs font-medium mb-2">CHANGE ROLE</label>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user, e.target.value)}
                          disabled={user.role === "owner"}
                          className={`w-full px-4 py-3 rounded-lg border transition-all font-medium bg-gradient-to-r ${roleHierarchy[user.role as keyof RolePermissions]?.color} border-transparent text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 ${
                            user.role === "owner" ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                          }`}
                        >
                          {Object.entries(roleHierarchy).map(([roleKey, role]) => (
                            <option key={roleKey} value={roleKey} disabled={roleKey === "owner"}>
                              {role.name} {roleKey === user.role && "✓"}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Quick Actions - bazate pe permisiuni */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {onTimeoutUser && (currentUserRole === 'owner' || currentUserPermissions.includes('timeout_users')) && (
                        <>
                          <button
                            onClick={() => { if (confirm(`Timeout ${user.username} for 1 hour?`)) onTimeoutUser(user.id, 1); }}
                            className="px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all flex items-center gap-2 justify-center text-sm font-medium"
                          >
                            <Clock className="w-4 h-4" />
                            Timeout 1h
                          </button>
                          <button
                            onClick={() => { if (confirm(`Timeout ${user.username} for 5 hours?`)) onTimeoutUser(user.id, 5); }}
                            className="px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all flex items-center gap-2 justify-center text-sm font-medium"
                          >
                            <Clock className="w-4 h-4" />
                            Timeout 5h
                          </button>
                        </>
                      )}

                      {onWarnUser && (currentUserRole === 'owner' || currentUserPermissions.includes('warn_users')) && (
                        <button
                          onClick={() => { if (confirm(`Send warning to ${user.username}?`)) onWarnUser(user.id); }}
                          className="px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all flex items-center gap-2 justify-center text-sm font-medium"
                        >
                          <AlertTriangle className="w-4 h-4" />
                          Warn {user.warnings > 0 && `(${user.warnings})`}
                        </button>
                      )}

                      {(currentUserRole === 'owner' || currentUserPermissions.includes('ban_users')) && (
                        user.status !== "banned" ? (
                          <button
                            onClick={() => { setBanModal({ userId: user.id, username: user.username }); setBanReason(""); setBanDetails(""); setBanReasonError(false); }}
                            className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-2 justify-center text-sm font-medium"
                          >
                            <Ban className="w-4 h-4" />
                            Ban
                          </button>
                        ) : (
                          <button
                            onClick={() => { if (confirm(`Unban ${user.username}?`)) onBanUser(user.id); }}
                            className="px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all flex items-center gap-2 justify-center text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Unban
                          </button>
                        )
                      )}

                      {currentUserRole === 'owner' && (
                        <>
                          <button
                            onClick={() => setExpandedPermissions(expandedPermissions === user.id ? null : user.id)}
                            className="px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all flex items-center gap-2 justify-center text-sm font-medium"
                          >
                            <Lock className="w-4 h-4" />
                            {expandedPermissions === user.id ? 'Hide' : 'Show'} Permissions
                          </button>
                          <button
                            onClick={() => { if (confirm(`Delete ${user.username} permanently?`)) onDeleteUser(user.id); }}
                            className="px-3 py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg border border-gray-500/20 hover:border-gray-500/40 transition-all flex items-center gap-2 justify-center text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </>
                      )}
                    </div>

                    {/* Expanded Permissions - INLINE! */}
                    {expandedPermissions === user.id && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-white/70 text-xs font-medium mb-3 flex items-center gap-2">
                          <Lock className="w-3 h-3" />
                          PERMISSIONS
                        </div>
                        <div className="space-y-3">
                          {Array.from(new Set(allPermissions.map(p => p.category))).map(category => (
                            <div key={category}>
                              <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-1.5">{category}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {allPermissions.filter(p => p.category === category).map((permission) => {
                                  const hasPermission = user.role === "owner" || user.permissions.includes(permission.id);
                                  return (
                                    <button
                                      key={permission.id}
                                      onClick={() => { if (user.role !== "owner") onTogglePermission(user.id, permission.id); }}
                                      disabled={user.role === "owner"}
                                      className={`p-2.5 rounded-lg border transition-all text-left ${
                                        hasPermission
                                          ? "bg-green-500/10 border-green-500/30 text-green-400"
                                          : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                                      } ${user.role === "owner" ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                                    >
                                      <div className="flex items-center justify-between mb-0.5">
                                        <span className="font-medium text-xs">{permission.name}</span>
                                        {hasPermission ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                      </div>
                                      <div className="text-[10px] opacity-60 leading-tight">{permission.desc}</div>
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NEW WARNINGS TAB - Complete warnings management */}
          {activeTab === "warnings" && (
            <div className="space-y-6">
              <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-7 h-7 text-yellow-400" />
                  Warning Management
                  <span className="ml-auto px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                    {users.filter(u => u.warnings > 0).length} Users with Warnings
                  </span>
                </h3>

                {/* Search Bar */}
                <div className="mb-6 relative">
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={warningsSearchTerm}
                    onChange={(e) => setWarningsSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-11 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 text-white placeholder:text-white/40 transition-all"
                  />
                  <Users className="w-5 h-5 text-yellow-400/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  {warningsSearchTerm && (
                    <button
                      onClick={() => setWarningsSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                </div>
                
                {users.filter(u => u.warnings > 0).length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-white text-xl font-semibold mb-2">No Active Warnings</p>
                    <p className="text-white/60">All users are in good standing!</p>
                  </div>
                ) : (
                  <>
                    {users
                      .filter(u => u.warnings > 0)
                      .filter(u => {
                        if (!warningsSearchTerm) return true;
                        const searchLower = warningsSearchTerm.toLowerCase();
                        return u.username.toLowerCase().includes(searchLower) || 
                               u.email.toLowerCase().includes(searchLower);
                      }).length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white text-xl font-semibold mb-2">No users found</p>
                        <p className="text-white/60">Try a different search term</p>
                        <button
                          onClick={() => setWarningsSearchTerm("")}
                          className="mt-4 px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all"
                        >
                          Clear Search
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {users
                          .filter(u => u.warnings > 0)
                          .filter(u => {
                            if (!warningsSearchTerm) return true;
                            const searchLower = warningsSearchTerm.toLowerCase();
                            return u.username.toLowerCase().includes(searchLower) || 
                                   u.email.toLowerCase().includes(searchLower);
                          })
                          .map((user) => (
                      <div key={user.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-yellow-500/30 transition-all">
                        {/* User Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${roleHierarchy[user.role as keyof RolePermissions]?.color} rounded-xl flex items-center justify-center shadow-lg`}>
                              <RoleIcon role={user.role} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-white font-semibold text-lg">{user.username}</span>
                                <div className={`px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${roleHierarchy[user.role as keyof RolePermissions]?.color} text-white`}>
                                  {roleHierarchy[user.role as keyof RolePermissions]?.name}
                                </div>
                                {user.status === "banned" && (
                                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Ban className="w-3 h-3" />
                                    Banned
                                  </span>
                                )}
                              </div>
                              <div className="text-white/60 text-sm">{user.email}</div>
                              <div className="text-white/40 text-xs mt-1">Last active: {user.lastActive}</div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 ${
                              user.warnings >= 5 
                                ? 'bg-red-500/20 text-red-400 border-2 border-red-500/40' 
                                : user.warnings >= 3 
                                ? 'bg-orange-500/20 text-orange-400 border-2 border-orange-500/40' 
                                : 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500/40'
                            }`}>
                              <AlertTriangle className="w-5 h-5" />
                              {user.warnings} Warning{user.warnings !== 1 ? 's' : ''}
                            </div>
                            {user.warnings >= 5 && (
                              <span className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold flex items-center gap-2 border border-red-500/30">
                                <Ban className="w-4 h-4" />
                                AUTO-BANNED
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Warnings List */}
                        {user.warningsList && user.warningsList.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {user.warningsList.map((warning) => (
                              <div key={warning.id} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-yellow-500/20 transition-all">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">#{warning.id}</span>
                                      <span className="text-white/40 text-xs">{warning.date}</span>
                                      <span className="text-white/40 text-xs">•</span>
                                      <span className="text-white/60 text-xs">By {warning.issuedBy}</span>
                                    </div>
                                    <div className="text-white text-sm font-medium">{warning.reason}</div>
                                  </div>
                                  {onRemoveWarning && (
                                    <button
                                      onClick={() => {
                                        if (confirm(`Remove warning "${warning.reason}" from ${user.username}?`)) {
                                          onRemoveWarning(user.id, warning.id);
                                        }
                                      }}
                                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="flex gap-2 pt-4 border-t border-white/10">
                          {onWarnUser && (
                            <button
                              onClick={() => onWarnUser(user.id)}
                              className="px-4 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/20 hover:border-yellow-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                            >
                              <AlertTriangle className="w-4 h-4" />
                              Add Warning
                            </button>
                          )}
                          
                          {user.warnings < 5 && user.status !== "banned" && (
                            <button
                              onClick={() => { setBanModal({ userId: user.id, username: user.username }); setBanReason(""); setBanDetails(""); setBanReasonError(false); }}
                              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                            >
                              <Ban className="w-4 h-4" />
                              Ban User
                            </button>
                          )}

                          {user.status === "banned" && (
                            <button
                              onClick={() => {
                                if (confirm(`Unban ${user.username}?`)) {
                                  onBanUser(user.id);
                                }
                              }}
                              className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Unban User
                            </button>
                          )}

                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setActiveTab("roles");
                            }}
                            className="ml-auto px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/20 hover:border-blue-500/40 transition-all flex items-center gap-2 text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Activity Tab - Keep existing implementation */}
          {activeTab === "activity" && (
            <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
              <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                <Activity className="w-7 h-7 text-yellow-400" />
                Activity Logs
              </h3>
              <div className="space-y-2">
                {activityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-br ${roleHierarchy[log.role as keyof RolePermissions]?.color} rounded-lg flex items-center justify-center shadow-lg`}>
                        <RoleIcon role={log.role} />
                      </div>
                      <div>
                        <div className="text-white">
                          <span className="font-semibold">{log.user}</span>
                          <span className="text-white/60"> {log.action} </span>
                          <span className="font-semibold">{log.target}</span>
                        </div>
                        <div className="text-white/40 text-sm">{log.timestamp}</div>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${roleHierarchy[log.role as keyof RolePermissions]?.color} text-white`}>
                      {roleHierarchy[log.role as keyof RolePermissions]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Tab - Keep existing */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                  <MessageCircle className="w-7 h-7 text-[#00d4ff]" />
                  Live Support Conversations
                  {supportConversations && Object.keys(supportConversations).length > 0 && (
                    <span className="ml-2 px-3 py-1 bg-[#00d4ff]/20 text-[#00d4ff] rounded-full text-sm font-medium">
                      {Object.keys(supportConversations).length} Active
                    </span>
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Conversations List */}
                  <div className="space-y-2 border-r border-white/10 pr-6">
                    <h4 className="text-white/60 text-sm font-medium mb-3 uppercase tracking-wide">Conversations</h4>
                    {supportConversations && Object.keys(supportConversations).length > 0 ? (
                      Object.entries(supportConversations).map(([userId, messages]: [string, any]) => {
                        const isClosed = closedSupportConversations.has(userId);
                        const lastMessage = messages[messages.length - 1];
                        
                        return (
                          <button
                            key={userId}
                            onClick={() => onSelectSupportUser?.(userId)}
                            className={`w-full p-4 rounded-lg border transition-all text-left ${
                              selectedSupportUser === userId
                                ? "bg-[#00d4ff]/10 border-[#00d4ff]/30 shadow-lg shadow-[#00d4ff]/10"
                                : "bg-white/5 border-white/10 hover:border-[#00d4ff]/20 hover:bg-white/10"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00b8e6] flex items-center justify-center text-white font-bold">
                                  {userId.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-white font-semibold">{userId}</div>
                                  <div className="text-white/40 text-xs">{messages.length} messages</div>
                                </div>
                              </div>
                              {isClosed ? (
                                <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">
                                  Closed
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                                  Active
                                </span>
                              )}
                            </div>
                            {lastMessage && (
                              <div className="text-white/60 text-sm truncate">
                                {lastMessage.text}
                              </div>
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">No active support conversations</p>
                      </div>
                    )}
                  </div>

                  {/* Selected Conversation */}
                  <div>
                    {selectedSupportUser && supportConversations && supportConversations[selectedSupportUser] ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                          <div>
                            <h4 className="text-white font-semibold text-lg">{selectedSupportUser}</h4>
                            <p className="text-white/40 text-sm">Support Conversation</p>
                          </div>
                          <div className="flex gap-2">
                            {closedSupportConversations.has(selectedSupportUser) ? (
                              <button
                                onClick={() => onReopenSupportConversation?.(selectedSupportUser)}
                                className="px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg border border-green-500/20 hover:border-green-500/40 transition-all text-sm font-medium"
                              >
                                Reopen
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (confirm(`Close conversation with ${selectedSupportUser}?`)) {
                                    onCloseSupportConversation?.(selectedSupportUser);
                                  }
                                }}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 hover:border-red-500/40 transition-all text-sm font-medium"
                              >
                                Close Conversation
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Messages */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                          {supportConversations[selectedSupportUser].map((msg: any, idx: number) => (
                            <div
                              key={idx}
                              className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}
                            >
                              <div
                                className={`max-w-[80%] p-3 rounded-lg ${
                                  msg.sender === "user"
                                    ? "bg-white/10 text-white"
                                    : "bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white"
                                }`}
                              >
                                <div className="text-sm">{msg.content || msg.text}</div>
                                <div className={`text-xs mt-1 ${msg.sender === "user" ? "text-white/40" : "text-white/70"}`}>
                                  {msg.timestamp}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Reply Input */}
                        {!closedSupportConversations.has(selectedSupportUser) && (
                          <div className="flex gap-2 pt-4 border-t border-white/10">
                            <input
                              type="text"
                              placeholder="Type your reply..."
                              value={supportReplyInput}
                              onChange={(e) => setSupportReplyInput(e.target.value)}
                              className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00d4ff]/50 text-white placeholder:text-white/40"
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && supportReplyInput.trim()) {
                                  onSendSupportMessage?.(selectedSupportUser, {
                                    id: Date.now(),
                                    sender: "support",
                                    senderName: "FinderQ Support",
                                    content: supportReplyInput.trim(),
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                  });
                                  setSupportReplyInput("");
                                }
                              }}
                            />
                            <button
                              onClick={() => {
                                if (!supportReplyInput.trim()) return;
                                onSendSupportMessage?.(selectedSupportUser, {
                                  id: Date.now(),
                                  sender: "support",
                                  senderName: "FinderQ Support",
                                  content: supportReplyInput.trim(),
                                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                });
                                setSupportReplyInput("");
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] hover:from-[#00b8e6] hover:to-[#0099cc] text-white rounded-lg transition-all shadow-lg shadow-[#00d4ff]/30"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">Select a conversation to view messages</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tournaments Tab */}
          {activeTab === "tournaments" && (
            <div className="space-y-6">
              <div className="bg-[#1a1d29] border border-yellow-500/20 rounded-xl p-6">
                <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                  <Trophy className="w-7 h-7 text-yellow-400" />
                  Tournament Approvals
                </h3>
                
                <TournamentApproval
                  pendingTournaments={pendingTournaments}
                  onApproveTournament={onApproveTournament}
                  onRejectTournament={onRejectTournament}
                />
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (() => {
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-white text-xl font-bold flex items-center gap-2">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                    Rapoarte utilizatori
                  </h3>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">{allReports.filter((r: any) => r.status === 'pending').length} în așteptare</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">{allReports.filter((r: any) => r.status === 'resolved').length} rezolvate</span>
                    <span className="px-2 py-1 bg-white/10 text-white/50 rounded-full border border-white/10">{allReports.filter((r: any) => r.status === 'dismissed').length} respinse</span>
                  </div>
                </div>

                {allReports.length === 0 ? (
                  <div className="text-center py-16 text-white/40">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nu există rapoarte.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allReports.map((report: any) => (
                      <div key={report.id} className={`bg-[#1a1d29] rounded-xl border p-4 ${
                        report.status === 'pending' ? 'border-yellow-500/30' :
                        report.status === 'resolved' ? 'border-green-500/20' : 'border-white/5'
                      }`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex-shrink-0 ${
                              report.type === 'post' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            }`}>
                              {report.type === 'post' ? 'Postare' : 'Profil'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="text-white font-semibold text-sm">{report.reportedUser || report.target}</span>
                                <span className="text-white/40 text-xs">raportat de</span>
                                <span className="text-[#00d4ff] text-xs font-medium">{report.reportedBy}</span>
                              </div>
                              <p className="text-red-400 text-xs font-medium mb-1">{report.reason}</p>
                              {report.post && <p className="text-white/40 text-[10px]">{report.post}</p>}
                              {report.postContent && (
                                <div className="mt-2 p-2 bg-black/40 rounded-lg border border-white/10 cursor-pointer hover:border-blue-500/40 transition-colors" onClick={() => setViewPostReport(report)}>
                                  <p className="text-white/30 text-[9px] uppercase font-bold mb-1 flex items-center gap-1">
                                    <Eye className="w-2.5 h-2.5" /> Conținut postare
                                  </p>
                                  <p className="text-white/70 text-xs line-clamp-2">{report.postContent}</p>
                                  {report.details && <p className="text-white/40 text-[10px] mt-1 italic border-t border-white/5 pt-1">Detalii: {report.details}</p>}
                                </div>
                              )}
                              <p className="text-white/30 text-[10px] mt-1">{report.date}</p>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 flex-shrink-0">
                            {report.postContent && (
                              <button
                                onClick={() => setViewPostReport(report)}
                                className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/30 transition-colors flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" /> Vezi postarea
                              </button>
                            )}
                            {report.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => updateReport(report.id, 'resolved')}
                                  className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs font-medium border border-green-500/30 transition-colors flex items-center gap-1"
                                >
                                  <CheckCircle className="w-3 h-3" /> Rezolvă
                                </button>
                                <button
                                  onClick={() => updateReport(report.id, 'dismissed')}
                                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/50 rounded-lg text-xs font-medium border border-white/10 transition-colors flex items-center gap-1"
                                >
                                  <XCircle className="w-3 h-3" /> Respinge
                                </button>
                              </>
                            ) : (
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                report.status === 'resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-white/5 text-white/30 border border-white/10'
                              }`}>
                                {report.status === 'resolved' ? 'Rezolvat' : 'Respins'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Banned Accounts Tab */}
          {activeTab === "banned" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Ban className="w-5 h-5 text-red-400" />
                  Conturi Banate
                  <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-bold">
                    {users.filter((u: any) => u.status === 'banned').length}
                  </span>
                </h3>
              </div>

              {users.filter((u: any) => u.status === 'banned').length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <Ban className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nu există conturi banate</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.filter((u: any) => u.status === 'banned').map((u: any) => (
                    <div key={u.id} className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                          <UserX className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{u.username}</p>
                          <p className="text-white/40 text-xs">{u.email || 'N/A'} • {u.region}</p>
                          {u.banReason && (
                            <p className="text-red-400/80 text-xs mt-0.5">Motiv: {u.banReason}</p>
                          )}
                          <p className="text-white/30 text-xs">Avertismente: {u.warnings || 0} • Rapoarte: {u.reports || 0}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold border border-red-500/30">
                          BANAT
                        </span>
                        <button
                          onClick={() => {
                            if (confirm(`Debanchezi contul lui ${u.username}?`)) {
                              onUnbanUser?.(u.id);
                            }
                          }}
                          className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-xs transition-colors border border-green-500/20 hover:border-green-500/40"
                        >
                          Debanează
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab - Keep existing */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="bg-[#1a1d29] border border-white/10 rounded-xl p-6">
                <h3 className="text-white text-2xl font-bold mb-6 flex items-center gap-2">
                  <Settings className="w-7 h-7 text-yellow-400" />
                  System Settings
                </h3>
                
                <div className="space-y-6">
                  {/* Role Limits */}
                  <div>
                    <h4 className="text-white text-lg font-semibold mb-4">Role Limits</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Max Owners</label>
                        <input
                          type="number"
                          value={maxOwners}
                          onChange={(e) => setMaxOwners(parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Max Admins</label>
                        <input
                          type="number"
                          value={maxAdmins}
                          onChange={(e) => setMaxAdmins(parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-white/70 text-sm mb-2">Max Moderators</label>
                        <input
                          type="number"
                          value={maxModerators}
                          onChange={(e) => setMaxModerators(parseInt(e.target.value))}
                          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div>
                    <h4 className="text-white text-lg font-semibold mb-4">Security Settings</h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <div>
                          <div className="text-white font-medium">Require 2FA for Staff</div>
                          <div className="text-white/60 text-sm">Two-factor authentication for admins and moderators</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={require2FA}
                          onChange={(e) => setRequire2FA(e.target.checked)}
                          className="w-5 h-5"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <div>
                          <div className="text-white font-medium">Log Admin Actions</div>
                          <div className="text-white/60 text-sm">Track all administrative actions</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={logAdminActions}
                          onChange={(e) => setLogAdminActions(e.target.checked)}
                          className="w-5 h-5"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <div>
                          <div className="text-white font-medium">Require Action Confirmation</div>
                          <div className="text-white/60 text-sm">Confirm before executing critical actions</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={requireConfirmation}
                          onChange={(e) => setRequireConfirmation(e.target.checked)}
                          className="w-5 h-5"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg transition-all shadow-lg shadow-green-500/30 font-medium"
                    >
                      Save Settings
                    </button>
                    <button
                      onClick={handleResetSettings}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors border border-white/10"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Snapshot Modal */}
      {viewPostReport && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4" onClick={() => setViewPostReport(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-gradient-to-br from-[#1a1d29] to-[#0f1117] rounded-2xl border border-white/10 p-6 max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-lg">Conținut postare raportată</h3>
                <p className="text-white/40 text-xs mt-0.5">Snapshot salvat la momentul raportării — conținut original</p>
              </div>
              <button onClick={() => setViewPostReport(null)} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                <X className="w-5 h-5 text-white/60" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {viewPostReport.reportedUser?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{viewPostReport.reportedUser}</p>
                  <p className="text-white/40 text-xs">{viewPostReport.date}</p>
                </div>
                <span className="ml-auto px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded border border-red-500/30 uppercase">Raportat</span>
              </div>

              <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                <p className="text-white/90 text-sm leading-relaxed">{viewPostReport.postContent}</p>
              </div>

              <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
                <p className="text-yellow-400 text-xs font-bold mb-1">Motiv raportare: {viewPostReport.reason}</p>
                {viewPostReport.details && <p className="text-white/60 text-xs italic">"{viewPostReport.details}"</p>}
              </div>

              <div className="flex gap-2 pt-1 flex-wrap">
                {/* Post actions */}
                {viewPostReport.type === 'post' && onDeletePost && viewPostReport.post && (
                  <button
                    onClick={() => {
                      const postId = parseInt(viewPostReport.post.replace('Post #', ''));
                      if (confirm(`Ștergi postarea "${viewPostReport.post}"? Acțiunea este ireversibilă.`)) {
                        onDeletePost(postId);
                        updateReport(viewPostReport.id, 'resolved');
                        setViewPostReport(null);
                      }
                    }}
                    className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium border border-red-500/30 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Șterge postarea
                  </button>
                )}
                {/* Profile actions */}
                {viewPostReport.type === 'profile' && (
                  <>
                    {onRemoveUserAvatar && (
                      <button
                        onClick={() => {
                          if (confirm(`Ștergi poza de profil a lui "${viewPostReport.reportedUser}"?`)) {
                            onRemoveUserAvatar(viewPostReport.reportedUser);
                            updateReport(viewPostReport.id, 'resolved');
                            setViewPostReport(null);
                          }
                        }}
                        className="flex-1 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg text-sm font-medium border border-orange-500/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Șterge poza profil
                      </button>
                    )}
                    {onRemoveUserBanner && (
                      <button
                        onClick={() => {
                          if (confirm(`Ștergi bannerul lui "${viewPostReport.reportedUser}"?`)) {
                            onRemoveUserBanner(viewPostReport.reportedUser);
                            updateReport(viewPostReport.id, 'resolved');
                            setViewPostReport(null);
                          }
                        }}
                        className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium border border-red-500/30 transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Șterge banner
                      </button>
                    )}
                  </>
                )}
                <button
                  onClick={() => { updateReport(viewPostReport.id, 'resolved'); setViewPostReport(null); }}
                  className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm font-medium border border-green-500/30 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" /> Rezolvă raport
                </button>
                <button
                  onClick={() => setViewPostReport(null)}
                  className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-sm font-medium border border-white/10 transition-colors"
                >
                  Închide
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ban Modal cu motiv */}
      {banModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[9999] p-3 sm:p-4">
          <div className="bg-[#1e2130] rounded-2xl max-w-md w-full border border-red-500/30 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-700" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                  <Ban className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Banează utilizator</h3>
                  <p className="text-white/50 text-sm">{banModal.username}</p>
                </div>
              </div>

              <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                Motiv ban <span className="text-red-400">*</span>
              </label>
              <div className="space-y-1.5 mb-4">
                {banReasons.map((r) => (
                  <button
                    key={r}
                    onClick={() => { setBanReason(r); setBanReasonError(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-all flex items-center justify-between ${
                      banReason === r
                        ? "bg-red-500/10 border-red-500/40 text-white"
                        : "bg-[#141622] border-white/8 text-white/60 hover:border-white/20"
                    }`}
                  >
                    {r}
                    {banReason === r && (
                      <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {banReasonError && (
                <p className="text-red-400 text-xs mb-3 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Selectează un motiv pentru ban.
                </p>
              )}

              <div className="mt-4">
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                  Detalii suplimentare <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={banDetails}
                  onChange={(e) => setBanDetails(e.target.value)}
                  placeholder="Descrie mai detaliat motivul banului (comportament specific, dovezi, etc.)..."
                  rows={3}
                  className="w-full px-3.5 py-3 bg-[#141622] border border-white/8 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500/30 text-white text-sm placeholder:text-white/30 resize-none transition-colors"
                />
              </div>

              <div className="flex gap-2.5 mt-4">
                <button
                  onClick={() => setBanModal(null)}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/8 text-white/70 rounded-lg border border-white/10 text-sm transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={() => {
                    if (!banReason || !banDetails.trim()) { setBanReasonError(true); return; }
                    const fullReason = banDetails.trim() ? `${banReason} — ${banDetails.trim()}` : banReason;
                    onBanUser(banModal.userId, fullReason);
                    setBanModal(null);
                    setBanReason("");
                    setBanDetails("");
                  }}
                  disabled={!banReason || !banDetails.trim()}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${banReason && banDetails.trim() ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white' : 'bg-white/5 text-white/30 cursor-not-allowed'}`}
                >
                  Confirmă Ban
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}