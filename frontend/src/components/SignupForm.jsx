import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUserCircle, FaLock, FaEnvelope } from 'react-icons/fa'
import AuthForm from './AuthForm'
import AuthInput from './AuthInput'
import '../styles/styles.css'

const SignupForm = ({ onSignup, setMessage, setMessageVariant }) => {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  //const [message, setMessage] = useState('')
  //const [messageVariant, setMessageVariant] = useState('')

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
    <AuthForm
      title="Signup"
      onSubmit={handleSignup}
      footer={
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      }
    >
      <AuthInput
        controlId="userName"
        label="Name"
        type="text"
        value={name}
        placeholder="full name"
        onChange={(e) => setName(e.target.value)}
        icon={FaUserCircle}
      />
      <AuthInput
        controlId="userEmail"
        label="Username"
        type="text"
        value={username}
        placeholder="email address"
        onChange={(e) => setUsername(e.target.value)}
        icon={FaEnvelope}
      />
      <AuthInput
        controlId="userPassword"
        label="Password"
        type="password"
        value={password}
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
        icon={FaLock}
      />
      <AuthInput
        controlId="userConfirmPassword"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        placeholder="confirm password"
        onChange={(e) => setConfirmPassword(e.target.value)}
        icon={FaLock}
      />
    </AuthForm>
  )
}

export default SignupForm
