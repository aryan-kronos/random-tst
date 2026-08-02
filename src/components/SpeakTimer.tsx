import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Mic, MicOff, SlidersHorizontal } from 'lucide-react';
import SessionRecorder, { type MicState, type TakeResult } from '../lib/recorder';
import { MIN_SPEAK_SECONDS, MAX_SPEAK_SECONDS } from '../hooks/useSettings';

/**
 * SpeakTimer — the lectern.
 *
 * The clock is yours to set: 1:00 classic by default, 2:00 or 3:00 in one
 * tap, or a custom stretch from 0:15 up to a full 10-minute speech. Whatever
 * you choose is remembered on this device.
 *
 * The moment the clock starts, the mic starts listening (with permission —
 * denied is a perfectly fine way to practice too). The take is captured on
 * THIS device only, and handed upstairs at the bell so the victory page can
 * play it straight back to you.
 */

interface Props {
  duration: number;
  onDurationChange: (secs: number) => void;
  recordEnabled: boolean;
  onComplete: (secondsSpoken: number) => void;
  onTake: (take: TakeResult | null) => void;
  /** increment to end the round early ("claim victory") — reports true elapsed time */
  stopSignal: number;
  /** fired when an early claim is attempted before MIN_CLAIM_SECONDS of speaking */
  onClaimTooEarly: (waitSeconds: number) => void;
}

const MIN_CLAIM_SECONDS = 20;
const PRESETS = [60, 120, 180];
const EXHALE_FRACTIONS = [0.75, 0.5, 0.25];

export const mmss = (total: number) => {
  const m = Math.floor(total / 60);
  return `${m}:${String(Math.floor(total % 60)).padStart(2, '0')}`;
};

export default function SpeakTimer({
  duration, onDurationChange, recordEnabled, onComplete, onTake, stopSignal, onClaimTooEarly,
}: Props) {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [pulses, setPulses] = useState<number[]>([]);
  const [mic, setMic] = useState<MicState>('idle');
  const [customOpen, setCustomOpen] = useState(false);

  const raf = useRef<number | null>(null);
  const endAt = useRef(0);
  const prevRemaining = useRef(duration);
  const marks = useRef<number[]>(EXHALE_FRACTIONS.map(f => duration * f));
  const pulseSeq = useRef(0);
  const pulseTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finishGuard = useRef(false);
  const recorder = useRef<SessionRecorder | null>(null);
  if (!recorder.current) {
    recorder.current = new SessionRecorder();
    recorder.current.onState = setMic;
  }

  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;
  const takeRef = useRef(onTake);
  takeRef.current = onTake;
  const claimWarnRef = useRef(onClaimTooEarly);
  claimWarnRef.current = onClaimTooEarly;

  // pick up a freshly chosen length while the lectern is pristine
  useEffect(() => {
    setRemaining(duration);
    setFinished(false);
    setRunning(false);
    setPulses([]);
    prevRemaining.current = duration;
    marks.current = EXHALE_FRACTIONS.map(f => duration * f);
    finishGuard.current = false;
    recorder.current?.discard();
  }, [duration]);

  // mic always leaves with us
  useEffect(() => () => {
    pulseTimers.current.forEach(clearTimeout);
    recorder.current?.discard();
  }, []);

  const firePulse = () => {
    const id = ++pulseSeq.current;
    setPulses(p => [...p.slice(-2), id]);
    const t = setTimeout(() => setPulses(p => p.filter(x => x !== id)), 1300);
    pulseTimers.current.push(t);
  };

  const finish = useCallback((elapsed: number, natural: boolean) => {
    if (finishGuard.current) return;
    finishGuard.current = true;
    setRunning(false);
    setFinished(true);
    setRemaining(natural ? 0 : Math.max(0, duration - elapsed));
    void (async () => {
      const take = recorder.current ? await recorder.current.stop() : null;
      takeRef.current(take);
      completeRef.current(elapsed);
    })();
  }, [duration]);

  const tick = useCallback(() => {
    const left = Math.max(0, (endAt.current - Date.now()) / 1000);
    for (const m of marks.current) {
      if (prevRemaining.current > m && left <= m) firePulse();
    }
    prevRemaining.current = left;
    setRemaining(left);
    if (left <= 0) {
      finish(duration, true);
      return;
    }
    raf.current = requestAnimationFrame(tick);
  }, [duration, finish]);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + remaining * 1000;
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  // "Finished Speaking — Claim Victory" arrives here; honesty decided below
  const lastStopSignal = useRef(stopSignal);
  useEffect(() => {
    if (stopSignal === lastStopSignal.current) return;
    lastStopSignal.current = stopSignal;
    if (finished || finishGuard.current) return;
    const elapsed = Math.round(duration - remaining);
    if (elapsed < MIN_CLAIM_SECONDS) {
      claimWarnRef.current(MIN_CLAIM_SECONDS - elapsed);
      return;
    }
    finish(elapsed, false);
  }, [stopSignal, finished, remaining, duration, finish]);

  const pct = 1 - remaining / duration;
  const R = 132;
  const C = 2 * Math.PI * R;

  const mm = Math.floor(Math.ceil(remaining) / 60);
  const ss = Math.ceil(remaining) % 60;
  const urgentAt = Math.min(10, Math.max(5, Math.round(duration * 0.15)));
  const urgent = remaining <= urgentAt && remaining > 0 && running;
  const pristine = remaining === duration && !running && !finished;

  const begin = async () => {
    if (recordEnabled && recorder.current) {
      await recorder.current.start(); // mic arms BEFORE the clock moves
    }
    setRunning(true);
  };

  const pauseResume = () => {
    if (running) {
      recorder.current?.pause();
      setRunning(false);
    } else {
      recorder.current?.resume();
      setRunning(true);
    }
  };

  const reset = () => {
    recorder.current?.discard();
    setRunning(false);
    setFinished(false);
    setRemaining(duration);
    prevRemaining.current = duration;
    setPulses([]);
    finishGuard.current = false;
  };

  const micChip = (() => {
    if (!recordEnabled) return null;
    switch (mic) {
      case 'starting':
        return { dot: 'bg-ink-wash', pulse: true, icon: Mic, text: 'arming microphone…' };
      case 'recording':
        return { dot: 'bg-[#C2452D]', pulse: true, icon: Mic, text: 'listening — saved on this device only' };
      case 'paused':
        return { dot: 'bg-amber-deep', pulse: false, icon: Mic, text: 'take paused with the clock' };
      case 'denied':
        return { dot: 'bg-ink-wash', pulse: false, icon: MicOff, text: 'mic off — practicing without capture' };
      case 'unavailable':
        return { dot: 'bg-ink-wash', pulse: false, icon: MicOff, text: 'recording not supported in this browser' };
      default:
        return null;
    }
  })();

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

        <svg aria-hidden="true" viewBox="0 0 300 300" className="absolute inset-0 w-full h-full -rotate-90">
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

        {/* tick marks — sixty stations of breath, whatever the length of the speech */}
        <svg aria-hidden="true" viewBox="0 0 300 300" className="absolute inset-0 w-full h-full">
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
            {finished ? 'Complete' : running ? 'Speaking' : pristine ? 'Ready' : 'Paused'}
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

      {/* the same place always tells you whether the mic is live */}
      <div className="mt-4 h-6 flex items-center" role="status" aria-live="polite">
        {micChip && (
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-warm-stone bg-ivory/80 border border-ink-wash/15 rounded-full px-3.5 py-1.5 shadow-xs">
            <span className={`relative w-2 h-2 rounded-full ${micChip.dot}`}>
              {micChip.pulse && (
                <span className={`rec-ping absolute inset-0 rounded-full ${micChip.dot}`} />
              )}
            </span>
            <micChip.icon className="w-3.5 h-3.5 text-amber-deep" />
            {micChip.text}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={() => {
            if (finished) { reset(); return; }
            if (running) { pauseResume(); return; }
            if (pristine) { void begin(); return; }
            pauseResume();
          }}
          disabled={mic === 'starting'}
          className="inline-flex items-center gap-2.5 bg-espresso text-ivory pl-6 pr-7 py-3.5 rounded-full text-sm font-medium tracking-wide shadow-xl shadow-espresso/20 hover:bg-espresso-ink hover:-translate-y-0.5 transition duration-300 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {finished ? <RotateCcw className="w-4 h-4" /> : running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          {finished
            ? 'Go Again'
            : mic === 'starting'
              ? 'Arming mic…'
              : running
                ? 'Pause'
                : pristine
                  ? 'Start Speaking'
                  : 'Resume'}
        </button>
        {!finished && !pristine && (
          <button
            onClick={reset}
            aria-label="Reset timer"
            className="w-12 h-12 rounded-full border border-ink-wash/30 text-warm-stone hover:border-amber hover:text-amber-deep transition grid place-items-center bg-ivory"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* length of the speech — chosen while the lectern is pristine */}
      {pristine && (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {PRESETS.map(p => (
              <button
                key={p}
                onClick={() => { onDurationChange(p); setCustomOpen(false); }}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide border transition tabular-nums ${
                  duration === p
                    ? 'bg-espresso text-ivory border-espresso shadow-md'
                    : 'bg-ivory text-warm-stone border-ink-wash/25 hover:border-amber/60 hover:text-amber-deep'
                }`}
              >
                {mmss(p)}
              </button>
            ))}
            <button
              onClick={() => setCustomOpen(o => !o)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold tracking-wide border transition tabular-nums ${
                customOpen || !PRESETS.includes(duration)
                  ? 'bg-espresso text-ivory border-espresso shadow-md'
                  : 'bg-ivory text-warm-stone border-ink-wash/25 hover:border-amber/60 hover:text-amber-deep'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {PRESETS.includes(duration) ? 'Custom' : mmss(duration)}
            </button>
          </div>

          {customOpen && (
            <div className="w-72 sm:w-80 rounded-2xl border border-ink-wash/15 bg-ivory/90 px-5 py-4 shadow-xs">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[10px] uppercase tracking-[0.18em] text-ink-faint font-bold">
                  Your clock
                </span>
                <span className="font-display text-xl tabular-nums text-espresso">{mmss(duration)}</span>
              </div>
              <input
                type="range"
                min={MIN_SPEAK_SECONDS}
                max={MAX_SPEAK_SECONDS}
                step={15}
                value={duration}
                onChange={e => onDurationChange(Number(e.target.value))}
                className="vb-range w-full"
                aria-label="Custom speaking duration in seconds"
              />
              <div className="flex justify-between text-[10px] text-ink-faint mt-1 tabular-nums">
                <span>0:15</span>
                <span>10:00</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
