/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundFX } from '../../utils/audioEffects';
import { aksaraVoice } from '../../utils/aksaraVoice';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import {
  Compass,
  ArrowLeft,
  Shield,
  Zap,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Play,
  Lock,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  Crosshair,
  Award,
  Layers,
  MapPin,
  Flame,
  Waves,
  Trees,
  Flower2,
  Castle,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Activity,
  Plus,
  Minus,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Unlock,
  Radio,
  HelpCircle,
} from 'lucide-react';
import { WorldRestorationSlider } from '../restoration/WorldRestorationSlider';

export interface WorldMapScreenProps {
  onBackToTitle: () => void;
  onEnterLembahInformasi: () => void;
  onEnterFinalCase: () => void;
  onEnterSequencePuzzle?: () => void;
  onEnterProcedureGlitch?: () => void;
  onEnterProcedureForge?: () => void;
  highestReachedStageIndex?: number;
}

export interface MapNode {
  id: string;
  code: string;
  title: string;
  regionId: string;
  status: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  x: number; // percentage on map
  y: number;
  type: 'HUB' | 'MISSION' | 'BOSS';
  bloom: string;
  xp: number;
  description: string;
  action: () => void;
}

export interface MapRegion {
  id: string;
  number: number;
  name: string;
  nusantaraIdentity: string;
  biome: string;
  badgeLabel: string;
  bloomLevel: string;
  bloomTaxonomy: string;
  colorHex: string;
  borderCol: string;
  x: number; // banner position %
  y: number;
  progressPercent: number;
  totalMissions: number;
  completedMissions: number;
  isUnlocked: boolean;
  shortDesc: string;
  loreSnippet: string;
  features: string[];
  aksaraAdvice: string;
  action: () => void;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  onBackToTitle,
  onEnterLembahInformasi,
  onEnterFinalCase,
  onEnterSequencePuzzle = onEnterLembahInformasi,
  onEnterProcedureGlitch = onEnterLembahInformasi,
  onEnterProcedureForge = onEnterLembahInformasi,
  highestReachedStageIndex = 1,
}) => {
  // Compute Aksara position dynamically based on highest reached stage / completed mission
  const getAksaraPos = (stageIdx: number) => {
    switch (stageIdx) {
      case 1:
      case 2:
        return { x: 50.0, y: 76.0, name: 'Akademi Prosedur (Inisiasi)', zoneName: 'Pusat Inisiasi', advice: 'Halo Penjelajah! Mulai petualanganmu dari Lembah Informasi di barat daya!' };
      case 3:
        return { x: 28.0, y: 70.0, name: 'Lembah Informasi (Dermaga Jamu)', zoneName: 'Zona 1: Lembah Informasi', advice: 'Aku telah berpindah ke Dermaga Jamu Kuno di Lembah Informasi! Pelajari 4 pilar struktur teks prosedur!' };
      case 4:
        return { x: 20.0, y: 56.0, name: 'Laboratorium Reaktor Alpha-01', zoneName: 'Zona 1: Pos Reaktor', advice: 'Waspada! Aku telah berpindah ke Pos Reaktor Alpha untuk mengawasi briefing anomali bioplasma!' };
      case 5:
        return { x: 38.0, y: 46.0, name: 'Jembatan Runtun Logika', zoneName: 'Zona 2: Sungai Logika', advice: 'Hebat! Misi briefing selesai, sekarang aku berpindah ke Jembatan Runtun Logika. Susun urutan langkah kronologis!' };
      case 6:
        return { x: 74.0, y: 66.0, name: 'Taman Bahasa Nusantara', zoneName: 'Zona 2: Taman Bahasa', advice: 'Aku berpindah ke Taman Bahasa! Ayo bersihkan glitch kerancuan kata dan takaran ambigu!' };
      case 7:
        return { x: 82.0, y: 52.0, name: 'Paviliun Kristal Kaidah', zoneName: 'Zona 3: Papan Bukti', advice: 'Aku telah berpindah ke Paviliun Kristal Kaidah untuk memverifikasi kecocokan bukti kesalahan!' };
      case 8:
        return { x: 84.0, y: 35.0, name: 'Bengkel Rekonstruksi Karst', zoneName: 'Zona 3: Bengkel Rekonstruksi', advice: 'Aku berpindah ke Bengkel Rekonstruksi Karst! Waktunya menyunting kalimat menjadi imperatif baku!' };
      case 9:
        return { x: 64.0, y: 28.0, name: 'Ruang Uji Reaktor Plasma', zoneName: 'Zona 4: Ruang Uji', advice: 'Aku telah berpindah ke Ruang Uji Reaktor! Ayo uji kestabilan prosedur ramuan kita!' };
      case 10:
        return { x: 50.0, y: 32.0, name: 'Altar Kemenangan Evaluasi C5', zoneName: 'Zona 4: Altar Capaian', advice: 'Kemenangan besar! Aku berpindah ke Altar Kemenangan bersama lencana emasmu!' };
      case 11:
        return { x: 50.0, y: 20.0, name: 'Tungku Pusaka Emas C6', zoneName: 'Zona 5: Tungku Emas', advice: 'Puncak kreasi C6! Aku berpindah ke Tungku Emas Majapahit untuk mencipta teks prosedur barumu!' };
      case 12:
        return { x: 50.0, y: 14.0, name: 'Puncak Menara Maestro', zoneName: 'Puncak Maestro', advice: 'Luar biasa! Aku berpindah ke Puncak Menara Maestro bersama sertifikat kelulusanmu!' };
      case 13:
      default:
        return { x: 50.0, y: 8.0, name: 'Krisis Inti Reaktor Sentral', zoneName: 'Krisis Pamungkas', advice: 'Misi darurat pamungkas! Aku berada di Inti Reaktor Sentral untuk penyelamatan terakhir!' };
    }
  };

  const currentAksaraPos = getAksaraPos(highestReachedStageIndex);

  // State
  const [selectedRegionId, setSelectedRegionId] = useState<string>('lembah');
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [showPreviewCard, setShowPreviewCard] = useState<boolean>(true);
  const [showAksaraSpeech, setShowAksaraSpeech] = useState<boolean>(true);
  const [isAksaraSpeaking, setIsAksaraSpeaking] = useState<boolean>(false);
  const [mapDisplayMode, setMapDisplayMode] = useState<'clean_pins' | 'labeled_pins' | 'panoramic'>('clean_pins');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [allZonesUnlocked, setAllZonesUnlocked] = useState<boolean>(true);
  const [showRestorationModal, setShowRestorationModal] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'SEMUA' | 'ALUR' | 'GLITCH'>('SEMUA');
  const [soundMuted, setSoundMuted] = useState<boolean>(soundFX.getMuted());

  // Listen to Aksara speech
  useEffect(() => {
    const handleVoiceChange = (speaking: boolean) => {
      setIsAksaraSpeaking(speaking);
    };
    aksaraVoice.addListener(handleVoiceChange);
    return () => {
      aksaraVoice.removeListener(handleVoiceChange);
      aksaraVoice.stop();
    };
  }, []);

  // NUSANTARA 5 REGIONS DEFINITION
  const REGIONS: MapRegion[] = [
    {
      id: 'akademi',
      number: 0,
      name: 'Akademi Prosedur',
      nusantaraIdentity: 'Inspirasi: Gerbang Candi & Keraton Nusantara',
      biome: 'Pusat Pembelajaran & Benteng Awal',
      badgeLabel: 'C1 • 100% • 2/2 Selesai',
      bloomLevel: 'C1 Fondasi',
      bloomTaxonomy: 'C1 Mengingat Fondasi Struktur',
      colorHex: '#38BDF8',
      borderCol: 'border-sky-400',
      x: 50.0,
      y: 88.0,
      progressPercent: 100,
      totalMissions: 2,
      completedMissions: 2,
      isUnlocked: true,
      shortDesc: 'Pusat pelatihan para Penjelajah Logika untuk memahami anatomi 4 pilar teks prosedur.',
      loreSnippet:
        'Di pelataran candi megah ini, setiap penjelajah menerima Magic Logbook dan Kompas Logika dari Pemandu Aksara sebelum memulai ekspedisi melintasi kepulauan Proseduria.',
      features: ['Pelataran Gerbang Candi', 'Ruang Arsip Anatomi 4 Pilar', 'Menara Kompas Logika'],
      aksaraAdvice:
        'Selamat datang di Akademi! Kuasai dulu 4 pilar dasar: Tujuan, Material, Langkah, dan Penutup sebelum mengarungi pulau luar.',
      action: onEnterLembahInformasi,
    },
    {
      id: 'lembah',
      number: 1,
      name: 'Lembah Informasi',
      nusantaraIdentity: 'Inspirasi: Air Terjun Tumpak Sewu & Terasering Jatiluwih',
      biome: 'Hutan Tropis & Air Terjun Bertingkat',
      badgeLabel: 'C1-C2 • 66% • 2/3 Misi',
      bloomLevel: 'C1-C2',
      bloomTaxonomy: 'C1 Mengingat & C2 Memahami',
      colorHex: '#10B981',
      borderCol: 'border-emerald-400',
      x: 18.0,
      y: 48.0,
      progressPercent: 66,
      totalMissions: 3,
      completedMissions: 2,
      isUnlocked: true,
      shortDesc: 'Telusuri terasering zamrud dan air terjun untuk mengekstrak takaran bahan dan struktur yang terselubung.',
      loreSnippet:
        'Lembah subur dengan kabut tipis dan air terjun bertingkat khas Tumpak Sewu. Banyak plakat prosedur kuno yang rusak karena takaran dan langkah kerjanya tersapu air bah.',
      features: ['Dermaga Jukung & Jamu Kuno', 'Terasering Zamrud Bertingkat', 'Plakat Air Terjun Suci'],
      aksaraAdvice:
        'Di Lembah Informasi, bacalah plakat dengan teliti! Bedakan mana takaran yang tersurat dan mana informasi yang sengaja dihilangkan.',
      action: onEnterLembahInformasi,
    },
    {
      id: 'taman',
      number: 2,
      name: 'Taman Bahasa',
      nusantaraIdentity: 'Inspirasi: Danau Teratai & Paviliun Joglo Luminous',
      biome: 'Taman Flora Bercahaya & Paviliun Kristal',
      badgeLabel: 'C3 • 33% • 1/3 Misi',
      bloomLevel: 'C3',
      bloomTaxonomy: 'C3 Mengaplikasikan Verba & Adverbia',
      colorHex: '#00F2FE',
      borderCol: 'border-cyan-400',
      x: 82.0,
      y: 72.0,
      progressPercent: 33,
      totalMissions: 3,
      completedMissions: 1,
      isUnlocked: true,
      shortDesc: 'Uji kejelian kaidah kebahasaan: verba imperatif, konjungsi temporal, dan takaran terukur.',
      loreSnippet:
        'Taman terapung dengan bunga teratai raksasa bercahaya neon cyan. Di sini, kalimat pasif deskriptif yang lambat akan memperlambat jembatan cahaya!',
      features: ['Danau Teratai Bercahaya', 'Paviliun Joglo Kata Perintah', 'Jembatan Kristal Konjungsi'],
      aksaraAdvice:
        'Teks prosedur membutuhkan verba imperatif yang tegas! Gunakan kata kerja perintah dan takaran akurat agar instruksimu dipatuhi.',
      action: onEnterSequencePuzzle,
    },
    {
      id: 'sungai',
      number: 3,
      name: 'Sungai Logika',
      nusantaraIdentity: 'Inspirasi: Ngarai Sianok & Arung Jeram Mahakam',
      biome: 'Ngarai Kristal & Aliran Arus Deras',
      badgeLabel: 'C4 • 0% • 0/3 Misi',
      bloomLevel: 'C4',
      bloomTaxonomy: 'C4 Menganalisis Urutan Kronologis',
      colorHex: '#3B82F6',
      borderCol: 'border-blue-400',
      x: 32.0,
      y: 22.0,
      progressPercent: 0,
      totalMissions: 3,
      completedMissions: 0,
      isUnlocked: allZonesUnlocked,
      shortDesc: 'Rekonstruksi alur langkah yang teracak agar arus air tidak menabrak pusaran logika yang berbahaya.',
      loreSnippet:
        'Sungai beraliran deras yang mengalir di antara tebing ngarai curam. Aliran air mengikuti urutan prosedur: jika langkah tertukar, arus berbalik dan memicu anomali.',
      features: ['Pusaran Air Kronologis', 'Jembatan Titian Konjungsi', 'Tebing Ngarai Kristal Biru'],
      aksaraAdvice:
        'Jangan pernah menaruh langkah hasil sebelum langkah persiapan! Hubungkan urutan dengan konjungsi seperti lalu, kemudian, dan setelah itu.',
      action: onEnterSequencePuzzle,
    },
    {
      id: 'kawasan_rusak',
      number: 4,
      name: 'Kawasan Prosedur Rusak',
      nusantaraIdentity: 'Inspirasi: Kawah Gunung Bromo & Tebing Karst Rammang-Rammang',
      biome: 'Kawah Basalt Hitam & Retakan Glitch Merah',
      badgeLabel: 'C5 • 0% • 0/2 Misi',
      bloomLevel: 'C5',
      bloomTaxonomy: 'C5 Mengevaluasi Kerusakan & Mengaudit',
      colorHex: '#F59E0B',
      borderCol: 'border-amber-400',
      x: 84.0,
      y: 22.0,
      progressPercent: 0,
      totalMissions: 2,
      completedMissions: 0,
      isUnlocked: allZonesUnlocked,
      shortDesc: 'Karantina zona anomali paling berbahaya: temukan langkah rancu, hilangkan kontradiksi berbahaya.',
      loreSnippet:
        'Kawasan berbatu hitam yang retak dengan kilatan energi merah. Di kawah ini terkumpul teks prosedur yang cacat: tidak logis, membahayakan keselamatan, dan tanpa takaran baku.',
      features: ['Kawah Basalt Anomali', 'Tebing Karst Merah Membara', 'Altar Rekonstruksi Glitch'],
      aksaraAdvice:
        'Waspada tingkat tinggi! Kesalahan pada teks prosedur keselamatan dapat berakibat fatal. Identifikasi setiap cacat logika di sini!',
      action: onEnterProcedureGlitch,
    },
    {
      id: 'procedure_forge',
      number: 5,
      name: 'Procedure Forge',
      nusantaraIdentity: 'Inspirasi: Puncak Kerajaan Majapahit & Tungku Pusaka Emas',
      biome: 'Puncak Kastil Melayang & Tungku Emas Menyala',
      badgeLabel: 'C6 • 0% • 0/3 Misi',
      bloomLevel: 'C6',
      bloomTaxonomy: 'C6 Mencipta Teks Prosedur Orisinal',
      colorHex: '#EC4899',
      borderCol: 'border-pink-400',
      x: 50.0,
      y: 8.0,
      progressPercent: 0,
      totalMissions: 3,
      completedMissions: 0,
      isUnlocked: allZonesUnlocked,
      shortDesc: 'Rancang dan tempa teks prosedur orisinalmu sendiri hingga meraih akreditasi Master Logika.',
      loreSnippet:
        'Puncak tertinggi Proseduria tempat tungku pusaka menyala abadi. Para Master Logika merancang prosedur mutlak untuk menyelamatkan seluruh peradaban Nusantara.',
      features: ['Tungku tempa emas pijar', 'Puncak kastil kubah emas', 'Simulasi kelayakan operasional C6'],
      aksaraAdvice:
        'Buktikan keahlian tertinggimu di sini dengan menyusun teks prosedur baru yang lengkap, sistematis, dan aman!',
      action: onEnterProcedureForge,
    },
  ];

  // INTERACTIVE MAP NODES WITH CAREFULLY SPREAD GEOGRAPHIC COORDINATES (ZERO OVERLAP!)
  const MAP_NODES: MapNode[] = [
    // 1. Akademi Prosedur (Bottom Center)
    {
      id: 'hub-01',
      code: 'HUB-1',
      title: 'Inisiasi Penjelajah',
      regionId: 'akademi',
      status: 'COMPLETED',
      x: 43.0,
      y: 76.0,
      type: 'HUB',
      bloom: 'C1 Fondasi',
      xp: 100,
      description: 'Pengenalan misi utama dan penerimaan Magic Logbook dari Pemandu Aksara.',
      action: onEnterLembahInformasi,
    },
    {
      id: 'hub-02',
      code: 'HUB-2',
      title: 'Arsip Anatomi Prosedur',
      regionId: 'akademi',
      status: 'COMPLETED',
      x: 57.0,
      y: 76.0,
      type: 'HUB',
      bloom: 'C1 Struktur 4 Pilar',
      xp: 150,
      description: 'Menganalisis anatomi 4 bagian teks prosedur: Tujuan, Bahan, Langkah, dan Penutup.',
      action: onEnterLembahInformasi,
    },

    // 2. Lembah Informasi Nodes (Left Tropical Waterfalls & Terraces)
    {
      id: 'm-1.1',
      code: 'M-1.1',
      title: 'Misteri Takaran Jamu',
      regionId: 'lembah',
      status: 'ACTIVE',
      x: 28.0,
      y: 74.0,
      type: 'MISSION',
      bloom: 'C1 Menemukan Informasi',
      xp: 200,
      description: 'Mengidentifikasi bahan dan takaran yang hilang pada resep ramuan jamu penjernih air di dermaga jukung.',
      action: onEnterLembahInformasi,
    },
    {
      id: 'm-1.2',
      code: 'M-1.2',
      title: 'Klasifikasi Bagian Teks',
      regionId: 'lembah',
      status: 'COMPLETED',
      x: 14.0,
      y: 64.0,
      type: 'MISSION',
      bloom: 'C2 Memilah Struktur',
      xp: 250,
      description: 'Mengelompokkan paragraf ke dalam pilar Tujuan, Material, dan Langkah Kerja di terasering zamrud.',
      action: onEnterLembahInformasi,
    },
    {
      id: 'm-1.3',
      code: 'M-1.3',
      title: 'Audit Plakat Tambang',
      regionId: 'lembah',
      status: allZonesUnlocked ? 'ACTIVE' : 'LOCKED',
      x: 24.0,
      y: 56.0,
      type: 'MISSION',
      bloom: 'C2 Validasi Kelengkapan',
      xp: 300,
      description: 'Menemukan informasi implisit yang tidak tertulis pada instruksi penambangan kristal air terjun.',
      action: onEnterLembahInformasi,
    },

    // 3. Taman Bahasa Nodes (Right Luminous Gardens & Lotus)
    {
      id: 'm-2.1',
      code: 'M-2.1',
      title: 'Pohon Verba Imperatif',
      regionId: 'taman',
      status: 'COMPLETED',
      x: 70.0,
      y: 62.0,
      type: 'MISSION',
      bloom: 'C3 Kata Kerja Perintah',
      xp: 220,
      description: 'Mengubah kalimat pasif deskriptif menjadi kalimat perintah imperatif yang lugas di danau teratai.',
      action: onEnterSequencePuzzle,
    },
    {
      id: 'm-2.2',
      code: 'M-2.2',
      title: 'Labirin Adverbia & Takaran',
      regionId: 'taman',
      status: 'ACTIVE',
      x: 84.0,
      y: 58.0,
      type: 'MISSION',
      bloom: 'C2 Takaran Akurat',
      xp: 280,
      description: 'Mengoreksi ukuran ambigu menjadi takaran baku kuantitatif (gram, mililiter, derajat) di pendopo joglo.',
      action: onEnterSequencePuzzle,
    },
    {
      id: 'm-2.3',
      code: 'M-2.3',
      title: 'Konser Istilah Teknis',
      regionId: 'taman',
      status: allZonesUnlocked ? 'ACTIVE' : 'LOCKED',
      x: 72.0,
      y: 50.0,
      type: 'MISSION',
      bloom: 'C3 Kosakata Khusus',
      xp: 320,
      description: 'Menyelaraskan istilah teknis dan konjungsi temporal dalam panduan operasional di titian kristal.',
      action: onEnterSequencePuzzle,
    },

    // 4. Sungai Logika (Top-Left Crystal River)
    {
      id: 'm-3.1',
      code: 'M-3.1',
      title: 'Jembatan Konjungsi Kronologi',
      regionId: 'sungai',
      status: allZonesUnlocked ? 'ACTIVE' : 'LOCKED',
      x: 22.0,
      y: 32.0,
      type: 'MISSION',
      bloom: 'C4 Analisis Alur',
      xp: 350,
      description: 'Menyusun urutan instruksi yang runtut menggunakan konjungsi temporal agar arus air sungai stabil.',
      action: onEnterSequencePuzzle,
    },
    {
      id: 'm-3.2',
      code: 'M-3.2',
      title: 'Pusaran Langkah Terbalik',
      regionId: 'sungai',
      status: allZonesUnlocked ? 'ACTIVE' : 'LOCKED',
      x: 38.0,
      y: 32.0,
      type: 'MISSION',
      bloom: 'C4 Rekonstruksi Kronologi',
      xp: 400,
      description: 'Menemukan anomali langkah 4 yang mendahului langkah 1 dan mengembalikannya ke posisi logis.',
      action: onEnterSequencePuzzle,
    },

    // 5. Kawasan Prosedur Rusak (Top-Right Volcanic Crater)
    {
      id: 'm-4.1',
      code: 'M-4.1',
      title: 'Kawah Kalimat Ambigu',
      regionId: 'kawasan_rusak',
      status: allZonesUnlocked ? 'ACTIVE' : 'LOCKED',
      x: 74.0,
      y: 34.0,
      type: 'MISSION',
      bloom: 'C5 Evaluasi Cacat Logika',
      xp: 450,
      description: 'Mengidentifikasi prosedur berbahaya di kawah basalt yang tidak menyertakan alat pelindung diri.',
      action: onEnterProcedureGlitch,
    },
    {
      id: 'm-4.2',
      code: 'M-4.2',
      title: 'Altar Candi Glitch Kritis',
      regionId: 'kawasan_rusak',
      status: allZonesUnlocked ? 'ACTIVE' : 'LOCKED',
      x: 88.0,
      y: 36.0,
      type: 'MISSION',
      bloom: 'C5 Audit Total',
      xp: 500,
      description: 'Menganalisis teks prosedur beracun dan memperbaiki keseluruhan 4 pilar agar aman dijalankan.',
      action: onEnterProcedureGlitch,
    },

    // 6. Procedure Forge (Top Peak Golden Spire)
    {
      id: 'm-5.1',
      code: 'M-5.1',
      title: 'Tungku Pusaka Emas C6',
      regionId: 'procedure_forge',
      status: allZonesUnlocked ? 'ACTIVE' : 'LOCKED',
      x: 50.0,
      y: 20.0,
      type: 'BOSS',
      bloom: 'C6 Kreasi Orisinal',
      xp: 1000,
      description: 'Menciptakan karya teks prosedur orisinal yang diuji melalui simulator kelayakan operasional.',
      action: onEnterProcedureForge,
    },
  ];

  const currentRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[1];
  const regionMissions = MAP_NODES.filter((n) => n.regionId === currentRegion.id);

  // Aksara Spoken Voice Handler for Map
  const handleSpeakAksaraAdvice = () => {
    if (isAksaraSpeaking) {
      aksaraVoice.stop();
    } else {
      aksaraVoice.speak(currentRegion.aksaraAdvice);
    }
  };

  // Zoom handlers
  const handleZoomIn = () => {
    soundFX.playChime('click');
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  };
  const handleZoomOut = () => {
    soundFX.playChime('click');
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.85));
  };
  const handleResetZoom = () => {
    soundFX.playChime('click');
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleToggleAudio = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    soundFX.setMuted(next);
    if (!next) soundFX.playChime('click');
  };

  return (
    <div className="relative w-full h-screen bg-[#050C16] text-white flex flex-col justify-between overflow-hidden select-none font-sans">
      {/* 1. TOP BAR NAVIGATION HUD */}
      <header className="relative z-40 h-14 px-3 sm:px-5 bg-[#0A1626]/95 border-b border-[#D4AF37]/50 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md">
        {/* Left: Back to Title & App Title Tag */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              soundFX.playChime('click');
              aksaraVoice.stop();
              onBackToTitle();
            }}
            className="px-3 py-1.5 rounded-xl bg-[#0E2338] hover:bg-[#163654] text-slate-200 hover:text-white border border-[#D4AF37]/40 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FFE082] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Layar Pembuka</span>
          </button>

          {/* Title Plate */}
          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#FFE082] shadow">
              <Compass className="w-4 h-4 text-[#FFE082]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel'] font-black text-xs sm:text-sm text-white tracking-wider truncate">
                  PETA BENUA PROSEDURIA
                </span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-400 text-cyan-300 text-[9px] font-mono font-bold">
                  FASE D
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono hidden md:block">
                Eksplorasi (Zona 1–2) → Progresi (Zona 3–4) → Penguasaan (Zona 5)
              </div>
            </div>
          </div>
        </div>

        {/* Center: Stage Step Pill (TAHAP 2/13 PETA BENUA) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-[#081321] border border-[#D4AF37]/50 shadow-inner">
          <span className="px-2 py-0.5 rounded-full bg-[#D4AF37] text-slate-950 text-[10px] font-mono font-black">
            TAHAP 2/13
          </span>
          <span className="text-xs font-mono text-[#FFE082] font-bold">
            PETA BENUA PROSEDURIA
          </span>
          <span className="text-[10px] text-cyan-300 font-mono">
            • 5 Zona Nusantara
          </span>
        </div>

        {/* Right: Map Display Modes, Cheat Unlock, Sound */}
        <div className="flex items-center gap-2">
          {/* Display Mode Toggle (Solves User Request: Clutter vs Panorama) */}
          <div className="flex items-center bg-[#081321] rounded-xl p-1 border border-[#D4AF37]/30 text-[10px] font-mono font-bold">
            <button
              onClick={() => {
                soundFX.playChime('click');
                setMapDisplayMode('clean_pins');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapDisplayMode === 'clean_pins'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Pin Ringkas (Bebas Tumpukan Teks)"
            >
              Pin Bersih
            </button>
            <button
              onClick={() => {
                soundFX.playChime('click');
                setMapDisplayMode('labeled_pins');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapDisplayMode === 'labeled_pins'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilkan Label Teks Panjang"
            >
              Label
            </button>
            <button
              onClick={() => {
                soundFX.playChime('click');
                setMapDisplayMode('panoramic');
              }}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapDisplayMode === 'panoramic'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mode Pemandangan Panorama"
            >
              Panorama
            </button>
          </div>

          {/* Quick Unlock 5 Zones Toggle */}
          <button
            onClick={() => {
              soundFX.playChime('victory');
              setAllZonesUnlocked(!allZonesUnlocked);
            }}
            className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              allZonesUnlocked
                ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                : 'bg-[#0E2338] hover:bg-[#163654] text-amber-300 border-amber-500/40'
            }`}
            title="Buka seluruh 5 Zona untuk kemudahan navigasi & pengujian"
          >
            <Unlock className="w-3 h-3" />
            <span className="hidden md:inline">
              {allZonesUnlocked ? '5 Zona Terbuka' : 'Buka 5 Zona'}
            </span>
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-[#081321] rounded-xl border border-white/10 p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              title="Perbesar"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              title="Perkecil"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleAudio}
            className="p-1.5 rounded-xl bg-[#0E2338] hover:bg-[#163654] border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            title={soundMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          >
            {soundMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>
        </div>
      </header>

      {/* 2. MAP CANVAS VIEWPORT (WITH 2.5D NUSANTARA ARCHIPELAGO ARTWORK & NON-OVERLAPPING WAYPOINTS) */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-[#071321] cursor-grab active:cursor-grabbing">
        {/* MAP CONTAINER (WITH PAN & ZOOM) */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
          }}
        >
          {/* A. MAP BACKGROUND IMAGE: Khas Nusantara Floating Islands */}
          <img
            src={PROSEDURIA_ASSETS.nusantaraWorldMap}
            alt="Peta Benua Proseduria Khas Nusantara"
            className="w-full h-full object-cover object-center pointer-events-none select-none filter contrast-105 saturate-110"
            referrerPolicy="no-referrer"
          />

          {/* Atmospheric Lighting on Regions */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050C16]/50 via-transparent to-[#050C16]/30 pointer-events-none" />
          <div className="absolute left-[15%] top-[45%] w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute right-[12%] top-[60%] w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute right-[10%] top-[20%] w-80 h-80 rounded-full bg-orange-600/20 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute left-[45%] bottom-[15%] w-72 h-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

          {/* B. REGION BANNERS (CLEANLY ANCHORED, NO COLLISION WITH NODES) */}
          {mapDisplayMode !== 'panoramic' &&
            REGIONS.map((region) => {
              const isSelected = selectedRegionId === region.id;
              const isUnlocked = region.isUnlocked;

              return (
                <div
                  key={region.id}
                  style={{ left: `${region.x}%`, top: `${region.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
                >
                  <div
                    onClick={() => {
                      soundFX.playChime('click');
                      setSelectedRegionId(region.id);
                      setSelectedNode(null);
                      setShowPreviewCard(true);
                    }}
                    className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105 hover:z-25'
                    }`}
                  >
                    {/* Compact Region Plate */}
                    <div
                      className={`px-3 py-1.5 rounded-2xl border-2 flex items-center gap-2 shadow-2xl backdrop-blur-md transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#0E2841] to-[#0A1D30] border-[#FFE082] shadow-[0_0_25px_rgba(255,224,130,0.6)] ring-2 ring-amber-400/40'
                          : isUnlocked
                          ? 'bg-[#081626]/92 border-[#D4AF37]/60 hover:border-[#FFE082]'
                          : 'bg-[#060E18]/85 border-white/20 opacity-75'
                      }`}
                    >
                      {/* Region Number Emblem */}
                      <div
                        className="w-5 h-5 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                        style={{
                          backgroundColor: `${region.colorHex}25`,
                          color: region.colorHex,
                        }}
                      >
                        {isUnlocked ? (
                          <span className="font-['Cinzel'] font-black">
                            {region.number === 0 ? 'H' : region.number}
                          </span>
                        ) : (
                          <Lock className="w-3 h-3 text-slate-400" />
                        )}
                      </div>

                      {/* Region Label */}
                      <div className="text-left">
                        <div className="font-['Cinzel'] font-black text-xs text-white tracking-wider whitespace-nowrap">
                          {region.name.toUpperCase()}
                        </div>
                        <div className="text-[9px] font-mono text-cyan-300 leading-none">
                          {region.bloomLevel} • {region.progressPercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* C. MISSION WAYPOINTS (CIRCULAR GAME BEACONS - ZERO OVERLAP!) */}
          {mapDisplayMode !== 'panoramic' &&
            MAP_NODES.map((node) => {
              const isCompleted = node.status === 'COMPLETED';
              const isActive = node.status === 'ACTIVE';
              const isLocked = node.status === 'LOCKED';
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;

              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-auto"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <div
                    onClick={() => {
                      soundFX.playChime(isCompleted ? 'success' : isActive ? 'cyan' : 'click');
                      setSelectedNode(node);
                      setSelectedRegionId(node.regionId);
                      setShowPreviewCard(true);
                    }}
                    className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-115 hover:z-35'
                    }`}
                  >
                    {/* 1. Circular RPG Waypoint Beacon (36px x 36px) */}
                    <div
                      className={`relative w-9 h-9 rounded-full border-2 flex items-center justify-center shadow-2xl backdrop-blur-md transition-all ${
                        isCompleted
                          ? 'bg-emerald-950/95 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
                          : isActive
                          ? 'bg-gradient-to-br from-cyan-900 to-blue-950 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(0,242,254,0.8)] ring-2 ring-cyan-400/40 animate-pulse'
                          : 'bg-slate-900/90 border-slate-600 text-slate-500 opacity-80'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isActive ? (
                        <Play className="w-3.5 h-3.5 text-cyan-300 fill-current translate-x-0.2" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      )}

                      {/* Active Beacon Ripple Ring */}
                      {isActive && (
                        <span className="absolute -inset-1 rounded-full border border-cyan-400 animate-ping opacity-60 pointer-events-none" />
                      )}
                    </div>

                    {/* 2. Compact Sub-badge with Code Only (e.g. M-1.1) */}
                    <div
                      className={`mt-1 px-1.5 py-0.2 rounded-md border text-[9px] font-mono font-black shadow-md ${
                        isCompleted
                          ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                          : isActive
                          ? 'bg-[#0D2B45]/90 border-cyan-400 text-cyan-200 shadow-[0_0_8px_rgba(0,242,254,0.4)]'
                          : 'bg-black/80 border-white/10 text-slate-400'
                      }`}
                    >
                      {node.code}
                    </div>

                    {/* 3. Optional Labeled Pill (Only when user explicitly selects 'labeled_pins') */}
                    {mapDisplayMode === 'labeled_pins' && (
                      <div className="mt-0.5 px-2 py-0.5 rounded-lg bg-black/85 border border-white/20 text-[9px] font-mono text-white whitespace-nowrap shadow-lg">
                        {node.title.slice(0, 16)}...
                      </div>
                    )}

                    {/* 4. Elegant Hover Tooltip (Floats above pin with zero collision) */}
                    {(isHovered || isSelected) && mapDisplayMode !== 'labeled_pins' && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-[#08182B]/95 border-2 border-cyan-400 shadow-[0_10px_25px_rgba(0,0,0,0.9)] text-left whitespace-nowrap z-50 pointer-events-none animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white">
                          <span className="px-1 py-0.2 rounded bg-cyan-400 text-slate-950 font-mono text-[8px]">
                            {node.code}
                          </span>
                          <span>{node.title}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-[9px] font-mono text-cyan-300 mt-0.5">
                          <span>{node.bloom}</span>
                          <span className="text-amber-300 font-bold">+{node.xp} XP</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {/* D. AKSARA CURRENT LOCATION PIN (DYNAMICALLY MOVES WITH MISSION PROGRESSION) */}
          {mapDisplayMode !== 'panoramic' && (
            <div
              style={{ left: `${currentAksaraPos.x}%`, top: `${currentAksaraPos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto transition-all duration-1000 ease-in-out"
            >
              <div
                onClick={() => {
                  soundFX.playChime('gold');
                  setShowAksaraSpeech(true);
                  handleSpeakAksaraAdvice();
                }}
                className="flex flex-col items-center cursor-pointer group hover:scale-110 transition-transform"
                title={`Aksara berada di ${currentAksaraPos.name}. Klik untuk Mendengarkan Panduan!`}
              >
                {/* Pin Banner */}
                <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-mono font-black text-[9px] shadow-[0_0_18px_rgba(245,158,11,0.9)] border border-amber-200 flex items-center gap-1 animate-bounce">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center text-[8px] font-bold">
                    A
                  </span>
                  <span className="whitespace-nowrap">AKSARA DI SINI • POS TAHAP {highestReachedStageIndex}</span>
                </div>

                {/* Sub-label showing current mission station name */}
                <div className="mt-0.5 px-1.5 py-0.2 rounded-md bg-black/85 border border-amber-400/40 text-[8px] font-mono text-amber-200 whitespace-nowrap shadow-md">
                  {currentAksaraPos.name}
                </div>

                {/* Avatar Beacon */}
                <div className="relative mt-0.5">
                  <div className="w-9 h-9 rounded-full border-2 border-amber-400 bg-amber-500/20 animate-ping absolute inset-0" />
                  <div className="w-9 h-9 rounded-full border-2 border-amber-300 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center ring-2 ring-amber-400/50">
                    <img
                      src={PROSEDURIA_ASSETS.aksaraMascot}
                      alt="Aksara Pemandu Proseduria"
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. FLOATING AKSARA DIALOGUE BOX (TOP-LEFT WITH SPOKEN AUDIO SUPPORT) */}
        {showAksaraSpeech && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-40 max-w-sm sm:max-w-md animate-slideDown">
            <div className="relative p-3.5 rounded-2xl bg-[#081524]/95 border-2 border-[#D4AF37] shadow-[0_15px_40px_rgba(0,0,0,0.85)] backdrop-blur-md">
              {/* Close Button */}
              <button
                onClick={() => {
                  soundFX.playChime('click');
                  aksaraVoice.stop();
                  setShowAksaraSpeech(false);
                }}
                className="absolute top-2.5 right-2.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Tutup Pesan Panduan"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-start gap-3">
                {/* Aksara Avatar */}
                <div
                  onClick={handleSpeakAksaraAdvice}
                  className="w-11 h-11 rounded-xl overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-slate-900 shadow-md cursor-pointer group hover:scale-105 transition-transform relative"
                  title="Klik untuk Memutar Suara Aksara"
                >
                  <img
                    src={PROSEDURIA_ASSETS.aksaraMascot}
                    alt="Aksara Pemandu Proseduria"
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                  {isAksaraSpeaking && (
                    <span className="absolute inset-0 bg-cyan-500/20 border-2 border-cyan-400 rounded-xl animate-pulse" />
                  )}
                </div>

                {/* Dialog Content */}
                <div className="min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1.5 text-[#FFE082] text-xs font-mono font-bold">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>AKSARA: PANDUAN {currentRegion.name.toUpperCase()}</span>
                    </div>

                    {/* Spoken Voice Equalizer */}
                    {isAksaraSpeaking && (
                      <div className="flex items-center gap-0.5 text-cyan-400 text-xs font-mono font-bold">
                        <span className="animate-bounce">|</span>
                        <span className="animate-bounce delay-75">|</span>
                        <span className="animate-bounce delay-150">|</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-100 leading-relaxed italic">
                    "{currentRegion.aksaraAdvice}"
                  </p>

                  {/* Voice Button */}
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={handleSpeakAksaraAdvice}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        isAksaraSpeaking
                          ? 'bg-rose-500 text-white shadow'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110'
                      }`}
                    >
                      {isAksaraSpeaking ? (
                        <>
                          <VolumeX className="w-3 h-3" />
                          <span>Hentikan Suara</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 fill-current" />
                          <span>Dengarkan Suara Aksara</span>
                        </>
                      )}
                    </button>
                    <span className="text-[9px] font-mono text-slate-400">
                      Bahasa Indonesia • Kelas IX
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. CINEMATIC PREVIEW DRAWER (BOTTOM PANEL WITH SIDE-BY-SIDE MISSION LIST - ZERO OVERLAP) */}
        {showPreviewCard && (
          <div className="absolute bottom-2 inset-x-2 sm:inset-x-6 z-40 animate-slideUp">
            <div
              className="relative p-3.5 sm:p-4 rounded-3xl border-2 shadow-[0_20px_60px_rgba(0,0,0,0.95)] backdrop-blur-xl transition-all"
              style={{
                background: `linear-gradient(135deg, #091728F5 0%, #050E1BF8 100%)`,
                borderColor: currentRegion.colorHex,
              }}
            >
              {/* Close / Collapse Button */}
              <button
                onClick={() => setShowPreviewCard(false)}
                className="absolute top-2.5 right-2.5 p-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Sembunyikan Panel"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
                {/* Left: Region Heritage & Info (4 Cols) */}
                <div className="lg:col-span-4 flex flex-col gap-1 pr-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-['Cinzel'] font-bold text-lg border shadow-lg shrink-0"
                      style={{
                        backgroundColor: `${currentRegion.colorHex}20`,
                        borderColor: currentRegion.colorHex,
                        color: currentRegion.colorHex,
                      }}
                    >
                      {currentRegion.number === 0 ? 'H' : currentRegion.number}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-white/10 text-cyan-300 font-bold">
                          ZONA {currentRegion.number} • {currentRegion.bloomLevel}
                        </span>
                        {currentRegion.isUnlocked && (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {currentRegion.progressPercent}% SELESAI
                          </span>
                        )}
                      </div>
                      <h3 className="font-['Cinzel'] font-bold text-sm sm:text-base text-white truncate">
                        {currentRegion.name}
                      </h3>
                      <p className="text-[10px] font-mono text-[#FFE082] truncate">
                        {currentRegion.nusantaraIdentity}
                      </p>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-snug line-clamp-2 mt-0.5">
                    {currentRegion.loreSnippet}
                  </p>
                </div>

                {/* Center: Clean Side-by-Side Mission Waypoint Cards (5 Cols) */}
                <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l lg:border-r border-white/10 pt-2 lg:pt-0 lg:px-3">
                  <div className="text-[10px] font-mono font-bold text-cyan-300 mb-1.5 flex items-center justify-between">
                    <span>DAFTAR MISI ({regionMissions.length} MISI):</span>
                    <span className="text-amber-300">Pilih misi untuk menjelajah</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {regionMissions.map((mis) => {
                      const isSelected = selectedNode?.id === mis.id;
                      const isCompleted = mis.status === 'COMPLETED';
                      const isActive = mis.status === 'ACTIVE';

                      return (
                        <div
                          key={mis.id}
                          onClick={() => {
                            soundFX.playChime('click');
                            setSelectedNode(mis);
                          }}
                          className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-[#0D2B45] border-cyan-400 shadow-[0_0_12px_rgba(0,242,254,0.4)] scale-102'
                              : isCompleted
                              ? 'bg-emerald-950/40 border-emerald-500/40 hover:border-emerald-400'
                              : isActive
                              ? 'bg-[#0A1A2B]/80 border-cyan-500/40 hover:border-cyan-400'
                              : 'bg-black/40 border-white/10 opacity-70'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                            <span className="font-bold text-cyan-300">{mis.code}</span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            ) : isActive ? (
                              <Play className="w-2.5 h-2.5 text-cyan-400 fill-current" />
                            ) : (
                              <Lock className="w-2.5 h-2.5 text-slate-400" />
                            )}
                          </div>
                          <div className="text-[10px] font-bold text-white truncate">
                            {mis.title}
                          </div>
                          <div className="text-[8px] font-mono text-slate-400 mt-0.5">
                            +{mis.xp} XP
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Embark Action Button (3 Cols) */}
                <div className="lg:col-span-3 flex flex-col justify-center gap-1.5 pt-2 lg:pt-0">
                  <button
                    onClick={() => {
                      soundFX.playChime('gold');
                      aksaraVoice.stop();
                      if (selectedNode) {
                        selectedNode.action();
                      } else {
                        currentRegion.action();
                      }
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#B38728] hover:brightness-110 text-slate-950 font-['Cinzel'] font-black text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(212,175,55,0.7)] flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>
                      {selectedNode ? `Masuki ${selectedNode.code}` : `Jelajahi ${currentRegion.name}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center text-[10px] font-mono text-slate-400">
                    {selectedNode
                      ? `${selectedNode.title} • ${selectedNode.bloom}`
                      : `${currentRegion.shortDesc.slice(0, 45)}...`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: WORLD RESTORATION DIALOG */}
      {showRestorationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#08182B] border-2 border-[#D4AF37] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-['Cinzel'] text-[#FFE082] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Simulasi Pemulihan Dunia (Restoration)
              </h3>
              <button
                onClick={() => setShowRestorationModal(false)}
                className="px-3 py-1 rounded-lg bg-[#0D2B45] text-slate-300 hover:text-white border border-[#D4AF37]/30 text-xs font-mono cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <WorldRestorationSlider compact={false} />
          </div>
        </div>
      )}
    </div>
  );
};
