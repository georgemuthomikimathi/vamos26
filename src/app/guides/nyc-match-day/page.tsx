import type { Metadata } from "next";
import Link from "next/link";
import StaticPageShell from "@/components/StaticPageShell";
import GuideAffiliatePanel from "@/components/GuideAffiliatePanel";
import { NYC_TRAVEL_AFFILIATES, HOST_CITY_TRAVEL_AFFILIATES } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "NYC World Cup 2026 Match-Day Guide",
  description:
    "Where to watch, stay, eat, and ride in New York City for World Cup 2026 — bars, fan zones, MetLife Stadium transit, and borough-by-borough tips.",
  alternates: { canonical: "https://vamos26.com/guides/nyc-match-day" },
};

export default function NYCMatchDayGuidePage() {
  return (
    <StaticPageShell
      title="NYC Match-Day Guide for World Cup 2026"
      subtitle="Bars, fan zones, hotels, and the fastest route to MetLife — the tournament is live and NYC is match-ready."
    >
      <p>
        New York City is the <strong className="text-white">media and fan capital</strong> of
        World Cup 2026 in the United States. Whether you&apos;re watching USA in Group D,
        catching Mexico on a giant screen in Queens, or riding NJ Transit to the{" "}
        <strong className="text-white">Final at MetLife Stadium</strong> on July 19, this
        guide gets you match-ready.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">Where to watch in NYC</h2>
      <p>
        With the tournament underway, Manhattan sports bars like{" "}
        <strong className="text-white">Smithfield Hall</strong>,{" "}
        <strong className="text-white">Nevada Smith&apos;s</strong>, and{" "}
        <strong className="text-white">Finnerty&apos;s</strong> fill fast for USA and Mexico
        matches. <strong className="text-white">Brooklyn</strong> spots from Greenpoint to Red
        Hook offer waterfront viewing and neighborhood energy.{" "}
        <strong className="text-white">Queens</strong> and the Bronx bring global fan culture —
        ideal for neutral games and Latin American sides.
      </p>
      <p>
        Browse our curated map of bars, restaurants, fan zones, and viewing parties on the{" "}
        <Link href="/#discover" className="text-pitch hover:underline">
          Discover NYC section
        </Link>{" "}
        — filter by borough or search by neighborhood.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">MetLife corridor</h2>
      <p>
        Brazil vs Morocco, France vs Senegal, and the World Cup Final all land at MetLife.
        Pre-match at spots near East Rutherford or ride NJ Transit from Penn Station — browse
        our <strong className="text-white">Meadowlands View Pub</strong> and{" "}
        <strong className="text-white">American Dream Fan Deck</strong> entries for on-site
        options.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">Getting to MetLife Stadium</h2>
      <p>
        MetLife sits in <strong className="text-white">East Rutherford, NJ</strong> — not in
        the five boroughs, but easy from Midtown:
      </p>
      <ol className="list-decimal pl-6 space-y-2">
        <li>
          Take <strong className="text-white">NJ Transit</strong> from{" "}
          <strong className="text-white">Penn Station</strong> (Moynihan Hall) on Meadowlands
          Rail Service match days — roughly 30 minutes.
        </li>
        <li>
          Rideshare from Manhattan is an option for late-night returns after the Final — budget
          surge pricing on peak nights.
        </li>
        <li>
          Arrive early. World Cup security and fan festival zones add time beyond a typical NFL
          game.
        </li>
      </ol>

      <h2 className="font-display text-3xl text-white pt-4">Where to stay</h2>
      <p>
        <strong className="text-white">Midtown / Penn Station</strong> — best for MetLife day
        trips and Amtrak arrivals. <strong className="text-white">Brooklyn</strong> — vibe and
        value, still one subway ride from Manhattan watch spots.{" "}
        <strong className="text-white">Long Island City</strong> — quick access to Queens
        venues and Manhattan.
      </p>

      <GuideAffiliatePanel title="Book NYC stays & transit" links={NYC_TRAVEL_AFFILIATES} />

      <h2 className="font-display text-3xl text-white pt-4">Match-day checklist</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>OMNY or MetroCard loaded — summer subway crowds are real.</li>
        <li>Bar reservations for USA / Mexico kickoffs — book 48 hours ahead.</li>
        <li>Sunscreen and water for outdoor fan zones in June heat.</li>
        <li>Download the Fox Sports or Telemundo app before kickoff — bar Wi-Fi fails when everyone streams.</li>
      </ul>

      <h2 className="font-display text-3xl text-white pt-4">Beyond NYC</h2>
      <p>
        Road-tripping to Philadelphia, Boston, or Miami for group-stage games? Compare flights
        and hotels across all 16 host cities.
      </p>

      <GuideAffiliatePanel title="Host-city travel" links={HOST_CITY_TRAVEL_AFFILIATES} />

      <p className="pt-4 border-t border-white/10">
        Need broadcast info? Read{" "}
        <Link href="/guides/how-to-watch" className="text-pitch hover:underline">
          How to Watch World Cup 2026 in the USA
        </Link>
        .
      </p>
    </StaticPageShell>
  );
}
