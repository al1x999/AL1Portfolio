import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export const CustomCursor: React.FC = () => {
  const { theme } = usePortfolio();
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    // Only enable custom cursor for devices with mouse/pointer
    if (window.matchMedia('(pointer: fine)').matches && theme.cursorTrail) {
      setIsPointerDevice(true);
    } else {
      setIsPointerDevice(false);
      return;
    }

    const updateMouse = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if hovering interactive element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('button') ||
          target.closest('a') ||
          target.closest('.interactive-target'))
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, [theme.cursorTrail]);

  if (!isPointerDevice || !theme.cursorTrail) return null;

  return (
    <>
      {/* Outer Glow Ring */}
      <motion.div
        className="pointer-events-none fixed z-50 rounded-full border border-cyan-400/40 mix-blend-screen"
        style={{
          borderColor: 'var(--accent)',
          boxShadow: isHovering ? '0 0 25px var(--accent-glow)' : '0 0 10px var(--accent-glow)',
        }}
        animate={{
          x: mousePosition.x - (isHovering ? 24 : 16),
          y: mousePosition.y - (isHovering ? 24 : 16),
          width: isHovering ? 48 : 32,
          height: isHovering ? 48 : 32,
          backgroundColor: isHovering ? 'var(--accent-glow)' : 'transparent',
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
          mass: 0.4,
        }}
      />
      {/* Inner Dot */}
      <motion.div
        className="pointer-events-none fixed z-50 h-2 w-2 rounded-full"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 35,
          stiffness: 500,
          mass: 0.1,
        }}
      />
    </>
  );
};
