import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
//import { FaUserCircle, FaLock, FaEnvelope } from 'react-icons/fa'
import Message from './Message'
import '../styles/styles.css'

const SignupForm = ({ onSignup }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageVariant, setMessageVariant] = useState('')

  const isEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const handleSignup = async (event) => {
    event.preventDefault()
    if (!name || !username || !password || !confirmPassword) {
      setMessageVariant('danger')
      setMessage('All fields are required!')
      return
    }
    if (!isEmail(username)) {
      setMessageVariant('danger')
      setMessage('Invalid email address!')
      return
    }
    if (password !== confirmPassword) {
      setMessageVariant('danger')
      setMessage('Passwords do not match!')
      return
    }
    try {
      await onSignup(name, username, password)
      setName('')
      setUsername('')
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Signup failed:', error)
      setMessage('Signup failed.')
      setMessageVariant('danger')
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

        <Message 
          message={message} 
          variant={messageVariant}
          onClose={() => setMessage('')} 
        />
        
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
