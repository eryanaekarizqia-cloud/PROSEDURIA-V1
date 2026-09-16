/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameStage } from '../types/gameLoopTypes';

export interface PlayerProfileData {
  name: string;
  title: string;
  avatar: string;
}

export interface ProcedureForgeSaveData {
  title: string;
  purpose: string;
  materials: string[];
  steps: { id: string; conjunction: string; action: string }[];
  tips: string;
}

export interface GameStateSaveData {
  version: number;
  highestReachedStageIndex: number;
  currentStage: GameStage;
  completedStages: string[];
  completedMissions: string[];
  unlockedZones: string[];
  unlockedBadges: string[];
  playerProfile: PlayerProfileData;
  quizScore: number | null;
  sequencePuzzleSolved: boolean;
  glitchesFound: number[];
  evidenceMatches: { [evId: string]: string };
  evidenceCompleted?: boolean;
  repairedModules: { [taskId: number]: string };
  repairsCompleted?: number;
  simulationCompleted: boolean;
  simulationPassed?: boolean;
  procedureForged?: boolean;
  procedureForgeData?: ProcedureForgeSaveData;
  finalCaseSolvedIds: number[];
  finalCaseCompleted?: boolean;
  lastSavedAt: string;
}

const STORAGE_KEY = 'proseduria_game_save_v1';

const DEFAULT_SAVE_DATA: GameStateSaveData = {
  version: 1,
  highestReachedStageIndex: 1,
  currentStage: 'OPENING',
  completedStages: [],
  completedMissions: ['intro_exploration'],
  unlockedZones: ['zone_1'],
  unlockedBadges: [],
  playerProfile: {
    name: 'Penjelajah Muda',
    title: 'Kandidat Penyelaras',
    avatar: 'mascot',
  },
  quizScore: null,
  sequencePuzzleSolved: false,
  glitchesFound: [],
  evidenceMatches: {},
  evidenceCompleted: false,
  repairedModules: {},
  repairsCompleted: 0,
  simulationCompleted: false,
  simulationPassed: false,
  procedureForged: false,
  finalCaseSolvedIds: [],
  finalCaseCompleted: false,
  lastSavedAt: new Date().toISOString(),
};

export const gameStateManager = {
  /**
   * Load saved state from localStorage or return default
   */
  load(): GameStateSaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_SAVE_DATA };
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_SAVE_DATA,
          ...parsed,
          playerProfile: {
            ...DEFAULT_SAVE_DATA.playerProfile,
            ...(parsed.playerProfile || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Gagal memuat simpanan permainan Proseduria:', e);
    }
    return { ...DEFAULT_SAVE_DATA };
  },

  /**
   * Save game state to localStorage
   */
  save(state: Partial<GameStateSaveData>): GameStateSaveData {
    try {
      const current = this.load();
      const updated: GameStateSaveData = {
        ...current,
        ...state,
        lastSavedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('Gagal menyimpan permainan Proseduria:', e);
      return { ...DEFAULT_SAVE_DATA, ...state };
    }
  },

  /**
   * Reset all progress back to pristine stage 1
   */
  reset(): GameStateSaveData {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Gagal mereset permainan Proseduria:', e);
    }
    return { ...DEFAULT_SAVE_DATA };
  },

  /**
   * Unlock a badge if not already unlocked
   */
  unlockBadge(badgeId: string): string[] {
    const state = this.load();
    if (!state.unlockedBadges.includes(badgeId)) {
      const updated = [...state.unlockedBadges, badgeId];
      this.save({ unlockedBadges: updated });
      return updated;
    }
    return state.unlockedBadges;
  },
};
