-- ==========================================
-- CV. ADIE - SEEDING DATA DUMMY (OPSI B)
-- ==========================================

INSERT INTO public.products (part_number, name, brand, category, description, stock)
VALUES 
    ('EA-COMP-001', 'Elite Air Industrial Compressor', 'Elite Air', 'Pneumatik & Kompresor', 'Kompresor udara industri skala besar untuk pabrik dan manufaktur.', 15),
    ('FST-SV-102', 'FESTO Solenoid Valve Series', 'FESTO', 'Pneumatik & Kompresor', 'Katup solenoid presisi tinggi untuk sistem otomasi pneumatik.', 120),
    ('RBC-INV-305', 'Inverter & Servo Controller', 'RBCA', 'Otomatisasi & Komponen Elektronik', 'Pengendali motor servo dan inverter untuk mesin lini perakitan.', 8),
    ('SVC-PLC-001', 'PLC & PCB Repair Service', 'Jasa Servis', 'Perbaikan Elektrikal', 'Layanan perbaikan teknis PLC, PCB, dan Monitor Industri pasca-pemasangan.', 999),
    ('CST-TEX-500', 'Spinning & Dyeing Parts', 'Custom', 'Suku Cadang Khusus Tekstil', 'Komponen pendukung spesifik untuk mesin pemintalan dan pewarnaan tekstil.', 50),
    ('DW-PT-770', 'DeWALT Heavy Duty Power Tools', 'DeWALT', 'Perkakas & Produk Lain-lain', 'Peralatan perkakas potong presisi untuk operasional perbaikan.', 35)
ON CONFLICT (part_number) DO NOTHING;
