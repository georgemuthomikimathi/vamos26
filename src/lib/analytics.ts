/** GA4 Measurement ID — override via NEXT_PUBLIC_GA_MEASUREMENT_ID in Vercel. */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-TR0KTPZ44P";

export function isAnalyticsConfigured(): boolean {
  return GA_MEASUREMENT_ID.length > 0 && GA_MEASUREMENT_ID.startsWith("G-");
}
