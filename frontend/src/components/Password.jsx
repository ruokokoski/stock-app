import { useState } from 'react'
import userService from '../services/users'
import AuthForm from './AuthForm'
import AuthInput from './AuthInput'
import { FaLock } from 'react-icons/fa'
import '../styles/styles.css'

const Password = ({ setMessage, setMessageVariant }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleChangePassword = async (event) => {
    event.preventDefault()
    if (newPassword !== confirmPassword) {
      console.log('Password and confirmation do not match')
      setMessage('New password and confirmation do not match!')
      setMessageVariant('danger')
      return
    }

    try {
      await userService.changePassword({ currentPassword, newPassword })
      console.log('Password changed')
      setMessage('Password changed successfully!')
      setMessageVariant("success")
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.log('Password change failed:', error)
      if (error.response?.status === 400) {
        setMessage('Wrong current password')
      } else {
        setMessage('Password change failed')
      }
      setMessageVariant('danger')
    }
  }

  return (
    <AuthForm
      title="Change Password"
      titleSize="1.5rem"
      onSubmit={handleChangePassword}
    >
      <AuthInput
        controlId="currentPassword"
        label="Current Password"
        type="password"
        value={currentPassword}
        placeholder="Enter current password"
        onChange={({ target }) => setCurrentPassword(target.value)}
        icon={FaLock}
      />
      <AuthInput
        controlId="newPassword"
        label="New Password"
        type="password"
        value={newPassword}
        placeholder="Enter new password"
        onChange={({ target }) => setNewPassword(target.value)}
        icon={FaLock}
      />
      <AuthInput
        controlId="confirmPassword"
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        placeholder="Confirm new password"
        onChange={({ target }) => setConfirmPassword(target.value)}
        icon={FaLock}
      />
    </AuthForm>
  )
}

export default Password