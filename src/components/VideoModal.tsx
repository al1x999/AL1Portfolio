import React, { useEffect, useState } from 'react';
import {
  X,
  Share2,
  ExternalLink,
  Check,
  Clock,
  Eye,
  User,
  ArrowUpRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VideoProject } from '../types/portfolio';
import { usePortfolio } from '../context/PortfolioContext';

interface VideoModalProps {
  video: VideoProject | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const { categories } = usePortfolio();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (video) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(video.youtubeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCategory = categories.find((c) => c.slug === video.category);
  const isVertical = video.aspectRatio === '9:16';

  const scrollToLinks = () => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById('link-hub');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative z-10 w-full glass-panel rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-neutral-950 my-auto ${
            isVertical ? 'max-w-md' : 'max-w-4xl'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-neutral-900/60">
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-black"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {currentCategory?.name || video.category}
              </span>
              <span className="text-xs font-mono text-neutral-400">
                {video.aspectRatio} {isVertical ? 'Vertical Short' : 'Widescreen HD'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyLink}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1"
                title="Copy Video Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="text-[11px] hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
              </button>

              <a
                href={video.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white transition-all text-xs flex items-center gap-1"
                title="Watch on YouTube"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">YouTube</span>
              </a>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 border border-white/15 text-neutral-400 hover:text-white transition-all ml-1"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div
            className={`relative bg-black flex items-center justify-center ${
              isVertical ? 'h-[520px] max-w-[340px] mx-auto py-3' : 'w-full aspect-video'
            }`}
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=${window.location.origin}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={`w-full h-full border-0 ${isVertical ? 'rounded-2xl' : ''}`}
            />
          </div>

          {/* Details Bar */}
          <div className="p-4 sm:p-5 border-t border-white/10 bg-neutral-900/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                {video.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-neutral-400">
                <span className="flex items-center gap-1 text-neutral-300">
                  <User className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                  {video.client}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {video.duration}
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Eye className="w-3.5 h-3.5" />
                  {video.views} Views
                </span>
              </div>
            </div>

            <button
              onClick={scrollToLinks}
              className="px-4 py-2 rounded-xl text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shrink-0"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <span>Work With AL1</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
