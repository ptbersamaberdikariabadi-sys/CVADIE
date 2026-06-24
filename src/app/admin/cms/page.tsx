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

  // Ensure about_page has a default schema if not in DB yet so it can be edited
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
          { icon: "MapPin", title: "Kantor Administrasi", desc: "Tanjungsari RT/RW 002/006\nKec. Sukasari, Kab. Sumedang\nJawa Barat" },
          { icon: "Hammer", title: "Workshop & Gudang", desc: "Dusun Cinulukadu, RT/RW 03/08\nKec. Rancaekek, Kab. Bandung\nJawa Barat" },
          { icon: "Phone", title: "Telepon & Mobile", desc: "(0261) 2142579 / 0821-2777-2205" },
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
