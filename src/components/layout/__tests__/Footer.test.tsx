import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders contact, quick links, and copyright', () => {
    render(<Footer />)
    
    // Contact Info
    expect(screen.getByText(/Kontak & Dukungan/i)).toBeInTheDocument()
    expect(screen.getByText(/Kantor & Workshop/i)).toBeInTheDocument()
    expect(screen.getByText(/Legalitas/i)).toBeInTheDocument()
  })
})
