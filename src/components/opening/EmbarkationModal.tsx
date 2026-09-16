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
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  Search,
  Wrench,
  Trophy,
} from 'lucide-react';

interface EmbarkationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMap: () => void;
}

export const EmbarkationModal: React.FC<EmbarkationModalProps> = ({
  isOpen,
  onClose,
  onOpenMap,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-[#0D2B45] via-[#0A1F33] to-[#06121E] border-2 border-[#D4AF37] rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.4)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#08182B] border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 flex items-center justify-center text-[#FFE082] border border-[#D4AF37]/50 shadow-md">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Cinzel'] font-bold text-base text-[#FFE082]">
                Direktif Ekspedisi Proseduria
              </h2>
              <p className="text-[11px] font-mono text-cyan-300">
                MISI PEMULIHAN DUNIA TEKS PROSEDUR • FASE D
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="p-1.5 rounded-full bg-[#0D2B45] hover:bg-[#153B5C] text-slate-300 hover:text-white border border-[#D4AF37]/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-200">
              <strong className="block text-rose-300 font-mono mb-0.5">PERINGATAN ANOMALI KERANCUAN PROSEDUR!</strong>
              Dunia Proseduria terdistorsi karena langkah yang salah, urutan acak, kalimat ambigu, dan informasi hilang.
              Kestabilan energi bioplasma reaktor bergantung pada ketelitian analisis bahasamu.
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#FFE082] font-bold">
              3 Langkah Misi Utama Penjelajah:
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-[#08182B] border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-sky-400/40">
                  1
                </span>
                <p className="text-xs text-slate-200">
                  <strong className="text-white">Amati & Temukan Informasi:</strong> Jelajahi Lembah Informasi,
                  identifikasi struktur 4 bagian teks (Tujuan, Alat/Bahan, Langkah, Penutup).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#08182B] border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-amber-400/40">
                  2
                </span>
                <p className="text-xs text-slate-200">
                  <strong className="text-white">Analisis & Perbaiki Kerancuan:</strong> Susun alur urutan logis, ubah
                  kalimat pasif menjadi kalimat perintah imperatif aktif, dan rekonstruksi teks rusak di papan bukti.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#08182B] border border-white/10 flex items-start gap-3">
                <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-400/40">
                  3
                </span>
                <p className="text-xs text-slate-200">
                  <strong className="text-white">Rancang & Buktikan Kemahiran:</strong> Ciptakan teks prosedur orisinalmu di
                  Tungku Cipta Prosedur, raih 6 lencana kehormatan, dan piala Maestro Penjelajah Logika!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 bg-[#08182B] border-t border-[#D4AF37]/40 flex items-center justify-between">
          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
          >
            Batal
          </button>

          <button
            onClick={() => {
              soundFX.playChime('gold');
              onOpenMap();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#B38728] hover:brightness-110 text-slate-950 font-['Cinzel'] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(212,175,55,0.5)] cursor-pointer transition-all transform hover:scale-105"
          >
            <span>Buka Peta 6 Wilayah</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
