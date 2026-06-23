-- ========================================================
-- KEBIJAKAN RLS (Row Level Security) FASE 7
-- Mengizinkan admin mengubah tabel produk dan unggah berkas
-- ========================================================

-- 1. Izin Modifikasi Tabel Produk (CRUD)
CREATE POLICY "Authenticated users can insert products" ON public.products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update products" ON public.products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete products" ON public.products FOR DELETE USING (auth.role() = 'authenticated');

-- 2. Izin Penyimpanan (Storage Buckets)
-- Pastikan bucket sudah ada sebelumnya. Jika belum, kita insert.
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('pdf-datasheets', 'pdf-datasheets', true) ON CONFLICT (id) DO NOTHING;

-- Kebijakan Storage: Publik bisa melihat (SELECT/Download)
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public can view pdf datasheets" ON storage.objects FOR SELECT USING (bucket_id = 'pdf-datasheets');

-- Kebijakan Storage: Admin (Authenticated) bisa mengunggah (INSERT) dan menghapus (DELETE)
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload pdf datasheets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pdf-datasheets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete pdf datasheets" ON storage.objects FOR DELETE USING (bucket_id = 'pdf-datasheets' AND auth.role() = 'authenticated');
