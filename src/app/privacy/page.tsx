import type { Metadata } from "next";
import StaticPageShell from "@/components/StaticPageShell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How VAMOS26 handles cookies, advertising, analytics, and newsletter data.",
};

export default function PrivacyPage() {
  return (
    <StaticPageShell
      title="Privacy Policy"
      subtitle="Last updated: June 10, 2026"
    >
      <section>
        <h2 className="font-display text-2xl text-white mb-3">Overview</h2>
        <p>
          VAMOS26 (&quot;we,&quot; &quot;us&quot;) operates vamos26.com as a fan resource for
          FIFA World Cup 2026 news, scores, and guides. This policy explains what
          information we collect and how we use it.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">Google AdSense</h2>
        <p>
          We use Google AdSense to display advertisements. Google and its partners may
          use cookies to serve ads based on your prior visits to this site or other
          websites. You can opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="text-pitch hover:text-white underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          .
        </p>
        <p className="mt-3">
          Third-party vendors, including Google, use cookies to serve ads. Google&apos;s
          use of advertising cookies enables it and its partners to serve ads based on
          your visit to vamos26.com and/or other sites on the Internet.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">Cookies</h2>
        <p>
          We use a cookie consent banner for EU visitors. Accepting stores your preference
          in your browser&apos;s local storage. AdSense may set additional cookies when ads
          are displayed. You can clear cookies through your browser settings at any time.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">Analytics</h2>
        <p>
          We may use privacy-friendly analytics to understand site traffic and improve
          content. Analytics data is aggregated and does not personally identify you
          unless you voluntarily submit contact information.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">Affiliate Links</h2>
        <p>
          Some links on vamos26.com are affiliate links to streaming services, travel
          partners, and retailers. If you click these links and make a purchase, we may
          earn a commission at no extra cost to you. Affiliate relationships do not
          influence our editorial coverage of matches or teams.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">Newsletter</h2>
        <p>
          If you subscribe to WC26 alerts, we collect your email address to send
          tournament updates. Newsletter data is stored securely and is not sold to third
          parties. You may unsubscribe at any time by contacting us.
        </p>
      </section>

      <section>
        <h2 className="font-display text-2xl text-white mb-3">Contact</h2>
        <p>
          Questions about this policy? Visit our{" "}
          <a href="/contact" className="text-pitch hover:text-white underline">
            Contact page
          </a>
          .
        </p>
      </section>
    </StaticPageShell>
  );
}
