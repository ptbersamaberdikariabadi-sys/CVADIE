-- ==========================================
-- CV. ADIE - SUPABASE INITIAL SCHEMA
-- Fase 2: Arsitektur Database & CMS
-- ==========================================



-- 2. Tabel Produk (products)
-- Menyimpan katalog suku cadang B2B
CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    part_number TEXT NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    technical_specs JSONB DEFAULT '{}'::jsonb,
    image_url TEXT,
    pdf_datasheet_url TEXT,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view products" ON public.products FOR SELECT USING (true);


-- 3. Enum untuk Status RFQ (State Machine)
CREATE TYPE rfq_status AS ENUM ('RFQ_RECEIVED', 'QUOTATION_SENT', 'PO_RECEIVED', 'DELIVERY_ORDER', 'INVOICED');

-- 4. Tabel Permintaan RFQ (rfq_requests)
-- Mencatat lead document B2B
CREATE TABLE IF NOT EXISTS public.rfq_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    status rfq_status DEFAULT 'RFQ_RECEIVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.rfq_requests ENABLE ROW LEVEL SECURITY;
-- Kebijakan RLS: Hanya user yang terautentikasi (Admin) yang bisa melihat data RFQ
CREATE POLICY "Authenticated users can view RFQs" ON public.rfq_requests FOR SELECT USING (auth.role() = 'authenticated');
-- Publik bisa menambahkan (INSERT) data RFQ baru
CREATE POLICY "Public can insert RFQs" ON public.rfq_requests FOR INSERT WITH CHECK (true);


-- 5. Tabel Item RFQ (rfq_items)
CREATE TABLE IF NOT EXISTS public.rfq_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rfq_id UUID REFERENCES public.rfq_requests(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.rfq_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view RFQ items" ON public.rfq_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Public can insert RFQ items" ON public.rfq_items FOR INSERT WITH CHECK (true);


