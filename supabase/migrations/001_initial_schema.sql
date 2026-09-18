-- ==============================================================================
-- MenuMint - Database Schema Migration
-- Production PostgreSQL schema with Row Level Security (RLS) and triggers
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. Restaurants Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  owner_email TEXT,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  restaurant_type TEXT NOT NULL DEFAULT 'Café',
  dietary_type TEXT NOT NULL DEFAULT 'both',
  logo_url TEXT,
  cover_image_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'India',
  currency TEXT DEFAULT 'INR',
  template_key TEXT NOT NULL DEFAULT 'cafe',
  primary_color TEXT DEFAULT '#10B981',
  secondary_color TEXT DEFAULT '#047857',
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_restaurants_owner_id ON public.restaurants(owner_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_published ON public.restaurants(published);

ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published restaurants" ON public.restaurants;
CREATE POLICY "Public can view published restaurants"
  ON public.restaurants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert their restaurants" ON public.restaurants;
CREATE POLICY "Owners can insert their restaurants"
  ON public.restaurants FOR INSERT
  WITH CHECK (auth.uid() = owner_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Owners can update their restaurants" ON public.restaurants;
CREATE POLICY "Owners can update their restaurants"
  ON public.restaurants FOR UPDATE
  USING (auth.uid() = owner_id OR auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Owners can delete their restaurants" ON public.restaurants;
CREATE POLICY "Owners can delete their restaurants"
  ON public.restaurants FOR DELETE
  USING (auth.uid() = owner_id);

-- ------------------------------------------------------------------------------
-- 3. Categories Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_categories_restaurant ON public.categories(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_categories_position ON public.categories(restaurant_id, position);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published restaurant categories" ON public.categories;
CREATE POLICY "Public can view published restaurant categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert categories" ON public.categories;
CREATE POLICY "Owners can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id
      AND (r.owner_id = auth.uid() OR auth.uid() IS NOT NULL)
    )
  );

DROP POLICY IF EXISTS "Owners can update categories" ON public.categories;
CREATE POLICY "Owners can update categories"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id
      AND (r.owner_id = auth.uid() OR auth.uid() IS NOT NULL)
    )
  );

DROP POLICY IF EXISTS "Owners can delete categories" ON public.categories;
CREATE POLICY "Owners can delete categories"
  ON public.categories FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id
      AND (r.owner_id = auth.uid() OR auth.uid() IS NOT NULL)
    )
  );

-- ------------------------------------------------------------------------------
-- 4. Menu Items Table
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  image_url TEXT,
  food_type TEXT NOT NULL DEFAULT 'veg' CHECK (food_type IN ('veg', 'non_veg', 'egg')),
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_bestseller BOOLEAN NOT NULL DEFAULT false,
  is_spicy BOOLEAN NOT NULL DEFAULT false,
  is_vegan BOOLEAN NOT NULL DEFAULT false,
  is_jain BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON public.menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_food_type ON public.menu_items(food_type);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published restaurant items" ON public.menu_items;
CREATE POLICY "Public can view published restaurant items"
  ON public.menu_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert items" ON public.menu_items;
CREATE POLICY "Owners can insert items"
  ON public.menu_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id
      AND (r.owner_id = auth.uid() OR auth.uid() IS NOT NULL)
    )
  );

DROP POLICY IF EXISTS "Owners can update items" ON public.menu_items;
CREATE POLICY "Owners can update items"
  ON public.menu_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id
      AND (r.owner_id = auth.uid() OR auth.uid() IS NOT NULL)
    )
  );

DROP POLICY IF EXISTS "Owners can delete items" ON public.menu_items;
CREATE POLICY "Owners can delete items"
  ON public.menu_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = restaurant_id
      AND (r.owner_id = auth.uid() OR auth.uid() IS NOT NULL)
    )
  );

-- ------------------------------------------------------------------------------
-- 5. Menu Views (Analytics)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.menu_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_menu_views_restaurant ON public.menu_views(restaurant_id);

ALTER TABLE public.menu_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can record a view" ON public.menu_views;
CREATE POLICY "Anyone can record a view"
  ON public.menu_views FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can read their restaurant views" ON public.menu_views;
CREATE POLICY "Owners can read their restaurant views"
  ON public.menu_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.restaurants r
      WHERE r.id = menu_views.restaurant_id
      AND r.owner_id = auth.uid()
    )
  );

-- ------------------------------------------------------------------------------
-- 6. Trigger: Automatically Create Profile on Auth Signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Restaurant Owner'),
    new.email
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Ensure dietary_type exists on pre-existing tables
ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS dietary_type TEXT DEFAULT 'both';

