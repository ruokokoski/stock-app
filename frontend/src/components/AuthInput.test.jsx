import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import AuthInput from './AuthInput'
import { FaLock } from 'react-icons/fa'

describe('AuthInput Component', () => {
  it('renders correctly with given props', () => {
    const handleChange = vi.fn()

    render(
      <AuthInput
        controlId="password"
        label="Password"
        type="password"
        value="mysecretpassword"
        placeholder="Enter your password"
        onChange={handleChange}
        icon={FaLock}
      />
    )

    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter your password/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter your password/i)).toHaveValue('mysecretpassword')
    expect(screen.getByPlaceholderText(/Enter your password/i).type).toBe('password')
  })
})
