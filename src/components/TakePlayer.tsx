import { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Download, Trash2 } from 'lucide-react';

/**
 * TakePlayer — a quiet little tape deck for one recorded take.
 * Owns its object URL lifecycle; all audio stays on this device.
 */

interface Props {
  blob: Blob;
  label: string;
  sub?: string;
  onDelete?: () => void;
}

const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
};

export default function TakePlayer({ blob, label, sub, onDelete }: Props) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCur(a.currentTime);
    const onMeta = () => {
      // Safari/WebM lies about duration as Infinity; nudge it into telling the truth
      if (a.duration === Infinity) {
        a.currentTime = 1e7;
        const fix = () => {
          if (a.duration !== Infinity && Number.isFinite(a.duration)) {
            setDur(a.duration);
          }
          a.currentTime = 0;
          a.removeEventListener('timeupdate', fix);
        };
        a.addEventListener('timeupdate', fix);
      } else if (Number.isFinite(a.duration)) {
        setDur(a.duration);
      }
    };
    const onEnd = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('durationchange', onMeta);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('durationchange', onMeta);
      a.removeEventListener('ended', onEnd);
    };
  }, [url]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      void a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  const seek = (v: number) => {
    const a = audioRef.current;
    if (!a || !Number.isFinite(v)) return;
    a.currentTime = v;
    setCur(v);
  };

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-wash/15 bg-ivory/90 px-3.5 py-3 shadow-xs">
      <audio ref={audioRef} src={url} preload="metadata" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause take' : 'Play take'}
        className="w-10 h-10 rounded-full bg-espresso text-ivory grid place-items-center shrink-0 shadow-md hover:bg-espresso-ink transition"
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-xs font-semibold text-espresso truncate">{label}</span>
          <span className="text-[10px] tabular-nums text-ink-faint shrink-0">
            {fmt(cur)} / {fmt(dur)}
          </span>
        </div>
        {sub && <div className="text-[10px] text-ink-faint truncate">{sub}</div>}
        <input
          type="range"
          min={0}
          max={dur > 0 ? dur : 1}
          step={0.1}
          value={Math.min(cur, dur > 0 ? dur : 0)}
          onChange={e => seek(Number(e.target.value))}
          className="vb-range mt-1.5 w-full"
          aria-label="Seek within take"
        />
      </div>

      <a
        href={url}
        download={`verbalis-take.${blob.type.includes('mp4') ? 'm4a' : 'webm'}`}
        aria-label="Download take"
        title="Download take"
        className="w-8 h-8 rounded-full border border-ink-wash/20 grid place-items-center text-warm-stone hover:text-amber-deep hover:border-amber/50 transition shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
      </a>
      {onDelete && (
        <button
          onClick={onDelete}
          aria-label="Delete take"
          title="Delete take"
          className="w-8 h-8 rounded-full border border-ink-wash/20 grid place-items-center text-warm-stone hover:text-[#A34A2A] hover:border-[#C26A4A]/60 transition shrink-0"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
