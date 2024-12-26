import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { vi } from 'vitest'
import Message from './Message'

describe('Message', () => {
  beforeEach(() => {
    vi.useFakeTimers() // Mock timers before each test
  })

  it('renders the message when the "message" prop is provided', () => {
    render(<Message message="Test message" variant="success" onClose={() => {}} />)

    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('does not render anything when the "message" prop is empty', () => {
    render(<Message message="" variant="success" onClose={() => {}} />)

    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('calls "onClose" when the close button is clicked', () => {
    const onCloseMock = vi.fn()

    render(<Message message="Test message" variant="success" onClose={onCloseMock} />)

    fireEvent.click(screen.getByRole('button'))

    expect(onCloseMock).toHaveBeenCalled()
  })

  it('cleans up the timer on unmount', () => {
    const onCloseMock = vi.fn()

    const { unmount } = render(<Message message="Test message" variant="success" onClose={onCloseMock} />)

    unmount()

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(onCloseMock).not.toHaveBeenCalled()
  })
})
