import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaUserCircle, FaLock } from 'react-icons/fa'
import AuthForm from './AuthForm'
import AuthInput from './AuthInput'
import '../styles/styles.css'

const LoginForm = ({ onLogin, setMessage, setMessageVariant }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [message, setMessage] = useState('')
  //const [messageVariant, setMessageVariant] = useState('')

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
      setMessage(`${username} logged in`)
      setMessageVariant('success')
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
    <AuthForm
      title="Login"
      onSubmit={handleSubmit}
      footer={
        <p>
          Don&#39;t have an account? <Link to="/signup">Signup</Link>
        </p>
      }
    >
      <AuthInput
        controlId="userEmail"
        label="Username"
        type="text"
        value={username}
        placeholder="email address"
        onChange={(e) => setUsername(e.target.value)}
        icon={FaUserCircle}
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
    </AuthForm>
  )
}

export default LoginForm