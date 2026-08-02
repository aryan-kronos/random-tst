import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, X, ArrowRight, Gauge, RefreshCw, Dices, Undo2, Sparkles,
  PartyPopper, Star, Mic, Lightbulb, Flame, AudioLines, Sparkle, type LucideIcon,
} from 'lucide-react';
import { topics, type Topic, type CategoryId, type Difficulty, difficultyMeta, categories } from '../data/topics';
import { playTickSound, playRevealChime } from '../utils/audio';
import { CatIcon } from './Icon';
import ConfettiBurst from './ConfettiBurst';
import Magnetic from './Magnetic';

interface Props {
  isOpen: boolean;
  filterCategory: CategoryId | null;
  filterDifficulty: Difficulty | null;
  onSelect: (topic: Topic) => void;
  onClose: () => void;
}

const SPIN_STEPS = 24;
const CONFETTI: { Icon: LucideIcon; color: string }[] = [
  { Icon: PartyPopper, color: '#BE8B3F' },
  { Icon: Sparkles, color: '#96692C' },
  { Icon: Star, color: '#E8C276' },
  { Icon: Mic, color: '#8A5F26' },
  { Icon: Lightbulb, color: '#BE8B3F' },
  { Icon: Flame, color: '#96692C' },
  { Icon: AudioLines, color: '#8A5F26' },
  { Icon: Sparkle, color: '#E8C276' },
];

export default function RouletteModal({
  isOpen,
  filterCategory,
  filterDifficulty,
  onSelect,
  onClose,
}: Props) {
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'revealed'>('idle');
  const [display, setDisplay] = useState<Topic>(topics[0]);
  const [tick, setTick] = useState(0);
  const poolRef = useRef<Topic[]>(topics);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // Build candidate pool from active filters
  useEffect(() => {
    let list = topics;
    if (filterCategory) list = list.filter(t => t.category === filterCategory);
    if (filterDifficulty) list = list.filter(t => t.difficulty === filterDifficulty);
    poolRef.current = list.length ? list : topics;
  }, [filterCategory, filterDifficulty]);

  const startSpin = () => {
    clearTimers();
    const p = poolRef.current.length ? poolRef.current : topics;
    const winner = p[Math.floor(Math.random() * p.length)];
    setPhase('spinning');
    setTick(0);

    let delay = 40;
    for (let i = 0; i < SPIN_STEPS; i++) {
      const at = delay;
      timers.current.push(setTimeout(() => {
        setDisplay(p[Math.floor(Math.random() * p.length)]);
        setTick(i);
        playTickSound(520 + i * 22);
      }, at));
      // deceleration curve: fast middle, heavy braking at the end
      const remaining = SPIN_STEPS - 1 - i;
      delay += remaining > 9 ? 26 : remaining > 4 ? 62 : 118;
    }
    timers.current.push(setTimeout(() => {
      setDisplay(winner);
      setPhase('revealed');
      playRevealChime();
    }, delay + 80));
  };

  // Auto-spin on open, clean reset on close
  useEffect(() => {
    if (isOpen) {
      startSpin();
    } else {
      clearTimers();
      setPhase('idle');
    }
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Escape to close + lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const spinning = phase === 'spinning';
  const revealed = phase === 'revealed';
  const cat = categories.find(c => c.id === display.category);
  const poolSize = poolRef.current.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-scrim backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 24 }}
        animate={{ opacity: 1, scale: revealed ? 1.012 : 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative w-full max-w-xl overflow-hidden rounded-[2.5rem] border border-amber/40 bg-gradient-to-b from-ivory via-parchment to-champagne/80 shadow-[0_25px_100px_-20px_rgba(190,139,63,0.6)] p-6 sm:p-9"
      >
        {/* Aura */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-amber/30 via-champagne/40 to-transparent blur-3xl pointer-events-none" />

        {/* physics confetti on reveal */}
        <ConfettiBurst fire={revealed} />

        {/* spotlight cone landing on the chosen topic */}
        {revealed && (
          <div
            className="spotlight-sweep absolute -top-8 inset-x-10 h-[70%] pointer-events-none z-[5]"
            style={{
              background: 'radial-gradient(ellipse 55% 100% at 50% 0%, rgba(232,194,118,0.5), rgba(232,194,118,0.12) 55%, transparent 75%)',
            }}
          />
        )}

        <div className="relative z-10">
          {/* ====== TOP BAR: Back · Oracle badge · Close ====== */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-ink-wash/25 bg-ivory/90 pl-3.5 pr-4.5 pr-4 py-2 text-xs sm:text-sm font-semibold text-warm-stone hover:text-espresso hover:border-amber transition shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="inline-flex items-center gap-2 rounded-full border border-amber/30 bg-ivory/80 px-3.5 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-amber-deep shadow-sm">
              <Dices className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} style={{ animationDuration: '1.2s' }} />
              {spinning ? 'Consulting the Oracle…' : 'Destiny Revealed'}
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full grid place-items-center border border-ink-wash/25 bg-ivory/90 text-warm-stone hover:text-espresso hover:border-amber transition shadow-sm"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pool context */}
          <div className="text-center mb-4 text-[11px] sm:text-xs text-ink-faint font-medium">
            Spinning across <span className="font-bold text-warm-stone">{poolSize}</span> topic{poolSize === 1 ? '' : 's'}
            {filterCategory && <> · Field: <span className="font-semibold text-amber-deep">{cat?.label ?? filterCategory}</span></>}
            {filterDifficulty && <> · Level: <span className="font-semibold text-amber-deep">{difficultyMeta[filterDifficulty].label}</span></>}
          </div>

          {/* ====== THE CARD STAGE ====== */}
          <div className="relative">
            {/* Reveal glow ring */}
            {revealed && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-r from-amber/40 via-amber-deep/30 to-amber/40 blur-lg pointer-events-none"
              />
            )}

            {/* Floating confetti on reveal */}
            {revealed && CONFETTI.map(({ Icon, color }, i) => (
              <span
                key={`${display.id}-${i}`}
                className="float-up absolute z-20 pointer-events-none"
                style={{
                  left: `${8 + i * 11}%`,
                  bottom: '-4px',
                  animationDelay: `${i * 0.12}s`,
                }}
              >
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
              </span>
            ))}

            <motion.div
              key={revealed ? `win-${display.id}` : 'stage'}
              initial={revealed ? { opacity: 0, scale: 0.72, rotateX: 24, y: 26 } : false}
              animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              className={`relative mx-auto w-full overflow-hidden rounded-3xl border bg-ivory shadow-xl mb-5 ${
                revealed ? 'border-amber/45' : 'border-ink-wash/15'
              } ${spinning ? 'shake-soft' : ''}`}
            >
              <div className="relative h-44 sm:h-52 overflow-hidden">
                <img
                  key={`img-${display.id}-${tick}`}
                  src={display.image}
                  alt={display.imageAlt}
                  className={`w-full h-full object-cover transition-none ${
                    spinning ? 'scale-110 blur-[2.5px] saturate-125' : 'scale-100 blur-0'
                  }`}
                />
                <div className="img-scrim" />

                {/* Category & Difficulty Tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-ivory/90 backdrop-blur px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-espresso">
                    <CatIcon name={cat?.icon || 'Sparkles'} className="w-3 h-3 text-amber-deep" />
                    {cat?.label}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ivory shadow-sm"
                    style={{ background: difficultyMeta[display.difficulty].color }}
                  >
                    <Gauge className="w-3 h-3" />
                    {difficultyMeta[display.difficulty].label}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-left">
                  <h3
                    key={`t-${display.id}-${tick}`}
                    className={`font-display text-2xl sm:text-3xl text-ivory leading-tight drop-shadow-md ${spinning ? 'roulette-roll' : ''}`}
                  >
                    {display.title}
                  </h3>
                  <p className="font-editorial italic text-amber-glow text-sm sm:text-base drop-shadow">
                    {display.subtitle}
                  </p>
                </div>
              </div>

              {/* Teaser text */}
              <div className="p-4 sm:p-5 text-left bg-gradient-to-b from-ivory to-cream">
                <p className="text-xs sm:text-sm text-warm-stone line-clamp-2 leading-relaxed">
                  {display.description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Spin progress bar */}
          <div className="h-1.5 rounded-full bg-ink-wash/12 overflow-hidden mb-6">
            <div
              className={`h-full rounded-full transition-[width] ease-linear ${
                revealed ? 'bg-gradient-to-r from-amber to-amber-deep' : 'bg-gradient-to-r from-amber/70 to-amber-deep/70'
              }`}
              style={{ width: revealed ? '100%' : `${Math.round((tick / SPIN_STEPS) * 100)}%` }}
            />
          </div>

          {/* ====== ACTIONS ====== */}
          {spinning && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2 py-2.5 text-xs uppercase tracking-[0.25em] text-ink-faint font-semibold animate-pulse">
                <Sparkles className="w-4 h-4 text-amber-deep" />
                Fate is choosing your topic…
              </div>
              <button
                onClick={onClose}
                className="text-xs text-warm-stone hover:text-espresso inline-flex items-center gap-1.5 font-semibold transition"
              >
                <Undo2 className="w-3.5 h-3.5" /> Cancel and go back
              </button>
            </div>
          )}

          {revealed && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Magnetic strength={0.3} className="w-full sm:w-auto flex-1">
                <button
                  onClick={() => { onSelect(display); onClose(); }}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-espresso px-8 py-4 text-sm font-medium tracking-wide text-ivory shadow-xl shadow-espresso/25 hover:bg-espresso-ink hover:scale-105 active:scale-95 transition duration-300"
                >
                  <span>Enter Deep Masterclass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Magnetic>

              <Magnetic strength={0.3} className="w-full sm:w-auto">
                <button
                  onClick={startSpin}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-ink-wash/25 bg-ivory px-6 py-4 text-sm font-semibold text-warm-stone hover:border-amber hover:text-amber-deep transition"
                >
                  <RefreshCw className="w-4 h-4" /> Spin Again
                </button>
              </Magnetic>

              <button
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-warm-stone hover:text-espresso transition"
              >
                <ArrowLeft className="w-4 h-4" /> Go Back
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
