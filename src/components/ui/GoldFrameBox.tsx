/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface GoldFrameBoxProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  badge?: string;
  variant?: 'gold' | 'blue' | 'glitch';
}

export const GoldFrameBox: React.FC<GoldFrameBoxProps> = ({
  children,
  className = '',
  title,
  badge,
  variant = 'gold',
}) => {
  const borderColor =
    variant === 'glitch'
      ? 'border-[#FF0055] shadow-[0_0_25px_rgba(255,0,85,0.25)]'
      : 'border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.2)]';

  return (
    <div
      className={`relative rounded-2xl p-4 sm:p-6 bg-gradient-to-b from-[#0D2B45]/95 via-[#0A1F33]/95 to-[#06121E]/95 border-2 ${borderColor} backdrop-blur-md transition-all ${className}`}
    >
      {/* Decorative Ornate Gold Corner Filigree */}
      {/* Top Left */}
      <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-2 border-l-2 border-[#FFE082] pointer-events-none rounded-tl-lg flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
      </div>
      {/* Top Right */}
      <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-2 border-r-2 border-[#FFE082] pointer-events-none rounded-tr-lg flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
      </div>
      {/* Bottom Left */}
      <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-2 border-l-2 border-[#FFE082] pointer-events-none rounded-bl-lg flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
      </div>
      {/* Bottom Right */}
      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-2 border-r-2 border-[#FFE082] pointer-events-none rounded-br-lg flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
      </div>

      {/* Decorative Inner Hairline */}
      <div className="absolute inset-1.5 rounded-xl border border-[#D4AF37]/25 pointer-events-none" />

      {/* Header if title is present */}
      {(title || badge) && (
        <div className="relative z-10 flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#D4AF37]/30">
          {title && (
            <h3 className="text-base sm:text-lg font-bold font-['Cinzel'] tracking-wide text-[#FFE082] drop-shadow flex items-center gap-2">
              <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
              {title}
            </h3>
          )}
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFE082]">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
};
