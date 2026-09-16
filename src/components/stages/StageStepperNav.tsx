/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameStage, STAGE_CONFIGS } from '../../types/gameLoopTypes';
import { soundFX } from '../../utils/audioEffects';
import {
  Volume2,
  VolumeX,
  ChevronRight,
  ShieldCheck,
  Compass,
  Menu,
  X,
  Award,
} from 'lucide-react';

interface StageStepperNavProps {
  currentStage: GameStage;
  onSelectStage: (stage: GameStage) => void;
  highestReachedStageIndex: number;
  onOpenBadges?: () => void;
}

export const StageStepperNav: React.FC<StageStepperNavProps> = ({
  currentStage,
  onSelectStage,
  onOpenBadges,
}) => {
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMute = () => {
    const next = !isMuted;
    soundFX.setMuted(next);
    setIsMuted(next);
    if (!next) soundFX.playChime('click');
  };

  const currentConfig = STAGE_CONFIGS.find((s) => s.id === currentStage) || STAGE_CONFIGS[0];
  const currentIndex = STAGE_CONFIGS.findIndex((s) => s.id === currentStage);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050D1A]/95 backdrop-blur-md border-b border-[#D4AF37]/50 shadow-[0_6px_28px_rgba(0,0,0,0.8)]">
      {/* Cyan energy conduit trace line */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/50 via-amber-400/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-14 flex items-center justify-between gap-2.5">
        {/* Left: Brand Identity (PROSEDURIA) & Current Stage */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => {
              soundFX.playChime('cyan');
              onSelectStage('OPENING');
            }}
            className="flex items-center gap-2 group cursor-pointer"
            title="Kembali ke Beranda Proseduria"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5C842] via-[#D4AF37] to-[#78350F] border border-[#FFE082] flex items-center justify-center text-slate-950 font-bold group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              <span className="text-sm font-serif">✦</span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-['Cinzel'] font-black text-xs tracking-widest text-[#FFE082] group-hover:text-white transition-colors">
                PROSEDURIA
              </span>
              <span className="text-[9px] font-mono text-cyan-300/90 tracking-tight -mt-0.5">
                SMP Fase D • Teks Prosedur
              </span>
            </div>
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-[#D4AF37]/50 hidden md:block" />

          {/* Current Stage Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0B1E38]/90 border border-[#D4AF37]/50 shadow-inner">
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {currentConfig.bloomTaxonomy}
            </span>
            <span className="text-xs font-semibold text-slate-100 truncate max-w-[120px] sm:max-w-xs">
              {currentConfig.number}. {currentConfig.label}
            </span>
          </div>
        </div>

        {/* Center: Stage Stepper Dots (Desktop Runic Nodes) */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
          {STAGE_CONFIGS.map((stage, idx) => {
            const isActive = stage.id === currentStage;
            const isPassed = idx < currentIndex;

            return (
              <button
                key={stage.id}
                onClick={() => {
                  soundFX.playChime('click');
                  onSelectStage(stage.id);
                }}
                className={`relative px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400/30 to-amber-500/20 text-[#FFE082] border border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.45)] font-bold'
                    : isPassed
                    ? 'bg-[#0B1E38]/70 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-emerald-400/50'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/20'
                }`}
                title={`${stage.number}. ${stage.label} (${stage.bloomLevel})`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive
                      ? 'bg-amber-300 shadow-[0_0_8px_#FFE082] animate-pulse'
                      : isPassed
                      ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]'
                      : 'bg-slate-600'
                  }`}
                />
                <span className="text-[11px] font-bold">{stage.number}</span>
                <span className="hidden xl:inline text-[11px] font-sans truncate max-w-[80px]">
                  {stage.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Tools, Badges, Sound Toggle & Mobile Nav Button */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Badge Showcase Button */}
          {onOpenBadges && (
            <button
              onClick={() => {
                soundFX.playChime('victory');
                onOpenBadges();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-gradient-to-r from-[#D4AF37]/25 to-[#8C6D23]/30 hover:from-[#D4AF37]/35 hover:to-[#8C6D23]/40 border border-[#D4AF37]/60 text-[#FFE082] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-103"
              title="Koleksi Lencana & Penilaian"
            >
              <Award className="w-3.5 h-3.5 text-[#FFE082]" />
              <span className="hidden sm:inline font-bold">Lencana</span>
            </button>
          )}

          {/* Quick World Map Button */}
          <button
            onClick={() => {
              soundFX.playChime('gold');
              onSelectStage('WORLD_MAP');
            }}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#0B2544] hover:bg-[#123661] border border-cyan-400/50 text-cyan-200 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-103"
            title="Buka Peta Dunia 5 Zona"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Peta</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-[#0B2544] hover:bg-[#123661] text-slate-300 hover:text-[#FFE082] border border-white/10 transition-colors cursor-pointer"
            title={isMuted ? 'Nyalakan Audio' : 'Senyapkan Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#FFE082]" />}
          </button>

          {/* Mobile Menu Dropdown Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-[#0B2544] hover:bg-[#123661] text-slate-300 hover:text-white border border-white/10 cursor-pointer"
            title="Daftar Tahap"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#06101D]/98 border-b-2 border-[#D4AF37]/50 p-4 max-h-[70vh] overflow-y-auto">
          <div className="text-xs font-mono text-[#FFE082] uppercase tracking-wider mb-2 flex items-center justify-between font-bold">
            <span>12 Tahap Belajar Teks Prosedur Proseduria</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {STAGE_CONFIGS.map((stage) => {
              const isActive = stage.id === currentStage;
              return (
                <button
                  key={stage.id}
                  onClick={() => {
                    soundFX.playChime('click');
                    onSelectStage(stage.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37]/25 border-[#D4AF37] text-[#FFE082] shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'bg-[#0B1E38]/70 border-white/10 text-slate-300 hover:bg-[#0B1E38] hover:text-white'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0"
                    style={{ backgroundColor: `${stage.accentColor}30`, color: stage.accentColor }}
                  >
                    {stage.number}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold truncate text-white">{stage.label}</div>
                    <div className="text-[10px] text-slate-400 truncate">{stage.bloomLevel}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
