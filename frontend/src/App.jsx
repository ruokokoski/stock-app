import axios from 'axios'
import { useState, useEffect } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import Markets from './components/Markets'
import IndexPage from './components/IndexPage'
import Crypto from './components/Crypto'
import Users from './components/Users'
import Password from './components/Password'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import NavigationBar from './components/NavigationBar'
import Marquee from './components/Marquee'
import loginService from './services/login'
import logoutService from './services/logout'
import userService from './services/users'
import signupService from './services/signup'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  //const [message, setMessage] = useState(null)

  axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        console.log('Token expired or invalid')
        window.localStorage.removeItem('loggedStockappUser')
        setUser(null)
        navigate('/login')
      }
      return Promise.reject(error)
    }
  )

  useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedStockappUser')
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON)
			if (user.token) {
        setUser(user)
        //stockService.setToken(user.token)
        userService.setToken(user.token)
        console.log('Token is in localstorage')
      } else {
        console.log('No token found in localStorage')
      }
		}
    setLoading(false)
	}, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
				username,
				password,
			})
      console.log('Logged in user:', user)
      setUser(user)
      window.localStorage.setItem(
        'loggedStockappUser', JSON.stringify(user)
      )
      userService.setToken(user.token)
      navigate('/')
    } catch (error) {
      console.log('Login failed', error)
      throw error
    }    
  }

  const handleSignup = async (name, username, password) => {
    //console.log('Signing up with', name, username, password)
    try {
      await signupService.signup({ name, username, password })
      navigate('/login', { state: { message: 'User created successfully. Please log in.', variant: 'success' } })
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <NavigationBar user={user} onLogout={handleLogout} />
      <Marquee />
      <Container className="mt-10">
        <Routes>
          <Route path="/" element={user ? <Markets /> : <Navigate replace to="/login" />} />
          <Route path="/index/:ticker" element={<IndexPage />} />
          <Route path="/crypto" element={user ? <Crypto /> : <Navigate replace to="/login" />} />
          <Route path="/users" element={user ? (user.admin ? <Users /> : <Navigate replace to="/" />) : <Navigate replace to="/login" />} />
          <Route path="/change-password" element={user ? <Password /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm onSignup={handleSignup} />} />
        </Routes>
      </Container>
    </>
  )
}

export default App