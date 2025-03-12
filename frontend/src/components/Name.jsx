import { useState } from 'react'
import userService from '../services/users'
import AuthForm from './AuthForm'
import AuthInput from './AuthInput'
import { FaUserCircle } from 'react-icons/fa'
import '../styles/styles.css'

const Name = ({ setMessage, setMessageVariant }) => {
  const [newName, setNewName] = useState('')
  const [confirmName, setConfirmName] = useState('')

  const handleChangeName = async (event) => {
    event.preventDefault()
    if (newName !== confirmName) {
      setMessage("New name and confirmation do not match!")
      setMessageVariant("danger")
      return
    }

    try {
      await userService.changeName(newName)
      setMessage("Name changed successfully!")
      setMessageVariant("success")
      setNewName('')
      setConfirmName('')
    } catch (error) {
      console.log('Name change failed:', error)
      setMessage("Failed to change name.")
      setMessageVariant("danger")
    }
  }

  return (
    <AuthForm
      title="Change Name"
      titleSize="1.5rem"
      onSubmit={handleChangeName}
    >
      <AuthInput
        controlId="newName"
        label="New Name"
        type="text"
        value={newName}
        placeholder="Enter new name"
        onChange={({ target }) => setNewName(target.value)}
        icon={FaUserCircle}
      />
      <AuthInput
        controlId="confirmName"
        label="Confirm New Name"
        type="text"
        value={confirmName}
        placeholder="Confirm new name"
        onChange={({ target }) => setConfirmName(target.value)}
        icon={FaUserCircle}
      />
    </AuthForm>
  )
}

export default Name