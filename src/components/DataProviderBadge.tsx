type DataProvider = "api-football" | "static" | "fallback" | "";

type DataProviderBadgeProps = {
  provider?: DataProvider;
  className?: string;
};

export default function DataProviderBadge({ provider, className = "" }: DataProviderBadgeProps) {
  if (!provider || provider === "static" || provider === "fallback") return null;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-pitch/30 bg-pitch/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-pitch ${className}`}
    >
      API-Football
    </span>
  );
}
