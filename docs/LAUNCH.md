# VAMOS26 Launch Checklist — vamos26.com

Final launch guide for production (`/Users/georgekimathi/Projects/vamos26`).

## Pre-push verification

```bash
cd /Users/georgekimathi/Projects/vamos26
npm run build
npm run dev   # http://127.0.0.1:3030 — spot-check sections
```

| Check | URL / action |
|-------|----------------|
| Live scores (nil-nil) | `/api/live?competition=world-cup` → `liveCount: 0`, null scores |
| Friendlies | `/api/live?competition=friendly` → finished results |
| Donate → PayPal | Click tier buttons → PayPal opens for `axonsovereignllc@gmail.com` |
| NYC guide | Discover section — 30+ venues, filter by Bar / Restaurant / Fan Zone / Viewing Party |
| Mobile nav | Bottom bar: Live, Stats, Donate, NYC |
| PWA | DevTools → Application → Manifest loads |
| www redirect | `next.config.ts` redirects www → apex |

## Git push (production)

```bash
cd /Users/georgekimathi/Projects/vamos26

git add -A
git status   # review before commit

git commit -m "$(cat <<'EOF'
feat: launch-ready — PayPal donate, expanded NYC guide, live scores app shell

Wire PayPal donations, replace watchlist with donate section, add restaurants
and watch parties to NYC discover guide, and ship PWA manifest with score APIs.
EOF
)"

git push origin main
```

## Vercel deploy

**Auto:** Push to `main` triggers deploy if the Vercel project is linked to `georgemuthomikimathi/vamos26`.

**Manual:**
```bash
cd /Users/georgekimathi/Projects/vamos26
npx vercel --prod
```

### Vercel dashboard

1. **Settings → Domains:** `vamos26.com` (primary), `www.vamos26.com` (alias)
2. **Settings → Environment Variables** (optional):
   - `NEXT_PUBLIC_DONATE_URL` — override PayPal link if you create a hosted button
3. Confirm **Production Branch** = `main`
4. Wait for build → **Visit** production URL

## PayPal setup

Donations use: **axonsovereignllc@gmail.com**

1. Log in at [paypal.com](https://www.paypal.com)
2. **Settings → Business tools → PayPal buttons** → create a Donate button (optional — site uses direct donate URLs)
3. Confirm your account can receive payments
4. Test a $1 donation from the live site after deploy

Code: `src/lib/donate.ts` — `paypalDonateUrl()` builds tier links ($5 / $15 / $50).

## Printify & Printful (beta shop — optional)

The tee shop lives in **vamos26-beta** (`DropshipSection`). To go live with merch:

### Printify
1. Create account at [printify.com](https://printify.com)
2. Connect store (Shopify, Etsy, or API)
3. Copy API token → store in Vercel env as `PRINTIFY_API_TOKEN` (when API integration is wired)
4. Link product IDs in `src/lib/dropship.ts`

### Printful
1. Create account at [printful.com](https://printful.com)
2. Dashboard → **Stores** → connect or use API
3. API key → `PRINTFUL_API_KEY` in Vercel (when integrated)
4. Map sync products to tee SKUs in dropship config

### To add shop to production later
Port `DropshipSection`, `TeePreview`, `dropship.ts`, and `public/images/tees/` from beta, add Shop to navbar, and connect checkout (Shopify Buy Button, Stripe, or Printify embedded store).

## Post-deploy smoke test

```bash
curl -s "https://vamos26.com/api/live?competition=world-cup" | python3 -m json.tool | head -20
curl -s "https://vamos26.com/api/live?competition=friendly" | python3 -m json.tool | head -20
```

Browser:
- [https://vamos26.com](https://vamos26.com)
- [https://www.vamos26.com](https://www.vamos26.com) → should redirect to apex
- Donate section → PayPal
- Discover NYC → 30+ venues with filters

## Rollback

Vercel → **Deployments** → previous successful deployment → **Promote to Production**.
