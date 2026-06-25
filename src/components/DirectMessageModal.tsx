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
    sender: 'me' | 'them';
    time: string;
  }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me' as const,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-[22rem] z-40 w-80 mb-14">
      <div className="bg-[#1a1d29] rounded-t-2xl border border-white/10 shadow-2xl flex flex-col h-96">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] px-4 py-3 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-gradient-to-br ${recipientColor} rounded-full flex items-center justify-center`}>
              <span className="text-white text-xs">{recipientInitials}</span>
            </div>
            <span className="text-white font-medium text-sm">{recipientUsername}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
          >
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
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${msg.sender === 'me' ? 'bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]' : 'bg-white/10'} rounded-xl px-3 py-2`}>
                    <p className="text-white text-xs leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-white/70' : 'text-white/50'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-white/10">
          <div className="flex gap-2">
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