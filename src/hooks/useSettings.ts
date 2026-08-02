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
};

function load(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
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
