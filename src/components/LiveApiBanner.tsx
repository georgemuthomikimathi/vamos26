"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

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
        className="mb-3 flex items-center gap-2 text-[11px] text-pitch/70"
      >
        <CheckCircle2 className="text-pitch shrink-0" size={13} />
        <span>
          Live data · <span className="text-pitch font-semibold">API-Football</span>
        </span>
      </div>
    );
  }

  if (source === "api" && provider === "worldcup26") {
    return (
      <div
        role="status"
        className="mb-3 flex items-center gap-2 text-[11px] text-gold/70"
      >
        <CheckCircle2 className="text-gold shrink-0" size={13} />
        <span>Live data · worldcup26.ir</span>
      </div>
    );
  }

  if (source === "api") return null;

  return (
    <div
      role="alert"
      className="mb-4 rounded-xl border border-gold/40 bg-gold/10 px-3 py-2.5"
    >
      <div className="flex gap-2 items-start">
        <AlertTriangle className="text-gold shrink-0 mt-0.5" size={16} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Live feed unavailable</p>
          <p className="text-xs text-muted mt-0.5">
            {apiError ?? "Showing preview schedule — check API key in Vercel and redeploy."}
          </p>
        </div>
      </div>
    </div>
  );
}
