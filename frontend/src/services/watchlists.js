import axios from 'axios'
const baseUrl = '/api/watchlist'

const getAuthConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
})

export const addToWatchlist = async (ticker, token) => {
  const config = getAuthConfig(token)
  const response = await axios.post(baseUrl, { ticker }, config)
  return response.data
}

export const getWatchlist = async (token) => {
  const config = getAuthConfig(token)
  const response = await axios.get(baseUrl, config)
  return response.data
}

export const deleteWatchlistItem = async (id, token) => {
  const config = getAuthConfig(token)
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}
