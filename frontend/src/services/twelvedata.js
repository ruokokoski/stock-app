import axios from 'axios'
const baseUrl = '/api/twelvedata'

const getTicker = async (ticker, range = '1day', dailyChange = false) => {
  /*
  const config = {
    headers: {
      Authorization: token,
    },
  }
  */
  const response = await axios.post(baseUrl, { ticker, range, dailyChange })
  return response.data
}

export default { getTicker }