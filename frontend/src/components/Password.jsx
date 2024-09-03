import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import userService from '../services/users'
import Message from './Message'
import '../styles/styles.css'

const Password = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [messageVariant, setVariant] = useState('')

  const handleChangePassword = async (event) => {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match!")
      setVariant("danger")
      return
    }

    try {
      await userService.changePassword({ currentPassword, newPassword })
      setMessage("Password changed successfully!")
      setVariant("success")
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.log('Password change failed:', error)
      setMessage("Failed to change password.")
      setVariant("danger")
    }
  }

  return (
    <div className='content-padding'>
    <h2>Change password</h2>
    <Form 
      onSubmit={handleChangePassword}
      style={{
        width: '100%',
        maxWidth: '400px',
      }}
    >
      <Message 
        message={message} 
        variant={messageVariant} 
        onClose={() => setMessage('')} 
      />
      <Form.Group controlId="currentPassword">
        <Form.Label style={{ marginTop: '10px', marginBottom: '3px' }}>Current Password</Form.Label>
        <Form.Control
          type="password"
          value={currentPassword}
          onChange={({ target }) => setCurrentPassword(target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="newPassword">
        <Form.Label style={{ marginTop: '10px', marginBottom: '3px' }}>New Password</Form.Label>
        <Form.Control
          type="password"
          value={newPassword}
          onChange={({ target }) => setNewPassword(target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="confirmPassword">
        <Form.Label style={{ marginTop: '10px', marginBottom: '3px' }}>Confirm New Password</Form.Label>
        <Form.Control
          type="password"
          value={confirmPassword}
          onChange={({ target }) => setConfirmPassword(target.value)}
          required
        />
      </Form.Group>

      <Button type="submit" className="gradient-button">
        Change Password
      </Button>
    </Form>
    </div>
  )
}

export default Password