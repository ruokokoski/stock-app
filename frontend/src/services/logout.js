import axios from 'axios'

const baseUrl = '/api/logout'

const logout = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  await axios.post(baseUrl, null, config)
}

export default { logout }