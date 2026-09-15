/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { aksaraVoice, STAGE_GUIDANCE_LINES } from '../../utils/aksaraVoice';
import { soundFX } from '../../utils/audioEffects';

interface MissionGuideBoxProps {
  stageKey: string;
  customTitle?: string;
  customSteps?: string[];
  customSpokenText?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export const MissionGuideBox: React.FC<MissionGuideBoxProps> = ({
  stageKey,
  customTitle,
  customSteps,
  customSpokenText,
  defaultExpanded = true,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const guide = STAGE_GUIDANCE_LINES[stageKey];
  const title = customTitle || guide?.title || 'Panduan & Cara Mengerjakan';
  const steps = customSteps || guide?.steps || [
    '1. Amati petunjuk dan data yang tersaji.',
    '2. Ikuti instruksi pengerjaan dengan runtun dan teliti.',
    '3. Validasi hasil pekerjaan untuk menyelesaikan tantangan.',
  ];
  const spokenText = customSpokenText || guide?.spokenText || 'Ayo ikuti petunjuk pengerjaan ini agar kamu bisa menyelesaikan misi dengan nilai sempurna!';

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
      aksaraVoice.speak(spokenText);
    }
  };

  return (
    <div
      className={`relative z-20 rounded-2xl bg-gradient-to-r from-[#0D2B45]/95 via-[#0B2236]/95 to-[#08182B]/95 border border-[#D4AF37]/50 shadow-[0_4px_25px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Top Banner Header */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Aksara Character Portrait Avatar */}
          <div className="relative flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-[1.5px] shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            <div className="w-full h-full rounded-full bg-[#07131F] flex items-center justify-center overflow-hidden">
              <span className="text-sm select-none" role="img" aria-label="Aksara">
                🧑‍🎓
              </span>
            </div>
            {isSpeaking && (
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900 animate-ping" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-[#FFE082] border border-amber-400/30">
                PANDUAN AKSARA (SISWA KELAS IX)
              </span>
              <span className="text-[10px] text-cyan-300 font-mono hidden sm:inline">
                • Suara Anak Laki-Laki
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate font-sans tracking-wide">
              {title}
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Audio Voice Guide Button */}
          <button
            onClick={handleToggleVoice}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
              isSpeaking
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 animate-pulse'
                : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-[#FFE082] border border-amber-400/40 hover:bg-amber-500/30 hover:text-white'
            }`}
            title="Dengarkan Aksara berbicara memberi petunjuk"
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Hentikan</span>
                {/* Audio Waves */}
                <div className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                </div>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Dengar Panduan</span>
                <span className="sm:hidden">Dengar</span>
              </>
            )}
          </button>

          {/* Expand / Collapse Button */}
          <button
            onClick={() => {
              soundFX.playChime('click');
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={isExpanded ? 'Sembunyikan Cara Mengerjakan' : 'Buka Cara Mengerjakan'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Step-by-Step Instructions */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-2.5 bg-[#071726]/60 text-xs font-sans">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Langkah-Langkah Cara Mengerjakan:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-xl bg-[#0D263B]/70 border border-cyan-500/20 text-slate-200"
              >
                <div className="w-5 h-5 rounded-md bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-[11px] font-mono font-bold text-cyan-300 flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="leading-relaxed text-[11px] sm:text-xs">
                  {step.replace(/^\d+\.\s*/, '')}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tip Pill */}
          <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
            <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="italic">
              Tip Aksara: Tekan tombol <strong className="text-[#FFE082]">"Dengar Panduan"</strong> jika ingin mendengarkan suara arahan secara langsung!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
