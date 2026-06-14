type DataProvider = "api-football" | "worldcup26" | "static" | "fallback" | "";

type DataProviderBadgeProps = {
  provider?: DataProvider;
  className?: string;
};

export default function DataProviderBadge({ provider, className = "" }: DataProviderBadgeProps) {
  if (!provider || provider === "static" || provider === "fallback") return null;

  const isApi = provider === "api-football";

  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-0.5 border ${
        isApi
          ? "bg-pitch/20 text-pitch border-pitch/40"
          : "bg-gold/15 text-gold border-gold/30"
      } ${className}`}
    >
      {isApi ? "API-Football" : "worldcup26.ir"}
    </span>
  );
}
