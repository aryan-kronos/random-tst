import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sunrise, Sun, CloudSun, Sunset, Moon, MoonStar, Flame, Star, type LucideIcon,
} from 'lucide-react';

interface Props {
  streak: number;
  totalTakes: number;
}

interface Greeting {
  line: string;
  Icon: LucideIcon;
}

const ROTATE_MS = 45_000;

/** Builds a pool of greetings from time-of-day, weekday and practice momentum. */
function buildPool(streak: number, totalTakes: number): Greeting[] {
  const now = new Date();
  const h = now.getHours();
  const day = now.getDay(); // 0 = Sunday

  const pool: Greeting[] = [];

  // momentum beats everything — celebrate the streak first
  if (streak >= 7) pool.push({ line: `Day ${streak} streak — one week of fire`, Icon: Flame });
  else if (streak >= 3) pool.push({ line: `Day ${streak} streak — protect the flame`, Icon: Flame });
  else if (streak >= 1) pool.push({ line: `Streak day ${streak} — keep it alive`, Icon: Flame });

  // weekday flavour
  if (day === 1) pool.push({ line: "Monday — set the week's tone", Icon: Sun });
  else if (day === 5) pool.push({ line: 'Friday — finish the week fluent', Icon: Sunset });
  else if (day === 0 || day === 6) pool.push({ line: 'Weekend reps count double', Icon: Star });

  // time-of-day bucket
  if (h >= 5 && h < 8) {
    pool.push(
      { line: 'Early light, clear voice', Icon: Sunrise },
      { line: 'Sunrise sessions hit different', Icon: Sunrise },
    );
  } else if (h >= 8 && h < 12) {
    pool.push(
      { line: 'Good morning, golden voice', Icon: Sun },
      { line: 'Morning mind, ready mic', Icon: Sun },
    );
  } else if (h >= 12 && h < 14) {
    pool.push(
      { line: 'Midday momentum — take one minute', Icon: Sun },
      { line: 'Lunch-break eloquence', Icon: Sun },
    );
  } else if (h >= 14 && h < 17) {
    pool.push(
      { line: 'Afternoon flow state', Icon: CloudSun },
      { line: 'Post-lunch, pre-glory', Icon: CloudSun },
    );
  } else if (h >= 17 && h < 19) {
    pool.push(
      { line: 'Golden hour for golden words', Icon: Sunset },
      { line: 'Evening edge — sharpen the voice', Icon: Sunset },
    );
  } else if (h >= 19 && h < 22) {
    pool.push(
      { line: 'Evening eloquence', Icon: Moon },
      { line: 'Wind down with words', Icon: Moon },
    );
  } else {
    pool.push(
      { line: 'Midnight oil, burning bright', Icon: MoonStar },
      { line: "The mic doesn't sleep either", Icon: MoonStar },
    );
  }

  // returning practitioner acknowledgment
  if (totalTakes > 0) pool.push({ line: `Take number ${totalTakes + 1} begins`, Icon: Flame });

  return pool;
}

export default function DynamicGreeting({ streak, totalTakes }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), ROTATE_MS);
    return () => clearInterval(iv);
  }, []);

  // the bucket must follow the clock: tick re-renders every 45s, so once an
  // hour flips (11:59 → 12:00) the pool re-derives instead of serving stale
  // "good morning" until some unrelated stat changes
  const hour = new Date().getHours();
  const pool = useMemo(() => buildPool(streak, totalTakes), [streak, totalTakes, hour]);
  // rotate through the pool; tick re-slices every 45s
  const current = pool[tick % pool.length];

  return (
    <span className="inline-flex items-center gap-2.5 min-h-[18px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={current.line}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-flex items-center gap-2"
        >
          <current.Icon className="w-3.5 h-3.5 text-amber-deep" />
          <span className="text-[11px] uppercase tracking-[0.24em] text-ink-faint font-medium">
            {current.line} · Concision &amp; Rhetoric Gym
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
