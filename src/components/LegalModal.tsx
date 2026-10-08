import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ShieldCheck,
  Lock,
  Scale,
  CheckCircle2,
  Database,
  Server,
  UserCheck,
  FileCheck,
  ExternalLink,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export type LegalTab = 'terms' | 'privacy' | 'security';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTab;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'terms',
}) => {
  const [activeTab, setActiveTab] = useState<LegalTab>(initialTab);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Lock background scrolling while modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialTab]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
        style={{ minHeight: '100vh', width: '100vw' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl bg-neutral-900/95 border-2 border-white/20 rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-5 sm:p-8 text-left my-auto flex flex-col max-h-[90vh]"
          style={{
            boxShadow: '0 0 50px rgba(6, 182, 212, 0.15), 0 25px 60px rgba(0, 0, 0, 0.95)',
          }}
        >
          {/* Top Decorative Glow Line */}
          <div
            className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80"
          />

          {/* Header Bar */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10 shrink-0 gap-3">
            <div className="flex items-center gap-3.5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-xl bg-black p-0.5 shrink-0"
                style={{
                  borderColor: 'var(--accent)',
                  boxShadow: '0 0 25px var(--accent-glow)',
                }}
              >
                <img
                  src="/logo.png"
                  alt="AL1"
                  className="w-full h-full object-cover scale-125"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading font-black text-lg sm:text-2xl text-white tracking-tight">
                    AL1 Brand & Legal Terms
                  </h3>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Official 2026
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5 font-medium">
                  Official Brand: <span className="text-white font-bold">AL1</span> (এ এল ওয়ান / AL ONE) &bull; All Rights Reserved
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer border border-white/10 hover:scale-105 active:scale-95"
              title="Close modal (Esc)"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Prominent Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4 pb-3 border-b border-white/10 shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('terms')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'terms'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(251,191,36,0.25)] scale-[1.02]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Terms of Service (কাজের নীতিমালা)</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.25)] scale-[1.02]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Privacy Policy (গোপনীয়তা রক্ষা)</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'security'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-[1.02]'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security (নিরাপত্তা)</span>
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="mt-4 overflow-y-auto pr-2 space-y-6 text-xs sm:text-sm text-neutral-300 leading-relaxed flex-1">
            {/* TAB 1: TERMS OF SERVICE */}
            {activeTab === 'terms' && (
              <div className="space-y-5 animate-fade-in">
                {/* Visual Highlight Card */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-start gap-3.5 shadow-lg">
                  <Scale className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-extrabold text-amber-300 text-sm sm:text-base">
                      ব্র্যান্ড স্বত্বাধিকার ও ব্যবহারের আইনি নীতিমালা (Official Terms of Service)
                    </h4>
                    <p className="text-xs text-amber-100/90 mt-1 leading-relaxed">
                      "AL1" ব্র্যান্ডের অধীনে তৈরি সমস্ত পোর্টফোলিও কাজ, ভিডিও এডিটিং সম্পদ, কোডবেস এবং কনটেন্ট আইনত সুরক্ষিত। কোনো অনুমতি ছাড়া অনুলিপি বা বাণিজ্যিক ব্যবহার কঠোরভাবে নিষিদ্ধ।
                    </p>
                  </div>
                </div>

                {/* Clause 1 */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 space-y-2">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center text-xs font-mono font-bold">1</span>
                    <span>Brand Ownership & Intellectual Property (ব্র্যান্ড ও মেধা স্বত্ব)</span>
                  </h4>
                  <p className="text-neutral-300 text-xs sm:text-sm pl-8">
                    The trade brand name <strong>"AL1"</strong> (also operating under the official regional identity <strong>"এ এল ওয়ান"</strong> / <strong>AL ONE</strong>), all visual trademarks, logos, custom software code, UI/UX designs, animations, video post-production edits, color grading LUTs, and sound design works showcased across this website belong exclusively to <strong>AL1</strong>. All creative assets are protected under international copyright and intellectual property laws.
                  </p>
                </div>

                {/* Clause 2 */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 space-y-2.5">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-red-400/20 text-red-300 flex items-center justify-center text-xs font-mono font-bold">2</span>
                    <span>Strict Prohibitions (কঠোর নিষেধাজ্ঞা)</span>
                  </h4>
                  <div className="pl-8 space-y-2 text-xs sm:text-sm">
                    <p className="text-neutral-300">
                      You are strictly prohibited from performing any of the following unauthorized activities without prior written authorization:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 rounded-xl bg-black/40 border border-red-500/20 space-y-1">
                        <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5 text-red-400" />
                          <span>No Unauthorized Copying</span>
                        </span>
                        <p className="text-[11px] text-neutral-400">
                          Re-uploading, mirroring, reproducing, or commercially redistributing AL1 video portfolio files or design elements.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-black/40 border border-red-500/20 space-y-1">
                        <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                          <X className="w-3.5 h-3.5 text-red-400" />
                          <span>No Web Scraping or AI Ingestion</span>
                        </span>
                        <p className="text-[11px] text-neutral-400">
                          Automated scraping, bot extraction, or using portfolio creative works for training artificial intelligence / generative models without license.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clause 3 */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 space-y-2">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-cyan-400/20 text-cyan-300 flex items-center justify-center text-xs font-mono font-bold">3</span>
                    <span>Site Security & Anti-Misuse Disclaimer (সাইট নিরাপত্তা বিধান)</span>
                  </h4>
                  <p className="text-neutral-300 text-xs sm:text-sm pl-8">
                    Any intentional attempts to probe server vulnerabilities, execute denial of service (DDoS) traffic floods, tamper with client-side code, or abuse communication endpoints will be logged with originating IP and referrers for cybercrime escalation. AL1 enforces strict HTTP security headers and rate limits.
                  </p>
                </div>

                {/* Clause 4 */}
                <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Islamic Ethical Standards & Halal Creative Commitment</span>
                  </h4>
                  <p className="text-neutral-300 text-xs sm:text-sm pl-7">
                    AL1 operates strictly in adherence to Islamic Shariah and ethical editing principles. All client projects avoid unethical promotions, obscene content, and deceitful marketing. (বিস্তারিত শরীয়াহ নীতিমালা ও হাদিসের দলিলসমূহ আমাদের হোমপেজের ডেডিকেটেড সেকশনে দৃশ্যমান রয়েছে)।
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="space-y-5 animate-fade-in">
                {/* Visual Privacy Card */}
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-start gap-3.5 shadow-lg">
                  <Lock className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-extrabold text-cyan-300 text-sm sm:text-base">
                      ক্লায়েন্ট গোপনীয়তা ও তথ্য সুরক্ষা নীতি (Official Privacy Policy)
                    </h4>
                    <p className="text-xs text-cyan-100/90 mt-1 leading-relaxed">
                      AL1 ক্লায়েন্টের প্রতিটি তথ্য ও মেসেজকে সর্বোচ্চ গোপনীয়তা ও আমানতের সাথে সংরক্ষণ করে। আপনার কোনো তথ্য কখনোই তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না।
                    </p>
                  </div>
                </div>

                {/* Privacy Guarantee 1 */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 space-y-2">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-cyan-400" />
                    <span>Information We Collect & Why (আমরা কী তথ্য সংরক্ষণ করি)</span>
                  </h4>
                  <p className="text-neutral-300 text-xs sm:text-sm">
                    When you communicate with <strong>AL1</strong> through our official contact form, email, or WhatsApp, we only receive the information you voluntarily submit (such as your name, business email address, project requirements, and video specifications). This information is solely used to evaluate your editing project, provide quotation estimates, and complete deliverables.
                  </p>
                </div>

                {/* Privacy Guarantee 2 */}
                <div className="p-4.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-cyan-950/40 border border-cyan-500/40 space-y-2">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-emerald-300 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Zero Data Selling & Third-Party Protection Guarantee</span>
                  </h4>
                  <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed font-medium">
                    <strong>We guarantee that AL1 NEVER sells, rents, monetizes, or transfers your contact information, email, or client conversations to data brokers, advertising networks, or third-party marketing companies.</strong> Your communications remain 100% confidential.
                  </p>
                </div>

                {/* Privacy Guarantee 3 */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 space-y-2">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-purple-400" />
                    <span>No Invasive Cookies or Tracking Pixels</span>
                  </h4>
                  <p className="text-neutral-300 text-xs sm:text-sm">
                    This portfolio does not utilize cross-site tracking cookies, Facebook/Meta pixels, or invasive behavioral telemetry. We only utilize standard browser <code>localStorage</code> strictly to persist your chosen aesthetic theme (Dark/Light mode) and audio volume preferences on your device.
                  </p>
                </div>

                {/* Privacy Guarantee 4 */}
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-white/10 space-y-2">
                  <h4 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-cyan-400" />
                    <span>Your Right to Data Deletion (তথ্য মুছে ফেলার অধিকার)</span>
                  </h4>
                  <p className="text-neutral-300 text-xs sm:text-sm">
                    You hold the unconditional right to request permanent deletion of your project records, correspondence, or email messages at any point. Simply email <a href="mailto:contact@al1studio.com" className="text-cyan-400 underline font-semibold">contact@al1studio.com</a> with your request.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: SECURITY */}
            {activeTab === 'security' && (
              <div className="space-y-5 animate-fade-in">
                {/* Visual Security Card */}
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-start gap-3.5 shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-heading font-extrabold text-emerald-300 text-sm sm:text-base">
                      আধুনিক ওয়েব নিরাপত্তা ও সুরক্ষা কাঠামো (Active Web Security Layer)
                    </h4>
                    <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                      AL1 পোর্টফোলিওতে ইন্ডাস্ট্রিয়াল-গ্রেড সিকিউরিটি হেডার্স, ইনপুট স্যানিটাইজেশন এবং রেট-লিমিটিং সক্রিয় রয়েছে যা OWASP Top 10 সাইবার আক্রমণ থেকে সাইটটিকে সুরক্ষিত রাখে।
                    </p>
                  </div>
                </div>

                {/* Grid of 4 security pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">Layer 1 &bull; Encryption</span>
                    <h5 className="font-bold text-white text-xs sm:text-sm">Strict-Transport-Security (HSTS)</h5>
                    <p className="text-[11px] text-neutral-400">
                      Enforced with <code>max-age=31536000; includeSubDomains; preload</code> ensuring 100% encrypted HTTPS transport.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">Layer 2 &bull; Code Integrity</span>
                    <h5 className="font-bold text-white text-xs sm:text-sm">Content-Security-Policy (CSP)</h5>
                    <p className="text-[11px] text-neutral-400">
                      Strict whitelisting of origin resources, stopping unauthorized inline scripts, XSS injections, and data exfiltration.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">Layer 3 &bull; Clickjacking Defense</span>
                    <h5 className="font-bold text-white text-xs sm:text-sm">X-Frame-Options: SAMEORIGIN</h5>
                    <p className="text-[11px] text-neutral-400">
                      Blocks third-party websites from embedding this portfolio inside malicious hidden iframes.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/50 border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">Layer 4 &bull; Anti-Abuse</span>
                    <h5 className="font-bold text-white text-xs sm:text-sm">Rate Limiting & Anti-Brute Force</h5>
                    <p className="text-[11px] text-neutral-400">
                      Sliding-window IP rate limiting blocks DDoS attacks, spam bots, and admin brute-force PIN attempts.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/60 border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-neutral-300">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <span>Responsible Security Disclosure:</span>
                  </div>
                  <a
                    href="mailto:security@al1studio.com"
                    className="text-cyan-400 font-mono hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>security@al1studio.com</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Bar */}
          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] font-mono text-neutral-400 text-center sm:text-left">
              &copy; 2026 <strong className="text-white">AL1</strong>. All rights reserved.
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-black font-extrabold text-xs uppercase tracking-wider shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer text-center"
                style={{
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 0 20px var(--accent-glow)',
                }}
              >
                I Understand & Agree (সম্মতি জানাচ্ছি)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
