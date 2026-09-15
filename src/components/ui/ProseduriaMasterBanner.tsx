/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, Brain, Wrench, Hammer, Trophy, Sparkles } from 'lucide-react';

interface ProseduriaMasterBannerProps {
  className?: string;
  compact?: boolean;
}

export const ProseduriaMasterBanner: React.FC<ProseduriaMasterBannerProps> = ({
  className = '',
  compact = false,
}) => {
  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border-2 border-[#D4AF37] bg-gradient-to-r from-[#0C2744] via-[#0E345A] to-[#0C2744] p-3 sm:p-4 shadow-[0_10px_35px_rgba(0,0,0,0.6)] ${className}`}
    >
      {/* Background Golden Glow & Particle Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Subtitle Banner */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase mb-1 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>DUNIA YANG RUSAK KARENA LANGKAH YANG SALAH</span>
        </div>

        {/* Grand Slogan */}
        <h2 className="text-base sm:text-xl md:text-2xl font-['Cinzel'] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#FFE082] via-white to-[#FFE082] tracking-wide drop-shadow-md">
          TEMUKAN LOGIKANYA. PERBAIKI PROSEDURNYA.
        </h2>

        {/* 5 Core Action Pills */}
        {!compact && (
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#00F2FE]/15 border border-[#00F2FE]/50 text-cyan-200 text-xs font-mono shadow-sm">
              <Search className="w-3.5 h-3.5 text-[#00F2FE]" />
              <strong className="text-white">AMATI:</strong>
              <span className="text-[11px] text-cyan-200">Temukan bukti</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-400/50 text-indigo-200 text-xs font-mono shadow-sm">
              <Brain className="w-3.5 h-3.5 text-indigo-300" />
              <strong className="text-white">ANALISIS:</strong>
              <span className="text-[11px] text-indigo-200">Sebab & akibat</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-200 text-xs font-mono shadow-sm">
              <Wrench className="w-3.5 h-3.5 text-amber-300" />
              <strong className="text-white">PERBAIKI:</strong>
              <span className="text-[11px] text-amber-200">Susun urutan</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-yellow-500/20 border border-yellow-400/50 text-yellow-200 text-xs font-mono shadow-sm">
              <Hammer className="w-3.5 h-3.5 text-yellow-300" />
              <strong className="text-white">RANCANG:</strong>
              <span className="text-[11px] text-yellow-200">Procedure Forge</span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-xs font-mono shadow-sm">
              <Trophy className="w-3.5 h-3.5 text-emerald-300" />
              <strong className="text-white">BUKTIKAN:</strong>
              <span className="text-[11px] text-emerald-200">Uji logikamu</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
