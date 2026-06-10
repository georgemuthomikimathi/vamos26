/** Google AdSense publisher ID (ca-pub-…). */
export const ADSENSE_CLIENT = "ca-pub-3382367478214113";

/**
 * Optional meta-tag verification content from the AdSense dashboard.
 * Set NEXT_PUBLIC_ADSENSE_VERIFICATION_META to override; defaults to the client ID.
 */
export const ADSENSE_VERIFICATION_META =
  process.env.NEXT_PUBLIC_ADSENSE_VERIFICATION_META ?? ADSENSE_CLIENT;

/** ads.txt publisher ID (pub-…, without ca- prefix). */
export const ADSENSE_PUBLISHER_ID = "pub-3382367478214113";

/** Ad unit slot IDs from AdSense dashboard — set in Vercel env vars. */
export const ADSENSE_SLOT_INLINE =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE ?? "0000000000";
export const ADSENSE_SLOT_SIDEBAR =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR ?? "0000000001";
