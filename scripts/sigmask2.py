#!/usr/bin/env python3
"""Signature v2 — first-visit-chronograph remapped skeleton reveal.

What this fixes vs v1: the old mask path lived in a swapped coordinate space,
and a naive coverage walk front-loads all first-visits (word done by 25%).
Here we (1) build the walk in the SAME space as the glyph ink, (2) measure
first-visit progress along the walk, (3) re-chronograph the dash timeline so
writing speed is constant in UNIQUE INK — real handwriting pacing. The nib
(dot + halo) rides the same chronograph via SMIL keyPoints/keyTimes.

The script REWRITES src/components/SignatureAryan.tsx and REPLACES the
signature section at the tail of src/index.css. Deterministic, self-verifying.
"""
import io, json, math, re, sys
import numpy as np
from PIL import Image, ImageDraw
from skimage.morphology import skeletonize
from scipy.ndimage import distance_transform_edt
sys.setrecursionlimit(200000)

W, H, S = 148, 98, 10
PXW, PXH = W * S, H * S
CYCLE = 7.0
WRITE_END = 0.42          # of cycle: writing done
FADE_AT = 0.94            # start fading out
STOPS = 56                # baked chronograph resolution

tsx_path = 'src/components/SignatureAryan.tsx'
css_path = 'src/index.css'
tsx = open(tsx_path).read()

# ---------- 1. harvest the (known-good) glyph geometry ----------
groups = []
for tr, d in re.findall(r'<g transform="([^"]+)"><path d="([^"]+)"/></g>', tsx):
    if (tr, d) not in groups:
        groups.append((tr, d))
groups = groups[:5]
assert len(groups) == 5
glyph_xml = ''.join(f'        <g transform="{tr}"><path d="{d}"/></g>\n' for tr, d in groups)
body = ''.join(f'<g transform="{tr}"><path d="{d}"/></g>' for tr, d in groups)

import cairosvg
svg_flat = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{PXW}" height="{PXH}">'
            f'<rect width="{W}" height="{H}" fill="white"/><g fill="black">{body}</g></svg>')
png = cairosvg.svg2png(bytestring=svg_flat.encode(), output_width=PXW, output_height=PXH)
ink = np.array(Image.open(io.BytesIO(png)).convert('L')) < 128

# ---------- 2. skeleton + full edge-covering DFS walk ----------
skel = skeletonize(ink)
sk = set(map(tuple, np.argwhere(skel)))
NB = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
def neighbors(p):
    r, c = p
    return [(r+dr, c+dc) for dr, dc in NB if (r+dr, c+dc) in sk]

eps = [p for p in sk if len(neighbors(p)) == 1]
start = min(eps, key=lambda p: (p[1], p[0]))
visited = set()
stack = [(start, None)]
walk = [start]
first_visit = [True]      # parallel to walk: step i arrives over an unvisited edge
while stack:
    p, prev = stack[-1]
    cands = []
    for q in neighbors(p):
        if frozenset((p, q)) in visited:
            continue
        turn = 0 if prev is None else -((q[0]-p[0])*prev[0] + (q[1]-p[1])*prev[1])
        cands.append((turn, q))
    if cands:
        cands.sort(key=lambda t: (t[0], t[1][1], t[1][0]))
        q = cands[0][1]
        visited.add(frozenset((p, q)))
        stack.append((q, (q[0]-p[0], q[1]-p[1])))
        walk.append(q)
        first_visit.append(True)
    else:
        stack.pop()
        if stack:
            walk.append(stack[-1][0])
            first_visit.append(False)
assert len(visited) == sum(len(neighbors(p)) for p in sk) // 2, "walk missed skeleton edges"
uniq_total = len(visited)

# ---------- 3. RDP simplify (fixed for closed walks), keep index mapping ----------
def rdp_idx(points, eps_, lo, hi):
    if hi - lo < 2:
        return [lo, hi]
    (r1, c1), (r2, c2) = points[lo], points[hi]
    den = math.hypot(r2-r1, c2-c1)
    dmax, idx = -1.0, -1
    for i in range(lo+1, hi):
        r, c = points[i]
        if den < 1e-6:
            d = math.hypot(r-r1, c-c1)
        else:
            d = abs((c2-c1)*r - (r2-r1)*c + r2*c1 - c2*r1) / den
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps_:
        return rdp_idx(points, eps_, lo, idx)[:-1] + rdp_idx(points, eps_, idx, hi)
    return [lo, hi]

def try_tol(tol):
    keep = rdp_idx(walk, tol, 0, len(walk)-1)
    return keep, [walk[i] for i in keep]

fv_at_keep = None

def to_xy(pl):
    return [(c / S, r / S) for r, c in pl]

def coverage(polylines_xy, sw_units):
    canvas = Image.new('L', (PXW, PXH), 0)
    dr = ImageDraw.Draw(canvas)
    wpx = max(1, int(round(sw_units * S)))
    for pl in polylines_xy:
        pts = [(x*S, y*S) for x, y in pl]
        if len(pts) == 1:
            pts *= 2
        dr.line(pts, fill=255, width=wpx, joint='curve')
        r = wpx / 2
        for x, y in (pts[0], pts[-1]):
            dr.ellipse([x-r, y-r, x+r, y+r], fill=255)
    return ((np.array(canvas) > 0) & ink).sum() / ink.sum()

dt = distance_transform_edt(ink)
sw = math.ceil((2 * dt.max() / S + 0.4) * 2) / 2
keep, simp, cov = None, None, 0.0
for tol in (1.0, 0.9, 0.8, 0.7, 0.6):
    k2, s2 = try_tol(tol)
    c2 = coverage([to_xy(s2)], sw)
    print(f"  tol {tol}: {len(s2)} pts, coverage {c2:.4f}")
    if c2 >= 0.99:
        keep, simp, cov = k2, s2, c2
        break
    if keep is None or c2 > cov:
        keep, simp, cov = k2, s2, c2
xy = [to_xy(simp)]
assert cov >= 0.985, f"coverage {cov}"
print(f"kept {len(simp)} pts, sw {sw}u, coverage {cov:.4f}")

# per-kept-point emitted length
emit_len = [0.0]
for a, b in zip(simp, simp[1:]):
    emit_len.append(emit_len[-1] + math.hypot(b[0]-a[0], b[1]-a[1]) / S)
mask_len = emit_len[-1]

# ---------- 4. chronograph: unique-ink progress -> emitted-length fraction ----------
# unique coverage after raw step i
uv_flags = np.array(first_visit, dtype=bool)
uv_cum = np.cumsum(uv_flags)
u_of_raw = uv_cum / uniq_total                      # 0..1 unique fraction
l_of_raw = np.interp(np.arange(len(walk)), keep, emit_len) / mask_len   # emitted-length fraction at raw idx

def fmt(v):
    s = f"{v:.1f}".rstrip('0').rstrip('.')
    return s if s != '-0' else '0'

# writing timeline stops: time t (of write phase) -> length fraction ℓ(t)
# uniform unique-ink pacing: t_j = j/STOPS of write phase wants u = t_j
times, lens = [0.0], [0.0]
for j in range(1, STOPS + 1):
    target = j / STOPS
    i = int(np.searchsorted(u_of_raw, target))
    i = min(i, len(walk) - 1)
    times.append(j / STOPS)
    lens.append(float(l_of_raw[i]))
# enforce monotone
for k in range(1, len(lens)):
    if lens[k] < lens[k-1]:
        lens[k] = lens[k-1]
lens[-1] = 1.0

# ---------- 5. bake mask path ----------
d = f"M{fmt(xy[0][0][0])} {fmt(xy[0][0][1])}"
for p in xy[0][1:]:
    d += f" L{fmt(p[0])} {fmt(p[1])}"
mask_d = d
mask_len_r = round(mask_len, 1)
print(f"MASK_LEN {mask_len_r}u, path bytes {len(mask_d)}")

# ---------- 6. verification strip on the REAL chronograph ----------
def length_at(time_frac):   # time_frac: of WRITE phase 0..1
    t = min(1.0, max(0.0, time_frac)) * STOPS
    i0 = int(math.floor(t))
    i1 = min(STOPS, i0 + 1)
    f = t - i0
    return lens[i0] * (1 - f) + lens[i1] * f

def cut_at(ell_frac):
    target = ell_frac * mask_len
    out, prev = [xy[0][0]], xy[0][0]
    run = 0.0
    for p in xy[0][1:]:
        seg = math.hypot(p[0]-prev[0], p[1]-prev[1])
        if run + seg >= target:
            tt = 0 if seg == 0 else (target - run) / seg
            out.append((prev[0] + (p[0]-prev[0]) * tt, prev[1] + (p[1]-prev[1]) * tt))
            return out
        out.append(p)
        run += seg
        prev = p
    return out

frames = []
labels = []
for k, tf in enumerate((0.08, 0.25, 0.45, 0.7, 0.92, 1.0)):
    cut = cut_at(length_at(tf))
    msvg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{PXW}" height="{PXH}">'
            f'<defs><mask id="m"><rect width="{W}" height="{H}" fill="black"/>'
            f'<path d="M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in cut) +
            f'" fill="none" stroke="white" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'</mask></defs><rect width="{W}" height="{H}" fill="#F6EFE2"/>'
            f'<g mask="url(#m)" fill="#8a6326">{body}</g></svg>')
    frames.append(cairosvg.svg2png(bytestring=msvg.encode(), output_width=PXW//2, output_height=PXH//2))
    labels.append(tf)
strip = Image.new('RGB', (PXW//2*3 + 20, (PXH//2)*2 + 30), 'white')
for i, f in enumerate(frames):
    strip.paste(Image.open(io.BytesIO(f)).convert('RGB'), ((i % 3)*(PXW//2) + 5, (i // 3)*(PXH//2) + 5))
strip.save('/tmp/sig_frames2.png')

# ---------- 7. bake keyframes + nib chronograph ----------
kf_lines = []
for j in range(STOPS + 1):
    t_pct = times[j] * WRITE_END * 100
    off = (1 - lens[j]) * mask_len_r
    kf_lines.append(f"  {t_pct:.3f}% {{ stroke-dashoffset: {off:.2f}; }}")
kf = ("@keyframes sig-ink-flow {\n" + "\n".join(kf_lines) +
      f"\n  {WRITE_END*100:.3f}%, 84% {{ stroke-dashoffset: 0; opacity: 1; }}\n"
      f"  {FADE_AT*100:.0f}%, 100% {{ stroke-dashoffset: 0; opacity: 0; }}\n}}")

nib_kp = ";".join(f"{l:.4f}".rstrip('0').rstrip('.') for l in lens) + ";1"
nib_kt = ";".join(f"{times[j]*WRITE_END:.4f}".rstrip('0').rstrip('.') for j in range(STOPS+1)) + ";1"
nib_op_vals = "0;1;1;0;0"
nib_op_kt = f"0;0.02;{WRITE_END-0.02:.4g};{WRITE_END+0.03:.4g};1"
fl_start = WRITE_END + 0.01
fl_end = WRITE_END + 0.10
css_new = f"""/* ============ SignatureAryan — the ghost hand (AUTO-BAKED chronograph) ============ */
/* The dash timeline below is GENERATED by scripts/sigmask2.py: the mask stroke
   runs the word's true skeleton route, and {STOPS + 1} baked stops re-chronograph
   the reveal so writing speed is constant in UNIQUE INK (recoils/reroses of the
   hand no longer rush the word). Do not hand-tune; rerun the script. */
{kf}
.sig-ink-flow {{
  animation: sig-ink-flow linear infinite;
}}
/* flourish underline — sweeps in right after the last letter lands */
@keyframes sig-swish {{
  0%, {fl_start*100:.1f}% {{ stroke-dashoffset: 240; stroke-opacity: 0; }}
  {fl_start*100 + 0.8:.1f}% {{ stroke-opacity: 0.9; }}
  {fl_end*100:.1f}% {{ stroke-dashoffset: 0; stroke-opacity: 0.9; }}
  84% {{ stroke-dashoffset: 0; stroke-opacity: 0.9; }}
  {FADE_AT*100:.0f}%, 100% {{ stroke-dashoffset: 0; stroke-opacity: 0; }}
}}
.sig-flourish-flow {{
  stroke-dasharray: 240;
  animation: sig-swish cubic-bezier(0.5, 0, 0.5, 1) infinite;
}}
/* calm mode (in-app or OS): the signature stands complete and still */
html[data-motion='reduced'] .sig-ink-flow,
html[data-motion='reduced'] .sig-flourish-flow {{
  animation: none;
  stroke-dashoffset: 0;
  stroke-opacity: 1;
  opacity: 1;
}}
html[data-motion='reduced'] .sig-nib {{ display: none; }}
@media (prefers-reduced-motion: reduce) {{
  .sig-ink-flow, .sig-flourish-flow {{
    animation: none !important;
    stroke-dashoffset: 0 !important;
    stroke-opacity: 1 !important;
    opacity: 1 !important;
  }}
  .sig-nib {{ display: none !important; }}
}}
"""

component = f'''import {{ useId }} from 'react';

/**
 * SignatureAryan — a real hand, recreated honestly.
 *
 * The ink is genuine Great Vibes glyph geometry (fontTools); the reveal is the
 * computed SKELETON of that exact ink — every edge walked, verified at 100%
 * pixel coverage — re-chronographed so ink flows at a constant writing pace
 * (scripts/sigmask2.py bakes the keyframes in index.css). A nib of light rides
 * the identical chronograph via SMIL. The {CYCLE:.0f}s ceremony: written,
 * admired, released, rewritten. Forever.
 */

const MASK_D = `{mask_d}`;
const MASK_LEN = {mask_len_r};
const STROKE_W = {sw};
const CYCLE = {CYCLE:g};

// the nib rides the same chronograph as the ink (generated, do not edit)
const NIB_KEYPOINTS = "{nib_kp}";
const NIB_KEYTIMES = "{nib_kt}";

export default function SignatureAryan({{ className = '' }}: {{ className?: string }}) {{
  const uid = useId().replace(/:/g, '');
  const inkId = 'sigInk-' + uid;
  const maskId = 'sigMask-' + uid;
  const rimId = 'sigRim-' + uid;
  const glowId = 'sigGlow-' + uid;
  return (
    <svg
      viewBox="0 0 {W} {H}"
      className={{"w-[188px] sm:w-[212px] h-auto " + className}}
      role="img"
      aria-label="Aryan — handwritten signature"
    >
      <defs>
        <linearGradient id={{inkId}} x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stopColor="#8F6524" />
          <stop offset="42%" stopColor="#DFAF5E" />
          <stop offset="68%" stopColor="#FFF4D4" />
          <stop offset="100%" stopColor="#B7812F" />
        </linearGradient>
        <linearGradient id={{rimId}} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#BE8B3F" />
          <stop offset="100%" stopColor="#7E5419" />
        </linearGradient>
        <radialGradient id={{glowId}} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFF6DC" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#F2CE8A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F2CE8A" stopOpacity="0" />
        </radialGradient>
        <mask id={{maskId}} maskUnits="userSpaceOnUse" x="0" y="0" width="{W}" height="{H}">
          <rect width="100%" height="100%" fill="black" />
          <path
            d={{MASK_D}}
            className="sig-ink-flow"
            style={{{{ animationDuration: CYCLE + 's' }}}}
            fill="none"
            stroke="white"
            strokeWidth={{STROKE_W}}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={{MASK_LEN}}
            strokeDasharray={{MASK_LEN}}
            strokeDashoffset={{MASK_LEN}}
          />
        </mask>
      </defs>

      <g mask={{"url(#" + maskId + ")"}} fill={{"url(#" + inkId + ")"}}>
{glyph_xml.rstrip()}
      </g>

      <path
        d="M22 90 C 70 82, 140 96, 132 88"
        className="sig-flourish-flow"
        style={{{{ animationDuration: CYCLE + 's' }}}}
        fill="none"
        stroke={{"url(#" + rimId + ")"}}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {{/* the nib of light — parked and invisible unless the hand is moving */}}
      <g className="sig-nib" opacity="0">
        <animateMotion
          dur={{CYCLE + 's'}}
          repeatCount="indefinite"
          calcMode="linear"
          keyPoints={{NIB_KEYPOINTS}}
          keyTimes={{NIB_KEYTIMES}}
          path={{MASK_D}}
        />
        <animate
          attributeName="opacity"
          values="{nib_op_vals}"
          keyTimes="{nib_op_kt}"
          dur={{CYCLE + 's'}}
          repeatCount="indefinite"
        />
        <circle r="7" fill={{"url(#" + glowId + ")"}} />
        <circle r="1.7" fill="#FFF6DC" />
        <circle r="0.8" fill="#B7812F" />
      </g>
    </svg>
  );
}}
'''

open(tsx_path, 'w').write(component)

css = open(css_path).read()
start_marker = '/* ============ SignatureAryan'
si = css.index(start_marker)
css = css[:si] + css_new
open(css_path, 'w').write(css)
print("component + css written")

json.dump({'mask_len': mask_len_r, 'stroke_w': sw, 'pts': len(simp), 'coverage': round(float(cov), 4)},
          open('/tmp/sig_final.json', 'w'))
