# Push to Production — Step by Step

Repo: `georgemuthomikimathi/vamos26` → deploys to **vamos26.com**

## 1. Build

```bash
cd /Users/georgekimathi/Projects/vamos26
npm run build
```

## 2. Push feature branch

```bash
git checkout cursor/interactive-ux-donate-paypal-nyc
git push -u origin cursor/interactive-ux-donate-paypal-nyc
```

## 3. Merge to main

**GitHub PR (recommended):**  
https://github.com/georgemuthomikimathi/vamos26/compare/main...cursor/interactive-ux-donate-paypal-nyc

**Or locally:**

```bash
git checkout main
git pull origin main
git merge cursor/interactive-ux-donate-paypal-nyc
git push origin main
```

## 4. Deploy

Vercel auto-deploys on push to `main`. Or:

```bash
npx vercel --prod
```

## 5. Verify

- https://vamos26.com
- Donate → PayPal (`axonsovereignllc@gmail.com`)
- Tap a match card → details expand
- Discover NYC → search venues

Full checklist: [LAUNCH.md](./LAUNCH.md)
