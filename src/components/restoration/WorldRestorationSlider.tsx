/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import { Sparkles, AlertTriangle, ArrowLeftRight, CheckCircle2 } from 'lucide-react';

interface WorldRestorationSliderProps {
  compact?: boolean;
  onContinue?: () => void;
}

export const WorldRestorationSlider: React.FC<WorldRestorationSliderProps> = ({
  compact = false,
  onContinue,
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [activeMode, setActiveMode] = useState<'SLIDER' | 'GLITCH' | 'RESTORED'>('SLIDER');

  const effectivePos = activeMode === 'GLITCH' ? 100 : activeMode === 'RESTORED' ? 0 : sliderPos;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mode Controls */}
      <div className="flex items-center gap-2 mb-3 z-10">
        <button
          onClick={() => setActiveMode('GLITCH')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeMode === 'GLITCH'
              ? 'bg-[#FF0055] text-white shadow-[0_0_12px_rgba(255,0,85,0.5)]'
              : 'bg-[#0D2B45] text-rose-300 hover:bg-[#153B5C] border border-rose-500/30'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Kondisi 1: Rusak (Terdistorsi)</span>
        </button>

        <button
          onClick={() => setActiveMode('SLIDER')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeMode === 'SLIDER'
              ? 'bg-[#D4AF37] text-slate-950 shadow-[0_0_15px_rgba(212,175,55,0.5)]'
              : 'bg-[#0D2B45] text-[#FFE082] hover:bg-[#153B5C] border border-[#D4AF37]/30'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Bandingkan (Geser)</span>
        </button>

        <button
          onClick={() => setActiveMode('RESTORED')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeMode === 'RESTORED'
              ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]'
              : 'bg-[#0D2B45] text-emerald-300 hover:bg-[#153B5C] border border-emerald-500/30'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Kondisi 2: Pulih (Harmonis)</span>
        </button>
      </div>

      {/* Interactive Visual Canvas with Split Divider */}
      <div
        className={`relative w-full ${
          compact ? 'h-48 sm:h-64' : 'h-64 sm:h-96'
        } rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl select-none group`}
      >
        {/* Under layer: RESTORED WORLD (Kondisi 2) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={PROSEDURIA_ASSETS.worldRestored}
            alt="Dunia Proseduria Pulih & Jernih"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-[#0D2B45]/90 border border-emerald-400/40 text-emerald-300 text-xs font-bold font-mono backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>KONDISI 2: PULIH & HARMONIS</span>
          </div>
        </div>

        {/* Top layer: GLITCH WORLD (Kondisi 1), clipped by effectivePos width */}
        <div
          className="absolute inset-0 h-full overflow-hidden transition-[clip-path] duration-150"
          style={{
            clipPath: `polygon(0 0, ${effectivePos}% 0, ${effectivePos}% 100%, 0 100%)`,
          }}
        >
          <img
            src={PROSEDURIA_ASSETS.worldGlitch}
            alt="Dunia Proseduria Rusak & Terdistorsi"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-[#08131F]/90 border border-rose-500/50 text-rose-300 text-xs font-bold font-mono backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>KONDISI 1: RUSAK & TERDISTORSI</span>
          </div>
        </div>

        {/* Interactive Center Draggable Handle */}
        {activeMode === 'SLIDER' && (
          <div
            className="absolute top-0 bottom-0 w-1 bg-[#FFE082] shadow-[0_0_15px_#FFE082] z-20 cursor-ew-resize flex items-center justify-center pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="w-8 h-8 rounded-full bg-[#0D2B45] border-2 border-[#D4AF37] text-[#FFE082] flex items-center justify-center shadow-2xl pointer-events-auto">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Hidden Range Input covering the container for intuitive dragging */}
        {activeMode === 'SLIDER' && (
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
          />
        )}
      </div>

      {/* Narrative caption */}
      <p className="mt-3 text-xs sm:text-sm text-center text-slate-300 max-w-xl">
        <span className="text-[#FFE082] font-semibold">Hukum Logika Langkah:</span> Setiap
        prosedur yang berhasil diperbaiki mengembalikan kestabilan bio-energi Akademi Proseduria
        dari kabut glitch menjadi lembah makmur yang bercahaya.
      </p>

      {onContinue && (
        <button
          onClick={onContinue}
          className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C842] hover:brightness-110 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all cursor-pointer"
        >
          Lanjutkan Petualangan
        </button>
      )}
    </div>
  );
};
