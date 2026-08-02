import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sunrise, Sun, CloudSun, Sunset, Moon, MoonStar, Flame, Star, type LucideIcon,
} from 'lucide-react';

interface Props {
  streak: number;
  doneToday: boolean;
  totalTakes: number;
}

interface Greeting {
  line: string;
  Icon: LucideIcon;
}

const ROTATE_MS = 45_000;

/** Time-of-day in INDIA — Asia/Kolkata, always.
 * Intl with an explicit timeZone ignores both the device clock's zone and
 * any server UTC: the greeting follows Bharat wherever the box lives. */
function istNow(): { hour: number; day: number } {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false, weekday: 'numeric' as never,
    }).formatToParts(new Date());
    let hour = 0;
    for (const p of parts) if (p.type === 'hour') hour = parseInt(p.value, 10) % 24;
    const jsDay = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' })).getDay();
    return { hour, day: jsDay };
  } catch {
    const d = new Date();
    return { hour: d.getHours(), day: d.getDay() }; // ancient engine: device-local fallback
  }
}

/** Builds a pool of greetings from time-of-day, weekday and practice momentum. */
function buildPool(streak: number, totalTakes: number, doneToday: boolean): Greeting[] {
  const { hour: h, day } = istNow(); // 0 = Sunday, on Asia/Kolkata time

  const pool: Greeting[] = [];

  // momentum beats everything — celebrate the streak first
  if (streak >= 7) pool.push({ line: `Day ${streak} streak — one week of fire`, Icon: Flame });
  else if (streak >= 3) pool.push({ line: `Day ${streak} streak — protect the flame`, Icon: Flame });
  // speak the truth about TODAY: "alive" reads like the run is already banked
  else if (streak >= 1) pool.push({
    line: doneToday ? `Streak day ${streak} — banked today` : `Day ${streak}: one speech keeps it alive`,
    Icon: Flame,
  });

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

export default function DynamicGreeting({ streak, totalTakes, doneToday }: Props) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), ROTATE_MS);
    return () => clearInterval(iv);
  }, []);

  // the bucket must follow the clock: tick re-renders every 45s, so once an
  // hour flips (11:59 → 12:00) the pool re-derives instead of serving stale
  // "good morning" until some unrelated stat changes
  const { hour } = istNow();
  const pool = useMemo(() => buildPool(streak, totalTakes, doneToday), [streak, totalTakes, doneToday, hour]);
  // rotate through the pool; tick re-slices every 45s
  const current = pool[tick % pool.length]!; // buildPool guarantees a non-empty pool

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
