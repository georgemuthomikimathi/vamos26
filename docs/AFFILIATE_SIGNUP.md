# VAMOS26 Affiliate Signup Guide

Sign up for each program, get your tracked link, then paste into **Vercel → Environment Variables**.

---

## Streaming (highest priority)

| Partner | Sign up | Vercel env var |
|---------|---------|----------------|
| **Fubo** | https://www.fubo.tv/affiliates | `NEXT_PUBLIC_AFFILIATE_FUBO_URL` |
| **Peacock** | NBCUniversal / Impact Radius partners | `NEXT_PUBLIC_AFFILIATE_PEACOCK_URL` |
| **YouTube TV** | Google Affiliate Network / CJ | `NEXT_PUBLIC_AFFILIATE_YOUTUBE_TV_URL` |
| **Sling TV** | https://www.sling.com/affiliates | `NEXT_PUBLIC_AFFILIATE_SLING_URL` |
| Fox Sports | Direct partner or streaming bundle links | `NEXT_PUBLIC_AFFILIATE_FOX_URL` |
| Telemundo | NBCU partners | `NEXT_PUBLIC_AFFILIATE_TELEMUNDO_URL` |

## Travel & NYC

| Partner | Sign up | Vercel env var |
|---------|---------|----------------|
| **Booking.com** | https://www.booking.com/affiliate | `NEXT_PUBLIC_AFFILIATE_BOOKING_URL` / `_NYC_URL` |
| **Expedia Group** | https://www.expediagroup.com/affiliate | `NEXT_PUBLIC_AFFILIATE_EXPEDIA_URL` |
| **Kayak** | https://www.kayak.com/affiliates | `NEXT_PUBLIC_AFFILIATE_KAYAK_URL` |
| **Hotels.com** | Expedia Group affiliate | `NEXT_PUBLIC_AFFILIATE_HOTELS_URL` |
| **Airbnb** | https://www.airbnb.com/affiliates | `NEXT_PUBLIC_AFFILIATE_AIRBNB_NYC_URL` |
| **GetYourGuide** | https://partner.getyourguide.com | `NEXT_PUBLIC_AFFILIATE_GETYOURGUIDE_URL` |
| **Viator** | https://www.viator.com/affiliates | `NEXT_PUBLIC_AFFILIATE_VIATOR_URL` |
| Amtrak | Amtrak guest referral / partner programs | `NEXT_PUBLIC_AFFILIATE_AMTRAK_URL` |
| Uber | https://www.uber.com/us/en/drive/affiliate | `NEXT_PUBLIC_AFFILIATE_UBER_URL` |
| NJ Transit | Use official site (often non-affiliate) | `NEXT_PUBLIC_AFFILIATE_NJ_TRANSIT_URL` |

## Gear & jerseys

| Partner | Sign up | Vercel env var |
|---------|---------|----------------|
| **Amazon Associates** | https://affiliate-program.amazon.com | `NEXT_PUBLIC_AFFILIATE_AMAZON_URL` |
| **Fanatics** | https://www.fanatics.com/affiliates | `NEXT_PUBLIC_AFFILIATE_FANATICS_URL` |
| Soccer.com | Soccer.com affiliate program | `NEXT_PUBLIC_AFFILIATE_SOCCER_COM_URL` |

## Tickets

| Partner | Sign up | Vercel env var |
|---------|---------|----------------|
| **StubHub** | StubHub affiliate / partner program | `NEXT_PUBLIC_AFFILIATE_STUBHUB_URL` |
| **SeatGeek** | SeatGeek partner program | `NEXT_PUBLIC_AFFILIATE_SEATGEEK_URL` |
| FIFA | Official tournament site | `NEXT_PUBLIC_AFFILIATE_FIFA_TICKETS_URL` |

## VPN (traveling fans)

| Partner | Sign up | Vercel env var |
|---------|---------|----------------|
| **NordVPN** | https://nordvpn.com/affiliate | `NEXT_PUBLIC_AFFILIATE_NORDVPN_URL` |
| ExpressVPN | https://www.expressvpn.com/affiliates | `NEXT_PUBLIC_AFFILIATE_EXPRESSVPN_URL` |

---

## After signup

1. Vercel → **vamos26** → **Settings** → **Environment Variables**
2. Add each `NEXT_PUBLIC_AFFILIATE_*` with your full tracked URL
3. **Redeploy** production
4. Click links on `/guides/how-to-watch` to verify tracking params appear

## Recommended order

1. Fubo (streaming)  
2. Amazon Associates (gear)  
3. Booking.com (NYC + host cities)  
4. Fanatics (jerseys)  
5. NordVPN (guide page)  
6. StubHub (tickets)  
