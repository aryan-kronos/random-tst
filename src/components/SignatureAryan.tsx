import { useId } from 'react';

/**
 * SignatureAryan — an invisible hand writes the name, live, forever.
 *
 * Each letter is a stroked glyph: it traces its own outline in pen order
 * (stroke-dashoffset draw), then floods with gold ink, the completed
 * signature holds long enough to be read, releases into the dark, and the
 * hand starts over. One endless ceremony ≈ 6.8 seconds.
 *
 * Beneath: the flourish underline draws itself last, like the underline
 * every signature gets.
 */
const LETTERS = ['A', 'r', 'y', 'a', 'n'];
const CYCLE = 6.8; // seconds — the full write → hold → release loop
const PER_LETTER = 0.62; // stagger between strokes

export default function SignatureAryan({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const inkId = `sigInk-${uid}`;
  const rimId = `sigRim-${uid}`;
  return (
    <svg
      viewBox="0 0 264 96"
      className={`w-[212px] sm:w-[232px] h-auto ${className}`}
      role="img"
      aria-label="Aryan — handwritten signature"
    >
      <defs>
        {/* liquid gold that fills the letterforms once traced */}
        <linearGradient id={inkId} x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0%" stopColor="#8F6524" />
          <stop offset="45%" stopColor="#E8C276" />
          <stop offset="72%" stopColor="#FFF4D4" />
          <stop offset="100%" stopColor="#B7812F" />
        </linearGradient>
        {/* the pen stroke itself — bright at the nib, molten along the pull */}
        <linearGradient id={rimId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#BE8B3F" />
          <stop offset="100%" stopColor="#7E5419" />
        </linearGradient>
      </defs>

      <text
        x="14"
        y="68"
        className="sig-word"
        style={{ fontFamily: "Caveat, 'Segoe Script', cursive", fontSize: 74, fontWeight: 700, letterSpacing: 2 }}
        fill={`url(#${inkId})`}
        stroke={`url(#${rimId})`}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {LETTERS.map((ch, i) => (
          <tspan
            key={i}
            className="sig-letter-flow"
            style={{ animationDelay: `${(i * PER_LETTER).toFixed(2)}s, ${(i * PER_LETTER).toFixed(2)}s`, animationDuration: `${CYCLE}s, ${CYCLE}s` }}
          >
            {ch}
          </tspan>
        ))}
      </text>

      {/* the flourish — drawn last, like the underline a signature earns */}
      <path
        d="M14 84 C 60 76, 140 90, 218 79"
        className="sig-flourish-flow"
        style={{ animationDelay: `${(LETTERS.length * PER_LETTER + 0.15).toFixed(2)}s`, animationDuration: `${CYCLE}s` }}
        fill="none"
        stroke={`url(#${rimId})`}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
