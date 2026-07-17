import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import CmsEditor from '@/components/admin/CmsEditor';

export default async function AdminCmsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Ambil semua data CMS yang ada
  const { data: cmsData } = await supabase
    .from('cms_content')
    .select('*');

  // Format ke bentuk key-value object
  const initialContent: Record<string, unknown> = {};
  if (cmsData) {
    cmsData.forEach(item => {
      initialContent[item.section_key] = item.content_data;
    });
  }

  // Provide default schemas for all sections if they are not in DB yet
  if (!initialContent['hero_section']) {
    initialContent['hero_section'] = {
      headline: "Partner Solusi Suku Cadang Kritis Industri & Manufaktur Besar",
      description: "CV. Abadi Dewana Industrial Equipment (CV. ADIE) menjamin downtime pabrik Anda dapat teratasi secara efisien melalui jaringan pengadaan global dan komitmen Jaminan Garansi Riil.",
      button_primary: "MINTA PENAWARAN (RFQ)",
      button_secondary: "JELAJAHI KATALOG PRODUK",
      bg_image_url: "",
      slides: [
        {
          image_url: '/logo.jpeg',
          alt: 'Logo CV. ADIE — CV. Abadi Dewana Industrial Equipment',
          is_logo: true,
        },
        {
          image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80&auto=format&fit=crop',
          alt: 'Teknisi di fasilitas manufaktur modern',
        },
        {
          image_url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80&auto=format&fit=crop',
          alt: 'Mesin industri berat di pabrik',
        },
        {
          image_url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80&auto=format&fit=crop',
          alt: 'Lini produksi otomasi elektronik',
        },
        {
          image_url: 'https://images.unsplash.com/photo-1565596003821-4b52b84f55a9?w=1920&q=80&auto=format&fit=crop',
          alt: 'Sistem pneumatik & komponen industri',
        }
      ]
    };
  }

  if (!initialContent['trust_grid']) {
    initialContent['trust_grid'] = {
      items: [
        { title: "Jaminan Garansi Riil Penggantian 100%", icon: "Award" },
        { title: "Solusi Global Sourcing Part Langka", icon: "Factory" },
        { title: "Status PKP & Legalitas B2B Resmi", icon: "FileCheck2" },
        { title: "Dukungan Teknisi Berpengalaman & After-Sales", icon: "Headphones" }
      ]
    };
  }

  if (!initialContent['services']) {
    initialContent['services'] = {
      title: "Sektor Industri & Layanan Utama",
      items: [
        { title: "Pneumatik & Kompresor", desc: "Silinder, Valve, Fitting, Tubing, FRL dari brand terkemuka.", icon: "Wind" },
        { title: "Otomasi & Elektrikal", desc: "PLC, Inverter, Sensor, Relay, HMI, dan komponen control panel.", icon: "Cpu" },
        { title: "Mekanikal & Transmisi", desc: "Bearing, Belt, Chain, Gearbox, Motor Industri.", icon: "Zap" },
        { title: "Tekstil Spesial", desc: "Suku cadang khusus mesin tenun, dyeing, spinning.", icon: "Package" },
        { title: "Fabrikasi Khusus", desc: "Pembuatan sparepart custom (bubut, milling, welding).", icon: "Factory" },
        { title: "Maintenance & Service", desc: "Perbaikan Inverter, Servo, Modul Elektronik industri.", icon: "Wrench" }
      ]
    };
  }

  if (!initialContent['why_choose_us']) {
    initialContent['why_choose_us'] = {
      title: "Mengapa CV. ADIE Berbeda?",
      image_url: "",
      points: [
        "Jaminan Garansi Riil: Jika komponen berkendala, kami ganti 100% identik & dampingi pengujian hingga mesin berjalan running normal.",
        "Harga Kompetitif & Fleksibel: Menggunakan jaringan global sourcing untuk menemukan part langka dengan komitmen harga rasional dan opsi negosiasi adil.",
        "Spesialis Manufaktur: Spesialisasi andal dalam menyuplai Pabrik Tekstil, Autopart, Makanan, Pulp & Paper, dan Water Treatment.",
        "ToP Fleksibel: Mendukung kelancaran cash flow operasional dengan Term of Payment yang disesuaikan kesepakatan kontrak.",
        "PKP Aktif & Legalitas Valid: Akta Pendirian, NIB, NPWP lengkap, dan kami berhak menerbitkan Faktur Pajak resmi di setiap transaksi."
      ]
    };
  }

  if (!initialContent['workflow']) {
    initialContent['workflow'] = {
      title: "Alur Kerja Pengadaan Cepat & Tepat",
      steps: [
        { title: "Identifikasi Masalah", desc: "Konsultasi part langka atau penggantian" },
        { title: "Kirim RFQ", desc: "Upload daftar kebutuhan spesifik" },
        { title: "Global Sourcing", desc: "Pencarian harga rasional & negosiasi" },
        { title: "Delivery & Setup", desc: "Barang diantar dan didampingi teknisi" }
      ]
    };
  }

  if (!initialContent['cta_banner']) {
    initialContent['cta_banner'] = {
      title: "PUNYA KEBUTUHAN MENDESAK UNTUK MENCEGAH DOWNTIME?",
      description: "Tim CV. ADIE siap melacak komponen yang Anda butuhkan melalui jaringan pengadaan global dengan harga yang sangat masuk akal dan term of payment fleksibel.",
      button_text: "HUBUNGI KAMI SEKARANG (RFQ)"
    };
  }

  if (!initialContent['about_page']) {
    initialContent['about_page'] = {
      hero: {
        headline: "Tentang Kami",
        description: "Menjadi mitra bisnis terpercaya yang menawarkan harga terbaik, bertanggung jawab, serta mampu menyelesaikan masalah internal maupun kebutuhan mitra bisnis."
      },
      history: {
        title: "Sejarah Perusahaan",
        paragraphs: [
          "CV. Abadi Dewana Industrial Equipment (CV. ADIE) didirikan oleh Adie Woo pada tahun 2024. Berbekal pengalaman lebih dari 15 tahun di bidang technical services dan pemasaran suku cadang industri (sparepart marketing), beliau mendirikan perusahaan ini dengan jaringan sumber daya dan pengetahuan industri yang luas.",
          "Kami didukung oleh tenaga profesional berpengalaman yang siap memberikan jaminan atas solusi teknis, pengadaan, dan proyek yang kami kerjakan. Kami sangat bangga dengan konsistensi, komunikasi yang transparan, dan layanan purna jual (after-sales) yang unggul.",
          "Kami menyadari bahwa downtime mesin sangat merugikan bagi lini produksi. Oleh karena itu, kami hadir dengan jaringan global sourcing untuk mengatasi kelangkaan komponen, serta menentang keras monopoli harga yang tidak rasional."
        ],
        mission_title: "Misi & Komitmen",
        missions: [
          { title: "Harga Kompetitif", desc: "Memberikan penawaran harga terbaik yang kompetitif dan tetap membuka ruang untuk negosiasi." },
          { title: "Jaminan Garansi Riil", desc: "Memberikan jaminan garansi riil yang didasari tanggung jawab penuh, bukan sekadar formalitas di atas kertas. Penggantian 100% identik dan pendampingan ekstra." },
          { title: "Kualitas Layanan", desc: "Berkomitmen menjaga kualitas layanan demi memelihara kepercayaan jangka panjang dengan mitra." }
        ]
      },
      targets: {
        title: "Target Industri & Spesialisasi",
        items: [
          { icon: "Factory", label: "Textile Factory", desc: "Spinning & Dyeing" },
          { icon: "Wrench", label: "Autopart Factory", desc: "Assembly Lines" },
          { icon: "Building2", label: "Food Factory", desc: "F&B Production" },
          { icon: "FileSignature", label: "Pulp & Paper", desc: "Paper Processing" },
          { icon: "Droplet", label: "Water Treatment", desc: "WWTP / WTP" }
        ]
      },
      management: {
        title: "Manajemen Inti",
        items: [
          { name: "Adie Woo", role: "Founder & Marketing Director", description: "Memiliki pengalaman lebih dari 15 tahun di industri technical services dan pemasaran suku cadang (sparepart marketing)." }
        ]
      },
      legal_contact: {
        legal_title: "Legalitas Perusahaan",
        legals: [
          { icon: "Building2", title: "Perusahaan PKP", desc: "Status perpajakan resmi, siap menerbitkan Faktur Pajak" },
          { icon: "FileSignature", title: "Izin Usaha Lengkap", desc: "Akta Pendirian, SK Kemenkumham, NIB, NPWP Valid" },
          { icon: "ShieldCheck", title: "Anti-Monopoli & Global Sourcing", desc: "Melacak part langka/diskontinu dengan harga rasional" }
        ],
        contact_title: "Informasi Kontak & Lokasi",
        contacts: [
          { icon: "MapPin", title: "Kantor Administrasi", desc: "Dusun Bengang RT.05/RW.07 Desa Buahdua\nKec. Buahdua, Kab. Sumedang\nJawa Barat - 45392" },
          { icon: "Phone", title: "Telepon Kantor", desc: "(0261) 2142579" },
          { icon: "Phone", title: "WhatsApp", desc: "+62 838-4758-2958" },
          { icon: "Mail", title: "Email Resmi", desc: "abadidewana.ie@gmail.com" }
        ]
      }
    };
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Kustomisasi Halaman Publik</h2>
        <p className="text-sm text-gray-500 mt-1">Ubah teks, gambar, dan bagian-bagian di halaman beranda (Profil Perusahaan) secara langsung.</p>
      </div>

      <CmsEditor initialContent={initialContent} />
    </div>
  );
}
