/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundFX } from '../../utils/audioEffects';
import { aksaraVoice } from '../../utils/aksaraVoice';
import { AksaraBustVisual } from '../character/AksaraBustVisual';
import { AksaraExpressionType } from '../character/AksaraCharacterVisual';
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  BookOpen,
  Eye,
  Check,
  Volume2,
  HelpCircle,
  FileText,
  Layers,
  ChevronRight,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import { FantasyEvidenceBoard } from '../investigation/FantasyEvidenceBoard';
import { MagicalProcedureEngine } from '../repair/MagicalProcedureEngine';

export type M01Phase =
  | 'MISSION_INTRO'
  | 'EXPLORATION'
  | 'PREPARATION'
  | 'PRACTICE'
  | 'CONSEQUENCE'
  | 'INVESTIGATION'
  | 'EVIDENCE'
  | 'DIAGNOSIS'
  | 'REPAIR'
  | 'RETEST'
  | 'REFLECTION'
  | 'COMPLETE';

interface PracticeRoomM01Props {
  onBackToMap: () => void;
  onMissionComplete?: () => void;
}

// 5 Procedure Objects
export type ProcedureObjectId = 'cangkir' | 'sendok' | 'bubuk_cokelat' | 'gula' | 'air_panas';

export interface ProcedureObject {
  id: ProcedureObjectId;
  name: string;
  category: 'Wadah' | 'Alat' | 'Bahan Padat' | 'Bahan Cair';
  desc: string;
  detailHint: string;
  icon: string;
}

const OBJECTS: Record<ProcedureObjectId, ProcedureObject> = {
  cangkir: {
    id: 'cangkir',
    name: 'Cangkir Keramik',
    category: 'Wadah',
    desc: 'Cangkir keramik tebal berinsulasi hangat dengan kapasitas 180 ml.',
    detailHint: 'Wadah utama tempat semua bahan akan diproses dan dilarutkan.',
    icon: '☕',
  },
  sendok: {
    id: 'sendok',
    name: 'Sendok Pengaduk',
    category: 'Alat',
    desc: 'Sendok teh perak berukir aksara Nusantara, dirancang untuk melarutkan zat padat.',
    detailHint: 'Alat mekanis esensial untuk memicu verba aksi "Aduklah" agar cairan tidak menggumpal.',
    icon: '🥄',
  },
  bubuk_cokelat: {
    id: 'bubuk_cokelat',
    name: 'Bubuk Cokelat Murni',
    category: 'Bahan Padat',
    desc: '2 sendok makan bubuk cokelat murni beraroma pekat tanpa pemanis tambahan.',
    detailHint: 'Bersifat hidrofobik ringan jika dituangkan di atas air banyak tanpa diaduk (mudah menggumpal).',
    icon: '🍫',
  },
  gula: {
    id: 'gula',
    name: 'Gula Pasir',
    category: 'Bahan Padat',
    desc: '1 sendok makan gula pasir kristal putih sebagai penyeimbang rasa pahit cokelat.',
    detailHint: 'Larut sempurna bersama bubuk cokelat bila diaduk bersama sedikit air panas.',
    icon: '🧂',
  },
  air_panas: {
    id: 'air_panas',
    name: 'Teko Air Panas (85°C)',
    category: 'Bahan Cair',
    desc: 'Teko tembaga dengan uap mengepul, bersuhu ideal 85°C untuk menyeduh minuman.',
    detailHint: 'Harus dituangkan bertahap (30 ml untuk pasta, 120 ml untuk volume akhir).',
    icon: '🫖',
  },
};

const PHASES_LIST: { id: M01Phase; title: string; stepNum: number }[] = [
  { id: 'MISSION_INTRO', title: 'Intro Misi', stepNum: 1 },
  { id: 'EXPLORATION', title: 'Eksplorasi', stepNum: 2 },
  { id: 'PREPARATION', title: 'Persiapan', stepNum: 3 },
  { id: 'PRACTICE', title: 'Praktik Cacat', stepNum: 4 },
  { id: 'CONSEQUENCE', title: 'Konsekuensi', stepNum: 5 },
  { id: 'INVESTIGATION', title: 'Investigasi', stepNum: 6 },
  { id: 'EVIDENCE', title: 'Papan Bukti', stepNum: 7 },
  { id: 'DIAGNOSIS', title: 'Diagnosis', stepNum: 8 },
  { id: 'REPAIR', title: 'Rekonstruksi', stepNum: 9 },
  { id: 'RETEST', title: 'Uji Kembali', stepNum: 10 },
  { id: 'REFLECTION', title: 'Refleksi & Pulih', stepNum: 11 },
  { id: 'COMPLETE', title: 'Selesai', stepNum: 12 },
];

export const PracticeRoomM01: React.FC<PracticeRoomM01Props> = ({
  onBackToMap,
  onMissionComplete,
}) => {
  // Current Phase
  const [phase, setPhase] = useState<M01Phase>('MISSION_INTRO');

  // Interactive Object State
  const [selectedObjectId, setSelectedObjectId] = useState<ProcedureObjectId | null>(null);
  const [cupPosition, setCupPosition] = useState<'shelf' | 'coaster'>('shelf');
  const [inspectedObjects, setInspectedObjects] = useState<Record<ProcedureObjectId, boolean>>({
    cangkir: false,
    sendok: false,
    bubuk_cokelat: false,
    gula: false,
    air_panas: false,
  });

  // Flawed Practice Execution State
  const [flawedStep, setFlawedStep] = useState<number>(0); // 0=start, 1=water_poured_full, 2=powder_dumped, 3=sugar_dumped, 4=done
  const [flawedErrorToast, setFlawedErrorToast] = useState<string | null>(null);

  // Investigation Clues Found
  const [investigatedHotspots, setInvestigatedHotspots] = useState<Record<string, boolean>>({
    clump: false,
    spill: false,
    spoon: false,
    scroll: false,
  });
  const [selectedHotspotDetail, setSelectedHotspotDetail] = useState<{
    title: string;
    description: string;
    pillar: string;
  } | null>(null);

  // Evidence Board State: matching evidence to pillars
  const [evidenceMatches, setEvidenceMatches] = useState<Record<string, string>>({});
  const [selectedEvidenceForPin, setSelectedEvidenceForPin] = useState<string | null>(null);

  // Diagnosis State
  const [selectedDiagnosisAnswers, setSelectedDiagnosisAnswers] = useState<number[]>([]);
  const [diagnosisConfirmed, setDiagnosisConfirmed] = useState<boolean>(false);

  // Repair State: reordering steps
  const INITIAL_REPAIR_STEPS = [
    {
      id: 'step_paste',
      order: 3,
      verb: 'Aduklah',
      conjunction: 'Setelah itu',
      text: 'campuran menggunakan sendok hingga menjadi pasta cokelat kental yang larut merata tanpa gumpalan.',
      adverbial: 'hingga larut merata tanpa gumpalan',
    },
    {
      id: 'step_dry',
      order: 1,
      verb: 'Masukkan',
      conjunction: 'Pertama-tama',
      text: '2 sendok makan bubuk cokelat dan 1 sendok makan gula ke dalam cangkir yang kering.',
      adverbial: '2 sdm bubuk, 1 sdm gula',
    },
    {
      id: 'step_water_full',
      order: 4,
      verb: 'Tuangkan',
      conjunction: 'Selanjutnya',
      text: 'sisa air panas (120 ml) secara perlahan ke dalam cangkir.',
      adverbial: '120 ml air panas',
    },
    {
      id: 'step_water_small',
      order: 2,
      verb: 'Tuangkan',
      conjunction: 'Kemudian',
      text: 'sedikit air panas (sekitar 30 ml) ke dasar cangkir.',
      adverbial: '30 ml air panas',
    },
    {
      id: 'step_final_stir',
      order: 5,
      verb: 'Aduklah',
      conjunction: 'Terakhir',
      text: 'kembali minuman secara perlahan hingga seluruh cairan tercampur sempurna dan siap disajikan.',
      adverbial: 'secara perlahan',
    },
  ];
  const [repairSteps, setRepairSteps] = useState(INITIAL_REPAIR_STEPS);
  const [repairVerified, setRepairVerified] = useState<boolean>(false);

  // Retest State
  const [retestStep, setRetestStep] = useState<number>(0);
  // 0: ready
  // 1: powder in cup
  // 2: sugar in cup
  // 3: 30ml water in cup
  // 4: stirred into paste
  // 5: 120ml water added (full)
  // 6: final stirred -> perfect!
  const [retestMessage, setRetestMessage] = useState<string>(
    'Pilihlah bubuk cokelat lalu masukkan ke dalam cangkir yang kering.'
  );

  // Aksara Dialogue & Expression
  const [aksaraSpeech, setAksaraSpeech] = useState<string>(
    'Selamat datang di Practice Room Akademi PROSEDURIA! Di sinilah kita menguji prosedur sebelum terjun ke kepulauan Nusantara.'
  );
  const [aksaraExpr, setAksaraExpr] = useState<AksaraExpressionType>('NORMAL');

  // Change Aksara text and voice
  const speakAksara = (text: string, expr: AksaraExpressionType = 'NORMAL') => {
    setAksaraSpeech(text);
    setAksaraExpr(expr);
    aksaraVoice.speak(text);
  };

  // Phase Entry Handlers
  const goToPhase = (newPhase: M01Phase) => {
    soundFX.playChime('click');
    setPhase(newPhase);

    switch (newPhase) {
      case 'MISSION_INTRO':
        speakAksara(
          'Selamat datang di Practice Room Akademi PROSEDURIA! Kompas Prosedurku mendeteksi anomali pada gulungan instruksi latihan. Mari kita mulai!',
          'NORMAL'
        );
        break;
      case 'EXPLORATION':
        speakAksara(
          'Sebelum menyentuh apa pun, amati meja kerjamu. Klik setiap objek untuk memeriksa sifat dan fungsinya.',
          'FOKUS'
        );
        break;
      case 'PREPARATION':
        speakAksara(
          'Pindahkan cangkir ke tatakan kerja, lalu baca gulungan prosedur anomali yang terpasang di meja.',
          'FOKUS'
        );
        break;
      case 'PRACTICE':
        speakAksara(
          'Sekarang ikuti langkah teks anomali: tuang air mendidih dulu hingga penuh, lalu masukkan bubuk dan gula!',
          'BINGUNG'
        );
        break;
      case 'CONSEQUENCE':
        soundFX.playChime('glitch');
        speakAksara(
          'Waduh! Airnya meluap dan bubuk cokelatnya menggumpal keras mengapung di atas air! Inilah akibat prosedur yang cacat!',
          'TERKEJUT'
        );
        break;
      case 'INVESTIGATION':
        speakAksara(
          'Mari kita investigasi Tempat Kejadian Anomali (TKP)! Periksa 4 titik masalah di meja kerja untuk mengumpulkan petunjuk.',
          'FOKUS'
        );
        break;
      case 'EVIDENCE':
        speakAksara(
          'Kaitkan setiap kartu bukti dengan 4 Pilar Teks Prosedur di Papan Bukti agar kita tahu letak kerusakan kaidahnya.',
          'FOKUS'
        );
        break;
      case 'DIAGNOSIS':
        speakAksara(
          'Berdasarkan bukti-bukti tadi, mari kita simpulkan akar masalahnya sebelum memperbaikinya.',
          'FOKUS'
        );
        break;
      case 'REPAIR':
        speakAksara(
          'Susun kembali langkah-langkah ke urutan kronologis yang benar! Perhatikan verba imperatif dan konjungsi waktunya.',
          'BERSEMANGAT'
        );
        break;
      case 'RETEST':
        speakAksara(
          'Sekarang uji kembali prosedur yang sudah kita perbaiki! Ikuti langkah kronologisnya dengan tanganmu sendiri.',
          'FOKUS'
        );
        break;
      case 'REFLECTION':
        soundFX.playChime('victory');
        speakAksara(
          'Luar biasa! Practice Room telah pulih seutuhnya! Cokelat hangatnya lembut sempurna tanpa gumpalan sama sekali.',
          'SENANG'
        );
        break;
      case 'COMPLETE':
        soundFX.playChime('victory');
        speakAksara(
          'Selamat, Penjelajah Logika! Kamu telah membuktikan betapa pentingnya verba imperatif, konjungsi kronologis, dan takaran presisi!',
          'SUKSES'
        );
        break;
    }
  };

  // Check exploration completion
  const exploredCount = Object.values(inspectedObjects).filter(Boolean).length;
  const allExplored = exploredCount === 5;

  // Object Inspection in Exploration
  const handleInspectObject = (id: ProcedureObjectId) => {
    soundFX.playChime('cyan');
    setSelectedObjectId(id);
    setInspectedObjects((prev) => ({ ...prev, [id]: true }));
    speakAksara(`${OBJECTS[id].name}: ${OBJECTS[id].desc}`, 'FOKUS');
  };

  // Flawed Practice Step Execution
  const handleFlawedInteraction = (actionObj: ProcedureObjectId) => {
    if (cupPosition !== 'coaster') {
      setFlawedErrorToast('Pindahkan cangkir ke tatakan tengah terlebih dahulu!');
      soundFX.playChime('error');
      return;
    }

    if (flawedStep === 0) {
      if (actionObj === 'air_panas') {
        soundFX.playChime('gold');
        setFlawedStep(1);
        setFlawedErrorToast(null);
        speakAksara(
          'Air panas 150 ml dituangkan ke dalam cangkir kosong hingga penuh sampai ke bibir cangkir sesuai teks anomali.',
          'FOKUS'
        );
      } else if (actionObj === 'sendok') {
        setFlawedErrorToast('Teks anomali tidak menginstruksikan penggunaan sendok!');
        soundFX.playChime('glitch');
      } else {
        setFlawedErrorToast('Teks anomali menyuruh menuang air panas terlebih dahulu!');
        soundFX.playChime('error');
      }
    } else if (flawedStep === 1) {
      if (actionObj === 'bubuk_cokelat') {
        soundFX.playChime('gold');
        setFlawedStep(2);
        setFlawedErrorToast(null);
        speakAksara(
          '2 sendok makan bubuk cokelat ditaburkan di atas air panas yang sudah penuh. Bubuk mengapung kaku!',
          'BINGUNG'
        );
      } else if (actionObj === 'sendok') {
        setFlawedErrorToast('Teks anomali tidak mencantumkan instruksi mengaduk!');
        soundFX.playChime('glitch');
      } else {
        setFlawedErrorToast('Langkah berikutnya menurut teks anomali adalah memasukkan bubuk cokelat!');
        soundFX.playChime('error');
      }
    } else if (flawedStep === 2) {
      if (actionObj === 'gula') {
        soundFX.playChime('gold');
        setFlawedStep(3);
        setFlawedErrorToast(null);
        speakAksara(
          'Gula pasir dimasukkan. Karena cangkir sudah penuh, air mulai meluap dan bubuk tetap mengapung!',
          'TERKEJUT'
        );
      } else {
        setFlawedErrorToast('Langkah berikutnya adalah memasukkan gula pasir!');
        soundFX.playChime('error');
      }
    }
  };

  // Hotspots in Investigation
  const handleInvestigateHotspot = (
    key: 'clump' | 'spill' | 'spoon' | 'scroll',
    title: string,
    description: string,
    pillar: string
  ) => {
    soundFX.playChime('cyan');
    setInvestigatedHotspots((prev) => ({ ...prev, [key]: true }));
    setSelectedHotspotDetail({ title, description, pillar });
    speakAksara(`Temuan: ${title}. ${description}`, 'FOKUS');
  };
  const investigatedCount = Object.values(investigatedHotspots).filter(Boolean).length;

  // Retest Step Execution
  const handleRetestInteraction = (actionObj: ProcedureObjectId) => {
    if (retestStep === 0) {
      if (actionObj === 'bubuk_cokelat') {
        soundFX.playChime('gold');
        setRetestStep(1);
        setRetestMessage('Langkah 1 selesai: 2 sdm bubuk cokelat masuk ke cangkir kering. Sekarang masukkan gula pasir!');
        speakAksara('Bagus! Bahan kering masuk terlebih dahulu ke cangkir yang kering.', 'SENANG');
      } else {
        soundFX.playChime('error');
        setRetestMessage('Salah urutan! Menurut prosedur baru, masukkan bubuk cokelat ke cangkir kering terlebih dahulu.');
      }
    } else if (retestStep === 1) {
      if (actionObj === 'gula') {
        soundFX.playChime('gold');
        setRetestStep(2);
        setRetestMessage('Langkah 2 selesai: Gula pasir tercampur dengan bubuk. Sekarang tuang sedikit air panas (30 ml)!');
        speakAksara('Tepat! Sekarang tuang sedikit air panas (30 ml) untuk melarutkan pasta.', 'FOKUS');
      } else {
        soundFX.playChime('error');
        setRetestMessage('Masukkan gula pasir terlebih dahulu agar menyatu dengan bubuk cokelat.');
      }
    } else if (retestStep === 2) {
      if (actionObj === 'air_panas') {
        soundFX.playChime('gold');
        setRetestStep(3);
        setRetestMessage('Langkah 3 selesai: 30 ml air panas membasahi bubuk. Sekarang AMBIL SENDOK DAN ADUK HINGGA MENJADI PASTA!');
        speakAksara('Hebat! Air sedikit membuat bubuk mudah terbasahi. Sekarang ambil sendok dan aduklah!', 'BERSEMANGAT');
      } else {
        soundFX.playChime('error');
        setRetestMessage('Tuangkan sedikit air panas (30 ml) terlebih dahulu!');
      }
    } else if (retestStep === 3) {
      if (actionObj === 'sendok') {
        soundFX.playChime('victory');
        setRetestStep(4);
        setRetestMessage('Langkah 4 selesai: Pasta cokelat kental terbentuk tanpa gumpalan! Sekarang tuangkan sisa air panas (120 ml).');
        speakAksara('Sempurna! Pasta cokelat halus terbentuk tanpa ada gumpalan kering! Sekarang tuangkan sisa air panas.', 'SUKSES');
      } else {
        soundFX.playChime('error');
        setRetestMessage('Gunakan sendok pengaduk untuk mengaduk pasta cokelat!');
      }
    } else if (retestStep === 4) {
      if (actionObj === 'air_panas') {
        soundFX.playChime('gold');
        setRetestStep(5);
        setRetestMessage('Langkah 5 selesai: Air panas memenuhi cangkir hingga 150 ml. Sekarang berikan adukan perlahan terakhir!');
        speakAksara('Volume air sudah pas 150 ml tanpa meluap. Aduk perlahan terakhir kali dengan sendok!', 'FOKUS');
      } else {
        soundFX.playChime('error');
        setRetestMessage('Tuang sisa air panas 120 ml ke dalam cangkir!');
      }
    } else if (retestStep === 5) {
      if (actionObj === 'sendok') {
        soundFX.playChime('victory');
        setRetestStep(6);
        setRetestMessage('UJI KEMBALI BERHASIL TOTAL! Cokelat hangat larut merata dan siap dinikmati!');
        speakAksara('Luar biasa! Minuman cokelat hangat larut merata dengan busa sutra harum! Practice Room mulai bereaksi!', 'SUKSES');
      }
    }
  };

  // Reordering steps helper in REPAIR
  const moveStep = (index: number, direction: 'up' | 'down') => {
    soundFX.playChime('click');
    const newSteps = [...repairSteps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSteps.length) return;
    const temp = newSteps[index];
    newSteps[index] = newSteps[targetIndex];
    newSteps[targetIndex] = temp;
    setRepairSteps(newSteps);

    // Check if sorted: order 1, 2, 3, 4, 5
    const isSorted = newSteps.every((s, i) => s.order === i + 1);
    if (isSorted) {
      soundFX.playChime('gold');
      setRepairVerified(true);
      speakAksara('Hebat! Urutan langkah dan konjungsi kronologis kini sudah sempurna!', 'SENANG');
    } else {
      setRepairVerified(false);
    }
  };

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden select-none transition-colors duration-700 font-sans ${
        phase === 'CONSEQUENCE' || phase === 'INVESTIGATION' || phase === 'EVIDENCE'
          ? 'bg-[#0E0608] state-salah'
          : phase === 'REFLECTION' || phase === 'COMPLETE'
          ? 'bg-[#04101E] state-pulih'
          : 'bg-[#061120]'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & 12-PHASE BREADCRUMB PROGRESS BAR                          */}
      {/* ========================================================================= */}
      <header className="relative z-30 px-4 py-2 bg-[#040C1A]/95 border-b border-[#D4AF37]/30 backdrop-blur-md flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              soundFX.playChime('click');
              onBackToMap();
            }}
            className="btn-touch px-3 py-1.5 rounded-xl bg-[#08182B] hover:bg-[#0E2847] border border-[#D4AF37]/50 text-[#FFE082] text-xs font-mono flex items-center gap-1.5 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Peta Dunia</span>
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold">
                M01: JEJAK YANG HILANG
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                Practice Room — Akademi PROSEDURIA
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-['Cinzel'] font-bold text-white tracking-wide">
              Protokol Minuman Cokelat Hangat Berenergi
            </h1>
          </div>
        </div>

        {/* Current Phase Badge & Step Indicator */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-mono text-slate-400">FASE GAMEPLAY</div>
            <div className="text-xs font-mono font-bold text-[#FFE082] uppercase">
              {PHASES_LIST.find((p) => p.id === phase)?.stepNum}/12: {PHASES_LIST.find((p) => p.id === phase)?.title}
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-[#08182B] border border-[#D4AF37]/60 flex items-center justify-center font-mono font-bold text-sm text-[#FFE082] shadow-inner">
            {PHASES_LIST.find((p) => p.id === phase)?.stepNum}
          </div>
        </div>
      </header>

      {/* Mini Breadcrumb Strip */}
      <div className="relative z-20 bg-[#02060F] border-b border-white/10 px-3 py-1 overflow-x-auto flex items-center gap-1 shrink-0 no-scrollbar">
        {PHASES_LIST.map((p, idx) => {
          const isCurrent = p.id === phase;
          const isPast = idx < PHASES_LIST.findIndex((x) => x.id === phase);

          return (
            <div
              key={p.id}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-[#D4AF37] text-slate-950 font-bold shadow-md'
                  : isPast
                  ? 'bg-[#0E2847] text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-500 bg-white/5'
              }`}
            >
              <span>{p.stepNum}.</span>
              <span>{p.title}</span>
              {isPast && <Check className="w-2.5 h-2.5 text-cyan-400" />}
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE / PRACTICE ROOM CHOSEN PHASE CONTENT                     */}
      {/* ========================================================================= */}
      <main className="relative flex-1 w-full overflow-y-auto p-3 sm:p-5 flex flex-col">
        {/* =================================================================== */}
        {/* PHASE 1: MISSION INTRO                                              */}
        {/* =================================================================== */}
        {phase === 'MISSION_INTRO' && (
          <div className="max-w-4xl mx-auto my-auto w-full p-5 sm:p-7 rounded-3xl bg-[#08172C]/95 border-2 border-[#D4AF37] shadow-2xl backdrop-blur-md animate-fadeIn flex flex-col md:flex-row items-center gap-6">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl bg-[#040C1A] border-2 border-cyan-400 overflow-hidden shrink-0 flex items-center justify-center shadow-lg relative">
              <AksaraBustVisual expression="MEMBERI_SEMANGAT" size={140} showCompassBadge={true} />
              <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-cyan-950/90 text-cyan-300 font-mono text-[9px] border border-cyan-500/50">
                Pemandu Logika
              </div>
            </div>

            <div className="flex-1 space-y-3.5">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#FFE082] animate-spin-slow" />
                <span className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider">
                  ORIENTASI TAHAP DASAR // FASE D KELAS IX
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-['Cinzel'] font-black text-white">
                Misi 01: Jejak yang Hilang di Practice Room
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Di ruang latihan Akademi PROSEDURIA, setiap Penjelajah Logika harus membuktikan kemampuan meramu dan memahami rantai sebab-akibat teks prosedur. Kita memiliki tugas sederhana: <strong>Menyeduh Cokelat Hangat Berenergi</strong>. Namun gulungan instruksi kuno di meja mengalami anomali teks yang berbahaya!
              </p>

              <div className="p-3 rounded-xl bg-black/40 border border-[#D4AF37]/30 text-xs font-mono text-amber-200 space-y-1">
                <div>🎯 <strong>Tujuan Misi:</strong> Buktikan dampak fisik teks prosedur yang salah, kumpulkan bukti di Evidence Board, diagnosis kelemahannya, rekonstruksi urutan baku, dan uji kembali hingga Practice Room pulih!</div>
                <div>☕ <strong>Objek Prosedur:</strong> Cangkir, Sendok, Bubuk Cokelat, Gula, Air Panas 85°C.</div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => goToPhase('EXPLORATION')}
                  className="btn-touch px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 font-['Cinzel'] font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:brightness-110 flex items-center gap-2"
                >
                  <span>Mulai Eksplorasi Meja Kerja</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => speakAksara(aksaraSpeech, aksaraExpr)}
                  className="btn-touch px-3 py-2 rounded-xl bg-[#0B2440] hover:bg-[#123359] border border-cyan-400/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Dengarkan Aksara</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 2: EXPLORATION (INTERACTIVE OBJECT INSPECTION)                */}
        {/* =================================================================== */}
        {phase === 'EXPLORATION' && (
          <div className="max-w-5xl mx-auto w-full space-y-4 my-auto animate-fadeIn">
            <div className="flex items-center justify-between bg-[#08172C]/90 p-3.5 rounded-2xl border border-[#D4AF37]/40 backdrop-blur-md">
              <div>
                <div className="text-xs font-mono text-cyan-300 uppercase font-bold">TAHAP 2 // EKSPLORASI INTERAKTIF</div>
                <div className="text-sm font-bold text-white">Amati 5 Objek Prosedur di Meja Kerja</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-300">Objek Diamati: </span>
                <span className={`text-sm font-mono font-bold ${allExplored ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {exploredCount}/5
                </span>
              </div>
            </div>

            {/* 5 Objects Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {(Object.keys(OBJECTS) as ProcedureObjectId[]).map((key) => {
                const item = OBJECTS[key];
                const isInspected = inspectedObjects[key];
                const isSelected = selectedObjectId === key;

                return (
                  <div
                    key={key}
                    onClick={() => handleInspectObject(key)}
                    className={`evidence-card p-3.5 flex flex-col items-center text-center cursor-pointer transition-all ${
                      isSelected ? 'evidence-card-active scale-105' : isInspected ? 'evidence-card-found' : ''
                    }`}
                  >
                    <div className="text-4xl mb-2 filter drop-shadow-md">{item.icon}</div>
                    <div className="text-xs font-bold text-white mb-0.5">{item.name}</div>
                    <div className="text-[10px] font-mono text-cyan-300 mb-2">{item.category}</div>
                    <div className="mt-auto w-full pt-1.5 border-t border-white/10 flex items-center justify-center gap-1 text-[9.5px] font-mono">
                      {isInspected ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Diamati
                        </span>
                      ) : (
                        <span className="text-slate-400 flex items-center gap-1">
                          <Search className="w-3 h-3" /> Klik Periksa
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Object Detail Panel */}
            {selectedObjectId && (
              <div className="p-4 rounded-2xl bg-[#040E1C] border border-[#D4AF37]/60 shadow-xl flex items-start gap-3 animate-fadeIn">
                <div className="text-3xl p-2 rounded-xl bg-black/40 border border-white/10">
                  {OBJECTS[selectedObjectId].icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">{OBJECTS[selectedObjectId].name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                      {OBJECTS[selectedObjectId].category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">{OBJECTS[selectedObjectId].desc}</p>
                  <p className="text-xs text-amber-200 mt-1 font-mono">💡 {OBJECTS[selectedObjectId].detailHint}</p>
                </div>
              </div>
            )}

            {/* Next Button */}
            <div className="flex justify-end pt-2">
              <button
                disabled={!allExplored}
                onClick={() => goToPhase('PREPARATION')}
                className={`btn-touch px-6 py-2.5 rounded-xl font-['Cinzel'] font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all ${
                  allExplored
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 shadow-[0_0_15px_#D4AF37] hover:brightness-110'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Lanjut ke Persiapan ({exploredCount}/5 Selesai)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 3: PREPARATION                                                */}
        {/* =================================================================== */}
        {phase === 'PREPARATION' && (
          <div className="max-w-4xl mx-auto w-full my-auto space-y-4 animate-fadeIn">
            <div className="bg-[#08172C]/90 p-3.5 rounded-2xl border border-[#D4AF37]/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-300 font-bold uppercase">TAHAP 3 // PERSIAPAN MEJA KERJA</div>
                <div className="text-sm font-bold text-white">Letakkan Cangkir & Pelajari Teks Anomali</div>
              </div>
              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400">
                Status: {cupPosition === 'coaster' ? 'Siap di Tatakan' : 'Cangkir di Rak'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Workstation Simulation Area */}
              <div className="p-5 rounded-2xl bg-[#040C1A] border border-cyan-500/40 flex flex-col items-center justify-center relative min-h-[220px]">
                <div className="text-xs font-mono text-slate-400 mb-3 uppercase tracking-wider">
                  Tatakan Meja Seduh Practice Room
                </div>

                {/* The Central Brewing Coaster */}
                <div
                  onClick={() => {
                    soundFX.playChime('cyan');
                    setCupPosition(cupPosition === 'shelf' ? 'coaster' : 'shelf');
                  }}
                  className={`w-36 h-36 rounded-full border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
                    cupPosition === 'coaster'
                      ? 'border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_25px_rgba(212,175,55,0.4)]'
                      : 'border-cyan-400/50 hover:border-cyan-300 bg-cyan-950/20 animate-pulse'
                  }`}
                >
                  {cupPosition === 'coaster' ? (
                    <div className="flex flex-col items-center">
                      <span className="text-5xl filter drop-shadow-lg">☕</span>
                      <span className="text-[10px] font-mono text-[#FFE082] mt-1 font-bold">Cangkir di Tatakan</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center p-2">
                      <span className="text-2xl mb-1 text-cyan-300">⬇️</span>
                      <span className="text-[10px] font-mono text-cyan-300">Klik di sini untuk menempatkan cangkir</span>
                    </div>
                  )}
                </div>

                {cupPosition === 'shelf' && (
                  <div
                    onClick={() => {
                      soundFX.playChime('cyan');
                      setCupPosition('coaster');
                    }}
                    className="mt-3 px-3 py-1 rounded-xl bg-[#0E2847] border border-cyan-400 text-cyan-200 text-xs font-mono cursor-pointer hover:bg-[#13355C]"
                  >
                    Ambil Cangkir dari Rak →
                  </div>
                )}
              </div>

              {/* The Glitched Protocol Scroll */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-600/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-amber-600/30 pb-2 mb-2">
                    <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      <span>PROTOKOL LATIHAN (VERSI ANOMALI)</span>
                    </span>
                    <span className="text-[9px] font-mono text-rose-400 px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800">
                      GLITCH TERDETEKSI
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono text-slate-200">
                    <div className="p-1.5 rounded bg-black/40 border border-rose-900/40 text-rose-200">
                      1. Tuangkan air mendidih 85°C ke dalam cangkir kosong hingga penuh (150 ml).
                    </div>
                    <div className="p-1.5 rounded bg-black/40 border border-rose-900/40 text-rose-200">
                      2. Masukkan 2 sendok makan bubuk cokelat di atas air panas yang sudah penuh.
                    </div>
                    <div className="p-1.5 rounded bg-black/40 border border-rose-900/40 text-rose-200">
                      3. Masukkan 1 sendok makan gula pasir.
                    </div>
                    <div className="p-1.5 rounded bg-black/40 border border-rose-900/40 text-rose-200">
                      4. Nikmati minuman langsung selagi hangat.
                    </div>
                  </div>

                  <div className="mt-3 text-[10.5px] text-amber-200 italic">
                    ⚠️ Perhatikan: Teks ini <strong>tidak menyebutkan sendok</strong>, tidak ada verba <strong>aduk</strong>, dan menyuruh menuang air panas penuh sebelum bahan padat!
                  </div>
                </div>

                <button
                  disabled={cupPosition !== 'coaster'}
                  onClick={() => goToPhase('PRACTICE')}
                  className={`btn-touch mt-4 w-full py-2.5 rounded-xl font-['Cinzel'] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 ${
                    cupPosition === 'coaster'
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 shadow-[0_0_15px_#D4AF37] hover:brightness-110'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>Mulai Praktikkan Teks Anomali Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 4: PRACTICE (HANDS-ON FLAWED EXECUTION)                      */}
        {/* =================================================================== */}
        {phase === 'PRACTICE' && (
          <div className="max-w-5xl mx-auto w-full my-auto space-y-4 animate-fadeIn">
            <div className="bg-[#08172C]/90 p-3.5 rounded-2xl border border-rose-500/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-rose-400 font-bold uppercase">TAHAP 4 // PRAKTIK PROSEDUR CACAT</div>
                <div className="text-sm font-bold text-white">Eksekusi Langkah Sesuai Teks Anomali</div>
              </div>
              <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-rose-950 text-rose-300 border border-rose-700 animate-pulse">
                Tahap Eksekusi: {flawedStep}/3
              </span>
            </div>

            {flawedErrorToast && (
              <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-mono flex items-center gap-2 animate-shake">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{flawedErrorToast}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Interactive Station (Left) */}
              <div className="lg:col-span-8 p-5 rounded-2xl bg-[#040C1A] border border-cyan-500/40 flex flex-col items-center justify-between relative min-h-[300px]">
                {/* Visual Cup Simulation */}
                <div className="relative my-4 flex flex-col items-center">
                  {/* Steam in flawed state */}
                  {flawedStep >= 1 && (
                    <div className="text-xs font-mono text-rose-300 animate-pulse mb-1">
                      ♨️ Uap panas 85°C mengepul...
                    </div>
                  )}

                  {/* Cup Container */}
                  <div className="w-44 h-44 rounded-b-3xl rounded-t-lg border-4 border-slate-300 bg-gradient-to-b from-[#1E293B] to-[#0F172A] relative overflow-hidden shadow-2xl flex flex-col justify-end p-2">
                    {/* Water Level */}
                    {flawedStep >= 1 && (
                      <div className="absolute inset-x-0 bottom-0 top-3 bg-gradient-to-t from-sky-400/40 to-sky-200/60 border-t-2 border-sky-300 transition-all duration-700 flex flex-col justify-between">
                        {/* Cocoa Powder Clump on top */}
                        {flawedStep >= 2 && (
                          <div className="w-full h-8 bg-amber-950 border-y-2 border-amber-800 flex items-center justify-center text-[9px] font-mono text-amber-200 font-bold shadow-inner">
                            ⚠️ Gumpalan Cokelat Kering
                          </div>
                        )}
                        {/* Sugar floating */}
                        {flawedStep >= 3 && (
                          <div className="absolute top-1 inset-x-4 text-center text-[9px] font-mono text-white font-bold">
                            🧂 Butiran Gula Tak Larut
                          </div>
                        )}
                      </div>
                    )}

                    {flawedStep === 0 && (
                      <div className="text-center text-xs font-mono text-slate-500 mb-8">
                        Cangkir Keramik Kosong
                      </div>
                    )}
                  </div>

                  {/* Spill Puddle */}
                  {flawedStep >= 3 && (
                    <div className="w-56 h-4 bg-sky-500/40 rounded-full blur-xs mt-[-8px] border border-sky-400 text-[8px] font-mono text-sky-100 text-center animate-pulse">
                      Air panas meluap ke tatakan!
                    </div>
                  )}
                </div>

                {/* Available Action Triggers (The 5 Objects) */}
                <div className="w-full pt-3 border-t border-white/10">
                  <div className="text-[10.5px] font-mono text-slate-400 mb-2 text-center">
                    KLIK OBJEK DI BAWAH UNTUK MENJALANKANNYA PADA CANGKIR:
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {(Object.keys(OBJECTS) as ProcedureObjectId[]).map((key) => {
                      const item = OBJECTS[key];
                      return (
                        <button
                          key={key}
                          onClick={() => handleFlawedInteraction(key)}
                          className="btn-touch p-2 rounded-xl bg-[#08182B] hover:bg-[#0F2D52] border border-cyan-400/40 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95"
                        >
                          <span className="text-2xl mb-1">{item.icon}</span>
                          <span className="text-[9px] font-mono font-bold text-white leading-tight">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status & Next Step (Right) */}
              <div className="lg:col-span-4 p-4 rounded-2xl bg-[#08172C] border border-[#D4AF37]/50 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-[#FFE082] font-bold uppercase mb-2">
                    Target Instruksi Teks Anomali:
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div
                      className={`p-2 rounded-xl border ${
                        flawedStep >= 1
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 line-through'
                          : 'bg-black/40 border-cyan-500 text-cyan-200 animate-pulse'
                      }`}
                    >
                      1. Tuangkan air panas hingga cangkir penuh (150 ml).
                    </div>
                    <div
                      className={`p-2 rounded-xl border ${
                        flawedStep >= 2
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 line-through'
                          : flawedStep === 1
                          ? 'bg-black/40 border-cyan-500 text-cyan-200 animate-pulse'
                          : 'bg-black/20 border-white/10 text-slate-500'
                      }`}
                    >
                      2. Masukkan bubuk cokelat di atas air panas.
                    </div>
                    <div
                      className={`p-2 rounded-xl border ${
                        flawedStep >= 3
                          ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 line-through'
                          : flawedStep === 2
                          ? 'bg-black/40 border-cyan-500 text-cyan-200 animate-pulse'
                          : 'bg-black/20 border-white/10 text-slate-500'
                      }`}
                    >
                      3. Masukkan gula pasir.
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {flawedStep >= 3 ? (
                    <button
                      onClick={() => goToPhase('CONSEQUENCE')}
                      className="btn-touch w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-700 text-white font-['Cinzel'] font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(244,63,94,0.7)] animate-bounce flex items-center justify-center gap-2"
                    >
                      <span>Lihat Konsekuensi Fisik!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="text-[11px] font-mono text-slate-400 text-center italic">
                      Selesaikan 3 langkah di atas untuk menguji hasil prosedur.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 5: CONSEQUENCE (VISUAL FAILURE MANIFESTATION)                */}
        {/* =================================================================== */}
        {phase === 'CONSEQUENCE' && (
          <div className="max-w-4xl mx-auto w-full my-auto space-y-4 animate-fadeIn">
            <div className="bg-rose-950/80 p-3.5 rounded-2xl border-2 border-rose-500 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400 animate-bounce" />
                <span className="text-sm font-['Cinzel'] font-black text-rose-100 uppercase tracking-wider">
                  KONSEKUENSI PROSEDUR CACAT: ANOMALI FISIK TOTAL!
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-600">
                PRACTICE ROOM TERCEMAR
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Failure Graphic Rendering */}
              <div className="p-5 rounded-2xl bg-black/60 border border-rose-600 flex flex-col items-center justify-center relative min-h-[260px]">
                {/* Burnt/Smoke Particles */}
                <div className="text-2xl animate-pulse mb-1">💨 ⚡ ⚠️</div>

                {/* The Ruined Cup */}
                <div className="w-48 h-48 rounded-b-3xl rounded-t-lg border-4 border-rose-600 bg-slate-900 relative overflow-hidden shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                  {/* Clear water underneath */}
                  <div className="absolute inset-x-0 bottom-0 top-6 bg-sky-300/30">
                    <div className="absolute bottom-2 inset-x-2 text-center text-[9px] font-mono text-sky-200">
                      Air bening mendidih di dasar (hambar)
                    </div>
                  </div>

                  {/* Thick Crust Clump on Top */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-[#2B1704] border-b-4 border-amber-900 p-1 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold text-amber-200">Gumpalan Kering Berkerak</span>
                    <span className="text-[8.5px] font-mono text-rose-300">Bubuk tidak mau larut!</span>
                  </div>
                </div>

                {/* Overflow Spills on desk */}
                <div className="w-64 h-5 bg-rose-950 border border-rose-700 rounded-full blur-xs mt-[-10px] text-center text-[8.5px] font-mono text-rose-200">
                  Meja basah kuyup akibat air 150 ml meluap!
                </div>
              </div>

              {/* Consequence Analysis */}
              <div className="p-4 rounded-2xl bg-[#08172C] border border-rose-500/60 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-rose-200 uppercase font-mono mb-2 flex items-center gap-1.5">
                    <span>Laporan Kerusakan Prosedural</span>
                  </h3>

                  <div className="space-y-2 text-xs font-mono text-slate-200">
                    <div className="p-2 rounded-xl bg-black/40 border border-rose-900/50">
                      ❌ <strong>Cokelat Menggumpal:</strong> Karena dituangkan langsung ke atas volume air besar tanpa dilarutkan jadi pasta, lapisan luar bubuk basah dan mengunci bubuk kering di dalamnya.
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-rose-900/50">
                      ❌ <strong>Air Meluap:</strong> Menaruh air hingga batas 150 ml di awal membuat penambahan bubuk dan gula meluapkan volume cairan ke meja.
                    </div>
                    <div className="p-2 rounded-xl bg-black/40 border border-rose-900/50">
                      ❌ <strong>Sendok Menganggur:</strong> Tanpa instruksi verba imperatif aksi "Aduklah", gula mengendap kaku di permukaan dan rasa minuman rusak total!
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => goToPhase('INVESTIGATION')}
                  className="btn-touch w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 font-['Cinzel'] font-black text-xs tracking-wider uppercase shadow-[0_0_15px_#D4AF37] hover:brightness-110 flex items-center justify-center gap-2"
                >
                  <span>Buka Investigasi Forensik TKP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 6: INVESTIGATION (FORENSIC WORKBENCH CLUES)                   */}
        {/* =================================================================== */}
        {phase === 'INVESTIGATION' && (
          <div className="max-w-5xl mx-auto w-full my-auto space-y-4 animate-fadeIn">
            <div className="bg-[#08172C]/90 p-3.5 rounded-2xl border border-cyan-400/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-300 font-bold uppercase">TAHAP 6 // INVESTIGASI TKP ANOMALI</div>
                <div className="text-sm font-bold text-white">Klik 4 Titik Hotspot untuk Menemukan Bukti</div>
              </div>
              <span className="text-xs font-mono font-bold text-amber-300">
                Bukti Ditemukan: {investigatedCount}/4
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Interactive Workbench Hotspots Canvas */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-[#040C1A] border border-cyan-500/40 relative min-h-[300px] flex flex-col justify-between">
                <div className="text-xs font-mono text-slate-400 uppercase">
                  Tempat Kejadian Perkara: Meja Seduh Practice Room
                </div>

                {/* Visual Hotspots */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  {/* Hotspot 1: Clump */}
                  <button
                    onClick={() =>
                      handleInvestigateHotspot(
                        'clump',
                        'Gumpalan Bubuk Cokelat Kering',
                        'Bubuk cokelat butuh dilarutkan dengan sedikit air panas dan diaduk terlebih dahulu menjadi pasta kental.',
                        'Pilar Bahan & Cara Pelarutan'
                      )
                    }
                    className={`btn-touch p-3 rounded-xl border flex flex-col items-start text-left transition-all ${
                      investigatedHotspots.clump
                        ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500 text-rose-200 animate-pulse hover:bg-rose-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>🍫</span>
                      <span>Titik 1: Gumpalan Cokelat</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {investigatedHotspots.clump ? '✓ Bukti Diamankan' : 'Klik untuk investigasi'}
                    </span>
                  </button>

                  {/* Hotspot 2: Spill */}
                  <button
                    onClick={() =>
                      handleInvestigateHotspot(
                        'spill',
                        'Tumpahan Air Panas di Meja',
                        'Penuangan air 150 ml sebelum bahan padat membuat volume meluap. Air harus dituangkan secara bertahap (30 ml lalu 120 ml).',
                        'Pilar Takaran Bertahap & Kronologi'
                      )
                    }
                    className={`btn-touch p-3 rounded-xl border flex flex-col items-start text-left transition-all ${
                      investigatedHotspots.spill
                        ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500 text-rose-200 animate-pulse hover:bg-rose-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>💧</span>
                      <span>Titik 2: Tumpahan Air Meja</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {investigatedHotspots.spill ? '✓ Bukti Diamankan' : 'Klik untuk investigasi'}
                    </span>
                  </button>

                  {/* Hotspot 3: Spoon */}
                  <button
                    onClick={() =>
                      handleInvestigateHotspot(
                        'spoon',
                        'Sendok Pengaduk Menganggur',
                        'Sendok perak tergeletak bersih tanpa disentuh karena teks prosedur tidak memiliki verba imperatif aksi "Aduklah".',
                        'Pilar Alat & Verba Imperatif'
                      )
                    }
                    className={`btn-touch p-3 rounded-xl border flex flex-col items-start text-left transition-all ${
                      investigatedHotspots.spoon
                        ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500 text-rose-200 animate-pulse hover:bg-rose-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>🥄</span>
                      <span>Titik 3: Sendok Menganggur</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {investigatedHotspots.spoon ? '✓ Bukti Diamankan' : 'Klik untuk investigasi'}
                    </span>
                  </button>

                  {/* Hotspot 4: Scroll */}
                  <button
                    onClick={() =>
                      handleInvestigateHotspot(
                        'scroll',
                        'Gulungan Teks Tanpa Konjungsi',
                        'Langkah-langkah disusun tanpa konjungsi urutan kronologis yang logis sehingga pembaca keliru mendahulukan air panas.',
                        'Pilar Konjungsi Kronologis'
                      )
                    }
                    className={`btn-touch p-3 rounded-xl border flex flex-col items-start text-left transition-all ${
                      investigatedHotspots.scroll
                        ? 'bg-emerald-950/30 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500 text-rose-200 animate-pulse hover:bg-rose-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span>📜</span>
                      <span>Titik 4: Gulungan Teks Cacat</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 mt-1">
                      {investigatedHotspots.scroll ? '✓ Bukti Diamankan' : 'Klik untuk investigasi'}
                    </span>
                  </button>
                </div>

                <div className="text-[10px] font-mono text-slate-400 text-center">
                  Setiap temuan fisik berkaitan langsung dengan kaidah kebahasaan teks prosedur.
                </div>
              </div>

              {/* Clue Inspector (Right) */}
              <div className="lg:col-span-5 p-4 rounded-2xl bg-[#08172C] border border-[#D4AF37]/50 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-[#FFE082] font-bold uppercase mb-2">
                    Analisis Forensik Bukti:
                  </div>

                  {selectedHotspotDetail ? (
                    <div className="p-3 rounded-xl bg-black/40 border border-cyan-400/40 space-y-2 animate-fadeIn">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>{selectedHotspotDetail.title}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {selectedHotspotDetail.description}
                      </p>
                      <div className="text-[10px] font-mono text-amber-300 pt-1 border-t border-white/10">
                        Pilar Teks Terkait: <strong>{selectedHotspotDetail.pillar}</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs font-mono text-slate-400 italic p-4 text-center">
                      Klik salah satu titik hotspot di sebelah kiri untuk menganalisis penyebab kerusakannya.
                    </div>
                  )}
                </div>

                <button
                  disabled={investigatedCount < 4}
                  onClick={() => goToPhase('EVIDENCE')}
                  className={`btn-touch mt-4 w-full py-2.5 rounded-xl font-['Cinzel'] font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 ${
                    investigatedCount >= 4
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 shadow-[0_0_15px_#D4AF37] hover:brightness-110'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>Bawa Bukti ke Evidence Board ({investigatedCount}/4)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 7: EVIDENCE (PREMIUM FANTASY DETECTIVE EVIDENCE BOARD)        */}
        {/* =================================================================== */}
        {phase === 'EVIDENCE' && (
          <div className="w-full h-full my-auto flex flex-col justify-center animate-fadeIn">
            <FantasyEvidenceBoard
              initialMatches={evidenceMatches}
              onMatchesChange={(newMatches) => setEvidenceMatches(newMatches)}
              speakAksara={speakAksara}
              onBack={() => goToPhase('INVESTIGATION')}
              onComplete={() => {
                soundFX.playChime('victory');
                goToPhase('DIAGNOSIS');
              }}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 8: DIAGNOSIS (ROOT CAUSE SYNTHESIS)                            */}
        {/* =================================================================== */}
        {phase === 'DIAGNOSIS' && (
          <div className="max-w-4xl mx-auto w-full my-auto space-y-4 animate-fadeIn">
            <div className="bg-[#08172C]/90 p-3.5 rounded-2xl border border-amber-500/50 backdrop-blur-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-amber-300 font-bold uppercase">TAHAP 8 // DIAGNOSIS AKAR MASALAH</div>
                <div className="text-sm font-bold text-white">Tentukan 3 Kesalahan Fatal pada Teks Prosedur Anomali</div>
              </div>
              <span className="text-xs font-mono font-bold text-[#FFE082]">
                Pilihan: {selectedDiagnosisAnswers.length}/3
              </span>
            </div>

            <div className="p-5 rounded-3xl bg-[#061120] border border-[#D4AF37]/40 space-y-3">
              {[
                {
                  id: 1,
                  text: 'Ketiadaan verba imperatif aksi "Aduklah" menggunakan sendok sehingga bahan padat tidak mengalami pelarutan mekanis.',
                  isCorrect: true,
                },
                {
                  id: 2,
                  text: 'Warna cangkir keramik yang digunakan terlalu gelap sehingga uap panas tidak terpantul.',
                  isCorrect: false,
                },
                {
                  id: 3,
                  text: 'Urutan kronologis terbalik: air panas dituangkan sebelum bahan padat dan tanpa pelarutan pasta bertahap.',
                  isCorrect: true,
                },
                {
                  id: 4,
                  text: 'Ketiadaan adverbia takaran penuangan bertahap (30 ml untuk melarutkan pasta, 120 ml untuk volume akhir).',
                  isCorrect: true,
                },
                {
                  id: 5,
                  text: 'Penggunaan air panas 85°C terlalu dingin sehingga harus diganti dengan es batu.',
                  isCorrect: false,
                },
              ].map((item) => {
                const isSelected = selectedDiagnosisAnswers.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      soundFX.playChime('click');
                      if (isSelected) {
                        setSelectedDiagnosisAnswers(selectedDiagnosisAnswers.filter((x) => x !== item.id));
                      } else {
                        if (selectedDiagnosisAnswers.length < 3) {
                          setSelectedDiagnosisAnswers([...selectedDiagnosisAnswers, item.id]);
                        }
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-950/50 text-white shadow-md'
                        : 'border-white/10 bg-black/30 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs mt-0.5 shrink-0 ${
                        isSelected ? 'bg-cyan-400 text-slate-950' : 'border border-slate-600'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                    <span className="text-xs leading-relaxed">{item.text}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <button
                disabled={
                  selectedDiagnosisAnswers.length !== 3 ||
                  !selectedDiagnosisAnswers.includes(1) ||
                  !selectedDiagnosisAnswers.includes(3) ||
                  !selectedDiagnosisAnswers.includes(4)
                }
                onClick={() => goToPhase('REPAIR')}
                className={`btn-touch px-6 py-2.5 rounded-xl font-['Cinzel'] font-bold text-xs tracking-wider uppercase flex items-center gap-2 ${
                  selectedDiagnosisAnswers.length === 3 &&
                  selectedDiagnosisAnswers.includes(1) &&
                  selectedDiagnosisAnswers.includes(3) &&
                  selectedDiagnosisAnswers.includes(4)
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 shadow-[0_0_15px_#D4AF37] hover:brightness-110'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                <span>Kunci Diagnosis & Buka Bengkel Rekonstruksi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 9: REPAIR (MAGICAL PROCEDURE ENGINE & WORLD RESPONSE)         */}
        {/* =================================================================== */}
        {phase === 'REPAIR' && (
          <div className="w-full my-auto animate-fadeIn">
            <MagicalProcedureEngine
              onBack={() => goToPhase('DIAGNOSIS')}
              onContinue={() => goToPhase('RETEST')}
              stageTitle="Mesin Magis Proseduria — Rekonstruksi & Respon Dunia"
              missionNumber="M01 // TAHAP 9: REPAIR"
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 10: RETEST (HANDS-ON RE-TESTING OF REPAIRED PROCEDURE)        */}
        {/* =================================================================== */}
        {phase === 'RETEST' && (
          <div className="max-w-5xl mx-auto w-full my-auto space-y-4 animate-fadeIn">
            <div className="bg-[#08172C]/90 p-3.5 rounded-2xl border border-cyan-400/50 backdrop-blur-md flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-cyan-300 font-bold uppercase">TAHAP 10 // UJI KEMBALI INTERAKTIF</div>
                <div className="text-sm font-bold text-white">Praktikkan Prosedur Baru dengan Tanganmu Sendiri</div>
              </div>
              <span className="text-xs font-mono font-bold text-[#FFE082] px-3 py-1 rounded bg-[#040C1A] border border-cyan-400">
                Progres Uji: {retestStep}/6
              </span>
            </div>

            {/* Instruction Guide Bar */}
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-400/40 text-xs font-mono text-cyan-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{retestMessage}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Cup Simulation Area */}
              <div className="lg:col-span-8 p-5 rounded-2xl bg-[#040C1A] border border-cyan-500/40 flex flex-col items-center justify-between relative min-h-[300px]">
                {/* Visual Cup Rendering in Retest */}
                <div className="relative my-4 flex flex-col items-center">
                  {retestStep >= 5 && (
                    <div className="text-xs font-mono text-[#FFE082] animate-pulse mb-1">
                      ♨️ Uap harum cokelat berputar lembut...
                    </div>
                  )}

                  {/* Cup */}
                  <div className="w-44 h-44 rounded-b-3xl rounded-t-lg border-4 border-[#D4AF37] bg-gradient-to-b from-[#1E293B] to-[#0F172A] relative overflow-hidden shadow-[0_0_30px_rgba(212,175,55,0.4)] flex flex-col justify-end p-2">
                    {/* Retest Liquid Layer */}
                    {retestStep === 1 && (
                      <div className="absolute inset-x-4 bottom-2 h-6 bg-amber-950 rounded-lg text-center text-[8.5px] font-mono text-amber-200">
                        2 sdm bubuk kering
                      </div>
                    )}
                    {retestStep === 2 && (
                      <div className="absolute inset-x-4 bottom-2 h-8 bg-amber-950 rounded-lg text-center text-[8.5px] font-mono text-amber-100 flex flex-col justify-center">
                        <span>Bubuk & Gula tercampur</span>
                      </div>
                    )}
                    {retestStep === 3 && (
                      <div className="absolute inset-x-2 bottom-0 h-12 bg-gradient-to-t from-amber-900 to-amber-950 text-center text-[8.5px] font-mono text-amber-200 flex flex-col justify-center">
                        <span>30 ml air panas meresap</span>
                      </div>
                    )}
                    {retestStep === 4 && (
                      <div className="absolute inset-x-0 bottom-0 h-14 bg-amber-950 border-t-2 border-amber-600 text-center text-[9px] font-mono text-[#FFE082] font-bold flex flex-col justify-center animate-pulse">
                        <span>✨ Pasta Cokelat Kental Halus!</span>
                      </div>
                    )}
                    {retestStep >= 5 && (
                      <div className="absolute inset-x-0 bottom-0 top-3 bg-gradient-to-t from-[#3B1D0E] via-[#5A2C14] to-[#78391A] border-t-2 border-amber-400 flex flex-col justify-between p-1.5 transition-all duration-700">
                        <div className="w-full text-center text-[9px] font-mono text-amber-200 font-bold">
                          {retestStep === 6 ? '✨ Cokelat Larut Sempurna 150 ml' : '150 ml Air Mengisi'}
                        </div>
                        {retestStep === 6 && (
                          <div className="w-full text-center text-[8.5px] font-mono text-[#FFE082]">
                            Bebas Gumpalan • Manis Seimbang
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Objects to Click */}
                <div className="w-full pt-3 border-t border-white/10">
                  <div className="grid grid-cols-5 gap-2">
                    {(Object.keys(OBJECTS) as ProcedureObjectId[]).map((key) => {
                      const item = OBJECTS[key];
                      return (
                        <button
                          key={key}
                          onClick={() => handleRetestInteraction(key)}
                          className="btn-touch p-2 rounded-xl bg-[#08182B] hover:bg-[#0F2D52] border border-cyan-400/40 flex flex-col items-center text-center transition-all hover:scale-105 active:scale-95"
                        >
                          <span className="text-2xl mb-1">{item.icon}</span>
                          <span className="text-[9px] font-mono font-bold text-white leading-tight">
                            {item.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Progress Checklist (Right) */}
              <div className="lg:col-span-4 p-4 rounded-2xl bg-[#08172C] border border-[#D4AF37]/50 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono text-[#FFE082] font-bold uppercase mb-2">
                    Checklist Protokol Baku:
                  </div>

                  <div className="space-y-1.5 text-xs font-mono">
                    <div className={`p-2 rounded-lg border ${retestStep >= 1 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                      {retestStep >= 1 ? '✓' : '○'} 1. Masukkan bubuk cokelat ke cangkir kering.
                    </div>
                    <div className={`p-2 rounded-lg border ${retestStep >= 2 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                      {retestStep >= 2 ? '✓' : '○'} 2. Masukkan gula pasir.
                    </div>
                    <div className={`p-2 rounded-lg border ${retestStep >= 3 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                      {retestStep >= 3 ? '✓' : '○'} 3. Tuang sedikit air panas (30 ml).
                    </div>
                    <div className={`p-2 rounded-lg border ${retestStep >= 4 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                      {retestStep >= 4 ? '✓' : '○'} 4. Aduklah dengan sendok jadi pasta.
                    </div>
                    <div className={`p-2 rounded-lg border ${retestStep >= 5 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                      {retestStep >= 5 ? '✓' : '○'} 5. Tuang sisa air panas (120 ml).
                    </div>
                    <div className={`p-2 rounded-lg border ${retestStep >= 6 ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-500'}`}>
                      {retestStep >= 6 ? '✓' : '○'} 6. Aduklah kembali secara perlahan.
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  {retestStep >= 6 ? (
                    <button
                      onClick={() => goToPhase('REFLECTION')}
                      className="btn-touch w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#D4AF37] text-slate-950 font-['Cinzel'] font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.7)] animate-bounce flex items-center justify-center gap-2"
                    >
                      <span>Saksikan Pemulihan Practice Room!</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="text-[11px] font-mono text-slate-400 text-center italic">
                      Ikuti panduan langkah di atas dengan mengklik objek.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 11: REFLECTION & PRACTICE ROOM RESTORATION                   */}
        {/* =================================================================== */}
        {phase === 'REFLECTION' && (
          <div className="max-w-5xl mx-auto w-full my-auto space-y-5 animate-fadeIn">
            {/* Visual Transformation Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0E2A4D] via-[#0A1E38] to-[#0E2A4D] border-2 border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.5)] flex flex-col md:flex-row items-center gap-6">
              <div className="w-36 h-36 rounded-2xl bg-[#040C1A] border-2 border-emerald-400 overflow-hidden shrink-0 flex items-center justify-center relative">
                <AksaraBustVisual expression="SUKSES" size={130} showCompassBadge={true} />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#FFE082]" />
                  <span className="text-xs font-mono font-bold text-emerald-300 uppercase tracking-widest">
                    TRANSFORMASI VISUAL: PRACTICE ROOM TELAH PULIH!
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-['Cinzel'] font-black text-[#FFE082]">
                  Harmoni Logika Berhasil Dikembalikan
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  Lampu anomali kemerahan telah sirna, digantikan cahaya hangat safir dan emas. Roda gerigi perunggu di dinding berputar selaras, dan uap minuman cokelat membubung harum membuktikan kekuatan prosedur yang presisi.
                </p>
              </div>
            </div>

            {/* Deep Pedagogy Reflection on 4 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#08182B]/90 border border-cyan-400/40">
                <div className="text-xs font-mono font-bold text-cyan-300 uppercase mb-1">1. PILAR TUJUAN</div>
                <div className="text-xs text-slate-200">Menyatakan capaian spesifik (minuman larut sempurna) sehingga hasil akhir terukur.</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#08182B]/90 border border-amber-400/40">
                <div className="text-xs font-mono font-bold text-amber-300 uppercase mb-1">2. ALAT & BAHAN</div>
                <div className="text-xs text-slate-200">Kuantitas presisi (2 sdm, 1 sdm, 30 ml & 120 ml) mencegah luapan volume cairan.</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#08182B]/90 border border-emerald-400/40">
                <div className="text-xs font-mono font-bold text-emerald-300 uppercase mb-1">3. URUTAN KRONOLOGIS</div>
                <div className="text-xs text-slate-200">Konjungsi waktu merantai sebab-akibat fisik agar tidak ada langkah esensial tertukar.</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#08182B]/90 border border-purple-400/40">
                <div className="text-xs font-mono font-bold text-purple-300 uppercase mb-1">4. VERBA IMPERATIF</div>
                <div className="text-xs text-slate-200">Kata kerja aksi tegas ("Aduklah") menggerakkan alat secara mekanis untuk melarutkan zat.</div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => goToPhase('COMPLETE')}
                className="btn-touch px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 font-['Cinzel'] font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.7)] hover:brightness-110 flex items-center gap-2"
              >
                <span>Terima Lencana & Penghargaan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PHASE 12: COMPLETE (FINAL CERTIFICATION & BADGE REWARD)             */}
        {/* =================================================================== */}
        {phase === 'COMPLETE' && (
          <div className="max-w-4xl mx-auto w-full my-auto p-6 sm:p-8 rounded-3xl bg-[#08172C]/95 border-2 border-[#D4AF37] shadow-2xl backdrop-blur-md animate-fadeIn text-center space-y-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#D4AF37] to-[#F5C842] p-1 shadow-[0_0_30px_rgba(212,175,55,0.8)]">
              <div className="w-full h-full rounded-3xl bg-slate-950 flex items-center justify-center text-4xl">
                🏆
              </div>
            </div>

            <div>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-bold uppercase tracking-wider">
                SERTIFIKASI LOGIKA // VERTICAL SLICE SELESAI
              </span>
              <h2 className="text-2xl sm:text-3xl font-['Cinzel'] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C0] via-[#F5C842] to-[#D4AF37] mt-2">
                Penyelaras Langkah Perdana
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto mt-1">
                Kamu telah menuntaskan seluruh 12 fase penyelidikan di Practice Room Akademi PROSEDURIA. Anomali teks telah diperbaiki dan pintu gerbang menuju Pulau Rasa Nusantara kini terbuka!
              </p>
            </div>

            {/* Achievement Stats Box */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto p-3 rounded-2xl bg-black/40 border border-white/10 text-xs font-mono">
              <div>
                <div className="text-slate-400 text-[10px]">PENGALAMAN</div>
                <div className="text-[#FFE082] font-bold text-sm">+150 XP</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">LOGIKA POIN</div>
                <div className="text-cyan-400 font-bold text-sm">+120 LP</div>
              </div>
              <div>
                <div className="text-slate-400 text-[10px]">AKURASI</div>
                <div className="text-emerald-400 font-bold text-sm">100% PARIPURNA</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  soundFX.playChime('cyan');
                  onBackToMap();
                  if (onMissionComplete) onMissionComplete();
                }}
                className="btn-touch px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 font-['Cinzel'] font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.7)] hover:brightness-110 flex items-center gap-2"
              >
                <span>Lanjut ke Peta Dunia (Buka Pulau Rasa)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundFX.playChime('click');
                  setFlawedStep(0);
                  setRetestStep(0);
                  goToPhase('EXPLORATION');
                }}
                className="btn-touch px-4 py-2.5 rounded-xl bg-[#0B2440] hover:bg-[#123359] border border-cyan-400/40 text-cyan-200 text-xs font-mono flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulangi Praktik</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. PERSISTENT FLOATING AKSARA DIALOGUE DRAWER DOCK (BOTTOM)               */}
      {/* ========================================================================= */}
      <footer className="relative z-30 px-3 sm:px-6 py-2 bg-gradient-to-t from-[#040C1A] via-[#08172C]/95 to-transparent border-t border-[#D4AF37]/40 backdrop-blur-md shrink-0">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* Aksara Mini Profile & Speech Bubble */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#040C1A] border border-[#D4AF37] shrink-0">
              <AksaraBustVisual expression={aksaraExpr} size={40} showCompassBadge={false} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-bold text-white">Aksara</span>
                <span className="text-[9px] font-mono text-cyan-300 px-1 rounded bg-cyan-950 border border-cyan-500/30">
                  Kompas Prosedur
                </span>
              </div>
              <p className="text-[11px] text-slate-200 truncate italic">"{aksaraSpeech}"</p>
            </div>
          </div>

          {/* Quick Audio Speech Button */}
          <button
            onClick={() => speakAksara(aksaraSpeech, aksaraExpr)}
            className="btn-touch px-3 py-1.5 rounded-xl bg-[#08182B] hover:bg-[#0F2E52] border border-cyan-400/40 text-cyan-300 text-xs font-mono flex items-center gap-1.5 shrink-0 shadow-sm"
            title="Dengarkan Suara Aksara"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Suara</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
