"use client";

import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";
import {
  DEFAULT_ALERT_PREFS,
  getAlertPreferences,
  isNotificationSupported,
  saveAlertPreferences,
  type AlertPreferences,
} from "@/lib/notifications/preferences";

export default function MatchAlertSettings() {
  const [prefs, setPrefs] = useState<AlertPreferences>(DEFAULT_ALERT_PREFS);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(isNotificationSupported());
    setPrefs(getAlertPreferences());
    if (isNotificationSupported()) {
      setPermission(Notification.permission);
    }
  }, []);

  const sync = (next: AlertPreferences) => {
    setPrefs(next);
    saveAlertPreferences(next);
    window.dispatchEvent(new Event("vamos26-alerts-change"));
  };

  const enableAlerts = async () => {
    if (!supported) return;

    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      sync({ ...prefs, enabled: true });
    }
  };

  const toggle = (key: keyof Omit<AlertPreferences, "enabled">) => {
    sync({ ...prefs, [key]: !prefs[key] });
  };

  if (!supported) return null;

  return (
    <div className="mb-8 bg-card/60 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <BellRing size={18} className="text-pitch" />
        <h3 className="font-display text-2xl text-white">Match alerts</h3>
      </div>
      <p className="text-sm text-muted mb-4">
        Get notified for goals, red cards, and penalties during live matches. Works best with
        the app installed on your home screen.
      </p>

      {permission !== "granted" ? (
        <button
          type="button"
          onClick={enableAlerts}
          className="inline-flex items-center gap-2 bg-pitch text-navy font-semibold px-5 py-3 rounded-xl min-h-[48px] tap-scale focus-ring"
        >
          <Bell size={16} />
          Enable goal &amp; card alerts
        </button>
      ) : (
        <div className="space-y-3">
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-sm text-white">Alerts enabled</span>
            <input
              type="checkbox"
              checked={prefs.enabled}
              onChange={() => sync({ ...prefs, enabled: !prefs.enabled })}
              className="w-5 h-5 accent-pitch"
            />
          </label>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-sm text-muted">Goals</span>
            <input
              type="checkbox"
              checked={prefs.goals}
              disabled={!prefs.enabled}
              onChange={() => toggle("goals")}
              className="w-5 h-5 accent-pitch"
            />
          </label>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-sm text-muted">Red cards</span>
            <input
              type="checkbox"
              checked={prefs.redCards}
              disabled={!prefs.enabled}
              onChange={() => toggle("redCards")}
              className="w-5 h-5 accent-pitch"
            />
          </label>
          <label className="flex items-center justify-between gap-4 cursor-pointer">
            <span className="text-sm text-muted">Penalties</span>
            <input
              type="checkbox"
              checked={prefs.penalties}
              disabled={!prefs.enabled}
              onChange={() => toggle("penalties")}
              className="w-5 h-5 accent-pitch"
            />
          </label>
          <p className="text-[10px] text-muted/70">
            Checks live matches every 30s. Penalties include scored and missed.
          </p>
        </div>
      )}
    </div>
  );
}
