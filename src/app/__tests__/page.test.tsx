import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Page from '../(public)/page'

// Mock Next.js headers/cookies
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    getAll: vi.fn(() => []),
  })),
}))

// Mock Supabase server client
vi.mock('@/utils/supabase/server', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({ data: null }), // Simulate no CMS data (will use fallbacks)
    }),
  }),
}))

describe('Home Page', () => {
  it('renders the hero section with headings and buttons', async () => {
    const ResolvedPage = await Page()
    render(ResolvedPage)
    
    // Hero Title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Partner Solusi Suku Cadang/i)
    
    // Buttons
    expect(screen.getByRole('link', { name: /MINTA PENAWARAN \(RFQ\)/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /JELAJAHI KATALOG PRODUK/i })).toBeInTheDocument()
  })

  it('renders the trust grid section', async () => {
    const ResolvedPage = await Page()
    render(ResolvedPage)
    expect(screen.getByText(/Jaminan Garansi Riil Penggantian 100%/i)).toBeInTheDocument()
    expect(screen.getByText(/Solusi Global Sourcing Part Langka/i)).toBeInTheDocument()
  })

  it('renders the urgent CTA banner', async () => {
    const ResolvedPage = await Page()
    render(ResolvedPage)
    expect(screen.getByText(/PUNYA KEBUTUHAN MENDESAK UNTUK MENCEGAH DOWNTIME\?/i)).toBeInTheDocument()
  })
})
