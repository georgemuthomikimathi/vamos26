type DataProvider = "api-football" | "worldcup26" | "hybrid" | "static" | "fallback" | "";

const LABELS: Record<string, string> = {
  "api-football": "API-Football",
  worldcup26: "worldcup26.ir",
  hybrid: "Hybrid · IR + API",
};

type DataProviderBadgeProps = {
  provider?: DataProvider;
  className?: string;
};

export default function DataProviderBadge({ provider, className = "" }: DataProviderBadgeProps) {
  if (!provider || provider === "static" || provider === "fallback") return null;

  const label = LABELS[provider] ?? provider;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-pitch/30 bg-pitch/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-pitch ${className}`}
    >
      {label}
    </span>
  );
}
