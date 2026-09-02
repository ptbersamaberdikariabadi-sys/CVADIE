-- DDL for Warehouse Management System (Phase 2)
-- Table: stock_placements
CREATE TABLE IF NOT EXISTS public.stock_placements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    compartment_id UUID NOT NULL REFERENCES public.compartments(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(product_id, compartment_id)
);

-- Trigger to update 'updated_at'
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_stock_placements_updated_at ON public.stock_placements;
CREATE TRIGGER set_stock_placements_updated_at
BEFORE UPDATE ON public.stock_placements
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Enable RLS for stock_placements
ALTER TABLE public.stock_placements ENABLE ROW LEVEL SECURITY;

-- Policies for stock_placements
CREATE POLICY "Allow full access to authenticated users for stock_placements"
    ON public.stock_placements
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
