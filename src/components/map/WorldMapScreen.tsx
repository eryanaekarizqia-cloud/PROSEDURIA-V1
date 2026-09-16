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
  Unlock,
  ArrowRight,
  BookOpen,
  Eye,
  Key,
  Award,
  MapPin,
  X,
  Plus,
  Minus,
  RotateCcw,
  Volume2,
  VolumeX,
  Briefcase,
  User,
  Sliders,
} from 'lucide-react';
import { WorldRestorationSlider } from '../restoration/WorldRestorationSlider';
import { AksaraSatchelModal } from './AksaraSatchelModal';
import { AksaraCharacterSheetModal } from '../character/AksaraCharacterSheetModal';
import { AksaraBustVisual } from '../character/AksaraBustVisual';

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
  stepNumber: number;
  waypointName: string;
  title: string;
  regionId: string;
  status: 'COMPLETED' | 'ACTIVE' | 'LOCKED';
  x: number; // percentage on map
  y: number;
  type: 'HUB' | 'MISSION' | 'BOSS';
  categoryTitle: string;
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
  adventureStageName: string;
  adventureFocus: string;
  colorHex: string;
  borderCol: string;
  x: number;
  y: number;
  progressPercent: number;
  totalMissions: number;
  completedMissions: number;
  requiredStageToUnlock: number;
  unlockKeyName: string;
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
  // Dynamic Aksara Location based on mission progress
  const getAksaraPos = (stageIdx: number) => {
    switch (stageIdx) {
      case 1:
      case 2:
        return {
          x: 50.0,
          y: 76.0,
          name: 'Akademi Prosedur (Inisiasi)',
          zoneName: 'Pusat Inisiasi',
          advice: 'Halo Penjelajah! Mulai langkah pertamamu dari Lembah Informasi di barat daya!',
        };
      case 3:
        return {
          x: 28.0,
          y: 70.0,
          name: 'Lembah Informasi (Dermaga Jamu)',
          zoneName: 'Zona 1: Lembah Informasi',
          advice: 'Aku berada di Dermaga Jamu Kuno! Mari kita telusuri 4 pilar struktur teks prosedur!',
        };
      case 4:
        return {
          x: 20.0,
          y: 56.0,
          name: 'Pos Reaktor Alpha-01',
          zoneName: 'Zona 1: Pos Reaktor',
          advice: 'Waspada! Aku berada di Pos Reaktor Alpha untuk mengawasi takaran bahan bioplasma!',
        };
      case 5:
        return {
          x: 74.0,
          y: 66.0,
          name: 'Taman Bahasa Nusantara',
          zoneName: 'Zona 2: Taman Bahasa',
          advice: 'Kunci Taman Bahasa telah terbuka! Ayo telusuri verba perintah dan takaran presisi!',
        };
      case 6:
      case 7:
        return {
          x: 38.0,
          y: 46.0,
          name: 'Sungai Logika Nusantara',
          zoneName: 'Zona 3: Sungai Logika',
          advice: 'Arus Sungai Logika butuh bantuanmu! Rangkai kronologi langkah kerja agar arus kembali tenang!',
        };
      case 8:
      case 9:
        return {
          x: 84.0,
          y: 35.0,
          name: 'Kawasan Prosedur Rusak',
          zoneName: 'Zona 4: Kawah Basalt',
          advice: 'Peringatan anomali! Karantina teks berbahaya dan perbaiki cacat logika di altar candi ini!',
        };
      case 10:
      case 11:
      case 12:
        return {
          x: 50.0,
          y: 20.0,
          name: 'Tungku Cipta Prosedur',
          zoneName: 'Zona 5: Tungku Emas',
          advice: 'Puncak peradaban! Ayo tempa teks prosedur orisinalmu sendiri hingga meraih gelar Maestro!',
        };
      default:
        return {
          x: 50.0,
          y: 8.0,
          name: 'Krisis Inti Reaktor Sentral',
          zoneName: 'Krisis Pamungkas',
          advice: 'Misi darurat pamungkas! Aku berada di Inti Reaktor Sentral untuk penyelamatan terakhir!',
        };
    }
  };

  const currentAksaraPos = getAksaraPos(highestReachedStageIndex);

  // States
  const [selectedRegionId, setSelectedRegionId] = useState<string>('lembah');
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<MapNode | null>(null);
  const [showPreviewCard, setShowPreviewCard] = useState<boolean>(true);
  const [showAksaraSpeech, setShowAksaraSpeech] = useState<boolean>(true);
  const [isAksaraSpeaking, setIsAksaraSpeaking] = useState<boolean>(false);
  const [mapDisplayMode, setMapDisplayMode] = useState<'clean_pins' | 'labeled_pins' | 'panoramic'>('clean_pins');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Game unlocking & progression state
  const [freeRoamMode, setFreeRoamMode] = useState<boolean>(false);
  const [showRestorationModal, setShowRestorationModal] = useState<boolean>(false);
  const [showSatchelModal, setShowSatchelModal] = useState<boolean>(false);
  const [showCharacterSheetModal, setShowCharacterSheetModal] = useState<boolean>(false);
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);
  const [soundMuted, setSoundMuted] = useState<boolean>(soundFX.getMuted());

  // Listen to Aksara voice synthesizer
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

  // Exploration Progression Logic: Regions unlock as player progresses through stages
  const isRegionUnlocked = (regionId: string, requiredStage: number) => {
    if (freeRoamMode) return true;
    if (regionId === 'akademi' || regionId === 'lembah') return true;
    return (highestReachedStageIndex ?? 1) >= requiredStage;
  };

  const getRegionUnlockRequirementText = (region: MapRegion) => {
    switch (region.id) {
      case 'taman':
        return 'Selesaikan eksplorasi di Lembah Informasi (Tahap 3) untuk membuka Kunci Teratai Cyan.';
      case 'sungai':
        return 'Selesaikan teka-teki kaidah bahasa di Taman Bahasa (Tahap 5) untuk membuka Kunci Arung Logika.';
      case 'kawasan_rusak':
        return 'Selesaikan penataan kronologi di Sungai Logika (Tahap 7) untuk membuka Kunci Kawah Basalt.';
      case 'procedure_forge':
        return 'Selesaikan audit anomali di Kawasan Rusak (Tahap 9) untuk membuka Kunci Pusaka Emas.';
      default:
        return 'Wilayah awal terbuka untuk dijelajahi.';
    }
  };

  // 5 REGIONS OF NUSANTARA (FREE FROM TECHNICAL CODES LIKE C1-C6)
  const REGIONS: MapRegion[] = [
    {
      id: 'akademi',
      number: 0,
      name: 'Akademi Prosedur',
      nusantaraIdentity: 'Inspirasi: Gerbang Candi & Keraton Nusantara',
      biome: 'Pusat Pembelajaran & Benteng Awal',
      adventureStageName: 'Pusat Inisiasi',
      adventureFocus: 'Pengenalan Anatomi 4 Pilar Prosedur',
      colorHex: '#38BDF8',
      borderCol: 'border-sky-400',
      x: 50.0,
      y: 88.0,
      progressPercent: 100,
      totalMissions: 2,
      completedMissions: 2,
      requiredStageToUnlock: 1,
      unlockKeyName: 'Kunci Gerbang Candi',
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
      adventureStageName: 'Ekspedisi Takaran',
      adventureFocus: 'Ekstraksi Bahan & Langkah Tersembunyi',
      colorHex: '#10B981',
      borderCol: 'border-emerald-400',
      x: 18.0,
      y: 48.0,
      progressPercent: (highestReachedStageIndex ?? 1) >= 4 ? 100 : 66,
      totalMissions: 3,
      completedMissions: (highestReachedStageIndex ?? 1) >= 4 ? 3 : 2,
      requiredStageToUnlock: 1,
      unlockKeyName: 'Kunci Segel Lembah',
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
      adventureStageName: 'Kaidah Kebahasaan',
      adventureFocus: 'Verba Perintah Imperatif & Adverbia Presisi',
      colorHex: '#00F2FE',
      borderCol: 'border-cyan-400',
      x: 82.0,
      y: 72.0,
      progressPercent: (highestReachedStageIndex ?? 1) >= 6 ? 100 : (highestReachedStageIndex ?? 1) >= 4 ? 40 : 0,
      totalMissions: 3,
      completedMissions: (highestReachedStageIndex ?? 1) >= 6 ? 3 : (highestReachedStageIndex ?? 1) >= 4 ? 1 : 0,
      requiredStageToUnlock: 4,
      unlockKeyName: 'Kunci Teratai Cyan',
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
      adventureStageName: 'Penataan Kronologi',
      adventureFocus: 'Rekonstruksi Urutan Runtut & Konjungsi',
      colorHex: '#3B82F6',
      borderCol: 'border-blue-400',
      x: 32.0,
      y: 22.0,
      progressPercent: (highestReachedStageIndex ?? 1) >= 8 ? 100 : (highestReachedStageIndex ?? 1) >= 6 ? 30 : 0,
      totalMissions: 2,
      completedMissions: (highestReachedStageIndex ?? 1) >= 8 ? 2 : 0,
      requiredStageToUnlock: 6,
      unlockKeyName: 'Kunci Arung Logika',
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
      adventureStageName: 'Karantina Glitch',
      adventureFocus: 'Audit Cacat Logika & Prosedur Bahaya',
      colorHex: '#F59E0B',
      borderCol: 'border-amber-400',
      x: 84.0,
      y: 22.0,
      progressPercent: (highestReachedStageIndex ?? 1) >= 10 ? 100 : (highestReachedStageIndex ?? 1) >= 8 ? 50 : 0,
      totalMissions: 2,
      completedMissions: (highestReachedStageIndex ?? 1) >= 10 ? 2 : 0,
      requiredStageToUnlock: 8,
      unlockKeyName: 'Kunci Kawah Basalt',
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
      name: 'Tungku Cipta Prosedur',
      nusantaraIdentity: 'Inspirasi: Puncak Kerajaan Majapahit & Tungku Pusaka Emas',
      biome: 'Puncak Kastil Melayang & Tungku Emas Menyala',
      adventureStageName: 'Puncak Maestro',
      adventureFocus: 'Menempa Teks Prosedur Orisinal Siap Uji',
      colorHex: '#EC4899',
      borderCol: 'border-pink-400',
      x: 50.0,
      y: 8.0,
      progressPercent: (highestReachedStageIndex ?? 1) >= 12 ? 100 : 0,
      totalMissions: 1,
      completedMissions: (highestReachedStageIndex ?? 1) >= 12 ? 1 : 0,
      requiredStageToUnlock: 10,
      unlockKeyName: 'Kunci Pusaka Emas',
      shortDesc: 'Rancang dan tempa teks prosedur orisinalmu sendiri hingga meraih predikat Maestro Logika.',
      loreSnippet:
        'Puncak tertinggi Proseduria tempat tungku pusaka menyala abadi. Para Maestro Logika merancang prosedur mutlak untuk menyelamatkan seluruh peradaban Nusantara.',
      features: ['Tungku tempa emas pijar', 'Puncak kastil kubah emas', 'Simulasi kelayakan operasional'],
      aksaraAdvice:
        'Buktikan keahlian tertinggimu di sini dengan menyusun teks prosedur baru yang lengkap, sistematis, dan aman!',
      action: onEnterProcedureForge,
    },
  ];

  // INTERACTIVE EXPEDITION WAYPOINTS (PURE ADVENTURE CHECKPOINTS - ZERO TECHNICAL CODES)
  const MAP_NODES: MapNode[] = [
    // 1. Akademi Prosedur Waypoints
    {
      id: 'pos-init-1',
      stepNumber: 1,
      waypointName: 'Gerbang Inisiasi',
      title: 'Gerbang Akademi Proseduria',
      regionId: 'akademi',
      status: 'COMPLETED',
      x: 43.0,
      y: 76.0,
      type: 'HUB',
      categoryTitle: 'Penerimaan Buku Logika',
      xp: 100,
      description: 'Pengenalan misi utama dan penerimaan Magic Logbook dari Pemandu Aksara.',
      action: onEnterLembahInformasi,
    },
    {
      id: 'pos-init-2',
      stepNumber: 2,
      waypointName: 'Balai Anatomi',
      title: 'Arsip Anatomi 4 Pilar',
      regionId: 'akademi',
      status: 'COMPLETED',
      x: 57.0,
      y: 76.0,
      type: 'HUB',
      categoryTitle: 'Struktur Teks Prosedur',
      xp: 150,
      description: 'Mempelajari anatomi 4 pilar teks prosedur: Tujuan, Material, Langkah, dan Penutup.',
      action: onEnterLembahInformasi,
    },

    // 2. Lembah Informasi Waypoints
    {
      id: 'pos-lembah-1',
      stepNumber: 3,
      waypointName: 'Dermaga Jamu',
      title: 'Misteri Takaran Jamu Kuno',
      regionId: 'lembah',
      status: (highestReachedStageIndex ?? 1) > 3 ? 'COMPLETED' : 'ACTIVE',
      x: 28.0,
      y: 74.0,
      type: 'MISSION',
      categoryTitle: 'Eksplorasi Takaran Bahan',
      xp: 200,
      description: 'Mengidentifikasi bahan dan takaran yang hilang pada resep ramuan jamu penjernih air di dermaga jukung.',
      action: onEnterLembahInformasi,
    },
    {
      id: 'pos-lembah-2',
      stepNumber: 4,
      waypointName: 'Terasering Zamrud',
      title: 'Klasifikasi Paragraf 4 Pilar',
      regionId: 'lembah',
      status: (highestReachedStageIndex ?? 1) >= 4 ? 'COMPLETED' : 'ACTIVE',
      x: 14.0,
      y: 64.0,
      type: 'MISSION',
      categoryTitle: 'Memilah Struktur 4 Pilar',
      xp: 250,
      description: 'Mengelompokkan kalimat ke dalam pilar Tujuan, Material, dan Langkah Kerja di terasering zamrud.',
      action: onEnterLembahInformasi,
    },
    {
      id: 'pos-lembah-3',
      stepNumber: 5,
      waypointName: 'Plakat Air Terjun',
      title: 'Audit Plakat Air Terjun Suci',
      regionId: 'lembah',
      status: (highestReachedStageIndex ?? 1) >= 4 ? 'COMPLETED' : 'ACTIVE',
      x: 24.0,
      y: 56.0,
      type: 'MISSION',
      categoryTitle: 'Validasi Informasi Terselubung',
      xp: 300,
      description: 'Menemukan informasi implisit yang tidak tertulis pada instruksi penambangan kristal air terjun.',
      action: onEnterLembahInformasi,
    },

    // 3. Taman Bahasa Waypoints
    {
      id: 'pos-taman-1',
      stepNumber: 6,
      waypointName: 'Danau Teratai',
      title: 'Pohon Verba Perintah Lugas',
      regionId: 'taman',
      status: !isRegionUnlocked('taman', 4) ? 'LOCKED' : (highestReachedStageIndex ?? 1) >= 6 ? 'COMPLETED' : 'ACTIVE',
      x: 70.0,
      y: 62.0,
      type: 'MISSION',
      categoryTitle: 'Verba Imperatif Lugas',
      xp: 220,
      description: 'Mengubah kalimat pasif deskriptif menjadi kalimat perintah imperatif yang lugas di danau teratai.',
      action: onEnterSequencePuzzle,
    },
    {
      id: 'pos-taman-2',
      stepNumber: 7,
      waypointName: 'Pendopo Joglo',
      title: 'Labirin Takaran Baku Presisi',
      regionId: 'taman',
      status: !isRegionUnlocked('taman', 4) ? 'LOCKED' : (highestReachedStageIndex ?? 1) >= 6 ? 'COMPLETED' : 'ACTIVE',
      x: 82.0,
      y: 58.0,
      type: 'MISSION',
      categoryTitle: 'Adverbia & Ukuran Baku',
      xp: 280,
      description: 'Mengoreksi ukuran ambigu menjadi takaran baku kuantitatif (gram, mililiter, derajat) di pendopo joglo.',
      action: onEnterSequencePuzzle,
    },
    {
      id: 'pos-taman-3',
      stepNumber: 8,
      waypointName: 'Titian Kristal',
      title: 'Harmoni Istilah Operasional',
      regionId: 'taman',
      status: !isRegionUnlocked('taman', 4) ? 'LOCKED' : (highestReachedStageIndex ?? 1) >= 6 ? 'COMPLETED' : 'ACTIVE',
      x: 72.0,
      y: 50.0,
      type: 'MISSION',
      categoryTitle: 'Kosakata Operasional',
      xp: 320,
      description: 'Menyelaraskan istilah teknis dan konjungsi temporal dalam panduan operasional di titian kristal.',
      action: onEnterSequencePuzzle,
    },

    // 4. Sungai Logika Waypoints
    {
      id: 'pos-sungai-1',
      stepNumber: 9,
      waypointName: 'Ngarai Kronologi',
      title: 'Titian Konjungsi Waktu',
      regionId: 'sungai',
      status: !isRegionUnlocked('sungai', 6) ? 'LOCKED' : (highestReachedStageIndex ?? 1) >= 8 ? 'COMPLETED' : 'ACTIVE',
      x: 22.0,
      y: 32.0,
      type: 'MISSION',
      categoryTitle: 'Rangkai Urutan Kronologis',
      xp: 350,
      description: 'Menyusun urutan instruksi yang runtut menggunakan konjungsi temporal agar arus air sungai stabil.',
      action: onEnterSequencePuzzle,
    },
    {
      id: 'pos-sungai-2',
      stepNumber: 10,
      waypointName: 'Jeram Logika',
      title: 'Pusaran Langkah Terbalik',
      regionId: 'sungai',
      status: !isRegionUnlocked('sungai', 6) ? 'LOCKED' : (highestReachedStageIndex ?? 1) >= 8 ? 'COMPLETED' : 'ACTIVE',
      x: 38.0,
      y: 32.0,
      type: 'MISSION',
      categoryTitle: 'Koreksi Langkah Teracak',
      xp: 400,
      description: 'Menemukan anomali langkah yang mendahului langkah persiapan dan mengembalikannya ke posisi logis.',
      action: onEnterSequencePuzzle,
    },

    // 5. Kawasan Prosedur Rusak Waypoints
    {
      id: 'pos-rusak-1',
      stepNumber: 11,
      waypointName: 'Kawah Glitch',
      title: 'Kawah Kalimat Ambigu',
      regionId: 'kawasan_rusak',
      status: !isRegionUnlocked('kawasan_rusak', 8) ? 'LOCKED' : (highestReachedStageIndex ?? 1) >= 10 ? 'COMPLETED' : 'ACTIVE',
      x: 74.0,
      y: 34.0,
      type: 'MISSION',
      categoryTitle: 'Deteksi Cacat Logika',
      xp: 450,
      description: 'Mengidentifikasi prosedur berbahaya di kawah basalt yang tidak menyertakan alat pelindung diri.',
      action: onEnterProcedureGlitch,
    },
    {
      id: 'pos-rusak-2',
      stepNumber: 12,
      waypointName: 'Altar Basalt',
      title: 'Altar Candi Glitch Kritis',
      regionId: 'kawasan_rusak',
      status: !isRegionUnlocked('kawasan_rusak', 8) ? 'LOCKED' : (highestReachedStageIndex ?? 1) >= 10 ? 'COMPLETED' : 'ACTIVE',
      x: 88.0,
      y: 36.0,
      type: 'MISSION',
      categoryTitle: 'Audit Teks Berbahaya',
      xp: 500,
      description: 'Menganalisis teks prosedur beracun dan memperbaiki keseluruhan 4 pilar agar aman dijalankan.',
      action: onEnterProcedureGlitch,
    },

    // 6. Tungku Cipta Prosedur Waypoint
    {
      id: 'pos-forge-1',
      stepNumber: 13,
      waypointName: 'Tungku Pusaka',
      title: 'Tungku Pusaka Emas Maestro',
      regionId: 'procedure_forge',
      status: !isRegionUnlocked('procedure_forge', 10) ? 'LOCKED' : (highestReachedStageIndex ?? 1) >= 12 ? 'COMPLETED' : 'ACTIVE',
      x: 50.0,
      y: 20.0,
      type: 'BOSS',
      categoryTitle: 'Tempa Prosedur Orisinal',
      xp: 1000,
      description: 'Menciptakan karya teks prosedur orisinal yang diuji langsung melalui simulator kelayakan operasional.',
      action: onEnterProcedureForge,
    },
  ];

  const currentRegion = REGIONS.find((r) => r.id === selectedRegionId) || REGIONS[1];
  const regionMissions = MAP_NODES.filter((n) => n.regionId === currentRegion.id);
  const isCurrentRegionUnlocked = isRegionUnlocked(currentRegion.id, currentRegion.requiredStageToUnlock);

  // Aksara Spoken Voice Handler
  const handleSpeakAksaraAdvice = () => {
    if (isAksaraSpeaking) {
      aksaraVoice.stop();
    } else {
      aksaraVoice.speak(currentRegion.aksaraAdvice);
    }
  };

  // Attempt to enter a mission or region, enforcing the lock
  const handleAttemptAction = (node?: MapNode | null) => {
    const targetRegion = node ? REGIONS.find((r) => r.id === node.regionId) || currentRegion : currentRegion;
    const isUnlocked = isRegionUnlocked(targetRegion.id, targetRegion.requiredStageToUnlock);

    if (!isUnlocked) {
      soundFX.playChime('error');
      const reqText = getRegionUnlockRequirementText(targetRegion);
      setLockedNotice(`🔒 Segel Anomali Aktif! ${targetRegion.name} masih terkunci. ${reqText}`);
      aksaraVoice.speak(`Wilayah ${targetRegion.name} masih terkunci! Selesaikan misi sebelumnya untuk membuka kuncinya.`);
      return;
    }

    if (node && node.status === 'LOCKED') {
      soundFX.playChime('error');
      setLockedNotice(`🔒 Pos ini masih terkunci! Selesaikan pos sebelumnya terlebih dahulu.`);
      aksaraVoice.speak(`Pos ini masih terkunci! Selesaikan pos sebelumnya terlebih dahulu.`);
      return;
    }

    soundFX.playChime('gold');
    aksaraVoice.stop();
    if (node) {
      node.action();
    } else {
      targetRegion.action();
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
      {/* 1. TOP GAME HUD (AUTHENTIC EDUCATIONAL GAME FEEL) */}
      <header className="relative z-40 h-14 px-3 sm:px-5 bg-[#0A1626]/95 border-b border-[#D4AF37]/50 flex items-center justify-between gap-2 sm:gap-3 shadow-2xl backdrop-blur-md">
        {/* Left: Back to Title & Map Exploration Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              soundFX.playChime('click');
              aksaraVoice.stop();
              onBackToTitle();
            }}
            className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#0E2338] hover:bg-[#163654] text-slate-200 hover:text-white border border-[#D4AF37]/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FFE082] group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Kembali</span>
          </button>

          {/* Title Emblem */}
          <div className="flex items-center gap-2 border-l border-white/10 pl-2 sm:pl-3">
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#FFE082] shadow">
              <Compass className="w-4 h-4 text-[#FFE082]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel'] font-black text-xs sm:text-sm text-white tracking-wider truncate">
                  PETA JELAJAH PROSEDURIA
                </span>
                <span className="hidden md:inline px-1.5 py-0.2 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[9px] font-mono font-bold">
                  MODE EKSPLORASI
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono hidden lg:block">
                Jelajahi setiap wilayah dan kumpulkan kunci petualangan teks prosedur
              </div>
            </div>
          </div>
        </div>

        {/* Center: Aksara Explorer Satchel & Character Sheet Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Tas Penjelajah Aksara Button */}
          <button
            onClick={() => {
              soundFX.playChime('gold');
              setShowSatchelModal(true);
            }}
            className="px-2.5 sm:px-3 py-1 rounded-xl bg-gradient-to-r from-[#0F2D4A] to-[#0A1D30] hover:from-[#153D63] hover:to-[#0F2A45] border border-amber-400/60 text-[#FFE082] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-all hover:scale-102"
            title="Buka Tas Penjelajah (Koleksi Kunci & Buku Saku)"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Tas Penjelajah</span>
            <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[9px] font-bold">
              {highestReachedStageIndex >= 10 ? '5/5' : highestReachedStageIndex >= 8 ? '4/5' : highestReachedStageIndex >= 6 ? '3/5' : highestReachedStageIndex >= 4 ? '2/5' : '1/5'} Kunci
            </span>
          </button>

          {/* Lembar Karakter Aksara Button */}
          <button
            onClick={() => {
              soundFX.playChime('gold');
              setShowCharacterSheetModal(true);
            }}
            className="px-2.5 sm:px-3 py-1 rounded-xl bg-[#08182B] hover:bg-[#0E2841] border border-cyan-400/50 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-102"
            title="Lihat Lembar Karakter Resmi Aksara (12 Ekspresi)"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Karakter Aksara</span>
          </button>

          {/* World Restoration Simulation */}
          <button
            onClick={() => {
              soundFX.playChime('victory');
              setShowRestorationModal(true);
            }}
            className="px-2.5 py-1 rounded-xl border border-emerald-500/40 bg-[#0E2338] hover:bg-[#163654] text-emerald-300 text-[10px] font-mono font-bold hidden xl:flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Saksikan simulasi pemulihan benua Nusantara dari distorsi glitch"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Pemulihan Benua</span>
          </button>
        </div>

        {/* Right: Map Pin Filter & Sound */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Display Mode: Clean Pins vs Labeled */}
          <div className="flex items-center bg-[#081321] rounded-xl p-1 border border-[#D4AF37]/30 text-[10px] font-mono font-bold">
            <button
              onClick={() => {
                soundFX.playChime('click');
                setMapDisplayMode('clean_pins');
              }}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                mapDisplayMode === 'clean_pins'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilan Pin Bersih (Tanpa Teks Menumpuk)"
            >
              Pin Bersih
            </button>
            <button
              onClick={() => {
                soundFX.playChime('click');
                setMapDisplayMode('labeled_pins');
              }}
              className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                mapDisplayMode === 'labeled_pins'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Tampilkan Nama Pos"
            >
              Label
            </button>
          </div>

          {/* Quick Demo Unlocking Toggle (Allows Reviewers to explore all or test real lock) */}
          <button
            onClick={() => {
              soundFX.playChime('click');
              setFreeRoamMode(!freeRoamMode);
            }}
            className={`p-1.5 rounded-xl border text-xs cursor-pointer transition-all ${
              freeRoamMode
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={freeRoamMode ? 'Mode Bebas Aktif (Semua Kunci Terbuka)' : 'Mode Petualangan Normal (Buka Kunci Bertahap)'}
          >
            {freeRoamMode ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5" />}
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-[#081321] rounded-xl border border-white/10 p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              title="Perbesar Peta"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
              title="Perkecil Peta"
            >
              <Minus className="w-3.5 h-3.5" />
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

      {/* 2. MAP CANVAS VIEWPORT */}
      <main className="relative flex-1 w-full h-full overflow-hidden bg-[#071321] cursor-grab active:cursor-grabbing">
        {/* MAP CONTAINER (PAN & ZOOM) */}
        <div
          className="relative w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{
            transform: `scale(${zoomLevel}) translate(${panPosition.x}px, ${panPosition.y}px)`,
          }}
        >
          {/* Nusantara World Map Artwork */}
          <img
            src={PROSEDURIA_ASSETS.nusantaraWorldMap}
            alt="Peta Benua Proseduria Khas Nusantara"
            className="w-full h-full object-cover object-center pointer-events-none select-none filter contrast-105 saturate-110"
            referrerPolicy="no-referrer"
          />

          {/* Atmosphere Lighting */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050C16]/50 via-transparent to-[#050C16]/30 pointer-events-none" />
          <div className="absolute left-[15%] top-[45%] w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute right-[12%] top-[60%] w-64 h-64 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
          <div className="absolute right-[10%] top-[20%] w-80 h-80 rounded-full bg-orange-600/20 blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute left-[45%] bottom-[15%] w-72 h-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

          {/* EXPEDITION TRAIL PATH (CONNECTING WAYPOINTS IN SEQUENCE LIKE A REAL RPG MAP) */}
          {mapDisplayMode !== 'panoramic' && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
              <defs>
                <filter id="trailGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {MAP_NODES.slice(0, -1).map((node, i) => {
                const nextNode = MAP_NODES[i + 1];
                const isNextUnlocked = nextNode.status !== 'LOCKED';
                const isCurrentCompleted = node.status === 'COMPLETED';

                return (
                  <g key={`trail-${node.id}-${nextNode.id}`}>
                    {/* Shadow underlying line */}
                    <line
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${nextNode.x}%`}
                      y2={`${nextNode.y}%`}
                      stroke="#030812"
                      strokeWidth="6"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                    {/* Glowing Route Trail */}
                    <line
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${nextNode.x}%`}
                      y2={`${nextNode.y}%`}
                      stroke={isCurrentCompleted ? '#10B981' : isNextUnlocked ? '#00F2FE' : '#475569'}
                      strokeWidth={isCurrentCompleted || isNextUnlocked ? '3' : '2'}
                      strokeDasharray={isCurrentCompleted ? '7 5' : isNextUnlocked ? '5 5' : '4 6'}
                      strokeLinecap="round"
                      filter={isCurrentCompleted || isNextUnlocked ? 'url(#trailGlow)' : undefined}
                      opacity={isCurrentCompleted ? 0.95 : isNextUnlocked ? 0.85 : 0.4}
                    />
                  </g>
                );
              })}
            </svg>
          )}

          {/* A. REGION BANNERS (CLEAN EXPLORATION LABELS) */}
          {mapDisplayMode !== 'panoramic' &&
            REGIONS.map((region) => {
              const isSelected = selectedRegionId === region.id;
              const isUnlocked = isRegionUnlocked(region.id, region.requiredStageToUnlock);

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
                      if (!isUnlocked) {
                        setLockedNotice(`🔒 ${region.name} masih tersegel. Selesaikan misi sebelumnya untuk membuka.`);
                      }
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
                      {/* Emblem / Key Lock */}
                      <div
                        className="w-5 h-5 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                        style={{
                          backgroundColor: `${region.colorHex}25`,
                          color: region.colorHex,
                        }}
                      >
                        {isUnlocked ? (
                          <Compass className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3 h-3 text-amber-300" />
                        )}
                      </div>

                      {/* Region Title & Explorer Status */}
                      <div className="text-left">
                        <div className="font-['Cinzel'] font-black text-xs text-white tracking-wider whitespace-nowrap flex items-center gap-1.5">
                          <span>{region.name.toUpperCase()}</span>
                          {!isUnlocked && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/25 text-amber-300 text-[8px] font-mono font-bold flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> TERSEGEL
                            </span>
                          )}
                        </div>
                        <div className="text-[9px] font-mono text-cyan-300 leading-none mt-0.5">
                          {region.adventureStageName} • {isUnlocked ? `${region.progressPercent}% Tuntas` : 'Segel Aktif'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* B. MISSION WAYPOINTS (BEACONS WITH ZERO TECHNICAL CODES) */}
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
                      if (isLocked) {
                        handleAttemptAction(node);
                      }
                    }}
                    className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                      isSelected ? 'scale-125 z-40' : 'hover:scale-115 hover:z-35'
                    }`}
                  >
                    {/* Circular Waypoint Beacon (38px x 38px) */}
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

                    {/* Step Name Badge - Clean Adventure Waypoint Name */}
                    <div
                      className={`mt-1 px-2 py-0.5 rounded-full border text-[9px] font-mono font-bold shadow-md whitespace-nowrap transition-all ${
                        isCompleted
                          ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
                          : isActive
                          ? 'bg-[#0D2B45]/95 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,242,254,0.5)] scale-105'
                          : 'bg-black/85 border-white/10 text-slate-400'
                      }`}
                    >
                      {node.waypointName}
                    </div>

                    {/* Optional Labeled Text (When toggled to 'labeled_pins') */}
                    {mapDisplayMode === 'labeled_pins' && (
                      <div className="mt-0.5 px-2 py-0.5 rounded-lg bg-black/85 border border-white/20 text-[9px] font-mono text-white whitespace-nowrap shadow-lg">
                        {node.title.slice(0, 18)}...
                      </div>
                    )}

                    {/* Clean Hover Tooltip */}
                    {(isHovered || isSelected) && mapDisplayMode !== 'labeled_pins' && (
                      <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-[#08182B]/95 border-2 border-cyan-400 shadow-[0_10px_25px_rgba(0,0,0,0.9)] text-left whitespace-nowrap z-50 pointer-events-none animate-fadeIn">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white">
                          <span className="px-1.5 py-0.2 rounded bg-cyan-400 text-slate-950 font-mono text-[8px] font-bold">
                            {node.waypointName}
                          </span>
                          <span>{node.title}</span>
                        </div>
                        <div className="flex items-center justify-between gap-3 text-[9px] font-mono text-cyan-300 mt-0.5">
                          <span>{node.categoryTitle}</span>
                          <span className="text-amber-300 font-bold">+{node.xp} XP</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {/* C. AKSARA CURRENT LOCATION BEACON (DYNAMICALLY WALKS THE MAP) */}
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
                <div className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-mono font-black text-[9px] shadow-[0_0_18px_rgba(245,158,11,0.9)] border border-amber-200 flex items-center gap-1 animate-bounce">
                  <Compass className="w-3 h-3 text-slate-950 animate-spin" style={{ animationDuration: '10s' }} />
                  <span className="whitespace-nowrap font-bold">AKSARA DI SINI</span>
                </div>

                {/* Sub-label station name */}
                <div className="mt-0.5 px-2 py-0.2 rounded-md bg-black/90 border border-amber-400/40 text-[8px] font-mono text-amber-200 whitespace-nowrap shadow-md">
                  {currentAksaraPos.name}
                </div>

                {/* Avatar Beacon */}
                <div className="relative mt-0.5">
                  <div className="w-11 h-11 rounded-full border-2 border-amber-400 bg-amber-500/20 animate-ping absolute inset-0" />
                  <div className="w-11 h-11 rounded-full border-2 border-amber-300 bg-slate-950 overflow-hidden shadow-2xl flex items-center justify-center ring-2 ring-amber-400/50">
                    <AksaraBustVisual expression="SENANG" size={44} showCompassBadge={false} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. LOCK NOTICE NOTIFICATION TOAST */}
        {lockedNotice && (
          <div className="absolute top-4 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-lg p-3 rounded-2xl bg-[#1A0A0A]/95 border-2 border-rose-500 text-white shadow-2xl backdrop-blur-md animate-slideDown flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-400 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <p className="text-xs text-rose-100 font-sans leading-snug">
                {lockedNotice}
              </p>
            </div>
            <button
              onClick={() => setLockedNotice(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 4. FLOATING AKSARA DIALOGUE BOX (TOP-LEFT WITH SPOKEN AUDIO) */}
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
                  className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shrink-0 bg-slate-900 shadow-md cursor-pointer group hover:scale-105 transition-transform relative flex items-center justify-center"
                  title="Klik untuk Memutar Suara Aksara"
                >
                  <AksaraBustVisual
                    expression={isAksaraSpeaking ? 'BERSEMANGAT' : 'NORMAL'}
                    size={46}
                    isSpeaking={isAksaraSpeaking}
                    showCompassBadge={false}
                  />
                  {isAksaraSpeaking && (
                    <span className="absolute inset-0 bg-cyan-500/20 border-2 border-cyan-400 rounded-2xl animate-pulse pointer-events-none" />
                  )}
                </div>

                {/* Dialog Content */}
                <div className="min-w-0 pr-4">
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1.5 text-[#FFE082] text-xs font-mono font-bold">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PANDUAN PENJELAJAH AKSARA</span>
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

                  {/* Voice Controls */}
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
                      Bahasa Indonesia • Petualangan Logika
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. CINEMATIC PREVIEW DRAWER (BOTTOM EXPEDITION CONTROL PANEL) */}
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
                      <Compass className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-cyan-300 font-bold">
                          {currentRegion.adventureStageName}
                        </span>
                        {isCurrentRegionUnlocked ? (
                          <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{currentRegion.progressPercent}% TUNTAS</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>TERSEGEL</span>
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

                {/* Center: Mission Waypoint Cards (5 Cols) */}
                <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l lg:border-r border-white/10 pt-2 lg:pt-0 lg:px-3">
                  <div className="text-[10px] font-mono font-bold text-cyan-300 mb-1.5 flex items-center justify-between">
                    <span>LOKASI MISI ({regionMissions.length} Titik):</span>
                    <span className="text-amber-300">
                      {isCurrentRegionUnlocked ? 'Pilih lokasi untuk menjelajah' : 'Wilayah Masih Tersegel'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {regionMissions.map((mis) => {
                      const isSelected = selectedNode?.id === mis.id;
                      const isCompleted = mis.status === 'COMPLETED';
                      const isActive = mis.status === 'ACTIVE';
                      const isLocked = mis.status === 'LOCKED';

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
                            <span className="font-bold text-cyan-300 truncate">{mis.waypointName}</span>
                            {isCompleted ? (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            ) : isActive ? (
                              <Play className="w-2.5 h-2.5 text-cyan-400 fill-current shrink-0" />
                            ) : (
                              <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] font-bold text-white truncate">
                            {mis.title}
                          </div>
                          <div className="text-[8px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
                            <span>{mis.categoryTitle.slice(0, 14)}</span>
                            <span className="text-amber-300 font-bold">+{mis.xp} XP</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right: Embark Action Button (3 Cols) */}
                <div className="lg:col-span-3 flex flex-col justify-center gap-1.5 pt-2 lg:pt-0">
                  <button
                    onClick={() => handleAttemptAction(selectedNode)}
                    className={`w-full py-3 rounded-2xl font-['Cinzel'] font-black text-xs sm:text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all transform hover:scale-102 active:scale-98 cursor-pointer shadow-lg ${
                      isCurrentRegionUnlocked
                        ? 'bg-gradient-to-r from-[#D4AF37] via-[#F5C842] to-[#B38728] hover:brightness-110 text-slate-950 shadow-[0_0_25px_rgba(212,175,55,0.7)]'
                        : 'bg-gradient-to-r from-slate-800 to-slate-900 border border-white/20 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isCurrentRegionUnlocked ? (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>{selectedNode ? `Jelajahi ${selectedNode.waypointName}` : `Masuki ${currentRegion.name}`}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Wilayah Tersegel</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-[10px] font-mono text-slate-400">
                    {isCurrentRegionUnlocked
                      ? selectedNode
                        ? `${selectedNode.title}`
                        : `${currentRegion.adventureFocus}`
                      : `${currentRegion.unlockKeyName} Dibutuhkan`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 6. MODAL: AKSARA SATCHEL (TAS PENJELAJAH) */}
      <AksaraSatchelModal
        isOpen={showSatchelModal}
        onClose={() => setShowSatchelModal(false)}
        highestReachedStageIndex={highestReachedStageIndex}
      />

      {/* 7. MODAL: OFFICIAL CHARACTER SHEET */}
      <AksaraCharacterSheetModal
        isOpen={showCharacterSheetModal}
        onClose={() => setShowCharacterSheetModal(false)}
      />

      {/* 8. MODAL: WORLD RESTORATION DIALOG */}
      {showRestorationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#08182B] border-2 border-[#D4AF37] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-['Cinzel'] text-[#FFE082] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Simulasi Pemulihan Benua Nusantara
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
