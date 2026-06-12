import type { Match } from "@/lib/scores/types";
import type { MatchMeta } from "@/lib/match-meta";
import TeamFlagWithFallback from "@/components/TeamFlag";
import { formatSubstitutionMinute } from "@/lib/timezone";

type MatchSubsPanelProps = {
  match: Match;
  meta?: MatchMeta;
};

function benchRemaining(
  bench: { name: string }[] | undefined,
  usedNames: Set<string>
): string[] {
  if (!bench?.length) return [];
  return bench.map((p) => p.name).filter((name) => !usedNames.has(name));
}

function SubColumn({
  side,
  teamName,
  code,
  potential,
  used,
  isLive,
}: {
  side: string;
  teamName: string;
  code: string;
  potential: string[];
  used?: { minute: number; extraMinute?: number; playerIn: string; playerOut: string }[];
  isLive: boolean;
}) {
  return (
    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <TeamFlagWithFallback code={code} name={teamName} size={28} />
        <div>
          <p className="text-sm font-semibold text-white">{teamName}</p>
          <p className="text-[10px] text-muted uppercase tracking-wider">{side}</p>
        </div>
      </div>

      {used && used.length > 0 ? (
        <div className="mb-3">
          <p className="text-[10px] uppercase tracking-wider text-pitch mb-1.5">
            {isLive ? "Substitutions" : "Subs used"}
          </p>
          <ul className="space-y-1">
            {used.map((s, i) => (
              <li key={i} className="text-xs text-muted">
                <span className="text-gold font-semibold">
                  {formatSubstitutionMinute(s.minute, s.extraMinute)}
                </span>{" "}
                Sub: {s.playerOut}
                <span className="text-muted/60"> → </span>
                <span className="text-pitch">{s.playerIn}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted mb-1.5">
          {used?.length ? "Remaining bench" : "Potential subs"}
        </p>
        <div className="flex flex-wrap gap-1">
          {potential.map((name) => (
            <span
              key={name}
              className="text-[10px] bg-navy/80 border border-white/10 rounded-full px-2 py-0.5 text-muted"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MatchSubsPanel({ match, meta }: MatchSubsPanelProps) {
  const isLive = match.status === "live" || match.status === "halftime";

  const homeUsed = match.homeSubs;
  const awayUsed = match.awaySubs;

  const homeUsedNames = new Set(
    homeUsed?.flatMap((s) => [s.playerIn, s.playerOut]) ?? []
  );
  const awayUsedNames = new Set(
    awayUsed?.flatMap((s) => [s.playerIn, s.playerOut]) ?? []
  );

  const homeFromLineup = benchRemaining(match.homeLineup?.bench, homeUsedNames);
  const awayFromLineup = benchRemaining(match.awayLineup?.bench, awayUsedNames);

  const homeRemaining =
    homeFromLineup.length > 0
      ? homeFromLineup
      : meta?.home.potentialSubs.filter((n) => !homeUsedNames.has(n)) ?? [];

  const awayRemaining =
    awayFromLineup.length > 0
      ? awayFromLineup
      : meta?.away.potentialSubs.filter((n) => !awayUsedNames.has(n)) ?? [];

  const homePotential =
    match.status === "scheduled"
      ? match.homeLineup?.bench?.map((p) => p.name) ??
        meta?.home.potentialSubs ??
        []
      : homeRemaining;

  const awayPotential =
    match.status === "scheduled"
      ? match.awayLineup?.bench?.map((p) => p.name) ??
        meta?.away.potentialSubs ??
        []
      : awayRemaining;

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <SubColumn
        side="Home"
        teamName={match.home.name}
        code={match.home.code}
        potential={homePotential}
        used={homeUsed}
        isLive={isLive}
      />
      <SubColumn
        side="Away"
        teamName={match.away.name}
        code={match.away.code}
        potential={awayPotential}
        used={awayUsed}
        isLive={isLive}
      />
    </div>
  );
}
