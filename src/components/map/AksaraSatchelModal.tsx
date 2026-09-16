/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Compass,
  Key,
  BookOpen,
  Award,
  Sparkles,
  Shield,
  CheckCircle2,
  Lock,
  X,
  Zap,
} from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';

interface AksaraSatchelModalProps {
  isOpen: boolean;
  onClose: () => void;
  highestReachedStageIndex?: number;
}

export const AksaraSatchelModal: React.FC<AksaraSatchelModalProps> = ({
  isOpen,
  onClose,
  highestReachedStageIndex = 1,
}) => {
  if (!isOpen) return null;

  // Unlocked expedition keys based on player stage progress for the 6 Islands
  const EXPEDITION_KEYS = [
    {
      id: 'key-1',
      title: 'Kunci Segel Akademi',
      region: 'Akademi PROSEDURIA',
      desc: 'Membuka akses menara kristal safir & arsip 4 pilar teks prosedur.',
      unlocked: true,
      icon: '🏰',
    },
    {
      id: 'key-2',
      title: 'Kunci Rempah Nusantara',
      region: 'Pulau Rasa Nusantara',
      desc: 'Membuka kedai rempah tradisional & takaran presisi jamu herbal.',
      unlocked: highestReachedStageIndex >= 4,
      icon: '🌶️',
    },
    {
      id: 'key-3',
      title: 'Kunci Hutan Biosfer',
      region: 'Pulau Bumi Hijau',
      desc: 'Membuka kubah bioma kaca raksasa & panduan konservasi alam.',
      unlocked: highestReachedStageIndex >= 6,
      icon: '🌿',
    },
    {
      id: 'key-4',
      title: 'Kunci Candi Warisan',
      region: 'Pulau Warisan',
      desc: 'Membuka gapura merah candi, sanggar batik, dan alunan gamelan.',
      unlocked: highestReachedStageIndex >= 8,
      icon: '🏛️',
    },
    {
      id: 'key-5',
      title: 'Kunci Bengkel Karya',
      region: 'Pulau Karya',
      desc: 'Membuka tungku cipta mandiri untuk merancang prosedur orisinal.',
      unlocked: highestReachedStageIndex >= 10,
      icon: '⚙️',
    },
    {
      id: 'key-6',
      title: 'Kunci Gerbang Pamungkas',
      region: 'Gerbang Pembuktian',
      desc: 'Kunci mahkota tertinggi untuk menuntaskan evaluasi & kreasi C5-C6.',
      unlocked: highestReachedStageIndex >= 12,
      icon: '🌌',
    },
  ];

  // Logic guide notes collected by Aksara
  const LOGIC_NOTES = [
    {
      title: '4 Pilar Anatomi Prosedur',
      rule: 'Setiap teks prosedur wajib memiliki: 1. Tujuan, 2. Bahan/Alat, 3. Langkah Runtut, 4. Penutup/Tips.',
    },
    {
      title: 'Kaidah Verba Imperatif',
      rule: 'Gunakan kata kerja aksi langsung: "Tuangkan", "Putar", "Kunci", bukan kalimat pasif deskriptif.',
    },
    {
      title: 'Keterangan Akurat & Terukur',
      rule: 'Hindari kata ambigu seperti "secukupnya" pada reaktor kritis. Gunakan takaran pasti (contoh: 250 ml, 3 menit).',
    },
    {
      title: 'Konjungsi Urutan Waktu',
      rule: 'Rangkai tahapan secara kronologis menggunakan kata penghubung: Pertama, lalu, selanjutnya, setelah itu, terakhir.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none font-sans">
      <div className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#0B1E32] to-[#061220] border-2 border-[#D4AF37] shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-5 sm:p-6 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400 flex items-center justify-center text-amber-300 shadow">
              <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div>
              <h3 className="font-['Cinzel'] font-black text-base sm:text-lg text-[#FFE082] flex items-center gap-2">
                <span>TAS PENJELAJAH AKSARA</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">
                  EXPEDITION SATCHEL
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                Inventori Kunci Wilayah & Catatan Logika Penyelidikan
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Tutup Tas Penjelajah"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
          {/* 1. KUNCI PEMBUKA WILAYAH */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" />
                <span>KUNCI WILAYAH TERCAPAI ({EXPEDITION_KEYS.filter((k) => k.unlocked).length}/5 TERBUKA)</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-300">
                Selesaikan misi untuk membuka kunci baru
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {EXPEDITION_KEYS.map((k) => (
                <div
                  key={k.id}
                  className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                    k.unlocked
                      ? 'bg-gradient-to-br from-[#0F2D4A] to-[#08182B] border-amber-400/60 shadow-md'
                      : 'bg-[#060E18]/80 border-white/10 opacity-60'
                  }`}
                >
                  <div className="text-2xl shrink-0 p-2 rounded-xl bg-black/40 border border-white/10">
                    {k.unlocked ? k.icon : '🔒'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">{k.title}</span>
                      {k.unlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-cyan-300">{k.region}</div>
                    <p className="text-[11px] text-slate-300 leading-snug mt-1">
                      {k.unlocked ? k.desc : 'Selesaikan misi zona sebelumnya untuk mendapatkan kunci ini.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. CATATAN LOGIKA PENJELAJAH */}
          <div>
            <div className="text-xs font-mono font-bold text-cyan-300 mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>CATATAN PANDUAN TEKS PROSEDUR (BUKU SAKU AKSARA)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {LOGIC_NOTES.map((note, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-[#081626] border border-cyan-500/30 shadow-sm"
                >
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{note.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    {note.rule}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1 text-[#FFE082]">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Aksara • Penjelajah Logika Nusantara</span>
          </span>
          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold hover:brightness-110 cursor-pointer shadow"
          >
            Tutup Tas
          </button>
        </div>
      </div>
    </div>
  );
};
