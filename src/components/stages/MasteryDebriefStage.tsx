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
  Flame,
  ArrowRight,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { WorldRestorationSlider } from '../restoration/WorldRestorationSlider';

interface MasteryDebriefStageProps {
  onBackToMap: () => void;
  onRestartLoop: () => void;
  onEnterProcedureForge?: () => void;
}

export const MasteryDebriefStage: React.FC<MasteryDebriefStageProps> = ({
  onBackToMap,
  onRestartLoop,
  onEnterProcedureForge,
}) => {
  const [reflectionAnswer, setReflectionAnswer] = useState<string>(
    'Saya belajar bahwa teks prosedur harus memiliki kalimat imperatif yang jelas, urutan temporal yang kronologis, dan takaran yang presisi agar instruksi tidak membahayakan atau membingungkan pembaca.'
  );
  const [copiedCert, setCopiedCert] = useState(false);
  const [showRestorationModal, setShowRestorationModal] = useState(false);

  const handleCopySummary = () => {
    soundFX.playChime('gold');
    const summary = `=== SERTIFIKAT KELULUSAN CHRONO-AKSARA ===\nPenyelaras Sintaksis Teks Prosedur Abad 22\nStatus: LULUS DENGAN PREDIKAT MAESTRO (KOMPETENSI LENGKAP)\nKompetensi: Mengingat Struktur, Memahami Kaidah, Menerapkan Kronologis, Menganalisis Kerancuan, Mengevaluasi Perbaikan, dan Mencipta Prosedur Mandiri.\nRefleksi: "${reflectionAnswer}"`;
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
              TAHAP 11 // EVALUASI AKHIR & REFLEKSI
            </span>
            <span className="text-xs font-mono text-cyan-400">Purna Misi Ekspedisi</span>
          </div>
          <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
            Laporan Capaian Kompetensi & Refleksi
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playChime('victory');
              setShowRestorationModal(true);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-mono text-xs flex items-center gap-1.5 shadow cursor-pointer transition-all"
            title="Bandingkan kondisi dunia terdistorsi vs pulih"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Pemulihan Benua (World Restoration)</span>
            <span className="sm:hidden">Restorasi</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedCert ? 'Disalin!' : 'Bagikan'}</span>
          </button>
        </div>
      </div>

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox stageKey="mastery_debrief" mood="proud" className="mb-3" />

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
                <span className="text-slate-400 block">Status Capaian:</span>
                <span className="text-cyan-300 font-bold">Semua Level Tuntas</span>
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
              Tingkat Kemahiran Penjelajah (Tuntas 100%)
            </h3>

            <div className="space-y-2">
              {[
                { tag: 'L1', name: 'Mengingat Struktur', detail: 'Mengidentifikasi 4 pilar struktur teks prosedur' },
                { tag: 'L2', name: 'Memahami Kaidah', detail: 'Memahami kaidah kalimat imperatif dan konjungsi' },
                { tag: 'L3', name: 'Menerapkan Urutan', detail: 'Menyusun urutan instruksi acak (Urutan Logis)' },
                { tag: 'L4', name: 'Menganalisis Kerancuan', detail: 'Mendeteksi kerancuan dan menghubungkan di Papan Bukti' },
                { tag: 'L5', name: 'Mengevaluasi & Perbaiki', detail: 'Menyunting kalimat baku dan simulasi operasional' },
                { tag: 'L6', name: 'Mencipta Mandiri', detail: 'Merumuskan prosedur orisinal di Tungku Cipta' },
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
      <div className="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundFX.playChime('cyan');
              onBackToMap();
            }}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Peta Benua</span>
          </button>
          <button
            onClick={() => {
              soundFX.playChime('click');
              onRestartLoop();
            }}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ulangi Siklus</span>
          </button>
        </div>

        {onEnterProcedureForge && (
          <button
            onClick={() => {
              soundFX.playChime('victory');
              onEnterProcedureForge();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(236,72,153,0.5)] flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Flame className="w-4 h-4 text-amber-200" />
            <span>Masuk ke Tungku Cipta Prosedur</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* MODAL: WORLD RESTORATION DIALOG */}
      {showRestorationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#08182B] border-2 border-[#D4AF37] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-['Cinzel'] text-[#FFE082] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Simulasi Pemulihan Benua Nusantara
              </h3>
              <button
                onClick={() => setShowRestorationModal(false)}
                className="px-3 py-1 rounded-lg bg-[#0D2B45] text-slate-300 hover:text-white border border-[#D4AF37]/30 text-xs font-mono cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <WorldRestorationSlider
              compact={false}
              onContinue={() => {
                setShowRestorationModal(false);
                if (onEnterProcedureForge) onEnterProcedureForge();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
