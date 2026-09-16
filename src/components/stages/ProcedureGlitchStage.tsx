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
  AlertTriangle,
  Search,
  CheckCircle2,
  Bug,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { StoryboardProgressHUD } from '../ui/StoryboardProgressHUD';

interface ProcedureGlitchStageProps {
  onNext: () => void;
  onBack: () => void;
}

interface ProcedureLineNode {
  id: number;
  isGlitch: boolean;
  label: string;
  errorType: string;
  snippet: string;
  diagnosis: string;
  ruleViolated: string;
}

const PROCEDURE_LINES: ProcedureLineNode[] = [
  {
    id: 1,
    isGlitch: true,
    label: 'Glitch 1: Takaran Ambigu & Tidak Terukur',
    errorType: 'Pelanggaran Adverbia Kuantitatif',
    snippet: 'Tuangkan cairan pelarut secukupnya sesuka hati tanpa perlu ditakar dengan gelas ukur.',
    diagnosis: 'Penggunaan frasa "secukupnya sesuka hati" sangat ambigu dan membahayakan keselamatan reaktor kuantum.',
    ruleViolated: 'Kaidah: Teks prosedur wajib mencantumkan takaran kuantitatif terukur (contoh: 250 ml).',
  },
  {
    id: 2,
    isGlitch: false,
    label: 'Baris Standar A: Verba Imperatif & Keterangan Arah Terukur',
    errorType: 'Kaidah Dipatuhi (Bukan Glitch)',
    snippet: 'Kuncilah katup pembuangan tekanan dengan memutar roda katup searah jarum jam hingga rapat.',
    diagnosis: 'Kalimat ini menggunakan verba imperatif tegas berakhiran -lah ("Kuncilah") dan keterangan cara terukur ("searah jarum jam hingga rapat").',
    ruleViolated: 'Standar: Mematuhi kaidah kalimat imperatif operasional yang jelas dan tidak ambigu.',
  },
  {
    id: 3,
    isGlitch: true,
    label: 'Glitch 2: Kalimat Pasif Lemah & Bukan Imperatif',
    errorType: 'Peniadaan Kalimat Perintah Baku',
    snippet: 'Anda barangkali bisa mempertimbangkan untuk memutar tuas jika tidak terlalu sibuk.',
    diagnosis: 'Kalimat ini bersifat permisif ragu-ragu dan tidak memiliki verba imperatif instruksional.',
    ruleViolated: 'Kaidah: Gunakan kalimat imperatif tegas dengan imbuhan -kan/-lah (contoh: "Putarlah tuas katup daya 90 derajat").',
  },
  {
    id: 4,
    isGlitch: true,
    label: 'Glitch 3: Konjungsi Temporal Terbalik & Tidak Logis',
    errorType: 'Anomali Urutan Kronologis',
    snippet: 'Setelah selesai proses pembakaran, pertama-tama pasanglah katup segel pengaman reaktor.',
    diagnosis: 'Konjungsi "setelah selesai" diletakkan mendahului "pertama-tama". Memasang pengaman setelah pembakaran fatal!',
    ruleViolated: 'Kaidah: Konjungsi temporal wajib mengikuti alur sebab-akibat kronologis.',
  },
  {
    id: 5,
    isGlitch: false,
    label: 'Baris Standar B: Verba Instruksional & Adverbia Presisi',
    errorType: 'Kaidah Dipatuhi (Bukan Glitch)',
    snippet: 'Bilaslah silinder ukur menggunakan 100 ml air deionisasi netral sebelum pengujian lanjutan.',
    diagnosis: 'Kalimat ini telah memenuhi kaidah: verba imperatif "Bilaslah" dan takaran kuantitatif presisi "100 ml".',
    ruleViolated: 'Standar: Memenuhi standar kebahasaan teks prosedur ilmiah.',
  },
  {
    id: 6,
    isGlitch: true,
    label: 'Glitch 4: Kondisi Kualitatif Samar & Subjektif',
    errorType: 'Ketiadaan Adverbia Suhu / Waktu',
    snippet: 'Panaskan tabung reaksi sampai dirasa sudah agak hangat dan nyaman saat disentuh.',
    diagnosis: '"Agak hangat dan nyaman" bersifat subjektif setiap orang dan tidak ilmiah untuk standar operasional.',
    ruleViolated: 'Kaidah: Nyatakan parameter fisik terukur seperti derajat Celcius atau durasi menit yang pasti (contoh: "pada suhu 60°C selama 10 menit").',
  },
];

const TOTAL_ACTUAL_GLITCHES = PROCEDURE_LINES.filter((p) => p.isGlitch).length;

export const ProcedureGlitchStage: React.FC<ProcedureGlitchStageProps> = ({
  onNext,
  onBack,
}) => {
  const [foundGlitches, setFoundGlitches] = useState<number[]>([]);
  const [selectedNode, setSelectedNode] = useState<ProcedureLineNode | null>(null);

  const handleInspectSnippet = (node: ProcedureLineNode) => {
    if (node.isGlitch) {
      if (!foundGlitches.includes(node.id)) {
        soundFX.playChime('glitch');
        const next = [...foundGlitches, node.id];
        setFoundGlitches(next);
        gameStateManager.save({ glitchesFound: next });
        if (next.length === TOTAL_ACTUAL_GLITCHES) {
          setTimeout(() => soundFX.playChime('victory'), 300);
          gameStateManager.unlockBadge('detektif_glitch');
        }
      } else {
        soundFX.playChime('click');
      }
    } else {
      soundFX.playChime('gold');
    }
    setSelectedNode(node);
  };

  const isAllFound = foundGlitches.length === TOTAL_ACTUAL_GLITCHES;

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
                MISI 6 // DETEKSI KERANCUAN BAHASA
              </span>
              <span className="text-xs font-mono text-cyan-400">Pendeteksian Anomali Prosedur</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Deteksi Anomali & Kerancuan Bahasa
            </h1>
          </div>
        </div>

        {/* Glitch Progress Meter */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0D2B45]/80 border border-rose-500/30">
          <Bug className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-mono text-slate-300">Kerancuan Terdeteksi:</span>
          <span className="text-xs font-mono font-bold text-rose-300">
            {foundGlitches.length} / {TOTAL_ACTUAL_GLITCHES}
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
      <MissionGuideBox
        stageKey="procedure_glitch"
        mood={isAllFound ? 'proud' : (foundGlitches.length > 0 ? 'surprised' : 'concerned')}
        className="mb-3"
      />

      {/* Glitch Classification Banner (Direct from Image 2: Step 4 Diagnosis) */}
      <div className="relative z-10 mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#200A18] via-[#350F26] to-[#200A18] border-2 border-rose-500/60 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-rose-300 flex items-center gap-1.5">
            <Bug className="w-4 h-4 text-rose-400" />
            <span>LANGKAH 4 // INKUIRI FORENSIK: DIAGNOSIS ANOMALI vs BARIS BAKU</span>
          </span>
          <span className="text-[11px] font-mono text-slate-300">
            Temukan 4 anomali linguistik di antara baris instruksi dokumen
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
                DOKUMEN OPERASIONAL REAKTOR // INVESTIGASI TEKS
              </span>
              <span className="text-[11px] font-mono text-amber-300 flex items-center gap-1">
                <Search className="w-3.5 h-3.5" /> Klik setiap baris untuk memindai
              </span>
            </div>

            <div className="space-y-3 font-sans">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300">
                <strong className="text-white block font-mono mb-1">PROSEDUR:</strong>
                "Pengisian Daya dan Stabilisasi Reaktor Bioplasma Antariksa"
              </div>

              {PROCEDURE_LINES.map((line, idx) => {
                const isFound = line.isGlitch && foundGlitches.includes(line.id);
                const isSelected = selectedNode?.id === line.id;

                return (
                  <button
                    key={line.id}
                    onClick={() => handleInspectSnippet(line)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? line.isGlitch
                          ? 'bg-rose-950/50 border-rose-400 shadow-[0_0_15px_rgba(255,0,85,0.4)]'
                          : 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : isFound
                        ? 'bg-rose-950/20 border-rose-500/40 hover:border-rose-400'
                        : !line.isGlitch && isSelected
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : 'bg-black/30 border-white/10 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                        Baris #{idx + 1}
                      </span>
                      {isFound ? (
                        <span className="text-[10px] font-mono text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> GLITCH TERDETEKSI
                        </span>
                      ) : !line.isGlitch && isSelected ? (
                        <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> BARIS BAKU (BUKAN GLITCH)
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-500 group-hover:text-cyan-300">
                          [Klik untuk Pindai]
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs leading-relaxed ${
                        isFound
                          ? 'text-rose-200 font-mono'
                          : !line.isGlitch && isSelected
                          ? 'text-emerald-200 font-sans'
                          : 'text-slate-300'
                      }`}
                    >
                      {line.snippet}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-400 font-mono">
            Temukan dan diagnosis 4 anomali kebahasaan untuk membuka papan analisis forensik linguistik (Tahap 7).
          </div>
        </div>

        {/* Right Column: Diagnostic Scanner HUD */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0D2B45]/60 border border-rose-500/30 backdrop-blur-md flex flex-col justify-between space-y-4">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                {selectedNode.isGlitch ? (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div>
                  <h3 className="font-['Cinzel'] font-bold text-white text-base">
                    {selectedNode.label}
                  </h3>
                  <span
                    className={`text-[11px] font-mono ${
                      selectedNode.isGlitch ? 'text-rose-300' : 'text-emerald-300'
                    }`}
                  >
                    {selectedNode.errorType}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div
                  className={`p-3.5 rounded-xl border ${
                    selectedNode.isGlitch
                      ? 'bg-rose-950/40 border-rose-500/30'
                      : 'bg-emerald-950/40 border-emerald-500/30'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono uppercase font-bold block mb-1 ${
                      selectedNode.isGlitch ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {selectedNode.isGlitch ? 'Kutipan Kalimat Korup:' : 'Kutipan Kalimat Baku:'}
                  </span>
                  <p
                    className={`text-xs font-mono italic ${
                      selectedNode.isGlitch ? 'text-rose-100' : 'text-emerald-100'
                    }`}
                  >
                    "{selectedNode.snippet}"
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <span className="text-[10px] font-mono uppercase text-cyan-300 font-bold block">
                    Hasil Diagnosis Analisis:
                  </span>
                  <p className="text-xs text-slate-200 font-sans leading-relaxed">
                    {selectedNode.diagnosis}
                  </p>
                </div>

                <div
                  className={`p-3.5 rounded-xl border space-y-2 ${
                    selectedNode.isGlitch
                      ? 'bg-amber-950/30 border-amber-500/30'
                      : 'bg-emerald-950/30 border-emerald-500/30'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono uppercase font-bold block ${
                      selectedNode.isGlitch ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {selectedNode.isGlitch
                      ? 'Kaidah Kebahasaan yang Dilanggar:'
                      : 'Kaidah Kebahasaan yang Dipatuhi:'}
                  </span>
                  <p
                    className={`text-xs font-sans leading-relaxed ${
                      selectedNode.isGlitch ? 'text-amber-200' : 'text-emerald-200'
                    }`}
                  >
                    {selectedNode.ruleViolated}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Search className="w-10 h-10 text-cyan-400/40 mb-3 animate-pulse" />
              <h3 className="font-['Cinzel'] font-bold text-white text-base mb-1">
                Pemindai Diagnostik Siap
              </h3>
              <p className="text-xs max-w-sm">
                Klik salah satu langkah di sisi kiri untuk menganalisis apakah kalimat tersebut mengandung cacat linguistik atau sudah baku.
              </p>
            </div>
          )}

          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Status Forensik:</span>
            <span className={isAllFound ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
              {isAllFound ? 'LENGKAP: 4 Glitch Terisolasi (Lencana Terbuka!)' : `${foundGlitches.length} / 4 Kerancuan Terisolasi`}
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
          Kembali ke Urutan Logis
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
