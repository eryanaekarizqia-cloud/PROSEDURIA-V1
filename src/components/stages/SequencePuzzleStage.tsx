/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import { gameStateManager } from '../../utils/gameStateManager';
import {
  ArrowLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { StoryboardProgressHUD } from '../ui/StoryboardProgressHUD';

interface SequencePuzzleStageProps {
  onNext: () => void;
  onBack: () => void;
}

interface StepItem {
  id: string;
  cardLabel: string;
  correctOrder: number;
  phaseName: string;
  conjunction: string;
  text: string;
  detail: string;
}

const INITIAL_STEPS: StepItem[] = [
  {
    id: 'STEP_GRIND',
    cardLabel: 'Kartu Alpha',
    correctOrder: 3,
    phaseName: 'Penghalusan Serbuk',
    conjunction: 'Kemudian',
    text: 'Haluskan rimpang kering menggunakan alat penggiling kuantum hingga menjadi serbuk 100 mesh.',
    detail: 'Menghaluskan rimpang kering sebelum dilarutkan.',
  },
  {
    id: 'STEP_WASH',
    cardLabel: 'Kartu Beta',
    correctOrder: 1,
    phaseName: 'Pembersihan & Pengirisan',
    conjunction: 'Pertama-tama',
    text: 'Bersihkan rimpang temulawak segar dari kotoran tanah lalu iris tipis dengan ketebalan 2 mm.',
    detail: 'Pembersihan dan pengirisan adalah langkah awal mutlak.',
  },
  {
    id: 'STEP_FILTER',
    cardLabel: 'Kartu Gamma',
    correctOrder: 5,
    phaseName: 'Penyaringan Akhir',
    conjunction: 'Akhirnya',
    text: 'Saring cairan ekstrak menggunakan filter membran mikro hingga diperoleh bioplasma murni.',
    detail: 'Penyaringan akhir sebelum hasil disimpan.',
  },
  {
    id: 'STEP_DRY',
    cardLabel: 'Kartu Delta',
    correctOrder: 2,
    phaseName: 'Pengeringan Foton',
    conjunction: 'Setelah itu',
    text: 'Keringkan irisan temulawak di dalam ruang pengering foton bersuhu 45°C selama 15 menit.',
    detail: 'Pengeringan harus dilakukan setelah rimpang diiris.',
  },
  {
    id: 'STEP_MIX',
    cardLabel: 'Kartu Epsilon',
    correctOrder: 4,
    phaseName: 'Pencampuran Pelarut',
    conjunction: 'Selanjutnya',
    text: 'Campurkan serbuk temulawak dengan 250 ml cairan pelarut murni di dalam tabung reaksi ultrasonik.',
    detail: 'Pencampuran dilakukan setelah serbuk halus tersedia.',
  },
];

export const SequencePuzzleStage: React.FC<SequencePuzzleStageProps> = ({
  onNext,
  onBack,
}) => {
  const [items, setItems] = useState<StepItem[]>(INITIAL_STEPS);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const [causalFeedback, setCausalFeedback] = useState<string | null>(null);

  const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
    soundFX.playChime('click');
    setIsVerified(false);
    setCausalFeedback(null);
    const targetIndex = direction === 'UP' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);
  };

  const handleVerify = () => {
    let allCorrect = true;
    for (let i = 0; i < items.length; i++) {
      if (items[i].correctOrder !== i + 1) {
        allCorrect = false;
        break;
      }
    }
    setIsVerified(true);
    setIsCorrect(allCorrect);

    if (allCorrect) {
      soundFX.playChime('victory');
      setCausalFeedback(null);
      gameStateManager.unlockBadge('penalar_urutan');
      gameStateManager.save({ sequencePuzzleSolved: true });
    } else {
      soundFX.playChime('error');
      // Diagnose precise causality breakdown to reward reasoning
      const washIdx = items.findIndex((it) => it.id === 'STEP_WASH');
      const dryIdx = items.findIndex((it) => it.id === 'STEP_DRY');
      const grindIdx = items.findIndex((it) => it.id === 'STEP_GRIND');
      const mixIdx = items.findIndex((it) => it.id === 'STEP_MIX');
      const filterIdx = items.findIndex((it) => it.id === 'STEP_FILTER');

      if (washIdx !== 0) {
        setCausalFeedback(
          'Kegagalan Tahap Awal: Rimpang temulawak belum dicuci dan diiris tipis! Langkah pembersihan bahan mentah mutlak wajib dilakukan paling awal dengan konjungsi "Pertama-tama".'
        );
      } else if (grindIdx < dryIdx) {
        setCausalFeedback(
          'Anomali Sebab-Akibat: Rimpang basah belum dikeringkan tetapi sudah digiling! Irisan basah akan menggumpal liat dan merusak penggiling kuantum.'
        );
      } else if (mixIdx < grindIdx) {
        setCausalFeedback(
          'Urutan Bahan Belum Matang: Rimpang belum digiling menjadi serbuk halus 100 mesh! Potongan kasar tidak bisa larut homogen dalam cairan pelarut.'
        );
      } else if (filterIdx < mixIdx) {
        setCausalFeedback(
          'Hasil Belum Terbentuk: Penyaringan membran dilakukan sebelum serbuk dan cairan pelarut dicampurkan! Belum ada bioplasma yang terbentuk untuk disaring.'
        );
      } else {
        setCausalFeedback(
          'Periksa Penanda Waktu: Konjungsi temporal belum runtut. Ikuti alur logis: "Pertama-tama" → "Setelah itu" → "Kemudian" → "Selanjutnya" → "Akhirnya".'
        );
      }
    }
  };

  const handleReset = () => {
    soundFX.playChime('click');
    setItems(INITIAL_STEPS);
    setIsVerified(false);
    setIsCorrect(false);
    setCausalFeedback(null);
  };

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
            <span>Tahap 4</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-400/20 text-[#38BDF8] border border-sky-400/30">
                MISI 5 // PENYUSUNAN URUTAN LOGIS
              </span>
              <span className="text-xs font-mono text-slate-400">Puzzle Urutan Kronologis</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Rekonstruksi Urutan Kronologis Prosedur
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHintVisible(!hintVisible)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Petunjuk Konjungsi</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Acak Ulang</span>
          </button>
        </div>
      </div>

      {/* 8-Step Storyboard Progress HUD (Image 2) */}
      <StoryboardProgressHUD currentStep={5} className="mb-3" />

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox
        stageKey="sequence_puzzle"
        mood={isVerified ? (isCorrect ? 'proud' : 'concerned') : 'curious'}
        className="mb-3"
      />

      {/* Sequence Glitch Interactive Flow Banner (Inspired by Image 2) */}
      <div className="relative z-10 mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#0C2F52] via-[#0E3D6B] to-[#0C2F52] border-2 border-amber-400/60 shadow-[0_6px_20px_rgba(0,0,0,0.5)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>TANTANGAN: SEQUENCE GLITCH (Urutan Langkah Tertukar)</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-200">
            Alur Logika: Pembersihan ➔ Pengeringan ➔ Penggilingan ➔ Pelarutan ➔ Penyaringan
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {items.map((it, idx) => (
            <div key={it.id} className="flex items-center gap-1.5 shrink-0">
              <span
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold border transition-all ${
                  isVerified && it.correctOrder === idx + 1
                    ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-[0_0_10px_#10B981]'
                    : isVerified
                    ? 'bg-rose-500/20 text-rose-300 border-rose-400'
                    : 'bg-white/10 text-cyan-200 border-cyan-400/40'
                }`}
              >
                Pos {idx + 1}: {it.phaseName}
              </span>
              {idx < items.length - 1 && <span className="text-amber-400 font-bold">➔</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Hint Alert if open */}
      {hintVisible && (
        <div className="relative z-10 mb-3 p-3 rounded-xl bg-[#0D2B45]/90 border border-cyan-400/40 text-xs text-cyan-200 font-sans flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-[#00F2FE] shrink-0 mt-0.5" />
          <div>
            <strong>Petunjuk Analisis Urutan:</strong> Perhatikan konjungsi penanda waktu di awal kalimat:
            <span className="text-white font-mono ml-1 font-bold">
              "Pertama-tama" → "Setelah itu" → "Kemudian" → "Selanjutnya" → "Akhirnya".
            </span> Rimpang tidak bisa diekstraksi sebelum dikeringkan dan dihaluskan!
          </div>
        </div>
      )}

      {/* Puzzle Card Stack */}
      <div className="relative z-10 flex-1 my-2 max-w-4xl mx-auto w-full space-y-3">
        {items.map((step, idx) => {
          const isSlotCorrect = isVerified && step.correctOrder === idx + 1;
          const isSlotWrong = isVerified && step.correctOrder !== idx + 1;

          return (
            <div
              key={step.id}
              className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 shadow-lg ${
                isSlotCorrect
                  ? 'bg-gradient-to-r from-emerald-950/80 to-[#0A261E] border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  : isSlotWrong
                  ? 'bg-gradient-to-r from-rose-950/70 to-[#2A0F1A] border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)]'
                  : 'bg-gradient-to-r from-[#0E2E4E]/90 via-[#10375E]/90 to-[#0E2E4E]/90 border-cyan-400/30 hover:border-cyan-400 shadow-md'
              }`}
            >
              {/* Order Number Badge */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl font-mono font-black text-base sm:text-lg flex items-center justify-center shrink-0 border-2 shadow-md ${
                    isSlotCorrect
                      ? 'bg-emerald-400 text-slate-950 border-white shadow-[0_0_12px_#34D399]'
                      : isSlotWrong
                      ? 'bg-rose-500 text-white border-rose-300'
                      : 'bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 border-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                  }`}
                >
                  {idx + 1}
                </div>

                {/* Text Content */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border border-cyan-400/50 font-bold shadow-sm">
                      {step.conjunction}
                    </span>
                    {isSlotCorrect && (
                      <span className="text-xs font-mono text-emerald-300 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Posisi Tepat
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-white font-medium font-sans leading-relaxed">
                    {step.text}
                  </p>
                </div>
              </div>

              {/* Move Up/Down Controls with Bright Buttons */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, 'UP')}
                  className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 disabled:opacity-20 disabled:cursor-not-allowed text-cyan-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Pindahkan ke atas"
                >
                  <ArrowUp className="w-4 h-4 font-bold" />
                </button>
                <button
                  disabled={idx === items.length - 1}
                  onClick={() => moveItem(idx, 'DOWN')}
                  className="p-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 disabled:opacity-20 disabled:cursor-not-allowed text-cyan-200 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Pindahkan ke bawah"
                >
                  <ArrowDown className="w-4 h-4 font-bold" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verification Feedback Bar */}
      <div className="relative z-10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
        <div className="text-xs font-mono max-w-xl">
          {isVerified ? (
            isCorrect ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Urutan Sempurna! Seluruh langkah telah tersusun secara logis & kronologis sesuai kaidah sebab-akibat. Lencana Penalar Urutan terbuka!
              </span>
            ) : (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  Konsekuensi Kesalahan Urutan Terdeteksi:
                </div>
                <div className="text-[11px] leading-relaxed text-rose-100">
                  {causalFeedback || 'Masih ada langkah yang tertukar. Periksa urutan konjungsi & kausalitas tindakan!'}
                </div>
              </div>
            )
          ) : (
            <span className="text-slate-400">
              Pindahkan posisi langkah hingga runtut secara kronologis, lalu klik "Verifikasi Urutan".
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!isCorrect ? (
            <button
              onClick={handleVerify}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] text-[#08131F] font-bold text-xs font-mono transition-colors shadow-[0_0_15px_rgba(0,242,254,0.3)] cursor-pointer"
            >
              Verifikasi Urutan Prosedur
            </button>
          ) : (
            <button
              onClick={() => {
                soundFX.playChime('cyan');
                onNext();
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Lanjut ke Deteksi Kerancuan (Tahap 6)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
