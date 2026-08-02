/**
 * Premium asset registry — URL-based.
 *
 * Studio voice narrations  -> /media/audio/<topicId>.mp3
 * Handwritten note art     -> /media/notes/<topicId>.jpg (+ -short/-sketch variants)
 *
 * THE BIG DIET: media used to be imported through the bundler, which
 * base64-inlined ~24 MB of audio + imagery into the single-file HTML.
 * First paint had to slurp every narration before one pixel showed —
 * minutes on 4G, borderline fatal on phones. Media now lives in
 * public/media/ as real files: streamed on demand, range-requested by the
 * audio element, decoded only for the topic you actually visit, and
 * cached by the service worker after first touch.
 */

const NARRATED_IDS = [
  'p1', 'p2', 'p3', 'p4', 'p5',
  's1', 's2', 's3', 's4', 's5',
  'a1', 'a2', 'a3',
  'h1', 'h2', 'h3',
  'n1', 'n2', 'n3',
  't1', 't2', 't3',
  'l1', 'l2', 'l3', 'l4',
  'so1', 'so2', 'so3',
  'b1', 'b2', 'b3',
];

/** Topics with the full 3-piece gallery: desk page + pocket shorts + sketchnote */
const FULL_GALLERY = new Set(['p1', 'p2', 'p3', 'p4', 'p5']);

const audio = (id: string) => `/media/audio/${id}.mp3`;
const note = (id: string) => `/media/notes/${id}.jpg`;

export const hasNarration = (id: string) => NARRATED_IDS.includes(id);
export const hasNoteArt = (id: string) => NARRATED_IDS.includes(id);

export const narrationUrl = (id: string): string => audio(id);

/** Each topic's note gallery: [main desk page, pocket shorts?, visual explainer?] */
export const noteArtUrls = (id: string): string[] =>
  FULL_GALLERY.has(id)
    ? [note(id), note(`${id}-short`), note(`${id}-sketch`)]
    : [note(id)];
