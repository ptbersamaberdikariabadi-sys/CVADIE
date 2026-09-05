-- ==========================================
-- MIGRATION: Menambahkan Kolom Transaksi Part di stock_movements
-- ==========================================

ALTER TABLE public.stock_movements
ADD COLUMN IF NOT EXISTS transaction_category TEXT,
ADD COLUMN IF NOT EXISTS sender TEXT,
ADD COLUMN IF NOT EXISTS receiver TEXT,
ADD COLUMN IF NOT EXISTS price NUMERIC(15, 2),
ADD COLUMN IF NOT EXISTS transaction_date DATE;
