/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../utils/audioEffects';
import {
  X,
  BookOpen,
  Palette,
  Layers,
  Sparkles,
  Volume2,
  Cpu,
  BookmarkCheck,
} from 'lucide-react';

interface ArtBibleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArtBibleModal: React.FC<ArtBibleModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'PEDAGOGY' | 'VISUAL' | 'COLOR' | 'AUDIO'>('PEDAGOGY');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#08131F] border border-[#D4AF37]/50 rounded-2xl shadow-[0_0_60px_rgba(212,175,55,0.25)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0D2B45]/90 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#FFE082] border border-[#D4AF37]/40">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Cinzel'] font-bold text-base text-white">
                Art Bible & Desain Sistem Pedagogis
              </h2>
              <p className="text-[11px] font-mono text-[#FFE082]/80">
                CHRONO-AKSARA // ARSIP SPESIFIKASI DESAIN & KURIKULUM
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 bg-[#08131F]/90">
          {[
            { id: 'PEDAGOGY', label: 'Kurikulum & Bloom C1-C6', icon: Layers },
            { id: 'VISUAL', label: 'Konsep Visual & Tipografi', icon: Sparkles },
            { id: 'COLOR', label: 'Palet Warna & UI Token', icon: Palette },
            { id: 'AUDIO', label: 'Arsitektur Audio Web Synthesizer', icon: Volume2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playChime('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`py-3 px-3 sm:px-4 text-xs font-mono font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#D4AF37] text-[#FFE082] bg-[#D4AF37]/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'PEDAGOGY' && (
            <div className="space-y-4 text-sm text-slate-300 font-sans">
              <div className="p-4 rounded-xl bg-[#0D2B45]/50 border border-white/10">
                <h3 className="font-['Cinzel'] font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <BookmarkCheck className="w-4 h-4 text-[#00F2FE]" />
                  Taksonomi Bloom Terintegrasi (C1 - C6)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Permainan ini dirancang dengan alur bertahap (scaffolding) untuk memastikan peserta didik
                  menguasai Teks Prosedur secara menyeluruh dari identifikasi dasar hingga kreasi mandiri:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="font-mono font-bold text-cyan-400 block mb-1">C1 - Mengingat & Mengidentifikasi</span>
                    Mengenal 4 struktur (Tujuan, Material/Alat, Langkah-langkah, Penutup) di Lembah Informasi.
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="font-mono font-bold text-amber-400 block mb-1">C2 - Memahami Ciri Kebahasaan</span>
                    Memahami kalimat imperatif, konjungsi temporal, dan adverbia cara/takaran.
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="font-mono font-bold text-sky-400 block mb-1">C3 - Menerapkan / Mengurutkan</span>
                    Menyusun puzzle urutan instruksi acak berdasarkan alur logika kronologis.
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="font-mono font-bold text-rose-400 block mb-1">C4 - Menganalisis Glitch</span>
                    Mendeteksi kalimat ambigu, urutan terbalik, dan kalimat pasif non-standar.
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="font-mono font-bold text-emerald-400 block mb-1">C5 - Mengevaluasi & Menguji</span>
                    Memperbaiki teks di bengkel rekonstruksi dan menguji simulasi reaktor 100%.
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                    <span className="font-mono font-bold text-purple-400 block mb-1">C6 - Mencipta (Procedure Forge)</span>
                    Merumuskan teks prosedur baru lengkap dengan verifikasi linting imperatif otomatis.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'VISUAL' && (
            <div className="space-y-4 text-xs text-slate-300 font-sans">
              <div className="p-4 rounded-xl bg-[#0D2B45]/50 border border-white/10 space-y-3">
                <h3 className="font-['Cinzel'] font-bold text-white text-sm">
                  Gaya Desain: Neo-Heritage Cyber-Nusantara
                </h3>
                <p className="leading-relaxed">
                  Perpaduan antara ornamen sakral Nusantara (aksara Kawi, Jawa, Sunda, Batak, serta fraktal Kawung)
                  dengan estetika antarmuka fiksi ilmiah (holographic HUD, scanlines, neon circuitry, dan deep cosmic darkness).
                </p>
                <div className="p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-[11px] space-y-1">
                  <div><strong>Heading Display:</strong> Cinzel (Serif megah klasik Nusantara)</div>
                  <div><strong>Subheading / HUD:</strong> Rajdhani (Cyberpunk geometric sans)</div>
                  <div><strong>Body / Instruksi:</strong> Plus Jakarta Sans (Sangat terbaca pada layar digital)</div>
                  <div><strong>Data & Kode:</strong> Space Mono (Format monospaced untuk kode & sintaks)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COLOR' && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: 'Void Deep Navy', hex: '#08131F', desc: 'Latar belakang kanvas kosmis' },
                  { name: 'Cyber Hologram Cyan', hex: '#00F2FE', desc: 'Aksentuasi data & elemen interaktif' },
                  { name: 'Majapahit Royal Gold', hex: '#D4AF37', desc: 'Penghargaan, aksara suci & status tinggi' },
                  { name: 'Glitch Anomaly Crimson', hex: '#FF0055', desc: 'Indikator kesalahan sintaksis & peringatan' },
                  { name: 'Harmonic Sync Emerald', hex: '#10B981', desc: 'Validasi kebenaran prosedur & keberhasilan' },
                ].map((color, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#0D2B45]/40 border border-white/10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg shrink-0 border border-white/20 shadow" style={{ backgroundColor: color.hex }} />
                    <div>
                      <div className="text-xs font-bold text-white">{color.name}</div>
                      <div className="text-[11px] font-mono text-cyan-300">{color.hex}</div>
                      <div className="text-[10px] text-slate-400">{color.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'AUDIO' && (
            <div className="p-4 rounded-xl bg-[#0D2B45]/50 border border-white/10 space-y-3 text-xs text-slate-300">
              <h3 className="font-['Cinzel'] font-bold text-white text-sm">
                Web Audio API Synthesizer (Tanpa File Eksternal)
              </h3>
              <p className="leading-relaxed">
                Semua efek suara disintesis secara real-time langsung melalui Web Audio API native browser:
              </p>
              <ul className="list-disc list-inside space-y-1.5 font-mono text-[11px] text-slate-300">
                <li><strong>Glitch Chime:</strong> Sawtooth wave frekuensi 160Hz - 80Hz dengan pitch flutter distorsi.</li>
                <li><strong>Gold Gamelan Chime:</strong> Tangga nada pentatonik Slendro (523Hz, 659Hz, 783Hz, 1046Hz).</li>
                <li><strong>Cyan Hologram Sine:</strong> Frekuensi 440Hz - 880Hz ascending sweep.</li>
                <li><strong>Repair Harmonics:</strong> Arpeggio harmonik nada ketiga dan kelima saat langkah diperbaiki.</li>
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0D2B45]/90 border-t border-[#D4AF37]/30 flex justify-end">
          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#FFE082] text-[#08131F] font-bold text-xs font-mono transition-colors"
          >
            Tutup Art Bible
          </button>
        </div>
      </div>
    </div>
  );
};
