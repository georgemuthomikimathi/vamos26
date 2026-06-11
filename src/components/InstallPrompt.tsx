"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "vamos26-install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const ua = window.navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIos(ios);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBip);

    if (ios) {
      const timer = window.setTimeout(() => setVisible(true), 4000);
      return () => {
        window.removeEventListener("beforeinstallprompt", onBip);
        window.clearTimeout(timer);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install VAMOS26 app"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 z-[8500] max-w-md mx-auto md:max-w-lg"
    >
      <div className="bg-card border border-pitch/30 rounded-2xl shadow-2xl p-4 flex gap-3 items-start">
        <div className="w-10 h-10 rounded-xl bg-pitch/15 flex items-center justify-center shrink-0">
          <Download size={20} className="text-pitch" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-xl text-white">Install VAMOS26</p>
          {isIos && !deferred ? (
            <p className="text-sm text-muted mt-1 leading-relaxed">
              Tap <strong className="text-white">Share</strong> →{" "}
              <strong className="text-white">Add to Home Screen</strong> for live scores on your
              home screen.
            </p>
          ) : (
            <p className="text-sm text-muted mt-1">
              Add live World Cup scores to your home screen — works like an app.
            </p>
          )}
          <div className="flex gap-2 mt-3">
            {deferred && (
              <button
                type="button"
                onClick={install}
                className="bg-pitch text-navy text-sm font-semibold px-4 py-2 rounded-xl tap-scale focus-ring"
              >
                Install
              </button>
            )}
            <button
              type="button"
              onClick={dismiss}
              className="text-sm text-muted hover:text-white px-3 py-2 tap-scale focus-ring"
            >
              Not now
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
          className="text-muted hover:text-white p-1 tap-scale focus-ring shrink-0"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
