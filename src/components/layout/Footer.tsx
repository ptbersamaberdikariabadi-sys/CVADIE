import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-primary text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Area 1: Contact */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Hubungi Kami</h3>
          <address className="not-italic text-gray-300 space-y-2 text-sm">
            <p>CV. ABADI DEWANA Industrial Equipment</p>
            <p>Kawasan Industri Terpadu</p>
            <p>Email: sales@abadidewana.com</p>
            <p>Telepon: +62 811-0000-0000</p>
          </address>
        </div>

        {/* Area 2: Quick Links */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Tautan Cepat</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/sitemap" className="hover:text-white transition-colors">Site Map</Link></li>
          </ul>
        </div>

        {/* Area 3: Copyright & Legal */}
        <div>
          <h3 className="font-serif font-bold text-xl mb-4 text-brand-accent">Legalitas</h3>
          <div className="text-sm text-gray-300 space-y-4">
            <p>Perusahaan bersertifikat ISO dan PKP Resmi. Siap melayani pengadaan pabrik skala besar.</p>
            <p>&copy; {new Date().getFullYear()} CV. ABADI DEWANA. Hak Cipta Dilindungi Undang-Undang.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
