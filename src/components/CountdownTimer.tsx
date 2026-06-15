"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTournamentContext } from "@/hooks/useTournamentContext";
import { msUntilMatchKickoff } from "@/lib/realtime/next-match";
import { formatMatchScheduleLine } from "@/lib/timezone";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function calcTimeLeft(targetMs: number): TimeLeft {
  const diff = targetMs - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

const UNITS = ["days", "hours", "minutes", "seconds"] as const;

const PLACEHOLDER: TimeLeft = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  expired: false,
};

export default function CountdownTimer() {
  const ctx = useTournamentContext();
  const [time, setTime] = useState<TimeLeft>(PLACEHOLDER);
  const [ready, setReady] = useState(false);

  const liveNow = ctx.liveToday[0];
  const nextMatch = ctx.nextUpcoming;
  const targetMs = nextMatch?.kickoffAt
    ? new Date(nextMatch.kickoffAt).getTime()
    : new Date("2026-06-11T19:00:00Z").getTime();

  useEffect(() => {
    const tick = () => setTime(calcTimeLeft(targetMs));
    const boot = window.setTimeout(() => {
      tick();
      setReady(true);
    }, 0);
    const id = setInterval(tick, 1000);
    return () => {
      window.clearTimeout(boot);
      clearInterval(id);
    };
  }, [targetMs]);

  if (liveNow) {
    return (
      <div className="bg-red-500/10 border border-red-500/40 rounded-3xl p-6 text-center">
        <p className="text-red-300 font-display text-3xl tracking-wider">LIVE NOW</p>
        <p className="text-white font-semibold text-sm mt-2">
          {liveNow.home.name} vs {liveNow.away.name}
        </p>
        <p className="text-muted text-xs mt-1">{liveNow.stage} · {liveNow.venue}</p>
      </div>
    );
  }

  if (ready && time.expired && ctx.tournamentDay > 0) {
    return (
      <div className="bg-pitch/10 border border-pitch/30 rounded-3xl p-6 text-center">
        <p className="text-pitch font-display text-3xl tracking-wider">
          ¡EL MUNDIAL ESTÁ EN MARCHA!
        </p>
        <p className="text-muted text-sm mt-2">{ctx.highlightBody}</p>
      </div>
    );
  }

  const msLeft = msUntilMatchKickoff(nextMatch);
  const lineupSoon = msLeft != null && msLeft > 0 && msLeft <= 30 * 60_000;

  return (
    <div className="bg-card/80 border border-pitch/20 rounded-3xl p-6 backdrop-blur-sm">
      <p className="text-center text-pitch uppercase tracking-[0.35em] text-[10px] font-semibold mb-1">
        {lineupSoon ? "Lineups drop · kickoff soon" : "Countdown to kickoff"}
      </p>
      <p className="text-center text-white font-semibold text-sm mb-5">
        {nextMatch
          ? `${nextMatch.home.name} vs ${nextMatch.away.name} · ${formatMatchScheduleLine(nextMatch)}`
          : "World Cup 2026 · next match loading…"}
      </p>
      <div className="grid grid-cols-4 gap-3">
        {UNITS.map((unit) => (
          <motion.div
            key={unit}
            initial={false}
            className="text-center bg-navy/60 border border-white/10 rounded-2xl py-4 px-2"
          >
            <div
              className="font-display text-4xl sm:text-5xl text-gradient-pitch leading-none tabular-nums"
              suppressHydrationWarning
            >
              {String(time[unit]).padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted mt-2">
              {unit}
            </div>
          </motion.div>
        ))}
      </div>
      {lineupSoon && (
        <p className="text-center text-[10px] text-pitch mt-4 font-semibold">
          Squads publish 30 min before kickoff — check Upcoming tab
        </p>
      )}
    </div>
  );
}
