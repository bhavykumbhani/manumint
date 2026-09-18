# ManuMaker — Beautiful Digital Menus. One QR.

**ManuMaker** is an enterprise-grade digital restaurant menu and QR management SaaS tailored for hospitality businesses across India and internationally. It empowers restaurants, cafés, cloud kitchens, and food trucks to launch contactless digital menus with instant Indian Rupee (₹) pricing, official FSSAI dietary badges (Veg, Non-Veg, Egg, Jain, Vegan), 4 designer themes, real-time item availability toggles, and permanent table QR codes.

---

## 🚀 Features at a Glance

- **Custom Brand Identity**: Vector-crafted modern ManuMaker logo with cloche & QR geometry.
- **Enterprise SEO & Structured Data**: Built-in dynamic `sitemap.xml`, `robots.txt`, Schema.org JSON-LD structured data (`SoftwareApplication`, `Product`, `Restaurant`, `Menu`).
- **Meta Ads Integration**: Plug-and-play Facebook Pixel event tracking for `PageView`, `CompleteRegistration`, `InitiateCheckout`, and `Lead` conversions.
- **Official FSSAI Dietary Standards**: Green circle for Pure Veg, Red/Crimson triangle for Non-Veg, Yellow dot for Egg, plus Jain and Vegan tags.
- **4 Designer Responsive Themes**:
  - *Artisanal Café*: Warm amber & cream tones with photo cards.
  - *Clean Minimalist*: Crisp editorial layout with structured dividers.
  - *Modern Dark*: Rich charcoal with emerald glow for bars & lounges.
  - *Fine Dining*: High-end serif typography with dot-leader spacing.
- **Permanent Table QR Codes**: Update dishes and prices anytime without ever reprinting physical standees.

---

## 🛠️ Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open http://localhost:3000 in your browser
```

---

## 🌐 Production Live Launch Guide

### 1. Custom Domain & DNS
1. Purchase your domain (e.g. `manumaker.in` or `manumaker.com`) on GoDaddy, Namecheap, or Cloudflare.
2. In Vercel Project Settings ➔ **Domains**, add your custom domain.
3. In your DNS provider, set:
   - **A Record**: `@` pointing to `76.76.21.21`
   - **CNAME Record**: `www` pointing to `cname.vercel-dns.com`

### 2. Vercel 1-Click Deployment
1. Push your repository to GitHub / GitLab.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Configure the following **Environment Variables**:
   - `NEXT_PUBLIC_APP_URL`: Your live domain (e.g. `https://manumaker.in`)
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Public Key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Secret
   - `NEXT_PUBLIC_META_PIXEL_ID`: Your Facebook Pixel ID from Meta Events Manager
   - `NEXT_PUBLIC_FACEBOOK_DOMAIN_VERIFICATION`: Your domain verification meta tag content
4. Click **Deploy**.

### 3. Supabase Cloud Database Setup
To allow public visitors and dining customers to view published menus across devices:
1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the SQL migration in `supabase/migrations/001_initial_schema.sql`.
4. (Optional) Run `supabase/seed.sql` to populate sample menu data.

### 4. Meta Ads (Facebook Pixel & Conversion Tracking)
1. Go to **Meta Business Suite ➔ Events Manager** ([business.facebook.com](https://business.facebook.com)).
2. Create a new **Dataset / Pixel** and copy the numeric ID (e.g. `123456789012345`).
3. Set `NEXT_PUBLIC_META_PIXEL_ID` in your Vercel production settings.
4. Verify domain ownership in **Meta Business Settings ➔ Brand Safety ➔ Domains** using the meta-tag method.

---

## 🧪 Build & Lint Checks

```bash
# Run ESLint
npm run lint

# Run Next.js production build
npm run build
```
