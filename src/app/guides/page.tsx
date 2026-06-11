import type { Metadata } from "next";
import Link from "next/link";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "World Cup 2026 Guides",
  description:
    "VAMOS26 fan guides: how to watch in the USA, Group D preview, NYC match-day tips, and affiliate resources for streaming and travel.",
  alternates: { canonical: "https://vamos26.com/guides" },
};

const GUIDES = [
  {
    href: "/guides/how-to-watch",
    title: "How to Watch in the USA",
    description: "Fox, Telemundo, Fubo, YouTube TV, VPN tips, and tickets.",
  },
  {
    href: "/guides/group-d-usa-preview",
    title: "Group D Preview",
    description: "USA, Paraguay, Australia, and Türkiye — storylines and stakes.",
  },
  {
    href: "/guides/nyc-match-day",
    title: "NYC Match-Day Guide",
    description: "Bars, MetLife transit, hotels, and borough watch spots.",
  },
];

export default function GuidesIndexPage() {
  return (
    <StaticPageShell
      title="World Cup 2026 Guides"
      subtitle="Original fan guides for streaming, groups, and match days — built for SEO and packed with trusted partner links."
    >
      <ul className="not-prose space-y-4">
        {GUIDES.map((guide) => (
          <li key={guide.href}>
            <Link
              href={guide.href}
              className="block rounded-2xl border border-white/10 bg-card/60 p-5 hover:border-pitch/40 hover:bg-pitch/5 transition-colors"
            >
              <h2 className="font-display text-2xl text-white">{guide.title}</h2>
              <p className="text-sm text-muted mt-1">{guide.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </StaticPageShell>
  );
}
