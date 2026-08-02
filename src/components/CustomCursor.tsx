import { useEffect, useRef, useState } from 'react';
import { useSettings } from '../hooks/useSettings';

/**
 * CustomCursor — an ink ring & dot that read from the live theme tokens.
 *
 * `--color-espresso` is dark ink on Golden Hour and pale candlelight on
 * Midnight Noir, so the cursor always sits opposite the background — it can
 * never dissolve into the page the way the old all-gold one did. Gold only
 * appears on interactive hover as feedback, never as identity.
 *
 * NOTE: the divs MUST render as soon as `enabled` is true — the rAF loop and
 * pointer listeners attach via refs. Visibility itself is handled through
 * opacity, never by unmounting, otherwise the listeners can never attach
 * and the native cursor (hidden by CSS) leaves the user with no pointer
 * at all. GPU transform-only; touch devices and reduced-motion keep the
 * native cursor.
 */
export default function CustomCursor() {
  const settings = useSettings();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
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

    let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;
    let started = false;
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!started) {
        // snap straight to the pointer — no fly-in from the corner
        started = true;
        dx = rx = mx;
        dy = ry = my;
      }
      setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]',
      );
      hoverRef.current = interactive;
      setHovering(interactive);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const loop = () => {
      if (!running) return;
      if (started) {
        dx += (mx - dx) * 0.55;
        dy += (my - dy) * 0.55;
        rx += (mx - rx) * 0.2;
        ry += (my - ry) * 0.2;
        const h = hoverRef.current;
        dot.style.transform = `translate3d(${dx - 5}px, ${dy - 5}px, 0) scale(${h ? 0.5 : 1})`;
        ring.style.transform = `translate3d(${rx - 19}px, ${ry - 19}px, 0) scale(${h ? 1.7 : 1})`;
      }
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
      hoverRef.current = false;
      setHovering(false);
      setVisible(false);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* ink dot — theme-opposite by construction */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: 'var(--color-espresso)',
          opacity: visible ? 1 : 0,
          transform: 'translate3d(-100px, -100px, 0)',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: 'background .35s ease, opacity .2s ease',
        }}
      />
      {/* trailing ring — ink at rest, gold only as hover feedback */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: `1.5px solid ${hovering ? 'var(--color-amber-deep)' : 'var(--color-espresso)'}`,
          opacity: visible ? (hovering ? 0.85 : 0.4) : 0,
          boxShadow: hovering ? '0 0 18px rgba(190, 139, 63, 0.35)' : 'none',
          transform: 'translate3d(-100px, -100px, 0)',
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          transition: 'border-color .25s ease, opacity .25s ease, box-shadow .25s ease',
        }}
      />
    </>
  );
}
