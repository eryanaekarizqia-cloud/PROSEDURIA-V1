/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Search,
  FileText,
  GitCommit,
  Stethoscope,
  Wrench,
  FlaskConical,
  Hammer,
  Trophy,
} from 'lucide-react';

export interface StoryboardStep {
  step: number;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
}

export const STORYBOARD_STEPS: StoryboardStep[] = [
  { step: 1, label: 'AMATI', sub: 'Temukan hal janggal', icon: Search, color: 'from-cyan-400 to-blue-500', badgeBg: 'bg-cyan-500/20 border-cyan-400 text-cyan-300' },
  { step: 2, label: 'BUKTI', sub: 'Kumpulkan data', icon: FileText, color: 'from-sky-400 to-indigo-500', badgeBg: 'bg-sky-500/20 border-sky-400 text-sky-300' },
  { step: 3, label: 'ANALISIS', sub: 'Sebab & akibat', icon: GitCommit, color: 'from-blue-400 to-violet-500', badgeBg: 'bg-blue-500/20 border-blue-400 text-blue-300' },
  { step: 4, label: 'DIAGNOSIS', sub: 'Deteksi glitch', icon: Stethoscope, color: 'from-rose-400 to-pink-500', badgeBg: 'bg-rose-500/20 border-rose-400 text-rose-300' },
  { step: 5, label: 'PERBAIKI', sub: 'Susun urutan 1-4', icon: Wrench, color: 'from-amber-400 to-orange-500', badgeBg: 'bg-amber-500/20 border-amber-400 text-amber-300' },
  { step: 6, label: 'UJI COBA', sub: 'Simulasi reaksi', icon: FlaskConical, color: 'from-emerald-400 to-teal-500', badgeBg: 'bg-emerald-500/20 border-emerald-400 text-emerald-300' },
  { step: 7, label: 'RANCANG', sub: 'Procedure forge', icon: Hammer, color: 'from-yellow-400 to-amber-500', badgeBg: 'bg-yellow-500/20 border-yellow-400 text-yellow-300' },
  { step: 8, label: 'BUKTIKAN', sub: 'Dunia pulih!', icon: Trophy, color: 'from-amber-300 to-yellow-400', badgeBg: 'bg-amber-400/20 border-amber-300 text-amber-200' },
];

interface StoryboardProgressHUDProps {
  currentStep: number;
  className?: string;
  compact?: boolean;
}

export const StoryboardProgressHUD: React.FC<StoryboardProgressHUDProps> = ({
  currentStep,
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`w-full p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r from-[#071E36]/95 via-[#0A2745]/95 to-[#071E36]/95 border-2 border-[#D4AF37]/50 shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold font-mono text-[10px] tracking-wider uppercase shadow-sm">
            Storyboard Perjalanan
          </span>
          <span className="hidden sm:inline text-xs font-semibold text-slate-200">
            8 Alur Pemecahan Masalah Teks Prosedur
          </span>
        </div>
        <div className="text-[11px] font-mono font-bold text-amber-300">
          Langkah <span className="text-white text-xs">{currentStep}</span> dari 8
        </div>
      </div>

      {/* Steps Track */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 sm:gap-2">
        {STORYBOARD_STEPS.map((s) => {
          const isActive = s.step === currentStep;
          const isPassed = s.step < currentStep;
          const Icon = s.icon;

          return (
            <div
              key={s.step}
              className={`relative flex flex-col items-center p-1.5 sm:p-2 rounded-xl transition-all duration-300 border text-center ${
                isActive
                  ? 'bg-gradient-to-b from-white/20 via-white/10 to-transparent border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-[1.03] ring-2 ring-amber-400'
                  : isPassed
                  ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-200'
                  : 'bg-black/30 border-white/10 opacity-70 text-slate-400'
              }`}
            >
              {/* Step Number Badge */}
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold mb-1 shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 ring-2 ring-amber-300'
                    : isPassed
                    ? 'bg-emerald-400 text-slate-950'
                    : 'bg-white/10 text-slate-300'
                }`}
              >
                {s.step}
              </div>

              {/* Icon */}
              <Icon
                className={`w-4 h-4 mb-0.5 ${
                  isActive ? 'text-amber-300 animate-bounce' : isPassed ? 'text-emerald-300' : 'text-slate-400'
                }`}
              />

              {/* Label */}
              <span
                className={`text-[9px] sm:text-[10px] font-bold tracking-tight uppercase leading-tight ${
                  isActive ? 'text-white drop-shadow' : isPassed ? 'text-emerald-200' : 'text-slate-400'
                }`}
              >
                {s.label}
              </span>

              {!compact && (
                <span className="hidden md:block text-[8px] text-slate-300/80 leading-tight mt-0.5 line-clamp-1">
                  {s.sub}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
