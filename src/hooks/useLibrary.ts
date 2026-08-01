import { useSyncExternalStore } from 'react';

/** Favorites + Practice-Later queue, persisted locally. */
const KEY = 'verbalis-library-v1';

interface Library {
  favorites: string[];
  queue: string[];
}

function load(): Library {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { favorites: [], queue: [] };
    const parsed = JSON.parse(raw);
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      queue: Array.isArray(parsed.queue) ? parsed.queue : [],
    };
  } catch {
    return { favorites: [], queue: [] };
  }
}

let state: Library = load();
const listeners = new Set<() => void>();

function commit(next: Library) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  listeners.forEach(fn => fn());
}

const toggleIn = (list: string[], id: string) =>
  list.includes(id) ? list.filter(x => x !== id) : [...list, id];

export function toggleFavorite(id: string) {
  commit({ ...state, favorites: toggleIn(state.favorites, id) });
}

export function toggleQueue(id: string) {
  commit({ ...state, queue: toggleIn(state.queue, id) });
}

export function removeFromQueue(id: string) {
  commit({ ...state, queue: state.queue.filter(x => x !== id) });
}

export function useLibrary(): Library {
  return useSyncExternalStore(
    cb => {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    () => state,
  );
}
