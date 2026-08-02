import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface Props {
  duration: number;
  onComplete: (secondsSpoken: number) => void;
}

const EXHALE_MARKS = [45, 30, 15];

export default function SpeakTimer({ duration, onComplete }: Props) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [pulses, setPulses] = useState<number[]>([]);
  const raf = useRef<number | null>(null);
  const endAt = useRef<number>(0);
  const prevRemaining = useRef(duration);
  const pulseSeq = useRef(0);
  const pulseTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    setRemaining(duration);
    setFinished(false);
    setRunning(false);
    setPulses([]);
    prevRemaining.current = duration;
  }, [duration]);

  useEffect(() => () => {
    pulseTimers.current.forEach(clearTimeout);
  }, []);

  const firePulse = () => {
    const id = ++pulseSeq.current;
    setPulses(p => [...p.slice(-2), id]);
    const t = setTimeout(() => setPulses(p => p.filter(x => x !== id)), 1300);
    pulseTimers.current.push(t);
  };

  const tick = useCallback(() => {
    const left = Math.max(0, (endAt.current - Date.now()) / 1000);
    // exhale pulses at the quarter marks
    for (const m of EXHALE_MARKS) {
      if (prevRemaining.current > m && left <= m) firePulse();
    }
    prevRemaining.current = left;
    setRemaining(left);
    if (left <= 0) {
      setRunning(false);
      setFinished(true);
      completeRef.current(duration);
      return;
    }
    raf.current = requestAnimationFrame(tick);
  }, [duration]);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + remaining * 1000;
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const pct = 1 - remaining / duration;
  const R = 132;
  const C = 2 * Math.PI * R;

  const mm = Math.floor(Math.ceil(remaining) / 60);
  const ss = Math.ceil(remaining) % 60;
  const urgent = remaining <= 10 && remaining > 0 && running;

  const reset = () => {
    setRunning(false);
    setFinished(false);
    setRemaining(duration);
    prevRemaining.current = duration;
    setPulses([]);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px]">
        {/* ambient glow */}
        <div
          className="absolute inset-6 rounded-full blur-2xl transition-opacity duration-700"
          style={{
            opacity: running ? 0.55 : 0.2,
            background: urgent
              ? 'radial-gradient(circle, rgba(194,106,74,0.35), transparent 70%)'
              : 'radial-gradient(circle, rgba(190,139,63,0.35), transparent 70%)',
          }}
        />

        {/* breathing halo while speaking */}
        {running && (
          <div
            className="halo-breathe absolute -inset-4 rounded-full pointer-events-none"
            style={{
              background: urgent
                ? 'radial-gradient(circle, transparent 60%, rgba(194,106,74,0.20) 68%, transparent 76%)'
                : 'radial-gradient(circle, transparent 60%, rgba(232,194,118,0.24) 68%, transparent 76%)',
            }}
          />
        )}

        {/* quarter-mark exhale pulses */}
        {pulses.map(id => (
          <span
            key={id}
            className="halo-pulse absolute -inset-2 rounded-full border-2 pointer-events-none"
            style={{ borderColor: urgent ? 'rgba(180,89,47,0.7)' : 'rgba(150,105,44,0.7)' }}
          />
        ))}

        {/* finish bloom */}
        {finished && (
          <div
            className="bloom-flash absolute -inset-10 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(232,194,118,0.55), rgba(190,139,63,0.25) 45%, transparent 65%)' }}
          />
        )}

        <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full -rotate-90">
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8C276" />
              <stop offset="50%" stopColor="#BE8B3F" />
              <stop offset="100%" stopColor="#96692C" />
            </linearGradient>
            <linearGradient id="arcUrgent" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#D98E6A" />
              <stop offset="100%" stopColor="#B4592F" />
            </linearGradient>
          </defs>
          <circle cx="150" cy="150" r={R} fill="none" stroke="#E7DCC9" strokeWidth="10" />
          <circle
            cx="150" cy="150" r={R} fill="none"
            stroke={urgent ? 'url(#arcUrgent)' : 'url(#arcGrad)'}
            strokeWidth="10" strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - pct)}
            style={{ transition: running ? 'none' : 'stroke-dashoffset .5s ease' }}
          />
        </svg>

        {/* tick marks */}
        <svg viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
          {Array.from({ length: 60 }).map((_, i) => {
            const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
            const r1 = 110, r2 = i % 5 === 0 ? 100 : 105;
            return (
              <line
                key={i}
                x1={150 + Math.cos(a) * r1} y1={150 + Math.sin(a) * r1}
                x2={150 + Math.cos(a) * r2} y2={150 + Math.sin(a) * r2}
                stroke="#2D2418"
                strokeWidth={i % 5 === 0 ? 1.4 : 0.7}
                opacity={i / 60 <= pct ? 0.32 : 0.1}
              />
            );
          })}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-display text-6xl sm:text-7xl tabular-nums leading-none tracking-tight transition-colors ${urgent ? 'text-[#B4592F]' : 'text-espresso'}`}>
            {mm}:{String(ss).padStart(2, '0')}
          </div>
          <div className="mt-3 text-[10px] uppercase tracking-[0.3em] text-ink-faint font-medium">
            {finished ? 'Complete' : running ? 'Speaking' : remaining === duration ? 'Ready' : 'Paused'}
          </div>
          {running && (
            <div className="mt-3 flex items-end gap-[3px] h-4">
              {[0, 1, 2, 3, 4].map(i => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-amber-deep/70"
                  style={{ animation: `eq 900ms ${i * 120}ms ease-in-out infinite`, height: '40%' }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => (finished ? reset() : setRunning(r => !r))}
          className="inline-flex items-center gap-2.5 bg-espresso text-ivory pl-6 pr-7 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-xl shadow-espresso/20 hover:bg-espresso-ink hover:-translate-y-0.5 transition duration-300"
        >
          {finished ? <RotateCcw className="w-4 h-4" /> : running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          {finished ? 'Go Again' : running ? 'Pause' : remaining === duration ? 'Start Speaking' : 'Resume'}
        </button>
        {!finished && remaining !== duration && (
          <button onClick={reset} className="w-12 h-12 rounded-full border border-ink-wash/30 text-warm-stone hover:border-amber hover:text-amber-deep transition grid place-items-center bg-ivory">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
