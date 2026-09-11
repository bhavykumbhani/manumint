# MenuMint — Beautiful Digital Menus. One QR.

**MenuMint** is a production-quality SaaS application designed for restaurants, cafés, bakeries, food trucks, and cloud kitchens. It enables hospitality owners to create an account, build their digital menu with Indian Rupee (₹) pricing, official FSSAI Veg / Non-Veg / Egg indicators, choose from 4 designer templates with animations, and generate permanent table QR codes.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

---

## ⚡ Deploy to Vercel (1-Click Ready)

MenuMint is pre-configured with `vercel.json`, optimized security headers, and remote image domain configurations.

### Option A: Via Vercel Dashboard (Recommended)

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Set the **Framework Preset** to `Next.js` (auto-detected).
5. In **Environment Variables**, add:
   - `NEXT_PUBLIC_APP_URL`: Your Vercel production domain (e.g. `https://your-menumint.vercel.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`: *(Optional)* Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: *(Optional)* Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Optional)* Your Supabase service role secret
6. Click **Deploy**. Vercel will build and deploy the project in under 2 minutes!

### Option B: Via Vercel CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Log in and deploy
vercel

# 3. Deploy to production
vercel --prod
```

---

## 🗄️ Database & Supabase Setup (Optional Cloud Sync)

MenuMint runs immediately out-of-the-box with local browser state persistence and tenant isolation. To connect to live Supabase PostgreSQL:

1. Create a project on [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run `supabase/migrations/001_initial_schema.sql`.
3. (Optional) Run `supabase/seed.sql` to populate initial demo data for "Cafe Aroma".
4. Copy your project URL and keys to `.env.local` or your Vercel project settings.

---

## 🧪 Build & Lint Checks

```bash
# Run ESLint
npm run lint

# Run Next.js production build
npm run build
```
