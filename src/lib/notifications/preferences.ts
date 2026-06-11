export type AlertPreferences = {
  enabled: boolean;
  goals: boolean;
  redCards: boolean;
  penalties: boolean;
};

const STORAGE_KEY = "vamos26-alert-prefs";

export const DEFAULT_ALERT_PREFS: AlertPreferences = {
  enabled: false,
  goals: true,
  redCards: true,
  penalties: true,
};

export function getAlertPreferences(): AlertPreferences {
  if (typeof window === "undefined") return DEFAULT_ALERT_PREFS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ALERT_PREFS;
    return { ...DEFAULT_ALERT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ALERT_PREFS;
  }
}

export function saveAlertPreferences(prefs: AlertPreferences): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export function isNotificationSupported(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}
