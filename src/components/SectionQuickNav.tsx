"use client";

import { scrollToSection } from "@/lib/scroll";

const QUICK_LINKS = [
  { id: "live", label: "Live" },
  { id: "friendlies", label: "Friendlies" },
  { id: "stats", label: "Stats" },
  { id: "watchlist", label: "Watch" },
  { id: "donate", label: "Donate" },
  { id: "discover", label: "NYC" },
] as const;

type SectionQuickNavProps = {
  activeTab: string;
  onTabChange: (id: string) => void;
};

export default function SectionQuickNav({ activeTab, onTabChange }: SectionQuickNavProps) {
  const handleNav = (id: string) => {
    onTabChange(id);
    scrollToSection(id);
  };

  return (
    <div
      className="sticky top-16 md:top-20 z-40 xl:hidden bg-navy/90 backdrop-blur-xl border-b border-white/10"
      aria-label="Quick section navigation"
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2.5 snap-x snap-mandatory">
        {QUICK_LINKS.map(({ id, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleNav(id)}
              aria-current={active ? "true" : undefined}
              className={`shrink-0 snap-start px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wide border transition-all tap-scale focus-ring min-h-[44px] ${
                active
                  ? "tab-active"
                  : "border-white/10 text-muted hover:text-white hover:border-white/20"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
