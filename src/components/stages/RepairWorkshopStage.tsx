/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import {
  ArrowLeft,
  ChevronRight,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';

interface RepairWorkshopStageProps {
  onNext: () => void;
  onBack: () => void;
}

interface RepairTask {
  id: number;
  label: string;
  originalText: string;
  choices: { text: string; isCorrect: boolean; feedback: string }[];
}

const REPAIR_TASKS: RepairTask[] = [
  {
    id: 1,
    label: 'Modul 1: Restorasi Takaran & Adverbia Kuantitatif',
    originalText: 'Tuangkan cairan pelarut secukupnya sesuka hati tanpa perlu ditakar dengan gelas ukur.',
    choices: [
      {
        text: 'Tuangkan 250 ml cairan pelarut etanol murni secara perlahan ke dalam tabung reaksi ultrasonik.',
        isCorrect: true,
        feedback: 'Sangat Tepat! Memakai takaran pasti (250 ml) dan keterangan cara (secara perlahan).',
      },
      {
        text: 'Tuangkan cairan pelarut sebanyak-banyaknya hingga tabung terasa penuh.',
        isCorrect: false,
        feedback: 'Masih ambigu. "Sebanyak-banyaknya" bukan ukuran kuantitatif standar operasional.',
      },
      {
        text: 'Cairan pelarut sebaiknya dituangkan secukupnya oleh teknisi.',
        isCorrect: false,
        feedback: 'Bukan kalimat imperatif dan masih memuat takaran tidak jelas "secukupnya".',
      },
    ],
  },
  {
    id: 2,
    label: 'Modul 2: Restorasi Verba Imperatif Lugas',
    originalText: 'Anda barangkali bisa mempertimbangkan untuk memutar tuas jika tidak terlalu sibuk.',
    choices: [
      {
        text: 'Tuas katup sebaiknya mulai diputar saat waktu senggang.',
        isCorrect: false,
        feedback: 'Kalimat pasif ragu-ragu, bukan instruksi prosedur kerja yang tegas.',
      },
      {
        text: 'Putarlah tuas katup daya searah jarum jam sebesar 90 derajat hingga terkunci rapat.',
        isCorrect: true,
        feedback: 'Sempurna! Verba imperatif "Putarlah" diperkuat keterangan derajat dan kondisi "hingga terkunci rapat".',
      },
      {
        text: 'Anda boleh memikirkan untuk memutar tuas katup daya sekarang.',
        isCorrect: false,
        feedback: 'Tidak baku dan tidak memenuhi fungsi instruksional teks prosedur.',
      },
    ],
  },
  {
    id: 3,
    label: 'Modul 3: Restorasi Konjungsi Temporal Kronologis',
    originalText: 'Setelah selesai proses pembakaran, pertama-tama pasanglah katup segel pengaman reaktor.',
    choices: [
      {
        text: 'Pertama-tama, pasanglah katup segel pengaman reaktor sebelum menyalakan proses pembakaran foton.',
        isCorrect: true,
        feedback: 'Luar biasa! Alur sebab-akibat dan urutan keselamatan kronologis kini terlindungi.',
      },
      {
        text: 'Setelah pembakaran selesai, kemudian pasanglah katup segel jika dirasa perlu.',
        isCorrect: false,
        feedback: 'Fatal! Menutup pengaman setelah pembakaran berisiko ledakan radiasi.',
      },
      {
        text: 'Akhirnya pasanglah katup segel lalu mulailah pertama-tama proses pembakaran.',
        isCorrect: false,
        feedback: 'Konjungsi temporal "Akhirnya" tidak boleh ditaruh sebelum tindakan awal.',
      },
    ],
  },
  {
    id: 4,
    label: 'Modul 4: Restorasi Parameter Suhu & Durasi',
    originalText: 'Panaskan tabung reaksi sampai dirasa sudah agak hangat dan nyaman saat disentuh.',
    choices: [
      {
        text: 'Panaskan tabung sampai terasa cukup panas menurut perkiraan Anda.',
        isCorrect: false,
        feedback: 'Perkiraan subjektif dilarang dalam teks prosedur teknis.',
      },
      {
        text: 'Panaskan tabung reaksi pada suhu 60°C konstan selama 10 menit.',
        isCorrect: true,
        feedback: 'Tepat sekali! Menggunakan parameter derajat suhu dan satuan durasi menit yang presisi.',
      },
      {
        text: 'Tabung reaksi dipanaskan sampai warnanya sedikit berubah.',
        isCorrect: false,
        feedback: 'Perubahan warna samar bukan acuan ukuran terukur.',
      },
    ],
  },
];

export const RepairWorkshopStage: React.FC<RepairWorkshopStageProps> = ({
  onNext,
  onBack,
}) => {
  const [currentTaskIdx, setCurrentTaskIdx] = useState<number>(0);
  const [solvedTasks, setSolvedTasks] = useState<{ [taskId: number]: string }>({});
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null);

  const task = REPAIR_TASKS[currentTaskIdx];
  const isCurrentSolved = !!solvedTasks[task.id];

  const handleSelectChoice = (choice: { text: string; isCorrect: boolean; feedback: string }) => {
    setActiveFeedback(choice.feedback);
    if (choice.isCorrect) {
      soundFX.playChime('repair');
      setSolvedTasks((prev) => ({ ...prev, [task.id]: choice.text }));
    } else {
      soundFX.playChime('error');
    }
  };

  const progressPercent = Math.round((Object.keys(solvedTasks).length / REPAIR_TASKS.length) * 100);
  const isAllRepaired = Object.keys(solvedTasks).length === REPAIR_TASKS.length;

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
            <span>Tahap 7</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                TAHAP 8 // C5 EVALUASI & REKONSTRUKSI
              </span>
              <span className="text-xs font-mono text-cyan-400">Bengkel Sintaksis</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Bengkel Rekonstruksi Teks Prosedur
            </h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0D2B45]/80 border border-emerald-500/30">
          <Wrench className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono text-slate-300">Integritas Prosedur:</span>
            <span className="text-xs font-mono font-bold text-emerald-400">{progressPercent}% TERREKONSTRUKSI</span>
          </div>
        </div>
      </div>

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox stageKey="repair_workshop" className="mb-3" />

      {/* Task Selector Tabs */}
      <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-2 mb-2">
        {REPAIR_TASKS.map((t, idx) => {
          const isDone = !!solvedTasks[t.id];
          const isSelected = currentTaskIdx === idx;
          return (
            <button
              key={t.id}
              onClick={() => {
                soundFX.playChime('click');
                setCurrentTaskIdx(idx);
                setActiveFeedback(null);
              }}
              className={`px-3 py-2 rounded-xl border text-xs font-mono transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isSelected
                  ? 'bg-[#00F2FE]/20 border-[#00F2FE] text-[#00F2FE] font-bold shadow'
                  : isDone
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              {isDone ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Cpu className="w-3.5 h-3.5" />}
              <span>Modul {idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Main Workshop Screen */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 my-2">
        {/* Left Column: Original Broken vs Repaired Diff */}
        <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-['Cinzel'] font-bold text-white text-base mb-1">
              {task.label}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Pilih kalimat perbaikan yang memenuhi seluruh kaidah kebahasaan imperatif dan presisi.
            </p>

            <div className="space-y-3">
              {/* Broken Sentence */}
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-1">
                  SEBELUM REKONSTRUKSI (KORUP):
                </span>
                <p className="text-xs font-mono text-rose-100 line-through">
                  "{task.originalText}"
                </p>
              </div>

              {/* Repaired Sentence Preview */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block mb-1">
                  SESUDAH REKONSTRUKSI (STANDAR BAKU):
                </span>
                {isCurrentSolved ? (
                  <p className="text-xs font-mono text-emerald-200 font-bold flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>"{solvedTasks[task.id]}"</span>
                  </p>
                ) : (
                  <p className="text-xs font-mono text-slate-500 italic">
                    [Menunggu pilihan penyuntingan tepat dari panel kanan...]
                  </p>
                )}
              </div>
            </div>
          </div>

          {activeFeedback && (
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-cyan-200">
              <strong>Evaluasi Linguistik:</strong> {activeFeedback}
            </div>
          )}
        </div>

        {/* Right Column: Choices for Repair */}
        <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-emerald-500/30 backdrop-blur-md flex flex-col justify-between space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-emerald-300 font-bold">
            Pilihan Opsi Rekonstruksi Sintaksis:
          </h3>

          <div className="space-y-2.5 flex-1">
            {task.choices.map((choice, cIdx) => {
              const isSelectedOption = solvedTasks[task.id] === choice.text;

              return (
                <button
                  key={cIdx}
                  onClick={() => handleSelectChoice(choice)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelectedOption
                      ? 'bg-emerald-950/60 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-black/30 border-white/10 hover:border-emerald-400/50 hover:bg-white/5'
                  }`}
                >
                  <span className="w-6 h-6 rounded-lg bg-white/10 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + cIdx)}
                  </span>
                  <div className="flex-1">
                    <p className="text-xs text-slate-200 font-sans leading-relaxed">
                      {choice.text}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              disabled={currentTaskIdx === 0}
              onClick={() => {
                soundFX.playChime('click');
                setCurrentTaskIdx((prev) => prev - 1);
                setActiveFeedback(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono text-slate-300"
            >
              Modul Sebelumnya
            </button>
            <button
              disabled={currentTaskIdx === REPAIR_TASKS.length - 1}
              onClick={() => {
                soundFX.playChime('click');
                setCurrentTaskIdx((prev) => prev + 1);
                setActiveFeedback(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono text-slate-300"
            >
              Modul Berikutnya
            </button>
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
          Kembali ke Papan Bukti
        </button>
        <button
          disabled={!isAllRepaired}
          onClick={() => {
            soundFX.playChime('cyan');
            onNext();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Lanjut ke Uji Simulasi Mesin (Tahap 9)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
