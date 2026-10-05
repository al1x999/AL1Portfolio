import React, { useEffect, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const InteractiveBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = usePortfolio();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes for visual timeline effect
    const particleCount = theme.particleIntensity === 'off' ? 0 : theme.particleIntensity === 'low' ? 25 : theme.particleIntensity === 'high' ? 70 : 45;
    
    // Get RGB values based on accent
    const accentColors: Record<string, string> = {
      cyan: '6, 182, 212',
      purple: '168, 85, 247',
      emerald: '16, 185, 129',
      amber: '245, 158, 11',
      rose: '244, 63, 94',
      indigo: '99, 102, 241',
    };
    const rgb = accentColors[theme.accent] || '6, 182, 212';

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      baseAlpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
        baseAlpha: Math.random() * 0.4 + 0.1,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle ambient glow near mouse
      const gradient = ctx.createRadialGradient(mouseX, mouseY, 10, mouseX, mouseY, 400);
      gradient.addColorStop(0, `rgba(${rgb}, ${theme.mode === 'dark' ? 0.07 : 0.04})`);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw animated video timeline grid / audio waves near the top
      ctx.strokeStyle = `rgba(${rgb}, ${theme.mode === 'dark' ? 0.05 : 0.03})`;
      ctx.lineWidth = 1;

      // Draw particles and connection lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${p.baseAlpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / 120) * 0.15})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme.accent, theme.mode, theme.particleIntensity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-70 transition-opacity duration-700"
    />
  );
};
