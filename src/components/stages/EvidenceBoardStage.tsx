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
  Network,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Link,
  ShieldCheck,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { StoryboardProgressHUD } from '../ui/StoryboardProgressHUD';

interface EvidenceBoardStageProps {
  onNext: () => void;
  onBack: () => void;
}

interface EvidenceItem {
  id: string;
  snippet: string;
  matchedRuleId?: string;
}

interface RuleItem {
  id: string;
  title: string;
  description: string;
}

const INITIAL_EVIDENCES: EvidenceItem[] = [
  { id: 'E1', snippet: '"Tuangkan cairan pelarut secukupnya sesuka hati tanpa perlu ditakar."' },
  { id: 'E2', snippet: '"Anda barangkali bisa mempertimbangkan untuk memutar tuas jika sempat."' },
  { id: 'E3', snippet: '"Setelah selesai proses pembakaran, pertama-tama pasanglah katup segel."' },
  { id: 'E4', snippet: '"Panaskan tabung sampai dirasa sudah agak hangat dan nyaman disentuh."' },
];

const RULES: RuleItem[] = [
  { id: 'R1', title: 'Adverbia Kuantitatif Presisi', description: 'Takaran material wajib menggunakan angka kuantitatif eksak (contoh: 250 ml, bukan "secukupnya").' },
  { id: 'R2', title: 'Kalimat Imperatif Tegas', description: 'Gunakan verba perintah langsung berakhiran -kan/-lah, bukan kalimat naratif permisif berbelit.' },
  { id: 'R3', title: 'Kronologi Konjungsi Temporal', description: 'Penanda waktu harus runtun secara logika sebab-akibat (pertama-tama harus mendahului setelah).' },
  { id: 'R4', title: 'Adverbia Suhu & Durasi Objektif', description: 'Suhu dan waktu wajib dinyatakan dalam besaran ilmiah terukur (°C, detik/menit), bukan rasa perasaan.' },
];

const CORRECT_MATCHES: { [key: string]: string } = {
  E1: 'R1',
  E2: 'R2',
  E3: 'R3',
  E4: 'R4',
};

const MISMATCH_EXPLANATIONS: { [key: string]: string } = {
  'E1-R2': 'Bukti E1 bermasalah pada takaran cairan ("secukupnya sesuka hati"), bukan ketiadaan kalimat imperatif ("Tuangkan"). Hubungkan dengan kaidah ukuran kuantitatif!',
  'E1-R3': 'Bukti E1 tidak memuat urutan konjungsi waktu yang terbalik, melainkan takaran material yang tidak terukur.',
  'E1-R4': 'Bukti E1 membahas cairan pelarut yang tidak ditakar, bukan suhu pemanasan atau durasi menit.',
  'E2-R1': 'Bukti E2 menyoroti gaya tutur yang ragu-ragu ("barangkali bisa mempertimbangkan"), bukan besaran takaran mililiter.',
  'E2-R3': 'Bukti E2 tidak memiliki masalah pada urutan konjungsi waktu, melainkan kelemahan verba perintah instruksional.',
  'E2-R4': 'Bukti E2 mempersoalkan instruksi memutar tuas yang tidak tegas, bukan besaran termal atau waktu pemanasan.',
  'E3-R1': 'Bukti E3 menempatkan "Setelah selesai" sebelum "pertama-tama". Ini adalah kekacauan alur waktu, bukan takaran mililiter.',
  'E3-R2': 'Bukti E3 sudah menggunakan kalimat perintah "pasanglah", tetapi urutan konjungsi sebab-akibatnya terbalik berbahaya!',
  'E3-R4': 'Bukti E3 tidak membahas suhu atau menit, melainkan urutan keselamatan kronologis yang terbalik.',
  'E4-R1': 'Bukti E4 mempersoalkan kondisi suhu subjektif ("agak hangat dan nyaman"), bukan takaran volume cairan.',
  'E4-R2': 'Bukti E4 sudah memakai verba "Panaskan", namun deskripsi suhunya tidak menggunakan angka kuantitatif Celcius terukur.',
  'E4-R3': 'Bukti E4 tidak bermasalah pada konjungsi urutan, melainkan pada ketiadaan angka derajat Celcius objektif.',
};

export const EvidenceBoardStage: React.FC<EvidenceBoardStageProps> = ({
  onNext,
  onBack,
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [matches, setMatches] = useState<{ [evidenceId: string]: string }>({});
  const [feedback, setFeedback] = useState<string>('Pilih kartu bukti di sebelah kiri, lalu pilih kaidah yang cocok di sebelah kanan.');

  const handleSelectEvidence = (evId: string) => {
    soundFX.playChime('click');
    setSelectedEvidence(evId);
    setFeedback(`Bukti ${evId} dipilih. Sekarang klik kaidah kebahasaan yang sesuai.`);
  };

  const handleSelectRule = (ruleId: string) => {
    if (!selectedEvidence) {
      soundFX.playChime('error');
      setFeedback('Pilih bukti kesalahan di sebelah kiri terlebih dahulu!');
      return;
    }

    if (CORRECT_MATCHES[selectedEvidence] === ruleId) {
      soundFX.playChime('gold');
      const updated = { ...matches, [selectedEvidence]: ruleId };
      setMatches(updated);
      setSelectedEvidence(null);
      setFeedback('Pencocokan Tepat! Bukti kesalahan berhasil dihubungkan dengan kaidah ilmiah.');
      if (Object.keys(updated).length === INITIAL_EVIDENCES.length) {
        setTimeout(() => soundFX.playChime('victory'), 200);
        gameStateManager.unlockBadge('pengumpul_bukti');
        gameStateManager.save({ evidenceCompleted: true });
      }
    } else {
      soundFX.playChime('error');
      const mismatchKey = `${selectedEvidence}-${ruleId}`;
      const reason = MISMATCH_EXPLANATIONS[mismatchKey] || 'Kaidah tidak sesuai dengan bukti ini! Analisis kembali jenis kesalahannya.';
      setFeedback(`Koreksi: ${reason}`);
    }
  };

  const handleReset = () => {
    soundFX.playChime('click');
    setMatches({});
    setSelectedEvidence(null);
    setFeedback('Papan bukti direset. Silakan hubungkan kembali.');
  };

  const isCompleted = Object.keys(matches).length === INITIAL_EVIDENCES.length;

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
            <span>Tahap 6</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                MISI 7 // PENGHUBUNG BUKTI KAIDAH
              </span>
              <span className="text-xs font-mono text-cyan-400">Papan Korelasi Kaidah</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Papan Bukti Linguistik
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Hubungan</span>
          </button>
        </div>
      </div>

      {/* 8-Step Storyboard Progress HUD (Image 2) */}
      <StoryboardProgressHUD currentStep={3} className="mb-3" />

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox
        stageKey="evidence_board"
        mood={isCompleted ? 'proud' : (Object.keys(matches).length > 0 ? 'encouraging' : 'curious')}
        className="mb-3"
      />

      {/* Evidence Board Pipeline (Directly from Image 2: Evidence Board Flow) */}
      <div className="relative z-10 mb-3 p-3 rounded-2xl bg-gradient-to-r from-[#0C2442] via-[#0E2E55] to-[#0C2442] border-2 border-indigo-400/60 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1.5">
            <Link className="w-4 h-4 text-cyan-400" />
            <span>PAPAN BUKTI: ALUR KORELASI LOGIKA</span>
          </span>
          <span className="text-[11px] font-mono text-cyan-200">
            Terhubung: {Object.keys(matches).length} / {INITIAL_EVIDENCES.length} Bukti
          </span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-mono">
          <span className="px-3 py-1 rounded-xl bg-cyan-500/25 text-cyan-200 border border-cyan-400/50 font-bold shadow-sm shrink-0">
            1. BUKTI KASUS
          </span>
          <span className="text-amber-400 font-bold shrink-0">➔</span>
          <span className="px-3 py-1 rounded-xl bg-blue-500/25 text-blue-200 border border-blue-400/50 font-bold shadow-sm shrink-0">
            2. HUBUNGAN
          </span>
          <span className="text-amber-400 font-bold shrink-0">➔</span>
          <span className="px-3 py-1 rounded-xl bg-rose-500/25 text-rose-200 border border-rose-400/50 font-bold shadow-sm shrink-0">
            3. AKIBAT
          </span>
          <span className="text-amber-400 font-bold shrink-0">➔</span>
          <span className="px-3 py-1 rounded-xl bg-amber-500/25 text-amber-200 border border-amber-400/50 font-bold shadow-sm shrink-0">
            4. KESIMPULAN
          </span>
          <span className="text-amber-400 font-bold shrink-0">➔</span>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 font-bold shadow-sm shrink-0">
            5. TINDAKAN
          </span>
        </div>
      </div>

      {/* Feedback Banner */}
      <div className="relative z-10 mb-3 p-3 rounded-xl bg-[#0D2B45]/90 border border-cyan-400/40 text-xs text-cyan-200 font-mono flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-300" />
          <span>{feedback}</span>
        </div>
        <span className="font-bold text-amber-300">
          Status: {isCompleted ? '✓ SEMUA TERHUBUNG' : `${Object.keys(matches).length}/4 Selesai`}
        </span>
      </div>

      {/* Main Forensic Evidence Board */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 my-2">
        {/* Left Column: Evidence Snippets */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-rose-300 font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Bukti Temuan Glitch (Anomali Teks)</span>
          </h3>

          {INITIAL_EVIDENCES.map((ev, idx) => {
            const isMatched = !!matches[ev.id];
            const isSelected = selectedEvidence === ev.id;

            return (
              <button
                key={ev.id}
                disabled={isMatched}
                onClick={() => handleSelectEvidence(ev.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isMatched
                    ? 'bg-emerald-950/30 border-emerald-500/40 opacity-75'
                    : isSelected
                    ? 'bg-purple-950/50 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                    : 'bg-[#0D2B45]/50 border-white/10 hover:border-purple-400/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
                    Bukti #{idx + 1}
                  </span>
                  {isMatched && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Terhubung
                    </span>
                  )}
                </div>
                <p className="text-xs font-mono text-slate-200 italic">
                  {ev.snippet}
                </p>
              </button>
            );
          })}
        </div>

        {/* Right Column: Theoretical Kaidah */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-2">
            <Link className="w-4 h-4" />
            <span>Kaidah Kebahasaan (Solusi Baku)</span>
          </h3>

          {RULES.map((rule) => {
            const isPaired = Object.values(matches).includes(rule.id);

            return (
              <button
                key={rule.id}
                disabled={isPaired}
                onClick={() => handleSelectRule(rule.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isPaired
                    ? 'bg-emerald-950/30 border-emerald-500/40 opacity-75'
                    : 'bg-[#0D2B45]/50 border-white/10 hover:border-cyan-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-['Cinzel']">
                    {rule.title}
                  </span>
                  {isPaired && (
                    <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Tervalidasi
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {rule.description}
                </p>
              </button>
            );
          })}
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
          Kembali ke Deteksi Kerancuan
        </button>
        <button
          disabled={!isCompleted}
          onClick={() => {
            soundFX.playChime('cyan');
            onNext();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Lanjut ke Bengkel Rekonstruksi (Tahap 8)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
