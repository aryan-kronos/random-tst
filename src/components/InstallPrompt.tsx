import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share2 } from 'lucide-react';
import LogoMark from './Logo';

/**
 * InstallPrompt — "Take Verbalis home."
 *
 * A branded install invitation, not a browser default. Rises from the top
 * shortly after every visit (open or refresh) unless:
 *   · the app is ALREADY installed (standalone display-mode) — pointless to ask
 *   · the visitor permanently opted out ("Maybe later, always")
 *   · the browser fired `appinstalled` (Chrome/Edge actually captured it)
 *
 * Engines:
 *   · Chrome/Edge/Android  — `beforeinstallprompt` is deferred and launched
 *     from our own button (the native sheet, but at OUR cue).
 *   · iOS / iPadOS Safari  — no such event exists; we teach the two-tap
 *     Share → Add to Home Screen path instead.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'verbalis-install-optout-v1';
const SHOW_DELAY_MS = 1800;
const AUTO_HIDE_MS = 15000;

function isInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true ||
    document.referrer.startsWith('android-app://')
  );
}

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

export default function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [iosMode, setIosMode] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const hideTimer = useRef<number | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isInstalled()) return; // already living on the dock — never nag

    let optedOut = false;
    try { optedOut = localStorage.getItem(DISMISS_KEY) === '1'; } catch { /* private mode */ }
    if (optedOut) return;

    const armAutoHide = () => {
      if (hideTimer.current) window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => setVisible(false), SHOW_DELAY_MS + AUTO_HIDE_MS);
      return () => { if (hideTimer.current) window.clearTimeout(hideTimer.current); };
    };

    // iOS: no install event ever fires — teach the gesture after the hero lands
    if (isIOS()) {
      const t = window.setTimeout(() => { setIosMode(true); setVisible(true); }, SHOW_DELAY_MS);
      const disarm = armAutoHide();
      return () => { window.clearTimeout(t); disarm(); };
    }

    const onBIP = (e: Event) => {
      e.preventDefault(); // the browser's own chip stays down — our card speaks
      deferredRef.current = e as BeforeInstallPromptEvent;
      window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };
    const onInstalled = () => {
      deferredRef.current = null;
      setVisible(false);
      try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
    };

    window.addEventListener('beforeinstallprompt', onBIP);
    window.addEventListener('appinstalled', onInstalled);
    const disarm = armAutoHide();
    return () => {
      window.removeEventListener('beforeinstallprompt', onBIP);
      window.removeEventListener('appinstalled', onInstalled);
      disarm();
    };
  }, []);

  const install = async () => {
    const d = deferredRef.current;
    if (!d) return;
    setWorking(true);
    try {
      await d.prompt();
      const choice = await d.userChoice;
      if (choice.outcome === 'accepted') {
        setVisible(false);
        try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
      }
    } catch { /* sheet refused; keep the card */ } finally {
      setWorking(false);
      deferredRef.current = null;
    }
  };

  const notNow = () => setVisible(false); // returns on next visit — by design

  const neverAsk = () => {
    setVisible(false);
    try { localStorage.setItem(DISMISS_KEY, '1'); } catch { /* ignore */ }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-label="Install Verbalis"
          initial={{ opacity: 0, y: -28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className="fixed top-[74px] sm:top-[82px] left-1/2 -translate-x-1/2 z-[78] w-[calc(100%-2rem)] max-w-md"
        >
          <div className="relative overflow-hidden rounded-3xl border border-amber/35 bg-ivory/95 backdrop-blur-xl shadow-[0_24px_70px_-24px_rgba(56,38,16,0.55)] px-4 py-3.5 sm:px-5">
            {/* warm aura */}
            <div className="absolute -top-10 -right-8 w-36 h-36 rounded-full bg-amber/15 blur-2xl pointer-events-none" />

            <div className="relative flex items-center gap-3">
              <LogoMark className="w-9 h-9 shrink-0 drop-shadow-sm" />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-espresso leading-tight">Take Verbalis home</p>
                <p className="text-[11px] text-warm-stone leading-snug mt-0.5">
                  {iosMode
                    ? 'One-tap launches, offline masterclasses, a window all its own.'
                    : 'Install on this device — dock, offline masterclasses, its own window.'}
                </p>
              </div>
              <button
                onClick={notNow}
                aria-label="Dismiss install prompt"
                className="shrink-0 w-8 h-8 rounded-full grid place-items-center text-ink-faint hover:text-espresso hover:bg-ink-wash/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {iosMode ? (
              <div className="relative mt-3 flex items-center gap-2 text-[11px] font-semibold text-espresso/80 bg-cream/70 border border-ink-wash/15 rounded-2xl px-3.5 py-2.5">
                <Share2 className="w-4 h-4 text-amber-deep shrink-0" />
                Tap <span className="font-bold">Share</span> in Safari, then
                <span className="font-bold">Add to Home Screen</span>.
              </div>
            ) : (
              <div className="relative mt-3 flex items-center gap-2">
                <button
                  onClick={install}
                  disabled={working}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-espresso/90 text-ivory text-[13px] font-semibold px-4 py-2.5 hover:bg-espresso transition shadow-sm disabled:opacity-60"
                >
                  <Download className="w-4 h-4" />
                  {working ? 'Opening…' : 'Install Verbalis'}
                </button>
                <button
                  onClick={neverAsk}
                  className="text-[10.5px] uppercase tracking-[0.14em] font-bold text-ink-faint hover:text-espresso transition px-2 py-2.5"
                >
                  Not again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
