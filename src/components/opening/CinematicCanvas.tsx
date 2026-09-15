/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { PROSEDURIA_ASSETS } from '../../assets/proseduriaAssets';

interface CinematicCanvasProps {
  glitchActive?: boolean;
  mousePos?: { x: number; y: number };
}

interface StarParticle {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  color: string;
}

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({
  glitchActive = false,
  mousePos = { x: 0.5, y: 0.5 },
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef(mousePos || { x: 0.5, y: 0.5 });
  const glitchRef = useRef(glitchActive);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    mousePosRef.current = mousePos || { x: 0.5, y: 0.5 };
  }, [mousePos]);

  useEffect(() => {
    glitchRef.current = glitchActive;
  }, [glitchActive]);

  useEffect(() => {
    const img = new Image();
    img.src = PROSEDURIA_ASSETS.bgMain;
    img.onload = () => {
      bgImgRef.current = img;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate floating golden logic dust particles
    const stars: StarParticle[] = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speed: Math.random() * 0.35 + 0.1,
      alpha: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.4 ? '#FFE082' : '#00F2FE',
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      const pos = mousePosRef.current || { x: 0.5, y: 0.5 };
      const isGlitch = glitchRef.current;

      const offsetX = ((pos.x ?? 0.5) - 0.5) * 50;
      const offsetY = ((pos.y ?? 0.5) - 0.5) * 35;

      // 1. Draw Akademi Proseduria Fantasy Background
      if (bgImgRef.current && bgImgRef.current.complete) {
        ctx.save();
        // Subtle parallax movement
        const parallaxX = -30 + offsetX * 0.3;
        const parallaxY = -20 + offsetY * 0.2;
        const bgWidth = width + 60;
        const bgHeight = height + 40;

        ctx.drawImage(bgImgRef.current, parallaxX, parallaxY, bgWidth, bgHeight);

        // Dark cinematic vignette & atmosphere tint for optimal text contrast
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        if (isGlitch) {
          grad.addColorStop(0, 'rgba(20, 5, 15, 0.85)');
          grad.addColorStop(0.5, 'rgba(40, 10, 20, 0.7)');
          grad.addColorStop(1, 'rgba(15, 5, 10, 0.95)');
        } else {
          grad.addColorStop(0, 'rgba(6, 18, 30, 0.82)');
          grad.addColorStop(0.5, 'rgba(8, 24, 42, 0.65)');
          grad.addColorStop(1, 'rgba(4, 12, 22, 0.9)');
        }
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        ctx.restore();
      } else {
        // Fallback rich midnight navy gradient
        const grad = ctx.createRadialGradient(
          width * 0.5 + offsetX,
          height * 0.45 + offsetY,
          50,
          width * 0.5 + offsetX,
          height * 0.5 + offsetY,
          Math.max(width, height) * 0.8
        );
        grad.addColorStop(0, '#0D2B45');
        grad.addColorStop(0.5, '#08182B');
        grad.addColorStop(1, '#040C16');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Subtle Golden / Blue Logic Wave Lines
      ctx.strokeStyle = isGlitch ? 'rgba(255, 0, 85, 0.12)' : 'rgba(212, 175, 55, 0.08)';
      ctx.lineWidth = 1;
      const gridSpacing = 80;
      const shiftX = (frame * 0.2 + offsetX * 0.3) % gridSpacing;

      for (let x = shiftX; x < width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 3. Floating Golden Shimmer Particles
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) {
          star.y = height;
          star.x = Math.random() * width;
        }

        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha * (isGlitch ? Math.random() : 1);
        ctx.beginPath();
        ctx.arc(star.x + offsetX * 0.15, star.y + offsetY * 0.15, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // 4. Glitch scanline artifact when isGlitch is active
      if (isGlitch && Math.random() > 0.4) {
        const scanY = Math.random() * height;
        const scanH = Math.random() * 16 + 4;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 0, 85, 0.2)' : 'rgba(0, 242, 254, 0.15)';
        ctx.fillRect(0, scanY, width, scanH);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};
