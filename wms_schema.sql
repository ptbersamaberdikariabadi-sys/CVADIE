-- DDL for Warehouse Management System (Phase 1)
-- Table: racks
CREATE TABLE IF NOT EXISTS public.racks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for racks
ALTER TABLE public.racks ENABLE ROW LEVEL SECURITY;

-- Policies for racks (allow authenticated users full access for admin)
CREATE POLICY "Allow full access to authenticated users for racks"
    ON public.racks
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Table: compartments
CREATE TABLE IF NOT EXISTS public.compartments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rack_id UUID NOT NULL REFERENCES public.racks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    max_capacity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for compartments
ALTER TABLE public.compartments ENABLE ROW LEVEL SECURITY;

-- Policies for compartments
CREATE POLICY "Allow full access to authenticated users for compartments"
    ON public.compartments
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
