import { useState, useEffect } from 'react'
import userService from '../services/users'
import { Table } from 'react-bootstrap'
import '../styles/styles.css'

const Users = () => {
  const [users, setUsers] = useState([])
  //const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const cachedUsers = localStorage.getItem('users')
        if (cachedUsers) {
          setUsers(JSON.parse(cachedUsers))
        } else {
          const fetchedUsers = await userService.getAllUsers()
          setUsers(fetchedUsers)
          localStorage.setItem('users', JSON.stringify(fetchedUsers))
        }
      } catch (error) {
        console.log('Failed to fetch users:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className='content-padding'>
      <h2>All stock-app users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Admin</th>
            <th>Disabled</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.admin ? 'Yes' : 'No'}</td>
              <td>{user.disabled ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default Users