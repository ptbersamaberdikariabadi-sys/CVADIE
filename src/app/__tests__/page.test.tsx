import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Page from '../page'

describe('Home Page', () => {
  it('renders the hero section with headings and buttons', () => {
    render(<Page />)
    
    // Hero Title
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Mitra Terpercaya Pengadaan Komponen/i)
    
    // Buttons
    expect(screen.getByRole('link', { name: /MINTA PENAWARAN \(RFQ\)/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /JELAJAHI KATALOG PRODUK/i })).toBeInTheDocument()
  })

  it('renders the trust grid section', () => {
    render(<Page />)
    expect(screen.getByText(/99.8% On-Time Delivery Rate/i)).toBeInTheDocument()
    expect(screen.getByText(/100% Jaminan Produk Orisinal/i)).toBeInTheDocument()
  })

  it('renders the urgent CTA banner', () => {
    render(<Page />)
    expect(screen.getByText(/PUNYA KEBUTUHAN URGENT UNTUK PROYEK PABRIK ANDA\?/i)).toBeInTheDocument()
  })
})
