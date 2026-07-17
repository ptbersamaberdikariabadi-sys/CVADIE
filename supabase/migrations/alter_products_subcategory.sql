-- Menambahkan kolom sub_category ke tabel products
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS sub_category TEXT;
