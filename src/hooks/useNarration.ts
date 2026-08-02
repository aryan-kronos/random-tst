import { useState, useEffect, useRef, useCallback } from 'react';

interface NarrationState {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
  progress: number; // 0..1 approx
}

/**
 * Text-to-speech narration using the browser SpeechSynthesis API.
 * Scales to unlimited topics with zero audio files.
 */
export function useNarration(active = true) {
  const [state, setState] = useState<NarrationState>({
    supported: typeof window !== 'undefined' && 'speechSynthesis' in window,
    speaking: false,
    paused: false,
    progress: 0,
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(0.95);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textLenRef = useRef(1);
  const boundaryRef = useRef(0);
  const startRef = useRef(0);
  const clockRef = useRef<number | null>(null);

  const clearClock = useCallback(() => {
    if (clockRef.current !== null) {
      window.clearInterval(clockRef.current);
      clockRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!state.supported || !active) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    // add/removeEventListener — assigning onvoiceschanged clobbers other
    // listeners and a stale handler outlives the unmounted player
    synth.addEventListener('voiceschanged', load);
    return () => {
      synth.removeEventListener('voiceschanged', load);
      try { synth.cancel(); } catch { /* ignore */ }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const pickVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!voices.length) return null;
    const en = voices.filter(v => v.lang.startsWith('en'));
    // the studio MP3s are a masculine storyteller — the TTS fallback must carry the same character
    const preferred = en.find(v => /Daniel|Google UK English Male|Microsoft Guy|Microsoft David|Google US English|Alex|Arthur/i.test(v.name));
    return preferred ?? en[0] ?? voices[0] ?? null;
  }, [voices]);

  const stop = useCallback(() => {
    clearClock();
    if (!state.supported) return;
    window.speechSynthesis.cancel();
    setState(s => ({ ...s, speaking: false, paused: false, progress: 0 }));
  }, [state.supported, clearClock]);

  const speak = useCallback((text: string) => {
    if (!state.supported) return;
    window.speechSynthesis.cancel();
    clearClock();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = rate;
    u.pitch = 1;
    textLenRef.current = Math.max(1, text.length);
    boundaryRef.current = 0;
    startRef.current = Date.now();

    // Safari sometimes never fires boundary events for certain voices —
    // after a 2s stall, fall back to a time-based estimate so the seek bar
    // never freezes at 0
    const estMs = (text.length / (13 * rate)) * 1000; // ~13 chars/sec at 1x
    clockRef.current = window.setInterval(() => {
      if (boundaryRef.current !== 0 && Date.now() - boundaryRef.current < 2000) return;
      const p = Math.min(0.99, (Date.now() - startRef.current) / estMs);
      setState(s => (s.speaking ? { ...s, progress: Math.max(s.progress, p) } : s));
    }, 250);

    u.onstart = () => setState(s => ({ ...s, speaking: true, paused: false, progress: 0 }));
    u.onend = () => {
      clearClock();
      setState(s => ({ ...s, speaking: false, paused: false, progress: 1 }));
    };
    u.onerror = () => {
      clearClock();
      setState(s => ({ ...s, speaking: false, paused: false }));
    };
    u.onboundary = (e) => {
      boundaryRef.current = Date.now();
      const p = Math.min(1, (e.charIndex || 0) / textLenRef.current);
      setState(s => ({ ...s, progress: p }));
    };
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, [state.supported, pickVoice, rate, clearClock]);

  const pause = useCallback(() => {
    if (!state.supported) return;
    window.speechSynthesis.pause();
    setState(s => ({ ...s, paused: true }));
  }, [state.supported]);

  const resume = useCallback(() => {
    if (!state.supported) return;
    window.speechSynthesis.resume();
    setState(s => ({ ...s, paused: false }));
  }, [state.supported]);

  const toggleRate = useCallback(() => {
    setRate(r => (r >= 1.2 ? 0.8 : r >= 1.05 ? 1.2 : r >= 0.9 ? 1.05 : 0.95));
  }, []);

  return { ...state, speak, stop, pause, resume, rate, toggleRate };
}
