# VAMOS26 Launch Checklist — vamos26.com

Production repo: `/Users/georgekimathi/Projects/vamos26`  
GitHub: `georgemuthomikimathi/vamos26`

## Current release branch

| Item | Value |
|------|--------|
| Feature branch | `cursor/interactive-ux-donate-paypal-nyc` |
| Base branch | `main` |
| Includes | Interactive UX, PayPal donate, 34 NYC venues, expandable match cards |

---

## Step 1 — Verify locally

```bash
cd /Users/georgekimathi/Projects/vamos26
npm run build
npm run dev
```

Open **http://127.0.0.1:3030** and spot-check:

| Check | What to verify |
|-------|----------------|
| Live scores | WC fixtures show **–** (not 0–0); **Refresh** button works |
| Friendlies | Real results (e.g. USA 2–1 Mexico) |
| Match cards | Tap a card → kickoff, venue, goals expand |
| Stats | Mobile tabs: Goals / Assists / Clean Sheets |
| Donate | Buttons open PayPal for `axonsovereignllc@gmail.com` |
| Discover NYC | Search + filters; **34 venues** |
| Navigation | Quick-nav pills (mobile), bottom bar, back-to-top |
| PWA | DevTools → Application → manifest loads |

---

## Step 2 — Confirm git state

```bash
cd /Users/georgekimathi/Projects/vamos26
git branch --show-current
git status
git log --oneline -3
```

You should be on `cursor/interactive-ux-donate-paypal-nyc` with a **clean** working tree (or commit any doc fixes first).

---

## Step 3 — Push the feature branch

```bash
git push -u origin cursor/interactive-ux-donate-paypal-nyc
```

This uploads your branch to GitHub. It does **not** deploy production yet (Vercel uses `main`).

---

## Step 4 — Merge to `main` (production)

Choose **one** path:

### Option A — Pull request (recommended)

1. Open: https://github.com/georgemuthomikimathi/vamos26/compare/main...cursor/interactive-ux-donate-paypal-nyc
2. Create PR → review → **Merge**
3. On your machine (optional, to sync local `main`):

```bash
git checkout main
git pull origin main
```

### Option B — Merge locally

```bash
git checkout main
git pull origin main
git merge cursor/interactive-ux-donate-paypal-nyc
git push origin main
```

---

## Step 5 — Vercel deploy

If the Vercel project is linked to `georgemuthomikimathi/vamos26` and **Production Branch** = `main`, pushing `main` triggers a deploy automatically.

**Manual deploy (if needed):**

```bash
cd /Users/georgekimathi/Projects/vamos26
git checkout main
npx vercel --prod
```

### Vercel dashboard

1. **Settings → Domains:** `vamos26.com` (primary), `www.vamos26.com` (alias)
2. **Settings → Git:** Production branch = `main`
3. **Settings → Environment Variables** (optional):
   - `NEXT_PUBLIC_DONATE_URL` — override PayPal link if you use a hosted button
4. Wait for build → open production URL

---

## Step 6 — PayPal (before promoting donate)

Account: **axonsovereignllc@gmail.com**

1. Log in at [paypal.com](https://www.paypal.com)
2. Confirm the account can **receive** payments
3. Optional: create a hosted Donate button → set `NEXT_PUBLIC_DONATE_URL` in Vercel
4. After deploy, test a small donation from the live site

Config: `src/lib/donate.ts` → `paypalDonateUrl()` ($5 / $15 / $50 tiers).

---

## Step 7 — Post-deploy smoke test

```bash
curl -s "https://vamos26.com/api/live?competition=world-cup" | head -c 400
curl -s "https://vamos26.com/api/live?competition=friendly" | head -c 400
```

Browser:

- [https://vamos26.com](https://vamos26.com)
- [https://www.vamos26.com](https://www.vamos26.com) → redirects to apex
- Donate → PayPal
- Discover NYC → search + filters

---

## Printify & Printful (beta only — optional)

Merch shop is in **vamos26-beta** (`DropshipSection`), not production yet.

| Service | Setup |
|---------|--------|
| [Printify](https://printify.com) | API token → `PRINTIFY_API_KEY` in Vercel when integrated |
| [Printful](https://printful.com) | API key → `PRINTFUL_API_KEY` in Vercel when integrated |

To add shop to vamos26.com later: port `DropshipSection`, `TeePreview`, `dropship.ts`, and `public/images/tees/` from beta.

---

## Rollback

Vercel → **Deployments** → previous successful deployment → **Promote to Production**.

---

## Quick reference (copy-paste)

```bash
# Full push flow
cd /Users/georgekimathi/Projects/vamos26
npm run build
git push -u origin cursor/interactive-ux-donate-paypal-nyc
git checkout main && git pull origin main
git merge cursor/interactive-ux-donate-paypal-nyc
git push origin main
```
