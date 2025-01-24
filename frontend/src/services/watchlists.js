import axios from 'axios'
const baseUrl = '/api/watchlists'

export const addToWatchlist = async (ticker, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.post(baseUrl, { ticker }, config)
  return response.data
}
