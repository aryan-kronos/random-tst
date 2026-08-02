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
    if (!state.supported) return;
    window.speechSynthesis.cancel();
    setState(s => ({ ...s, speaking: false, paused: false, progress: 0 }));
  }, [state.supported]);

  const speak = useCallback((text: string) => {
    if (!state.supported) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.rate = rate;
    u.pitch = 1;
    textLenRef.current = Math.max(1, text.length);
    u.onstart = () => setState(s => ({ ...s, speaking: true, paused: false, progress: 0 }));
    u.onend = () => setState(s => ({ ...s, speaking: false, paused: false, progress: 1 }));
    u.onerror = () => setState(s => ({ ...s, speaking: false, paused: false }));
    u.onboundary = (e) => {
      const p = Math.min(1, (e.charIndex || 0) / textLenRef.current);
      setState(s => ({ ...s, progress: p }));
    };
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, [state.supported, pickVoice, rate]);

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
