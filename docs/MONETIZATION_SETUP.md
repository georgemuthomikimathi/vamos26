# VAMOS26 Monetization Setup

Step-by-step checklist for AdSense, Analytics, newsletter, and affiliates.

---

## 1. Google AdSense (verify + ad units)

### Verify site
1. Go to [adsense.google.com](https://adsense.google.com) → **Sites**
2. Add **`www.vamos26.com`** (apex redirects here)
3. Choose **Meta tag** verification — already live in site `<head>`
4. Click **Verify** (retry after 10 min if needed)

### Create ad units
1. **Ads** → **By ad unit** → **Display ads** → **New**
2. Create two units:
   - **Homepage inline** (responsive)
   - **Homepage sidebar** (responsive)
3. Copy each **data-ad-slot** number

### Add to Vercel
1. [vercel.com](https://vercel.com) → your `vamos26` project → **Settings** → **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_ADSENSE_SLOT_INLINE` = your inline slot ID
   - `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR` = your sidebar slot ID
3. **Redeploy** production

---

## 2. Google Analytics (GA4)

1. [analytics.google.com](https://analytics.google.com) → **Admin** → **Create property** → name: `VAMOS26`
2. **Data streams** → **Web** → URL: `https://www.vamos26.com`
3. Copy **Measurement ID** (`G-XXXXXXXXXX`)

### Add to Vercel
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
- Redeploy

Analytics loads only after users **Accept** cookies (same as AdSense).

---

## 3. Newsletter (Mailchimp — recommended)

### Mailchimp setup
1. [mailchimp.com](https://mailchimp.com) → free plan is fine to start
2. **Audience** → create list "VAMOS26 WC26 Alerts"
3. **Audience** → **Settings** → **Audience name and defaults** → copy **Audience ID**
4. **Profile** → **Extras** → **API keys** → Create key

### Add to Vercel (server-side — no NEXT_PUBLIC prefix)
```
NEWSLETTER_PROVIDER=mailchimp
MAILCHIMP_API_KEY=xxxxxxxx-us1
MAILCHIMP_AUDIENCE_ID=xxxxxxxx
```
Redeploy. Test signup on homepage.

### ConvertKit alternative
```
NEWSLETTER_PROVIDER=convertkit
CONVERTKIT_API_KEY=your_key
CONVERTKIT_FORM_ID=your_form_id
```

---

## 4. Affiliate programs

Sign up, get tracked links, paste into Vercel as `NEXT_PUBLIC_AFFILIATE_*` vars.

| Partner | Sign up | Env var |
|---------|---------|---------|
| Fubo | [fubo.tv/affiliates](https://www.fubo.tv/affiliates) | `NEXT_PUBLIC_AFFILIATE_FUBO_URL` |
| Peacock | NBCUniversal partners | `NEXT_PUBLIC_AFFILIATE_PEACOCK_URL` |
| Booking.com | [booking.com/affiliate](https://www.booking.com/affiliate) | `NEXT_PUBLIC_AFFILIATE_BOOKING_URL` |
| Amazon Associates | [affiliate-program.amazon.com](https://affiliate-program.amazon.com) | `NEXT_PUBLIC_AFFILIATE_AMAZON_URL` |
| GetYourGuide | [partner.getyourguide.com](https://partner.getyourguide.com) | `NEXT_PUBLIC_AFFILIATE_GETYOURGUIDE_URL` |
| Expedia Group | [expediagroup.com/affiliate](https://www.expediagroup.com/affiliate) | `NEXT_PUBLIC_AFFILIATE_EXPEDIA_URL` |

Redeploy after adding URLs. Links show on How to Watch, NYC Guide, Stadiums, Watchlist.

---

## 5. Deploy env vars

```bash
cd ~/Projects/vamos26
git add -A && git commit -m "feat: GA4, newsletter API, env-based ads and affiliates"
git push origin main
```

Or set vars in Vercel dashboard → **Deployments** → **Redeploy**.

---

## Quick test checklist

- [ ] https://www.vamos26.com loads
- [ ] Cookie banner → Accept → ads may appear (after slot IDs set)
- [ ] GA4 **Realtime** shows your visit (after GA ID set)
- [ ] Newsletter signup returns success (after Mailchimp set)
- [ ] Affiliate links open correct tracked URLs
