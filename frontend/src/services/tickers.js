import axios from 'axios'
const baseUrl = '/api/tickers'

/*
let token = null

const setToken = (newToken) => {
  token = newToken
}
*/

const getTicker = async (ticker) => {
  /*
  const config = {
    headers: {
      Authorization: token,
    },
  }
  */
  const response = await axios.post(baseUrl, { ticker })
  return response.data
}

export default { getTicker }