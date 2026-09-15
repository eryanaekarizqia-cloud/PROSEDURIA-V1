/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import {
  ArrowLeft,
  ChevronRight,
  AlertTriangle,
  Search,
  CheckCircle2,
  Bug,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { StoryboardProgressHUD } from '../ui/StoryboardProgressHUD';

interface ProcedureGlitchStageProps {
  onNext: () => void;
  onBack: () => void;
}

interface GlitchNode {
  id: number;
  label: string;
  errorType: string;
  brokenSnippet: string;
  diagnosis: string;
  ruleViolated: string;
}

const GLITCHES: GlitchNode[] = [
  {
    id: 1,
    label: 'Glitch 1: Takaran Ambigu & Tidak Terukur',
    errorType: 'Pelanggaran Adverbia Kuantitatif',
    brokenSnippet: 'Tuangkan cairan pelarut secukupnya sesuka hati tanpa perlu ditakar dengan gelas ukur.',
    diagnosis: 'Penggunaan kata "secukupnya sesuka hati" sangat ambigu dan membahayakan keselamatan reaktor kuantum.',
    ruleViolated: 'Kaidah: Teks prosedur wajib mencantumkan takaran dan ukuran kuantitatif terukur (contoh: 250 ml).',
  },
  {
    id: 2,
    label: 'Glitch 2: Kalimat Pasif Lemah & Bukan Imperatif',
    errorType: 'Peniadaan Kalimat Perintah Baku',
    brokenSnippet: 'Anda barangkali bisa mempertimbangkan untuk memutar tuas jika tidak terlalu sibuk.',
    diagnosis: 'Kalimat ini bersifat permisif ragu-ragu dan tidak memiliki verba imperatif instruksional.',
    ruleViolated: 'Kaidah: Gunakan kalimat imperatif tegas dengan imbuhan -kan/-lah (contoh: "Putarlah tuas katup daya 90 derajat").',
  },
  {
    id: 3,
    label: 'Glitch 3: Konjungsi Temporal Terbalik & Tidak Logis',
    errorType: 'Anomali Urutan Kronologis',
    brokenSnippet: 'Setelah selesai proses pembakaran, pertama-tama pasanglah katup segel pengaman reaktor.',
    diagnosis: 'Konjungsi "setelah selesai" diletakkan mendahului "pertama-tama". Memasang pengaman setelah pembakaran fatal!',
    ruleViolated: 'Kaidah: Konjungsi temporal wajib mengikuti alur sebab-akibat kronologis.',
  },
  {
    id: 4,
    label: 'Glitch 4: Kondisi Kualitatif Samar & Subjektif',
    errorType: 'Ketiadaan Adverbia Suhu / Waktu',
    brokenSnippet: 'Panaskan tabung reaksi sampai dirasa sudah agak hangat dan nyaman saat disentuh.',
    diagnosis: '"Agak hangat dan nyaman" bersifat subjektif setiap orang dan tidak ilmiah untuk standar operasional.',
    ruleViolated: 'Kaidah: Nyatakan parameter fisik terukur seperti derajat Celcius atau durasi menit yang pasti (contoh: "pada suhu 60°C selama 10 menit").',
  },
];

export const ProcedureGlitchStage: React.FC<ProcedureGlitchStageProps> = ({
  onNext,
  onBack,
}) => {
  const [foundGlitches, setFoundGlitches] = useState<number[]>([]);
  const [selectedGlitch, setSelectedGlitch] = useState<GlitchNode | null>(null);

  const handleInspectSnippet = (glitch: GlitchNode) => {
    if (!foundGlitches.includes(glitch.id)) {
      soundFX.playChime('glitch');
      const next = [...foundGlitches, glitch.id];
      setFoundGlitches(next);
      if (next.length === GLITCHES.length) {
        setTimeout(() => soundFX.playChime('victory'), 300);
      }
    } else {
      soundFX.playChime('click');
    }
    setSelectedGlitch(glitch);
  };

  const isAllFound = foundGlitches.length === GLITCHES.length;

  return (
    <div className="relative w-full h-full pt-16 pb-6 px-4 sm:px-8 flex flex-col justify-between overflow-y-auto">
      <div className="absolute inset-0 bg-[#08131F] opacity-95 z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFX.playChime('click');
              onBack();
            }}
            className="p-2 rounded-xl bg-[#0D2B45]/80 hover:bg-[#0D2B45] text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Tahap 5</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                TAHAP 6 // C4 ANALYZING
              </span>
              <span className="text-xs font-mono text-cyan-400">Pendeteksian Anomali Prosedur</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Deteksi Anomali & Glitch Bahasa
            </h1>
          </div>
        </div>

        {/* Glitch Progress Meter */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0D2B45]/80 border border-rose-500/30">
          <Bug className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-mono text-slate-300">Glitch Terdeteksi:</span>
          <span className="text-xs font-mono font-bold text-rose-300">
            {foundGlitches.length} / {GLITCHES.length}
          </span>
          {isAllFound && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-400/30">
              100% TERANALISIS
            </span>
          )}
        </div>
      </div>

      {/* 8-Step Storyboard Progress HUD (Image 2) */}
      <StoryboardProgressHUD currentStep={4} className="mb-3" />

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox stageKey="procedure_glitch" className="mb-3" />

      {/* Glitch Classification Banner (Direct from Image 2: Step 4 Diagnosis) */}
      <div className="relative z-10 mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#200A18] via-[#350F26] to-[#200A18] border-2 border-rose-500/60 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
            <Bug className="w-4 h-4 text-rose-400" />
            <span>LANGKAH 4 // DIAGNOSIS KATEGORI GLITCH</span>
          </span>
          <span className="text-[11px] font-mono text-slate-300">
            Tentukan anomali pada setiap baris teks prosedur
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 font-bold">
            ✓ INFORMASI
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-400/50 font-bold">
            ✓ URUTAN
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-bold">
            ✓ BAHASA
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/50 font-bold">
            ✓ TUJUAN
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-400/50 font-bold">
            ✓ HASIL
          </span>
        </div>
      </div>

      {/* Main Analysis Screen */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 my-2">
        {/* Left Column: Corrupted Procedural Text Document */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D2B45]/60 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-xs font-mono text-[#00F2FE] font-bold">
                DOKUMEN OPERASIONAL REAKTOR // TEKS CACAT
              </span>
              <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                <Search className="w-3.5 h-3.5" /> Klik baris untuk memindai
              </span>
            </div>

            <div className="space-y-3 font-sans">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                <strong className="text-white block font-mono mb-1">PROSEDUR:</strong>
                "Pengisian Daya dan Stabilisasi Reaktor Bioplasma Antariksa"
              </div>

              {GLITCHES.map((glitch, idx) => {
                const isFound = foundGlitches.includes(glitch.id);
                const isSelected = selectedGlitch?.id === glitch.id;

                return (
                  <button
                    key={glitch.id}
                    onClick={() => handleInspectSnippet(glitch)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-rose-950/50 border-rose-400 shadow-[0_0_15px_rgba(255,0,85,0.4)]'
                        : isFound
                        ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                        : 'bg-black/30 border-white/10 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        Langkah #{idx + 1}
                      </span>
                      {isFound ? (
                        <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> GLITCH TERDETEKSI
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-300">
                          [Klik untuk Analisis]
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isFound ? 'text-rose-200 font-mono' : 'text-slate-300'
                      }`}
                    >
                      {glitch.brokenSnippet}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400 font-mono">
            Pindai seluruh 4 anomali kebahasaan untuk membuka papan analisis forensik linguistik (Tahap 7).
          </div>
        </div>

        {/* Right Column: Diagnostic Scanner HUD */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D2B45]/60 border border-rose-500/30 backdrop-blur-md flex flex-col justify-between space-y-4">
          {selectedGlitch ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <div>
                  <h3 className="font-['Cinzel'] font-bold text-white text-base">
                    {selectedGlitch.label}
                  </h3>
                  <span className="text-[11px] font-mono text-rose-300">
                    {selectedGlitch.errorType}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                  <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">
                    Kalimat Korup:
                  </span>
                  <p className="text-xs text-rose-100 font-mono italic">
                    "{selectedGlitch.brokenSnippet}"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block">
                    Hasil Diagnosis ARUNA AI:
                  </span>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {selectedGlitch.diagnosis}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                    Kaidah Kebahasaan yang Dilanggar:
                  </span>
                  <p className="text-xs text-emerald-200 font-sans leading-relaxed">
                    {selectedGlitch.ruleViolated}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Search className="w-10 h-10 text-cyan-400/40 mb-3 animate-pulse" />
              <h3 className="font-['Cinzel'] font-bold text-white text-base mb-1">
                Scanner Diagnostik Siap
              </h3>
              <p className="text-xs max-w-sm">
                Klik salah satu langkah di sisi kiri untuk menganalisis cacat linguistik pada teks prosedur.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Status Forensik:</span>
            <span className={isAllFound ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
              {isAllFound ? 'LENGKAP: Siap ke Papan Bukti' : 'Mencari glitch yang tersisa...'}
            </span>
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
          Kembali ke Sequence Puzzle
        </button>
        <button
          disabled={!isAllFound}
          onClick={() => {
            soundFX.playChime('cyan');
            onNext();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Lanjut ke Papan Bukti (Tahap 7)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
