// @ts-nocheck
'use client'
import React, { useState, useRef, useEffect } from 'react';
const teemoBannerBottom = '/assets/2343242342.jpg';
import { MessageCircle, X, Send, ChevronDown, Users, UserMinus, ShieldOff, Minus, ShieldCheck, UserPlus, Check, Image, Smile, Trash2 } from 'lucide-react';
import { useOnlinePresence } from '@/hooks/useOnlinePresence';
import EmojiPicker from 'emoji-picker-react';

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
}

interface OpenThread {
  username: string;
  initials: string;
  color: string;
  messages: ChatMessage[];
  minimized?: boolean;
}

const MAX_OPEN_THREADS = 3;
const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

export function MessagesPanel({ friends, onFriendClick, onRemoveFriend, onViewProfile, onAddFriend, openThreadRequest, onThreadOpened, currentUserId }: MessagesPanelProps) {
  const { getUserStatus } = useOnlinePresence(currentUserId || null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'friends' | 'requests' | 'blocked'>('messages');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    { username: "DragonSlayer99", initials: "DS", color: "from-red-500 to-orange-500", mutualFriends: 2, timeAgo: "2m ago" },
    { username: "SilverBolt", initials: "SB", color: "from-blue-400 to-cyan-500", mutualFriends: 0, timeAgo: "1h ago" },
    { username: "PentakillQueen", initials: "PQ", color: "from-purple-500 to-pink-500", mutualFriends: 4, timeAgo: "3h ago" },
  ]);
  const [blockConfirm, setBlockConfirm] = useState<{ username: string; initials: string; color: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<Array<{ username: string; initials: string; color: string }>>([
    { username: "ToxicPlayer123", initials: "TP", color: "from-gray-500 to-gray-700" },
  ]);
  const [friendMenu, setFriendMenu] = useState<string | null>(null);
  const [openThreads, setOpenThreads] = useState<OpenThread[]>([
    {
      username: "ShadowADC", initials: "SA", color: "from-blue-500 to-cyan-500",
      messages: [
        { id: 1, text: "yo bro, good game earlier!", type: 'text', sender: "them", time: "14:32", reactions: {} },
        { id: 2, text: "yeah that was insane, nice pentakill!", type: 'text', sender: "me", time: "14:33", reactions: {} },
        { id: 3, text: "gg wp bro, let's play again!", type: 'text', sender: "them", time: "14:35", reactions: {} },
      ]
    },
    {
      username: "IronWolf99", initials: "IW", color: "from-red-500 to-orange-500",
      messages: [
        { id: 1, text: "hey, u free for clash this weekend?", type: 'text', sender: "them", time: "11:20", reactions: {} },
        { id: 2, text: "yeah I'm in, what time?", type: 'text', sender: "me", time: "11:22", reactions: {} },
        { id: 3, text: "Sunday 8pm works?", type: 'text', sender: "them", time: "11:25", reactions: {} },
      ]
    },
  ]);

  // #12 — No sound at all

  const openThread = (username: string, initials: string, color: string) => {
    if (blockedUsers.find(b => b.username === username)) return;
    if (openThreads.find(t => t.username === username)) return;
    if (openThreads.length >= MAX_OPEN_THREADS) {
      alert(`Max ${MAX_OPEN_THREADS} open chats. Close one first.`);
      return;
    }
    setOpenThreads(prev => [...prev, { username, initials, color, messages: [] }]);
    if (onThreadOpened) onThreadOpened();
  };

  const closeThread = (username: string) => setOpenThreads(prev => prev.filter(t => t.username !== username));

  const sendMessage = (username: string, text: string, type: 'text' | 'image' = 'text') => {
    const newMsg: ChatMessage = {
      id: Date.now(), text, type, sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      reactions: {}
    };
    setOpenThreads(prev => prev.map(t => t.username === username ? { ...t, messages: [...t.messages, newMsg] } : t));
    if (type === 'text') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: Date.now() + 1, text: 'Hey! Thanks for your message! 👋', type: 'text', sender: 'them',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          reactions: {}
        };
        setOpenThreads(prev => prev.map(t => t.username === username ? { ...t, messages: [...t.messages, reply] } : t));
      }, 1500);
    }
  };

  const deleteMessage = (username: string, msgId: number) => {
    setOpenThreads(prev => prev.map(t => t.username === username ? { ...t, messages: t.messages.filter(m => m.id !== msgId) } : t));
  };

  const addReaction = (username: string, msgId: number, emoji: string) => {
    setOpenThreads(prev => prev.map(t => {
      if (t.username !== username) return t;
      return {
        ...t,
        messages: t.messages.map(m => {
          if (m.id !== msgId) return m;
          const reactions = { ...m.reactions };
          reactions[emoji] = (reactions[emoji] || 0) + 1;
          return { ...m, reactions };
        })
      };
    }));
  };

  const blockUser = (username: string, initials: string, color: string) => { setBlockConfirm({ username, initials, color }); setFriendMenu(null); };
  const confirmBlock = () => {
    if (!blockConfirm) return;
    setBlockedUsers(prev => [...prev, blockConfirm]);
    onRemoveFriend(blockConfirm.username);
    closeThread(blockConfirm.username);
    setBlockConfirm(null);
  };
  const unblockUser = (username: string) => setBlockedUsers(prev => prev.filter(b => b.username !== username));

  useEffect(() => {
    if (openThreadRequest) openThread(openThreadRequest.username, openThreadRequest.initials, openThreadRequest.color);
  }, [openThreadRequest]);

  const visibleFriends = friends.filter(f => !blockedUsers.find(b => b.username === f.username));

  return (
    <>
      {/* Delete Friend Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-[#1e2130] rounded-2xl max-w-sm w-full border border-red-500/30 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-400" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20"><UserMinus className="w-5 h-5 text-red-400" /></div>
                <div><h3 className="text-white font-bold">Remove Friend</h3><p className="text-white/50 text-xs">{deleteConfirm}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-sm border border-white/10 transition-colors">Cancel</button>
                <button onClick={() => { onRemoveFriend(deleteConfirm); closeThread(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg text-sm font-semibold transition-all">Remove</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {blockConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
          <div className="bg-[#1e2130] rounded-2xl max-w-sm w-full border border-orange-500/30 shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-red-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20"><ShieldOff className="w-5 h-5 text-orange-400" /></div>
                <div><h3 className="text-white font-bold">Block User</h3><p className="text-white/50 text-xs">{blockConfirm.username}</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setBlockConfirm(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-sm border border-white/10 transition-colors">Cancel</button>
                <button onClick={confirmBlock} className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-red-500 text-white rounded-lg text-sm font-semibold transition-all">Block</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Threads */}
      <div className="fixed bottom-0 left-0 right-0 sm:right-auto z-40 pointer-events-none px-4 sm:pl-72 flex flex-col-reverse sm:flex-row items-end gap-3 pb-12 sm:pb-0">
        {openThreads.map((thread, index) => (
          <div key={thread.username} className="pointer-events-auto w-full sm:w-72 flex-shrink-0" style={{ order: index }}>
            <ChatThread
              thread={thread}
              onClose={() => closeThread(thread.username)}
              onSendMessage={(text, type) => sendMessage(thread.username, text, type)}
              onDeleteMessage={(msgId) => deleteMessage(thread.username, msgId)}
              onAddReaction={(msgId, emoji) => addReaction(thread.username, msgId, emoji)}
              onViewProfile={onViewProfile}
              onToggleMinimize={() => setOpenThreads(prev => prev.map(t => t.username === thread.username ? { ...t, minimized: !t.minimized } : t))}
            />
          </div>
        ))}
      </div>

      {/* Main Panel */}
      <div
        className="fixed bottom-0 left-4 md:left-6 z-40 w-[calc(100%-32px)] sm:w-64 max-w-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setFriendMenu(null); }}
      >
        {isHovered && (
          <div className="mb-2 bg-[#1a1d29] rounded-t-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[75vh] flex flex-col animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex border-b border-white/10 flex-shrink-0">
              {[
                { key: 'messages', label: 'Messages', icon: <MessageCircle className="w-3.5 h-3.5" />, color: 'text-[#00d4ff] border-[#00d4ff]' },
                { key: 'friends', label: 'Friends', icon: <Users className="w-3.5 h-3.5" />, color: 'text-[#00d4ff] border-[#00d4ff]' },
                { key: 'requests', label: 'Requests', icon: <UserPlus className="w-3.5 h-3.5" />, color: 'text-green-400 border-green-400', badge: friendRequests.length },
                { key: 'blocked', label: 'Blocked', icon: <ShieldOff className="w-3.5 h-3.5" />, color: 'text-orange-400 border-orange-400', badge: blockedUsers.length },
              ].map(tab => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                  className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors min-w-0 ${activeTab === tab.key ? `${tab.color} border-b-2` : 'text-white/50 hover:text-white/80'}`}>
                  {tab.icon}
                  <span className="flex items-center gap-0.5">{tab.label}{tab.badge ? <span className="px-1 bg-current/20 rounded-full text-[9px] opacity-70">{tab.badge}</span> : null}</span>
                </button>
              ))}
            </div>

            <div className="h-[220px] overflow-y-auto">
              {(activeTab === 'messages' || activeTab === 'friends') && (
                visibleFriends.length === 0 ? (
                  <div className="p-4 text-center"><Users className="w-8 h-8 text-white/20 mx-auto mb-2" /><p className="text-white/40 text-xs">No friends yet</p></div>
                ) : (
                  <div className="divide-y divide-white/5">
                    {visibleFriends.map((friend) => {
                      const status = getUserStatus(friend.username);
                      return (
                        <div key={friend.username} className="relative flex items-center gap-2 p-2 hover:bg-white/5 transition-colors group">
                          <button onClick={() => openThread(friend.username, friend.initials, friend.color)} className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="relative flex-shrink-0">
                              <div className={`w-9 h-9 bg-gradient-to-br ${friend.color} rounded-full flex items-center justify-center`}>
                                <span className="text-white text-xs">{friend.initials}</span>
                              </div>
                              <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1a1d29] ${status === 'online' ? 'bg-yellow-400' : status === 'busy' ? 'bg-red-500' : 'bg-gray-500'}`} />
                            </div>
                            <div className="flex-1 min-w-0 text-left">
                              <p className="text-white text-xs font-medium truncate">{friend.username}</p>
                              <p className={`text-xs ${status === 'online' ? 'text-yellow-400' : status === 'busy' ? 'text-red-400' : 'text-white/30'}`}>
                                {status === 'online' ? '● Online' : status === 'busy' ? '● Busy' : '● Offline'}
                              </p>
                            </div>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setFriendMenu(friendMenu === friend.username ? null : friend.username); }} className="w-6 h-6 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-white/50 text-xs">···</button>
                          {friendMenu === friend.username && (
                            <div className="absolute right-2 bottom-9 bg-[#242836] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden min-w-[140px]">
                              <button onClick={() => { setDeleteConfirm(friend.username); setFriendMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 text-xs transition-colors"><UserMinus className="w-3.5 h-3.5" />Remove Friend</button>
                              <button onClick={() => blockUser(friend.username, friend.initials, friend.color)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-500/10 text-orange-400 text-xs transition-colors"><ShieldOff className="w-3.5 h-3.5" />Block</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )
              )}

              {activeTab === 'requests' && (
                friendRequests.length === 0
                  ? <div className="p-4 text-center"><UserPlus className="w-8 h-8 text-white/20 mx-auto mb-2" /><p className="text-white/40 text-xs">No requests</p></div>
                  : <div className="divide-y divide-white/5">
                    {friendRequests.map(req => (
                      <div key={req.username} className="flex items-center gap-2 p-2.5 hover:bg-white/5 transition-colors">
                        <div className={`w-9 h-9 bg-gradient-to-br ${req.color} rounded-full flex items-center justify-center flex-shrink-0`}><span className="text-white text-xs">{req.initials}</span></div>
                        <div className="flex-1 min-w-0"><p className="text-white text-xs font-medium truncate">{req.username}</p><p className="text-white/30 text-[10px]">{req.mutualFriends ? `${req.mutualFriends} mutual` : 'No mutual'} · {req.timeAgo}</p></div>
                        <div className="flex gap-1">
                          <button onClick={() => { onAddFriend?.({ username: req.username, initials: req.initials, color: req.color }); setFriendRequests(prev => prev.filter(r => r.username !== req.username)); }} className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setFriendRequests(prev => prev.filter(r => r.username !== req.username))} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
              )}

              {activeTab === 'blocked' && (
                blockedUsers.length === 0
                  ? <div className="p-4 text-center"><ShieldCheck className="w-8 h-8 text-white/20 mx-auto mb-2" /><p className="text-white/40 text-xs">No blocked users</p></div>
                  : <div className="divide-y divide-white/5">
                    {blockedUsers.map(blocked => (
                      <div key={blocked.username} className="flex items-center gap-2 p-2 hover:bg-white/5">
                        <div className={`w-9 h-9 bg-gradient-to-br ${blocked.color} rounded-full flex items-center justify-center flex-shrink-0 opacity-40`}><span className="text-white text-xs">{blocked.initials}</span></div>
                        <div className="flex-1 min-w-0"><p className="text-white/50 text-xs truncate">{blocked.username}</p><p className="text-orange-400/60 text-[10px]">Blocked</p></div>
                        <button onClick={() => unblockUser(blocked.username)} className="px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs rounded-lg border border-green-500/20 flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Unblock</button>
                      </div>
                    ))}
                  </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        {(() => {
          const totalUnread = visibleFriends.reduce((sum, f) => sum + (f.unreadCount || 0), 0);
          return (
            <div className="relative px-3 py-2.5 flex items-center justify-between cursor-pointer select-none rounded-t-lg overflow-hidden">
              <img src={teemoBannerBottom} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative flex items-center gap-2 z-10">
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-white" />
                  {totalUnread > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">{totalUnread > 9 ? '9+' : totalUnread}</span>}
                </div>
                <h3 className="text-white text-sm font-medium drop-shadow">Messages</h3>
              </div>
              <ChevronDown className="w-4 h-4 text-white relative z-10" />
            </div>
          );
        })()}
      </div>
    </>
  );
}

// ─── ChatThread ───────────────────────────────────────────────────────────────
interface ChatThreadProps {
  thread: OpenThread;
  onClose: () => void;
  onSendMessage: (text: string, type?: 'text' | 'image') => void;
  onDeleteMessage: (msgId: number) => void;
  onAddReaction: (msgId: number, emoji: string) => void;
  onViewProfile?: (username: string) => void;
  onToggleMinimize?: () => void;
}

function ChatThread({ thread, onClose, onSendMessage, onDeleteMessage, onAddReaction, onViewProfile, onToggleMinimize }: ChatThreadProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [reactionTarget, setReactionTarget] = useState<number | null>(null);
  const minimized = thread.minimized ?? false;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) setShowEmojiPicker(false);
      setReactionTarget(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    onSendMessage(message, 'text');
    setMessage('');
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onSendMessage(ev.target?.result as string, 'image');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className={`bg-[#1a1d29] rounded-t-2xl border border-white/10 shadow-2xl flex flex-col w-full sm:w-72 ${minimized ? 'h-auto' : 'h-80 sm:h-[380px]'} transition-all duration-200`}>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#00d4ff] to-[#0099cc] px-3 py-2 rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <button className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left" onClick={() => onViewProfile?.(thread.username)}>
          <div className={`w-7 h-7 bg-gradient-to-br ${thread.color} rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-white/20`}>
            <span className="text-white text-[10px] font-bold">{thread.initials}</span>
          </div>
          <div>
            <p className="text-white text-xs font-semibold leading-tight">{thread.username}</p>
            <p className="text-white/60 text-[10px]">Active now</p>
          </div>
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onToggleMinimize} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"><Minus className="w-3 h-3 text-white" /></button>
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"><X className="w-3 h-3 text-white" /></button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 bg-[#12141f]">
            {thread.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-1">
                <MessageCircle className="w-6 h-6 text-[#00d4ff] opacity-40" />
                <p className="text-white/30 text-xs">No messages yet</p>
              </div>
            ) : thread.messages.map((msg, idx) => {
              const isMe = msg.sender === 'me';
              const prevSame = idx > 0 && thread.messages[idx - 1].sender === msg.sender;
              return (
                <div
                  key={msg.id}
                  className={`flex items-end gap-1.5 ${isMe ? 'justify-end' : 'justify-start'} ${prevSame ? 'mt-0.5' : 'mt-2'}`}
                  onMouseEnter={() => setHoveredMsg(msg.id)}
                  onMouseLeave={() => setHoveredMsg(null)}
                >
                  {/* Avatar them */}
                  {!isMe && (
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${thread.color} flex-shrink-0 flex items-center justify-center ${prevSame ? 'invisible' : ''}`}>
                      <span className="text-white text-[8px] font-bold">{thread.initials}</span>
                    </div>
                  )}

                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[78%]`}>
                    {/* Bubble */}
                    <div className={`relative rounded-2xl px-3 py-1.5 ${isMe ? 'bg-gradient-to-br from-[#00d4ff] to-[#0099cc] rounded-br-sm' : 'bg-[#242836] rounded-bl-sm'}`}>
                      {msg.type === 'image' ? (
                        <img src={msg.text} alt="img" className="max-w-full rounded-xl max-h-36 object-contain" />
                      ) : (
                        <p className="text-white text-xs leading-relaxed break-words">{msg.text}</p>
                      )}

                      {/* Hover actions */}
                      {hoveredMsg === msg.id && (
                        <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 ${isMe ? '-left-16' : '-right-16'}`}>
                          <button
                            onClick={(e) => { e.stopPropagation(); setReactionTarget(reactionTarget === msg.id ? null : msg.id); }}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1e2130] border border-white/10 hover:bg-[#2e3347] text-xs"
                          >😊</button>
                          {isMe && (
                            <button
                              onClick={() => onDeleteMessage(msg.id)}
                              className="w-6 h-6 flex items-center justify-center rounded-full bg-[#1e2130] border border-white/10 hover:bg-red-500/20 hover:border-red-400/30 transition-colors"
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Reaction popup */}
                      {reactionTarget === msg.id && (
                        <div className={`absolute bottom-full mb-1.5 bg-[#1e2130] border border-white/10 rounded-2xl px-2 py-1 flex gap-1.5 z-50 shadow-2xl ${isMe ? 'right-0' : 'left-0'}`} onClick={e => e.stopPropagation()}>
                          {REACTION_EMOJIS.map(emoji => (
                            <button key={emoji} onClick={() => { onAddReaction(msg.id, emoji); setReactionTarget(null); }} className="text-lg hover:scale-150 transition-transform duration-100">{emoji}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reactions */}
                    {Object.keys(msg.reactions).length > 0 && (
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {Object.entries(msg.reactions).map(([emoji, count]) => (
                          <span key={emoji} className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#1e2130] border border-white/10 rounded-full text-[10px] text-white/70">{emoji} {count}</span>
                        ))}
                      </div>
                    )}

                    {/* Time (only last in group) */}
                    {(!thread.messages[idx + 1] || thread.messages[idx + 1].sender !== msg.sender) && (
                      <p className="text-white/25 text-[9px] mt-0.5 px-1">{msg.time}</p>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Picker */}
          {showEmojiPicker && (
            <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-50">
              <EmojiPicker
                onEmojiClick={(data) => setMessage(prev => prev + data.emoji)}
                theme="dark"
                width={280}
                height={320}
                searchDisabled={false}
                skinTonesDisabled
                previewConfig={{ showPreview: false }}
              />
            </div>
          )}

          {/* Input */}
          <div className="p-2 border-t border-white/10 bg-[#1a1d29] flex-shrink-0">
            <div className="flex items-center gap-1.5 bg-[#12141f] border border-white/10 rounded-2xl px-2.5 py-1.5">
              {/* Image */}
              <button onClick={() => fileInputRef.current?.click()} className="text-white/40 hover:text-[#00d4ff] transition-colors flex-shrink-0" title="Send image">
                <Image className="w-4 h-4" />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

              {/* Text */}
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={`Message ${thread.username}...`}
                className="flex-1 bg-transparent text-white text-xs placeholder-white/30 focus:outline-none"
              />

              {/* Emoji */}
              <button onClick={() => setShowEmojiPicker(prev => !prev)} className={`flex-shrink-0 transition-colors ${showEmojiPicker ? 'text-[#00d4ff]' : 'text-white/40 hover:text-[#00d4ff]'}`}>
                <Smile className="w-4 h-4" />
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all ${message.trim() ? 'bg-gradient-to-br from-[#00d4ff] to-[#0099cc] hover:opacity-90' : 'bg-white/10 cursor-not-allowed'}`}
              >
                <Send className="w-3 h-3 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}