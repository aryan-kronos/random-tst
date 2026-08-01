import { useEffect, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';

interface Mote {
  x: number; y: number; r: number; a: number;
  vx: number; vy: number;
}

export default function CursorGlow() {
  const haloRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settings = useSettings();

  useEffect(() => {
    if (!settings.cursorGlow) return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = settings.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const halo = haloRef.current;
    const core = coreRef.current;
    const cvs = canvasRef.current;
    if (!halo || !core || !cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 3;
    let hx = mx, hy = my, cx = mx, cy = my;
    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      cvs.width = window.innerWidth * dpr;
      cvs.height = window.innerHeight * dpr;
      cvs.style.width = `${window.innerWidth}px`;
      cvs.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener('pointermove', onMove, { passive: true });

    // golden dust motes drifting upward, parting around the cursor
    const motes: Mote[] = Array.from({ length: 16 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: 1 + Math.random() * 1.8,
      a: 0.10 + Math.random() * 0.22,
      vx: (Math.random() - 0.5) * 0.1,
      vy: -0.1 - Math.random() * 0.2,
    }));

    const tick = () => {
      if (!running) return;

      // buttery trail: two layers chasing the cursor at different speeds
      hx += (mx - hx) * 0.065;
      hy += (my - hy) * 0.065;
      cx += (mx - cx) * 0.13;
      cy += (my - cy) * 0.13;
      halo.style.transform = `translate3d(${hx - 320}px, ${hy - 320}px, 0)`;
      core.style.transform = `translate3d(${cx - 130}px, ${cy - 130}px, 0)`;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of motes) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const distSq = dx * dx + dy * dy;
        if (distSq < 110 * 110) {
          const d = Math.sqrt(distSq) || 1;
          p.vx += (dx / d) * 0.5;
          p.vy += (dy / d) * 0.5;
        }
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy - 0.14;
        if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
        if (p.x < -10) p.x = window.innerWidth + 10;
        if (p.x > window.innerWidth + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190, 139, 63, ${p.a})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [settings.cursorGlow, settings.reducedMotion]);

  if (!settings.cursorGlow) return null;

  return (
    <>
      <div
        ref={haloRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block"
        style={{
          width: 640,
          height: 640,
          background:
            'radial-gradient(circle, rgba(232, 194, 118, 0.20) 0%, rgba(232, 194, 118, 0.07) 38%, transparent 68%)',
          willChange: 'transform',
        }}
      />
      <div
        ref={coreRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block"
        style={{
          width: 260,
          height: 260,
          background:
            'radial-gradient(circle, rgba(232, 194, 118, 0.16) 0%, transparent 65%)',
          willChange: 'transform',
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
      />
    </>
  );
}
