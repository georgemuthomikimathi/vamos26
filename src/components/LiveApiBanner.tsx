type LiveApiBannerProps = {
  source?: "api" | "static" | "";
  provider?: "api-football" | "static" | "";
  apiError?: string;
};

export default function LiveApiBanner({ source, provider, apiError }: LiveApiBannerProps) {
  if (source === "api" && provider === "api-football" && !apiError) {
    return null;
  }

  if (source === "api" && provider === "api-football" && apiError) {
    return (
      <p className="mb-4 text-center text-xs text-gold/90 bg-gold/10 border border-gold/20 rounded-xl px-4 py-2">
        {apiError}
      </p>
    );
  }

  if (source === "static" || provider === "static") {
    return (
      <div className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-200">
        <p className="font-semibold">Live feed unavailable</p>
        <p className="text-xs text-amber-200/80 mt-1">
          {apiError ?? "Check API_FOOTBALL_KEY in Vercel and redeploy."}
        </p>
      </div>
    );
  }

  return null;
}
