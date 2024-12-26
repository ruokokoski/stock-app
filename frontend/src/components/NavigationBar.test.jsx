import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import NavigationBar from './NavigationBar'
import { BrowserRouter as Router } from 'react-router-dom'

const mockOnLogout = vi.fn()

describe('NavigationBar', () => {
  it('should render navigation links for logged-in user', async () => {
    const user = { name: 'John', admin: false }
    
    render(
      <Router>
        <NavigationBar user={user} onLogout={mockOnLogout} />
      </Router>
    )

    await waitFor(() => screen.getByText(/Markets/i))
    await waitFor(() => screen.getByText(/Crypto/i))
    
    expect(screen.getByText(/Markets/i)).toBeInTheDocument()
    expect(screen.getByText(/Crypto/i)).toBeInTheDocument()
    expect(screen.queryByText(/Users/i)).toBeNull()
  })

  it('should render navigation links for non-logged-in user', async () => {
    render(
      <Router>
        <NavigationBar user={null} onLogout={mockOnLogout} />
      </Router>
    )

    await waitFor(() => screen.getByText(/Login/i))
    await waitFor(() => screen.getByText(/Signup/i))

    expect(screen.getByText(/Login/i)).toBeInTheDocument()
    expect(screen.getByText(/Signup/i)).toBeInTheDocument()
    expect(screen.queryByText(/Markets/i)).toBeNull()
  })

  it('should render "Users" link for admin user', async () => {
    const user = { name: 'Admin', admin: true }
    
    render(
      <Router>
        <NavigationBar user={user} onLogout={mockOnLogout} />
      </Router>
    )

    await waitFor(() => screen.getByText(/Users/i))

    expect(screen.getByText(/Users/i)).toBeInTheDocument()
  })
})
