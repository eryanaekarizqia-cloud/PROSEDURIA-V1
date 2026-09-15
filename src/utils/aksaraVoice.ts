/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Aksara Voice Engine - Specialized Boy Voice (Suara Anak Laki-Laki SMP Kelas IX)
import { soundFX } from './audioEffects';

export interface VoiceLine {
  id: string;
  topic: string;
  text: string;
  mood: 'curious' | 'warning' | 'encouraging' | 'proud';
}

export const AKSARA_VOICE_LINES: VoiceLine[] = [
  {
    id: 'intro',
    topic: 'KOMPAS BERGETAR',
    text: 'Halo Penjelajah! Aku Aksara, siswa SMP Kelas IX pemandumu di Proseduria! Waspada, Kompas Logika mendeteksi retakan prosedur! Mari kita pulihkan bersama!',
    mood: 'warning',
  },
  {
    id: 'structure',
    topic: 'STRUKTUR 4 PILAR',
    text: 'Ingat fondasi utama teks prosedur: Tujuan, Alat dan Bahan, Langkah Kerja yang runtut, serta Penutup yang meyakinkan.',
    mood: 'encouraging',
  },
  {
    id: 'imperative',
    topic: 'VERBA IMPERATIF',
    text: 'Gunakan kata kerja perintah yang tegas dan lugas, seperti "tuangkan", "aduklah", atau "pastikan". Hindari kalimat pasif yang ambigu!',
    mood: 'curious',
  },
  {
    id: 'chronology',
    topic: 'KONJUNGSI TEMPORAL',
    text: 'Urutan kronologis adalah jantung teks prosedur! Pastikan kata sambung seperti "pertama", "kemudian", dan "setelah itu" berada di posisi yang logis.',
    mood: 'encouraging',
  },
  {
    id: 'final_call',
    topic: 'PENGUASAAN MASTER',
    text: 'Setiap langkahmu adalah logika. Setiap logikamu menyelamatkan dunia Proseduria. Mulai petualanganmu sekarang!',
    mood: 'proud',
  },
];

// Specific step-by-step guidance lines for challenges
export const STAGE_GUIDANCE_LINES: { [stageKey: string]: { title: string; steps: string[]; spokenText: string } } = {
  evidence_board: {
    title: 'Cara Mengerjakan Papan Bukti Linguistik',
    steps: [
      '1. Klik salah satu kartu "Bukti Temuan Glitch" di kolom kiri.',
      '2. Analisis cacat kaidah bahasanya (takaran ambigu, kata pasif bertele-tele, konjungsi terbalik, atau satuan suhu tidak objektif).',
      '3. Klik kartu "Kaidah Kebahasaan (Solusi Baku)" di kolom kanan yang merupakan aturan perbaikannya.',
      '4. Hubungkan seluruh 4 pasang bukti hingga berstatus Tervalidasi untuk membuka tombol Lanjut!',
    ],
    spokenText:
      'Perhatikan baik-baik! Di Papan Bukti ini, tugasmu adalah mencocokkan setiap bukti kalimat yang rusak di sebelah kiri dengan kaidah bahasa yang benar di sebelah kanan. Klik buktinya dulu, lalu klik kaidah yang sesuai!',
  },
  lembah_informasi: {
    title: 'Cara Mengerjakan Eksplorasi Lembah Informasi',
    steps: [
      '1. Baca dokumen resep ramuan jamu kuno dengan saksama.',
      '2. Temukan takaran dan bahan yang tersurat maupun yang hilang.',
      '3. Kelompokkan kalimat ke dalam 4 pilar: Tujuan, Bahan, Langkah, dan Penutup.',
    ],
    spokenText:
      'Di Lembah Informasi, bacalah plakat dengan teliti! Bedakan informasi yang tertulis jelas dan informasi takaran yang hilang agar ramuan tidak gagal!',
  },
  sequence_puzzle: {
    title: 'Cara Mengerjakan Teka-Teki Urutan Kronologis',
    steps: [
      '1. Amati setiap kartu langkah instruksi yang teracak.',
      '2. Perhatikan kata hubung waktu (pertama, kemudian, selanjutnya, terakhir).',
      '3. Geser atau klik tombol naik/turun untuk menyusun urutan dari awal hingga selesai.',
      '4. Uji alur logika sampai semua indikator urutan menyala hijau.',
    ],
    spokenText:
      'Urutan kronologis tidak boleh terbalik! Pasang langkah persiapan terlebih dahulu sebelum langkah eksekusi. Gunakan tombol panah untuk menukar posisi langkah!',
  },
  procedure_glitch: {
    title: 'Cara Mengerjakan Deteksi Anomali Glitch',
    steps: [
      '1. Pindai teks instruksi untuk mencari kata kerja pasif, takaran tidak jelas (secukupnya), atau instruksi kontradiktif.',
      '2. Klik kata atau baris yang terindikasi glitch.',
      '3. Bersihkan seluruh bug teks untuk menstabilkan sistem kerajaan.',
    ],
    spokenText:
      'Gunakan kaca pembesar logika! Tandai setiap kata yang membingungkan atau kata kerja pasif yang membuat instruksi tidak tegas!',
  },
  repair_workshop: {
    title: 'Cara Mengerjakan Bengkel Rekonstruksi',
    steps: [
      '1. Pilih kalimat pengganti baku dari bank kata yang disediakan.',
      '2. Ganti kata ambigu dengan takaran presisi (contoh: 250 ml, 5 menit).',
      '3. Simpan revisi dan verifikasi tingkat kepatuhan standar teks prosedur.',
    ],
    spokenText:
      'Saatnya memperbaiki! Ganti kalimat yang rusak dengan pilihan kaidah yang lugas dan berikan takaran ilmiah yang tepat!',
  },
  test_simulation: {
    title: 'Cara Mengerjakan Simulasi Uji Coba',
    steps: [
      '1. Jalankan simulasi resep langkah demi langkah.',
      '2. Pantau indikator keberhasilan, kestabilan suhu, dan urutan wadah.',
      '3. Pastikan tidak terjadi ledakan logika!',
    ],
    spokenText:
      'Tekan tombol simulasi untuk menguji apakah prosedur yang kita susun benar-benar aman dan berhasil dijalankan di dunia nyata!',
  },
  procedure_forge: {
    title: 'Cara Mengerjakan Procedure Forge (Cipta Teks)',
    steps: [
      '1. Masukkan Judul & Tujuan teks prosedur yang ingin kamu buat.',
      '2. Rincikan Alat dan Bahan secara lengkap dengan takaran angka eksak.',
      '3. Tuliskan Langkah-langkah menggunakan verba imperatif (-kan/-lah) dan konjungsi urutan.',
      '4. Lengkapi bagian Penutup / Tips keselamatan, lalu uji kelayakan di simulator C6!',
    ],
    spokenText:
      'Ini adalah puncak pencapaianmu! Di Tungku Emas ini, buatlah teks prosedur baru karyamu sendiri yang lengkap dengan 4 pilar!',
  },
  final_case: {
    title: 'Cara Mengerjakan Misi Darurat Krisis Inti',
    steps: [
      '1. Baca laporan anomali instruksi darurat yang ditampilkan.',
      '2. Analisis pilihan perbaikan kalimat instruksi: cari verba imperatif yang lugas, takaran angka pasti, dan urutan keselamatan tepat.',
      '3. Pilih solusi terbaik untuk menstabilkan masing-masing protokol sebelum waktu kritis habis.',
      '4. Stabilkan seluruh 3 protokol darurat untuk menyelamatkan stasiun luar angkasa!',
    ],
    spokenText:
      'Waspada keadaan darurat! Inti reaktor mengalami ketidakstabilan karena instruksi yang cacat. Pilih perbaikan instruksi yang paling tepat, lugas, dan memiliki takaran presisi!',
  },
  prologue: {
    title: 'Cara Memulai Petualangan Prolog Proseduria',
    steps: [
      '1. Dengarkan arahan pengenalan dari Aksara (siswa SMP Kelas IX) tentang anomali teks prosedur.',
      '2. Coba ganti posisi Aksara untuk melihat stasiun penjelajahan yang berbeda.',
      '3. Uji simulasi anomali logika dengan tombol Simulasi Glitch.',
      '4. Tekan tombol "Mulai Petualangan" atau langsung buka "Peta Benua (World Map)" untuk memulai misi!',
    ],
    spokenText:
      'Halo Penjelajah! Aku Aksara, siswa SMP Kelas IX pemandu logikamu! Kompas Logika mendeteksi retakan di dunia Proseduria. Ayo mulai petualangan dan pulihkan seluruh zona kepulauan bersama!',
  },
  mission_01: {
    title: 'Cara Mengerjakan Briefing Kasus Bioplasma',
    steps: [
      '1. Analisis berkas insiden #BIOPLASMA-TK77 yang korup.',
      '2. Perhatikan 3 anomali utama: urutan terbalik, takaran ambigu, dan kalimat pasif berbelit.',
      '3. Pelajari target 5 fase operasi pemulihan sebelum menuju laboratorium reaktor.',
      '4. Tekan tombol "Masuk ke Sequence Puzzle" untuk menata urutan langkah!',
    ],
    spokenText:
      'Waspada! Anomali sintaksis membuat instruksi bioplasma berbahaya. Pelajari berkas kasus dan target pemulihan kita, lalu bersiap masuk ke Sequence Puzzle!',
  },
  reward_celebration: {
    title: 'Hasil Capaian & Panduan Tahap Berikutnya',
    steps: [
      '1. Rayakan keberhasilan menstabilkan reaktor bioplasma dengan teks prosedur yang benar.',
      '2. Simpan lencana penghargaan evaluasi dan perbaikan C5.',
      '3. Tekan tombol "Masuk ke Tungku Emas" untuk menciptakan teks prosedur karyamu sendiri di Procedure Forge!',
    ],
    spokenText:
      'Luar biasa! Reaktor bioplasma kini stabil dan aman. Sekarang saatnya membuktikan kemampuan tertinggimu di Tungku Emas Procedure Forge!',
  },
  mastery_debrief: {
    title: 'Refleksi Akhir & Sertifikat Maestro',
    steps: [
      '1. Tuliskan refleksi belajarmu mengenai pentingnya teks prosedur yang logis dan aman.',
      '2. Tinjau kembali ringkasan kompetensi dari C1 hingga C6.',
      '3. Salin Sertifikat Kelulusan Maestro Chrono-Aksara ke clipboard.',
      '4. Kembali ke Peta Benua untuk mengulang zona atau menantang Krisis Inti!',
    ],
    spokenText:
      'Selamat! Kamu telah menguasai seluruh hierarki teks prosedur dari C1 hingga C6. Salin sertifikat kelulusanmu dan bawa pulang logika emas ini!',
  },
};

class AksaraVoiceSynthesizer {
  private isSpeaking: boolean = false;
  private boyVoice: SpeechSynthesisVoice | null = null;
  private isNativeMaleVoice: boolean = false;
  private customBoyPitchMultiplier: number = 1.0;
  private onStateChangeListeners: Array<(speaking: boolean) => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  // Actively search for and prioritize male / young boy voices
  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    // 1. First priority: Indonesian voices with male hints
    const idVoices = voices.filter(
      (v) => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia')
    );

    const idMale = idVoices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        name.includes('male') ||
        name.includes('pria') ||
        name.includes('laki') ||
        name.includes('boy') ||
        name.includes('ardi') ||
        name.includes('david') ||
        name.includes('andhika') ||
        name.includes('andika') ||
        name.includes('brian')
      );
    });

    if (idMale) {
      this.boyVoice = idMale;
      this.isNativeMaleVoice = true;
      return;
    }

    // 2. Second priority: Standard Indonesian voice (will be shifted down to boy pitch)
    if (idVoices.length > 0) {
      this.boyVoice = idVoices[0];
      this.isNativeMaleVoice = false;
      return;
    }

    // 3. Fallback to any male voice in browser
    const anyMale = voices.find((v) => {
      const name = v.name.toLowerCase();
      return (
        name.includes('male') ||
        name.includes('boy') ||
        name.includes('david') ||
        name.includes('george') ||
        name.includes('guy')
      );
    });

    if (anyMale) {
      this.boyVoice = anyMale;
      this.isNativeMaleVoice = true;
      return;
    }

    this.boyVoice = voices[0] || null;
    this.isNativeMaleVoice = false;
  }

  public setCustomPitchMultiplier(multiplier: number) {
    this.customBoyPitchMultiplier = Math.max(0.6, Math.min(multiplier, 1.6));
  }

  public getVoiceInfo() {
    return {
      voiceName: this.boyVoice ? this.boyVoice.name : 'Default Audio Blip',
      isNativeMale: this.isNativeMaleVoice,
      targetPersona: 'Aksara (Anak Laki-Laki SMP Kelas IX)',
    };
  }

  public addListener(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
  }

  public removeListener(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
  }

  private notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.onStateChangeListeners.forEach((l) => l(speaking));
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  // Play energetic boyish RPG voice blips (clean triangle wave 380 - 460 Hz)
  public playVoiceBlip(tone: number = 420) {
    if (soundFX.getMuted() || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tone, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(tone * 1.28, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.065);
    } catch {
      // Ignore audio errors
    }
  }

  // Speak with young schoolboy vocal tuning (Anak Laki-Laki SMP Kelas IX)
  public speak(text: string, onEnd?: () => void) {
    if (soundFX.getMuted()) return;

    soundFX.playChime('gold');

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      // Ensure voices initialized
      if (!this.boyVoice) {
        this.initVoices();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.boyVoice) {
        utterance.voice = this.boyVoice;
      }
      utterance.lang = 'id-ID';

      // Acoustic tuning for an enthusiastic young schoolboy (SMP Class IX ~14-15 years old):
      // Adolescent boy fundamental frequency target: ~150-175 Hz.
      // - If native male voice is used (~110 Hz adult male), shift UP to 1.22
      // - If default/female voice is used (~220 Hz female), shift DOWN to 0.82 to avoid sounding like a woman/chipmunk
      const basePitch = this.isNativeMaleVoice ? 1.22 : 0.82;
      utterance.pitch = basePitch * this.customBoyPitchMultiplier;
      utterance.rate = 1.05;

      utterance.onstart = () => {
        this.notify(true);
      };

      utterance.onend = () => {
        this.notify(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.notify(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback: boy voice synthesizer blips
      this.notify(true);
      let count = 0;
      const interval = setInterval(() => {
        this.playVoiceBlip(400 + (count % 4) * 45);
        count++;
        if (count > 9) {
          clearInterval(interval);
          this.notify(false);
          if (onEnd) onEnd();
        }
      }, 120);
    }
  }

  // Helper to speak pre-defined stage guidance
  public speakStageGuidance(stageKey: string, onEnd?: () => void) {
    const guide = STAGE_GUIDANCE_LINES[stageKey];
    if (guide) {
      this.speak(guide.spokenText, onEnd);
    }
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify(false);
  }
}

export const aksaraVoice = new AksaraVoiceSynthesizer();
