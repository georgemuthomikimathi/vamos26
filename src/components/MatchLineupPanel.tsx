"use client";

import type { Match, MatchLineup } from "@/lib/scores/types";
import TeamFlagWithFallback from "@/components/TeamFlag";

const ROW_ORDER = ["FWD", "MID", "DEF", "GK"] as const;

function groupByRow(lineup: MatchLineup) {
  const rows: Record<string, MatchLineup["startingXI"]> = {
    GK: [],
    DEF: [],
    MID: [],
    FWD: [],
  };

  for (const p of lineup.startingXI) {
    const role = p.position;
    if (role === "GK") rows.GK.push(p);
    else if (["RB", "CB", "LB", "DEF"].includes(role)) rows.DEF.push(p);
    else if (["DM", "CM", "AM", "MID"].includes(role)) rows.MID.push(p);
    else rows.FWD.push(p);
  }

  return rows;
}

function LineupColumn({
  teamName,
  code,
  lineup,
  highlight,
}: {
  teamName: string;
  code: string;
  lineup: MatchLineup;
  highlight?: boolean;
}) {
  const rows = groupByRow(lineup);

  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        highlight ? "border-pitch/40 bg-pitch/5" : "border-white/10 bg-navy/40"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <TeamFlagWithFallback code={code} name={teamName} size={28} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white text-sm truncate">{teamName}</p>
          <p className="text-[10px] text-muted truncate">
            {lineup.formation ?? "Starting XI"}
            {lineup.coach ? ` · ${lineup.coach}` : ""}
          </p>
        </div>
      </div>

      <div className="relative rounded-lg bg-gradient-to-b from-pitch/10 via-pitch/5 to-pitch/15 border border-pitch/20 p-2 min-h-[140px] flex flex-col justify-between gap-1">
        {ROW_ORDER.map((rowKey) => {
          const players = rows[rowKey];
          if (players.length === 0) return null;
          return (
            <div key={rowKey} className="flex flex-wrap justify-center gap-1">
              {players.map((p) => (
                <div
                  key={`${p.number}-${p.name}`}
                  className="bg-card/90 border border-white/10 rounded-md px-1.5 py-1 text-center min-w-[4.5rem] max-w-[5.5rem]"
                  title={p.name}
                >
                  <div className="text-[9px] font-bold text-pitch">#{p.number}</div>
                  <div className="text-[10px] font-semibold text-white leading-tight truncate">
                    {p.name.split(" ").pop()}
                  </div>
                  <div className="text-[8px] text-muted truncate">{p.position}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {lineup.bench && lineup.bench.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <p className="text-[9px] uppercase tracking-wider text-muted mb-1">Bench</p>
          <div className="flex flex-wrap gap-1">
            {lineup.bench.map((p) => (
              <span
                key={`${p.number}-${p.name}`}
                className="text-[10px] bg-white/5 rounded-full px-2 py-0.5 text-muted"
              >
                #{p.number} {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type MatchLineupPanelProps = {
  match: Match;
  focus?: "home" | "away";
};

export default function MatchLineupPanel({ match, focus }: MatchLineupPanelProps) {
  if (!match.homeLineup && !match.awayLineup) {
    return (
      <p className="text-xs text-muted text-center py-2">
        {match.id.startsWith("af-")
          ? "Official lineups from API-Football appear closer to kickoff."
          : "Lineups will appear closer to kickoff."}
      </p>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {match.homeLineup && (
        <LineupColumn
          teamName={match.home.name}
          code={match.home.code}
          lineup={match.homeLineup}
          highlight={focus === "home"}
        />
      )}
      {match.awayLineup && (
        <LineupColumn
          teamName={match.away.name}
          code={match.away.code}
          lineup={match.awayLineup}
          highlight={focus === "away"}
        />
      )}
    </div>
  );
}
