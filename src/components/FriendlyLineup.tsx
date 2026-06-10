"use client";

import type { NationalSquad } from "@/lib/squads";
import TeamFlagWithFallback from "@/components/TeamFlag";

type FriendlyLineupProps = {
  squad: NationalSquad;
  highlight?: boolean;
};

const ROW_ORDER = ["FWD", "MID", "DEF", "GK"] as const;

function groupByRow(squad: NationalSquad) {
  const rows: Record<string, typeof squad.startingXI> = {
    GK: [],
    DEF: [],
    MID: [],
    FWD: [],
  };

  for (const p of squad.startingXI) {
    if (p.role === "GK") rows.GK.push(p);
    else if (["RB", "CB", "LB"].includes(p.role)) rows.DEF.push(p);
    else if (["DM", "CM", "AM"].includes(p.role)) rows.MID.push(p);
    else rows.FWD.push(p);
  }

  return rows;
}

export default function FriendlyLineup({ squad, highlight }: FriendlyLineupProps) {
  const rows = groupByRow(squad);

  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        highlight ? "border-pitch/40 bg-pitch/5" : "border-white/10 bg-navy/40"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <TeamFlagWithFallback code={squad.code} name={squad.name} size={28} />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white text-sm truncate">{squad.name}</p>
          <p className="text-[10px] text-muted truncate">
            {squad.formation} · {squad.coach}
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
                  key={p.number}
                  className="bg-card/90 border border-white/10 rounded-md px-1.5 py-1 text-center min-w-[4.5rem] max-w-[5.5rem]"
                  title={`${p.name} · ${p.club}`}
                >
                  <div className="text-[9px] font-bold text-pitch">#{p.number}</div>
                  <div className="text-[10px] font-semibold text-white leading-tight truncate">
                    {p.name.split(" ").pop()}
                  </div>
                  <div className="text-[8px] text-muted truncate">{p.role}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {squad.bench.length > 0 && (
        <div className="mt-2 pt-2 border-t border-white/5">
          <p className="text-[9px] uppercase tracking-wider text-muted mb-1">Bench</p>
          <div className="flex flex-wrap gap-1">
            {squad.bench.map((p) => (
              <span
                key={p.number}
                className="text-[10px] bg-white/5 rounded-full px-2 py-0.5 text-muted"
              >
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
