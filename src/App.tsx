import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Shuffle, ChevronLeft, Flame, CheckCircle2, BookOpen,
  Clock3, Layers, ArrowRight, Lightbulb, PenLine, Sparkles,
  History, Trophy, X, Zap, Award, Gauge, Star,
  CheckSquare, NotebookPen, StickyNote, Heart, BookmarkPlus, Bookmark,
  Settings2, ArrowUpRight,
} from 'lucide-react';
import {
  categories, getTopicsByCategory, countByDifficulty, topics,
  difficultyMeta, totalTopics, type Topic, type CategoryId, type Difficulty,
} from './data/topics';
import { CatIcon } from './components/Icon';
import SpeakTimer from './components/SpeakTimer';
import CinematicVoicePlayer from './components/CinematicVoicePlayer';
import StickyNoteCard from './components/StickyNoteCard';
import RouletteModal from './components/RouletteModal';
import MasterChecklist from './components/MasterChecklist';
import CategoryHoverCard from './components/CategoryHoverCard';
import LogoMark from './components/Logo';
import CursorGlow from './components/CursorGlow';
import LiquidLight from './components/LiquidLight';
import CustomCursor from './components/CustomCursor';
import CursorPreview from './components/CursorPreview';
import Tilt from './components/Tilt';
import Magnetic from './components/Magnetic';
import KineticText from './components/KineticText';
import Parallax from './components/Parallax';
import WaxSeal from './components/WaxSeal';
import BloomPortal, { startBloom } from './components/BloomPortal';
import InstallPrompt from './components/InstallPrompt';
import SettingsDrawer from './components/SettingsDrawer';
import DynamicGreeting from './components/DynamicGreeting';
import { hasNoteArt, noteArtUrls } from './data/assets';
import { useStats, xpFor, LEVELS } from './hooks/useStats';
import { useLibrary, toggleFavorite, toggleQueue, removeFromQueue } from './hooks/useLibrary';
import { playCompleteFanfare } from './utils/audio';

type Stage = 'dashboard' | 'learn' | 'speak' | 'done';
const ease = [0.22, 1, 0.36, 1] as const;
const DIFFS: Difficulty[] = ['Gentle', 'Moderate', 'Bold'];

export default function App() {
  const [stage, setStage] = useState<Stage>('dashboard');
  const [topic, setTopic] = useState<Topic | null>(null);
  const [filter, setFilter] = useState<CategoryId | null>(null);
  const [diff, setDiff] = useState<Difficulty | null>(null);
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'learn' | 'checklist'>('learn');

  // typed angles are sacred: notes live per-topic on this device, reloading
  // when the topic changes and writing through on every keystroke
  useEffect(() => {
    if (!topic) { setNotes(''); return; }
    try { setNotes(localStorage.getItem(`verbalis.notes.${topic.id}`) ?? ''); }
    catch { setNotes(''); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic?.id]);

  const updateNotes = (v: string) => {
    setNotes(v);
    if (!topic) return;
    try {
      if (v.trim()) localStorage.setItem(`verbalis.notes.${topic.id}`, v);
      else localStorage.removeItem(`verbalis.notes.${topic.id}`);
    } catch { /* private mode: memory-only notes */ }
  };
  const library = useLibrary();

  const {
    stats,
    recordSession,
    toggleMastered,
    totalMinutes,
    level,
    lastGain,
    masteredCount,
  } = useStats();

  const topRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);
  const speakStartRef = useRef(0);
  const [claimWarn, setClaimWarn] = useState<number | null>(null);

  useEffect(() => {
    const reduced = document.documentElement.dataset.motion === 'reduced';
    topRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  }, [stage]);

  // arm the completion guard every time a speaking round begins
  useEffect(() => {
    if (stage === 'speak') {
      completedRef.current = false;
      speakStartRef.current = Date.now();
      setClaimWarn(null);
    }
  }, [stage]);

  // true after the user deliberately returns to the dashboard — browser BACK
  // replaying a topic hash afterwards must NOT drag them back into the topic
  const leaveRef = useRef(false);

  // deep links: #/topic/<id> — shareable, refresh-safe, back-button aware
  useEffect(() => {
    const applyHash = () => {
      const m = window.location.hash.match(/^#\/topic\/([a-z0-9-]+)$/i);
      if (m) {
        if (leaveRef.current) {
          // SPA-trap guard: user asked for the dashboard; swallow the stale hash
          window.history.replaceState('', document.title, window.location.pathname + window.location.search);
          return;
        }
        const t = topics.find(x => x.id === m[1]);
        if (t) {
          setTopic(t);
          setActiveTab('learn');
          setStage('learn');
        }
      }
    };
    applyHash();
    window.addEventListener('hashchange', applyHash);
    return () => window.removeEventListener('hashchange', applyHash);
  }, []);

  const goDashboard = () => {
    leaveRef.current = true;
    window.history.pushState('', document.title, window.location.pathname + window.location.search);
    setStage('dashboard');
    setTopic(null);
  };

  const handleStartRoulette = (cat: CategoryId | null = filter, d: Difficulty | null = diff) => {
    setFilter(cat);
    setDiff(d);
    setIsRouletteOpen(true);
  };

  const handleSelectTopicFromDraw = (chosen: Topic) => {
    leaveRef.current = false;
    startBloom(chosen.image);
    setTopic(chosen);
    setActiveTab('learn');
    setStage('learn');
    window.location.hash = `/topic/${chosen.id}`;
  };

  const chooseTopicDirectly = (t: Topic) => {
    leaveRef.current = false;
    startBloom(t.image);
    setTopic(t);
    setActiveTab('learn');
    setStage('learn');
    window.location.hash = `/topic/${t.id}`;
  };

  const handleComplete = (secs: number) => {
    if (completedRef.current) return; // guard: timer-finish + manual claim within the 800ms window must never double-record
    completedRef.current = true;
    if (topic) {
      recordSession({
        topicId: topic.id,
        title: topic.title,
        category: topic.category,
        difficulty: topic.difficulty,
        seconds: secs,
        xp: xpFor[topic.difficulty],
      });
      playCompleteFanfare();
    }
    setTimeout(() => setStage('done'), 800);
  };

  // mastery is earned: require at least 20 seconds at the lectern before victory can be claimed
  const MIN_CLAIM_SECONDS = 20;
  const claimVictory = () => {
    const remaining = MIN_CLAIM_SECONDS - (Date.now() - speakStartRef.current) / 1000;
    if (remaining > 0) {
      setClaimWarn(Math.ceil(remaining));
      return;
    }
    handleComplete(60);
  };

  useEffect(() => {
    if (claimWarn === null) return;
    const t = window.setTimeout(() => setClaimWarn(null), 4000);
    return () => window.clearTimeout(t);
  }, [claimWarn]);

  const catOf = (id: string) => categories.find(c => c.id === id);

  return (
    <div className="min-h-screen bg-cream text-espresso font-body relative overflow-x-hidden">
      <div ref={topRef} />

      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-amber-pale/40 via-champagne/30 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -left-52 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-rose-fog/40 to-transparent blur-3xl" />
      </div>

      {/* Cursor-chasing golden aura (desktop only, GPU-only) */}
      <CursorGlow />
      <LiquidLight />

      {/* ================= TOP BAR ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-cream/80 border-b border-ink-wash/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-18 flex items-center justify-between">
          <button onClick={goDashboard} className="flex items-center gap-3 group text-left">
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
                {level.current.level}
              </span>
              <div className="leading-none">
                <div className="text-xs font-semibold">{level.current.title}</div>
                <div className="text-[9px] text-ink-faint">{stats.xp} XP</div>
              </div>
            </div>

            {/* Mastered Topics Counter */}
            <div className="hidden sm:flex items-center gap-2 bg-ivory border border-ink-wash/15 rounded-full px-3.5 py-1.5 shadow-xs">
              <CheckSquare className="w-3.5 h-3.5 text-[#5A6B4A]" />
              <span className="text-xs font-semibold tabular-nums text-espresso">{masteredCount}/32</span>
              <span className="text-[10px] uppercase tracking-wider text-ink-faint">Mastered</span>
            </div>

            {/* Streak */}
            <div className="flex sm:hidden items-center gap-2 bg-ivory border border-ink-wash/15 rounded-full px-3 py-1.5 shadow-xs">
              <Flame className={`w-4 h-4 ${stats.streak > 0 ? 'text-[#C4703A]' : 'text-ink-wash'}`} />
              <span className="text-xs font-semibold tabular-nums">{stats.streak}d</span>
            </div>

            {stage !== 'dashboard' && (
              <button
                onClick={goDashboard}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-warm-stone hover:text-espresso border border-ink-wash/20 hover:border-amber/50 bg-ivory rounded-full px-4 py-2 transition"
              >
                <ChevronLeft className="w-4 h-4" /> <span>Dashboard</span>
              </button>
            )}

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center justify-center text-warm-stone hover:text-espresso border border-ink-wash/20 hover:border-amber/50 bg-ivory rounded-full w-9 h-9 sm:w-10 sm:h-10 transition"
              aria-label="Open settings"
              title="Settings"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pb-24">
        <AnimatePresence mode="wait">

          {/* ============================================================ */}
          {/* DASHBOARD                                                    */}
          {/* ============================================================ */}
          {stage === 'dashboard' && (
            <motion.div
              key="dash"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
            >
              {/* Hero Greeting & Headline */}
              <div className="pt-10 sm:pt-16 pb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-amber" />
                  <DynamicGreeting
                    streak={stats.streak}
                    totalTakes={stats.sessions.length}
                    doneToday={(() => { const d = new Date(); return stats.lastDay === `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; })()}
                  />
                </div>
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[0.96] tracking-tight max-w-4xl">
                  Learn <span className="font-editorial italic font-light text-amber-deep">deeply.</span><br />
                  Speak with <span className="font-editorial italic font-light shimmer-text">authority.</span>
                  <span className="block mt-4 font-body font-light text-2xl sm:text-3xl lg:text-4xl text-warm-stone tracking-normal">
                    In <span className="font-instrument italic text-amber-deep">sixty honest seconds.</span>
                  </span>
                </h1>
                <div className="font-handwritten text-xl sm:text-2xl text-ink-faint -rotate-1 mt-2 max-w-md">
                  no scripts, no audience — just you, one idea, one minute.
                </div>
                <p className="mt-5 text-base sm:text-lg text-warm-stone font-light max-w-2xl leading-relaxed">
                  Draw an intriguing topic at random, absorb the rich imagery, handwritten notes, and cinematic storytelling, then master the 60-second speech blueprint.
                </p>
              </div>

              {/* LEVEL PROGRESS BANNER */}
              <div className="rounded-[2rem] border border-ink-wash/15 bg-gradient-to-r from-ivory via-parchment/60 to-champagne/50 p-6 sm:p-8 mb-8 shadow-[0_2px_24px_-10px_rgba(56,38,16,0.1)]">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative shrink-0">
                    <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="var(--color-ink-wash)" strokeOpacity="0.45" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="34" fill="none" stroke="url(#lvlGrad)" strokeWidth="6" strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 34}
                        strokeDashoffset={2 * Math.PI * 34 * (1 - level.progress)}
                        style={{ transition: 'stroke-dashoffset .8s ease' }}
                      />
                      <defs>
                        <linearGradient id="lvlGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="var(--color-amber-glow)" />
                          <stop offset="100%" stopColor="var(--color-amber-deep)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="font-display text-3xl leading-none text-espresso font-bold">
                        {level.current.level}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                      <span className="font-editorial text-2xl sm:text-3xl text-espresso">{level.current.title}</span>
                      <span className="text-xs bg-champagne text-amber-deep border border-amber/30 rounded-full px-3 py-0.5 font-semibold">
                        Rank {level.current.level} of 10
                      </span>
                    </div>
                    <div className="mt-2.5 h-2 rounded-full bg-ink-wash/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber via-amber-glow to-amber-deep transition-[width] duration-700"
                        style={{ width: `${level.progress * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-ink-faint mt-2">
                      {level.next ? (
                        <>
                          <span className="font-semibold text-warm-stone">{level.toNext} XP remaining</span> to reach <span className="font-semibold text-warm-stone">{level.next.title}</span>
                        </>
                      ) : (
                        'Grand Orator Status Achieved — Master Level'
                      )}
                    </p>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleStartRoulette()}
                      className="inline-flex items-center gap-2 bg-espresso text-ivory px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-espresso-ink shadow-md"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-amber-glow" /> Quick Draw
                    </button>
                  </div>
                </div>
              </div>

              {/* STAT STRIP */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, ease }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10"
              >
                {[
                  { label: 'Current streak', value: stats.streak, suffix: stats.streak === 1 ? 'day' : 'days', icon: Flame },
                  { label: 'Topics Mastered', value: masteredCount, suffix: `/${totalTopics}`, icon: CheckSquare },
                  { label: 'Minutes Spoken', value: totalMinutes, suffix: 'min', icon: Clock3 },
                  { label: 'Total Experience', value: stats.xp, suffix: 'xp', icon: Zap },
                ].map(s => (
                  <div key={s.label} className="bg-ivory/80 backdrop-blur-xs rounded-2xl border border-ink-wash/12 p-4 sm:p-5 shadow-[0_2px_20px_-8px_rgba(56,38,16,0.08)]">
                    <s.icon className="w-4 h-4 text-amber-deep mb-3" />
                    <div className="font-display text-3xl sm:text-4xl leading-none tabular-nums text-espresso">
                      {s.value}<span className="text-base sm:text-lg text-ink-faint font-body font-light ml-1">{s.suffix}</span>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.12em] text-ink-faint mt-2">{s.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* ================= YOUR COLLECTION (FAVORITES + PRACTICE LATER) ================= */}
              {(library.favorites.length > 0 || library.queue.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, ease }}
                  className="grid sm:grid-cols-2 gap-4 mb-10"
                >
                  {library.favorites.length > 0 && (
                    <div className="rounded-[2rem] border border-ink-wash/15 bg-ivory/80 backdrop-blur-xs p-5 sm:p-6 shadow-[0_10px_40px_-18px_rgba(56,38,16,0.18)]">
                      <div className="flex items-center gap-2 mb-4">
                        <Heart className="w-4 h-4 text-amber-deep fill-current" />
                        <h3 className="font-display text-lg text-espresso">Your Favorites</h3>
                        <span className="ml-auto text-[10px] uppercase tracking-widest text-ink-faint font-bold">
                          {library.favorites.length} saved
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {library.favorites.map(id => {
                          const t = topics.find(x => x.id === id);
                          if (!t) return null;
                          return (
                            <button
                              key={id}
                              onClick={() => chooseTopicDirectly(t)}
                              className="group inline-flex items-center gap-2 rounded-full border border-ink-wash/20 bg-cream/70 pl-3 pr-2 py-1.5 text-xs font-semibold text-espresso hover:border-amber transition"
                            >
                              <span className="max-w-[200px] truncate">{t.title}</span>
                              <span
                                onClick={e => { e.stopPropagation(); toggleFavorite(id); }}
                                className="w-4 h-4 grid place-items-center rounded-full text-ink-faint hover:text-amber-deep cursor-pointer"
                                title="Remove from favorites"
                              >
                                <X className="w-3 h-3" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {library.queue.length > 0 && (
                    <div className="rounded-[2rem] border border-ink-wash/15 bg-ivory/80 backdrop-blur-xs p-5 sm:p-6 shadow-[0_10px_40px_-18px_rgba(56,38,16,0.18)]">
                      <div className="flex items-center gap-2 mb-4">
                        <Bookmark className="w-4 h-4 text-amber-deep fill-current" />
                        <h3 className="font-display text-lg text-espresso">Practice Later</h3>
                        <button
                          onClick={() => {
                            const id = library.queue[Math.floor(Math.random() * library.queue.length)];
                            const t = topics.find(x => x.id === id);
                            if (t) chooseTopicDirectly(t);
                          }}
                          className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-amber-deep hover:text-espresso transition"
                        >
                          <Shuffle className="w-3 h-3" /> Draw one
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {library.queue.map(id => {
                          const t = topics.find(x => x.id === id);
                          if (!t) return null;
                          return (
                            <button
                              key={id}
                              onClick={() => chooseTopicDirectly(t)}
                              className="group inline-flex items-center gap-2 rounded-full border border-ink-wash/20 bg-cream/70 pl-3 pr-2 py-1.5 text-xs font-semibold text-espresso hover:border-amber transition"
                            >
                              <span className="max-w-[200px] truncate">{t.title}</span>
                              <span
                                onClick={e => { e.stopPropagation(); removeFromQueue(id); }}
                                className="w-4 h-4 grid place-items-center rounded-full text-ink-faint hover:text-amber-deep cursor-pointer"
                                title="Remove from queue"
                              >
                                <X className="w-3 h-3" />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ================= EPIC RANDOM DRAW EXPERIENCE BANNER ================= */}
              <div className="relative overflow-hidden rounded-[2.5rem] border border-amber/35 bg-gradient-to-br from-ivory via-parchment/70 to-champagne/60 shadow-[0_24px_90px_-40px_rgba(190,139,63,0.45)] p-7 sm:p-12 lg:p-14 mb-12">
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-amber/20 via-champagne/30 to-transparent blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-deep mb-4 bg-ivory/80 px-3 py-1 rounded-full border border-amber/25">
                    <Sparkles className="w-3.5 h-3.5 text-amber-deep" />
                    Interactive Topic Oracle
                  </div>

                  <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight mb-5 text-espresso">
                    <KineticText
                      segments={[
                        { text: 'Choose a ' },
                        { text: 'random', className: 'font-editorial italic font-light text-amber-deep shimmer-text' },
                        { text: ' topic.' },
                      ]}
                    />
                  </h2>

                  <p className="text-base sm:text-lg text-warm-stone leading-relaxed mb-8 font-light">
                    Click below to trigger the randomized selector. Dive into full visual descriptions, sticky notes, cinematic voiceover, and a custom 60-second speaking blueprint.
                  </p>

                  {/* DIFFICULTY FILTER BUTTONS */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Gauge className="w-4 h-4 text-amber-deep" />
                      <span className="text-xs uppercase tracking-[0.16em] text-ink-faint font-bold">
                        Filter By Speaking Difficulty
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      <button
                        onClick={() => setDiff(null)}
                        className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider border transition ${
                          !diff
                            ? 'bg-espresso text-ivory border-espresso shadow-md'
                            : 'bg-ivory text-warm-stone border-ink-wash/20 hover:border-amber/50'
                        }`}
                      >
                        Any Level
                      </button>
                      {DIFFS.map(d => {
                        const m = difficultyMeta[d];
                        const on = diff === d;
                        return (
                          <button
                            key={d}
                            onClick={() => setDiff(d)}
                            className={`group px-4 py-2.5 rounded-xl text-left border transition ${
                              on ? 'text-ivory border-transparent shadow-md' : 'bg-ivory border-ink-wash/20 hover:border-amber/50'
                            }`}
                            style={on ? { background: m.color } : {}}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`text-xs sm:text-sm font-bold ${on ? 'text-ivory' : 'text-espresso'}`}>
                                {m.label} ({m.level})
                              </span>
                            </div>
                            <div className={`text-[10px] mt-0.5 ${on ? 'text-ivory/80' : 'text-ink-faint'}`}>
                              {countByDifficulty(d)} topics · {m.hint}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTION LAUNCH BUTTON */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Magnetic strength={0.3}>
                      <button
                        onClick={() => handleStartRoulette()}
                        className="group relative inline-flex items-center gap-3.5 bg-espresso text-ivory pl-8 pr-9 py-4 sm:py-5 rounded-full text-base sm:text-lg font-medium tracking-wide shadow-2xl shadow-espresso/30 hover:shadow-espresso/45 hover:scale-105 active:scale-95 transition duration-300 overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-amber/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Shuffle className="w-5 h-5 text-amber-glow group-hover:rotate-180 transition duration-500" />
                        <span>Choose a Random Topic</span>
                      </button>
                    </Magnetic>

                    {filter && (
                      <button
                        onClick={() => setFilter(null)}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-warm-stone hover:text-espresso border border-ink-wash/25 rounded-full px-4 py-3 bg-ivory/80 transition"
                      >
                        <span>Field: {catOf(filter)?.label}</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= CATEGORY CARDS (WITH DESKTOP CURSOR HOVER REVEAL) ================= */}
              <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-amber-deep font-bold block mb-1">
                    Explore Fields & Domains
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
                    Browse all <span className="font-editorial italic font-light text-amber-deep">nine</span> knowledge spheres
                  </h3>
                  <p className="text-sm text-ink-faint mt-1">
                    Glide your cursor across the spheres — the imagery travels with you.
                  </p>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16 eclipse-grid"
              >
                {categories.map(c => (
                  <Tilt key={c.id} max={5}>
                    <CategoryHoverCard
                      category={c}
                      topics={getTopicsByCategory(c.id)}
                      isFilterActive={filter === c.id}
                      onDrawCategory={() => handleStartRoulette(c.id)}
                      onSelectTopic={chooseTopicDirectly}
                    />
                  </Tilt>
                ))}
              </motion.div>

              {/* ================= 32-TOPIC MASTER CHECKLIST SECTION ================= */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease }}
                className="mb-16"
              >
                <MasterChecklist
                  masteredTopicIds={stats.masteredTopicIds}
                  onToggleMastered={toggleMastered}
                  onSelectTopic={chooseTopicDirectly}
                />
              </motion.div>

              {/* ================= LEVEL JOURNEY LADDER ================= */}
              <div className="rounded-[2.5rem] border border-ink-wash/15 bg-ivory/80 backdrop-blur-md p-7 sm:p-10 mb-12 shadow-[0_4px_30px_-10px_rgba(56,38,16,0.06)]">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-amber-deep font-bold block mb-1">
                      Concision Progression
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl tracking-tight text-espresso flex items-center gap-2.5">
                      <Award className="w-6 h-6 text-amber-deep" />
                      The 10 Orator Mastery Levels
                    </h3>
                  </div>
                  <span className="text-xs text-ink-faint">
                    Earn XP each speech session · Harder topics grant up to +25 XP
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  {LEVELS.map(l => {
                    const reached = stats.xp >= l.min;
                    const current = level.current.level === l.level;
                    return (
                      <div
                        key={l.level}
                        className={`relative rounded-2xl border p-4 text-center transition-all duration-300 ${
                          current
                            ? 'border-amber bg-champagne/60 shadow-md ring-2 ring-amber/30'
                            : reached
                            ? 'border-amber/25 bg-cream/70'
                            : 'border-ink-wash/10 bg-cream/30 opacity-55'
                        }`}
                      >
                        <div
                          className={`mx-auto w-10 h-10 rounded-full grid place-items-center mb-2.5 shadow-xs ${
                            reached
                              ? 'bg-gradient-to-br from-amber to-amber-deep text-ivory shadow-md shadow-amber/25'
                              : 'bg-ink-wash/15 text-ink-faint'
                          }`}
                        >
                          {reached ? <Star className="w-4 h-4 fill-current" /> : <span className="text-xs font-bold">{l.level}</span>}
                        </div>
                        <div className="text-xs font-bold leading-tight text-espresso">{l.title}</div>
                        <div className="text-[10px] text-ink-faint mt-1 font-semibold">{l.min} XP</div>
                        {current && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider bg-espresso text-ivory font-bold rounded-full px-2.5 py-0.5 shadow-sm">
                            Current
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================= RECENT SESSIONS ================= */}
              {stats.sessions.length > 0 && (
                <div className="rounded-[2.5rem] border border-ink-wash/15 bg-ivory/80 backdrop-blur-md p-7 sm:p-9">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-2xl tracking-tight flex items-center gap-2.5 text-espresso">
                      <History className="w-5 h-5 text-amber-deep" /> Recent Speaking Sessions
                    </h3>
                    {stats.bestStreak > 0 && (
                      <span className="hidden sm:inline-flex items-center gap-2 text-xs text-warm-stone bg-champagne/60 border border-amber/20 rounded-full px-3.5 py-1.5">
                        <Trophy className="w-3.5 h-3.5 text-amber-deep" /> Best streak {stats.bestStreak} days
                      </span>
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stats.sessions.slice(0, 6).map((s, i) => (
                      <div key={i} className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-cream/70 border border-ink-wash/8">
                        <div className="w-9 h-9 rounded-xl bg-champagne grid place-items-center shrink-0">
                          <CatIcon name={catOf(s.category)?.icon ?? 'Sparkles'} className="w-4 h-4 text-amber-deep" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-espresso truncate">{s.title}</div>
                          <div className="text-[10px] text-ink-faint mt-0.5">{s.seconds}s spoken</div>
                        </div>
                        <span className="text-[10px] font-bold text-amber-deep bg-champagne/70 rounded-full px-2 py-0.5 shrink-0">
                          +{s.xp} XP
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* LEARN STAGE (ULTRA-DETAILED MASTERCLASS)                      */}
          {/* ============================================================ */}
          {stage === 'learn' && topic && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
              className="pt-6 sm:pt-10"
            >
              <StepRail active={1} />

              {/* Masterclass Tabs */}
              <div className="flex items-center justify-between gap-4 mt-6 mb-6 flex-wrap">
                <div className="flex bg-ivory rounded-full border border-ink-wash/15 p-1 shadow-xs">
                  <button
                    onClick={() => setActiveTab('learn')}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition ${
                      activeTab === 'learn' ? 'bg-espresso text-ivory shadow-sm' : 'text-warm-stone hover:text-espresso'
                    }`}
                  >
                    Deep Masterclass View
                  </button>
                  <button
                    onClick={() => setActiveTab('checklist')}
                    className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider transition ${
                      activeTab === 'checklist' ? 'bg-espresso text-ivory shadow-sm' : 'text-warm-stone hover:text-espresso'
                    }`}
                  >
                    Curriculum Checklist
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* Favorite */}
                  <button
                    onClick={() => toggleFavorite(topic.id)}
                    title={library.favorites.includes(topic.id) ? 'Remove from favorites' : 'Save to favorites'}
                    aria-label="Favorite topic"
                    className={`w-10 h-10 rounded-full border grid place-items-center transition ${
                      library.favorites.includes(topic.id)
                        ? 'border-amber-deep bg-champagne/70 text-amber-deep'
                        : 'border-ink-wash/25 bg-ivory text-warm-stone hover:border-amber hover:text-amber-deep'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${library.favorites.includes(topic.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Practice later */}
                  <button
                    onClick={() => toggleQueue(topic.id)}
                    title={library.queue.includes(topic.id) ? 'Remove from practice-later' : 'Practice later'}
                    aria-label="Add to practice-later queue"
                    className={`w-10 h-10 rounded-full border grid place-items-center transition ${
                      library.queue.includes(topic.id)
                        ? 'border-amber-deep bg-champagne/70 text-amber-deep'
                        : 'border-ink-wash/25 bg-ivory text-warm-stone hover:border-amber hover:text-amber-deep'
                    }`}
                  >
                    {library.queue.includes(topic.id)
                      ? <Bookmark className="w-4 h-4 fill-current" />
                      : <BookmarkPlus className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => toggleMastered(topic.id)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition ${
                      stats.masteredTopicIds.includes(topic.id)
                        ? 'bg-[#EAF0E4] text-[#5A6B4A] border-[#CFDCC2]'
                        : 'bg-ivory text-warm-stone border-ink-wash/25 hover:border-amber'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {stats.masteredTopicIds.includes(topic.id) ? 'Mastered (Ticked)' : 'Mark as Mastered'}
                  </button>
                </div>
              </div>

              {activeTab === 'checklist' ? (
                <div className="mt-4">
                  <MasterChecklist
                    masteredTopicIds={stats.masteredTopicIds}
                    onToggleMastered={toggleMastered}
                    onSelectTopic={chooseTopicDirectly}
                  />
                </div>
              ) : (
                <>
                  {/* 1. CINEMATIC HERO IMAGE BANNER */}
                  <div data-bloom-hero className="relative rounded-[2.5rem] overflow-hidden border border-ink-wash/15 shadow-[0_24px_80px_-40px_rgba(56,38,16,0.5)] bg-espresso-ink">
                    <Parallax speed={0.08}>
                      <img
                        src={topic.image}
                        alt={topic.imageAlt}
                        className="w-full h-72 sm:h-[26rem] lg:h-[540px] -mt-8 sm:-mt-12 lg:-mt-16 object-cover filter saturate-105"
                        loading="eager" decoding="async" fetchPriority="high"
                      />
                    </Parallax>
                    <div className="img-scrim" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 lg:p-14">
                      <div className="flex flex-wrap items-center gap-2.5 mb-4">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] bg-ivory/95 text-espresso rounded-full px-3.5 py-1 shadow-sm">
                          <CatIcon name={catOf(topic.category)?.icon ?? 'Sparkles'} className="w-3.5 h-3.5 text-amber-deep" />
                          {catOf(topic.category)?.label}
                        </span>
                        <span
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] rounded-full px-3.5 py-1 text-ivory shadow-sm"
                          style={{ background: difficultyMeta[topic.difficulty].color }}
                        >
                          <Gauge className="w-3 h-3" />
                          {difficultyMeta[topic.difficulty].label} ({difficultyMeta[topic.difficulty].level})
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] bg-espresso/70 backdrop-blur text-ivory rounded-full px-3.5 py-1">
                          <BookOpen className="w-3 h-3" /> {topic.minutes}-min Masterclass · 60s on stage
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] bg-amber-deep/90 text-ivory rounded-full px-3.5 py-1 shadow-sm">
                          <Zap className="w-3 h-3 text-amber-glow" /> +{xpFor[topic.difficulty]} XP on Speech
                        </span>
                      </div>

                      <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl leading-[1.01] tracking-tight text-ivory drop-shadow-md">
                        {topic.title}
                      </h1>
                      <p className="font-editorial italic text-2xl sm:text-3xl text-amber-glow mt-2 drop-shadow">
                        {topic.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* 2. IMAGE DESCRIPTION & VISUAL SYMBOLISM BOX */}
                  <div className="mt-6 rounded-3xl border border-ink-wash/15 bg-ivory/90 p-6 sm:p-8">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-deep font-bold mb-2">
                      <Layers className="w-4 h-4" />
                      Visual Symbolism & Photographic Context
                    </div>
                    <p className="text-sm sm:text-base leading-relaxed text-warm-stone italic">
                      &ldquo;{topic.imageDescription}&rdquo;
                    </p>
                  </div>

                  {/* 3. CINEMATIC VOICE STORYTELLING PLAYER */}
                  <div className="mt-6">
                    <CinematicVoicePlayer topic={topic} />
                  </div>

                  {/* 4. HANDWRITTEN STUDY NOTES (GENERATED ART) + STICKY NOTES SECTION */}
                  <div className="mt-8">
                    {hasNoteArt(topic.id) && (() => {
                      const arts = noteArtUrls(topic.id);
                      const miniMeta = [
                        { icon: StickyNote, label: 'Pocket Short Notes', sub: 'the 10-second version, on a corkboard' },
                        { icon: Lightbulb, label: 'The Visual Explainer', sub: 'the whole idea in one drawing' },
                      ];
                      return (
                        <div className="mb-12">
                          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                            <span className="font-handwritten text-2xl font-bold text-espresso inline-flex items-center gap-2.5">
                              <NotebookPen className="w-6 h-6 text-amber-deep" />
                              Real Handwritten Study Notes
                            </span>
                            <span className="text-xs uppercase tracking-wider text-ink-faint font-semibold">
                              Inked, highlighted &amp; doodled
                            </span>
                          </div>

                          {/* HERO: full desk page */}
                          <div className="relative mx-auto max-w-3xl">
                            {/* washi tape strips */}
                            <span className="absolute -top-3 left-8 sm:left-14 w-24 sm:w-28 h-7 bg-amber-pale/80 border border-amber/25 -rotate-6 rounded-[3px] shadow-sm z-10" />
                            <span className="absolute -bottom-3 right-8 sm:right-14 w-24 sm:w-28 h-7 bg-amber-pale/80 border border-amber/25 rotate-3 rounded-[3px] shadow-sm z-10" />

                            <figure className="relative rounded-[1.75rem] border border-ink-wash/15 bg-ivory p-3 sm:p-4 shadow-[0_26px_70px_-32px_rgba(56,38,16,0.5)] -rotate-1 hover:rotate-0 transition-transform duration-500">
                              <img
                                src={arts[0]}
                                alt={`Handwritten study notes for ${topic.title}`}
                                className="w-full rounded-2xl object-cover select-none"
                                loading="lazy" decoding="async"
                              />
                              <figcaption className="pt-3 pb-1 text-center text-xs sm:text-sm text-ink-faint font-editorial italic">
                                Your desk page for &ldquo;{topic.title}&rdquo; — the full spread.
                              </figcaption>
                            </figure>
                          </div>

                          {/* MINI GALLERY: pocket shorts + visual explainer */}
                          {arts.length > 1 && (
                            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 mt-10 max-w-4xl mx-auto">
                              {arts.slice(1).map((src, i) => {
                                const meta = miniMeta[i] ?? { icon: PenLine, label: 'Extra Notes', sub: '' };
                                const MetaIcon = meta.icon;
                                return (
                                  <figure
                                    key={i}
                                    className={`relative rounded-[1.5rem] border border-ink-wash/15 bg-ivory p-2.5 sm:p-3 shadow-[0_18px_50px_-28px_rgba(56,38,16,0.45)] ${i % 2 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-500`}
                                  >
                                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-20 h-5 bg-amber-pale/80 border border-amber/25 -rotate-2 rounded-[3px] shadow-sm z-10" />
                                    <img
                                      src={src}
                                      alt={`${meta.label} for ${topic.title}`}
                                      className="w-full rounded-xl object-cover select-none"
                                      loading="lazy" decoding="async"
                                    />
                                    <figcaption className="pt-2.5 pb-1 text-center">
                                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-espresso">
                                        <MetaIcon className="w-3.5 h-3.5 text-amber-deep" />
                                        {meta.label}
                                      </span>
                                      <span className="block text-[11px] text-ink-faint italic mt-0.5">{meta.sub}</span>
                                    </figcaption>
                                  </figure>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="font-handwritten text-2xl font-bold text-espresso inline-flex items-center gap-2.5">
                          {hasNoteArt(topic.id) ? (
                            <><Zap className="w-6 h-6 text-amber-deep" /> Interactive Cheat Codes</>
                          ) : (
                            <><StickyNote className="w-6 h-6 text-amber-deep" /> Handwritten Master Notes &amp; Cheat Codes</>
                          )}
                        </span>
                      </div>
                      <span className="text-xs uppercase tracking-wider text-ink-faint font-semibold">
                        Hover to tilt — tap a note to step in
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {topic.stickyNotes.map((note, idx) => (
                        <StickyNoteCard key={idx} note={note} index={idx} />
                      ))}
                    </div>
                  </div>

                  {/* 5. MAIN CONTENT & CUSTOM 60-SECOND BLUEPRINT GRID */}
                  <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 mt-10">
                    {/* LEFT COLUMN: Deep Master Breakdown & Facts */}
                    <div className="space-y-8">
                      {/* Deep Description & Essentials */}
                      <div className="rounded-[2.5rem] border border-ink-wash/15 bg-ivory/90 backdrop-blur-md p-7 sm:p-10 shadow-sm">
                        <h3 className="font-editorial text-3xl text-espresso mb-4">The Core Philosophical Thesis</h3>
                        <p className="text-base sm:text-lg leading-[1.85] text-warm-stone font-light mb-8">
                          {topic.description}
                        </p>

                        <h4 className="flex items-center gap-2.5 font-editorial text-2xl mb-4 text-espresso">
                          <BookOpen className="w-5 h-5 text-amber-deep" /> Foundational Pillars
                        </h4>
                        <ol className="space-y-3.5">
                          {topic.keyPoints.map((k, i) => (
                            <li key={i} className="flex gap-4 bg-cream/70 rounded-2xl border border-ink-wash/10 p-4 sm:p-5">
                              <span className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-amber/25 to-champagne grid place-items-center font-display text-sm font-bold text-amber-deep shadow-xs">
                                {i + 1}
                              </span>
                              <span className="text-sm sm:text-[15px] leading-[1.75] text-espresso-soft">
                                {k}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Go Deeper Analytical Sections */}
                      <div className="rounded-[2.5rem] border border-ink-wash/15 bg-ivory/90 backdrop-blur-md p-7 sm:p-10 shadow-sm">
                        <h3 className="flex items-center gap-2.5 font-editorial text-3xl mb-6 text-espresso">
                          <Layers className="w-5 h-5 text-amber-deep" /> Analytical Deep Dives
                        </h3>
                        <div className="space-y-7">
                          {topic.deepDive.map((d, i) => (
                            <div key={i} className="relative pl-6 border-l-2 border-amber/35">
                              <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber to-amber-deep shadow-xs" />
                              <h4 className="font-editorial text-2xl text-espresso mb-2">{d.heading}</h4>
                              <p className="text-sm sm:text-base leading-[1.8] text-warm-stone">{d.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Did You Know? Surprising Facts */}
                      <div className="rounded-[2.5rem] border border-amber/30 bg-gradient-to-br from-champagne/60 via-ivory to-amber-pale/30 p-7 sm:p-9 shadow-xs">
                        <h3 className="flex items-center gap-2.5 font-editorial text-2xl mb-5 text-espresso">
                          <Lightbulb className="w-5 h-5 text-amber-deep" /> Did You Know? Fascinating Facts
                        </h3>
                        <div className="space-y-3">
                          {topic.facts.map((f, i) => (
                            <div key={i} className="flex gap-3.5 bg-ivory/80 rounded-2xl border border-amber/20 p-4 shadow-xs">
                              <Sparkles className="w-4 h-4 text-amber-deep shrink-0 mt-1" />
                              <span className="text-sm leading-relaxed text-espresso-soft">{f}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: Speech Blueprint & Vocal Masterclass */}
                    <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
                      {/* 60-SECOND SPEECH BLUEPRINT (TAILORED PER TOPIC) */}
                      <div className="rounded-[2.5rem] border border-amber/35 bg-gradient-to-br from-champagne/70 via-ivory to-amber-pale/40 p-7 sm:p-8 shadow-md">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-deep font-bold mb-1">
                          <Clock3 className="w-4 h-4" />
                          Custom Speech Blueprint
                        </div>
                        <h3 className="font-editorial text-2xl text-espresso mb-4">
                          Your 60-Second Roadmap
                        </h3>

                        <div className="space-y-3.5">
                          {topic.speechBlueprint.map((step, idx) => (
                            <div key={idx} className="bg-ivory/90 rounded-2xl border border-amber/25 p-4 shadow-xs">
                              <div className="flex items-center justify-between gap-2 mb-1.5">
                                <span className="font-display font-bold text-sm text-espresso tabular-nums bg-amber/15 px-2.5 py-0.5 rounded-full">
                                  {step.time}
                                </span>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-deep">
                                  {step.phase}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm font-medium text-espresso-soft leading-snug mb-2">
                                &ldquo;{step.scriptPrompt}&rdquo;
                              </p>
                              <div className="text-[11px] text-ink-faint italic flex items-center gap-1.5">
                                <Mic className="w-3 h-3 text-amber-deep shrink-0" />
                                <span>{step.cue}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Vocal Masterclass & Delivery Advice */}
                      <div className="rounded-[2.5rem] border border-ink-wash/15 bg-ivory/90 backdrop-blur-md p-7 sm:p-8 shadow-xs">
                        <h3 className="font-editorial text-2xl text-espresso mb-4">
                          Vocal Technique Masterclass
                        </h3>
                        <div className="space-y-3 text-xs sm:text-sm text-warm-stone">
                          <div className="p-3 bg-cream/70 rounded-xl border border-ink-wash/10">
                            <b className="text-espresso block mb-0.5 font-semibold">Suggested Vocal Tone:</b>
                            {topic.vocalTechnique.tone}
                          </div>
                          <div className="p-3 bg-cream/70 rounded-xl border border-ink-wash/10">
                            <b className="text-espresso block mb-0.5 font-semibold">Pacing & Tempo:</b>
                            {topic.vocalTechnique.tempo}
                          </div>
                          <div className="p-3 bg-cream/70 rounded-xl border border-ink-wash/10">
                            <b className="text-espresso block mb-0.5 font-semibold">Strategic Power Pause:</b>
                            {topic.vocalTechnique.powerPause}
                          </div>
                          <div className="p-3 bg-champagne/50 rounded-xl border border-amber/20">
                            <b className="text-amber-deep block mb-0.5 font-semibold">Expert Delivery Advice:</b>
                            {topic.vocalTechnique.advice}
                          </div>
                        </div>
                      </div>

                      {/* Vocabulary Bank */}
                      <div className="rounded-[2.5rem] border border-ink-wash/15 bg-ivory/90 backdrop-blur-md p-7 sm:p-8 shadow-xs">
                        <h4 className="font-editorial text-xl text-espresso mb-3">Elevated Vocabulary</h4>
                        <div className="flex flex-wrap gap-2">
                          {topic.vocabulary.map(v => (
                            <span
                              key={v}
                              className="text-xs sm:text-sm font-editorial italic bg-cream border border-amber/25 text-warm-stone rounded-full px-3.5 py-1.5 shadow-xs"
                            >
                              {v}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Your Notes Pad */}
                      <div className="rounded-[2.5rem] border border-ink-wash/15 bg-ivory/90 backdrop-blur-md p-7 sm:p-8 shadow-xs">
                        <h4 className="flex items-center gap-2 font-editorial text-xl text-espresso mb-2">
                          <PenLine className="w-4 h-4 text-amber-deep" /> Jot Your Key Angles
                        </h4>
                        <textarea
                          value={notes}
                          onChange={e => updateNotes(e.target.value)}
                          placeholder={'Hook: ...\nCore idea: ...\nFinal punchline: ...'}
                          className="w-full h-36 bg-cream/70 rounded-2xl border border-ink-wash/15 p-4 text-xs sm:text-sm leading-relaxed placeholder:text-ink-wash/70 focus:outline-none focus:border-amber/50 focus:ring-4 focus:ring-amber/10 resize-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div className="flex flex-col sm:flex-row gap-3.5 mt-10">
                    <button
                      onClick={() => setStage('speak')}
                      className="group flex-1 inline-flex items-center justify-center gap-3.5 bg-espresso text-ivory py-5 rounded-2xl font-medium tracking-wide shadow-2xl shadow-espresso/30 hover:bg-espresso-ink hover:scale-105 active:scale-95 transition duration-300"
                    >
                      <Mic className="w-5 h-5 text-amber-glow" />
                      <span>Ready to Speak — Begin 60 Seconds</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </button>

                    <button
                      onClick={() => handleStartRoulette()}
                      className="inline-flex items-center justify-center gap-2.5 px-8 py-5 rounded-2xl border border-ink-wash/25 bg-ivory text-warm-stone font-medium hover:border-amber hover:text-amber-deep transition"
                    >
                      <Shuffle className="w-4 h-4" /> Draw Another Topic
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* SPEAK STAGE (PRECISION TIMER + CUSTOM ROADMAP)                */}
          {/* ============================================================ */}
          {stage === 'speak' && topic && (
            <motion.div
              key="speak"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease }}
              className="pt-6 sm:pt-10"
            >
              <StepRail active={2} />

              <div className="mt-8 rounded-[2.5rem] border border-ink-wash/15 bg-gradient-to-b from-ivory via-parchment/60 to-rose-fog/30 shadow-[0_24px_90px_-44px_rgba(56,38,16,0.4)] p-7 sm:p-12 lg:p-14 overflow-hidden">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                  {/* LEFT: Topic Blueprint & Custom Roadmap */}
                  <div className="order-2 lg:order-1">
                    <div className="flex items-center gap-3.5 mb-4">
                      <img src={topic.image} alt="" className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                      <div>
                        <span className="text-[11px] uppercase tracking-[0.2em] text-ink-faint font-bold block">
                          Speaking On
                        </span>
                        <span
                          className="inline-block mt-0.5 text-[10px] font-bold uppercase text-ivory rounded-full px-2.5 py-0.5 shadow-xs"
                          style={{ background: difficultyMeta[topic.difficulty].color }}
                        >
                          {difficultyMeta[topic.difficulty].label} Difficulty
                        </span>
                      </div>
                    </div>

                    <h2 className="font-display text-3xl sm:text-5xl leading-[1.04] tracking-tight mb-2 text-espresso">
                      {topic.title}
                    </h2>
                    <p className="font-editorial italic text-xl text-amber-deep mb-6">
                      {topic.subtitle}
                    </p>

                    {/* LIVE 60-SECOND ROADMAP CUES */}
                    <div className="space-y-2.5 mb-6">
                      <div className="text-xs uppercase tracking-wider text-amber-deep font-bold">
                        Custom Speaking Timestamps:
                      </div>
                      {topic.speechBlueprint.map((step, idx) => (
                        <div key={idx} className="flex gap-3 bg-cream/80 rounded-xl border border-ink-wash/10 p-3">
                          <span className="font-display font-bold text-xs text-espresso bg-amber/20 px-2 py-0.5 rounded shrink-0">
                            {step.time}
                          </span>
                          <div className="text-xs leading-snug">
                            <span className="font-bold text-espresso">{step.phase}: </span>
                            <span className="text-warm-stone">&ldquo;{step.scriptPrompt}&rdquo;</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {notes.trim() && (
                      <div className="rounded-2xl border border-amber/25 bg-champagne/50 p-4 mb-6">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] text-amber-deep font-bold mb-1">
                          Your Personal Notes:
                        </h4>
                        <p className="text-xs leading-relaxed text-warm-stone whitespace-pre-wrap">{notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {['No filler words', 'Embrace the pause', 'Eye contact', 'Conclude with certainty'].map(t => (
                        <span key={t} className="text-xs text-warm-stone bg-ivory border border-ink-wash/15 rounded-full px-3.5 py-1.5 shadow-xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: CIRCULAR TIMER */}
                  <div className="order-1 lg:order-2 flex justify-center">
                    <SpeakTimer duration={60} onComplete={handleComplete} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => setStage('learn')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl border border-ink-wash/25 bg-ivory text-warm-stone font-medium hover:border-amber hover:text-amber-deep transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Back to Masterclass View
                </button>
                <div className="flex-1 flex flex-col gap-1.5">
                  <button
                    onClick={claimVictory}
                    className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-espresso/90 text-ivory font-medium hover:bg-espresso transition shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Finished Speaking — Claim Victory
                  </button>
                  {claimWarn !== null && (
                    <p role="status" className="text-center text-xs font-semibold text-[#A34A2A]">
                      Own the silence first — at least {MIN_CLAIM_SECONDS}s at the lectern. {claimWarn}s to go.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ============================================================ */}
          {/* DONE STAGE (VICTORY CELEBRATION & XP GAIN)                    */}
          {/* ============================================================ */}
          {stage === 'done' && topic && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease }}
              className="pt-6 sm:pt-10"
            >
              <StepRail active={3} />

              <div className="mt-8 relative overflow-hidden rounded-[2.5rem] border border-amber/30 bg-gradient-to-br from-champagne/80 via-ivory to-amber-pale/50 shadow-[0_24px_90px_-44px_rgba(190,139,63,0.7)] p-9 sm:p-16 text-center">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber/15 blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center justify-center mb-6">
                    <WaxSeal size={104} label="Topic mastered" />
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-amber-deep font-bold mb-5 flex items-center justify-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5" /> Sealed &amp; stamped into your Master Checklist
                  </p>

                  {lastGain?.leveledTo && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 bg-espresso text-ivory rounded-full px-5 py-2 text-sm font-semibold mb-4 shadow-lg"
                    >
                      <Trophy className="w-4 h-4 text-amber-glow" /> Level Up! You attained Level {lastGain.leveledTo}: {level.current.title}
                    </motion.div>
                  )}

                  <h2 className="font-display text-4xl sm:text-6xl tracking-tight leading-none mb-3 text-espresso">
                    60-Second Masterclass Complete
                  </h2>

                  <p className="text-warm-stone text-lg max-w-lg mx-auto leading-relaxed mb-4">
                    You articulated <span className="font-editorial italic font-bold text-espresso">{topic.title}</span>. That is one more victory for your concision and voice.
                  </p>

                  {lastGain && (
                    <div className="inline-flex items-center gap-2 text-amber-deep font-bold text-lg mb-8 bg-ivory/80 px-4 py-1.5 rounded-full border border-amber/30 shadow-xs">
                      <Zap className="w-5 h-5 text-amber-deep" /> +{lastGain.xp} XP Earned
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-3.5 max-w-lg mx-auto mb-10">
                    {[
                      { v: `${stats.streak} Days`, l: 'Streak' },
                      { v: `Lv ${level.current.level}`, l: level.current.title },
                      { v: `${masteredCount}/32`, l: 'Topics Mastered' },
                    ].map(s => (
                      <div key={s.l} className="bg-ivory/90 rounded-2xl border border-ink-wash/12 py-4 shadow-xs">
                        <div className="font-display text-2xl sm:text-3xl leading-none tabular-nums text-espresso font-bold">
                          {s.v}
                        </div>
                        <div className="text-[10px] uppercase tracking-[0.14em] text-ink-faint mt-1.5 font-semibold">
                          {s.l}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
                    <Magnetic strength={0.28}>
                      <button
                        onClick={() => handleStartRoulette()}
                        className="group inline-flex items-center justify-center gap-3 bg-espresso text-ivory px-8 py-4 rounded-full font-medium shadow-xl shadow-espresso/25 hover:bg-espresso-ink hover:scale-105 active:scale-95 transition duration-300"
                      >
                        <Shuffle className="w-4 h-4 group-hover:rotate-180 transition duration-500" />
                        <span>Draw Next Topic</span>
                      </button>
                    </Magnetic>

                    <button
                      onClick={() => setStage('learn')}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border border-ink-wash/25 bg-ivory text-warm-stone font-medium hover:border-amber hover:text-amber-deep transition"
                    >
                      Review Masterclass Content
                    </button>

                    <button
                      onClick={goDashboard}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-warm-stone font-medium hover:text-espresso transition"
                    >
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ================= RANDOM ROULETTE ORACLE MODAL ================= */}
      <RouletteModal
        isOpen={isRouletteOpen}
        filterCategory={filter}
        filterDifficulty={diff}
        onSelect={handleSelectTopicFromDraw}
        onClose={() => setIsRouletteOpen(false)}
      />

      {/* ================= SETTINGS + CURSOR ================= */}
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <InstallPrompt />
      <CursorPreview />
      <BloomPortal />
      <CustomCursor />

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 border-t border-ink-wash/10 bg-cream/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 flex flex-col lg:flex-row items-center justify-between gap-7">
          <div className="flex items-center gap-2.5">
            <LogoMark className="w-8 h-8 drop-shadow-sm" />
            <span className="font-editorial text-xl font-bold">Verbalis</span>
          </div>

          {/* The maker's signature — one quiet flourish, front and centre */}
          <div className="flex flex-col items-center -my-1 select-none">
            <span className="text-[9px] uppercase tracking-[0.34em] text-ink-faint font-bold mb-0.5">
              Designed &amp; built by
            </span>
            <span className="relative inline-block">
              <span className="font-handwritten font-bold text-[42px] leading-none signature-stream">
                Aryan
              </span>
              {/* hand-drawn flourish underline */}
              <svg
                viewBox="0 0 120 12"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[110px] h-[10px] text-amber opacity-80"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 8 C 30 2, 60 10, 116 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="mt-3 flex items-center gap-1.5 text-[11px] text-warm-stone">
              <span className="text-ink-faint">CEO of</span>
              <a
                href="https://examcodes.site"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-semibold text-espresso border-b border-amber/50 hover:text-amber-deep hover:border-amber-deep transition"
              >
                examcodes.site <ArrowUpRight className="w-3 h-3" />
              </a>
              <span className="mx-1 text-ink-wash">·</span>
              <a
                href="https://ptflaryan.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 font-semibold text-espresso border-b border-amber/50 hover:text-amber-deep hover:border-amber-deep transition"
              >
                portfolio <ArrowUpRight className="w-3 h-3" />
              </a>
            </span>
          </div>

          <p className="text-xs text-ink-faint text-center sm:text-right">
            {topics.length} Master Topics · Cinematic Narration & Visual Descriptions · 10 Orator Ranks · Responsive on all devices
          </p>
        </div>
      </footer>
    </div>
  );
}

function StepRail({ active }: { active: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Masterclass', icon: BookOpen },
    { n: 2, label: 'Speak 60s', icon: Mic },
    { n: 3, label: 'Victory', icon: CheckCircle2 },
  ];
  return (
    <div className="flex items-center gap-2 sm:gap-4 max-w-2xl mx-auto mb-6">
      {steps.map((s, i) => {
        const done = active > s.n;
        const on = active === s.n;
        return (
          <div key={s.n} className="flex items-center gap-2 sm:gap-4 flex-1 last:flex-none">
            <div
              className={`flex items-center gap-2.5 rounded-full pl-2 pr-4 py-2 border transition ${
                on
                  ? 'bg-espresso text-ivory border-espresso shadow-lg shadow-espresso/20'
                  : done
                  ? 'bg-champagne text-amber-deep border-amber/30'
                  : 'bg-ivory/70 text-ink-faint border-ink-wash/15'
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full grid place-items-center shrink-0 ${
                  on ? 'bg-ivory/15' : done ? 'bg-amber/20' : 'bg-cream'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{s.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px bg-gradient-to-r from-ink-wash/25 to-ink-wash/10 min-w-2" />
            )}
          </div>
        );
      })}
    </div>
  );
}
