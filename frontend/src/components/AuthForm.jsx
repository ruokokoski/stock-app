import { Form, Button } from 'react-bootstrap'
import Message from './Message'

const AuthForm = ({ title, titleSize = '2rem', message, messageVariant, onCloseMessage, onSubmit, children, footer }) => (
  <div className="form-container">
    <Form onSubmit={onSubmit} autoComplete="off" style={{ width: '100%', maxWidth: '400px' }}>
      <h1 style={{ fontSize: titleSize }}>{title}</h1>
      <Message message={message} variant={messageVariant} onClose={onCloseMessage} />
      {children}
      <Button type="submit" className="gradient-button" style={{ marginTop: '15px' }}>
        {title}
      </Button>
      {footer}
    </Form>
  </div>
)

export default AuthForm
