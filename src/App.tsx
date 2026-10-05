import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { InteractiveBackground } from './components/InteractiveBackground';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeaderHero } from './components/HeaderHero';
import { VideoShowcase } from './components/VideoShowcase';
import { TermsPolicySection } from './components/TermsPolicySection';
import { ReviewSection } from './components/ReviewSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { VideoModal } from './components/VideoModal';
import { AdminModal } from './components/admin/AdminModal';

const PortfolioContent: React.FC = () => {
  const { activeVideo, closeVideoModal } = usePortfolio();
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
        <ReviewSection />
      </main>

      {/* Studio Footer */}
      <Footer />

      {/* Mobile Sticky Quick Navigation */}
      <MobileBottomNav onOpenAdmin={() => setIsAdminOpen(true)} />

      {/* YouTube Lightbox Modal */}
      <VideoModal video={activeVideo} onClose={closeVideoModal} />

      {/* Simplified AL1 Studio Admin Dashboard */}
      <AdminModal isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
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
