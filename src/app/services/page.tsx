import { Globe2, Cog, Wrench, ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Layanan Perbaikan & Solusi Teknis</h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 leading-relaxed">
            Lebih dari sekadar penyedia komponen. Kami memberikan solusi teknis <i>end-to-end</i> dengan prinsip <b>"Garansi Moral"</b> dan pelayanan tanpa biaya jika perbaikan tidak terbukti berhasil.
          </p>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                <Zap className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">Electrical Repair Services</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Layanan perbaikan khusus untuk komponen elektrikal industri seperti <b>PLCs, PCBs, Monitors, Servo Motors, dan Inverters</b>. 
                Tim ahli kami menjamin tingkat kesuksesan perbaikan yang tinggi dengan komunikasi yang transparan di setiap tahap perbaikan.
              </p>
              <div className="bg-orange-50 text-brand-accent p-4 rounded-md text-sm font-bold border border-orange-100 flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Biaya perbaikan hanya ditagihkan APABILA komponen telah diklaim dan terbukti berfungsi dengan baik seperti baru.</span>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                <Globe2 className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">Global Sourcing</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Seringkali teknisi pabrik kelimpungan mencari suku cadang mesin yang sudah <i>discontinue</i> (obsolete) atau langka. Kami menggunakan jaringan global untuk menemukan komponen tersebut dengan <b>harga rasional</b>, menghindarkan Anda dari monopoli harga <i>trader</i> lain.
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-brand-primary mt-auto">
                <Activity className="w-4 h-4" /> Minimalkan Downtime Produksi
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-brand-primary transition-colors">
                <Wrench className="w-8 h-8 text-brand-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-2xl text-gray-900 mb-4">Technical & After-Sales ("Garansi Moral")</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Kami tidak melepas tanggung jawab setelah barang diterima. Jika komponen yang disuplai atau diservis mengalami kendala pasca-pemasangan, CV. ADIE akan <b>menggantinya 100% identik</b> dan mendampingi hingga mesin dipastikan berjalan normal kembali.
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-brand-primary mt-auto">
                <Cog className="w-4 h-4" /> Dukungan Pemasangan Langsung
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-16 max-w-6xl">
          <div className="w-full md:w-5/12">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-primary mb-6">Konsultasi Kendala Pabrik Anda</h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Tim engineering kami siap membantu Anda menyelesaikan masalah kelistrikan industri, mencari komponen langka, atau merencanakan jadwal <i>preventive maintenance</i> rutin.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Konsultasi Gratis</div>
                  <div className="text-sm text-gray-500">Evaluasi masalah teknis mesin Anda tanpa biaya.</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-gray-700">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <Zap className="w-6 h-6 text-brand-accent" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Respon Cepat 24 Jam</div>
                  <div className="text-sm text-gray-500">Proposal solusi disiapkan maksimal dalam 1x24 jam kerja.</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-7/12 bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-sm">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap</label>
                  <input type="text" className="w-full border-gray-300 rounded-md shadow-sm p-3.5 border focus:border-brand-primary focus:ring-brand-primary bg-white" placeholder="Bapak / Ibu" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Nama Pabrik / Perusahaan</label>
                  <input type="text" className="w-full border-gray-300 rounded-md shadow-sm p-3.5 border focus:border-brand-primary focus:ring-brand-primary bg-white" placeholder="PT. Manufaktur Indonesia" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nomor Telepon / WhatsApp</label>
                <input type="tel" className="w-full border-gray-300 rounded-md shadow-sm p-3.5 border focus:border-brand-primary focus:ring-brand-primary bg-white" placeholder="0812-XXXX-XXXX" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Kendala atau Permintaan Servis</label>
                <textarea rows={5} className="w-full border-gray-300 rounded-md shadow-sm p-3.5 border focus:border-brand-primary focus:ring-brand-primary bg-white" placeholder="Contoh: Kami membutuhkan jasa perbaikan untuk Inverter Siemens atau mencari pengganti PLC yang sudah obsolete..."></textarea>
              </div>
              <button type="button" className="w-full bg-brand-primary hover:bg-[#0f3b2d] text-white font-bold py-4 rounded-md transition-colors flex justify-center items-center gap-2 text-lg shadow-lg">
                KIRIM PERMINTAAN SERVIS <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
