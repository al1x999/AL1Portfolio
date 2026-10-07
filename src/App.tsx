import React, { useState, useEffect } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { InteractiveBackground } from './components/InteractiveBackground';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeaderHero } from './components/HeaderHero';
import { VideoShowcase } from './components/VideoShowcase';
import { TermsPolicySection } from './components/TermsPolicySection';
import { ReviewSection } from './components/ReviewSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { VideoModal } from './components/VideoModal';
import { AdminModal } from './components/admin/AdminModal';
import { BackgroundMusicPlayer } from './components/BackgroundMusicPlayer';
import { Shield, LogOut } from 'lucide-react';

const PortfolioContent: React.FC = () => {
  const { activeVideo, closeVideoModal, isAdmin, logoutAdmin } = usePortfolio();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Secret Admin Activation Listeners
  useEffect(() => {
    // 1. Secret URL query check (?admin or #admin)
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin') || window.location.hash.toLowerCase() === '#admin') {
      setIsAdminOpen(true);
    }

    // 2. Secret Keyboard Shortcut (Ctrl + Shift + A  OR  Alt + A)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlShiftA = e.ctrlKey && e.shiftKey && (e.key === 'a' || e.key === 'A');
      const isAltA = e.altKey && (e.key === 'a' || e.key === 'A');

      if (isCtrlShiftA || isAltA) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative min-h-screen bg-cyber-grid text-neutral-100 selection:bg-cyan-500 selection:text-black">
      {/* Dynamic Background Particle/Ambient Canvas */}
      <InteractiveBackground />

      {/* Dynamic Cursor Glow (Pointer devices) */}
      <CustomCursor />

      {/* Sticky Top Floating Navbar */}
      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* Core Sections */}
      <main className="relative z-10 space-y-4">
        {/* 1. Hero & Brand Header */}
        <HeaderHero onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* 2. Featured Video Portfolio & Custom Categories */}
        <VideoShowcase onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* 3. Islamic & Professional Terms of Service (কাজের নীতিমালা) */}
        <TermsPolicySection onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* 4. Dynamic Client Review & Testimonial Section */}
        <ReviewSection onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* 5. About AL1 Studio & Official Social Channels Hub (At the bottom) */}
        <AboutSection onOpenAdmin={() => setIsAdminOpen(true)} />
      </main>

      {/* Studio Footer */}
      <Footer />

      {/* Mobile Sticky Quick Navigation */}
      <MobileBottomNav onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* YouTube Lightbox Modal */}
      <VideoModal video={activeVideo} onClose={closeVideoModal} />

      {/* Dynamic Background Music Player */}
      <BackgroundMusicPlayer />

      {/* Simplified AL1 Studio Admin Dashboard */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />

      {/* Secret Floating Admin Status Pill (ONLY visible when owner is logged in) */}
      {isAdmin && (
        <div className="fixed bottom-4 left-4 z-50 hidden sm:flex items-center gap-2 p-1 rounded-full glass-panel border border-emerald-500/50 bg-neutral-950/90 shadow-2xl animate-fade-in">
          <button
            onClick={() => setIsAdminOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-black font-bold text-xs shadow-md hover:bg-emerald-400 transition-all cursor-pointer"
            title="Open Admin Dashboard"
          >
            <Shield className="w-3.5 h-3.5 fill-black" />
            <span>Admin Active</span>
          </button>
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
            title="Logout and hide admin mode"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
