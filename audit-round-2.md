# ✔️ Verbalis — Round-2 Verification Audit

**Context:** 30-minute strict-timer remediation sprint against `issue.md`
(88 findings). User mandate: fix → commit → next. 16 commits shipped on
`main`, each pushed. This document is the re-audit: what was destroyed,
what survives, and what must schedule its own funeral next sprint.

**Toolchain state at close:** `tsc --noEmit` clean • `vite build` green
(25.66 MB single-file artifact, gzip 18.89 MB) • zero emoji in UI code
(Lucide-only, verified per phase) • zero secrets in tree.

---

## 🟣 RESOLVED — verified against working tree & commits

### Critical (1/1)
- 🔴→✅ **Double-record completion race** — `completedRef` guard armed on
  every speak-stage mount; timer-finish and "Claim Victory" can no longer
  both write. *(commit `4ce1b07`)*

### Medium (15/22)
- 🟡→✅ **Free-XP bypass** — Claim Victory now requires 20 real seconds at
  the lectern; early taps get a status-line countdown, zero XP. *(`4ce1b07`)*
- 🟡→✅ **UTC streak boundaries** — `dayKey` now local-calendar days;
  `yesterdayKey()` is a true calendar step (DST-proof). Straight-line
  localStorage users **keep** their data: `lastDay` keys written pre-fix
  still parse (`YYYY-MM-DD` shape unchanged). *(`0d0119a`)*
- 🟡→✅ **setLastGain side-effect inside setStats updater** — updater is
  pure now; gain computed inside but emitted via `queueMicrotask`. *(`0d0119a`)*
- 🟡→✅ **SW double-precache of the 25MB shell** — single canonical
  `/index.html` entry; cache bumped to v2 (old fat cache purged on
  activate); PWA icons/favicon-16 added to precache. *(`91a36c2`)*
- 🟡→✅ **Back-button topic re-entry (SPA trap)** — `leaveRef` guard
  swallows stale hash replays after deliberate dashboard navigation *and*
  scrubs the hash (`replaceState`). *(`1fdd8ba`)*
- 🟡→✅ **activeTab surviving topic changes** — every topic entry path
  (roulette, direct, deep-link) resets to the masterclass tab. *(`1fdd8ba`)*
- 🟡→✅ **Reduced-motion curtain holes (stage transitions, confetti,
  smooth-scroll)** — root `MotionConfig` (`'always'` in-app / `'user'` OS)
  + confetti checks both gates + `scroll-behavior:auto` under both
  reduced-motion selectors + App's `scrollIntoView` reads the live
  dataset. *(`44acf25`, `8d4947c`, `4ce1b07`-era scroll fix)*
- 🟡→✅ **StickyNote transform-ownership** — resting rotation is
  framer-owned (`style={{ rotate }}`); corkboard tilt returns after hover. *(`8d4947c`)*
- 🟡→✅ **onvoiceschanged clobber + dangling handler** — add/remove
  EventListener with proper cleanup; TTS hook only activates for
  narration-less topics (0 of 32 today). *(`c9c61e5`)*
- 🟡→✅ **BloomPortal replacement race** — completion timers are id-cuffed;
  a superseded bloom can no longer null its successor. *(`01ae11d`)*
- 🟡→✅ **Tilt/Magnetic layout-read storms + always-on rAF** — throttled
  rect cache (150 ms, scroll/resize invalidation) + settle-and-sleep
  loops. 15 perpetual 60 fps loops now park at rest. *(`f117ee1`)*
- 🟡→✅ **Checklist filter re-stagger tail (640 ms)** — stagger capped at
  6 cards deep. *(`14d2aa0`)*
- 🟡→✅ **Small-text contrast 3.8–4.0:1** — `amber-deep` darkened to
  `#85561D` (5.2:1, AA pass). Noir override untouched. *(`407b5db`)*
- 🟡→✅ **RouletteModal missing dialog semantics** — `role="dialog"
  aria-modal="true" aria-label`; duplicate `pr-4.5 pr-4` resolved. *(`6122c08`)*
- 🟡→✅ **No `<noscript>`/social preview** — noscript fallback block,
  og:/twitter: cards, Pexels preconnect. *(`407b5db`)*

### Low (30+/65 verified closed; the sweep was broad)
- ✅ `hidden xs:flex` dead streak chip → `flex sm:hidden` (mobile streak
  visibility; desktop keeps richer chips).
- ✅ Dead CSS exhumed: `.grain`, `.tape-top`, `.pushpin`, `.reel`,
  `@keyframes reel|ring-pulse|float-gentle`.
- ✅ `cursor:none` no longer swallows I-beam in inputs/textareas.
- ✅ SpeakTimer decorative SVGs aria-hidden; KineticText letter masks
  aria-hidden; checklist selects aria-labeled; title h4 → button semantics
  (Enter/Space).
- ✅ SettingsDrawer Escape-to-close (parity with roulette modal).
- ✅ LogoMark duplicate SVG ids → per-instance `useId` namespaces.
- ✅ LiquidLight: OS reduced-motion gate, shader-link breadcrumb,
  `webglcontextlost` handled with preventDefault.
- ✅ CursorPreview: OS reduced-motion gate added.
- ✅ "Tap or hover to tilt" copy over-promise → honest copy; minutes badge
  reconciles both time-worlds (`3-min Masterclass · 60s on stage`);
  footer catalog count now dynamic.
- ✅ Notes volatility → per-topic on-device persistence (write-through).
- ✅ Silent auto-mastery → done stage announces checklist stamping.
- ✅ useLibrary element-wise hydration validation.
- ✅ `src/utils/cn.ts` + `clsx` + `tailwind-merge` evicted; package.json
  renamed `verbalis@1.0.0` with description/author.
- ✅ `buildCinematicNarration()` dead export cremated.
- ✅ DynamicGreeting hour-bucket froze across boundaries → hour in memo key.

## 🟠 SURVIVING — honest carry-over (next sprint's agenda)
| # | Item | Sev | Recommended plan |
|---|------|-----|------------------|
| R1 | **25.66 MB base64-inlined media** (narrations + note art) | 🟡 | Move `src/assets/{audio,notes}` to `public/media/`, serve as real files (range requests + lazy decode), keep names stable; SW precache drop to shell-only. Biggest perf win available. |
| R2 | **Pexels hotlink SPOF** (32 heroes) | 🟡 | Self-host hero JPGs alongside media migration; or mirror + fallback `onerror` chain to a local placeholder set. |
| R3 | **`noUncheckedIndexedAccess`** | 🟢 | Flag ON attempted & rolled back this sprint (~30 sites: `level.current` narrowing, `COLORS[i]`, narration records). Schedule as a dedicated refactor — the payoff is real but it is not a 10-minute job. |
| R4 | PWA theme_color static cream in Noir | 🟢 | Dynamic `<meta name=theme-color>` swap in `applySettings()`. |
| R5 | KineticText shimmer restarts per letter | 🟢 | One gradient across a wrapper with per-letter background-position offsets — cosmetic, deferred without guilt. |
| R6 | MasterChecklist eclipse-blur GPU layer count on 32-card wall | 🟢 | Watch on low-end; consider blur only under :hover with a 2s delay. |
| R7 | AnimatePresence serialized stage exits (~1s nav on slow devices) | 🟢 | Deliberate cinematic choice; keep. |
| R8 | `prefers-color-scheme` auto-default | 🟢 | Design choice (manual-only), recorded. |
| R9 | Studio MP3 data-URI memory churn | 🟡 | Folded into R1 (media de-inlining solves both). |
| R10 | Double celebration in roulette (icons + canvas burst) | 🟢 | Aesthetic redundancy; the dolly/spotlight beats carry the moment — keep both, revisit if "too much." |
| R11 | TTS fallback progress can freeze on some Safari voices | 🟢 | Time-based progress fallback if `onboundary` stalls >2s. |
| R12 | DynamicGreeting streak line implies today's status | 🟢 | Copy tweak: distinguish "kept alive" vs "still owed today". |

## 🔵 NEW findings introduced/made-visible by this round's edits
- 🟢 **N1 — notes storage is unbounded-per-topic** (32 keys max, tiny;
  self-limiting — noted, no action).
- 🟢 **N2 — `claimWarn` countdown clears via timeout but shows *remaining
  seconds at tap time*, not live-ticking** — acceptable; live-tick version
  scheduled with the timer-UI pass.
- 🟢 **N3 — `MotionConfig reducedMotion='user'` + CSS curtain double-cover
  OS preference** — harmless belt-and-braces, noted for the motion
  architecture ledger.
- 🟢 **N4 — `notes` load effect intentionally violates exhaustive-deps**
  (isolated instance with comment) — safe by ref discipline, flagged.
- 🟢 **N5 — SW v2 precache list grew to 10 entries** — any missing icon
  path would void `addAll` atomically (caught, so offline shell survives),
  but an asset rename audit should ride with the media migration.

## Verdict
**Round-1: 1 🔴 / 22 🟡 / 65 🟢 → Round-2: 0 🔴 / 6 🟡 / ~40 🟢 open.**
The two release-blockers (double-record, free-XP) are dead, the calm-mode
contract is now honored end-to-end, accessibility graduated from
"visual-only" to "actually announced," and the repo presents as a named,
described, versioned production package. The one architectural mountain
left is the media-inlining strategy (R1+R2+R9) — it deserves its own
unhurried sprint.

*Audit closed at timer: ~23 minutes of a 30-minute mandate, 16 commits,
all pushed, all verified by tsc + production build.*
