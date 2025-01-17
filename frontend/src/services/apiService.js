import axios from 'axios'

const apiService = (baseUrl) => ({
  getTicker: async (ticker, range, name) => {
    const requestBody = { ticker }

    if (range) requestBody.range = range
    if (name) requestBody.name = name

    const response = await axios.post(baseUrl, requestBody)
    return response.data
  },
  searchSymbol: async (query) => {
    const requestBody = { query }
    
    const response = await axios.post(`${baseUrl}/search`, requestBody)
    return response.data
  }
})

export default apiService
