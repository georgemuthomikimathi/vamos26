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
  category?: "streaming" | "travel" | "gear" | "tickets" | "vpn" | "local";
};

export const AFFILIATE_REL = "sponsored noopener" as const;
export const AFFILIATE_TARGET = "_blank" as const;

function affiliateUrl(envKey: string, fallback: string): string {
  return process.env[envKey]?.trim() || fallback;
}

/** Streaming — How to Watch + guide */
export const STREAMING_AFFILIATES: AffiliateLink[] = [
  {
    id: "fubo",
    partner: "Fubo",
    label: "Watch on Fubo",
    description: "Live World Cup matches with cloud DVR — 7-day free trial.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_FUBO_URL", "https://www.fubo.tv/welcome"),
    category: "streaming",
  },
  {
    id: "peacock",
    partner: "Peacock",
    label: "Stream on Peacock",
    description: "Select USA matches and studio coverage in English & Spanish.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_PEACOCK_URL", "https://www.peacocktv.com/"),
    category: "streaming",
  },
  {
    id: "fox-sports",
    partner: "Fox Sports",
    label: "Fox Sports App",
    description: "Official English-language broadcaster for USA group & knockout games.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_FOX_URL", "https://www.foxsports.com/"),
    category: "streaming",
  },
  {
    id: "telemundo",
    partner: "Telemundo",
    label: "Telemundo / Univision",
    description: "Spanish-language World Cup coverage across NBCU platforms.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_TELEMUNDO_URL", "https://www.telemundo.com/"),
    category: "streaming",
  },
  {
    id: "youtube-tv",
    partner: "YouTube TV",
    label: "YouTube TV",
    description: "Cord-cutter bundle with Fox, FS1, and local channels for live matches.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_YOUTUBE_TV_URL", "https://tv.youtube.com/"),
    category: "streaming",
  },
  {
    id: "sling",
    partner: "Sling TV",
    label: "Sling TV",
    description: "Budget-friendly live TV with Fox Sports channels.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_SLING_URL", "https://www.sling.com/"),
    category: "streaming",
  },
];

export const VPN_AFFILIATES: AffiliateLink[] = [
  {
    id: "nordvpn",
    partner: "NordVPN",
    label: "NordVPN",
    description: "Watch your home broadcast when traveling abroad during the tournament.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_NORDVPN_URL", "https://nordvpn.com/"),
    category: "vpn",
  },
  {
    id: "expressvpn",
    partner: "ExpressVPN",
    label: "ExpressVPN",
    description: "Reliable VPN for fans following multiple leagues and regions.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_EXPRESSVPN_URL", "https://www.expressvpn.com/"),
    category: "vpn",
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
    category: "travel",
  },
  {
    id: "airbnb-nyc",
    partner: "Airbnb",
    label: "Airbnb in NYC",
    description: "Apartments and rooms across boroughs — great for group trips.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_AIRBNB_NYC_URL", "https://www.airbnb.com/s/New-York--NY/"),
    category: "travel",
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
    category: "travel",
  },
  {
    id: "viator-nyc",
    partner: "Viator",
    label: "Viator NYC Tours",
    description: "Match-day experiences, skyline tours, and food crawls.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_VIATOR_URL",
      "https://www.viator.com/New-York-City/d687"
    ),
    category: "travel",
  },
  {
    id: "amtrak",
    partner: "Amtrak",
    label: "Amtrak to NYC",
    description: "Train into Penn Station — easy connection to NJ Transit for MetLife.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_AMTRAK_URL", "https://www.amtrak.com/"),
    category: "travel",
  },
  {
    id: "uber-nyc",
    partner: "Uber",
    label: "Uber in NYC",
    description: "Late-night rides between bars, hotels, and Penn Station.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_UBER_URL", "https://www.uber.com/"),
    category: "local",
  },
  {
    id: "nj-transit",
    partner: "NJ Transit",
    label: "NJ Transit to MetLife",
    description: "Meadowlands Rail Service from Penn Station on match days.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_NJ_TRANSIT_URL", "https://www.njtransit.com/"),
    category: "local",
  },
];

/** Watchlist / gear */
export const GEAR_AFFILIATES: AffiliateLink[] = [
  {
    id: "amazon-gear",
    partner: "Amazon",
    label: "Shop Soccer Gear",
    description: "Jerseys, boots, and fan essentials for World Cup season.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_AMAZON_URL",
      "https://www.amazon.com/s?k=usa+soccer+jersey"
    ),
    category: "gear",
  },
  {
    id: "fanatics",
    partner: "Fanatics",
    label: "Fanatics Jerseys",
    description: "Official-style USA and World Cup fan kits.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_FANATICS_URL", "https://www.fanatics.com/"),
    category: "gear",
  },
  {
    id: "soccer-com",
    partner: "Soccer.com",
    label: "Soccer.com",
    description: "Boots, balls, and training gear from a soccer-first retailer.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_SOCCER_COM_URL", "https://www.soccer.com/"),
    category: "gear",
  },
];

export const GEAR_AFFILIATE: AffiliateLink = GEAR_AFFILIATES[0];

/** Host cities — travel */
export const HOST_CITY_TRAVEL_AFFILIATES: AffiliateLink[] = [
  {
    id: "expedia-host-cities",
    partner: "Expedia",
    label: "Hotels in Host Cities",
    description: "Flights, hotels & packages for Atlanta, LA, Miami, Mexico City & more.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_EXPEDIA_URL", "https://www.expedia.com/"),
    category: "travel",
  },
  {
    id: "booking-host-cities",
    partner: "Booking.com",
    label: "Book Host City Stays",
    description: "Compare rates near stadiums across all 16 World Cup venues.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_BOOKING_URL", "https://www.booking.com/"),
    category: "travel",
  },
  {
    id: "kayak",
    partner: "Kayak",
    label: "Kayak Flights",
    description: "Compare flights into host-city airports for group-stage road trips.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_KAYAK_URL", "https://www.kayak.com/"),
    category: "travel",
  },
  {
    id: "hotels-com",
    partner: "Hotels.com",
    label: "Hotels.com",
    description: "Loyalty rewards on stays near stadiums in the US, Mexico, and Canada.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_HOTELS_URL", "https://www.hotels.com/"),
    category: "travel",
  },
];

/** Tickets & hospitality */
export const TICKET_AFFILIATES: AffiliateLink[] = [
  {
    id: "stubhub",
    partner: "StubHub",
    label: "StubHub Tickets",
    description: "Resale market for group-stage and knockout matches.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_STUBHUB_URL", "https://www.stubhub.com/"),
    category: "tickets",
  },
  {
    id: "seatgeek",
    partner: "SeatGeek",
    label: "SeatGeek",
    description: "Browse face-value and resale inventory with deal scores.",
    href: affiliateUrl("NEXT_PUBLIC_AFFILIATE_SEATGEEK_URL", "https://seatgeek.com/"),
    category: "tickets",
  },
  {
    id: "fifa-hospitality",
    partner: "FIFA",
    label: "FIFA Hospitality",
    description: "Official VIP and hospitality packages for World Cup matches.",
    href: affiliateUrl(
      "NEXT_PUBLIC_AFFILIATE_FIFA_TICKETS_URL",
      "https://www.fifa.com/fifaplus/en/tournaments/mens/worldcup/canadamexicousa2026"
    ),
    category: "tickets",
  },
];

/** All affiliates for reference */
export const ALL_AFFILIATES: AffiliateLink[] = [
  ...STREAMING_AFFILIATES,
  ...VPN_AFFILIATES,
  ...NYC_TRAVEL_AFFILIATES,
  ...GEAR_AFFILIATES,
  ...HOST_CITY_TRAVEL_AFFILIATES,
  ...TICKET_AFFILIATES,
];
