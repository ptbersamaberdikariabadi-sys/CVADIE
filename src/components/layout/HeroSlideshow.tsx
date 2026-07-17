'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Slide {
  image_url: string
  alt?: string
  is_logo?: boolean // jika true, render sebagai <Image> centered (bukan background)
}

interface HeroSlideshowProps {
  /** Array slide dari CMS. Jika kosong [], tampilkan latar statis. */
  slides?: Slide[]
  /** Durasi per slide dalam milidetik. Default: 5000 (5 detik). */
  intervalMs?: number
}

/**
 * HeroSlideshow — background slideshow dengan crossfade & Ken Burns effect.
 *
 * Slide pertama adalah logo CV.ADIE yang ditampilkan centered di atas overlay.
 * Slide selanjutnya adalah foto industri sebagai background penuh.
 */
export default function HeroSlideshow({
  slides,
  intervalMs = 5000,
}: HeroSlideshowProps) {
  const activeSlides = slides || []
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToSlide = useCallback((idx: number) => {
    setCurrentIndex(idx)
  }, [])

  // Auto-advance slideshow
  useEffect(() => {
    if (activeSlides.length === 0) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
    }, intervalMs)
    return () => clearInterval(timer)
  }, [activeSlides.length, intervalMs])

  if (activeSlides.length === 0) {
    return <div className="absolute inset-0 bg-brand-primary" />
  }

  return (
    // Sits at z-0 — below dark overlay (z-10) and hero content (z-20)
    <div className="absolute inset-0 overflow-hidden">
      {/* ── Slide layers stacked and toggled via CSS opacity ───── */}
      {activeSlides.map((slide, idx) => {
        const isActive = idx === currentIndex

        // Slide logo: background gelap + logo centered
        if (slide.is_logo) {
          return (
            <div
              key={idx}
              aria-hidden={!isActive}
              style={{
                opacity: isActive ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
              }}
              className="absolute inset-0 bg-brand-primary flex items-center justify-center"
            >
              <Image
                src={slide.image_url}
                alt={slide.alt ?? 'Logo CV. ADIE'}
                width={340}
                height={120}
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          )
        }

        // Slide foto: background penuh dengan Ken Burns
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
              animation: 'kenBurns 14s ease-in-out infinite',
              animationDelay: `${idx * -3.5}s`,
            }}
            className="absolute inset-0 bg-cover bg-center will-change-transform"
          />
        )
      })}

      {/* ── Navigation dots ─────────────────────────────────────── */}
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
