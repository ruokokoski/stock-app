import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from './LoginForm'

describe('LoginForm', () => {
  it('renders the header "Login"', () => {

    render(
      <MemoryRouter>
          <LoginForm onLogin={() => {}} />
      </MemoryRouter>
    )
  
    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument()
  })

  it('shows an error message if username or password is not provided', () => {
    render(
      <MemoryRouter>
        <LoginForm onLogin={() => {}} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Login/i }))

    expect(screen.getByText(/Please enter both username and password\./i)).toBeInTheDocument()
  })

  it('calls the onLogin function with username and password on submit', async () => {
    const onLoginMock = vi.fn().mockResolvedValueOnce()
    render(
      <MemoryRouter>
        <LoginForm onLogin={onLoginMock} />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testuser' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Login/i }))
    })

    expect(onLoginMock).toHaveBeenCalledWith('testuser', 'password123')
  })

  it('displays an error message if login fails', async () => {
    const onLoginMock = vi.fn().mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } })
    render(
      <MemoryRouter>
        <LoginForm onLogin={onLoginMock} />
      </MemoryRouter>
    )

    fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'wronguser' } })
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpassword' } })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Login/i }))
    })

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument()
  })
})
