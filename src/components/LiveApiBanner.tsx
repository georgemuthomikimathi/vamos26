"use client";

import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";

type LiveApiBannerProps = {
  source: "api" | "static" | "";
  provider?: "worldcup26" | "static" | "";
  apiError?: string;
};

export default function LiveApiBanner({ source, provider, apiError }: LiveApiBannerProps) {
  if (source === "api" && provider === "worldcup26") {
    return (
      <div
        role="status"
        className="mb-6 rounded-2xl border border-pitch/40 bg-pitch/10 p-4 md:p-5"
      >
        <div className="flex gap-3 items-start">
          <CheckCircle2 className="text-pitch shrink-0 mt-0.5" size={20} />
          <div className="flex-1 min-w-0">
            <p className="font-display text-xl text-white mb-1">
              Live scores connected
            </p>
            <p className="text-sm text-muted leading-relaxed">
              World Cup 2026 data via{" "}
              <a
                href="https://worldcup26.ir"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pitch font-semibold hover:underline"
              >
                worldcup26.ir
              </a>
              — live scores, standings, goals, lineups, and match events. No API key required.
            </p>
            <a
              href="/api/live/status"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-pitch font-semibold hover:underline mt-3"
            >
              View data status <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (source === "api") return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-2xl border border-gold/40 bg-gold/10 p-4 md:p-5"
    >
      <div className="flex gap-3 items-start">
        <AlertTriangle className="text-gold shrink-0 mt-0.5" size={20} />
        <div className="flex-1 min-w-0">
          <p className="font-display text-xl text-white mb-1">
            Live feed temporarily unavailable
          </p>
          <p className="text-sm text-muted leading-relaxed">
            {apiError ??
              "Showing preview schedule. worldcup26.ir will reconnect automatically on refresh."}
          </p>
          <a
            href="/api/live/status"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-pitch font-semibold hover:underline mt-3"
          >
            Check status <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
