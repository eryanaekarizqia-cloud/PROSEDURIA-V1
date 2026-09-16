/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  FileVideo,
  Upload,
  Subtitles,
  Maximize2,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  X,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';
import { aksaraVoice } from '../../utils/aksaraVoice';
import { AksaraCharacterVisual, AksaraExpressionType } from '../character/AksaraCharacterVisual';
import { saveVideoBlob, getVideoBlobUrl, clearVideoBlob } from '../../utils/videoStorage';

interface AksaraVideoPlayerProps {
  onOpenCharacterSheet?: () => void;
  highestReachedStageIndex?: number;
}

export const AksaraVideoPlayer: React.FC<AksaraVideoPlayerProps> = ({
  onOpenCharacterSheet,
  highestReachedStageIndex = 1,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(8.0);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [showAssetGuideModal, setShowAssetGuideModal] = useState<boolean>(false);
  const [uploadSuccessAlert, setUploadSuccessAlert] = useState<string | null>(null);

  // Cinematic interactive actor states
  const [actorPose, setActorPose] = useState<'standing_compass' | 'welcoming' | 'hand_on_chest' | 'thumbs_up'>('standing_compass');
  const [actorExpression, setActorExpression] = useState<AksaraExpressionType>('SENANG');
  const [isActorSpeaking, setIsActorSpeaking] = useState<boolean>(false);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number>(0);

  // Exact Indonesian dialogue from the user's video
  const VIDEO_SPEECH_PARTS = [
    { time: 0.0, text: 'Halo penjelajah! Selamat datang di Proseduria.', pose: 'welcoming' as const, expr: 'SENANG' as const },
    { time: 3.0, text: 'Aku Aksara. Aku akan menemanimu...', pose: 'hand_on_chest' as const, expr: 'BERSEMANGAT' as const },
    { time: 5.5, text: '...menemukan logika di balik setiap langkah.', pose: 'standing_compass' as const, expr: 'SUKSES' as const },
  ];

  const FULL_VIDEO_SPEECH =
    'Halo penjelajah! Selamat datang di Proseduria. Aku Aksara. Aku akan menemanimu menemukan logika di balik setiap langkah.';

  // Initialize: Load persistent video from IndexedDB if available, or test local video
  useEffect(() => {
    let isMounted = true;

    async function initVideo() {
      // 1. Check IndexedDB first
      const storedUrl = await getVideoBlobUrl();
      if (storedUrl && isMounted) {
        setCustomVideoUrl(storedUrl);
        setVideoLoaded(true);
        return;
      }

      // 2. Check if static /assets/video/aksara_intro.mp4 exists
      try {
        const resp = await fetch('/assets/video/aksara_intro.mp4', { method: 'HEAD' });
        if (resp.ok && isMounted) {
          setCustomVideoUrl('/assets/video/aksara_intro.mp4');
          setVideoLoaded(true);
        }
      } catch {
        // Fallback to interactive canvas
      }
    }

    initVideo();
    return () => {
      isMounted = false;
    };
  }, []);

  // Timer simulation for interactive visual actor when no MP4 file is active
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying && !videoLoaded) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 0.1;
          if (next >= duration) {
            setIsPlaying(false);
            setIsActorSpeaking(false);
            setActorPose('standing_compass');
            setActorExpression('NORMAL');
            return 0;
          }

          if (next >= 5.5) {
            setActorPose('standing_compass');
            setActorExpression('SUKSES');
            setCurrentSubtitleIndex(2);
          } else if (next >= 3.0) {
            setActorPose('hand_on_chest');
            setActorExpression('BERSEMANGAT');
            setCurrentSubtitleIndex(1);
          } else {
            setActorPose('welcoming');
            setActorExpression('SENANG');
            setCurrentSubtitleIndex(0);
          }

          return next;
        });
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, videoLoaded, duration]);

  // Handle native video time update
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);
      if (cur >= 5.5) {
        setCurrentSubtitleIndex(2);
      } else if (cur >= 3.0) {
        setCurrentSubtitleIndex(1);
      } else {
        setCurrentSubtitleIndex(0);
      }
    }
  };

  const handlePlayPause = () => {
    soundFX.playChime('click');

    if (videoRef.current && videoLoaded && customVideoUrl) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsActorSpeaking(false);
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsActorSpeaking(true);
          })
          .catch(() => {
            setIsPlaying(true);
          });
      }
      return;
    }

    // Interactive Stage Playback
    if (isPlaying) {
      setIsPlaying(false);
      setIsActorSpeaking(false);
      aksaraVoice.stop();
    } else {
      setIsPlaying(true);
      setIsActorSpeaking(true);
      setCurrentTime(0);
      setActorPose('welcoming');
      setActorExpression('SENANG');
      setCurrentSubtitleIndex(0);

      if (!isMuted) {
        aksaraVoice.speak(FULL_VIDEO_SPEECH);
      }
    }
  };

  const handleRestart = () => {
    soundFX.playChime('click');
    setCurrentTime(0);
    aksaraVoice.stop();

    if (videoRef.current && videoLoaded && customVideoUrl) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsActorSpeaking(true);
        })
        .catch(() => {});
    } else {
      setIsPlaying(true);
      setIsActorSpeaking(true);
      setActorPose('welcoming');
      setActorExpression('SENANG');
      setCurrentSubtitleIndex(0);
      if (!isMuted) {
        aksaraVoice.speak(FULL_VIDEO_SPEECH);
      }
    }
  };

  const handleToggleMute = () => {
    soundFX.playChime('click');
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    if (!isMuted) {
      aksaraVoice.stop();
    }
    setIsMuted(!isMuted);
  };

  const handleFileProcess = async (file: File) => {
    if (!file.type.includes('video') && !file.name.endsWith('.mp4') && !file.name.endsWith('.webm')) {
      alert('Mohon pilih file video dengan format .mp4 atau .webm');
      return;
    }

    try {
      // Save permanently to IndexedDB
      await saveVideoBlob(file);
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setVideoLoaded(true);
      setIsPlaying(true);
      soundFX.playChime('victory');
      setUploadSuccessAlert(`Video "${file.name}" berhasil dipasang & tersimpan permanen!`);
      setTimeout(() => setUploadSuccessAlert(null), 5000);
    } catch (err) {
      console.error('Failed to store video:', err);
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setVideoLoaded(true);
      setIsPlaying(true);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveCustomVideo = async () => {
    soundFX.playChime('click');
    await clearVideoBlob();
    setCustomVideoUrl(null);
    setVideoLoaded(false);
    setIsPlaying(false);
    aksaraVoice.stop();
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-sm">
      {/* 1. CINEMATIC VIDEO FRAME (ARCHWAY DESIGN WITH GOLD BORDER) */}
      <div
        ref={containerRef}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={`relative w-64 sm:w-72 md:w-80 h-[480px] sm:h-[530px] md:h-[570px] rounded-[32px] overflow-hidden border-2 bg-[#06101B] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(212,175,55,0.4)] flex flex-col justify-between p-2 transition-all duration-300 ${
          isDraggingOver
            ? 'border-cyan-400 ring-4 ring-cyan-400/40 scale-102'
            : 'border-white/95'
        }`}
      >
        {/* Archway Decorative Header Badge */}
        <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-auto">
          <div className="px-3 py-1 rounded-full bg-[#08182B]/95 border border-[#D4AF37] text-[10px] font-mono font-bold text-[#FFE082] shadow-lg backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap">
            <FileVideo className="w-3.5 h-3.5 text-cyan-400" />
            <span>{videoLoaded ? 'VIDEO AKSARA AKTIF' : 'VIDEO INTRODUKSI AKSARA'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Quick Upload / Switch Video Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1 rounded-full bg-cyan-600/90 hover:bg-cyan-500 border border-cyan-300 text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-md hover:scale-105 transition-all cursor-pointer"
            title="Klik untuk memilih file video MP4 dari komputer Anda"
          >
            <Upload className="w-3 h-3" />
            <span>{videoLoaded ? 'Ganti MP4' : 'Unggah MP4'}</span>
          </button>
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#071322] flex items-center justify-center">
          {/* A. NATIVE VIDEO TAG (WHEN USER UPLOADS OR CONNECTS REAL MP4) */}
          {customVideoUrl && videoLoaded ? (
            <video
              ref={videoRef}
              src={customVideoUrl}
              playsInline
              muted={isMuted}
              loop
              autoPlay
              onTimeUpdate={handleVideoTimeUpdate}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration || 8.0);
                }
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover object-center z-10"
            />
          ) : (
            /* B. CINEMATIC 3D ANIME SCENE (PROSEDURIA ACADEMIA ARCHWAY & 3D AKSARA) */
            <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden">
              {/* Background: Grand Stone Archway of "Proseduria Academia" */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0E2841] via-[#091B2F] to-[#040C15] pointer-events-none" />

              {/* Sunbeam Light Rays */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

              {/* Gothic Arch Vault Outline */}
              <div className="absolute top-0 inset-x-4 h-56 border-t-4 border-x-4 border-amber-400/40 rounded-t-[100px] pointer-events-none shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)]" />

              {/* Hanging Royal Blue Banner: "PROSEDURIA academia" */}
              <div className="absolute top-10 inset-x-8 z-10 flex flex-col items-center pointer-events-none">
                <div className="px-4 py-1.5 rounded-b-xl bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#172554] border-b-2 border-x border-[#D4AF37] shadow-[0_8px_20px_rgba(0,0,0,0.8)] text-center">
                  <div className="font-serif font-black tracking-widest text-[12px] sm:text-xs text-[#FFF5C0] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    PROSEDURIA
                  </div>
                  <div className="text-[8px] font-sans tracking-widest text-[#FFE082] italic -mt-0.5">
                    academia
                  </div>
                </div>
              </div>

              {/* Stone Pillars Left & Right with Burning Bronze Torches */}
              <div className="absolute top-20 left-1 w-6 h-64 bg-[#0A1624] border-r border-white/10 flex flex-col items-center pointer-events-none">
                <div className="w-4 h-7 mt-8 rounded-t-md bg-[#78350F] border border-amber-400/60 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-5 rounded-full bg-gradient-to-t from-amber-500 to-yellow-200 blur-[1px] animate-pulse" />
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400/30 blur-sm animate-ping" />
                </div>
              </div>

              <div className="absolute top-20 right-1 w-6 h-64 bg-[#0A1624] border-l border-white/10 flex flex-col items-center pointer-events-none">
                <div className="w-4 h-7 mt-8 rounded-t-md bg-[#78350F] border border-amber-400/60 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-5 rounded-full bg-gradient-to-t from-amber-500 to-yellow-200 blur-[1px] animate-pulse" />
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400/30 blur-sm animate-ping" />
                </div>
              </div>

              {/* Floating Cyan Magical Motes */}
              <div className="absolute top-36 left-10 w-2 h-2 rounded-full bg-cyan-400/70 blur-[1px] animate-bounce pointer-events-none" style={{ animationDuration: '3s' }} />
              <div className="absolute top-48 right-10 w-2.5 h-2.5 rounded-full bg-cyan-300/80 blur-[1px] animate-pulse pointer-events-none" style={{ animationDuration: '2.5s' }} />
              <div className="absolute bottom-28 left-14 w-1.5 h-1.5 rounded-full bg-amber-300/60 blur-[1px] animate-ping pointer-events-none" style={{ animationDuration: '4s' }} />

              {/* Checkered Marble Floor Perspective */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent border-t border-white/10 opacity-70 pointer-events-none" />

              {/* Center Character: AKSARA in 3D Anime Style (Navy Zip Hoodie & Celestial Compass) */}
              <div
                className={`relative z-10 w-full h-full flex items-center justify-center pt-10 transition-transform duration-500 ${
                  isActorSpeaking ? 'scale-105' : 'hover:scale-102'
                }`}
              >
                <AksaraCharacterVisual
                  expression={actorExpression}
                  pose={actorPose}
                  isSpeaking={isActorSpeaking}
                  size={260}
                  compassGlowing={true}
                />
              </div>

              {/* Big Center Play Button Overlay when paused */}
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="absolute z-30 inset-0 m-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border-2 border-white text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.85)] hover:scale-115 transition-transform cursor-pointer"
                  title="Putar Suara & Animasi Aksara"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </button>
              )}
            </div>
          )}

          {/* Drag and drop overlay feedback */}
          {isDraggingOver && (
            <div className="absolute inset-0 z-40 bg-[#06182B]/90 border-2 border-dashed border-cyan-400 rounded-[24px] flex flex-col items-center justify-center text-cyan-200 p-4 text-center backdrop-blur-sm animate-pulse">
              <Upload className="w-12 h-12 text-cyan-400 mb-2" />
              <div className="font-bold text-sm text-white">Lepaskan File Video MP4 di Sini</div>
              <div className="text-xs text-cyan-300 mt-1">Video akan otomatis terpasang dan tersimpan di game!</div>
            </div>
          )}

          {/* Upload Success Alert */}
          {uploadSuccessAlert && (
            <div className="absolute top-12 inset-x-3 z-30 p-2 rounded-xl bg-emerald-950/95 border border-emerald-400 text-emerald-200 text-[11px] font-mono flex items-center gap-2 shadow-2xl backdrop-blur-md animate-bounce">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{uploadSuccessAlert}</span>
            </div>
          )}

          {/* 3. CINEMATIC SUBTITLES OVERLAY */}
          {showSubtitles && (
            <div className="absolute bottom-14 inset-x-2.5 z-30 p-2.5 rounded-2xl bg-[#050C16]/90 border border-[#D4AF37]/80 backdrop-blur-md text-center shadow-2xl animate-slideUp">
              <div className="text-[9px] font-mono text-amber-300 font-bold mb-0.5 flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>AKSARA • PENJELAJAH LOGIKA</span>
              </div>
              <p className="text-xs text-slate-100 font-sans italic leading-snug">
                "{VIDEO_SPEECH_PARTS[currentSubtitleIndex]?.text || FULL_VIDEO_SPEECH}"
              </p>
            </div>
          )}

          {/* 4. PROGRESS BAR (GOLD & CYAN) */}
          <div className="absolute bottom-11 inset-x-3 z-30 h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-100"
              style={{ width: `${Math.min(100, Math.max(0, (currentTime / duration) * 100))}%` }}
            />
          </div>

          {/* 5. VIDEO CONTROLS BAR (BOTTOM OF PLAYER) */}
          <div className="absolute bottom-2 inset-x-2 z-30 px-3 py-1.5 rounded-2xl bg-[#08182B]/95 border border-white/20 backdrop-blur-md flex items-center justify-between text-xs text-slate-200 shadow-lg">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="p-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-all cursor-pointer"
              title={isPlaying ? 'Jeda Video' : 'Putar Video'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
            </button>

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Ulangi dari Awal"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Mute/Unmute */}
            <button
              onClick={handleToggleMute}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isMuted ? 'bg-rose-500/30 text-rose-300 border border-rose-400/50' : 'bg-white/10 text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'Bunyikan Suara' : 'Bisukan Suara'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Subtitles Toggle */}
            <button
              onClick={() => setShowSubtitles(!showSubtitles)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                showSubtitles ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50' : 'bg-white/10 text-slate-400'
              }`}
              title="Aktifkan/Nonaktifkan Subtitle"
            >
              <Subtitles className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Perbesar Layar Video"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            {/* Reset Video to Default Scene if custom video is loaded */}
            {customVideoUrl && (
              <button
                onClick={handleRemoveCustomVideo}
                className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 border border-rose-400/40 transition-colors cursor-pointer"
                title="Hapus Video Custom & Kembalikan ke Scene 3D"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/*"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>
        </div>
      </div>

      {/* QUICK BUTTONS BELOW VIDEO */}
      <div className="mt-2 w-full max-w-xs flex flex-col gap-1.5">
        {/* Character Sheet Modal Trigger */}
        {onOpenCharacterSheet && (
          <button
            onClick={() => {
              soundFX.playChime('victory');
              onOpenCharacterSheet();
            }}
            className="w-full py-1.5 px-3 rounded-xl bg-[#0C2F52]/90 hover:bg-[#154675] border border-amber-400/50 text-[#FFE082] text-[11px] font-mono font-bold flex items-center justify-center gap-2 shadow-md backdrop-blur-md transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span>Karakteristik Tokoh Aksara</span>
          </button>
        )}

        {/* Asset & Video Management Guide Button */}
        <button
          onClick={() => {
            soundFX.playChime('cyan');
            setShowAssetGuideModal(true);
          }}
          className="w-full py-1.5 px-3 rounded-xl bg-[#08182B]/80 hover:bg-[#0E2841] border border-cyan-400/40 text-cyan-300 text-[10px] font-mono font-bold flex items-center justify-center gap-2 shadow-md backdrop-blur-md transition-all cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cara Pasang Video & Desain Gim</span>
        </button>
      </div>

      {/* PANDUAN MEMASUKKAN ASET & MENDESAIN GIM MODAL */}
      {showAssetGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#08182B] border-2 border-[#D4AF37] p-5 sm:p-6 text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
            {/* Close Button */}
            <button
              onClick={() => setShowAssetGuideModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2.5 mb-4 border-b border-white/10 pb-3">
              <div className="p-2 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-300">
                <FileVideo className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-['Cinzel'] font-bold text-[#FFE082]">
                  Panduan Memasukkan Aset & Mendesain Gim
                </h3>
                <p className="text-xs text-cyan-300 font-mono">
                  Proseduria V5.0 • Festival Biru Putih Kemendikdasmen (SMP Fase D)
                </p>
              </div>
            </div>

            {/* Instructions list */}
            <div className="space-y-4 text-xs font-sans leading-relaxed text-slate-200">
              {/* Option 1 */}
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-400/40 space-y-1.5">
                <div className="font-bold text-sm text-cyan-300 flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-cyan-400" />
                  <span>Cara 1: Pasang Video Langsung dari Komputer / HP Anda (Instan)</span>
                </div>
                <p>
                  Cukup klik tombol <strong className="text-amber-300">"Unggah MP4"</strong> di pojok kanan atas bingkai video, atau seret (drag & drop) berkas video MP4 Anda langsung ke bingkai video Aksara.
                </p>
                <p className="text-[11px] text-cyan-200/80 italic">
                  *Video akan otomatis disimpan ke IndexedDB browser Anda dan langsung berputar setiap kali Anda membuka halaman ini tanpa perlu konfigurasi server.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setShowAssetGuideModal(false);
                      fileInputRef.current?.click();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih Berkas Video MP4 Sekarang</span>
                  </button>
                </div>
              </div>

              {/* Option 2 */}
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-400/40 space-y-1.5">
                <div className="font-bold text-sm text-amber-300 flex items-center gap-1.5">
                  <FolderOpen className="w-4 h-4 text-amber-400" />
                  <span>Cara 2: Menyimpan Permanen ke Folder Proyek</span>
                </div>
                <p>
                  Jika Anda ingin video ini langsung tertanam di dalam berkas aplikasi (sehingga siapapun yang membuka web langsung melihat videonya):
                </p>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 font-mono text-[11px] bg-black/40 p-2.5 rounded-xl">
                  <li>Buka File Explorer di editor AI Studio sebelah kiri.</li>
                  <li>Buka folder: <code className="text-amber-300">public/assets/video/</code></li>
                  <li>Upload atau simpan video rekaman Aksara dengan nama: <code className="text-cyan-300">aksara_intro.mp4</code></li>
                  <li>Selesai! Aplikasi akan otomatis memuat video tersebut secara native.</li>
                </ol>
              </div>

              {/* Option 3: Designing the Game */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-400/40 space-y-2">
                <div className="font-bold text-sm text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Struktur & Desain Alur 5 Misi Pedagogis (Kurikulum Merdeka)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-amber-300 font-bold">Misi 01: Temukan</span>
                    <p className="text-slate-300 text-[10px]">Bedah struktur (Tujuan, Material, Langkah, Penegasan Ulang) & Papan Bukti.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-cyan-300 font-bold">Misi 02: Uji</span>
                    <p className="text-slate-300 text-[10px]">Lab Kaidah Bahasa, Verba Imperatif, Konjungsi Temporal, & Ukuran Akurat.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-rose-300 font-bold">Misi 03: Perbaiki</span>
                    <p className="text-slate-300 text-[10px]">Deteksi Anomali Prosedur Rusak & Simulasi Sebab-Akibat Gagal vs Berhasil.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                    <span className="text-emerald-300 font-bold">Misi 04: Rancang</span>
                    <p className="text-slate-300 text-[10px]">Bengkel Prosedur: Pilih bahan, tentukan aksi, dan susun urutan logis.</p>
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-black/30 border border-white/5 text-[11px] font-mono">
                  <span className="text-yellow-300 font-bold">Misi 05: Buktikan</span>
                  <p className="text-slate-300 text-[10px]">Asesmen Diagnostik Pemahaman (Procedure Check) & Evaluasi Profil Penguasaan.</p>
                </div>
              </div>
            </div>

            {/* Modal footer button */}
            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowAssetGuideModal(false)}
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-['Cinzel'] font-black text-xs uppercase shadow-md cursor-pointer"
              >
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
