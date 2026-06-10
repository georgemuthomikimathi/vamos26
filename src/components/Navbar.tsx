"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "live", label: "Live" },
  { id: "friendlies", label: "Friendlies" },
  { id: "stats", label: "Stats" },
  { id: "watchlist", label: "Watch" },
  { id: "fixtures", label: "Fixtures" },
  { id: "groups", label: "Groups" },
  { id: "roadmap", label: "Road to Final" },
  { id: "trophy", label: "Trophy & Ball" },
  { id: "stars", label: "Stars" },
  { id: "discover", label: "Discover NYC" },
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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    onTabChange(id);
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
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
            onClick={() => handleNav("home")}
            className="flex items-center gap-2 group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pitch to-usa-blue flex items-center justify-center font-display text-2xl text-navy font-bold group-hover:scale-105 transition-transform">
              V
            </div>
            <div className="text-left">
              <span className="font-display text-2xl md:text-3xl tracking-wider text-white block leading-none">
                VAMOS<span className="text-pitch">26</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
                FIFA World Cup
              </span>
            </div>
          </button>

          <div className="hidden xl:flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`px-3 py-2 rounded-full text-xs font-medium transition-all border ${
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
            className="xl:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
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
              onClick={() => handleNav(item.id)}
              className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
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
