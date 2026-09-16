/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass } from 'lucide-react';
import { AksaraExpression, AKSARA_EXPRESSIONS } from './AksaraCharacterSheetModal';
import { AksaraBustVisual } from './AksaraBustVisual';

interface AksaraAvatarProps {
  expression?: AksaraExpression;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  isSpeaking?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AksaraAvatar: React.FC<AksaraAvatarProps> = ({
  expression = 'NORMAL',
  size = 'md',
  showBadge = true,
  isSpeaking = false,
  className = '',
  onClick,
}) => {
  const expr = AKSARA_EXPRESSIONS.find((e) => e.id === expression) || AKSARA_EXPRESSIONS[0];

  const pixelSizes = {
    sm: 38,
    md: 54,
    lg: 76,
    xl: 104,
  }[size];

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
      title={`Aksara (${expr.name}): ${expr.desc}`}
    >
      {/* Outer Glow Ring Container */}
      <div
        className={`relative rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg p-0.5 ${
          isSpeaking
            ? 'border-rose-400 bg-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
            : 'border-[#D4AF37] bg-gradient-to-b from-[#0E2841] to-[#08182B] shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:scale-105'
        }`}
      >
        {/* Animated Sound / Magic Wave when speaking */}
        {isSpeaking && (
          <span className="absolute -inset-1 rounded-full border border-rose-400/60 animate-ping pointer-events-none" />
        )}

        {/* Aksara Accurate Bust Portrait Vector */}
        <AksaraBustVisual
          expression={expression}
          size={pixelSizes}
          isSpeaking={isSpeaking}
          showCompassBadge={false}
        />

        {/* Small Compass Badge Pin */}
        <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-[#08182B] border border-amber-400 text-amber-300 shadow-md">
          <Compass className="w-3 h-3 text-amber-300" />
        </div>
      </div>

      {/* Optional Badge Label */}
      {showBadge && size !== 'sm' && (
        <div className="mt-1 px-2 py-0.5 rounded-full bg-[#08182B]/90 border border-amber-400/50 text-[9px] font-mono text-amber-300 font-bold tracking-tight shadow">
          {expr.name}
        </div>
      )}
    </div>
  );
};
