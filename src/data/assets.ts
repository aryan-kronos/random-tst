/**
 * Generated premium asset registry.
 *
 * Studio voice narrations  -> src/assets/audio/<topicId>.mp3
 * Handwritten note art     -> src/assets/notes/<topicId>.jpg
 *
 * Imported through the bundler so everything is embedded in the
 * single-file build — the media works on Vercel AND in any offline
 * single-HTML preview. Topics NOT listed fall back gracefully.
 */
import audioP1 from '../assets/audio/p1.mp3';
import audioS3 from '../assets/audio/s3.mp3';
import audioA1 from '../assets/audio/a1.mp3';
import audioH3 from '../assets/audio/h3.mp3';
import audioN1 from '../assets/audio/n1.mp3';
import audioT1 from '../assets/audio/t1.mp3';
import audioL1 from '../assets/audio/l1.mp3';
import audioSo3 from '../assets/audio/so3.mp3';
import audioB3 from '../assets/audio/b3.mp3';
import audioS5 from '../assets/audio/s5.mp3';

import noteP1 from '../assets/notes/p1.jpg';
import noteS3 from '../assets/notes/s3.jpg';
import noteA1 from '../assets/notes/a1.jpg';
import noteH3 from '../assets/notes/h3.jpg';
import noteN1 from '../assets/notes/n1.jpg';
import noteT1 from '../assets/notes/t1.jpg';
import noteL1 from '../assets/notes/l1.jpg';
import noteSo3 from '../assets/notes/so3.jpg';
import noteB3 from '../assets/notes/b3.jpg';
import noteS5 from '../assets/notes/s5.jpg';

const NARRATIONS: Record<string, string> = {
  p1: audioP1,
  s3: audioS3,
  a1: audioA1,
  h3: audioH3,
  n1: audioN1,
  t1: audioT1,
  l1: audioL1,
  so3: audioSo3,
  b3: audioB3,
  s5: audioS5,
};

const NOTE_ART: Record<string, string> = {
  p1: noteP1,
  s3: noteS3,
  a1: noteA1,
  h3: noteH3,
  n1: noteN1,
  t1: noteT1,
  l1: noteL1,
  so3: noteSo3,
  b3: noteB3,
  s5: noteS5,
};

export const hasNarration = (id: string) => id in NARRATIONS;
export const hasNoteArt = (id: string) => id in NOTE_ART;

export const narrationUrl = (id: string): string => NARRATIONS[id];
export const noteArtUrl = (id: string): string => NOTE_ART[id];
