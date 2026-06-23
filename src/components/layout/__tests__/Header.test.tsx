import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Header'

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />)
    
    // Check for logo text or alt text
    expect(screen.getByText(/CV. ABADI DEWANA/i)).toBeInTheDocument()
    
    // Check for navigation links
    expect(screen.getByRole('link', { name: /BERANDA/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /TENTANG KAMI/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /PRODUK/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /LAYANAN/i })).toBeInTheDocument()
    
    // Check for RFQ button
    expect(screen.getByRole('link', { name: /MINTA PENAWARAN/i })).toBeInTheDocument()
  })
})
