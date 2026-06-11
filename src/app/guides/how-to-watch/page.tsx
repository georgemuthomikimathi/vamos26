import type { Metadata } from "next";
import Link from "next/link";
import StaticPageShell from "@/components/StaticPageShell";
import GuideAffiliatePanel from "@/components/GuideAffiliatePanel";
import {
  STREAMING_AFFILIATES,
  VPN_AFFILIATES,
  TICKET_AFFILIATES,
} from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "How to Watch World Cup 2026 in the USA",
  description:
    "Stream FIFA World Cup 2026 in the United States: Fox, Telemundo, Fubo, Peacock, YouTube TV, time zones, and VPN tips for traveling fans.",
  alternates: { canonical: "https://vamos26.com/guides/how-to-watch" },
  openGraph: {
    title: "How to Watch World Cup 2026 in the USA | VAMOS26",
    description: "Complete USA broadcast guide for FIFA World Cup 2026.",
    url: "https://vamos26.com/guides/how-to-watch",
  },
};

export default function HowToWatchGuidePage() {
  return (
    <StaticPageShell
      title="How to Watch World Cup 2026 in the USA"
      subtitle="Every match, every time zone — English and Spanish broadcasts, streaming apps, and what to do when you're abroad."
    >
      <p>
        The 2026 FIFA World Cup is the first 48-team edition and the first hosted
        across <strong className="text-white">USA, Mexico, and Canada</strong>.
        If you&apos;re in the United States, you have more ways than ever to follow
        every group-stage thriller and knockout upset — on TV, streaming, and on the go.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">English-language rights</h2>
      <p>
        <strong className="text-white">Fox Sports</strong> holds English-language rights
        for World Cup 2026 in the USA. Expect matches on <strong className="text-white">FOX</strong>,{" "}
        <strong className="text-white">FS1</strong>, and the Fox Sports app. Knockout rounds
        and the biggest group-stage games typically land on the main FOX broadcast channel;
        deeper group-stage fixtures often shift to FS1.
      </p>
      <p>
        A digital antenna can pick up FOX over-the-air in many markets — useful for cord-cutters
        who still want the flagship games live.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">Spanish-language coverage</h2>
      <p>
        <strong className="text-white">Telemundo</strong> and{" "}
        <strong className="text-white">Univision</strong> cover the tournament in Spanish
        across broadcast and streaming. If you prefer Spanish commentary — or want a second
        feed when FOX is showing another match — Telemundo&apos;s platforms are essential.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">Best streaming options</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <strong className="text-white">Fubo</strong> — strong for soccer fans; includes Fox
          channels plus DVR so you can replay late-night West Coast kickoffs.
        </li>
        <li>
          <strong className="text-white">YouTube TV</strong> — simple cord-cutter bundle with
          Fox, FS1, and local channels.
        </li>
        <li>
          <strong className="text-white">Sling TV</strong> — budget option if you mainly need Fox
          Sports channels.
        </li>
        <li>
          <strong className="text-white">Peacock</strong> — check match listings for studio shows
          and select coverage complements.
        </li>
      </ul>

      <GuideAffiliatePanel title="Stream the World Cup" links={STREAMING_AFFILIATES} />

      <h2 className="font-display text-3xl text-white pt-4">Time zones matter</h2>
      <p>
        Host cities span <strong className="text-white">Eastern to Pacific</strong> in the USA,
        plus Mexico and Canada. A 3 p.m. ET kickoff in New Jersey is noon in Los Angeles.
        Use the{" "}
        <Link href="/#live" className="text-pitch hover:underline">
          VAMOS26 Live Match Center
        </Link>{" "}
        for kickoff times in your local zone as the tournament approaches.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">Watching abroad</h2>
      <p>
        Traveling during the World Cup? A VPN can help you access your home-country
        broadcast when you&apos;re outside the USA. Always follow provider terms of service
        and local laws.
      </p>

      <GuideAffiliatePanel title="VPN for traveling fans" links={VPN_AFFILIATES} />

      <h2 className="font-display text-3xl text-white pt-4">Tickets & in-stadium</h2>
      <p>
        Nothing beats live football. Official FIFA sales, hospitality packages, and verified
        resale markets are your safest routes — avoid unofficial social-media sellers.
      </p>

      <GuideAffiliatePanel title="Tickets & packages" links={TICKET_AFFILIATES} />

      <p className="pt-4 border-t border-white/10">
        Planning a NYC watch party? Read our{" "}
        <Link href="/guides/nyc-match-day" className="text-pitch hover:underline">
          NYC match-day guide
        </Link>
        . Tracking USA&apos;s group? See the{" "}
        <Link href="/guides/group-d-usa-preview" className="text-pitch hover:underline">
          Group D preview
        </Link>
        .
      </p>
    </StaticPageShell>
  );
}
