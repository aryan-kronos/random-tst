import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { useSettings } from '../hooks/useSettings';

/**
 * Tilt — pointer-tracked 3D card tilt with a travelling light sheen.
 * The wrapper gets perspective rotateX/rotateY lerped every frame; a soft
 * amber sheen layer glides under the cursor. All transforms, all GPU.
 */
interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
}

export default function Tilt({ children, className, style, max = 6 }: Props) {
  const settings = useSettings();
  const rootRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const disabled = settings.reducedMotion ||
    (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches);

  useEffect(() => {
    if (disabled) return;
    const root = rootRef.current;
    const sheen = sheenRef.current;
    if (!root || !sheen) return;

    let hovering = false;
    let tx = 0, ty = 0, rx = 0, ry = 0;
    let shx = 0, shy = 0, tshx = 0, tshy = 0;
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width;
      const ny = (e.clientY - r.top) / r.height;
      if (nx < -0.15 || nx > 1.15 || ny < -0.15 || ny > 1.15) {
        if (hovering) { hovering = false; tx = 0; ty = 0; sheen.style.opacity = '0'; }
      } else {
        hovering = true;
        tx = (0.5 - ny) * max * 2;
        ty = (nx - 0.5) * max * 2;
        tshx = nx * r.width - 110;
        tshy = ny * r.height - 110;
        sheen.style.opacity = '1';
      }
    };

    const onLeave = () => { hovering = false; tx = 0; ty = 0; sheen.style.opacity = '0'; };

    const loop = () => {
      if (!running) return;
      rx += (tx - rx) * (hovering ? 0.14 : 0.08);
      ry += (ty - ry) * (hovering ? 0.14 : 0.08);
      shx += (tshx - shx) * 0.12;
      shy += (tshy - shy) * 0.12;
      root.style.transform = `perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      sheen.style.transform = `translate3d(${shx.toFixed(1)}px, ${shy.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [disabled, max]);

  return (
    <div ref={rootRef} className={`tilt-root relative ${className ?? ''}`} style={style}>
      <div ref={sheenRef} className="tilt-sheen" aria-hidden="true" />
      {children}
    </div>
  );
}
