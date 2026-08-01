/**
 * Generated premium asset registry.
 *
 * Studio voice narrations  -> public/audio/<topicId>.mp3
 * Handwritten note art     -> public/notes/<topicId>.jpg
 *
 * Topics NOT listed here gracefully fall back to the built-in
 * browser narration and the interactive sticky-note cards.
 */
export const NARRATED_TOPIC_IDS: ReadonlySet<string> = new Set<string>([
  'p1', 's3', 'a1', 'h3', 'n1', 't1', 'l1', 'so3', 'b3', 's5',
]);

export const NOTE_ART_TOPIC_IDS: ReadonlySet<string> = new Set<string>([
  'p1', 's3', 'a1', 'h3', 'n1', 't1', 'l1', 'so3', 'b3', 's5',
]);

export const hasNarration = (id: string) => NARRATED_TOPIC_IDS.has(id);
export const hasNoteArt = (id: string) => NOTE_ART_TOPIC_IDS.has(id);

export const narrationUrl = (id: string) => `/audio/${id}.mp3`;
export const noteArtUrl = (id: string) => `/notes/${id}.jpg`;
