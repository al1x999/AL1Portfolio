import React, { useState } from 'react';
import {
  Play,
  Filter,
  Plus,
  Tv,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import type { VideoProject } from '../types/portfolio';

interface VideoShowcaseProps {
  onOpenAdmin?: () => void;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({ onOpenAdmin }) => {
  const { videos, categories, openVideoModal } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<'all' | 'landscape' | 'reels' | string>('all');

  // Separate videos by aspect ratio
  const longVideos = videos
    .filter((v) => v.aspectRatio === '16:9')
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.order - b.order;
    });

  const shortVideos = videos
    .filter((v) => v.aspectRatio === '9:16')
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.order - b.order;
    });

  // Category specific filter
  const filteredCategoryVideos = (list: VideoProject[]) => {
    if (activeFilter === 'all' || activeFilter === 'landscape' || activeFilter === 'reels') {
      return list;
    }
    return list.filter((v) => v.category === activeFilter);
  };

  const visibleLongVideos =
    activeFilter === 'reels' ? [] : filteredCategoryVideos(longVideos);

  const visibleShortVideos =
    activeFilter === 'landscape' ? [] : filteredCategoryVideos(shortVideos);

  return (
    <section id="videos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-20">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel border border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">
            <Play className="w-3 h-3 fill-current" style={{ color: 'var(--accent)' }} />
            <span>Featured Video Edits</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            Video Portfolio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Widescreen long-form commercials and high-retention vertical reels. Click any video to play.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2 rounded-xl text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
              style={{ backgroundColor: 'var(--accent)' }}
              title="Add or Edit Videos via Admin"
            >
              <Plus className="w-4 h-4" />
              <span>Add / Manage</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-10 no-scrollbar">
        <button
          onClick={() => setActiveFilter('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all focus:outline-none cursor-pointer ${
            activeFilter === 'all'
              ? 'border-white text-black font-bold shadow-lg'
              : 'border-white/10 glass-panel text-neutral-400 hover:text-white hover:border-white/20'
          }`}
          style={{
            backgroundColor: activeFilter === 'all' ? 'var(--accent)' : undefined,
            boxShadow: activeFilter === 'all' ? '0 0 15px var(--accent-glow)' : undefined,
          }}
        >
          <span>All Projects</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeFilter === 'all' ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {videos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('landscape')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all focus:outline-none cursor-pointer ${
            activeFilter === 'landscape'
              ? 'border-white text-black font-bold shadow-lg'
              : 'border-white/10 glass-panel text-neutral-400 hover:text-white hover:border-white/20'
          }`}
          style={{
            backgroundColor: activeFilter === 'landscape' ? 'var(--accent)' : undefined,
            boxShadow: activeFilter === 'landscape' ? '0 0 15px var(--accent-glow)' : undefined,
          }}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Long Form & Ads (16:9)</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeFilter === 'landscape' ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {longVideos.length}
          </span>
        </button>

        <button
          onClick={() => setActiveFilter('reels')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all focus:outline-none cursor-pointer ${
            activeFilter === 'reels'
              ? 'border-white text-black font-bold shadow-lg'
              : 'border-white/10 glass-panel text-neutral-400 hover:text-white hover:border-white/20'
          }`}
          style={{
            backgroundColor: activeFilter === 'reels' ? 'var(--accent)' : undefined,
            boxShadow: activeFilter === 'reels' ? '0 0 15px var(--accent-glow)' : undefined,
          }}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Reels & Shorts (9:16)</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              activeFilter === 'reels' ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'
            }`}
          >
            {shortVideos.length}
          </span>
        </button>

        {/* Dynamic Category Slugs if any */}
        {categories
          .filter((c) => c.slug !== 'all' && c.slug !== 'shorts')
          .map((cat) => {
            const count = videos.filter((v) => v.category === cat.slug).length;
            if (count === 0) return null;
            const isActive = activeFilter === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.slug)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all focus:outline-none cursor-pointer ${
                  isActive
                    ? 'border-white text-black font-bold shadow-lg'
                    : 'border-white/10 glass-panel text-neutral-400 hover:text-white hover:border-white/20'
                }`}
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : undefined,
                  boxShadow: isActive ? '0 0 15px var(--accent-glow)' : undefined,
                }}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-black/20 text-black' : 'bg-white/10 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
      </div>

      {/* 1. LONG VIDEOS SECTION (16:9 Widescreen on Top) */}
      {visibleLongVideos.length > 0 && (
        <div className="mb-14">
          <div className="flex items-center gap-2.5 mb-5 pb-2 border-b border-white/10">
            <Tv className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight">
              Long Form & Commercial Edits (16:9)
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              ({visibleLongVideos.length} videos)
            </span>
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {visibleLongVideos.map((video) => (
                <motion.div
                  layout
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openVideoModal(video)}
                  className="group relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-950 transition-all duration-300 hover:border-white/30 hover:shadow-cyan-500/10 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Clean 16:9 Aspect Video Container - ZERO BLACK BARS */}
                  <div className="relative w-full aspect-video overflow-hidden bg-black">
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                      }
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Subtle Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />

                    {/* Centered Modern Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-13 h-13 sm:w-15 sm:h-15 rounded-full flex items-center justify-center border-2 border-white/40 group-hover:border-white transition-all duration-300 group-hover:scale-110 shadow-2xl backdrop-blur-md bg-black/50 group-hover:bg-black/75"
                        style={{
                          boxShadow: '0 0 25px rgba(0,0,0,0.8)',
                        }}
                      >
                        <Play className="w-6 h-6 ml-1 fill-white text-white transition-transform group-hover:scale-105" />
                      </div>
                    </div>

                    {/* Featured / Pin Badge */}
                    {video.isFeatured && (
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-black shadow-md flex items-center gap-1"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* 2. REELS & SHORTS SECTION (9:16 Vertical Smartphone Reels Below) */}
      {visibleShortVideos.length > 0 && (
        <div>
          <div className="flex items-center gap-2.5 mb-5 pb-2 border-b border-white/10">
            <Smartphone className="w-4 h-4 text-rose-400" />
            <h3 className="font-heading font-bold text-lg sm:text-xl text-white tracking-tight">
              Reels & Vertical Shorts (9:16)
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              ({visibleShortVideos.length} reels)
            </span>
          </div>

          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence>
              {visibleShortVideos.map((video) => (
                <motion.div
                  layout
                  key={video.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => openVideoModal(video)}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-950 transition-all duration-300 hover:border-white/30 hover:shadow-cyan-500/10 hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Clean 9:16 Aspect Reel Container */}
                  <div className="relative w-full aspect-[9/16] overflow-hidden bg-black">
                    <img
                      src={
                        video.thumbnail ||
                        `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
                      }
                      alt={video.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Vignette Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                    {/* Centered Modern Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center border-2 border-white/40 group-hover:border-white transition-all duration-300 group-hover:scale-110 shadow-2xl backdrop-blur-md bg-black/50 group-hover:bg-black/75"
                        style={{
                          boxShadow: '0 0 25px rgba(0,0,0,0.8)',
                        }}
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-white text-white transition-transform group-hover:scale-105" />
                      </div>
                    </div>

                    {/* Featured / Pin Badge */}
                    {video.isFeatured && (
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <span
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider text-black shadow-md flex items-center gap-1"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {visibleLongVideos.length === 0 && visibleShortVideos.length === 0 && (
        <div className="text-center py-16 glass-panel rounded-3xl border border-white/10 max-w-sm mx-auto">
          <Filter className="w-10 h-10 text-neutral-500 mx-auto mb-2" />
          <h4 className="font-heading font-bold text-white text-sm">No Videos In This Category</h4>
          <p className="text-xs text-neutral-400 mt-1">Try selecting another filter above.</p>
          <button
            onClick={() => setActiveFilter('all')}
            className="mt-4 px-4 py-1.5 rounded-xl text-xs font-semibold bg-white/10 text-white hover:bg-white/20 cursor-pointer"
          >
            Show All Videos
          </button>
        </div>
      )}
    </section>
  );
};
