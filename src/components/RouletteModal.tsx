import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Gauge, Layers } from 'lucide-react';
import { topics, type Topic, type CategoryId, type Difficulty, difficultyMeta, categories } from '../data/topics';
import { playTickSound, playRevealChime } from '../utils/audio';
import { CatIcon } from './Icon';

interface Props {
  isOpen: boolean;
  filterCategory: CategoryId | null;
  filterDifficulty: Difficulty | null;
  onSelect: (topic: Topic) => void;
  onClose: () => void;
}

export default function RouletteModal({
  isOpen,
  filterCategory,
  filterDifficulty,
  onSelect,
  onClose,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [revealedTopic, setRevealedTopic] = useState<Topic | null>(null);

  // Available candidate pool
  const pool = useRef<Topic[]>([]);

  useEffect(() => {
    let list = topics;
    if (filterCategory) list = list.filter(t => t.category === filterCategory);
    if (filterDifficulty) list = list.filter(t => t.difficulty === filterDifficulty);
    if (list.length === 0) list = topics;
    pool.current = list;
  }, [filterCategory, filterDifficulty]);

  useEffect(() => {
    if (!isOpen) {
      setIsSpinning(false);
      setRevealedTopic(null);
      return;
    }

    // Start spin sequence
    setIsSpinning(true);
    setRevealedTopic(null);
    let step = 0;
    const totalSteps = 24;
    let delay = 45; // starts fast

    const p = pool.current.length > 0 ? pool.current : topics;
    const targetIdx = Math.floor(Math.random() * p.length);
    const chosen = p[targetIdx];

    const runStep = () => {
      step++;
      const randomDisplay = p[Math.floor(Math.random() * p.length)];
      const idx = topics.findIndex(t => t.id === randomDisplay.id);
      setCurrentIdx(idx >= 0 ? idx : 0);
      playTickSound(500 + step * 18);

      if (step < totalSteps) {
        // Slow down dynamically
        if (step > totalSteps - 10) {
          delay += 35;
        } else if (step > totalSteps - 6) {
          delay += 70;
        }
        setTimeout(runStep, delay);
      } else {
        // Final landing
        setRevealedTopic(chosen);
        setIsSpinning(false);
        playRevealChime();
      }
    };

    const timer = setTimeout(runStep, 100);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const displayItem = revealedTopic || topics[currentIdx] || topics[0];
  const cat = categories.find(c => c.id === displayItem.category);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-espresso-ink/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-amber/40 bg-gradient-to-b from-ivory via-parchment to-champagne/80 shadow-[0_25px_100px_-20px_rgba(196,162,101,0.6)] p-7 sm:p-10 text-center"
        >
          {/* Shimmering Aura Background */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-amber/30 via-champagne/40 to-transparent blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-ivory/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-amber-deep shadow-sm mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-deep animate-spin" style={{ animationDuration: '3s' }} />
              {isSpinning ? 'Consulting the Oracle…' : 'Destiny Revealed'}
            </div>

            {/* Visual Card Stage */}
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-3xl border border-ink-wash/15 bg-ivory shadow-xl mb-6 group">
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={displayItem.image}
                  alt={displayItem.imageAlt}
                  className={`w-full h-full object-cover transition-transform duration-700 ${isSpinning ? 'scale-110 blur-[1px]' : 'scale-100 blur-0'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-ink/90 via-espresso-ink/30 to-transparent" />

                {/* Category & Difficulty Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-espresso">
                    <CatIcon name={cat?.icon || 'Sparkles'} className="w-3 h-3 text-amber-deep" />
                    {cat?.label}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory shadow-sm"
                    style={{ background: difficultyMeta[displayItem.difficulty].color }}
                  >
                    <Gauge className="w-3 h-3" />
                    {difficultyMeta[displayItem.difficulty].label}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <h3 className="font-display text-2xl sm:text-3xl text-ivory leading-tight drop-shadow-md">
                    {displayItem.title}
                  </h3>
                  <p className="font-editorial italic text-amber-glow text-sm sm:text-base drop-shadow">
                    {displayItem.subtitle}
                  </p>
                </div>
              </div>

              {/* Teaser text */}
              <div className="p-4 sm:p-5 text-left bg-gradient-to-b from-ivory to-cream">
                <p className="text-xs sm:text-sm text-warm-stone line-clamp-2 leading-relaxed">
                  {displayItem.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {revealedTopic ? (
                <>
                  <button
                    onClick={() => {
                      onSelect(revealedTopic);
                      onClose();
                    }}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-3 rounded-full bg-espresso px-8 py-4 text-sm font-medium tracking-wide text-ivory shadow-xl shadow-espresso/25 hover:bg-espresso-ink hover:scale-105 active:scale-95 transition duration-300"
                  >
                    <span>Enter Deep Masterclass</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsSpinning(true);
                      setRevealedTopic(null);
                      // Trigger another spin
                      let step = 0;
                      const totalSteps = 20;
                      let delay = 50;
                      const p = pool.current.length > 0 ? pool.current : topics;
                      const targetIdx = Math.floor(Math.random() * p.length);
                      const chosen = p[targetIdx];

                      const runStep = () => {
                        step++;
                        const randomDisplay = p[Math.floor(Math.random() * p.length)];
                        const idx = topics.findIndex(t => t.id === randomDisplay.id);
                        setCurrentIdx(idx >= 0 ? idx : 0);
                        playTickSound(500 + step * 20);

                        if (step < totalSteps) {
                          if (step > totalSteps - 8) delay += 40;
                          setTimeout(runStep, delay);
                        } else {
                          setRevealedTopic(chosen);
                          setIsSpinning(false);
                          playRevealChime();
                        }
                      };
                      setTimeout(runStep, 50);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-ink-wash/25 bg-ivory px-6 py-4 text-sm font-medium text-warm-stone hover:border-amber hover:text-amber-deep transition"
                  >
                    Spin Again
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-[0.25em] text-ink-faint font-semibold animate-pulse">
                  <Layers className="w-4 h-4 text-amber-deep" />
                  Selecting optimal speaking topic…
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
