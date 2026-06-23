import Link from 'next/link'
import { Search } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="font-serif font-bold text-2xl text-brand-primary">
            CV. ABADI DEWANA
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
          <Link href="/" className="hover:text-brand-primary transition-colors">BERANDA</Link>
          <Link href="/about" className="hover:text-brand-primary transition-colors">TENTANG KAMI</Link>
          <div className="relative group cursor-pointer">
            <Link href="/products" className="hover:text-brand-primary transition-colors">PRODUK</Link>
          </div>
          <Link href="/services" className="hover:text-brand-primary transition-colors">LAYANAN</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Search">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <Link 
            href="/rfq" 
            className="bg-brand-accent hover:bg-amber-600 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-colors"
          >
            MINTA PENAWARAN (RFQ)
          </Link>
        </div>
      </div>
    </header>
  )
}
