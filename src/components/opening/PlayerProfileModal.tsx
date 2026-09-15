/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { soundFX } from '../../utils/audioEffects';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import {
  X,
  Compass,
  Book,
  CreditCard,
  Radio,
  Award,
  Shield,
  Sparkles,
  Target,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

interface PlayerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const COLOR_PALETTE = [
    { code: '#0D2B45', name: 'Navy Seragam' },
    { code: '#1E3A5F', name: 'Slate Blue' },
    { code: '#FFFFFF', name: 'Putih Kemeja' },
    { code: '#F4C38E', name: 'Kulit Cerah' },
    { code: '#D99728', name: 'Aksen Emas' },
    { code: '#2E2E2E', name: 'Rambut Hitam' },
    { code: '#D62828', name: 'Aksen Merah' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-[#0D2B45] via-[#0A1F33] to-[#06121E] border-2 border-[#D4AF37] rounded-3xl shadow-[0_0_50px_rgba(212,175,55,0.3)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Ornate Gold Border */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#08182B] border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rotate-45 bg-[#D4AF37]" />
            <h2 className="font-['Cinzel'] font-bold text-lg text-[#FFE082]">
              Lembar Karakter: Aksara (Pemandu Proseduria)
            </h2>
          </div>
          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="p-1.5 rounded-full bg-[#0D2B45] hover:bg-[#153B5C] text-slate-300 hover:text-white border border-[#D4AF37]/40 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Hero Section: Image + Bio Sheet */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 p-4 rounded-2xl bg-[#08182B]/80 border border-[#D4AF37]/40">
            {/* Mascot Image */}
            <div className="sm:col-span-4 flex flex-col items-center">
              <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-lg bg-gradient-to-b from-[#FDFCFA] via-[#FAF8F5] to-[#F1EFEA]">
                <img
                  src={PROSEDURIA_ASSETS.aksaraMascot}
                  alt="Aksara Panduan Penjelajah"
                  className="w-full h-full object-contain object-bottom"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 inset-x-2 px-2 py-1 rounded bg-[#061220]/90 text-[10px] font-mono text-center text-[#FFE082] border border-[#D4AF37]/40 backdrop-blur-sm">
                  PEMANDU RESMI PROSEDURIA
                </div>
              </div>
            </div>

            {/* Profil Data */}
            <div className="sm:col-span-8 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold font-['Cinzel'] text-white">AKSARA</h3>
                  <span className="px-3 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#FFE082] text-xs font-mono font-bold">
                    PEMANDU PROSEDURIA
                  </span>
                </div>
                <p className="text-xs text-cyan-200 mt-1 leading-relaxed">
                  Aksara adalah pemandu setia di dunia Proseduria. Dengan kecerdasan, ketelitian, dan penguasaan
                  struktur teks prosedur, Aksara membimbing para Penjelajah Logika untuk menganalisis, memperbaiki,
                  dan memulihkan kestabilan dunia dari ancaman <strong className="text-rose-400">Procedure Glitch</strong>.
                </p>
              </div>

              {/* Data Table */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-[#0D2B45]/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px] font-mono">PERAN UTAMA:</span>
                  <span className="font-bold text-white">Pemandu Penjelajah Logika</span>
                </div>
                <div className="p-2 rounded-lg bg-[#0D2B45]/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px] font-mono">WILAYAH TUGAS:</span>
                  <span className="font-bold text-amber-300">5 Zona Dunia Proseduria</span>
                </div>
                <div className="p-2 rounded-lg bg-[#0D2B45]/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px] font-mono">KEAHLIAN:</span>
                  <span className="font-bold text-cyan-300">Logika Teks Prosedur & Tata Bahasa</span>
                </div>
                <div className="p-2 rounded-lg bg-[#0D2B45]/60 border border-white/5">
                  <span className="text-slate-400 block text-[10px] font-mono">SIFAT UTAMA:</span>
                  <span className="font-bold text-emerald-300">Teliti, Bijak, Membimbing, Peduli</span>
                </div>
              </div>

              {/* Quote */}
              <div className="p-2.5 rounded-xl bg-[#061423] border-l-4 border-[#D4AF37] text-xs italic text-[#FFE082]">
                "Setiap langkahmu adalah logika. Aku akan selalu memandumu mengembalikan kestabilan Proseduria!" — Aksara
              </div>
            </div>
          </div>

          {/* Aksesoris & Perlengkapan Pemandu */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#FFE082] mb-2 block font-bold">
              Perlengkapan Pemandu Proseduria:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-[#08182B] border border-white/10 flex items-center gap-3">
                <Compass className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">Kompas Prosedur</div>
                  <div className="text-[10px] text-slate-400">Navigasi 5 Zona</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#08182B] border border-white/10 flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">Lencana Pemandu</div>
                  <div className="text-[10px] text-slate-400">Otoritas Akademi</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#08182B] border border-white/10 flex items-center gap-3">
                <Book className="w-5 h-5 text-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">Magic Logbook</div>
                  <div className="text-[10px] text-slate-400">Arsip kode & aturan</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#08182B] border border-white/10 flex items-center gap-3">
                <Radio className="w-5 h-5 text-purple-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white">Transmitor Panduan</div>
                  <div className="text-[10px] text-slate-400">Komunikasi real-time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Palet Warna Desain Karakter */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-cyan-300 mb-2 block font-bold">
              Palet Warna Karakter Pemandu:
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PALETTE.map((col) => (
                <div
                  key={col.code}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#08182B] border border-white/10"
                >
                  <span
                    className="w-4 h-4 rounded-full border border-white/40 shrink-0"
                    style={{ backgroundColor: col.code }}
                  />
                  <div className="text-[10px] font-mono">
                    <span className="text-white block font-bold">{col.name}</span>
                    <span className="text-slate-400">{col.code}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Zona Yang Dipandu */}
          <div className="p-4 rounded-2xl bg-[#061423] border border-[#D4AF37]/30">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FFE082] uppercase mb-2">
              <MapPin className="w-4 h-4 text-[#FFE082]" />
              <span>Panduan Aksara di 5 Zona Proseduria:</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
              <li><strong className="text-white">Lembah Informasi (C1-C2):</strong> Memandu mengenali tujuan, alat/bahan, dan struktur lengkap teks prosedur.</li>
              <li><strong className="text-white">Taman Bahasa (C2-C3):</strong> Membimbing penggunaan kalimat imperatif tegas, konjungsi temporal, dan takaran akurat.</li>
              <li><strong className="text-white">Sungai Logika (C3):</strong> Menuntun penyusunan urutan langkah kronologis yang tepat dan runtut.</li>
              <li><strong className="text-white">Kawasan Prosedur Rusak (C4-C5):</strong> Membantu mendiagnosis glitch dan merekonstruksi prosedur rusak.</li>
              <li><strong className="text-white">Procedure Forge (C6):</strong> Mendampingi merancang dan menyempurnakan prosedur orisinalmu sendiri.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#08182B] border-t border-[#D4AF37]/30 flex justify-end">
          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 font-bold text-xs font-mono cursor-pointer shadow-lg hover:brightness-110"
          >
            Tutup Profil Pemandu
          </button>
        </div>
      </div>
    </div>
  );
};
