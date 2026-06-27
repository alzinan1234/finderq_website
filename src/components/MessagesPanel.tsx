// @ts-nocheck
'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
const teemoBannerBottom = '/assets/2343242342.jpg';
import {
  MessageCircle, X, Send, ChevronDown, Users, UserMinus, ShieldOff,
  Minus, ShieldCheck, UserPlus, Check, Image, Smile, Trash2,
  Phone, Video, MoreHorizontal, Search, Reply, Copy, Forward,
} from 'lucide-react';
import { useOnlinePresence } from '@/hooks/useOnlinePresence';
import EmojiPicker from 'emoji-picker-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Friend {
  username: string;
  initials: string;
  color: string;
  lastMessage?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

interface FriendRequest {
  username: string;
  initials: string;
  color: string;
  mutualFriends?: number;
  timeAgo?: string;
}

interface MessagesPanelProps {
  friends: Friend[];
  onFriendClick: (username: string, initials: string, color: string) => void;
  onRemoveFriend: (username: string) => void;
  onViewProfile?: (username: string) => void;
  onAddFriend?: (friend: Friend) => void;
  openThreadRequest?: { username: string; initials: string; color: string } | null;
  onClearThreadRequest?: () => void;
  onThreadOpened?: () => void;
  currentUserId?: string | null;
}

interface ChatMessage {
  id: number;
  text: string;
  type: 'text' | 'image';
  sender: 'me' | 'them';
  time: string;
  reactions: Record<string, number>;
  replyTo?: { id: number; text: string; sender: 'me' | 'them' } | null;
}

interface OpenThread {
  username: string;
  initials: string;
  color: string;
  messages: ChatMessage[];
  minimized?: boolean;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_OPEN_THREADS = 3;
const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🔥', '👎', '🎉'];

// ─── MessagesPanel ───────────────────────────────────────────────────────────

export function MessagesPanel({
  friends,
  onFriendClick,
  onRemoveFriend,
  onViewProfile,
  onAddFriend,
  openThreadRequest,
  onClearThreadRequest,
  onThreadOpened,
  currentUserId,
}: MessagesPanelProps) {
  const { getUserStatus } = useOnlinePresence(currentUserId || null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'friends' | 'requests' | 'blocked'>('messages');
  const [searchQuery, setSearchQuery] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    { username: 'DragonSlayer99', initials: 'DS', color: 'from-red-500 to-orange-500', mutualFriends: 2, timeAgo: '2m ago' },
    { username: 'SilverBolt',     initials: 'SB', color: 'from-blue-400 to-cyan-500',  mutualFriends: 0, timeAgo: '1h ago' },
    { username: 'PentakillQueen', initials: 'PQ', color: 'from-purple-500 to-pink-500', mutualFriends: 4, timeAgo: '3h ago' },
  ]);
  const [blockConfirm, setBlockConfirm] = useState<{ username: string; initials: string; color: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<Array<{ username: string; initials: string; color: string }>>([
    { username: 'ToxicPlayer123', initials: 'TP', color: 'from-gray-500 to-gray-700' },
  ]);
  const [friendMenu, setFriendMenu] = useState<string | null>(null);
  const [openThreads, setOpenThreads] = useState<OpenThread[]>([
    {
      username: 'ShadowADC', initials: 'SA', color: 'from-blue-500 to-cyan-500',
      messages: [
        { id: 1, text: 'yo bro, good game earlier!', type: 'text', sender: 'them', time: '14:32', reactions: {}, replyTo: null },
        { id: 2, text: 'yeah that was insane, nice pentakill!', type: 'text', sender: 'me', time: '14:33', reactions: {}, replyTo: null },
        { id: 3, text: "gg wp bro, let's play again!", type: 'text', sender: 'them', time: '14:35', reactions: {}, replyTo: null },
      ],
    },
    {
      username: 'IronWolf99', initials: 'IW', color: 'from-red-500 to-orange-500',
      messages: [
        { id: 1, text: 'hey, u free for clash this weekend?', type: 'text', sender: 'them', time: '11:20', reactions: {}, replyTo: null },
        { id: 2, text: "yeah I'm in, what time?", type: 'text', sender: 'me', time: '11:22', reactions: {}, replyTo: null },
        { id: 3, text: 'Sunday 8pm works?', type: 'text', sender: 'them', time: '11:25', reactions: {}, replyTo: null },
      ],
    },
  ]);

  // #12 — No Audio() anywhere — sound is completely disabled

  const openThread = (username: string, initials: string, color: string) => {
    if (blockedUsers.find(b => b.username === username)) return;
    if (openThreads.find(t => t.username === username)) {
      setOpenThreads(prev => prev.map(t => t.username === username ? { ...t, minimized: false } : t));
      return;
    }
    if (openThreads.length >= MAX_OPEN_THREADS) {
      setOpenThreads(prev => prev.slice(1));
    }
    setOpenThreads(prev => [...prev, { username, initials, color, messages: [] }]);
    onThreadOpened?.();
  };

  const closeThread = (username: string) =>
    setOpenThreads(prev => prev.filter(t => t.username !== username));

  const sendMessage = (username: string, text: string, type: 'text' | 'image' = 'text', replyTo?: ChatMessage | null) => {
    const newMsg: ChatMessage = {
      id: Date.now(), text, type, sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
      replyTo: replyTo ? { id: replyTo.id, text: replyTo.text, sender: replyTo.sender } : null,
    };
    setOpenThreads(prev =>
      prev.map(t => t.username === username ? { ...t, messages: [...t.messages, newMsg] } : t)
    );
    if (type === 'text') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: Date.now() + 1,
          text: ['Nice! 👍', 'Sounds good!', 'haha fr', 'gg!', 'Let\'s gooo 🔥'][Math.floor(Math.random() * 5)],
          type: 'text', sender: 'them',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          reactions: {}, replyTo: null,
        };
        setOpenThreads(prev =>
          prev.map(t => t.username === username ? { ...t, messages: [...t.messages, reply] } : t)
        );
      }, 1200 + Math.random() * 800);
    }
  };

  const deleteMessage = (username: string, msgId: number) =>
    setOpenThreads(prev =>
      prev.map(t => t.username === username
        ? { ...t, messages: t.messages.filter(m => m.id !== msgId) }
        : t)
    );

  const addReaction = (username: string, msgId: number, emoji: string) =>
    setOpenThreads(prev =>
      prev.map(t => {
        if (t.username !== username) return t;
        return {
          ...t,
          messages: t.messages.map(m => {
            if (m.id !== msgId) return m;
            const reactions = { ...m.reactions };
            if (reactions[emoji]) {
              // Toggle off
              reactions[emoji]--;
              if (reactions[emoji] <= 0) delete reactions[emoji];
            } else {
              // Add reaction
              reactions[emoji] = 1;
            }
            return { ...m, reactions };
          }),
        };
      })
    );

  const blockUser = (username: string, initials: string, color: string) => {
    setBlockConfirm({ username, initials, color });
    setFriendMenu(null);
  };
  const confirmBlock = () => {
    if (!blockConfirm) return;
    setBlockedUsers(prev => [...prev, blockConfirm]);
    onRemoveFriend(blockConfirm.username);
    closeThread(blockConfirm.username);
    setBlockConfirm(null);
  };
  const unblockUser = (u: string) => setBlockedUsers(prev => prev.filter(b => b.username !== u));

  useEffect(() => {
    if (openThreadRequest) {
      openThread(openThreadRequest.username, openThreadRequest.initials, openThreadRequest.color);
      onClearThreadRequest?.();
    }
  }, [openThreadRequest]);

  const visibleFriends = friends.filter(f => !blockedUsers.find(b => b.username === f.username));
  const filteredFriends = visibleFriends.filter(f =>
    !searchQuery || f.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalUnread = visibleFriends.reduce((s, f) => s + (f.unreadCount || 0), 0);

  return (
    <>
      {/* ── Remove Friend Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-[#1e2130] rounded-2xl max-w-sm w-full border border-red-500/30 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-400" />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                  <UserMinus className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Remove Friend</h3>
                  <p className="text-white/40 text-xs">{deleteConfirm}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm">Are you sure you want to remove this friend? You can always re-add them later.</p>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm border border-white/10 transition-colors">Cancel</button>
                <button onClick={() => { onRemoveFriend(deleteConfirm); closeThread(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Block Modal ── */}
      {blockConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-[#1e2130] rounded-2xl max-w-sm w-full border border-orange-500/30 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-red-500" />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                  <ShieldOff className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Block User</h3>
                  <p className="text-white/40 text-xs">{blockConfirm.username}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm">Blocking this user will remove them from your friends list and prevent them from messaging you.</p>
              <div className="flex gap-2">
                <button onClick={() => setBlockConfirm(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-sm border border-white/10 transition-colors">Cancel</button>
                <button onClick={confirmBlock} className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all">Block</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Open Chat Threads ── */}
      <div className="fixed bottom-0 left-0 right-0 sm:left-0 sm:right-auto z-40 pointer-events-none px-4 sm:pl-72 flex flex-col-reverse sm:flex-row items-end gap-3 pb-12 sm:pb-0">
        {openThreads.map((thread, index) => (
          <div key={thread.username} className="pointer-events-auto w-full sm:w-[320px] flex-shrink-0" style={{ order: index }}>
            <ChatThread
              thread={thread}
              onClose={() => closeThread(thread.username)}
              onSendMessage={(text, type, replyTo) => sendMessage(thread.username, text, type, replyTo)}
              onDeleteMessage={(msgId) => deleteMessage(thread.username, msgId)}
              onAddReaction={(msgId, emoji) => addReaction(thread.username, msgId, emoji)}
              onViewProfile={onViewProfile}
              onToggleMinimize={() =>
                setOpenThreads(prev =>
                  prev.map(t => t.username === thread.username ? { ...t, minimized: !t.minimized } : t)
                )
              }
            />
          </div>
        ))}
      </div>

      {/* ── Main Panel ── */}
      <div
        className="fixed bottom-0 left-4 md:left-6 z-40 w-[calc(100%-32px)] sm:w-72 max-w-sm"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => { setIsOpen(false); setFriendMenu(null); }}
      >
        {isOpen && (
          <div className="mb-2 bg-[#13151f] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '76vh' }}>

            {/* Panel Header */}
            <div className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-[#00d4ff]/10 to-[#0044ff]/10 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-sm">Messages</h3>
                <span className="text-white/40 text-xs">{visibleFriends.length} friends</span>
              </div>
              {/* Search */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search friends..."
                  className="flex-1 bg-transparent text-white text-xs placeholder-white/30 focus:outline-none"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 flex-shrink-0 bg-[#0f1119]">
              {[
                { key: 'messages', label: 'Chats',    icon: <MessageCircle className="w-3 h-3" /> },
                { key: 'friends',  label: 'Friends',  icon: <Users className="w-3 h-3" /> },
                { key: 'requests', label: 'Requests', icon: <UserPlus className="w-3 h-3" />, badge: friendRequests.length },
                { key: 'blocked',  label: 'Blocked',  icon: <ShieldOff className="w-3 h-3" />, badge: blockedUsers.length },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-all min-w-0 relative ${
                    activeTab === tab.key
                      ? 'text-[#00d4ff]'
                      : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge ? (
                    <span className="absolute top-1 right-1.5 w-3.5 h-3.5 bg-[#00d4ff] rounded-full text-[8px] text-black font-bold flex items-center justify-center">
                      {tab.badge}
                    </span>
                  ) : null}
                  {activeTab === tab.key && (
                    <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>

              {/* ── Chats / Friends tab ── */}
              {(activeTab === 'messages' || activeTab === 'friends') && (
                filteredFriends.length === 0 ? (
                  <div className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                      <Users className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-white/30 text-xs">{searchQuery ? 'No results found' : 'No friends yet'}</p>
                  </div>
                ) : (
                  <div className="py-1">
                    {filteredFriends.map(friend => {
                      const status = getUserStatus(friend.username);
                      const isThreadOpen = !!openThreads.find(t => t.username === friend.username);
                      return (
                        <div key={friend.username} className="relative group">
                          <button
                            onClick={() => openThread(friend.username, friend.initials, friend.color)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors"
                          >
                            {/* Avatar */}
                            <div className="relative flex-shrink-0">
                              <div className={`w-9 h-9 bg-gradient-to-br ${friend.color} rounded-full flex items-center justify-center ring-2 ${isThreadOpen ? 'ring-[#00d4ff]/50' : 'ring-transparent'}`}>
                                <span className="text-white text-xs font-semibold">{friend.initials}</span>
                              </div>
                              <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#13151f] ${
                                status === 'online' ? 'bg-green-400' :
                                status === 'busy' ? 'bg-red-500' : 'bg-gray-600'
                              }`} />
                            </div>
                            {/* Info */}
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-white text-xs font-semibold truncate">{friend.username}</p>
                              <p className={`text-[10px] truncate ${
                                status === 'online' ? 'text-green-400' :
                                status === 'busy' ? 'text-red-400' : 'text-white/30'
                              }`}>
                                {status === 'online' ? 'Online' : status === 'busy' ? 'Busy' : 'Offline'}
                              </p>
                            </div>
                            {friend.unreadCount ? (
                              <span className="flex-shrink-0 w-5 h-5 bg-[#00d4ff] rounded-full text-[10px] text-black font-bold flex items-center justify-center">
                                {friend.unreadCount}
                              </span>
                            ) : null}
                          </button>

                          {/* Context menu button */}
                          <button
                            onClick={e => { e.stopPropagation(); setFriendMenu(friendMenu === friend.username ? null : friend.username); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-white/50"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>

                          {/* Dropdown */}
                          {friendMenu === friend.username && (
                            <div className="absolute right-2 bottom-full mb-1 bg-[#1e2130] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden min-w-[160px] py-1">
                              <button
                                onClick={() => { onViewProfile?.(friend.username); setFriendMenu(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-white/70 text-xs transition-colors"
                              ><Users className="w-3.5 h-3.5" />View Profile</button>
                              <div className="mx-2 my-1 border-t border-white/5" />
                              <button
                                onClick={() => { setDeleteConfirm(friend.username); setFriendMenu(null); }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 text-xs transition-colors"
                              ><UserMinus className="w-3.5 h-3.5" />Remove Friend</button>
                              <button
                                onClick={() => blockUser(friend.username, friend.initials, friend.color)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-500/10 text-orange-400 text-xs transition-colors"
                              ><ShieldOff className="w-3.5 h-3.5" />Block User</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {/* ── Requests tab ── */}
              {activeTab === 'requests' && (
                friendRequests.length === 0 ? (
                  <div className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                      <UserPlus className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-white/30 text-xs">No pending requests</p>
                  </div>
                ) : (
                  <div className="py-1 space-y-0.5">
                    {friendRequests.map(req => (
                      <div key={req.username} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/5 transition-colors">
                        <div className={`w-9 h-9 bg-gradient-to-br ${req.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white text-xs font-semibold">{req.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-xs font-semibold truncate">{req.username}</p>
                          <p className="text-white/30 text-[10px]">
                            {req.mutualFriends ? `${req.mutualFriends} mutual` : 'No mutuals'} · {req.timeAgo}
                          </p>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              onAddFriend?.({ username: req.username, initials: req.initials, color: req.color });
                              setFriendRequests(prev => prev.filter(r => r.username !== req.username));
                            }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/20 transition-colors"
                            title="Accept"
                          ><Check className="w-3.5 h-3.5" /></button>
                          <button
                            onClick={() => setFriendRequests(prev => prev.filter(r => r.username !== req.username))}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/10 transition-colors"
                            title="Decline"
                          ><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              )}

              {/* ── Blocked tab ── */}
              {activeTab === 'blocked' && (
                blockedUsers.length === 0 ? (
                  <div className="p-6 text-center space-y-2">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-6 h-6 text-white/20" />
                    </div>
                    <p className="text-white/30 text-xs">No blocked users</p>
                  </div>
                ) : (
                  <div className="py-1">
                    {blockedUsers.map(b => (
                      <div key={b.username} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/5">
                        <div className={`w-9 h-9 bg-gradient-to-br ${b.color} rounded-full flex items-center justify-center flex-shrink-0 opacity-30`}>
                          <span className="text-white text-xs">{b.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white/40 text-xs font-medium truncate">{b.username}</p>
                          <p className="text-orange-400/50 text-[10px]">Blocked</p>
                        </div>
                        <button
                          onClick={() => unblockUser(b.username)}
                          className="px-2.5 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[10px] font-semibold rounded-lg border border-green-500/20 flex items-center gap-1 transition-colors"
                        ><ShieldCheck className="w-3 h-3" />Unblock</button>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="relative px-3 py-2.5 flex items-center justify-between cursor-pointer select-none rounded-t-xl overflow-hidden">
          <img src={teemoBannerBottom} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
          <div className="relative flex items-center gap-2 z-10">
            <div className="relative">
              <MessageCircle className="w-4 h-4 text-white" />
              {totalUnread > 0 && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#00d4ff] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalUnread > 9 ? '9+' : totalUnread}
                </span>
              )}
            </div>
            <h3 className="text-white text-sm font-semibold drop-shadow">Messages</h3>
            {totalUnread > 0 && (
              <span className="px-1.5 py-0.5 bg-[#00d4ff]/20 text-[#00d4ff] text-[10px] font-bold rounded-full border border-[#00d4ff]/30">
                {totalUnread} new
              </span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-white/70 relative z-10 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </>
  );
}

// ─── ChatThread ───────────────────────────────────────────────────────────────

interface ChatThreadProps {
  thread: OpenThread;
  onClose: () => void;
  onSendMessage: (text: string, type?: 'text' | 'image', replyTo?: ChatMessage | null) => void;
  onDeleteMessage: (msgId: number) => void;
  onAddReaction: (msgId: number, emoji: string) => void;
  onViewProfile?: (username: string) => void;
  onToggleMinimize?: () => void;
}

function ChatThread({ thread, onClose, onSendMessage, onDeleteMessage, onAddReaction, onViewProfile, onToggleMinimize }: ChatThreadProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msg: ChatMessage } | null>(null);
  const [reactionTarget, setReactionTarget] = useState<number | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [msgDeleteConfirm, setMsgDeleteConfirm] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const minimized = thread.minimized ?? false;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef   = useRef<HTMLInputElement>(null);
  const emojiRef       = useRef<HTMLDivElement>(null);
  const contextRef     = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);

  // Close pickers on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmojiPicker(false);
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) { setContextMenu(null); setReactionTarget(null); setMsgDeleteConfirm(null); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = () => {
    const text = message.trim();
    if (!text) return;
    onSendMessage(text, 'text', replyTo);
    setMessage('');
    setReplyTo(null);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  // #13 — Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const src = ev.target?.result as string;
      setImagePreview(src);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const confirmSendImage = () => {
    if (!imagePreview) return;
    onSendMessage(imagePreview, 'image', null);
    setImagePreview(null);
  };

  // #14 — Right-click context menu with smart positioning
  const handleRightClick = (e: React.MouseEvent, msg: ChatMessage) => {
    e.preventDefault();
    e.stopPropagation();
    // Calculate safe position so menu never goes off screen
    const menuW = 180;
    const menuH = 200;
    const x = e.clientX + menuW > window.innerWidth  ? e.clientX - menuW : e.clientX;
    const y = e.clientY + menuH > window.innerHeight ? e.clientY - menuH : e.clientY;
    setContextMenu({ x, y, msg });
    setReactionTarget(null);
  };

  const truncate = (s: string, n = 36) => s.length > n ? s.slice(0, n) + '…' : s;

  return (
    <>
      {/* Image Preview Modal */}
      {imagePreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-[#1a1d29] rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-w-sm w-full">
            <div className="p-3 border-b border-white/10 flex items-center justify-between">
              <p className="text-white text-sm font-semibold">Send Image</p>
              <button onClick={() => setImagePreview(null)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4">
              <img src={imagePreview} alt="preview" className="w-full max-h-60 object-contain rounded-xl bg-black/30" />
            </div>
            <div className="p-3 border-t border-white/10 flex gap-2">
              <button onClick={() => setImagePreview(null)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl text-sm border border-white/10 transition-colors">Cancel</button>
              <button onClick={confirmSendImage} className="flex-1 py-2 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2">
                <Send className="w-3.5 h-3.5" /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right-click Context Menu (#14) */}
      {contextMenu && (
        <div
          ref={contextRef}
          className="fixed z-[99999] bg-[#1e2130] border border-white/10 rounded-xl shadow-2xl py-1 min-w-[160px] overflow-hidden"
          style={{ left: Math.min(contextMenu.x, window.innerWidth - 180), top: Math.min(contextMenu.y, window.innerHeight - 220) }}
        >
          {/* Reaction row */}
          <div className="px-2 py-1.5 flex gap-1 border-b border-white/10">
            {REACTION_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => { onAddReaction(contextMenu.msg.id, emoji); setContextMenu(null); }}
                className="text-base hover:scale-150 transition-transform duration-100 w-6 h-6 flex items-center justify-center"
              >{emoji}</button>
            ))}
          </div>

          {/* Actions */}
          <button
            onClick={() => { setReplyTo(contextMenu.msg); setContextMenu(null); inputRef.current?.focus(); }}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-white/70 text-xs transition-colors"
          ><Reply className="w-3.5 h-3.5" />Reply</button>

          {contextMenu.msg.type === 'text' && (
            <button
              onClick={() => { navigator.clipboard?.writeText(contextMenu.msg.text); setContextMenu(null); }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-white/5 text-white/70 text-xs transition-colors"
            ><Copy className="w-3.5 h-3.5" />Copy Text</button>
          )}

          {/* #14 — Delete own message */}
          {contextMenu.msg.sender === 'me' && (
            <>
              <div className="mx-2 my-1 border-t border-white/5" />
              {msgDeleteConfirm === contextMenu.msg.id ? (
                <div className="px-3 py-2">
                  <p className="text-white/50 text-[10px] mb-2">Delete this message?</p>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => { setMsgDeleteConfirm(null); }}
                      className="flex-1 py-1 bg-white/5 hover:bg-white/10 text-white/50 rounded-lg text-[10px] border border-white/10 transition-colors"
                    >Cancel</button>
                    <button
                      onClick={() => { onDeleteMessage(contextMenu.msg.id); setContextMenu(null); setMsgDeleteConfirm(null); }}
                      className="flex-1 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[10px] border border-red-500/20 font-semibold transition-colors"
                    >Delete</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setMsgDeleteConfirm(contextMenu.msg.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 text-xs transition-colors"
                ><Trash2 className="w-3.5 h-3.5" />Delete Message</button>
              )}
            </>
          )}
        </div>
      )}

      {/* Thread Window */}
      <div className={`bg-[#13151f] rounded-t-2xl border border-white/10 shadow-2xl flex flex-col w-full sm:w-[320px] transition-all duration-200 ${minimized ? '' : 'h-[420px]'}`}>

        {/* Header — blue gradient (#10) */}
        <div className="bg-gradient-to-r from-[#0066ff] to-[#00d4ff] px-3 py-2 rounded-t-2xl flex items-center justify-between flex-shrink-0 shadow-lg">
          <button
            className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left"
            onClick={() => onViewProfile?.(thread.username)}
          >
            <div className={`w-8 h-8 bg-gradient-to-br ${thread.color} rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white/30 shadow`}>
              <span className="text-white text-[11px] font-bold">{thread.initials}</span>
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-tight">{thread.username}</p>
              <p className="text-white/70 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                Active now
              </p>
            </div>
          </button>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={onToggleMinimize} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors" title={minimized ? 'Expand' : 'Minimize'}>
              <Minus className="w-3 h-3 text-white" />
            </button>
            <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors" title="Close">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 bg-[#0e1018]"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#ffffff10 transparent' }}>
              {thread.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                  <div className={`w-12 h-12 bg-gradient-to-br ${thread.color} rounded-full flex items-center justify-center shadow-lg opacity-60`}>
                    <span className="text-white text-sm font-bold">{thread.initials}</span>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs font-semibold">{thread.username}</p>
                    <p className="text-white/25 text-[10px] mt-0.5">Say hello! 👋</p>
                  </div>
                </div>
              ) : (
                thread.messages.map((msg, idx) => {
                  const isMe = msg.sender === 'me';
                  const prevMsg = idx > 0 ? thread.messages[idx - 1] : null;
                  const nextMsg = thread.messages[idx + 1] ?? null;
                  const prevSame = prevMsg?.sender === msg.sender;
                  const nextSame = nextMsg?.sender === msg.sender;
                  const isLast = !nextSame;

                  return (
                    <div
                      key={msg.id}
                      className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} ${prevSame ? 'mt-0.5' : 'mt-3'}`}
                    >
                      {/* Their avatar — only show on last in group */}
                      {!isMe && (
                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${thread.color} flex-shrink-0 flex items-center justify-center ${isLast ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="text-white text-[9px] font-bold">{thread.initials}</span>
                        </div>
                      )}

                      <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                        {/* Reply preview */}
                        {msg.replyTo && (
                          <div className={`flex items-center gap-1.5 mb-1 px-2 py-1 rounded-lg border-l-2 ${
                            isMe ? 'border-white/30 bg-white/5' : 'border-[#00d4ff]/40 bg-[#00d4ff]/5'
                          }`}>
                            <Reply className="w-2.5 h-2.5 text-white/30 flex-shrink-0" />
                            <p className="text-white/40 text-[10px] truncate max-w-[140px]">{truncate(msg.replyTo.text)}</p>
                          </div>
                        )}

                        {/* Bubble + hover quick actions */}
                        <div className="relative group/bubble">
                          {/* Quick action bar on hover */}
                          <div className={`absolute ${isMe ? 'right-full pr-1.5' : 'left-full pl-1.5'} top-1/2 -translate-y-1/2 hidden group-hover/bubble:flex items-center gap-0.5 bg-[#1e2130] border border-white/10 rounded-xl px-1.5 py-1 shadow-lg z-10`}>
                            {/* Quick react */}
                            {['❤️','👍','😂'].map(e => (
                              <button key={e} onClick={() => onAddReaction(msg.id, e)} className="text-sm hover:scale-125 transition-transform w-6 h-6 flex items-center justify-center">{e}</button>
                            ))}
                            <div className="w-px h-4 bg-white/10 mx-0.5" />
                            {/* Reply */}
                            <button onClick={() => { setReplyTo(msg); inputRef.current?.focus(); }} className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-[#00d4ff] transition-colors" title="Reply">
                              <Reply className="w-3 h-3" />
                            </button>
                            {/* More (right-click menu) */}
                            <button onClick={e => handleRightClick(e as any, msg)} className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors" title="More">
                              <MoreHorizontal className="w-3 h-3" />
                            </button>
                          </div>

                          <div
                            className={`relative rounded-2xl ${
                              isMe
                                ? 'bg-gradient-to-br from-[#0066ff] to-[#00d4ff] text-white rounded-br-sm'
                                : 'bg-[#1e2130] text-white rounded-bl-sm'
                            } ${msg.type === 'image' ? 'p-1' : 'px-3 py-2'} cursor-pointer select-none`}
                            onContextMenu={e => handleRightClick(e, msg)}
                          >
                            {msg.type === 'image' ? (
                              <img src={msg.text} alt="img" className="max-w-full rounded-xl max-h-44 object-contain block" />
                            ) : (
                              <p className="text-xs leading-relaxed break-words whitespace-pre-wrap">{msg.text}</p>
                            )}
                          </div>
                        </div>

                        {/* Reactions (#16) */}
                        {Object.keys(msg.reactions).length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {Object.entries(msg.reactions).map(([emoji, count]) => (
                              <button
                                key={emoji}
                                onClick={() => onAddReaction(msg.id, emoji)}
                                className="flex items-center gap-0.5 px-2 py-0.5 bg-[#1e2130] hover:bg-[#252a3a] border border-white/15 rounded-full text-[11px] text-white/80 transition-all hover:scale-105 active:scale-95 shadow-sm"
                                title={`${count} reaction${count !== 1 ? 's' : ''} — click to toggle`}
                              >
                                <span>{emoji}</span>
                                {count > 1 && <span className="text-white/40 ml-0.5 text-[10px]">{count}</span>}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Time — show at last of group */}
                        {isLast && (
                          <p className="text-white/20 text-[9px] mt-1 px-0.5">{msg.time}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Bar */}
            {replyTo && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0a0c14] border-t border-white/5">
                <Reply className="w-3 h-3 text-[#00d4ff] flex-shrink-0" />
                <p className="flex-1 text-white/50 text-[10px] truncate">
                  Replying to <span className="text-white/70 font-medium">{replyTo.sender === 'me' ? 'yourself' : thread.username}</span>: {truncate(replyTo.text, 40)}
                </p>
                <button onClick={() => setReplyTo(null)} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* #15 — Emoji Picker */}
            {showEmojiPicker && (
              <div ref={emojiRef} className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/10">
                <EmojiPicker
                  onEmojiClick={data => { setMessage(prev => prev + data.emoji); inputRef.current?.focus(); }}
                  theme="dark"
                  width={300}
                  height={340}
                  searchDisabled={false}
                  skinTonesDisabled
                  previewConfig={{ showPreview: false }}
                />
              </div>
            )}

            {/* Input Bar */}
            <div className="px-2.5 py-2 border-t border-white/10 bg-[#13151f] flex-shrink-0 relative">
              <div className="flex items-center gap-1.5 bg-[#0e1018] border border-white/10 rounded-2xl px-2.5 py-1.5 focus-within:border-[#00d4ff]/40 transition-colors">

                {/* #13 — Image button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-white/30 hover:text-[#00d4ff] transition-colors flex-shrink-0 w-6 h-6 flex items-center justify-center"
                  title="Send image"
                >
                  <Image className="w-3.5 h-3.5" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

                {/* Text input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder={`Message ${thread.username}…`}
                  className="flex-1 bg-transparent text-white text-xs placeholder-white/25 focus:outline-none min-w-0"
                />

                {/* #15 — Emoji button */}
                <button
                  onClick={() => setShowEmojiPicker(p => !p)}
                  className={`flex-shrink-0 w-6 h-6 flex items-center justify-center transition-colors ${showEmojiPicker ? 'text-[#00d4ff]' : 'text-white/30 hover:text-[#00d4ff]'}`}
                  title="Emoji"
                >
                  <Smile className="w-3.5 h-3.5" />
                </button>

                {/* Send */}
                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    message.trim()
                      ? 'bg-gradient-to-br from-[#0066ff] to-[#00d4ff] hover:opacity-90 shadow-sm shadow-[#00d4ff]/20'
                      : 'bg-white/5 cursor-not-allowed'
                  }`}
                  title="Send"
                >
                  <Send className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}