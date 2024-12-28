import axios from 'axios'

const apiService = (baseUrl) => ({
  getTicker: async (ticker, range) => {
    const requestBody = range ? { ticker, range } : { ticker }
    /*
    const config = {
      headers: {
        Authorization: token,
      },
    }
    */
    const response = await axios.post(baseUrl, requestBody)
    return response.data
  }
})

export default apiService
