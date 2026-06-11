"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Bell, Loader2 } from "lucide-react";

type NewsletterSignupProps = {
  variant?: "inline" | "footer";
};

export default function NewsletterSignup({ variant = "inline" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Subscribe failed");
      }

      setStatus("success");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong. Try again later."
      );
    }
  };

  const isFooter = variant === "footer";

  return (
    <motion.div
      initial={isFooter ? { opacity: 0, y: 12 } : false}
      whileInView={isFooter ? { opacity: 1, y: 0 } : undefined}
      viewport={isFooter ? { once: true } : undefined}
      className={
        isFooter
          ? "w-full max-w-md"
          : "max-w-xl mx-auto bg-card/80 border border-pitch/25 rounded-3xl p-6 md:p-8 shadow-lg shadow-pitch/5"
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
        Get live goal alerts &amp; WC26 updates — knockout reminders, lineup news, and match-day
        highlights as the tournament unfolds.
      </p>

      {status === "success" ? (
        <p className="text-sm text-pitch font-medium flex items-center gap-2 justify-center md:justify-start">
          <Mail size={16} />
          You&apos;re on the list! We&apos;ll send live tournament updates.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-2"
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
            disabled={status === "loading"}
            className="flex-1 bg-navy border border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-sm text-white placeholder:text-muted focus:border-pitch/50 focus:outline-none focus:ring-2 focus:ring-pitch/20 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-pitch text-navy font-semibold px-6 py-3 rounded-xl min-h-[48px] tap-scale focus-ring whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {status === "loading" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Joining…
              </>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      )}

      {status === "error" && errorMsg && (
        <p className="text-xs text-canada-red mt-2">{errorMsg}</p>
      )}

      {!isFooter && (
        <p className="text-[10px] text-muted/60 mt-3 text-center">
          No spam. Unsubscribe anytime.
        </p>
      )}
    </motion.div>
  );
}
