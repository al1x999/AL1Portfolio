import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

interface IntroScreenProps {
  onEnter: () => void;
}

interface PixelParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  vRot: number;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const { introConfig } = usePortfolio();
  const [isRevealing, setIsRevealing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Settings from Admin panel with minimal fallbacks
  const rawButtonText = introConfig?.buttonText;
  const buttonText = (!rawButtonText || rawButtonText === 'CLICK HERE') ? 'CLICK ANYWHERE' : rawButtonText;
  const themeAura = introConfig?.themeAura || 'dual';

  // Palette based on theme
  const getThemePalette = useCallback(() => {
    switch (themeAura) {
      case 'cyan':
        return ['#00f0ff', '#38bdf8', '#0284c7', '#ffffff'];
      case 'red':
        return ['#ef4444', '#f97316', '#dc2626', '#ffffff'];
      case 'purple':
        return ['#a855f7', '#ec4899', '#c084fc', '#ffffff'];
      case 'emerald':
        return ['#10b981', '#06b6d4', '#34d399', '#ffffff'];
      case 'dual':
      default:
        // AL1 Brand Signature: Crimson Red + Cyan + White
        return ['#ef4444', '#00f0ff', '#ffffff', '#ff2a5f', '#06b6d4'];
    }
  }, [themeAura]);

  // Start the pixel reveal / dissolve wave
  const startPixelReveal = useCallback(
    (originX: number, originY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        // Fallback if canvas is unavailable
        setTimeout(() => setIsVisible(false), 300);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setTimeout(() => setIsVisible(false), 300);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;
      const palette = getThemePalette();

      // Calculate max distance from click to screen corners
      const corners = [
        Math.hypot(0 - originX, 0 - originY),
        Math.hypot(width - originX, 0 - originY),
        Math.hypot(0 - originX, height - originY),
        Math.hypot(width - originX, height - originY),
      ];
      const maxDist = Math.max(...corners);

      // Create burst pixel particles at click position
      const particles: PixelParticle[] = [];
      const particleCount = 140;
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 3;
        const color = palette[Math.floor(Math.random() * palette.length)];
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 10 + 4,
          color,
          alpha: 1,
          life: 0,
          maxLife: Math.random() * 35 + 25,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.3,
        });
      }

      const TILE_SIZE = 32;
      const cols = Math.ceil(width / TILE_SIZE);
      const rows = Math.ceil(height / TILE_SIZE);

      const startTime = performance.now();
      const TOTAL_DURATION = 800; // ms

      const render = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / TOTAL_DURATION);

        ctx.clearRect(0, 0, width, height);

        // Current wave radius
        const waveRadius = progress * (maxDist * 1.18);
        const waveThickness = 120;

        // Draw pixel grid tiles
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const tileX = c * TILE_SIZE;
            const tileY = r * TILE_SIZE;
            const centerX = tileX + TILE_SIZE / 2;
            const centerY = tileY + TILE_SIZE / 2;
            const dist = Math.hypot(centerX - originX, centerY - originY);

            // 1. Beyond wave radius -> Still covered in solid black
            if (dist > waveRadius) {
              ctx.fillStyle = '#000000';
              ctx.fillRect(tileX, tileY, TILE_SIZE + 0.5, TILE_SIZE + 0.5);
            }
            // 2. Near wave front -> Shattering / dissolving pixel blocks
            else if (dist > waveRadius - waveThickness) {
              const localRatio = (dist - (waveRadius - waveThickness)) / waveThickness;
              const alpha = Math.max(0, Math.min(1, localRatio));

              // Draw shrinking / dissolving pixel block
              const currentTileSize = TILE_SIZE * alpha;
              const offset = (TILE_SIZE - currentTileSize) / 2;

              // Base dark tile
              ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.95})`;
              ctx.fillRect(tileX + offset, tileY + offset, currentTileSize, currentTileSize);

              // Wave neon edge highlight
              if (Math.random() > 0.45) {
                const edgeColor = palette[(c + r) % palette.length];
                ctx.fillStyle = edgeColor;
                ctx.globalAlpha = alpha * 0.85;
                ctx.fillRect(
                  tileX + offset + (Math.random() - 0.5) * 6,
                  tileY + offset + (Math.random() - 0.5) * 6,
                  currentTileSize * 0.4,
                  currentTileSize * 0.4
                );
                ctx.globalAlpha = 1;
              }
            }
            // 3. Fully inside wave radius -> Transparent (reveals the site!)
          }
        }

        // Render and update burst particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
          p.life++;
          p.rotation += p.vRot;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);

          if (p.alpha > 0.01) {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 8;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
          }
        }

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(render);
        } else {
          // Finished reveal sequence
          setIsVisible(false);
        }
      };

      animFrameRef.current = requestAnimationFrame(render);
    },
    [getThemePalette]
  );

  // Trigger enter sequence
  const handleEnter = useCallback(
    (e?: React.MouseEvent | KeyboardEvent) => {
      if (isRevealing) return;
      setIsRevealing(true);

      // Instantly start audio via direct user gesture
      onEnter();

      // Determine click origin for radial pixel reveal
      let originX = window.innerWidth / 2;
      let originY = window.innerHeight / 2;

      if (e && 'clientX' in e && typeof e.clientX === 'number') {
        originX = e.clientX;
        originY = e.clientY;
      }

      // Initialize canvas dimensions
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }

      startPixelReveal(originX, originY);

      // Safe cleanup fallback
      setTimeout(() => {
        setIsVisible(false);
      }, 950);
    },
    [isRevealing, onEnter, startPixelReveal]
  );

  // Keyboard shortcut: Space or Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleEnter(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEnter]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      onClick={handleEnter}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center select-none cursor-pointer overflow-hidden"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Dynamic Pixel Reveal Canvas Layer */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none z-30 ${isRevealing ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Main Minimal Showcase (Center stage, zero boxes, zero borders) */}
      <AnimatePresence>
        {!isRevealing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 1.08,
              filter: 'blur(10px)',
              transition: { duration: 0.35, ease: 'easeOut' },
            }}
            transition={{ duration: 0.7 }}
            className="relative z-10 flex flex-col items-center justify-center text-center px-4"
          >
            {/* AL1 Logo: Raw, Transparent, Minimal, Subtle Float */}
            <motion.div
              animate={{
                y: [-5, 5, -5],
              }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-52 sm:w-64 md:w-72 aspect-square flex items-center justify-center"
            >
              {/* Subtle Ambient Breathing Glow Behind Artwork */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{
                  background:
                    themeAura === 'dual'
                      ? 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, rgba(0,240,255,0.3) 60%, transparent 75%)'
                      : themeAura === 'cyan'
                      ? 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, transparent 75%)'
                      : themeAura === 'red'
                      ? 'radial-gradient(circle, rgba(239,68,68,0.4) 0%, transparent 75%)'
                      : themeAura === 'purple'
                      ? 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 75%)'
                      : 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 75%)',
                }}
              />

              {/* The Official AL1 Transparent Logo */}
              <img
                src="/al1-logo.png"
                alt="AL1 Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(0,240,255,0.3)] transition-transform duration-300 hover:scale-105"
                loading="eager"
              />
            </motion.div>

            {/* Minimal Prompt Text: CLICK ANYWHERE with subtle breathing indicator */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 sm:mt-8 flex flex-col items-center gap-2"
            >
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-white transition-all duration-300 hover:text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                <span className="font-heading font-extrabold text-xs sm:text-sm tracking-[0.3em] uppercase text-neutral-100 drop-shadow-md">
                  {buttonText}
                </span>
                <span className="text-cyan-400 font-mono text-sm opacity-80">›</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
