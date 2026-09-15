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
  Sparkles,
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#08182B]/95 backdrop-blur-md border-b-2 border-[#D4AF37]/50 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Left: Brand Identity (PROSEDURIA) & Current Stage */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              soundFX.playChime('cyan');
              onSelectStage('OPENING');
            }}
            className="flex items-center gap-2 group cursor-pointer"
            title="Kembali ke Beranda Proseduria"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] border border-[#FFE082] flex items-center justify-center text-slate-950 font-bold group-hover:scale-105 transition-transform shadow-[0_0_12px_rgba(212,175,55,0.4)]">
              ★
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-['Cinzel'] font-black text-xs tracking-wider text-[#FFE082] group-hover:text-white transition-colors">
                PROSEDURIA
              </span>
              <span className="text-[10px] font-mono text-cyan-300 -mt-0.5">
                Protokol Teks Prosedur
              </span>
            </div>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-600 hidden md:block" />

          {/* Current Stage Pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#0D2B45] border border-[#D4AF37]/40 shadow-inner">
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#D4AF37]/20 text-[#FFE082]">
              {currentConfig.bloomTaxonomy}
            </span>
            <span className="text-xs font-semibold text-slate-200 truncate max-w-[130px] sm:max-w-xs">
              {currentConfig.number}. {currentConfig.label}
            </span>
          </div>
        </div>

        {/* Center: Stage Stepper Dots (Desktop) */}
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
                    ? 'bg-[#D4AF37]/25 text-[#FFE082] border border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)] font-bold'
                    : isPassed
                    ? 'bg-[#0D2B45]/60 text-slate-300 hover:text-white border border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                    : 'bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5 hover:border-white/20'
                }`}
                title={`${stage.number}. ${stage.label} (${stage.bloomLevel})`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-[#FFE082] animate-ping' : isPassed ? 'bg-emerald-400' : 'bg-slate-500'
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
        <div className="flex items-center gap-2">
          {/* Badge Showcase Button */}
          {onOpenBadges && (
            <button
              onClick={() => {
                soundFX.playChime('victory');
                onOpenBadges();
              }}
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50 text-[#FFE082] text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
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
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#0D2B45] hover:bg-[#153B5C] border border-cyan-400/40 text-cyan-200 text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
            title="Buka Peta Dunia 5 Zona"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Peta</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-[#0D2B45] hover:bg-[#153B5C] text-slate-300 hover:text-[#FFE082] border border-white/10 transition-colors cursor-pointer"
            title={isMuted ? 'Nyalakan Audio' : 'Senyapkan Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#FFE082]" />}
          </button>

          {/* Mobile Menu Dropdown Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-[#0D2B45] hover:bg-[#153B5C] text-slate-300 hover:text-white border border-white/10 cursor-pointer"
            title="Daftar Tahap"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#08182B]/98 border-b-2 border-[#D4AF37]/50 p-4 max-h-[70vh] overflow-y-auto">
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
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFE082]'
                      : 'bg-[#0D2B45]/60 border-white/10 text-slate-300 hover:bg-[#0D2B45] hover:text-white'
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
