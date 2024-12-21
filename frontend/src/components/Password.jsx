import { useState } from 'react'
import userService from '../services/users'
import AuthForm from './AuthForm'
import AuthInput from './AuthInput'
import { FaLock } from 'react-icons/fa'
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
    <AuthForm
      title="Change Password"
      titleSize="1.5rem"
      message={message}
      messageVariant={messageVariant}
      onCloseMessage={() => setMessage(null)}
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