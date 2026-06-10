import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "About",
  description: "About VAMOS26 — live World Cup 2026 scores, stats, and fan guides.",
};

export default function AboutPage() {
  return (
    <StaticPageShell
      title="About VAMOS26"
      subtitle="Built for football fans following every moment of World Cup 2026."
    >
      <section>
        <h2 className="font-display text-2xl text-white mb-3">Our Mission</h2>
        <p>
          VAMOS26 is an independent fan site covering FIFA World Cup 2026 across the
          United States, Mexico, and Canada. We bring together live scores, friendly
          results, lineups, stadium guides, NYC viewing spots, and player scouting reports
          in one mobile-friendly hub.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">What We Offer</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Live match center with scores, subs, and officials</li>
          <li>International friendly results during the road to the tournament</li>
          <li>Complete group-stage draw with all 48 nations</li>
          <li>16 host-city stadium guide with fan culture highlights</li>
          <li>NYC bars, restaurants, and fan zones for match-day planning</li>
          <li>Stats leaders and players to watch editorial coverage</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">Independence</h2>
        <p>
          VAMOS26 is not affiliated with, endorsed by, or connected to FIFA, any
          national federation, or broadcast rights holder. Tournament data is based on
          the official December 2025 Final Draw and publicly available match information.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">Editorial &amp; Monetization</h2>
        <p>
          We publish original previews, player blurbs, and city guides to help fans plan
          their World Cup experience. The site is supported by advertising (Google
          AdSense) and affiliate partnerships with streaming and travel providers,
          clearly disclosed on relevant pages.
        </p>
      </section>
    </StaticPageShell>
  );
}
