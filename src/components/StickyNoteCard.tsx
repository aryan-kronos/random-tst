import { motion } from 'framer-motion';
import type { StickyNote } from '../data/topics';

interface Props {
  note: StickyNote;
  index: number;
}

const colorStyles = {
  yellow: 'bg-[#FFF9DB] border-[#E8DEAF] text-[#4A3B18]',
  rose: 'bg-[#FFEAE8] border-[#E8C5C0] text-[#542B28]',
  amber: 'bg-[#FDF0D5] border-[#E2CDA2] text-[#483316]',
  sage: 'bg-[#EBF2E4] border-[#CCDCC0] text-[#304024]',
  blue: 'bg-[#EAF3FA] border-[#C5DAEB] text-[#243B4E]',
};

export default function StickyNoteCard({ note }: Props) {
  const rotate = note.rotate ?? (Math.sin(note.title.length) > 0 ? 1.5 : -1.5);

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={`relative p-5 sm:p-6 rounded-2xl border paper-curl ${colorStyles[note.color]} transition-shadow duration-300`}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {/* Tape effect on top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-white/60 border border-amber/20 backdrop-blur-xs rotate-[-1deg] shadow-xs" />

      {/* Tag Badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="font-handwritten text-lg font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-black/5">
          {note.tag}
        </span>
        <span className="w-2 h-2 rounded-full bg-current opacity-30" />
      </div>

      {/* Note Title */}
      <h4 className="font-handwritten text-2xl font-bold leading-tight mb-2">
        {note.title}
      </h4>

      {/* Handwritten Body */}
      <p className="font-handwritten text-xl leading-[1.35] opacity-90">
        {note.body}
      </p>
    </motion.div>
  );
}
