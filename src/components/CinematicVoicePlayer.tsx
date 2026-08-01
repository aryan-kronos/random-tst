import { useState, useEffect, useRef } from 'react';
import {
  Volume2, Pause, Play, RotateCcw, Sparkles, FileText,
  ChevronDown, ChevronUp, Radio, Headphones,
} from 'lucide-react';
import { useNarration } from '../hooks/useNarration';
import type { Topic } from '../data/topics';
import { hasNarration, narrationUrl } from '../data/assets';

interface Props {
  topic: Topic;
}

const AUDIO_RATES = [1, 1.25, 1.5, 0.85];

/** Drives the pre-rendered studio MP3 for topics that have one. */
function useStudioAudio(topicId: string, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rateIdx, setRateIdx] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const el = new Audio(narrationUrl(topicId));
    el.preload = 'auto';
    el.playbackRate = AUDIO_RATES[rateIdx];

    const onTime = () => setProgress(el.duration ? el.currentTime / el.duration : 0);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => { setPlaying(false); setProgress(0); };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnd);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);

    audioRef.current = el;
    setPlaying(false);
    setStarted(false);
    setProgress(0);
    setDuration(0);

    return () => {
      el.pause();
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.src = '';
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, enabled]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = AUDIO_RATES[rateIdx];
  }, [rateIdx]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().catch(() => {});
      setStarted(true);
    } else {
      el.pause();
    }
  };

  const restart = () => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    setProgress(0);
    el.play().catch(() => {});
    setStarted(true);
  };

  const cycleRate = () => setRateIdx(i => (i + 1) % AUDIO_RATES.length);

  return { playing, started, progress, duration, rate: AUDIO_RATES[rateIdx], toggle, restart, cycleRate };
}

export default function CinematicVoicePlayer({ topic }: Props) {
  const studio = hasNarration(topic.id);
  const narration = useNarration();
  const audio = useStudioAudio(topic.id, studio);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  // Script fallbacks: studio narrations cover the cinematic story; TTS covers everything.
  const ttsScript = `${topic.title}. ${topic.subtitle}. ${topic.cinematicVoiceStory} Here are the key pillars of this idea. ${topic.keyPoints.join('. ')}. When you speak, follow your custom 60-second blueprint. Take a deep breath, and let your authentic voice discover the idea.`;
  const studioScript = `${topic.title}. ${topic.subtitle}. ${topic.cinematicVoiceStory}`;
  const activeScript = studio ? studioScript : ttsScript;

  useEffect(() => {
    narration.stop();
  }, [topic.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const isPlaying = studio ? audio.playing : narration.speaking && !narration.paused;
  const isStarted = studio ? audio.started || audio.playing : narration.speaking;
  const progress = studio ? audio.progress : narration.progress;
  const rate = studio ? audio.rate : narration.rate;

  const handlePlayToggle = () => {
    if (studio) { audio.toggle(); return; }
    if (!narration.speaking) narration.speak(ttsScript);
    else if (narration.paused) narration.resume();
    else narration.pause();
  };

  const handleRestart = () => {
    if (studio) audio.restart();
    else narration.stop();
  };

  const handleRate = () => {
    if (studio) audio.cycleRate();
    else narration.toggleRate();
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber/35 bg-gradient-to-br from-ivory via-parchment/70 to-champagne/60 p-6 sm:p-8 shadow-[0_12px_45px_-15px_rgba(196,162,101,0.35)]">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-amber/15 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Header bar */}
        <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber to-amber-deep text-ivory grid place-items-center shadow-md shadow-amber/25">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-amber-deep font-bold block">
                Cinematic Voice Story
              </span>
              <span className="text-[11px] text-ink-faint">
                {studio ? 'Studio-recorded human-quality narration' : 'Immersive documentary narrative & storytelling breakdown'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {studio && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso text-ivory text-[11px] font-bold uppercase tracking-wider shadow-sm">
                <Headphones className="w-3 h-3 text-amber-glow" />
                Studio Voice
              </span>
            )}
            <button
              onClick={handleRate}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-ink-wash/20 bg-ivory text-xs font-semibold text-warm-stone hover:border-amber transition"
            >
              <Radio className="w-3 h-3 text-amber-deep" />
              {rate.toFixed(2)}x Speed
            </button>
          </div>
        </div>

        {/* Cinematic Story Excerpt Box */}
        <div className="bg-cream/80 backdrop-blur-xs rounded-2xl border border-amber/20 p-5 sm:p-6 mb-6 shadow-inner relative">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-deep mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Theatrical Storytelling Arc
          </div>
          <p className="font-editorial italic text-lg sm:text-xl text-espresso-soft leading-relaxed">
            &ldquo;{topic.cinematicVoiceStory}&rdquo;
          </p>
        </div>

        {/* Audio Player Controls & Waveform */}
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Main Play/Pause Button */}
          <button
            onClick={handlePlayToggle}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-espresso px-7 py-4 text-sm font-medium tracking-wide text-ivory shadow-xl shadow-espresso/20 hover:bg-espresso-ink hover:scale-105 active:scale-95 transition duration-300 group"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Narration</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5 group-hover:scale-110 transition" />
                <span>
                  {studio
                    ? isStarted ? 'Resume Story' : '🎧 Listen to Studio Narration'
                    : narration.speaking ? 'Resume Story' : 'Listen to Cinematic Story'}
                </span>
              </>
            )}
          </button>

          {/* Reset button if active */}
          {isStarted && (
            <button
              onClick={handleRestart}
              className="w-11 h-11 rounded-full border border-ink-wash/25 bg-ivory grid place-items-center text-warm-stone hover:border-amber hover:text-amber-deep transition"
              title={studio ? 'Restart story' : 'Stop story'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Equalizer & Progress Bar */}
          <div className="flex-1 w-full flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-ink-faint">
              <span>
                {isPlaying
                  ? studio ? 'Studio voice narrating…' : 'Narrating story…'
                  : isStarted
                    ? 'Paused'
                    : studio
                      ? `Ready · ${audio.duration ? Math.round(audio.duration) + 's clip · no robotic TTS' : 'no robotic TTS'}`
                      : 'Ready to listen'}
              </span>
              {isPlaying && (
                <div className="flex items-end gap-[3px] h-4">
                  {[0, 1, 2, 3, 4, 5, 6].map(i => (
                    <span
                      key={i}
                      className="w-[3px] rounded-full bg-gradient-to-t from-amber to-amber-deep"
                      style={{
                        animation: `eq 800ms ${i * 90}ms ease-in-out infinite`,
                        height: '60%',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Progress line */}
            <div className="h-2 rounded-full bg-ink-wash/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber via-amber-glow to-amber-deep transition-[width] duration-300"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>

          {/* Transcript toggle */}
          <button
            onClick={() => setShowFullTranscript(!showFullTranscript)}
            className="text-xs text-warm-stone hover:text-amber-deep flex items-center gap-1 font-medium transition whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-amber-deep" />
            {showFullTranscript ? 'Hide script' : 'View full script'}
            {showFullTranscript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Collapsible Full Transcript */}
        {showFullTranscript && (
          <div className="mt-5 pt-5 border-t border-ink-wash/10 text-xs sm:text-sm text-warm-stone leading-relaxed space-y-2 bg-ivory/60 rounded-xl p-4">
            <div className="font-semibold text-espresso">
              {studio ? 'Studio Narration Script:' : 'Full Voice Narration Script:'}
            </div>
            <p>{activeScript}</p>
          </div>
        )}
      </div>
    </div>
  );
}
