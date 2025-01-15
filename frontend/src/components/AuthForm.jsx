import { Form, Button } from 'react-bootstrap'

const AuthForm = ({ title, titleSize = '2rem', onSubmit, children, footer }) => (
  <div className="form-container">
    <Form onSubmit={onSubmit} autoComplete="off" style={{ width: '100%', maxWidth: '400px' }}>
      <h1 style={{ fontSize: titleSize }}>{title}</h1>
      {children}
      <Button type="submit" className="gradient-button" style={{ marginTop: '15px' }}>
        {title}
      </Button>
      {footer}
    </Form>
  </div>
)

export default AuthForm
