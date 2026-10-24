import { AnimatePresence, motion } from "framer-motion";
import { Download, Share } from "lucide-react";
import { useEffect, useState } from "react";

// Chrome/Edge/Android fire this before showing their own install UI; it isn't
// in the TypeScript DOM typings.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

// iOS has no install prompt; Safari installs via Share → Add to Home Screen.
function isIos() {
  return (
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

export function InstallAppButton() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(isStandalone);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", handlePrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handlePrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const ios = isIos();
  if (installed || (!promptEvent && !ios)) return null;

  const handleClick = async () => {
    if (!promptEvent) {
      setShowIosHint((current) => !current);
      return;
    }
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    // A prompt event can only be used once.
    setPromptEvent(null);
    if (outcome === "accepted") setInstalled(true);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-expanded={promptEvent ? undefined : showIosHint}
        className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--color-border-glass)] bg-[var(--color-surface-glass)] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-secondary)] backdrop-blur-xl transition-colors hover:text-[var(--color-text-primary)] sm:px-4"
      >
        <Download className="h-3.5 w-3.5" />
        Install<span className="hidden sm:inline"> app</span>
      </button>

      <AnimatePresence>
        {showIosHint && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            role="status"
            className="absolute right-0 top-full z-40 mt-2 w-60 rounded-2xl border border-[var(--color-border-glass)] bg-[var(--color-surface)] p-4 text-sm leading-6 text-[var(--color-text-secondary)] shadow-[0_12px_30px_0_var(--shadow-card)] backdrop-blur-xl"
          >
            Tap{" "}
            <Share className="inline h-4 w-4 align-[-3px] text-[var(--color-accent-blue)]" />{" "}
            <span className="font-medium text-[var(--color-text-primary)]">
              Share
            </span>{" "}
            in Safari, then{" "}
            <span className="font-medium text-[var(--color-text-primary)]">
              Add to Home Screen
            </span>
            .
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
