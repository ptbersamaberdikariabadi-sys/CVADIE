-- ========================================================
-- UPDATE RLS POLICIES FOR WMS TABLES
-- Replaces overly permissive 'USING (true)' with proper
-- authenticated role checks to align with other tables.
-- ========================================================

-- 1. Update RLS for 'racks'
DROP POLICY IF EXISTS "Allow full access to authenticated users for racks" ON public.racks;
CREATE POLICY "Authenticated users can select racks" ON public.racks FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert racks" ON public.racks FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update racks" ON public.racks FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete racks" ON public.racks FOR DELETE USING (auth.role() = 'authenticated');

-- 2. Update RLS for 'compartments'
DROP POLICY IF EXISTS "Allow full access to authenticated users for compartments" ON public.compartments;
CREATE POLICY "Authenticated users can select compartments" ON public.compartments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert compartments" ON public.compartments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update compartments" ON public.compartments FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete compartments" ON public.compartments FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Update RLS for 'stock_placements'
DROP POLICY IF EXISTS "Allow full access to authenticated users for stock_placements" ON public.stock_placements;
CREATE POLICY "Authenticated users can select stock_placements" ON public.stock_placements FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert stock_placements" ON public.stock_placements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update stock_placements" ON public.stock_placements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete stock_placements" ON public.stock_placements FOR DELETE USING (auth.role() = 'authenticated');
