import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  Palette,
  Shield,
  Film,
  Star,
  FileText,
  Home,
  Menu,
  X,
  Play,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import type { AccentColor } from '../types/portfolio';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { brand, theme, updateTheme, isAdmin } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const logoClickRef = React.useRef<{ count: number; timer: ReturnType<typeof setTimeout> | null }>({
    count: 0,
    timer: null,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToSection('home');
    logoClickRef.current.count += 1;
    if (logoClickRef.current.timer) clearTimeout(logoClickRef.current.timer);
    if (logoClickRef.current.count >= 3) {
      onOpenAdmin();
      logoClickRef.current.count = 0;
      return;
    }
    logoClickRef.current.timer = setTimeout(() => {
      logoClickRef.current.count = 0;
    }, 1500);
  };

  const accentOptions: { name: string; value: AccentColor; hex: string }[] = [
    { name: 'Neon Cyan', value: 'cyan', hex: '#06b6d4' },
    { name: 'Cyber Purple', value: 'purple', hex: '#a855f7' },
    { name: 'Emerald VFX', value: 'emerald', hex: '#10b981' },
    { name: 'Amber Sunset', value: 'amber', hex: '#f59e0b' },
    { name: 'Crimson Rose', value: 'rose', hex: '#f43f5e' },
    { name: 'Electric Indigo', value: 'indigo', hex: '#6366f1' },
  ];

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 ${
        scrolled
          ? 'backdrop-blur-xl bg-neutral-950/85 border-b border-white/10 shadow-2xl shadow-black/40'
          : 'bg-neutral-950/40 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo & Name */}
          <a
            href="#"
            className="flex items-center gap-2.5 group focus:outline-none"
            onClick={handleLogoClick}
          >
            <div
              className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center bg-black border shadow-md transition-transform group-hover:scale-105"
              style={{
                borderColor: 'var(--accent)',
                boxShadow: '0 0 15px var(--accent-glow)',
              }}
            >
              <img src="/logo.png" alt="AL1 Studio" className="w-full h-full object-cover scale-125" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-sm sm:text-base text-white tracking-tight">
                {brand.name}
              </span>
              <span
                className="w-2 h-2 rounded-full inline-block animate-pulse"
                style={{ backgroundColor: 'var(--accent)' }}
              />
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 glass-panel px-3 py-1 rounded-full border border-white/10">
            <button
              onClick={() => scrollToSection('home')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white transition-colors hover:bg-white/10 flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => scrollToSection('videos')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white transition-colors hover:bg-white/10 flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>Portfolio</span>
            </button>

            <button
              onClick={() => scrollToSection('policy')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white transition-colors hover:bg-white/10 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Terms of Service</span>
            </button>

            <button
              onClick={() => scrollToSection('reviews')}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-neutral-300 hover:text-white transition-colors hover:bg-white/10 flex items-center gap-1.5"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Reviews</span>
            </button>
          </nav>

          {/* Right Controls: Direct Portfolio Button, Admin & Themes */}
          <div className="flex items-center gap-2">
            {/* Direct Portfolio Button (Requested by User) */}
            <button
              onClick={() => scrollToSection('videos')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider text-black shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              style={{
                backgroundColor: 'var(--accent)',
                boxShadow: '0 0 15px var(--accent-glow)',
              }}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Portfolio</span>
            </button>

            {/* Accent Picker */}
            <div className="relative">
              <button
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
                className="w-8 h-8 rounded-xl flex items-center justify-center glass-panel border border-white/10 hover:border-white/25 text-neutral-300 hover:text-white transition-all focus:outline-none"
                title="Change Accent Color"
              >
                <Palette className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              </button>

              {colorPickerOpen && (
                <div
                  className="absolute right-0 mt-2 p-3 w-52 rounded-2xl glass-panel shadow-2xl z-50 border border-white/15"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-[11px] font-semibold text-neutral-400 mb-2 px-1">
                    Accent Color
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {accentOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          updateTheme({ accent: opt.value, customHex: undefined });
                          setColorPickerOpen(false);
                        }}
                        className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border text-[10px] font-medium transition-all ${
                          theme.accent === opt.value
                            ? 'border-white bg-white/15 text-white scale-105'
                            : 'border-white/10 hover:border-white/30 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full shadow-md"
                          style={{
                            backgroundColor: opt.hex,
                            boxShadow: `0 0 8px ${opt.hex}80`,
                          }}
                        />
                        <span className="truncate max-w-full">{opt.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => updateTheme({ mode: theme.mode === 'dark' ? 'light' : 'dark' })}
              className="w-8 h-8 rounded-xl flex items-center justify-center glass-panel border border-white/10 hover:border-white/25 text-neutral-300 hover:text-white transition-all focus:outline-none"
              title="Toggle Dark / Light Mode"
            >
              {theme.mode === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
              )}
            </button>

            {/* Admin Button - ONLY visible when logged in */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 text-xs font-semibold transition-all hover:bg-emerald-500/20 shadow-md"
                title="Admin Dashboard (Active)"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Admin Mode</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 rounded-xl flex items-center justify-center glass-panel border border-white/10 text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 p-3 rounded-2xl glass-panel border border-white/15 space-y-1.5">
            <button
              onClick={() => scrollToSection('home')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-white/10 flex items-center gap-2"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => scrollToSection('videos')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-white/10 flex items-center gap-2"
            >
              <Film className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              <span>Portfolio</span>
            </button>
            <button
              onClick={() => scrollToSection('policy')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-white/10 flex items-center gap-2"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Terms of Service</span>
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-200 hover:bg-white/10 flex items-center gap-2"
            >
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Reviews</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Dashboard (Active)</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
