import axios from 'axios'
const baseUrl = '/api/crypto'

const getCoins = async () => {
  /*
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  */
  const response = await axios.post(baseUrl)
  return response.data
}

export default { getCoins }