import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { useSettings } from '../hooks/useSettings';

/**
 * Parallax — scroll-linked depth drift. Children translate opposite to
 * scroll at `speed` fraction of their distance from viewport centre.
 * One passive scroll listener + rAF, transform-only.
 */
interface Props {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: CSSProperties;
}

export default function Parallax({ children, speed = 0.08, className, style }: Props) {
  const settings = useSettings();
  const ref = useRef<HTMLDivElement>(null);
  const disabled = settings.reducedMotion;

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let ticking = false;

    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const delta = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${delta.toFixed(2)}px, 0)`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        raf = requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [disabled, speed]);

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform', ...style }}>
      {children}
    </div>
  );
}
