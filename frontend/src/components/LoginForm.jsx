import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles/styles.css'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(username, password)
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
          Don't have an account?{' '}
          <Link to="/signup">Signup</Link>
        </p>
      </Form>
    </div>
  )
}

export default LoginForm