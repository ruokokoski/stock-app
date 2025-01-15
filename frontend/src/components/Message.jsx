import { useEffect} from 'react'
import { Alert } from 'react-bootstrap'
import '../styles/styles.css'

const Message = ({ message, variant, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <Alert variant={variant} onClose={onClose} dismissible className="custom-message">
      {message}
    </Alert>
  )
}

export default Message