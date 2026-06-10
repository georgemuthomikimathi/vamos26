/**
 * Affiliate partner links — placeholder URLs until affiliate IDs are configured.
 * Replace href values with your tracked affiliate URLs from each program dashboard.
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

/** Streaming — How to Watch section */
export const STREAMING_AFFILIATES: AffiliateLink[] = [
  {
    id: "fubo",
    partner: "Fubo",
    label: "Watch on Fubo",
    description: "Live World Cup matches with cloud DVR — 7-day free trial.",
    href: "https://www.fubo.tv/welcome",
  },
  {
    id: "peacock",
    partner: "Peacock",
    label: "Stream on Peacock",
    description: "Select USA matches and studio coverage in English & Spanish.",
    href: "https://www.peacocktv.com/",
  },
  {
    id: "fox-sports",
    partner: "Fox Sports",
    label: "Fox Sports App",
    description: "Official English-language broadcaster for USA group & knockout games.",
    href: "https://www.foxsports.com/",
  },
];

/** NYC Guide — hotels, tours, transit */
export const NYC_TRAVEL_AFFILIATES: AffiliateLink[] = [
  {
    id: "booking-nyc",
    partner: "Booking.com",
    label: "Hotels in NYC",
    description: "Compare stays near Penn Station, Brooklyn fan zones & MetLife shuttles.",
    href: "https://www.booking.com/city/us/new-york.html",
  },
  {
    id: "getyourguide-nyc",
    partner: "GetYourGuide",
    label: "NYC Tours & Experiences",
    description: "Stadium tours, food walks, and match-day activities across the boroughs.",
    href: "https://www.getyourguide.com/new-york-l59/",
  },
  {
    id: "amtrak",
    partner: "Amtrak",
    label: "Amtrak to NYC",
    description: "Train into Penn Station — easy connection to NJ Transit for MetLife.",
    href: "https://www.amtrak.com/",
  },
];

/** Watchlist / gear */
export const GEAR_AFFILIATE: AffiliateLink = {
  id: "amazon-gear",
  partner: "Amazon",
  label: "Shop Soccer Gear",
  description: "Jerseys, boots, and fan essentials for World Cup season.",
  href: "https://www.amazon.com/s?k=soccer+gear",
};

/** Host cities — travel */
export const HOST_CITY_TRAVEL_AFFILIATES: AffiliateLink[] = [
  {
    id: "expedia-host-cities",
    partner: "Expedia",
    label: "Hotels in Host Cities",
    description: "Flights, hotels & packages for Atlanta, LA, Miami, Mexico City & more.",
    href: "https://www.expedia.com/",
  },
  {
    id: "booking-host-cities",
    partner: "Booking.com",
    label: "Book Host City Stays",
    description: "Compare rates near stadiums across all 16 World Cup venues.",
    href: "https://www.booking.com/",
  },
];
