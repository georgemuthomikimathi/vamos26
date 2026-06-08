"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import UpcomingMatches from "@/components/UpcomingMatches";
import GroupsSection from "@/components/GroupsSection";
import RoadToFinal from "@/components/RoadToFinal";
import TrophyBallSection from "@/components/TrophyBallSection";
import PlayersSection from "@/components/PlayersSection";
import DiscoverSection from "@/components/DiscoverSection";
import Footer from "@/components/Footer";

const SECTIONS = ["home", "fixtures", "groups", "roadmap", "trophy", "stars", "discover"];

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.id);
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <Hero />
      <UpcomingMatches />
      <GroupsSection />
      <RoadToFinal />
      <TrophyBallSection />
      <PlayersSection />
      <DiscoverSection />
      <Footer />
    </main>
  );
}
