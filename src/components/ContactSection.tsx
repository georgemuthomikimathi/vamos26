"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, Mail, ChevronRight, Shield } from "lucide-react";
import { getContactChannels } from "@/lib/contact";

const ICONS = {
  call: Phone,
  text: MessageCircle,
  email: Mail,
} as const;

export default function ContactSection() {
  const channels = getContactChannels();

  return (
    <section id="contact" className="section-anchor relative py-24 bg-navy overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-usa-blue/5 to-transparent" />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-pitch uppercase tracking-[0.4em] text-xs font-semibold mb-3 flex items-center justify-center gap-2">
            <Shield size={14} />
            Secure contact
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-white mb-4">
            CONTACT <span className="text-gradient-pitch">US</span>
          </h2>
          <p className="text-muted max-w-lg mx-auto text-sm leading-relaxed">
            Venue tips, partnerships, or site feedback — tap a channel below. Your
            details stay private; we connect you through a secure link.
          </p>
        </motion.div>

        <div className="space-y-3">
          {channels.map((ch, i) => {
            const Icon = ICONS[ch.id as keyof typeof ICONS];
            return (
              <motion.a
                key={ch.id}
                href={ch.href}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group flex items-center gap-4 bg-card border border-white/10 rounded-2xl p-4 md:p-5 hover:border-pitch/40 hover:bg-pitch/5 transition-all tap-scale focus-ring"
                {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                <div className="w-12 h-12 rounded-xl bg-pitch/10 flex items-center justify-center shrink-0 group-hover:bg-pitch/20 transition-colors">
                  <Icon size={22} className="text-pitch" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="font-semibold text-white">{ch.label}</div>
                  <div className="text-xs text-muted">{ch.sublabel}</div>
                  <div className="text-[11px] text-muted/70 mt-1 font-mono tracking-wider">
                    {ch.fauxDetail}
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  className="text-muted group-hover:text-pitch group-hover:translate-x-0.5 transition-all shrink-0"
                />
              </motion.a>
            );
          })}
        </div>

        <p className="text-center text-[10px] text-muted/60 mt-8 max-w-md mx-auto">
          Contact info is masked for privacy. Tapping opens your phone or email app
          with VAMOS26 support — similar to ride-share & delivery apps.
        </p>
      </div>
    </section>
  );
}
