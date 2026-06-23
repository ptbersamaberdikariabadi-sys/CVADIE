import { BookOpen, Network, Download, Plus, FileText } from 'lucide-react'

export default function Education() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-brand-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">Pusat Edukasi & Knowledge Hub</h1>
          <p className="text-xl max-w-2xl mx-auto text-gray-200">
            Sumber informasi teknis untuk membantu engineer dan procurement membuat keputusan yang tepat.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-16">
            {/* Berita Industri / Artikel */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-primary mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6" /> Artikel Teknis
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-brand-accent text-sm font-bold mb-2">Mechanical Engineering</div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2">Cara Membaca Kode Pada Bearing SKF dengan Benar</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      Memahami sufiks dan prefiks pada part number bearing sangat penting agar tidak salah dalam melakukan pemesanan (PO).
                    </p>
                    <a href="#" className="text-brand-primary font-bold text-sm hover:underline">Baca Selengkapnya →</a>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge Graph Placeholder */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-primary mb-6 flex items-center gap-2">
                <Network className="w-6 h-6" /> Knowledge Graph Industri
              </h2>
              <div className="bg-white p-8 rounded-lg border shadow-sm">
                <p className="text-gray-600 mb-6">
                  Peta keterkaitan antar komponen industri. Membantu AI dan teknisi memahami bahwa sebuah <strong>Conveyor Belt</strong> membutuhkan <strong>Motor Sinkron</strong>, <strong>Gearbox</strong>, dan <strong>Roller Bearing</strong>.
                </p>
                <div className="h-64 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500">
                  Visualisasi Knowledge Graph (Interaktif)
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Download Datasheet */}
            <div className="bg-brand-primary text-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><Download className="w-5 h-5" /> Dokumen Teknis</h3>
              <p className="text-sm text-gray-200 mb-6">Unduh panduan instalasi, tabel konversi, dan manual pemeliharaan secara gratis.</p>
              <ul className="space-y-3">
                {['Tabel Toleransi Bearing.pdf', 'Panduan Instalasi Inverter.pdf', 'Katalog Pipa & Valve 2024.pdf'].map((doc, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm bg-white/10 p-3 rounded hover:bg-white/20 cursor-pointer transition-colors">
                    <FileText className="w-4 h-4" /> {doc}
                  </li>
                ))}
              </ul>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="font-bold text-xl mb-6 text-gray-900">FAQ Pengadaan</h3>
              <div className="space-y-4">
                {[
                  "Apakah perusahaan ini PKP?",
                  "Berapa lama rata-rata Lead Time?",
                  "Apakah bisa COD atau Term of Payment?",
                  "Apakah ada garansi jika barang cacat pabrik?"
                ].map((q, i) => (
                  <div key={i} className="border-b pb-4">
                    <button className="w-full flex items-center justify-between font-medium text-gray-800 text-left hover:text-brand-primary">
                      {q} <Plus className="w-4 h-4 text-brand-accent shrink-0" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
