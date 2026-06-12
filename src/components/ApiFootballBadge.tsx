type ApiFootballBadgeProps = {
  className?: string;
};

/** Site-wide badge when paid API-Football is connected */
export default function ApiFootballBadge({ className = "" }: ApiFootballBadgeProps) {
  return (
    <span
      className={`inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-pitch/20 text-pitch border border-pitch/40 rounded-full px-2 py-0.5 ${className}`}
    >
      API-Football
    </span>
  );
}
