/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { soundFX } from '../../utils/audioEffects';
import { aksaraVoice, AKSARA_VOICE_LINES } from '../../utils/aksaraVoice';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';
import {
  Compass,
  User,
  Zap,
  AlertTriangle,
  Sparkles,
  Shield,
  BookOpen,
  ArrowRight,
  Award,
  Layers,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  HelpCircle,
  MessageSquare,
  CheckCircle2,
  X,
  MapPin,
  Sliders,
} from 'lucide-react';
import { WorldRestorationSlider } from '../restoration/WorldRestorationSlider';
import { MissionGuideBox } from '../ui/MissionGuideBox';
import { AksaraVideoPlayer } from './AksaraVideoPlayer';
import { AksaraCharacterSheetModal } from '../character/AksaraCharacterSheetModal';

export interface AksaraStation {
  id: number;
  name: string;
  shortName: string;
  stageBadge: string;
  positionDescription: string;
  containerClass: string;
  auraColor: string;
  speechOnMove: string;
}

const AKSARA_PROLOGUE_STATIONS: AksaraStation[] = [
  {
    id: 0,
    name: 'Pos Gerbang Masuk (Sisi Kanan)',
    shortName: 'Gerbang Kanan',
    stageBadge: 'Tahap 1-2 • Inisiasi',
    positionDescription: 'Berjaga di sayap gerbang masuk akademi sambil mengarahkan Kompas Logika.',
    containerClass: 'md:translate-x-0',
    auraColor: 'from-[#D4AF37]/20 to-transparent',
    speechOnMove: 'Aku berada di Pos Gerbang Masuk! Di pos awal ini, aku menyambut para penjelajah baru untuk memahami konsep dasar teks prosedur!',
  },
  {
    id: 1,
    name: 'Pos Sentral Pembelajar (Tengah)',
    shortName: 'Pos Sentral',
    stageBadge: 'Tahap 3-5 • Lembah & Alur',
    positionDescription: 'Berpindah ke pusat panggung orientasi setelah menyelesaikan eksplorasi tahap awal.',
    containerClass: 'md:-translate-x-12 lg:-translate-x-24',
    auraColor: 'from-cyan-500/25 to-transparent',
    speechOnMove: 'Aku telah berpindah ke Pos Sentral Pembelajar! Posisi ini memungkinkanku mengawasi susunan sekuensial dan takaran prosedur!',
  },
  {
    id: 2,
    name: 'Pos Garda Depan Karst (Sisi Kiri)',
    shortName: 'Garda Depan',
    stageBadge: 'Tahap 6-8 • Glitch & Kaidah',
    positionDescription: 'Maju ke pos observasi garis depan untuk memandu perbaikan kalimat imperatif dan anomali.',
    containerClass: 'md:-translate-x-24 lg:-translate-x-48',
    auraColor: 'from-purple-500/25 to-transparent',
    speechOnMove: 'Aku maju ke Pos Garda Depan! Setiap misi yang kamu selesaikan akan membuat posisiku berpindah semakin dekat ke garis terdepan!',
  },
  {
    id: 3,
    name: 'Altar Emas Maestro Majapahit',
    shortName: 'Altar Emas',
    stageBadge: 'Tahap 9-12 • Puncak Kreasi Pusaka',
    positionDescription: 'Bertengger di altar pusaka keemasan tertinggi dengan radiasi energi penulisan presisi.',
    containerClass: 'md:-translate-x-10 lg:-translate-x-20 scale-105 ring-2 ring-amber-400/70 shadow-[0_0_50px_rgba(212,175,55,0.8)]',
    auraColor: 'from-amber-400/35 via-yellow-500/20 to-transparent',
    speechOnMove: 'Luar biasa! Berkat keberhasilan menyelesaikan seluruh misi, aku kini berada di Altar Emas Maestro! Teks prosedurnu telah sempurna!',
  },
];

interface OpeningUIProps {
  glitchActive: boolean;
  onToggleGlitch: () => void;
  onStartAdventure: () => void;
  onOpenProfile: () => void;
  onOpenBadges?: () => void;
  onOpenWorldMap?: () => void;
  onOpenArtBible?: () => void;
  mousePos?: { x: number; y: number };
  highestReachedStageIndex?: number;
}

export const OpeningUI: React.FC<OpeningUIProps> = ({
  glitchActive,
  onToggleGlitch,
  onStartAdventure,
  onOpenProfile,
  onOpenBadges,
  onOpenWorldMap,
  onOpenArtBible,
  mousePos = { x: 0.5, y: 0.5 },
  highestReachedStageIndex = 1,
}) => {
  const [showRestorationModal, setShowRestorationModal] = useState(false);
  const [isCharacterSheetOpen, setIsCharacterSheetOpen] = useState(false);
  const [speechBubbleOpen, setSpeechBubbleOpen] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [characterPose, setCharacterPose] = useState<'idle' | 'talking' | 'pointing'>('idle');
  const [characterReaction, setCharacterReaction] = useState(false);

  // Dynamic Aksara Station on Opening Screen (moves with completed missions)
  const initialStation = (highestReachedStageIndex ?? 1) >= 9 ? 3 : (highestReachedStageIndex ?? 1) >= 6 ? 2 : (highestReachedStageIndex ?? 1) >= 3 ? 1 : 0;
  const [aksaraStationIndex, setAksaraStationIndex] = useState<number>(initialStation);
  const [voiceTonePreset, setVoiceTonePreset] = useState<'natural' | 'cheerful' | 'calm'>('natural');

  const activeStation = AKSARA_PROLOGUE_STATIONS[aksaraStationIndex];

  // Subscribe to voice state
  useEffect(() => {
    const handleVoiceChange = (speaking: boolean) => {
      setIsSpeaking(speaking);
      if (speaking) {
        setCharacterPose('talking');
      } else {
        setCharacterPose('idle');
      }
    };
    aksaraVoice.addListener(handleVoiceChange);
    return () => {
      aksaraVoice.removeListener(handleVoiceChange);
      aksaraVoice.stop();
    };
  }, []);

  const currentVoiceLine = AKSARA_VOICE_LINES[currentLineIndex];

  const handleSpeakAksara = () => {
    if (isSpeaking) {
      aksaraVoice.stop();
    } else {
      setCharacterReaction(true);
      setTimeout(() => setCharacterReaction(false), 500);
      aksaraVoice.speak(currentVoiceLine.text);
    }
  };

  const handleSwitchStation = (idx: number) => {
    soundFX.playChime('cyan');
    setAksaraStationIndex(idx);
    setCharacterReaction(true);
    setTimeout(() => setCharacterReaction(false), 600);
    const target = AKSARA_PROLOGUE_STATIONS[idx];
    aksaraVoice.speak(target.speechOnMove);
    setSpeechBubbleOpen(true);
  };

  const handleTestBoyVoice = (preset: 'natural' | 'cheerful' | 'calm') => {
    soundFX.playChime('gold');
    setVoiceTonePreset(preset);
    if (preset === 'cheerful') {
      aksaraVoice.setCustomPitchMultiplier(1.15);
    } else if (preset === 'calm') {
      aksaraVoice.setCustomPitchMultiplier(0.92);
    } else {
      aksaraVoice.setCustomPitchMultiplier(1.0);
    }
    const lines = {
      natural: "Halo Penjelajah! Namaku Aksara, siswa SMP Kelas IX di Proseduria! Suaraku berkarakter anak laki-laki usia 14 tahun yang ramah dan siap mendampingimu!",
      cheerful: "Halo kawan! Semangat tinggi! Aku Aksara, siap memandumu menuntaskan setiap rintangan teks prosedur dengan penuh antusiasme!",
      calm: "Tenang kawan. Aku Aksara. Setiap tahapan teks prosedur butuh ketelitian dan fokus yang mendalam agar hasilnya presisi.",
    };
    aksaraVoice.speak(lines[preset]);
    setSpeechBubbleOpen(true);
  };

  const handleNextVoiceLine = () => {
    soundFX.playChime('click');
    const nextIdx = (currentLineIndex + 1) % AKSARA_VOICE_LINES.length;
    setCurrentLineIndex(nextIdx);
    setSpeechBubbleOpen(true);
    if (isSpeaking) {
      aksaraVoice.stop();
      setTimeout(() => {
        aksaraVoice.speak(AKSARA_VOICE_LINES[nextIdx].text);
      }, 150);
    }
  };

  // Parallax calculations for character
  const parallaxX = (mousePos.x - 0.5) * 20;
  const parallaxY = (mousePos.y - 0.5) * 15;
  const compassAngle = Math.atan2(mousePos.y - 0.5, mousePos.x - 0.5) * (180 / Math.PI) + 90;

  return (
    <div className="relative z-20 w-full h-full flex flex-col justify-between overflow-hidden select-none font-sans p-3 sm:p-6 md:p-8">
      {/* 1. TOP BAR HUD (MATCHING GAME SCREENSHOT) */}
      <header className="relative z-30 flex items-center justify-between w-full max-w-7xl mx-auto">
        {/* Top Left: Education Level Tag & Quick Map Link */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1 rounded-full bg-[#08182B]/90 border border-cyan-400/40 backdrop-blur-md text-[11px] font-mono font-bold text-cyan-300 flex items-center gap-1.5 shadow-md">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>BAHASA INDONESIA KELAS IX • FASE D</span>
          </div>

          {onOpenWorldMap && (
            <button
              onClick={() => {
                soundFX.playChime('cyan');
                onOpenWorldMap();
              }}
              className="px-3 py-1 rounded-full bg-[#0D2B45]/90 hover:bg-[#153B5C] border border-[#D4AF37]/60 hover:border-[#FFE082] text-[11px] font-mono font-bold text-[#FFE082] flex items-center gap-1.5 shadow-lg backdrop-blur-md transition-all cursor-pointer group"
            >
              <Layers className="w-3.5 h-3.5 text-[#FFE082] group-hover:rotate-12 transition-transform" />
              <span>JELAJAHI PETA BENUA</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>

        {/* Top Right: System Status & Art Bible */}
        <div className="flex items-center gap-2">
          {/* Glitch Toggle Trigger */}
          <button
            onClick={onToggleGlitch}
            className={`px-3 py-1 rounded-full border text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-md ${
              glitchActive
                ? 'bg-rose-950/90 text-rose-300 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse'
                : 'bg-[#08182B]/80 text-slate-400 border-white/10 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">
              {glitchActive ? 'Glitch Aktif (Simulasi)' : 'Simulasi Glitch'}
            </span>
          </button>

          {/* Art Bible & Design System */}
          <button
            onClick={() => {
              soundFX.playChime('cyan');
              if (onOpenArtBible) onOpenArtBible();
              else setShowRestorationModal(true);
            }}
            className="px-3 py-1 rounded-full bg-[#0D2B45]/90 hover:bg-[#153B5C] border border-[#D4AF37]/40 text-[#FFE082] text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md backdrop-blur-md transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Buka Art Bible & Desain Sistem</span>
          </button>
        </div>
      </header>

      {/* 2. CENTER STAGE: GAME HERO CONTENT + FLOATING GLITCH CONSTELLATION */}
      <main className="relative z-20 flex-1 w-full max-w-7xl mx-auto flex items-center justify-between my-auto">
        {/* LEFT COLUMN: HERO TITLE & START BUTTONS (AS IN USER IMAGE 1) */}
        <div className="w-full max-w-xl flex flex-col items-start text-left space-y-4">
          {/* Subtitle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0D2B45]/90 border border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.3)] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FFE082]" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#FFE082] uppercase">
              Petualangan Edukasi Teks Prosedur
            </span>
          </div>

          {/* Main Title Heading */}
          <div>
            <h1 className="text-5xl sm:text-7xl font-['Cinzel'] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C0] via-[#F5C842] to-[#D4AF37] drop-shadow-[0_4px_30px_rgba(212,175,55,0.8)]">
              PROSEDURIA
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#D4AF37] to-transparent rounded-full mt-1" />
          </div>

          {/* Catchphrase & Story Description */}
          <div className="space-y-2">
            <p className="font-['Cinzel'] font-bold text-base sm:text-lg text-[#FFE082] tracking-wide">
              "TEMUKAN LOGIKANYA. PERBAIKI PROSEDURNYA."
            </p>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans max-w-lg">
              Dunia Proseduria sedang terancam anomali logika. Sebagai Penjelajah Logika, selidiki bukti,
              susun kembali urutan langkah yang benar, dan kembalikan stabilitas kerajaan kata.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {/* Start Game Button (Golden Glow 3D Skeuomorphic) */}
            <button
              onClick={() => {
                soundFX.playChime('gold');
                onStartAdventure();
              }}
              className="btn-touch px-6 sm:px-8 py-3 rounded-2xl btn-game-gold text-slate-950 font-['Cinzel'] font-black text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-xl cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Petualangan</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Profile Button */}
            <button
              onClick={() => {
                soundFX.playChime('cyan');
                onOpenProfile();
              }}
              className="btn-touch px-4 py-3 rounded-2xl btn-game-cyan text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-950" />
              <span>Profil Pemain</span>
            </button>

            {/* Badges Modal Trigger */}
            {onOpenBadges && (
              <button
                onClick={() => {
                  soundFX.playChime('victory');
                  onOpenBadges();
                }}
                className="btn-touch px-3.5 py-3 rounded-2xl btn-game-dark text-[#FFE082] text-xs font-mono font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                title="Buka Koleksi 6 Lencana & Piala"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Koleksi Lencana</span>
              </button>
            )}
          </div>

          {/* Status Ticker Line */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300 pt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
            <span className="font-semibold text-emerald-300">Server Akademi Terhubung</span>
            <span className="text-slate-400">• Siap Menjelajahi Lembah Informasi</span>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CHARACTER AKSARA (DYNAMIC POSITIONING & TALKING) */}
        <div className={`relative z-30 flex flex-col items-center select-none transition-all duration-700 ease-in-out ${activeStation.containerClass}`}>
          {/* A. INTERACTIVE SPEECH BUBBLE ABOVE AKSARA */}
          {speechBubbleOpen && (
            <div className="relative mb-2 w-72 sm:w-80 animate-slideDown">
              <div className="rpg-dialogue-frame p-3 sm:p-4 shadow-[0_15px_35px_rgba(0,0,0,0.9)] text-left">
                {/* Close speech bubble button */}
                <button
                  onClick={() => setSpeechBubbleOpen(false)}
                  className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Tutup Balon Bicara"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Bubble Header: Badge & Animated Audio Waves */}
                <div className="flex items-center justify-between pr-5 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-[9px] font-mono font-bold">
                      AKSARA (PANDUAN)
                    </span>
                    <span className="text-[9px] font-mono text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                      <Sparkles className="w-2.5 h-2.5" />
                      {currentVoiceLine.topic}
                    </span>
                  </div>

                  {/* Equalizer waves when speaking */}
                  {isSpeaking && (
                    <div className="flex items-center gap-0.5 text-cyan-400 text-xs font-mono font-bold">
                      <span className="animate-bounce inline-block">|</span>
                      <span className="animate-bounce delay-75 inline-block">|</span>
                      <span className="animate-bounce delay-150 inline-block">|</span>
                    </div>
                  )}
                </div>

                {/* Speech Text Content */}
                <p className="text-xs sm:text-[13px] text-slate-100 font-sans leading-relaxed italic pr-1">
                  "{currentVoiceLine.text}"
                </p>

                {/* Interactive Controls Inside Bubble */}
                <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-1 text-[10px] font-mono">
                  {/* Speak Aloud Button */}
                  <button
                    onClick={handleSpeakAksara}
                    className={`px-2.5 py-1 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-all ${
                      isSpeaking
                        ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:brightness-110'
                    }`}
                    title="Dengarkan Suara Aksara"
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3 h-3" />
                        <span>Hentikan Suara</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 fill-current" />
                        <span>Dengarkan Suara</span>
                      </>
                    )}
                  </button>

                  {/* Cycle Next Tip Button */}
                  <button
                    onClick={handleNextVoiceLine}
                    className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 hover:text-white border border-white/10 flex items-center gap-1 cursor-pointer transition-colors"
                    title="Ganti Tips Edukasi"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>Tips Lain ({currentLineIndex + 1}/{AKSARA_VOICE_LINES.length})</span>
                  </button>
                </div>
              </div>

              {/* Triangle Tail */}
              <div className="w-4 h-4 bg-[#08182B] border-r-2 border-b-2 border-[#D4AF37] transform rotate-45 mx-auto -mt-2 shadow-lg" />
            </div>
          )}

          {/* B. CINEMATIC VIDEO PLAYER (REPLACING STATIC PHOTO WITH ATTACHED VIDEO & CHARACTER SHEET) */}
          <div
            className="transition-all duration-300"
            style={{
              transform: `translate3d(${parallaxX}px, ${parallaxY}px, 0)`,
            }}
          >
            <AksaraVideoPlayer
              onOpenCharacterSheet={() => setIsCharacterSheetOpen(true)}
              highestReachedStageIndex={highestReachedStageIndex}
            />
          </div>

          {/* C. DYNAMIC POSITION INDICATOR & QUICK ACCESS */}
          <div className="mt-2.5 w-full max-w-xs flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#08182B]/90 border border-amber-400/30 text-[10px] font-mono text-slate-300 shadow-md">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Posisi:</span>
              <span className="text-cyan-300">{activeStation.shortName}</span>
            </span>
            <button
              onClick={() => handleSwitchStation((aksaraStationIndex + 1) % AKSARA_PROLOGUE_STATIONS.length)}
              className="text-[9px] text-amber-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded-md border border-white/10 transition-colors cursor-pointer"
              title="Pindah ke Posisi Berikutnya"
            >
              Ubah Pos ({aksaraStationIndex + 1}/4)
            </button>
          </div>

          {/* D. BOTTOM RIGHT: INTERACTIVE COMPASS ROSE WIDGET */}
          <div className="mt-1 flex items-center gap-2 px-3 py-1 rounded-full bg-[#08182B]/90 border border-white/10 text-[10px] font-mono text-slate-300">
            <Compass
              className="w-3.5 h-3.5 text-amber-400 transition-transform duration-200"
              style={{ transform: `rotate(${compassAngle}deg)` }}
            />
            <span>Kompas Logika</span>
            <button
              onClick={() => setSpeechBubbleOpen(!speechBubbleOpen)}
              className="ml-1 text-cyan-400 hover:text-white cursor-pointer"
            >
              {speechBubbleOpen ? 'Sembunyikan' : 'Buka Panduan'}
            </button>
          </div>
        </div>
      </main>

      {/* 3. FOOTER BAR (CURRICULUM MERDEKA & PARALLAX HINT) */}
      <footer className="relative z-30 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-[#D4AF37]/20 pt-3 text-[11px] font-mono text-slate-400">
        <div>© 2026 PROSEDURIA • Game Edukasi Berbasis Kurikulum Merdeka</div>
        <div className="text-amber-300/80 italic">
          Gerakkan kursor mouse untuk melihat kedalaman parallax 2.5D
        </div>
      </footer>

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

      {/* MODAL: OFFICIAL CHARACTER SHEET OF AKSARA */}
      <AksaraCharacterSheetModal
        isOpen={isCharacterSheetOpen}
        onClose={() => setIsCharacterSheetOpen(false)}
      />
    </div>
  );
};
