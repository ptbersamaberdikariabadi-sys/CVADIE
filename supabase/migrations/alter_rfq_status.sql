-- Menambahkan kolom status untuk fitur CRM State Machine
ALTER TABLE public.rfq_requests 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Baru';
