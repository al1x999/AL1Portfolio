import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Mail,
  Globe,
  Link as LinkIcon,
  ShieldCheck,
  Sparkles,
  Zap,
  Award,
  Video,
  Clock,
  Edit3,
  User,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import type { HubLink, LinkIconType } from '../types/portfolio';
import { sanitizeUrl } from '../utils/security';

interface AboutSectionProps {
  onOpenAdmin?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenAdmin }) => {
  const { brand, links, isAdmin } = usePortfolio();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeLinks = links
    .filter((l) => l.isActive)
    .sort((a, b) => a.order - b.order);

  const renderIcon = (icon: LinkIconType, color?: string) => {
    switch (icon) {
      case 'youtube':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#ef4444' }}>
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'tiktok':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#f43f5e' }}>
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.97-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#10b981' }}>
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#ec4899' }}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#3b82f6' }}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'discord':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#5865F2' }}>
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        );
      case 'telegram':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#229ED9' }}>
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.197 1.006.128.832.942z"/>
          </svg>
        );
      case 'twitter':
      case 'x':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#ffffff' }}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case 'twitch':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#9146FF' }}>
            <path d="M2.149 0L.537 4.119v16.108h5.053V24h3.766l3.764-3.773h4.536l6.805-6.804V0H2.149zm19.866 12.448l-3.535 3.536h-4.887l-3.266 3.266v-3.266H5.973V2.149h16.042v10.299zm-4.63-6.942h-2.176v6.273h2.176V5.506zm-5.447 0H9.762v6.273h2.176V5.506z"/>
          </svg>
        );
      case 'spotify':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#1ED760' }}>
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        );
      case 'github':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#f0f6fc' }}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        );
      case 'steam':
        return (
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" style={{ color: color || '#66c0f4' }}>
            <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.005.105.005.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.733L.437 15.27C1.862 20.303 6.491 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12z"/>
          </svg>
        );
      case 'mail':
        return <Mail className="w-5 h-5" style={{ color: color || '#06b6d4' }} />;
      case 'link':
        return <LinkIcon className="w-5 h-5" style={{ color: color || 'var(--accent)' }} />;
      default:
        return <Globe className="w-5 h-5" style={{ color: color || 'var(--accent)' }} />;
    }
  };

  const handleCopy = (e: React.MouseEvent, link: HubLink) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopiedId(link.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-12 gap-4 text-center sm:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel border border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3 shadow-md">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>About Creator & Connect</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            About AL1 Studio & Official Links
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-2 max-w-xl">
            Get to know the post-production workflow, creator vision, and connect across all official communication channels.
          </p>
        </div>

        {/* Admin Manage Links Button */}
        {isAdmin && onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2.5 rounded-xl text-black font-bold uppercase tracking-wider text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            style={{
              backgroundColor: 'var(--accent)',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
            title="Open Admin to Manage Links"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Manage Social Links (Admin)</span>
          </button>
        )}
      </div>

      {/* 1. About Studio & Creator Showcase Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden mb-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Creator Profile & Identity */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="relative shrink-0">
              <div
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-black border-2 shadow-2xl flex items-center justify-center p-0"
                style={{
                  borderColor: 'var(--accent)',
                  boxShadow: '0 0 30px var(--accent-glow)',
                }}
              >
                <img
                  src="/logo.png"
                  alt="AL1 Studio"
                  className="w-full h-full object-cover scale-125"
                />
              </div>
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black animate-pulse"
                style={{ backgroundColor: 'var(--accent)' }}
                title="Active & Available"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h3 className="font-heading font-black text-2xl sm:text-3xl text-white">
                  {brand.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <ShieldCheck className="w-3 h-3 fill-current" />
                  <span>Verified Studio</span>
                </span>
              </div>

              <p
                className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-3"
                style={{ color: 'var(--accent)' }}
              >
                {brand.tagline}
              </p>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal max-w-xl">
                {brand.bio}
              </p>

              {/* Status Badge */}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[11px] text-neutral-200">{brand.statusText}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Workflow Pillars */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-cyan-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-heading font-black text-white flex items-center justify-center gap-1">
                <span>5+</span>
                <Clock className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                Years Experience
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-emerald-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-heading font-black text-white flex items-center justify-center gap-1">
                <span>500+</span>
                <Video className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                Completed Videos
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-purple-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-heading font-black text-white flex items-center justify-center gap-1">
                <span>15M+</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                Views Generated
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center hover:border-amber-500/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-heading font-black text-white flex items-center justify-center gap-1">
                <span>100%</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-[11px] font-mono text-neutral-400 mt-1 uppercase tracking-wider">
                Halal Compliance
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Official Social Links & Connect Channels Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-heading font-bold text-lg sm:text-xl text-white">
              Official Social Channels & Direct Work Links
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
            Click to visit or copy link
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {activeLinks.map((link, idx) => {
            const accent = link.accentColor || '#06b6d4';

            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group relative p-4.5 rounded-2xl glass-card border border-white/10 hover:border-white/25 flex flex-col justify-between shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                style={{
                  borderLeft: `4px solid ${accent}`,
                }}
              >
                {/* Ambient Corner Glow on Hover */}
                <div
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-15 pointer-events-none transition-opacity duration-300 group-hover:opacity-35"
                  style={{ backgroundColor: accent }}
                />

                <div className="relative z-10">
                  {/* Top Row: Icon + Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm transition-transform duration-300 group-hover:scale-110 shrink-0"
                      style={{
                        backgroundColor: `${accent}15`,
                        borderColor: `${accent}40`,
                      }}
                    >
                      {renderIcon(link.icon, accent)}
                    </div>

                    {link.badge && (
                      <span
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider"
                        style={{
                          backgroundColor: `${accent}15`,
                          borderColor: `${accent}40`,
                          color: accent,
                        }}
                      >
                        {link.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors">
                    {link.title}
                  </h4>
                  {link.subtitle && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      {link.subtitle}
                    </p>
                  )}
                </div>

                {/* Bottom Action Buttons: Open Link + Copy Link */}
                <div className="relative z-10 mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <a
                    href={sanitizeUrl(link.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline transition-all"
                    style={{ color: accent }}
                  >
                    <span>Visit Channel</span>
                    <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  <button
                    onClick={(e) => handleCopy(e, link)}
                    className="p-1.5 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all text-[11px] font-mono flex items-center gap-1 cursor-pointer"
                    title="Copy Link URL"
                  >
                    {copiedId === link.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
