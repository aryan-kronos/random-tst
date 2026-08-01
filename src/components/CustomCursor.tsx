import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../hooks/useSettings';

/**
 * CustomCursor — replaces the OS pointer with a gold dot + trailing ring.
 * Ring grows over interactive elements. GPU transform-only; touch devices
 * and reduced-motion users keep the native cursor.
 */
export default function CustomCursor() {
  const settings = useSettings();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const enabled =
    settings.customCursor &&
    !settings.reducedMotion &&
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches;

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100, my = -100, dx = -100, dy = -100, rx = -100, ry = -100;
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]',
      );
      setHovering(!!interactive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const loop = () => {
      if (!running) return;
      dx += (mx - dx) * 0.55;
      dy += (my - dy) * 0.55;
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      dot.style.transform = `translate3d(${dx - 4}px, ${dy - 4}px, 0) scale(${hovering ? 0.6 : 1})`;
      ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${hovering ? 1.6 : 1})`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [enabled, hovering]);

  if (!enabled || !visible) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--color-amber-deep)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: '1.5px solid var(--color-amber-deep)',
          opacity: 0.55,
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          transition: 'opacity .2s ease',
        }}
      />
    </>
  );
}
