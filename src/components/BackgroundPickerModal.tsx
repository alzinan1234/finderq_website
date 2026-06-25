// @ts-nocheck
'use client'
import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBackground: string;
  onSave: (background: string) => void;
}

// Gradient spectrum colors for the picker
const SPECTRUM_COLORS = [
  '#ff0000', '#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00',
  '#80ff00', '#40ff00', '#00ff00', '#00ff40', '#00ff80', '#00ffbf',
  '#00ffff', '#00bfff', '#0080ff', '#0040ff', '#0000ff', '#4000ff',
  '#8000ff', '#bf00ff', '#ff00ff', '#ff00bf', '#ff0080', '#ff0040'
];

export function BackgroundPickerModal({ isOpen, onClose, currentBackground, onSave }: BackgroundPickerModalProps) {
  const [selectedBackground, setSelectedBackground] = useState(currentBackground);
  const [customColor1, setCustomColor1] = useState('#0a0e27');
  const [customColor2, setCustomColor2] = useState('#1a1d29');
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedBackground(currentBackground);
    }
  }, [isOpen, currentBackground]);

  const backgrounds = [
    // Dark themes
    { name: 'Default Dark', gradient: 'from-[#0a0e27] via-[#1a1d29] to-[#0a0e27]' },
    { name: 'Deep Ocean', gradient: 'from-[#001f3f] via-[#003366] to-[#001f3f]' },
    { name: 'Midnight', gradient: 'from-[#0d1117] via-[#161b22] to-[#0d1117]' },
    { name: 'Dark Purple', gradient: 'from-[#1a0a2e] via-[#2d1b4e] to-[#1a0a2e]' },
    { name: 'Carbon', gradient: 'from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a]' },
    { name: 'Obsidian', gradient: 'from-[#0f0f0f] via-[#1f1f1f] to-[#0f0f0f]' },

    // Blue themes
    { name: 'Electric Blue', gradient: 'from-[#001a33] via-[#003d66] to-[#001a33]' },
    { name: 'Cyan Dream', gradient: 'from-[#002233] via-[#004455] to-[#002233]' },
    { name: 'Arctic Blue', gradient: 'from-[#0c1e2e] via-[#1a3a4f] to-[#0c1e2e]' },
    { name: 'Ocean Deep', gradient: 'from-[#0a1a2e] via-[#143350] to-[#0a1a2e]' },
    { name: 'Navy Night', gradient: 'from-[#0a0f1a] via-[#141f33] to-[#0a0f1a]' },
    { name: 'Azure', gradient: 'from-[#0a1f33] via-[#143e66] to-[#0a1f33]' },

    // Purple themes
    { name: 'Royal Purple', gradient: 'from-[#1e0a33] via-[#3d1466] to-[#1e0a33]' },
    { name: 'Violet Night', gradient: 'from-[#120a1f] via-[#24143e] to-[#120a1f]' },
    { name: 'Nebula', gradient: 'from-[#1a0033] via-[#330066] to-[#1a0033]' },
    { name: 'Amethyst', gradient: 'from-[#1a0a2e] via-[#33145c] to-[#1a0a2e]' },
    { name: 'Twilight', gradient: 'from-[#1f0a33] via-[#3e1466] to-[#1f0a33]' },
    { name: 'Cosmic', gradient: 'from-[#0f0a1f] via-[#1f143e] to-[#0f0a1f]' },

    // Red/Pink themes
    { name: 'Dark Rose', gradient: 'from-[#1a0a0f] via-[#33141f] to-[#1a0a0f]' },
    { name: 'Crimson', gradient: 'from-[#1f0a0a] via-[#3e1414] to-[#1f0a0a]' },
    { name: 'Magenta', gradient: 'from-[#1f0a1f] via-[#3e143e] to-[#1f0a1f]' },
    { name: 'Ruby', gradient: 'from-[#1a0a0a] via-[#331414] to-[#1a0a0a]' },
    { name: 'Wine', gradient: 'from-[#1f0a0f] via-[#3e141f] to-[#1f0a0f]' },
    { name: 'Blood Moon', gradient: 'from-[#1a0a0f] via-[#330a1f] to-[#1a0a0f]' },

    // Green themes
    { name: 'Forest', gradient: 'from-[#0a1a0a] via-[#143314] to-[#0a1a0a]' },
    { name: 'Emerald', gradient: 'from-[#0a1f1a] via-[#143e33] to-[#0a1f1a]' },
    { name: 'Matrix', gradient: 'from-[#0a1f0a] via-[#143e14] to-[#0a1f0a]' },
    { name: 'Jade', gradient: 'from-[#0a1a0f] via-[#14331f] to-[#0a1a0f]' },
    { name: 'Pine', gradient: 'from-[#0f1a0a] via-[#1f3314] to-[#0f1a0a]' },
    { name: 'Moss', gradient: 'from-[#0a1a14] via-[#143328] to-[#0a1a14]' },

    // Orange/Gold themes
    { name: 'Sunset', gradient: 'from-[#1a0f0a] via-[#331f14] to-[#1a0f0a]' },
    { name: 'Gold', gradient: 'from-[#1f1a0a] via-[#3e3314] to-[#1f1a0a]' },
    { name: 'Amber', gradient: 'from-[#1a140a] via-[#332814] to-[#1a140a]' },
    { name: 'Bronze', gradient: 'from-[#1a0f0a] via-[#331f14] to-[#1a0f0a]' },
    { name: 'Copper', gradient: 'from-[#1f0f0a] via-[#3e1f14] to-[#1f0f0a]' },

    // Special/Mixed themes
    { name: 'Galaxy', gradient: 'from-[#0a0a1f] via-[#1a1a3e] to-[#0a0a1f]' },
    { name: 'Sunset Sky', gradient: 'from-[#1a0a1f] via-[#33143e] to-[#1f0a1a]' },
    { name: 'Aurora', gradient: 'from-[#0a1a1f] via-[#143e4f] to-[#0a1f1a]' },
    { name: 'Lava', gradient: 'from-[#1f0a0a] via-[#3e1414] to-[#1a0f0a]' },
    { name: 'Ice', gradient: 'from-[#0a1f1f] via-[#143e3e] to-[#0a1a1f]' },
    { name: 'Tropical', gradient: 'from-[#0a1f1a] via-[#143e33] to-[#0a1a1f]' },
    { name: 'Northern Lights', gradient: 'from-[#0a1f1a] via-[#0a1a1f] to-[#1a0a1f]' },
    { name: 'Deep Space', gradient: 'from-[#0a0a0f] via-[#14141f] to-[#0a0a0f]' },
    { name: 'Volcanic', gradient: 'from-[#1f0a0a] via-[#1a0f0a] to-[#1f0a0a]' },
    { name: 'Ocean Trench', gradient: 'from-[#0a1a1f] via-[#0a0f1a] to-[#0a1a1f]' },
    { name: 'Mystic', gradient: 'from-[#1a0a1f] via-[#0a1a1f] to-[#1a0a1f]' },
    { name: 'Shadow', gradient: 'from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]' }
  ];

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

    // Make darker version for gradient
    const color2 = `#${Math.max(0, Math.floor(r * 0.5)).toString(16).padStart(2, '0')}${Math.max(0, Math.floor(g * 0.5)).toString(16).padStart(2, '0')}${Math.max(0, Math.floor(b * 0.5)).toString(16).padStart(2, '0')}`;

    setCustomColor1(color);
    setCustomColor2(color2);

    const customGradient = `CUSTOM:linear-gradient(to bottom right, ${color}, ${color2})`;
    setSelectedBackground(customGradient);
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
    onSave(selectedBackground);
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-[60] p-4"
            onClick={onClose}
          >
            <div
              className="relative max-w-4xl w-full bg-gradient-to-br from-[#1a1d29] to-[#0a0e27] rounded-2xl border-2 border-[#c89b3c]/40 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(200,155,60,0.2),transparent_50%)]" />
              </div>

              {/* Header */}
              <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-[#1a1d29] to-[#242836]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#c89b3c] to-[#daa520] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                    <h2 className="text-white font-bold text-xl">Profile Background</h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 bg-white/5 hover:bg-white/10 rounded-lg flex items-center justify-center transition-all duration-200 group"
                  >
                    <X className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => setActiveTab('presets')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      activeTab === 'presets'
                        ? 'bg-gradient-to-r from-[#c89b3c] to-[#daa520] text-white shadow-lg'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Palette className="w-4 h-4 inline mr-2" />
                    Presets
                  </button>
                  <button
                    onClick={() => setActiveTab('custom')}
                    className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                      activeTab === 'custom'
                        ? 'bg-gradient-to-r from-[#c89b3c] to-[#daa520] text-white shadow-lg'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    Custom
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="relative p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'presets' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {backgrounds.map((bg, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedBackground(bg.gradient)}
                        className={`relative h-24 rounded-xl bg-gradient-to-br ${bg.gradient} border-2 transition-all duration-200 group ${
                          selectedBackground === bg.gradient
                            ? 'border-[#00d4ff] shadow-lg shadow-[#00d4ff]/50'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        {/* Selected indicator */}
                        {selectedBackground === bg.gradient && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#00d4ff] rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}

                        {/* Background name */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 rounded-b-xl">
                          <p className="text-white text-xs font-medium text-center">{bg.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Color Spectrum Canvas */}
                    <div>
                      <p className="text-white/80 text-sm mb-2">Click or drag to select a color:</p>
                      <canvas
                        ref={canvasRef}
                        width={600}
                        height={200}
                        className="w-full h-[200px] rounded-lg cursor-crosshair border-2 border-white/10"
                        onClick={handleCanvasClick}
                        onMouseDown={handleCanvasMouseDown}
                        onMouseUp={handleCanvasMouseUp}
                        onMouseMove={handleCanvasMouseMove}
                        onMouseLeave={handleCanvasMouseUp}
                      />
                    </div>

                    {/* Manual Color Input - 2 colors only */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-white/60 text-xs mb-1 block">Start Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={customColor1}
                            onChange={(e) => {
                              setCustomColor1(e.target.value);
                              setSelectedBackground(`CUSTOM:linear-gradient(to bottom right, ${e.target.value}, ${customColor2})`);
                            }}
                            className="w-12 h-10 rounded-lg cursor-pointer border-2 border-white/10"
                          />
                          <input
                            type="text"
                            value={customColor1}
                            onChange={(e) => {
                              setCustomColor1(e.target.value);
                              setSelectedBackground(`CUSTOM:linear-gradient(to bottom right, ${e.target.value}, ${customColor2})`);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-white/60 text-xs mb-1 block">End Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={customColor2}
                            onChange={(e) => {
                              setCustomColor2(e.target.value);
                              setSelectedBackground(`CUSTOM:linear-gradient(to bottom right, ${customColor1}, ${e.target.value})`);
                            }}
                            className="w-12 h-10 rounded-lg cursor-pointer border-2 border-white/10"
                          />
                          <input
                            type="text"
                            value={customColor2}
                            onChange={(e) => {
                              setCustomColor2(e.target.value);
                              setSelectedBackground(`CUSTOM:linear-gradient(to bottom right, ${customColor1}, ${e.target.value})`);
                            }}
                            className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm"
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preview */}
                    <div>
                      <p className="text-white/60 text-xs mb-2">Preview:</p>
                      <div
                        className={`h-24 rounded-lg border-2 border-white/10 ${
                          !selectedBackground.startsWith('CUSTOM:') ? `bg-gradient-to-br ${selectedBackground}` : ''
                        }`}
                        style={selectedBackground.startsWith('CUSTOM:') ? {
                          background: selectedBackground.replace('CUSTOM:', '')
                        } : undefined}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="relative p-6 pt-4 border-t border-white/10 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-bold transition-all duration-300 border border-white/10"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c89b3c] to-[#daa520] hover:from-[#daa520] hover:to-[#c89b3c] rounded-xl text-white font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-[#c89b3c]/30"
                >
                  Save Background
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
