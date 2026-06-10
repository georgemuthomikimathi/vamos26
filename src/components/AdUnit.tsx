"use client";

import { useEffect, useRef, useState } from "react";
import { hasAdConsent } from "@/components/CookieConsent";
import { ADSENSE_CLIENT } from "@/lib/adsense";

const AD_CLIENT = ADSENSE_CLIENT;

/** Replace with your ad unit slot IDs from the AdSense dashboard */
export const AD_SLOT_HOMEPAGE_INLINE = "0000000000";
export const AD_SLOT_HOMEPAGE_SIDEBAR = "0000000001";
export const AD_SLOT_PLACEHOLDER = AD_SLOT_HOMEPAGE_INLINE;

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

type AdUnitProps = {
  /** Replace with real slot ID from AdSense dashboard */
  slot?: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  className?: string;
  label?: string;
};

export default function AdUnit({
  slot = AD_SLOT_PLACEHOLDER,
  format = "auto",
  className = "",
  label = "Advertisement",
}: AdUnitProps) {
  const [consented, setConsented] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    setConsented(hasAdConsent());
    const onConsent = () => setConsented(true);
    window.addEventListener("vamos26-consent-change", onConsent);
    return () => window.removeEventListener("vamos26-consent-change", onConsent);
  }, []);

  useEffect(() => {
    if (!consented || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense script may still be loading
    }
  }, [consented]);

  if (!consented) return null;

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${className}`}>
      <p className="text-[10px] text-muted/50 text-center mb-2 uppercase tracking-wider">
        {label}
      </p>
      {/* Replace data-ad-slot with your ad unit ID from AdSense dashboard */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
