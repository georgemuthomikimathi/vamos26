"use client";

import Navbar from "@/components/Navbar";
import ChampionsCelebration from "@/components/ChampionsCelebration";
import AftermathNewsSection from "@/components/AftermathNewsSection";
import RoadToFinal from "@/components/RoadToFinal";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const SECTIONS = ["champions", "news", "roadmap"];

export default function Home() {
  const [activeTab, setActiveTab] = useScrollSpy(SECTIONS, "champions");

  return (
    <main className="min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <ChampionsCelebration />
      <AftermathNewsSection />
      <RoadToFinal />
      <Footer />
      <BackToTop />
    </main>
  );
}
