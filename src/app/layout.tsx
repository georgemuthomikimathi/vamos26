import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bebas_Neue, Outfit } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import { ADSENSE_CLIENT, ADSENSE_VERIFICATION_META } from "@/lib/adsense";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#3c5bff" },
    { media: "(prefers-color-scheme: light)", color: "#3c5bff" },
  ],
};

const SITE_URL = "https://vamos26.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VAMOS26 — Live Scores, Stats & World Cup 2026",
    template: "%s | VAMOS26",
  },
  description:
    "VAMOS26: live World Cup 2026 scores, friendly results, lineups, subs, officials, stadium guide, stats leaders, and team news.",
  keywords: [
    "FIFA World Cup 2026",
    "VAMOS26",
    "live scores",
    "World Cup stadiums",
    "World Cup lineups",
    "friendly scores",
    "USA Mexico Canada World Cup",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VAMOS26",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "VAMOS26 — FIFA World Cup 2026",
    description:
      "Live scores, lineups, team news, and stats for World Cup 2026.",
    siteName: "VAMOS26",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VAMOS26 — FIFA World Cup 2026",
    description: "Live scores, stats & team news for World Cup 2026",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "google-adsense-account": ADSENSE_VERIFICATION_META,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${outfit.variable} h-full`}>
      <head>
        <meta name="google-adsense-account" content={ADSENSE_VERIFICATION_META} />
        <Script
          async
          id="adsense-init"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full grain pb-16 md:pb-0">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
