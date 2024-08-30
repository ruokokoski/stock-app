import { useEffect} from 'react'
import { Alert } from 'react-bootstrap'

const Message = ({ message, variant, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 10000)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <Alert variant={variant} onClose={onClose} dismissible>
      {message}
    </Alert>
  )
}

export default Message