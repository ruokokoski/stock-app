import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import SignupForm from './SignupForm'

describe('SignupForm', () => {
  it('renders the header "Signup"', () => {
    render(
      <MemoryRouter>
        <SignupForm onSignup={() => {}} />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /Signup/i })).toBeInTheDocument()
  })

  it('shows an error message if any required field is missing', () => {
    render(
      <MemoryRouter>
        <SignupForm onSignup={() => {}} />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByRole('button', { name: /Signup/i }))

    expect(screen.getByText(/All fields are required!/i)).toBeInTheDocument()
  })

  it('clears the form after a successful signup', async () => {
    const onSignupMock = vi.fn().mockResolvedValueOnce()
  
    render(
      <MemoryRouter>
        <SignupForm onSignup={onSignupMock} />
      </MemoryRouter>
    )
  
    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } }) // "Password" field
    fireEvent.change(screen.getByPlaceholderText('confirm password'), { target: { value: 'password123' } }) // "Confirm Password" field
  
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Signup/i }))
    })
  
    expect(onSignupMock).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123')
    expect(screen.getByPlaceholderText(/full name/i)).toHaveValue('')
    expect(screen.getByPlaceholderText(/email address/i)).toHaveValue('')
    expect(screen.getByPlaceholderText('password')).toHaveValue('')
    expect(screen.getByPlaceholderText('confirm password')).toHaveValue('')
  })
  
  it('shows an error message for invalid email address', () => {
    render(
      <MemoryRouter>
        <SignupForm onSignup={() => {}} />
      </MemoryRouter>
    )
  
    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'invalid-email' } })
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('confirm password'), { target: { value: 'password123' } })
  
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }))
  
    expect(screen.getByText(/Invalid email address!/i)).toBeInTheDocument()
  })

  it('shows an error message when passwords do not match', () => {
    render(
      <MemoryRouter>
        <SignupForm onSignup={() => {}} />
      </MemoryRouter>
    )
  
    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('confirm password'), { target: { value: 'password456' } })
  
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }))
  
    expect(screen.getByText(/Passwords do not match!/i)).toBeInTheDocument()
  })

  it('calls onSignup function with correct arguments on successful signup', async () => {
    const onSignupMock = vi.fn().mockResolvedValueOnce()
  
    render(
      <MemoryRouter>
        <SignupForm onSignup={onSignupMock} />
      </MemoryRouter>
    )
  
    fireEvent.change(screen.getByPlaceholderText(/full name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'password123' } })
    fireEvent.change(screen.getByPlaceholderText('confirm password'), { target: { value: 'password123' } })
  
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Signup/i }))
    })
  
    expect(onSignupMock).toHaveBeenCalledWith('Test User', 'test@example.com', 'password123')
  })

  it('closes the error message when the close button is clicked', () => {
    render(
      <MemoryRouter>
        <SignupForm onSignup={() => {}} />
      </MemoryRouter>
    )
  
    fireEvent.click(screen.getByRole('button', { name: /Signup/i }))
  
    expect(screen.getByText(/All fields are required!/i)).toBeInTheDocument()
  
    fireEvent.click(screen.getByRole('button', { name: /Close/i })) // Assuming the close button has this label
    expect(screen.queryByText(/All fields are required!/i)).not.toBeInTheDocument()
  })

  it('does not call onSignup if fields are empty', async () => {
    const onSignupMock = vi.fn()
  
    render(
      <MemoryRouter>
        <SignupForm onSignup={onSignupMock} />
      </MemoryRouter>
    )
  
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Signup/i }))
    })
  
    expect(onSignupMock).not.toHaveBeenCalled()
    expect(screen.getByText(/All fields are required!/i)).toBeInTheDocument()
  })  
})
