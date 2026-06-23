import { CheckCircle, History, Building2, User, FileSignature, MapPin, Phone, Mail, Hammer, ShieldCheck, Factory, Droplet, Wrench } from 'lucide-react'

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-brand-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Tentang Kami</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Menjadi partner bisnis yang sangat dapat dipercaya, menawarkan harga terbaik, bertanggung jawab, serta mampu menyelesaikan masalah internal maupun partner kami.
          </p>
        </div>
      </section>

      {/* Sejarah & Pendirian */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-6">Sejarah Perusahaan</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              CV. Abadi Dewana Industrial Equipment (CV. ADIE) didirikan oleh Adie Woo pada tahun 2024. Berbekal pengalaman lebih dari 15 tahun di bidang <i>technical services</i> dan pemasaran suku cadang industri (<i>sparepart marketing</i>), beliau mendirikan perusahaan ini dengan jaringan sumber daya dan pengetahuan industri yang luas.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Kami didukung oleh tenaga profesional berpengalaman yang siap memberikan jaminan atas solusi teknis, pengadaan, dan proyek yang kami kerjakan. Kami sangat bangga dengan konsistensi, komunikasi yang transparan, dan layanan purna jual (<i>after-sales</i>) yang unggul.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Kami menyadari bahwa <i>downtime</i> mesin sangat merugikan bagi lini produksi. Oleh karena itu, kami hadir dengan jaringan <i>global sourcing</i> untuk mengatasi kelangkaan komponen, serta menentang keras monopoli harga yang tidak rasional.
            </p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl border">
            <h3 className="font-bold text-xl mb-6 flex items-center gap-2 text-gray-800">
              <History className="w-5 h-5 text-brand-accent" /> Misi & Komitmen
            </h3>
            <div className="space-y-6">
              {[
                { title: "Harga Kompetitif", desc: "Memberikan penawaran harga terbaik yang selalu rasional dan dapat dinegosiasikan." },
                { title: "Garansi Moral", desc: "Memberikan masa garansi bukan hanya di atas kertas, namun dengan segenap moral dan tanggung jawab. Apabila komponen berkendala, kami ganti 100% identik dan mendampingi hingga mesin running." },
                { title: "Kualitas Layanan", desc: "Berkomitmen menjaga standar tinggi dan kepercayaan partner bisnis secara berkelanjutan." }
              ].map((t, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{t.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target Industri (Partner Target) */}
      <section className="py-20 bg-brand-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold mb-12">Target Industri & Spesialisasi</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Factory, label: "Textile Factory", desc: "Spinning & Dyeing" },
              { icon: Wrench, label: "Autopart Factory", desc: "Assembly Lines" },
              { icon: Building2, label: "Food Factory", desc: "F&B Production" },
              { icon: FileSignature, label: "Pulp & Paper", desc: "Paper Processing" },
              { icon: Droplet, label: "Water Treatment", desc: "WWTP / WTP" }
            ].map((Target, idx) => (
              <div key={idx} className="flex flex-col items-center p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                <Target.icon className="w-12 h-12 text-brand-accent mb-4" />
                <h3 className="font-bold text-lg mb-1">{Target.label}</h3>
                <p className="text-xs text-gray-300">{Target.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Manajemen */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-brand-primary mb-12">Manajemen Inti</h2>
          <div className="flex justify-center">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center max-w-sm w-full">
              <div className="w-24 h-24 bg-brand-primary/10 rounded-full mb-4 flex items-center justify-center">
                <User className="w-10 h-10 text-brand-primary" />
              </div>
              <h3 className="font-bold text-xl text-gray-900">Adie Woo</h3>
              <p className="text-brand-accent text-sm font-bold mb-4 uppercase tracking-wider">Founder & Marketing Director</p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Memiliki pengalaman lebih dari 15 tahun di industri technical services dan pemasaran suku cadang (sparepart marketing).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legalitas & Kontak */}
      <section className="py-20 bg-white border-t">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Legalitas */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-8">Legalitas Perusahaan</h2>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-lg border">
                <Building2 className="w-8 h-8 text-brand-accent" />
                <div>
                  <div className="font-bold text-gray-900">Perusahaan PKP</div>
                  <div className="text-sm text-gray-500">Status perpajakan resmi, siap menerbitkan Faktur Pajak</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-lg border">
                <FileSignature className="w-8 h-8 text-brand-accent" />
                <div>
                  <div className="font-bold text-gray-900">Izin Usaha Lengkap</div>
                  <div className="text-sm text-gray-500">Akta Pendirian, SK Kemenkumham, NIB, NPWP Valid</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gray-50 px-6 py-4 rounded-lg border">
                <ShieldCheck className="w-8 h-8 text-brand-accent" />
                <div>
                  <div className="font-bold text-gray-900">Anti-Monopoli & Global Sourcing</div>
                  <div className="text-sm text-gray-500">Melacak part langka/diskontinu dengan harga rasional</div>
                </div>
              </div>
            </div>
          </div>

          {/* Kontak & Lokasi */}
          <div>
            <h2 className="font-serif text-3xl font-bold text-brand-primary mb-8">Informasi Kontak & Lokasi</h2>
            <div className="space-y-6 bg-gray-50 p-8 rounded-xl border">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-brand-accent shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-gray-900">Head Office</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Dusun Bengang RT./RW. 05/07<br />
                    Desa Buahdua, Kec. Buahdua<br />
                    Kab. Sumedang, Jawa Barat - 45392
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Hammer className="w-6 h-6 text-brand-accent shrink-0 mt-1" />
                <div>
                  <div className="font-bold text-gray-900">Workshop & Gudang</div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Dusun Cinulukadu, RT./RW. 02/06<br />
                    Desa Sukamanah, Kec. Rancaekek<br />
                    Kab. Bandung, Jawa Barat
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-brand-accent shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">Telepon & Mobile</div>
                  <div className="text-sm text-gray-600">(0261) 2142579 / 0821-2777-2205</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-brand-accent shrink-0" />
                <div>
                  <div className="font-bold text-gray-900">Email Resmi</div>
                  <div className="text-sm text-gray-600">abadidewana.ie@gmail.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
