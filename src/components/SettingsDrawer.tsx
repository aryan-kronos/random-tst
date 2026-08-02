import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Volume2, VolumeX, MousePointer2, Sparkles, Wind, Check, Images, Waves } from 'lucide-react';
import { useSettings, setSettings, type ThemeId } from '../hooks/useSettings';

interface Props {
  open: boolean;
  onClose: () => void;
}

function Toggle({ on, onClick, icon: Icon, label, sub }: {
  on: boolean; onClick: () => void; icon: typeof Volume2; label: string; sub: string;
}) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-ink-wash/15 bg-cream/50 hover:border-amber/40 transition text-left"
    >
      <span className="w-9 h-9 rounded-xl bg-ivory border border-ink-wash/15 grid place-items-center shrink-0">
        <Icon className="w-4 h-4 text-amber-deep" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-espresso">{label}</span>
        <span className="block text-[11px] text-ink-faint">{sub}</span>
      </span>
      <span className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${on ? 'bg-amber-deep' : 'bg-ink-wash/40'}`}>
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-ivory shadow-sm transition-transform duration-200 ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
        />
      </span>
    </button>
  );
}

const THEMES: { id: ThemeId; label: string; sub: string; swatch: string; Icon: typeof Sun }[] = [
  { id: 'gold', label: 'Golden Hour', sub: 'buttermilk cream & antique gold', swatch: 'linear-gradient(135deg,#FCF9F0,#F2E9D9 60%,#BE8B3F)', Icon: Sun },
  { id: 'noir', label: 'Midnight Noir', sub: 'warm ink, candlelit amber', swatch: 'linear-gradient(135deg,#211A11,#161009 60%,#E2B568)', Icon: Moon },
];

export default function SettingsDrawer({ open, onClose }: Props) {
  const s = useSettings();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] backdrop-scrim backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '110%' }}
            animate={{ x: 0 }}
            exit={{ x: '110%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-[71] w-full max-w-[380px] bg-ivory border-l border-ink-wash/15 shadow-2xl flex flex-col"
            role="dialog"
            aria-label="Settings"
          >
            <div className="flex items-center justify-between p-6 border-b border-ink-wash/12">
              <div>
                <h2 className="font-display text-2xl text-espresso">Settings</h2>
                <p className="text-[11px] text-ink-faint mt-0.5">Applies instantly · saved on this device</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full border border-ink-wash/25 grid place-items-center text-warm-stone hover:text-espresso hover:border-amber transition"
                aria-label="Close settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* THEME */}
              <section>
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink-faint font-bold mb-3">Appearance</h3>
                <div className="grid grid-cols-2 gap-3">
                  {THEMES.map(t => {
                    const active = s.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSettings({ theme: t.id })}
                        className={`rounded-2xl border p-3 text-left transition ${
                          active
                            ? 'border-amber-deep ring-2 ring-amber/30 bg-cream/70'
                            : 'border-ink-wash/20 bg-cream/40 hover:border-amber/50'
                        }`}
                      >
                        <div
                          className="w-full h-16 rounded-xl mb-2.5 border border-ink-wash/15"
                          style={{ background: t.swatch }}
                        />
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-espresso inline-flex items-center gap-1.5">
                            <t.Icon className="w-3.5 h-3.5 text-amber-deep" />
                            {t.label}
                          </span>
                          {active && <Check className="w-3.5 h-3.5 text-amber-deep" />}
                        </div>
                        <div className="text-[10px] text-ink-faint mt-0.5 leading-snug">{t.sub}</div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* EXPERIENCE */}
              <section className="space-y-2.5">
                <h3 className="text-[11px] uppercase tracking-[0.2em] text-ink-faint font-bold mb-3">Experience</h3>
                <Toggle
                  on={s.sound}
                  onClick={() => setSettings({ sound: !s.sound })}
                  icon={s.sound ? Volume2 : VolumeX}
                  label="Sound effects"
                  sub="roulette ticks, chimes, victory fanfare"
                />
                <Toggle
                  on={s.cursorGlow}
                  onClick={() => setSettings({ cursorGlow: !s.cursorGlow })}
                  icon={Sparkles}
                  label="Golden aura"
                  sub="volumetric light & dust that trail your cursor"
                />
                <Toggle
                  on={s.customCursor}
                  onClick={() => setSettings({ customCursor: !s.customCursor })}
                  icon={MousePointer2}
                  label="Custom cursor"
                  sub="an ink ring that adapts to light & dark"
                />
                <Toggle
                  on={s.hoverPreviews}
                  onClick={() => setSettings({ hoverPreviews: !s.hoverPreviews })}
                  icon={Images}
                  label="Magnetic previews"
                  sub="thumbnails that glide along with your cursor"
                />
                <Toggle
                  on={s.liquidBg}
                  onClick={() => setSettings({ liquidBg: !s.liquidBg })}
                  icon={Waves}
                  label="Liquid light"
                  sub="a slow amber gradient flowing behind the page"
                />
                <Toggle
                  on={s.reducedMotion}
                  onClick={() => setSettings({ reducedMotion: !s.reducedMotion })}
                  icon={Wind}
                  label="Reduced motion"
                  sub="minimises animation across the whole app"
                />
              </section>
            </div>

            <div className="p-6 border-t border-ink-wash/12 text-[11px] text-ink-faint leading-relaxed">
              Verbalis remembers your choices here — themes, motion and sound persist across sessions.
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
