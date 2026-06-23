import Link from 'next/link'
import { Truck, Award, FileText, Headphones, ArrowRight, CheckCircle2, Factory, Package, Activity, Wrench, ShieldAlert, Zap, Upload, FileCheck2, Cpu, Wind, Cog, Settings, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Section 1: Hero Banner */}
      <section className="relative bg-brand-primary text-white overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Placeholder background image using a gradient for now */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-[#0f3b2d] z-0" />
        
        <div className="container relative z-20 mx-auto px-4 flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight mb-6">
            Partner Solusi Suku Cadang Kritis Industri & Manufaktur Besar
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 leading-relaxed">
            CV. Abadi Dewana Industrial Equipment (CV. ADIE) menjamin <i>downtime</i> pabrik Anda dapat teratasi secara efisien melalui jaringan <i>global sourcing</i> anti-monopoli harga dan komitmen Garansi Moral yang nyata.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/rfq" 
              className="bg-brand-accent hover:bg-amber-600 text-white px-8 py-4 rounded-md font-bold text-lg transition-all transform hover:-translate-y-1 shadow-lg"
            >
              MINTA PENAWARAN (RFQ)
            </Link>
            <Link 
              href="/products" 
              className="bg-transparent border-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white px-8 py-4 rounded-md font-bold text-lg transition-all"
            >
              JELAJAHI KATALOG PRODUK
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2: Trust Grid */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <Award className="w-12 h-12 text-brand-accent mb-4" />
              <h3 className="font-bold text-lg text-gray-900">Garansi Moral Penggantian 100%</h3>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Factory className="w-12 h-12 text-brand-accent mb-4" />
              <h3 className="font-bold text-lg text-gray-900">Solusi Global Sourcing Part Langka</h3>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <FileCheck2 className="w-12 h-12 text-brand-accent mb-4" />
              <h3 className="font-bold text-lg text-gray-900">Status PKP & Legalitas B2B Resmi</h3>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <Headphones className="w-12 h-12 text-brand-accent mb-4" />
              <h3 className="font-bold text-lg text-gray-900">Dukungan Teknisi Berpengalaman & After-Sales</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Kategori Produk Unggulan */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-primary mb-4">Spesialisasi Sektor Industri</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Menyediakan komponen kritis khusus untuk lini produksi utama pabrik Anda, dari kelistrikan hingga otomatisasi tingkat tinggi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Automation & Textile Parts", icon: Settings, desc: "Spinning, Knitting, Weaving & Dyeing" },
              { title: "Electronic Systems", icon: Cpu, desc: "PLC, Inverters, Sensors & Relays" },
              { title: "Pneumatics & Compressors", icon: Wind, desc: "Cylinders, Valves & Preparation Units" },
              { title: "Plumbing & Ducting", icon: Activity, desc: "Sistem Pipa Industri Terintegrasi" },
              { title: "Safety & Fire Alarm", icon: Shield, desc: "Proteksi Fasilitas Pabrik" },
              { title: "Gear Fabrications", icon: Cog, desc: "Fabrikasi Mekanikal Presisi" },
            ].map((category, idx) => (
              <div key={idx} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer group flex flex-col items-center text-center">
                <category.icon className="w-16 h-16 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-xl text-gray-900 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-500">{category.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/products" className="inline-flex items-center gap-2 text-brand-primary font-bold hover:text-brand-accent transition-colors">
              LIHAT SEMUA KATEGORI PRODUK <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4: Mengapa Memilih CV. Abadi Dewana? */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2">
            <div className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative shadow-lg">
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/20 to-transparent flex items-center justify-center">
                 <Wrench className="w-32 h-32 text-brand-primary/40" />
               </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-brand-primary mb-8">Mengapa CV. ADIE Berbeda?</h2>
            <ul className="space-y-6">
              {[
                <span key="1"><strong>Garansi Moral Nyata:</strong> Jika komponen berkendala, kami ganti 100% identik & dampingi hingga mesin <i>running normal</i>.</span>,
                <span key="2"><strong>Harga Anti-Monopoli:</strong> Menggunakan jaringan <i>global sourcing</i> untuk mengatasi part langka dengan harga rasional.</span>,
                <span key="3"><strong>Spesialis Manufaktur Besar:</strong> Sangat andal menangani kebutuhan Textile, Autopart, Food, dan Water Treatment Factory.</span>,
                <span key="4"><strong>B2B Fleksibel:</strong> Mendukung operasional dengan <i>Term of Payment</i> (ToP) yang fleksibel guna menjaga <i>cash flow</i> Anda.</span>,
                <span key="5"><strong>Legal & Taat Pajak:</strong> NPWP, NIB, dan PKP lengkap. Transaksi dipastikan aman dengan dukungan faktur pajak resmi.</span>
              ].map((point, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-brand-accent shrink-0 mt-0.5" />
                  <span className="text-lg text-gray-800">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Section 5: Alur Kerja B2B */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-center text-brand-primary mb-16">Alur Kerja Pengadaan Cepat & Tepat</h2>
          <div className="flex flex-col md:flex-row justify-between items-center relative max-w-5xl mx-auto">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
            {[
              { step: 1, title: "Identifikasi Masalah", desc: "Konsultasi part langka atau penggantian" },
              { step: 2, title: "Kirim RFQ", desc: "Upload daftar kebutuhan spesifik" },
              { step: 3, title: "Global Sourcing", desc: "Pencarian harga rasional & negosiasi" },
              { step: 4, title: "Delivery & Setup", desc: "Barang diantar dan didampingi teknisi" }
            ].map((item, idx) => (
              <div key={idx} className="bg-white border-2 border-brand-primary rounded-xl p-6 w-full md:w-56 text-center shadow-sm relative mb-8 md:mb-0">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-brand-accent text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-white">
                  {item.step}
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
            PUNYA KEBUTUHAN MENDESAK UNTUK MENCEGAH DOWNTIME?
          </h2>
          <p className="text-xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
            Tim CV. ADIE siap melacak komponen yang Anda butuhkan melalui jaringan pengadaan global dengan harga yang sangat masuk akal dan term of payment fleksibel.
          </p>
          <Link 
            href="/rfq" 
            className="inline-flex items-center gap-3 bg-white text-brand-primary hover:bg-gray-100 px-8 py-4 rounded-md font-bold text-lg transition-all shadow-xl"
          >
            <Upload className="w-5 h-5" /> HUBUNGI KAMI SEKARANG (RFQ)
          </Link>
        </div>
      </section>
    </div>
  )
}
