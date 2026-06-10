export const CONSENT_KEY = "vamos26-ad-consent";
export const CONSENT_EVENT = "vamos26:ad-consent";

export type AdConsent = "accepted" | "declined";

export function getAdConsent(): AdConsent | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(CONSENT_KEY);
  if (value === "accepted" || value === "declined") return value;
  return null;
}

export function hasAdConsent(): boolean {
  return getAdConsent() === "accepted";
}

export function setAdConsent(value: AdConsent): void {
  localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}
