import axios from 'axios'

const apiService = (baseUrl) => ({
  getTicker: async (ticker, range, name) => { // Twelvedata, Polygon, Finnhub
    const requestBody = { ticker }

    if (range) requestBody.range = range
    if (name) requestBody.name = name

    const response = await axios.post(baseUrl, requestBody)
    return response.data
  },
  searchSymbol: async (query) => { // Finnhub API
    const requestBody = { query }
    const response = await axios.post(`${baseUrl}/search`, requestBody)
    return response.data
  },
  getMarketNews: async () => { // Finnhub API
    const response = await axios.post(`${baseUrl}/market_news`)
    return response.data
  },
  getCompanyNews: async (ticker) => { // Finnhub API
    const requestBody = { ticker }
    const response = await axios.post(`${baseUrl}/company_news`, requestBody)
    return response.data
  },
  getCompanyProfile: async (ticker) => { // Finnhub API
    const requestBody = { ticker }
    const response = await axios.post(`${baseUrl}/company_profile`, requestBody)
    return response.data
  },
  getMetrics: async (ticker) => { // Finnhub API
    const requestBody = { ticker }
    const response = await axios.post(`${baseUrl}/metrics`, requestBody)
    return response.data
  },
  getDescription: async (ticker) => { // Tiingo API
    const requestBody = { ticker }
    const response = await axios.post(`${baseUrl}/description`, requestBody)
    return response.data
  },
  getHistorical: async (ticker, start, end) => { // Tiingo API
    const requestBody = { ticker, start, end }
    const response = await axios.post(`${baseUrl}/historical`, requestBody)
    return response.data
  },
  getFromDB: async (ticker) => { // own database
    const response = await axios.get(`${baseUrl}/${ticker}`)
    return response.data
  },
  getAllFromDB: async () => { // own database
    const response = await axios.get(baseUrl)
    return response.data
  }
})

export default apiService
