// @ts-nocheck
'use client'
import { X, Users, FileText, AlertTriangle, Settings, BarChart3, Ban, CheckCircle, Trash2, Search, Filter, Shield, Crown, Eye, TrendingUp, Activity, UserX, AlertOctagon, Clock, Pause, ChevronDown, XCircle, MessageCircle, Send, Trophy } from "lucide-react";
import { useState } from "react";
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
  region: string;
  status: string;
  joinDate: string;
  posts: number;
  reports: number;
  riotVerified: boolean;
  timeoutUntil?: string | null;
  warnings?: number;
  warningsList?: Warning[];
}

interface Post {
  id: number;
  author: string;
  content: string;
  region: string;
  date: string;
  status: string;
  reports: number;
  type: string;
}

interface Report {
  id: number;
  reportedUser: string;
  reportedBy: string;
  reason: string;
  post: string;
  date: string;
  status: string;
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

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: "dashboard" | "users" | "posts" | "reports" | "support" | "tournaments";
  onTabChange: (tab: "dashboard" | "users" | "posts" | "reports" | "support" | "tournaments") => void;
  users: User[];
  posts: Post[];
  reports: Report[];
  settings: AdminSettings;
  pendingTournaments: Tournament[];
  onBanUser: (userId: number) => void;
  onDeleteUser: (userId: number) => void;
  onViewUserProfile: (userId: number) => void;
  onApprovePost: (postId: number) => void;
  onDeletePost: (postId: number) => void;
  onResolveReport: (reportId: number) => void;
  onTakeAction: (reportId: number) => void;
  onApproveTournament: (tournamentId: number) => void;
  onRejectTournament: (tournamentId: number, reason: string) => void;
  onUpdateSettings: (settings: AdminSettings) => void;
  onWarnUser?: (userId: number) => void;
  onTimeoutUser?: (userId: number, hours: number) => void;
  userRole?: "owner" | "admin" | "moderator";
  supportConversations?: any;
  onSendSupportMessage?: (userId: string, message: any) => void;
  selectedSupportUser?: string | null;
  onSelectSupportUser?: (userId: string | null) => void;
  closedSupportConversations?: Set<string>;
  onCloseSupportConversation?: (userId: string) => void;
  onReopenSupportConversation?: (userId: string) => void;
}

export function AdminPanel({ 
  isOpen, 
  onClose, 
  activeTab, 
  onTabChange,
  users,
  posts,
  reports,
  settings,
  pendingTournaments,
  onBanUser,
  onDeleteUser,
  onViewUserProfile,
  onApprovePost,
  onDeletePost,
  onResolveReport,
  onTakeAction,
  onApproveTournament,
  onRejectTournament,
  onUpdateSettings,
  onWarnUser,
  onTimeoutUser,
  userRole,
  supportConversations = {},
  onSendSupportMessage,
  selectedSupportUser,
  onSelectSupportUser,
  closedSupportConversations = new Set(),
  onCloseSupportConversation,
  onReopenSupportConversation
}: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [postSearchTerm, setPostSearchTerm] = useState("");
  const [postFilterStatus, setPostFilterStatus] = useState("all");
  const [reportFilterStatus, setReportFilterStatus] = useState("all");
  const [activeReportDropdown, setActiveReportDropdown] = useState<number | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  if (!isOpen) return null;

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.author.toLowerCase().includes(postSearchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(postSearchTerm.toLowerCase());
    const matchesFilter = postFilterStatus === "all" || post.status === postFilterStatus;
    return matchesSearch && matchesFilter;
  });

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesFilter = reportFilterStatus === "all" || report.status === reportFilterStatus;
    return matchesFilter;
  });

  const pendingReportsCount = reports.filter(r => r.status === "pending").length;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0e1a] rounded-2xl max-w-7xl w-full h-[90vh] relative border-2 border-[#c89b3c] shadow-2xl shadow-[#c89b3c]/20 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#c89b3c] to-[#a67c2f] p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
                <p className="text-white/80 text-sm">FinderQ Moderation Dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors bg-white/10 rounded-full p-2 hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#0f1420] border-b border-white/10 px-6 flex gap-2 flex-shrink-0">
          <button
            onClick={() => onTabChange("dashboard")}
            className={`px-4 py-3 flex items-center gap-2 transition-all relative ${
              activeTab === "dashboard"
                ? "text-[#c89b3c]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Dashboard</span>
            {activeTab === "dashboard" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#a67c2f]" />
            )}
          </button>
          <button
            onClick={() => onTabChange("users")}
            className={`px-4 py-3 flex items-center gap-2 transition-all relative ${
              activeTab === "users"
                ? "text-[#c89b3c]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Users</span>
            {activeTab === "users" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#a67c2f]" />
            )}
          </button>
          <button
            onClick={() => onTabChange("posts")}
            className={`px-4 py-3 flex items-center gap-2 transition-all relative ${
              activeTab === "posts"
                ? "text-[#c89b3c]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">Posts</span>
            {activeTab === "posts" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#a67c2f]" />
            )}
          </button>
          <button
            onClick={() => onTabChange("reports")}
            className={`px-4 py-3 flex items-center gap-2 transition-all relative ${
              activeTab === "reports"
                ? "text-[#c89b3c]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Reports</span>
            {pendingReportsCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingReportsCount}
              </span>
            )}
            {activeTab === "reports" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#a67c2f]" />
            )}
          </button>
          <button
            onClick={() => onTabChange("support")}
            className={`px-4 py-3 flex items-center gap-2 transition-all relative ${
              activeTab === "support"
                ? "text-[#c89b3c]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Support</span>
            {supportConversations && Object.keys(supportConversations).length > 0 && (
              <span className="bg-[#00d4ff] text-white text-xs px-1.5 py-0.5 rounded-full">
                {Object.keys(supportConversations).length}
              </span>
            )}
            {activeTab === "support" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#a67c2f]" />
            )}
          </button>
          <button
            onClick={() => onTabChange("tournaments")}
            className={`px-4 py-3 flex items-center gap-2 transition-all relative ${
              activeTab === "tournaments"
                ? "text-[#c89b3c]"
                : "text-white/60 hover:text-white/80"
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">Tournaments</span>
            {pendingTournaments.length > 0 && (
              <span className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingTournaments.length}
              </span>
            )}
            {activeTab === "tournaments" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#a67c2f]" />
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-[#1a1d29] to-[#0f1420] rounded-xl p-6 border border-[#00d4ff]/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#00d4ff]" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">Total Users</h3>
                  <p className="text-white text-3xl font-bold">{users.length}</p>
                  <p className="text-green-400 text-xs mt-2">+{users.filter(u => u.joinDate === "2026-01-05" || u.joinDate === "2026-01-06").length} this week</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1d29] to-[#0f1420] rounded-xl p-6 border border-[#c89b3c]/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#c89b3c]/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#c89b3c]" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">Total Posts</h3>
                  <p className="text-white text-3xl font-bold">{posts.length}</p>
                  <p className="text-green-400 text-xs mt-2">+{posts.filter(p => p.date === "2026-01-06").length} today</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1d29] to-[#0f1420] rounded-xl p-6 border border-red-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <Activity className="w-5 h-5 text-red-400" />
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">Pending Reports</h3>
                  <p className="text-white text-3xl font-bold">{pendingReportsCount}</p>
                  <p className="text-red-400 text-xs mt-2">Needs attention</p>
                </div>
                <div className="bg-gradient-to-br from-[#1a1d29] to-[#0f1420] rounded-xl p-6 border border-green-500/20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-white/60 text-sm mb-1">Verified Users</h3>
                  <p className="text-white text-3xl font-bold">
                    {users.filter(u => u.riotVerified).length}
                  </p>
                  <p className="text-green-400 text-xs mt-2">
                    {users.length > 0 ? Math.round((users.filter(u => u.riotVerified).length / users.length) * 100) : 0}% of total
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search users by username or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#1a1d29] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#00d4ff]/50"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00d4ff]/50"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="warned">Warned</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
              <div className="bg-[#1a1d29] rounded-xl border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#0f1420] border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-white/80 text-sm font-medium">User</th>
                      <th className="px-4 py-3 text-left text-white/80 text-sm font-medium">Region</th>
                      <th className="px-4 py-3 text-left text-white/80 text-sm font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-white/80 text-sm font-medium">Posts</th>
                      <th className="px-4 py-3 text-left text-white/80 text-sm font-medium">Reports</th>
                      <th className="px-4 py-3 text-left text-white/80 text-sm font-medium">Warnings</th>
                      <th className="px-4 py-3 text-left text-white/80 text-sm font-medium">Verified</th>
                      <th className="px-4 py-3 text-right text-white/80 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-[#0f1420]/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div>
                              <p className="text-white text-sm font-medium">{user.username}</p>
                              <p className="text-white/50 text-xs">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-[#00d4ff]/10 text-[#00d4ff] rounded text-xs">
                            {user.region}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.status === "active" ? "bg-green-500/10 text-green-400" :
                              user.status === "warned" ? "bg-yellow-500/10 text-yellow-400" :
                              "bg-red-500/10 text-red-400"
                            }`}>
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </span>
                            {user.timeoutUntil && new Date(user.timeoutUntil) > new Date() && (
                              <span className="px-2 py-1 bg-orange-500/10 text-orange-400 rounded text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Timeout
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-white text-sm">{user.posts}</td>
                        <td className="px-4 py-3">
                          <span className={`text-sm ${user.reports > 0 ? "text-red-400 font-medium" : "text-white/50"}`}>
                            {user.reports}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {user.warningsList && user.warningsList.length > 0 ? (
                            <span className="text-yellow-400 text-sm font-medium">{user.warningsList.length}</span>
                          ) : (
                            <span className="text-white/30 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {user.riotVerified ? (
                            <CheckCircle className="w-4 h-4 text-[#00d4ff]" />
                          ) : (
                            <span className="text-white/30 text-xs">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => onViewUserProfile(user.id)}
                              className="p-1.5 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 text-[#00d4ff] rounded transition-colors"
                              title="View Profile">
                              <Eye className="w-4 h-4" />
                            </button>
                            {user.status !== 'banned' && onWarnUser && (
                              <button 
                                onClick={() => onWarnUser(user.id)}
                                className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded transition-colors"
                                title="Warn User">
                                <AlertOctagon className="w-4 h-4" />
                              </button>
                            )}
                            {user.status !== 'banned' && onTimeoutUser && (
                              <button 
                                onClick={() => onTimeoutUser(user.id, 1)}
                                className="p-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded transition-colors"
                                title="Timeout User">
                                <Clock className="w-4 h-4" />
                              </button>
                            )}
                            <button 
                              onClick={() => onBanUser(user.id)}
                              className={`p-1.5 rounded transition-colors ${
                                user.status === 'banned' 
                                  ? 'bg-green-500/10 hover:bg-green-500/20 text-green-400' 
                                  : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                              }`}
                              title={user.status === 'banned' ? 'Unban User' : 'Ban User'}>
                              {user.status === 'banned' ? <UserX className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => onDeleteUser(user.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-colors"
                              title="Delete User">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search posts by author or content..."
                    value={postSearchTerm}
                    onChange={(e) => setPostSearchTerm(e.target.value)}
                    className="w-full bg-[#1a1d29] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-[#00d4ff]/50"
                  />
                </div>
                <select 
                  value={postFilterStatus}
                  onChange={(e) => setPostFilterStatus(e.target.value)}
                  className="bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00d4ff]/50">
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="flagged">Flagged</option>
                </select>
              </div>
              <div className="space-y-3">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="bg-[#1a1d29] rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium text-sm">{post.author}</span>
                          <span className="px-2 py-0.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded text-xs">
                            {post.region}
                          </span>
                          <span className="px-2 py-0.5 bg-[#c89b3c]/10 text-[#c89b3c] rounded text-xs">
                            {post.type}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ${
                            post.status === "approved" ? "bg-green-500/10 text-green-400" :
                            post.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-red-500/10 text-red-400"
                          }`}>
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm mb-2">{post.content}</p>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/50 text-xs">
                          <span>{post.date}</span>
                          {post.reports > 0 && (
                            <span className="text-red-400 font-medium">{post.reports} reports</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {post.status === "pending" && (
                          <button 
                            onClick={() => onApprovePost(post.id)}
                            className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm transition-colors flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </button>
                        )}
                        <button 
                          onClick={() => onDeletePost(post.id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors flex items-center gap-1">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <select 
                  value={reportFilterStatus}
                  onChange={(e) => setReportFilterStatus(e.target.value)}
                  className="bg-[#1a1d29] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#00d4ff]/50">
                  <option value="all">All Reports</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="space-y-3">
                {filteredReports.map((report) => (
                  <div key={report.id} className="bg-[#1a1d29] rounded-xl p-4 border border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <span className="text-white font-medium text-sm">
                            Report against <span className="text-red-400">{report.reportedUser}</span>
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs ml-auto ${
                            report.status === "pending" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-green-500/10 text-green-400"
                          }`}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <p className="text-white/60">Reported by: <span className="text-white/80">{report.reportedBy}</span></p>
                          <p className="text-white/60">Reason: <span className="text-white/80">{report.reason}</span></p>
                          <p className="text-white/60">Related post: <span className="text-[#00d4ff]">{report.post}</span></p>
                          <p className="text-white/50 text-xs">{report.date}</p>
                        </div>
                      </div>
                      {report.status === "pending" && (
                        <div className="flex gap-2 ml-4">
                          <button 
                            onClick={() => onResolveReport(report.id)}
                            className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg text-sm transition-colors">
                            Resolve
                          </button>
                          <div className="relative">
                            <button 
                              onClick={() => setActiveReportDropdown(activeReportDropdown === report.id ? null : report.id)}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm transition-colors flex items-center gap-1">
                              Take Action
                              <ChevronDown className="w-3 h-3" />
                            </button>
                            
                            {activeReportDropdown === report.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-[#1a1d29] border border-white/10 rounded-lg shadow-xl z-10 py-1">
                                {onWarnUser && (
                                  <button
                                    onClick={() => {
                                      const userId = users.find(u => u.username === report.reportedUser)?.id;
                                      if (userId) onWarnUser(userId);
                                      setActiveReportDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-yellow-400 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                                  >
                                    <AlertOctagon className="w-4 h-4" />
                                    Warn User
                                  </button>
                                )}
                                
                                {onTimeoutUser && (userRole === "admin" || userRole === "moderator" || userRole === "owner") && (
                                  <button
                                    onClick={() => {
                                      const userId = users.find(u => u.username === report.reportedUser)?.id;
                                      if (userId) onTimeoutUser(userId, 1);
                                      setActiveReportDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-orange-400 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                                  >
                                    <Clock className="w-4 h-4" />
                                    Timeout 1 hour
                                  </button>
                                )}
                                
                                {onTimeoutUser && (userRole === "admin" || userRole === "moderator" || userRole === "owner") && (
                                  <button
                                    onClick={() => {
                                      const userId = users.find(u => u.username === report.reportedUser)?.id;
                                      if (userId) onTimeoutUser(userId, 5);
                                      setActiveReportDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-orange-400 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                                  >
                                    <Pause className="w-4 h-4" />
                                    Timeout 5 hours
                                  </button>
                                )}
                                
                                {(userRole === "admin" || userRole === "owner") && (
                                  <button
                                    onClick={() => {
                                      const userId = users.find(u => u.username === report.reportedUser)?.id;
                                      if (userId) onBanUser(userId);
                                      setActiveReportDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                                  >
                                    <Ban className="w-4 h-4" />
                                    Ban User
                                  </button>
                                )}
                                
                                <button
                                  onClick={() => {
                                    const postId = posts.find(p => p.content.includes(report.post.substring(0, 20)))?.id;
                                    if (postId) onDeletePost(postId);
                                    setActiveReportDropdown(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete Post
                                </button>
                                
                                {(userRole === "admin" || userRole === "owner") && (
                                  <button
                                    onClick={() => {
                                      const userId = users.find(u => u.username === report.reportedUser)?.id;
                                      if (userId && confirm(`Permanently delete user ${report.reportedUser}?`)) {
                                        onDeleteUser(userId);
                                      }
                                      setActiveReportDropdown(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-white/5 transition-colors flex items-center gap-2 text-sm border-t border-white/10"
                                  >
                                    <UserX className="w-4 h-4" />
                                    Delete User (Permanent)
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Support Tab */}
          {activeTab === "support" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-[calc(100vh-300px)]">
                <div className="col-span-1 bg-[#1a1d29] rounded-xl border border-white/10 overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-[#00d4ff]" />
                      Active Conversations
                    </h3>
                    <p className="text-white/60 text-xs mt-1">{supportConversations ? Object.keys(supportConversations).length : 0} total</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {!supportConversations || Object.keys(supportConversations).length === 0 ? (
                      <div className="p-4 sm:p-6 md:p-8 text-center">
                        <MessageCircle className="w-12 h-12 text-white/20 mx-auto mb-3" />
                        <p className="text-white/40 text-sm">No active conversations</p>
                      </div>
                    ) : (
                      Object.keys(supportConversations).map((userId) => {
                        const messages = supportConversations[userId];
                        const lastMessage = messages[messages.length - 1];
                        const unreadCount = messages.filter((m: any) => m.sender === "user").length;
                        
                        return (
                          <button
                            key={userId}
                            onClick={() => onSelectSupportUser?.(userId)}
                            className={`w-full p-4 text-left border-b border-white/5 transition-colors ${
                              selectedSupportUser === userId
                                ? "bg-[#00d4ff]/10 border-l-4 border-l-[#00d4ff]"
                                : "hover:bg-white/5"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-white font-medium truncate">{userId}</p>
                                  {closedSupportConversations.has(userId) && (
                                    <span className="bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded-full border border-red-500/30">
                                      🔒
                                    </span>
                                  )}
                                  {!closedSupportConversations.has(userId) && unreadCount > 0 && (
                                    <span className="bg-[#00d4ff] text-white text-xs px-1.5 py-0.5 rounded-full">
                                      {unreadCount}
                                    </span>
                                  )}
                                </div>
                                <p className="text-white/60 text-xs truncate">{lastMessage.content}</p>
                              </div>
                              <span className="text-white/40 text-xs whitespace-nowrap">{lastMessage.timestamp}</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                <div className="col-span-2 bg-[#1a1d29] rounded-xl border border-white/10 flex flex-col overflow-hidden">
                  {selectedSupportUser ? (
                    <>
                      <div className="p-4 border-b border-white/10 bg-gradient-to-r from-[#00d4ff]/10 to-transparent">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold flex items-center gap-2">
                              {selectedSupportUser}
                              {closedSupportConversations.has(selectedSupportUser) && (
                                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                                  🔒 Closed
                                </span>
                              )}
                            </h3>
                            <p className="text-white/60 text-xs">Support Conversation</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {closedSupportConversations.has(selectedSupportUser) ? (
                              <button
                                onClick={() => onReopenSupportConversation?.(selectedSupportUser)}
                                className="px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-xs font-medium transition-colors border border-green-500/30"
                              >
                                🔓 Reopen
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (confirm(`Close support conversation with ${selectedSupportUser}?`)) {
                                    onCloseSupportConversation?.(selectedSupportUser);
                                  }
                                }}
                                className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-xs font-medium transition-colors border border-red-500/30"
                              >
                                🔒 Close
                              </button>
                            )}
                            <button
                              onClick={() => onSelectSupportUser?.(null)}
                              className="text-white/60 hover:text-white transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 p-4 overflow-y-auto space-y-4">
                        {supportConversations && selectedSupportUser && supportConversations[selectedSupportUser]?.map((message: any) => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
                          >
                            <div className={`max-w-[70%] ${message.sender === "user" ? "order-1" : "order-2"}`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium ${message.sender === "user" ? "text-[#00d4ff]" : "text-green-400"}`}>
                                  {message.senderName}
                                </span>
                                <span className="text-xs text-white/40">{message.timestamp}</span>
                              </div>
                              <div
                                className={`rounded-2xl px-4 py-2.5 ${
                                  message.sender === "user"
                                    ? "bg-[#242836] text-white border border-white/10"
                                    : "bg-gradient-to-br from-green-500/20 to-green-600/20 text-white border border-green-500/30"
                                }`}
                              >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-4 border-t border-white/10">
                        <div className="flex items-end gap-2">
                          <textarea
                            placeholder="Type your response..."
                            rows={2}
                            className="flex-1 px-4 py-3 bg-[#242836] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                const textarea = e.currentTarget;
                                if (textarea.value.trim() && onSendSupportMessage && selectedSupportUser && supportConversations) {
                                  const newMessage = {
                                    id: (supportConversations[selectedSupportUser]?.length || 0) + 1,
                                    sender: "support" as const,
                                    senderName: "FinderQ Support",
                                    content: textarea.value,
                                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                  };
                                  onSendSupportMessage(selectedSupportUser, newMessage);
                                  textarea.value = "";
                                }
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const textarea = e.currentTarget.previousElementSibling as HTMLTextAreaElement;
                              if (textarea.value.trim() && onSendSupportMessage && selectedSupportUser && supportConversations) {
                                const newMessage = {
                                  id: (supportConversations[selectedSupportUser]?.length || 0) + 1,
                                  sender: "support" as const,
                                  senderName: "FinderQ Support",
                                  content: textarea.value,
                                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                };
                                onSendSupportMessage(selectedSupportUser, newMessage);
                                textarea.value = "";
                              }
                            }}
                            className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                          >
                            <Send className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <MessageCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/60 text-lg font-medium mb-2">No Conversation Selected</p>
                        <p className="text-white/40 text-sm">Select a conversation from the list to respond</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tournaments Tab */}
          {activeTab === "tournaments" && (
            <TournamentApproval
              pendingTournaments={pendingTournaments}
              onApproveTournament={onApproveTournament}
              onRejectTournament={onRejectTournament}
            />
          )}
        </div>
      </div>
    </div>
  );
}