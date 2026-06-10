"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { GA_MEASUREMENT_ID, isAnalyticsConfigured } from "@/lib/analytics";
import { hasAdConsent } from "@/components/CookieConsent";

export default function GoogleAnalytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isAnalyticsConfigured()) return;

    const sync = () => setEnabled(hasAdConsent());
    sync();
    window.addEventListener("vamos26-consent-change", sync);
    return () => window.removeEventListener("vamos26-consent-change", sync);
  }, []);

  if (!isAnalyticsConfigured() || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
