export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="font-display text-3xl tracking-wider text-white">
              VAMOS<span className="text-pitch">26</span>
            </span>
            <p className="text-muted text-sm mt-2">
              Your FIFA World Cup 2026 fan destination
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-5 rounded-sm bg-canada-red" title="Canada" />
            <div className="w-8 h-5 rounded-sm bg-usa-blue" title="USA" />
            <div className="w-8 h-5 rounded-sm bg-mexico-green" title="Mexico" />
          </div>

          <p className="text-xs text-muted text-center md:text-right max-w-xs">
            VAMOS26.com — Built for football fans. Tournament data based on the
            official December 2025 Final Draw. Not affiliated with FIFA.
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="font-display text-5xl text-white/5 select-none">
            ¡VAMOS!
          </p>
        </div>
      </div>
    </footer>
  );
}
