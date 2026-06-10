import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact VAMOS26 for venue tips, partnerships, and site feedback.",
};

export default function ContactPage() {
  return (
    <>
      <StaticPageShell
        title="Contact Us"
        subtitle="Venue tips, partnerships, corrections, or general feedback — we'd love to hear from you."
        showFooter={false}
      >
        <p>
          Use the secure channels below to reach the VAMOS26 team. We typically respond
          to email within 24–48 hours during the tournament build-up and live period.
        </p>
      </StaticPageShell>
      <ContactSection />
      <Footer />
    </>
  );
}
