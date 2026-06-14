"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type { GroupStandings } from "@/lib/standings/compile-group-standings";
import { onDataRefresh } from "@/lib/realtime/cascade";
import { POLL_IDLE_MS, POLL_STATS_LIVE_MS } from "@/lib/realtime/polling";
import TeamFlagWithFallback from "@/components/TeamFlag";
import DataProviderBadge from "@/components/DataProviderBadge";
import { formatUpdatedET } from "@/lib/timezone";

export default function GroupStandingsMini() {
  const [groups, setGroups] = useState<GroupStandings[]>([]);
  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [provider, setProvider] = useState<"api-football" | "worldcup26" | "fallback">("fallback");
  const [lastUpdate, setLastUpdate] = useState("");
  const [pollMs, setPollMs] = useState(POLL_IDLE_MS);

  const fetchStandings = useCallback(async () => {
    try {
      const res = await fetch("/api/standings?competition=world-cup", { cache: "no-store" });
      const data = await res.json();
      if (data.groups?.length) {
        setGroups(data.groups);
        setMatchesPlayed(data.matchesPlayed ?? 0);
        if ((data.matchesPlayed ?? 0) > 0) setPollMs(POLL_STATS_LIVE_MS);
        setLastUpdate(formatUpdatedET(data.updatedAt));
        if (data.source) setProvider(data.source);
      }
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    void fetchStandings();
    const interval = setInterval(() => void fetchStandings(), pollMs);
    return () => clearInterval(interval);
  }, [fetchStandings, pollMs]);

  useEffect(() => {
    return onDataRefresh(() => void fetchStandings());
  }, [fetchStandings]);

  if (groups.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-pitch uppercase tracking-[0.3em] text-xs font-semibold">
            Live group standings
          </p>
          <DataProviderBadge provider={provider === "fallback" ? "" : provider} />
        </div>
        <button
          type="button"
          onClick={() => void fetchStandings()}
          className="inline-flex items-center gap-1.5 text-xs text-pitch hover:text-white transition-colors"
        >
          <RefreshCw size={12} />
          {lastUpdate ? `Updated ${lastUpdate}` : "Refresh"}
        </button>
      </div>
      <p className="text-xs text-muted mb-4">
        {matchesPlayed > 0
          ? `${matchesPlayed} group match${matchesPlayed === 1 ? "" : "es"} played — points update after full time`
          : "Standings update as matches finish"}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {groups.map((group) => (
          <div
            key={group.letter}
            className="bg-card/80 border border-white/10 rounded-2xl p-3 hover:border-pitch/30 transition-colors"
          >
            <p className="font-display text-2xl text-pitch mb-2">Group {group.letter}</p>
            <ul className="space-y-1.5">
              {group.rows.map((row) => (
                <li
                  key={row.team.code}
                  className={`flex items-center gap-2 text-xs rounded-lg px-2 py-1.5 ${
                    row.qualifies ? "bg-pitch/10" : row.position === 3 ? "bg-gold/5" : ""
                  }`}
                >
                  <span className="font-display text-muted w-4">{row.position}</span>
                  <TeamFlagWithFallback code={row.team.code} name={row.team.name} size={28} />
                  <span className="flex-1 truncate font-medium text-white">{row.team.name}</span>
                  <span className="text-muted tabular-nums">{row.played}P</span>
                  <span className="font-display text-pitch tabular-nums w-6 text-right">{row.points}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
