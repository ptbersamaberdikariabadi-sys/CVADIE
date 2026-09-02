-- ==========================================
-- MIGRATION: Mengaktifkan RLS untuk Tabel Gudang
-- ==========================================

-- 1. Tabel Racks
ALTER TABLE IF EXISTS public.racks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auth users can manage racks" ON public.racks;
CREATE POLICY "Auth users can manage racks"
    ON public.racks
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 2. Tabel Compartments
ALTER TABLE IF EXISTS public.compartments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auth users can manage compartments" ON public.compartments;
CREATE POLICY "Auth users can manage compartments"
    ON public.compartments
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 3. Tabel Stock Placements
ALTER TABLE IF EXISTS public.stock_placements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Auth users can manage stock placements" ON public.stock_placements;
CREATE POLICY "Auth users can manage stock placements"
    ON public.stock_placements
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
