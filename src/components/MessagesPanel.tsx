// @ts-nocheck
'use client'
import React, { useState, useRef } from 'react';
const teemoBannerBottom = '/assets/2343242342.jpg';
import { MessageCircle, X, Send, ChevronDown, Users, UserMinus, ShieldOff, Minus, ShieldCheck, UserPlus, Check } from 'lucide-react';
import { useOnlinePresence } from '@/hooks/useOnlinePresence';

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
  reactions?: Record<string, string[]>;
}

interface OpenThread {
  username: string;
  initials: string;
  color: string;
  messages: ChatMessage[];
  minimized?: boolean;
}

const MAX_OPEN_THREADS = 3;

const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','😢','😡','👍','👎','❤️','🔥','🎉','💯','🙏','👏','🤣','😅','😭','🥺','✨','💪','🚀','🎮','⚡'];
const REACTION_EMOJIS = ['❤️','👍','😂','😮','😢','😡'];

export function MessagesPanel({ friends, onFriendClick, onRemoveFriend, onViewProfile, onAddFriend, openThreadRequest, onThreadOpened, currentUserId }: MessagesPanelProps) {
  const { getUserStatus } = useOnlinePresence(currentUserId || null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'friends' | 'requests' | 'blocked'>('messages');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([
    { username: "DragonSlayer99", initials: "DS", color: "from-red-500 to-orange-500", mutualFriends: 2, timeAgo: "2m ago" },
    { username: "SilverBolt", initials: "SB", color: "from-blue-400 to-cyan-500", mutualFriends: 0, timeAgo: "1h ago" },
    { username: "PentakillQueen", initials: "PQ", color: "from-purple-500 to-pink-500", mutualFriends: 4, timeAgo: "3h ago" },
  ]);
  const [blockConfirm, setBlockConfirm] = useState<{username: string; initials: string; color: string} | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [blockedUsers, setBlockedUsers] = useState<Array<{username: string; initials: string; color: string}>>([
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

  // #12 — Sound removed: playBuzzSound function deleted entirely

  const openThread = (username: string, initials: string, color: string) => {
    if (blockedUsers.find(b => b.username === username)) return;
    if (openThreads.find(t => t.username === username)) return;
    if (openThreads.length >= MAX_OPEN_THREADS) {
      alert(`Poți deschide maxim ${MAX_OPEN_THREADS} conversații simultan. Închide una pentru a deschide alta.`);
      return;
    }
    // No sound played on open (#12 fix)
    setOpenThreads([...openThreads, { username, initials, color, messages: [] }]);
    if (onThreadOpened) onThreadOpened();
  };

  const closeThread = (username: string) => {
    setOpenThreads(openThreads.filter(t => t.username !== username));
  };

  const sendMessage = (username: string, text: string, type: 'text' | 'image' = 'text') => {
    setOpenThreads(prev => prev.map(thread => {
      if (thread.username !== username) return thread;
      return {
        ...thread,
        messages: [...thread.messages, {
          id: Date.now(),
          text,
          type,
          sender: 'me' as const,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          reactions: {}
        }]
      };
    }));

    // Auto-reply (no sound)
    if (type === 'text') {
      setTimeout(() => {
        setOpenThreads(prev => prev.map(thread => {
          if (thread.username !== username) return thread;
          return {
            ...thread,
            messages: [...thread.messages, {
              id: Date.now(),
              text: 'Hey! Thanks for your message! 👋',
              type: 'text' as const,
              sender: 'them' as const,
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              reactions: {}
            }]
          };
        }));
      }, 2000);
    }
  };

  // #14 — Delete message
  const deleteMessage = (username: string, msgId: number) => {
    setOpenThreads(prev => prev.map(thread => {
      if (thread.username !== username) return thread;
      return { ...thread, messages: thread.messages.filter(m => m.id !== msgId) };
    }));
  };

  // #16 — Reaction
  const addReaction = (username: string, msgId: number, emoji: string) => {
    setOpenThreads(prev => prev.map(thread => {
      if (thread.username !== username) return thread;
      return {
        ...thread,
        messages: thread.messages.map(m => {
          if (m.id !== msgId) return m;
          const reactions = { ...(m.reactions || {}) };
          if (!reactions[emoji]) reactions[emoji] = [];
          if (reactions[emoji].includes('me')) {
            reactions[emoji] = reactions[emoji].filter(u => u !== 'me');
            if (reactions[emoji].length === 0) delete reactions[emoji];
          } else {
            reactions[emoji] = [...reactions[emoji], 'me'];
          }
          return { ...m, reactions };
        })
      };
    }));
  };

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

  const unblockUser = (username: string) => {
    setBlockedUsers(prev => prev.filter(b => b.username !== username));
  };

  React.useEffect(() => {
    if (openThreadRequest) openThread(openThreadRequest.username, openThreadRequest.initials, openThreadRequest.color);
  }, [openThreadRequest]);

  const visibleFriends = friends.filter(f => !blockedUsers.find(b => b.username === f.username));

  return (
    <>
      {/* Delete Friend Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-y-auto z-[99999] p-4">
          <div className="bg-[#1e2130] rounded-2xl max-w-sm w-full border border-red-500/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-400" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                  <UserMinus className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Șterge prieten</h3>
                  <p className="text-white/50 text-xs">{deleteConfirm}</p>
                </div>
              </div>
              <div className="bg-[#141622] rounded-xl p-4 mb-5 space-y-2">
                <p className="text-white/70 text-xs font-medium mb-2">După ce ștergi acest prieten:</p>
                <div className="flex items-start gap-2"><span className="text-red-400 text-xs mt-0.5">✕</span><p className="text-white/60 text-xs">Va fi șters din lista ta de prieteni</p></div>
                <div className="flex items-start gap-2"><span className="text-red-400 text-xs mt-0.5">✕</span><p className="text-white/60 text-xs">Conversația nu va mai fi accesibilă</p></div>
                <div className="flex items-start gap-2"><span className="text-green-400 text-xs mt-0.5">✓</span><p className="text-white/60 text-xs">Îl poți adăuga din nou oricând</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-sm border border-white/10 transition-colors">Anulează</button>
                <button onClick={() => { onRemoveFriend(deleteConfirm); closeThread(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-lg text-sm font-semibold transition-all">Da, șterge</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {blockConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center overflow-y-auto z-[99999] p-4">
          <div className="bg-[#1e2130] rounded-2xl max-w-sm w-full border border-orange-500/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="h-1 bg-gradient-to-r from-orange-600 via-orange-400 to-red-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20">
                  <ShieldOff className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Blochează utilizator</h3>
                  <p className="text-white/50 text-xs">{blockConfirm.username}</p>
                </div>
              </div>
              <div className="bg-[#141622] rounded-xl p-4 mb-5 space-y-2">
                <p className="text-white/70 text-xs font-medium mb-2">După ce blochezi acest utilizator:</p>
                <div className="flex items-start gap-2"><span className="text-red-400 text-xs mt-0.5">✕</span><p className="text-white/60 text-xs">Nu mai pot să îți trimită mesaje</p></div>
                <div className="flex items-start gap-2"><span className="text-red-400 text-xs mt-0.5">✕</span><p className="text-white/60 text-xs">Nu mai pot să te vadă în căutare</p></div>
                <div className="flex items-start gap-2"><span className="text-red-400 text-xs mt-0.5">✕</span><p className="text-white/60 text-xs">Va fi șters din lista ta de prieteni</p></div>
                <div className="flex items-start gap-2"><span className="text-green-400 text-xs mt-0.5">✓</span><p className="text-white/60 text-xs">Poți da unblock oricând din lista Blocked</p></div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setBlockConfirm(null)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 rounded-lg text-sm border border-white/10 transition-colors">Anulează</button>
                <button onClick={confirmBlock} className="flex-1 py-2.5 bg-gradient-to-r from-orange-600 to-red-500 hover:from-orange-700 hover:to-red-600 text-white rounded-lg text-sm font-semibold transition-all">Da, blochează</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Threads */}
      <div className="fixed bottom-0 left-0 right-0 sm:right-auto z-40 pointer-events-none px-4 sm:pl-72 flex flex-col-reverse sm:flex-row items-end gap-3 max-w-full overflow-x-auto sm:overflow-x-visible pb-12 sm:pb-0">
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

      {/* Master Main Panel */}
      <div
        className="fixed bottom-0 left-4 md:left-6 z-40 w-[calc(100%-32px)] sm:w-64 max-w-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setFriendMenu(null); }}
      >
        {isHovered && (
          <div className="mb-2 bg-[#1a1d29] rounded-t-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[75vh] flex flex-col animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex border-b border-white/10 flex-shrink-0 overflow-x-auto">
              <button onClick={() => setActiveTab('messages')} className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors min-w-[55px] ${activeTab === 'messages' ? 'text-[#00d4ff] border-b-2 border-[#00d4ff]' : 'text-white/50 hover:text-white/80'}`}>
                <MessageCircle className="w-3.5 h-3.5" />Messages
              </button>
              <button onClick={() => setActiveTab('friends')} className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors min-w-[55px] ${activeTab === 'friends' ? 'text-[#00d4ff] border-b-2 border-[#00d4ff]' : 'text-white/50 hover:text-white/80'}`}>
                <Users className="w-3.5 h-3.5" />Friends
              </button>
              <button onClick={() => setActiveTab('requests')} className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors min-w-[55px] ${activeTab === 'requests' ? 'text-green-400 border-b-2 border-green-400' : 'text-white/50 hover:text-white/80'}`}>
                <UserPlus className="w-3.5 h-3.5" />
                <span className="flex items-center gap-0.5">Requests {friendRequests.length > 0 && <span className="px-1 bg-green-500/20 text-green-400 rounded-full text-[9px]">{friendRequests.length}</span>}</span>
              </button>
              <button onClick={() => setActiveTab('blocked')} className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 px-1 text-[10px] font-medium transition-colors min-w-[55px] ${activeTab === 'blocked' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-white/50 hover:text-white/80'}`}>
                <ShieldOff className="w-3.5 h-3.5" />
                <span className="flex items-center gap-0.5">Blocked {blockedUsers.length > 0 && <span className="px-1 bg-orange-500/20 text-orange-400 rounded-full text-[9px]">{blockedUsers.length}</span>}</span>
              </button>
            </div>

            <div className="h-[220px] overflow-y-auto custom-scrollbar flex-1">
              {activeTab !== 'blocked' && activeTab !== 'requests' && (
                <div>
                  {visibleFriends.length === 0 ? (
                    <div className="p-4 text-center">
                      <Users className="w-8 h-8 text-white/20 mx-auto mb-2" />
                      <p className="text-white/40 text-xs">No {activeTab === 'messages' ? 'conversations' : 'friends'} yet</p>
                    </div>
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
                                {status === 'online' && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-400 rounded-full border-2 border-[#1a1d29]" />}
                                {status === 'busy' && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1d29]" />}
                                {status === 'offline' && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-500 rounded-full border-2 border-[#1a1d29]" />}
                              </div>
                              <div className="flex-1 min-w-0 text-left">
                                <p className="text-white text-xs font-medium truncate">{friend.username}</p>
                                {activeTab === 'messages' && friend.lastMessage && <p className="text-white/50 text-xs truncate">{friend.lastMessage}</p>}
                                {activeTab === 'friends' && <p className={`text-xs ${status === 'online' ? 'text-yellow-400' : status === 'busy' ? 'text-red-400' : 'text-white/30'}`}>{status === 'online' ? '● Online' : status === 'busy' ? '● Busy' : '● Offline'}</p>}
                              </div>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setFriendMenu(friendMenu === friend.username ? null : friend.username); }} className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-lg opacity-100 sm:opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-white/50 font-bold text-xs">···</button>
                            {friendMenu === friend.username && (
                              <div className="absolute right-2 bottom-9 bg-[#242836] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden min-w-[140px]">
                                <button onClick={() => { setDeleteConfirm(friend.username); setFriendMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 text-xs transition-colors"><UserMinus className="w-3.5 h-3.5" />Delete Friend</button>
                                <button onClick={() => blockUser(friend.username, friend.initials, friend.color)} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-500/10 text-orange-400 text-xs transition-colors"><ShieldOff className="w-3.5 h-3.5" />Block</button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requests' && (
                <div>
                  {friendRequests.length === 0 ? (
                    <div className="p-4 text-center"><UserPlus className="w-8 h-8 text-white/20 mx-auto mb-2" /><p className="text-white/40 text-xs">No friend requests</p></div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {friendRequests.map((req) => (
                        <div key={req.username} className="flex items-center gap-2 p-2.5 hover:bg-white/5 transition-colors">
                          <div className={`w-9 h-9 bg-gradient-to-br ${req.color} rounded-full flex items-center justify-center flex-shrink-0`}><span className="text-white text-xs">{req.initials}</span></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{req.username}</p>
                            <p className="text-white/30 text-[10px] truncate">{req.mutualFriends ? `${req.mutualFriends} mutual friends` : 'No mutual friends'} · {req.timeAgo}</p>
                          </div>
                          <div className="flex gap-1 flex-shrink-0">
                            <button onClick={() => { onAddFriend?.({ username: req.username, initials: req.initials, color: req.color }); setFriendRequests(prev => prev.filter(r => r.username !== req.username)); }} className="w-7 h-7 flex items-center justify-center rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors" title="Accept"><Check className="w-3.5 h-3.5" /></button>
                            <button onClick={() => setFriendRequests(prev => prev.filter(r => r.username !== req.username))} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors" title="Decline"><X className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'blocked' && (
                <div>
                  {blockedUsers.length === 0 ? (
                    <div className="p-4 text-center"><ShieldCheck className="w-8 h-8 text-white/20 mx-auto mb-2" /><p className="text-white/40 text-xs">No blocked users</p></div>
                  ) : (
                    <div className="divide-y divide-white/5">
                      {blockedUsers.map((blocked) => (
                        <div key={blocked.username} className="flex items-center gap-2 p-2 hover:bg-white/5 transition-colors">
                          <div className={`w-9 h-9 bg-gradient-to-br ${blocked.color} rounded-full flex items-center justify-center flex-shrink-0 opacity-50`}><span className="text-white text-xs">{blocked.initials}</span></div>
                          <div className="flex-1 min-w-0"><p className="text-white/50 text-xs font-medium truncate">{blocked.username}</p><p className="text-orange-400/60 text-[10px]">Blocat</p></div>
                          <button onClick={() => unblockUser(blocked.username)} className="flex-shrink-0 px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs rounded-lg border border-green-500/20 transition-colors flex items-center gap-1"><ShieldCheck className="w-3 h-3" />Unblock</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {openThreads.length >= MAX_OPEN_THREADS && (
              <div className="px-3 py-1.5 bg-amber-500/10 border-t border-amber-500/20 flex-shrink-0">
                <p className="text-amber-400 text-[10px] text-center">Max {MAX_OPEN_THREADS} conversații deschise</p>
              </div>
            )}
          </div>
        )}

        {(() => {
          const totalUnread = visibleFriends.reduce((sum, f) => sum + (f.unreadCount || 0), 0);
          return (
            <div className="relative px-3 py-2.5 flex items-center justify-between cursor-pointer select-none rounded-t-lg overflow-hidden w-full">
              <img src={teemoBannerBottom} alt="" className="absolute inset-0 w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative flex items-center gap-2 z-10">
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-white" />
                  {totalUnread > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white/30 animate-pulse">{totalUnread > 9 ? '9+' : totalUnread}</span>}
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
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msgId: number } | null>(null);
  const [reactionPicker, setReactionPicker] = useState<{ msgId: number } | null>(null);
  const minimized = thread.minimized ?? false;
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread.messages]);

  // Close menus on outside click
  React.useEffect(() => {
    const handler = () => { setContextMenu(null); setReactionPicker(null); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleSend = () => {
    if (message.trim()) { onSendMessage(message, 'text'); setMessage(''); setShowEmojiPicker(false); }
  };

  // #13 — Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { onSendMessage(ev.target?.result as string, 'image'); };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // #14 — Right-click context menu (only own messages)
  const handleContextMenu = (e: React.MouseEvent, msgId: number, sender: string) => {
    if (sender !== 'me') return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, msgId });
  };

  return (
    <div className={`bg-[#1a1d29] rounded-t-2xl border border-white/10 shadow-2xl flex flex-col w-full sm:w-72 max-w-full ${minimized ? 'h-auto' : 'h-80 sm:h-96'} transition-all duration-200`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] px-3 py-2 rounded-t-2xl flex items-center justify-between flex-shrink-0">
        <button className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity text-left" onClick={() => onViewProfile?.(thread.username)}>
          <div className={`w-6 h-6 bg-gradient-to-br ${thread.color} rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-xs">{thread.initials}</span>
          </div>
          <span className="text-white text-xs font-medium truncate">{thread.username}</span>
        </button>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={onToggleMinimize} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/20 transition-colors"><Minus className="w-3 h-3 text-white" /></button>
          <button onClick={onClose} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/20 transition-colors"><X className="w-3 h-3 text-white" /></button>
        </div>
      </div>

      {/* Context Menu #14 */}
      {contextMenu && (
        <div
          className="fixed bg-[#242836] border border-white/10 rounded-lg shadow-xl z-[99999] overflow-hidden min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          <button onClick={() => { onDeleteMessage(contextMenu.msgId); setContextMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 text-xs transition-colors">
            🗑️ Delete Message
          </button>
        </div>
      )}

      {!minimized && (
        <>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#1a1d29] custom-scrollbar">
            {thread.messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-5 h-5 text-[#00d4ff] mb-2 opacity-50" />
                <p className="text-white/40 text-xs">No messages yet</p>
              </div>
            ) : (
              <>
                {thread.messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} group`}>
                    <div
                      className={`relative max-w-[85%] sm:max-w-[80%] ${msg.sender === 'me' ? 'bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]' : 'bg-white/10'} rounded-xl px-3 py-2`}
                      onContextMenu={(e) => handleContextMenu(e, msg.id, msg.sender)}
                    >
                      <p className={`text-[10px] font-semibold mb-0.5 ${msg.sender === 'me' ? 'text-white/80' : 'text-[#00d4ff]'}`}>
                        {msg.sender === 'me' ? 'Tu' : thread.username}
                      </p>

                      {/* #13 — Image or text */}
                      {msg.type === 'image' ? (
                        <img src={msg.text} alt="sent" className="max-w-full rounded-lg max-h-40 object-contain" />
                      ) : (
                        <p className="text-white text-xs leading-relaxed break-words">{msg.text}</p>
                      )}

                      <p className={`text-[10px] mt-0.5 ${msg.sender === 'me' ? 'text-white/70' : 'text-white/50'}`}>{msg.time}</p>

                      {/* #16 — Reaction button on hover */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setReactionPicker(reactionPicker?.msgId === msg.id ? null : { msgId: msg.id }); }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-[#242836] border border-white/10 rounded-full text-[10px] items-center justify-center hidden group-hover:flex hover:bg-white/10 transition-colors"
                      >
                        😊
                      </button>

                      {/* Reaction picker */}
                      {reactionPicker?.msgId === msg.id && (
                        <div className="absolute bottom-full mb-1 bg-[#242836] border border-white/10 rounded-xl px-2 py-1 flex gap-1 z-50 shadow-xl" onClick={e => e.stopPropagation()}>
                          {REACTION_EMOJIS.map(emoji => (
                            <button key={emoji} onClick={() => { onAddReaction(msg.id, emoji); setReactionPicker(null); }} className="text-base hover:scale-125 transition-transform">{emoji}</button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reactions display */}
                    {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {Object.entries(msg.reactions).map(([emoji, users]) => (
                          <button key={emoji} onClick={() => onAddReaction(msg.id, emoji)} className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] border transition-colors ${users.includes('me') ? 'bg-[#00d4ff]/20 border-[#00d4ff]/40 text-white' : 'bg-white/5 border-white/10 text-white/70'}`}>
                            {emoji} {users.length}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* #15 — Emoji Picker */}
          {showEmojiPicker && (
            <div className="border-t border-white/10 p-2 grid grid-cols-8 gap-1 bg-[#141622]">
              {EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => setMessage(prev => prev + emoji)} className="text-base hover:scale-125 transition-transform hover:bg-white/10 rounded p-0.5">{emoji}</button>
              ))}
            </div>
          )}

          <div className="p-2 border-t border-white/10 flex-shrink-0">
            <div className="flex gap-1.5 items-center">
              {/* #13 — Image upload button */}
              <button onClick={() => fileInputRef.current?.click()} className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/60 hover:text-white flex-shrink-0 text-sm" title="Send image">🖼️</button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

              {/* #15 — Emoji toggle button */}
              <button onClick={() => setShowEmojiPicker(prev => !prev)} className={`w-7 h-7 flex items-center justify-center rounded-lg border transition-colors flex-shrink-0 text-sm ${showEmojiPicker ? 'bg-[#00d4ff]/20 border-[#00d4ff]/40 text-[#00d4ff]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`} title="Emoji">😊</button>

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#00d4ff]/50"
              />
              <button onClick={handleSend} disabled={!message.trim()} className="px-2.5 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg disabled:opacity-50 transition-opacity flex-shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}