// @ts-nocheck
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onSave: (color: string) => void;
}

const PRESET_COLORS = [
  // Blues & Cyans
  { name: 'Blue', gradient: 'from-blue-500 to-indigo-500', value: 'from-blue-500 to-indigo-500' },
  { name: 'Sky', gradient: 'from-sky-400 to-blue-500', value: 'from-sky-400 to-blue-500' },
  { name: 'Cyan', gradient: 'from-[#00d4ff] to-[#00b8e6]', value: 'from-[#00d4ff] to-[#00b8e6]' },
  { name: 'Teal', gradient: 'from-teal-400 to-cyan-500', value: 'from-teal-400 to-cyan-500' },
  { name: 'Ice', gradient: 'from-cyan-300 to-blue-400', value: 'from-cyan-300 to-blue-400' },

  // Purples & Pinks
  { name: 'Purple', gradient: 'from-purple-500 to-pink-500', value: 'from-purple-500 to-pink-500' },
  { name: 'Violet', gradient: 'from-violet-500 to-purple-600', value: 'from-violet-500 to-purple-600' },
  { name: 'Pink', gradient: 'from-pink-400 to-rose-500', value: 'from-pink-400 to-rose-500' },
  { name: 'Fuchsia', gradient: 'from-fuchsia-500 to-pink-600', value: 'from-fuchsia-500 to-pink-600' },
  { name: 'Magenta', gradient: 'from-pink-500 to-purple-500', value: 'from-pink-500 to-purple-500' },

  // Greens
  { name: 'Green', gradient: 'from-green-500 to-teal-500', value: 'from-green-500 to-teal-500' },
  { name: 'Emerald', gradient: 'from-[#50C878] to-[#00A86B]', value: 'from-[#50C878] to-[#00A86B]' },
  { name: 'Lime', gradient: 'from-lime-400 to-green-500', value: 'from-lime-400 to-green-500' },
  { name: 'Mint', gradient: 'from-green-300 to-teal-400', value: 'from-green-300 to-teal-400' },

  // Oranges & Reds
  { name: 'Orange', gradient: 'from-orange-500 to-red-500', value: 'from-orange-500 to-red-500' },
  { name: 'Red', gradient: 'from-red-600 to-red-800', value: 'from-red-600 to-red-800' },
  { name: 'Rose', gradient: 'from-rose-400 to-red-600', value: 'from-rose-400 to-red-600' },
  { name: 'Coral', gradient: 'from-orange-400 to-pink-500', value: 'from-orange-400 to-pink-500' },

  // Yellows & Golds
  { name: 'Yellow', gradient: 'from-yellow-400 to-orange-500', value: 'from-yellow-400 to-orange-500' },
  { name: 'Gold', gradient: 'from-[#ffd700] to-[#daa520]', value: 'from-[#ffd700] to-[#daa520]' },
  { name: 'Amber', gradient: 'from-amber-400 to-orange-600', value: 'from-amber-400 to-orange-600' },
  { name: 'Sunset', gradient: 'from-yellow-500 to-red-600', value: 'from-yellow-500 to-red-600' },

  // Special Colors
  { name: 'Bronze', gradient: 'from-[#cd7f32] to-[#8b4513]', value: 'from-[#cd7f32] to-[#8b4513]' },
  { name: 'Silver', gradient: 'from-[#c0c0c0] to-[#808080]', value: 'from-[#c0c0c0] to-[#808080]' },
  { name: 'Platinum', gradient: 'from-[#e5e4e2] to-[#a8a8a8]', value: 'from-[#e5e4e2] to-[#a8a8a8]' },
  { name: 'Rainbow', gradient: 'from-red-500 via-yellow-500 to-blue-500', value: 'from-red-500 via-yellow-500 to-blue-500' },
  { name: 'Ocean', gradient: 'from-blue-600 via-cyan-500 to-teal-400', value: 'from-blue-600 via-cyan-500 to-teal-400' },
  { name: 'Fire', gradient: 'from-red-600 via-orange-500 to-yellow-400', value: 'from-red-600 via-orange-500 to-yellow-400' },
  { name: 'Dark', gradient: 'from-gray-700 to-gray-900', value: 'from-gray-700 to-gray-900' },
  { name: 'Night', gradient: 'from-indigo-900 to-slate-900', value: 'from-indigo-900 to-slate-900' },
];

// Gradient spectrum colors for the picker
const SPECTRUM_COLORS = [
  '#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00',
  '#80ff00', '#40ff00', '#00ff00', '#00ff40', '#00ff80', '#00ffbf',
  '#00ffff', '#00bfff', '#0080ff', '#0040ff', '#0000ff', '#4000ff',
  '#8000ff', '#bf00ff', '#ff00ff', '#ff00bf', '#ff0080', '#ff0040'
];

export function ColorPickerModal({ isOpen, onClose, currentColor, onSave }: ColorPickerModalProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [customColor1, setCustomColor1] = useState('#00d4ff');
  const [customColor2, setCustomColor2] = useState('#00b8e6');

  useEffect(() => {
    if (isOpen) {
      setSelectedColor(currentColor);
    }
  }, [isOpen, currentColor]);
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Draw gradient spectrum on canvas
  useEffect(() => {
    if (!canvasRef.current || activeTab !== 'custom') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Draw horizontal gradient (hue spectrum)
    for (let i = 0; i < SPECTRUM_COLORS.length; i++) {
      const startX = (i / SPECTRUM_COLORS.length) * width;
      const endX = ((i + 1) / SPECTRUM_COLORS.length) * width;

      const gradient = ctx.createLinearGradient(startX, 0, endX, 0);
      gradient.addColorStop(0, SPECTRUM_COLORS[i]);
      gradient.addColorStop(1, SPECTRUM_COLORS[(i + 1) % SPECTRUM_COLORS.length]);

      ctx.fillStyle = gradient;
      ctx.fillRect(startX, 0, endX - startX, height);
    }

    // Overlay white to black gradient vertically
    const verticalGradient = ctx.createLinearGradient(0, 0, 0, height);
    verticalGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    verticalGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    verticalGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    verticalGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

    ctx.fillStyle = verticalGradient;
    ctx.fillRect(0, 0, width, height);
  }, [activeTab]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    // Calculate scaled coordinates
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(x, y, 1, 1);
    const [r, g, b] = imageData.data;

    const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    setCustomColor1(color);

    // Auto-generate second color (slightly darker)
    const darker = `#${Math.max(0, Math.floor(r * 0.7)).toString(16).padStart(2, '0')}${Math.max(0, Math.floor(g * 0.7)).toString(16).padStart(2, '0')}${Math.max(0, Math.floor(b * 0.7)).toString(16).padStart(2, '0')}`;
    setCustomColor2(darker);

    const customGradient = `from-[${color}] to-[${darker}]`;
    setSelectedColor(customGradient);
  };

  const handleCanvasMouseDown = () => {
    setIsDragging(true);
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    handleCanvasClick(e);
  };

  const handleSave = () => {
    onSave(selectedColor);
    onClose();
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-[60] p-4"
            onClick={onClose}
          >
            <div
              className="relative max-w-2xl w-full bg-gradient-to-br from-[#1a1d29] to-[#0a0e27] rounded-2xl border-2 border-[#c89b3c]/40 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,155,60,0.2),transparent_50%)]" />
              </div>

              {/* Header */}
              <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-[#c89b3c]/20 to-[#00d4ff]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-bold text-2xl mb-1">Choose Your Color</h2>
                    <p className="text-white/60 text-sm">Pick a color gradient for your username</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all duration-200 group"
                  >
                    <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Preview */}
              <div className="relative p-6 border-b border-white/10">
                <p className="text-white/80 text-sm mb-4 font-medium">Preview:</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 shadow-xl">
                    <span className="text-white font-bold text-xl">AB</span>
                  </div>
                  <div>
                    <p className={`font-bold text-xl bg-gradient-to-r ${selectedColor} bg-clip-text text-transparent`}>Your Username</p>
                    <p className="text-white/60 text-sm">This is how others will see your name</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="relative px-6 pt-4 border-b border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('presets')}
                    className={`relative px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === 'presets'
                        ? 'text-[#c89b3c]'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    <Palette className="w-4 h-4 inline mr-2" />
                    Presets
                    {activeTab === 'presets' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c89b3c]" />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={`relative px-4 py-2 text-sm font-medium transition-all ${
                      activeTab === 'custom'
                        ? 'text-[#00d4ff]'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Custom
                    {activeTab === 'custom' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00d4ff]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Color Content */}
              <div className="relative p-6 max-h-[400px] overflow-y-auto">
                {activeTab === 'presets' ? (
                  <>
                    <p className="text-white/80 text-sm mb-4 font-medium">Select a preset color:</p>
                    <div className="grid grid-cols-5 gap-3">
                      {PRESET_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColor(color.value)}
                          className={`group relative p-3 rounded-xl border-2 transition-all duration-300 ${
                            selectedColor === color.value
                              ? 'border-[#c89b3c] bg-[#c89b3c]/10 scale-105'
                              : 'border-white/10 hover:border-white/30 hover:scale-105'
                          }`}
                        >
                          {/* Color Circle */}
                          <div className={`w-full aspect-square rounded-full bg-gradient-to-br ${color.gradient} shadow-lg mb-1.5`} />

                          {/* Name */}
                          <p className={`text-[10px] font-medium text-center ${
                            selectedColor === color.value ? 'text-[#c89b3c]' : 'text-white/60 group-hover:text-white/80'
                          }`}>
                            {color.name}
                          </p>

                          {/* Selected Check */}
                          {selectedColor === color.value && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#c89b3c] rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-white/80 text-sm mb-4 font-medium">Click or drag on the spectrum to pick a color:</p>

                    {/* Color Spectrum Canvas */}
                    <div className="relative mb-4">
                      <canvas
                        ref={canvasRef}
                        width={500}
                        height={200}
                        className="w-full h-48 rounded-xl border-2 border-white/10 cursor-crosshair shadow-lg"
                        onClick={handleCanvasClick}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseLeave={handleCanvasMouseUp}
                      />
                      <p className="text-white/40 text-xs mt-2 text-center">Click anywhere to select a color</p>
                    </div>

                    {/* Manual Color Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 text-xs block mb-2">Start Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customColor1}
                            onChange={(e) => {
                              setCustomColor1(e.target.value);
                              const customGradient = `from-[${e.target.value}] to-[${customColor2}]`;
                              setSelectedColor(customGradient);
                            }}
                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/10"
                          />
                          <input
                            type="text"
                            value={customColor1}
                            onChange={(e) => {
                              setCustomColor1(e.target.value);
                              const customGradient = `from-[${e.target.value}] to-[${customColor2}]`;
                              setSelectedColor(customGradient);
                            }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00d4ff]/50"
                            placeholder="#00d4ff"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-white/60 text-xs block mb-2">End Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={customColor2}
                            onChange={(e) => {
                              setCustomColor2(e.target.value);
                              const customGradient = `from-[${customColor1}] to-[${e.target.value}]`;
                              setSelectedColor(customGradient);
                            }}
                            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-white/10"
                          />
                          <input
                            type="text"
                            value={customColor2}
                            onChange={(e) => {
                              setCustomColor2(e.target.value);
                              const customGradient = `from-[${customColor1}] to-[${e.target.value}]`;
                              setSelectedColor(customGradient);
                            }}
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00d4ff]/50"
                            placeholder="#00b8e6"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="relative p-6 pt-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/80 hover:text-white font-medium transition-all duration-200 border border-white/10 hover:border-white/20"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c89b3c] to-[#daa520] hover:from-[#daa520] hover:to-[#c89b3c] rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-[#c89b3c]/30"
                >
                  Save Color
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
