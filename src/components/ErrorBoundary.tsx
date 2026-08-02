import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Mic, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
  message: string;
}

/**
 * The safety net. One bad render must never whitescreen the stage —
 * we catch it, show an on-brand calm fallback, and offer a way back.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : String(err) };
  }

  componentDidCatch(err: unknown, info: ErrorInfo) {
    // deliberate breadcrumb for production diagnosis; never leaks to UX
    try {
      console.error('[verbalis] render crash:', err, info.componentStack);
    } catch {
      /* even logging must be safe */
    }
  }

  private reload = () => {
    try {
      window.location.assign(window.location.pathname + window.location.search);
    } catch {
      window.location.reload();
    }
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className="min-h-screen bg-cream text-espresso font-body grid place-items-center px-6">
        <div className="max-w-md text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber/15 border border-amber/30 grid place-items-center">
            <Mic className="w-7 h-7 text-amber-deep" />
          </div>
          <h1 className="font-display text-3xl tracking-tight">The stage lights flickered.</h1>
          <p className="text-sm text-warm-stone leading-relaxed">
            Something backstage slipped a cue. Your progress is safe — it lives on this device —
            so take a breath and step back in.
          </p>
          {this.state.message && (
            <p className="text-[11px] text-ink-faint font-mono bg-ivory border border-ink-wash/15 rounded-lg px-3 py-2 break-all">
              {this.state.message.slice(0, 160)}
            </p>
          )}
          <button
            onClick={this.reload}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-espresso/90 text-ivory font-medium hover:bg-espresso transition shadow-md"
          >
            <RotateCcw className="w-4 h-4" /> Return to the Stage
          </button>
        </div>
      </div>
    );
  }
}
