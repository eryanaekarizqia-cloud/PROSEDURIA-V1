/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { soundFX } from '../../utils/audioEffects';
import { aksaraVoice } from '../../utils/aksaraVoice';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import {
  Compass,
  ArrowLeft,
  Sparkles,
  Lock,
  ArrowRight,
  BookOpen,
  Eye,
  X,
  Volume2,
  VolumeX,
  Briefcase,
  User,
  Coffee,
  Flame,
  Search,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronUp,
  MapPin,
  Layers,
  HelpCircle,
  Award,
} from 'lucide-react';
import { WorldRestorationSlider } from '../restoration/WorldRestorationSlider';
import { AksaraCharacterSheetModal } from '../character/AksaraCharacterSheetModal';
import { AksaraBustVisual } from '../character/AksaraBustVisual';
import { AksaraAvatar } from '../character/AksaraAvatar';
import {
  AkademiProseduriaSymbol3D,
  PulauRasaNusantaraSymbol3D,
  PulauBumiHijauSymbol3D,
  PulauWarisanSymbol3D,
  PulauKaryaSymbol3D,
  GerbangPembuktianSymbol3D,
} from './IslandSymbols3D';

export interface WorldMapScreenProps {
  onBackToTitle: () => void;
  onEnterLembahInformasi: () => void;
  onEnterMission01?: () => void;
  onEnterFinalCase: () => void;
  onEnterSequencePuzzle?: () => void;
  onEnterProcedureGlitch?: () => void;
  onEnterProcedureForge?: () => void;
  highestReachedStageIndex?: number;
}

export interface IslandRegion {
  id: string;
  number: number;
  name: string;
  subtitle: string;
  status: 'ACTIVE' | 'LOCKED' | 'COMPLETED';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  primaryColor: string;
  accentColor: string;
  glowColor: string;
  activeMissionId: string;
  activeMissionName: string;
  bloomTaxonomy: string;
  lore: string;
  proceduralChallenge: string;
  aksaraAdvice: string;
  landmarkIcon: string;
}

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  onBackToTitle,
  onEnterLembahInformasi,
  onEnterMission01,
  highestReachedStageIndex = 1,
}) => {
  // 6 EXACT ISLAND REGIONS OF PROSEDURIA
  const ISLANDS: IslandRegion[] = [
    {
      id: 'akademi',
      number: 1,
      name: 'Akademi PROSEDURIA',
      subtitle: 'Pusat ilmu, tempat semua petualangan dimulai.',
      status: 'ACTIVE',
      x: 20,
      y: 38,
      primaryColor: '#38BDF8',
      accentColor: '#0284C7',
      glowColor: 'rgba(56, 189, 248, 0.45)',
      activeMissionId: 'M01',
      activeMissionName: 'Jejak yang Hilang',
      bloomTaxonomy: 'C1 & C2 (Anatomi 4 Pilar & Penafsiran)',
      lore: 'Kastel megah terapung dengan menara kristal safir dan kubah observatorium langit. Di sinilah para Penjelajah Logika dilatih mengenali anatomi 4 pilar teks prosedur (Tujuan, Alat & Bahan, Langkah-Langkah, Penutup).',
      proceduralChallenge: 'Investigasi teks prosedur jamu kuno di Lembah Informasi yang langkah-langkahnya diacak oleh anomali logika.',
      aksaraAdvice: 'Selamat datang di Akademi! Kompas Prosedurku mendeteksi anomali pertama di Lembah Informasi. Ayo mulai investigasi!',
      landmarkIcon: '🏰',
    },
    {
      id: 'pulau_rasa',
      number: 2,
      name: 'Pulau Rasa Nusantara',
      subtitle: 'Menjelajahi cita rasa, rempah, dan jamu Nusantara.',
      status: 'LOCKED',
      x: 43,
      y: 23,
      primaryColor: '#F59E0B',
      accentColor: '#D97706',
      glowColor: 'rgba(245, 158, 11, 0.4)',
      activeMissionId: 'M02',
      activeMissionName: 'Resep Rahasia Rempah',
      bloomTaxonomy: 'C3 (Verba Imperatif & Takaran Presisi)',
      lore: 'Kepulauan kuliner tropis dengan lampion hangat, kedai rempah kayu jati, dan kebun jahe merah. Mempelajari verba perintah imperatif dan adverbia takaran kuantitatif terukur.',
      proceduralChallenge: 'Menemukan takaran gram/ml yang hilang pada resep obat tradisional agar ramuan tidak menjadi racun.',
      aksaraAdvice: 'Wilayah ini masih terkunci! Selesaikan M01 di Akademi PROSEDURIA terlebih dahulu untuk membuka segel rempah.',
      landmarkIcon: '🌶️',
    },
    {
      id: 'pulau_bumi_hijau',
      number: 3,
      name: 'Pulau Bumi Hijau',
      subtitle: 'Merawat lingkungan, memahami alam dan keberlanjutan.',
      status: 'LOCKED',
      x: 43,
      y: 70,
      primaryColor: '#10B981',
      accentColor: '#059669',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      activeMissionId: 'M03',
      activeMissionName: 'Harmoni Hutan Biosfer',
      bloomTaxonomy: 'C3 & C4 (Konjungsi Kronologis & Logika Lingkungan)',
      lore: 'Hutan hujan tropis bertingkat dengan kubah bioma kaca raksasa dan air terjun kristal. Mengajarkan teks prosedur pelestarian alam, daur ulang organik, dan teknologi hijau.',
      proceduralChallenge: 'Menyusun kronologi bertanam hidroponik dan instalasi panel surya tanpa ada tahapan terlewat.',
      aksaraAdvice: 'Hutan biosfer belum stabil! Selesaikan misi sebelumnya agar kita mendapatkan kunci kristal zamrud untuk masuk.',
      landmarkIcon: '🌿',
    },
    {
      id: 'pulau_warisan',
      number: 4,
      name: 'Pulau Warisan',
      subtitle: 'Melestarikan budaya, musik, dan kearifan tradisi.',
      status: 'LOCKED',
      x: 66,
      y: 25,
      primaryColor: '#EC4899',
      accentColor: '#BE185D',
      glowColor: 'rgba(236, 72, 153, 0.4)',
      activeMissionId: 'M04',
      activeMissionName: 'Melodi Gamelan Abadi',
      bloomTaxonomy: 'C4 (Evaluasi Glitch Budaya & Akurasi Tradisi)',
      lore: 'Kompleks candi batu purba dengan gapura Paduraksa merah megah, pendopo gamelan perunggu, dan sanggar membatik canting. Melatih ketelitian instruksi manual karya seni pusaka.',
      proceduralChallenge: 'Mengurutkan tahap pewarnaan kain batik canting dan pelarutan malam lilin dengan suhu presisi.',
      aksaraAdvice: 'Pintu gerbang gapura candi masih tertutup energi anomali. Kita harus menuntaskan misi di pulau sebelumnya!',
      landmarkIcon: '🏛️',
    },
    {
      id: 'pulau_karya',
      number: 5,
      name: 'Pulau Karya',
      subtitle: 'Berkarya, mencipta, dan mewujudkan ide menjadi nyata.',
      status: 'LOCKED',
      x: 67,
      y: 70,
      primaryColor: '#6366F1',
      accentColor: '#4F46E5',
      glowColor: 'rgba(99, 102, 241, 0.4)',
      activeMissionId: 'M05',
      activeMissionName: 'Bengkel Rancang Mandiri',
      bloomTaxonomy: 'C5 & C6 (Penyuntingan Baku & Rancang Prosedur Orisinal)',
      lore: 'Pulau rekayasa mekanik dan alkimia dengan kincir air raksasa, roda gerigi perunggu berputar, dan tungku perakitan. Pusat merancang teks prosedur mandiri dari nol.',
      proceduralChallenge: 'Menulis teks prosedur orisinal dari nol dengan kaidah kebahasaan baku yang memenuhi 4 pilar lengkap.',
      aksaraAdvice: 'Tungku cipta karya hanya akan menyala setelah kamu membuktikan keahlian diagnostik di pulau-pulau sebelumnya.',
      landmarkIcon: '⚙️',
    },
    {
      id: 'gerbang_pembuktian',
      number: 6,
      name: 'Gerbang Pembuktian',
      subtitle: 'Tantangan terakhir untuk membuktikan kemampuanmu sebagai Penjelajah Logika.',
      status: 'LOCKED',
      x: 87,
      y: 46,
      primaryColor: '#A855F7',
      accentColor: '#7E22CE',
      glowColor: 'rgba(168, 85, 247, 0.45)',
      activeMissionId: 'M06',
      activeMissionName: 'Ujian Pamungkas Sang Maestro',
      bloomTaxonomy: 'C6 (Mastery Evaluasi & Kreasi Komprehensif)',
      lore: 'Portal megalitikum batu purba di puncak tebing karang samudra yang memancarkan pendar aurora kosmik. Gerbang asesmen pamungkas untuk meraih lencana Penjelajah Logika Paripurna.',
      proceduralChallenge: 'Menyelesaikan investigasi multi-prosedur dengan tingkat kerumitan tertinggi (evaluasi & kreasi C5-C6).',
      aksaraAdvice: 'Ini adalah gerbang ujian akhir! Kunci portal baru akan terisi jika seluruh 5 pulau sebelumnya telah kamu pulihkan.',
      landmarkIcon: '🌌',
    },
  ];

  // Selected Island & UI States
  const [selectedIsland, setSelectedIsland] = useState<IslandRegion>(ISLANDS[0]);
  const [hoveredIsland, setHoveredIsland] = useState<IslandRegion | null>(null);
  const [showIslandModal, setShowIslandModal] = useState<boolean>(false);
  const [showCharacterSheet, setShowCharacterSheet] = useState<boolean>(false);
  const [showRestorationModal, setShowRestorationModal] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundFX.getMuted());
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapFilter, setMapFilter] = useState<'ALL' | 'LEYLINES' | 'ACTIVE'>('ALL');
  const [aksaraSpeechText, setAksaraSpeechText] = useState<string>(
    'Akademi PROSEDURIA adalah titik awal perjalanan kita. Kompas Prosedurku telah mendeteksi anomali di Misi 01: Jejak yang Hilang!'
  );
  const [activeOverlayMenu, setActiveOverlayMenu] = useState<'NONE' | 'WILAYAH' | 'MEKANIK' | 'REVIEW' | 'BUKTI' | 'PETUNJUK' | 'KOMPAS'>('NONE');
  const [selectedInteractiveObject, setSelectedInteractiveObject] = useState<{
    name: string;
    category: string;
    icon: string;
    role: string;
    imperativeVerbs: string[];
    consequence: string;
  } | null>(null);

  // 7 Interactive Objects from M01 Hot Chocolate Procedure (matching concept sheet)
  const INTERACTIVE_OBJECTS = [
    {
      id: 'cangkir',
      name: 'Cangkir',
      category: 'Wadah Saji',
      icon: '☕',
      role: 'Mug keramik tahan panas untuk menampung dan mencampur semua bahan.',
      imperativeVerbs: ['Siapkan cangkir bersih', 'Letakkan di atas meja datar', 'Sajikan selagi hangat'],
      consequence: 'Jika cangkir basah atau berdebu, cita rasa minuman terkontaminasi.',
    },
    {
      id: 'sendok',
      name: 'Sendok',
      category: 'Alat Pengaduk',
      icon: '🥄',
      role: 'Alat pengaduk untuk melarutkan bubuk cokelat dan gula hingga homogen.',
      imperativeVerbs: ['Aduk searah jarum jam', 'Pastikan tidak ada endapan di dasar'],
      consequence: 'Jika tidak diaduk rata, minuman akan terasa hambar di atas dan pekat di dasar.',
    },
    {
      id: 'bubuk_cokelat',
      name: 'Bubuk Cokelat',
      category: 'Bahan Baku Inti',
      icon: '🍫',
      role: 'Bahan bubuk kaya kakao alami yang memberikan cita rasa cokelat mantap.',
      imperativeVerbs: ['Masukkan 2 sendok makan bubuk cokelat', 'Ayak halus bila menggumpal'],
      consequence: 'Jika dimasukkan setelah air mendidih tanpa diaduk cepat, akan terbentuk gumpalan kering.',
    },
    {
      id: 'gula',
      name: 'Gula Pasir',
      category: 'Bahan Pemanis',
      icon: '🧂',
      role: 'Pemanis alami penyeimbang rasa pahit kakao.',
      imperativeVerbs: ['Tambahkan 1 sendok teh gula pasir', 'Takar sesuai selera'],
      consequence: 'Jika berlebihan, rasa autentik kakao tertutup manis yang enek.',
    },
    {
      id: 'air_panas',
      name: 'Air Panas',
      category: 'Pelarut Termal',
      icon: '💧',
      role: 'Air bersuhu 90°C–95°C yang melarutkan partikel cokelat dan gula.',
      imperativeVerbs: ['Tuangkan 150 ml air panas perlahan-lahan', 'Awas percikan air panas'],
      consequence: 'Jika menggunakan air dingin, lemak kakao tidak akan meleleh dan bubuk mengapung.',
    },
    {
      id: 'ketel',
      name: 'Ketel (Cerek)',
      category: 'Alat Pemanas',
      icon: '🫖',
      role: 'Wadah bertutup rapat untuk mendidihkan air minum secara higienis.',
      imperativeVerbs: ['Isi ketel dengan air bersih', 'Tutup rapat sebelum dinyalakan'],
      consequence: 'Jangan memanaskan ketel kosong karena dapat merusak lapisan logam.',
    },
    {
      id: 'kompor',
      name: 'Kompor',
      category: 'Sumber Kalor',
      icon: '🔥',
      role: 'Sumber api terkontrol untuk menghasilkan energi panas mendidihkan air.',
      imperativeVerbs: ['Nyalakan kompor dengan api sedang', 'Matikan setelah air mendidih'],
      consequence: 'Kecerobohan pada kompor dapat memicu bahaya luka bakar atau kebakaran.',
    },
  ];

  // Audio mute toggle
  const toggleMute = () => {
    const next = !isMuted;
    soundFX.setMuted(next);
    setIsMuted(next);
    if (!next) soundFX.playChime('click');
  };

  // Play voice narration for Aksara advice
  const handlePlayVoice = (text: string) => {
    aksaraVoice.speak(text);
  };

  // Handle island click
  const handleIslandClick = (island: IslandRegion) => {
    setSelectedIsland(island);
    setAksaraSpeechText(island.aksaraAdvice);
    if (island.status === 'ACTIVE') {
      soundFX.playChime('cyan');
    } else {
      soundFX.playChime('click');
    }
    setShowIslandModal(true);
  };

  return (
    <div className="relative w-full h-full bg-[#030814] text-slate-100 overflow-hidden select-none font-sans flex flex-col">
      {/* ========================================================================= */}
      {/* 1. TOP FLOATING OFFICIAL IDENTITY & NAVIGATION HEADER BAR                 */}
      {/* ========================================================================= */}
      <header className="absolute top-0 inset-x-0 z-30 px-3 sm:px-6 py-2 bg-gradient-to-b from-[#061122]/95 via-[#040C1A]/85 to-transparent flex items-center justify-between pointer-events-auto backdrop-blur-sm">
        {/* Left: Back Button (min 44x44px touch target) */}
        <button
          onClick={() => {
            soundFX.playChime('cyan');
            onBackToTitle();
          }}
          className="btn-touch px-3 py-1.5 rounded-xl btn-game-dark text-[#FFE082] text-xs font-mono flex items-center gap-2 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Beranda</span>
        </button>

        {/* Center: Title & Official Subtitle */}
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#FFE082] animate-spin-slow" />
            <h1 className="font-['Cinzel'] font-black text-lg sm:text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C0] via-[#F5C842] to-[#D4AF37] drop-shadow-[0_2px_12px_rgba(212,175,55,0.7)]">
              PETA DUNIA PROSEDURIA
            </h1>
            <Compass className="w-5 h-5 text-[#FFE082] animate-spin-slow" />
          </div>
          <span className="text-[10px] font-mono text-cyan-300 tracking-wider hidden sm:block">
            6 WILAYAH KEPULAUAN LOGIKA • SMP FASE D KELAS IX
          </span>
        </div>

        {/* Right Controls: Filter, Profile, Audio, Zoom */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Filter Pills */}
          <div className="hidden md:flex items-center gap-1 bg-[#040C1A]/90 p-1 rounded-xl border border-slate-700/60 text-[11px] font-mono">
            <button
              onClick={() => setMapFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapFilter === 'ALL' ? 'bg-[#D4AF37] text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setMapFilter('LEYLINES')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapFilter === 'LEYLINES' ? 'bg-[#D4AF37] text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Jalur Logika
            </button>
            <button
              onClick={() => setMapFilter('ACTIVE')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                mapFilter === 'ACTIVE' ? 'bg-[#38BDF8] text-slate-950 font-black shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              M01 Aktif
            </button>
          </div>

          {/* Aksara Profile Button (min 44x44px touch) */}
          <button
            onClick={() => {
              soundFX.playChime('victory');
              setShowCharacterSheet(true);
            }}
            className="btn-touch px-3 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37]/25 to-[#8C6D23]/30 hover:from-[#D4AF37]/35 hover:to-[#8C6D23]/40 border border-[#D4AF37]/60 text-[#FFE082] text-xs font-mono flex items-center gap-1.5 shadow-md transition-all"
            title="Profil Aksara"
          >
            <User className="w-4 h-4" />
            <span className="hidden lg:inline font-bold">Profil Aksara</span>
          </button>

          {/* Sound Toggle (min 44x44px touch) */}
          <button
            onClick={toggleMute}
            className="btn-touch w-11 h-11 rounded-xl bg-[#08182B]/90 hover:bg-[#0E2847] border border-white/15 text-slate-300 transition-colors shadow-md"
            title={isMuted ? 'Nyalakan Audio' : 'Senyapkan Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-[#FFE082]" />}
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. THE 100% FULL-SCREEN WORLD MAP CANVAS                                   */}
      {/* ========================================================================= */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {/* The Scalable/Pannable Archipelago Canvas Container */}
        <div
          className="absolute inset-0 transition-transform duration-500 origin-center"
          style={{ transform: `scale(${mapZoom})` }}
        >
          {/* Background Illustration of Nusantara Fantasy Archipelago */}
          <img
            src={PROSEDURIA_ASSETS.nusantaraWorldMap}
            alt="Peta Nusantara Proseduria"
            className="w-full h-full object-cover object-center filter brightness-95 contrast-110 saturate-110 pointer-events-none"
          />

          {/* Deep Sea & Atmospheric Shading Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#040C1A]/80 via-transparent to-[#040C1A]/50 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#030814]/20 to-[#02050B]/70 pointer-events-none" />

          {/* Atmospheric Mist Clouds covering legacy map text */}
          <div className="absolute top-[82%] left-[8%] w-52 h-14 bg-sky-950/70 blur-md rounded-full pointer-events-none" />
          <div className="absolute top-[65%] left-[50%] w-52 h-14 bg-amber-950/70 blur-md rounded-full pointer-events-none" />
          <div className="absolute top-[12%] left-[48%] w-48 h-12 bg-slate-900/70 blur-md rounded-full pointer-events-none" />
          <div className="absolute top-[65%] left-[86%] w-44 h-14 bg-purple-950/70 blur-md rounded-full pointer-events-none" />

          {/* SVG Glowing Navigation Trails, Ley-lines, and Reef Glows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 650" preserveAspectRatio="none">
            <defs>
              <linearGradient id="goldPath" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.95" />
                <stop offset="25%" stopColor="#F59E0B" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.95" />
                <stop offset="75%" stopColor="#EC4899" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#A855F7" stopOpacity="0.95" />
              </linearGradient>

              <filter id="islandGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="9" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Shallow Reef Bioluminescence */}
            <ellipse cx="200" cy="245" rx="125" ry="75" fill="#0284C7" opacity="0.32" filter="url(#islandGlow)" />
            <ellipse cx="430" cy="150" rx="115" ry="65" fill="#D97706" opacity="0.28" filter="url(#islandGlow)" />
            <ellipse cx="430" cy="455" rx="120" ry="75" fill="#059669" opacity="0.28" filter="url(#islandGlow)" />
            <ellipse cx="660" cy="160" rx="115" ry="70" fill="#BE185D" opacity="0.28" filter="url(#islandGlow)" />
            <ellipse cx="670" cy="455" rx="120" ry="75" fill="#4F46E5" opacity="0.28" filter="url(#islandGlow)" />
            <ellipse cx="870" cy="300" rx="130" ry="80" fill="#7E22CE" opacity="0.32" filter="url(#islandGlow)" />

            {/* Glowing Golden Chronological Ley-Line Lanes (Connecting 1 -> 2 -> 3 -> 4 -> 5 -> 6) */}
            {(mapFilter === 'ALL' || mapFilter === 'LEYLINES') && (
              <>
                {/* 1 (Akademi) -> 2 (Pulau Rasa Nusantara) */}
                <path
                  d="M 200 245 Q 310 140 430 150"
                  fill="none"
                  stroke="url(#goldPath)"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                  className="animate-pulse"
                />
                {/* 2 (Pulau Rasa) -> 3 (Pulau Bumi Hijau) */}
                <path
                  d="M 430 150 Q 490 305 430 455"
                  fill="none"
                  stroke="url(#goldPath)"
                  strokeWidth="3.5"
                  strokeDasharray="8 8"
                />
                {/* 3 (Pulau Bumi Hijau) -> 4 (Pulau Warisan) */}
                <path
                  d="M 430 455 Q 550 310 660 160"
                  fill="none"
                  stroke="url(#goldPath)"
                  strokeWidth="3.5"
                  strokeDasharray="8 8"
                />
                {/* 4 (Pulau Warisan) -> 5 (Pulau Karya) */}
                <path
                  d="M 660 160 Q 720 310 670 455"
                  fill="none"
                  stroke="url(#goldPath)"
                  strokeWidth="3.5"
                  strokeDasharray="8 8"
                />
                {/* 5 (Pulau Karya) -> 6 (Gerbang Pembuktian) */}
                <path
                  d="M 670 455 Q 770 380 870 300"
                  fill="none"
                  stroke="url(#goldPath)"
                  strokeWidth="4"
                  strokeDasharray="8 8"
                />
              </>
            )}

            {/* Active Starting Beacon Ring */}
            <circle cx="200" cy="245" r="8" fill="#38BDF8" className="animate-ping" />
          </svg>

          {/* ============================================================= */}
          {/* THE 6 AUTHENTIC 2D/3D ISLAND SYMBOLS                           */}
          {/* ============================================================= */}

          {/* 1. AKADEMI PROSEDURIA (ACTIVE STARTING POINT) */}
          <div
            onClick={() => handleIslandClick(ISLANDS[0])}
            onMouseEnter={() => setHoveredIsland(ISLANDS[0])}
            onMouseLeave={() => setHoveredIsland(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-20 ${
              mapFilter === 'ACTIVE' || mapFilter === 'ALL' ? 'opacity-100 scale-105 hover:scale-115' : 'opacity-40 scale-95'
            }`}
            style={{ left: `${ISLANDS[0].x}%`, top: `${ISLANDS[0].y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <AkademiProseduriaSymbol3D isActive={true} />

              {/* High-Contrast Active Pill Badge */}
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#08182B]/95 border-2 border-cyan-400 text-cyan-200 font-mono text-[10.5px] font-black shadow-[0_0_20px_rgba(56,189,248,0.8)] mt-[-4px]">
                <span className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center text-[9px] font-black">
                  1
                </span>
                <span className="tracking-wider">AKADEMI PROSEDURIA</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-400/25 text-cyan-300 text-[8.5px] font-mono uppercase">
                  AKTIF
                </span>
              </div>
            </div>
          </div>

          {/* 2. PULAU RASA NUSANTARA */}
          <div
            onClick={() => handleIslandClick(ISLANDS[1])}
            onMouseEnter={() => setHoveredIsland(ISLANDS[1])}
            onMouseLeave={() => setHoveredIsland(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-15 ${
              mapFilter === 'ACTIVE' ? 'opacity-35' : 'opacity-95 hover:opacity-100 hover:scale-110'
            }`}
            style={{ left: `${ISLANDS[1].x}%`, top: `${ISLANDS[1].y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <PulauRasaNusantaraSymbol3D />

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08182B]/90 border border-amber-500/60 text-amber-200 font-mono text-[10px] font-bold shadow-lg mt-[-4px]">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500/30 text-amber-300 flex items-center justify-center text-[9px] font-bold">
                  2
                </span>
                <span className="whitespace-nowrap">PULAU RASA NUSANTARA</span>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>
          </div>

          {/* 3. PULAU BUMI HIJAU */}
          <div
            onClick={() => handleIslandClick(ISLANDS[2])}
            onMouseEnter={() => setHoveredIsland(ISLANDS[2])}
            onMouseLeave={() => setHoveredIsland(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-15 ${
              mapFilter === 'ACTIVE' ? 'opacity-35' : 'opacity-95 hover:opacity-100 hover:scale-110'
            }`}
            style={{ left: `${ISLANDS[2].x}%`, top: `${ISLANDS[2].y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <PulauBumiHijauSymbol3D />

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08182B]/90 border border-emerald-500/60 text-emerald-200 font-mono text-[10px] font-bold shadow-lg mt-[-4px]">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center text-[9px] font-bold">
                  3
                </span>
                <span className="whitespace-nowrap">PULAU BUMI HIJAU</span>
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* 4. PULAU WARISAN */}
          <div
            onClick={() => handleIslandClick(ISLANDS[3])}
            onMouseEnter={() => setHoveredIsland(ISLANDS[3])}
            onMouseLeave={() => setHoveredIsland(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-15 ${
              mapFilter === 'ACTIVE' ? 'opacity-35' : 'opacity-95 hover:opacity-100 hover:scale-110'
            }`}
            style={{ left: `${ISLANDS[3].x}%`, top: `${ISLANDS[3].y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <PulauWarisanSymbol3D />

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08182B]/90 border border-pink-500/60 text-pink-200 font-mono text-[10px] font-bold shadow-lg mt-[-4px]">
                <span className="w-3.5 h-3.5 rounded-full bg-pink-500/30 text-pink-300 flex items-center justify-center text-[9px] font-bold">
                  4
                </span>
                <span className="whitespace-nowrap">PULAU WARISAN</span>
                <Lock className="w-3.5 h-3.5 text-pink-400" />
              </div>
            </div>
          </div>

          {/* 5. PULAU KARYA */}
          <div
            onClick={() => handleIslandClick(ISLANDS[4])}
            onMouseEnter={() => setHoveredIsland(ISLANDS[4])}
            onMouseLeave={() => setHoveredIsland(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-15 ${
              mapFilter === 'ACTIVE' ? 'opacity-35' : 'opacity-95 hover:opacity-100 hover:scale-110'
            }`}
            style={{ left: `${ISLANDS[4].x}%`, top: `${ISLANDS[4].y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <PulauKaryaSymbol3D />

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08182B]/90 border border-indigo-500/60 text-indigo-200 font-mono text-[10px] font-bold shadow-lg mt-[-4px]">
                <span className="w-3.5 h-3.5 rounded-full bg-indigo-500/30 text-indigo-300 flex items-center justify-center text-[9px] font-bold">
                  5
                </span>
                <span className="whitespace-nowrap">PULAU KARYA</span>
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
            </div>
          </div>

          {/* 6. GERBANG PEMBUKTIAN */}
          <div
            onClick={() => handleIslandClick(ISLANDS[5])}
            onMouseEnter={() => setHoveredIsland(ISLANDS[5])}
            onMouseLeave={() => setHoveredIsland(null)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-15 ${
              mapFilter === 'ACTIVE' ? 'opacity-35' : 'opacity-95 hover:opacity-100 hover:scale-110'
            }`}
            style={{ left: `${ISLANDS[5].x}%`, top: `${ISLANDS[5].y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <GerbangPembuktianSymbol3D />

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08182B]/90 border border-purple-500/60 text-purple-200 font-mono text-[10px] font-bold shadow-lg mt-[-4px]">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-[9px] font-bold">
                  6
                </span>
                <span className="whitespace-nowrap">GERBANG PEMBUKTIAN</span>
                <Lock className="w-3.5 h-3.5 text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING HOVER MINI-HUD TOOLTIP */}
        {hoveredIsland && (
          <div
            className="absolute z-40 pointer-events-none p-3.5 rounded-2xl bg-[#08172C]/95 border border-[#D4AF37] shadow-[0_10px_35px_rgba(0,0,0,0.95)] max-w-xs animate-fadeIn backdrop-blur-md"
            style={{
              left: `${Math.min(Math.max(hoveredIsland.x, 22), 76)}%`,
              top: hoveredIsland.y > 50 ? `${hoveredIsland.y - 18}%` : `${hoveredIsland.y + 14}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{hoveredIsland.landmarkIcon}</span>
                <span className="font-bold text-sm text-white">{hoveredIsland.name}</span>
              </div>
              <span
                className={`text-[9.5px] font-mono px-2 py-0.5 rounded font-bold ${
                  hoveredIsland.status === 'ACTIVE'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {hoveredIsland.status === 'ACTIVE' ? 'Aktif' : 'Terkunci'}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug mb-2">
              {hoveredIsland.subtitle}
            </p>
            <div className="text-[9.5px] font-mono text-[#FFE082] flex items-center justify-between border-t border-white/10 pt-1.5">
              <span>{hoveredIsland.activeMissionId}: {hoveredIsland.activeMissionName}</span>
              <span className="text-cyan-400 font-bold">Klik untuk info →</span>
            </div>
          </div>
        )}

        {/* FLOATING HUD LEFT: AKSARA COMPANION QUICK DIALOGUE */}
        <div className="absolute bottom-24 sm:bottom-24 left-4 z-25 max-w-md pointer-events-auto">
          <div className="rounded-3xl bg-[#08172C]/95 border-2 border-[#D4AF37]/70 p-3.5 shadow-2xl backdrop-blur-md flex items-center gap-3.5">
            {/* High-Definition Anime Aksara Avatar with Golden Compass Bezel */}
            <div className="shrink-0 cursor-pointer" onClick={() => {
              soundFX.playChime('victory');
              setShowCharacterSheet(true);
            }}>
              <AksaraAvatar
                expression="SENANG"
                size="md"
                showLevel={true}
                level={3}
                showPoints={true}
                logicPoints={120}
                className="hover:scale-105 transition-transform"
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#FFE082] font-['Cinzel'] tracking-wide">Aksara</span>
                  <span className="text-[9px] font-mono text-cyan-300 px-1.5 py-0.2 rounded-full bg-cyan-950 border border-cyan-500/30">Lv 3</span>
                </div>
                <button
                  onClick={() => {
                    soundFX.playChime('victory');
                    setShowCharacterSheet(true);
                  }}
                  className="text-[10px] font-mono text-amber-300/80 hover:text-amber-200 underline decoration-amber-400/40"
                >
                  Lihat Profil →
                </button>
              </div>

              <p className="text-[11px] text-slate-200 italic leading-snug mb-2 bg-black/40 p-2 rounded-xl border border-white/5 line-clamp-2">
                "{aksaraSpeechText}"
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePlayVoice(aksaraSpeechText)}
                  className="btn-touch px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-mono flex items-center gap-1 hover:bg-cyan-500/30 transition-all"
                  title="Dengarkan Suara Aksara"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Suara</span>
                </button>
                <button
                  onClick={() => {
                    soundFX.playChime('gold');
                    if (onEnterMission01) {
                      onEnterMission01();
                    } else {
                      onEnterLembahInformasi();
                    }
                  }}
                  className="btn-touch flex-1 py-1 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C842] text-slate-950 font-bold text-[11px] font-mono flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.6)] hover:brightness-110 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Mulai M01 (Practice Room)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FLOATING HUD RIGHT: ZOOM CONTROLS */}
        <div className="absolute bottom-20 sm:bottom-22 right-4 z-25 flex flex-col gap-2 pointer-events-auto">
          <button
            onClick={() => setMapZoom((prev) => Math.min(prev + 0.15, 1.5))}
            className="btn-touch w-11 h-11 rounded-xl bg-[#08182B]/95 hover:bg-[#0E2847] border border-[#D4AF37]/40 text-[#FFE082] shadow-xl backdrop-blur-sm"
            title="Perbesar Peta"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMapZoom((prev) => Math.max(prev - 0.15, 0.85))}
            className="btn-touch w-11 h-11 rounded-xl bg-[#08182B]/95 hover:bg-[#0E2847] border border-[#D4AF37]/40 text-[#FFE082] shadow-xl backdrop-blur-sm"
            title="Perkecil Peta"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMapZoom(1)}
            className="btn-touch w-11 h-11 rounded-xl bg-[#08182B]/95 hover:bg-[#0E2847] border border-[#D4AF37]/40 text-[#FFE082] shadow-xl backdrop-blur-sm"
            title="Reset Ukuran Peta"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 3. BOTTOM FLOATING HUD DOCK: HUD UTAMA & INTERACTIVE OBJECTS DOCK          */}
      {/* ========================================================================= */}
      <footer className="absolute bottom-0 inset-x-0 z-30 px-3 py-2 bg-gradient-to-t from-[#040C1A] via-[#08172C]/98 to-[#08172C]/80 border-t-2 border-[#D4AF37]/50 backdrop-blur-md pointer-events-auto flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 overflow-x-auto shadow-2xl">
        {/* Left: HUD UTAMA & Navigation Group matching Concept Art */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            onClick={() => {
              soundFX.playChime('victory');
              setShowCharacterSheet(true);
            }}
            className="flex items-center gap-2 pr-2 border-r border-[#D4AF37]/30 cursor-pointer group"
            title="Buka Profil Lengkap Aksara"
          >
            <AksaraAvatar
              expression="NORMAL"
              size="sm"
              showBadge={false}
              showLevel={false}
              className="group-hover:scale-105 transition-transform"
            />
            <div className="hidden sm:block">
              <span className="text-[10px] font-mono text-[#FFE082] block font-bold">HUD UTAMA</span>
              <span className="text-[9px] font-mono text-cyan-300">Aksara (Lv 3)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <button
            onClick={() => {
              soundFX.playChime('cyan');
              setActiveOverlayMenu('NONE');
            }}
            className="btn-touch px-2.5 py-1.5 rounded-xl bg-[#08182B] hover:bg-[#0E2847] text-slate-200 border border-white/10 text-xs font-mono font-bold flex items-center gap-1 transition-all"
            title="Tampilkan Seluruh Peta"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>PETA</span>
          </button>

          <button
            onClick={() => {
              soundFX.playChime('click');
              setActiveOverlayMenu(activeOverlayMenu === 'REVIEW' ? 'NONE' : 'REVIEW');
            }}
            className={`btn-touch px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-md ${
              activeOverlayMenu === 'REVIEW'
                ? 'bg-[#D4AF37] text-slate-950 shadow-[0_0_15px_#D4AF37]'
                : 'bg-[#08182B]/90 hover:bg-[#0E2847] text-slate-200 border border-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>REVIEW</span>
          </button>

          <button
            onClick={() => {
              soundFX.playChime('click');
              setActiveOverlayMenu(activeOverlayMenu === 'BUKTI' ? 'NONE' : 'BUKTI');
            }}
            className={`btn-touch px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-md ${
              activeOverlayMenu === 'BUKTI'
                ? 'bg-[#D4AF37] text-slate-950 shadow-[0_0_15px_#D4AF37]'
                : 'bg-[#08182B]/90 hover:bg-[#0E2847] text-slate-200 border border-white/10'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>BUKTI</span>
          </button>

          <button
            onClick={() => {
              soundFX.playChime('click');
              setActiveOverlayMenu(activeOverlayMenu === 'PETUNJUK' ? 'NONE' : 'PETUNJUK');
            }}
            className={`btn-touch px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-md ${
              activeOverlayMenu === 'PETUNJUK'
                ? 'bg-[#D4AF37] text-slate-950 shadow-[0_0_15px_#D4AF37]'
                : 'bg-[#08182B]/90 hover:bg-[#0E2847] text-slate-200 border border-white/10'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>PETUNJUK</span>
          </button>

          <button
            onClick={() => {
              soundFX.playChime('cyan');
              setActiveOverlayMenu(activeOverlayMenu === 'KOMPAS' ? 'NONE' : 'KOMPAS');
            }}
            className={`btn-touch px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-md ${
              activeOverlayMenu === 'KOMPAS'
                ? 'bg-[#D4AF37] text-slate-950 shadow-[0_0_15px_#D4AF37]'
                : 'bg-[#08182B]/90 hover:bg-[#0E2847] text-slate-200 border border-white/10'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#FFE082]" />
            <span>KOMPAS</span>
          </button>

          <button
            onClick={() => {
              soundFX.playChime('cyan');
              setActiveOverlayMenu(activeOverlayMenu === 'MEKANIK' ? 'NONE' : 'MEKANIK');
            }}
            className={`btn-touch px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1 transition-all shadow-md ${
              activeOverlayMenu === 'MEKANIK'
                ? 'bg-[#D4AF37] text-slate-950 shadow-[0_0_15px_#D4AF37]'
                : 'bg-[#08182B]/90 hover:bg-[#0E2847] text-slate-200 border border-white/10'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFE082]" />
            <span className="hidden xl:inline">MEKANIK</span>
          </button>
        </div>

        {/* Center: CONTOH OBJEK INTERAKTIF (7 Objek dari Konsep Gambar) */}
        <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-2xl border border-white/10 shrink-0">
          <span className="text-[10px] font-mono text-[#FFE082] font-bold tracking-tight mr-1 hidden xl:inline">
            OBJEK:
          </span>
          {INTERACTIVE_OBJECTS.map((obj) => (
            <button
              key={obj.id}
              onClick={() => {
                soundFX.playChime('click');
                setSelectedInteractiveObject(obj);
              }}
              className="btn-touch px-2 py-1 rounded-lg bg-[#0E2847]/80 hover:bg-[#153D6B] border border-cyan-500/30 text-[11px] font-mono flex items-center gap-1 text-slate-200 hover:text-white transition-colors"
              title={`Inspeksi ${obj.name}: ${obj.role}`}
            >
              <span>{obj.icon}</span>
              <span className="hidden sm:inline text-[10px]">{obj.name}</span>
            </button>
          ))}
        </div>

        {/* Right: Quick Play Launch Button */}
        <button
          onClick={() => {
            soundFX.playChime('gold');
            if (onEnterMission01) {
              onEnterMission01();
            } else {
              onEnterLembahInformasi();
            }
          }}
          className="btn-touch px-4 py-2 rounded-xl btn-game-gold text-slate-950 font-['Cinzel'] font-black text-xs tracking-wider uppercase flex items-center gap-2 shadow-lg shrink-0"
        >
          <Sparkles className="w-4 h-4 fill-current" />
          <span>Mulai M01 Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </footer>

      {/* ========================================================================= */}
      {/* 4. OVERLAY DRAWER: "6 WILAYAH" SLIDE-UP PANEL                             */}
      {/* ========================================================================= */}
      {activeOverlayMenu === 'WILAYAH' && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-7xl mx-auto rounded-t-3xl bg-[#08172C] border-t-2 border-[#D4AF37] p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <h2 className="font-['Cinzel'] font-black text-lg text-[#FFE082] tracking-wider uppercase">
                  6 DUNIA, 1 PERJALANAN LOGIKA
                </h2>
                <span className="text-[10px] font-mono text-cyan-300">
                  (SMP Fase D Kelas IX)
                </span>
              </div>
              <button
                onClick={() => setActiveOverlayMenu('NONE')}
                className="btn-touch p-2 rounded-xl bg-[#0D2544] hover:bg-[#13325B] text-slate-300 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {ISLANDS.map((island) => {
                const isActive = island.status === 'ACTIVE';

                return (
                  <div
                    key={island.id}
                    onClick={() => {
                      setSelectedIsland(island);
                      setActiveOverlayMenu('NONE');
                      setShowIslandModal(true);
                    }}
                    className={`relative rounded-2xl p-4 border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#0E2847] border-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.3)] state-pulih'
                        : 'bg-[#061120] border-white/10 hover:border-white/30 state-terkunci'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs"
                          style={{
                            backgroundColor: `${island.primaryColor}25`,
                            color: island.primaryColor,
                            border: `1px solid ${island.primaryColor}60`,
                          }}
                        >
                          {island.number}
                        </span>
                        {isActive ? (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400">
                            Aktif (M01)
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Lock className="w-3.5 h-3.5" /> Terkunci
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-white mb-1 flex items-center gap-1.5">
                        <span className="text-base">{island.landmarkIcon}</span>
                        <span>{island.name}</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-snug mb-2">
                        {island.subtitle}
                      </p>
                    </div>

                    <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">{island.activeMissionId}: {island.activeMissionName}</span>
                      <span className="text-cyan-400 font-bold">Pengarahan →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. OVERLAY DRAWER: "MEKANIK INTI" SLIDE-UP PANEL                          */}
      {/* ========================================================================= */}
      {activeOverlayMenu === 'MEKANIK' && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-7xl mx-auto rounded-t-3xl bg-[#08172C] border-t-2 border-[#D4AF37] p-5 shadow-2xl max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFE082]" />
                <h2 className="font-['Cinzel'] font-black text-lg text-[#FFE082] tracking-wider uppercase">
                  MEKANIK INTI GAMEPLAY PROSEDURIA
                </h2>
              </div>
              <button
                onClick={() => setActiveOverlayMenu('NONE')}
                className="btn-touch p-2 rounded-xl bg-[#0D2544] hover:bg-[#13325B] text-slate-300 hover:text-white border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* 1. Evidence Board */}
              <div className="evidence-card p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-amber-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-amber-400" />
                    <span>Evidence Board</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Analisis bukti fisik di Tempat Kejadian Anomali (TKP). Bandingkan antara takaran ambigu dengan takaran presisi.
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-amber-950 text-[10px] font-mono text-slate-300 space-y-1">
                    <div className="text-cyan-300">• Kunyit Belum Dikupas (Glitch)</div>
                    <div className="text-cyan-300">• Air Mendidih 90°C</div>
                    <div className="text-amber-300 font-bold">• Takaran "Secukupnya" (Ambigu)</div>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400/80 font-mono mt-3">Taksonomi Bloom: C1 & C2</span>
              </div>

              {/* 2. Procedure Repair */}
              <div className="evidence-card p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-cyan-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-cyan-400" />
                    <span>Procedure Repair</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Susun kembali potongan langkah teks prosedur yang teracak menggunakan verba imperatif aksi dan konjungsi kronologis.
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-cyan-950 text-[10px] font-mono text-slate-300 space-y-1">
                    <div>1. Cucilah rimpang kunyit.</div>
                    <div>2. Parut atau tumbuk halus.</div>
                    <div>3. Rebus bersama air & asam jawa.</div>
                  </div>
                </div>
                <span className="text-[10px] text-cyan-400/80 font-mono mt-3">Taksonomi Bloom: C3 Penerapan</span>
              </div>

              {/* 3. Simulasi & Konsekuensi */}
              <div className="evidence-card p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-rose-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-rose-400" />
                    <span>Simulasi & Konsekuensi</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Uji langsung hasil prosedur buatanmu dalam visual interaktif. Lihat apakah jamu berhasil berkhasiat atau gagal terasa getir.
                  </p>
                  <div className="p-2.5 rounded-xl bg-rose-950/30 border border-rose-900/60 text-center text-[10px] font-mono text-rose-200">
                    ☕ Rasa Getir Berpasir jika urutan keliru!
                  </div>
                </div>
                <span className="text-[10px] text-rose-400/80 font-mono mt-3">Taksonomi Bloom: C4 Analisis</span>
              </div>

              {/* 4. Aksara Guide */}
              <div className="evidence-card p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-blue-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-400" />
                    <span>Aksara Guide</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Pendamping logika 14 tahun dengan Kompas Prosedur yang memberikan petunjuk reflektif tanpa membocorkan jawaban langsung.
                  </p>
                  <div className="p-2.5 rounded-xl bg-[#061120] border border-blue-950 text-[10px] text-slate-200 italic">
                    "Perhatikan apa yang terjadi sebelum langkah ini dieksekusi!"
                  </div>
                </div>
                <span className="text-[10px] text-blue-400/80 font-mono mt-3">Reflektif & Suara Sintesis</span>
              </div>

              {/* 5. Procedure Forge */}
              <div className="evidence-card p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-indigo-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-indigo-400" />
                    <span>Procedure Forge</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Studio mandiri untuk merancang dan menulis teks prosedur orisinal dari nol dengan mematuhi kaidah 4 pilar lengkap.
                  </p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-indigo-950 text-[9.5px] font-mono text-center space-y-1">
                    <div className="px-1 py-0.5 rounded bg-amber-500/20 text-amber-300">TUJUAN</div>
                    <div className="px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300">ALAT / BAHAN</div>
                    <div className="px-1 py-0.5 rounded bg-indigo-500/20 text-indigo-300">LANGKAH-LANGKAH</div>
                  </div>
                </div>
                <span className="text-[10px] text-indigo-400/80 font-mono mt-3">Taksonomi Bloom: C5 & C6 Kreasi</span>
              </div>

              {/* 6. World Restoration */}
              <div className="evidence-card p-4 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>World Restoration</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Setiap prosedur yang dipulihkan akan menghapus kabut anomali dan mengembalikan keasrian kepulauan Nusantara.
                  </p>
                  <button
                    onClick={() => setShowRestorationModal(true)}
                    className="btn-touch w-full py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold"
                  >
                    Buka Slider Pemulihan
                  </button>
                </div>
                <span className="text-[10px] text-emerald-400/80 font-mono mt-3">Dampak Naratif Visual</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL OVERLAY: REVIEW / BUKTI / PETUNJUK / KOMPAS                       */}
      {/* ========================================================================= */}
      {activeOverlayMenu !== 'NONE' && activeOverlayMenu !== 'WILAYAH' && activeOverlayMenu !== 'MEKANIK' && (
        <div className="modal-overlay animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#08172C] border-2 border-[#D4AF37] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2.5">
                {activeOverlayMenu === 'REVIEW' && <BookOpen className="w-6 h-6 text-amber-400" />}
                {activeOverlayMenu === 'BUKTI' && <Briefcase className="w-6 h-6 text-cyan-400" />}
                {activeOverlayMenu === 'PETUNJUK' && <Eye className="w-6 h-6 text-emerald-400" />}
                {activeOverlayMenu === 'KOMPAS' && <Compass className="w-6 h-6 text-[#FFE082]" />}
                <h3 className="font-['Cinzel'] font-black text-lg text-[#FFE082] uppercase">
                  {activeOverlayMenu === 'REVIEW' && 'Review: 4 Pilar Teks Prosedur'}
                  {activeOverlayMenu === 'BUKTI' && 'Kantong Bukti Investigasi M01'}
                  {activeOverlayMenu === 'PETUNJUK' && 'Petunjuk Taktis Aksara'}
                  {activeOverlayMenu === 'KOMPAS' && 'Kompas Prosedur: Radar Logika'}
                </h3>
              </div>
              <button
                onClick={() => setActiveOverlayMenu('NONE')}
                className="btn-touch p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {activeOverlayMenu === 'REVIEW' && (
              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="p-3 rounded-xl bg-black/40 border border-amber-500/30">
                  <div className="font-bold text-amber-400 mb-1 text-sm">1. Tujuan (Goal / Aim)</div>
                  <p className="text-slate-300">Menyatakan hasil akhir atau maksud yang ingin dicapai secara lugas.</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/30">
                  <div className="font-bold text-cyan-400 mb-1 text-sm">2. Alat & Bahan (Materials / Tools)</div>
                  <p className="text-slate-300">Rincian benda dan bahan dengan takaran kuantitatif terukur (gram, ml, menit).</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-emerald-500/30">
                  <div className="font-bold text-emerald-400 mb-1 text-sm">3. Langkah-Langkah (Steps)</div>
                  <p className="text-slate-300">Tahapan kronologis terurut dengan verba imperatif aksi langsung dan konjungsi waktu.</p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-purple-500/30">
                  <div className="font-bold text-purple-400 mb-1 text-sm">4. Penutup / Simpulan (Closing / Tips)</div>
                  <p className="text-slate-300">Manfaat, saran keselamatan, atau ucapan menikmati hasil prosedur.</p>
                </div>
              </div>
            )}

            {activeOverlayMenu === 'BUKTI' && (
              <div className="space-y-2 text-xs text-slate-200">
                <div className="p-3.5 rounded-xl bg-[#061120] border border-cyan-400/40">
                  <div className="text-xs font-mono text-cyan-300 font-bold mb-2">Daftar Temuan di Lapangan (M01):</div>
                  <ul className="space-y-2 text-slate-300 text-xs">
                    <li className="p-2 rounded-lg bg-black/30 border border-amber-500/20">
                      <span className="text-amber-300 font-bold">• Resep Jamu Kunyit Asam:</span> Langkah 2 & 3 terbalik; perebusan mendahului pemarutan kunyit.
                    </li>
                    <li className="p-2 rounded-lg bg-black/30 border border-rose-500/20">
                      <span className="text-rose-300 font-bold">• Takaran Ambigu:</span> Kata "secukupnya" memicu rasa asam getir berlebih.
                    </li>
                    <li className="p-2 rounded-lg bg-black/30 border border-emerald-500/20">
                      <span className="text-emerald-300 font-bold">• Verba Baku:</span> Ubah kalimat deskriptif "disini kita masak" menjadi verba imperatif "Rebuslah".
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeOverlayMenu === 'PETUNJUK' && (
              <div className="space-y-3 text-xs text-slate-200">
                <div className="p-3.5 rounded-xl bg-[#0B2544] border border-emerald-500/40 flex items-start gap-3">
                  <AksaraBustVisual expression="NORMAL" size={44} showCompassBadge={false} />
                  <div>
                    <div className="font-bold text-emerald-300 mb-1 text-sm">Strategi Penyelidikan:</div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      "Perhatikan konjungsi urutan! Jika ada kata 'kemudian' atau 'setelah itu', pastikan bahan utama sudah dimasukkan terlebih dahulu. Jangan menuangkan air sebelum wadah disiapkan!"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeOverlayMenu === 'KOMPAS' && (
              <div className="space-y-3 text-xs text-slate-200 text-center py-2">
                <div className="w-20 h-20 mx-auto rounded-full bg-cyan-950/60 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_25px_rgba(56,189,248,0.6)]">
                  <Compass className="w-11 h-11 text-cyan-300 animate-spin-slow" />
                </div>
                <div className="font-mono text-xs text-cyan-300 font-bold">
                  STATUS: GELOMBANG LOGIKA TERDETEKSI (142.8 Hz)
                </div>
                <p className="text-slate-300 text-xs">
                  Kompas Prosedur mendeteksi anomali pada Misi 01: Jejak yang Hilang di Lembah Informasi.
                </p>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setActiveOverlayMenu('NONE')}
                className="btn-touch px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#FFE082] text-slate-950 font-bold text-xs font-mono"
              >
                Kembali ke Peta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: ISLAND INSPECTION / EXPEDITION BRIEFING                         */}
      {/* ========================================================================= */}
      {showIslandModal && (
        <div className="modal-overlay animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#08172C] border-2 border-[#D4AF37] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-sm"
                  style={{
                    backgroundColor: `${selectedIsland.primaryColor}30`,
                    color: selectedIsland.primaryColor,
                    border: `1px solid ${selectedIsland.primaryColor}`,
                  }}
                >
                  {selectedIsland.number}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedIsland.landmarkIcon}</span>
                    <h3 className="font-['Cinzel'] font-black text-lg text-white">
                      {selectedIsland.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-cyan-300 font-mono">
                    {selectedIsland.activeMissionId}: {selectedIsland.activeMissionName} • {selectedIsland.bloomTaxonomy}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIslandModal(false)}
                className="btn-touch p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-200 leading-relaxed font-sans">
              <p className="p-3.5 rounded-xl bg-black/40 border border-white/10">
                {selectedIsland.lore}
              </p>

              <div className="p-3.5 rounded-xl bg-[#061120] border border-cyan-400/30 space-y-1">
                <div className="text-[10.5px] font-mono font-bold text-amber-400 uppercase">
                  Tantangan Prosedural:
                </div>
                <p className="text-slate-300">{selectedIsland.proceduralChallenge}</p>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0B2544] border border-[#D4AF37]/40">
                <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden bg-black/40 border border-[#D4AF37]">
                  <AksaraBustVisual expression="NORMAL" size={40} showCompassBadge={false} />
                </div>
                <div className="text-xs flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-bold text-[#FFE082]">Pesan Aksara:</div>
                    <button
                      onClick={() => handlePlayVoice(selectedIsland.aksaraAdvice)}
                      className="btn-touch px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 flex items-center gap-1 text-[9.5px]"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Dengarkan Suara</span>
                    </button>
                  </div>
                  <p className="italic text-slate-200">"{selectedIsland.aksaraAdvice}"</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowIslandModal(false)}
                className="btn-touch px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono"
              >
                Tutup
              </button>

              {selectedIsland.status === 'ACTIVE' ? (
                <button
                  onClick={() => {
                    soundFX.playChime('gold');
                    setShowIslandModal(false);
                    if (onEnterMission01) {
                      onEnterMission01();
                    } else {
                      onEnterLembahInformasi();
                    }
                  }}
                  className="btn-touch px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5C842] hover:brightness-110 text-slate-950 font-['Cinzel'] font-black text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.7)] flex items-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Mulai Misi 01: Practice Room</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    soundFX.playChime('cyan');
                    setSelectedIsland(ISLANDS[0]);
                    setAksaraSpeechText(ISLANDS[0].aksaraAdvice);
                  }}
                  className="btn-touch px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono"
                >
                  Kembali ke Akademi (M01 Aktif)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL: WORLD RESTORATION SLIDER & AKSARA CHARACTER SHEET               */}
      {/* ========================================================================= */}
      {showRestorationModal && (
        <div className="modal-overlay animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#08182B] border-2 border-[#D4AF37] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-['Cinzel'] text-[#FFE082] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span>Simulasi Pemulihan Dunia (World Restoration)</span>
              </h3>
              <button
                onClick={() => setShowRestorationModal(false)}
                className="btn-touch px-3 py-1 rounded-lg bg-[#0D2B45] text-slate-300 hover:text-white border border-[#D4AF37]/30 text-xs font-mono"
              >
                Tutup
              </button>
            </div>
            <WorldRestorationSlider compact={false} />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: INSPEKSI OBJEK PROSEDUR (7 Objek Konsep M01)                     */}
      {/* ========================================================================= */}
      {selectedInteractiveObject && (
        <div className="modal-overlay animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl bg-[#08172C] border-2 border-[#D4AF37] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2.5 rounded-2xl bg-[#050D1A] border border-amber-400/40 shadow-inner">
                  {selectedInteractiveObject.icon}
                </span>
                <div>
                  <h3 className="font-['Cinzel'] font-bold text-lg text-[#FFE082]">
                    {selectedInteractiveObject.name}
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-300">
                    Kategori: {selectedInteractiveObject.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedInteractiveObject(null)}
                className="btn-touch p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0B223D] border border-white/10 text-xs text-slate-200 leading-relaxed">
              <span className="font-bold text-[#FFE082] block text-[10px] uppercase font-mono mb-1">
                Fungsi & Peran Prosedur:
              </span>
              {selectedInteractiveObject.role}
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-xs font-bold text-cyan-300 block">
                Verba Imperatif Aksi:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedInteractiveObject.imperativeVerbs.map((verb, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-xs font-mono text-cyan-200"
                  >
                    ✦ {verb}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200">
              <span className="font-bold text-rose-300 block font-mono text-[10px] uppercase mb-0.5">
                ⚠️ Risiko Jika Urutan / Takaran Keliru:
              </span>
              {selectedInteractiveObject.consequence}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[10px] font-mono text-slate-400">
                M01: Jejak yang Hilang
              </span>
              <button
                onClick={() => setSelectedInteractiveObject(null)}
                className="btn-touch px-4 py-1.5 rounded-xl bg-[#D4AF37] text-slate-950 font-mono font-bold text-xs hover:brightness-110"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      <AksaraCharacterSheetModal
        isOpen={showCharacterSheet}
        onClose={() => setShowCharacterSheet(false)}
      />
    </div>
  );
};
