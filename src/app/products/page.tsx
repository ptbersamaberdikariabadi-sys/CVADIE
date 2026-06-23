import { Filter, Search, Cog, Settings, Activity, Wind, Cpu, Shield, Wrench } from 'lucide-react'
import Link from 'next/link'

export default function Products() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <section className="bg-brand-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Katalog Produk</h1>
          <p className="text-gray-200">Eksplorasi komponen spesifik industri, otomasi, dan suku cadang pabrik.</p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
          {/* Sidebar Filter */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm sticky top-28">
              <div className="flex items-center gap-2 mb-6 text-brand-primary font-bold text-lg border-b pb-4">
                <Filter className="w-5 h-5" /> Filter Produk
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Kategori Spesifik</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {[
                    'Automation & Textile Parts', 
                    'Electronic Systems', 
                    'Pneumatics & Compressors', 
                    'Plumbing & Ducting', 
                    'Safety & Fire Alarm', 
                    'Gear Fabrications',
                    'Miscellaneous'
                  ].map((cat, idx) => (
                    <li key={idx} className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition-colors">
                      <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer" />
                      {cat}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-3">Merek (Brands)</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  {['CKD', 'Festo', 'SMC', 'RBCA', 'DeWalt', 'Pamy'].map((brand, idx) => (
                    <li key={idx} className="flex items-center gap-2 cursor-pointer hover:text-brand-accent transition-colors">
                      <input type="checkbox" className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer" />
                      {brand}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="relative w-full max-w-md">
                <input 
                  type="text" 
                  placeholder="Cari part number atau tipe barang..." 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:border-brand-primary focus:ring-brand-primary"
                />
                <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              </div>
              <div className="text-sm text-gray-500 font-medium shrink-0">Menampilkan 1-6 dari Ratusan Produk</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { brand: "Elite Air", category: "Pneumatics & Compressors", name: "Elite Air Industrial Compressor", desc: "Kompresor udara industri skala besar untuk pabrik dan manufaktur.", icon: Wind },
                { brand: "Festo", category: "Pneumatics & Compressors", name: "Festo Solenoid Valve Series", desc: "Katup solenoid presisi tinggi untuk sistem otomasi pneumatik.", icon: Settings },
                { brand: "RBCA", category: "Electronic Systems", name: "Inverter & Servo Controller", desc: "Pengendali motor servo dan inverter untuk mesin spinning dan assembly.", icon: Cpu },
                { brand: "Custom", category: "Plumbing & Ducting", name: "Industrial Steel Ducting", desc: "Fabrikasi sistem perpipaan dan ducting udara pabrik berkualitas tinggi.", icon: Activity },
                { brand: "Notifier", category: "Safety & Fire Alarm", name: "Integrated Fire Alarm System", desc: "Sistem deteksi dini dan proteksi kebakaran (APAR, Alarm, Sprinkler).", icon: Shield },
                { brand: "DeWalt", category: "Miscellaneous", name: "DeWalt Circular Saw Heavy Duty", desc: "Peralatan potong presisi untuk operasional bengkel dan fabrikasi pabrik.", icon: Wrench },
              ].map((prod, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col group">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center relative p-6 border-b border-gray-100">
                    <prod.icon className="w-24 h-24 text-gray-300 group-hover:text-brand-primary transition-colors" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-xs font-bold text-brand-primary uppercase tracking-wider">{prod.brand}</div>
                      <div className="text-xs text-gray-400 font-medium">{prod.category}</div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight">{prod.name}</h3>
                    <p className="text-sm text-gray-500 mb-6 flex-1 leading-relaxed">{prod.desc}</p>
                    <div className="flex items-center gap-2 mt-auto">
                      <button className="flex-1 text-center border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white font-bold py-2.5 rounded transition-colors text-sm">
                        DETAIL
                      </button>
                      <Link href="/rfq" className="flex-1 text-center bg-brand-accent hover:bg-amber-600 text-white font-bold py-3 rounded transition-colors text-sm">
                        + RFQ
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3, '...', 10].map((p, idx) => (
                <button key={idx} className={`w-10 h-10 rounded flex items-center justify-center font-bold ${p === 1 ? 'bg-brand-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
