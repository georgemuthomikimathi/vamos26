import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import InstallPrompt from "@/components/InstallPrompt";
import MatchNotificationWatcher from "@/components/MatchNotificationWatcher";
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
    default: "VAMOS26 — Spain World Champions 2026 · Site Refresh Coming",
    template: "%s | VAMOS26",
  },
  description:
    "¡España campeona! Spain beat Argentina 1–0 AET at MetLife to win World Cup 2026. VAMOS26 is preparing a full post-tournament update — thanks for your patience.",
  keywords: [
    "FIFA World Cup 2026",
    "Spain World Champions",
    "VAMOS26",
    "live scores",
    "World Cup stadiums",
    "World Cup lineups",
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
    title: "VAMOS26 — Spain World Champions 2026",
    description:
      "Spain beat Argentina 1–0 AET at MetLife. Celebrate La Roja while VAMOS26 prepares a post-tournament refresh.",
    siteName: "VAMOS26",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "VAMOS26 — Spain World Champions 2026",
    description:
      "¡España campeona! Spain 1–0 Argentina AET · site refresh coming soon",
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
        {/* Raw script tag so AdSense/Google crawlers see the snippet in initial HTML */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full grain pb-16 md:pb-0">
        {children}
        <CookieConsent />
        <GoogleAnalytics />
        <ServiceWorkerRegister />
        <InstallPrompt />
        <MatchNotificationWatcher />
      </body>
    </html>
  );
}
