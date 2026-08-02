import { useId } from 'react';
/**
 * Verbalis LogoMark — "The Fibonacci Voice Seal"
 *
 * Golden-ratio construction (phi = 1.618):
 *  · Antique-gold squircle (corner radius = 64 / phi^3 ≈ 15)
 *  · Five ivory voice-wave bars with Fibonacci-approximant heights
 *    34 : 21 : 13 : 21 : 34  (≈ phi^2 : phi : 1 : phi : phi^2)
 *    forming a "V" — Verbalis, Voice, Victory
 *  · Halo arcs at golden radii (r, r·phi) behind the bars, clipped by the seal
 *
 * Pure inline SVG — infinite resolution, zero requests.
 */
interface LogoMarkProps {
  className?: string;
  title?: string;
}

export default function LogoMark({ className = 'w-10 h-10', title = 'Verbalis' }: LogoMarkProps) {
  // every instance gets its own defs namespace — duplicate IDs across the
  // header/footer logos are invalid HTML and one day they'd diverge
  const uid = useId().replace(/:/g, '');
  const goldId = `vbGold-${uid}`;
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
        <linearGradient id={goldId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E9C582" />
          <stop offset="52%" stopColor="#BE8B3F" />
          <stop offset="100%" stopColor="#8A5F26" />
        </linearGradient>
        <clipPath id={clipId}>
          <rect x="0" y="0" width="64" height="64" rx="15" />
        </clipPath>
      </defs>

      {/* the seal */}
      <rect x="0" y="0" width="64" height="64" rx="15" fill="url(#{goldId})" />

      {/* golden halo ripples — r = 25 and r·phi ≈ 40.5, clipped to the seal */}
      <g clipPath="url(#{clipId})">
        <circle cx="32" cy="32" r="25" stroke="#FFFFFF" strokeOpacity="0.30" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="40.5" stroke="#FFFFFF" strokeOpacity="0.13" strokeWidth="1.5" />
      </g>

      {/* hairline jewel edge */}
      <rect x="1.5" y="1.5" width="61" height="61" rx="13.5" fill="none" stroke="#FFFFFF" strokeOpacity="0.22" strokeWidth="1.2" />

      {/* the V of voice — Fibonacci heights 34 : 21 : 13 : 21 : 34 */}
      <g fill="#FCFAF5">
        <rect x="9.6"  y="15"   width="6" height="34" rx="3" />
        <rect x="19.3" y="21.5" width="6" height="21" rx="3" />
        <rect x="29"   y="25.5" width="6" height="13" rx="3" />
        <rect x="38.7" y="21.5" width="6" height="21" rx="3" />
        <rect x="48.4" y="15"   width="6" height="34" rx="3" />
      </g>
    </svg>
  );
}
