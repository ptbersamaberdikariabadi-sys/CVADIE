-- Hapus tabel todos yang tidak digunakan (sisa dari project template)
DROP TABLE IF EXISTS public.todos CASCADE;

-- M9: Tambahkan missing RLS policies untuk tabel RFQ

-- ==== rfq_requests ====

-- Admin dapat melihat semua RFQ
CREATE POLICY "Admin dapat melihat semua RFQ"
ON public.rfq_requests
FOR SELECT
TO authenticated
USING (true);

-- Admin dapat memperbarui status RFQ
CREATE POLICY "Admin dapat mengupdate RFQ"
ON public.rfq_requests
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Admin dapat menghapus RFQ
CREATE POLICY "Admin dapat menghapus RFQ"
ON public.rfq_requests
FOR DELETE
TO authenticated
USING (true);

-- ==== rfq_items ====

-- Admin dapat melihat semua item RFQ
CREATE POLICY "Admin dapat melihat semua RFQ items"
ON public.rfq_items
FOR SELECT
TO authenticated
USING (true);

-- Admin dapat mengupdate item RFQ
CREATE POLICY "Admin dapat mengupdate RFQ items"
ON public.rfq_items
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Admin dapat menghapus item RFQ
CREATE POLICY "Admin dapat menghapus RFQ items"
ON public.rfq_items
FOR DELETE
TO authenticated
USING (true);
