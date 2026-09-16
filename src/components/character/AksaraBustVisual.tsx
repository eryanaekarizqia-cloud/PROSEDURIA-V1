/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AksaraExpressionType } from './AksaraCharacterVisual';

interface AksaraBustVisualProps {
  expression?: AksaraExpressionType;
  size?: number; // width in px
  isSpeaking?: boolean;
  className?: string;
  showCompassBadge?: boolean;
}

/**
 * Aksara Bust Portrait Vector
 * Renders the accurate anime portrait of Aksara based on the character sheet expressions.
 */
export const AksaraBustVisual: React.FC<AksaraBustVisualProps> = ({
  expression = 'NORMAL',
  size = 64,
  isSpeaking = false,
  className = '',
  showCompassBadge = true,
}) => {
  const renderEyes = () => {
    switch (expression) {
      case 'SENANG':
      case 'SUKSES':
        return (
          <g>
            <path d="M 36 48 Q 44 38 52 48" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 68 48 Q 76 38 84 48" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" fill="none" />
            <ellipse cx="34" cy="54" rx="5" ry="2.5" fill="#F43F5E" opacity="0.5" />
            <ellipse cx="86" cy="54" rx="5" ry="2.5" fill="#F43F5E" opacity="0.5" />
          </g>
        );
      case 'TERKEJUT':
      case 'TAKJUB':
        return (
          <g>
            <ellipse cx="44" cy="46" rx="8" ry="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <ellipse cx="76" cy="46" rx="8" ry="10" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="44" cy="46" r="6" fill="#92400E" />
            <circle cx="44" cy="46" r="3" fill="#0F172A" />
            <circle cx="76" cy="46" r="6" fill="#92400E" />
            <circle cx="76" cy="46" r="3" fill="#0F172A" />
            <circle cx="42" cy="43" r="2.5" fill="#FFFFFF" />
            <circle cx="74" cy="43" r="2.5" fill="#FFFFFF" />
          </g>
        );
      case 'BINGUNG':
        return (
          <g>
            <ellipse cx="44" cy="47" rx="7" ry="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="44" cy="47" r="5" fill="#B45309" />
            <circle cx="42" cy="45" r="2" fill="#FFFFFF" />
            <ellipse cx="76" cy="48" rx="6" ry="6" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="76" cy="48" r="4" fill="#B45309" />
            <circle cx="74" cy="46" r="1.5" fill="#FFFFFF" />
            {/* Raised eyebrow */}
            <path d="M 36 36 Q 44 30 52 37" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 68 40 Q 76 38 84 41" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'SEDIH':
      case 'KHAWATIR':
        return (
          <g>
            <ellipse cx="44" cy="48" rx="7" ry="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="44" cy="49" r="5" fill="#92400E" />
            <circle cx="42" cy="46" r="2" fill="#FFFFFF" />
            <ellipse cx="76" cy="48" rx="7" ry="8" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <circle cx="76" cy="49" r="5" fill="#92400E" />
            <circle cx="74" cy="46" r="2" fill="#FFFFFF" />
            <path d="M 36 38 Q 44 33 52 39" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 68 39 Q 76 33 84 38" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'FOKUS':
      case 'MENYELIDIKI':
        return (
          <g>
            <ellipse cx="44" cy="47" rx="7" ry="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <ellipse cx="76" cy="47" rx="7" ry="7" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2" />
            <circle cx="44" cy="47" r="4.5" fill="#0284C7" />
            <circle cx="76" cy="47" r="4.5" fill="#0284C7" />
            <circle cx="43" cy="45" r="1.5" fill="#FFFFFF" />
            <circle cx="75" cy="45" r="1.5" fill="#FFFFFF" />
            {/* Serious sharp eyebrows */}
            <path d="M 36 38 L 52 40" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 84 38 L 68 40" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      default:
        // Normal warm anime eyes
        return (
          <g>
            <ellipse cx="44" cy="47" rx="7.5" ry="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <ellipse cx="76" cy="47" rx="7.5" ry="9" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
            <ellipse cx="44" cy="47" rx="5" ry="6.5" fill="#B45309" />
            <circle cx="44" cy="47" r="3" fill="#0F172A" />
            <ellipse cx="76" cy="47" rx="5" ry="6.5" fill="#B45309" />
            <circle cx="76" cy="47" r="3" fill="#0F172A" />
            <circle cx="42" cy="44" r="2" fill="#FFFFFF" />
            <circle cx="74" cy="44" r="2" fill="#FFFFFF" />
            {/* Eyebrows */}
            <path d="M 36 37 Q 44 33 52 38" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M 68 38 Q 76 33 84 37" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );
    }
  };

  const renderMouth = () => {
    if (isSpeaking) {
      return (
        <path d="M 55 60 Q 60 67 65 60 Q 60 63 55 60 Z" fill="#E11D48" stroke="#881337" strokeWidth="1" />
      );
    }
    switch (expression) {
      case 'SENANG':
      case 'SUKSES':
      case 'BERSEMANGAT':
        return (
          <path d="M 54 59 Q 60 66 66 59" stroke="#991B1B" strokeWidth="2" strokeLinecap="round" fill="#E11D48" />
        );
      case 'TERKEJUT':
        return (
          <ellipse cx="60" cy="61" rx="3.5" ry="5" fill="#991B1B" stroke="#450A0A" strokeWidth="1" />
        );
      default:
        return (
          <path d="M 55 60 Q 60 64 65 60" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" fill="none" />
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none rounded-full overflow-hidden ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bustBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F2942" />
            <stop offset="100%" stopColor="#081524" />
          </linearGradient>
          <linearGradient id="bustHoodie" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="bustHair" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
        </defs>

        {/* Circular Background */}
        <circle cx="60" cy="60" r="58" fill="url(#bustBg)" stroke="#D4AF37" strokeWidth="2" />

        {/* Halo Glow */}
        <circle cx="60" cy="50" r="42" fill="#38BDF8" opacity="0.1" />

        {/* Neck & Collared Shirt */}
        <rect x="52" y="65" width="16" height="15" fill="#FED7AA" />
        <path d="M 48 76 L 60 92 L 72 76 Z" fill="#F8FAFC" />
        <polygon points="58,80 62,80 60,86" fill="#F59E0B" />

        {/* Navy Hoodie Shoulders */}
        <path
          d="M 20 120 L 25 88 Q 60 76 95 88 L 100 120 Z"
          fill="url(#bustHoodie)"
          stroke="#1E3A8A"
          strokeWidth="1.5"
        />

        {/* Gold Chest Badge on Left */}
        <g transform="translate(80, 92) scale(0.4)">
          <circle cx="10" cy="10" r="9" fill="#F59E0B" />
          <polygon points="10,2 12,8 18,10 12,12 10,18 8,12 2,10 8,8" fill="#0F172A" />
        </g>

        {/* Head & Face */}
        <path
          d="M 35 48 Q 30 65 60 75 Q 90 65 85 48 Q 85 28 60 28 Q 35 28 35 48 Z"
          fill="#FED7AA"
        />
        {/* Ears */}
        <ellipse cx="32" cy="50" rx="4" ry="6" fill="#FED7AA" />
        <ellipse cx="88" cy="50" rx="4" ry="6" fill="#FED7AA" />

        {/* Eyes */}
        {renderEyes()}

        {/* Nose */}
        <path d="M 60 52 L 59 55 L 61 55" stroke="#B45309" strokeWidth="1" strokeLinecap="round" />

        {/* Mouth */}
        {renderMouth()}

        {/* Shaggy Anime Hair */}
        <g id="bustHair">
          {/* Back Volume */}
          <path
            d="M 28 48 Q 22 25 45 16 Q 60 10 80 16 Q 98 25 92 48 Q 88 56 86 48 Q 80 20 60 19 Q 40 20 34 48 Z"
            fill="url(#bustHair)"
          />
          {/* Front Bangs & Strands */}
          <path d="M 30 38 Q 40 24 52 28 Q 45 36 42 44 Z" fill="url(#bustHair)" />
          <path d="M 48 24 Q 60 18 70 28 Q 64 38 60 44 Z" fill="#1E293B" />
          <path d="M 65 24 Q 80 18 90 34 Q 84 42 78 46 Z" fill="url(#bustHair)" />
          {/* Stray center tuft */}
          <path d="M 54 30 Q 60 22 64 32 Q 60 38 56 40 Z" fill="#334155" />
          {/* Side tendrils */}
          <path d="M 33 46 Q 31 56 36 60 Q 37 52 35 46 Z" fill="#1E293B" />
          <path d="M 87 46 Q 89 56 84 60 Q 83 52 85 46 Z" fill="#1E293B" />
        </g>

        {/* Glowing Compass Badge at Bottom Right */}
        {showCompassBadge && (
          <g transform="translate(86, 86) scale(0.6)">
            <circle cx="16" cy="16" r="15" fill="#0C4A6E" stroke="#F59E0B" strokeWidth="2.5" />
            <polygon points="16,4 19,13 28,16 19,19 16,28 13,19 4,16 13,13" fill="#38BDF8" />
            <circle cx="16" cy="16" r="3" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    </div>
  );
};
