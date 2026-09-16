/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { MissionGuideBox } from '../ui/MissionGuideBox';

interface LembahInformasiStageProps {
  onNext: () => void;
  onBackToMap: () => void;
}

export const LembahInformasiStage: React.FC<LembahInformasiStageProps> = ({
  onNext,
  onBackToMap,
}) => {
  const [activeTab, setActiveTab] = useState<'STRUKTUR' | 'KEBAHASAAN' | 'KUIS'>('STRUKTUR');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const QUIZ_QUESTIONS = [
    {
      q: 'Manakah dari opsi berikut yang merupakan contoh KALIMAT IMPERATIF baku dalam teks prosedur?',
      options: [
        'A. Bahan-bahan ini sebaiknya diperhatikan dengan seksama oleh Anda.',
        'B. Tuangkan 200 ml ekstrak temulawak ke dalam tabung reaktor secara perlahan.',
        'C. Kita bisa berjalan-jalan sambil menunggu campuran tersebut dingin.',
        'D. Tabung reaktor telah dinyalakan sejak pagi hari kemarin.',
      ],
      correct: 1,
      explanation: 'Kalimat B menggunakan verba imperatif "Tuangkan" dengan takaran spesifik (200 ml) dan adverbia cara ("secara perlahan").',
    },
    {
      q: 'Urutan struktur Teks Prosedur yang sistematis dan benar adalah...',
      options: [
        'A. Langkah-langkah -> Tujuan -> Alat/Bahan -> Penutup',
        'B. Alat/Bahan -> Langkah-langkah -> Penutup -> Tujuan',
        'C. Tujuan -> Alat dan Bahan -> Langkah-langkah -> Penutup/Tips',
        'D. Penutup -> Alat/Bahan -> Tujuan -> Langkah-langkah',
      ],
      correct: 2,
      explanation: 'Struktur baku teks prosedur diawali dengan Tujuan, diikuti Bahan & Alat, Langkah instruksional teratur, dan diakhiri Penutup/Tips.',
    },
    {
      q: 'Kata-kata seperti "pertama-tama", "kemudian", "selanjutnya", dan "akhirnya" termasuk ke dalam kaidah...',
      options: [
        'A. Konjungsi Temporal (Penanda Urutan Waktu)',
        'B. Majas Metafora',
        'C. Kata Benda Konkret Abstrak',
        'D. Kata Tanya Retoris',
      ],
      correct: 0,
      explanation: 'Konjungsi temporal berfungsi merangkai urutan tahapan secara kronologis sehingga langkah tidak saling mendahului.',
    },
  ];

  const handleSelectOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    soundFX.playChime('click');
    setSelectedAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleGradeQuiz = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);
    if (score === QUIZ_QUESTIONS.length) {
      soundFX.playChime('victory');
    } else {
      soundFX.playChime('gold');
    }
  };

  return (
    <div className="relative w-full h-full pt-16 pb-6 px-4 sm:px-8 flex flex-col justify-between overflow-y-auto">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[#08131F] opacity-95 z-0" />

      {/* Header Bar */}
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
            <span>Peta Benua</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-400/20 text-[#00F2FE] border border-cyan-400/30">
                POS 1 // FONDASI INFORMASI
              </span>
              <span className="text-xs font-mono text-slate-400">Zona Lembah Informasi</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-['Cinzel'] font-bold text-white tracking-wide">
              Pustaka Eksplorasi: Fondasi Teks Prosedur
            </h1>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-xl bg-[#0D2B45]/80 p-1 border border-white/10">
          {[
            { id: 'STRUKTUR', label: '4 Struktur Teks' },
            { id: 'KEBAHASAAN', label: 'Ciri Kebahasaan' },
            { id: 'KUIS', label: 'Kuis Diagnostik' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                soundFX.playChime('click');
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#00F2FE] text-[#08131F] font-bold shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Guide Box with Step-by-Step Instructions & Aksara Boy Voice */}
      <MissionGuideBox
        stageKey="lembah_informasi"
        mood={quizSubmitted ? (quizScore === QUIZ_QUESTIONS.length ? 'proud' : 'encouraging') : (activeTab === 'KUIS' ? 'curious' : 'encouraging')}
        className="mb-3"
      />

      {/* Main Educational Screen */}
      <div className="relative z-10 flex-1 my-2">
        {activeTab === 'STRUKTUR' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Tujuan */}
            <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-[#00F2FE]/30 backdrop-blur-md flex flex-col justify-between hover:border-[#00F2FE] hover:shadow-[0_0_20px_rgba(0,242,254,0.2)] transition-all duration-300 shadow-lg group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#00F2FE]/20 text-[#00F2FE] flex items-center justify-center font-['Cinzel'] font-bold text-base mb-3 border border-[#00F2FE]/30 group-hover:scale-105 transition-transform">
                  01
                </div>
                <h3 className="font-['Cinzel'] font-bold text-base text-white mb-1">
                  1. Tujuan (Pernyataan Hasil)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menyatakan maksud utama pembuatan atau pengoperasian sesuatu. Bagian ini memberi gambaran
                  hasil akhir yang ingin dicapai pembaca.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-cyan-300">
                <strong>Contoh Cyber:</strong> "Prosedur Pengaktifan Reaktor Pengisian Energi Surya Tabung Beta."
              </div>
            </div>

            {/* Card 2: Alat & Bahan */}
            <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-[#D4AF37]/30 backdrop-blur-md flex flex-col justify-between hover:border-[#D4AF37] hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all duration-300 shadow-lg group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 text-[#FFE082] flex items-center justify-center font-['Cinzel'] font-bold text-base mb-3 border border-[#D4AF37]/30 group-hover:scale-105 transition-transform">
                  02
                </div>
                <h3 className="font-['Cinzel'] font-bold text-base text-white mb-1">
                  2. Alat & Bahan (Perlengkapan)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Daftar rinci material, instrumen, dan takaran kuantitatif yang presisi. Takaran tidak boleh
                  ambigu agar prosedur berhasil.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-amber-300">
                <strong>Contoh Cyber:</strong> "500 ml kristal mineral temulawak, 1 unit tabung plasma kuantum."
              </div>
            </div>

            {/* Card 3: Langkah-Langkah */}
            <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-emerald-500/30 backdrop-blur-md flex flex-col justify-between hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 shadow-lg group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-['Cinzel'] font-bold text-base mb-3 border border-emerald-500/30 group-hover:scale-105 transition-transform">
                  03
                </div>
                <h3 className="font-['Cinzel'] font-bold text-base text-white mb-1">
                  3. Langkah-Langkah (Instruksi Runtut)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Rangkaian aksi berurutan dan kronologis secara terperinci. Menggunakan kalimat imperatif
                  (perintah) yang lugas dan konjungsi urutan.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-emerald-300">
                <strong>Contoh Cyber:</strong> "Pertama-tama, hubungkan soket daya. Kemudian, putar katup 90 derajat."
              </div>
            </div>

            {/* Card 4: Penutup / Tips */}
            <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-purple-500/30 backdrop-blur-md flex flex-col justify-between hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] transition-all duration-300 shadow-lg group">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-['Cinzel'] font-bold text-base mb-3 border border-purple-500/30 group-hover:scale-105 transition-transform">
                  04
                </div>
                <h3 className="font-['Cinzel'] font-bold text-base text-white mb-1">
                  4. Penutup & Tips (Simpulan & Saran)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Penegasan keberhasilan prosedur, catatan keselamatan, atau saran optimalisasi bagi pengguna.
                </p>
              </div>
              <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-purple-300">
                <strong>Contoh Cyber:</strong> "Kini reaktor siap difungsikan. Hindari membuka segel saat lampu merah menyala."
              </div>
            </div>
          </div>
        )}

        {activeTab === 'KEBAHASAAN' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-cyan-400/30 backdrop-blur-md space-y-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-400/20 text-[#00F2FE]">
                KAIDAH 1
              </span>
              <h3 className="font-['Cinzel'] font-bold text-white text-base">
                Kalimat Imperatif (Perintah)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Teks prosedur wajib memakai kalimat perintah lugas. Dibentuk dengan imbuhan <em>-kan</em>, <em>-i</em>, atau partikel <em>-lah</em>.
              </p>
              <div className="space-y-1.5 p-3 rounded-xl bg-black/40 text-[11px] font-mono border border-white/5">
                <div className="text-emerald-400">✔ Tepat: "Campurkan serbuk ke cairan."</div>
                <div className="text-rose-400">✖ Keliru: "Anda sebaiknya mencampurkannya."</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-amber-400/30 backdrop-blur-md space-y-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-400/20 text-[#FFE082]">
                KAIDAH 2
              </span>
              <h3 className="font-['Cinzel'] font-bold text-white text-base">
                Konjungsi Temporal (Urutan Waktu)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kata hubung yang menunjukkan urutan waktu tindakan agar pembaca tidak melakukan langkah terbalik.
              </p>
              <div className="space-y-1.5 p-3 rounded-xl bg-black/40 text-[11px] font-mono border border-white/5">
                <div className="text-cyan-300">Kata kunci: Pertama-tama, kemudian, setelah itu, selanjutnya, akhirnya.</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0D2B45]/60 border border-emerald-400/30 backdrop-blur-md space-y-3">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-400/20 text-emerald-300">
                KAIDAH 3
              </span>
              <h3 className="font-['Cinzel'] font-bold text-white text-base">
                Adverbia / Keterangan Takaran & Cara
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Keterangan presisi mengenai waktu, jumlah takaran terukur, dan cara pengerjaan agar hasil akurat.
              </p>
              <div className="space-y-1.5 p-3 rounded-xl bg-black/40 text-[11px] font-mono border border-white/5">
                <div className="text-emerald-400">✔ Terukur: "...selama 15 menit pada suhu 80°C."</div>
                <div className="text-rose-400">✖ Ambigu: "...panaskan secukupnya sesuka hati."</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'KUIS' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-[#0D2B45]/60 border border-cyan-400/30 flex items-center justify-between">
              <div>
                <h3 className="font-['Cinzel'] font-bold text-white text-sm">
                  Uji Pemahaman Penjelajah
                </h3>
                <p className="text-xs text-slate-300">
                  Jawab 3 pertanyaan berikut sebelum melanjutkan ke Misi 01!
                </p>
              </div>
              {quizSubmitted && (
                <div className="text-right">
                  <span className="text-xs font-mono text-cyan-300">Skor Kamu:</span>
                  <div className="text-xl font-mono font-bold text-white">
                    {quizScore} / {QUIZ_QUESTIONS.length}
                  </div>
                </div>
              )}
            </div>

            {QUIZ_QUESTIONS.map((q, qIdx) => {
              const userAns = selectedAnswers[qIdx];
              return (
                <div
                  key={qIdx}
                  className="p-4 rounded-xl bg-[#0D2B45]/40 border border-white/10 space-y-3"
                >
                  <div className="text-xs font-bold text-white">
                    {qIdx + 1}. {q.q}
                  </div>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = userAns === optIdx;
                      let btnStyle = 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10';
                      if (quizSubmitted) {
                        if (optIdx === q.correct) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold';
                        } else if (isSelected && optIdx !== q.correct) {
                          btnStyle = 'bg-rose-500/20 border-rose-400 text-rose-200';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-[#00F2FE]/20 border-[#00F2FE] text-[#00F2FE] font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qIdx, optIdx)}
                          className={`w-full text-left p-2.5 rounded-lg border text-xs font-mono transition-colors flex items-center justify-between cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && optIdx === q.correct && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <div className="text-[11px] font-sans text-cyan-200 bg-[#08131F]/60 p-2.5 rounded-lg border border-cyan-500/20">
                      <strong>Penjelasan:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            {!quizSubmitted ? (
              <button
                onClick={handleGradeQuiz}
                disabled={Object.keys(selectedAnswers).length < QUIZ_QUESTIONS.length}
                className="w-full py-3 rounded-xl bg-[#00F2FE] hover:bg-[#38BDF8] disabled:opacity-40 disabled:cursor-not-allowed text-[#08131F] font-bold text-xs font-mono transition-colors"
              >
                Periksa Jawaban Kuis
              </button>
            ) : (
              <button
                onClick={() => {
                  setQuizSubmitted(false);
                  setSelectedAnswers({});
                  setQuizScore(null);
                }}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-mono transition-colors"
              >
                Coba Ulang Kuis
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Footer */}
      <div className="relative z-10 pt-4 flex items-center justify-between border-t border-white/10">
        <button
          onClick={() => {
            soundFX.playChime('click');
            onBackToMap();
          }}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors"
        >
          Kembali ke Peta
        </button>
        <button
          onClick={() => {
            soundFX.playChime('cyan');
            onNext();
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#0284C7] hover:from-[#38BDF8] hover:to-[#0284C7] text-[#08131F] font-['Cinzel'] font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,242,254,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span>Lanjut ke Misi 01 Briefing</span>
          <ChevronRight className="w-4 h-4 text-[#08131F]" />
        </button>
      </div>
    </div>
  );
};
