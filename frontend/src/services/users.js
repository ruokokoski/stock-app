import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = (newToken) => {
  token = newToken
}

const getAllUsers = async () => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.get(baseUrl, config)
  return response.data
}

export default { getAllUsers, setToken }