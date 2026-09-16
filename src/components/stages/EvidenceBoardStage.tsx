/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { gameStateManager } from '../../utils/gameStateManager';
import { FantasyEvidenceBoard } from '../investigation/FantasyEvidenceBoard';

interface EvidenceBoardStageProps {
  onNext: () => void;
  onBack: () => void;
}

export const EvidenceBoardStage: React.FC<EvidenceBoardStageProps> = ({
  onNext,
  onBack,
}) => {
  return (
    <div className="relative w-full h-full pt-14 pb-2 px-2 sm:px-4 flex flex-col justify-between overflow-hidden">
      <FantasyEvidenceBoard
        onBack={onBack}
        onComplete={() => {
          gameStateManager.unlockBadge('pengumpul_bukti');
          gameStateManager.save({ evidenceCompleted: true });
          onNext();
        }}
      />
    </div>
  );
};
