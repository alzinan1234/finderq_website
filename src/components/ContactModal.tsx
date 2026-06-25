// @ts-nocheck
'use client'
import { X } from "lucide-react";
const aboutLogo = '/assets/111aa222bb111-Photoroom-1.png';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSupportChat: () => void;
}

export function ContactModal({ isOpen, onClose, onOpenSupportChat }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4" onClick={onClose}>
      <div className="bg-[#1a1d29] rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2 -ml-4">
            <img src={aboutLogo} alt="" className="w-32 h-16 object-contain" style={{marginTop: '-8px', marginBottom: '-8px'}} />
            <h2 className="text-white text-xl font-bold -ml-3">Contact</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3 sm:p-4 md:p-6 space-y-5 text-white/70 text-sm leading-relaxed">
          <p>Need help, have a question, or want to share feedback? We're here to help and are always looking for ways to improve <span className="text-[#00d4ff]">FinderQ.com</span>.</p>

          <div className="bg-white/5 rounded-xl p-4 border border-white/8">
            <p className="text-white font-semibold mb-1">💬 Live Support</p>
            <p>The fastest way to get assistance is through our live support chat, available directly on the platform. Our team will do their best to respond as quickly as possible.</p>
            <button
              onClick={() => { onClose(); onOpenSupportChat(); }}
              className="mt-3 px-4 py-2 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Open Live Support
            </button>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/8">
            <p className="text-white font-semibold mb-1">✉️ Email Support</p>
            <p>Email: <span className="text-[#00d4ff]">FinderQ@yahoo.com</span></p>
            <p className="mt-2 text-white/50 text-xs">For account issues, subscription inquiries, bug reports, or other requests.</p>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/8">
            <p className="text-white font-semibold mb-2">⏱️ Response Times</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span><span className="text-white/80">Live Support:</span> Usually within a few minutes to a few hours.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span><span className="text-white/80">Email Support:</span> Typically within 1–3 business days.</span>
              </div>
            </div>
          </div>

          <div className="text-center pt-1">
            <p className="text-white/50 text-xs">Thank you for being part of <span className="text-[#00d4ff]">FinderQ.com</span>.</p>
            <p className="text-white/40 text-xs mt-1 font-medium">Built for gamers. Driven by community.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
