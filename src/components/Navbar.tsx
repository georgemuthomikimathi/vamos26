"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

const NAV_ITEMS = [
  { id: "champions", label: "Champions" },
  { id: "news", label: "News" },
  { id: "roadmap", label: "Road to Final" },
];

type NavbarProps = {
  activeTab: string;
  onTabChange: (id: string) => void;
};

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNav = (id: string) => {
    onTabChange(id);
    setMobileOpen(false);
    scrollToSection(id);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="host-stripe h-1 w-full" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            type="button"
            onClick={() => handleNav("champions")}
            className="flex items-center gap-2 group shrink-0 tap-scale focus-ring rounded-xl"
            aria-label="VAMOS26 home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pitch to-usa-blue flex items-center justify-center font-display text-2xl text-navy font-bold group-hover:scale-105 transition-transform">
              V
            </div>
            <div className="text-left">
              <span className="font-display text-2xl md:text-3xl tracking-wider text-white block leading-none">
                VAMOS<span className="text-pitch">26</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
                Spain · Champions 2026
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNav(item.id)}
                aria-current={activeTab === item.id ? "true" : undefined}
                className={`px-3 py-2 min-h-[44px] rounded-full text-xs font-medium transition-all border tap-scale focus-ring ${
                  activeTab === item.id
                    ? "tab-active"
                    : "border-transparent text-muted hover:text-white hover:bg-white/5"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="xl:hidden p-3 min-w-[44px] min-h-[44px] text-white tap-scale focus-ring rounded-xl"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="xl:hidden bg-navy-light/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 grid grid-cols-2 gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              aria-current={activeTab === item.id ? "true" : undefined}
              className={`text-left px-4 py-3 min-h-[48px] rounded-xl text-sm font-medium transition-all tap-scale focus-ring ${
                activeTab === item.id
                  ? "bg-pitch/10 text-pitch"
                  : "text-muted hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
