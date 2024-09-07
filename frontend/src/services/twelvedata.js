import axios from 'axios'
const baseUrl = '/api/twelvedata'

const getTicker = async (ticker) => {
  /*
  const config = {
    headers: {
      Authorization: token,
    },
  }
  */
 //console.log('Twelvedata getTicker')
  const response = await axios.post(baseUrl, { ticker })
  return response.data
}

export default { getTicker }