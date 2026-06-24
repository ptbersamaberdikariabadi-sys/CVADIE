import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Header'
import { CartProvider } from '@/context/CartContext'

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(
      <CartProvider>
        <Header />
      </CartProvider>
    )
    
    // Check for logo alt text
    expect(screen.getByAltText(/Logo CV. ADIE/i)).toBeInTheDocument()
    
    // Check for navigation links
    expect(screen.getByRole('link', { name: /BERANDA/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /TENTANG KAMI/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /PRODUK/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /LAYANAN/i })).toBeInTheDocument()
    
    // Check for RFQ button
    expect(screen.getByRole('link', { name: /MINTA PENAWARAN/i })).toBeInTheDocument()
  })
})
