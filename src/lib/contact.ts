/** Contact details — obfuscated; use getters, never render raw values in JSX */

function decode(parts: string[]): string {
  return parts.map((p) => String.fromCharCode(parseInt(p, 10))).join("");
}

// axonsovereignllc@gmail.com
const EMAIL_PARTS = ["97", "120", "111", "110", "115", "111", "118", "101", "114", "101", "105", "103", "110", "108", "108", "99", "64", "103", "109", "97", "105", "108", "46", "99", "111", "109"];

// 5512600796 → E.164 +15512600796
const PHONE_DIGITS = ["53", "53", "49", "50", "54", "48", "48", "55", "57", "54"];

export function getSupportEmail(): string {
  return decode(EMAIL_PARTS);
}

export function getSupportPhoneE164(): string {
  return `+1${decode(PHONE_DIGITS)}`;
}

export function getSupportPhoneDisplay(): string {
  return "(•••) •••-••••";
}

export function getSupportEmailDisplay(): string {
  return "fan••••@••••••••";
}

export type ContactChannel = {
  id: string;
  label: string;
  sublabel: string;
  fauxDetail: string;
  href: string;
  external?: boolean;
};

export function getContactChannels(): ContactChannel[] {
  const email = getSupportEmail();
  const phone = getSupportPhoneE164();

  return [
    {
      id: "call",
      label: "Fan Support Line",
      sublabel: "Secure voice connection",
      fauxDetail: getSupportPhoneDisplay(),
      href: `tel:${phone}`,
    },
    {
      id: "text",
      label: "Message the Team",
      sublabel: "SMS — typical reply under 24h",
      fauxDetail: "Text VAMOS26",
      href: `sms:${phone}?body=${encodeURIComponent("Hi VAMOS26 — ")}`,
    },
    {
      id: "email",
      label: "Email Support",
      sublabel: "Partnerships, venues & site feedback",
      fauxDetail: getSupportEmailDisplay(),
      href: `mailto:${email}?subject=${encodeURIComponent("VAMOS26 Contact")}`,
      external: true,
    },
  ];
}
