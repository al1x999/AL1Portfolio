import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  Send,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';
import {
  sanitizeText,
  sanitizeEmail,
  isValidEmail,
  RateLimiter,
} from '../utils/security';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Client-side rate limiter: max 3 attempts per 3 minutes
const clientRateLimiter = new RateLimiter(3, 180000);

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Video Editing Project',
    message: '',
    _gotcha: '', // Honeypot field
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);


  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot check: If bot filled the hidden honeypot, fake success
    if (formData._gotcha.trim()) {
      setStatus('success');
      return;
    }

    // 2. Client-side Rate Limiting
    if (!clientRateLimiter.canProceed()) {
      const waitSec = clientRateLimiter.getSecondsUntilReset();
      setErrorMessage(`Rate limit reached. Please wait ${waitSec} seconds before sending another message.`);
      setStatus('error');
      return;
    }

    // 3. Validation & Sanitization
    const cleanName = sanitizeText(formData.name, 80);
    const cleanEmail = sanitizeEmail(formData.email);
    const cleanService = sanitizeText(formData.service, 80);
    const cleanMessage = sanitizeText(formData.message, 2000);

    if (cleanName.length < 2) {
      setErrorMessage('Please enter a valid name (at least 2 characters).');
      setStatus('error');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    if (cleanMessage.length < 10) {
      setErrorMessage('Your message must be at least 10 characters long.');
      setStatus('error');
      return;
    }

    // Consume rate limit token
    clientRateLimiter.tryAcquire();
    setStatus('submitting');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          service: cleanService,
          message: cleanMessage,
        }),
      });

      if (res.ok) {
        setStatus('success');
      } else {
        const data = await res.json().catch(() => ({}));
        // If 404 or backend unavailable, open secure mailto fallback
        if (res.status === 404) {
          const mailtoUrl = `mailto:contact@al1studio.com?subject=${encodeURIComponent(
            `Inquiry: ${cleanService} from ${cleanName}`
          )}&body=${encodeURIComponent(
            `Name: ${cleanName}\nEmail: ${cleanEmail}\nService: ${cleanService}\n\nMessage:\n${cleanMessage}`
          )}`;
          window.location.href = mailtoUrl;
          setStatus('success');
          return;
        }
        setErrorMessage(data.error || 'Failed to send message. Please contact via WhatsApp or email.');
        setStatus('error');
      }
    } catch {
      // Graceful fallback to mailto if fetch encounters network error
      const mailtoUrl = `mailto:contact@al1studio.com?subject=${encodeURIComponent(
        `Inquiry: ${cleanService} from ${cleanName}`
      )}&body=${encodeURIComponent(
        `Name: ${cleanName}\nEmail: ${cleanEmail}\nService: ${cleanService}\n\nMessage:\n${cleanMessage}`
      )}`;
      window.location.href = mailtoUrl;
      setStatus('success');
    }
  };

  if (!mounted || !isOpen) return null;


  const modalContent = (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
        style={{ minHeight: '100vh', width: '100vw' }}
      >

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-neutral-950/95 border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 my-auto text-left"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center border shadow-lg bg-black p-0.5 shrink-0"
                style={{
                  borderColor: 'var(--accent)',
                  boxShadow: '0 0 15px var(--accent-glow)',
                }}
              >
                <img src="/logo.png" alt="AL1" className="w-full h-full object-cover scale-125" />
              </div>
              <div>
                <h3 className="font-heading font-black text-lg text-white">Contact AL1 Studio</h3>
                <p className="text-xs text-neutral-400">Encrypted & Rate-Protected Client Inquiry</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Privacy badge */}
          <div className="mt-4 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2 text-xs text-cyan-300">
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Strict Confidentiality &bull; Never shared with third parties</span>
          </div>

          {status === 'success' ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-lg text-white">Message Transmitted Securely</h4>
              <p className="text-xs text-neutral-300 max-w-xs mx-auto">
                Thank you! Your project inquiry has been received. AL1 will review your requirements and respond promptly.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              {/* Bot Honeypot Input (Invisible to humans) */}
              <div style={{ display: 'none' }} aria-hidden="true">
                <input
                  type="text"
                  name="_gotcha"
                  value={formData._gotcha}
                  onChange={(e) => setFormData({ ...formData, _gotcha: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Your Name / Studio
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={80}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Alex Vance or Brand Name"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    maxLength={100}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@company.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Service / Project Scope
                </label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/15 text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Long Form Commercial (16:9)">Long Form Commercial & YouTube (16:9)</option>
                  <option value="Viral Reels & TikToks (9:16)">Viral Reels, Shorts & TikToks (9:16)</option>
                  <option value="Cinematic Color Grading">Theatrical Color Grading & LUTs</option>
                  <option value="Motion Graphics & VFX">Motion Graphics & Visual Effects</option>
                  <option value="Full Retainer / Channel Editing">Monthly Retainer / Dedicated Editing</option>
                  <option value="Other Creative Collaboration">Other Creative Collaboration</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1">
                  Project Brief & Details
                </label>
                <div className="relative">
                  <textarea
                    required
                    rows={4}
                    maxLength={2000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your footage, timeline goals, references, and delivery deadlines..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-400 transition-colors resize-none"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-2.5 rounded-xl text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 0 20px var(--accent-glow)',
                }}
              >
                {status === 'submitting' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Securely...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to AL1</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

