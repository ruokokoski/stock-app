import axios from 'axios'
const baseUrl = '/api/crypto'

const getCoins = async (limit) => {
  const requestBody = { limit }

  const response = await axios.post(baseUrl, requestBody)
  return response.data
}

export default { getCoins }
