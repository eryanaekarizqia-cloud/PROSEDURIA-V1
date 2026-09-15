/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import {
  CheckCircle2,
  Award,
  Sparkles,
  RotateCcw,
  Compass,
  Download,
  Share2,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';

interface MasteryDebriefStageProps {
  onBackToMap: () => void;
  onRestartLoop: () => void;
}

export const MasteryDebriefStage: React.FC<MasteryDebriefStageProps> = ({
  onBackToMap,
  onRestartLoop,
}) => {
  const [reflectionAnswer, setReflectionAnswer] = useState<string>(
    'Saya belajar bahwa teks prosedur harus memiliki kalimat imperatif yang jelas, urutan temporal yang kronologis, dan takaran yang presisi agar instruksi tidak membahayakan atau membingungkan pembaca.'
  );
  const [copiedCert, setCopiedCert] = useState(false);

  const handleCopySummary = () => {
    soundFX.playChime('gold');
    const summary = `=== SERTIFIKAT KELULUSAN CHRONO-AKSARA ===\nPenyelaras Sintaksis Teks Prosedur Abad 22\nStatus: LULUS DENGAN PREDIKAT MAESTRO (100% C1-C6)\nKompetensi: Mengingat, Memahami, Menerapkan, Menganalisis, Mengevaluasi, dan Mencipta Teks Prosedur.\nRefleksi: "${reflectionAnswer}"`;
    navigator.clipboard.writeText(summary);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2000);
  };

  return (
    <div className="relative w-full h-full pt-16 pb-6 px-4 sm:px-8 flex flex-col justify-between overflow-y-auto">
      <div className="absolute inset-0 bg-[#08131F] opacity-95 z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              TAHAP 12 // EVALUASI AKHIR & REFLEKSI
            </span>
            <span className="text-xs font-mono text-cyan-400">Purna Misi Ekspedisi</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
            Laporan Capaian Kompetensi & Refleksi
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedCert ? 'Disalin ke Clipboard!' : 'Bagikan Capaian'}</span>
          </button>
        </div>
      </div>

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox stageKey="mastery_debrief" className="mb-3" />

      {/* Main Grid: Certificate & Self-Assessment Rubric */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 my-2">
        {/* Left Column: Holographic Certificate Card */}
        <div className="p-6 rounded-2xl bg-[#0D2B45]/70 border-2 border-[#D4AF37] backdrop-blur-md flex flex-col justify-between relative shadow-[0_0_40px_rgba(212,175,55,0.3)]">
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#FFE082]">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#FFE082] uppercase font-bold">
                KEMENTERIAN KURIKULUM BAHASA NUSANTARA
              </span>
              <h2 className="text-xl sm:text-2xl font-['Cinzel'] font-black text-white mt-1">
                PIAGAM KELULUSAN SINTAKSIS
              </h2>
              <p className="text-xs font-mono text-cyan-300 mt-0.5">
                Dianugerahkan kepada: <strong className="text-white">Penyelaras Utama Abad 22</strong>
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 font-sans leading-relaxed text-left">
              Dinyatakan telah berhasil menuntaskan seluruh 12 siklus ekspedisi <strong>Chrono-Aksara: Protokol Teks Prosedur</strong>.
              Mampu menganalisis distorsi bahasa, memperbaiki kalimat imperatif, menyusun alur kronologis teratur, dan menciptakan karya prosedur baru secara mandiri.
            </div>

            <div className="grid grid-cols-3 gap-2 text-left font-mono text-[10px]">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block">Predikat:</span>
                <span className="text-emerald-400 font-bold">Istimewa (A+)</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block">Status Bloom:</span>
                <span className="text-cyan-300 font-bold">C1 - C6 Kuasai</span>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <span className="text-slate-400 block">Validasi AI:</span>
                <span className="text-[#FFE082] font-bold">ARUNA Ver. 22</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>ID: CHRONO-2026-TXT-994</span>
            <span className="text-emerald-400 font-bold">TERKODIFIKASI PERMANEN</span>
          </div>
        </div>

        {/* Right Column: Mastery Rubric & Reflection Input */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D2B45]/60 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-['Cinzel'] font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Rubrik Taksonomi Bloom (Tuntas 100%)
            </h3>

            <div className="space-y-2">
              {[
                { tag: 'C1', name: 'Mengingat', detail: 'Mengidentifikasi 4 pilar struktur teks prosedur' },
                { tag: 'C2', name: 'Memahami', detail: 'Memahami kaidah kalimat imperatif dan konjungsi' },
                { tag: 'C3', name: 'Menerapkan', detail: 'Menyusun urutan instruksi acak (Sequence Puzzle)' },
                { tag: 'C4', name: 'Menganalisis', detail: 'Mendeteksi glitch dan menghubungkan di Papan Bukti' },
                { tag: 'C5', name: 'Mengevaluasi', detail: 'Menyunting kalimat baku dan simulasi operasional' },
                { tag: 'C6', name: 'Mencipta', detail: 'Merumuskan prosedur orisinal di Procedure Forge' },
              ].map((r) => (
                <div key={r.tag} className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-5 rounded font-mono font-bold text-[10px] bg-cyan-400/20 text-[#00F2FE] flex items-center justify-center">
                      {r.tag}
                    </span>
                    <span className="font-bold text-white">{r.name}:</span>
                    <span className="text-slate-300 hidden sm:inline">{r.detail}</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Self-Reflection Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold block flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Refleksi Pembelajaran Mandiri:
            </label>
            <textarea
              rows={3}
              value={reflectionAnswer}
              onChange={(e) => setReflectionAnswer(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs font-sans outline-none focus:border-cyan-400"
              placeholder="Tuliskan apa yang kamu pelajari mengenai ketepatan bahasa dalam kehidupan sehari-hari..."
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10">
        <button
          onClick={() => {
            soundFX.playChime('cyan');
            onBackToMap();
          }}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Kembali ke Peta Dunia</span>
        </button>
        <button
          onClick={() => {
            soundFX.playChime('gold');
            onRestartLoop();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0284C7] text-[#08131F] font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-4 h-4 text-[#08131F]" />
          <span>Ulangi Ekspedisi dari Awal (Restart Loop)</span>
        </button>
      </div>
    </div>
  );
};
