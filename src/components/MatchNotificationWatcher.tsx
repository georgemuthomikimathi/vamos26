"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Match } from "@/lib/scores/types";
import { getLiveCount } from "@/lib/scores/types";
import {
  getAlertPreferences,
  type AlertPreferences,
} from "@/lib/notifications/preferences";
import {
  loadMatchSnapshot,
  numericScore,
  saveMatchSnapshot,
  type StoredMatchEvent,
} from "@/lib/notifications/match-state";
import { showMatchNotification } from "@/lib/notifications/show-notification";
import type { ApiMatchEvent } from "@/lib/scores/providers/api-football-events";
import { formatEventNotification } from "@/lib/scores/providers/api-football-events";

const POLL_MS = 300_000;

function matchLabel(match: Match): string {
  return `${match.home.name} vs ${match.away.name}`;
}

function shouldNotifyEvent(event: ApiMatchEvent, prefs: AlertPreferences): boolean {
  if (event.type === "goal") return prefs.goals;
  if (event.type === "penalty" || event.type === "penalty_missed") return prefs.penalties;
  if (event.type === "red") return prefs.redCards;
  return false;
}

export default function MatchNotificationWatcher() {
  const prefsRef = useRef<AlertPreferences>(getAlertPreferences());
  const runningRef = useRef(false);

  const checkScoreGoals = useCallback(
    async (matches: Match[], prefs: AlertPreferences) => {
      if (!prefs.goals) return;

      const snapshot = loadMatchSnapshot();

      for (const match of matches) {
        if (match.status !== "live" && match.status !== "halftime") continue;

        const current = numericScore(match);
        const prev = snapshot.scores[match.id];
        if (!prev) {
          snapshot.scores[match.id] = current;
          continue;
        }

        const homeDiff = current.home - prev.home;
        const awayDiff = current.away - prev.away;

        if (homeDiff > 0) {
          await showMatchNotification({
            title: `⚽ GOAL — ${matchLabel(match)}`,
            body: `${match.home.name} scores! ${current.home}–${current.away} (${match.minute ?? "?"}')`,
            tag: `${match.id}-goal-home-${current.home}`,
          });
        }
        if (awayDiff > 0) {
          await showMatchNotification({
            title: `⚽ GOAL — ${matchLabel(match)}`,
            body: `${match.away.name} scores! ${current.home}–${current.away} (${match.minute ?? "?"}')`,
            tag: `${match.id}-goal-away-${current.away}`,
          });
        }

        snapshot.scores[match.id] = current;
      }

      saveMatchSnapshot(snapshot);
    },
    []
  );

  const checkEvents = useCallback(async (matches: Match[], prefs: AlertPreferences) => {
    const snapshot = loadMatchSnapshot();
    const liveMatches = matches.filter(
      (m) => m.status === "live" || m.status === "halftime"
    );

    for (const match of liveMatches) {
      try {
        const res = await fetch(`/api/match-events?fixture=${encodeURIComponent(match.id)}`);
        if (!res.ok) continue;

        const data = (await res.json()) as { events: ApiMatchEvent[] };
        const known = new Set((snapshot.events[match.id] ?? []).map((e) => e.key));
        const nextEvents: StoredMatchEvent[] = [...(snapshot.events[match.id] ?? [])];

        for (const event of data.events) {
          if (known.has(event.key)) continue;
          if (!shouldNotifyEvent(event, prefs)) {
            nextEvents.push({
              key: event.key,
              minute: event.minute,
              type: event.type === "yellow" ? "goal" : event.type,
              player: event.player,
              teamName: event.teamName,
            });
            continue;
          }

          const { title, body, tag } = formatEventNotification(matchLabel(match), event);
          await showMatchNotification({ title, body, tag });

          nextEvents.push({
            key: event.key,
            minute: event.minute,
            type: event.type === "yellow" ? "goal" : event.type,
            player: event.player,
            teamName: event.teamName,
          });
        }

        snapshot.events[match.id] = nextEvents;
      } catch {
        /* skip fixture */
      }
    }

    saveMatchSnapshot(snapshot);
  }, []);

  const poll = useCallback(async () => {
    if (runningRef.current) return;
    const prefs = getAlertPreferences();
    prefsRef.current = prefs;

    if (!prefs.enabled || Notification.permission !== "granted") return;

    runningRef.current = true;
    try {
      const res = await fetch("/api/live?competition=world-cup");
      if (!res.ok) return;

      const data = (await res.json()) as { matches: Match[] };
      const matches = data.matches ?? [];

      if (getLiveCount(matches) === 0) return;

      await checkScoreGoals(matches, prefs);
    } finally {
      runningRef.current = false;
    }
  }, [checkScoreGoals, checkEvents]);

  useEffect(() => {
    const onPrefs = () => {
      prefsRef.current = getAlertPreferences();
      void poll();
    };

    window.addEventListener("vamos26-alerts-change", onPrefs);
    const interval = setInterval(() => void poll(), POLL_MS);
    const boot = setTimeout(() => void poll(), 5000);

    return () => {
      window.removeEventListener("vamos26-alerts-change", onPrefs);
      clearInterval(interval);
      clearTimeout(boot);
    };
  }, [poll]);

  return null;
}
