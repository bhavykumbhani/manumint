-- ==============================================================================
-- ManuMaker - Migration 004: Ensure owner_email Column Exists
-- Run this in your Supabase Project -> SQL Editor
-- This adds the missing owner_email column to the restaurants table
-- and creates an index so email-based restaurant matching is instant.
-- ==============================================================================

ALTER TABLE public.restaurants ADD COLUMN IF NOT EXISTS owner_email TEXT;
CREATE INDEX IF NOT EXISTS idx_restaurants_owner_email ON public.restaurants(owner_email);
