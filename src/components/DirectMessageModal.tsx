// @ts-nocheck
'use client'
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Image, Smile, Trash2 } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

interface DirectMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientUsername: string;
  recipientInitials: string;
  recipientColor: string;
}

interface Message {
  id: number;
  text: string;
  type: 'text' | 'image';
  sender: 'me' | 'them';
  time: string;
  reactions: Record<string, number>;
}

const REACTION_EMOJIS = ['❤️', '👍', '😂', '😮', '😢', '🔥'];

export function DirectMessageModal({
  isOpen,
  onClose,
  recipientUsername,
  recipientInitials,
  recipientColor,
}: DirectMessageModalProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMsg, setHoveredMsg] = useState<number | null>(null);
  const [reactionTarget, setReactionTarget] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
      setReactionTarget(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const sendTextMessage = () => {
    if (!message.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: message,
      type: 'text',
      sender: 'me',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      reactions: {},
    };
    setMessages(prev => [...prev, newMsg]);
    setMessage('');
    setShowEmojiPicker(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newMsg: Message = {
        id: Date.now(),
        text: ev.target?.result as string,
        type: 'image',
        sender: 'me',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        reactions: {},
      };
      setMessages(prev => [...prev, newMsg]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendTextMessage();
    }
  };

  const deleteMessage = (id: number) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const addReaction = (id: number, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== id) return m;
      const reactions = { ...m.reactions };
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      return { ...m, reactions };
    }));
    setReactionTarget(null);
  };

  const onEmojiClick = (emojiData: any) => {
    setMessage(prev => prev + emojiData.emoji);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-[22rem] z-40 w-80 mb-14">
      <div className="bg-[#1a1d29] rounded-t-2xl border border-white/10 shadow-2xl flex flex-col h-[420px]">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] px-4 py-3 rounded-t-2xl flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-gradient-to-br ${recipientColor} rounded-full flex items-center justify-center ring-2 ring-white/30`}>
              <span className="text-white text-xs font-bold">{recipientInitials}</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{recipientUsername}</p>
              <p className="text-white/70 text-[10px]">Active now</p>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 bg-[#12141f]">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#00d4ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-white/50 text-xs">No messages yet</p>
              <p className="text-white/30 text-[11px]">Say hi to {recipientUsername}!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.sender === 'me';
              const showAvatar = !isMe && (idx === 0 || messages[idx - 1]?.sender !== 'them');
              return (
                <div key={msg.id}>
                  {/* Time separator every 10 messages */}
                  {idx % 10 === 0 && idx !== 0 && (
                    <div className="flex items-center gap-2 my-3">
                      <div className="flex-1 h-px bg-white/5" />
                      <span className="text-white/20 text-[10px]">{msg.time}</span>
                      <div className="flex-1 h-px bg-white/5" />
                    </div>
                  )}

                  <div
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'} mb-0.5`}
                    onMouseEnter={() => setHoveredMsg(msg.id)}
                    onMouseLeave={() => setHoveredMsg(null)}
                  >
                    {/* Avatar for them */}
                    {!isMe && (
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${recipientColor} flex items-center justify-center flex-shrink-0 ${showAvatar ? 'visible' : 'invisible'}`}>
                        <span className="text-white text-[9px] font-bold">{recipientInitials}</span>
                      </div>
                    )}

                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                      {/* Bubble */}
                      <div className={`relative group rounded-2xl px-3 py-2 ${
                        isMe
                          ? 'bg-gradient-to-br from-[#00d4ff] to-[#0099cc] rounded-br-sm'
                          : 'bg-[#242836] rounded-bl-sm'
                      }`}>
                        {msg.type === 'image' ? (
                          <img src={msg.text} alt="sent" className="max-w-full rounded-xl max-h-44 object-contain" />
                        ) : (
                          <p className="text-white text-sm leading-relaxed break-words">{msg.text}</p>
                        )}

                        {/* Hover actions */}
                        {hoveredMsg === msg.id && (
                          <div className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1 ${isMe ? '-left-20' : '-right-20'}`}>
                            {/* React button */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setReactionTarget(reactionTarget === msg.id ? null : msg.id); }}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#242836] border border-white/10 hover:bg-[#2e3347] transition-colors text-sm"
                              title="React"
                            >
                              😊
                            </button>
                            {/* Delete button (only own messages) */}
                            {isMe && (
                              <button
                                onClick={() => deleteMessage(msg.id)}
                                className="w-7 h-7 flex items-center justify-center rounded-full bg-[#242836] border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-400" />
                              </button>
                            )}
                          </div>
                        )}

                        {/* Reaction picker */}
                        {reactionTarget === msg.id && (
                          <div
                            className={`absolute bottom-full mb-2 bg-[#1e2130] border border-white/10 rounded-2xl px-2.5 py-1.5 flex gap-2 shadow-2xl z-50 ${isMe ? 'right-0' : 'left-0'}`}
                            onClick={e => e.stopPropagation()}
                          >
                            {REACTION_EMOJIS.map(emoji => (
                              <button key={emoji} onClick={() => addReaction(msg.id, emoji)} className="text-xl hover:scale-150 transition-transform duration-100">
                                {emoji}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Reactions */}
                      {Object.keys(msg.reactions).length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {Object.entries(msg.reactions).map(([emoji, count]) => (
                            <span key={emoji} className="flex items-center gap-0.5 px-1.5 py-0.5 bg-[#1e2130] border border-white/10 rounded-full text-[11px] text-white/80">
                              {emoji} {count}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Time */}
                      <p className="text-white/30 text-[10px] mt-0.5 px-1">{msg.time}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-50">
            <EmojiPicker
              onEmojiClick={onEmojiClick}
              theme="dark"
              width={300}
              height={350}
              searchDisabled={false}
              skinTonesDisabled
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-white/10 bg-[#1a1d29] flex-shrink-0">
          <div className="flex items-center gap-2 bg-[#12141f] border border-white/10 rounded-2xl px-3 py-2">
            {/* Image upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-white/40 hover:text-[#00d4ff] transition-colors flex-shrink-0"
              title="Send image"
            >
              <Image className="w-5 h-5" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

            {/* Text input */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${recipientUsername}...`}
              className="flex-1 bg-transparent text-white text-sm placeholder-white/30 focus:outline-none"
            />

            {/* Emoji */}
            <button
              onClick={() => setShowEmojiPicker(prev => !prev)}
              className={`flex-shrink-0 transition-colors ${showEmojiPicker ? 'text-[#00d4ff]' : 'text-white/40 hover:text-[#00d4ff]'}`}
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Send */}
            <button
              onClick={sendTextMessage}
              disabled={!message.trim()}
              className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                message.trim()
                  ? 'bg-gradient-to-br from-[#00d4ff] to-[#0099cc] hover:opacity-90'
                  : 'bg-white/10 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}