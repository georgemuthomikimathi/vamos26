"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Bell } from "lucide-react";

const STORAGE_KEY = "vamos26-newsletter-email";

type NewsletterSignupProps = {
  variant?: "inline" | "footer";
};

/**
 * Email capture UI — wire to Mailchimp, ConvertKit, or similar by replacing
 * the form action / onSubmit handler with your provider endpoint.
 */
export default function NewsletterSignup({ variant = "inline" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, trimmed);
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  const isFooter = variant === "footer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={
        isFooter
          ? "w-full max-w-md"
          : "max-w-xl mx-auto bg-card/60 border border-white/10 rounded-3xl p-6 md:p-8"
      }
    >
      <div className={`flex items-center gap-2 mb-3 ${isFooter ? "justify-center md:justify-start" : ""}`}>
        <Bell size={18} className="text-pitch shrink-0" />
        <h3
          className={`font-display text-white ${isFooter ? "text-2xl" : "text-3xl"}`}
        >
          WC26 ALERTS
        </h3>
      </div>
      <p
        className={`text-sm text-muted mb-4 ${isFooter ? "text-center md:text-left" : "text-center"}`}
      >
        Get goal alerts &amp; WC26 updates — kickoff reminders, draw news, and match-day
        highlights.
      </p>

      {status === "success" ? (
        <p className="text-sm text-pitch font-medium flex items-center gap-2 justify-center md:justify-start">
          <Mail size={16} />
          You&apos;re on the list! We&apos;ll be in touch before kickoff.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          action="#newsletter"
          className={`flex flex-col sm:flex-row gap-2 ${isFooter ? "" : ""}`}
        >
          <label htmlFor={`newsletter-email-${variant}`} className="sr-only">
            Email address
          </label>
          <input
            id={`newsletter-email-${variant}`}
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            required
            className="flex-1 bg-navy border border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-sm text-white placeholder:text-muted focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/20"
          />
          <button
            type="submit"
            className="bg-pitch text-navy font-semibold px-6 py-3 rounded-xl min-h-[48px] tap-scale focus-ring whitespace-nowrap"
          >
            Subscribe
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-xs text-canada-red mt-2">Please enter a valid email address.</p>
      )}

      {!isFooter && (
        <p className="text-[10px] text-muted/60 mt-3 text-center">
          No spam. Unsubscribe anytime. Connect to Mailchimp or ConvertKit via form action.
        </p>
      )}
    </motion.div>
  );
}
