import { ExternalLink } from "lucide-react";
import type { AffiliateLink } from "@/lib/affiliates";
import { AFFILIATE_REL, AFFILIATE_TARGET } from "@/lib/affiliates";

type GuideAffiliatePanelProps = {
  title: string;
  links: AffiliateLink[];
};

export default function GuideAffiliatePanel({ title, links }: GuideAffiliatePanelProps) {
  if (links.length === 0) return null;

  return (
    <aside className="not-prose my-10 bg-card/80 border border-pitch/20 rounded-2xl p-6">
      <h2 className="font-display text-2xl text-white mb-4">{title}</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target={AFFILIATE_TARGET}
              rel={AFFILIATE_REL}
              className="group flex items-start justify-between gap-3 rounded-xl border border-white/10 bg-navy/40 px-4 py-3 hover:border-pitch/40 hover:bg-pitch/5 transition-colors"
            >
              <span>
                <span className="block font-semibold text-white group-hover:text-pitch transition-colors">
                  {link.label}
                </span>
                <span className="block text-sm text-muted mt-0.5">{link.description}</span>
              </span>
              <ExternalLink size={16} className="text-muted shrink-0 mt-1" />
            </a>
          </li>
        ))}
      </ul>
      <p className="text-[10px] text-muted/60 mt-4">
        Affiliate links — we may earn a commission at no extra cost to you.
      </p>
    </aside>
  );
}
