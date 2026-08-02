import { useEffect, useRef, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useMotionValue, type Variants } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

/**
 * CursorPreview — the "magnetic lens".
 *
 * Any surface can announce what lives under the cursor via previewTopic(url, label).
 * A single floating frame trails the pointer with spring lag, leans into the
 * direction of travel, and when the source changes (gliding from one card or
 * sphere to the next) the old image slides out along the cursor's motion while
 * the new image wraps in from the opposite side — one continuous ribbon of
 * imagery stitched to your hand.
 *
 * Performance: the frame never re-renders on mouse move. Position/rotation
 * live in MotionValues updated inside rAF (transform-only, GPU-composited),
 * images are pre-warmed on first announce, and everything is gated behind
 * pointer:fine + the settings toggle + reduced-motion.
 */

interface PreviewPayload {
  url: string | null;
  label?: string;
}

let current: PreviewPayload = { url: null };
const listeners = new Set<() => void>();
const preloaded = new Set<string>();

function emit() {
  listeners.forEach(l => l());
}

/** Announce (or clear) the imagery attached to whatever is under the cursor. */
export function previewTopic(url: string | null, label?: string) {
  if (url && !preloaded.has(url)) {
    preloaded.add(url);
    const warm = new Image();
    warm.decoding = 'async';
    warm.src = url;
  }
  if (current.url === url && current.label === label) return;
  current = { url, label };
  emit();
}

export const clearPreview = () => previewTopic(null);

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
};
const getSnapshot = () => current;

const FRAME_W = 232;
const FRAME_H = 150;

const swapVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    x: 58 * dir,
    rotate: 5 * dir,
    scale: 0.92,
  }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1 },
  exit: (dir: number) => ({
    opacity: 0,
    x: -58 * dir,
    rotate: -5 * dir,
    scale: 0.92,
  }),
};

export default function CursorPreview() {
  const settings = useSettings();
  const payload = useSyncExternalStore(subscribe, getSnapshot);
  const enabled =
    settings.hoverPreviews &&
    !settings.reducedMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mvX = useMotionValue(-600);
  const mvY = useMotionValue(-600);
  const mvR = useMotionValue(0);
  const dirRef = useRef(1);

  useEffect(() => {
    if (!enabled) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 3;
    let px = mx;
    let py = my;
    let svx = 0;
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    // a click is an intent to travel — drop the lens before the view changes
    const onDown = () => clearPreview();

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });

    const tick = () => {
      if (!running) return;
      const prevX = px;
      px += (mx - px) * 0.14;
      py += (my - py) * 0.14;
      svx += (px - prevX - svx) * 0.18;
      if (Math.abs(svx) > 0.6) dirRef.current = svx > 0 ? 1 : -1;

      // dock to the side that has room, float above unless near the top edge
      const roomRight = mx < window.innerWidth - (FRAME_W + 76);
      const x = roomRight ? px + 34 : px - 34 - FRAME_W;
      let y = py - FRAME_H - 22;
      if (y < 14) y = py + 30;
      y = Math.min(Math.max(y, 10), window.innerHeight - FRAME_H - 10);

      mvX.set(x);
      mvY.set(y);
      mvR.set(Math.max(-8, Math.min(8, svx * 0.5)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [enabled, mvX, mvY, mvR]);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {payload.url && (
        <motion.div
          key="cursor-preview-frame"
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[60] hidden md:block"
          style={{
            x: mvX,
            y: mvY,
            rotate: mvR,
            width: FRAME_W,
            height: FRAME_H,
            willChange: 'transform',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.16, ease: 'easeIn' } }}
          transition={{ type: 'spring', stiffness: 380, damping: 24 }}
        >
          {/* soft golden halo breathing behind the frame (static blur, moves with the parent layer) */}
          <div className="absolute -inset-3 rounded-[1.4rem] bg-amber-glow/25 blur-xl" />

          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/25 shadow-[0_26px_60px_-16px_rgba(21,12,4,0.55)] bg-espresso-ink">
            <AnimatePresence mode="sync" custom={dirRef.current} initial={false}>
              <motion.div
                key={payload.url}
                custom={dirRef.current}
                variants={swapVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="absolute inset-0"
              >
                <motion.img
                  src={payload.url}
                  alt=""
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full object-cover select-none"
                  draggable={false}
                />
                {/* legibility gradient + caption chip */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[rgba(21,12,4,0.78)] to-transparent" />
                {payload.label && (
                  <span className="absolute bottom-2 left-2 max-w-[92%] truncate rounded-full bg-[rgba(21,12,4,0.72)] backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-[#F3E0B8]">
                    {payload.label}
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
