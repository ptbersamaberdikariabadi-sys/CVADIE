'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, X, Menu, ChevronRight } from 'lucide-react'
import CartIcon from './CartIcon'

const NAV_LINKS = [
  { href: '/', label: 'BERANDA' },
  { href: '/products', label: 'KATALOG PRODUK' },
  { href: '/about', label: 'TENTANG KAMI' },
  { href: '/services', label: 'LAYANAN' },
]

export default function Header() {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus()
  }, [searchOpen])

  // Close mobile menu on route change (escape key)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!searchValue.trim()) return
    router.push(`/products?q=${encodeURIComponent(searchValue.trim())}`)
    setSearchOpen(false)
    setSearchValue('')
  }, [searchValue, router])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" onClick={() => setMobileOpen(false)}>
            <Image
              src="/logo.jpeg"
              alt="Logo CV. ADIE"
              width={160}
              height={48}
              className="object-contain h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-sm text-gray-700" aria-label="Menu utama">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-brand-primary transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search — opens overlay */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Buka pencarian"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            <CartIcon />

            <Link
              href="/rfq"
              className="hidden sm:inline-flex bg-brand-accent hover:bg-amber-600 text-white px-5 py-2.5 rounded-md font-semibold text-sm transition-colors whitespace-nowrap"
              onClick={() => setMobileOpen(false)}
            >
              MINTA PENAWARAN (RFQ)
            </Link>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen
                ? <X className="w-6 h-6 text-gray-700" />
                : <Menu className="w-6 h-6 text-gray-700" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Drawer ───────────────────────────────────────────── */}
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <div
        id="mobile-menu"
        className={[
          'fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col md:hidden',
          'transition-transform duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!mobileOpen}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b bg-brand-primary">
          <Image src="/logo.jpeg" alt="Logo CV. ADIE" width={120} height={36} className="h-9 w-auto object-contain brightness-200" />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-white/80 hover:text-white"
            aria-label="Tutup menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 overflow-y-auto py-4" aria-label="Menu mobile">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-6 py-4 text-gray-800 font-medium hover:bg-gray-50 hover:text-brand-primary transition-colors border-b border-gray-100 last:border-0"
            >
              {link.label}
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </nav>

        {/* Drawer Footer — CTA */}
        <div className="p-5 border-t bg-gray-50">
          <Link
            href="/rfq"
            onClick={() => setMobileOpen(false)}
            className="w-full flex items-center justify-center bg-brand-accent hover:bg-amber-600 text-white px-6 py-3.5 rounded-md font-bold text-sm transition-colors"
          >
            MINTA PENAWARAN (RFQ)
          </Link>
          <p className="text-xs text-gray-500 text-center mt-3">WhatsApp: 0812-1461-4097</p>
        </div>
      </div>

      {/* ── Search Overlay ────────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-3 px-5 py-4 border-b">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Cari part number, nama produk, atau brand..."
                className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
                aria-label="Cari produk"
              />
              <button
                type="button"
                onClick={() => { setSearchOpen(false); setSearchValue('') }}
                className="p-1 text-gray-400 hover:text-gray-700"
                aria-label="Tutup pencarian"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="px-5 py-3 text-xs text-gray-500 flex gap-3">
              <span>Contoh: <button type="button" onClick={() => { setSearchValue('FESTO'); }} className="underline text-brand-primary hover:text-brand-accent">FESTO</button></span>
              <span><button type="button" onClick={() => { setSearchValue('solenoid valve'); }} className="underline text-brand-primary hover:text-brand-accent">solenoid valve</button></span>
              <span><button type="button" onClick={() => { setSearchValue('inverter'); }} className="underline text-brand-primary hover:text-brand-accent">inverter</button></span>
            </div>
            <div className="px-5 py-3 bg-gray-50 border-t">
              <button
                type="submit"
                form=""
                onClick={handleSearch}
                className="w-full bg-brand-primary hover:bg-brand-accent text-white font-bold py-3 rounded-md transition-colors text-sm"
              >
                Cari di Katalog Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
