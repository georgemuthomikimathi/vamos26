"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const OPENING_KICKOFF = new Date("2026-06-11T19:00:00Z"); // 1pm ET / Mexico City noon

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function calcTimeLeft(): TimeLeft {
  const diff = OPENING_KICKOFF.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

const UNITS = ["days", "hours", "minutes", "seconds"] as const;

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  if (time.expired) {
    return (
      <div className="bg-pitch/10 border border-pitch/30 rounded-3xl p-6 text-center">
        <p className="text-pitch font-display text-3xl tracking-wider">
          ¡EL MUNDIAL ESTÁ EN MARCHA!
        </p>
        <p className="text-muted text-sm mt-2">
          Mexico vs South Africa — World Cup 2026 is LIVE
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card/80 border border-pitch/20 rounded-3xl p-6 backdrop-blur-sm">
      <p className="text-center text-pitch uppercase tracking-[0.35em] text-[10px] font-semibold mb-1">
        Countdown to Kickoff
      </p>
      <p className="text-center text-white font-semibold text-sm mb-5">
        Opening Match — Mexico vs South Africa · June 11, 2026
      </p>
      <div className="grid grid-cols-4 gap-3">
        {UNITS.map((unit, i) => (
          <motion.div
            key={unit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-center bg-navy/60 border border-white/10 rounded-2xl py-4 px-2"
          >
            <div className="font-display text-4xl sm:text-5xl text-gradient-pitch leading-none tabular-nums">
              {String(time[unit]).padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted mt-2">
              {unit}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
