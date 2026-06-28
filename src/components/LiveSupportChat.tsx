// @ts-nocheck
'use client'
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";

interface Message {
  id: number;
  sender: "user" | "support";
  senderName: string;
  content: string;
  timestamp: string;
}

interface LiveSupportChatProps {
  isLoggedIn: boolean;
  userName: string;
  isAdmin: boolean;
  isOwner: boolean;
  conversations: any;
  onSendMessage: (userId: string, message: any) => void;
}

export function LiveSupportChat({ 
  isLoggedIn, 
  userName, 
  isAdmin, 
  isOwner,
  conversations,
  onSendMessage 
}: LiveSupportChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentMessages = conversations[userName] || [
    {
      id: 1,
      sender: "support" as const,
      senderName: "FinderQ Support",
      content: "Hello! Welcome to FinderQ Support. How can we help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !isLoggedIn) return;

    const newMessage = {
      id: currentMessages.length + 1,
      sender: "user",
      senderName: userName,
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    onSendMessage(userName, newMessage);
    setInputMessage("");

    if (!isAdmin && !isOwner) {
      setTimeout(() => {
        const autoReply = {
          id: currentMessages.length + 2,
          sender: "support",
          senderName: "FinderQ Support",
          content: "Thank you for your message! Our support team will respond shortly.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        onSendMessage(userName, autoReply);
        if (!isOpen) {
          setHasUnreadMessages(true);
        }
      }, 1500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnreadMessages(false);
    setIsMinimized(false);
  };

  useEffect(() => {
    if (!isOpen && currentMessages.length > 1) {
      const lastMessage = currentMessages[currentMessages.length - 1];
      if (lastMessage.sender === "support") {
        setHasUnreadMessages(true);
      }
    }
  }, [currentMessages, isOpen]);

  const content = (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={handleOpenChat}
          title="Open Support Chat"
          style={{
            position: 'fixed',
            bottom: '8px',
            right: '8px',
            zIndex: 999999,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            // overflow visible so mushroom cap shows fully
            overflow: 'visible',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <img
              src="/assets/support-chat-logo.png"
              alt="Support Chat"
              style={{
                width: '129px',
                height: '129px',
                objectFit: 'contain',
                objectPosition: 'center bottom',
                display: 'block',
                
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            {hasUnreadMessages && (
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '18px',
                height: '18px',
                background: '#0055cc',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 1.5s infinite',
              }}>
                <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>!</span>
              </div>
            )}
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`${isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'} bg-[#1a1d29] rounded-2xl shadow-2xl flex flex-col border border-[#00d4ff]/30 transition-all duration-300`}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 999999,
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00d4ff] to-[#0099cc] text-white px-4 py-2.5 rounded-t-2xl flex items-center justify-between border-b border-white/10">
            <div className="flex flex-col">
              <span className="font-semibold text-sm tracking-wide">Support Live</span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                <span className="text-[10px] text-white/70 leading-none">Online</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="hover:bg-white/15 rounded-md p-1.5 transition-colors"
                title={isMinimized ? "Maximize" : "Minimize"}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/15 rounded-md p-1.5 transition-colors"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto bg-[#242836] custom-scrollbar">
                {!isLoggedIn && (
                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-4 text-center">
                    <p className="text-orange-400 text-sm font-medium mb-2">Login Required</p>
                    <p className="text-white/60 text-xs">Please log in to chat with our support team.</p>
                  </div>
                )}

                {currentMessages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-[80%] ${message.sender === "user" ? "order-2" : "order-1"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-medium ${message.sender === "user" ? "text-[#00d4ff]" : "text-green-400"}`}>
                          {message.senderName}
                        </span>
                        <span className="text-xs text-white/40">{message.timestamp}</span>
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-2.5 ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-[#00d4ff] to-[#0066ff] text-white"
                            : "bg-[#1a1d29] text-white border border-white/10"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-[#1a1d29] border-t border-white/10 rounded-b-2xl">
                {isLoggedIn ? (
                  <div className="flex items-end gap-2">
                    <textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      rows={1}
                      className="flex-1 px-4 py-3 bg-[#242836] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent resize-none"
                      style={{ maxHeight: '100px' }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="w-12 h-12 bg-gradient-to-br from-[#00d4ff] to-[#0066ff] hover:from-[#00b8e6] hover:to-[#0055cc] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                      title="Send message"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-white/60 text-sm">Please log in to send messages</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,212,255,0.5); }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );

  if (!mounted) return null;
  return createPortal(content, document.body);
}