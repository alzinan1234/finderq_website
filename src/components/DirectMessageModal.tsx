// @ts-nocheck
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUsername: string;
  recipientInitials: string;
  recipientColor: string;
}

export function DirectMessageModal({ 
  isOpen, 
  onClose, 
  recipientUsername, 
  recipientInitials, 
  recipientColor 
}: DirectMessageModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    type: 'text' | 'image';
    sender: 'me' | 'them';
    time: string;
    reactions?: Record<string, string[]>;
  }>>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msgId: number } | null>(null);
  const [reactionPicker, setReactionPicker] = useState<{ msgId: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','😢','😡','👍','👎','❤️','🔥','🎉','💯','🙏','👏','🤣','😅','😭','🥺','✨','💪','🚀','🎮','⚡'];
  const REACTION_EMOJIS = ['❤️','👍','😂','😮','😢','😡'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close context menu on outside click
  useEffect(() => {
    const handler = () => { setContextMenu(null); setReactionPicker(null); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        type: 'text' as const,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        reactions: {}
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newMessage = {
        id: Date.now(),
        text: ev.target?.result as string,
        type: 'image' as const,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        reactions: {}
      };
      setMessages(prev => [...prev, newMessage]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContextMenu = (e: React.MouseEvent, msgId: number, sender: string) => {
    if (sender !== 'me') return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, msgId });
  };

  const handleDeleteMessage = (msgId: number) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    setContextMenu(null);
  };

  const handleAddReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => {
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
    }));
    setReactionPicker(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-[22rem] z-40 w-80 mb-14">
      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-[#242836] border border-white/10 rounded-lg shadow-xl z-[99999] overflow-hidden min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => handleDeleteMessage(contextMenu.msgId)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 text-xs transition-colors"
          >
            🗑️ Delete Message
          </button>
        </div>
      )}

      <div className="bg-[#1a1d29] rounded-t-2xl border border-white/10 shadow-2xl flex flex-col h-96">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] px-4 py-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-gradient-to-br ${recipientColor} rounded-full flex items-center justify-center`}>
              <span className="text-white text-xs">{recipientInitials}</span>
            </div>
            <span className="text-white font-medium text-sm">{recipientUsername}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-white/60 text-xs">No messages yet</p>
              <p className="text-white/40 text-xs mt-1">Say hi to {recipientUsername}</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} group`}>
                  <div
                    className={`relative max-w-[80%] ${msg.sender === 'me' ? 'bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]' : 'bg-white/10'} rounded-xl px-3 py-2`}
                    onContextMenu={(e) => handleContextMenu(e, msg.id, msg.sender)}
                  >
                    {msg.type === 'image' ? (
                      <img src={msg.text} alt="sent" className="max-w-full rounded-lg max-h-40 object-contain" />
                    ) : (
                      <p className="text-white text-xs leading-relaxed">{msg.text}</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-white/50'}`}>{msg.time}</p>

                    {/* Reaction button on hover */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setReactionPicker(reactionPicker?.msgId === msg.id ? null : { msgId: msg.id }); }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-[#242836] border border-white/10 rounded-full text-[10px] items-center justify-center hidden group-hover:flex hover:bg-white/10 transition-colors"
                    >
                      😊
                    </button>

                    {/* Reaction picker */}
                    {reactionPicker?.msgId === msg.id && (
                      <div
                        className="absolute bottom-full mb-1 bg-[#242836] border border-white/10 rounded-xl px-2 py-1 flex gap-1 z-50 shadow-xl"
                        onClick={e => e.stopPropagation()}
                      >
                        {REACTION_EMOJIS.map(emoji => (
                          <button key={emoji} onClick={() => handleAddReaction(msg.id, emoji)} className="text-base hover:scale-125 transition-transform">
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reactions display */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {Object.entries(msg.reactions).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(msg.id, emoji)}
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] border transition-colors ${users.includes('me') ? 'bg-[#00d4ff]/20 border-[#00d4ff]/40 text-white' : 'bg-white/5 border-white/10 text-white/70'}`}
                        >
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

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="border-t border-white/10 p-2 grid grid-cols-8 gap-1 bg-[#141622]">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setMessage(prev => prev + emoji)}
                className="text-lg hover:scale-125 transition-transform hover:bg-white/10 rounded p-0.5"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-white/10">
          <div className="flex gap-2 items-center">
            {/* Image upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/60 hover:text-white flex-shrink-0"
              title="Send image"
            >
              🖼️
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

            {/* Emoji toggle */}
            <button
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors flex-shrink-0 text-sm ${showEmojiPicker ? 'bg-[#00d4ff]/20 border-[#00d4ff]/40 text-[#00d4ff]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
              title="Emoji"
            >
              😊
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-3 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg hover:from-[#00b8e6] hover:to-[#009ac7] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}// @ts-nocheck
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUsername: string;
  recipientInitials: string;
  recipientColor: string;
}

export function DirectMessageModal({ 
  isOpen, 
  onClose, 
  recipientUsername, 
  recipientInitials, 
  recipientColor 
}: DirectMessageModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    type: 'text' | 'image';
    sender: 'me' | 'them';
    time: string;
    reactions?: Record<string, string[]>;
  }>>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msgId: number } | null>(null);
  const [reactionPicker, setReactionPicker] = useState<{ msgId: number } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const EMOJIS = ['😀','😂','😍','🥰','😎','🤔','😢','😡','👍','👎','❤️','🔥','🎉','💯','🙏','👏','🤣','😅','😭','🥺','✨','💪','🚀','🎮','⚡'];
  const REACTION_EMOJIS = ['❤️','👍','😂','😮','😢','😡'];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Close context menu on outside click
  useEffect(() => {
    const handler = () => { setContextMenu(null); setReactionPicker(null); };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        text: message,
        type: 'text' as const,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        reactions: {}
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      setShowEmojiPicker(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newMessage = {
        id: Date.now(),
        text: ev.target?.result as string,
        type: 'image' as const,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        reactions: {}
      };
      setMessages(prev => [...prev, newMessage]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContextMenu = (e: React.MouseEvent, msgId: number, sender: string) => {
    if (sender !== 'me') return;
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, msgId });
  };

  const handleDeleteMessage = (msgId: number) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    setContextMenu(null);
  };

  const handleAddReaction = (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => {
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
    }));
    setReactionPicker(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-[22rem] z-40 w-80 mb-14">
      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-[#242836] border border-white/10 rounded-lg shadow-xl z-[99999] overflow-hidden min-w-[140px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => handleDeleteMessage(contextMenu.msgId)}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 text-red-400 text-xs transition-colors"
          >
            🗑️ Delete Message
          </button>
        </div>
      )}

      <div className="bg-[#1a1d29] rounded-t-2xl border border-white/10 shadow-2xl flex flex-col h-96">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] px-4 py-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-gradient-to-br ${recipientColor} rounded-full flex items-center justify-center`}>
              <span className="text-white text-xs">{recipientInitials}</span>
            </div>
            <span className="text-white font-medium text-sm">{recipientUsername}</span>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-white/60 text-xs">No messages yet</p>
              <p className="text-white/40 text-xs mt-1">Say hi to {recipientUsername}</p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} group`}>
                  <div
                    className={`relative max-w-[80%] ${msg.sender === 'me' ? 'bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]' : 'bg-white/10'} rounded-xl px-3 py-2`}
                    onContextMenu={(e) => handleContextMenu(e, msg.id, msg.sender)}
                  >
                    {msg.type === 'image' ? (
                      <img src={msg.text} alt="sent" className="max-w-full rounded-lg max-h-40 object-contain" />
                    ) : (
                      <p className="text-white text-xs leading-relaxed">{msg.text}</p>
                    )}
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-white/50'}`}>{msg.time}</p>

                    {/* Reaction button on hover */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setReactionPicker(reactionPicker?.msgId === msg.id ? null : { msgId: msg.id }); }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-[#242836] border border-white/10 rounded-full text-[10px] items-center justify-center hidden group-hover:flex hover:bg-white/10 transition-colors"
                    >
                      😊
                    </button>

                    {/* Reaction picker */}
                    {reactionPicker?.msgId === msg.id && (
                      <div
                        className="absolute bottom-full mb-1 bg-[#242836] border border-white/10 rounded-xl px-2 py-1 flex gap-1 z-50 shadow-xl"
                        onClick={e => e.stopPropagation()}
                      >
                        {REACTION_EMOJIS.map(emoji => (
                          <button key={emoji} onClick={() => handleAddReaction(msg.id, emoji)} className="text-base hover:scale-125 transition-transform">
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reactions display */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {Object.entries(msg.reactions).map(([emoji, users]) => (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(msg.id, emoji)}
                          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] border transition-colors ${users.includes('me') ? 'bg-[#00d4ff]/20 border-[#00d4ff]/40 text-white' : 'bg-white/5 border-white/10 text-white/70'}`}
                        >
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

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="border-t border-white/10 p-2 grid grid-cols-8 gap-1 bg-[#141622]">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => setMessage(prev => prev + emoji)}
                className="text-lg hover:scale-125 transition-transform hover:bg-white/10 rounded p-0.5"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="p-3 border-t border-white/10">
          <div className="flex gap-2 items-center">
            {/* Image upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-white/60 hover:text-white flex-shrink-0"
              title="Send image"
            >
              🖼️
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

            {/* Emoji toggle */}
            <button
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors flex-shrink-0 text-sm ${showEmojiPicker ? 'bg-[#00d4ff]/20 border-[#00d4ff]/40 text-[#00d4ff]' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'}`}
              title="Emoji"
            >
              😊
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#00d4ff]/50 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="px-3 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg hover:from-[#00b8e6] hover:to-[#009ac7] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}