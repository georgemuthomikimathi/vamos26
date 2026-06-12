"use client";

import { AlertTriangle, CheckCircle2, ExternalLink } from "lucide-react";

type LiveApiBannerProps = {
  source: "api" | "static" | "";
  provider?: "api-football" | "worldcup26" | "static" | "";
  apiError?: string;
};

export default function LiveApiBanner({ source, provider, apiError }: LiveApiBannerProps) {
  if (source === "api" && provider === "api-football") {
    return (
      <div
        role="status"
        className="mb-6 rounded-2xl border border-pitch/40 bg-pitch/10 p-4 md:p-5"
      >
        <div className="flex gap-3 items-start">
          <CheckCircle2 className="text-pitch shrink-0 mt-0.5" size={20} />
          <div className="flex-1 min-w-0">
            <p className="font-display text-xl text-white mb-1 flex items-center gap-2">
              Live API connected
              <span className="text-[10px] font-bold uppercase tracking-wider bg-pitch/20 text-pitch border border-pitch/40 rounded-full px-2 py-0.5">
                Live API
              </span>
            </p>
            <p className="text-sm text-muted leading-relaxed">
              Paid API-Football tier active — live clock, official lineups, all substitutions,
              cards (yellow/red/2nd yellow), goals, and assists across every section.
            </p>
            <a
              href="/api/live/status"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-pitch font-semibold hover:underline mt-3"
            >
              View API status <ExternalLink size={14} />
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
            Live API not connected
          </p>
          <p className="text-sm text-muted leading-relaxed">
            {apiError ??
              "Scores are showing the preview schedule, not real match data. Add your API-Football key to Vercel and redeploy."}
          </p>
          <div className="flex flex-wrap gap-3 mt-3 text-sm">
            <a
              href="/api/live/status"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-pitch font-semibold hover:underline"
            >
              Check API status <ExternalLink size={14} />
            </a>
            <a
              href="https://dashboard.api-football.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-white"
            >
              API-Football dashboard <ExternalLink size={14} />
            </a>
          </div>
          <ol className="mt-3 text-xs text-muted space-y-1 list-decimal list-inside">
            <li>Vercel → project <strong className="text-white">vamos26</strong> → Settings → Environment Variables</li>
            <li>Add <code className="text-pitch">API_FOOTBALL_KEY</code> = your key from api-football.com</li>
            <li>Add <code className="text-pitch">API_FOOTBALL_SEASON</code> = <code className="text-pitch">2026</code></li>
            <li>Deployments → Redeploy (required!)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
