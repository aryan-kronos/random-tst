import { useSyncExternalStore } from 'react';
import { setAudioMuted } from '../utils/audio';

/** Theme ids — 'gold' = Golden-Hour Cream, 'noir' = Midnight Noir */
export type ThemeId = 'gold' | 'noir';

export interface Settings {
  theme: ThemeId;
  sound: boolean;
  cursorGlow: boolean;
  customCursor: boolean;
  hoverPreviews: boolean;
  liquidBg: boolean;
  reducedMotion: boolean;
  /** seconds on the lectern — 60 by default, up to the grand 10-minute speech */
  speakSeconds: number;
  /** capture takes locally so they can be replayed on this device */
  recordTakes: boolean;
}

const KEY = 'verbalis-settings-v1';

const DEFAULTS: Settings = {
  theme: 'gold',
  sound: true,
  cursorGlow: true,
  customCursor: true,
  hoverPreviews: true,
  liquidBg: true,
  reducedMotion: false,
  speakSeconds: 60,
  recordTakes: true,
};

export const MIN_SPEAK_SECONDS = 15;
export const MAX_SPEAK_SECONDS = 600;

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    const merged = { ...DEFAULTS, ...JSON.parse(raw) };
    // a hand-edited or ancient store must never arm an impossible timer
    if (typeof merged.speakSeconds !== 'number' || !Number.isFinite(merged.speakSeconds)
      || merged.speakSeconds < MIN_SPEAK_SECONDS || merged.speakSeconds > MAX_SPEAK_SECONDS) {
      merged.speakSeconds = DEFAULTS.speakSeconds;
    }
    merged.recordTakes = merged.recordTakes !== false;
    return merged;
  } catch {
    return { ...DEFAULTS };
  }
}

let state: Settings = load();
const listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode */ }
}

/** Push settings into the DOM so CSS variables and cursor rules react instantly. */
export function applySettings(s: Settings = state) {
  const root = document.documentElement;
  root.dataset.theme = s.theme;
  root.dataset.motion = s.reducedMotion ? 'reduced' : 'full';
  const fine = window.matchMedia('(pointer: fine)').matches;
  root.dataset.customCursor = s.customCursor && fine && !s.reducedMotion ? 'on' : 'off';
  // installed-PWA title bar should wear the theme too, not stay buttermilk in noir
  const metaTheme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (metaTheme) metaTheme.content = s.theme === 'noir' ? '#161009' : '#F2E9D9';
  setAudioMuted(!s.sound);
}

export function getSettings(): Settings {
  return state;
}

export function setSettings(patch: Partial<Settings>) {
  state = { ...state, ...patch };
  persist();
  applySettings(state);
  listeners.forEach(fn => fn());
}

export function useSettings(): Settings {
  return useSyncExternalStore(
    cb => {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    () => state,
  );
}
