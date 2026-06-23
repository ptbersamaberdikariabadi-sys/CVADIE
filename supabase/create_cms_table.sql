-- ========================================================
-- KEBIJAKAN & TABEL CMS FASE 8
-- Mengizinkan admin mengubah konten homepage publik
-- ========================================================

-- 1. Membuat Tabel CMS Content
CREATE TABLE IF NOT EXISTS public.cms_content (
    section_key TEXT PRIMARY KEY,
    content_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;

-- 2. Kebijakan Keamanan (RLS)
CREATE POLICY "Public can view cms content" ON public.cms_content FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update cms content" ON public.cms_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert cms content" ON public.cms_content FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Membuat Bucket Storage untuk Aset Publik
INSERT INTO storage.buckets (id, name, public) VALUES ('public-assets', 'public-assets', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public can view public-assets" ON storage.objects FOR SELECT USING (bucket_id = 'public-assets');
CREATE POLICY "Authenticated users can upload public-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'public-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update public-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'public-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete public-assets" ON storage.objects FOR DELETE USING (bucket_id = 'public-assets' AND auth.role() = 'authenticated');

-- 4. Seeding Data Bawaan (Default Content)
-- Menggunakan data awal dari halaman statis yang ada
INSERT INTO public.cms_content (section_key, content_data) VALUES 
(
  'hero_section', 
  '{
    "headline": "Partner Solusi Suku Cadang Kritis Industri & Manufaktur Besar",
    "description": "CV. Abadi Dewana Industrial Equipment (CV. ADIE) menjamin downtime pabrik Anda dapat teratasi secara efisien melalui jaringan pengadaan global dan komitmen Jaminan Garansi Riil.",
    "button_primary": "MINTA PENAWARAN (RFQ)",
    "button_secondary": "JELAJAHI KATALOG PRODUK",
    "bg_image_url": ""
  }'::jsonb
),
(
  'trust_grid',
  '{
    "items": [
      { "title": "Jaminan Garansi Riil Penggantian 100%", "icon": "Award" },
      { "title": "Solusi Global Sourcing Part Langka", "icon": "Factory" },
      { "title": "Status PKP & Legalitas B2B Resmi", "icon": "FileCheck2" },
      { "title": "Dukungan Teknisi Berpengalaman & After-Sales", "icon": "Headphones" }
    ]
  }'::jsonb
),
(
  'product_categories',
  '{
    "title": "Katalog Suku Cadang & Layanan",
    "description": "Menyediakan komponen kritis khusus untuk lini produksi utama pabrik Anda, dari kelistrikan hingga perbaikan otomatisasi tingkat tinggi.",
    "items": [
      { "title": "Pneumatik & Kompresor", "icon": "Wind", "desc": "CKD, FESTO, SMC, Elite Air" },
      { "title": "Otomatisasi & Elektronik", "icon": "Cpu", "desc": "RBCA, Inverter, Sensor & Relay" },
      { "title": "Perbaikan Elektrikal", "icon": "Activity", "desc": "Jasa Servis PLC, PCB, Servo" },
      { "title": "Suku Cadang Khusus Tekstil", "icon": "Settings", "desc": "Spinning & Dyeing Parts" },
      { "title": "Perkakas & Lain-lain", "icon": "Wrench", "desc": "DeWALT, Tools & Fabrikasi" }
    ],
    "link_text": "LIHAT SEMUA KATEGORI PRODUK"
  }'::jsonb
),
(
  'why_choose_us',
  '{
    "title": "Mengapa CV. ADIE Berbeda?",
    "image_url": "",
    "points": [
      "Jaminan Garansi Riil: Jika komponen berkendala, kami ganti 100% identik & dampingi pengujian hingga mesin berjalan running normal.",
      "Harga Kompetitif & Fleksibel: Menggunakan jaringan global sourcing untuk menemukan part langka dengan komitmen harga rasional dan opsi negosiasi adil.",
      "Spesialis Manufaktur: Spesialisasi andal dalam menyuplai Pabrik Tekstil, Autopart, Makanan, Pulp & Paper, dan Water Treatment.",
      "ToP Fleksibel: Mendukung kelancaran cash flow operasional dengan Term of Payment yang disesuaikan kesepakatan kontrak.",
      "PKP Aktif & Legalitas Valid: Akta Pendirian, NIB, NPWP lengkap, dan kami berhak menerbitkan Faktur Pajak resmi di setiap transaksi."
    ]
  }'::jsonb
),
(
  'workflow',
  '{
    "title": "Alur Kerja Pengadaan Cepat & Tepat",
    "steps": [
      { "title": "Identifikasi Masalah", "desc": "Konsultasi part langka atau penggantian" },
      { "title": "Kirim RFQ", "desc": "Upload daftar kebutuhan spesifik" },
      { "title": "Global Sourcing", "desc": "Pencarian harga rasional & negosiasi" },
      { "title": "Delivery & Setup", "desc": "Barang diantar dan didampingi teknisi" }
    ]
  }'::jsonb
),
(
  'cta_banner',
  '{
    "title": "PUNYA KEBUTUHAN MENDESAK UNTUK MENCEGAH DOWNTIME?",
    "description": "Tim CV. ADIE siap melacak komponen yang Anda butuhkan melalui jaringan pengadaan global dengan harga yang sangat masuk akal dan term of payment fleksibel.",
    "button_text": "HUBUNGI KAMI SEKARANG (RFQ)"
  }'::jsonb
)
ON CONFLICT (section_key) DO UPDATE 
SET content_data = EXCLUDED.content_data, updated_at = now();
