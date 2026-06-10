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
  title: "VAMOS26 — Live Scores & FIFA World Cup 2026",
  description:
    "The ultimate FIFA World Cup 2026 fan site. Live scores, friendly results, groups, star players, trophy, and NYC bars & viewing parties.",
  keywords: [
    "FIFA World Cup 2026",
    "VAMOS26",
    "live scores",
    "World Cup groups",
    "NYC soccer bars",
    "World Cup viewing parties",
    "Trionda",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "VAMOS26",
  },
  openGraph: {
    title: "VAMOS26 — FIFA World Cup 2026",
    description: "Live scores, groups, stars, trophy, and NYC discover guide",
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
