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
  Compass,
  FileVideo,
  Upload,
  Subtitles,
  Eye,
  CheckCircle2,
  Maximize2,
  BookOpen,
} from 'lucide-react';
import { soundFX } from '../../utils/audioEffects';
import { aksaraVoice } from '../../utils/aksaraVoice';
import { AksaraCharacterVisual, AksaraExpressionType } from '../character/AksaraCharacterVisual';

interface AksaraVideoPlayerProps {
  onOpenCharacterSheet?: () => void;
  highestReachedStageIndex?: number;
}

export const AksaraVideoPlayer: React.FC<AksaraVideoPlayerProps> = ({
  onOpenCharacterSheet,
  highestReachedStageIndex = 1,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const DEFAULT_VIDEO_URL = '/assets/video/aksara_intro_cinematic.mp4';

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(true);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(DEFAULT_VIDEO_URL);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(8.0);

  // Cinematic interactive actor states (from the user's video & character sheet)
  const [actorPose, setActorPose] = useState<'standing_compass' | 'welcoming' | 'hand_on_chest' | 'thumbs_up'>('standing_compass');
  const [actorExpression, setActorExpression] = useState<AksaraExpressionType>('SENANG');
  const [isActorSpeaking, setIsActorSpeaking] = useState<boolean>(false);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState<number>(0);

  // Exact Indonesian dialogue from the user's uploaded video
  const VIDEO_SPEECH_PARTS = [
    { time: 0.0, text: 'Halo penjelajah! Selamat datang di Proseduria.', pose: 'welcoming' as const, expr: 'SENANG' as const },
    { time: 3.2, text: 'Aku Aksara. Aku akan menemanimu...', pose: 'hand_on_chest' as const, expr: 'BERSEMANGAT' as const },
    { time: 5.8, text: '...menemukan logika di balik setiap langkah.', pose: 'standing_compass' as const, expr: 'SUKSES' as const },
  ];

  const FULL_VIDEO_SPEECH =
    'Halo penjelajah! Selamat datang di Proseduria. Aku Aksara. Aku akan menemanimu menemukan logika di balik setiap langkah.';

  // Check localStorage for previously saved video blob
  useEffect(() => {
    const savedVideo = localStorage.getItem('proseduria_aksara_video_blob');
    if (savedVideo) {
      setCustomVideoUrl(savedVideo);
    }
  }, []);

  // Timer simulation for visual actor animation
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

          // Update pose and subtitles according to timing
          if (next >= 5.8) {
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

  const handlePlayPause = () => {
    soundFX.playChime('click');

    if (videoRef.current && videoLoaded) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setIsActorSpeaking(false);
        aksaraVoice.stop();
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            setIsActorSpeaking(true);
            if (!isMuted) {
              aksaraVoice.speak(FULL_VIDEO_SPEECH);
            }
          })
          .catch(() => {
            // Fallback play state if browser requires interaction
            setIsPlaying(true);
          });
      }
      return;
    }

    // Interactive Cinematic Stage Playback
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
    if (videoRef.current && videoLoaded) {
      videoRef.current.currentTime = 0;
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsActorSpeaking(true);
          if (!isMuted) {
            aksaraVoice.speak(FULL_VIDEO_SPEECH);
          }
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setCustomVideoUrl(blobUrl);
      setVideoLoaded(true);
      setVideoError(false);
      soundFX.playChime('victory');

      if (file.size < 15 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            try {
              localStorage.setItem('proseduria_aksara_video_blob', event.target.result as string);
            } catch (err) {
              console.warn('Storage limit reached, remaining active in memory.');
            }
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none w-full max-w-sm">
      {/* 1. CINEMATIC VIDEO FRAME (ARCHWAY DESIGN WITH GOLD BORDER) */}
      <div className="relative w-64 sm:w-72 md:w-80 h-[480px] sm:h-[530px] md:h-[570px] rounded-[32px] overflow-hidden border-2 border-white/95 bg-[#06101B] shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(212,175,55,0.4)] flex flex-col justify-between p-2">
        {/* Archway Decorative Header Badge */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#08182B]/95 border border-[#D4AF37] text-[10px] font-mono font-bold text-[#FFE082] shadow-lg backdrop-blur-md flex items-center gap-1.5 whitespace-nowrap">
          <FileVideo className="w-3.5 h-3.5 text-cyan-400" />
          <span>VIDEO INTRODUKSI AKSARA</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full h-full rounded-[24px] overflow-hidden bg-[#071322] flex items-center justify-center">
          {/* Optional Native Video Tag when file loaded */}
          {customVideoUrl && videoLoaded && (
            <video
              ref={videoRef}
              src={customVideoUrl}
              playsInline
              muted={isMuted}
              loop
              onLoadedData={() => {
                setVideoLoaded(true);
                setVideoError(false);
              }}
              onError={() => setVideoError(true)}
              className="w-full h-full object-cover object-center z-10"
            />
          )}

          {/* 2. RECREATED CINEMATIC SCENE FROM THE USER'S ATTACHED VIDEO */}
          {(!videoLoaded || !customVideoUrl) && (
            <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden">
              {/* A. Background: Grand Stone Archway of "Proseduria Academia" */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#0E2841] via-[#091B2F] to-[#040C15] pointer-events-none" />

              {/* Sunbeam Light Rays from Courtyard */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/20 via-transparent to-transparent pointer-events-none" />

              {/* Gothic Arch Vault Outline */}
              <div className="absolute top-0 inset-x-4 h-56 border-t-4 border-x-4 border-amber-400/40 rounded-t-[100px] pointer-events-none shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)]" />

              {/* Hanging Royal Blue Banner: "PROSEDURIA academia" */}
              <div className="absolute top-9 inset-x-8 z-10 flex flex-col items-center pointer-events-none">
                <div className="px-3.5 py-1 rounded-b-xl bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#172554] border-b-2 border-x border-[#D4AF37] shadow-[0_8px_20px_rgba(0,0,0,0.8)] text-center">
                  <div className="font-serif font-black tracking-widest text-[11px] sm:text-xs text-[#FFF5C0] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    PROSEDURIA
                  </div>
                  <div className="text-[7.5px] font-sans tracking-widest text-[#FFE082] italic -mt-0.5">
                    academia
                  </div>
                </div>
              </div>

              {/* Stone Pillars Left & Right with Burning Bronze Torches */}
              {/* Left Pillar & Torch */}
              <div className="absolute top-20 left-1 w-6 h-64 bg-[#0A1624] border-r border-white/10 flex flex-col items-center">
                <div className="w-4 h-7 mt-8 rounded-t-md bg-[#78350F] border border-amber-400/60 relative">
                  {/* Flickering flame */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-5 rounded-full bg-gradient-to-t from-amber-500 to-yellow-200 blur-[1px] animate-pulse" />
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400/30 blur-sm animate-ping" />
                </div>
              </div>

              {/* Right Pillar & Torch */}
              <div className="absolute top-20 right-1 w-6 h-64 bg-[#0A1624] border-l border-white/10 flex flex-col items-center">
                <div className="w-4 h-7 mt-8 rounded-t-md bg-[#78350F] border border-amber-400/60 relative">
                  {/* Flickering flame */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-5 rounded-full bg-gradient-to-t from-amber-500 to-yellow-200 blur-[1px] animate-pulse" />
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-amber-400/30 blur-sm animate-ping" />
                </div>
              </div>

              {/* Floating Cyan Magical Motes / Spirit Particles */}
              <div className="absolute top-36 left-10 w-2 h-2 rounded-full bg-cyan-400/70 blur-[1px] animate-bounce" style={{ animationDuration: '3s' }} />
              <div className="absolute top-48 right-10 w-2.5 h-2.5 rounded-full bg-cyan-300/80 blur-[1px] animate-pulse" style={{ animationDuration: '2.5s' }} />
              <div className="absolute bottom-28 left-14 w-1.5 h-1.5 rounded-full bg-amber-300/60 blur-[1px] animate-ping" style={{ animationDuration: '4s' }} />

              {/* Checkered Marble Floor Perspective */}
              <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 to-transparent border-t border-white/10 opacity-70 pointer-events-none" />

              {/* B. Center Character: AKSARA in 3D Anime Style matching character sheet */}
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
                  title="Putar Video Sapaan Aksara"
                >
                  <Play className="w-8 h-8 fill-current translate-x-0.5" />
                </button>
              )}
            </div>
          )}

          {/* 3. CINEMATIC SUBTITLES OVERLAY */}
          {showSubtitles && (isPlaying || !videoLoaded) && (
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
              style={{ width: `${(currentTime / duration) * 100}%` }}
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

            {/* Upload MP4 Video Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Unggah File MP4 Sendiri"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/webm,video/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>
      </div>

      {/* FOOTER ACTION: BUTTON TO INSPECT CHARACTER SHEET */}
      {onOpenCharacterSheet && (
        <button
          onClick={() => {
            soundFX.playChime('victory');
            onOpenCharacterSheet();
          }}
          className="mt-2 w-full max-w-[280px] py-2 px-3 rounded-2xl bg-gradient-to-r from-[#0C2F52] via-[#0E3D6B] to-[#0C2F52] hover:brightness-110 border border-amber-400/50 text-[#FFE082] text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg backdrop-blur-md transition-all transform hover:scale-102 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-300" />
          <span>Buka Karakteristik Tokoh Aksara</span>
        </button>
      )}
    </div>
  );
};
