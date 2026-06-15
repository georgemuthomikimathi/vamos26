"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { History, RefreshCw } from "lucide-react";
import type { Match } from "@/lib/scores/types";
import { enrichMatchesFromMeta } from "@/lib/scores/enrich-from-meta";
import { bucketMatches, extractStageFilters, filterByStage } from "@/lib/scores/match-buckets";
import { onDataRefresh, onMatchFinished } from "@/lib/realtime/cascade";
import PreviousFixtureCard from "@/components/PreviousFixtureCard";
import DataProviderBadge from "@/components/DataProviderBadge";
import { formatUpdatedET } from "@/lib/timezone";

const POLL_MS = 300_000;

export default function PastFixturesSection() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [provider, setProvider] = useState<"api-football" | "static" | "">("");
  const [stageFilter, setStageFilter] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const finished = useMemo(() => {
    const previous = bucketMatches(matches).previous;
    return filterByStage(previous, stageFilter);
  }, [matches, stageFilter]);

  const stageFilters = useMemo(
    () => extractStageFilters(bucketMatches(matches).previous),
    [matches]
  );

  const fetchResults = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const res = await fetch("/api/live?competition=world-cup", { cache: "no-store" });
      const data = await res.json();
      setMatches(enrichMatchesFromMeta(data.matches ?? []));
      setLastUpdate(formatUpdatedET(data.updatedAt));
      if (data.provider) setProvider(data.provider);
    } catch {
      /* silent */
    } finally {
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchResults();
    const interval = setInterval(() => void fetchResults(), POLL_MS);
    return () => clearInterval(interval);
  }, [fetchResults]);

  useEffect(() => {
    let highlightTimer: ReturnType<typeof setTimeout> | undefined;
    const unsubFinish = onMatchFinished((detail) => {
      setHighlightId(detail.matchId);
      void fetchResults();
      if (highlightTimer) clearTimeout(highlightTimer);
      highlightTimer = setTimeout(() => setHighlightId(null), 10_000);
    });
    const unsubRefresh = onDataRefresh(() => void fetchResults());
    return () => {
      unsubFinish();
      unsubRefresh();
      if (highlightTimer) clearTimeout(highlightTimer);
    };
  }, [fetchResults]);

  return (
    <section id="fixtures" className="relative py-24 bg-navy">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
        >
          <div>
            <p className="text-gold uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center gap-2 flex-wrap">
              <History size={14} />
              Real-time results
              <DataProviderBadge provider={provider} />
            </p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-3">
              PAST <span className="text-gradient-pitch">FIXTURES</span>
            </h2>
            <p className="text-muted max-w-2xl text-sm">
              Tap any match for full squads, coaches, goals & cards. Updates after full time.
              {lastUpdate && (
                <span className="block text-xs text-pitch/70 mt-1">Last updated {lastUpdate}</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={() => void fetchResults(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-muted hover:text-white transition-colors tap-scale focus-ring disabled:opacity-50 shrink-0"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </motion.div>

        {stageFilters.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
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

        {finished.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-card/50 px-6 py-12 text-center">
            <p className="text-muted text-sm">
              No finished matches yet — full reports appear here after each final whistle.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {finished.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className={highlightId === match.id ? "ring-2 ring-gold/50 rounded-xl" : ""}
              >
                <PreviousFixtureCard
                  match={match}
                  defaultExpanded={highlightId === match.id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
