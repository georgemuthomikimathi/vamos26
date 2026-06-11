"use client";

import { Radio, BarChart3, HeartHandshake, Bell } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

const BOTTOM_NAV = [
  { id: "live", label: "Live", icon: Radio },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "donate", label: "Donate", icon: HeartHandshake },
  { id: "newsletter", label: "Alerts", icon: Bell },
] as const;

type AppBottomNavProps = {
  activeTab: string;
  onTabChange: (id: string) => void;
};

export default function AppBottomNav({ activeTab, onTabChange }: AppBottomNavProps) {
  const handleNav = (id: string) => {
    onTabChange(id);
    scrollToSection(id);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-navy/95 backdrop-blur-xl border-t border-white/10 safe-area-pb"
      aria-label="App navigation"
    >
      <div className="host-stripe h-0.5 w-full" aria-hidden />
      <div className="grid grid-cols-4">
        {BOTTOM_NAV.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleNav(id)}
              aria-current={active ? "true" : undefined}
              aria-label={label}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-1 min-h-[56px] transition-colors tap-scale focus-ring rounded-lg ${
                active ? "text-pitch" : "text-muted hover:text-white"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
