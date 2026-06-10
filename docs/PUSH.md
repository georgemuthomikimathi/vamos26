# Push to Production — Step by Step

Repo: `georgemuthomikimathi/vamos26` → **vamos26.com**

## Before you push

### 1. Build & preview

```bash
cd /Users/georgekimathi/Projects/vamos26
npm run build
npm run dev
```

Open http://127.0.0.1:3030 — check Live, Stats (portraits), Donate, Contact (masked links).

### 2. Set PayPal (Vercel + optional local)

In **Vercel → Settings → Environment Variables**:

| Variable | Example |
|----------|---------|
| `NEXT_PUBLIC_PAYPAL_EMAIL` | `your-paypal@email.com` |
| `NEXT_PUBLIC_DONATE_URL` | *(optional)* hosted PayPal button URL |

Local testing (`.env.local`):

```env
NEXT_PUBLIC_PAYPAL_EMAIL=axonsovereignllc@gmail.com
```

---

## Push flow

### Step 1 — Confirm branch

```bash
cd /Users/georgekimathi/Projects/vamos26
git branch --show-current
git status
```

Work on `cursor/interactive-ux-donate-paypal-nyc` or merge latest into your branch first.

### Step 2 — Commit (if needed)

```bash
git add -A
git status
git commit -m "feat: stats portraits, live polling, masked contact, PayPal env"
```

### Step 3 — Push feature branch

```bash
git push -u origin cursor/interactive-ux-donate-paypal-nyc
```

### Step 4 — Merge to main

**GitHub PR:**  
https://github.com/georgemuthomikimathi/vamos26/compare/main...cursor/interactive-ux-donate-paypal-nyc

**Or locally:**

```bash
git checkout main
git pull origin main
git merge cursor/interactive-ux-donate-paypal-nyc
git push origin main
```

### Step 5 — Deploy

Vercel auto-deploys when `main` is pushed. Or:

```bash
npx vercel --prod
```

### Step 6 — Post-deploy

- https://vamos26.com — live scores refresh every 30s
- Stats board — player portraits + 60s refresh
- Donate — PayPal with your env email
- Contact — tap channels (phone/email masked in UI)
- Add `NEXT_PUBLIC_PAYPAL_EMAIL` in Vercel if donate links fail

Full checklist: [LAUNCH.md](./LAUNCH.md)
