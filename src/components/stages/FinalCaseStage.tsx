/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundFX } from '../../utils/audioEffects';
import {
  ArrowLeft,
  Zap,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Timer,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';

interface FinalCaseStageProps {
  onBackToMap: () => void;
  onComplete?: () => void;
}

interface IncidentItem {
  id: number;
  system: string;
  problem: string;
  options: { text: string; correct: boolean; feedback: string }[];
}

const INCIDENTS: IncidentItem[] = [
  {
    id: 1,
    system: 'Protokol 1: Pendinginan Darurat Inti Plasma',
    problem: 'Anomali: "Tuangkanlah cairan nitrogen sesuka hati jika alarm bunyi."',
    options: [
      { text: 'Injeksi 500 liter nitrogen cair murni ke pipa pendingin A-1 secara seketika.', correct: true, feedback: 'Pendinginan berhasil! Tekanan inti turun ke batas normal.' },
      { text: 'Biarkan cairan nitrogen mengalir sedikit demi sedikit.', correct: false, feedback: 'Terlalu lambat! Suhu terus meningkat.' },
      { text: 'Anda disarankan memeriksa cairan nitrogen bila sempat.', correct: false, feedback: 'Bukan kalimat imperatif darurat!' },
    ],
  },
  {
    id: 2,
    system: 'Protokol 2: Pelepasan Kapsul Penyelamat Kru',
    problem: 'Anomali: "Setelah kapsul meluncur ke orbit, pertama-tama pasanglah sabuk kru."',
    options: [
      { text: 'Kapsul segera diluncurkan baru kru memasang sabuk pengaman.', correct: false, feedback: 'Urutan terbalik fatal membahayakan kru!' },
      { text: 'Pertama-tama, pasanglah sabuk pengaman kru sebelum menekan tombol peluncuran kapsul.', correct: true, feedback: 'Urutan kronologis aman! Kru siap dievakuasi.' },
      { text: 'Akhirnya pasanglah sabuk sebelum kapsul disiapkan.', correct: false, feedback: 'Penggunaan konjungsi temporal tidak logis.' },
    ],
  },
  {
    id: 3,
    system: 'Protokol 3: Transmisi Kode SOS Aksara Antariksa',
    problem: 'Anomali: "Kirimlah pesan bantuan kapan saja bila tidak sibuk."',
    options: [
      { text: 'Pesan bantuan mungkin sebaiknya dikirim ke stasiun bumi.', correct: false, feedback: 'Bukan kalimat instruksional standar operasional darurat.' },
      { text: 'Pancarkan sinyal darurat frekuensi 142.5 MHz secara berulang selama 60 detik.', correct: true, feedback: 'Frekuensi terhubung! Armada penyelamat menerima koordinat stasiun.' },
      { text: 'Kirimkan sinyal secukupnya sesering mungkin.', correct: false, feedback: 'Masih mengandung kata keterangan takaran ambigu.' },
    ],
  },
];

export const FinalCaseStage: React.FC<FinalCaseStageProps> = ({
  onBackToMap,
  onComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [solvedIds, setSolvedIds] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(120);

  // Timer countdown
  useEffect(() => {
    if (solvedIds.length === INCIDENTS.length) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [solvedIds]);

  const incident = INCIDENTS[currentIdx];
  const isAllSolved = solvedIds.length === INCIDENTS.length;

  const handleSelectOption = (opt: { text: string; correct: boolean; feedback: string }) => {
    setFeedback(opt.feedback);
    if (opt.correct) {
      soundFX.playChime('victory');
      if (!solvedIds.includes(incident.id)) {
        setSolvedIds([...solvedIds, incident.id]);
      }
    } else {
      soundFX.playChime('error');
    }
  };

  const handleReset = () => {
    soundFX.playChime('click');
    setSolvedIds([]);
    setCurrentIdx(0);
    setTimeLeft(120);
    setFeedback(null);
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
              onBackToMap();
            }}
            className="p-2 rounded-xl bg-[#0D2B45]/80 hover:bg-[#0D2B45] text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Peta Benua</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                KASUS PAMUNGKAS // TINGKAT KEDARURATAN TINGGI
              </span>
              <span className="text-xs font-mono text-amber-400">Papua Core Station</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Insiden Reaktor Sentral Antariksa
            </h1>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs font-mono text-rose-300">
          <Timer className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Waktu Tersisa:</span>
          <span className="font-bold text-white">
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox stageKey="final_case" className="mb-3 max-w-4xl mx-auto w-full" />

      {/* Main Boss Incident Arena */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 my-2 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Incident Selector Tabs */}
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
            3 Protokol Krisis:
          </span>
          {INCIDENTS.map((inc, i) => {
            const isResolved = solvedIds.includes(inc.id);
            const isSelected = currentIdx === i;

            return (
              <button
                key={inc.id}
                onClick={() => {
                  soundFX.playChime('click');
                  setCurrentIdx(i);
                  setFeedback(null);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-rose-950/60 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                    : isResolved
                    ? 'bg-emerald-950/40 border-emerald-500/40'
                    : 'bg-[#0D2B45]/50 border-white/10'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{inc.system.split(':')[0]}</div>
                  <div className="text-[10px] text-slate-400 truncate">{inc.system.split(':')[1]}</div>
                </div>
                {isResolved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}

          <button
            onClick={handleReset}
            className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer mt-4"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Kasus Pamungkas</span>
          </button>
        </div>

        {/* Incident Resolution Workspace */}
        <div className="md:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#0D2B45]/70 border border-rose-500/30 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-rose-400" />
              <h3 className="font-['Cinzel'] font-bold text-white text-base">
                {incident.system}
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 mb-4">
              <span className="text-[10px] font-mono uppercase text-rose-400 font-bold block mb-0.5">
                Kekacauan Prosedur Saat Ini:
              </span>
              <p className="text-xs font-mono text-rose-100">
                {incident.problem}
              </p>
            </div>

            <label className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold block mb-2">
              Pilih Tindakan Prosedural Darurat yang Baku & Presisi:
            </label>

            <div className="space-y-2">
              {incident.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(opt)}
                  className="w-full text-left p-3 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 hover:border-cyan-400 text-xs text-slate-200 font-sans transition-colors cursor-pointer"
                >
                  {opt.text}
                </button>
              ))}
            </div>
          </div>

          {feedback && (
            <div className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-sans text-cyan-200">
              {feedback}
            </div>
          )}

          {isAllSolved && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-400 text-center text-xs font-mono text-emerald-300 font-bold flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Seluruh Protokol Darurat Berhasil Dinormalisasi! Stasiun Selamat!</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10">
        <button
          onClick={() => {
            soundFX.playChime('click');
            onBackToMap();
          }}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
        >
          Kembali ke Peta Benua
        </button>

        {onComplete && (
          <button
            disabled={!isAllSolved}
            onClick={() => {
              soundFX.playChime('victory');
              onComplete();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>Buka Laporan Kelulusan Maestro (Tahap 12)</span>
            <ShieldCheck className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
