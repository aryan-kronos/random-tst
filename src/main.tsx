import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { applySettings, useSettings } from "./hooks/useSettings";

// paint settings before the first frame so the theme never flashes
applySettings();

// production: offline-capable PWA shell that NEVER strands you on a stale
// build. When a freshly-deployed worker takes control, we reload exactly once
// into the new world (guarded so the very first install doesn't bounce).
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  let refreshing = false;
  const hadController = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!hadController || refreshing) return;
    refreshing = true;
    window.location.reload();
  });
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // nudge the update check so deploys surface even in long-lived tabs
        setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
      })
      .catch(() => {});
  });
}

/**
 * One motion spine for the whole stage: the in-app calm toggle makes framer
 * drop transform/layout motion entirely; otherwise we defer to the OS
 * prefers-reduced-motion setting. CSS animations are covered by the
 * data-motion curtain in index.css.
 */
function MotionRoot() {
  const settings = useSettings();
  return (
    <MotionConfig reducedMotion={settings.reducedMotion ? "always" : "user"}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MotionConfig>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionRoot />
  </StrictMode>
);
