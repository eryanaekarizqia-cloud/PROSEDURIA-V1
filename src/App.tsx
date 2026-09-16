/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GameStage, STAGE_CONFIGS } from './types/gameLoopTypes';
import { StageStepperNav } from './components/stages/StageStepperNav';

// Stage Components
import { CinematicCanvas } from './components/opening/CinematicCanvas';
import { AksaraForeground } from './components/opening/AksaraForeground';
import { OpeningUI } from './components/opening/OpeningUI';
import { PlayerProfileModal } from './components/opening/PlayerProfileModal';
import { EmbarkationModal } from './components/opening/EmbarkationModal';
import { ArtBibleModal } from './components/ArtBibleModal';
import { BadgeCollectionModal } from './components/badges/BadgeCollectionModal';

import { WorldMapScreen } from './components/map/WorldMapScreen';
import { LembahInformasiStage } from './components/stages/LembahInformasiStage';
import { Mission01BriefingStage } from './components/stages/Mission01BriefingStage';
import { PracticeRoomM01 } from './components/stages/PracticeRoomM01';
import { SequencePuzzleStage } from './components/stages/SequencePuzzleStage';
import { ProcedureGlitchStage } from './components/stages/ProcedureGlitchStage';
import { EvidenceBoardStage } from './components/stages/EvidenceBoardStage';
import { RepairWorkshopStage } from './components/stages/RepairWorkshopStage';
import { TestSimulationStage } from './components/stages/TestSimulationStage';
import { RewardCelebrationStage } from './components/stages/RewardCelebrationStage';
import { ProcedureForge } from './components/procedure-forge/ProcedureForge';
import { MasteryDebriefStage } from './components/stages/MasteryDebriefStage';
import { FinalCaseStage } from './components/stages/FinalCaseStage';

import { soundFX } from './utils/audioEffects';
import { BookOpen } from 'lucide-react';

export default function App() {
  const [currentStage, setCurrentStage] = useState<GameStage>('OPENING');
  const [highestReachedStageIndex, setHighestReachedStageIndex] = useState<number>(1);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isEmbarkationOpen, setIsEmbarkationOpen] = useState<boolean>(false);
  const [isArtBibleOpen, setIsArtBibleOpen] = useState<boolean>(false);
  const [isBadgesOpen, setIsBadgesOpen] = useState<boolean>(false);
  const [glitchActive, setGlitchActive] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Keep track of highest stage unlocked
  useEffect(() => {
    const stageIndex = STAGE_CONFIGS.findIndex((s) => s.id === currentStage);
    if (stageIndex !== -1 && stageIndex + 1 > highestReachedStageIndex) {
      setHighestReachedStageIndex(stageIndex + 1);
    }
  }, [currentStage, highestReachedStageIndex]);

  const handleStageSelect = (stage: GameStage) => {
    soundFX.playChime('click');
    setCurrentStage(stage);
  };

  return (
    <div className="relative w-screen h-screen bg-[#050B14] text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. ATMOSPHERIC TROPICAL FANTASY LIGHTING & AMBIENT AURORAS */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1E38]/30 via-transparent to-[#050B14]/90 pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* 2. CINEMATIC VIGNETTE OVERLAY */}
      <div className="absolute inset-0 cinematic-vignette pointer-events-none z-30" />

      {/* 3. ORNATE GAME HUD CORNER BRACKETS (ALL 4 CORNERS) */}
      <div className="hud-corner-tl z-40 hidden sm:block" />
      <div className="hud-corner-tr z-40 hidden sm:block" />
      <div className="hud-corner-bl z-40 hidden sm:block" />
      <div className="hud-corner-br z-40 hidden sm:block" />

      {/* Global Top Nav Stepper */}
      <StageStepperNav
        currentStage={currentStage}
        onSelectStage={handleStageSelect}
        highestReachedStageIndex={highestReachedStageIndex}
        onOpenBadges={() => {
          soundFX.playChime('victory');
          setIsBadgesOpen(true);
        }}
      />

      {/* Persistent Floating Quick-Access to Art Bible & Pedagogy Specs */}
      <button
        onClick={() => {
          soundFX.playChime('cyan');
          setIsArtBibleOpen(true);
        }}
        className="fixed bottom-4 right-4 z-40 px-3.5 py-2 rounded-xl bg-[#091C33]/90 hover:bg-[#112E52] text-[#FFE082] hover:text-white border border-[#D4AF37]/60 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.8),0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2 text-xs font-mono transition-all hover:scale-105 cursor-pointer"
        title="Buka Art Bible & Panduan Kurikulum"
      >
        <BookOpen className="w-4 h-4 text-[#FFE082]" />
        <span className="hidden sm:inline font-bold">Art Bible & Konsep</span>
      </button>

      {/* STAGE 1: OPENING HERO SCREEN */}
      {currentStage === 'OPENING' && (
        <div
          className="relative w-full h-full"
          onMouseMove={(e) => {
            setMousePos({
              x: e.clientX / window.innerWidth,
              y: e.clientY / window.innerHeight,
            });
          }}
        >
          <CinematicCanvas glitchActive={glitchActive} mousePos={mousePos} />
          <AksaraForeground glitchActive={glitchActive} mousePos={mousePos} />
          <OpeningUI
            glitchActive={glitchActive}
            mousePos={mousePos}
            highestReachedStageIndex={highestReachedStageIndex}
            onToggleGlitch={() => {
              soundFX.playChime('glitch');
              setGlitchActive(!glitchActive);
            }}
            onStartAdventure={() => {
              soundFX.playChime('gold');
              setIsEmbarkationOpen(true);
            }}
            onOpenProfile={() => {
              soundFX.playChime('cyan');
              setIsProfileOpen(true);
            }}
            onOpenBadges={() => {
              soundFX.playChime('victory');
              setIsBadgesOpen(true);
            }}
            onOpenWorldMap={() => {
              soundFX.playChime('cyan');
              setCurrentStage('WORLD_MAP');
            }}
            onOpenArtBible={() => {
              soundFX.playChime('cyan');
              setIsArtBibleOpen(true);
            }}
          />
        </div>
      )}

      {/* STAGE 2: WORLD MAP SCREEN (5 ZONA DUNIA PROSEDURIA) */}
      {currentStage === 'WORLD_MAP' && (
        <WorldMapScreen
          highestReachedStageIndex={highestReachedStageIndex}
          onBackToTitle={() => {
            soundFX.playChime('cyan');
            setCurrentStage('OPENING');
          }}
          onEnterLembahInformasi={() => {
            soundFX.playChime('cyan');
            setCurrentStage('LEMBAH_INFORMASI');
          }}
          onEnterMission01={() => {
            soundFX.playChime('gold');
            setCurrentStage('MISSION_01');
          }}
          onEnterSequencePuzzle={() => {
            soundFX.playChime('cyan');
            setCurrentStage('SEQUENCE_PUZZLE');
          }}
          onEnterProcedureGlitch={() => {
            soundFX.playChime('cyan');
            setCurrentStage('PROCEDURE_GLITCH');
          }}
          onEnterProcedureForge={() => {
            soundFX.playChime('cyan');
            setCurrentStage('PROCEDURE_FORGE');
          }}
          onEnterFinalCase={() => {
            soundFX.playChime('victory');
            setCurrentStage('FINAL_CASE');
          }}
        />
      )}

      {/* STAGE 3: LEMBAH INFORMASI (C1 & C2) */}
      {currentStage === 'LEMBAH_INFORMASI' && (
        <LembahInformasiStage
          onNext={() => {
            soundFX.playChime('cyan');
            setCurrentStage('MISSION_01');
          }}
          onBackToMap={() => {
            soundFX.playChime('click');
            setCurrentStage('WORLD_MAP');
          }}
        />
      )}

      {/* STAGE 4: MISSION 01 GOLD STANDARD VERTICAL SLICE: PRACTICE ROOM */}
      {currentStage === 'MISSION_01' && (
        <PracticeRoomM01
          onBackToMap={() => {
            soundFX.playChime('click');
            setCurrentStage('WORLD_MAP');
          }}
          onMissionComplete={() => {
            soundFX.playChime('victory');
            setHighestReachedStageIndex((prev) => Math.max(prev, 5));
            setCurrentStage('WORLD_MAP');
          }}
        />
      )}

      {/* STAGE 5: SEQUENCE PUZZLE (C3 APPLYING) */}
      {currentStage === 'SEQUENCE_PUZZLE' && (
        <SequencePuzzleStage
          onNext={() => {
            soundFX.playChime('cyan');
            setCurrentStage('PROCEDURE_GLITCH');
          }}
          onBack={() => {
            soundFX.playChime('click');
            setCurrentStage('MISSION_01');
          }}
        />
      )}

      {/* STAGE 6: PROCEDURE GLITCH (C4 ANALYZING) */}
      {currentStage === 'PROCEDURE_GLITCH' && (
        <ProcedureGlitchStage
          onNext={() => {
            soundFX.playChime('cyan');
            setCurrentStage('EVIDENCE_BOARD');
          }}
          onBack={() => {
            soundFX.playChime('click');
            setCurrentStage('SEQUENCE_PUZZLE');
          }}
        />
      )}

      {/* STAGE 7: EVIDENCE BOARD (C4 FORENSIC) */}
      {currentStage === 'EVIDENCE_BOARD' && (
        <EvidenceBoardStage
          onNext={() => {
            soundFX.playChime('cyan');
            setCurrentStage('REPAIR');
          }}
          onBack={() => {
            soundFX.playChime('click');
            setCurrentStage('PROCEDURE_GLITCH');
          }}
        />
      )}

      {/* STAGE 8: REPAIR WORKSHOP (C5 EVALUATING & REPAIRING) */}
      {currentStage === 'REPAIR' && (
        <RepairWorkshopStage
          onNext={() => {
            soundFX.playChime('cyan');
            setCurrentStage('TEST');
          }}
          onBack={() => {
            soundFX.playChime('click');
            setCurrentStage('EVIDENCE_BOARD');
          }}
        />
      )}

      {/* STAGE 9: TEST SIMULATION (C5 EFFICIENCY TESTING) */}
      {currentStage === 'TEST' && (
        <TestSimulationStage
          onNext={() => {
            soundFX.playChime('gold');
            setCurrentStage('REWARD');
          }}
          onBack={() => {
            soundFX.playChime('click');
            setCurrentStage('REPAIR');
          }}
        />
      )}

      {/* STAGE 10: REWARD CELEBRATION */}
      {currentStage === 'REWARD' && (
        <RewardCelebrationStage
          onNext={() => {
            soundFX.playChime('gold');
            setCurrentStage('MASTERY');
          }}
          onBackToMap={() => {
            soundFX.playChime('click');
            setCurrentStage('WORLD_MAP');
          }}
        />
      )}

      {/* STAGE 11: MASTERY DEBRIEF & WORLD RESTORATION */}
      {currentStage === 'MASTERY' && (
        <MasteryDebriefStage
          onBackToMap={() => {
            soundFX.playChime('cyan');
            setCurrentStage('WORLD_MAP');
          }}
          onEnterProcedureForge={() => {
            soundFX.playChime('gold');
            setCurrentStage('PROCEDURE_FORGE');
          }}
          onRestartLoop={() => {
            soundFX.playChime('gold');
            setCurrentStage('OPENING');
          }}
        />
      )}

      {/* STAGE 12: PROCEDURE FORGE (C6 CREATING) */}
      {currentStage === 'PROCEDURE_FORGE' && (
        <ProcedureForge
          onProceedToFinalCase={() => {
            soundFX.playChime('victory');
            setCurrentStage('FINAL_CASE');
          }}
          onProceedToMastery={() => {
            soundFX.playChime('victory');
            setCurrentStage('FINAL_CASE');
          }}
          onBackToMap={() => {
            soundFX.playChime('click');
            setCurrentStage('WORLD_MAP');
          }}
        />
      )}

      {/* STAGE 13: BONUS FINAL BOSS STAGE: FINAL CASE */}
      {currentStage === 'FINAL_CASE' && (
        <FinalCaseStage
          onBackToMap={() => {
            soundFX.playChime('cyan');
            setCurrentStage('WORLD_MAP');
          }}
          onComplete={() => {
            soundFX.playChime('victory');
            setCurrentStage('MASTERY');
          }}
        />
      )}

      {/* Modals */}
      <PlayerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <EmbarkationModal
        isOpen={isEmbarkationOpen}
        onClose={() => setIsEmbarkationOpen(false)}
        onOpenMap={() => {
          setIsEmbarkationOpen(false);
          soundFX.playChime('gold');
          setCurrentStage('WORLD_MAP');
        }}
      />

      <ArtBibleModal
        isOpen={isArtBibleOpen}
        onClose={() => setIsArtBibleOpen(false)}
      />

      <BadgeCollectionModal
        isOpen={isBadgesOpen}
        onClose={() => setIsBadgesOpen(false)}
      />
    </div>
  );
}
