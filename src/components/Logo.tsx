import { useId } from 'react';
/**
 * Verbalis LogoMark — "The Fibonacci Voice Seal", atelier edition
 *
 * Apple-tier craft notes:
 *  · True squircle silhouette (parabolic corner curves → continuous
 *    curvature, the iOS-icon feeling) instead of a plain rounded rect.
 *  · Cinematic lighting: top-left specular gold, quiet falloff at the
 *    bottom edge, a whisper of top-face sheen — depth you feel, not see.
 *  · Golden-ratio construction preserved (phi = 1.618): five ivory
 *    voice-wave bars, Fibonacci heights 34 : 21 : 13 : 21 : 34, framing
 *    the "V" — Verbalis, Voice, Victory.
 *  · One whisper ripple ring only. Restraint reads as luxury.
 *  · Hover sheen (.vb-sheen) rides the parent's `group` class via CSS —
 *    GPU transform-only, still under reduced motion and touch.
 *
 * Pure inline SVG — infinite resolution, zero requests.
 */
interface LogoMarkProps {
  className?: string;
  title?: string;
}

// parabolic-arc squircle: continuous curvature from edge to corner
const SQUIRCLE =
  'M32 1.6 Q1.6 1.6 1.6 32 Q1.6 62.4 32 62.4 Q62.4 62.4 62.4 32 Q62.4 1.6 32 1.6 Z';
const SQUIRCLE_INNER =
  'M32 3.2 Q3.2 3.2 3.2 32 Q3.2 60.8 32 60.8 Q60.8 60.8 60.8 32 Q60.8 3.2 32 3.2 Z';

export default function LogoMark({ className = 'w-10 h-10', title = 'Verbalis' }: LogoMarkProps) {
  // every instance gets its own defs namespace — duplicate IDs across the
  // header/footer logos are invalid HTML and one day they'd diverge
  const uid = useId().replace(/:/g, '');
  const goldId = `vbGold-${uid}`;
  const sheenId = `vbSheen-${uid}`;
  const topLightId = `vbTopLight-${uid}`;
  const shadeId = `vbShade-${uid}`;
  const barLightId = `vbBarLight-${uid}`;
  const clipId = `vbSealClip-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={`${title} logo`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{`${title} — Master of Speech`}</title>
      <defs>
        {/* cinematic gold: light lands top-left, settles low-right */}
        <linearGradient id={goldId} x1="0.08" y1="0" x2="0.82" y2="1">
          <stop offset="0%" stopColor="#F5DC9F" />
          <stop offset="34%" stopColor="#E3B160" />
          <stop offset="68%" stopColor="#B7812F" />
          <stop offset="100%" stopColor="#7E5419" />
        </linearGradient>
        {/* top-face specular veil */}
        <linearGradient id={topLightId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.42" />
          <stop offset="38%" stopColor="#FFFFFF" stopOpacity="0.10" />
          <stop offset="62%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        {/* gravity at the bottom edge */}
        <linearGradient id={shadeId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="76%" stopColor="#3C2608" stopOpacity="0" />
          <stop offset="100%" stopColor="#3C2608" stopOpacity="0.26" />
        </linearGradient>
        {/* bars: ivory with the faintest warm glint at their crowns */}
        <linearGradient id={barLightId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF7" />
          <stop offset="100%" stopColor="#F3E7CE" />
        </linearGradient>
        <linearGradient id={sheenId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <clipPath id={clipId}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>

      {/* the seal body */}
      <path d={SQUIRCLE} fill={`url(#${goldId})`} />

      {/* lighting passes, clipped to the seal */}
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="64" height="64" fill={`url(#${topLightId})`} />
        <rect x="0" y="0" width="64" height="64" fill={`url(#${shadeId})`} />
        {/* one whisper ripple — voice made visible, nothing more
            (fill="none" is not optional: default fill is black) */}
        <circle cx="32" cy="32" r="23.5" fill="none" stroke="#FFF6DE" strokeOpacity="0.20" strokeWidth="0.9" />
        {/* hover sheen sweep (animated by CSS when a .group ancestor is hovered) */}
        <g className="vb-sheen" opacity="0">
          <rect x="-26" y="-16" width="20" height="96" fill={`url(#${sheenId})`} transform="rotate(20)" />
        </g>
      </g>

      {/* jewel hairline — inset, breath-thin */}
      <path d={SQUIRCLE_INNER} fill="none" stroke="#FFF9E8" strokeOpacity="0.4" strokeWidth="0.8" />

      {/* the V of voice — Fibonacci heights 34 : 21 : 13 : 21 : 34 */}
      <g fill={`url(#${barLightId})`}>
        <rect x="9.9"  y="15"   width="6.1" height="34" rx="3.05" />
        <rect x="19.1" y="21.5" width="6.1" height="21" rx="3.05" />
        <rect x="28.95" y="26"  width="6.1" height="13" rx="3.05" />
        <rect x="38.8" y="21.5" width="6.1" height="21" rx="3.05" />
        <rect x="48"   y="15"   width="6.1" height="34" rx="3.05" />
      </g>
    </svg>
  );
}
