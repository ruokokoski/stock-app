import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
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
})
