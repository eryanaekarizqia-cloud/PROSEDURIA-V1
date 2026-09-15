/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import {
  ArrowLeft,
  ChevronRight,
  Flame,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Download,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';

interface ProcedureForgeProps {
  onProceedToMastery: () => void;
  onBackToMap: () => void;
}

interface StepItem {
  id: string;
  conjunction: string;
  action: string;
}

const TEMPLATES = [
  {
    title: 'Prosedur Kalibrasi Drone Penjaga Hutan Hujan Kalimantan',
    purpose: 'Mengoptimalkan sensor inframerah dan baling-baling foton drone penjaga hutan agar mendeteksi kebakaran vegetasi secara presisi.',
    materials: ['1 unit drone penjaga tipe Cenderawasih', '2 botol cairan pembersih optik kuantum', '1 unit komputer tablet navigasi'],
    steps: [
      { id: '1', conjunction: 'Pertama-tama', action: 'Periksalah kondisi fisik baling-baling dari serpihan debu hutan.' },
      { id: '2', conjunction: 'Setelah itu', action: 'Semprotkan 5 ml cairan pembersih optik pada lensa sensor inframerah.' },
      { id: '3', conjunction: 'Kemudian', action: 'Nyalakan sakelar daya utama hingga lampu indikator biru berkedip tiga kali.' },
      { id: '4', conjunction: 'Selanjutnya', action: 'Sinkronisasikan koordinat radar satelit melalui tablet navigasi selama 2 menit.' },
      { id: '5', conjunction: 'Akhirnya', action: 'Terbangkan drone pada ketinggian 15 meter untuk menguji stabilitas motor giroskop.' },
    ],
    tips: 'Pastikan baterai drone berada di atas 80% sebelum melakukan kalibrasi penerbangan.',
  },
  {
    title: 'Resep Pembuatan Rendang Berenergi Foton Nusantara',
    purpose: 'Menciptakan sajian rendang tradisional dengan pematangan foton kilat tanpa mengurangi kelezatan rempah khas Minangkabau.',
    materials: ['1 kg daging sintetis protein tinggi', '1.000 ml santan kelapa murni', '150 gram pasta bumbu rendang rempah kelapa', '1 unit panci induksi foton'],
    steps: [
      { id: '1', conjunction: 'Pertama-tama', action: 'Potonglah daging menjadi 20 bagian berbentuk dadu berukuran 4x4 cm.' },
      { id: '2', conjunction: 'Setelah itu', action: 'Campurkan pasta bumbu rempah bersama santan kelapa ke dalam panci induksi.' },
      { id: '3', conjunction: 'Kemudian', action: 'Aduklah larutan santan secara konstan pada suhu 85°C hingga mengeluarkan minyak aromatik.' },
      { id: '4', conjunction: 'Selanjutnya', action: 'Masukkan potongan daging dan masak dengan panci bertekanan selama 30 menit.' },
      { id: '5', conjunction: 'Akhirnya', action: 'Keringkan kuah bumbu hingga berwarna cokelat pekat kehitaman yang menggugah selera.' },
    ],
    tips: 'Gunakan pengaduk berbahan kayu untuk menjaga cita rasa otentik rempah Nusantara.',
  },
];

export const ProcedureForge: React.FC<ProcedureForgeProps> = ({
  onProceedToMastery,
  onBackToMap,
}) => {
  const [title, setTitle] = useState(TEMPLATES[0].title);
  const [purpose, setPurpose] = useState(TEMPLATES[0].purpose);
  const [materials, setMaterials] = useState<string[]>(TEMPLATES[0].materials);
  const [steps, setSteps] = useState<StepItem[]>(TEMPLATES[0].steps);
  const [tips, setTips] = useState(TEMPLATES[0].tips);
  const [copied, setCopied] = useState(false);

  // Add/Remove Material
  const addMaterial = () => {
    soundFX.playChime('click');
    setMaterials([...materials, '']);
  };
  const updateMaterial = (index: number, val: string) => {
    const updated = [...materials];
    updated[index] = val;
    setMaterials(updated);
  };
  const removeMaterial = (index: number) => {
    soundFX.playChime('click');
    setMaterials(materials.filter((_, i) => i !== index));
  };

  // Add/Remove Step
  const addStep = () => {
    soundFX.playChime('click');
    setSteps([
      ...steps,
      { id: String(Date.now()), conjunction: 'Selanjutnya', action: '' },
    ]);
  };
  const updateStep = (index: number, field: 'conjunction' | 'action', val: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: val };
    setSteps(updated);
  };
  const removeStep = (index: number) => {
    soundFX.playChime('click');
    setSteps(steps.filter((_, i) => i !== index));
  };

  const loadTemplate = (idx: number) => {
    soundFX.playChime('gold');
    const t = TEMPLATES[idx];
    setTitle(t.title);
    setPurpose(t.purpose);
    setMaterials([...t.materials]);
    setSteps([...t.steps]);
    setTips(t.tips);
  };

  // Automated Linting Check
  const hasTitleAndPurpose = title.trim().length > 5 && purpose.trim().length > 10;
  const hasEnoughMaterials = materials.filter((m) => m.trim().length > 2).length >= 2;
  const hasEnoughSteps = steps.filter((s) => s.action.trim().length > 5).length >= 3;
  const hasTips = tips.trim().length > 5;

  let qualityScore = 0;
  if (hasTitleAndPurpose) qualityScore += 25;
  if (hasEnoughMaterials) qualityScore += 25;
  if (hasEnoughSteps) qualityScore += 35;
  if (hasTips) qualityScore += 15;

  const copyToClipboard = () => {
    soundFX.playChime('cyan');
    const formatted = `${title}\n\n[TUJUAN]\n${purpose}\n\n[ALAT DAN BAHAN]\n${materials
      .map((m, i) => `${i + 1}. ${m}`)
      .join('\n')}\n\n[LANGKAH-LANGKAH]\n${steps
      .map((s, i) => `${i + 1}. ${s.conjunction}, ${s.action}`)
      .join('\n')}\n\n[TIPS & PENUTUP]\n${tips}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full h-full pt-16 pb-6 px-4 sm:px-8 flex flex-col justify-between overflow-y-auto">
      <div className="absolute inset-0 bg-[#08131F] opacity-95 z-0" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFX.playChime('click');
              onBackToMap();
            }}
            className="p-2 rounded-xl bg-[#0D2B45]/80 hover:bg-[#0D2B45] text-slate-300 hover:text-white border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Peta</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30">
                TAHAP 11 // C6 CREATING
              </span>
              <span className="text-xs font-mono text-cyan-400">Kreasi Orisinal Mandiri</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Procedure Forge: Studio Penciptaan Teks
            </h1>
          </div>
        </div>

        {/* Template Pickers */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">Pilih Inspirasi:</span>
          <button
            onClick={() => loadTemplate(0)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-cyan-300 cursor-pointer"
          >
            Drone Penjaga Hutan
          </button>
          <button
            onClick={() => loadTemplate(1)}
            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-amber-300 cursor-pointer"
          >
            Rendang Foton
          </button>
        </div>
      </div>

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox stageKey="procedure_forge" className="mb-3" />

      {/* Editor & Preview Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-5 flex-1 my-2">
        {/* Left Column: Interactive Form Builder */}
        <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-pink-500/30 backdrop-blur-md space-y-4 overflow-y-auto max-h-[62vh]">
          {/* Judul & Tujuan */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-pink-300 font-bold block">
              1. Judul & Tujuan Prosedur:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Prosedur Pengoperasian Drone..."
              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-bold text-xs focus:border-[#00F2FE] outline-none"
            />
            <textarea
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Tuliskan tujuan yang hendak dicapai..."
              className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-xs focus:border-[#00F2FE] outline-none font-sans"
            />
          </div>

          {/* Alat dan Bahan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-amber-300 font-bold block">
                2. Alat & Bahan (Beserta Takaran):
              </label>
              <button
                onClick={addMaterial}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Bahan
              </button>
            </div>
            <div className="space-y-1.5">
              {materials.map((mat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400 w-4">{idx + 1}.</span>
                  <input
                    type="text"
                    value={mat}
                    onChange={(e) => updateMaterial(idx, e.target.value)}
                    placeholder="Contoh: 250 ml cairan..."
                    className="flex-1 p-2 rounded-lg bg-black/30 border border-white/10 text-xs text-white outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={() => removeMaterial(idx)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Langkah-Langkah */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold block">
                3. Langkah-Langkah (Konjungsi & Perintah Imperatif):
              </label>
              <button
                onClick={addStep}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Langkah
              </button>
            </div>
            <div className="space-y-2">
              {steps.map((st, idx) => (
                <div key={st.id} className="p-2.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">#{idx + 1}</span>
                      <select
                        value={st.conjunction}
                        onChange={(e) => updateStep(idx, 'conjunction', e.target.value)}
                        className="bg-[#08131F] text-cyan-300 text-[11px] font-mono p-1 rounded border border-white/10"
                      >
                        <option value="Pertama-tama">Pertama-tama</option>
                        <option value="Setelah itu">Setelah itu</option>
                        <option value="Kemudian">Kemudian</option>
                        <option value="Selanjutnya">Selanjutnya</option>
                        <option value="Akhirnya">Akhirnya</option>
                      </select>
                    </div>
                    <button
                      onClick={() => removeStep(idx)}
                      className="text-slate-500 hover:text-rose-400 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={st.action}
                    onChange={(e) => updateStep(idx, 'action', e.target.value)}
                    placeholder="Tuliskan aksi imperatif (contoh: Putarlah tuas..., Campurkanlah...)"
                    className="w-full p-2 rounded-lg bg-black/40 border border-white/5 text-xs text-white font-sans outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Penutup / Tips */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold block">
              4. Penutup & Tips Keselamatan:
            </label>
            <input
              type="text"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              placeholder="Contoh: Pastikan daya dimatikan setelah selesai..."
              className="w-full p-2 rounded-lg bg-black/30 border border-white/10 text-xs text-white outline-none focus:border-purple-400"
            />
          </div>
        </div>

        {/* Right Column: Live Hologram Document Preview & Quality Linter */}
        <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-[#00F2FE]/30 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            {/* Top Linter Status */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#00F2FE]" />
                <span className="text-xs font-mono font-bold text-white uppercase">
                  LEMBAR PREVIEW DOKUMEN PROSEDUR
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-mono text-slate-300">Skor Kualitas:</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {qualityScore}/100
                </span>
              </div>
            </div>

            {/* Document Card Preview */}
            <div className="p-4 rounded-xl bg-black/50 border border-white/10 font-sans space-y-3 max-h-[46vh] overflow-y-auto">
              <div>
                <h2 className="text-base font-['Cinzel'] font-bold text-[#00F2FE]">
                  {title || '[Judul Teks Prosedur]'}
                </h2>
                <p className="text-xs text-slate-300 mt-1 italic">
                  {purpose || '[Tujuan prosedur akan tampil di sini]'}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-mono font-bold text-[#FFE082] uppercase mb-1">
                  Alat & Bahan:
                </h4>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-0.5">
                  {materials.map((m, i) => (
                    <li key={i}>{m || '...'}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-[11px] font-mono font-bold text-[#00F2FE] uppercase mb-1">
                  Langkah-Langkah Kerja:
                </h4>
                <ol className="list-decimal list-inside text-xs text-slate-300 space-y-1">
                  {steps.map((s, i) => (
                    <li key={s.id}>
                      <strong className="text-cyan-300 font-mono">{s.conjunction},</strong>{' '}
                      {s.action || '...'}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="text-[11px] font-mono font-bold text-purple-300 uppercase mb-1">
                  Catatan Keselamatan:
                </h4>
                <p className="text-xs text-slate-300">
                  {tips || '...'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Teks Tersalin!' : 'Salin Teks Prosedur'}</span>
            </button>

            <button
              onClick={() => {
                soundFX.playChime('victory');
                onProceedToMastery();
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Simpan & Buka Evaluasi Akhir (Tahap 12)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10">
        <button
          onClick={() => {
            soundFX.playChime('click');
            onBackToMap();
          }}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
        >
          Kembali ke Peta Dunia
        </button>
      </div>
    </div>
  );
};
