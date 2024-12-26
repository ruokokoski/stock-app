import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Password from './Password'
import { vi } from 'vitest'

vi.mock('../services/users', () => ({
    changePassword: vi.fn(),
    setToken: vi.fn(),
    getAllUsers: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
}))

describe('Password Component', () => {
  it('renders password change form correctly', () => {
    render(<Password />)
    expect(screen.getByRole('heading', { name: /Change Password/i })).toBeInTheDocument()
  })
})
