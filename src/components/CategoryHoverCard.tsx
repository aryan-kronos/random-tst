import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, ChevronRight } from 'lucide-react';
import type { Category, Topic } from '../data/topics';
import { CatIcon } from './Icon';
import { difficultyMeta } from '../data/topics';
import { previewTopic, clearPreview } from './CursorPreview';

interface Props {
  category: Category;
  topics: Topic[];
  isFilterActive: boolean;
  onDrawCategory: () => void;
  onSelectTopic: (topic: Topic) => void;
}

export default function CategoryHoverCard({
  category,
  topics,
  isFilterActive,
  onDrawCategory,
  onSelectTopic,
}: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredTopicImg, setHoveredTopicImg] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeImage = hoveredTopicImg || category.coverImage;

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        previewTopic(category.coverImage, category.label);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setHoveredTopicImg(null);
        clearPreview();
      }}
      className={`group relative rounded-3xl border bg-ivory/90 backdrop-blur-md overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_60px_-20px_rgba(56,38,16,0.35)] ${
        isFilterActive ? 'border-amber shadow-[0_10px_40px_-15px_rgba(190,139,63,0.5)] ring-2 ring-amber/20' : 'border-ink-wash/12'
      }`}
    >
      {/* DESKTOP CURSOR HOVER IMAGE REVEAL (Smooth Fade In) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out z-0 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={activeImage}
          alt={category.label}
          className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out filter saturate-110"
          loading="lazy"
        />
        {/* Rich dark luxury gradient overlay so text remains 100% legible */}
        <div className="img-scrim-strong" />
      </div>

      {/* CARD CONTENT */}
      <div className="relative z-10 p-6 sm:p-7 flex flex-col justify-between h-full transition-colors duration-500">
        <div>
          {/* Top header row */}
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-2xl grid place-items-center transition-all duration-300 ${
                isHovered
                  ? 'bg-amber text-ivory shadow-lg shadow-amber/40 scale-110'
                  : 'bg-gradient-to-br from-amber/18 to-champagne text-amber-deep shadow-inner'
              }`}
            >
              <CatIcon name={category.icon} className="w-5 h-5" />
            </div>

            <span
              className={`text-[11px] font-semibold tabular-nums rounded-full px-2.5 py-1 border transition-colors duration-300 ${
                isHovered
                  ? 'bg-ivory/20 text-ivory border-white/20 backdrop-blur-xs'
                  : 'bg-cream/80 text-ink-faint border-ink-wash/10'
              }`}
            >
              {topics.length} topics
            </span>
          </div>

          {/* Title & Blurb */}
          <h4
            className={`font-editorial text-2xl sm:text-3xl leading-tight mb-1.5 transition-colors duration-300 ${
              isHovered ? 'text-ivory' : 'text-espresso'
            }`}
          >
            {category.label}
          </h4>
          <p
            className={`text-sm mb-5 transition-colors duration-300 ${
              isHovered ? 'text-amber-pale/90' : 'text-ink-faint'
            }`}
          >
            {category.blurb}
          </p>
        </div>

        {/* Buttons */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={onDrawCategory}
              className={`flex-1 inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider rounded-full py-2.5 transition-all duration-300 ${
                isHovered
                  ? 'bg-amber text-ivory hover:bg-amber-deep shadow-md shadow-amber/30'
                  : 'bg-espresso text-ivory hover:bg-espresso-ink'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5" /> Draw This Field
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-4 py-2.5 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                isHovered
                  ? 'border-white/30 text-ivory hover:bg-white/10'
                  : 'border-ink-wash/20 text-warm-stone hover:border-amber hover:text-amber-deep'
              }`}
            >
              {isExpanded ? 'Hide' : 'Explore'}
            </button>
          </div>

          {/* Collapsible Topics List with Sub-item Image Hover */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-1.5">
                  {topics.map(t => (
                    <button
                      key={t.id}
                      onMouseEnter={() => {
                        setHoveredTopicImg(t.image);
                        previewTopic(t.image, t.title);
                      }}
                      onMouseLeave={() => {
                        setHoveredTopicImg(null);
                        previewTopic(category.coverImage, category.label);
                      }}
                      onClick={() => onSelectTopic(t)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs transition group/item ${
                        isHovered
                          ? 'bg-white/10 border-white/10 text-ivory hover:bg-white/20'
                          : 'bg-cream/70 border-ink-wash/8 text-espresso-soft hover:border-amber/40 hover:bg-champagne/40'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: difficultyMeta[t.difficulty].color }}
                      />
                      <span className="leading-snug truncate flex-1">{t.title}</span>
                      <ChevronRight className="w-3 h-3 text-amber-deep shrink-0 group-hover/item:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
