import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Area 1: Contact */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Kantor & Workshop</h3>
          <address className="not-italic text-gray-300 space-y-4 text-sm">
            <div>
              <p className="font-bold text-white mb-1">Kantor Administrasi:</p>
              <p>Tanjungsari RT/RW 002/006, Kec. Sukasari</p>
              <p>Kab. Sumedang, Jawa Barat.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Workshop & Gudang:</p>
              <p>Dusun Cinulukadu, RT/RW 03/08</p>
              <p>Rancaekek, Kab. Bandung, Jawa Barat.</p>
            </div>
          </address>
        </div>

        {/* Area 2: Quick Links */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Kontak & Dukungan</h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex flex-col">
              <span className="font-bold text-white">Email:</span>
              <a href="mailto:abadidewana.ie@gmail.com" className="hover:text-brand-accent transition-colors">abadidewana.ie@gmail.com</a>
            </li>
            <li className="flex flex-col">
              <span className="font-bold text-white">Telepon / WhatsApp:</span>
              <span>0821-2777-2205</span>
              <span>(0261) 2142579</span>
            </li>
          </ul>
        </div>

        {/* Area 3: Copyright & Legal */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Legalitas Perusahaan</h3>
          <div className="text-sm text-gray-300 space-y-4">
            <p><strong>CV. ABADI DEWANA INDUSTRIAL EQUIPMENT</strong> terdaftar secara sah secara hukum dan memiliki status <strong>PKP Aktif</strong> yang berhak menerbitkan Faktur Pajak resmi untuk transaksi pengadaan B2B pabrik Anda.</p>
            <p className="pt-4 border-t border-gray-700">
              &copy; {new Date().getFullYear()} CV. ABADI DEWANA. Hak Cipta Dilindungi Undang-Undang.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
