// @ts-nocheck
'use client'
import { X, AlertTriangle, Flag, User } from "lucide-react";
import { useState } from "react";

interface ReportProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  avatarUrl?: string;
  onSubmitReport: (username: string, reason: string, details: string) => void;
}

const reasons = [
  { value: "spam", label: "Spam sau conținut înșelător", icon: "📢" },
  { value: "harassment", label: "Hărțuire sau discurs de ură", icon: "🚫" },
  { value: "inappropriate", label: "Conținut inadecvat / Nuditate", icon: "⚠️" },
  { value: "false_info", label: "Informații false despre rank/statistici", icon: "📊" },
  { value: "scam", label: "Escrocherie sau fraudă", icon: "🎣" },
  { value: "boosting", label: "Servicii de boosting ilegale", icon: "🚀" },
  { value: "other", label: "Altă încălcare", icon: "❓" },
];

export function ReportProfileModal({ isOpen, onClose, username, avatarUrl, onSubmitReport }: ReportProfileModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [details, setDetails] = useState("");
  const [showError, setShowError] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason || !details.trim()) {
      setShowError(true);
      return;
    }
    onSubmitReport(username, selectedReason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedReason("");
      setDetails("");
      setShowError(false);
      onClose();
    }, 1800);
  };

  const handleClose = () => {
    setSelectedReason("");
    setDetails("");
    setShowError(false);
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-[60] p-3 sm:p-4"
      onClick={handleClose}
    >
      <div
        className="bg-[#1e2130] rounded-2xl max-w-lg w-full relative border border-red-500/20 shadow-2xl shadow-red-500/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-400 to-orange-400" />

        <div className="p-6">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/30">
                <svg className="w-8 h-8 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-white font-semibold text-lg">Raport trimis!</p>
              <p className="text-white/50 text-sm text-center">Echipa de moderare va analiza raportul tău în curând.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                  <Flag className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-white text-xl font-bold">Raportează profil</h2>
                  <p className="text-white/50 text-xs mt-0.5">Ajută-ne să menținem FinderQ în siguranță</p>
                </div>
              </div>

              {/* Profile preview */}
              <div className="bg-[#141622] rounded-xl p-3 mb-5 border border-white/8 flex items-center gap-3">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={username} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#2a2d3e] flex items-center justify-center border border-white/10">
                    <User className="w-5 h-5 text-white/40" />
                  </div>
                )}
                <div>
                  <p className="text-white font-medium text-sm">{username}</p>
                  <p className="text-white/40 text-xs">Profil raportat</p>
                </div>
                <div className="ml-auto">
                  <span className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-xs">În analiză</span>
                </div>
              </div>

              {/* Reason */}
              <div className="mb-4">
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2.5">
                  Motivul raportării <span className="text-red-400">*</span>
                </label>
                <div className="space-y-1.5">
                  {reasons.map((reason) => (
                    <button
                      key={reason.value}
                      onClick={() => { setSelectedReason(reason.value); setShowError(false); }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-lg border transition-all flex items-center gap-3 ${
                        selectedReason === reason.value
                          ? "bg-red-500/10 border-red-500/40 text-white"
                          : "bg-[#141622] border-white/8 text-white/60 hover:border-white/20 hover:text-white/80"
                      }`}
                    >
                      <span className="text-base">{reason.icon}</span>
                      <span className="text-sm flex-1">{reason.label}</span>
                      {selectedReason === reason.value && (
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {showError && !selectedReason && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Selectează un motiv.
                  </p>
                )}
              </div>

              {/* Details */}
              <div className="mb-5">
                <label className="block text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                  Detalii suplimentare <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={details}
                  onChange={(e) => { setDetails(e.target.value); setShowError(false); }}
                  placeholder="Descrie problema cât mai detaliat pentru echipa de moderare..."
                  rows={3}
                  className={`w-full px-3.5 py-3 bg-[#141622] border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/40 text-white text-sm placeholder:text-white/30 resize-none transition-colors ${
                    showError && !details.trim() ? "border-red-500/60" : "border-white/8 focus:border-red-500/30"
                  }`}
                />
                {showError && !details.trim() && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Detaliile sunt obligatorii.
                  </p>
                )}
              </div>

              {/* Warning */}
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-lg p-3 mb-5 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-400/80 text-xs leading-relaxed">
                  Rapoartele false pot duce la restricții pe contul tău. Te rugăm să raportezi doar conținut care încalcă regulile FinderQ.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5">
                <button
                  onClick={handleClose}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/8 text-white/70 rounded-lg transition-colors border border-white/10 text-sm"
                >
                  Anulează
                </button>
                <button
                  onClick={handleSubmit}
                  className={`flex-1 py-2.5 rounded-lg transition-all text-sm font-semibold ${
                    selectedReason && details.trim()
                      ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/20"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  Trimite raportul
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
