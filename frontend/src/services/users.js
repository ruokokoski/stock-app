import axios from 'axios'
const baseUrl = '/api/users'

/*
const setToken = (newToken) => {
  let token = newToken
}
*/

const getConfig = () => {
  const loggedUser = JSON.parse(localStorage.getItem('loggedStockappUser'))
  if (!loggedUser?.token) {
    throw new Error('No authentication token found')
  }
  return {
    headers: { Authorization: `Bearer ${loggedUser.token}` }
  }
}

const getAllUsers = async () => {
  const response = await axios.get(baseUrl, getConfig())
  return response.data
}

const updateUser = async (id, updatedData) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedData, getConfig())
  return response.data
}

const deleteUser = async (id) => {
  await axios.delete(`${baseUrl}/${id}`, getConfig())
}

const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await axios.post(`${baseUrl}/change-password`, { currentPassword, newPassword }, getConfig())
  return response.data
}

const changeName = async ({ currentName, newName }) => {
  const response = await axios.post(`${baseUrl}/change-name`, { currentName, newName }, getConfig())
  return response.data
}

export default { getAllUsers, updateUser, deleteUser, changePassword, changeName }