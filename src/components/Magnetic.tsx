import { useEffect, useRef, type ReactNode } from 'react';
import { useSettings } from '../hooks/useSettings';

/**
 * Magnetic — the control leans toward your cursor within a radius and
 * springs home on exit. The inner label trails the shell a half-beat
 * behind, which is what makes it feel like jelly instead of rigid motion.
 * Transform-only, rAF, kill switch on touch / reduced motion.
 */
interface Props {
  children: ReactNode;
  strength?: number;
  className?: string;
}

export default function Magnetic({ children, strength = 0.32, className }: Props) {
  const settings = useSettings();
  const shellRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const disabled = settings.reducedMotion ||
    (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches);

  useEffect(() => {
    if (disabled) return;
    const shell = shellRef.current;
    const label = labelRef.current;
    if (!shell || !label) return;

    let tx = 0, ty = 0, sx = 0, sy = 0, lx = 0, ly = 0;
    let raf = 0;
    let running = true;
    let sleeping = false;

    // rect caching, throttled — no sync layout reads at 120Hz
    let rect = shell.getBoundingClientRect();
    let rectAt = 0;
    const freshRect = () => {
      const now = performance.now();
      if (now - rectAt > 150) { rect = shell.getBoundingClientRect(); rectAt = now; }
      return rect;
    };
    const invalidate = () => { rectAt = 0; };
    window.addEventListener('scroll', invalidate, { passive: true });
    window.addEventListener('resize', invalidate);

    const wake = () => {
      if (!sleeping) return;
      sleeping = false;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      wake();
      const r = freshRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const radius = Math.max(r.width, r.height) / 2 + 52;
      if (Math.hypot(dx, dy) < radius) {
        tx = dx * strength;
        ty = dy * strength;
      } else {
        tx = 0; ty = 0;
      }
    };

    const loop = () => {
      if (!running) return;
      sx += (tx - sx) * 0.16;
      sy += (ty - sy) * 0.16;
      lx += (tx * 0.55 - lx) * 0.11;
      ly += (ty * 0.55 - ly) * 0.11;
      shell.style.transform = `translate3d(${sx.toFixed(2)}px, ${sy.toFixed(2)}px, 0)`;
      label.style.transform = `translate3d(${lx.toFixed(2)}px, ${ly.toFixed(2)}px, 0)`;
      // settle-and-sleep: fully home? park the loop until the pointer stirs
      if (tx === 0 && ty === 0 && Math.abs(sx) < 0.02 && Math.abs(sy) < 0.02 && Math.abs(lx) < 0.02 && Math.abs(ly) < 0.02) {
        sleeping = true;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', invalidate);
      window.removeEventListener('resize', invalidate);
    };
  }, [disabled, strength]);

  return (
    <span ref={shellRef} className={`inline-block will-change-transform ${className ?? ''}`}>
      <span ref={labelRef} className="inline-flex items-center gap-2 will-change-transform">
        {children}
      </span>
    </span>
  );
}
