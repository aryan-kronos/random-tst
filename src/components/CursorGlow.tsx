import { useEffect, useRef } from 'react';
import { useSettings } from '../hooks/useSettings';

interface Mote {
  x: number; y: number; z: number;
  r: number; a: number;
  vx: number; vy: number;
}

/**
 * CursorGlow — a volumetric light field, not a flat blob.
 *
 * Three light layers chase the cursor at different depths (far haze, liquid
 * mid-light, hot near core). Because each layer lags at a different rate they
 * separate while you move and converge when you rest — that parallax is what
 * the eye reads as depth. The mid layer also deforms with velocity (rotates
 * into the direction of travel and stretches along it), so the light feels
 * like it has mass and momentum instead of being a 2D sticker.
 *
 * Dust motes carry their own z-depth: near motes swing with the cursor,
 * far ones barely drift — a second layer of parallax.
 *
 * Everything per-frame is transform-only (plus opacity) → fully GPU-composited,
 * pointer events are passive, one rAF loop, pauses when the tab hides.
 */
export default function CursorGlow() {
  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settings = useSettings();

  useEffect(() => {
    if (!settings.cursorGlow) return;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = settings.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const far = farRef.current;
    const mid = midRef.current;
    const core = coreRef.current;
    const cvs = canvasRef.current;
    if (!far || !mid || !core || !cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 3;
    // three depth chasers
    let fx = mx, fy = my;   // far haze   — slowest, deepest
    let lx = mx, ly = my;   // mid liquid — medium
    let cx = mx, cy = my;   // near core  — fastest, closest
    // smoothed velocity of the mid layer (drives deformation + mote parallax)
    let svx = 0, svy = 0;
    let angle = 0;
    let raf = 0;
    let running = true;
    const t0 = performance.now();

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

    // golden dust motes with depth — z in [0.35, 1]: bigger/brighter = nearer
    const motes: Mote[] = Array.from({ length: 18 }, () => {
      const z = 0.35 + Math.random() * 0.65;
      return {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        z,
        r: 0.7 + z * (0.8 + Math.random() * 1.6),
        a: 0.05 + z * (0.05 + Math.random() * 0.2),
        vx: (Math.random() - 0.5) * 0.1,
        vy: -0.08 - Math.random() * 0.2,
      };
    });

    const tick = () => {
      if (!running) return;

      // layered chasing — this differential lag IS the 3D effect
      fx += (mx - fx) * 0.04;
      fy += (my - fy) * 0.04;
      const plx = lx, ply = ly;
      lx += (mx - lx) * 0.085;
      ly += (my - ly) * 0.085;
      cx += (mx - cx) * 0.16;
      cy += (my - cy) * 0.16;

      // smoothed velocity of the liquid layer
      svx += (lx - plx - svx) * 0.16;
      svy += (ly - ply - svy) * 0.16;
      const speed = Math.hypot(svx, svy);
      if (speed > 0.6) angle = Math.atan2(svy, svx);

      // velocity deformation — the light stretches into its own motion
      const stretch = 1 + Math.min(speed / 55, 1.15);
      const squash = 1 / (1 + Math.min(speed / 70, 0.8));
      mid.style.transform =
        `translate3d(${lx - 260}px, ${ly - 260}px, 0) rotate(${angle}rad) scale(${stretch}, ${squash})`;
      // gentle breathing so the field feels alive even at rest
      const breathe = 0.88 + Math.sin((performance.now() - t0) / 1700) * 0.12;
      mid.style.opacity = String(breathe);

      far.style.transform = `translate3d(${fx - 450}px, ${fy - 450}px, 0)`;
      const coreScale = 1 + Math.min(speed / 220, 0.3);
      core.style.transform =
        `translate3d(${cx - 115}px, ${cy - 115}px, 0) scale(${coreScale})`;

      // motes — parallax drift against the light centre, repelled by the core
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const w = window.innerWidth, h = window.innerHeight;
      const offX = (cx - w / 2), offY = (cy - h / 2);
      for (const p of motes) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const distSq = dx * dx + dy * dy;
        const repelR = 90 + p.z * 60;
        if (distSq < repelR * repelR) {
          const d = Math.sqrt(distSq) || 1;
          p.vx += (dx / d) * 0.5 * p.z;
          p.vy += (dy / d) * 0.5 * p.z;
        }
        p.vx *= 0.95;
        p.vy *= 0.95;
        p.x += p.vx;
        p.y += p.vy - 0.14 * p.z;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        // near motes swing more with the light — depth cue on top of depth cue
        const sx = p.x + offX * (p.z - 0.35) * 0.07;
        const sy = p.y + offY * (p.z - 0.35) * 0.07;

        ctx.beginPath();
        ctx.arc(sx, sy, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(202, 155, 76, ${p.a})`;
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
      {/* far atmospheric haze — deepest layer */}
      <div
        ref={farRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block"
        style={{
          width: 900,
          height: 900,
          background:
            'radial-gradient(circle, rgba(244, 229, 194, 0.10) 0%, rgba(238, 203, 135, 0.05) 42%, transparent 68%)',
          willChange: 'transform',
        }}
      />
      {/* liquid mid-light — deforms with velocity */}
      <div
        ref={midRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block"
        style={{
          width: 520,
          height: 520,
          background:
            'radial-gradient(ellipse at center, rgba(238, 203, 135, 0.17) 0%, rgba(226, 181, 104, 0.08) 40%, transparent 68%)',
          willChange: 'transform, opacity',
        }}
      />
      {/* near hot core — fastest, commands the eye */}
      <div
        ref={coreRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[1] hidden md:block"
        style={{
          width: 230,
          height: 230,
          background:
            'radial-gradient(circle, rgba(255, 246, 228, 0.30) 0%, rgba(232, 194, 118, 0.13) 38%, transparent 65%)',
          willChange: 'transform',
        }}
      />
      {/* parallax dust */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] hidden md:block"
      />
    </>
  );
}
