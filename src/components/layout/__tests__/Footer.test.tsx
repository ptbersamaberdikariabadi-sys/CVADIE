import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders contact, quick links, and copyright', () => {
    render(<Footer />)
    
    // Contact Info
    expect(screen.getByText(/Hubungi Kami/i)).toBeInTheDocument()
    expect(screen.getByText(/Tautan Cepat/i)).toBeInTheDocument()
    expect(screen.getByText(/Hak Cipta/i)).toBeInTheDocument()
  })
})
