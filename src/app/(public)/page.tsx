import Link from 'next/link'
import { Truck, Award, FileText, Headphones, ArrowRight, CheckCircle2, Factory, Package, Activity, Wrench, ShieldAlert, Zap, Upload, FileCheck2, Cpu, Wind, Cog, Settings, Shield } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

export const revalidate = 3600 // 1 hour, but revalidatePath will clear it instantly on edit

// Icon Mapping helper
const IconMap: Record<string, any> = {
  Award, Factory, FileCheck2, Headphones, Wind, Cpu, Activity, Settings, Wrench, Package
};

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  // Fetch all CMS content
  const { data: cmsData } = await supabase.from('cms_content').select('*')
  
  const content: Record<string, any> = {}
  if (cmsData) {
    cmsData.forEach(item => {
      content[item.section_key] = item.content_data
    })
  }

  // Fallbacks if data doesn't exist
  const hero = content['hero_section'] || {
    headline: "Partner Solusi Suku Cadang Kritis Industri & Manufaktur Besar",
    description: "CV. Abadi Dewana Industrial Equipment (CV. ADIE) menjamin downtime pabrik Anda dapat teratasi secara efisien melalui jaringan pengadaan global dan komitmen Jaminan Garansi Riil.",
    button_primary: "MINTA PENAWARAN (RFQ)",
    button_secondary: "JELAJAHI KATALOG PRODUK",
    bg_image_url: ""
  };

  const trustGrid = content['trust_grid'] || {
    items: [
      { title: "Jaminan Garansi Riil Penggantian 100%", icon: "Award" },
      { title: "Solusi Global Sourcing Part Langka", icon: "Factory" },
      { title: "Status PKP & Legalitas B2B Resmi", icon: "FileCheck2" },
      { title: "Dukungan Teknisi Berpengalaman & After-Sales", icon: "Headphones" }
    ]
  };

  const categories = content['product_categories'] || {
    title: "Katalog Suku Cadang & Layanan",
    description: "Menyediakan komponen kritis khusus untuk lini produksi utama pabrik Anda, dari kelistrikan hingga perbaikan otomatisasi tingkat tinggi.",
    items: [
      { title: "Pneumatik & Kompresor", icon: "Wind", desc: "CKD, FESTO, SMC, Elite Air" },
      { title: "Otomatisasi & Elektronik", icon: "Cpu", desc: "RBCA, Inverter, Sensor & Relay" },
      { title: "Perbaikan Elektrikal", icon: "Activity", desc: "Jasa Servis PLC, PCB, Servo" },
      { title: "Suku Cadang Khusus Tekstil", icon: "Settings", desc: "Spinning & Dyeing Parts" },
      { title: "Perkakas & Lain-lain", icon: "Wrench", desc: "DeWALT, Tools & Fabrikasi" }
    ],
    link_text: "LIHAT SEMUA KATEGORI PRODUK"
  };

  const whyUs = content['why_choose_us'] || {
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

  const workflow = content['workflow'] || {
    title: "Alur Kerja Pengadaan Cepat & Tepat",
    steps: [
      { title: "Identifikasi Masalah", desc: "Konsultasi part langka atau penggantian" },
      { title: "Kirim RFQ", desc: "Upload daftar kebutuhan spesifik" },
      { title: "Global Sourcing", desc: "Pencarian harga rasional & negosiasi" },
      { title: "Delivery & Setup", desc: "Barang diantar dan didampingi teknisi" }
    ]
  };

  const cta = content['cta_banner'] || {
    title: "PUNYA KEBUTUHAN MENDESAK UNTUK MENCEGAH DOWNTIME?",
    description: "Tim CV. ADIE siap melacak komponen yang Anda butuhkan melalui jaringan pengadaan global dengan harga yang sangat masuk akal dan term of payment fleksibel.",
    button_text: "HUBUNGI KAMI SEKARANG (RFQ)"
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Section 1: Hero Banner */}
      <section className="relative bg-brand-primary text-white overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {hero.bg_image_url ? (
          <img src={hero.bg_image_url} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-[#0f3b2d] z-0" />
        )}
        
        <div className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight mb-6">
            {hero.headline}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/rfq" 
              className="bg-brand-accent hover:bg-amber-600 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg"
            >
              {hero.button_primary}
            </Link>
            <Link 
              href="/products" 
              className="bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white px-8 py-4 rounded-md font-bold text-lg transition-all"
            >
              {hero.button_secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Trust Grid */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustGrid.items.map((item: any, idx: number) => {
              const IconComponent = IconMap[item.icon] || Award;
              return (
                <div key={idx} className="flex flex-col items-center text-center p-6">
                  <IconComponent className="w-12 h-12 text-brand-accent mb-4" />
                  <h3 className="font-bold text-lg text-gray-900">{item.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 3: Kategori Produk Unggulan */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-primary mb-4">{categories.title}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{categories.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 justify-center">
            {categories.items.map((category: any, idx: number) => {
              const IconComponent = IconMap[category.icon] || Package;
              return (
                <div key={idx} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer group flex flex-col items-center text-center">
                  <IconComponent className="w-16 h-16 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-500">{category.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors">
              {categories.link_text} <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Mengapa Memilih CV. Abadi Dewana? */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative shadow-lg">
              {whyUs.image_url ? (
                <img src={whyUs.image_url} alt="Why Choose Us" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-transparent flex items-center justify-center">
                  <Wrench className="w-32 h-32 text-brand-primary/40" />
                </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-primary mb-8">{whyUs.title}</h2>
            <ul className="space-y-6">
              {whyUs.points.map((point: string, idx: number) => {
                // Render text, assume bolding is separated by colon (:)
                const parts = point.split(':');
                return (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-brand-accent shrink-0 mt-0.5" />
                    <span className="text-lg text-gray-800">
                      {parts.length > 1 ? (
                        <><strong>{parts[0]}:</strong>{parts.slice(1).join(':')}</>
                      ) : (
                        point
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Alur Kerja B2B */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-brand-primary mb-16">{workflow.title}</h2>
          <div className="flex flex-col md:flex-row justify-between items-center relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
            {workflow.steps.map((item: any, idx: number) => (
              <div key={idx} className="bg-white border-2 border-brand-primary rounded-xl p-6 w-full md:w-56 text-center shadow-sm relative mb-8 md:mb-0">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-accent text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-gray-900 mt-4 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: CTA Akhir (Banner Urgent) */}
      <section className="py-24 bg-brand-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Zap className="w-96 h-96" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6 text-brand-accent">
            {cta.title}
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            {cta.description}
          </p>
          <Link 
            href="/rfq" 
            className="inline-flex items-center gap-3 bg-white text-brand-primary hover:bg-gray-100 px-8 py-4 rounded-md font-bold text-lg transition-all shadow-xl"
          >
            <Upload className="w-5 h-5" /> {cta.button_text}
          </Link>
        </div>
      </section>
    </div>
  )
}
