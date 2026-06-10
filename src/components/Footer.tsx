import Link from "next/link";
import NewsletterSignup from "@/components/NewsletterSignup";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <NewsletterSignup variant="footer" />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-display text-3xl tracking-wider text-white">
              VAMOS<span className="text-pitch">26</span>
            </span>
            <p className="text-muted text-sm mt-2">
              Live scores, stats & World Cup 2026 fan guides
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm"
          >
            <Link href="/about" className="text-muted hover:text-pitch transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-muted hover:text-pitch transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="text-muted hover:text-pitch transition-colors">
              Privacy
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="w-8 h-5 rounded-sm bg-usa-blue" title="USA" />
            <div className="w-8 h-5 rounded-sm bg-canada-red" title="Canada" />
            <div className="w-8 h-5 rounded-sm bg-mexico-green" title="Mexico" />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 space-y-3 text-center">
          <p className="text-xs text-muted max-w-2xl mx-auto">
            We may earn commission from links on this page. VAMOS26.com is built for football
            fans. Tournament data based on the official December 2025 Final Draw. Not
            affiliated with FIFA.
          </p>
          <p className="font-display text-5xl text-white/5 select-none">
            ¡VAMOS!
          </p>
        </div>
      </div>
    </footer>
  );
}
