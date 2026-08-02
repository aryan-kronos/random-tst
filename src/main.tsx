import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import "./index.css";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { applySettings, useSettings } from "./hooks/useSettings";

// paint settings before the first frame so the theme never flashes
applySettings();

// production: offline-capable PWA shell
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
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
