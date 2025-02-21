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
  },
  getMarketNews: async () => {
    const response = await axios.post(`${baseUrl}/market_news`)
    return response.data
  },
  getDescription: async (ticker) => {
    const requestBody = { ticker }
    const response = await axios.post(`${baseUrl}/description`, requestBody)
    return response.data
  }
})

export default apiService
