/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import {
  ArrowLeft,
  ChevronRight,
  ShieldAlert,
  Cpu,
  FileSpreadsheet,
  CheckCircle2,
  Terminal,
  Radio,
  Zap,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { StoryboardProgressHUD } from '../ui/StoryboardProgressHUD';

interface Mission01BriefingStageProps {
  onNext: () => void;
  onBack: () => void;
}

export const Mission01BriefingStage: React.FC<Mission01BriefingStageProps> = ({
  onNext,
  onBack,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleVoiceTransmission = () => {
    setIsPlayingAudio(true);
    soundFX.playChime('gold');
    setTimeout(() => {
      soundFX.playChime('cyan');
      setIsPlayingAudio(false);
    }, 1200);
  };

  return (
    <div className="relative w-full h-full pt-16 pb-6 px-4 sm:px-8 flex flex-col justify-between overflow-y-auto">
      <div className="absolute inset-0 bg-[#08131F] opacity-95 z-0" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFX.playChime('click');
              onBack();
            }}
            className="p-2 rounded-xl bg-[#0D2B45]/80 hover:bg-[#0D2B45] text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tahap 3</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                TAHAP 4 // BRIEFING OPERASI
              </span>
              <span className="text-xs font-mono text-cyan-400">Krisis Reaktor Alpha-01</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Misi 01: Anomali Protokol Ramuan Bioplasma
            </h1>
          </div>
        </div>

        {/* Transmission Audio Sim */}
        <button
          onClick={toggleVoiceTransmission}
          className={`px-3 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-2 transition-all cursor-pointer ${
            isPlayingAudio
              ? 'bg-[#00F2FE]/20 border-[#00F2FE] text-[#00F2FE] animate-pulse'
              : 'bg-[#0D2B45]/80 border-white/10 text-slate-300 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>{isPlayingAudio ? 'Menerima Transmisi AI...' : 'Putar Audio Komandan'}</span>
        </button>
      </div>

      {/* 8-Step Storyboard Progress HUD (Image 2) */}
      <StoryboardProgressHUD currentStep={2} className="mb-3" />

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox stageKey="mission_01" className="mb-3" />

      {/* Main Dossier Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 my-2">
        {/* Left 2 Cols: Holographic Case Dossier */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0B2540]/95 via-[#0D3156]/95 to-[#081B30]/95 border-2 border-[#00F2FE]/50 shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#00F2FE]" />
                <span className="font-mono text-sm font-bold text-cyan-200 uppercase tracking-wide">
                  Berkas Insiden #BIOPLASMA-TK77
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-rose-500/25 text-rose-300 border border-rose-400/50 shadow-sm animate-pulse">
                STATUS: KRITIS (SINTAKSIS KORUP)
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-200">
                <strong className="text-white font-mono text-xs uppercase tracking-wider block mb-1">
                  📋 DOKUMEN KASUS:
                </strong>
                <span className="text-white font-semibold">
                  "Prosedur Pembuatan Bahan Bakar Bioplasma Ekstrak Temulawak Kuantum untuk Reaktor Tabung Beta."
                </span>
              </div>
              <p>
                Sebuah serangan virus anomali waktu menyerang server perpustakaan Borobudur. Seluruh instruksi kerja pembuatan bahan bakar ini berubah kacau dan membahayakan reaktor:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-400/40">
                  <div className="text-xs font-bold text-amber-300 font-mono mb-1">⚡ Urutan Terbalik:</div>
                  <div className="text-[11px] text-amber-100/90 leading-tight">
                    Reaktor dinyalakan sebelum cairan pendingin dimasukkan!
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-400/40">
                  <div className="text-xs font-bold text-rose-300 font-mono mb-1">⚠️ Bahasa Ambigu:</div>
                  <div className="text-[11px] text-rose-100/90 leading-tight">
                    Takaran 500 ml diubah jadi <em>"tuangkan sembarang secukupnya"</em>.
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-sky-500/15 border border-sky-400/40">
                  <div className="text-xs font-bold text-sky-300 font-mono mb-1">🔄 Kalimat Pasif:</div>
                  <div className="text-[11px] text-sky-100/90 leading-tight">
                    Verba imperatif lugas berubah berbelit tanpa instruksi tegas.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-[#00F2FE]/10 text-[#00F2FE] shrink-0">
              <Cpu className="w-5 h-5 animate-spin-slow" />
            </div>
            <div className="text-xs">
              <span className="text-[#00F2FE] font-mono font-bold block">INSTRUKSI ARUNA AI:</span>
              "Penyelaras Sintaksis, kami memerlukan Anda untuk mengurutkan kembali langkah-langkah kerja pada tahap berikutnya (Sequence Puzzle) sebelum reaktor meledak!"
            </div>
          </div>
        </div>

        {/* Right Col: Target Objectives Checklist */}
        <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-amber-400/30 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-['Cinzel'] font-bold text-white text-base mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              Target Operasi Pemulihan
            </h3>
            <div className="space-y-2.5">
              {[
                { title: 'Fase 1: Sequence Puzzle', desc: 'Susun 5 langkah yang acak sesuai logika kronologis', stage: 'Tahap 5' },
                { title: 'Fase 2: Procedure Glitch', desc: 'Identifikasi 4 titik kerancuan bahasa & takaran', stage: 'Tahap 6' },
                { title: 'Fase 3: Evidence Board', desc: 'Kaitkan temuan kesalahan dengan kaidah kebahasaan', stage: 'Tahap 7' },
                { title: 'Fase 4: Repair Workshop', desc: 'Sunting menjadi kalimat imperatif baku', stage: 'Tahap 8' },
                { title: 'Fase 5: Test Simulation', desc: 'Uji kestabilan mesin reaktor bioplasma', stage: 'Tahap 9' },
              ].map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-400/20 text-[#00F2FE] font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white truncate">{step.title}</span>
                      <span className="text-[10px] font-mono text-cyan-300">{step.stage}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Tingkat Kesiapan Protokol: 100% Siap Dijalankan</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10">
        <button
          onClick={() => {
            soundFX.playChime('click');
            onBack();
          }}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
        >
          Kembali ke Pustaka Informasi
        </button>
        <button
          onClick={() => {
            soundFX.playChime('cyan');
            onNext();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0284C7] text-[#08131F] font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Terima Misi: Buka Sequence Puzzle</span>
          <ChevronRight className="w-4 h-4 text-[#08131F]" />
        </button>
      </div>
    </div>
  );
};
