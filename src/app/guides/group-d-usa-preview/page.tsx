import type { Metadata } from "next";
import Link from "next/link";
import StaticPageShell from "@/components/StaticPageShell";
import GuideAffiliatePanel from "@/components/GuideAffiliatePanel";
import { GEAR_AFFILIATES, STREAMING_AFFILIATES, TICKET_AFFILIATES } from "@/lib/affiliates";

export const metadata: Metadata = {
  title: "World Cup 2026 Group D Preview — USA, Paraguay, Australia, Türkiye",
  description:
    "Group D preview for FIFA World Cup 2026: USA as host, Paraguay's grit, Australia's Socceroos, and Türkiye's fan power. Storylines and how to watch.",
  alternates: { canonical: "https://vamos26.com/guides/group-d-usa-preview" },
};

export default function GroupDGuidePage() {
  return (
    <StaticPageShell
      title="Group D Preview: USA's Road Starts Here"
      subtitle="Paraguay, Australia, and Türkiye join the hosts in a group where every point matters — and MetLife Stadium is never far from the conversation."
    >
      <p>
        <strong className="text-white">Group D</strong> is the United States&apos; group at
        World Cup 2026. As co-hosts, the{" "}
        <strong className="text-white">Stars and Stripes</strong> carry expectation — but
        Paraguay, Australia, and Türkiye are exactly the kind of opponents that make a
        48-team World Cup unpredictable.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">USA — host nation pressure</h2>
      <p>
        The USMNT open their campaign with home crowds and a generation blending{" "}
        <strong className="text-white">MLS staples and European-based stars</strong>. Expect
        high pressing, athletic wide play, and loud support whenever matches are within reach
        of the Northeast corridor — including fixtures tied to{" "}
        <strong className="text-white">MetLife Stadium</strong> in East Rutherford.
      </p>
      <p>
        The goal isn&apos;t just to escape the group — it&apos;s to build momentum for a
        knockout run in a tournament America is hosting for the first time since 1994.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">Paraguay — compact and dangerous</h2>
      <p>
        La Albirroja rarely dazzle with possession but they{" "}
        <strong className="text-white">frustrate favorites</strong>. Set pieces, physical
        duels, and a low block can steal a result on any day. USA will need patience and
        movement off the ball to break them down.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">Australia — miles traveled, hearts big</h2>
      <p>
        The <strong className="text-white">Socceroos</strong> punch above their weight on
        the global stage. They press in spells, defend as a unit, and carry the energy of
        a nation that treats every World Cup appearance like a festival. Third-place math
        could hinge on their results against fellow contenders.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">Türkiye — atmosphere merchants</h2>
      <p>
        Turkish supporters travel in waves and their team plays with{" "}
        <strong className="text-white">intensity and flair</strong>. A hot night, a roaring
        crowd, and Türkiye can make any group uncomfortable. USA vs Türkiye could be one of
        the loudest fixtures of the group stage.
      </p>

      <h2 className="font-display text-3xl text-white pt-4">What to watch for</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Can the USA win the group and avoid a early knockout gauntlet?</li>
        <li>Will goal difference matter with eight best third-place teams advancing?</li>
        <li>Paraguay vs Australia may decide who challenges the US for top two.</li>
      </ul>

      <p>
        Follow live scores on{" "}
        <Link href="/#live" className="text-pitch hover:underline">
          VAMOS26 Live
        </Link>{" "}
        and explore all 12 groups on the{" "}
        <Link href="/#groups" className="text-pitch hover:underline">
          group stage page
        </Link>
        .
      </p>

      <GuideAffiliatePanel
        title="Watch USA matches"
        links={STREAMING_AFFILIATES.slice(0, 4)}
      />
      <GuideAffiliatePanel title="Rep your team" links={GEAR_AFFILIATES} />
      <GuideAffiliatePanel title="Get to the stadium" links={TICKET_AFFILIATES} />
    </StaticPageShell>
  );
}
