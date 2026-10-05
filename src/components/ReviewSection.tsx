import React from 'react';
import {
  Star,
  Quote,
  ShieldCheck,
  Edit3,
  Calendar,
  Sparkles,
  Clapperboard,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

interface ReviewSectionProps {
  onOpenAdmin?: () => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({ onOpenAdmin }) => {
  const { reviews, isAdmin } = usePortfolio();

  // Sort reviews by order
  const sortedReviews = [...reviews].sort((a, b) => a.order - b.order);

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-20">
      {/* Atmosphere Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-12 gap-4 text-center sm:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3 shadow-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Client Feedback & Testimonials</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            What Clients Say About AL1 Studio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl">
            Verified feedback from YouTube creators, commercial brands, and esports organizations.
          </p>
        </div>

        {/* Admin Manage Reviews Button - ONLY visible when logged in as Admin */}
        {isAdmin && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2.5 rounded-xl text-black font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            style={{
              backgroundColor: 'var(--accent)',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
            title="Open Admin to Add or Edit Reviews"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage Reviews (Admin)</span>
          </button>
        )}
      </div>

      {/* Modern High-End Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {sortedReviews.map((rev, idx) => {
          const accent = rev.accentColor || '#06b6d4';

          return (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="group relative rounded-3xl p-6 sm:p-7 glass-card border border-white/10 flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-white/25"
              style={{
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.01) 100%)',
              }}
            >
              {/* Subtle Ambient Radial Glow on Hover */}
              <div
                className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                style={{ backgroundColor: accent }}
              />

              {/* Decorative Giant Quote Watermark */}
              <Quote
                className="absolute right-5 bottom-4 w-24 h-24 opacity-5 pointer-events-none transition-transform duration-300 group-hover:scale-110 group-hover:opacity-10"
                style={{ color: accent }}
              />

              <div className="relative z-10">
                {/* Top Row: Client Profile & Platform Badge */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    {/* Client Avatar with Accent Ring */}
                    <div className="relative shrink-0">
                      <div
                        className="w-12 h-12 rounded-2xl overflow-hidden p-0.5 border shadow-md bg-neutral-900"
                        style={{ borderColor: `${accent}60` }}
                      >
                        <img
                          src={rev.clientPhoto}
                          alt={rev.clientName}
                          className="w-full h-full object-cover rounded-xl"
                          onError={(e) => {
                            // Fallback to high quality avatar if broken url
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                          }}
                        />
                      </div>

                      {/* Verified Badge Checkmark */}
                      {rev.isVerified !== false && (
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 border-2 border-neutral-950 flex items-center justify-center text-black shadow-sm"
                          title="Verified Client"
                        >
                          <ShieldCheck className="w-2.5 h-2.5 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Name & Role */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-heading font-extrabold text-sm sm:text-base text-white truncate">
                          {rev.clientName}
                        </h4>
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate max-w-[150px] sm:max-w-[170px]">
                        {rev.clientRole}
                      </p>
                    </div>
                  </div>

                  {/* Platform Badge */}
                  {rev.platformBadge && (
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold border shrink-0 tracking-wide"
                      style={{
                        backgroundColor: `${accent}15`,
                        borderColor: `${accent}40`,
                        color: accent,
                      }}
                    >
                      {rev.platformBadge}
                    </span>
                  )}
                </div>

                {/* Rating Stars & Project Reference Tag */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-neutral-700'
                        }`}
                        style={{
                          filter: i < rev.rating ? 'drop-shadow(0 0 3px rgba(245, 158, 11, 0.4))' : undefined,
                        }}
                      />
                    ))}
                  </div>

                  {/* Project Reference Pill */}
                  {rev.projectReference && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-neutral-300 truncate max-w-[170px]">
                      <Clapperboard className="w-2.5 h-2.5 text-neutral-400" />
                      <span>{rev.projectReference}</span>
                    </span>
                  )}
                </div>

                {/* Testimonial Quote */}
                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
                  "{rev.text}"
                </p>
              </div>

              {/* Bottom Card Footer: Date / Verified Tag */}
              <div className="relative z-10 mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{rev.date || 'Verified Review'}</span>
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400/90 font-medium">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>100% Retained</span>
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
