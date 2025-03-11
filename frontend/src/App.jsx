import axios from 'axios'
import { useState, useEffect } from 'react'
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import Markets from './components/Markets'
import IndexPage from './components/IndexPage'
import Stocks from './components/Stocks'
import StockPage from './components/StockPage'
import Watchlist from './components/Watchlist'
import Database from './components/Database'
import Crypto from './components/Crypto'
import Links from './components/Links'
import Users from './components/Users'
import Password from './components/Password'
import Name from './components/Name'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import NavigationBar from './components/NavigationBar'
import Marquee from './components/Marquee'
import Message from './components/Message'
import loginService from './services/login'
import logoutService from './services/logout'
//import userService from './services/users'
import signupService from './services/signup'

const App = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [message, setMessage] = useState('')
  const [messageVariant, setMessageVariant] = useState('')

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
        //userService.setToken(user.token)
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
      //console.log('Logged in user:', user)
      setUser(user)
      window.localStorage.setItem(
        'loggedStockappUser', JSON.stringify(user)
      )
      //userService.setToken(user.token)
      navigate('/')
      setMessage('logged in.')
      setMessageVariant('success')
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed.')
      setMessageVariant('danger')
      throw error
    }    
  }

  const handleSignup = async (name, username, password) => {
    //console.log('Signing up with', name, username, password)
    try {
      await signupService.signup({ name, username, password })
      navigate('/login', { state: { message: 'User created successfully. Please log in.', variant: 'success' } })
    } catch (error) {
      //console.log('Signup failed', error)
      setMessage('Signup failed.')
      setMessageVariant('danger')
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
        //console.log('Logout successful')
        navigate('/login')
        setMessage('Logout successful')
        setMessageVariant('success')
      }
    } catch (error) {
      console.log('Logout failed', error)
      setMessage('Logout failed!')
      setMessageVariant('danger')
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <NavigationBar user={user} onLogout={handleLogout} />
      <Marquee />
      <Message message={message} variant={messageVariant} onClose={() => setMessage('')} />
      <Container className="mt-10">
        <Routes>
          <Route path="/" element={user ? <Markets setMessage={setMessage} setMessageVariant={setMessageVariant}/> : <Navigate replace to="/login" />} />
          <Route path="/index/:ticker" element={<IndexPage />} />
          <Route path="/stocks" element={user ? <Stocks setMessage={setMessage} setMessageVariant={setMessageVariant}/> : <Navigate replace to="/login" />} />
          <Route path="/stock/:ticker" element={user ? <StockPage setMessage={setMessage} setMessageVariant={setMessageVariant} /> : <Navigate replace to="/login" />} />
          <Route path="/watchlist" element={user ? <Watchlist setMessage={setMessage} setMessageVariant={setMessageVariant}/> : <Navigate replace to="/login" />} />
          <Route path="/db" element={user ? <Database setMessage={setMessage} setMessageVariant={setMessageVariant}/> : <Navigate replace to="/login" />} />
          <Route path="/crypto" element={user ? <Crypto /> : <Navigate replace to="/login" />} />
          <Route path="/links" element={user ? <Links /> : <Navigate replace to="/login" />} />
          <Route path="/users" element={user ? (user.admin ? <Users setMessage={setMessage} setMessageVariant={setMessageVariant} /> : <Navigate replace to="/" />) : <Navigate replace to="/login" />} />
          <Route path="/change-password" element={user ? <Password setMessage={setMessage} setMessageVariant={setMessageVariant} /> : <Navigate replace to="/login" />} />
          <Route path="/change-name" element={user ? <Name setMessage={setMessage} setMessageVariant={setMessageVariant} /> : <Navigate replace to="/login" />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} setMessage={setMessage} setMessageVariant={setMessageVariant} />} />
          <Route path="/signup" element={<SignupForm onSignup={handleSignup} setMessage={setMessage} setMessageVariant={setMessageVariant} />} />
        </Routes>
      </Container>
    </>
  )
}

export default App