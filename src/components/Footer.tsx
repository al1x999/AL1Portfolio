import React, { useState } from 'react';
import { ArrowUp, ShieldCheck, Lock, Mail, Scale } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { LegalModal, type LegalTab } from './LegalModal';
import { ContactModal } from './ContactModal';

export const Footer: React.FC = () => {
  const { brand, links } = usePortfolio();
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTab>('terms');
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLegalModal = (tab: LegalTab) => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  const activeLinks = links.filter((l) => l.isActive).slice(0, 5);

  return (
    <footer className="border-t border-white/10 bg-neutral-950/80 backdrop-blur-md pt-12 pb-28 sm:pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div
              className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center border bg-black p-0.5 shadow-md"
              style={{
                borderColor: 'var(--accent)',
              }}
            >
              <img src="/logo.png" alt="AL1" className="w-full h-full object-cover scale-125" />
            </div>
            <span className="font-heading font-black text-lg text-white tracking-tight">AL1 Studio</span>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm">
            {brand.bio}
          </p>
        </div>

        {/* Quick Socials & Contact Button */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-neutral-300">
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors hover:underline"
            >
              {link.title}
            </a>
          ))}
          <button
            onClick={() => setContactModalOpen(true)}
            className="px-3 py-1.5 rounded-xl glass-panel border border-cyan-400/30 hover:border-cyan-400/60 bg-cyan-400/10 text-cyan-300 hover:text-cyan-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105"
          >
            <Mail className="w-3.5 h-3.5 text-cyan-400" />
            <span>Contact Studio</span>
          </button>
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white px-3.5 py-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Enhanced Legal, Compliance & Privacy Bar */}
      <div className="max-w-5xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold text-xs">AL1 (এ এল ওয়ান)</span>
            <span className="text-neutral-400 text-xs font-medium">&copy; 2026. All rights reserved.</span>
          </div>
          <span className="hidden sm:inline text-neutral-700">&bull;</span>
          <span className="text-[11px] text-neutral-400 font-mono">Protected Creative Assets</span>
        </div>

        {/* Prominent High-Contrast Legal & Privacy Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <button
            onClick={() => openLegalModal('terms')}
            className="px-3.5 py-1.5 rounded-xl glass-panel border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-xs font-bold text-amber-300 hover:text-amber-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Open Terms of Service"
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>Terms of Service</span>
          </button>

          <button
            onClick={() => openLegalModal('privacy')}
            className="px-3.5 py-1.5 rounded-xl glass-panel border border-cyan-400/30 bg-cyan-400/10 hover:bg-cyan-400/20 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Open Privacy Policy"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => openLegalModal('security')}
            className="px-3.5 py-1.5 rounded-xl glass-panel border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/20 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            title="Open Security Architecture"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security</span>
          </button>
        </div>
      </div>

      {/* Modals rendered directly to document.body via createPortal */}
      <LegalModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalTab}
      />
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
      />
    </footer>
  );
};
