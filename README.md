
# BookNest Client (React + Vite)

## Deploying to Vercel

1. **Set up environment variable:**
	- In the Vercel dashboard, add `VITE_API_BASE_URL` with value `https://booknest-fusx.onrender.com` (or your backend URL).
2. **Build output:**
	- Vercel auto-detects Vite. No config needed, but `vercel.json` is included for API proxying and SPA routing.
3. **API requests:**
	- All `/api/*` requests are proxied to your backend (see `vercel.json`).
4. **.env setup:**
	- Copy `.env.example` to `.env` for local dev.

## Local development

```bash
cp .env.example .env
npm install
npm run dev
```

## Build for production

```bash
npm run build
# Preview locally
npm run preview
```

---

## Vite/React info (original template)
...existing code...
