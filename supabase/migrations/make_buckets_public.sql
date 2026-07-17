-- Jalankan script ini di menu "SQL Editor" pada dashboard Supabase Anda
-- untuk mengubah bucket penyimpanan menjadi publik (bisa diakses tanpa login).

UPDATE storage.buckets
SET public = true
WHERE id IN ('product-images', 'public-assets', 'pdf-datasheets');
