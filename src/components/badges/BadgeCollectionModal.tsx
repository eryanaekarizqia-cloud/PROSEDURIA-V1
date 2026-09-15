/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import { X, Award, ShieldCheck, Trophy, Sparkles, CheckCircle2, Flame } from 'lucide-react';

interface BadgeCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadges?: string[];
}

export const BADGE_LIST = [
  {
    id: 'pengumpul_bukti',
    name: 'Pengumpul Bukti',
    desc: 'Mengumpulkan dan mengidentifikasi anomali data teks prosedur.',
    tier: 'Bronze Star Shield',
    color: 'from-amber-600 to-amber-800',
    icon: '🔍',
  },
  {
    id: 'penalar_urutan',
    name: 'Penalar Urutan',
    desc: 'Menata ulang langkah acak berdasarkan logika sebab-akibat & konjungsi temporal.',
    tier: 'Silver Star Crest',
    color: 'from-emerald-600 to-teal-800',
    icon: '⭐',
  },
  {
    id: 'ahli_bahasa',
    name: 'Ahli Bahasa',
    desc: 'Memperbaiki instruksi kabur & kalimat pasif menjadi kalimat imperatif tegas.',
    tier: 'Blue Crest (S)',
    color: 'from-blue-600 to-indigo-800',
    icon: '💠',
  },
  {
    id: 'detektif_glitch',
    name: 'Detektif Glitch',
    desc: 'Mendiagnosis 4 pilar kerusakan: Informasi, Urutan, Bahasa, dan Hasil.',
    tier: 'Gear Shield',
    color: 'from-purple-600 to-violet-800',
    icon: '⚙️',
  },
  {
    id: 'insinyur_perbaikan',
    name: 'Insinyur Perbaikan',
    desc: 'Merekonstruksi protokol reaktor bioplasma dengan presisi kuantitatif.',
    tier: 'Crossed Wrench Crest',
    color: 'from-cyan-600 to-blue-800',
    icon: '🛠️',
  },
  {
    id: 'master_penjelajah_logika',
    name: 'Master Penjelajah Logika',
    desc: 'Menyelesaikan seluruh kurikulum fase D dan menyelamatkan Akademi Proseduria.',
    tier: 'S-Rank Royal Trophy',
    color: 'from-yellow-500 to-amber-700',
    icon: '🏆',
  },
];

export const BadgeCollectionModal: React.FC<BadgeCollectionModalProps> = ({
  isOpen,
  onClose,
  unlockedBadges = [
    'pengumpul_bukti',
    'penalar_urutan',
    'ahli_bahasa',
    'detektif_glitch',
    'insinyur_perbaikan',
    'master_penjelajah_logika',
  ],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0D2B45] via-[#0A1F33] to-[#06121E] border-2 border-[#D4AF37] p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.3)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#08131F] text-slate-300 hover:text-white border border-[#D4AF37]/40 transition-all hover:scale-110 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Trophy Asset Banner */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-[#D4AF37]/30">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shrink-0 shadow-lg shadow-[#D4AF37]/20">
            <img
              src={PROSEDURIA_ASSETS.badgeTrophy}
              alt="Piala & Badge Master Proseduria"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#FFE082] text-xs font-mono font-bold mb-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>KOLEKSI LENCANA PRESTASI PROSEDURIA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel'] text-white">
              Sistem Penghargaan & Kompetensi
            </h2>
            <p className="text-xs sm:text-sm text-cyan-200/80 mt-1">
              Refleksi pencapaian kemampuan berpikir tingkat tinggi (HOTS) sesuai materi Teks Prosedur Bahasa Indonesia Kelas IX.
            </p>
          </div>
        </div>

        {/* 6 Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 my-6">
          {BADGE_LIST.map((b) => {
            const isUnlocked = unlockedBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`relative rounded-2xl p-4 border transition-all ${
                  isUnlocked
                    ? 'bg-[#08182B] border-[#D4AF37]/60 shadow-[0_4px_20px_rgba(212,175,55,0.15)] hover:border-[#FFE082]'
                    : 'bg-[#050C14]/80 border-slate-700 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-[#D4AF37]/30 to-[#0D2B45] border-[#D4AF37]'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    {b.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#FFE082] truncate">{b.name}</h4>
                      {isUnlocked && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-cyan-300/80 font-mono mt-0.5">{b.tier}</p>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">{b.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3 Evaluation Pillars from Concept Sheet */}
        <div className="p-4 rounded-2xl bg-[#061423] border border-[#00F2FE]/30 text-xs">
          <div className="flex items-center gap-2 font-bold text-[#00F2FE] mb-2 font-mono uppercase">
            <Sparkles className="w-4 h-4" />
            <span>3 Pilar Sistem Penilaian Proseduria</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
            <div className="p-3 rounded-xl bg-[#0A1F33] border border-white/5">
              <span className="font-bold text-[#FFE082] block mb-1">1. Game Score</span>
              <p className="text-[11px] text-slate-300">Waktu penyelesaian, efisiensi langkah, jumlah retry, dan kelengkapan bukti.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0A1F33] border border-white/5">
              <span className="font-bold text-cyan-300 block mb-1">2. Learning Evidence</span>
              <p className="text-[11px] text-slate-300">Menemukan informasi, menghubungkan sebab-akibat, mendiagnosis error teks, dan merancang teks.</p>
            </div>
            <div className="p-3 rounded-xl bg-[#0A1F33] border border-white/5">
              <span className="font-bold text-emerald-300 block mb-1">3. Tingkat Penguasaan</span>
              <p className="text-[11px] text-slate-300">Terbukti (konsisten), Berkembang (ada kemampuan dasar), Belum Cukup Bukti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
