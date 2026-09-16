/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Compass,
  Briefcase,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  ChevronRight,
  Info,
  ShieldCheck,
  Search,
  Eye,
  Sliders,
  Upload,
} from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';
import { aksaraVoice } from '../../utils/aksaraVoice';
import { AksaraCharacterVisual } from './AksaraCharacterVisual';
import { AksaraBustVisual } from './AksaraBustVisual';

export type AksaraExpression =
  | 'NORMAL'
  | 'SENANG'
  | 'BERSEMANGAT'
  | 'TERKEJUT'
  | 'BERPIKIR'
  | 'BINGUNG'
  | 'SEDIH'
  | 'KHAWATIR'
  | 'FOKUS'
  | 'MENYELIDIKI'
  | 'TAKJUB'
  | 'SUKSES';

export interface ExpressionDetail {
  id: AksaraExpression;
  name: string;
  emoji: string;
  desc: string;
  dialogue: string;
  contextUsage: string;
  color: string;
  badge: string;
}

export const AKSARA_EXPRESSIONS: ExpressionDetail[] = [
  {
    id: 'NORMAL',
    name: 'Normal',
    emoji: '🙂',
    desc: 'Wajah tenang dan percaya diri sebagai penjelajah logika.',
    dialogue: 'Setiap langkah membentuk logika, setiap logika memperbaiki dunia.',
    contextUsage: 'Posisi santai di beranda dan navigasi umum peta.',
    color: '#38BDF8',
    badge: 'Siaga',
  },
  {
    id: 'SENANG',
    name: 'Senang',
    emoji: '😄',
    desc: 'Senyuman ramah menyambut kedatangan penjelajah baru.',
    dialogue: 'Selamat datang di Akademi Proseduria! Senang sekali bisa belajar bersamamu!',
    contextUsage: 'Saat membuka game dan menyapa pemain.',
    color: '#34D399',
    badge: 'Ramah',
  },
  {
    id: 'BERSEMANGAT',
    name: 'Bersemangat',
    emoji: '✊😃',
    desc: 'Mengepalkan tangan dengan tekad kuat memulai misi.',
    dialogue: 'Ayo kita selesaikan seluruh anomali ini sampai tuntas! Kita pasti bisa!',
    contextUsage: 'Saat memulai misi baru atau menantang teka-teki.',
    color: '#F59E0B',
    badge: 'Motivasi',
  },
  {
    id: 'TERKEJUT',
    name: 'Terkejut',
    emoji: '😲',
    desc: 'Mata membulat saat mendeteksi anomali teks yang ganjil.',
    dialogue: 'Astaga! Mengapa langkah penutupan ditaruh sebelum langkah persiapan?!',
    contextUsage: 'Saat menemukan glitch urutan terbalik di reaktor.',
    color: '#FB923C',
    badge: 'Waspada',
  },
  {
    id: 'BERPIKIR',
    name: 'Berpikir',
    emoji: '🤔',
    desc: 'Tangan menopang dagu, menimbang kaidah bahasa yang tepat.',
    dialogue: 'Hmm... Apakah kata ini termasuk verba imperatif atau kalimat pasif deskriptif?',
    contextUsage: 'Saat memilih pasangan bukti di Papan Hubung Bukti.',
    color: '#818CF8',
    badge: 'Analisis',
  },
  {
    id: 'BINGUNG',
    name: 'Bingung',
    emoji: '❔😅',
    desc: 'Menggaruk kepala karena takaran resep yang ambigu.',
    dialogue: '"Masukkan secukupnya"? Secukupnya itu berapa gram?! Ini sangat berbahaya!',
    contextUsage: 'Saat mendeteksi takaran tidak terukur dalam resep jamu.',
    color: '#A78BFA',
    badge: 'Tanya',
  },
  {
    id: 'SEDIH',
    name: 'Sedih',
    emoji: '😔',
    desc: 'Melihat benua Nusantara mengalami mati lampu karena SOP rusak.',
    dialogue: 'Jika prosedur ini tidak diperbaiki, reaktor bioplasma akan padam total...',
    contextUsage: 'Saat melihat visual benua terdistorsi anomali.',
    color: '#64748B',
    badge: 'Empati',
  },
  {
    id: 'KHAWATIR',
    name: 'Khawatir',
    emoji: '😟',
    desc: 'Meringis cemas karena suhu reaktor mendekati batas kritis.',
    dialogue: 'Waspada! Suhu reaktor melonjak! Kita harus segera memasang takaran pendingin presisi!',
    contextUsage: 'Saat terjadi alarm bahaya di simulator uji reaktor.',
    color: '#F43F5E',
    badge: 'Bahaya',
  },
  {
    id: 'FOKUS',
    name: 'Fokus',
    emoji: '🧐📱',
    desc: 'Menatap layar holoscreen data sintaksis dengan konsentrasi tinggi.',
    dialogue: 'Memindai struktur 4 pilar... Tujuan: Ada. Alat: Ada. Langkah kerja: Ada.',
    contextUsage: 'Saat proses rekonstruksi kalimat di Bengkel Rekonstruksi.',
    color: '#06B6D4',
    badge: 'Konsentrasi',
  },
  {
    id: 'MENYELIDIKI',
    name: 'Menyelidiki',
    emoji: '🔍🧐',
    desc: 'Memegang kaca pembesar mencari kejanggalan konjungsi temporal.',
    dialogue: 'Aha! Ada konjungsi yang tersembunyi dan verba pasif yang menyamar!',
    contextUsage: 'Saat investigasi forensik dokumen SOP reaktor.',
    color: '#EAB308',
    badge: 'Investigasi',
  },
  {
    id: 'TAKJUB',
    name: 'Takjub',
    emoji: '🤩✨',
    desc: 'Terpesona menyaksikan kubah energi kembali memancarkan sinar zamrud.',
    dialogue: 'Indah sekali! Lihat bagaimana aliran logikanya kini berjalan mulus tanpa cacat!',
    contextUsage: 'Saat reaktor mencapai stabilitas 100%.',
    color: '#22D3EE',
    badge: 'Kagum',
  },
  {
    id: 'SUKSES',
    name: 'Sukses',
    emoji: '👍⭐',
    desc: 'Mengacungkan jempol kebanggaan dengan bintang keberhasilan.',
    dialogue: 'Kerja luar biasa! Teks prosedurnya sempurna dan dunia kembali pulih!',
    contextUsage: 'Saat meraih bintang 3 dan piala penghargaan.',
    color: '#10B981',
    badge: 'Juara',
  },
];

interface AksaraCharacterSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExpression?: (expr: AksaraExpression) => void;
  currentExpression?: AksaraExpression;
}

export const AksaraCharacterSheetModal: React.FC<AksaraCharacterSheetModalProps> = ({
  isOpen,
  onClose,
  onSelectExpression,
  currentExpression = 'NORMAL',
}) => {
  const [activeTab, setActiveTab] = useState<'PROFIL' | 'EKSPRESI' | 'TURNAROUND' | 'AKSESORI'>('PROFIL');
  const [selectedExpr, setSelectedExpr] = useState<AksaraExpression>(currentExpression);
  const [activeTurnaround, setActiveTurnaround] = useState<'DEPAN' | 'DEPAN_3_4' | 'SAMPING' | 'BELAKANG' | 'BELAKANG_3_4'>('DEPAN');

  if (!isOpen) return null;

  const currentExprDetail = AKSARA_EXPRESSIONS.find((e) => e.id === selectedExpr) || AKSARA_EXPRESSIONS[0];

  const handleSpeakDialogue = (text: string) => {
    soundFX.playChime('cyan');
    aksaraVoice.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#08131F] border-2 border-[#D4AF37] rounded-3xl shadow-[0_0_60px_rgba(212,175,55,0.4)] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0D2B45] border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg border border-amber-200">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-['Cinzel'] text-[#FFE082]">
                  Aksara • Penjelajah Logika
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/40">
                  Tokoh Resmi
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-300">
                Lembar Karakter Resmi (Character Sheet) • Sahabat Petualangan Teks Prosedur
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 px-6 bg-[#06101B] overflow-x-auto">
          {[
            { id: 'PROFIL', label: 'Profil & Biodata', icon: Info },
            { id: 'EKSPRESI', label: '12 Ekspresi Emosi', icon: Sparkles },
            { id: 'TURNAROUND', label: 'Turnaround 360°', icon: Eye },
            { id: 'AKSESORI', label: 'Kompas & Tas Penjelajah', icon: Briefcase },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundFX.playChime('click');
                  setActiveTab(tab.id as typeof activeTab);
                }}
                className={`py-3 px-4 text-xs font-mono font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-[#D4AF37] text-[#FFE082] bg-[#D4AF37]/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-200 font-sans">
          {/* TAB 1: PROFIL & BIODATA */}
          {activeTab === 'PROFIL' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Character Visual Card */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative w-full aspect-[3/4] max-w-[280px] rounded-3xl bg-gradient-to-b from-[#0E2841] via-[#0A1A2A] to-[#06101B] border-2 border-[#D4AF37] p-3 flex flex-col items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  {/* Floating Halo Compass */}
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                    <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
                  </div>

                  {/* Character Illustration Representation */}
                  <div className="w-full flex-1 flex items-center justify-center relative">
                    <div className="relative flex flex-col items-center justify-center py-2">
                      <AksaraCharacterVisual
                        expression={selectedExpr}
                        size={210}
                        compassGlowing={true}
                      />
                      <div className="mt-1 px-3 py-0.5 rounded-full bg-[#08182B] border border-amber-400 text-[10px] font-mono font-bold text-amber-300 shadow">
                        {currentExprDetail.name}
                      </div>

                      {/* Character Outfit Highlights */}
                      <div className="mt-2 text-center">
                        <div className="text-xs font-mono text-cyan-300 font-bold">
                          Jaket Penjelajah Biru Dongker
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Lambang Bintang Kompas Emas & Celana Kargo
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motto Plaque */}
                  <div className="w-full p-2.5 rounded-2xl bg-[#08182B] border border-[#D4AF37]/50 text-center">
                    <div className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                      Motto Filosofis Aksara
                    </div>
                    <p className="text-xs font-serif italic text-slate-200 mt-1 leading-snug">
                      "Setiap langkah membentuk logika, setiap logika memperbaiki dunia."
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakDialogue(currentExprDetail.dialogue)}
                  className="mt-3 w-full max-w-[280px] py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 cursor-pointer shadow-md"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Dengarkan Suara Aksara</span>
                </button>
              </div>

              {/* Right Column: Bio Specifications */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-4 rounded-2xl bg-[#0A1D30] border border-white/10 space-y-3">
                  <h3 className="font-['Cinzel'] font-bold text-[#FFE082] text-sm flex items-center gap-2 border-b border-white/10 pb-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    Biodata Resmi Tokoh
                  </h3>

                  <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">NAMA</span>
                      <span className="text-amber-300 font-bold">Aksara</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">USIA</span>
                      <span className="text-emerald-300 font-bold">14 Tahun (Siswa SMP Kelas IX)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">PERAN</span>
                      <span className="text-cyan-300 font-bold">Penjelajah Logika (Logic Explorer)</span>
                    </div>
                    <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                      <span className="text-slate-400 block text-[10px]">ASAL AKADEMI</span>
                      <span className="text-amber-300 font-bold">Akademi Proseduria</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <span className="text-slate-400 block text-[10px] font-mono">SIFAT & KEPRIBADIAN</span>
                    <p className="text-xs text-slate-200">
                      Cerdas, ingin tahu yang tinggi, tekun, berani mengambil tindakan terukur, dan memiliki empati mendalam terhadap peradaban masyarakat Nusantara.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-1">
                    <span className="text-slate-400 block text-[10px] font-mono">TUJUAN PETUALANGAN</span>
                    <p className="text-xs text-slate-200">
                      Memahami, memverifikasi, dan memperbaiki seluruh anomali teks prosedur di kepulauan Proseduria agar mesin reaktor dan tatanan masyarakat kembali harmonis.
                    </p>
                  </div>
                </div>

                {/* Pedagogy Link */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-400/40">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300 mb-1">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Peran Pedagogis dalam Game:</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Aksara bertindak sebagai <em>pedagogical companion</em> cerdas yang mendampingi siswa, memberikan petunjuk berbasis scaffold, membimbing analisis kalimat imperatif, dan merefleksikan keberhasilan perbaikan SOP.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 12 EKSPRESI EMOSI */}
          {activeTab === 'EKSPRESI' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-['Cinzel'] font-bold text-[#FFE082] text-sm">
                    12 Ragam Ekspresi Karakter Aksara
                  </h3>
                  <p className="text-xs text-slate-300 font-mono">
                    Setiap ekspresi mencerminkan reaksi emosional dan kognitif saat menghadapi teks prosedur.
                  </p>
                </div>
                {onSelectExpression && (
                  <button
                    onClick={() => {
                      onSelectExpression(selectedExpr);
                      soundFX.playChime('victory');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Gunakan Ekspresi Ini</span>
                  </button>
                )}
              </div>

              {/* Grid of 12 Expressions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {AKSARA_EXPRESSIONS.map((expr) => {
                  const isSelected = selectedExpr === expr.id;
                  return (
                    <div
                      key={expr.id}
                      onClick={() => {
                        soundFX.playChime('click');
                        setSelectedExpr(expr.id);
                      }}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center relative ${
                        isSelected
                          ? 'bg-[#0E2841] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-102'
                          : 'bg-[#08182B]/80 hover:bg-[#0E2841]/70 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="mb-1.5 flex items-center justify-center">
                        <AksaraBustVisual expression={expr.id} size={52} />
                      </div>
                      <div className="font-['Cinzel'] font-bold text-xs text-white">
                        {expr.name}
                      </div>
                      <span
                        className="text-[9px] font-mono px-2 py-0.5 rounded-full mt-1 font-bold"
                        style={{ backgroundColor: `${expr.color}20`, color: expr.color }}
                      >
                        {expr.badge}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                        {expr.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Selected Expression Preview Card */}
              <div className="p-4 rounded-2xl bg-[#0D2B45] border border-[#D4AF37]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AksaraBustVisual expression={selectedExpr} size={64} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#FFE082]">
                        Aksara ({currentExprDetail.name})
                      </span>
                      <span className="text-xs font-mono text-cyan-300">
                        • Digunakan pada: {currentExprDetail.contextUsage}
                      </span>
                    </div>
                    <p className="text-xs italic text-slate-200 mt-0.5">
                      "{currentExprDetail.dialogue}"
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleSpeakDialogue(currentExprDetail.dialogue)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-1.5 shrink-0 cursor-pointer shadow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ucapkan Kalimat</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TURNAROUND 360 */}
          {activeTab === 'TURNAROUND' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-['Cinzel'] font-bold text-[#FFE082] text-sm">
                  Turnaround Model Karakter (360°)
                </h3>
                <p className="text-xs text-slate-300 font-mono">
                  Panduan sudut pandang anatomi karakter dari 5 orientasi visual.
                </p>
              </div>

              {/* Turnaround Selector */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'DEPAN', label: 'Tampak Depan' },
                  { id: 'DEPAN_3_4', label: 'Tampak Depan 3/4' },
                  { id: 'SAMPING', label: 'Tampak Samping' },
                  { id: 'BELAKANG', label: 'Tampak Belakang' },
                  { id: 'BELAKANG_3_4', label: 'Tampak Belakang 3/4' },
                ].map((pos) => {
                  const isActive = activeTurnaround === pos.id;
                  return (
                    <button
                      key={pos.id}
                      onClick={() => {
                        soundFX.playChime('click');
                        setActiveTurnaround(pos.id as typeof activeTurnaround);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 border-amber-300 shadow'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      {pos.label}
                    </button>
                  );
                })}
              </div>

              {/* Visual Showcase Box */}
              <div className="p-6 rounded-3xl bg-gradient-to-b from-[#0B2035] to-[#06101B] border-2 border-[#D4AF37]/50 flex flex-col items-center justify-center min-h-[280px]">
                <div className="w-48 h-56 rounded-2xl bg-black/40 border border-cyan-400/30 flex flex-col items-center justify-center p-4 relative shadow-inner">
                  {/* Visual Compass Graphic on character's back/chest */}
                  <div className="w-24 h-24 rounded-full border-2 border-amber-400/80 bg-amber-400/10 flex items-center justify-center relative mb-3">
                    <Compass className="w-12 h-12 text-amber-300 animate-spin" style={{ animationDuration: '20s' }} />
                  </div>
                  <div className="font-['Cinzel'] font-bold text-sm text-[#FFE082]">
                    Sudut {activeTurnaround.replace('_', ' ')}
                  </div>
                  <div className="text-[11px] font-mono text-cyan-300 mt-1">
                    {activeTurnaround.includes('BELAKANG')
                      ? 'Emblem Lambang Bintang Kompas Emas Terlihat Jelas di Punggung'
                      : activeTurnaround.includes('SAMPING')
                      ? 'Tali Selempang Tas Kulit Cokelat & Wristband Kompas'
                      : 'Jaket Biru Dongker, Kemeja Putih, Kompas Prosedur Menyala'}
                  </div>
                </div>

                <div className="mt-4 max-w-md text-center text-xs text-slate-300 leading-relaxed font-sans">
                  Karakter dirancang dengan proporsi ramah remaja (usia 14 tahun), memadukan estetika modern (hoodie, cargo pants) dengan sentuhan ornamen emas khas kepulauan Nusantara.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AKSESORI KHUSUS */}
          {activeTab === 'AKSESORI' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Aksesori 1: Kompas Prosedur */}
              <div className="p-5 rounded-3xl bg-[#0A1D30] border-2 border-[#D4AF37] space-y-3 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400">
                      <Compass className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-['Cinzel'] font-bold text-sm text-[#FFE082]">
                        Kompas Prosedur (Procedural Compass)
                      </h4>
                      <span className="text-[10px] font-mono text-cyan-300">Pusaka Analisis Sintaksis</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Kompas perunggu antik berkilau safir biru di tangannya. Kompas ini tidak menunjukkan arah mata angin utara/selatan, melainkan menganalisis kelogisan urutan langkah dan mendeteksi verba imperatif yang keliru.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-amber-300">
                  ⚡ Fitur: Sensor takaran ambigu, pemindai verba perintah, penentu arah rekonstruksi.
                </div>
              </div>

              {/* Aksesori 2: Tas Penjelajah */}
              <div className="p-5 rounded-3xl bg-[#0A1D30] border-2 border-[#D4AF37] space-y-3 flex flex-col justify-between shadow-lg">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-['Cinzel'] font-bold text-sm text-[#FFE082]">
                        Tas Penjelajah (Explorer's Satchel)
                      </h4>
                      <span className="text-[10px] font-mono text-amber-300">Inventaris Lapangan</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tas selempang berbahan kulit cokelat tebal dengan gesper perunggu bermotif kompas. Berisi alat tulis, jurnal catatan logika 4 pilar, kaca pembesar investigasi, dan tabung sampel fragmen teks kuno.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[11px] font-mono text-emerald-300">
                  🎒 Isi: Jurnal Prosedur, Kuas Pembersih Glitch, Kaca Pembesar Kata, Tabung Presisi.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#06101B] border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
          <div>PROSEDURIA • Tokoh Aksara Berdasarkan Lembar Karakter Resmi</div>
          <button
            onClick={() => {
              soundFX.playChime('click');
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            Tutup Lembar Karakter
          </button>
        </div>
      </div>
    </div>
  );
};
