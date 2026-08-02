/**
 * Generated premium asset registry.
 *
 * Studio voice narrations  -> src/assets/audio/<topicId>.mp3
 * Handwritten note art     -> src/assets/notes/<topicId>.jpg (+ -short/-sketch variants)
 *
 * Imported through the bundler so everything is embedded in the
 * single-file build — the media works on Vercel AND in any offline
 * single-HTML preview. Topics NOT listed fall back gracefully.
 */
// ---- Studio narrations ----
import audioP1 from '../assets/audio/p1.mp3';
import audioP2 from '../assets/audio/p2.mp3';
import audioP3 from '../assets/audio/p3.mp3';
import audioP4 from '../assets/audio/p4.mp3';
import audioP5 from '../assets/audio/p5.mp3';
import audioS1 from '../assets/audio/s1.mp3';
import audioS2 from '../assets/audio/s2.mp3';
import audioS3 from '../assets/audio/s3.mp3';
import audioS4 from '../assets/audio/s4.mp3';
import audioS5 from '../assets/audio/s5.mp3';
import audioA1 from '../assets/audio/a1.mp3';
import audioA2 from '../assets/audio/a2.mp3';
import audioA3 from '../assets/audio/a3.mp3';
import audioH1 from '../assets/audio/h1.mp3';
import audioH2 from '../assets/audio/h2.mp3';
import audioH3 from '../assets/audio/h3.mp3';
import audioN1 from '../assets/audio/n1.mp3';
import audioN2 from '../assets/audio/n2.mp3';
import audioN3 from '../assets/audio/n3.mp3';
import audioT1 from '../assets/audio/t1.mp3';
import audioT2 from '../assets/audio/t2.mp3';
import audioT3 from '../assets/audio/t3.mp3';
import audioL1 from '../assets/audio/l1.mp3';
import audioL2 from '../assets/audio/l2.mp3';
import audioL3 from '../assets/audio/l3.mp3';
import audioL4 from '../assets/audio/l4.mp3';
import audioSo1 from '../assets/audio/so1.mp3';
import audioSo2 from '../assets/audio/so2.mp3';
import audioSo3 from '../assets/audio/so3.mp3';
import audioB1 from '../assets/audio/b1.mp3';
import audioB2 from '../assets/audio/b2.mp3';
import audioB3 from '../assets/audio/b3.mp3';

// ---- Handwritten note art: main desk page ----
import noteP1 from '../assets/notes/p1.jpg';
import noteP2 from '../assets/notes/p2.jpg';
import noteP3 from '../assets/notes/p3.jpg';
import noteP4 from '../assets/notes/p4.jpg';
import noteP5 from '../assets/notes/p5.jpg';
import noteS1 from '../assets/notes/s1.jpg';
import noteS2 from '../assets/notes/s2.jpg';
import noteS3 from '../assets/notes/s3.jpg';
import noteS4 from '../assets/notes/s4.jpg';
import noteS5 from '../assets/notes/s5.jpg';
import noteA1 from '../assets/notes/a1.jpg';
import noteA2 from '../assets/notes/a2.jpg';
import noteA3 from '../assets/notes/a3.jpg';
import noteH1 from '../assets/notes/h1.jpg';
import noteH2 from '../assets/notes/h2.jpg';
import noteH3 from '../assets/notes/h3.jpg';
import noteN1 from '../assets/notes/n1.jpg';
import noteN2 from '../assets/notes/n2.jpg';
import noteN3 from '../assets/notes/n3.jpg';
import noteT1 from '../assets/notes/t1.jpg';
import noteT2 from '../assets/notes/t2.jpg';
import noteT3 from '../assets/notes/t3.jpg';
import noteL1 from '../assets/notes/l1.jpg';
import noteL2 from '../assets/notes/l2.jpg';
import noteL3 from '../assets/notes/l3.jpg';
import noteL4 from '../assets/notes/l4.jpg';
import noteSo1 from '../assets/notes/so1.jpg';
import noteSo2 from '../assets/notes/so2.jpg';
import noteSo3 from '../assets/notes/so3.jpg';
import noteB1 from '../assets/notes/b1.jpg';
import noteB2 from '../assets/notes/b2.jpg';
import noteB3 from '../assets/notes/b3.jpg';

// ---- Handwritten note art: pocket short notes (corkboard) ----
import noteP1Short from '../assets/notes/p1-short.jpg';
import noteP2Short from '../assets/notes/p2-short.jpg';
import noteP3Short from '../assets/notes/p3-short.jpg';
import noteP4Short from '../assets/notes/p4-short.jpg';
import noteP5Short from '../assets/notes/p5-short.jpg';

// ---- Handwritten note art: visual explainer (sketchnote) ----
import noteP1Sketch from '../assets/notes/p1-sketch.jpg';
import noteP2Sketch from '../assets/notes/p2-sketch.jpg';
import noteP3Sketch from '../assets/notes/p3-sketch.jpg';
import noteP4Sketch from '../assets/notes/p4-sketch.jpg';
import noteP5Sketch from '../assets/notes/p5-sketch.jpg';

const NARRATIONS: Record<string, string> = {
  p1: audioP1,
  p2: audioP2,
  p3: audioP3,
  p4: audioP4,
  p5: audioP5,
  s1: audioS1,
  s2: audioS2,
  s3: audioS3,
  s4: audioS4,
  s5: audioS5,
  a1: audioA1,
  a2: audioA2,
  a3: audioA3,
  h1: audioH1,
  h2: audioH2,
  h3: audioH3,
  n1: audioN1,
  n2: audioN2,
  n3: audioN3,
  t1: audioT1,
  t2: audioT2,
  t3: audioT3,
  l1: audioL1,
  l2: audioL2,
  l3: audioL3,
  l4: audioL4,
  so1: audioSo1,
  so2: audioSo2,
  so3: audioSo3,
  b1: audioB1,
  b2: audioB2,
  b3: audioB3,
};

/** Each topic's note gallery: [main desk page, pocket shorts?, visual explainer?] */
const NOTE_ART: Record<string, string[]> = {
  p1: [noteP1, noteP1Short, noteP1Sketch],
  p2: [noteP2, noteP2Short, noteP2Sketch],
  p3: [noteP3, noteP3Short, noteP3Sketch],
  p4: [noteP4, noteP4Short, noteP4Sketch],
  p5: [noteP5, noteP5Short, noteP5Sketch],
  s1: [noteS1],
  s2: [noteS2],
  s3: [noteS3],
  s4: [noteS4],
  s5: [noteS5],
  a1: [noteA1],
  a2: [noteA2],
  a3: [noteA3],
  h1: [noteH1],
  h2: [noteH2],
  h3: [noteH3],
  n1: [noteN1],
  n2: [noteN2],
  n3: [noteN3],
  t1: [noteT1],
  t2: [noteT2],
  t3: [noteT3],
  l1: [noteL1],
  l2: [noteL2],
  l3: [noteL3],
  l4: [noteL4],
  so1: [noteSo1],
  so2: [noteSo2],
  so3: [noteSo3],
  b1: [noteB1],
  b2: [noteB2],
  b3: [noteB3],
};

export const hasNarration = (id: string) => id in NARRATIONS;
export const hasNoteArt = (id: string) => id in NOTE_ART;

export const narrationUrl = (id: string): string => NARRATIONS[id];
export const noteArtUrls = (id: string): string[] => NOTE_ART[id] ?? [];
