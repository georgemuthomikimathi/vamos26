"use client";

import Navbar from "@/components/Navbar";
import SectionQuickNav from "@/components/SectionQuickNav";
import BackToTop from "@/components/BackToTop";
import Hero from "@/components/Hero";
import LiveMatchCenter from "@/components/LiveMatchCenter";
import FriendlyScores from "@/components/FriendlyScores";
import StatsLeaders from "@/components/StatsLeaders";
import DonateSection from "@/components/DonateSection";
import UpcomingMatches from "@/components/UpcomingMatches";
import GroupsSection from "@/components/GroupsSection";
import RoadToFinal from "@/components/RoadToFinal";
import TrophyBallSection from "@/components/TrophyBallSection";
import PlayersSection from "@/components/PlayersSection";
import DiscoverSection from "@/components/DiscoverSection";
import Footer from "@/components/Footer";
import AppBottomNav from "@/components/AppBottomNav";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const SECTIONS = [
  "home",
  "live",
  "friendlies",
  "stats",
  "donate",
  "fixtures",
  "groups",
  "roadmap",
  "trophy",
  "stars",
  "discover",
];

export default function Home() {
  const [activeTab, setActiveTab] = useScrollSpy(SECTIONS, "home");

  return (
    <main className="min-h-screen">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <SectionQuickNav activeTab={activeTab} onTabChange={setActiveTab} />
      <Hero onNavigate={setActiveTab} />
      <LiveMatchCenter />
      <FriendlyScores />
      <StatsLeaders />
      <DonateSection />
      <UpcomingMatches />
      <GroupsSection />
      <RoadToFinal />
      <TrophyBallSection />
      <PlayersSection />
      <DiscoverSection />
      <Footer />
      <AppBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <BackToTop />
    </main>
  );
}
