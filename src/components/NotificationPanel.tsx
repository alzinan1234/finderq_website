// @ts-nocheck
'use client'
import React, { useState } from 'react';
import { X, Check, MessageCircle, Shield, Trophy, UserPlus, Bell, AlertTriangle, Ban } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: number;
  type: 'message' | 'verification' | 'tournament' | 'friend' | 'system' | 'warn' | 'ban';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  color?: string;
  actionLink?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}: NotificationPanelProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    onMarkAsRead(notification.id);
    setSelectedNotification(notification);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'message':
        return MessageCircle;
      case 'verification':
        return Shield;
      case 'tournament':
        return Trophy;
      case 'friend':
        return UserPlus;
      case 'warn':
        return AlertTriangle;
      case 'ban':
        return Ban;
      default:
        return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'message':
        return 'from-[#00d4ff] to-[#00b8e6]';
      case 'verification':
        return 'from-red-500 to-red-600';
      case 'tournament':
        return 'from-[#c89b3c] to-[#daa520]';
      case 'friend':
        return 'from-purple-500 to-pink-500';
      case 'warn':
        return 'from-orange-500 to-yellow-500';
      case 'ban':
        return 'from-red-600 to-red-800';
      default:
        return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Notification Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[#0a0e27] via-[#1a1d29] to-[#0a0e27] shadow-2xl z-50 overflow-hidden border-l-4 border-[#c89b3c]/30"
          >
            {/* Animated background */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,155,60,0.1),transparent_50%)]" />
            </div>

            {/* Header */}
            <div className="relative border-b border-[#c89b3c]/20 bg-gradient-to-r from-[#1a1d29] to-[#242836] p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#c89b3c] to-[#daa520] rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">Notifications</h2>
                    {unreadCount > 0 && (
                      <p className="text-[#c89b3c] text-sm font-medium">{unreadCount} unread</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all duration-200 group"
                >
                  <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Actions */}
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={onMarkAllAsRead}
                    className="flex-1 px-3 py-2 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 border border-[#00d4ff]/30 hover:border-[#00d4ff]/50 rounded-lg text-[#00d4ff] text-sm font-medium transition-all duration-200"
                  >
                    <Check className="w-4 h-4 inline mr-1" />
                    Mark all read
                  </button>
                  <button
                    onClick={onClearAll}
                    className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-red-400 text-sm font-medium transition-all duration-200"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="relative h-[calc(100%-140px)] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#c89b3c]/20 to-[#00d4ff]/20 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-10 h-10 text-white/40" />
                  </div>
                  <h3 className="text-white/60 font-medium text-lg mb-2">No notifications</h3>
                  <p className="text-white/40 text-sm">You're all caught up!</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.type);
                    const iconColor = getIconColor(notification.type);

                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative group rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer ${
                          notification.type === 'ban'
                            ? notification.read
                              ? 'bg-red-950/20 border-red-800/30 hover:border-red-700/50'
                              : 'bg-gradient-to-br from-red-600/20 to-red-800/20 border-red-600/50 hover:border-red-500/70 shadow-lg shadow-red-900/30'
                            : notification.type === 'warn'
                            ? notification.read
                              ? 'bg-orange-950/20 border-orange-800/30 hover:border-orange-700/50'
                              : 'bg-gradient-to-br from-orange-500/20 to-yellow-600/20 border-orange-500/50 hover:border-orange-400/70 shadow-lg shadow-orange-900/30'
                            : notification.read
                            ? 'bg-white/5 border-white/10 hover:border-white/20'
                            : 'bg-gradient-to-br from-[#c89b3c]/10 to-[#00d4ff]/10 border-[#c89b3c]/30 hover:border-[#c89b3c]/50'
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        {/* Unread indicator */}
                        {!notification.read && (
                          <div className="absolute top-4 right-4 w-2 h-2 bg-[#00d4ff] rounded-full animate-pulse" />
                        )}

                        <div className="flex gap-3">
                          {/* Icon */}
                          <div className={`w-10 h-10 bg-gradient-to-br ${iconColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-sm mb-1 ${notification.read ? 'text-white/60' : 'text-white'}`}>
                              {notification.title}
                            </h4>
                            <p className={`text-sm mb-2 line-clamp-2 ${notification.read ? 'text-white/40' : 'text-white/70'}`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <svg className="w-3 h-3 text-[#c89b3c]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-[#c89b3c]/60 text-xs">{notification.time}</p>
                              </div>
                              <span className="text-[#00d4ff] text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                Click for details
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Notification Details Modal */}
          {selectedNotification && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-[60] p-4"
              onClick={() => setSelectedNotification(null)}
            >
              <motion.div
                className="relative max-w-lg w-full bg-gradient-to-br from-[#1a1d29] to-[#0a0e27] rounded-2xl border-2 border-[#c89b3c]/40 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,155,60,0.2),transparent_50%)]" />
                </div>

                {/* Header */}
                <div className={`relative p-6 border-b border-white/10 bg-gradient-to-r ${getIconColor(selectedNotification.type)}/20`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {(() => {
                        const Icon = getIcon(selectedNotification.type);
                        const iconColor = getIconColor(selectedNotification.type);
                        return (
                          <div className={`w-12 h-12 bg-gradient-to-br ${iconColor} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        );
                      })()}
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1">{selectedNotification.title}</h3>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#c89b3c]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-[#c89b3c]/80 text-sm">{selectedNotification.time}</p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedNotification(null)}
                      className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all duration-200 group/close"
                    >
                      <X className="w-5 h-5 text-white/60 group-hover/close:text-white transition-colors" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 max-h-[60vh] overflow-y-auto">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-white/90 text-base leading-relaxed whitespace-pre-wrap">
                      {selectedNotification.message}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="relative p-6 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#c89b3c] to-[#daa520] hover:from-[#daa520] hover:to-[#c89b3c] rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-[#c89b3c]/30"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
