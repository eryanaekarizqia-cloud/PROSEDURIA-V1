/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MissionEvidenceItem {
  id: string;
  name: string;
  category: 'ALAT' | 'BAHAN' | 'LANGKAH' | 'CATATAN';
  description: string;
  isGlitch: boolean;
  correctionHint?: string;
  icon: string;
}

export interface MissionStepItem {
  id: string;
  order: number;
  expectedOrder: number;
  conjunction: string;
  imperativeVerb: string;
  content: string;
  adverbialMeasure?: string;
  isGlitch?: boolean;
}

export interface MissionData {
  id: string;
  number: number;
  title: string;
  islandId: string;
  islandName: string;
  status: 'ACTIVE' | 'LOCKED' | 'COMPLETED';
  bloomTaxonomy: string;
  bloomLevel: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
  fourPillarsFocus: {
    goal: string;
    materials: string;
    steps: string;
    closing: string;
  };
  briefing: {
    dialogue: string;
    aksaraQuote: string;
    objective: string;
    context: string;
  };
  evidences: MissionEvidenceItem[];
  procedureSteps: MissionStepItem[];
  anomalyDiagnostic: {
    rootCause: string;
    consequenceIfUnfixed: string;
    correctProcedureTitle: string;
  };
  rewards: {
    xp: number;
    points: number;
    badgeId: string;
    badgeName: string;
    unlocksIslandId?: string;
  };
}

export const PROSEDURIA_MISSIONS: Record<string, MissionData> = {
  M01: {
    id: 'M01',
    number: 1,
    title: 'Jejak yang Hilang: Protokol Minuman Cokelat Hangat',
    islandId: 'akademi',
    islandName: 'Akademi PROSEDURIA',
    status: 'ACTIVE',
    bloomTaxonomy: 'C1 (Mengingat) & C2 (Memahami Anatomi 4 Pilar)',
    bloomLevel: 'C2',
    fourPillarsFocus: {
      goal: 'Cara Menyeduh Minuman Cokelat Hangat Larut Sempurna',
      materials: '1 cangkir keramik, 1 sendok pengaduk, 2 sdm bubuk cokelat, 1 sdm gula pasir, 150 ml air panas (85°C)',
      steps: 'Urutan kronologis penuangan bahan kering, pelarutan pasta dengan sedikit air, pengadukan sendok, dan penambahan sisa air.',
      closing: 'Sajikan selagi hangat untuk menikmati tekstur lembut manis berkhasiat tanpa gumpalan.',
    },
    briefing: {
      dialogue:
        'Kompas Prosedurku mendeteksi anomali di Practice Room Akademi PROSEDURIA! Protokol dasar latihan menyeduh minuman cokelat hangat mengalami kekacauan: air panas dituang duluan sampai penuh, bubuk ditabur di atasnya, dan sendok pengaduk sama sekali tidak diinstruksikan!',
      aksaraQuote:
        'Sebuah teks prosedur bukan sekadar kata-kata—setiap verba imperatif dan urutan adalah hukum sebab-akibat fisik. Jika diabaikan, minuman nikmat berubah jadi bencana berdebu!',
      objective: 'Jalankan prosedur anomali, amati konsekuensi visual kegagalannya, kumpulkan bukti di Evidence Board, diagnosis kesalahan, dan lakukan uji kembali hingga Practice Room pulih!',
      context: 'Practice Room — Akademi PROSEDURIA.',
    },
    evidences: [
      {
        id: 'ev_01',
        name: 'Gumpalan Bubuk Cokelat Kering',
        category: 'BAHAN',
        description: 'Bubuk cokelat mengapung di permukaan air panas membentuk kerak kering tanpa larut karena sifat hidrofobik bubuk pada volume air banyak.',
        isGlitch: true,
        correctionHint: 'Bubuk harus dilarutkan dengan sedikit air panas dan diaduk terlebih dahulu menjadi pasta!',
        icon: '🍫',
      },
      {
        id: 'ev_02',
        name: 'Tumpahan Air Panas di Meja',
        category: 'ALAT',
        description: 'Air panas 150 ml dituang sebelum bahan padat dimasukkan, menyebabkan air meluap keluar cangkir saat bubuk dan gula ditambahkan.',
        isGlitch: true,
        correctionHint: 'Tuang air bertahap: 30 ml untuk melarutkan, lalu sisa 120 ml setelah pasta terbentuk.',
        icon: '💧',
      },
      {
        id: 'ev_03',
        name: 'Sendok Pengaduk Menganggur',
        category: 'ALAT',
        description: 'Sendok perak terletak bersih di samping cangkir tanpa pernah disentuh karena teks prosedur tidak memiliki verba aksi "Aduklah".',
        isGlitch: true,
        correctionHint: 'Gunakan verba imperatif "Aduklah campuran menggunakan sendok hingga larut merata".',
        icon: '🥄',
      },
      {
        id: 'ev_04',
        name: 'Gulungan Teks Tanpa Konjungsi & Takaran Bertahap',
        category: 'CATATAN',
        description: 'Langkah-langkah disusun tanpa konjungsi urutan waktu dan tidak memiliki takaran air bertahap.',
        isGlitch: true,
        correctionHint: 'Gunakan konjungsi kronologis: pertama, kemudian, selanjutnya, terakhir.',
        icon: '📜',
      },
    ],
    procedureSteps: [
      {
        id: 'step_01',
        order: 1,
        expectedOrder: 1,
        conjunction: 'Pertama-tama',
        imperativeVerb: 'Masukkan',
        content: '2 sendok makan bubuk cokelat dan 1 sendok makan gula ke dalam cangkir yang bersih dan kering.',
        adverbialMeasure: '2 sdm bubuk cokelat, 1 sdm gula',
      },
      {
        id: 'step_02',
        order: 2,
        expectedOrder: 2,
        conjunction: 'Kemudian',
        imperativeVerb: 'Tuangkan',
        content: 'sedikit air panas (sekitar 30 ml) ke dasar cangkir.',
        adverbialMeasure: '30 ml air panas 85°C',
      },
      {
        id: 'step_03',
        order: 3,
        expectedOrder: 3,
        conjunction: 'Setelah itu',
        imperativeVerb: 'Aduklah',
        content: 'campuran menggunakan sendok hingga menjadi pasta cokelat kental yang larut merata tanpa gumpalan.',
        adverbialMeasure: 'hingga larut merata tanpa gumpalan',
      },
      {
        id: 'step_04',
        order: 4,
        expectedOrder: 4,
        conjunction: 'Selanjutnya',
        imperativeVerb: 'Tuangkan',
        content: 'sisa air panas (120 ml) secara perlahan ke dalam cangkir.',
        adverbialMeasure: '120 ml air panas',
      },
      {
        id: 'step_05',
        order: 5,
        expectedOrder: 5,
        conjunction: 'Terakhir',
        imperativeVerb: 'Aduklah',
        content: 'kembali minuman secara perlahan hingga seluruh cairan tercampur sempurna dan siap disajikan.',
        adverbialMeasure: 'secara perlahan',
      },
    ],
    anomalyDiagnostic: {
      rootCause: 'Urutan penuangan terbalik, ketiadaan verba imperatif aduk, dan ketiadaan takaran air bertahap.',
      consequenceIfUnfixed: 'Bubuk cokelat menggumpal kaku di permukaan air, air meluap, dan minuman tersedak butiran pahit.',
      correctProcedureTitle: 'Prosedur Menyeduh Minuman Cokelat Hangat Larut Sempurna',
    },
    rewards: {
      xp: 150,
      points: 120,
      badgeId: 'badge_first_step',
      badgeName: 'Penyelaras Langkah Perdana',
      unlocksIslandId: 'pulau_rasa',
    },
  },

  M02: {
    id: 'M02',
    number: 2,
    title: 'Resep Rahasia Rempah: Takaran Presisi',
    islandId: 'pulau_rasa',
    islandName: 'Pulau Rasa Nusantara',
    status: 'LOCKED',
    bloomTaxonomy: 'C3 (Menerapkan Verba Imperatif & Adverbia Takaran)',
    bloomLevel: 'C3',
    fourPillarsFocus: {
      goal: 'Prosedur Mengolah Minuman Wedang Jahe Merah Penghangat Tubuh',
      materials: 'Jahe merah 150 gr digeprek, Kayu Manis 5 cm, Cengkih 3 butir, Gula Batu 50 gr',
      steps: 'Pemanggangan rimpang, perebusan rempah dengan suhu terjaga, pengadukan teratur.',
      closing: 'Nikmati selagi hangat saat cuaca dingin untuk menyegarkan tenggorokan.',
    },
    briefing: {
      dialogue: 'Selamat tiba di Pulau Rasa Nusantara! Di sini aroma rempah menguar, namun resep pusaka kehilangan adverbia ukurannya.',
      aksaraQuote: 'Takaran dalam teks prosedur adalah kunci keselamatan. Sedikit saja meleset, khasiat rempah bisa berubah!',
      objective: 'Terapkan verba imperatif aksi presisi dan lengkapi ukuran kuantitatif yang rumpang.',
      context: 'Kedai Rempah Kuno di pesisir Pulau Rasa Nusantara.',
    },
    evidences: [],
    procedureSteps: [],
    anomalyDiagnostic: {
      rootCause: 'Ketiadaan satuan baku ml dan gram.',
      consequenceIfUnfixed: 'Rasa pedas menyengat yang membakar lidah.',
      correctProcedureTitle: 'Formula Standar Wedang Jahe Merah',
    },
    rewards: {
      xp: 250,
      points: 200,
      badgeId: 'badge_spice_master',
      badgeName: 'Peracik Rempah Presisi',
      unlocksIslandId: 'pulau_bumi_hijau',
    },
  },

  M03: {
    id: 'M03',
    number: 3,
    title: 'Harmoni Hutan Biosfer: Kronologi Ekologis',
    islandId: 'pulau_bumi_hijau',
    islandName: 'Pulau Bumi Hijau',
    status: 'LOCKED',
    bloomTaxonomy: 'C3 & C4 (Menganalisis Konjungsi Urutan & Logika Bertanam)',
    bloomLevel: 'C4',
    fourPillarsFocus: {
      goal: 'Instalasi Sistem Hidroponik Mandiri di Sekolah',
      materials: 'Pipa PVC 3 inch, Netpot, Rockwool, Nutrisi AB Mix, Pompa Air Mini',
      steps: 'Pemotongan pipa, penyemaian bibit, pencampuran nutrisi PPM tepat, sirkulasi air.',
      closing: 'Sistem hidroponik siap panen sayur segar organik dalam 30 hari.',
    },
    briefing: {
      dialogue: 'Kubah bioma Pulau Bumi Hijau kehilangan keseimbangan karena urutan konjungsi pemupukan terbalik.',
      aksaraQuote: 'Konjungsi kronologis seperti "sebelum", "sesudah", dan "bersamaan" menentukan keberhasilan ekosistem!',
      objective: 'Analisis logika ketergantungan urutan kerja bertanam hidroponik.',
      context: 'Laboratorium Biosfer Hutan Tropis.',
    },
    evidences: [],
    procedureSteps: [],
    anomalyDiagnostic: {
      rootCause: 'Pemberian nutrisi mendahului perendaman benih pada media tanam.',
      consequenceIfUnfixed: 'Benih membusuk akibat keracunan nutrisi pekat.',
      correctProcedureTitle: 'Standar Operasional Hidroponik Ramah Lingkungan',
    },
    rewards: {
      xp: 350,
      points: 300,
      badgeId: 'badge_green_guardian',
      badgeName: 'Penjaga Bumi Lestari',
      unlocksIslandId: 'pulau_warisan',
    },
  },

  M04: {
    id: 'M04',
    number: 4,
    title: 'Melodi Gamelan Abadi: Tata Cara Pembuatan Pusaka',
    islandId: 'pulau_warisan',
    islandName: 'Pulau Warisan',
    status: 'LOCKED',
    bloomTaxonomy: 'C4 (Mengevaluasi Kesalahan Kalimat & Glitch Tradisi)',
    bloomLevel: 'C4',
    fourPillarsFocus: {
      goal: 'Prosedur Membatik Tulis Canting Halus Motif Parang',
      materials: 'Kain mori primissima, Malam lilin batik, Canting cecek, Kompor minyak kecil, Pewarna alami indigo',
      steps: 'Molani (membuat pola), Nglowong (mencanting lilin), Nembok, Medel (pewarnaan), Nglorod (pelarutan malam).',
      closing: 'Kain batik diangin-anginkan di tempat teduh agar corak awet ratusan tahun.',
    },
    briefing: {
      dialogue: 'Pendopo Candi Pulau Warisan sunyi. Prosedur pelarutan malam (nglorod) mengalami glitch kalimat rancu.',
      aksaraQuote: 'Warisan leluhur diwariskan lewat instruksi yang cermat. Evaluasi kalimat sumbang yang mengaburkan makna!',
      objective: 'Deteksi kekeliruan sintaksis kalimat prosedur dan perbaiki sesuai kaidah bahasa Indonesia baku.',
      context: 'Sanggar Candi Bentar Pulau Warisan.',
    },
    evidences: [],
    procedureSteps: [],
    anomalyDiagnostic: {
      rootCause: 'Pencelupan warna dilakukan setelah lilin dilorod total.',
      consequenceIfUnfixed: 'Motif batik luntur tanpa pembatas lilin.',
      correctProcedureTitle: 'Panduan Konservasi Batik Tulis Pusaka',
    },
    rewards: {
      xp: 450,
      points: 400,
      badgeId: 'badge_heritage_curator',
      badgeName: 'Kurator Warisan Luhur',
      unlocksIslandId: 'pulau_karya',
    },
  },

  M05: {
    id: 'M05',
    number: 5,
    title: 'Bengkel Rancang Mandiri: Menulis Teks Prosedur Orisinal',
    islandId: 'pulau_karya',
    islandName: 'Pulau Karya',
    status: 'LOCKED',
    bloomTaxonomy: 'C5 & C6 (Mengevaluasi & Mengkreasi Prosedur Orisinal)',
    bloomLevel: 'C5',
    fourPillarsFocus: {
      goal: 'Merakit Kompas Sederhana Penunjuk Arah Mata Angin',
      materials: 'Jarum jahit, Magnet batang, Gabus gabus tipis, Mangkuk air, Kertas label arah',
      steps: 'Penggosokan kutub magnet satu arah, penusukan jarum pada gabus, pengapungan di atas air tenang.',
      closing: 'Kompas siap digunakan untuk navigasi kepulauan tanpa membutuhkan daya listrik.',
    },
    briefing: {
      dialogue: 'Tungku cipta karya Pulau Karya menyala! Di sini kamu tidak lagi sekadar memperbaiki teks, tapi mencipta teks dari nol.',
      aksaraQuote: 'Setiap inovator adalah perancang prosedur handal. Tuliskan kreasimu dengan 4 pilar yang tak terbantahkan!',
      objective: 'Tulis teks prosedur orisinal mandiri dengan memenuhi seluruh 4 pilar dan kaidah kebahasaan baku.',
      context: 'Artisan Clockwork Foundry Pulau Karya.',
    },
    evidences: [],
    procedureSteps: [],
    anomalyDiagnostic: {
      rootCause: 'Penggosokan magnet bolak-balik menetralkan kutub jarum.',
      consequenceIfUnfixed: 'Jarum kompas berputar tanpa henti dan hilang orientasi utara-selatan.',
      correctProcedureTitle: 'Protokol Manufaktur Instrumen Navigasi',
    },
    rewards: {
      xp: 600,
      points: 500,
      badgeId: 'badge_artisan_creator',
      badgeName: 'Maestro Cipta Prosedur',
      unlocksIslandId: 'gerbang_pembuktian',
    },
  },

  M06: {
    id: 'M06',
    number: 6,
    title: 'Ujian Pamungkas Sang Maestro: Logika Paripurna',
    islandId: 'gerbang_pembuktian',
    islandName: 'Gerbang Pembuktian',
    status: 'LOCKED',
    bloomTaxonomy: 'C6 (Mastery Menilai, Mengkreasi, & Memverifikasi Multidimensi)',
    bloomLevel: 'C6',
    fourPillarsFocus: {
      goal: 'Aktivasi Segel Gerbang Dimensi Penyelaras Nusantara',
      materials: 'Kompas Prosedur Emas, Kristal 5 Elemen Kepulauan, Gulungan Teks Suci Paripurna',
      steps: 'Penyelarasan frekuensi kata imperatif, penggabungan konjungsi 5 pulau, aktivasi portal logika.',
      closing: 'Nusantara kembali harmonis, seluruh kepulauan terhubung dalam rantai pengetahuan abadi.',
    },
    briefing: {
      dialogue: 'Ini adalah gerbang penentuan akhir di puncak tebing samudra kosmik! Buktikan gelar Penjelajah Logika Paripurna milikmu!',
      aksaraQuote: 'Aku percaya padamu sejak hari pertama di Akademi. Bersama Kompas Prosedur, mari kita buka gerbang ini!',
      objective: 'Selesaikan tantangan terpadu: investigasi multi-prosedur C1 hingga C6.',
      context: 'Portal Megalitikum Puncak Karang Samudra.',
    },
    evidences: [],
    procedureSteps: [],
    anomalyDiagnostic: {
      rootCause: 'Distorsi anomali komprehensif tingkat tinggi.',
      consequenceIfUnfixed: 'Terputusnya komunikasi dan ilmu prosedural antarpulau.',
      correctProcedureTitle: 'Protokol Agung Penyelaras Alam Proseduria',
    },
    rewards: {
      xp: 1000,
      points: 800,
      badgeId: 'badge_grand_master',
      badgeName: 'Penjelajah Logika Paripurna',
    },
  },
};
