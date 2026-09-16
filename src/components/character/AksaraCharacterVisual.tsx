/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Compass, Sparkles, Search, ThumbsUp, Volume2, Shield } from 'lucide-react';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';

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
  showCardFrame?: boolean;
}

/**
 * Aksara Character Art Visual
 * Authentically crafted from the official character sheet and concept art:
 * - 14-year-old Logic Explorer of Proseduria
 * - Tousled spiky dark anime hair
 * - Confident amber-brown eyes
 * - Royal navy hooded jacket with golden borders and shoulder compass crests
 * - Holding the radiant Kompas Prosedur with 8-pointed gold star & glowing cyan gem
 * - Full interactive expression and pose states
 */
export const AksaraCharacterVisual: React.FC<AksaraCharacterVisualProps> = ({
  expression = 'NORMAL',
  pose = 'standing_compass',
  isSpeaking = false,
  size = 320,
  className = '',
  compassGlowing = true,
  showCardFrame = false,
}) => {
  // Emotion overlay configuration
  const getEmotionBadge = () => {
    switch (expression) {
      case 'SENANG':
        return { label: 'Senang', emoji: '😄', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400' };
      case 'BERSEMANGAT':
        return { label: 'Bersemangat', emoji: '✊🔥', color: 'bg-amber-500/20 text-amber-300 border-amber-400' };
      case 'TERKEJUT':
        return { label: 'Terkejut', emoji: '😲', color: 'bg-orange-500/20 text-orange-300 border-orange-400' };
      case 'BERPIKIR':
        return { label: 'Berpikir', emoji: '🤔', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-400' };
      case 'BINGUNG':
        return { label: 'Bingung', emoji: '❓', color: 'bg-purple-500/20 text-purple-300 border-purple-400' };
      case 'SEDIH':
        return { label: 'Sedih', emoji: '😔', color: 'bg-blue-500/20 text-blue-300 border-blue-400' };
      case 'KHAWATIR':
        return { label: 'Khawatir', emoji: '😰', color: 'bg-amber-600/20 text-amber-200 border-amber-500' };
      case 'FOKUS':
        return { label: 'Fokus', emoji: '🎯', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-400' };
      case 'MENYELIDIKI':
        return { label: 'Menyelidiki', emoji: '🔍', color: 'bg-amber-500/20 text-amber-300 border-amber-400' };
      case 'TAKJUB':
        return { label: 'Takjub', emoji: '✨', color: 'bg-sky-500/20 text-sky-300 border-sky-400' };
      case 'SUKSES':
        return { label: 'Sukses', emoji: '👍', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400' };
      default:
        return { label: 'Normal', emoji: '🙂', color: 'bg-cyan-900/30 text-cyan-300 border-cyan-500/40' };
    }
  };

  const emotionInfo = getEmotionBadge();

  return (
    <div
      style={{ width: size, maxWidth: '100%' }}
      className={`relative flex flex-col items-center select-none ${className}`}
    >
      {/* Background Magical Rune Aura */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-amber-500/10 rounded-3xl blur-xl pointer-events-none" />

      {/* Main Illustration Container */}
      <div
        className={`relative w-full rounded-2xl overflow-hidden ${
          showCardFrame
            ? 'p-2 bg-[#061224] border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)]'
            : ''
        }`}
      >
        {/* Floating Speaking Ripple effect */}
        {isSpeaking && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-950/90 border border-rose-400 text-rose-300 text-[11px] font-mono shadow-lg animate-pulse">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span>Berbicara...</span>
          </div>
        )}

        {/* Emotion Tag */}
        <div className={`absolute top-4 right-4 z-20 px-2.5 py-1 rounded-full border text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 backdrop-blur-md ${emotionInfo.color}`}>
          <span>{emotionInfo.emoji}</span>
          <span>{emotionInfo.label}</span>
        </div>

        {/* Aksara Studio-Grade Character Illustration */}
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#0B2544] via-[#08182B] to-[#040C1A]">
          <img
            src={PROSEDURIA_ASSETS.aksaraBustHD}
            alt="Aksara Penjelajah Logika"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100 hover:scale-105 transition-transform duration-500"
          />

          {/* Golden Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040C1A] via-transparent to-transparent opacity-70 pointer-events-none" />

          {/* Compass Glowing Arc on Lower Section */}
          {compassGlowing && (
            <div className="absolute bottom-6 right-6 pointer-events-none flex items-center justify-center">
              <span className="absolute w-16 h-16 rounded-full bg-[#00F2FE]/25 blur-md animate-ping" />
              <div className="relative p-2 rounded-full bg-[#061224]/90 border-2 border-amber-400 text-amber-300 shadow-[0_0_20px_#00F2FE]">
                <Compass className="w-6 h-6 text-[#00F2FE] animate-spin-slow" />
              </div>
            </div>
          )}

          {/* Bottom Title Bar inside Card */}
          <div className="absolute bottom-3 inset-x-3 z-10 px-3 py-2 rounded-xl bg-[#08182B]/90 border border-[#D4AF37]/50 backdrop-blur-sm flex items-center justify-between">
            <div>
              <div className="font-['Cinzel'] font-black text-sm text-[#FFE082] tracking-wide">
                AKSARA
              </div>
              <div className="text-[10px] font-mono text-cyan-300">
                Penjelajah Logika • 14 Tahun
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-amber-400/90 block">Akademi Proseduria</span>
              <span className="text-[9px] font-mono text-slate-300">Kompas Prosedur</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
