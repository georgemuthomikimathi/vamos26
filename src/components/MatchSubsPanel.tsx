import type { Match } from "@/lib/scores/types";
import type { MatchMeta } from "@/lib/match-meta";
import TeamFlagWithFallback from "@/components/TeamFlag";
import { formatSubstitutionMinute } from "@/lib/timezone";

type MatchSubsPanelProps = {
  match: Match;
  meta: MatchMeta;
};

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

  const homeUsed =
    match.homeSubs ??
    meta.home.subsUsed?.map((s) => ({
      minute: s.minute,
      extraMinute: s.extraMinute,
      playerIn: s.playerIn,
      playerOut: s.playerOut,
    }));
  const awayUsed =
    match.awaySubs ??
    meta.away.subsUsed?.map((s) => ({
      minute: s.minute,
      extraMinute: s.extraMinute,
      playerIn: s.playerIn,
      playerOut: s.playerOut,
    }));

  const homeUsedNames = new Set(
    homeUsed?.flatMap((s) => [s.playerIn, s.playerOut]) ?? []
  );
  const awayUsedNames = new Set(
    awayUsed?.flatMap((s) => [s.playerIn, s.playerOut]) ?? []
  );

  const homeRemaining = meta.home.potentialSubs.filter((n) => !homeUsedNames.has(n));
  const awayRemaining = meta.away.potentialSubs.filter((n) => !awayUsedNames.has(n));

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <SubColumn
        side="Home"
        teamName={match.home.name}
        code={match.home.code}
        potential={match.status === "scheduled" ? meta.home.potentialSubs : homeRemaining}
        used={homeUsed}
        isLive={isLive}
      />
      <SubColumn
        side="Away"
        teamName={match.away.name}
        code={match.away.code}
        potential={match.status === "scheduled" ? meta.away.potentialSubs : awayRemaining}
        used={awayUsed}
        isLive={isLive}
      />
    </div>
  );
}
