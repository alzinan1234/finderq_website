// @ts-nocheck
// Initial data for admin panel

export const initialAdminUsers = [
  { id: 99, username: "eve", email: "eve@example.com", region: "EUW", status: "banned", joinDate: "2026-01-01", posts: 0, reports: 0, riotVerified: false, warnings: 5, warningsList: [] },
  { id: 1, username: "Player123", email: "player123@example.com", region: "EUW", status: "active", joinDate: "2025-12-15", posts: 24, reports: 0, riotVerified: true, rank: "Gold III", lp: 72, warnings: 0, warningsList: [] },
  { id: 2, username: "SupportMain", email: "support@example.com", region: "EUNE", status: "active", joinDate: "2025-12-20", posts: 18, reports: 0, riotVerified: true, rank: "Platinum I", lp: 55, warnings: 0, warningsList: [] },
  { id: 3, username: "ToxicUser", email: "toxic@example.com", region: "EUW", status: "warned", joinDate: "2026-01-01", posts: 45, reports: 3, riotVerified: false, warnings: 3, warningsList: [
    { id: 1, reason: "Inappropriate language in chat", date: "2026-01-02", issuedBy: "Admin" },
    { id: 2, reason: "Spamming posts", date: "2026-01-04", issuedBy: "Moderator" },
    { id: 3, reason: "Harassment of other users", date: "2026-01-05", issuedBy: "Admin" }
  ] },
  { id: 4, username: "BannedPlayer", email: "banned@example.com", region: "EUNE", status: "banned", joinDate: "2025-11-10", posts: 67, reports: 8, riotVerified: false, warnings: 5, warningsList: [
    { id: 1, reason: "Toxic behavior", date: "2025-11-15", issuedBy: "Admin" },
    { id: 2, reason: "Multiple reports for toxicity", date: "2025-11-20", issuedBy: "Moderator" },
    { id: 3, reason: "Continued harassment", date: "2025-11-25", issuedBy: "Admin" },
    { id: 4, reason: "Offensive username", date: "2025-12-01", issuedBy: "Owner" },
    { id: 5, reason: "Final warning before ban", date: "2025-12-10", issuedBy: "Owner" }
  ] },
  { id: 5, username: "NewPlayer", email: "new@example.com", region: "EUW", status: "active", joinDate: "2026-01-05", posts: 2, reports: 0, riotVerified: false, warnings: 0, warningsList: [] },
];

export const initialAdminPosts = [
  { id: 1, author: "Player123", content: "Looking for Duo ADC Main, Gold+", region: "EUW", date: "2026-01-06", status: "approved", reports: 0, type: "Support Live" },
  { id: 2, author: "SupportMain", content: "Coaching sessions available - Diamond Support", region: "EUNE", date: "2026-01-06", status: "approved", reports: 0, type: "Earn as you go" },
  { id: 3, author: "ToxicUser", content: "Selling boosting services cheap!", region: "EUW", date: "2026-01-06", status: "pending", reports: 2, type: "Support Live" },
  { id: 4, author: "NewPlayer", content: "LF Mentor for ranked climb", region: "EUW", date: "2026-01-06", status: "approved", reports: 0, type: "Support Live" },
  { id: 5, author: "ToxicUser", content: "Inappropriate content here...", region: "EUW", date: "2026-01-05", status: "flagged", reports: 5, type: "Earn as you go" },
];

export const initialAdminReports = [
  { id: 1, reportedUser: "ToxicUser", reportedBy: "Player123", reason: "Inappropriate content", post: "Post #3", date: "2026-01-06", status: "pending" },
  { id: 2, reportedUser: "ToxicUser", reportedBy: "SupportMain", reason: "Spam", post: "Post #5", date: "2026-01-06", status: "pending" },
  { id: 3, reportedUser: "BannedPlayer", reportedBy: "NewPlayer", reason: "Harassment", post: "Post #12", date: "2026-01-05", status: "resolved" },
  { id: 4, reportedUser: "ToxicUser", reportedBy: "Player123", reason: "Scam attempt", post: "Post #3", date: "2026-01-05", status: "pending" },
];

export const initialAdminSettings = {
  autoApprove: true,
  requireRiotVerification: false,
  enableReporting: true,
  maintenanceMode: false,
  siteName: "FinderQ",
  riotApiKey: ""
};

export const defaultOwnerUsers = [
  { id: 1, username: "AdminUser", email: "admin@finderq.com", role: "admin" as const, status: "active", joinDate: "2025-12-01", lastActive: "2 hours ago", permissions: ["manage_users", "manage_posts"], actions: 145, warnings: 0, warningsList: [], timeoutUntil: null },
  { id: 2, username: "ModUser", email: "mod@finderq.com", role: "moderator" as const, status: "active", joinDate: "2025-12-15", lastActive: "1 day ago", permissions: ["manage_posts"], actions: 89, warnings: 0, warningsList: [], timeoutUntil: null },
  { id: 10, username: "testmod", email: "testmod@finderq.com", role: "moderator" as const, status: "active", joinDate: "2026-06-13", lastActive: "now", permissions: ["view_support", "manage_reports", "view_warnings", "view_activity"], actions: 0, warnings: 0, warningsList: [], timeoutUntil: null },
  { id: 11, username: "evt", email: "evt@finderq.com", role: "moderator" as const, status: "active", joinDate: "2026-06-13", lastActive: "now", permissions: [], actions: 0, warnings: 0, warningsList: [], timeoutUntil: null },
  { id: 12, username: "evx", email: "evx@finderq.com", role: "owner" as const, status: "active", joinDate: "2026-06-13", lastActive: "now", permissions: ["manage_users", "manage_posts", "manage_reports", "ban_users", "timeout_users", "warn_users", "delete_content", "view_analytics", "manage_settings", "manage_tournaments", "create_posts", "send_messages", "report_content", "view_support", "view_warnings", "view_activity", "view_banned"], actions: 0, warnings: 0, warningsList: [], timeoutUntil: null },
  { id: 3, username: "Player123", email: "player@finderq.com", role: "user" as const, status: "active", joinDate: "2026-01-01", lastActive: "5 mins ago", permissions: [], actions: 12, warnings: 0, warningsList: [], timeoutUntil: null },
  { id: 4, username: "ToxicUser", email: "toxic@finderq.com", role: "user" as const, status: "warned", joinDate: "2026-01-03", lastActive: "today", permissions: [], actions: 3, warnings: 4, warningsList: [
    { id: 1, reason: "Inappropriate language in chat", date: "2026-01-02", issuedBy: "Admin" },
    { id: 2, reason: "Spamming multiple posts", date: "2026-01-03", issuedBy: "Moderator" },
    { id: 3, reason: "Harassment of other users", date: "2026-01-04", issuedBy: "Admin" },
    { id: 4, reason: "Offensive content in posts", date: "2026-01-05", issuedBy: "Owner" }
  ], timeoutUntil: null },
  { id: 5, username: "BannedToxic", email: "bannedtoxic@finderq.com", role: "user" as const, status: "banned", joinDate: "2025-12-20", lastActive: "3 days ago", permissions: [], actions: 8, warnings: 5, warningsList: [
    { id: 1, reason: "Extreme toxicity", date: "2025-12-22", issuedBy: "Moderator" },
    { id: 2, reason: "Death threats to players", date: "2025-12-25", issuedBy: "Admin" },
    { id: 3, reason: "Racism in chat", date: "2025-12-28", issuedBy: "Admin" },
    { id: 4, reason: "Doxxing attempts", date: "2026-01-01", issuedBy: "Owner" },
    { id: 5, reason: "Auto-Ban: 5 warnings reached", date: "2026-01-03", issuedBy: "System" }
  ], timeoutUntil: null },
];
