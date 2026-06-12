"use client";

import { useEffect, useRef, useState } from "react";
import type { Match } from "@/lib/scores/types";
import { formatLiveClock, liveClockSyncKey } from "@/lib/scores/types";
import { DISPLAY_TZ_LABEL } from "@/lib/timezone";

type MatchClockProps = {
  match: Match;
  size?: "sm" | "lg";
};

function formatCountdown(ms: number): string {
  if (ms <= 0) return "KO";
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MatchClock({ match, size = "sm" }: MatchClockProps) {
  const [now, setNow] = useState(() => Date.now());
  const syncAtRef = useRef(Date.now());
  const syncKeyRef = useRef(liveClockSyncKey(match));

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const key = liveClockSyncKey(match);
    if (key !== syncKeyRef.current) {
      syncKeyRef.current = key;
      syncAtRef.current = Date.now();
    }
  }, [match]);

  const isLive = match.status === "live" || match.status === "halftime";
  const kickoffMs = match.kickoffAt ? new Date(match.kickoffAt).getTime() : null;
  const untilKickoff = kickoffMs != null ? kickoffMs - now : null;
  const showCountdown =
    match.status === "scheduled" &&
    untilKickoff != null &&
    untilKickoff > 0 &&
    untilKickoff < 24 * 60 * 60_000;

  const lg = size === "lg";
  const liveClock = formatLiveClock(match, syncAtRef.current, now);

  if (showCountdown) {
    return (
      <div className={`text-center ${lg ? "py-2" : ""}`}>
        <p
          className={`uppercase tracking-widest text-pitch font-semibold ${lg ? "text-xs" : "text-[10px]"}`}
        >
          Kickoff in ({DISPLAY_TZ_LABEL})
        </p>
        <p className={`font-display text-white tabular-nums ${lg ? "text-4xl" : "text-lg"}`}>
          {formatCountdown(untilKickoff!)}
        </p>
      </div>
    );
  }

  if (isLive) {
    return (
      <div className={`text-center ${lg ? "py-2" : ""}`}>
        <p
          className={`inline-flex items-center gap-1.5 uppercase tracking-widest font-bold ${
            match.status === "halftime"
              ? "text-gold"
              : "text-red-400 animate-pulse"
          } ${lg ? "text-sm" : "text-[10px]"}`}
        >
          {match.status === "halftime" ? (
            "Half time"
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Live
            </>
          )}
        </p>
        <p className={`font-display text-white tabular-nums ${lg ? "text-5xl" : "text-xl"}`}>
          {liveClock}
        </p>
        {match.statusShort && match.status !== "halftime" && (
          <p className={`text-muted ${lg ? "text-xs" : "text-[10px]"}`}>
            {match.statusShort === "1H" ? "1st half" : match.statusShort === "2H" ? "2nd half" : match.statusShort}
          </p>
        )}
      </div>
    );
  }

  if (match.status === "finished") {
    return (
      <div className="text-center">
        <p className={`font-display text-muted ${lg ? "text-3xl" : "text-lg"}`}>FT</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className={`text-muted ${lg ? "text-sm" : "text-[10px]"}`}>{match.time}</p>
      <p className={`text-muted/60 ${lg ? "text-xs" : "text-[10px]"}`}>{match.date}</p>
    </div>
  );
}
