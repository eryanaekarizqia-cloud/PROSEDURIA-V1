/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type AksaraExpressionType =
  | 'NORMAL'
  | 'SENANG'
  | 'BERSEMANGAT'
  | 'TERKEJUT'
  | 'BERPIKIR'
  | 'BINGUNG'
  | 'SEDIH'
  | 'KHAWATIR'
  | 'FOKUS'
  | 'MENYELIDIKI'
  | 'TAKJUB'
  | 'SUKSES';

interface AksaraCharacterVisualProps {
  expression?: AksaraExpressionType;
  pose?: 'standing_compass' | 'welcoming' | 'hand_on_chest' | 'thumbs_up' | 'investigating';
  isSpeaking?: boolean;
  size?: number; // width in px
  className?: string;
  compassGlowing?: boolean;
}

/**
 * Aksara Vector Character Art
 * Accurately designed from the official character sheet:
 * - 14-year-old Logic Explorer of Proseduria
 * - Dark messy shaggy anime hair with locks framing the face
 * - Expressive amber-brown anime eyes
 * - Navy blue zip hoodie with golden compass crest on chest and sleeves
 * - White inner collared shirt
 * - Camo/cargo utility pants with straps and pockets
 * - Brown leather utility satchel and belt
 * - Ornate bronze celestial star compass glowing with radiant cyan light
 */
export const AksaraCharacterVisual: React.FC<AksaraCharacterVisualProps> = ({
  expression = 'NORMAL',
  pose = 'standing_compass',
  isSpeaking = false,
  size = 320,
  className = '',
  compassGlowing = true,
}) => {
  // Eye variations based on expression
  const renderEyes = () => {
    switch (expression) {
      case 'SENANG':
      case 'SUKSES':
        // Happy curved crescent eyes
        return (
          <g>
            <path d="M 85 92 Q 95 82 105 92" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M 135 92 Q 145 82 155 92" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Blushing cheeks */}
            <ellipse cx="82" cy="98" rx="7" ry="3.5" fill="#F43F5E" opacity="0.45" />
            <ellipse cx="158" cy="98" rx="7" ry="3.5" fill="#F43F5E" opacity="0.45" />
          </g>
        );
      case 'TERKEJUT':
      case 'TAKJUB':
        // Wide open sparkling eyes
        return (
          <g>
            <ellipse cx="95" cy="88" rx="13" ry="15" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            <ellipse cx="145" cy="88" rx="13" ry="15" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
            {/* Big amber irises */}
            <ellipse cx="95" cy="88" rx="9" ry="11" fill="#92400E" />
            <ellipse cx="95" cy="88" rx="5" ry="7" fill="#1E293B" />
            <ellipse cx="145" cy="88" rx="9" ry="11" fill="#92400E" />
            <ellipse cx="145" cy="88" rx="5" ry="7" fill="#1E293B" />
            {/* Sparkles */}
            <circle cx="92" cy="84" r="3.5" fill="#FFFFFF" />
            <circle cx="142" cy="84" r="3.5" fill="#FFFFFF" />
            <circle cx="97" cy="92" r="1.5" fill="#FFFFFF" />
            <circle cx="147" cy="92" r="1.5" fill="#FFFFFF" />
          </g>
        );
      case 'BINGUNG':
        // One eyebrow raised, slightly puzzled eyes
        return (
          <g>
            <ellipse cx="95" cy="90" rx="11" ry="12" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <ellipse cx="95" cy="90" rx="7" ry="8" fill="#B45309" />
            <circle cx="95" cy="90" r="4" fill="#0F172A" />
            <circle cx="93" cy="87" r="2.5" fill="#FFFFFF" />

            <ellipse cx="145" cy="92" rx="9" ry="8" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <ellipse cx="145" cy="92" rx="6" ry="6" fill="#B45309" />
            <circle cx="145" cy="92" r="3.5" fill="#0F172A" />
            <circle cx="143" cy="90" r="2" fill="#FFFFFF" />

            {/* Raised eyebrow */}
            <path d="M 83 75 Q 95 68 107 77" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 133 80 Q 145 77 157 82" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        );
      case 'SEDIH':
      case 'KHAWATIR':
        return (
          <g>
            <ellipse cx="95" cy="92" rx="10" ry="11" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <ellipse cx="95" cy="93" rx="7" ry="8" fill="#92400E" />
            <circle cx="95" cy="93" r="4" fill="#0F172A" />
            <circle cx="93" cy="89" r="2.5" fill="#FFFFFF" />

            <ellipse cx="145" cy="92" rx="10" ry="11" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <ellipse cx="145" cy="93" rx="7" ry="8" fill="#92400E" />
            <circle cx="145" cy="93" r="4" fill="#0F172A" />
            <circle cx="143" cy="89" r="2.5" fill="#FFFFFF" />

            {/* Worried tilted eyebrows */}
            <path d="M 85 77 Q 95 72 105 79" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 135 79 Q 145 72 155 77" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
        );
      default:
        // Normal & Focused big warm anime eyes
        return (
          <g>
            <ellipse cx="95" cy="90" rx="11" ry="13" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            <ellipse cx="145" cy="90" rx="11" ry="13" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
            {/* Amber Iris */}
            <ellipse cx="95" cy="90" rx="7.5" ry="9" fill="#B45309" />
            <ellipse cx="95" cy="90" rx="4.5" ry="5.5" fill="#0F172A" />
            <ellipse cx="145" cy="90" rx="7.5" ry="9" fill="#B45309" />
            <ellipse cx="145" cy="90" rx="4.5" ry="5.5" fill="#0F172A" />
            {/* Specular Highlights */}
            <circle cx="92" cy="86" r="3" fill="#FFFFFF" />
            <circle cx="142" cy="86" r="3" fill="#FFFFFF" />
            <circle cx="96" cy="93" r="1.5" fill="#FFFFFF" opacity="0.8" />
            <circle cx="146" cy="93" r="1.5" fill="#FFFFFF" opacity="0.8" />
            {/* Confident Eyebrows */}
            <path d="M 85 76 Q 96 72 107 77" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <path d="M 133 77 Q 144 72 155 76" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>
        );
    }
  };

  // Mouth movement when talking
  const renderMouth = () => {
    if (isSpeaking) {
      return (
        <g className="animate-pulse">
          {/* Animated open speaking mouth */}
          <path d="M 112 108 Q 120 118 128 108 Q 120 114 112 108 Z" fill="#E11D48" stroke="#881337" strokeWidth="1.5" />
          <ellipse cx="120" cy="111" rx="4" ry="2.5" fill="#FFE4E6" />
        </g>
      );
    }

    switch (expression) {
      case 'SENANG':
      case 'SUKSES':
      case 'BERSEMANGAT':
        return (
          <path d="M 112 107 Q 120 116 128 107" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" fill="#E11D48" />
        );
      case 'TERKEJUT':
        return (
          <ellipse cx="120" cy="111" rx="5" ry="7" fill="#991B1B" stroke="#450A0A" strokeWidth="1.5" />
        );
      case 'BERPIKIR':
        return (
          <path d="M 115 110 Q 120 108 125 110" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        );
      case 'SEDIH':
      case 'KHAWATIR':
        return (
          <path d="M 114 112 Q 120 106 126 112" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        );
      default:
        // Gentle warm closed smile
        return (
          <path d="M 113 108 Q 120 113 127 108" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
        );
    }
  };

  return (
    <div
      className={`relative inline-block select-none ${className}`}
      style={{ width: `${size}px`, height: `${(size * 480) / 320}px` }}
    >
      <svg
        viewBox="0 0 240 360"
        className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.6)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="hoodieNavy" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="50%" stopColor="#172554" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="hoodieTrimGold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id="hairDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <linearGradient id="skinTone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFEDD5" />
            <stop offset="100%" stopColor="#FED7AA" />
          </linearGradient>

          <linearGradient id="camoPants" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="40%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          <radialGradient id="compassGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22D3EE" stopOpacity="1" />
            <stop offset="40%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
          </radialGradient>

          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. SHADOW UNDER FEET */}
        <ellipse cx="120" cy="345" rx="55" ry="9" fill="#000000" opacity="0.4" />

        {/* 2. LEGS & CARGO PANTS WITH STRAPS */}
        <g id="legs">
          {/* Left Leg */}
          <path
            d="M 98 225 L 85 305 L 105 310 L 115 230 Z"
            fill="url(#camoPants)"
            stroke="#0F172A"
            strokeWidth="2"
          />
          {/* Right Leg */}
          <path
            d="M 125 230 L 135 310 L 155 305 L 142 225 Z"
            fill="url(#camoPants)"
            stroke="#0F172A"
            strokeWidth="2"
          />
          {/* Utility Pocket Straps on thighs */}
          <rect x="80" y="255" width="22" height="24" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <path d="M 80 263 L 102 263" stroke="#F59E0B" strokeWidth="1.5" />
          <rect x="138" y="255" width="22" height="24" rx="4" fill="#334155" stroke="#475569" strokeWidth="1.5" />
          <path d="M 138 263 L 160 263" stroke="#F59E0B" strokeWidth="1.5" />

          {/* High-top Sneakers */}
          {/* Left Sneaker */}
          <path
            d="M 82 305 L 80 330 Q 80 338 100 338 L 108 338 L 106 308 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="2"
          />
          <path d="M 80 332 L 108 332" stroke="#FDE047" strokeWidth="2.5" />
          <rect x="79" y="334" width="30" height="6" rx="2" fill="#F8FAFC" />

          {/* Right Sneaker */}
          <path
            d="M 134 308 L 132 338 L 140 338 Q 160 338 160 330 L 158 305 Z"
            fill="#1E293B"
            stroke="#0F172A"
            strokeWidth="2"
          />
          <path d="M 132 332 L 160 332" stroke="#FDE047" strokeWidth="2.5" />
          <rect x="131" y="334" width="30" height="6" rx="2" fill="#F8FAFC" />
        </g>

        {/* 3. TORSO, SHIRT & HOODIE */}
        <g id="torso">
          {/* White Collared Shirt Base */}
          <path d="M 105 130 L 120 175 L 135 130 Z" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
          {/* Gold Tie Pin / Pendant */}
          <path d="M 118 140 L 122 140 L 120 152 Z" fill="#F59E0B" />

          {/* Navy Blue Hoodie Jacket */}
          <path
            d="M 75 130 Q 120 120 165 130 L 160 225 L 80 225 Z"
            fill="url(#hoodieNavy)"
            stroke="#1E3A8A"
            strokeWidth="2"
          />

          {/* Front Center Zipper Line with Open Lapels */}
          <path d="M 104 130 L 108 225" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M 136 130 L 132 225" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />

          {/* Golden Academy Crest on Left Chest */}
          <g transform="translate(142, 150) scale(0.6)">
            <circle cx="10" cy="10" r="10" fill="#F59E0B" />
            <polygon points="10,2 12,8 18,10 12,12 10,18 8,12 2,10 8,8" fill="#1E293B" />
          </g>

          {/* Brown Leather Belt & Satchel Bags on Hips */}
          <rect x="78" y="215" width="84" height="10" rx="3" fill="#78350F" stroke="#451A03" strokeWidth="1" />
          <rect x="114" y="213" width="12" height="14" rx="2" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />

          {/* Left Satchel Bag */}
          <rect x="68" y="215" width="18" height="22" rx="4" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="77" cy="226" r="3" fill="#F59E0B" />

          {/* Right Satchel Bag */}
          <rect x="154" y="215" width="18" height="22" rx="4" fill="#92400E" stroke="#78350F" strokeWidth="1.5" />
          <circle cx="163" cy="226" r="3" fill="#F59E0B" />
        </g>

        {/* 4. ARMS & HANDS */}
        <g id="arms">
          {/* Left Arm (Waving or Resting depending on pose) */}
          {pose === 'welcoming' ? (
            <g>
              <path
                d="M 75 135 L 45 170 L 40 185 L 56 195 L 68 155 Z"
                fill="url(#hoodieNavy)"
                stroke="#1E3A8A"
                strokeWidth="2"
              />
              {/* Left hand welcoming gesture */}
              <circle cx="38" cy="192" r="8" fill="url(#skinTone)" />
            </g>
          ) : pose === 'hand_on_chest' ? (
            <g>
              <path
                d="M 75 135 L 95 165 L 115 160 L 105 145 Z"
                fill="url(#hoodieNavy)"
                stroke="#1E3A8A"
                strokeWidth="2"
              />
              {/* Hand over heart */}
              <ellipse cx="116" cy="162" rx="8" ry="6" fill="url(#skinTone)" />
            </g>
          ) : (
            <g>
              {/* Left arm resting with holographic bracer on wrist */}
              <path
                d="M 75 135 L 62 195 L 76 200 L 88 150 Z"
                fill="url(#hoodieNavy)"
                stroke="#1E3A8A"
                strokeWidth="2"
              />
              {/* Holographic gadget / star compass watch */}
              <rect x="60" y="190" width="12" height="7" rx="2" fill="#0EA5E9" stroke="#38BDF8" strokeWidth="1.5" />
              <circle cx="66" cy="193.5" r="2" fill="#FFFFFF" />
              <ellipse cx="64" cy="204" rx="6" ry="7" fill="url(#skinTone)" />
            </g>
          )}

          {/* Right Arm (Holding the Celestial Glowing Compass) */}
          <g id="rightArmHoldingCompass">
            <path
              d="M 165 135 L 182 170 L 175 190 L 155 175 L 150 145 Z"
              fill="url(#hoodieNavy)"
              stroke="#1E3A8A"
              strokeWidth="2"
            />
            {/* Sleeve gold emblem */}
            <circle cx="174" cy="155" r="4" fill="#F59E0B" />

            {/* Hand gripping compass */}
            <ellipse cx="184" cy="186" rx="7" ry="8" fill="url(#skinTone)" />

            {/* ORNATE CELESTIAL PROSEDUR COMPASS (FROM CHAR SHEET) */}
            <g transform="translate(182, 185)">
              {/* Aura Radiance */}
              {compassGlowing && (
                <circle cx="0" cy="0" r="28" fill="url(#compassGlow)" className="animate-pulse" />
              )}

              {/* Bronze Outer Bezel */}
              <circle cx="0" cy="0" r="16" fill="#78350F" stroke="#F59E0B" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="13" fill="#0C4A6E" stroke="#38BDF8" strokeWidth="1" />

              {/* 8-Point Glowing Star */}
              <g className={compassGlowing ? 'animate-spin' : ''} style={{ transformOrigin: '0px 0px', animationDuration: '14s' }}>
                <polygon points="0,-11 3,-3 11,0 3,3 0,11 -3,3 -11,0 -3,-3" fill="#38BDF8" />
                <polygon points="0,-11 2,-2 11,0 2,2 0,11 -2,2 -11,0 -2,-2" fill="#E0F2FE" />
                <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
              </g>

              {/* Sparkles around compass */}
              {compassGlowing && (
                <g>
                  <circle cx="-16" cy="-14" r="2" fill="#E0F2FE" className="animate-ping" />
                  <circle cx="18" cy="10" r="1.5" fill="#38BDF8" />
                </g>
              )}
            </g>
          </g>
        </g>

        {/* 5. HEAD, NECK & FACE */}
        <g id="head">
          {/* Neck */}
          <rect x="110" y="115" width="20" height="20" rx="3" fill="url(#skinTone)" />

          {/* Face Base */}
          <path
            d="M 80 85 Q 75 110 120 128 Q 165 110 160 85 Q 160 55 120 55 Q 80 55 80 85 Z"
            fill="url(#skinTone)"
            stroke="#FDBA74"
            strokeWidth="1"
          />

          {/* Cute Ears */}
          <ellipse cx="76" cy="88" rx="6" ry="9" fill="url(#skinTone)" stroke="#FDBA74" />
          <ellipse cx="164" cy="88" rx="6" ry="9" fill="url(#skinTone)" stroke="#FDBA74" />

          {/* Eyes (Dynamic by Expression) */}
          {renderEyes()}

          {/* Small nose */}
          <path d="M 120 97 L 118 102 L 122 102" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Mouth (Dynamic by Expression & Speaking) */}
          {renderMouth()}

          {/* 6. SIGNATURE SHAGGY ANIME HAIR (ACCURATE TO USER'S CHAR SHEET) */}
          <g id="hair">
            {/* Back Hair Volume */}
            <path
              d="M 68 85 Q 60 50 90 35 Q 120 25 155 35 Q 180 50 172 85 Q 170 105 164 112 L 160 90 Q 155 60 120 58 Q 85 60 80 90 L 76 112 Q 70 105 68 85 Z"
              fill="url(#hairDark)"
            />

            {/* Front Spiky Bangs & Layered Strands */}
            <path
              d="M 72 65 Q 85 45 105 52 Q 95 65 92 78 Z"
              fill="url(#hairDark)"
            />
            <path
              d="M 98 48 Q 120 38 135 55 Q 125 72 120 80 Z"
              fill="#1E293B"
            />
            <path
              d="M 125 50 Q 148 42 165 65 Q 155 78 148 85 Z"
              fill="url(#hairDark)"
            />
            {/* Forehead Stray Tuft */}
            <path
              d="M 108 60 Q 115 50 125 65 Q 118 76 112 78 Z"
              fill="#334155"
            />
            {/* Side Bangs Framing Cheeks */}
            <path d="M 78 80 Q 75 95 82 105 Q 84 92 82 82 Z" fill="#1E293B" />
            <path d="M 162 80 Q 165 95 158 105 Q 156 92 158 82 Z" fill="#1E293B" />

            {/* Hair Highlight Glint */}
            <path
              d="M 92 48 Q 120 38 145 46"
              stroke="#64748B"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.6"
            />
          </g>
        </g>
      </svg>
    </div>
  );
};
