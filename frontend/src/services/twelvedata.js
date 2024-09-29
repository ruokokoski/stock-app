import axios from 'axios'
const baseUrl = '/api/twelvedata'

const getTicker = async (ticker, range = '1day') => {
  /*
  const config = {
    headers: {
      Authorization: token,
    },
  }
  */
  const response = await axios.post(baseUrl, { ticker, range })
  return response.data
}

export default { getTicker }