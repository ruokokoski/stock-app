import { useState, useEffect } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import Markets from './components/Markets'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import NavigationBar from './components/NavigationBar'
import loginService from './services/login'
import logoutService from './services/logout'
import stockService from './services/stocks'
import signupService from './services/signup'

const App = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  //const [message, setMessage] = useState(null)

  useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedStockappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			setUser(user)
			stockService.setToken(user.token)
		}
	}, [])

  const handleLogin = async (username, password) => {
    console.log('Logging in with', username, password)
    try {
      const user = await loginService.login({
				username,
				password,
			})
      console.log('Logging in with', username)
      setUser(user)
      window.localStorage.setItem(
        'loggedStockappUser', JSON.stringify(user)
      )
      navigate('/')
    } catch (error) {
      console.log('Login failed', error)
      throw error
    }
    
  }

  const handleSignup = async (name, username, password) => {
    console.log('Signing up with', name, username, password)
    try {
      await signupService.signup({ name, username, password })
      navigate('/login')
    } catch (error) {
      console.log('Signup failed', error)
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedStockappUser')
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON)
        await logoutService.logout(user.token)
        setUser(null)
        window.localStorage.removeItem('loggedStockappUser')
        console.log('Logout successful')
        navigate('/login')
      }
    } catch (error) {
      console.log('Logout failed', error)
    }
  }

  return (
    <>
      <NavigationBar user={user} onLogout={handleLogout} />
      <Container className="mt-10">
        <Routes>
          <Route path="/" element={user ? <Markets /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm onSignup={handleSignup} />} />
        </Routes>
      </Container>
    </>
  )
}

export default App