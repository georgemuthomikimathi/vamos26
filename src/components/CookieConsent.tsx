"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export const COOKIE_CONSENT_KEY = "vamos26-cookie-consent";

export function hasAdConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    setVisible(stored !== "accepted" && stored !== "declined");
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
    window.dispatchEvent(new Event("vamos26-consent-change"));
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-16 md:bottom-4 left-4 right-4 z-[9000] max-w-lg mx-auto"
    >
      <div className="bg-card border border-white/15 rounded-2xl shadow-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-10 h-10 rounded-xl bg-pitch/10 flex items-center justify-center shrink-0">
            <Cookie size={20} className="text-pitch" />
          </div>
          <p className="text-sm text-muted leading-relaxed">
            We use Google AdSense and Analytics, which may set cookies for ads and
            traffic insights. See our{" "}
            <Link href="/privacy" className="text-pitch hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={decline}
            className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] rounded-xl border border-white/15 text-sm text-muted hover:text-white transition-colors tap-scale focus-ring"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="flex-1 sm:flex-none px-4 py-2.5 min-h-[44px] rounded-xl bg-pitch text-navy text-sm font-semibold hover:bg-pitch-dim transition-colors tap-scale focus-ring"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
