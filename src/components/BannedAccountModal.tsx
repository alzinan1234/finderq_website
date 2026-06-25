// @ts-nocheck
'use client'
import { Ban, Mail } from "lucide-react";
const bannedBg = '/assets/ChatGPT_Image_Jun_12__2026__08_58_26_PM.png';

interface BannedAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BannedAccountModal({ isOpen, onClose }: BannedAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4">
      <div className="rounded-2xl max-w-md w-full relative border border-red-500/40 shadow-2xl shadow-red-500/20 overflow-hidden">
        <img src={bannedBg} alt="Banned" className="absolute inset-0 w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-[#1a0a0a]/40" />
        <div className="h-1 w-full bg-gradient-to-r from-red-700 via-red-500 to-red-700 relative z-10" />
        <div className="p-4 sm:p-6 md:p-8 text-center relative z-10">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
            <Ban className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Cont suspendat</h2>
          <p className="text-red-400 font-medium text-sm mb-4">Accesul la acest cont a fost blocat</p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-left">
            <p className="text-white/70 text-sm leading-relaxed">
              Contul tău a fost suspendat de echipa FinderQ din cauza încălcării repetate a regulamentului comunității noastre.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left">
            <p className="text-white/80 text-sm font-medium mb-2">Crezi că ai fost banat pe nedrept?</p>
            <p className="text-white/50 text-xs leading-relaxed mb-3">
              Poți contesta suspendarea trimițând un email cu detaliile cazului tău. Echipa noastră va analiza contestația în 24-48 ore.
            </p>
            <a
              href="mailto:support@finderq.gg?subject=Contestatie%20Suspendare%20Cont&body=Username:%20%0AMotiv%20contestatie:%20"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-[#00d4ff] to-[#0066ff] hover:from-[#00b8e6] hover:to-[#0055cc] text-white rounded-lg text-sm font-medium transition-all"
            >
              <Mail className="w-4 h-4" />
              Trimite contestație — support@finderq.gg
            </a>
          </div>
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white/60 rounded-lg text-sm transition-colors border border-white/10"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}
