// @ts-nocheck
'use client'
import React from "react";
import { MessageCircle, X, Minimize2, Maximize2, Send } from "lucide-react";

interface SupportMessage {
  id: number;
  sender: "user" | "support";
  senderName: string;
  content: string;
  timestamp: string;
}

interface SupportChatPanelProps {
  isSupportMinimized: boolean;
  setIsSupportMinimized: (value: boolean) => void;
  onClose: () => void;
  isLoggedIn: boolean;
  userName: string;
  closedSupportConversations: Set<string>;
  supportConversations: Record<string, SupportMessage[]>;
  setSupportConversations: React.Dispatch<React.SetStateAction<Record<string, SupportMessage[]>>>;
  supportInputMessage: string;
  setSupportInputMessage: (value: string) => void;
  getCurrentUserSupportMessages: () => SupportMessage[];
  handleStartNewSupportConversation: () => void;
  handleCloseSupportConversation: (userId: string) => void;
  statusOnline: string;
}

export function SupportChatPanel({
  isSupportMinimized,
  setIsSupportMinimized,
  onClose,
  isLoggedIn,
  userName,
  closedSupportConversations,
  supportConversations,
  setSupportConversations,
  supportInputMessage,
  setSupportInputMessage,
  getCurrentUserSupportMessages,
  handleStartNewSupportConversation,
  handleCloseSupportConversation,
  statusOnline,
}: SupportChatPanelProps) {
  const sendMessage = () => {
    if (closedSupportConversations.has(userName)) {
      alert("⚠️ This conversation has been closed. Please start a new conversation if you need further assistance.");
      return;
    }

    if (supportInputMessage.trim()) {
      const currentMessages = supportConversations[userName] || [];
      const newMessage: SupportMessage = {
        id: currentMessages.length + 1,
        sender: "user",
        senderName: userName,
        content: supportInputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setSupportConversations({
        ...supportConversations,
        [userName]: [...currentMessages, newMessage]
      });
      setSupportInputMessage("");

      setTimeout(() => {
        setSupportConversations((prev: Record<string, SupportMessage[]>) => {
          const updatedMessages = prev[userName] || [];
          const autoReply: SupportMessage = {
            id: updatedMessages.length + 2,
            sender: "support",
            senderName: "FinderQ Auto-Reply",
            content: "Thank you for your message! Our support team will respond shortly.",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          return {
            ...prev,
            [userName]: [...updatedMessages, autoReply]
          };
        });
      }, 1500);
    }
  };

  return (
    <div
      className={`fixed ${isSupportMinimized ? 'bottom-6 right-6 w-80 h-16' : 'bottom-6 right-6 w-96 h-[600px]'} bg-[#1a1d29] rounded-2xl shadow-2xl flex flex-col border border-[#00d4ff]/30 transition-all duration-300`}
      style={{ zIndex: 99999 }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0099cc] via-[#00b8e6] to-[#0066ff] text-white px-4 py-2.5 rounded-t-2xl flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-4 h-4" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-wide block">Support Live</span>
            <div className="flex items-center gap-1">
              <img src={statusOnline} alt="Online" className="w-5 h-5 rounded-full object-cover" />
              <span className="text-xs text-white/70 leading-none">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSupportMinimized(!isSupportMinimized)}
            className="hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            {isSupportMinimized ? <Maximize2 className="w-5 h-5" /> : <Minimize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      {!isSupportMinimized && (
        <>
          <div className="flex-1 p-4 overflow-y-auto bg-[#242836]">
            {!isLoggedIn && (
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-4 text-center">
                <p className="text-orange-400 text-sm font-medium mb-2">Login Required</p>
                <p className="text-white/60 text-xs">Please log in to chat with our support team.</p>
              </div>
            )}

            {isLoggedIn && closedSupportConversations.has(userName) && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 text-center">
                <p className="text-red-400 text-sm font-medium mb-2">🔒 Conversation Closed</p>
                <p className="text-white/60 text-xs mb-3">This support conversation has been closed by our team. If you need further assistance, you can start a new conversation.</p>
                <button
                  onClick={handleStartNewSupportConversation}
                  className="px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] hover:from-[#00b8e6] hover:to-[#0055cc] text-white rounded-lg text-sm font-medium transition-all hover:scale-105 shadow-lg"
                >
                  ✨ Start New Conversation
                </button>
              </div>
            )}

            {getCurrentUserSupportMessages().map((message) => (
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
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#1a1d29] border-t border-white/10 rounded-b-2xl">
            {isLoggedIn ? (
              <div className="flex items-end gap-2">
                <textarea
                  value={supportInputMessage}
                  onChange={(e) => setSupportInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder={closedSupportConversations.has(userName) ? "Conversation closed..." : "Type your message..."}
                  rows={1}
                  className="flex-1 px-4 py-3 bg-[#242836] border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:border-transparent resize-none"
                  style={{ maxHeight: '100px' }}
                  disabled={closedSupportConversations.has(userName)}
                />
                <button
                  onClick={sendMessage}
                  disabled={!supportInputMessage.trim() || closedSupportConversations.has(userName)}
                  className="w-12 h-12 bg-gradient-to-br from-[#00d4ff] to-[#0066ff] hover:from-[#00b8e6] hover:to-[#0055cc] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white/60 text-sm">Please log in to send messages</p>
              </div>
            )}
            {isLoggedIn && !closedSupportConversations.has(userName) && (
              <button
                onClick={() => {
                  if (confirm("Ești sigur că vrei să închizi această conversație?")) {
                    handleCloseSupportConversation(userName);
                  }
                }}
                className="mt-2 w-full py-1.5 text-xs text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/10 hover:border-red-500/20 flex items-center justify-center gap-1.5"
              >
                <X className="w-3 h-3" />
                Închide conversația
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
