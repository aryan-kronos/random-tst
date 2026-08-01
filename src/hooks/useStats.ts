import { useState, useEffect, useCallback } from 'react';
import type { Difficulty } from '../data/topics';

export interface SessionRecord {
  topicId: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  date: string; // ISO
  seconds: number;
  xp: number;
}

export interface Stats {
  sessions: SessionRecord[];
  masteredTopicIds: string[];
  streak: number;
  lastDay: string | null;
  bestStreak: number;
  xp: number;
}

const KEY = 'verbalis.stats.v3';
const empty: Stats = { sessions: [], masteredTopicIds: [], streak: 0, lastDay: null, bestStreak: 0, xp: 0 };

export const xpFor: Record<Difficulty, number> = { Gentle: 10, Moderate: 15, Bold: 25 };

export const LEVELS = [
  { level: 1, title: 'First Voice', min: 0 },
  { level: 2, title: 'Warming Up', min: 40 },
  { level: 3, title: 'Finding Words', min: 100 },
  { level: 4, title: 'Speaking Freely', min: 190 },
  { level: 5, title: 'Confident', min: 320 },
  { level: 6, title: 'Articulate', min: 500 },
  { level: 7, title: 'Persuasive', min: 740 },
  { level: 8, title: 'Eloquent', min: 1050 },
  { level: 9, title: 'Masterful', min: 1450 },
  { level: 10, title: 'Grand Orator', min: 2000 },
];

export function levelInfo(xp: number) {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.min) current = l;
  const next = LEVELS.find(l => l.min > xp) || null;
  const spanMin = current.min;
  const spanMax = next ? next.min : current.min;
  const progress = next ? (xp - spanMin) / (spanMax - spanMin) : 1;
  const toNext = next ? next.min - xp : 0;
  return { current, next, progress: Math.max(0, Math.min(1, progress)), toNext };
}

function dayKey(d = new Date()) { return d.toISOString().slice(0, 10); }

function load(): Stats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    return { ...empty, ...parsed, masteredTopicIds: parsed.masteredTopicIds || [] };
  } catch { return empty; }
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(empty);
  const [lastGain, setLastGain] = useState<{ xp: number; leveledTo: number | null } | null>(null);

  useEffect(() => { setStats(load()); }, []);

  const persist = useCallback((next: Stats) => {
    setStats(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }, []);

  const recordSession = useCallback((rec: Omit<SessionRecord, 'date' | 'xp'> & { xp: number }) => {
    setStats(prev => {
      const today = dayKey();
      const yesterday = dayKey(new Date(Date.now() - 86400000));
      let streak = prev.streak;
      if (prev.lastDay === today) { /* same day */ }
      else if (prev.lastDay === yesterday) streak = prev.streak + 1;
      else streak = 1;

      const prevLevel = levelInfo(prev.xp).current.level;
      const newXp = prev.xp + rec.xp;
      const newLevel = levelInfo(newXp).current.level;
      setLastGain({ xp: rec.xp, leveledTo: newLevel > prevLevel ? newLevel : null });

      const alreadyMastered = prev.masteredTopicIds.includes(rec.topicId);
      const masteredTopicIds = alreadyMastered ? prev.masteredTopicIds : [...prev.masteredTopicIds, rec.topicId];

      const next: Stats = {
        sessions: [{ ...rec, date: new Date().toISOString() }, ...prev.sessions].slice(0, 60),
        masteredTopicIds,
        streak,
        bestStreak: Math.max(prev.bestStreak, streak),
        lastDay: today,
        xp: newXp,
      };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const toggleMastered = useCallback((topicId: string) => {
    setStats(prev => {
      const exists = prev.masteredTopicIds.includes(topicId);
      const masteredTopicIds = exists
        ? prev.masteredTopicIds.filter(id => id !== topicId)
        : [...prev.masteredTopicIds, topicId];
      const next = { ...prev, masteredTopicIds };
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const todayCount = stats.sessions.filter(s => s.date.slice(0, 10) === dayKey()).length;
  const totalMinutes = Math.round(stats.sessions.reduce((a, s) => a + s.seconds, 0) / 60);
  const level = levelInfo(stats.xp);
  const masteredCount = stats.masteredTopicIds.length;

  return { stats, recordSession, toggleMastered, todayCount, totalMinutes, level, lastGain, masteredCount, persist };
}
