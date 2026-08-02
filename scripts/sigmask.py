#!/usr/bin/env python3
"""Rebuild the signature reveal mask so it TRULY matches the baked glyph ink.

Pipeline:
  1. pull the per-glyph groups out of SignatureAryan.tsx (the fill is known-good)
  2. rasterize that exact SVG with cairosvg (identical coordinate space)
  3. skeletonize the ink, then DFS-walk EVERY skeleton edge (backtracking allowed)
     so the reveal can never leave orphan ink
  4. simplify w/ RDP while coverage stays >= 99%
  5. emit MASK_D / MASK_LEN / STROKE_W straight into the component
"""
import io, json, math, re, sys
import numpy as np
from PIL import Image, ImageDraw
from skimage.morphology import skeletonize
from scipy.ndimage import distance_transform_edt, label

W, H, S = 148, 98, 10          # svg units, render scale
PXW, PXH = W * S, H * S

tsx = open('src/components/SignatureAryan.tsx').read()
groups = []
for tr, d in re.findall(r'<g transform="([^"]+)"><path d="([^"]+)"/></g>', tsx):
    item = (tr, d)
    if item not in groups:
        groups.append(item)
groups = groups[:5]
assert len(groups) == 5, f"expected 5 glyph groups, got {len(groups)}"

body = ''.join(f'<g transform="{tr}"><path d="{d}"/></g>' for tr, d in groups)
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" '
       f'width="{PXW}" height="{PXH}">'
       f'<rect width="{W}" height="{H}" fill="white"/>'
       f'<g fill="black">{body}</g></svg>')

import cairosvg
png = cairosvg.svg2png(bytestring=svg.encode(), output_width=PXW, output_height=PXH)
img = Image.open(io.BytesIO(png)).convert('L').resize((PXW, PXH))
ink = np.array(img) < 128
print(f"ink px: {ink.sum()}")

# ---- skeleton ----
skel = skeletonize(ink)
print(f"skeleton px: {skel.sum()}")
sk = set(map(tuple, np.argwhere(skel)))  # (row, col)

NB = [(-1,-1),(-1,0),(-1,1),(0,-1),(0,1),(1,-1),(1,0),(1,1)]
def neighbors(p):
    r, c = p
    out = []
    for dr, dc in NB:
        q = (r+dr, c+dc)
        if q in sk:
            out.append(q)
    return out

# connected components of skeleton
lab, ncomp = label(skel, structure=np.ones((3, 3)))
print(f"skeleton components: {ncomp}")

def endpoints_of(comp_px):
    eps = []
    for p in comp_px:
        if len(neighbors(p)) == 1:
            eps.append(p)
    return eps

walk_all = []          # list of polylines (one per component), each a list of (row,col)
for ci in range(1, ncomp + 1):
    comp = set(map(tuple, np.argwhere(lab == ci)))
    if len(comp) < 6:              # dust specks: let the stroke width cover them
        continue
    eps = endpoints_of(comp)
    if eps:
        start = min(eps, key=lambda p: (p[1], p[0]))   # leftmost endpoint
    else:
        start = min(comp, key=lambda p: (p[1], p[0]))
    visited = set()        # edges, frozenset({p,q})
    stack = [(start, None)]
    path = []
    while stack:
        p, prev_dir = stack[-1]
        if prev_dir is None:
            path.append(p)
        cands = []
        for q in neighbors(p):
            e = frozenset((p, q))
            if e in visited:
                continue
            if prev_dir is not None:
                v = (q[0]-p[0], q[1]-p[1])
                dot = v[0]*prev_dir[0] + v[1]*prev_dir[1]
                turn = -dot                       # higher = sharper turn
            else:
                turn = 0
            cands.append((turn, q))
        if cands:
            cands.sort(key=lambda t: (t[0], t[1][1], t[1][0]))
            q = cands[0][1]
            visited.add(frozenset((p, q)))
            stack.append((q, (q[0]-p[0], q[1]-p[1])))
            path.append(q)
        else:
            stack.pop()
            if stack:
                path.append(stack[-1][0])
    walk_all.append(path)

walk_all.sort(key=lambda pl: min(p[1] for p in pl))  # components left->right
print(f"walk polylines: {len(walk_all)}, total waypoints: {sum(len(p) for p in walk_all)}")

# ---- simplify (RDP) keeping coverage ----
def rdp(points, eps):
    if len(points) < 3:
        return points
    (r1, c1), (r2, c2) = points[0], points[-1]
    den = math.hypot(r2-r1, c2-c1)
    dmax, idx = -1.0, 0
    for i in range(1, len(points)-1):
        r, c = points[i]
        if den < 1e-6:
            d = math.hypot(r - r1, c - c1)   # closed walk: chord is a point
        else:
            d = abs((c2-c1)*r - (r2-r1)*c + r2*c1 - c2*r1) / den
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps:
        return rdp(points[:idx+1], eps)[:-1] + rdp(points[idx:], eps)
    return [points[0], points[-1]]

def to_xy(path):  # (row,col) -> (x,y) svg units
    return [(c / S, r / S) for r, c in path]

def coverage(polylines_xy, stroke_w_units):
    canvas = Image.new('L', (PXW, PXH), 0)
    dr = ImageDraw.Draw(canvas)
    wpx = max(1, int(round(stroke_w_units * S)))
    for pl in polylines_xy:
        pts = [(x * S, y * S) for x, y in pl]
        if len(pts) == 1:
            pts = pts * 2
        dr.line(pts, fill=255, width=wpx, joint='curve')
        r = wpx / 2
        for x, y in (pts[0], pts[-1]):
            dr.ellipse([x-r, y-r, x+r, y+r], fill=255)
    stroke = np.array(canvas) > 0
    cov = (stroke & ink).sum() / ink.sum()
    return cov

# stroke width from ink thickness
dt = distance_transform_edt(ink)
max_half = dt.max() / S                      # svg units
sw = math.ceil((2 * max_half + 0.5) * 2) / 2 # cover thickest stem + margin
print(f"max ink half-thickness {max_half:.2f}u -> stroke {sw}u")

simplified = [[ (r, c) for r, c in rdp(pl, 1.1) ] for pl in walk_all]
xy = [to_xy(pl) for pl in simplified]
cov = coverage(xy, sw)
print(f"coverage @tol1.1 stroke {sw}u: {cov:.4f}")
tries = [(0.8, sw), (0.6, sw), (0.8, sw + 0.5), (0.6, sw + 0.5), (1.1, sw + 1.0)]
for tol, w2 in tries:
    if cov >= 0.99:
        break
    xy2 = [to_xy(rdp(pl, tol)) for pl in walk_all]
    cov2 = coverage(xy2, w2)
    print(f"  retry tol={tol} stroke={w2}: {cov2:.4f}")
    if cov2 > cov:
        xy, cov, sw = xy2, cov2, w2
assert cov >= 0.985, f"coverage too low: {cov}"

def fmt(v):
    s = f"{v:.1f}".rstrip('0').rstrip('.')
    return s if s not in ('-0', '') else '0'

segs, total = [], 0.0
for pl in xy:
    d = f"M{fmt(pl[0][0])} {fmt(pl[0][1])}"
    prev = pl[0]
    for p in pl[1:]:
        d += f" L{fmt(p[0])} {fmt(p[1])}"
        total += math.hypot(p[0]-prev[0], p[1]-prev[1])
        prev = p
    segs.append(d)
mask_d = ' '.join(segs)
print(f"MASK_LEN {total:.1f}u  pts {sum(len(p) for p in xy)}  bytes {len(mask_d)}")

json.dump({
    'mask_d': mask_d,
    'mask_len': round(total, 1),
    'stroke_w': sw,
    'coverage': round(float(cov), 4),
}, open('/tmp/sigmask_out.json', 'w'))

# ---- visual verification strip: reveal at 25/55/80/100% ----
def dashratio(path, frac):
    # cut polylines at frac of total length for the preview
    target, done = frac * total, 0.0
    out = []
    for pl in path:
        cur = []
        prev = pl[0]
        cur.append(prev)
        for p in pl[1:]:
            seglen = math.hypot(p[0]-prev[0], p[1]-prev[1])
            if done + seglen >= target:
                t = 0 if seglen == 0 else (target - done) / seglen
                cur.append((prev[0] + (p[0]-prev[0]) * t, prev[1] + (p[1]-prev[1]) * t))
                out.append(cur)
                return out
            cur.append(p)
            done += seglen
            prev = p
        out.append(cur)
    return out

frames = []
for frac in (0.25, 0.55, 0.8, 1.0):
    cut = dashratio(xy, frac)
    masksvg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{PXW}" height="{PXH}">'
               f'<defs><mask id="m"><rect width="{W}" height="{H}" fill="black"/>')
    for pl in cut:
        d = 'M' + ' L'.join(f'{x:.2f} {y:.2f}' for x, y in pl)
        masksvg += (f'<path d="{d}" fill="none" stroke="white" stroke-width="{sw}" '
                    f'stroke-linecap="round" stroke-linejoin="round"/>')
    masksvg += (f'</mask></defs><rect width="{W}" height="{H}" fill="#F6EFE2"/>'
                f'<g mask="url(#m)" fill="#96692C">{body}</g></svg>')
    frames.append(cairosvg.svg2png(bytestring=masksvg.encode(), output_width=PXW//2, output_height=PXH//2))
strip = Image.new('RGB', (PXW//2*4 + 30, PXH//2 + 20), 'white')
for i, f in enumerate(frames):
    strip.paste(Image.open(io.BytesIO(f)).convert('RGB'), (i*(PXW//2)+i*10+10, 10))
strip.save('/tmp/sig_frames.png')
# full-ink frame for reference
full = cairosvg.svg2png(bytestring=svg.encode(), output_width=PXW//2, output_height=PXH//2)
Image.open(io.BytesIO(full)).convert('RGB').save('/tmp/sig_full.png')
print("frames written")
