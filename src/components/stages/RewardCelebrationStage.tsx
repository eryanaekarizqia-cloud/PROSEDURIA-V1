/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import {
  Award,
  Sparkles,
  ShieldCheck,
  Flame,
  ArrowRight,
  Compass,
  Star,
  CheckCircle2,
  Trophy,
  Search,
  Layers,
  BookOpen,
  Bug,
  Wrench,
  Zap,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { StoryboardProgressHUD } from '../ui/StoryboardProgressHUD';

interface RewardCelebrationStageProps {
  onNext: () => void;
  onBackToMap: () => void;
}

const BADGES_COLLECTION = [
  { id: 'b1', name: 'Pengumpul Bukti', icon: Search, color: 'from-cyan-400 to-blue-500', border: 'border-cyan-400', desc: 'Menemukan anomali di Lembah Informasi' },
  { id: 'b2', name: 'Penalar Urutan', icon: Layers, color: 'from-indigo-400 to-purple-500', border: 'border-indigo-400', desc: 'Menyusun urutan 1-5 tanpa celah' },
  { id: 'b3', name: 'Ahli Bahasa', icon: BookOpen, color: 'from-emerald-400 to-teal-500', border: 'border-emerald-400', desc: 'Menguasai verba imperatif & adverbia presisi' },
  { id: 'b4', name: 'Detektif Glitch', icon: Bug, color: 'from-rose-400 to-pink-500', border: 'border-rose-400', desc: 'Mendiagnosa 4 anomali sintaksis fatal' },
  { id: 'b5', name: 'Insinyur Perbaikan', icon: Wrench, color: 'from-amber-400 to-orange-500', border: 'border-amber-400', desc: 'Merekayasa prosedur reaktor 100% stabil' },
  { id: 'b6', name: 'Master Penjelajah Logika', icon: Trophy, color: 'from-yellow-300 to-amber-500', border: 'border-yellow-300', desc: 'Penyelaras dunia Proseduria Nusantara' },
];

export const RewardCelebrationStage: React.FC<RewardCelebrationStageProps> = ({
  onNext,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'badges'>('comparison');

  useEffect(() => {
    soundFX.playChime('victory');
  }, []);

  return (
    <div className="relative w-full h-full pt-16 pb-6 px-4 sm:px-8 flex flex-col justify-between overflow-y-auto">
      <div className="absolute inset-0 bg-[#08131F] opacity-95 z-0" />

      {/* Decorative Fireworks / Nebula ambient */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.4), transparent 60%)',
        }}
      />

      {/* Storyboard Progress HUD (Step 8: BUKTIKAN) */}
      <StoryboardProgressHUD currentStep={8} className="relative z-10 mb-4" />

      {/* Central Celebration Hero */}
      <div className="relative z-10 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center text-center my-2">
        {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
        <MissionGuideBox stageKey="reward_celebration" className="w-full mb-4 text-left" />

        {/* Glowing Badge Emblem */}
        <div className="relative mb-3">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-[0_0_50px_rgba(251,191,36,0.6)] animate-bounce-slow">
            <div className="w-full h-full rounded-[22px] bg-[#08131F] flex flex-col items-center justify-center text-amber-300">
              <Trophy className="w-10 h-10 text-yellow-300" />
            </div>
          </div>
          <div className="absolute -top-2 -right-2 p-1.5 rounded-full bg-cyan-400 text-slate-950 shadow-lg animate-pulse">
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>

        {/* Title */}
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 mb-1">
          LANGKAH 8 // BUKTIKAN: DUNIA PULIH
        </span>
        <h1 className="text-2xl sm:text-4xl font-['Cinzel'] font-black text-white tracking-wide mb-2 drop-shadow-md">
          Selamat, Penyelaras Nusantara!
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mb-4 leading-relaxed">
          Kamu telah berhasil mengurai kekacauan sintaksis, menyusun urutan logis,
          mendeteksi glitch kebahasaan, dan merekonstruksi prosedur reaktor hingga beroperasi 100% stabil.
        </p>

        {/* Toggle between World Restoration vs Badge Collection */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'comparison'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md ring-2 ring-emerald-300'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            🌍 Restorasi Dunia (Sebelum vs Sesudah)
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                : 'bg-white/10 text-slate-300 hover:bg-white/15'
            }`}
          >
            🏅 Koleksi 6 Badge Prestasi
          </button>
        </div>

        {/* TAB 1: World Restoration Comparison (Image 2) */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-4">
            <div className="p-3 rounded-2xl bg-gradient-to-b from-rose-950/40 to-[#1F0A15] border-2 border-rose-500/50 shadow-lg text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-rose-500/30 text-rose-300 border border-rose-400/50 text-[11px] font-mono font-bold">
                  SEBELUM: DUNIA GLITCH
                </span>
                <span className="text-[10px] font-mono text-rose-300">Anomali Prosedur</span>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-video border border-rose-500/30 mb-2">
                <img
                  src={PROSEDURIA_ASSETS.worldGlitch}
                  alt="Dunia Glitch Rusak"
                  className="w-full h-full object-cover filter contrast-125"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[11px] text-rose-200/90 leading-tight">
                Langit kelam memerah, reaktor meluap, dan instruksi mesin kacau karena kesalahan urutan dan takaran ambigu.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-[#0A261D] border-2 border-emerald-400/60 shadow-lg text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-400 text-slate-950 text-[11px] font-mono font-bold shadow-md">
                  SESUDAH: DUNIA PULIH ASRI
                </span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold">100% Harmonis</span>
              </div>
              <div className="relative rounded-xl overflow-hidden aspect-video border border-emerald-400/50 mb-2">
                <img
                  src={PROSEDURIA_ASSETS.worldRestored}
                  alt="Dunia Pulih Sempurna"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <p className="text-[11px] text-emerald-200/90 leading-tight">
                Langit biru cerah, candi bercahaya keemasan, air mengalir jernih, dan reaktor energi beroperasi damai!
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: 6 Badges Collection (Image 2) */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full mb-4">
            {BADGES_COLLECTION.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-2xl bg-gradient-to-br from-[#0D2B45]/90 to-[#071E36]/90 border-2 ${b.border} shadow-md text-center flex flex-col items-center justify-center`}
                >
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${b.color} text-slate-950 flex items-center justify-center mb-1.5 shadow-md`}>
                    <Icon className="w-5 h-5 font-bold" />
                  </div>
                  <div className="text-xs font-bold text-white font-['Cinzel'] leading-tight mb-0.5">
                    {b.name}
                  </div>
                  <div className="text-[9px] text-slate-300 font-mono leading-tight">
                    {b.desc}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rewards Earned Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-4">
          <div className="p-3.5 rounded-2xl bg-[#0D2B45]/70 border border-[#D4AF37]/40 text-center">
            <ShieldCheck className="w-5 h-5 text-[#FFE082] mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400">Gelar Baru:</div>
            <div className="text-xs font-bold text-white font-['Cinzel']">
              Master Sintaksis Abad 22
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0D2B45]/70 border border-cyan-400/40 text-center">
            <Sparkles className="w-5 h-5 text-[#00F2FE] mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400">Pengalaman:</div>
            <div className="text-xs font-bold text-[#00F2FE] font-mono">
              +500 XP & Nilai C5 Sempurna
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#0D2B45]/70 border border-purple-400/40 text-center">
            <Flame className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-[10px] font-mono text-slate-400">Izin Akses:</div>
            <div className="text-xs font-bold text-purple-300 font-['Cinzel']">
              Procedure Forge (C6) Terbuka
            </div>
          </div>
        </div>

        {/* Competency Mastery Recap */}
        <div className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-left text-xs text-slate-300 space-y-1.5 font-sans mb-4">
          <div className="font-mono text-cyan-300 font-bold mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Rangkuman Kompetensi Bahasa yang Kamu Kuasai:</span>
          </div>
          <p>✔ <strong>Struktur Lengkap:</strong> Memastikan tujuan, material/alat, langkah instruksional, dan tips keselamatan hadir utuh.</p>
          <p>✔ <strong>Verba Imperatif:</strong> Menggunakan perintah lugas berimbuhan <em>-kan/-i/-lah</em>.</p>
          <p>✔ <strong>Rangkaian Kronologis:</strong> Mengatur konjungsi temporal agar tidak terjadi kesalahan urutan fatal.</p>
          <p>✔ <strong>Adverbia Kuantitatif:</strong> Takaran terukur untuk menjamin kepastian operasional.</p>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10">
        <button
          onClick={() => {
            soundFX.playChime('cyan');
            onBackToMap();
          }}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Kembali ke Peta Dunia</span>
        </button>
        <button
          onClick={() => {
            soundFX.playChime('gold');
            onNext();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(236,72,153,0.5)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Masuk Procedure Forge (Tahap 11 - C6 Mencipta)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
