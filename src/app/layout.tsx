import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Outfit } from "next/font/google";
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

export const metadata: Metadata = {
  title: "VAMOS26 — Live Scores, Stats & World Cup 2026",
  description:
    "VAMOS26: live World Cup scores, friendly results, stadium guide, stats leaders, players to watch, and host city shop.",
  keywords: [
    "FIFA World Cup 2026",
    "VAMOS26",
    "live scores",
    "World Cup stadiums",
    "top scorers",
    "friendly scores",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VAMOS26",
  },
  openGraph: {
    title: "VAMOS26 — FIFA World Cup 2026",
    description: "Live scores, stats, watchlists, and city-themed shop",
    siteName: "VAMOS26",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full grain pb-16 md:pb-0">{children}</body>
    </html>
  );
}
