/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles, HelpCircle, AlertCircle, Search, ThumbsUp } from 'lucide-react';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import { AksaraExpressionType } from './AksaraCharacterVisual';

interface AksaraBustVisualProps {
  expression?: AksaraExpressionType;
  size?: number; // width in px
  isSpeaking?: boolean;
  className?: string;
  showCompassBadge?: boolean;
  variant?: 'head' | 'bust';
}

/**
 * Aksara Bust Portrait Visual
 * Renders the authentic, high-definition anime portrait of Aksara (14-year-old Logic Explorer of Proseduria)
 * matching the official character sheet and concept art:
 * - Tousled dark spiky hair with soft bangs
 * - Warm, confident amber-brown anime eyes
 * - Royal navy blue explorer jacket with golden collar embroidery and filigree
 * - Ornate golden Kompas Prosedur with radiant cyan star
 * - Interactive anime emotion indicators (12 expressions)
 */
export const AksaraBustVisual: React.FC<AksaraBustVisualProps> = ({
  expression = 'NORMAL',
  size = 64,
  isSpeaking = false,
  className = '',
  showCompassBadge = true,
  variant = 'head',
}) => {
  const imgSrc = variant === 'bust' ? PROSEDURIA_ASSETS.aksaraBustHD : PROSEDURIA_ASSETS.aksaraAvatarHD;

  // Emotion-specific overlay badge / symbol
  const renderEmotionOverlay = () => {
    switch (expression) {
      case 'SENANG':
        return (
          <div className="absolute top-1 right-1 px-1 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400 text-[10px] text-emerald-300 font-bold flex items-center gap-0.5 shadow-md animate-bounce">
            <span>✨</span>
          </div>
        );
      case 'BERSEMANGAT':
        return (
          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400 text-[10px] text-amber-300 font-bold flex items-center gap-0.5 shadow-md animate-pulse">
            <span>🔥</span>
          </div>
        );
      case 'TERKEJUT':
        return (
          <div className="absolute top-0 right-1 px-1.5 py-0.5 rounded-full bg-orange-600 border border-white text-white font-black text-xs shadow-lg animate-ping">
            !
          </div>
        );
      case 'BERPIKIR':
        return (
          <div className="absolute top-1 right-1 p-1 rounded-full bg-indigo-950/90 border border-indigo-400 text-indigo-300 shadow-md">
            <span className="text-[10px]">💭</span>
          </div>
        );
      case 'BINGUNG':
        return (
          <div className="absolute top-0 right-1 p-0.5 rounded-full bg-purple-950/90 border border-purple-400 text-purple-300 shadow-md animate-bounce">
            <HelpCircle className="w-3.5 h-3.5 text-purple-300" />
          </div>
        );
      case 'SEDIH':
        return (
          <div className="absolute top-1 right-1 p-1 rounded-full bg-blue-950/90 border border-blue-400 text-blue-300 text-[10px]">
            💧
          </div>
        );
      case 'KHAWATIR':
        return (
          <div className="absolute top-1 right-1 p-1 rounded-full bg-amber-950/90 border border-amber-400 text-amber-300 text-[10px] animate-pulse">
            💦
          </div>
        );
      case 'FOKUS':
        return (
          <div className="absolute inset-x-2 top-2 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/80 text-[8px] font-mono text-cyan-200 text-center uppercase tracking-wider backdrop-blur-xs">
            HUD FOCUS
          </div>
        );
      case 'MENYELIDIKI':
        return (
          <div className="absolute bottom-1 left-1 p-1 rounded-full bg-amber-950/90 border border-amber-400 text-amber-300 shadow-md">
            <Search className="w-3 h-3 text-amber-300" />
          </div>
        );
      case 'TAKJUB':
        return (
          <div className="absolute top-1 right-1 px-1 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-300 text-cyan-300 text-[10px] font-bold shadow-md animate-spin-slow">
            ✦
          </div>
        );
      case 'SUKSES':
        return (
          <div className="absolute bottom-1 right-1 p-1 rounded-full bg-emerald-500 border border-white text-white shadow-lg flex items-center justify-center">
            <ThumbsUp className="w-3 h-3 text-white fill-current" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden shrink-0 select-none bg-gradient-to-b from-[#0e2a4a] via-[#08182b] to-[#040c18] border-2 border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.4)] flex items-center justify-center ${
        isSpeaking ? 'ring-2 ring-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : ''
      } ${className}`}
    >
      {/* High Definition Anime Illustration of Aksara */}
      <img
        src={imgSrc}
        alt="Aksara - Penjelajah Logika"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center scale-105 transition-transform duration-300 hover:scale-110"
      />

      {/* Subtle Inner Gradient & Vignette for Premium Depth */}
      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-amber-300/30 pointer-events-none bg-gradient-to-t from-[#040C1A]/60 via-transparent to-transparent" />

      {/* Speaking Sound Ripple Animation */}
      {isSpeaking && (
        <span className="absolute -inset-0.5 rounded-full border-2 border-rose-400 animate-ping pointer-events-none opacity-60" />
      )}

      {/* Emotion Overlay */}
      {renderEmotionOverlay()}

      {/* Optional Miniature Golden Compass Badge */}
      {showCompassBadge && size >= 48 && (
        <div className="absolute bottom-0 right-0 p-1 rounded-full bg-[#08182B] border border-amber-400 text-amber-300 shadow-md flex items-center justify-center">
          <Compass className="w-3 h-3 text-amber-300 fill-amber-300/20" />
        </div>
      )}
    </div>
  );
};
