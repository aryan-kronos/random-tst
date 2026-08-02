import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, CheckSquare, Flame, Settings2 } from 'lucide-react';
import LogoMark from './Logo';

/**
 * Navbar — rebuilt from zero (third generation).
 *
 * Anchor physics: an invisible anchor pins where the bar last changed state.
 *   · visible + you scroll DOWN 56px past the anchor  -> bar glides away
 *   · hidden  + you scroll UP a mere 6px              -> bar glides home
 *   · scrolling further in the current direction drags the anchor along,
 *     so the reversal budget is always fresh and cheap
 * MacBook trackpads emit ±1-2px rubber-band shimmer between real deltas;
 * those micro-blips are below both budgets, so they cancel out inside the
 * anchor distance instead of resetting anything. The bar can never wedge.
 *
 * Plus a scroll-progress hairline along the bottom edge: the reader always
 * knows how deep the page goes, even while the chrome is away.
 */

interface Props {
  levelNum: number;
  levelTitle: string;
  xp: number;
  masteredCount: number;
  totalTopics: number;
  streak: number;
  showDashboard: boolean;
  onDashboard: () => void;
  onSettings: () => void;
}

export default function Navbar({
  levelNum, levelTitle, xp, masteredCount, totalTopics, streak,
  showDashboard, onDashboard, onSettings,
}: Props) {
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const hiddenRef = useRef(hidden);
  hiddenRef.current = hidden;

  useEffect(() => {
    let anchor = window.scrollY;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const y = window.scrollY;

      // progress hairline
      const doc = document.documentElement;
      const range = doc.scrollHeight - doc.clientHeight;
      if (range > 0) setProgress(Math.min(1, Math.max(0, y / range)));

      // always home at the top of the page
      if (y < 12) {
        if (hiddenRef.current) { hiddenRef.current = false; setHidden(false); }
        anchor = y;
        return;
      }

      const d = y - anchor;
      if (!hiddenRef.current) {
        if (d > 56) {              // ~one nav-height of committed downward travel
          hiddenRef.current = true;
          setHidden(true);
          anchor = y;
        } else if (d < -4) {       // genuine upward intent: fresh budget for hiding
          anchor = y;
        }
      } else {
        if (d < -6) {              // a whisper of upward scroll, and the bar returns
          hiddenRef.current = false;
          setHidden(false);
          anchor = y;
        } else if (d > 4) {        // still descending: keep the anchor under us
          anchor = y;
        }
      }
    };

    const onScroll = () => { if (raf === 0) raf = requestAnimationFrame(measure); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, []);

  return (
    <header
      className="site-nav sticky top-0 z-50 backdrop-blur-xl bg-cream/80 border-b border-ink-wash/10"
      data-hidden={hidden}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-18 flex items-center justify-between">
        <button onClick={onDashboard} className="flex items-center gap-3 group text-left">
          <LogoMark className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-md group-hover:drop-shadow-lg transition" />
          <div className="leading-none">
            <div className="font-editorial text-xl sm:text-2xl tracking-tight">Verbalis</div>
            <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-ink-faint mt-0.5">Master of Speech</div>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Level Chip */}
          <div className="hidden md:flex items-center gap-2 bg-ivory border border-ink-wash/15 rounded-full pl-1.5 pr-4 py-1.5 shadow-xs">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber to-amber-deep grid place-items-center text-ivory text-xs font-bold shadow-inner">
              {levelNum}
            </span>
            <div className="leading-none">
              <div className="text-xs font-semibold">{levelTitle}</div>
              <div className="text-[9px] text-ink-faint">{xp} XP</div>
            </div>
          </div>

          {/* Mastered Topics Counter */}
          <div className="hidden sm:flex items-center gap-2 bg-ivory border border-ink-wash/15 rounded-full px-3.5 py-1.5 shadow-xs">
            <CheckSquare className="w-3.5 h-3.5 text-[#5A6B4A]" />
            <span className="text-xs font-semibold tabular-nums text-espresso">{masteredCount}/{totalTopics}</span>
            <span className="text-[10px] uppercase tracking-wider text-ink-faint">Mastered</span>
          </div>

          {/* Streak (mobile) */}
          <div className="flex sm:hidden items-center gap-2 bg-ivory border border-ink-wash/15 rounded-full px-3 py-1.5 shadow-xs">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-[#C4703A]' : 'text-ink-wash'}`} />
            <span className="text-xs font-semibold tabular-nums">{streak}d</span>
          </div>

          {showDashboard && (
            <button
              onClick={onDashboard}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-warm-stone hover:text-espresso border border-ink-wash/20 hover:border-amber/50 bg-ivory rounded-full px-4 py-2 transition"
            >
              <ChevronLeft className="w-4 h-4" /> <span>Dashboard</span>
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onSettings}
            className="inline-flex items-center justify-center text-warm-stone hover:text-espresso border border-ink-wash/20 hover:border-amber/50 bg-ivory rounded-full w-9 h-9 sm:w-10 sm:h-10 transition"
            aria-label="Open settings"
            title="Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* scroll-progress hairline — the quiet depth gauge */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-transparent overflow-hidden" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-amber via-amber-deep to-amber transition-transform duration-150 ease-out origin-left"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </header>
  );
}
