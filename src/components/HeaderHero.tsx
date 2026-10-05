import React from 'react';
import {
  Film,
  Layers,
  Sliders,
  Smartphone,
  Box,
  Cpu,
  Play,
  Share2,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

interface HeaderHeroProps {
  onOpenAdmin?: () => void;
}

export const HeaderHero: React.FC<HeaderHeroProps> = () => {
  const { brand, skills } = usePortfolio();

  const getSkillIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'film':
        return <Film className="w-3.5 h-3.5" />;
      case 'layers':
        return <Layers className="w-3.5 h-3.5" />;
      case 'sliders':
        return <Sliders className="w-3.5 h-3.5" />;
      case 'smartphone':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'box':
        return <Box className="w-3.5 h-3.5" />;
      default:
        return <Cpu className="w-3.5 h-3.5" />;
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="relative pt-24 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-20">
      {/* Availability Status Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs text-neutral-300 shadow-md">
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: 'var(--accent)' }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: 'var(--accent)' }}
            />
          </span>
          <span className="font-medium text-xs text-neutral-200">
            {brand.statusText}
          </span>
        </div>
      </div>

      {/* Main Hero & Brand Identity */}
      <div className="flex flex-col items-center text-center">
        {/* Animated Brand Logo Container (Slightly Zoomed to fill organically) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center border-2 mb-5 group cursor-pointer overflow-hidden bg-black shadow-2xl transition-transform hover:scale-105"
          style={{
            borderColor: 'var(--accent)',
            boxShadow: '0 0 35px var(--accent-glow)',
          }}
          onClick={() => scrollTo('videos')}
          title="Explore Portfolio"
        >
          <img
            src="/logo.png"
            alt="AL1 Studio Logo"
            className="w-full h-full object-cover scale-125 transition-transform duration-300 group-hover:scale-135"
          />
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black animate-pulse"
            style={{ backgroundColor: 'var(--accent)' }}
          />
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-heading font-black text-4xl sm:text-6xl text-white tracking-tight flex items-center gap-2"
        >
          {brand.name}
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: 'var(--accent)' }}
          />
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-2 text-base sm:text-xl font-bold tracking-wide uppercase"
          style={{
            color: 'var(--accent)',
            textShadow: '0 0 15px var(--accent-glow)',
          }}
        >
          {brand.tagline}
        </motion.p>

        {/* Short Bio */}
        <motion.p
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-sm sm:text-base text-neutral-300 max-w-xl leading-relaxed font-normal"
        >
          {brand.bio}
        </motion.p>

        {/* Direct Action Buttons */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          {/* Direct Portfolio Button */}
          <button
            onClick={() => scrollTo('videos')}
            className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider text-black flex items-center gap-2 shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--accent)',
              boxShadow: '0 0 25px var(--accent-glow)',
            }}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Explore Portfolio</span>
          </button>

          {/* Terms of Service Button (English title) */}
          <button
            onClick={() => scrollTo('policy')}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white glass-panel border border-white/20 hover:border-amber-400/50 flex items-center gap-2 transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Terms of Service</span>
          </button>

          {/* Client Reviews Button */}
          <button
            onClick={() => scrollTo('reviews')}
            className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider text-neutral-200 glass-panel border border-white/10 hover:border-cyan-400/50 flex items-center gap-2 transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>Client Reviews</span>
          </button>
        </motion.div>

        {/* Software Expertise Badges */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-2xl"
        >
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="glass-panel px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2 hover:border-cyan-500/40 transition-all hover:scale-105"
            >
              <div
                className="w-5 h-5 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: 'rgba(var(--accent-rgb), 0.2)',
                  color: 'var(--accent)',
                }}
              >
                {getSkillIcon(skill.icon)}
              </div>
              <span className="text-xs font-bold text-white">{skill.name}</span>
              <span className="text-[10px] font-mono text-neutral-400 border-l border-white/10 pl-2">
                {skill.badge}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
