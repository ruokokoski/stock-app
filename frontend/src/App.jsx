import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import Home from './components/Home'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'
import NavigationBar from './components/NavigationBar'

const App = () => {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  //const [message, setMessage] = useState(null)

  const handleLogin = (username, password) => {
    console.log('Logging in with', username, password)
    setUser(username)
  }

  const handleSignup = (name, username, password) => {
    console.log('Signing up with', name, username, password)
  }

  const handleLogout = () => {
    console.log('Logging out')
    setUser(null)
    navigate('/login')
  }

  return (
    <>
      <NavigationBar user={user} onLogout={handleLogout} />
      <Container className="mt-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<SignupForm onSignup={handleSignup} />} />
        </Routes>
      </Container>
    </>
  )
}

export default App