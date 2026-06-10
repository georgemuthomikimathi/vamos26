"use client";

import Navbar from "@/components/Navbar";
import SectionQuickNav from "@/components/SectionQuickNav";
import BackToTop from "@/components/BackToTop";
import Hero from "@/components/Hero";
import DonateSection from "@/components/DonateSection";
import LiveMatchCenter from "@/components/LiveMatchCenter";
import FriendlyScores from "@/components/FriendlyScores";
import TeamNewsSection from "@/components/TeamNewsSection";
import AppBottomNav from "@/components/AppBottomNav";
import StadiumsSection from "@/components/StadiumsSection";
import StatsLeaders from "@/components/StatsLeaders";
import WatchlistSection from "@/components/WatchlistSection";
import UpcomingMatches from "@/components/UpcomingMatches";
import GroupsSection from "@/components/GroupsSection";
import RoadToFinal from "@/components/RoadToFinal";
import TrophyBallSection from "@/components/TrophyBallSection";
import DiscoverSection from "@/components/DiscoverSection";
import Footer from "@/components/Footer";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const SECTIONS = [
  "home",
  "donate",
  "live",
  "friendlies",
  "news",
  "stadiums",
  "stats",
  "watchlist",
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
      <DonateSection />
      <LiveMatchCenter />
      <FriendlyScores />
      <TeamNewsSection />
      <StadiumsSection />
      <StatsLeaders />
      <WatchlistSection />
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
