// Web Audio API synthesized sounds (no external audio files needed)
let ctx: AudioContext | null = null;
let muted = false;

/** Settings drawer flips this — silence every synth sound. */
export function setAudioMuted(m: boolean) {
  muted = m;
  if (m && ctx) {
    ctx.close().catch(() => {});
    ctx = null;
  }
}

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (muted) return null;
  if (!ctx) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) ctx = new AudioCtx();
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function playTickSound(frequency = 600) {
  try {
    const actx = getAudioContext();
    if (!actx) return;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, actx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, actx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.06, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + 0.05);
  } catch {
    // ignore
  }
}

export function playRevealChime() {
  try {
    const actx = getAudioContext();
    if (!actx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = actx.createOscillator();
      const gain = actx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, actx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.08, actx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + idx * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start(actx.currentTime + idx * 0.08);
      osc.stop(actx.currentTime + idx * 0.08 + 0.55);
    });
  } catch {
    // ignore
  }
}

export function playCompleteFanfare() {
  try {
    const actx = getAudioContext();
    if (!actx) return;
    const chords = [
      { f: [440, 554.37, 659.25], t: 0, d: 0.25 }, // A maj
      { f: [493.88, 622.25, 739.99], t: 0.2, d: 0.25 }, // B maj
      { f: [554.37, 659.25, 880], t: 0.42, d: 0.8 }, // C#m / A high
    ];
    chords.forEach(c => {
      c.f.forEach(freq => {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, actx.currentTime + c.t);
        gain.gain.setValueAtTime(0.07, actx.currentTime + c.t);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + c.t + c.d);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start(actx.currentTime + c.t);
        osc.stop(actx.currentTime + c.t + c.d + 0.05);
      });
    });
  } catch {
    // ignore
  }
}

export function playBellTick() {
  try {
    const actx = getAudioContext();
    if (!actx) return;
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, actx.currentTime);
    gain.gain.setValueAtTime(0.05, actx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(actx.destination);
    osc.start();
    osc.stop(actx.currentTime + 0.09);
  } catch {
    // ignore
  }
}
