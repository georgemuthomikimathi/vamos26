import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "VAMOS26 — FIFA World Cup 2026 Fan Guide",
  description:
    "The ultimate FIFA World Cup 2026 fan site. Explore all 12 groups, star players, the Trionda ball, World Cup trophy, and NYC bars & viewing parties.",
  keywords: [
    "FIFA World Cup 2026",
    "VAMOS26",
    "World Cup groups",
    "NYC soccer bars",
    "World Cup viewing parties",
    "Trionda",
  ],
  openGraph: {
    title: "VAMOS26 — FIFA World Cup 2026",
    description: "Groups, stars, trophy, and NYC discover guide for World Cup 2026",
    siteName: "VAMOS26",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bebas.variable} ${outfit.variable} h-full`}>
      <body className="min-h-full grain">{children}</body>
    </html>
  );
}
