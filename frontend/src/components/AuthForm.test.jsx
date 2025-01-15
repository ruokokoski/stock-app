import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import AuthForm from './AuthForm'

describe('AuthForm Component', () => {
  it('renders with given title and button label', () => {
    const handleSubmit = vi.fn()

    render(
      <AuthForm
        title="Login"
        titleSize="2rem"
        message="Test message"
        messageVariant="success"
        onCloseMessage={vi.fn()}
        onSubmit={handleSubmit}
      >
        <div>Form content</div>
      </AuthForm>
    )

    expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument()

    const button = screen.getByRole('button', { name: /Login/i })
    fireEvent.click(button)

    expect(handleSubmit).toHaveBeenCalled()
  })
})
