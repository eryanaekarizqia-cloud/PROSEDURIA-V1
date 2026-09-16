/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Sparkles,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Scale,
  Target,
  FileText,
  Layers,
  ChevronRight,
  Info,
  Check,
  Bookmark,
  Eye,
  Crosshair,
} from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';
import { AksaraExpressionType } from '../character/AksaraCharacterVisual';

export interface FantasyEvidenceBoardProps {
  onComplete: () => void;
  onBack?: () => void;
  speakAksara?: (text: string, expression?: AksaraExpressionType) => void;
  initialMatches?: Record<string, string>;
  onMatchesChange?: (matches: Record<string, string>) => void;
}

export interface EvidenceItem {
  id: string;
  code: string;
  title: string;
  category: string;
  anomalyQuote: string;
  handwrittenNote: string;
  pinColor: string;
  tiltDeg: number;
  expectedPillar: string;
  consequence: string;
  conclusion: string;
  action: string;
}

export interface PillarItem {
  id: string;
  code: string;
  name: string;
  shortRule: string;
  symbol: string;
  color: string;
  runeName: string;
  expectedEvidence: string;
}

const EVIDENCE_LIST: EvidenceItem[] = [
  {
    id: 'ev_spoon',
    code: 'BUKTI-01 // ALAT MEKANIK',
    title: 'Sendok Pengaduk Menganggur di Tatakan',
    category: 'Cacat Tindakan Mekanik',
    anomalyQuote: '"Masukkan bubuk cokelat dan gula ke dalam air mendidih."',
    handwrittenNote: 'Sendok perak terletak rapi tanpa noda di tatakan keramik. Sama sekali tidak pernah digerakkan! Gaya gesek mekanik = 0 N.',
    pinColor: '#EF4444', // Ruby pin
    tiltDeg: -1.2,
    expectedPillar: 'p_imperatif',
    consequence: 'Partikel bubuk kakao mengapung kaku di permukaan cairan; tidak ada gaya putar yang memecah tegangan permukaan air panas.',
    conclusion: 'Ketiadaan verba imperatif aksi membuat langkah pencampuran hilang total dari instruksi.',
    action: 'Tambahkan instruksi verba imperatif presisi: "Aduklah campuran dengan sendok secara memutar selama 30 detik hingga homogen."',
  },
  {
    id: 'ev_scroll',
    code: 'BUKTI-02 // ALUR KRONOLOGIS',
    title: 'Gulungan Naskah Tanpa Konjungsi Waktu',
    category: 'Disorientasi Temporal',
    anomalyQuote: '"Tuang air panas. Masukkan bubuk cokelat. Sajikan segera."',
    handwrittenNote: 'Air mendidih dituangkan di awal sebelum bahan padat dimasukkan. Konjungsi temporal lenyap, urutan kausalitas terbalik 180°!',
    pinColor: '#38BDF8', // Sapphire pin
    tiltDeg: 1.5,
    expectedPillar: 'p_konjungsi',
    consequence: 'Air panas mendingin sia-sia sebelum bubuk masuk, lalu membakar lapisan luar kakao dan membentuk segel kering.',
    conclusion: 'Ketiadaan konjungsi temporal memicu praktikan melakukan aksi hilir sebelum prasyarat hulu disiapkan.',
    action: 'Sisipkan konjungsi temporal bertingkat: "Pertama... Kedua... Kemudian... Selanjutnya... Terakhir..." untuk mengunci urutan kerja runtun.',
  },
  {
    id: 'ev_spill',
    code: 'BUKTI-03 // HIDRO-VOLUME',
    title: 'Tumpahan Air Panas 150 ml & Luapan Meja',
    category: 'Pelanggaran Kapasitas & Takaran',
    anomalyQuote: '"Tuangkan 150 ml air mendidih ke dalam cangkir kosong sekaligus."',
    handwrittenNote: 'Genangan air panas 150 ml membanjiri meja kayu! Kapasitas cangkir 180 ml, tidak tersisa ruang 1 ml pun untuk mengaduk tanpa meluap.',
    pinColor: '#F59E0B', // Topaz pin
    tiltDeg: -0.9,
    expectedPillar: 'p_takaran',
    consequence: 'Volume cairan mencapai bibir cangkir secara ekstrem; setiap sentuhan bahan atau sendok langsung menumpahkan air panas ke meja.',
    conclusion: 'Teks mengabaikan hidrodinamika wadah dan ketiadaan pembagian takaran bertahap (staged volume).',
    action: 'Bagi kuantitas penuangan: "Tuangkan 30 ml air panas terlebih dahulu untuk melarutkan bubuk menjadi pasta, lalu tuangkan sisa 120 ml air."',
  },
  {
    id: 'ev_clump',
    code: 'BUKTI-04 // TEKSTUR & EMULSI',
    title: 'Gumpalan Cokelat Kering Mengambang',
    category: 'Kegagalan Dispersi & Tolok Ukur',
    anomalyQuote: '"Biarkan bubuk larut dengan sendirinya di dalam cangkir."',
    handwrittenNote: 'Lemak kakao hidrofobik menolak molekul air! Inti bagian dalam gumpalan tetap kering kerontang tanpa emulsi.',
    pinColor: '#10B981', // Emerald pin
    tiltDeg: 1.8,
    expectedPillar: 'p_adverbia',
    consequence: 'Bubuk membeku membentuk kerak kering mengapung; cita rasa dan nutrisi kakao terkunci di dalam kantung udara tanpa terekstraksi.',
    conclusion: 'Teks mengandalkan asumsi pasif tanpa memberikan kriteria tekstur akhir dan metode pelarutan spesifik.',
    action: 'Definisikan adverbia cara spesifik: "Larutkan dengan sedikit air hingga bertekstur pasta kental licin tanpa butiran gumpalan."',
  },
];

const PILLARS: PillarItem[] = [
  {
    id: 'p_imperatif',
    code: 'PILAR I',
    name: 'Verba Imperatif Aksi Operasional',
    shortRule: 'Kata kerja perintah tegas (-kan/-lah)',
    symbol: '⚡',
    color: '#EF4444',
    runeName: 'Sabda Imperativa',
    expectedEvidence: 'ev_spoon',
  },
  {
    id: 'p_konjungsi',
    code: 'PILAR II',
    name: 'Konjungsi Kronologis & Rantai Waktu',
    shortRule: 'Penanda urutan waktu (Pertama, Kemudian)',
    symbol: '⏳',
    color: '#38BDF8',
    runeName: 'Poros Chronos',
    expectedEvidence: 'ev_scroll',
  },
  {
    id: 'p_takaran',
    code: 'PILAR III',
    name: 'Adverbia Takaran Bertahap Presisi',
    shortRule: 'Angka takaran terbagi (30 ml & 120 ml)',
    symbol: '⚖️',
    color: '#F59E0B',
    runeName: 'Neraca Kuantum',
    expectedEvidence: 'ev_spill',
  },
  {
    id: 'p_adverbia',
    code: 'PILAR IV',
    name: 'Adverbia Kualitas Cara & Kondisi',
    shortRule: 'Kriteria tekstur ("hingga larut merata")',
    symbol: '🎯',
    color: '#10B981',
    runeName: 'Matriks Kesempurnaan',
    expectedEvidence: 'ev_clump',
  },
];

export const FantasyEvidenceBoard: React.FC<FantasyEvidenceBoardProps> = ({
  onComplete,
  onBack,
  speakAksara,
  initialMatches = {},
  onMatchesChange,
}) => {
  const [matches, setMatches] = useState<Record<string, string>>(initialMatches);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [activeDossierId, setActiveDossierId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'BOARD' | 'DOSSIER'>('BOARD');
  const deskRef = useRef<HTMLDivElement>(null);
  const [pinCoords, setPinCoords] = useState<Record<string, { x: number; y: number }>>({});
  const [lastFeedback, setLastFeedback] = useState<{
    text: string;
    type: 'neutral' | 'success' | 'error';
  }>({
    text: 'Pilih kartu bukti di meja investigasi, lalu kaitkan benang ke Pilar Kaidah yang cocok.',
    type: 'neutral',
  });

  const matchedCount = Object.keys(matches).length;
  const isAllConnected = matchedCount === 4;

  const updatePinCoords = useCallback(() => {
    if (!deskRef.current) return;
    const boardRect = deskRef.current.getBoundingClientRect();
    const coords: Record<string, { x: number; y: number }> = {};

    EVIDENCE_LIST.forEach((ev) => {
      const el = document.getElementById(`pin-ev-${ev.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        coords[`ev_${ev.id}`] = {
          x: rect.left + rect.width / 2 - boardRect.left,
          y: rect.top + rect.height / 2 - boardRect.top,
        };
      }
    });

    PILLARS.forEach((p) => {
      const el = document.getElementById(`pin-pillar-${p.id}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        coords[`pillar_${p.id}`] = {
          x: rect.left + rect.width / 2 - boardRect.left,
          y: rect.top + rect.height / 2 - boardRect.top,
        };
      }
    });

    setPinCoords(coords);
  }, []);

  useEffect(() => {
    updatePinCoords();
    window.addEventListener('resize', updatePinCoords);
    const t1 = setTimeout(updatePinCoords, 50);
    const t2 = setTimeout(updatePinCoords, 300);
    return () => {
      window.removeEventListener('resize', updatePinCoords);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updatePinCoords, matches, viewMode, selectedEvidenceId]);

  const handleSelectEvidence = (evId: string) => {
    soundFX.playChime('click');
    if (selectedEvidenceId === evId) {
      setSelectedEvidenceId(null);
      setLastFeedback({
        text: 'Pemilihan benang dibatalkan. Klik kartu bukti lain untuk menghubungkan.',
        type: 'neutral',
      });
      return;
    }

    setSelectedEvidenceId(evId);
    const ev = EVIDENCE_LIST.find((e) => e.id === evId);
    setLastFeedback({
      text: `Benang detektif disematkan pada: "${ev?.title}". Sekarang klik Pilar Kaidah Teks Prosedur yang sesuai!`,
      type: 'neutral',
    });

    if (speakAksara) {
      speakAksara(
        `Perhatikan temuan ${ev?.title}. Manakah pilar kaidah prosedur yang terlanggar?`,
        'MENYELIDIKI'
      );
    }
  };

  const handleSelectPillar = (pillarId: string) => {
    if (!selectedEvidenceId) {
      // If user clicks a pillar without selecting evidence, find if already connected
      const connectedEvId = Object.keys(matches).find((k) => matches[k] === pillarId);
      if (connectedEvId) {
        soundFX.playChime('click');
        setActiveDossierId(connectedEvId);
        setViewMode('DOSSIER');
        return;
      }
      soundFX.playChime('click');
      setLastFeedback({
        text: 'Pilih salah satu Kartu Bukti di sebelah kiri terlebih dahulu sebelum mengaitkannya ke Pilar!',
        type: 'neutral',
      });
      return;
    }

    const ev = EVIDENCE_LIST.find((e) => e.id === selectedEvidenceId);
    const pillar = PILLARS.find((p) => p.id === pillarId);

    if (!ev || !pillar) return;

    if (ev.expectedPillar === pillarId) {
      // Correct Connection!
      soundFX.playChime('gold');
      const newMatches = { ...matches, [selectedEvidenceId]: pillarId };
      setMatches(newMatches);
      onMatchesChange?.(newMatches);
      setSelectedEvidenceId(null);
      setActiveDossierId(selectedEvidenceId);

      setLastFeedback({
        text: `Koneksi Valid! "${ev.title}" terikat sempurna dengan "${pillar.name}". Rantai Kausalitas terbuka!`,
        type: 'success',
      });

      if (Object.keys(newMatches).length === 4) {
        soundFX.playChime('victory');
        if (speakAksara) {
          speakAksara(
            'Luar biasa! Seluruh 4 benang kausalitas telah terangkai utuh: BUKTI → HUBUNGAN → AKIBAT → KESIMPULAN → TINDAKAN! Sekarang kita siap merumuskan diagnosis!',
            'SUKSES'
          );
        }
      } else {
        if (speakAksara) {
          speakAksara(
            `Tepat sekali! Kausalitas ${ev.title} berhasil dipecahkan. Terus telusuri sisa bukti di meja!`,
            'SENANG'
          );
        }
      }
    } else {
      // Mismatched
      soundFX.playChime('error');
      setLastFeedback({
        text: `Benang terputus! "${ev.title}" tidak berkaitan dengan "${pillar.name}". Periksa kembali ciri kebahasaannya.`,
        type: 'error',
      });

      if (speakAksara) {
        speakAksara(
          `Bukan pilar itu pasangannya. Perhatikan kembali apakah ini soal verba perintah, waktu, takaran, atau cara.`,
          'BINGUNG'
        );
      }
    }
  };

  const handleResetConnection = (evId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playChime('click');
    const newMatches = { ...matches };
    delete newMatches[evId];
    setMatches(newMatches);
    onMatchesChange?.(newMatches);
    if (selectedEvidenceId === evId) setSelectedEvidenceId(null);
    setLastFeedback({
      text: 'Benang penyelidikan dilepas kembali ke papan.',
      type: 'neutral',
    });
  };

  const handleResetAll = () => {
    soundFX.playChime('click');
    setMatches({});
    onMatchesChange?.({});
    setSelectedEvidenceId(null);
    setActiveDossierId(null);
    setLastFeedback({
      text: 'Seluruh benang penyelidikan telah direset.',
      type: 'neutral',
    });
  };

  // Currently inspected item for Dossier view
  const currentDossierItem = useMemo(() => {
    const targetId = activeDossierId || (matchedCount > 0 ? Object.keys(matches)[0] : EVIDENCE_LIST[0].id);
    return EVIDENCE_LIST.find((e) => e.id === targetId) || EVIDENCE_LIST[0];
  }, [activeDossierId, matches, matchedCount]);

  const currentDossierPillar = useMemo(() => {
    return PILLARS.find((p) => p.id === currentDossierItem.expectedPillar) || PILLARS[0];
  }, [currentDossierItem]);

  return (
    <div
      id="fantasy-evidence-board-container"
      className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans"
      style={{
        background: 'radial-gradient(ellipse at 50% 30%, #1c0f0a 0%, #130a07 60%, #0a0403 100%)',
      }}
    >
      {/* WOOD TABLE GRAIN TEXTURE OVERLAY */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 38px, rgba(0,0,0,0.4) 39px, rgba(255,200,100,0.05) 40px)`,
        }}
      />

      {/* OVERHEAD LANTERN / CELESTIAL GLOW */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_15%,rgba(212,175,55,0.18)_0%,rgba(0,242,254,0.08)_35%,transparent_70%)]" />

      {/* BRASS CORNER BRACKETS */}
      <div className="absolute top-2 left-2 pointer-events-none z-20">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M0 0 H42 V10 H10 V42 H0 Z" fill="url(#brass-corner-grad)" />
          <circle cx="6" cy="6" r="2" fill="#3D2808" />
          <defs>
            <linearGradient id="brass-corner-grad" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F5D061" />
              <stop offset="50%" stopColor="#C8963E" />
              <stop offset="100%" stopColor="#875E1E" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute top-2 right-2 pointer-events-none z-20 rotate-90">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M0 0 H42 V10 H10 V42 H0 Z" fill="url(#brass-corner-grad)" />
          <circle cx="6" cy="6" r="2" fill="#3D2808" />
        </svg>
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none z-20 -rotate-90">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M0 0 H42 V10 H10 V42 H0 Z" fill="url(#brass-corner-grad)" />
          <circle cx="6" cy="6" r="2" fill="#3D2808" />
        </svg>
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none z-20 rotate-180">
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
          <path d="M0 0 H42 V10 H10 V42 H0 Z" fill="url(#brass-corner-grad)" />
          <circle cx="6" cy="6" r="2" fill="#3D2808" />
        </svg>
      </div>

      {/* TOP DESK HEADER HUD */}
      <div className="relative z-20 px-3 sm:px-6 pt-3 pb-2 flex items-center justify-between border-b border-[#D4AF37]/30 bg-[#0E0604]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] via-[#996515] to-[#422606] p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-[#1A0D08] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#FFE082]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-[#00F2FE] uppercase font-bold px-1.5 py-0.5 rounded bg-[#00F2FE]/10 border border-[#00F2FE]/30">
                FORENSIC DETECTIVE DESK
              </span>
              <span className="text-[10px] font-mono text-[#D4AF37] font-semibold hidden sm:inline">
                // AKADEMI PROSEDURIA
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-wide font-['Cinzel'] flex items-center gap-2">
              <span>Papan Bukti Kausalitas Prosedur</span>
            </h1>
          </div>
        </div>

        {/* CONTROLS & PROGRESS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Progress Tracker Pill */}
          <div className="px-3 py-1.5 rounded-full bg-[#180C08] border border-[#D4AF37]/40 flex items-center gap-2 shadow-inner">
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    idx < matchedCount
                      ? 'bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]'
                      : 'bg-stone-700 border border-stone-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-[#FFE082]">
              {matchedCount}/4 Terpasang
            </span>
          </div>

          {/* Mode Switcher: Board vs Dossier */}
          <div className="flex items-center bg-[#130906] p-1 rounded-xl border border-white/10 text-xs">
            <button
              id="view-mode-board-btn"
              onClick={() => {
                soundFX.playChime('click');
                setViewMode('BOARD');
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'BOARD'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Meja Investigasi</span>
            </button>
            <button
              id="view-mode-dossier-btn"
              onClick={() => {
                soundFX.playChime('click');
                setViewMode('DOSSIER');
              }}
              className={`px-2.5 py-1 rounded-lg font-mono text-xs transition-all flex items-center gap-1.5 ${
                viewMode === 'DOSSIER'
                  ? 'bg-gradient-to-r from-[#00F2FE] to-[#0284C7] text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dossier Kausalitas</span>
            </button>
          </div>

          {/* Reset button */}
          {matchedCount > 0 && (
            <button
              id="reset-evidence-btn"
              onClick={handleResetAll}
              title="Reset seluruh benang"
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/5 border border-transparent hover:border-amber-500/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* DETECTIVE FEEDBACK BANNER */}
      <div className="relative z-10 px-4 py-1.5 bg-[#170B08]/90 border-b border-amber-900/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 max-w-3xl overflow-hidden">
          <Sparkles
            className={`w-4 h-4 shrink-0 ${
              lastFeedback.type === 'success'
                ? 'text-[#00F2FE] animate-pulse'
                : lastFeedback.type === 'error'
                ? 'text-rose-400'
                : 'text-[#D4AF37]'
            }`}
          />
          <p
            className={`truncate font-medium ${
              lastFeedback.type === 'success'
                ? 'text-cyan-200'
                : lastFeedback.type === 'error'
                ? 'text-rose-300'
                : 'text-amber-200/90'
            }`}
          >
            {lastFeedback.text}
          </p>
        </div>

        {selectedEvidenceId && (
          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-300 animate-pulse hidden sm:inline">
              [BENANG AKTIF: KLIK PILAR TUJUAN]
            </span>
            <button
              onClick={() => setSelectedEvidenceId(null)}
              className="text-[10px] font-mono text-slate-400 hover:text-white underline"
            >
              Batalkan
            </button>
          </div>
        )}
      </div>

      {/* MAIN DETECTIVE SURFACE */}
      <div className="relative z-10 flex-1 overflow-y-auto p-3 sm:p-5 flex flex-col justify-center">
        {viewMode === 'BOARD' ? (
          /* =========================================================================
             VIEW 1: THE FANTASY INVESTIGATION DESK & CONNECTING CORDS
             ========================================================================= */
          <div ref={deskRef} className="max-w-6xl mx-auto w-full relative">
            {/* 5-STAGE CAUSALITY PIPELINE OVERVIEW (MASTER PROMPT SPEC) */}
            <div className="mb-3 p-2 sm:p-2.5 rounded-xl bg-[#0E0705]/90 border border-[#D4AF37]/30 shadow-md">
              <div className="flex items-center justify-between gap-2 overflow-x-auto text-[10px] font-mono font-bold uppercase tracking-wider py-0.5">
                <span className="text-[#FFE082] flex items-center gap-1 shrink-0">
                  <Layers className="w-3.5 h-3.5 text-[#00F2FE]" />
                  <span>RANTAI LOGIKA:</span>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/50 text-rose-200 shrink-0">
                  1. BUKTI
                </span>
                <span className="text-amber-400 font-bold shrink-0">➔</span>
                <span className="px-2.5 py-1 rounded-lg bg-cyan-950/70 border border-cyan-500/50 text-cyan-200 shrink-0">
                  2. HUBUNGAN
                </span>
                <span className="text-amber-400 font-bold shrink-0">➔</span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-500/50 text-amber-200 shrink-0">
                  3. AKIBAT
                </span>
                <span className="text-amber-400 font-bold shrink-0">➔</span>
                <span className="px-2.5 py-1 rounded-lg bg-purple-950/70 border border-purple-500/50 text-purple-200 shrink-0">
                  4. KESIMPULAN
                </span>
                <span className="text-amber-400 font-bold shrink-0">➔</span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 shrink-0">
                  5. TINDAKAN
                </span>
              </div>
            </div>

            {/* SVG DYNAMIC STRING CANVAS OVERLAY */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible hidden md:block"
              style={{ minHeight: '440px' }}
            >
              <defs>
                <filter id="string-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="string-glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Render dynamic glowing strings for each matched pair */}
              {EVIDENCE_LIST.map((ev, evIdx) => {
                const matchedPillarId = matches[ev.id];
                if (!matchedPillarId) return null;
                const pillarIdx = PILLARS.findIndex((p) => p.id === matchedPillarId);
                if (pillarIdx === -1) return null;

                const start = pinCoords[`ev_${ev.id}`] || { x: 460, y: 110 + evIdx * 110 };
                const end = pinCoords[`pillar_${matchedPillarId}`] || { x: 620, y: 110 + pillarIdx * 110 };

                const midX = (start.x + end.x) / 2;
                const sag = Math.max(15, Math.abs(end.x - start.x) * 0.08);
                const midY = (start.y + end.y) / 2 + sag;

                return (
                  <g key={`string-${ev.id}-${matchedPillarId}`} className="transition-all duration-500">
                    {/* Ambient Glow String */}
                    <path
                      d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                      fill="none"
                      stroke={ev.pinColor}
                      strokeWidth="6"
                      strokeOpacity="0.45"
                      filter="url(#string-glow-cyan)"
                    />
                    {/* Core Gold Luminous String */}
                    <path
                      d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                      fill="none"
                      stroke="#FFE082"
                      strokeWidth="2.5"
                    />
                    {/* Animated Energy Flow Pulses */}
                    <path
                      d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                      fill="none"
                      stroke="#00F2FE"
                      strokeWidth="3"
                      strokeDasharray="8 10"
                      className="animate-pulse"
                    />
                  </g>
                );
              })}
            </svg>

            {/* 2-COLUMN DETECTIVE LAYOUT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 items-stretch">
              {/* ============================================================= */}
              {/* LEFT COLUMN: 4 PARCHMENT EVIDENCE CARDS (BUKTI)                */}
              {/* ============================================================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#EF4444]" />
                    <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-[#FFE082]">
                      KARTU TEMUAN FORENSIK (BUKTI)
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Klik kartu untuk menarik benang
                  </span>
                </div>

                <div className="space-y-3">
                  {EVIDENCE_LIST.map((ev) => {
                    const isMatched = !!matches[ev.id];
                    const isSelected = selectedEvidenceId === ev.id;
                    const matchedPillar = PILLARS.find((p) => p.id === matches[ev.id]);

                    return (
                      <div
                        key={ev.id}
                        id={`evidence-card-${ev.id}`}
                        onClick={() => handleSelectEvidence(ev.id)}
                        style={{
                          transform: `rotate(${ev.tiltDeg}deg)`,
                        }}
                        className={`relative rounded-xl p-3.5 sm:p-4 transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'scale-[1.03] z-30 ring-2 ring-[#00F2FE] shadow-[0_15px_30px_rgba(0,242,254,0.35)]'
                            : isMatched
                            ? 'shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:scale-[1.01]'
                            : 'shadow-[0_6px_15px_rgba(0,0,0,0.5)] hover:scale-[1.015] hover:shadow-[0_10px_25px_rgba(212,175,55,0.2)]'
                        }`}
                      >
                        {/* PARCHMENT TEXTURED BACKGROUND */}
                        <div
                          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
                          style={{
                            background: isSelected
                              ? 'linear-gradient(135deg, #FFF9EB 0%, #F5E8C7 100%)'
                              : isMatched
                              ? 'linear-gradient(135deg, #F5EEDC 0%, #E8DCC0 100%)'
                              : 'linear-gradient(135deg, #FAF4E5 0%, #EFE1C5 100%)',
                            border: isSelected
                              ? '2px solid #00F2FE'
                              : isMatched
                              ? '1.5px solid #10B981'
                              : '1.5px solid #C8A97E',
                          }}
                        >
                          {/* Aged paper vignette overlay */}
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_60%,rgba(140,90,40,0.18)_100%)]" />
                        </div>

                        {/* 3D REALISTIC BRASS PIN WITH JEWELED HEAD */}
                        <div id={`pin-ev-${ev.id}`} className="absolute -top-2.5 right-6 z-20 flex flex-col items-center">
                          <div
                            className="w-4 h-4 rounded-full shadow-[0_3px_6px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform hover:scale-125"
                            style={{
                              backgroundColor: ev.pinColor,
                              boxShadow: isSelected
                                ? `0 0 12px ${ev.pinColor}, 0 2px 5px rgba(0,0,0,0.8)`
                                : isMatched
                                ? `0 0 8px #10B981`
                                : `0 2px 4px rgba(0,0,0,0.6)`,
                              border: '1.5px solid #FFE082',
                            }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                          </div>
                          {/* Pin Needle Base Shadow */}
                          <div className="w-1 h-1 bg-black/40 rounded-full mt-0.5" />
                        </div>

                        {/* CARD CONTENT */}
                        <div className="relative z-10">
                          {/* Code & Anomaly Tag */}
                          <div className="flex items-center justify-between text-[9px] font-mono font-bold tracking-wider mb-1 text-[#8C6D23]">
                            <span>{ev.code}</span>
                            <span className="px-1.5 py-0.2 rounded bg-red-950/15 text-rose-800 border border-rose-800/20">
                              {ev.category}
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            {/* Object SVG Thumbnail */}
                            <div className="w-12 h-12 rounded-lg bg-[#2A1D13] p-1.5 border border-[#8C6D23]/40 shrink-0 shadow-inner flex items-center justify-center">
                              {ev.id === 'ev_spoon' && (
                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                  {/* Coaster */}
                                  <ellipse cx="18" cy="28" rx="14" ry="4" fill="#3D2918" />
                                  {/* Silver Spoon Idle */}
                                  <path
                                    d="M 6 30 L 22 14 Q 28 8 28 4 Q 26 2 22 6 L 8 28 Z"
                                    fill="url(#silver-grad)"
                                  />
                                  <ellipse cx="25" cy="5" rx="4" ry="3" fill="#E2E8F0" />
                                  <defs>
                                    <linearGradient id="silver-grad" x1="0" y1="0" x2="1" y2="1">
                                      <stop offset="0%" stopColor="#FFFFFF" />
                                      <stop offset="50%" stopColor="#94A3B8" />
                                      <stop offset="100%" stopColor="#475569" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                              )}
                              {ev.id === 'ev_scroll' && (
                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                  {/* Ancient Scroll with glowing purple glitch */}
                                  <rect x="6" y="8" width="24" height="20" rx="3" fill="#EADBC8" />
                                  <path d="M 4 8 Q 18 10 32 8 L 32 6 Q 18 8 4 6 Z" fill="#8C6D23" />
                                  <path d="M 4 28 Q 18 30 32 28 L 32 26 Q 18 28 4 26 Z" fill="#8C6D23" />
                                  <line x1="9" y1="13" x2="27" y2="13" stroke="#A855F7" strokeWidth="2" strokeDasharray="3 2" />
                                  <line x1="9" y1="18" x2="23" y2="18" stroke="#EF4444" strokeWidth="2" />
                                  <line x1="9" y1="23" x2="25" y2="23" stroke="#A855F7" strokeWidth="2" />
                                </svg>
                              )}
                              {ev.id === 'ev_spill' && (
                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                  {/* Cup Overflowing with boiling water puddle */}
                                  <ellipse cx="18" cy="30" rx="15" ry="4" fill="#0284C7" fillOpacity="0.7" />
                                  <path d="M 10 12 L 12 28 Q 18 30 24 28 L 26 12 Z" fill="#F8FAFC" />
                                  <ellipse cx="18" cy="12" rx="8" ry="2.5" fill="#38BDF8" />
                                  <path d="M 25 13 Q 28 20 23 29" stroke="#38BDF8" strokeWidth="2" fill="none" />
                                  <path d="M 14 6 Q 13 3 15 0" stroke="#E2E8F0" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
                                  <path d="M 18 6 Q 19 3 17 0" stroke="#E2E8F0" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
                                </svg>
                              )}
                              {ev.id === 'ev_clump' && (
                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                  {/* Cup with floating chocolate clump */}
                                  <ellipse cx="18" cy="12" rx="11" ry="4" fill="#38BDF8" />
                                  <path d="M 7 12 L 9 26 Q 18 28 27 26 L 29 12 Z" fill="#F1F5F9" />
                                  <ellipse cx="18" cy="12" rx="7" ry="2.5" fill="#5C2D12" />
                                  {/* Dry cocoa clump */}
                                  <circle cx="16" cy="11.5" r="3.5" fill="#3E1C08" />
                                  <circle cx="20" cy="12" r="2.5" fill="#451A03" />
                                  <circle cx="18" cy="10.5" r="1.5" fill="#78350F" />
                                </svg>
                              )}
                            </div>

                            {/* Title & Anomaly Snippet */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs sm:text-sm font-bold text-[#2A180E] font-['Cinzel'] leading-tight">
                                {ev.title}
                              </h3>
                              <p className="text-[10px] font-mono text-stone-600 mt-1 italic line-clamp-1">
                                {ev.anomalyQuote}
                              </p>
                            </div>
                          </div>

                          {/* Handwritten Detective Field Note */}
                          <div className="mt-2 pt-2 border-t border-[#8C6D23]/25 bg-[#8C6D23]/5 p-1.5 rounded">
                            <div className="flex items-center gap-1 text-[9px] font-mono text-[#8C6D23] font-bold uppercase">
                              <Bookmark className="w-2.5 h-2.5" />
                              <span>Catatan Lapangan:</span>
                            </div>
                            <p className="text-[10.5px] text-[#801717] font-serif italic leading-relaxed mt-0.5">
                              "{ev.handwrittenNote}"
                            </p>
                          </div>

                          {/* Connection Status Footer */}
                          <div className="mt-2 flex items-center justify-between pt-1 border-t border-dashed border-[#8C6D23]/20">
                            {isMatched ? (
                              <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] font-mono font-bold text-emerald-800 flex items-center gap-1">
                                  <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                                  <span>Terhubung ke {matchedPillar?.name}</span>
                                </span>
                                <button
                                  onClick={(e) => handleResetConnection(ev.id, e)}
                                  className="text-[9px] font-mono text-rose-700 hover:text-rose-900 underline"
                                >
                                  Lepas Benang
                                </button>
                              </div>
                            ) : isSelected ? (
                              <span className="text-[10px] font-mono text-cyan-800 font-bold animate-pulse flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-cyan-700" />
                                <span>Benang Aktif — Klik Pilar Tujuan di Sebelah Kanan!</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono text-stone-500 flex items-center gap-1">
                                <Search className="w-2.5 h-2.5" />
                                <span>Klik untuk menarik benang kausalitas</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ============================================================= */}
              {/* RIGHT COLUMN: 4 RUNIC PILLARS OF PROCEDURE (HUBUNGAN)          */}
              {/* ============================================================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
                    <h2 className="text-xs font-mono uppercase font-bold tracking-wider text-[#00F2FE]">
                      4 PILAR KAIDAH TEKS PROSEDUR (HUBUNGAN)
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Kaitkan benang pada pilar yang sesuai
                  </span>
                </div>

                <div className="space-y-3">
                  {PILLARS.map((pillar) => {
                    const matchedEvId = Object.keys(matches).find((k) => matches[k] === pillar.id);
                    const matchedEv = EVIDENCE_LIST.find((e) => e.id === matchedEvId);
                    const isCandidate = selectedEvidenceId !== null;

                    return (
                      <div
                        key={pillar.id}
                        id={`pillar-node-${pillar.id}`}
                        onClick={() => handleSelectPillar(pillar.id)}
                        className={`relative rounded-xl p-3.5 sm:p-4 transition-all duration-300 cursor-pointer ${
                          matchedEvId
                            ? 'bg-gradient-to-r from-[#0C2238] to-[#08182B] border-2 border-emerald-400/80 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                            : isCandidate
                            ? 'bg-gradient-to-r from-[#18110D] to-[#1F140F] border-2 border-dashed border-[#FFE082] hover:border-[#00F2FE] shadow-[0_0_15px_rgba(255,224,130,0.25)] hover:scale-[1.015]'
                            : 'bg-[#120B08]/90 border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 shadow-lg'
                        }`}
                      >
                        {/* Brass Pin Anchor Point */}
                        <div id={`pin-pillar-${pillar.id}`} className="absolute -top-2.5 left-6 z-20 flex flex-col items-center">
                          <div
                            className="w-4 h-4 rounded-full shadow-[0_2px_5px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all"
                            style={{
                              backgroundColor: matchedEvId ? '#10B981' : pillar.color,
                              border: '1.5px solid #FFE082',
                              boxShadow: matchedEvId
                                ? '0 0 10px #10B981'
                                : isCandidate
                                ? '0 0 8px #FFE082'
                                : 'none',
                            }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                          </div>
                          <div className="w-1 h-1 bg-black/40 rounded-full mt-0.5" />
                        </div>

                        {/* CONTENT */}
                        <div className="flex items-start gap-3">
                          {/* Procedural Symbol Glyph */}
                          <div
                            className="w-12 h-12 rounded-xl p-1.5 shrink-0 flex items-center justify-center border shadow-inner"
                            style={{
                              backgroundColor: matchedEvId ? '#064E3B' : '#1F130E',
                              borderColor: matchedEvId ? '#10B981' : pillar.color,
                            }}
                          >
                            {pillar.id === 'p_imperatif' && (
                              <Zap className="w-6 h-6 text-rose-400" />
                            )}
                            {pillar.id === 'p_konjungsi' && (
                              <Clock className="w-6 h-6 text-cyan-400" />
                            )}
                            {pillar.id === 'p_takaran' && (
                              <Scale className="w-6 h-6 text-amber-400" />
                            )}
                            {pillar.id === 'p_adverbia' && (
                              <Target className="w-6 h-6 text-emerald-400" />
                            )}
                          </div>

                          {/* Pillar Header */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span
                                className="text-[9px] font-mono uppercase tracking-widest font-bold"
                                style={{ color: pillar.color }}
                              >
                                {pillar.code} // {pillar.runeName}
                              </span>
                              {matchedEvId && (
                                <span className="text-[9px] font-mono text-emerald-300 font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40">
                                  TERKONEKSI BENANG EMAS
                                </span>
                              )}
                            </div>

                            <h3 className="text-xs sm:text-sm font-bold text-white font-['Cinzel'] leading-tight mt-0.5">
                              {pillar.name}
                            </h3>
                            <p className="text-[10px] font-mono text-slate-400 mt-1">
                              {pillar.shortRule}
                            </p>
                          </div>
                        </div>

                        {/* Matched Preview or Action Prompt */}
                        <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
                          {matchedEv ? (
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-1.5 text-emerald-300">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="truncate font-semibold font-mono">
                                  Terkait: {matchedEv.title}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDossierId(matchedEv.id);
                                  setViewMode('DOSSIER');
                                }}
                                className="text-[9px] font-mono text-[#00F2FE] hover:underline flex items-center gap-1"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Buka Rantai</span>
                              </button>
                            </div>
                          ) : isCandidate ? (
                            <span className="text-amber-300 font-mono font-bold animate-pulse flex items-center gap-1">
                              <span>➔ Klik untuk mengunci simpul benang di pilar ini</span>
                            </span>
                          ) : (
                            <span className="text-stone-500 font-mono text-[9.5px]">
                              Menunggu koneksi dari kartu bukti forensik
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* =========================================================================
             VIEW 2: THE 5-STAGE CAUSALITY DOSSIER (BUKTI → HUBUNGAN → AKIBAT → KESIMPULAN → TINDAKAN)
             ========================================================================= */
          <div className="max-w-5xl mx-auto w-full space-y-4">
            {/* Dossier Item Selector Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {EVIDENCE_LIST.map((ev) => {
                const isItemMatched = !!matches[ev.id];
                const isCurrent = currentDossierItem.id === ev.id;
                return (
                  <button
                    key={ev.id}
                    onClick={() => {
                      soundFX.playChime('click');
                      setActiveDossierId(ev.id);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-2 border ${
                      isCurrent
                        ? 'bg-[#1E110A] text-[#FFE082] border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                        : isItemMatched
                        ? 'bg-[#0E1B24] text-emerald-300 border-emerald-600/40 hover:bg-[#122432]'
                        : 'bg-[#140A07] text-stone-400 border-white/10 hover:bg-[#1C0E0A]'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: ev.pinColor }}
                    />
                    <span className="truncate max-w-[140px] sm:max-w-none">{ev.title}</span>
                    {isItemMatched && <Check className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {/* THE UNBROKEN 5-STAGE CHAIN CONTAINER */}
            <div className="rounded-2xl p-4 sm:p-6 bg-[#140A07] border-2 border-[#D4AF37]/50 shadow-2xl relative">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#D4AF37]/30 gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[#00F2FE] uppercase font-bold tracking-widest">
                    RANTAI KAUSALITAS FORENSIK // {currentDossierItem.code}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white font-['Cinzel']">
                    {currentDossierItem.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-300 px-2.5 py-1 rounded-lg bg-black/40 border border-amber-500/30">
                    Status: {matches[currentDossierItem.id] ? '✓ Terverifikasi' : 'Belum Ditautkan'}
                  </span>
                </div>
              </div>

              {/* 5-STEP HORIZONTAL / STACKED PIPELINE */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 relative">
                {/* 1. BUKTI */}
                <div className="rounded-xl p-3 bg-[#1C0E0A] border border-red-500/40 space-y-2 relative">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-rose-400">
                    <span>1. BUKTI FISIK</span>
                    <Search className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {currentDossierItem.title}
                  </div>
                  <p className="text-[10.5px] text-stone-400 leading-relaxed font-mono">
                    {currentDossierItem.anomalyQuote}
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[10px] text-amber-300/90 italic font-serif">
                    "{currentDossierItem.handwrittenNote}"
                  </div>
                </div>

                {/* 2. HUBUNGAN */}
                <div className="rounded-xl p-3 bg-[#0B1E30] border border-cyan-500/40 space-y-2 relative">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-cyan-300">
                    <span>2. HUBUNGAN KAIDAH</span>
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-[#FFE082] leading-tight">
                    {currentDossierPillar.name}
                  </div>
                  <p className="text-[10.5px] text-cyan-200/80 leading-relaxed font-mono">
                    {currentDossierPillar.shortRule}
                  </p>
                  <div className="pt-2 border-t border-white/10 text-[10px] text-cyan-300/80 font-mono">
                    Kaidah: Prosedur wajib mematuhi pilar kebahasaan ini agar dapat dieksekusi dengan benar.
                  </div>
                </div>

                {/* 3. AKIBAT */}
                <div className="rounded-xl p-3 bg-[#240D12] border border-amber-500/40 space-y-2 relative">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-400">
                    <span>3. AKIBAT DI TKP</span>
                    <Target className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    Kegagalan Reaksi Mekanik/Termal
                  </div>
                  <p className="text-[10.5px] text-amber-200/90 leading-relaxed">
                    {currentDossierItem.consequence}
                  </p>
                </div>

                {/* 4. KESIMPULAN */}
                <div className="rounded-xl p-3 bg-[#1C142E] border border-purple-500/40 space-y-2 relative">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-purple-300">
                    <span>4. KESIMPULAN AKAR</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-white leading-tight">
                    Cacat Struktural Teks
                  </div>
                  <p className="text-[10.5px] text-purple-200/90 leading-relaxed">
                    {currentDossierItem.conclusion}
                  </p>
                </div>

                {/* 5. TINDAKAN */}
                <div className="rounded-xl p-3 bg-[#082218] border border-emerald-500/40 space-y-2 relative">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-emerald-300">
                    <span>5. TINDAKAN PERBAIKAN</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xs font-bold text-emerald-200 leading-tight">
                    Solusi Rekonstruksi (REPAIR)
                  </div>
                  <p className="text-[10.5px] text-emerald-300 leading-relaxed font-semibold">
                    {currentDossierItem.action}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Switcher */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  onClick={() => setViewMode('BOARD')}
                  className="text-slate-400 hover:text-white font-mono flex items-center gap-1.5"
                >
                  <span>➔ Kembali ke Tampilan Meja Investigasi</span>
                </button>

                {!matches[currentDossierItem.id] && (
                  <button
                    onClick={() => {
                      setSelectedEvidenceId(currentDossierItem.id);
                      setViewMode('BOARD');
                    }}
                    className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 font-bold font-mono text-xs"
                  >
                    Tautkan Benang Ini Sekarang
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="relative z-20 px-4 py-3 bg-[#0B0503]/90 border-t border-[#D4AF37]/30 flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
          >
            <span>Kembali ke TKP</span>
          </button>
        ) : (
          <div className="text-[11px] font-mono text-stone-400">
            {matchedCount < 4
              ? `Tersisa ${4 - matchedCount} benang kausalitas untuk dirangkai`
              : 'Semua benang kausalitas terpasang sempurna!'}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            id="evidence-board-complete-btn"
            disabled={!isAllConnected}
            onClick={() => {
              soundFX.playChime('victory');
              onComplete();
            }}
            className={`px-6 py-2.5 rounded-xl font-['Cinzel'] font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 transition-all ${
              isAllConnected
                ? 'bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#D4AF37] text-slate-950 shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:brightness-110 hover:scale-[1.02] cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <span>Sintesis Selesai: Menuju Diagnosis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
