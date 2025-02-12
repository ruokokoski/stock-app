import axios from 'axios'
const baseUrl = '/api/watchlists'

export const addToWatchlist = async (ticker, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  const response = await axios.post(baseUrl, { ticker }, config)
  return response.data
}

export const getWatchlist = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }
  //console.log('config: ', config)
  const response = await axios.get(baseUrl, config)
  return response.data
}
