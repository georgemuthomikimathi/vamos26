"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, MapPin, RefreshCw, Trophy } from "lucide-react";
import { GROUPS } from "@/lib/data";
import { KNOCKOUT_ROUNDS, buildBracketMatches } from "@/lib/bracket";
import type { GroupStandings } from "@/lib/standings/compile-group-standings";
import TeamFlagWithFallback from "@/components/TeamFlag";
import { formatUpdatedET } from "@/lib/timezone";

const POLL_LIVE_MS = 15_000;
const POLL_IDLE_MS = 30_000;

function buildEmptyStandings(): GroupStandings[] {
  return GROUPS.map((group) => ({
    letter: group.letter,
    rows: group.teams.map((team, index) => ({
      position: index + 1,
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      qualifies: index < 2,
    })),
  }));
}

function GroupStandingsTable({
  standings,
  index,
}: {
  standings: GroupStandings;
  index: number;
}) {
  const groupMeta = GROUPS.find((g) => g.letter === standings.letter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-pitch/30 transition-colors min-w-[220px]"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-navy/40">
        <span className="font-display text-2xl text-pitch">GRP {standings.letter}</span>
        <div className="flex -space-x-1">
          {standings.rows.map((row) => (
            <TeamFlagWithFallback
              key={row.team.code}
              code={row.team.code}
              name={row.team.name}
              size={32}
            />
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[10px] sm:text-[11px]">
          <thead>
            <tr className="text-muted border-b border-white/5">
              <th className="py-1.5 pl-2 pr-0.5 text-left font-medium w-5">#</th>
              <th className="py-1.5 px-1 text-left font-medium min-w-[72px]">Team</th>
              <th className="py-1.5 px-0.5 text-center font-medium w-5">P</th>
              <th className="py-1.5 px-0.5 text-center font-medium w-5">W</th>
              <th className="py-1.5 px-0.5 text-center font-medium w-5">D</th>
              <th className="py-1.5 px-0.5 text-center font-medium w-5">L</th>
              <th className="py-1.5 px-0.5 text-center font-medium w-6">GF</th>
              <th className="py-1.5 px-0.5 text-center font-medium w-6">GA</th>
              <th className="py-1.5 px-0.5 text-center font-medium w-6">GD</th>
              <th className="py-1.5 pr-2 pl-0.5 text-center font-semibold text-pitch w-7">Pts</th>
            </tr>
          </thead>
          <tbody>
            {standings.rows.map((row) => (
              <tr
                key={row.team.code}
                className={`border-b border-white/5 last:border-0 ${
                  row.qualifies
                    ? "bg-pitch/10"
                    : row.position === 3
                      ? "bg-gold/5"
                      : ""
                }`}
              >
                <td className="py-1.5 pl-2 pr-0.5 font-display text-muted">{row.position}</td>
                <td className="py-1.5 px-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <TeamFlagWithFallback
                      code={row.team.code}
                      name={row.team.name}
                      size={32}
                    />
                    <span className="truncate font-medium text-white">{row.team.name}</span>
                  </div>
                </td>
                <td className="py-1.5 px-0.5 text-center text-muted">{row.played}</td>
                <td className="py-1.5 px-0.5 text-center text-muted">{row.won}</td>
                <td className="py-1.5 px-0.5 text-center text-muted">{row.drawn}</td>
                <td className="py-1.5 px-0.5 text-center text-muted">{row.lost}</td>
                <td className="py-1.5 px-0.5 text-center text-muted">{row.goalsFor}</td>
                <td className="py-1.5 px-0.5 text-center text-muted">{row.goalsAgainst}</td>
                <td
                  className={`py-1.5 px-0.5 text-center ${
                    row.goalDifference > 0
                      ? "text-pitch"
                      : row.goalDifference < 0
                        ? "text-red-400/80"
                        : "text-muted"
                  }`}
                >
                  {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
                </td>
                <td className="py-1.5 pr-2 pl-0.5 text-center font-display text-pitch">
                  {row.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {groupMeta?.highlight && (
        <p className="text-[9px] text-gold/70 px-3 py-2 border-t border-white/5 truncate">
          {groupMeta.highlight}
        </p>
      )}
    </motion.div>
  );
}

function MatchSlot({
  label,
  highlight,
  small,
}: {
  label: string;
  highlight?: boolean;
  small?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border flex items-center justify-center text-center px-2 ${
        highlight
          ? "border-gold/50 bg-gold/10 py-4 min-h-[72px]"
          : small
            ? "border-white/10 bg-navy/60 py-2 min-h-[40px]"
            : "border-white/10 bg-card/80 py-3 min-h-[52px]"
      }`}
    >
      <span
        className={`font-medium leading-tight ${
          highlight
            ? "font-display text-lg text-gold"
            : small
              ? "text-[10px] text-muted"
              : "text-[11px] text-muted"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function KnockoutColumn({
  round,
  roundIndex,
}: {
  round: (typeof KNOCKOUT_ROUNDS)[0];
  roundIndex: number;
}) {
  const matches = buildBracketMatches(round.id);
  const isFinal = round.id === "final";

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: roundIndex * 0.1 }}
      className="flex flex-col min-w-[130px] shrink-0"
    >
      <div
        className={`text-center mb-3 pb-2 border-b ${
          isFinal ? "border-gold/40" : "border-white/10"
        }`}
      >
        <p
          className={`font-display text-lg ${isFinal ? "text-gold" : "text-white"}`}
        >
          {round.shortName}
        </p>
        <p className="text-[10px] text-muted">{round.dates}</p>
        <p className="text-[10px] text-pitch mt-0.5">
          {round.matches} {round.matches === 1 ? "match" : "matches"}
        </p>
      </div>

      <div
        className="flex flex-col justify-around flex-1 gap-2"
        style={{ minHeight: isFinal ? 120 : 280 + roundIndex * 40 }}
      >
        {matches.map((m) => (
          <MatchSlot
            key={m.id}
            label={m.label}
            highlight={isFinal}
            small={round.matches > 8}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ConnectorArrow() {
  return (
    <div className="flex items-center justify-center shrink-0 px-1 self-center">
      <ChevronRight className="text-pitch/40" size={20} />
    </div>
  );
}

export default function RoadToFinal() {
  const [standings, setStandings] = useState<GroupStandings[]>(buildEmptyStandings);
  const [matchesPlayed, setMatchesPlayed] = useState(0);
  const [dataSource, setDataSource] = useState<"worldcup26" | "fallback">("fallback");
  const [lastUpdate, setLastUpdate] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchStandings = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch("/api/standings?competition=world-cup", { cache: "no-store" });
      const data = await res.json();
      if (data.groups?.length) {
        setStandings(data.groups);
        setMatchesPlayed(data.matchesPlayed ?? 0);
        setLastUpdate(formatUpdatedET(data.updatedAt));
        if (data.source) setDataSource(data.source);
      }
    } catch {
      /* silent */
    } finally {
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchStandings();
    const interval = setInterval(
      () => void fetchStandings(),
      matchesPlayed > 0 ? POLL_LIVE_MS : POLL_IDLE_MS
    );
    return () => clearInterval(interval);
  }, [fetchStandings, matchesPlayed]);

  return (
    <section id="roadmap" className="relative py-24 bg-navy-light overflow-hidden">
      <div className="absolute inset-0 pitch-lines opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-pitch/5 rounded-full blur-[120px]" />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3">
            Tournament Tree
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-white mb-4">
            ROAD TO THE <span className="text-gradient-gold">FINAL</span>
          </h2>
          <p className="text-muted max-w-2xl mx-auto">
            48 teams enter 12 groups. Live standings update as matches finish — top
            two from each group plus eight best third-place teams advance to the
            Round of 32.
          </p>
        </motion.div>

        {/* Stage 1 — Group Stage Standings */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pitch/40 to-transparent" />
            <span className="font-display text-xl text-pitch tracking-wider">
              GROUP STANDINGS
            </span>
            <span className="text-xs text-muted">Jun 11 – 27</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-pitch/40 to-transparent" />
          </div>

          <div className="flex items-center justify-between mb-4 text-xs text-muted">
            <span>
              {matchesPlayed > 0
                ? `${matchesPlayed} group match${matchesPlayed === 1 ? "" : "es"} played`
                : "Standings update when matches finish"}
            </span>
            <button
              type="button"
              onClick={() => void fetchStandings(true)}
              className="inline-flex items-center gap-1.5 text-pitch hover:text-white transition-colors"
              aria-label="Refresh standings"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              {lastUpdate ? `Updated ${lastUpdate}` : "Refresh"}
            </button>
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 min-w-0">
              {standings.map((group, i) => (
                <GroupStandingsTable key={group.letter} standings={group} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Funnel connector */}
        <div className="flex flex-col items-center py-6">
          <svg
            viewBox="0 0 400 80"
            className="w-full max-w-2xl h-16 text-pitch/30"
            aria-hidden
          >
            {GROUPS.map((_, i) => {
              const x = 20 + (i * 360) / 11;
              return (
                <line
                  key={i}
                  x1={x}
                  y1="0"
                  x2="200"
                  y2="70"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.4"
                />
              );
            })}
            <circle cx="200" cy="70" r="6" fill="currentColor" opacity="0.6" />
          </svg>
          <div className="bg-card/80 border border-pitch/30 rounded-2xl px-6 py-3 text-center -mt-2">
            <p className="font-display text-2xl text-pitch">32 TEAMS ADVANCE</p>
            <p className="text-xs text-muted mt-1">
              24 group qualifiers (1st & 2nd) + 8 best third-place teams
            </p>
          </div>
        </div>

        {/* Stage 2 — Knockout Bracket Tree */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <span className="font-display text-xl text-gold tracking-wider">
              KNOCKOUT STAGE
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex items-stretch min-w-[900px] lg:min-w-0 lg:justify-center">
              {KNOCKOUT_ROUNDS.map((round, i) => (
                <div key={round.id} className="flex items-stretch">
                  <KnockoutColumn round={round} roundIndex={i} />
                  {i < KNOCKOUT_ROUNDS.length - 1 && <ConnectorArrow />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final destination */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 bg-gradient-to-r from-gold/10 via-pitch/10 to-usa-blue/10 border border-gold/30 rounded-3xl p-8 text-center"
        >
          <Trophy className="mx-auto text-gold mb-4" size={40} />
          <h3 className="font-display text-4xl md:text-5xl text-gradient-gold mb-2">
            WORLD CUP FINAL
          </h3>
          <p className="text-white font-semibold text-lg">July 19, 2026</p>
          <div className="flex items-center justify-center gap-2 text-muted text-sm mt-2">
            <MapPin size={14} className="text-pitch" />
            MetLife Stadium — East Rutherford, New Jersey
          </div>
          <p className="text-xs text-muted mt-4 max-w-md mx-auto">
            Two teams. One champion. The road ends here — just miles from NYC.
          </p>
        </motion.div>

        {/* Advancement legend */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-pitch/20 border border-pitch/40" />
            <span className="text-muted">1st & 2nd place → Round of 32</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gold/10 border border-gold/30" />
            <span className="text-muted">3rd place → best 8 advance</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-card border border-white/10" />
            <span className="text-muted">4th place → eliminated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
