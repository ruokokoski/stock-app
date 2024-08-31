import { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import Message from './Message'
import '../styles/styles.css'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageVariant, setMessageVariant] = useState('')

  const location = useLocation()

  useEffect(() => {
    // Check if there is a message in the location state
    if (location.state?.message && location.state?.variant) {
      setMessage(location.state.message)
      setMessageVariant(location.state.variant)
    }
  }, [location.state])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!username || !password) {
      setMessage('Please enter both username and password.')
      setMessageVariant('danger')
      return
    }

    try {
      await onLogin(username, password)
      setUsername('')
      setPassword('')
      setMessage('')
      setMessageVariant('')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error)
        setMessageVariant('danger')
      } else {
        setMessage('Login failed.')
        setMessageVariant('danger')
      }
    }
  }

  return (
    <div className='form-container'>
    
      <Form
        onSubmit={handleSubmit}
        autoComplete="off"
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1>Login</h1>

        <Message 
          message={message} 
          variant={messageVariant} 
          onClose={() => setMessage('')} 
        />

        <Form.Group controlId="userEmail">
          <Form.Label style={{ marginTop: '10px', marginBottom: '3px' }}>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            placeholder="email address"
            onChange={({ target }) => setUsername(target.value)}
            autoComplete="off"
          />
        </Form.Group>

        <Form.Group controlId="userPassword">
          <Form.Label style={{ marginTop: '10px', marginBottom: '3px' }}>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="password"
            onChange={({ target }) => setPassword(target.value)}
            autoComplete="off"
          />
        </Form.Group>

        <Button type="submit" className="gradient-button">
          Login
        </Button>

        <p>
          Don&#39;t have an account?{' '}
          <Link to="/signup">Signup</Link>
        </p>
      </Form>
    </div>
  )
}

export default LoginForm