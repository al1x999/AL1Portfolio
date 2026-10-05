import React, { useState } from 'react';
import {
  Star,
  Quote,
  Plus,
  CheckCircle2,
  X,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export const ReviewSection: React.FC = () => {
  const { reviews, addReview } = usePortfolio();
  const [modalOpen, setModalOpen] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Review Form state
  const [form, setForm] = useState({
    clientName: '',
    clientRole: '',
    rating: 5,
    text: '',
    projectReference: '',
    clientPhoto: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientName.trim() || !form.text.trim()) return;

    addReview({
      clientName: form.clientName,
      clientRole: form.clientRole || 'Verified Client',
      rating: form.rating,
      text: form.text,
      projectReference: form.projectReference || 'Custom Video Edit',
      clientPhoto:
        form.clientPhoto ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      date: 'Just Now',
    });

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setModalOpen(false);
      setForm({
        clientName: '',
        clientRole: '',
        rating: 5,
        text: '',
        projectReference: '',
        clientPhoto: '',
      });
    }, 1500);
  };

  return (
    <section id="reviews" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative z-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-10 gap-4 text-center sm:text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Client Feedback & Testimonials</span>
          </div>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight">
            What Clients Say About AL1 Studio
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
            Real feedback from YouTube creators, commercial brands, and esports teams.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0"
          style={{
            backgroundColor: 'var(--accent)',
            boxShadow: '0 0 15px var(--accent-glow)',
          }}
        >
          <Plus className="w-4 h-4" />
          <span>Leave Feedback</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between relative overflow-hidden shadow-xl"
          >
            <Quote
              className="absolute right-4 bottom-4 w-20 h-20 opacity-5 pointer-events-none"
              style={{ color: 'var(--accent)' }}
            />

            <div>
              {/* Stars & Project Ref */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 truncate max-w-[140px]">
                  {rev.projectReference}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed italic">
                "{rev.text}"
              </p>
            </div>

            {/* Author Footer */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/15 shrink-0 bg-neutral-900">
                <img
                  src={rev.clientPhoto}
                  alt={rev.clientName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left overflow-hidden">
                <h4 className="font-heading font-bold text-xs sm:text-sm text-white truncate">
                  {rev.clientName}
                </h4>
                <p className="text-[11px] text-neutral-400 truncate">{rev.clientRole}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Leave Review Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setModalOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative z-10 w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/15 bg-neutral-950 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  Submit Client Feedback
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="py-8 text-center flex flex-col items-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-2 animate-bounce" />
                  <h4 className="font-heading font-bold text-lg text-white">
                    Thank You For Your Review!
                  </h4>
                  <p className="text-xs text-neutral-400 mt-1">
                    Your feedback has been added directly to AL1 Studio reviews.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">
                        Your Name / Channel *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.clientName}
                        onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                        placeholder="Marcus / TechVibe"
                        className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">
                        Role or Subscriber Count
                      </label>
                      <input
                        type="text"
                        value={form.clientRole}
                        onChange={(e) => setForm({ ...form, clientRole: e.target.value })}
                        placeholder="Creator (1.2M Subs)"
                        className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">
                        Project Reference
                      </label>
                      <input
                        type="text"
                        value={form.projectReference}
                        onChange={(e) => setForm({ ...form, projectReference: e.target.value })}
                        placeholder="Commercial / Viral Short"
                        className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-400 font-semibold mb-1">
                        Star Rating (1 - 5)
                      </label>
                      <select
                        value={form.rating}
                        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-white focus:outline-none"
                      >
                        <option value={5}>★★★★★ (5 Stars - Outstanding)</option>
                        <option value={4}>★★★★☆ (4 Stars - Great)</option>
                        <option value={3}>★★★☆☆ (3 Stars - Good)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">
                      Client Avatar / Photo URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={form.clientPhoto}
                      onChange={(e) => setForm({ ...form, clientPhoto: e.target.value })}
                      placeholder="https://... (defaults to verified avatar)"
                      className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-semibold mb-1">
                      Review / Feedback *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={form.text}
                      onChange={(e) => setForm({ ...form, text: e.target.value })}
                      placeholder="Describe the editing quality, retention improvements, communication..."
                      className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="px-4 py-2 rounded-xl border border-white/10 text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-black font-bold uppercase tracking-wider text-xs shadow-lg"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      Submit Review
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
