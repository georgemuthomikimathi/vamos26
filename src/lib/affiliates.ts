/**
 * Affiliate partner links.
 * Override any URL via NEXT_PUBLIC_AFFILIATE_* env vars in Vercel (tracked links).
 */

export type AffiliateLink = {
  id: string;
  label: string;
  description: string;
  href: string;
  partner: string;
};

export const AFFILIATE_REL = "sponsored noopener" as const;
export const AFFILIATE_TARGET = "_blank" as const;

function affiliateUrl(envKey: string, fallback: string): string {
  return process.env[envKey]?.trim() || fallback;
}

/** Streaming — How to Watch section */
export const STREAMING_AFFILIATES: AffiliateLink[] = [
  {
    id: "fubo",
    partner: "Fubo",
    label: "Watch on Fubo",
    description: "Live World Cup matches with cloud DVR — 7-day free trial.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_FUBO_URL",
      "https://www.fubo.tv/welcome"
    ),
  },
  {
    id: "peacock",
    partner: "Peacock",
    label: "Stream on Peacock",
    description: "Select USA matches and studio coverage in English & Spanish.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_PEACOCK_URL",
      "https://www.peacocktv.com/"
    ),
  },
  {
    id: "fox-sports",
    partner: "Fox Sports",
    label: "Fox Sports App",
    description: "Official English-language broadcaster for USA group & knockout games.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_FOX_URL",
      "https://www.foxsports.com/"
    ),
  },
];

/** NYC Guide — hotels, tours, transit */
export const NYC_TRAVEL_AFFILIATES: AffiliateLink[] = [
  {
    id: "booking-nyc",
    partner: "Booking.com",
    label: "Hotels in NYC",
    description: "Compare stays near Penn Station, Brooklyn fan zones & MetLife shuttles.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_BOOKING_NYC_URL",
      "https://www.booking.com/city/us/new-york.html"
    ),
  },
  {
    id: "getyourguide-nyc",
    partner: "GetYourGuide",
    label: "NYC Tours & Experiences",
    description: "Stadium tours, food walks, and match-day activities across the boroughs.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_GETYOURGUIDE_URL",
      "https://www.getyourguide.com/new-york-l59/"
    ),
  },
  {
    id: "amtrak",
    partner: "Amtrak",
    label: "Amtrak to NYC",
    description: "Train into Penn Station — easy connection to NJ Transit for MetLife.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_AMTRAK_URL",
      "https://www.amtrak.com/"
    ),
  },
];

/** Watchlist / gear */
export const GEAR_AFFILIATE: AffiliateLink = {
  id: "amazon-gear",
  partner: "Amazon",
  label: "Shop Soccer Gear",
  description: "Jerseys, boots, and fan essentials for World Cup season.",
  href: affiliateUrl(
    "NEXT_PUBLIC_AFFILIATE_AMAZON_URL",
    "https://www.amazon.com/s?k=soccer+gear"
  ),
};

/** Host cities — travel */
export const HOST_CITY_TRAVEL_AFFILIATES: AffiliateLink[] = [
  {
    id: "expedia-host-cities",
    partner: "Expedia",
    label: "Hotels in Host Cities",
    description: "Flights, hotels & packages for Atlanta, LA, Miami, Mexico City & more.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_EXPEDIA_URL",
      "https://www.expedia.com/"
    ),
  },
  {
    id: "booking-host-cities",
    partner: "Booking.com",
    label: "Book Host City Stays",
    description: "Compare rates near stadiums across all 16 World Cup venues.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_BOOKING_URL",
      "https://www.booking.com/"
    ),
  },
];
