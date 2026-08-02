import { useEffect, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getSettings } from '../hooks/useSettings';

/**
 * BloomPortal — the melting bloom. When a topic is chosen anywhere
 * (checklist, category card, roulette), the imagery under the cursor
 * doesn't vanish — it detaches, flies, and expands into the learn page's
 * hero frame, stitching two worlds into one continuous motion.
 */

interface Bloom {
  src: string;
  x: number;
  y: number;
  id: number;
}

let current: Bloom | null = null;
const listeners = new Set<() => void>();
let lastX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
let lastY = typeof window !== 'undefined' ? window.innerHeight / 3 : 0;
let seq = 0;

if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => { lastX = e.clientX; lastY = e.clientY; }, { passive: true });
}

/** Call right before navigating to the learn stage. */
export function startBloom(src: string) {
  const s = getSettings();
  if (s.reducedMotion) return;
  if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) return;
  current = { src, x: lastX, y: lastY, id: ++seq };
  listeners.forEach(l => l());
}

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };
const getSnapshot = () => current;

const SRC_W = 232;
const SRC_H = 150;

export default function BloomPortal() {
  const bloom = useSyncExternalStore(subscribe, getSnapshot);
  const [target, setTarget] = useState<DOMRect | null>(null);

  // after navigation, find the hero frame and measure it (double rAF: let layout settle)
  useEffect(() => {
    if (!bloom) { setTarget(null); return; }
    let r1 = 0, r2 = 0, tries = 0;
    const measure = () => {
      const el = document.querySelector<HTMLElement>('[data-bloom-hero]');
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 40) { setTarget(r); return; }
      }
        if (++tries < 24) r2 = requestAnimationFrame(measure);
        else setTarget(null);
    };
    r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(measure); });
    return () => { cancelAnimationFrame(r1); cancelAnimationFrame(r2); };
  }, [bloom]);

  return (
    <AnimatePresence>
      {bloom && target && (
        <motion.div
          key={bloom.id}
          aria-hidden="true"
          className="fixed z-[90] pointer-events-none overflow-hidden shadow-[0_30px_80px_-18px_rgba(21,12,4,0.6)]"
          initial={{
            x: bloom.x - SRC_W / 2,
            y: bloom.y - SRC_H / 2,
            width: SRC_W,
            height: SRC_H,
            borderRadius: 16,
            opacity: 1,
          }}
          animate={{
            x: target.left,
            y: target.top,
            width: target.width,
            height: target.height,
            borderRadius: 24,
          }}
          exit={{ opacity: 0, transition: { duration: 0.28, ease: 'easeOut' } }}
          transition={{ type: 'spring', stiffness: 145, damping: 21 }}
          onAnimationComplete={() => {
            // fade out soon after landing; the real hero is underneath
            setTimeout(() => { current = null; listeners.forEach(l => l()); }, 380);
          }}
          style={{ willChange: 'transform, width, height' }}
        >
          <img src={bloom.src} alt="" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 ring-1 ring-white/25 rounded-[inherit]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
