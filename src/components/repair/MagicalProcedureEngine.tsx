/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { soundFX } from '../../utils/audioEffects';
import { gameStateManager } from '../../utils/gameStateManager';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import {
  Wrench,
  Play,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Compass,
  Volume2,
  ChevronRight,
  Flame,
  Activity,
  Zap,
  Gauge,
  Info,
  Check,
  X,
  Sliders,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export interface ProceduralStep {
  id: string;
  canonicalOrder: number;
  title: string;
  text: string;
  verb: string;
  conjunction: string;
  adverbDegree: string;
  adverbQuality: string;
  componentType: string;
  runeIcon: string;
  correctReasonId: string;
  reasons: {
    id: string;
    text: string;
    isCorrect: boolean;
    diagnosticHint: string;
  }[];
}

const CANONICAL_STEPS: ProceduralStep[] = [
  {
    id: 'step_powder',
    canonicalOrder: 1,
    title: 'Pemasukan Serbuk Kakao Murni',
    text: 'Pertama-tama, masukkan 2 sendok makan bubuk cokelat murni ke dalam cangkir keramik yang kering.',
    verb: 'Masukkan (Imperatif)',
    conjunction: 'Pertama-tama',
    adverbDegree: '2 sendok makan',
    adverbQuality: 'ke dalam cangkir keramik kering',
    componentType: 'Katup Serbuk Kakao Arkana',
    runeIcon: '🍫',
    correctReasonId: 'r_powder_dry',
    reasons: [
      {
        id: 'r_powder_dry',
        text: 'Menaruh bahan padat ke wadah kering mencegah partikel menggumpal lengket di dinding dan menghindari cipratan air mendidih.',
        isCorrect: true,
        diagnosticHint: 'Inilah fondasi presisi: bahan padat harus menempati dasar bejana sebelum pelarutan dimulai.',
      },
      {
        id: 'r_powder_wet',
        text: 'Wadah harus basah tergenang air agar serbuk menempel lengket di dinding cangkir.',
        isCorrect: false,
        diagnosticHint: 'Sensor mendeteksi residu menempel di dinding! Jika wadah basah sembarangan sebelum bubuk masuk, bubuk akan terkunci di pinggir dan gagal larut ke tengah.',
      },
      {
        id: 'r_powder_random',
        text: 'Wadah bebas basah atau kering karena tidak memiliki dampak fisis terhadap kelarutan.',
        isCorrect: false,
        diagnosticHint: 'Hukum fisika fluida di Proseduria mencatat kelembapan permukaan awal sangat memengaruhi dispersi bubuk hidrofobik.',
      },
    ],
  },
  {
    id: 'step_sugar',
    canonicalOrder: 2,
    title: 'Pemasukan Kristal Gula Pasir',
    text: 'Kemudian, tambahkan 1 sendok makan gula pasir sebagai penyeimbang rasa pahit kakao.',
    verb: 'Tambahkan (Imperatif)',
    conjunction: 'Kemudian',
    adverbDegree: '1 sendok makan',
    adverbQuality: 'sebagai penyeimbang rasa pahit',
    componentType: 'Disperser Kristal Manis',
    runeIcon: '🧂',
    correctReasonId: 'r_sugar_blend',
    reasons: [
      {
        id: 'r_sugar_blend',
        text: 'Mencampur butiran gula pasir dengan bubuk kakao saat kering menciptakan celah fisik antar-butir kakao saat terkena air pertama.',
        isCorrect: true,
        diagnosticHint: 'Kristal sukrosa memecah aglomerasi kakao sehingga air dapat meresap ke setiap pori.',
      },
      {
        id: 'r_sugar_ice',
        text: 'Gula pasir berfungsi mendinginkan cangkir secara instan seperti es batu.',
        isCorrect: false,
        diagnosticHint: 'Gula tidak bertindak sebagai pendingin termal endotermik ekstrem; fungsi utamanya adalah penyeimbang kimiawi rasa dan pembantu dispersi.',
      },
      {
        id: 'r_sugar_after',
        text: 'Gula dimasukkan setelah air dingin agar mengendap padat di dasar cangkir.',
        isCorrect: false,
        diagnosticHint: 'Gula yang dibiarkan mengendap di air dingin tanpa larut merata akan menyisakan endapan keras yang tidak seimbang.',
      },
    ],
  },
  {
    id: 'step_water_small',
    canonicalOrder: 3,
    title: 'Injeksi Hidro-Awal (30 ml Air Panas)',
    text: 'Setelah itu, tuangkan 30 ml air panas bersuhu 85°C secara perlahan ke dasar cangkir.',
    verb: 'Tuangkan (Imperatif)',
    conjunction: 'Setelah itu',
    adverbDegree: '30 ml (85°C)',
    adverbQuality: 'secara perlahan ke dasar',
    componentType: 'Katup Presisi Mikro-Hidro',
    runeIcon: '💧',
    correctReasonId: 'r_water_paste',
    reasons: [
      {
        id: 'r_water_paste',
        text: 'Volume air sedikit (30 ml) membasahi seluruh partikel kakao untuk membentuk pasta pekat tanpa mengapungkan kerak kering hidrofobik.',
        isCorrect: true,
        diagnosticHint: 'Rasio air-bubuk minimal di fase awal adalah kunci ilmiah pembentukan pasta homogen.',
      },
      {
        id: 'r_water_max',
        text: 'Langsung tuang 150 ml penuh di awal agar cepat selesai.',
        isCorrect: false,
        diagnosticHint: 'Anomali hidrofobik terpicu! Menuang volume air besar langsung di awal menyebabkan bubuk kakao mengapung kaku dan membentuk kerak tahan air.',
      },
      {
        id: 'r_water_cold',
        text: 'Gunakan air es beku bersuhu 0°C agar cokelat membatu.',
        isCorrect: false,
        diagnosticHint: 'Lemak kakao membeku pada suhu dingin dan sama sekali tidak bisa larut tanpa panas 85°C.',
      },
    ],
  },
  {
    id: 'step_stir_paste',
    canonicalOrder: 4,
    title: 'Agitasi Mekanis Pasta Cokelat',
    text: 'Aduklah secara cepat dan merata menggunakan sendok pengaduk hingga terbentuk pasta cokelat yang kental dan licin.',
    verb: 'Aduklah (Imperatif)',
    conjunction: 'Dengan segera',
    adverbDegree: 'secara cepat dan merata',
    adverbQuality: 'hingga terbentuk pasta kental dan licin',
    componentType: 'Turbin Agitasi Sendok Perak',
    runeIcon: '🥄',
    correctReasonId: 'r_stir_emulsion',
    reasons: [
      {
        id: 'r_stir_emulsion',
        text: 'Gaya gesek mekanis sendok memecah tegangan antar-partikel kakao dan air, menciptakan emulsi suspensi kental bebas gumpalan.',
        isCorrect: true,
        diagnosticHint: 'Verba imperatif aksi mekanik menghasilkan energi kinetik untuk menghancurkan kantong bubuk kering.',
      },
      {
        id: 'r_stir_ignore',
        text: 'Sendok cukup diletakkan diam di samping cangkir tanpa perlu disentuh atau digerakkan.',
        isCorrect: false,
        diagnosticHint: 'Sendok menganggur! Tanpa gaya gerak pengadukan aktif, reaksi fisik emulsi tidak akan pernah terjadi dengan sendirinya.',
      },
      {
        id: 'r_stir_blow',
        text: 'Cukup ditiup dengan mulut tanpa perlu alat sendok.',
        isCorrect: false,
        diagnosticHint: 'Tiupan mulut tidak menghasilkan gaya geser sentrifugal yang dibutuhkan untuk melarutkan pasta padat.',
      },
    ],
  },
  {
    id: 'step_water_final',
    canonicalOrder: 5,
    title: 'Injeksi Hidro-Akhir & Dispersi Final (120 ml)',
    text: 'Selanjutnya, tuangkan sisa 120 ml air panas sambil diaduk perlahan hingga seluruh cokelat larut sempurna tanpa gumpalan.',
    verb: 'Tuangkan & Aduklah',
    conjunction: 'Selanjutnya',
    adverbDegree: 'sisa 120 ml air panas',
    adverbQuality: 'sambil diaduk perlahan hingga larut sempurna',
    componentType: 'Regulator Dispersi Paripurna',
    runeIcon: '✨',
    correctReasonId: 'r_final_dissolve',
    reasons: [
      {
        id: 'r_final_dissolve',
        text: 'Pasta kental yang sudah stabil siap diencerkan dengan 120 ml sisa air sehingga menghasilkan minuman cokelat yang kaya, homogen, dan berbusa halus.',
        isCorrect: true,
        diagnosticHint: 'Tahap akhir menyatukan pasta emulsi ke dalam volume cairan penuh 150 ml secara aman tanpa meluap.',
      },
      {
        id: 'r_final_overflow',
        text: 'Tuangkan air sebanyak-banyaknya hingga meluber ke meja sebagai tanda kelimpahan.',
        isCorrect: false,
        diagnosticHint: 'Alarm kapasitas berbunyi! Meluapkan cairan melebihi kapasitas 180 ml cangkir membanjiri meja investigasi dan menyalahi takaran.',
      },
      {
        id: 'r_final_no_water',
        text: 'Jangan tambahkan air lagi, biarkan saja berupa pasta kering pekat yang tidak bisa diminum.',
        isCorrect: false,
        diagnosticHint: 'Minuman seduh membutuhkan volume air akhir 120 ml agar dapat disajikan sebagai minuman hangat yang nikmat.',
      },
    ],
  },
];

// Initial scrambled configuration
const INITIAL_SCRAMBLED_STEP_IDS = [
  'step_water_small', // 3 in pos 1
  'step_water_final', // 5 in pos 2
  'step_powder',      // 1 in pos 3
  'step_sugar',       // 2 in pos 4
  'step_stir_paste',  // 4 in pos 5
];

interface MagicalProcedureEngineProps {
  onBack?: () => void;
  onContinue?: () => void;
  stageTitle?: string;
  missionNumber?: string;
}

export const MagicalProcedureEngine: React.FC<MagicalProcedureEngineProps> = ({
  onBack,
  onContinue,
  stageTitle = 'Bengkel Rekonstruksi & Respon Dunia',
  missionNumber = 'MISI 8 // BENGKEL MESIN MAGIS PROSEDURIA',
}) => {
  // Steps in current working order
  const [currentSteps, setCurrentSteps] = useState<ProceduralStep[]>(() => {
    return INITIAL_SCRAMBLED_STEP_IDS.map(
      (id) => CANONICAL_STEPS.find((s) => s.id === id)!
    );
  });

  // Player-assigned causality reasons for each step { [stepId]: reasonId }
  const [assignedReasons, setAssignedReasons] = useState<Record<string, string>>({});

  // Active step reason modal
  const [activeReasonModalStepId, setActiveReasonModalStepId] = useState<string | null>(null);

  // Execution simulation states: 'IDLE' | 'RUNNING' | 'FAILED' | 'STABLE'
  const [engineState, setEngineState] = useState<'IDLE' | 'RUNNING' | 'FAILED' | 'STABLE'>('IDLE');
  const [activeExecutingIndex, setActiveExecutingIndex] = useState<number>(-1);
  const [failedStepIndex, setFailedStepIndex] = useState<number | null>(null);
  const [failureConsequence, setFailureConsequence] = useState<{
    nodeIndex: number;
    title: string;
    physicalConsequence: string;
    sensorReading: string;
    socraticHint: string;
  } | null>(null);

  // World Response reveal & restoration states
  const [showWorldResponse, setShowWorldResponse] = useState<boolean>(false);
  const [restorationSliderPos, setRestorationSliderPos] = useState<number>(50);
  const [selectedInspectNode, setSelectedInspectNode] = useState<number | null>(null);

  // Audio/Visual pulse states
  const [gearRotation, setGearRotation] = useState<number>(0);
  const engineCanvasRef = useRef<HTMLDivElement>(null);

  // Track attempt count
  const [attemptCount, setAttemptCount] = useState<number>(0);

  // Animate gears when running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (engineState === 'RUNNING') {
      interval = setInterval(() => {
        setGearRotation((prev) => (prev + 12) % 360);
      }, 50);
    } else if (engineState === 'STABLE') {
      interval = setInterval(() => {
        setGearRotation((prev) => (prev + 3) % 360);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [engineState]);

  // Check how many steps are currently in correct chronological slot
  const correctlyPlacedCount = currentSteps.filter(
    (step, idx) => step.canonicalOrder === idx + 1
  ).length;

  // Check how many reasons are correctly assigned
  const correctlyReasonedCount = currentSteps.filter(
    (step) => assignedReasons[step.id] === step.correctReasonId
  ).length;

  // Stability percentage calculated from order + reasoning
  const stabilityPercent = Math.round(
    ((correctlyPlacedCount * 0.6 + correctlyReasonedCount * 0.4) / CANONICAL_STEPS.length) * 100
  );

  // Move step up or down
  const handleMoveStep = (index: number, direction: 'up' | 'down') => {
    if (engineState === 'RUNNING') return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentSteps.length) return;

    soundFX.playChime('click');
    const updated = [...currentSteps];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setCurrentSteps(updated);
    setEngineState('IDLE');
    setFailedStepIndex(null);
    setFailureConsequence(null);
  };

  // Swap any two step positions directly
  const [draggedNodeIndex, setDraggedNodeIndex] = useState<number | null>(null);

  const handleSwapSlots = (fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx || fromIdx < 0 || toIdx < 0) return;
    soundFX.playChime('click');
    const updated = [...currentSteps];
    const temp = updated[fromIdx];
    updated[fromIdx] = updated[toIdx];
    updated[toIdx] = temp;
    setCurrentSteps(updated);
    setEngineState('IDLE');
    setFailedStepIndex(null);
    setFailureConsequence(null);
  };

  // Assign causality reason to step
  const handleSelectReason = (stepId: string, reasonId: string) => {
    soundFX.playChime('cyan');
    setAssignedReasons((prev) => ({ ...prev, [stepId]: reasonId }));
    setActiveReasonModalStepId(null);
    setEngineState('IDLE');
    setFailedStepIndex(null);
    setFailureConsequence(null);
  };

  // Reset entire puzzle back to scrambled state
  const handleReset = () => {
    soundFX.playChime('click');
    setCurrentSteps(
      INITIAL_SCRAMBLED_STEP_IDS.map((id) => CANONICAL_STEPS.find((s) => s.id === id)!)
    );
    setAssignedReasons({});
    setEngineState('IDLE');
    setActiveExecutingIndex(-1);
    setFailedStepIndex(null);
    setFailureConsequence(null);
    setShowWorldResponse(false);
  };

  // Run the procedure execution sequence across the magical machine
  const handleRunSequence = () => {
    if (engineState === 'RUNNING') return;

    soundFX.playChime('gold');
    setEngineState('RUNNING');
    setActiveExecutingIndex(0);
    setFailedStepIndex(null);
    setFailureConsequence(null);
    setAttemptCount((prev) => prev + 1);

    // Sequential energy flow check through each slot (0 to 4)
    let currentIdx = 0;

    const executeNext = () => {
      if (currentIdx >= currentSteps.length) {
        // All passed!
        setEngineState('STABLE');
        setActiveExecutingIndex(CANONICAL_STEPS.length);
        soundFX.playChime('victory');
        gameStateManager.save({ repairsCompleted: 5 });
        gameStateManager.unlockBadge('ahli_rekonstruksi');
        setTimeout(() => {
          setShowWorldResponse(true);
        }, 1200);
        return;
      }

      const step = currentSteps[currentIdx];
      const expectedCanonical = currentIdx + 1;
      const isOrderCorrect = step.canonicalOrder === expectedCanonical;
      const chosenReasonId = assignedReasons[step.id];
      const isReasonCorrect = chosenReasonId === step.correctReasonId;

      setActiveExecutingIndex(currentIdx);
      soundFX.playChime('cyan');

      if (!isOrderCorrect || !isReasonCorrect) {
        // HALT ENGINE AT THIS POINT!
        setTimeout(() => {
          setEngineState('FAILED');
          setFailedStepIndex(currentIdx);
          soundFX.playChime('error');

          // Generate Socratic Diagnostic consequence based on the failure
          let title = `Anomali Sistem Terdeteksi pada Node ${currentIdx + 1}!`;
          let physical = '';
          let sensor = '';
          let hint = '';

          if (!isOrderCorrect) {
            // Failure due to wrong chronological slot
            if (step.id === 'step_water_small' || step.id === 'step_water_final') {
              physical = 'Pipa hidro menyemburkan air panas ke wadah kosong! Air mendidih membanjiri meja sebelum bahan padat siap.';
              sensor = 'SENSOR VOLUME: Tumpahan 150 ml terdeteksi di permukaan meja kerja. Wadah belum memiliki muatan serbuk.';
              hint = 'Perhatikan kaidah urutan kronologis: Wadah kering harus menerima bahan padat terlebih dahulu sebelum cairan pelarut dituangkan.';
            } else if (step.id === 'step_stir_paste') {
              physical = 'Sendok pengaduk berputar kencang di udara kosong tanpa ada cairan di cangkir! Turbin berderik aus.';
              sensor = 'SENSOR KINETIK: Beban resistansi mekanik 0 Newton. Tidak ada zat yang diaduk.';
              hint = 'Verba imperatif "Aduklah" membutuhkan objek bahan padat dan cairan yang sudah berada di dalam wadah.';
            } else {
              physical = 'Bahan dimasukkan ke urutan yang tidak selaras dengan rantai kausalitas kimiawi.';
              sensor = 'SENSOR KRONOLOGI: Anomali urutan temporal antar-komponen terdeteksi.';
              hint = 'Kaji kembali hubungan kausalitas di papan investigasi: apa yang harus disiapkan sebelum cairan panas dituang?';
            }
          } else {
            // Order is right, but causality reason is wrong or missing!
            physical = 'Energi arkana tersendat pada Soket Kristal Alasan! Rantai nalar ilmiah belum terpasang dengan tepat.';
            sensor = 'SENSOR KAUSALITAS: Kristal Nalar belum terisi atau argumen fisis yang dipilih bertentangan dengan prinsip emulsi.';
            hint = 'Buka soket kristal pada langkah ini dan pilih penjelasan ilmiah yang menerangkan fenomena partikel dan pelarutan secara akurat.';
          }

          setFailureConsequence({
            nodeIndex: currentIdx + 1,
            title,
            physicalConsequence: physical,
            sensorReading: sensor,
            socraticHint: hint,
          });
        }, 800);
      } else {
        // Step passed successfully, flow to next node
        setTimeout(() => {
          currentIdx++;
          executeNext();
        }, 900);
      }
    };

    // Begin execution after brief startup chime
    setTimeout(executeNext, 400);
  };

  return (
    <div
      ref={engineCanvasRef}
      className="relative w-full h-full min-h-[700px] flex flex-col justify-between p-3 sm:p-6 overflow-y-auto select-none"
    >
      {/* ATMOSPHERIC DUST & GLOWING EMBER LIGHTING */}
      <div className="absolute inset-0 bg-radial from-[#0E2038]/70 via-[#050B14]/95 to-[#02060D] pointer-events-none z-0" />
      <div
        className={`absolute top-10 left-1/3 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-all duration-1000 z-0 ${
          engineState === 'STABLE'
            ? 'bg-amber-400/20'
            : engineState === 'FAILED'
            ? 'bg-rose-600/25'
            : 'bg-cyan-500/15'
        }`}
      />

      {/* =========================================================================
         TOP HUD: STATUS BAR, BRASS MANOMETERS, & 7-STEP PIPELINE TRACKER
         ========================================================================= */}
      <div className="relative z-10 space-y-3 mb-3">
        {/* Upper Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#091526]/90 border border-[#D4AF37]/40 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                onClick={() => {
                  soundFX.playChime('click');
                  onBack();
                }}
                className="p-2 rounded-xl bg-[#0D243F] hover:bg-[#163860] text-slate-300 hover:text-white border border-white/10 text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Kembali</span>
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-[#FFE082] border border-amber-500/30">
                  {missionNumber}
                </span>
                <span className="text-xs font-mono text-cyan-300 hidden sm:inline">
                  Mesin Alkemis Proseduria
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-['Cinzel'] font-black text-white tracking-wide flex items-center gap-2">
                <span>{stageTitle}</span>
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </h1>
            </div>
          </div>

          {/* Precision Gauges & Controls */}
          <div className="flex items-center gap-3">
            {/* Stability Gauge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#040C1A] border border-[#D4AF37]/50 shadow-inner">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-8 h-8 -rotate-90">
                  <circle cx="16" cy="16" r="13" stroke="#1E293B" strokeWidth="3" fill="none" />
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    stroke={
                      stabilityPercent >= 100
                        ? '#10B981'
                        : stabilityPercent > 40
                        ? '#F59E0B'
                        : '#EF4444'
                    }
                    strokeWidth="3"
                    strokeDasharray={81.68}
                    strokeDashoffset={81.68 - (81.68 * stabilityPercent) / 100}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-700"
                  />
                </svg>
                <span className="absolute text-[9px] font-mono font-bold text-white">
                  {stabilityPercent}%
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono uppercase text-slate-400">Stabilitas Arkana</span>
                <span
                  className={`text-xs font-mono font-bold ${
                    stabilityPercent >= 100
                      ? 'text-emerald-400'
                      : stabilityPercent > 40
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {stabilityPercent >= 100
                    ? 'RESONANSI SEMPURNA'
                    : stabilityPercent > 40
                    ? 'KALIBRASI SEBAGIAN'
                    : 'KRITIS / TERDISTORSI'}
                </span>
              </div>
            </div>

            {/* Rotating Brass Cog Indicator */}
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] p-1.5 flex items-center justify-center shadow-lg border border-amber-300/40"
              style={{ transform: `rotate(${gearRotation}deg)` }}
              title="Turbin Tekanan Arkana"
            >
              <Cpu className="w-full h-full text-slate-950" />
            </div>

            {/* Reset Puzzle Button */}
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Reset Tata Letak Sirkuit"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 7-STEP PROCEDURAL REPAIR LIFECYCLE BAR (MASTER PROMPT DIRECTIVE) */}
        <div className="p-2.5 rounded-xl bg-[#06101D]/90 border border-cyan-500/30 overflow-x-auto shadow-md">
          <div className="flex items-center justify-between gap-1 text-[10px] font-mono font-bold min-w-[620px]">
            <span
              className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                engineState === 'IDLE' && attemptCount === 0
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <span>1. Lihat Cacat</span>
            </span>
            <span className="text-amber-400">➔</span>
            <span
              className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                correctlyPlacedCount < 5
                  ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                  : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
              }`}
            >
              <span>2. Susun Ulang ({correctlyPlacedCount}/5)</span>
            </span>
            <span className="text-amber-400">➔</span>
            <span
              className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                correctlyReasonedCount < 5
                  ? 'bg-amber-950/80 border-amber-400 text-amber-200'
                  : 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
              }`}
            >
              <span>3. Alasan Kausalitas ({correctlyReasonedCount}/5)</span>
            </span>
            <span className="text-amber-400">➔</span>
            <span
              className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                engineState === 'RUNNING'
                  ? 'bg-gradient-to-r from-cyan-600 to-amber-500 text-slate-950 animate-pulse'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <span>4. Jalankan Reaktor</span>
            </span>
            <span className="text-amber-400">➔</span>
            <span
              className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                engineState === 'FAILED'
                  ? 'bg-rose-900 border-rose-400 text-white animate-bounce'
                  : engineState === 'STABLE'
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <span>5. Amati Hasil Fisik</span>
            </span>
            <span className="text-amber-400">➔</span>
            <span
              className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                engineState === 'FAILED'
                  ? 'bg-amber-950 border-amber-400 text-amber-200'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <span>6. Analisis & Koreksi</span>
            </span>
            <span className="text-amber-400">➔</span>
            <span
              className={`px-2 py-1 rounded-md border flex items-center gap-1 ${
                engineState === 'STABLE'
                  ? 'bg-gradient-to-r from-emerald-500 to-[#D4AF37] text-slate-950 font-black shadow-lg'
                  : 'bg-black/40 border-white/10 text-slate-400'
              }`}
            >
              <span>7. Uji Ulang & Pulih</span>
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
         MAIN WORKBENCH: THE MAGICAL PROCEDURE MACHINE (CIRCUITS + REACTION CRUCIBLE)
         ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 my-2">
        {/* LEFT COLUMN: PROCEDURAL ENERGY LINE CIRCUITS & REORDERABLE RUNIC NODES */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-3 p-4 rounded-3xl bg-[#081527]/80 border-2 border-[#D4AF37]/40 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Subtle Brass Corner Rivets */}
          <div className="absolute top-2 left-2 w-3 h-3 rounded-full bg-[#D4AF37]/50 border border-white/20 shadow-xs" />
          <div className="absolute top-2 right-2 w-3 h-3 rounded-full bg-[#D4AF37]/50 border border-white/20 shadow-xs" />
          <div className="absolute bottom-2 left-2 w-3 h-3 rounded-full bg-[#D4AF37]/50 border border-white/20 shadow-xs" />
          <div className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-[#D4AF37]/50 border border-white/20 shadow-xs" />

          {/* Section Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00F2FE]" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Rangkaian Modul Prosedur (5 Tahap Kronologis)
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <span>Gunakan tombol ▲/▼ untuk menata alur kronologis yang runtut</span>
            </div>
          </div>

          {/* Runic Step Modules with Animated Procedural Energy Lines */}
          <div className="space-y-2.5 flex-1">
            {currentSteps.map((step, idx) => {
              const isSlotCorrect = step.canonicalOrder === idx + 1;
              const hasReason = !!assignedReasons[step.id];
              const isReasonCorrect = assignedReasons[step.id] === step.correctReasonId;
              const isExecutingNow = activeExecutingIndex === idx && engineState === 'RUNNING';
              const isFailedHere = failedStepIndex === idx;

              return (
                <div key={step.id} className="relative group">
                  {/* Glowing Energy Conduit connecting to next node */}
                  {idx < currentSteps.length - 1 && (
                    <div className="absolute left-7 top-full h-2.5 w-1 z-0 pointer-events-none">
                      <div
                        className={`w-full h-full transition-all duration-500 ${
                          engineState === 'STABLE'
                            ? 'bg-gradient-to-b from-[#00F2FE] to-[#D4AF37] shadow-[0_0_8px_#00F2FE]'
                            : isFailedHere
                            ? 'bg-rose-600 shadow-[0_0_8px_#EF4444] animate-pulse'
                            : isSlotCorrect
                            ? 'bg-emerald-500/70'
                            : 'bg-amber-500/30 border-l border-dashed border-amber-400/50'
                        }`}
                      />
                    </div>
                  )}

                  {/* Main Node Card */}
                  <div
                    className={`procedure-card game-card relative z-10 p-3 sm:p-3.5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      isExecutingNow
                        ? 'border-[#00F2FE] bg-cyan-950/70 shadow-[0_0_25px_rgba(0,242,254,0.5)] scale-[1.01]'
                        : isFailedHere
                        ? 'border-rose-500 bg-rose-950/80 shadow-[0_0_25px_rgba(239,68,68,0.6)] animate-shake'
                        : isSlotCorrect && isReasonCorrect && engineState === 'STABLE'
                        ? 'border-emerald-400 bg-gradient-to-r from-emerald-950/40 to-[#0A241A] shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : 'border-white/15 bg-[#050D19]/90 hover:border-white/30'
                    }`}
                  >
                    {/* Node Slot & Runic Symbol */}
                    <div className="flex items-start sm:items-center gap-3 flex-1">
                      {/* Brass Slot Badge */}
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border shadow-md transition-all ${
                          isExecutingNow
                            ? 'bg-[#00F2FE] text-slate-950 border-white animate-pulse'
                            : isFailedHere
                            ? 'bg-rose-600 text-white border-rose-300'
                            : isSlotCorrect
                            ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 border-emerald-300'
                            : 'bg-[#10233B] text-[#FFE082] border-amber-500/40'
                        }`}
                      >
                        {idx + 1}
                      </div>

                      {/* Content & Linguistic Metadata */}
                      <div className="flex-1 min-w-0">
                        {/* Grammatical Pillars Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1">
                            <span>⏳</span>
                            <span>{step.conjunction}</span>
                          </span>
                          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                            <span>⚡</span>
                            <span>{step.verb}</span>
                          </span>
                          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1">
                            <span>⚖️</span>
                            <span>{step.adverbDegree}</span>
                          </span>
                        </div>

                        {/* Procedural Instruction Text */}
                        <p className="text-xs sm:text-[13px] text-slate-100 font-sans leading-snug">
                          {step.text}
                        </p>

                        {/* Interactive Causality Reason Socket */}
                        <div className="mt-1.5 flex items-center gap-2">
                          <button
                            onClick={() => {
                              soundFX.playChime('cyan');
                              setActiveReasonModalStepId(step.id);
                            }}
                            className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                              hasReason
                                ? isReasonCorrect
                                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                                  : 'bg-amber-950/60 border-amber-400 text-amber-200'
                                : 'bg-[#0E2644] border-cyan-400/50 text-cyan-300 hover:bg-[#153B69] animate-pulse'
                            }`}
                          >
                            <span className="text-xs">💎</span>
                            <span className="font-bold">
                              {hasReason
                                ? 'Alasan Kausalitas Terkunci'
                                : '+ Pasang Kristal Alasan Ilmiah'}
                            </span>
                          </button>

                          {hasReason && (
                            <span className="text-[10px] font-mono text-slate-400 truncate max-w-[200px] hidden sm:inline">
                              "{step.reasons.find((r) => r.id === assignedReasons[step.id])?.text}"
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Reorder Buttons (Move Up / Move Down) */}
                    <div className="flex sm:flex-col items-center gap-1 self-end sm:self-center shrink-0">
                      <button
                        disabled={idx === 0 || engineState === 'RUNNING'}
                        onClick={() => handleMoveStep(idx, 'up')}
                        className="w-8 h-8 rounded-lg bg-[#0E243F] hover:bg-[#163860] border border-white/20 text-slate-200 hover:text-white flex items-center justify-center text-xs transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                        title="Pindahkan ke langkah sebelumnya"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === currentSteps.length - 1 || engineState === 'RUNNING'}
                        onClick={() => handleMoveStep(idx, 'down')}
                        className="w-8 h-8 rounded-lg bg-[#0E243F] hover:bg-[#163860] border border-white/20 text-slate-200 hover:text-white flex items-center justify-center text-xs transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                        title="Pindahkan ke langkah selanjutnya"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Master Ignition Bar */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400">
              {correctlyPlacedCount === 5 && correctlyReasonedCount === 5 ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Sirkuit & Alasan Kausalitas Lengkap. Siap Diuji!</span>
                </span>
              ) : (
                <span>
                  Langkah Benar: <strong className="text-amber-300">{correctlyPlacedCount}/5</strong> • Alasan Terpilih: <strong className="text-cyan-300">{correctlyReasonedCount}/5</strong>
                </span>
              )}
            </div>

            <button
              disabled={engineState === 'RUNNING'}
              onClick={handleRunSequence}
              className={`btn-touch px-6 py-3 rounded-2xl font-['Cinzel'] font-black text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-2xl transition-all cursor-pointer ${
                engineState === 'RUNNING'
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-wait'
                  : 'btn-game-gold text-slate-950 shadow-[0_0_25px_rgba(212,175,55,0.6)]'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Jalankan Sirkuit Mesin Arkana</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: CENTRAL CRUCIBLE, REAL-TIME VISUAL CONSEQUENCE & DIAGNOSTIC TELEMETRY */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4 p-4 rounded-3xl bg-[#081527]/80 border-2 border-[#D4AF37]/40 shadow-2xl backdrop-blur-md relative overflow-hidden">
          {/* Reaction Chamber Title */}
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Bejana Reaksi Fisik TKP
              </span>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                engineState === 'STABLE'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : engineState === 'FAILED'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : engineState === 'RUNNING'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse'
                  : 'bg-black/30 text-slate-400 border border-white/10'
              }`}
            >
              STATUS: {engineState}
            </span>
          </div>

          {/* Central Physical Crucible Simulation Visual */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#040C1A] border border-white/10 relative min-h-[220px]">
            {/* Background glowing energy containment field */}
            <div
              className={`absolute inset-0 rounded-2xl transition-all duration-700 pointer-events-none ${
                engineState === 'STABLE'
                  ? 'bg-radial from-amber-500/20 via-emerald-500/10 to-transparent'
                  : engineState === 'FAILED'
                  ? 'bg-radial from-rose-600/30 via-transparent to-transparent'
                  : 'bg-radial from-cyan-500/10 via-transparent to-transparent'
              }`}
            />

            {/* Steaming / Alarm Effects */}
            {engineState === 'STABLE' && (
              <div className="text-xs font-mono text-[#FFE082] animate-bounce mb-1 flex items-center gap-1">
                <span>♨️</span>
                <span>Uap Cokelat Nusantara Harum & Lembut</span>
              </div>
            )}
            {engineState === 'FAILED' && (
              <div className="text-xs font-mono text-rose-300 animate-pulse mb-1 flex items-center gap-1">
                <span>⚠️</span>
                <span>ALARM SISTEM: ALIRAN TERPUTUS!</span>
              </div>
            )}

            {/* 3D Ceramic Cup Graphic */}
            <div className="relative">
              <div
                className={`w-36 h-36 sm:w-40 sm:h-40 rounded-b-3xl rounded-t-lg border-4 transition-all duration-500 relative overflow-hidden flex flex-col justify-end p-2 shadow-2xl ${
                  engineState === 'STABLE'
                    ? 'border-[#D4AF37] bg-gradient-to-b from-[#1C2C42] to-[#0A1628] shadow-[0_0_30px_rgba(212,175,55,0.6)]'
                    : engineState === 'FAILED'
                    ? 'border-rose-500 bg-[#12080D] shadow-[0_0_30px_rgba(239,68,68,0.5)]'
                    : 'border-slate-700 bg-[#0A1322]'
                }`}
              >
                {/* Physical State 1: Broken / Failed Overflow or Clumping */}
                {engineState === 'FAILED' && (
                  <>
                    <div className="absolute inset-x-0 bottom-0 top-6 bg-sky-300/30 flex items-center justify-center">
                      <span className="text-[9px] font-mono text-sky-200 text-center px-2">
                        Air bening mendidih hambar
                      </span>
                    </div>
                    <div className="absolute inset-x-0 top-0 h-12 bg-[#2E1404] border-b-2 border-amber-800 p-1 flex flex-col items-center justify-center text-center shadow-lg">
                      <span className="text-[10px] font-bold text-amber-200">Gumpalan Kering Terapung</span>
                      <span className="text-[8px] font-mono text-rose-300">Menolak larut!</span>
                    </div>
                  </>
                )}

                {/* Physical State 2: Stable Velvety Drink */}
                {engineState === 'STABLE' && (
                  <div className="absolute inset-x-0 bottom-0 top-3 bg-gradient-to-t from-[#2A1308] via-[#4A2411] to-[#6E3618] border-t-2 border-amber-300 flex flex-col justify-between p-2 shadow-inner">
                    <div className="w-full text-center text-[9px] font-mono text-[#FFE082] font-bold">
                      ✨ Cokelat Larut Sempurna 150 ml
                    </div>
                    <div className="w-full text-center text-[8px] font-mono text-amber-200">
                      Pasta Homogen • Tanpa Gumpalan
                    </div>
                  </div>
                )}

                {/* Physical State 3: Standby Initial / Running */}
                {(engineState === 'IDLE' || engineState === 'RUNNING') && (
                  <div className="flex flex-col items-center justify-center h-full text-center p-2">
                    <span className="text-3xl mb-1">☕</span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {engineState === 'RUNNING'
                        ? 'Memproses reaksi partikel...'
                        : 'Menunggu inisiasi sirkuit...'}
                    </span>
                  </div>
                )}
              </div>

              {/* Spill effect if failed */}
              {engineState === 'FAILED' && (
                <div className="w-48 h-3 bg-rose-950 border border-rose-600 rounded-full blur-xs mt-[-6px] -mx-4 text-center text-[8px] font-mono text-rose-200">
                  Genangan 150 ml meluap ke meja!
                </div>
              )}
            </div>
          </div>

          {/* DIAGNOSTIC TELEMETRY & SOCRATIC ANALYSIS PANEL (NON-DIRECT ANSWER) */}
          <div className="flex-1 flex flex-col justify-between p-3.5 rounded-2xl bg-[#040D1B] border border-white/10 space-y-2.5">
            {failureConsequence ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-rose-300 text-xs font-mono font-bold">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{failureConsequence.title}</span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-100 font-mono leading-relaxed">
                  <strong>Hasil Pengamatan Fisik:</strong> {failureConsequence.physicalConsequence}
                </div>

                <div className="p-2.5 rounded-xl bg-black/50 border border-cyan-500/30 text-xs text-cyan-200 font-mono leading-relaxed">
                  <strong>Sensor Lapangan:</strong> {failureConsequence.sensorReading}
                </div>

                {/* Socratic Guided Question without revealing direct answers */}
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 font-sans leading-relaxed">
                  <strong className="block text-[#FFE082] font-mono mb-0.5">
                    💡 Panduan Analisis Kausalitas:
                  </strong>
                  {failureConsequence.socraticHint}
                </div>
              </div>
            ) : engineState === 'STABLE' ? (
              <div className="space-y-2 text-center py-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-['Cinzel'] font-bold text-[#FFE082]">
                  Resonansi Prosedur Tercapai!
                </h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  Seluruh urutan kronologis terjalin runtut dan alasan ilmiah kausalitas terbukti kokoh. Dunia Proseduria merespons pemulihan ini!
                </p>
                <button
                  onClick={() => setShowWorldResponse(true)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-[#D4AF37] text-slate-950 font-['Cinzel'] font-black text-xs uppercase tracking-wider shadow-lg hover:brightness-110 cursor-pointer"
                >
                  Saksikan Respon Dunia & Pemulihan
                </button>
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-mono space-y-2">
                <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Petunjuk Detektif Alkemis:</span>
                </div>
                <p className="leading-relaxed">
                  1. Susun langkah dari nomor 1 ke 5 sesuai alur logika pembentukan pasta cokelat.
                </p>
                <p className="leading-relaxed">
                  2. Pasang <strong>Kristal Alasan</strong> pada setiap soket langkah untuk menerangkan kaidah fisika & linguistiknya.
                </p>
                <p className="leading-relaxed">
                  3. Tekan <strong>"Jalankan Sirkuit"</strong> untuk melihat reaksi instan bejana reaksi!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
         MODAL 1: CAUSALITY REASON PICKER (MEMILIH ALASAN ILMIAH PROSEDUR)
         ========================================================================= */}
      {activeReasonModalStepId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          {(() => {
            const activeStep = CANONICAL_STEPS.find((s) => s.id === activeReasonModalStepId)!;
            return (
              <div className="max-w-xl w-full p-5 rounded-3xl bg-[#08172C] border-2 border-[#D4AF37] shadow-2xl flex flex-col space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{activeStep.runeIcon}</span>
                    <div>
                      <span className="text-[10px] font-mono text-cyan-300 uppercase font-bold">
                        SOKET KRISTAL KAUSALITAS
                      </span>
                      <h2 className="text-base font-['Cinzel'] font-bold text-white">
                        {activeStep.title}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveReasonModalStepId(null)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-slate-300">
                  <span className="text-[10px] uppercase text-[#FFE082] font-bold block mb-1">
                    Instruksi Terkait:
                  </span>
                  "{activeStep.text}"
                </div>

                <div className="space-y-2.5">
                  <span className="text-xs font-mono uppercase text-[#FFE082] font-bold">
                    Pilih Alasan Ilmiah Mengapa Langkah Ini Dilakukan Demikian:
                  </span>

                  {activeStep.reasons.map((reason) => {
                    const isSelected = assignedReasons[activeStep.id] === reason.id;
                    return (
                      <button
                        key={reason.id}
                        onClick={() => handleSelectReason(activeStep.id, reason.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] text-white'
                            : 'bg-black/30 border-white/10 hover:border-white/30 text-slate-300 hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 shrink-0 font-bold ${
                            isSelected
                              ? 'bg-cyan-400 text-slate-950'
                              : 'border border-slate-600 text-transparent'
                          }`}
                        >
                          ✓
                        </div>
                        <span className="text-xs font-sans leading-relaxed">{reason.text}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveReasonModalStepId(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* =========================================================================
         MODAL 2: WORLD RESPONSE RESTORATION OVERLAY (PEMULIHAN DUNIA PROSEDURIA)
         ========================================================================= */}
      {showWorldResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn overflow-y-auto">
          <div className="max-w-4xl w-full my-auto p-6 rounded-3xl bg-gradient-to-b from-[#0B1E38] to-[#040C1A] border-2 border-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.5)] flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D23] flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest">
                    RESPON DUNIA BERHASIL DIPICU
                  </div>
                  <h2 className="text-lg sm:text-2xl font-['Cinzel'] font-black text-[#FFE082]">
                    Ekosistem Lembah Informasi Kembali Harmonis!
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setShowWorldResponse(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Before / After Interactive Visual Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="text-rose-400 font-bold">Kiri: Keadaan Rusak Terdistorsi</span>
                <span className="text-[#FFE082]">Geser untuk Membandingkan Transformasi</span>
                <span className="text-emerald-400 font-bold">Kanan: Keadaan Pulih Bersinar</span>
              </div>

              <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl group select-none">
                {/* Under Layer: RESTORED WORLD */}
                <img
                  src={PROSEDURIA_ASSETS.worldRestored}
                  alt="Dunia Proseduria Pulih"
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Top Layer: GLITCHED WORLD, Clipped by Slider */}
                <div
                  className="absolute inset-0 h-full overflow-hidden"
                  style={{
                    clipPath: `polygon(0 0, ${restorationSliderPos}% 0, ${restorationSliderPos}% 100%, 0 100%)`,
                  }}
                >
                  <img
                    src={PROSEDURIA_ASSETS.worldGlitch}
                    alt="Dunia Rusak"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Slider Handle Divider */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-[#FFE082] shadow-[0_0_15px_#FFE082] cursor-ew-resize flex items-center justify-center z-20"
                  style={{ left: `${restorationSliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0D243F] border-2 border-[#FFE082] flex items-center justify-center text-slate-100 text-xs shadow-xl">
                    ⇄
                  </div>
                </div>

                {/* Invisible Range Input for Easy Dragging */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={restorationSliderPos}
                  onChange={(e) => setRestorationSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />
              </div>
            </div>

            {/* Achievement Accomplishments */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/40 text-center">
                <span className="text-xl mb-1 block">⚡</span>
                <span className="text-[11px] font-mono font-bold text-emerald-300 block">
                  Verba Imperatif Lugas
                </span>
                <span className="text-[10px] text-slate-400">
                  Instruksi tegas memandu aksi alat mekanis secara tanpa ragu.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/40 text-center">
                <span className="text-xl mb-1 block">⏳</span>
                <span className="text-[11px] font-mono font-bold text-cyan-300 block">
                  Kronologi Temporal Runtut
                </span>
                <span className="text-[10px] text-slate-400">
                  Alur sebab-akibat terlindungi dari paradoks tumpahan air.
                </span>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-amber-500/40 text-center">
                <span className="text-xl mb-1 block">⚖️</span>
                <span className="text-[11px] font-mono font-bold text-amber-300 block">
                  Presisi Takaran & Kualitas
                </span>
                <span className="text-[10px] text-slate-400">
                  Rasio pasta 30 ml dan 120 ml akhir menghasilkan emulsi sempurna.
                </span>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowWorldResponse(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white text-xs font-mono cursor-pointer"
              >
                Tinjau Sirkuit Kembali
              </button>

              {onContinue && (
                <button
                  onClick={() => {
                    soundFX.playChime('victory');
                    onContinue();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-[#D4AF37] text-slate-950 font-['Cinzel'] font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(212,175,55,0.6)] hover:brightness-110 cursor-pointer flex items-center gap-2"
                >
                  <span>Lanjutkan ke Tahap Simulasi Efisiensi</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
