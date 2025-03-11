import { useState } from 'react'
import userService from '../services/users'
import AuthForm from './AuthForm'
import AuthInput from './AuthInput'
import { FaUserCircle } from 'react-icons/fa'
import '../styles/styles.css'

const Name = () => {
  const [currentName, setCurrentName] = useState('')
  const [newName, setNewName] = useState('')
  const [confirmName, setConfirmName] = useState('')
  const [message, setMessage] = useState(null)
  const [messageVariant, setVariant] = useState('')

  const handleChangeName = async (event) => {
    event.preventDefault()
    if (newName !== confirmName) {
      setMessage("New name and confirmation do not match!")
      setVariant("danger")
      return
    }

    try {
      await userService.changeName({ currentName, newName })
      setMessage("Name changed successfully!")
      setVariant("success")
      setCurrentName('')
      setNewName('')
      setConfirmName('')
    } catch (error) {
      console.log('Name change failed:', error)
      setMessage("Failed to change name.")
      setVariant("danger")
    }
  }

  return (
    <AuthForm
      title="Change Name"
      titleSize="1.5rem"
      message={message}
      messageVariant={messageVariant}
      onCloseMessage={() => setMessage(null)}
      onSubmit={handleChangeName}
    >
      <AuthInput
        controlId="currentName"
        label="Current Name"
        type="text"
        value={currentName}
        placeholder="Enter current name"
        onChange={({ target }) => setCurrentName(target.value)}
        icon={FaUserCircle}
      />
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