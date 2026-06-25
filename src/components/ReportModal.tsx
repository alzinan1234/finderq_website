// @ts-nocheck
'use client'
import { X, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
  author: string;
  content: string;
  onSubmitReport: (postId: number, author: string, reason: string, details: string) => void;
  currentUser: string;
}

export function ReportModal({ isOpen, onClose, postId, author, content, onSubmitReport, currentUser }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [showError, setShowError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason || !details.trim()) {
      setShowError(true);
      return;
    }
    onSubmitReport(postId, author, selectedReason, details);
    setSelectedReason("");
    setDetails("");
    setShowError(false);
    onClose();
  };

  const reasons = [
    { value: "spam", label: "Spam or misleading", icon: "📢" },
    { value: "harassment", label: "Harassment or hate speech", icon: "🚫" },
    { value: "inappropriate", label: "Inappropriate content", icon: "⚠️" },
    { value: "scam", label: "Scam or fraud attempt", icon: "🎣" },
    { value: "boosting", label: "Account boosting services", icon: "🚀" },
    { value: "other", label: "Other violation", icon: "❓" },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-[#242836] rounded-2xl max-w-md w-full p-8 relative border border-red-500/20 shadow-2xl shadow-red-500/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-white text-2xl font-bold">Report Post</h2>
              <p className="text-white/60 text-sm">Help us keep FinderQ safe</p>
            </div>
          </div>
        </div>

        {/* Reported Post Preview */}
        <div className="bg-[#1a1d29] rounded-lg p-4 mb-6 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/80 text-sm font-medium">{author}</span>
            <span className="text-white/40 text-xs">• reported post</span>
          </div>
          <p className="text-white/60 text-sm line-clamp-2">{content}</p>
        </div>

        {/* Reason Selection */}
        <div className="mb-6">
          <label className="block text-white/80 text-sm mb-3 font-medium">Why are you reporting this post?</label>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <button
                key={reason.value}
                onClick={() => setSelectedReason(reason.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  selectedReason === reason.value
                    ? "bg-red-500/10 border-red-500/30 text-white"
                    : "bg-[#1a1d29] border-white/10 text-white/70 hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{reason.icon}</span>
                  <span className="text-sm">{reason.label}</span>
                  {selectedReason === reason.value && (
                    <svg className="w-5 h-5 text-red-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Details - REQUIRED */}
        <div className="mb-6">
          <label className="block text-white/80 text-sm mb-2 font-medium flex items-center gap-1">
            Detalii <span className="text-red-400">*</span>
            <span className="text-white/40 font-normal text-xs ml-1">(obligatoriu)</span>
          </label>
          <textarea
            value={details}
            onChange={(e) => { setDetails(e.target.value); setShowError(false); }}
            placeholder="Descrie problema în detaliu pentru a ajuta echipa de moderare..."
            className={`w-full px-4 py-3 bg-[#1a1d29] border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/50 text-white placeholder:text-white/40 resize-none h-24 ${
              showError && !details.trim() ? 'border-red-500/60' : 'border-white/10'
            }`}
          />
          {showError && !details.trim() && (
            <p className="text-red-400 text-xs mt-1">Te rugăm să adaugi detalii înainte de a trimite raportul.</p>
          )}
          {showError && !selectedReason && (
            <p className="text-red-400 text-xs mt-1">Te rugăm să selectezi un motiv.</p>
          )}
        </div>

        {/* Warning Notice */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-yellow-400 text-xs font-medium">False reporting warning</p>
              <p className="text-yellow-400/80 text-xs mt-1">
                Submitting false reports may result in restrictions on your account.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-colors border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || !details.trim()}
            className={`flex-1 py-2.5 rounded-lg transition-all font-medium ${
              selectedReason && details.trim()
                ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/20"
                : "bg-white/5 text-white/40 cursor-not-allowed"
            }`}
          >
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}
