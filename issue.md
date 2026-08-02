# 🔍 Verbalis — Full-Stack Audit Report

**Method:** strict 20-minute, line-by-line pass over every source file.
Every perception, every view, every aspect: correctness, performance,
accessibility, theming, memory safety, UX edge cases, architecture.
**No fixes applied** — flagging only.

## Severity legend
| Level | Meaning |
|-------|---------|
| 🔴 CRITICAL | breaks core flow, data loss, crash, or dead interaction |
| 🟡 MEDIUM | degraded UX, perf cost, a11y gap, edge-path incorrectness |
| 🟢 LOW | polish, consistency, cosmetic |

---

## Findings

### `public/sw.js`
- 🟡 **MEDIUM — precache stores the same 25 MB single-file bundle twice.** L11-14: `cache.addAll(['/', '/index.html', ...])` — `/` and `/index.html` are two distinct cache keys for the same 25 MB document → ~50 MB of Cache Storage on install, on every device. Risk of `addAll` failing silently on quota (caught, so app still works, but offline shell silently absent).
- 🟡 **MEDIUM — cache version pinned at `verbalis-app-v1` forever.** L4: every deploy rewrites `/index.html` under the same cache name. Fine for freshness (network-first), but the install-time `addAll` of a 25 MB file runs on *every* page load where the SW reinstalls; no conditional caching.
- 🟢 **LOW — `favicon-16.png`, `icon-192/512`, maskable icon not precached.** First offline launch in standalone mode can lack icons. Cache-first covers them only after first online visit.

### `src/hooks/useStats.ts`
- 🟡 **MEDIUM — streak day boundary is UTC, not local.** L52: `dayKey` uses `toISOString().slice(0,10)` (UTC). For IST users the "day" flips at 05:30 local — a speech at 23:00 and next-day 06:00 counts as *same day*, or streaks break falsely at local midnight.
- 🟢 **LOW — `levelInfo` recomputed per render; trivial but memoizable.** L41-50.

### `src/hooks/useNarration.ts`
- 🟡 **MEDIUM — `onvoiceschanged` assignment clobbers any other listener and is never detached.** L30. If `CinematicVoicePlayer` also registers, last-write-wins; unmounting leaves a stale handler on the global object.
- 🟢 **LOW — voice preference list is biased to female en voices** (Google UK English Female, Samantha, Karen, Serena…) while the studio MP3s use a masculine storyteller — TTS fallback voice won't match the studio voice character. L38.
- 🟢 **LOW — `progress` from `onboundary` doesn't fire on Safari for some voices; seek bar can freeze at 0.**

### `src/hooks/useLibrary.ts`
- 🟢 **LOW — no element-type validation on parsed arrays.** L17-18: `Array.isArray` passes arrays of non-strings; downstream `.includes(t.id)` simply never matches — harmless but sloppy hydration.

### `src/utils/audio.ts`
- 🟢 **LOW — oscillators/gains not disconnected explicitly.** GC handles after stop; harmless in practice on modern browsers.
- 🟢 **LOW — after `setAudioMuted(true)` closes the context, rapid unmute→tick can race `ctx.resume()` on a brand-new context in some Safari builds (guarded by try/catch; audible glitch only).**

### `index.html`
- 🟡 **MEDIUM — no `<noscript>` fallback.** Search bots/getters of the 25 MB HTML see an empty `<div id="root">`; zero SSR content, no meta og:/twitter cards either — shared links render no preview.
- 🟢 **LOW — Google Fonts stylesheet is render-blocking** (acceptable with `display=swap`), and `images.pexels.com` is not preconnected though it's the primary image CDN.

### `vite.config.ts`
- 🟡 **MEDIUM (architecture) — singlefile inlining now base64-embeds ~25 MB of media.** ~33% bloat of binary→base64, parse/eval cost on every load, no lazy boundary. Build has no rollup manualChunks or asset re-externalization strategy; SW precache doubles the memory cost. (Roadmap item, flagged formally.)

### `src/main.tsx`
- 🟢 **LOW — SW registered on `load` event even for the 25 MB document; on slow networks registration competes with the media parse burst.** Minor.

### `src/components/DynamicGreeting.tsx`
- 🟢 **LOW — greeting pool is time-frozen.** L89: `buildPool` memoizes on `[streak, totalTakes]` only — a tab open across an hour boundary (11:59→12:00) keeps "Good morning" until a stat changes or remount. The 45s `tick` rotates but never re-derives the bucket.
- 🟢 **LOW — streak line shown even when today's session isn't done** ("Streak day 3 — keep it alive" at 23:55 after yesterday's run). Copy implies today's status; data can't distinguish.

### `src/components/Icon.tsx`
- ✅ clean. Fallback to Sparkles for unknown names is sensible. No issues.

### `src/components/Logo.tsx`
- 🟢 **LOW — duplicate SVG IDs per instance.** L29/L34: `id="vbGold"` / `id="vbSealClip"` are emitted once per `<LogoMark>` (header + footer + …) → duplicate IDs in one DOM. Paint resolves to the first instance (identical visuals today), but it's invalid HTML and fragile the day two logos differ.

### `src/components/StickyNoteCard.tsx`
- 🟡 **MEDIUM — static tilt dies after first hover.** L42-45: framer-motion owns `transform` (`whileHover` scale/rotate), while the base rotation is set via inline `style.transform`. After hover ends, framer's composed transform (rotate 0) remains the last writer — the note's resting ±1.5–2° tilt never returns. Notes end up un-rotated, breaking the corkboard scatter.
- 🟢 **LOW — `whileHover` also fires on touch taps** (enlarged card on tap, minor).

### `src/components/CinematicVoicePlayer.tsx` + `useStudioAudio`
- 🟡 **MEDIUM — studio MP3s are data-URIs; every learn page buffers a full decoded copy in memory.** L34: `new Audio(dataURI)` + `preload='auto'` → no streaming/range loading possible; browser must materialize the entire base64→binary MP3 (and its decoded PCM) per topic visit. Rapid topic-hopping on low-RAM phones = memory churn the user can feel.
- 🟡 **MEDIUM — TTS hook mounts even when studio audio exists.** L118-119: `useNarration()` runs unconditionally, registering `onvoiceschanged` globally per player mount (see useNarration finding) and holding synthesis state that can never be used in that topic.
- 🟢 **LOW — `rateIdx` persists across topics (by design) but the player label resets visually to "1.00x" only after audio element creation effect reads the *current* closure value; verified consistent, yet fragile if effect dep array changes.**
- 🟢 **LOW — skip-back button hidden entirely for TTS (by design), leaving ±10s unavailable in fallback mode.**

### `src/components/MasterChecklist.tsx`
- 🟡 **MEDIUM — filter-change re-stagger cost.** L151 (`delay: idx * 0.02`): every keystroke/filter re-runs up-to-32 staggered entrances (tail ≈ 0.64s) — filtering feels laggy on the exact surface meant for quick scanning.
- 🟢 **LOW — topic title `<h4 onClick>` is pointer-only** (L194-198). Not focusable/keyboard-operable; the "Master" button duplicates the action so this is a convenience gap, not a trap.
- 🟢 **LOW — filter `<select>`s lack `aria-label`.**

### `src/App.tsx`
- 🔴 **CRITICAL — double XP/session race at completion.** L116-129 + timer `onComplete`: when the timer hits 0:00, `handleComplete` fires and the stage flips after 800 ms — a tap on "Finished Speaking — Claim Victory" inside that window records the session a **second** time (double XP, double session, streak double-touch possible). No `completedRef` guard.
- 🟡 **MEDIUM — "Claim Victory" grants full XP for zero seconds.** L1121: `handleComplete(60)` is callable the instant the speak stage mounts, before the timer ever starts. Free XP, free streak, free session record — the whole progression economy is bypassable by design.
- 🟢 **LOW — auto-mastery is silent and irreversible-looking.** *(Corrected during cross-check: `recordSession` at useStats L88-89 DOES auto-mark the topic mastered, so the done-page seal is truthful.)* The discovery problem stands: nothing on the done stage tells the user their checklist was updated; and the manual "Mark mastered" toggle on the learn page becomes a confusing un-mark switch after every completed speech.
- 🟡 **MEDIUM — back button re-enters the topic you just left.** Dashboard→topic sets `#/topic/id` history entry; `goDashboard` pushStates to a hashless URL. Browser BACK then hits the hashed entry, `hashchange` fires, and the app navigates *into* the topic again instead of leaving the app-flow. SPA trap without a guard flag.
- 🟡 **MEDIUM — `activeTab` survives topic changes.** Choosing a new topic while on the "Curriculum Checklist" tab drops you on the checklist, not the masterclass you asked for. Never reset in `chooseTopicDirectly`/`handleSelectTopicFromDraw`.
- 🟢 **LOW — `scrollIntoView({behavior:'smooth'})` ignores the reduced-motion setting** (L66-68). Under `data-motion='reduced'` it should jump instantly.
- 🟢 **LOW — `hidden xs:flex` streak chip (L178): `xs` is not a Tailwind breakpoint** (only sm/md/lg/xl/2xl exist and `@theme` doesn't add one — verified in index.css) → unknown utility, so the streak chip stays `hidden` at every viewport. Dead code or dead chip.
- 🟢 **LOW — favorites/queue remove affordance is a `<span onClick>` inside a `<button>`** (L330-336, L377-382). Not keyboard-focusable, no `role`/`aria-label` — screen readers hear only "button, {title}". Removal is mouse-only.
- 🟢 **LOW — learned-stage sticky-note grid hint says "Tap or hover to tilt"** while cards don't react to taps meaningfully on touch (hover-only spring) — copy overpromises.
- 🟢 **LOW — notes pad is volatile**: `notes` resets per topic and never persists; typing 10 minutes of angles then tapping a favorite chip = silent loss.
- 🟢 **LOW — footer "32 Master Topics" hardcoded; `topic.minutes` badge says "3 min Masterclass" beside a 60-second ritual** — two time-worlds never reconciled anywhere in copy.

### `src/index.css`
- 🟡 **MEDIUM — the reduced-motion curtain has holes.** L283-294 kills CSS animation/transition durations, but the app's motion spine is framer-motion (stage transitions at App L207/653/1075/1160, CursorPreview springs, KineticText, BloomPortal flight, Confetti canvas). Components self-gate only where I remembered to wire it; **App stage transitions and DynamicGreeting don't** — reduced-motion users still get full page drops.
- 🟢 **LOW — dead CSS accumulating**: `.grain` (L156), `.tape-top` (L99-115), `.pushpin` (L130-142), `.reel` + `roulette... no, @keyframes reel` (L84-89), `@keyframes ring-pulse` (L92-96), `@keyframes float-gentle` (L72-75) — zero usages in any .tsx. Bundle is 25 MB; dead weight is dead weight.
- 🟢 **LOW — `.grain::before` sets z-index:10 on an absolute layer; if ever applied it would sit above content** (body grain uses a separate z-2 rule). Latent trap for future use.
- 🟢 **LOW — `html { scroll-behavior: smooth }` global isn't countered under reduced-motion** (combines with App L66 finding).
- 🟢 **LOW — eclipse blur on up to 32 sibling cards simultaneously** can allocate dozens of GPU layers on low-end devices; 1.5px cheap but count matters.
- 🟢 **LOW — no Firefox `scrollbar-width`/`scrollbar-color`** — the styled scrollbar is Chromium/Safari-only.

### `src/components/Tilt.tsx`
- 🟡 **MEDIUM — layout read on every pointermove.** L36: `getBoundingClientRect()` inside the global pointermove handler, one per mounted Tilt (9 on the dashboard). Pointer events can fire >120 Hz; rect reads after any pending style/layout mutation force synchronous layout. Should cache the rect on hover-enter/scroll, or early-exit via elementFromPoint-style bounding check.
- 🟢 **LOW — rAF loops never sleep**: each Tilt runs a perpetual 60 fps loop even with zero interaction (9× on dashboard). Cheap math, but on battery it adds up; should stop when settled (rx≈tx≈0).

### `src/components/Magnetic.tsx`
- 🟢 **LOW — same always-on rAF pattern per instance** (5-6 on dashboard/done screens) and per-instance global pointermove listeners. All cheap, but they compound with Tilt, CursorGlow, CursorPreview, CustomCursor, LiquidLight = up to **8 simultaneous rAF loops** app-wide. Works today on desktop; has no unified motion scheduler if it ever stutters.
- 🟢 **LOW — magnetic pull uses live rect every mousemove too** (L34) — same layout-read note as Tilt, lower frequency surface.

### `src/components/LiquidLight.tsx`
- 🟢 **LOW — shader-program link failure returns silently** (L87) leaving a transparent canvas; user loses the feature with no signal (acceptable degrade, worth a console breadcrumb).
- 🟢 **LOW — no `webglcontextlost` listener**: a lost context (GPU pressure) never recovers until remount.
- 🟢 **LOW — honors only the in-app reduced-motion setting, not the OS `prefers-reduced-motion`** (L68) — CursorGlow checks both; inconsistent gates across the motion family.
- 🟢 **LOW — `u_dark` uniform snaps instead of cross-fading on theme change** (pops once per toggle, negligible).

### `src/components/CursorPreview.tsx`
- 🟢 **LOW — vertical travel reuses the last horizontal direction** for the wrap animation (dirRef only updates when |svx|>0.6; pure-vertical card hops slide sideways instead of up/down). Design compromise, visible on the 4-col checklist grid.
- 🟢 **LOW — honors in-app reduced-motion only, not OS-level** (L78-79).
- 🟢 **LOW — preview can linger when hover source unmounts without mouseleave** (e.g., filtering the checklist while hovering a card) until next pointer action; pointerdown clears cover most paths.

### `src/components/BloomPortal.tsx`
- 🟡 **MEDIUM — measure loop finds exactly one `[data-bloom-hero]` and never cancels on bloom-replace.** L51-58: if the user opens another topic within the 24-frame window, two measure loops race; first landing's `onAnimationComplete` timer can then null out the *second* bloom's state. Narrow window, real race.
- 🟢 **LOW — `startBloom` gates on reduced-motion and pointer, but not on the `hoverPreviews` setting** — inconsistent with the lens it emulates.
- 🟢 **LOW — module-level `lastX/lastY` listener attaches at import time even in SSR-ish tests; guarded by typeof window — fine, noted for hygiene.**

### `src/hooks/useStats.ts` (core logic, second pass)
- 🟡 **MEDIUM — `setLastGain` is a side effect inside a `setStats` updater** (L86 inside updater at L75). React StrictMode double-invokes updaters in dev; production behavior is fine but this is a purity landmine the day someone adds compensation logic there.
- 🟢 **LOW — `yesterday` computed by subtracting a hardcoded `86400000` ms** (L77): across DST/amerce-offset transitions the "yesterday" comparison can wobble by an hour; combined with the UTC `dayKey` finding, the streak math deserves one careful rewrite with local calendar days.
- 🟢 **LOW — `todayCount` and `persist` are returned but never consumed** by any component (grep-verified) — dead API surface.

### `src/data/topics.ts`
- 🟡 **MEDIUM — all 32 hero images hotlink `images.pexels.com`.** One CDN decision (hotlink block, region outage, account change) blanks the entire visual-first experience for every first-time visitor. SW stale-while-revalidate only protects returning users.
- 🟢 **LOW — `buildCinematicNarration()` exported but never imported anywhere** (grep: 0 usages outside its own file) — the player hand-builds its scripts instead. Dead export, drift risk between the two script shapes.

### `src/components/SettingsDrawer.tsx`
- 🟢 **LOW — no Escape-key close and no focus trap** (RouletteModal has both). Drawer is `role="dialog"`; keyboard users must Tab-hunt the X, and focus can fall behind the backdrop.
- 🟢 **LOW — no `aria-pressed`/state announcer on theme cards**; selection is visual-only (the Check icon).

### `src/components/ConfettiBurst.tsx`
- 🟡 **MEDIUM — no reduced-motion gate at all.** The CSS `data-motion='reduced'` kill only covers CSS animations; a full 110-particle physics burst still fires for users who explicitly asked for calm. Same class of miss as the stage transitions.
- 🟢 **LOW — canvas sized once from the parent on mount**; if the modal reflows (actions swap between spinning/revealed layouts), the burst field is the old rect.

### `src/components/KineticText.tsx`
- 🟢 **LOW — descender clipping risk**: letter masks are `overflow-hidden` with only `pb-[0.08em]` headroom; Cormorant italic 'y', 'g', 'p', 'q' can kiss the mask floor depending on font load timing.
- 🟢 **LOW — inner letter spans aren't `aria-hidden`**; parent has `aria-label`, but some screen readers can still spell the word letter-by-letter.
- 🟢 **LOW — `whileInView margin: -40px`** means headlines exactly at the bottom edge on entry pop mid-scroll, fine — noted.

### `src/components/Parallax.tsx`
- 🟢 **LOW — extreme-viewport gap risk**: parallax headroom is fixed (-mt-8/12/16 ≈ 32–64px) while delta scales with viewport height; an ultra-tall learn hero on a very short viewport can expose the image edge mid-scroll.
- 🟢 **LOW — `speed` sign/direction undocumented in component**; negative speed from a future caller produces inverted motion with no guard.

### `src/components/SpeakTimer.tsx`
- 🟢 **LOW — hardcoded stroke colors (`#E7DCC9` track, `#2D2418` ticks)**: in Midnight Noir the 60 tick marks sit at near-zero contrast against the dark card. Volume glow compensates partially.
- 🟢 **LOW — exhale pulses use `setState` inside the rAF tick**; fine at 3 events/minute, but it's the only React state touched per-frame-adjacent code path — noted for the perf ledger.

### `src/components/RouletteModal.tsx`
- 🟢 **LOW — double confetti**: the Lucide `float-up` icon row AND the new `ConfettiBurst` canvas both celebrate; visually rich, arguably redundant.
- 🟢 **LOW — the old float-up icons use randomized mount styles each reveal; combined with canvas burst, z-order between the two effects is coincidental (icons z-20, canvas z-20).**

### `src/components/CustomCursor.tsx` (post-fix review)
- 🟢 **LOW — `cursor: none !important` also swallows the I-beam over text inputs/textareas**: with the custom cursor ON, typing in the notes pad gives no insertion-position cue. Consider exempting `input, textarea, [contenteditable]` from the rule.
- 🟢 **LOW — `data-custom-cursor` attr lifecycle is independent of component health**: applySettings sets it even if the CustomCursor component itself later fails to mount; current implementation mounts reliably — noted as an invariant to protect.

### `src/components/CategoryHoverCard.tsx`
- 🟢 **LOW — the same image appears twice on hover** (full-bleed card background AND the floating magnetic lens). Rich, but visually duplicative at rest; lens offset was designed assuming card-only imagery.
- 🟢 **LOW — tilt + reveal compete**: the in-card hover image fade (700ms) is timed for a static card; under live 3D tilt the reveal can feel detached from the card plane.

### Cross-cutting (no single file)
- 🟡 **MEDIUM — no React error boundary anywhere**: one thrown render error (a malformed future topic, a null in a new feature) whitescreens the whole app. Recovery = reload.
- 🟡 **MEDIUM — entire media layer is base64-inlined**: 30 narrations + 40 note images now ship in the initial HTML fetch (25.7 MB, gzip 18.9 MB). First-paint competes with parsing; Lighthouse on 4G will show multi-second TTI. (Same root cause as vite.config finding; restated once by design.)
- 🟢 **LOW — `AnimatePresence mode="wait"` for stage switches serializes exits+entries**; feels deliberate, but on slow devices the dashboard re-entrance adds ~1s per navigation.
- 🟢 **LOW — no `prefers-color-scheme` auto default**; theme is manual-only (design choice, noted).

### Pass 2 — sweep findings (hygiene, semantics, dead weight)
- 🟡 **MEDIUM — `RouletteModal` has no `role="dialog"` / `aria-modal`** (contrast: SettingsDrawer L62 has it). Screen-reader users aren't told a modal opened; focus order is unmanaged. Same family as the drawer's missing focus trap.
- 🟢 **LOW — conflicting duplicate utilities `pr-4.5 pr-4`** on the roulette Back button (L150): same-property classes twice in one string; final value depends on stylesheet order, not intent.
- 🟢 **LOW — `src/utils/cn.ts` is imported by nothing** (0 usages) yet drags `clsx` + `tailwind-merge` into the dependency tree and bundle.
- 🟢 **LOW — SpeakTimer's decorative SVGs lack `aria-hidden="true"`** (both ring svgs): AT announces 61 graphical nodes of noise around the time digits.
- ✅ **Hygiene positives (verified by scan):** zero `TODO/FIXME`, zero `console.*`, zero `debugger`, zero `dangerouslySetInnerHTML`/`eval` in src. StepRail stage actives (1/2/3) verified correct. `tsc --noEmit` clean under strict + noUnusedLocals/Parameters.


---

## 📊 Severity Ledger (auto-counted)

| Severity | Count |
|----------|-------|
| 🔴 CRITICAL | 1 |
| 🟡 MEDIUM | 22 |
| 🟢 LOW | 65 |
| **Total findings** | **88** across **31** files + cross-cutting |

### Critical, restated
1. **`App.tsx` L116-129** — completion race: timer-finish + manual "Claim Victory" inside the 800 ms window records the session twice. Guard with a `completedRef`.

### The three that should block the next release train
1. 🔴 Double-record race (above).
2. 🟡 Free-XP bypass — "Claim Victory" before a second is spoken (App L1121).
3. 🟡 25.7 MB single-file media inline + SW double-caching it twice (vite.config / sw.js) — the performance foundation every other finding sits on.

### Suggested fix order (first 8)
critical → claim-victory schema (guard + minimum spoken seconds) → error boundary →
media lazy-loading + SW dedupe → back-button hash guard → activeTab reset →
reduced-motion coverage (stage transitions, confetti) → sticky-note transform ownership.

---

### Audit integrity notes
- One flagged item (done-page wax-seal "lying") was **retracted in-file** after
  cross-checking `useStats.recordSession` — the seal was truthful; the entry now
  documents the *actual* gap (silent auto-mastery).
- All performance claims about per-frame work verified against the rAF loops.
- All line numbers verified against the working tree at audit time.

*Audit closed: two full passes + targeted sweeps over every file in `src/`,
`public/`, and the build configuration.*
### Pass 3 — lens sweep (a11y-contrast, secrets, deps, mobile, shimmer physics)
- 🟡 **MEDIUM — small-text contrast fails WCAG AA on key accents.** `amber-deep` (#96692C) on `cream` (#F2E9D9) measures ≈ **3.8:1**; the design system puts 10–11 px uppercase labels (`tracking-[0.2em] text-amber-deep`) all over chips, eyebrows and pills in Golden Hour — below the 4.5:1 AA bar for small text. Large display usage is fine; micro-labels aren't.
- 🟢 **LOW — KineticText fragments `shimmer-text`.** Each masked letter is its own span carrying the shimmer gradient with `background-size: 200% auto` *of the letter's own box* — the travelling gold wave restarts per letter instead of flowing continuously across "random". Visible as repetitive twinkle, not liquid shimmer.
- 🟢 **LOW — `package.json` still named `react-vite-tailwind`** with no description/repo fields — incongruent with "Verbalis" and the human README.
- 🟢 **LOW — PWA `theme_color`/`background_color` are static cream**: in Midnight Noir the installed app's title bar/splash stays buttermilk.
- 🟢 **LOW — offscreen decorative blobs use fixed 600–700 px widths** (App L139-140): safe only because of the root `overflow-x-hidden`; any future wrapper without it exposes horizontal scroll on narrow devices.
- ✅ **Secret scan verified clean** — no tokens/keys present anywhere in the tree.

### Pass 5 — config & deliverable verification
- 🟢 **LOW — `noUncheckedIndexedAccess` is off** in tsconfig (strict ✓, noUnusedLocals/Parameters ✓, noFallthroughCasesInSwitch ✓). Consequence: `narrationUrl()` in `src/data/assets.ts` types as `string` but can return `undefined` for an unregistered id — sound today only because `hasNarration()` guards every call site by convention, not by type.
- ✅ tsconfig posture otherwise exemplary; `dist/` carries sw.js, manifest and all icons (public assets ship correctly); inlined bundle verified to contain the feature markers (`data-bloom-hero` present).

### Pass 6 — media asset integrity (32 voices + 40 pages)
- ✅ every MP3 has a valid ID3/MPEG header, every JPG a valid SOI marker, no truncated or near-empty files.
- 🟢 **LOW — total media payload ~20 MB binary → ~27 MB after base64**, confirming the single-file strategy is the app's dominant performance fact (already logged as the architecture MEDIUM).

