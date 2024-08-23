import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    onLogin(username, password)
  }

  return (
    <Form onSubmit={handleLogin} autoComplete="off">
      <Form.Group controlId="userEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          placeholder="username"
          onChange={({ target }) => setUsername(target.value)}
          autoComplete="off"
          style={{ maxWidth: '400px' }}
        />
      </Form.Group>

      <Form.Group controlId="userPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          placeholder="Password"
          onChange={({ target }) => setPassword(target.value)}
          autoComplete="off"
          style={{ maxWidth: '400px' }}
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Login
      </Button>
    </Form>
  )
}

export default LoginForm