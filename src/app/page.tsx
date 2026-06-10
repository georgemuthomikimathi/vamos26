"use client";

import Navbar from "@/components/Navbar";
import SectionQuickNav from "@/components/SectionQuickNav";
import BackToTop from "@/components/BackToTop";
import Hero from "@/components/Hero";
import LiveMatchCenter from "@/components/LiveMatchCenter";
import FriendlyScores from "@/components/FriendlyScores";
import AppBottomNav from "@/components/AppBottomNav";
import StadiumsSection from "@/components/StadiumsSection";
import StatsLeaders from "@/components/StatsLeaders";
import WatchlistSection from "@/components/WatchlistSection";
import DonateSection from "@/components/DonateSection";
import DropshipSection from "@/components/DropshipSection";
import UpcomingMatches from "@/components/UpcomingMatches";
import GroupsSection from "@/components/GroupsSection";
import RoadToFinal from "@/components/RoadToFinal";
import TrophyBallSection from "@/components/TrophyBallSection";
import DiscoverSection from "@/components/DiscoverSection";
import Footer from "@/components/Footer";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const SECTIONS = [
  "home",
  "live",
  "friendlies",
  "stadiums",
  "stats",
  "watchlist",
  "donate",
  "shop",
  "fixtures",
  "groups",
  "roadmap",
  "trophy",
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
      <StadiumsSection />
      <StatsLeaders />
      <WatchlistSection />
      <DonateSection />
      <DropshipSection />
      <UpcomingMatches />
      <GroupsSection />
      <RoadToFinal />
      <TrophyBallSection />
      <DiscoverSection />
      <Footer />
      <AppBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <BackToTop />
    </main>
  );
}
