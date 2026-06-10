export type DonateTier = {
  id: string;
  label: string;
  amount: string;
  description: string;
  url: string;
};

/** Set NEXT_PUBLIC_PAYPAL_EMAIL in Vercel / .env.local */
export const PAYPAL_EMAIL =
  process.env.NEXT_PUBLIC_PAYPAL_EMAIL ?? "axonsovereignllc@gmail.com";

export function paypalDonateUrl(amount?: number): string {
  const params = new URLSearchParams({
    business: PAYPAL_EMAIL,
    currency_code: "USD",
    item_name: "VAMOS26 Fan Support",
  });
  if (amount) params.set("amount", String(amount));
  return `https://www.paypal.com/donate/?${params.toString()}`;
}

export const DONATE_TIERS: DonateTier[] = [
  {
    id: "coffee",
    label: "Coffee",
    amount: "$5",
    description: "Keeps the servers humming through group stage",
    url: paypalDonateUrl(5),
  },
  {
    id: "supporter",
    label: "Supporter",
    amount: "$15",
    description: "Helps fund live data and NYC venue updates",
    url: paypalDonateUrl(15),
  },
  {
    id: "champion",
    label: "Champion",
    amount: "$50",
    description: "Powers the full tournament — scores, stats, and guides",
    url: paypalDonateUrl(50),
  },
];

export const DONATE_PRIMARY_URL =
  process.env.NEXT_PUBLIC_DONATE_URL ?? paypalDonateUrl();
