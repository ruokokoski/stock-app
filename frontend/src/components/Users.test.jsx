import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import Users from './Users'
import userService from '../services/users'

vi.mock('../services/users')

describe('Users component', () => {
  it('renders users correctly', async () => {
    userService.getAllUsers.mockResolvedValue([
      { id: 1, name: 'John Doe', username: 'johndoe', admin: false, disabled: false },
      { id: 2, name: 'Jane Smith', username: 'janesmith', admin: true, disabled: false }
    ])

    render(<Users />)

    await waitFor(() => screen.getByText('John Doe'))
    await waitFor(() => screen.getByText('Jane Smith'))

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('johndoe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('janesmith')).toBeInTheDocument()
  })
})
