import { Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap'
import LoginForm from './components/LoginForm'
import SignupForm from './components/SignupForm'

const App = () => {
  const handleLogin = (username, password) => {
    console.log('Logging in with', username, password)
  }

  const handleSignup = (name, username, password) => {
    console.log('Signing up with', name, username, password)
  }

  return (
    <Container className="mt-10">
      <Routes>
        <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupForm onSignup={handleSignup} />} />
      </Routes>
    </Container>
  )
}

export default App