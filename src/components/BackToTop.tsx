"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => scrollToSection("home")}
      aria-label="Back to top"
      className="fixed bottom-20 md:bottom-8 right-4 z-40 w-12 h-12 rounded-full bg-pitch text-navy shadow-lg shadow-pitch/25 flex items-center justify-center tap-scale focus-ring animate-in fade-in"
    >
      <ArrowUp size={22} strokeWidth={2.5} />
    </button>
  );
}
