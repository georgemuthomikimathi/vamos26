import Link from "next/link";
import Footer from "@/components/Footer";

type StaticPageShellProps = {
  title: string;
  subtitle?: string;
  showFooter?: boolean;
  children: React.ReactNode;
};

export default function StaticPageShell({
  title,
  subtitle,
  showFooter = true,
  children,
}: StaticPageShellProps) {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10 bg-navy/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-2xl tracking-wider text-white hover:text-pitch transition-colors"
          >
            VAMOS<span className="text-pitch">26</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            ← Back to site
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3">
          VAMOS26
        </p>
        <h1 className="font-display text-5xl md:text-6xl text-white mb-4">{title}</h1>
        {subtitle && (
          <p className="text-muted text-lg mb-10 leading-relaxed">{subtitle}</p>
        )}
        <div className="prose-vamos space-y-6 text-muted leading-relaxed">{children}</div>
      </article>

      {showFooter ? <Footer /> : null}
    </main>
  );
}
