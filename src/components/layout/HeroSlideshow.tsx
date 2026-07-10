'use client'

import { useState, useEffect, useCallback } from 'react'

interface Slide {
  image_url: string
  alt?: string
}

// ── Default industrial background slides ──────────────────────────
// Gambar dapat diganti via CMS Admin di hero_section.slides[]
const DEFAULT_SLIDES: Slide[] = [
  {
    image_url:
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80&auto=format&fit=crop',
    alt: 'Teknisi di fasilitas manufaktur modern',
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80&auto=format&fit=crop',
    alt: 'Mesin industri berat di pabrik',
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920&q=80&auto=format&fit=crop',
    alt: 'Lini produksi otomasi elektronik',
  },
  {
    image_url:
      'https://images.unsplash.com/photo-1565596003821-4b52b84f55a9?w=1920&q=80&auto=format&fit=crop',
    alt: 'Sistem pneumatik & komponen industri',
  },
]

interface HeroSlideshowProps {
  /** Array slide dari CMS. Jika kosong/undefined, pakai DEFAULT_SLIDES. */
  slides?: Slide[]
  /** Durasi per slide dalam milidetik. Default: 5000 (5 detik). */
  intervalMs?: number
}

/**
 * HeroSlideshow — background slideshow dengan crossfade & Ken Burns effect.
 *
 * Dirender sebagai Client Component karena memerlukan useState/useEffect.
 * Posisi absolute mengisi parent `relative` — konten hero tetap di Server
 * Component, di atas overlay (z-10) dan di atas slideshow (z-0).
 */
export default function HeroSlideshow({
  slides,
  intervalMs = 5000,
}: HeroSlideshowProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToSlide = useCallback((idx: number) => {
    setCurrentIndex(idx)
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [activeSlides.length, intervalMs])

  return (
    // Sits at z-0 — below dark overlay (z-10) and hero content (z-20)
    <div className="absolute inset-0 overflow-hidden">
      {/* ── Slide layers stacked and toggled via CSS opacity ───── */}
      {activeSlides.map((slide, idx) => {
        const isActive = idx === currentIndex
        return (
          <div
            key={idx}
            role="img"
            aria-label={slide.alt ?? `Slide industri ${idx + 1}`}
            aria-hidden={!isActive}
            style={{
              backgroundImage: `url(${slide.image_url})`,
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              // Ken Burns: continuous slow zoom so the effect is always live
              animation: 'kenBurns 14s ease-in-out infinite',
              // Stagger each slide so they don't all pulse in sync
              animationDelay: `${idx * -3.5}s`,
            }}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
          />
        )
      })}

      {/* ── Navigation dots ─────────────────────────────────────── */}
      {/* z-30: above the dark overlay (z-10) and hero text (z-20)  */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30"
        role="tablist"
        aria-label="Navigasi slide hero"
      >
        {activeSlides.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={idx === currentIndex}
            aria-label={`Tampilkan slide ${idx + 1}`}
            onClick={() => goToSlide(idx)}
            className={[
              'h-2 rounded-full transition-all duration-300',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-white',
              idx === currentIndex
                ? 'w-6 bg-amber-500'
                : 'w-2 bg-white/50 hover:bg-white/80',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
