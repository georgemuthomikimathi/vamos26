"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";

type LiveApiBannerProps = {
  source: "api" | "static" | "";
  apiError?: string;
};

export default function LiveApiBanner({ source, apiError }: LiveApiBannerProps) {
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
