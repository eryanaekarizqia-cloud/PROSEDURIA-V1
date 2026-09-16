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
  Play,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Zap,
  Activity,
  Gauge,
  Sparkles,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { StoryboardProgressHUD } from '../ui/StoryboardProgressHUD';

interface TestSimulationStageProps {
  onNext: () => void;
  onBack: () => void;
}

const PROTOCOL_STEPS = [
  { id: 1, label: 'Langkah 1: Injeksi Pelarut Presisi', action: 'Injeksi 250 ml cairan pelarut etanol murni ke dalam tabung reaksi ultrasonik.', log: '[SYSTEM] Pelarut terukur 250 ml berhasil dialirkan. Volume optimal tercapai.' },
  { id: 2, label: 'Langkah 2: Segel Katup Pengaman', action: 'Pasanglah katup segel pengaman reaktor sebelum menyalakan daya foton.', log: '[SAFETY] Katup segel kuantum terkunci rapat. Tekanan kedap 100% aman.' },
  { id: 3, label: 'Langkah 3: Putar Tuas Daya 90°', action: 'Putarlah tuas katup daya searah jarum jam sebesar 90 derajat hingga bunyi klik.', log: '[CORE] Aliran daya foton terhubung. Induktor berputar pada frekuensi 440Hz.' },
  { id: 4, label: 'Langkah 4: Termoregulasi 60°C', action: 'Panaskan tabung reaksi pada suhu 60°C konstan selama 10 menit.', log: '[HEAT] Pemanasan foton stabil pada 60.0°C. Ekstraksi kurkuminoid aktif sempurna.' },
  { id: 5, label: 'Langkah 5: Filtrasi Membran Mikro', action: 'Saring cairan ekstrak menggunakan filter membran mikro hingga diperoleh bioplasma murni.', log: '[PURITY] Pemisahan residu selesai. Tingkat kemurnian bioplasma mencapai 99.8%!' },
];

export const TestSimulationStage: React.FC<TestSimulationStageProps> = ({
  onNext,
  onBack,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([
    '[STANDBY] Reaktor Bioplasma Alpha-01 siap diuji menggunakan prosedur baku.',
  ]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const handleExecuteNextStep = () => {
    if (currentStepIndex >= PROTOCOL_STEPS.length) return;

    const step = PROTOCOL_STEPS[currentStepIndex];
    soundFX.playChime('cyan');

    setLogs((prev) => [...prev, step.log]);
    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);

    if (nextIndex === PROTOCOL_STEPS.length) {
      setIsCompleted(true);
      gameStateManager.save({ simulationPassed: true });
      gameStateManager.unlockBadge('penguji_prototipe');
      setTimeout(() => {
        soundFX.playChime('victory');
        setLogs((prev) => [
          ...prev,
          '[SUCCESS] SELURUH PROTOKOL VALID! Reaktor beroperasi dengan efisiensi 100% tanpa anomali!',
        ]);
      }, 500);
    }
  };

  const handleResetSimulation = () => {
    soundFX.playChime('click');
    setCurrentStepIndex(0);
    setIsCompleted(false);
    setLogs(['[STANDBY] Reaktor Bioplasma direset. Silakan jalankan prosedur dari langkah 1.']);
  };

  const resonancePercent = Math.round((currentStepIndex / PROTOCOL_STEPS.length) * 100);

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
            <span>Tahap 8</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-400/20 text-[#00F2FE] border border-cyan-400/30">
                MISI 9 // UJI SIMULASI PROSEDUR
              </span>
              <span className="text-xs font-mono text-slate-400">Simulasi Reaktor Bioplasma</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Uji Coba Protokol Reaktor Terkalibrasi
            </h1>
          </div>
        </div>

        <button
          onClick={handleResetSimulation}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Uji Coba</span>
        </button>
      </div>

      {/* 8-Step Storyboard Progress HUD */}
      <StoryboardProgressHUD currentStep={7} className="mb-3" />

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox
        stageKey="test_simulation"
        mood={isCompleted ? 'proud' : (currentStepIndex > 0 ? 'encouraging' : 'curious')}
        className="mb-3"
      />

      {/* Main Simulation Arena */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 my-2">
        {/* Left Column: Interactive Reactor Chamber */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#0D2B45]/60 border border-[#00F2FE]/40 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00F2FE]" />
              <span className="text-xs font-mono text-white font-bold uppercase">
                RUANG SIMULASI REAKTOR BIOPLASMA TEMULAWAK
              </span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/40'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40'
              }`}
            >
              {isCompleted ? 'STABILITAS PENUH (100%)' : 'MENJALANKAN URUTAN'}
            </span>
          </div>

          {/* Reactor Visual Core */}
          <div className="relative w-full h-48 sm:h-56 flex items-center justify-center">
            {/* Pulsating background rings */}
            <div
              className={`w-40 h-40 sm:w-48 sm:h-48 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-700 ${
                isCompleted
                  ? 'border-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-spin-slow'
                  : currentStepIndex > 0
                  ? 'border-[#00F2FE] shadow-[0_0_40px_rgba(0,242,254,0.4)] animate-spin-slow'
                  : 'border-slate-700'
              }`}
            >
              <div
                className={`w-28 h-28 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center border transition-all duration-500 ${
                  isCompleted
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300'
                    : currentStepIndex > 0
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                <Activity className="w-8 h-8 mb-1 animate-pulse" />
                <span className="font-['Cinzel'] font-bold text-lg sm:text-xl">
                  {resonancePercent}%
                </span>
                <span className="text-[9px] font-mono uppercase tracking-wider">
                  Resonansi
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry Gauge Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] font-mono text-slate-400 block">Suhu Kerja:</span>
              <span className="text-sm font-mono font-bold text-amber-300">
                {currentStepIndex >= 4 ? '60.0°C (Stabil)' : '25.0°C (Standby)'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] font-mono text-slate-400 block">Segel Katup:</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                {currentStepIndex >= 2 ? 'Terkunci Kedap' : 'Terbuka'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-center">
              <span className="text-[10px] font-mono text-slate-400 block">Kemurnian:</span>
              <span className="text-sm font-mono font-bold text-cyan-300">
                {currentStepIndex >= 5 ? '99.8% Murni' : '0.0%'}
              </span>
            </div>
          </div>

          {/* Execution Button */}
          {!isCompleted ? (
            <button
              onClick={handleExecuteNextStep}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0284C7] text-[#08131F] font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(0,242,254,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-[#08131F]" />
              <span>
                Jalankan {PROTOCOL_STEPS[currentStepIndex].label}
              </span>
            </button>
          ) : (
            <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-400 text-center text-xs font-mono text-emerald-300 font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Semua Langkah Tervalidasi Sukses! Siap Mengambil Gelar & Lencana.</span>
            </div>
          )}
        </div>

        {/* Right Column: Console Telemetry Logs */}
        <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-white/10 backdrop-blur-md flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-mono text-slate-300 font-bold">
              LOG DIAGNOSTIK TELEMETRI:
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="flex-1 bg-black/50 p-3 rounded-xl border border-white/5 font-mono text-[11px] space-y-2 overflow-y-auto max-h-72 text-slate-300">
            {logs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes('[SUCCESS]')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('[SAFETY]')
                    ? 'text-cyan-300'
                    : 'text-slate-300'
                }
              >
                {log}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-white/5 text-[11px] font-sans text-slate-300">
            Setiap tindakan membuktikan bahwa instruksi imperatif yang presisi dan urutan logis mencegah kegagalan fatal pada sistem teknis.
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
          Kembali ke Bengkel
        </button>
        <button
          disabled={!isCompleted}
          onClick={() => {
            soundFX.playChime('gold');
            onNext();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-[#08131F] font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Lanjut ke Penghargaan Relik (Tahap 10)</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
