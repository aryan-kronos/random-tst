import { motion } from 'framer-motion';
import { useSettings } from '../hooks/useSettings';

/**
 * KineticText — headline letters rise out of invisible masks, one by one.
 * Takes styled segments so a single headline can mix fonts (Playfair,
 * Cormorant italic, shimmer gold) in one continuous kinetic wave.
 */
export interface KineticSegment {
  text: string;
  className?: string;
}

interface Props {
  segments: KineticSegment[];
  className?: string;
  delay?: number;
  stagger?: number;
}

export default function KineticText({ segments, className, delay = 0.05, stagger = 0.024 }: Props) {
  const settings = useSettings();

  if (settings.reducedMotion) {
    return (
      <span className={className}>
        {segments.map((s, i) => (
          <span key={i} className={s.className}>{s.text}</span>
        ))}
      </span>
    );
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      aria-label={segments.map(s => s.text).join('')}
    >
      {segments.map((seg, si) => (
        <span key={si} className={seg.className}>
          {seg.text.split(/(\s+)/).map((tok, wi) =>
            /^\s+$/.test(tok) ? (
              <span key={wi}>{'\u00A0'}</span>
            ) : (
              <span key={wi} className="inline-block whitespace-nowrap">
                {tok.split('').map((ch, ci) => (
                  <span key={ci} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-baseline">
                    <motion.span
                      className="inline-block will-change-transform"
                      variants={{
                        hidden: { y: '115%', rotate: 4 },
                        show: {
                          y: '0%',
                          rotate: 0,
                          transition: { type: 'spring', stiffness: 320, damping: 26 },
                        },
                      }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                ))}
              </span>
            ),
          )}
        </span>
      ))}
    </motion.span>
  );
}
