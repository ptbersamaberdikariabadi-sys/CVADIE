-- ==========================================
-- MIGRATION: Menambahkan Tabel Riwayat Mutasi Stok
-- ==========================================

DO $$ BEGIN
    CREATE TYPE movement_type AS ENUM ('IN', 'OUT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    compartment_id UUID REFERENCES public.compartments(id) ON DELETE SET NULL,
    type movement_type NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    reference_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Policies (Admin only, standard allow all for authenticated)
CREATE POLICY "Allow full access to authenticated users for stock_movements"
    ON public.stock_movements
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
