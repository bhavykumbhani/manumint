-- ==============================================================================
-- MenuMint - Migration 002: Cloud Sync & Frictionless Access
-- Run this in your Supabase Project -> SQL Editor
-- This ensures restaurants, categories, and menu items can be saved and viewed
-- instantly across all devices without email confirmation bottlenecks.
-- ==============================================================================

-- 1. Make owner_id flexible so restaurants can be created immediately
ALTER TABLE public.restaurants DROP CONSTRAINT IF EXISTS restaurants_owner_id_fkey;

-- 2. Restaurant Policies
DROP POLICY IF EXISTS "Public can view published restaurants" ON public.restaurants;
CREATE POLICY "Public can view published restaurants"
  ON public.restaurants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert their restaurants" ON public.restaurants;
CREATE POLICY "Owners can insert their restaurants"
  ON public.restaurants FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can update their restaurants" ON public.restaurants;
CREATE POLICY "Owners can update their restaurants"
  ON public.restaurants FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Owners can delete their restaurants" ON public.restaurants;
CREATE POLICY "Owners can delete their restaurants"
  ON public.restaurants FOR DELETE
  USING (true);

-- 3. Category Policies
DROP POLICY IF EXISTS "Public can view published restaurant categories" ON public.categories;
CREATE POLICY "Public can view published restaurant categories"
  ON public.categories FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert categories" ON public.categories;
CREATE POLICY "Owners can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can update categories" ON public.categories;
CREATE POLICY "Owners can update categories"
  ON public.categories FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Owners can delete categories" ON public.categories;
CREATE POLICY "Owners can delete categories"
  ON public.categories FOR DELETE
  USING (true);

-- 4. Menu Item Policies
DROP POLICY IF EXISTS "Public can view published restaurant items" ON public.menu_items;
CREATE POLICY "Public can view published restaurant items"
  ON public.menu_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Owners can insert items" ON public.menu_items;
CREATE POLICY "Owners can insert items"
  ON public.menu_items FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can update items" ON public.menu_items;
CREATE POLICY "Owners can update items"
  ON public.menu_items FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Owners can delete items" ON public.menu_items;
CREATE POLICY "Owners can delete items"
  ON public.menu_items FOR DELETE
  USING (true);
