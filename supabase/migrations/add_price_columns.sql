-- ==========================================
-- MIGRATION: Menambahkan Harga Dasar & Harga Jual
-- ==========================================

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS base_price DECIMAL(15,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS selling_price DECIMAL(15,2) DEFAULT 0;
