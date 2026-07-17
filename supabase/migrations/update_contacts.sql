-- ============================================================
-- UPDATE data kontak & alamat di CMS (about_page)
-- Jalankan di Supabase SQL Editor jika data sudah ada di DB
-- ============================================================

-- Update alamat kantor, nomor telepon, dan WhatsApp di CMS
-- Ini menggunakan jsonb_set untuk update field spesifik tanpa menghapus data lain

UPDATE public.cms_content
SET content_data = jsonb_set(
  jsonb_set(
    content_data,
    '{legal_contact,contacts}',
    '[
      {"icon": "MapPin", "title": "Kantor Administrasi", "desc": "Dusun Bengang RT.05/RW.07 Desa Buahdua\nKec. Buahdua, Kab. Sumedang\nJawa Barat - 45392"},
      {"icon": "Phone", "title": "Telepon Kantor", "desc": "(0261) 2142579"},
      {"icon": "Phone", "title": "WhatsApp", "desc": "+62 838-4758-2958"},
      {"icon": "Mail", "title": "Email Resmi", "desc": "abadidewana.ie@gmail.com"}
    ]'::jsonb
  ),
  '{legal_contact,contact_title}',
  '"Informasi Kontak & Lokasi"'::jsonb
)
WHERE section_key = 'about_page';
