/**
 * SessionRecorder — one microphone, one take, zero drama.
 *
 * Wraps getUserMedia + MediaRecorder behind the timer's lifecycle:
 * start with the countdown, pause with it, breathe with it, and at the end
 * hand back a single audio Blob measured against real clock time. All audio
 * stays on this device; nothing ever leaves the browser.
 */

export type MicState =
  | 'idle'
  | 'starting'   // permission prompt or hardware warm-up in flight
  | 'recording'
  | 'paused'
  | 'unavailable' // no mic / browser can't record
  | 'denied';     // user said no — we respect it and move on

export interface TakeResult {
  blob: Blob;
  mime: string;
  seconds: number; // wall-clock time actually spent recording (pauses excluded)
}

const MIME_CANDIDATES = [
  'audio/webm;codecs=opus',
  'audio/webm',
  'audio/mp4',
];

export default class SessionRecorder {
  private mr: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private chunks: Blob[] = [];
  private mime = '';
  private activeSince = 0;   // Date.now() of last start/resume
  private gathered = 0;      // ms recorded before the current active span
  private discarded = false;

  state: MicState = 'idle';
  onState: (s: MicState) => void = () => {};

  static supported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia &&
      typeof MediaRecorder !== 'undefined'
    );
  }

  private setState(s: MicState) {
    this.state = s;
    this.onState(s);
  }

  /** Ask for the mic and open the take. Resolves false if we can't record. */
  async start(): Promise<boolean> {
    this.discarded = false;
    if (!SessionRecorder.supported()) {
      this.setState('unavailable');
      return false;
    }
    this.setState('starting');
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
    } catch {
      this.stream = null;
      this.setState('denied');
      return false;
    }
    if (this.discarded) {           // dismissed while the prompt was up
      this.releaseTracks();
      return false;
    }
    this.mime = MIME_CANDIDATES.find(m => MediaRecorder.isTypeSupported(m)) ?? '';
    try {
      this.mr = new MediaRecorder(this.stream, this.mime ? { mimeType: this.mime } : undefined);
    } catch {
      this.releaseTracks();
      this.setState('unavailable');
      return false;
    }
    this.chunks = [];
    this.mr.ondataavailable = e => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data);
    };
    this.gathered = 0;
    this.activeSince = Date.now();
    // 1s timeslice: data flows steadily and a crash mid-take loses at most a breath
    this.mr.start(1000);
    this.setState('recording');
    return true;
  }

  pause() {
    if (this.state !== 'recording' || !this.mr) return;
    try { this.mr.pause(); } catch { return; }
    this.gathered += Date.now() - this.activeSince;
    this.setState('paused');
  }

  resume() {
    if (this.state !== 'paused' || !this.mr) return;
    try { this.mr.resume(); } catch { return; }
    this.activeSince = Date.now();
    this.setState('recording');
  }

  private elapsedSeconds(): number {
    const live = this.state === 'recording' ? Date.now() - this.activeSince : 0;
    return Math.max(0, Math.round((this.gathered + live) / 1000));
  }

  /** Close the take and return it, or null if nothing usable was captured. */
  async stop(): Promise<TakeResult | null> {
    const seconds = this.elapsedSeconds();
    const mr = this.mr;
    this.setState('idle');
    if (!mr || mr.state === 'inactive' || this.discarded) {
      this.releaseTracks();
      this.mr = null;
      this.chunks = [];
      return null;
    }
    const blob = await new Promise<Blob | null>(resolve => {
      mr.onstop = () => {
        const type = mr.mimeType || this.mime || 'audio/webm';
        resolve(this.chunks.length > 0 ? new Blob(this.chunks, { type }) : null);
      };
      mr.onerror = () => resolve(null);
      try { mr.stop(); } catch { resolve(null); }
    });
    this.releaseTracks();
    this.mr = null;
    this.chunks = [];
    if (!blob) return null;
    return { blob, mime: blob.type, seconds };
  }

  /** Throw the take away (stage left early, timer reset) — mic released instantly. */
  discard() {
    this.discarded = true;
    if (this.mr && this.mr.state !== 'inactive') {
      try { this.mr.stop(); } catch { /* already dying */ }
    }
    this.mr = null;
    this.chunks = [];
    this.releaseTracks();
    if (this.state !== 'idle') this.setState('idle');
  }

  private releaseTracks() {
    this.stream?.getTracks().forEach(t => {
      try { t.stop(); } catch { /* track already ended */ }
    });
    this.stream = null;
  }
}
