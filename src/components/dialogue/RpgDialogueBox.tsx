/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundFX } from '../../utils/audioEffects';
import { aksaraVoice } from '../../utils/aksaraVoice';
import { AksaraBustVisual } from '../character/AksaraBustVisual';
import { AksaraExpressionType } from '../character/AksaraCharacterVisual';
import { Volume2, VolumeX, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

export interface RpgDialogueChoice {
  id: string;
  label: string;
  onSelect: () => void;
  icon?: React.ReactNode;
  variant?: 'gold' | 'cyan' | 'emerald';
}

export interface RpgDialogueBoxProps {
  speakerName?: string;
  speakerTitle?: string;
  expression?: AksaraExpressionType;
  text: string;
  topicBadge?: string;
  onNext?: () => void;
  nextButtonLabel?: string;
  choices?: RpgDialogueChoice[];
  showVoiceButton?: boolean;
  className?: string;
  compact?: boolean;
  avatarSize?: number;
}

export const RpgDialogueBox: React.FC<RpgDialogueBoxProps> = ({
  speakerName = 'AKSARA',
  speakerTitle = 'Penjelajah Logika Nusantara • Lv. 3',
  expression = 'NORMAL',
  text,
  topicBadge,
  onNext,
  nextButtonLabel = 'Lanjut',
  choices,
  showVoiceButton = true,
  className = '',
  compact = false,
  avatarSize = 88,
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const handleVoiceState = (speaking: boolean) => {
      setIsSpeaking(speaking);
    };
    aksaraVoice.addListener(handleVoiceState);
    return () => {
      aksaraVoice.removeListener(handleVoiceState);
    };
  }, []);

  const handleToggleVoice = () => {
    if (isSpeaking) {
      aksaraVoice.stop();
    } else {
      soundFX.playChime('gold');
      aksaraVoice.speak(text);
    }
  };

  return (
    <div
      id="dialogue-drawer"
      className={`relative z-30 w-full max-w-5xl mx-auto transition-all duration-300 pointer-events-auto ${className}`}
    >
      {/* Sisi Kiri: Tempat Berdiri Avatar Aksara (#aksara-avatar) */}
      <div
        id="aksara-avatar"
        className={`relative shrink-0 flex flex-col items-center ${isSpeaking ? 'pose-speaking' : ''}`}
      >
        <div
          className={`rounded-2xl bg-gradient-to-b from-[#0E2C4F] to-[#061424] border-2 border-[#D4AF37] p-1 shadow-[0_0_20px_rgba(212,175,55,0.4)] overflow-hidden transition-all duration-300 ${
            isSpeaking ? 'scale-105 ring-2 ring-cyan-400' : ''
          }`}
        >
          <AksaraBustVisual
            expression={expression}
            size={compact ? 70 : avatarSize}
            showCompassBadge={true}
            className="select-none"
          />
        </div>
        {/* Expression Pill */}
        <span className="mt-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/70 text-amber-300 border border-amber-400/40">
          {expression}
        </span>
      </div>

      {/* Sisi Kanan: Kotak Narasi Teks Berbingkai Semi-Transparan (#dialogue-narrative-box) */}
      <div id="dialogue-narrative-box" className="dialogue-narrative-box">
        {/* Sertakan Nama Tag "Aksara" Berbingkai Emas di Atas Teks Dialog */}
        <div id="dialogue-name-tag" className="dialogue-name-tag">
          <span>{speakerName}</span>
          <span className="text-[10px] font-mono opacity-80 hidden sm:inline">✦ Pemandu</span>
        </div>

        {/* Top Controls Row */}
        <div className="flex items-center justify-between pl-24 pr-1 mb-2">
          <span className="hidden sm:inline-block text-[11px] font-mono text-cyan-300/90 font-medium truncate">
            {speakerTitle}
          </span>

          <div className="flex items-center gap-2 ml-auto">
            {topicBadge && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{topicBadge}</span>
              </span>
            )}

            {showVoiceButton && (
              <button
                onClick={handleToggleVoice}
                className={`btn-touch px-2.5 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md ${
                  isSpeaking
                    ? 'btn-game-ruby text-white animate-pulse'
                    : 'btn-game-cyan text-slate-950 hover:brightness-110'
                }`}
                title="Dengarkan Suara Narasi Aksara"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Hentikan</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">Suara Aksara</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Narrative Text */}
        <div className="relative p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 text-slate-100 text-xs sm:text-sm md:text-[15px] font-sans leading-relaxed shadow-inner">
          <p className="select-text">{text}</p>

          {/* Blinking VN Dialogue Prompt Chevron */}
          {onNext && (
            <span className="inline-block ml-2 text-amber-400 font-bold animate-bounce select-none">
              ▼
            </span>
          )}
        </div>

        {/* Optional Choices / Action Row */}
        {(choices && choices.length > 0) || onNext ? (
          <div className="mt-2.5 flex flex-wrap items-center justify-end gap-2">
            {choices?.map((c) => {
              const btnClass =
                c.variant === 'emerald'
                  ? 'btn-game-emerald'
                  : c.variant === 'cyan'
                  ? 'btn-game-cyan'
                  : 'btn-game-gold';
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    soundFX.playChime('click');
                    c.onSelect();
                  }}
                  className={`btn-touch px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 shadow-md ${btnClass}`}
                >
                  {c.icon}
                  <span>{c.label}</span>
                </button>
              );
            })}

            {onNext && (
              <button
                onClick={() => {
                  soundFX.playChime('gold');
                  onNext();
                }}
                className="btn-touch px-4 py-1.5 rounded-xl btn-game-gold text-slate-950 text-xs font-['Cinzel'] font-bold flex items-center gap-1.5 shadow-lg"
              >
                <span>{nextButtonLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
