// @ts-nocheck
'use client'
import { Shield } from "lucide-react";
const restrictedBg = '/assets/33333321321321321312.png';

interface GuestWallProps {
  currentPage: string;
  isLoggedIn: boolean;
  onSignUp: () => void;
  onLogin: () => void;
}

export function GuestWall({ currentPage, isLoggedIn, onSignUp, onLogin }: GuestWallProps) {
  if (isLoggedIn || !["eune","euw","na","kr","br","lan_las","tournaments","media","challenges"].includes(currentPage)) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
      <img src={restrictedBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#0a0e27]/70" />
      <div className="max-w-md w-full mx-3 sm:mx-0 text-center relative z-10">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#c89b3c]/20 to-[#00d4ff]/20 rounded-full flex items-center justify-center border border-[#c89b3c]/30">
          <Shield className="w-12 h-12 text-[#c89b3c]" />
        </div>
        <h2 className="text-white text-3xl font-bold mb-3">Conținut restricționat</h2>
        <p className="text-white/60 text-lg mb-2">Trebuie să ai un cont FinderQ</p>
        <p className="text-white/40 text-sm mb-8">Anunțurile, turneele și media sunt disponibile doar utilizatorilor înregistrați.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onSignUp}
            className="px-3 sm:px-6 md:px-8 py-3 bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg"
          >
            Creează cont
          </button>
          <button
            onClick={onLogin}
            className="px-3 sm:px-6 md:px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
          >
            Conectează-te
          </button>
        </div>
      </div>
    </div>
  );
}
