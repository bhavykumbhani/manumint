-- ==============================================================================
-- ManuMaker - Migration 003: Real-Time POS & Kitchen Display System (KDS)
-- Run this in your Supabase Project -> SQL Editor
-- Creates orders and service_requests tables with Realtime publication & RLS
-- ==============================================================================

-- 1. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  order_number SERIAL,
  table_number TEXT NOT NULL DEFAULT 'Takeaway',
  customer_name TEXT,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled'
  payment_status TEXT NOT NULL DEFAULT 'unpaid', -- 'unpaid' | 'paid'
  payment_method TEXT DEFAULT 'cash', -- 'cash' | 'upi' | 'card' | 'pending'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for lightning-fast queries by restaurant and status
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_id ON public.orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- 2. Create Service Requests Table (Waiter call, water, bill)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  request_type TEXT NOT NULL, -- 'waiter' | 'water' | 'bill' | 'cleaning' | 'other'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending' | 'attended'
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_service_requests_restaurant_id ON public.service_requests(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);

-- 3. Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Allow public & customers to place orders and request service
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select orders for restaurant" ON public.orders;
CREATE POLICY "Anyone can select orders for restaurant"
  ON public.orders FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can update orders" ON public.orders;
CREATE POLICY "Anyone can update orders"
  ON public.orders FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Anyone can delete orders" ON public.orders;
CREATE POLICY "Anyone can delete orders"
  ON public.orders FOR DELETE
  USING (true);

-- Service Request Policies
DROP POLICY IF EXISTS "Public can insert service requests" ON public.service_requests;
CREATE POLICY "Public can insert service requests"
  ON public.service_requests FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select service requests" ON public.service_requests;
CREATE POLICY "Anyone can select service requests"
  ON public.service_requests FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can update service requests" ON public.service_requests;
CREATE POLICY "Anyone can update service requests"
  ON public.service_requests FOR UPDATE
  USING (true);

DROP POLICY IF EXISTS "Anyone can delete service requests" ON public.service_requests;
CREATE POLICY "Anyone can delete service requests"
  ON public.service_requests FOR DELETE
  USING (true);

-- 4. Enable Supabase Realtime for instant KDS sync
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END $$;
