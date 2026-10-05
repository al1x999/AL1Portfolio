import React from 'react';
import { Film, Share2, Star, Shield, FileText } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

interface MobileBottomNavProps {
  onOpenAdmin: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ onOpenAdmin }) => {
  const { isAdmin } = usePortfolio();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const navOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="md:hidden fixed bottom-3 left-4 right-4 z-40">
      <div className="glass-panel backdrop-blur-2xl bg-neutral-950/90 border border-white/15 rounded-2xl px-3 py-2 flex items-center justify-around shadow-2xl shadow-black/80">
        <button
          onClick={() => scrollTo('videos')}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white p-1 focus:outline-none"
        >
          <Film className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <span className="text-[10px] font-medium">Videos</span>
        </button>

        <button
          onClick={() => scrollTo('policy')}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white p-1 focus:outline-none"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-medium">নীতিমালা</span>
        </button>

        <button
          onClick={() => scrollTo('link-hub')}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white p-1 focus:outline-none"
        >
          <Share2 className="w-4 h-4 text-neutral-300" />
          <span className="text-[10px] font-medium">Links</span>
        </button>

        <button
          onClick={() => scrollTo('reviews')}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white p-1 focus:outline-none"
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-medium">Reviews</span>
        </button>

        <button
          onClick={onOpenAdmin}
          className="flex flex-col items-center gap-1 text-neutral-400 hover:text-white p-1 focus:outline-none relative"
        >
          <Shield className="w-5 h-5" style={{ color: isAdmin ? '#10b981' : 'var(--text-secondary)' }} />
          <span className="text-[10px] font-medium">Admin</span>
          {isAdmin && (
            <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          )}
        </button>
      </div>
    </div>
  );
};
