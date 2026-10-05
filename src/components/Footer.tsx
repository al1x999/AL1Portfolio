import React from 'react';
import { ArrowUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { brand, links } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeLinks = links.filter((l) => l.isActive).slice(0, 5);

  return (
    <footer className="border-t border-white/10 bg-neutral-950/80 backdrop-blur-md pt-12 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div
              className="w-7 h-7 rounded-xl overflow-hidden flex items-center justify-center border bg-black p-0.5"
              style={{
                borderColor: 'var(--accent)',
              }}
            >
              <img src="/logo.png" alt="AL1 Studio" className="w-full h-full object-cover scale-125" />
            </div>
            <span className="font-heading font-black text-base text-white tracking-tight">{brand.name}</span>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm">
            {brand.bio}
          </p>
        </div>

        {/* Quick Socials */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-neutral-400">
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
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 hover:text-white px-3 py-1.5 rounded-xl glass-panel border border-white/10 hover:border-white/20 transition-all"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="max-w-5xl mx-auto mt-8 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-2">
        <span>© {new Date().getFullYear()} {brand.name}. Video Editing & Content Creation.</span>
        <span>Ultra-Clean Portfolio & Interactive Link Hub</span>
      </div>
    </footer>
  );
};
