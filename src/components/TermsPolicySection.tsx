import React, { useState, useEffect } from 'react';
import {
  Info,
  ExternalLink,
  MessageCircle,
  Edit3,
  ShieldCheck,
  Play,
  X,
  BookOpen,
  Sparkles,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import {
  type PolicyRule,
  type PinColor,
  getPolicyHadiths,
  getPolicyYouTubeUrls,
} from '../types/portfolio';
import { extractYouTubeId } from '../utils/youtube';

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

interface TermsPolicySectionProps {
  onOpenAdmin?: () => void;
}

export const TermsPolicySection: React.FC<TermsPolicySectionProps> = ({ onOpenAdmin }) => {
  const { policyRules, policyNotice, isAdmin, pauseBackgroundMusic, resumeBackgroundMusic } = usePortfolio();
  const [activeDetailRule, setActiveDetailRule] = useState<PolicyRule | null>(null);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);

  // Pause background music while reference videos are active, resume on close
  const isAnyPolicyVideoActive = Boolean(
    videoModalUrl || (activeDetailRule && getPolicyYouTubeUrls(activeDetailRule).length > 0)
  );

  useEffect(() => {
    if (isAnyPolicyVideoActive) {
      pauseBackgroundMusic();
      return () => {
        resumeBackgroundMusic();
      };
    }
  }, [isAnyPolicyVideoActive, pauseBackgroundMusic, resumeBackgroundMusic]);

  // Sorted rules
  const sortedRules = [...policyRules].sort((a, b) => a.order - b.order);

  // Pin styling generator
  const getPinDetails = (color?: PinColor) => {
    switch (color) {
      case 'red':
        return {
          head: 'bg-red-500 shadow-red-500/50',
          ring: 'border-red-300',
          numberColor: 'text-red-500',
          badgeBg: 'bg-red-500/10 text-red-500 border-red-500/30',
          bgLight: 'bg-gradient-to-b from-[#fff7f2] to-[#ffede1] text-neutral-800 border-red-200/60',
          bgDark: 'dark:from-red-950/40 dark:to-neutral-900/90 dark:text-neutral-100 dark:border-red-500/20',
          accent: '#ef4444',
        };
      case 'blue':
        return {
          head: 'bg-blue-600 shadow-blue-500/50',
          ring: 'border-blue-300',
          numberColor: 'text-blue-600 dark:text-blue-400',
          badgeBg: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
          bgLight: 'bg-gradient-to-b from-[#f2f7ff] to-[#e6f0ff] text-neutral-800 border-blue-200/60',
          bgDark: 'dark:from-blue-950/40 dark:to-neutral-900/90 dark:text-neutral-100 dark:border-blue-500/20',
          accent: '#3b82f6',
        };
      case 'purple':
        return {
          head: 'bg-purple-600 shadow-purple-500/50',
          ring: 'border-purple-300',
          numberColor: 'text-purple-600 dark:text-purple-400',
          badgeBg: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
          bgLight: 'bg-gradient-to-b from-[#f9f4ff] to-[#f0e4ff] text-neutral-800 border-purple-200/60',
          bgDark: 'dark:from-purple-950/40 dark:to-neutral-900/90 dark:text-neutral-100 dark:border-purple-500/20',
          accent: '#a855f7',
        };
      case 'orange':
        return {
          head: 'bg-orange-500 shadow-orange-500/50',
          ring: 'border-orange-300',
          numberColor: 'text-orange-500 dark:text-orange-400',
          badgeBg: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
          bgLight: 'bg-gradient-to-b from-[#fff6ed] to-[#ffecd9] text-neutral-800 border-orange-200/60',
          bgDark: 'dark:from-orange-950/40 dark:to-neutral-900/90 dark:text-neutral-100 dark:border-orange-500/20',
          accent: '#f97316',
        };
      case 'cyan':
        return {
          head: 'bg-cyan-500 shadow-cyan-500/50',
          ring: 'border-cyan-300',
          numberColor: 'text-cyan-600 dark:text-cyan-400',
          badgeBg: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30',
          bgLight: 'bg-gradient-to-b from-[#f0fbff] to-[#ddf5ff] text-neutral-800 border-cyan-200/60',
          bgDark: 'dark:from-cyan-950/40 dark:to-neutral-900/90 dark:text-neutral-100 dark:border-cyan-500/20',
          accent: '#06b6d4',
        };
      case 'emerald':
      default:
        return {
          head: 'bg-emerald-500 shadow-emerald-500/50',
          ring: 'border-emerald-300',
          numberColor: 'text-emerald-600 dark:text-emerald-400',
          badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
          bgLight: 'bg-gradient-to-b from-[#f0fdf4] to-[#dcfce7] text-neutral-800 border-emerald-200/60',
          bgDark: 'dark:from-emerald-950/40 dark:to-neutral-900/90 dark:text-neutral-100 dark:border-emerald-500/20',
          accent: '#10b981',
        };
    }
  };

  return (
    <section id="policy" className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      {/* Atmosphere Header */}
      <div className="text-center mb-12">
        {/* Centered AL1 Studio Logo with Black Background & Zoom */}
        <div className="inline-flex flex-col items-center mb-4">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-black overflow-hidden shadow-2xl border-2 flex items-center justify-center hover:scale-105 transition-transform"
            style={{
              borderColor: 'var(--accent)',
              boxShadow: '0 0 25px var(--accent-glow)',
            }}
          >
            <img
              src="/logo.png"
              alt="AL1 Studio Logo"
              className="w-full h-full object-cover scale-125"
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-semibold text-neutral-300 mb-3 shadow-md">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>শরীয়াহ ও কাজের নীতিমালা</span>
        </div>

        <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
          Terms of Service কাজের নীতিমালা
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-2.5 max-w-xl mx-auto leading-relaxed">
          হালাল উপার্জনের লক্ষ্যে ও ইসলামিক অনুশাসন মেনে প্রতিটি ভিডিও সম্পাদনা করা হয়। বিস্তারিত হাদিস ও দিকনির্দেশনা জানতে যেকোনো নীতিমালায় ক্লিক করুন।
        </p>

        {isAdmin && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="mt-4 px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold inline-flex items-center gap-1.5 transition-all"
          >
            <Edit3 className="w-3 h-3" />
            <span>নীতিমালা ও হাদিস কাস্টমাইজ করুন (Admin)</span>
          </button>
        )}
      </div>

      {/* Grid of Pinned Note Cards */}
      <div className="relative">
        {/* Subtle decorative curved dotted line for large screens */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 900 600" fill="none">
            <path
              d="M 150,130 C 450,150 450,220 750,230 C 750,380 450,360 150,450 C 450,480 500,520 750,530"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 6"
              className="text-neutral-400"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8 relative z-10">
          {sortedRules.map((rule, idx) => {
            const pin = getPinDetails(rule.pinColor);
            const hadiths = getPolicyHadiths(rule);
            const videos = getPolicyYouTubeUrls(rule);

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                onClick={() => setActiveDetailRule(rule)}
                className={`group relative rounded-3xl p-6 sm:p-7 shadow-xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer ${pin.bgLight} ${pin.bgDark}`}
                style={{
                  boxShadow: '0 10px 30px -10px rgba(0,0,0,0.15), 0 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                {/* 3D Pushpin at Top Center */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
                  <div
                    className={`w-6 h-6 rounded-full border-2 ${pin.ring} ${pin.head} shadow-md flex items-center justify-center relative`}
                  >
                    <div className="w-2 h-2 rounded-full bg-white/60 absolute top-1 left-1" />
                  </div>
                  <div className="w-3 h-1 bg-black/30 rounded-full blur-[1px] mt-0.5" />
                </div>

                {/* Card Header: Rule Number & Details Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono font-black text-xl sm:text-2xl ${pin.numberColor}`}>
                    {rule.ruleNumber || `0${idx + 1}`}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {hadiths.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{hadiths.length > 1 ? `${hadiths.length}টি দলিল` : 'হাদিস দলিল'}</span>
                      </span>
                    )}
                    {videos.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1">
                        <YouTubeIcon className="w-3 h-3 text-red-500" />
                        <span>{videos.length > 1 ? `${videos.length}টি ভিডিও` : 'ভিডিও'}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-neutral-900 dark:text-white mb-2 leading-snug group-hover:text-cyan-400 transition-colors">
                  {rule.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                  {rule.description}
                </p>

                {/* Hadith / Quran Preview Pill if exists */}
                {hadiths.length > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 text-[11px] text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 italic leading-relaxed">
                        "{hadiths[0]}"
                      </p>
                      {hadiths.length > 1 && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
                          + আরও {hadiths.length - 1}টি হাদিস/দলিল রয়েছে
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Bottom Interactive Bar */}
                <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 group-hover:text-cyan-400 transition-colors">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>বিস্তারিত ও দলিল দেখতে ক্লিক করুন</span>
                  </span>

                  {videos.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoModalUrl(videos[0]);
                      }}
                      className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{videos.length > 1 ? `${videos.length}টি ভিডিও` : 'ভিডিও'}</span>
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Information Notice Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-10 rounded-2xl p-4 sm:p-5 border border-orange-500/40 bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-orange-500/15 backdrop-blur-md flex flex-col sm:flex-row sm:items-center gap-4 shadow-xl"
      >
        <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0 text-orange-400 shadow-md">
          <Info className="w-6 h-6" />
        </div>

        <div className="flex-1">
          <h4 className="font-heading font-bold text-white text-sm sm:text-base flex items-center gap-2">
            বিস্তারিত জানার জন্য
          </h4>
          <p className="text-xs sm:text-sm text-neutral-300 mt-0.5 leading-relaxed">
            {policyNotice}
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <a
            href="https://wa.me/15557893210?text=Hi%20AL1%20Studio!%20I%20have%20questions%20regarding%20the%20working%20policy."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>সরাসরি ইনবক্স করুন</span>
          </a>
        </div>
      </motion.div>

      {/* Interactive Comprehensive Hadith & Islamic Ruling Details Modal */}
      <AnimatePresence>
        {activeDetailRule && (() => {
          const modalHadiths = getPolicyHadiths(activeDetailRule);
          const modalVideos = getPolicyYouTubeUrls(activeDetailRule);
          const pin = getPinDetails(activeDetailRule.pinColor);

          return (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
              onClick={() => setActiveDetailRule(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-2xl bg-neutral-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 my-8 text-left"
              >
                {/* Modal Top Bar */}
                <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-black text-lg shadow-md border"
                      style={{
                        backgroundColor: `${pin.accent}20`,
                        borderColor: pin.accent,
                        color: pin.accent,
                      }}
                    >
                      {activeDetailRule.ruleNumber}
                    </div>
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        ইসলামিক শরীয়াহ ও কাজের নীতিমালা
                      </span>
                      <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
                        {activeDetailRule.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveDetailRule(null)}
                    className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Scrollable Body */}
                <div className="mt-5 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
                  {/* 1. Core Rule Summary */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>নীতিমালা সংক্ষিপ্ত রূপ</span>
                    </h4>
                    <p className="text-sm text-neutral-200 leading-relaxed font-medium">
                      {activeDetailRule.description}
                    </p>
                  </div>

                  {/* 2. Hadith / Quranic Proof Callout (One below another) */}
                  {modalHadiths.length > 0 && (
                    <div className="space-y-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                        <span>হাদিস ও কুরআন শরীফের দলিল {modalHadiths.length > 1 ? `(${modalHadiths.length}টি)` : ''}</span>
                      </div>

                      <div className="space-y-3">
                        {modalHadiths.map((hText, hIdx) => (
                          <div
                            key={hIdx}
                            className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-emerald-950/30 border border-emerald-500/40 relative overflow-hidden"
                          >
                            <div className="absolute top-0 right-0 p-3 opacity-15 pointer-events-none">
                              <BookOpen className="w-16 h-16 text-emerald-400" />
                            </div>
                            <div className="relative z-10">
                              {modalHadiths.length > 1 && (
                                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full mb-2">
                                  <BookOpen className="w-2.5 h-2.5" />
                                  <span>দলিল #{hIdx + 1}</span>
                                </div>
                              )}
                              <p className="text-xs sm:text-sm text-emerald-100 font-serif leading-relaxed italic border-l-2 border-emerald-400 pl-3 whitespace-pre-line">
                                "{hText}"
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 3. Detailed Islamic Explanation (কেন হারাম ও বিস্তারিত বিধান) */}
                  {activeDetailRule.detailedExplanation && (
                    <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950/60 border border-white/10">
                      <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span>কেন হারাম ও বিস্তারিত শরীয়াহ বিধান</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal whitespace-pre-line">
                        {activeDetailRule.detailedExplanation}
                      </p>
                    </div>
                  )}

                  {/* 4. Embedded YouTube Reference Player(s) if available */}
                  {modalVideos.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                          <YouTubeIcon className="w-4 h-4 text-red-500" />
                          <span>ইসলামিক আলেমদের আলোচনা ও দলিল ভিডিও {modalVideos.length > 1 ? `(${modalVideos.length}টি)` : ''}</span>
                        </h4>
                      </div>

                      <div className={`grid ${modalVideos.length > 1 ? 'grid-cols-1 sm:grid-cols-2 gap-4' : 'grid-cols-1'}`}>
                        {modalVideos.map((vUrl, vIdx) => {
                          const ytId = extractYouTubeId(vUrl);
                          return (
                            <div
                              key={vIdx}
                              className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2 hover:border-white/20 transition-all"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-neutral-300 flex items-center gap-1.5">
                                  <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px] font-bold">
                                    {vIdx + 1}
                                  </span>
                                  <span>{modalVideos.length > 1 ? `রেফারেন্স আলোচনা #${vIdx + 1}` : 'রেফারেন্স আলোচনা ও দিকনির্দেশনা'}</span>
                                </span>
                                <a
                                  href={vUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                                >
                                  <span>ইউটিউবে খুলুন</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>

                              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                                <iframe
                                  src={`https://www.youtube-nocookie.com/embed/${ytId}?rel=0`}
                                  title={`${activeDetailRule.title} - Video ${vIdx + 1}`}
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="w-full h-full border-0"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer Actions */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={`https://wa.me/15557893210?text=Hi%20AL1%20Studio!%20I%20want%20to%20know%20more%20about%20policy:%20${encodeURIComponent(
                      activeDetailRule.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>সরাসরি ইনবক্স বা পরামর্শের জন্য যোগাযোগ</span>
                  </a>

                  {isAdmin && onOpenAdmin && (
                    <button
                      onClick={() => {
                        setActiveDetailRule(null);
                        onOpenAdmin();
                      }}
                      className="px-3.5 py-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>নীতিমালা এডিট করুন (Admin)</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* Standalone Video Modal */}
      <AnimatePresence>
        {videoModalUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setVideoModalUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-neutral-900 border border-white/20 rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-white">
                  <YouTubeIcon className="w-5 h-5 text-red-500 fill-current" />
                  <span className="font-bold text-sm">ইসলামিক রেফারেন্স ও দিকনির্দেশনা</span>
                </div>
                <button
                  onClick={() => setVideoModalUrl(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${extractYouTubeId(
                    videoModalUrl
                  )}?autoplay=1&rel=0&vq=hd1080`}
                  title="Policy Reference Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
                <span>শরীয়াহ সম্মত এডিটিং নিয়মাবলী রেফারেন্স</span>
                <a
                  href={videoModalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <span>ইউটিউবে খুলুন</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
