import { useState, useEffect } from 'react'
import userService from '../services/users'
import { Table, Button } from 'react-bootstrap'
import '../styles/styles.css'

const Users = ({ setMessage, setMessageVariant }) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await userService.getAllUsers()
        setUsers(fetchedUsers)
        //localStorage.setItem('users', JSON.stringify(fetchedUsers))
      } catch (error) {
        console.log('Failed to fetch users:', error)
        setMessage('Failed to fetch users')
        setMessageVariant('danger')
      }
    }

    fetchUsers()
  }, [setMessage, setMessageVariant])

  const handleToggleDisabled = async (id, disabled, admin) => {
    if (admin) {
      alert("Admin users cannot be disabled.")
      return
    }
    try {
      const updatedUser = await userService.updateUser(id, { disabled: !disabled })
      setUsers(users.map(user => user.id === id ? updatedUser : user))
      localStorage.setItem('users', JSON.stringify(users.map(user => user.id === id ? updatedUser : user)))
    } catch (error) {
      console.log('Failed to toggle disabled state:', error)
    }
  }

  const handleDeleteUser = async (id, admin) => {
    if (admin) {
      alert("Admin users cannot be deleted.")
      return
    }
    const confirmDelete = window.confirm("Are you sure you want to delete this user?")
    if (!confirmDelete) {
      return
    }
    try {
      await userService.deleteUser(id)
      setUsers(users.filter(user => user.id !== id))
      localStorage.setItem('users', JSON.stringify(users.filter(user => user.id !== id)))
      setMessage('User deleted')
      setMessageVariant('success')
    } catch (error) {
      console.log('Failed to delete user:', error)
      setMessage('Failed to delete user')
      setMessageVariant('danger')
    }
  }

  return (
    <div className='content-padding'>
      <h3>All stock-app users</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Admin</th>
            <th>Disabled</th>
            <th>Actions</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.admin ? 'Yes' : 'No'}</td>
              <td>{user.disabled ? 'Yes' : 'No'}</td>
              <td>
                <Button 
                  variant={user.disabled ? 'success' : 'warning'}
                  onClick={() => handleToggleDisabled(user.id, user.disabled, user.admin)}
                >
                  {user.disabled ? 'Enable' : 'Disable'}
                </Button>
              </td>
              <td>
                <Button 
                  variant="danger" 
                  onClick={() => handleDeleteUser(user.id, user.admin)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users