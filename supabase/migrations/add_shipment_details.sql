-- ==========================================
-- MIGRATION: Tambahan Field Surat Jalan
-- ==========================================

-- 1. Tabel shipments
ALTER TABLE public.shipments 
ADD COLUMN IF NOT EXISTS partner_address TEXT,
ADD COLUMN IF NOT EXISTS attention_person TEXT,
ADD COLUMN IF NOT EXISTS driver_name TEXT,
ADD COLUMN IF NOT EXISTS vehicle_number TEXT,
ADD COLUMN IF NOT EXISTS quotation_number TEXT,
ADD COLUMN IF NOT EXISTS po_code TEXT,
ADD COLUMN IF NOT EXISTS po_date TEXT;

-- 2. Tabel shipment_items
ALTER TABLE public.shipment_items
ADD COLUMN IF NOT EXISTS packing_quantity INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS notes TEXT;
