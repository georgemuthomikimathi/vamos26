"use client";

import Navbar from "@/components/Navbar";
import SectionQuickNav from "@/components/SectionQuickNav";
import BackToTop from "@/components/BackToTop";
import Hero from "@/components/Hero";
import NewsletterSignup from "@/components/NewsletterSignup";
import DonateSection from "@/components/DonateSection";
import LiveMatchCenter from "@/components/LiveMatchCenter";
import AdUnit, { AD_SLOT_HOMEPAGE_INLINE, AD_SLOT_HOMEPAGE_SIDEBAR } from "@/components/AdUnit";
import HowToWatch from "@/components/HowToWatch";
import TeamNewsSection from "@/components/TeamNewsSection";
import AppBottomNav from "@/components/AppBottomNav";
import StadiumsSection from "@/components/StadiumsSection";
import StatsLeaders from "@/components/StatsLeaders";
import PastFixturesSection from "@/components/PastFixturesSection";
import GroupsSection from "@/components/GroupsSection";
import RoadToFinal from "@/components/RoadToFinal";
import TrophyBallSection from "@/components/TrophyBallSection";
import DiscoverSection from "@/components/DiscoverSection";
import Footer from "@/components/Footer";
import { useScrollSpy } from "@/hooks/useScrollSpy";

const SECTIONS = [
  "home",
  "newsletter",
  "donate",
  "live",
  "news",
  "stadiums",
  "stats",
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
      <section
        id="newsletter"
        className="section-anchor scroll-mt-28 py-10 md:py-14 px-4 sm:px-6 lg:px-8 bg-navy-light/40 border-y border-pitch/10"
      >
        <NewsletterSignup />
      </section>
      <DonateSection />
      <LiveMatchCenter />
      <PastFixturesSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdUnit slot={AD_SLOT_HOMEPAGE_INLINE} className="max-w-3xl mx-auto" />
      </div>
      <TeamNewsSection />
      <StadiumsSection />
      <StatsLeaders />
      <HowToWatch />
      <GroupsSection />
      <RoadToFinal />
      <TrophyBallSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdUnit slot={AD_SLOT_HOMEPAGE_SIDEBAR} className="max-w-3xl mx-auto" />
      </div>
      <DiscoverSection />
      <Footer />
      <AppBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <BackToTop />
    </main>
  );
}
