import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../styles/styles.css'

const SignupForm = ({ onSignup }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const handleSignup = (event) => {
    event.preventDefault()
    if (password === confirmPassword) {
      onSignup(name, username, password)
      setShowAlert(false)
    } else {
      setShowAlert(true)
    }
  }

  return (
    <div className='form-container'>
      <Form
        onSubmit={handleSignup}
        autoComplete="off"
        style={{
          width: '100%',
          maxWidth: '400px',
        }}
      >
        <h1>Signup</h1>

        {showAlert && (
          <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
            Passwords do not match!
          </Alert>
        )}
        
        <Form.Group controlId="userName">
          <Form.Label style={{ marginTop: '10px', marginBottom: '3px' }}>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            placeholder="full name"
            onChange={({ target }) => setName(target.value)}
            autoComplete="off"
          />
        </Form.Group>

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

        <Form.Group controlId="userConfirmPassword">
          <Form.Label style={{ marginTop: '10px', marginBottom: '3px' }}>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            placeholder="confirm password"
            onChange={({ target }) => setConfirmPassword(target.value)}
            autoComplete="off"
          />
        </Form.Group>

        <Button type="submit" className="gradient-button">
          Signup
        </Button>

        <p>
          Already have an account?{' '}
          <Link to="/">Login</Link>
        </p>
      </Form>
    </div>
  )
}

export default SignupForm
