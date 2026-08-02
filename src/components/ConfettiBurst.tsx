import { useEffect, useRef } from 'react';

/**
 * ConfettiBurst — real physics confetti: gravity, air drag, tumbling paper
 * in the brand palette (champagne / amber / espresso / sage). One canvas,
 * one rAF, dies quietly after ~3 seconds.
 */
const COLORS = ['#E8C276', '#BE8B3F', '#96692C', '#F3E0B8', '#5A6B4A', '#231809', '#F1E3D4'];

interface Particle {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number; rot: number; vr: number;
  color: string; life: number; ttl: number; shape: 'rect' | 'circle';
}

export default function ConfettiBurst({ fire }: { fire: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!fire) return;
    // calm-first: users who asked for reduced motion (in-app OR OS) get no 110-particle physics burst
    const reduced = document.documentElement.dataset.motion === 'reduced' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;
    const host = cvs.parentElement;
    if (!host) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const W = host.clientWidth;
    const H = host.clientHeight;
    cvs.width = W * dpr;
    cvs.height = H * dpr;
    cvs.style.width = `${W}px`;
    cvs.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particles: Particle[] = Array.from({ length: 110 }, () => {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const v = 5 + Math.random() * 8.5;
      return {
        x: W / 2 + (Math.random() - 0.5) * 40,
        y: H * 0.78,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v * 1.15,
        w: 4 + Math.random() * 5,
        h: 3 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? '#E8C276',
        life: 0,
        ttl: 150 + Math.random() * 60,
        shape: Math.random() > 0.3 ? 'rect' : 'circle',
      };
    });

    // slow-mo physics: 0.5 speed simulation (two half-steps per frame)
    let raf = 0;
    let running = true;
    const step = () => {
      if (!running) return;
      for (let s = 0; s < 2; s++) {
        for (const p of particles) {
          p.life += 0.5;
          p.vy += 0.055;      // gravity
          p.vx *= 0.992;      // air drag
          p.vy *= 0.992;
          p.x += p.vx * 0.5;
          p.y += p.vy * 0.5;
          p.rot += p.vr * 0.5;
        }
      }
      ctx.clearRect(0, 0, W, H);
      let alive = false;
      for (const p of particles) {
        if (p.life > p.ttl) continue;
        alive = true;
        const fade = 1 - Math.max(0, (p.life - p.ttl * 0.7) / (p.ttl * 0.3));
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          // tumble illusion: paper flipping via width squash
          ctx.scale(1, Math.max(0.15, Math.abs(Math.sin(p.life * 0.08 + p.rot))));
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(step);
      else ctx.clearRect(0, 0, W, H);
    };
    raf = requestAnimationFrame(step);

    const onVis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(step); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [fire]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    />
  );
}
