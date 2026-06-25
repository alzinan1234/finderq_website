// @ts-nocheck
'use client'
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BORDER_PRESETS = [
  { id: 'default',      label: 'Default',      style: { borderColor: 'rgba(0,212,255,0.5)',    boxShadow: '0 0 10px rgba(0,212,255,0.2)' } },
  { id: 'gold',         label: 'Gold',         style: { borderColor: 'rgba(200,155,60,0.8)',   boxShadow: '0 0 12px rgba(200,155,60,0.4)' } },
  { id: 'silver',       label: 'Silver',       style: { borderColor: 'rgba(192,192,192,0.7)',  boxShadow: '0 0 12px rgba(192,192,192,0.3)' } },
  { id: 'purple',       label: 'Purple',       style: { borderColor: 'rgba(168,85,247,0.8)',   boxShadow: '0 0 12px rgba(168,85,247,0.4)' } },
  { id: 'red',          label: 'Red',          style: { borderColor: 'rgba(239,68,68,0.8)',    boxShadow: '0 0 12px rgba(239,68,68,0.4)' } },
  { id: 'green',        label: 'Green',        style: { borderColor: 'rgba(34,197,94,0.8)',    boxShadow: '0 0 12px rgba(34,197,94,0.4)' } },
  { id: 'pink',         label: 'Pink',         style: { borderColor: 'rgba(236,72,153,0.8)',   boxShadow: '0 0 12px rgba(236,72,153,0.4)' } },
  { id: 'orange',       label: 'Orange',       style: { borderColor: 'rgba(249,115,22,0.8)',   boxShadow: '0 0 12px rgba(249,115,22,0.4)' } },
  { id: 'glow',         label: 'Glow Cyan',    style: { borderColor: 'rgba(0,212,255,0.9)',    boxShadow: '0 0 20px rgba(0,212,255,0.7), 0 0 40px rgba(0,212,255,0.3)' } },
  { id: 'glow-gold',    label: 'Glow Gold',    style: { borderColor: 'rgba(200,155,60,0.9)',   boxShadow: '0 0 20px rgba(200,155,60,0.7), 0 0 40px rgba(200,155,60,0.3)' } },
  { id: 'glow-purple',  label: 'Glow Purple',  style: { borderColor: 'rgba(168,85,247,0.9)',   boxShadow: '0 0 20px rgba(168,85,247,0.7), 0 0 40px rgba(168,85,247,0.3)' } },
  { id: 'glow-green',   label: 'Glow Green',   style: { borderColor: 'rgba(34,197,94,0.9)',    boxShadow: '0 0 20px rgba(34,197,94,0.7),  0 0 40px rgba(34,197,94,0.3)' } },
  { id: 'glow-red',     label: 'Glow Red',     style: { borderColor: 'rgba(239,68,68,0.9)',    boxShadow: '0 0 20px rgba(239,68,68,0.7),   0 0 40px rgba(239,68,68,0.3)' } },
  { id: 'glow-pink',    label: 'Glow Pink',    style: { borderColor: 'rgba(236,72,153,0.9)',   boxShadow: '0 0 20px rgba(236,72,153,0.7),  0 0 40px rgba(236,72,153,0.3)' } },
  { id: 'rainbow',      label: 'Rainbow',      animGradient: 'linear-gradient(90deg, #ff0080, #ff8c00, #ffe500, #00ff80, #00d4ff, #a855f7, #ff0080)' },
  { id: 'fire',         label: 'Fire',         animGradient: 'linear-gradient(90deg, #ff4500, #ff8c00, #ffd700, #ff4500)' },
  { id: 'aurora',       label: 'Aurora',       animGradient: 'linear-gradient(90deg, #00d4ff, #a855f7, #ec4899, #00d4ff)' },
  { id: 'none',         label: 'None',         style: { border: 'none' } },
] as const;

interface BorderPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBorder: string;
  onSave: (border: string) => void;
}

export function BorderPickerModal({ isOpen, onClose, currentBorder, onSave }: BorderPickerModalProps) {
  const [selected, setSelected] = useState(currentBorder);

  useEffect(() => {
    if (isOpen) setSelected(currentBorder);
  }, [isOpen, currentBorder]);

  const handleSave = () => {
    onSave(selected);
    onClose();
  };

  const currentPreset = BORDER_PRESETS.find(p => p.id === selected) ?? BORDER_PRESETS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[70] p-4"
            onClick={onClose}
          >
            <div
              className="relative max-w-2xl w-full bg-gradient-to-br from-[#1a1d29] to-[#0a0e27] rounded-2xl border-2 border-[#a855f7]/40 shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-3 sm:p-4 md:p-6 border-b border-white/10 bg-gradient-to-r from-[#a855f7]/20 to-[#c89b3c]/20 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-2xl mb-1">Choose Post Border</h2>
                  <p className="text-white/60 text-sm">Pick a frame style for your announcements</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all group"
                >
                  <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Preview */}
              <div className="p-3 sm:p-4 md:p-6 border-b border-white/10">
                <p className="text-white/80 text-sm mb-3 font-medium">Preview:</p>
                <div
                  className="rounded-[13px] p-[3px]"
                  style={'animGradient' in currentPreset && currentPreset.animGradient ? {
                    background: currentPreset.animGradient,
                  } : {}}
                >
                  <div
                    className={`rounded-[10px] px-5 py-4 bg-[#0a0e27] ${'animGradient' in currentPreset && currentPreset.animGradient ? '' : 'border-[3px]'}`}
                    style={'animGradient' in currentPreset && currentPreset.animGradient ? {} : (currentPreset.style as React.CSSProperties)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 w-24 bg-white/20 rounded" />
                        <div className="h-2 w-40 bg-white/10 rounded" />
                        <div className="h-2 w-32 bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="p-3 sm:p-4 md:p-6 max-h-[340px] overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {BORDER_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelected(preset.id)}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                        selected === preset.id
                          ? 'bg-white/10 ring-2 ring-[#c89b3c]'
                          : 'bg-white/5 hover:bg-white/8'
                      }`}
                    >
                      <div
                        className="w-full h-8 rounded-lg"
                        style={'animGradient' in preset && preset.animGradient ? {
                          border: '2px solid transparent',
                          background: `linear-gradient(#0a0e27, #0a0e27) padding-box, ${preset.animGradient} border-box`,
                          boxShadow: '0 0 8px rgba(168,85,247,0.4)',
                        } : { ...(preset.style as React.CSSProperties), border: (preset.style as any)?.border ?? '2px solid', background: '#0a0e27' }}
                      />
                      <span className="text-white/70 text-[10px] font-medium">{preset.label}</span>
                      {selected === preset.id && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#c89b3c] rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-3 sm:p-4 md:p-6 pt-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 hover:text-white font-medium transition-all border border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c89b3c] to-[#daa520] hover:from-[#daa520] hover:to-[#c89b3c] rounded-xl text-white font-bold transition-all shadow-lg shadow-[#c89b3c]/30"
                >
                  Save Border
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
