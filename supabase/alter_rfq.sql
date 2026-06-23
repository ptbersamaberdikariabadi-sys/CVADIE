-- Menambahkan kolom urgency dan message ke tabel rfq_requests
ALTER TABLE public.rfq_requests 
ADD COLUMN IF NOT EXISTS urgency TEXT DEFAULT 'Normal',
ADD COLUMN IF NOT EXISTS message TEXT;
