import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

/**
 * WaxSeal — the ceremony of mastery. A bronze-gold seal stamps down with
 * spring physics and throws a tiny bloom of light particles. Mini mode is
 * a quiet embossed chip for mastered topics in the checklist.
 */
interface Props {
  size?: number;
  mini?: boolean;
  label?: string;
}

export default function WaxSeal({ size = 92, mini = false, label }: Props) {
  const settings = useSettings();

  if (mini) {
    return (
      <span
        className="wax-seal inline-grid place-items-center shrink-0"
        style={{ width: 26, height: 26 }}
        title="Mastered"
        aria-label="Mastered"
      >
        <span className="wax-seal-ring grid place-items-center" style={{ width: 17, height: 17 }}>
          <Star className="w-2 h-2 text-[#3A2607] fill-[#3A2607]" />
        </span>
      </span>
    );
  }

  const particleCount = 10;
  const seal = (
    <div className="relative inline-grid place-items-center" style={{ width: size + 40, height: size + 40 }}>
      {/* light particles */}
      {Array.from({ length: particleCount }).map((_, i) => {
        const a = (i / particleCount) * Math.PI * 2;
        const dist = size * 0.75 + (i % 3) * 12;
        return (
          <span
            key={i}
            className="seal-particle absolute w-1.5 h-1.5 rounded-full bg-amber-glow"
            style={{
              left: '50%',
              top: '50%',
              ['--px' as string]: `${Math.cos(a) * dist}px`,
              ['--py' as string]: `${Math.sin(a) * dist}px`,
              animationDelay: '0.32s',
            }}
          />
        );
      })}
      {/* the seal itself */}
      <div
        className={`wax-seal grid place-items-center ${settings.reducedMotion ? '' : 'seal-stamp'}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label={label ?? 'Mastery seal'}
      >
        <div className="wax-seal-ring grid place-items-center" style={{ width: size * 0.68, height: size * 0.68 }}>
          <Star style={{ width: size * 0.3, height: size * 0.3 }} className="text-[#3A2607] fill-[#3A2607]" />
        </div>
      </div>
    </div>
  );

  if (settings.reducedMotion) return seal;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="inline-block"
    >
      {seal}
    </motion.div>
  );
}
