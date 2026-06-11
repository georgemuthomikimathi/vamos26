"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Radio, RefreshCw, CalendarClock } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { getLiveCount } from "@/lib/scores/types";
import { LIVE_MATCHES } from "@/lib/live";
import { attachLineupsToMatches } from "@/lib/scores/lineups";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";
import {
  bucketMatches,
  extractStageFilters,
  filterByStage,
  getMatchTabCounts,
  pickDefaultTab,
  type MatchCenterTab,
} from "@/lib/scores/match-buckets";
import MatchCard from "@/components/MatchCard";
import PreviousFixtureCard from "@/components/PreviousFixtureCard";
import MatchAlertSettings from "@/components/MatchAlertSettings";
import LiveMatchHero from "@/components/LiveMatchHero";
import LiveApiBanner from "@/components/LiveApiBanner";
import { formatUpdatedET } from "@/lib/timezone";

const POLL_LIVE_MS = 15_000;
const POLL_IDLE_MS = 30_000;

const TABS: { id: MatchCenterTab; label: string; icon: typeof Radio }[] = [
  { id: "live", label: "Live", icon: Radio },
  { id: "upcoming", label: "Upcoming", icon: CalendarClock },
  { id: "previous", label: "Previous Fixtures", icon: History },
];

export default function LiveMatchCenter() {
  const [matches, setMatches] = useState<Match[]>(() => enrichMatchesFromMeta(LIVE_MATCHES));
  const [liveCount, setLiveCount] = useState(() => getLiveCount(LIVE_MATCHES));
  const [lastUpdate, setLastUpdate] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [dataSource, setDataSource] = useState<"api" | "static" | "">("");
  const [apiError, setApiError] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<MatchCenterTab>("live");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [justFinishedId, setJustFinishedId] = useState<string | null>(null);
  const prevLiveIdsRef = useRef<Set<string>>(new Set());
  const userPickedTabRef = useRef(false);

  const tabCounts = useMemo(() => getMatchTabCounts(matches), [matches]);
  const buckets = useMemo(() => bucketMatches(matches), [matches]);

  const fetchLive = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch("/api/live?competition=world-cup", { cache: "no-store" });
      const data = await res.json();
      const nextMatches = enrichMatchesFromMeta(attachLineupsToMatches(data.matches ?? []));
      setMatches(nextMatches);
      setLiveCount(data.liveCount);
      if (data.source === "api" || data.source === "static") {
        setDataSource(data.source);
      }
      setApiError(data.apiError);
      setLastUpdate(formatUpdatedET(data.updatedAt));
    } catch {
      /* silent */
    } finally {
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchLive();
    const interval = setInterval(
      () => void fetchLive(),
      liveCount > 0 ? POLL_LIVE_MS : POLL_IDLE_MS
    );
    return () => clearInterval(interval);
  }, [fetchLive, liveCount]);

  useEffect(() => {
    if (!userPickedTabRef.current) {
      setActiveTab(pickDefaultTab(tabCounts));
    }
  }, [tabCounts.live, tabCounts.upcoming, tabCounts.previous]);

  useEffect(() => {
    const liveIds = new Set(
      matches.filter((m) => m.status === "live" || m.status === "halftime").map((m) => m.id)
    );
    const newlyFinished = matches.find(
      (m) => m.status === "finished" && prevLiveIdsRef.current.has(m.id)
    );

    if (newlyFinished) {
      setJustFinishedId(newlyFinished.id);
      if (!userPickedTabRef.current || activeTab === "live") {
        setActiveTab("previous");
      }
      const timer = window.setTimeout(() => setJustFinishedId(null), 8000);
      prevLiveIdsRef.current = liveIds;
      return () => window.clearTimeout(timer);
    }

    prevLiveIdsRef.current = liveIds;
  }, [matches, activeTab]);

  const featuredMatch = useMemo(() => {
    if (activeTab !== "live") return null;
    const live = matches.find((m) => m.status === "live" || m.status === "halftime");
    if (live) return live;
    const soon = matches.find((m) => {
      if (!m.kickoffAt || m.status !== "scheduled") return false;
      const diff = new Date(m.kickoffAt).getTime() - Date.now();
      return diff > -30 * 60_000 && diff < 6 * 60 * 60_000;
    });
    if (soon) return soon;
    const withLineups = matches.find(
      (m) => m.status === "scheduled" && (m.homeLineup || m.awayLineup)
    );
    return withLineups ?? null;
  }, [matches, activeTab]);

  const listMatches = useMemo(() => {
    if (activeTab === "live") {
      const liveMatches = buckets.live;
      if (!featuredMatch) return liveMatches;
      return liveMatches.filter((m) => m.id !== featuredMatch.id);
    }
    if (activeTab === "upcoming") return buckets.upcoming;
    return filterByStage(buckets.previous, stageFilter);
  }, [activeTab, buckets, featuredMatch, stageFilter]);

  const stageFilters = useMemo(
    () => extractStageFilters(buckets.previous),
    [buckets.previous]
  );

  const handleTabChange = (tab: MatchCenterTab) => {
    userPickedTabRef.current = true;
    setActiveTab(tab);
    if (tab !== "previous") setStageFilter(null);
  };

  return (
    <section id="live" className="section-anchor relative py-20 md:py-24 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-pitch/5" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8"
        >
          <div>
            <p className="text-red-400 uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center gap-2">
              {liveCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
              World Cup 2026
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-white">
              LIVE <span className="text-gradient-pitch">SCORES</span>
            </h2>
            <p className="text-muted mt-2 max-w-xl text-sm">
              Live clock, goals, cards & subs — refreshes every {liveCount > 0 ? "15" : "30"}s.
              {lastUpdate && (
                <span className="text-pitch/70 block text-xs mt-1">
                  Last updated {lastUpdate}
                  {dataSource === "api" && " · Live scores"}
                  {dataSource === "static" && " · Schedule preview — live API unavailable"}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchLive(true)}
              disabled={refreshing}
              aria-label="Refresh live scores"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-sm font-medium text-muted hover:text-white transition-colors tap-scale focus-ring disabled:opacity-50"
            >
              <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            {liveCount > 0 && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-center flex items-center gap-3">
                <Radio size={20} className="text-red-400 animate-pulse" />
                <div>
                  <div className="font-display text-3xl text-red-400">{liveCount}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted">Live Now</div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <LiveApiBanner source={dataSource} apiError={apiError} />

        <MatchAlertSettings />

        <div className="flex flex-wrap gap-2 mb-6">
          {TABS.map(({ id, label, icon: Icon }) => {
            const count = tabCounts[id];
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleTabChange(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all tap-scale focus-ring ${
                  active
                    ? id === "live" && count > 0
                      ? "bg-red-500/15 border-red-500/40 text-red-300"
                      : id === "previous"
                        ? "bg-gold/15 border-gold/40 text-gold"
                        : "bg-pitch/15 border-pitch/40 text-pitch"
                    : "border-white/10 text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={15} />
                {label}
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/10" : "bg-white/5"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {justFinishedId && activeTab === "previous" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold"
          >
            Full time — match moved to Previous Fixtures.
          </motion.div>
        )}

        {activeTab === "previous" && stageFilters.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              type="button"
              onClick={() => setStageFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                stageFilter === null
                  ? "bg-white/10 border-white/20 text-white"
                  : "border-white/10 text-muted hover:text-white"
              }`}
            >
              All stages
            </button>
            {stageFilters.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => setStageFilter(stage)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  stageFilter === stage
                    ? "bg-white/10 border-white/20 text-white"
                    : "border-white/10 text-muted hover:text-white"
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        )}

        {featuredMatch && activeTab === "live" && (
          <LiveMatchHero match={featuredMatch} />
        )}

        {listMatches.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-card/50 px-6 py-12 text-center">
            <p className="text-muted text-sm">
              {activeTab === "live" && "No matches live right now. Check Upcoming or Previous Fixtures."}
              {activeTab === "upcoming" && "No upcoming fixtures in the current window."}
              {activeTab === "previous" && "No finished matches yet — results appear here after full time."}
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            <AnimatePresence mode="popLayout">
              {listMatches.map((match, i) => (
                <motion.div
                  key={match.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ delay: i * 0.04 }}
                  className={justFinishedId === match.id ? "ring-2 ring-gold/50 rounded-xl" : ""}
                >
                  {activeTab === "previous" ? (
                    <PreviousFixtureCard
                      match={match}
                      defaultExpanded={justFinishedId === match.id}
                    />
                  ) : (
                    <MatchCard match={match} animateScore={activeTab === "live"} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
