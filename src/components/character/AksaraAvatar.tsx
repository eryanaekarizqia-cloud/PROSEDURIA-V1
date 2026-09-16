/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { AksaraExpression, AKSARA_EXPRESSIONS } from './AksaraCharacterSheetModal';
import { AksaraBustVisual } from './AksaraBustVisual';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';

interface AksaraAvatarProps {
  expression?: AksaraExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  showLevel?: boolean;
  showPoints?: boolean;
  level?: number;
  logicPoints?: number;
  isSpeaking?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AksaraAvatar: React.FC<AksaraAvatarProps> = ({
  expression = 'NORMAL',
  size = 'md',
  showBadge = true,
  showLevel = false,
  showPoints = false,
  level = 3,
  logicPoints = 120,
  isSpeaking = false,
  className = '',
  onClick,
}) => {
  const expr = AKSARA_EXPRESSIONS.find((e) => e.id === expression) || AKSARA_EXPRESSIONS[0];

  const pixelSizes = {
    sm: 38,
    md: 52,
    lg: 74,
    xl: 96,
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      title={`Aksara (${expr.name}): ${expr.desc}`}
    >
      {/* Ornate Golden Compass Ring Container matching HUD Utama */}
      <div className="relative flex items-center justify-center">
        {/* Animated Speaking / Logic Wave */}
        {isSpeaking && (
          <span className="absolute -inset-2 rounded-full border-2 border-rose-400/80 animate-ping pointer-events-none" />
        )}

        {/* Outer Bezel with Compass Ticks */}
        <div
          className={`relative rounded-full p-1 transition-all duration-300 ${
            isSpeaking
              ? 'bg-gradient-to-b from-rose-500 to-amber-600 shadow-[0_0_20px_rgba(244,63,94,0.7)] scale-105'
              : 'bg-gradient-to-b from-[#FFE082] via-[#D4AF37] to-[#8C6B1B] shadow-[0_0_16px_rgba(212,175,55,0.5)] group-hover:scale-105'
          }`}
        >
          {/* Compass 4 Cardinal Notch Points */}
          <span className="absolute top-0 inset-x-0 mx-auto w-1 h-1.5 bg-[#FFE082] rounded-full shadow" />
          <span className="absolute bottom-0 inset-x-0 mx-auto w-1 h-1.5 bg-[#FFE082] rounded-full shadow" />
          <span className="absolute left-0 inset-y-0 my-auto h-1 w-1.5 bg-[#FFE082] rounded-full shadow" />
          <span className="absolute right-0 inset-y-0 my-auto h-1 w-1.5 bg-[#FFE082] rounded-full shadow" />

          {/* Aksara Authentic High-Res Anime Portrait */}
          <AksaraBustVisual
            expression={expression}
            size={pixelSizes}
            isSpeaking={isSpeaking}
            showCompassBadge={false}
            variant="head"
          />

          {/* Miniature Golden Star Compass Pin */}
          <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#08182B] border border-amber-400 text-amber-300 shadow-md">
            <Compass className="w-3 h-3 text-amber-300 fill-amber-300/30" />
          </div>

          {/* Level Badge matching Concept Art (LV 3) */}
          {showLevel && (
            <div className="absolute -bottom-2 -left-1 px-1.5 py-0.2 rounded-full bg-[#061120] border border-amber-400 text-[9px] font-mono font-bold text-amber-300 shadow-lg tracking-tight">
              LV {level}
            </div>
          )}
        </div>
      </div>

      {/* Logic Points Bar (if requested, matching HUD Utama) */}
      {showPoints && (
        <div className="mt-1.5 flex flex-col items-center">
          <span className="text-[10px] font-mono font-bold text-[#FFE082] drop-shadow">
            {logicPoints} Poin Logika
          </span>
          <div className="w-16 h-1.5 bg-black/60 rounded-full border border-amber-400/40 overflow-hidden p-0.2">
            <div className="h-full w-4/5 bg-gradient-to-r from-amber-400 to-[#00F2FE] rounded-full" />
          </div>
        </div>
      )}

      {/* Optional Badge Label */}
      {showBadge && !showPoints && size !== 'sm' && (
        <div className="mt-1 px-2 py-0.5 rounded-full bg-[#08182B]/95 border border-amber-400/50 text-[9px] font-mono text-amber-300 font-bold tracking-tight shadow">
          {expr.name}
        </div>
      )}
    </div>
  );
};
