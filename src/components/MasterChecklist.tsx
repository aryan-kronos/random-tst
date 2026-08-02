import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Circle, Search, ArrowRight,
  Award,
} from 'lucide-react';
import { topics, categories, difficultyMeta, type Topic, type CategoryId, type Difficulty } from '../data/topics';
import { CatIcon } from './Icon';
import { previewTopic, clearPreview } from './CursorPreview';
import WaxSeal from './WaxSeal';

interface Props {
  masteredTopicIds: string[];
  onToggleMastered: (id: string) => void;
  onSelectTopic: (topic: Topic) => void;
}

export default function MasterChecklist({
  masteredTopicIds,
  onToggleMastered,
  onSelectTopic,
}: Props) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<CategoryId | 'all'>('all');
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'mastered' | 'unmastered'>('all');

  const filteredTopics = topics.filter(t => {
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (catFilter !== 'all' && t.category !== catFilter) return false;
    if (diffFilter !== 'all' && t.difficulty !== diffFilter) return false;
    const isDone = masteredTopicIds.includes(t.id);
    if (statusFilter === 'mastered' && !isDone) return false;
    if (statusFilter === 'unmastered' && isDone) return false;
    return true;
  });

  const total = topics.length;
  const mastered = masteredTopicIds.length;
  const progressPct = Math.round((mastered / total) * 100);

  return (
    <div className="rounded-[2.5rem] border border-ink-wash/15 bg-ivory/90 backdrop-blur-md p-7 sm:p-10 lg:p-12 shadow-[0_20px_70px_-30px_rgba(56,38,16,0.15)]">
      {/* Header & Global Progress Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-8 border-b border-ink-wash/10">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-amber-deep font-bold mb-2">
            <Award className="w-4 h-4" />
            Curriculum Mastery Tracker
          </div>
          <h3 className="font-display text-3xl sm:text-4xl text-espresso tracking-tight">
            The 32 Master Topics Checklist
          </h3>
          <p className="text-sm sm:text-base text-warm-stone mt-1 font-light">
            Tick off each topic as you learn and speak on it. Master all 32 to claim the Grand Orator crown.
          </p>
        </div>

        {/* Big Progress Metric */}
        <div className="bg-cream rounded-2xl border border-amber/25 p-5 min-w-[280px]">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs uppercase tracking-wider text-ink-faint font-semibold">Mastery Status</span>
            <span className="font-display text-2xl text-espresso font-bold tabular-nums">
              {mastered} <span className="text-sm font-normal text-ink-faint">/ {total}</span>
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-ink-wash/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber via-amber-glow to-amber-deep transition-[width] duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="text-[11px] text-right text-amber-deep font-semibold mt-1">
            {progressPct}% Completed
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="py-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search topics, themes, keywords…"
            className="w-full bg-cream/80 border border-ink-wash/20 rounded-full pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-amber/50 focus:ring-2 focus:ring-amber/10 placeholder:text-ink-wash/70"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {/* Status filter */}
          <div className="flex bg-cream rounded-full border border-ink-wash/15 p-1 shrink-0">
            {(['all', 'unmastered', 'mastered'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                  statusFilter === st ? 'bg-espresso text-ivory shadow-sm' : 'text-warm-stone hover:text-espresso'
                }`}
              >
                {st === 'all' ? 'All (32)' : st === 'mastered' ? `Done (${mastered})` : `Remaining (${total - mastered})`}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            aria-label="Filter by field"
            value={catFilter}
            onChange={e => setCatFilter(e.target.value as CategoryId | 'all')}
            className="bg-cream text-xs font-semibold uppercase tracking-wider text-warm-stone border border-ink-wash/20 rounded-full px-3 py-2 focus:outline-none shrink-0 cursor-pointer"
          >
            <option value="all">All Fields</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {/* Difficulty Dropdown */}
          <select
            aria-label="Filter by difficulty"
            value={diffFilter}
            onChange={e => setDiffFilter(e.target.value as Difficulty | 'all')}
            className="bg-cream text-xs font-semibold uppercase tracking-wider text-warm-stone border border-ink-wash/20 rounded-full px-3 py-2 focus:outline-none shrink-0 cursor-pointer"
          >
            <option value="all">All Levels</option>
            <option value="Gentle">Easy (Low)</option>
            <option value="Moderate">Balanced (Medium)</option>
            <option value="Bold">Challenging (High)</option>
          </select>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2 eclipse-grid">
        <AnimatePresence>
          {filteredTopics.map((t, idx) => {
            const isDone = masteredTopicIds.includes(t.id);
            const cat = categories.find(c => c.id === t.category);
            const diff = difficultyMeta[t.difficulty];

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25, delay: Math.min(idx, 6) * 0.02 }}
                onMouseEnter={() => previewTopic(t.image, t.title)}
                onMouseLeave={() => clearPreview()}
                className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300 ${
                  isDone
                    ? 'bg-champagne/40 border-amber/30 shadow-xs'
                    : 'bg-cream/70 border-ink-wash/12 hover:border-amber/40 hover:bg-ivory hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                <div>
                  {/* Top row: Checkbox + Tags */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMastered(t.id);
                      }}
                      className="p-1 -m-1 text-espresso hover:text-amber-deep transition shrink-0"
                      title={isDone ? 'Mark as unmastered' : 'Mark as mastered'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-[#5A6B4A] fill-[#EAF0E4]" />
                      ) : (
                        <Circle className="w-5 h-5 text-ink-wash/60 group-hover:text-amber transition" />
                      )}
                    </button>

                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      {isDone && <WaxSeal mini />}
                      <span className="inline-flex items-center gap-1 rounded-full bg-ivory px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-faint border border-ink-wash/10">
                        <CatIcon name={cat?.icon || 'Sparkles'} className="w-2.5 h-2.5 text-amber-deep" />
                        {cat?.label}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ivory"
                        style={{ background: diff.color }}
                      >
                        {diff.label}
                      </span>
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <h4
                    role="button"
                    tabIndex={0}
                    onClick={() => onSelectTopic(t)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectTopic(t); } }}
                    className={`font-editorial text-xl leading-snug cursor-pointer transition focus:outline-none focus-visible:ring-2 focus-visible:ring-amber/60 rounded ${
                      isDone ? 'line-through text-warm-stone opacity-75' : 'text-espresso group-hover:text-amber-deep'
                    }`}
                  >
                    {t.title}
                  </h4>
                  <p className="font-editorial italic text-xs text-amber-deep/80 mt-0.5 mb-3 line-clamp-1">
                    {t.subtitle}
                  </p>
                </div>

                {/* Bottom Action bar */}
                <div className="pt-3 border-t border-ink-wash/10 flex items-center justify-between gap-2 mt-2">
                  <span className="text-[10px] uppercase tracking-wider text-ink-faint font-semibold">
                    {t.minutes} min deep dive
                  </span>
                  <button
                    onClick={() => onSelectTopic(t)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-espresso hover:text-amber-deep transition"
                  >
                    <span>Master</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredTopics.length === 0 && (
        <div className="py-12 text-center text-warm-stone">
          <p className="font-editorial text-xl italic">No topics match your current filter.</p>
          <button
            onClick={() => {
              setSearch('');
              setCatFilter('all');
              setDiffFilter('all');
              setStatusFilter('all');
            }}
            className="mt-3 text-xs uppercase tracking-wider font-semibold text-amber-deep underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
