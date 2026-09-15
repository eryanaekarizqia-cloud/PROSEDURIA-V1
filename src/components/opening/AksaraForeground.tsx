/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AksaraForegroundProps {
  glitchActive?: boolean;
  mousePos?: { x: number; y: number };
}

const AKSARA_GLYPHS = [
  { char: 'ꦲ', name: 'Ha (Aksara Jawa)', top: '22%', left: '12%', depth: 0.05, size: 'text-5xl sm:text-7xl', color: '#00F2FE' },
  { char: 'ꦤ', name: 'Na (Aksara Jawa)', top: '35%', left: '85%', depth: 0.08, size: 'text-4xl sm:text-6xl', color: '#D4AF37' },
  { char: 'ꦕ', name: 'Ca (Aksara Jawa)', top: '65%', left: '18%', depth: 0.03, size: 'text-4xl sm:text-6xl', color: '#00F2FE' },
  { char: 'ꦫ', name: 'Ra (Aksara Jawa)', top: '78%', left: '80%', depth: 0.06, size: 'text-5xl sm:text-7xl', color: '#FFE082' },
  { char: 'ꦏ', name: 'Ka (Aksara Jawa)', top: '15%', left: '48%', depth: 0.04, size: 'text-3xl sm:text-5xl', color: '#38BDF8' },
  { char: 'ᮃ', name: 'A (Aksara Sunda)', top: '82%', left: '44%', depth: 0.07, size: 'text-4xl sm:text-6xl', color: '#00F2FE' },
  { char: 'ᯀ', name: 'A (Surat Batak)', top: '48%', left: '8%', depth: 0.04, size: 'text-3xl sm:text-5xl', color: '#D4AF37' },
  { char: 'ᯅ', name: 'Ba (Surat Batak)', top: '42%', left: '90%', depth: 0.05, size: 'text-3xl sm:text-5xl', color: '#00F2FE' },
];

export const AksaraForeground: React.FC<AksaraForegroundProps> = ({
  glitchActive = false,
  mousePos = { x: 0.5, y: 0.5 },
}) => {
  const posX = mousePos?.x ?? 0.5;
  const posY = mousePos?.y ?? 0.5;
  const offsetX = (posX - 0.5) * 80;
  const offsetY = (posY - 0.5) * 60;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {AKSARA_GLYPHS.map((glyph, idx) => {
        const px = offsetX * glyph.depth;
        const py = offsetY * glyph.depth;
        const glitchShiftX = glitchActive ? (Math.random() - 0.5) * 16 : 0;
        const glitchShiftY = glitchActive ? (Math.random() - 0.5) * 10 : 0;

        return (
          <div
            key={idx}
            style={{
              top: glyph.top,
              left: glyph.left,
              transform: `translate3d(${px + glitchShiftX}px, ${py + glitchShiftY}px, 0)`,
              color: glitchActive && Math.random() > 0.6 ? '#FF0055' : glyph.color,
            }}
            className={`absolute ${glyph.size} font-serif transition-transform duration-700 ease-out opacity-25 hover:opacity-75 drop-shadow-[0_0_15px_rgba(0,242,254,0.4)] animate-pulse`}
            title={glyph.name}
          >
            {glyph.char}
          </div>
        );
      })}
    </div>
  );
};
