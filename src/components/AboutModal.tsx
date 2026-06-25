// @ts-nocheck
'use client'
import { X } from "lucide-react";
const aboutLogo = '/assets/111aa222bb111-Photoroom-1.png';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4" onClick={onClose}>
      <div className="bg-[#1a1d29] rounded-2xl max-w-lg w-full border border-white/10 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2 -ml-4">
            <img src={aboutLogo} alt="About" className="w-32 h-16 object-contain" style={{marginTop: '-8px', marginBottom: '-8px'}} />
            <h2 className="text-white text-xl font-bold -ml-3">About</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-3 sm:p-4 md:p-6 space-y-4 text-white/70 text-sm leading-relaxed">
          <p>Finding the right teammates shouldn't take hours of searching through forums, chats, and social media.</p>
          <p><span className="text-[#00d4ff] font-semibold">FinderQ.com</span> brings everything together in one place. Players can create profiles, share their experience, discover new teammates, and connect with teams that match their ambitions.</p>
          <p>Whether you're grinding ranked, building an esports roster, or simply looking for people to play with, our platform is designed to help you find the right fit faster.</p>
          <p>We're focused on creating a safe, accessible, and community-driven environment where players can connect, collaborate, and grow together.</p>
          <p className="text-white font-semibold pt-2">Simple. Reliable. Built for the gaming community.</p>
        </div>
      </div>
    </div>
  );
}
