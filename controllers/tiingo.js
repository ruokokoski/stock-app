const axios = require('axios')
const router = require('express').Router()
const { TIINGO_API_KEY } = require('../util/config')
const { getStockByTicker } = require('../util/tickerHelper')
const { saveStockDataToDatabase } = require('../util/stockService')

const tiingoHeader = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${TIINGO_API_KEY}`,
  },
}

router.post('/', async (request, response) => {
  const { ticker } = request.body

  try {
    //const url = `https://api.tiingo.com/tiingo/daily/${ticker}/prices` // historical prices
    const url = `https://api.tiingo.com/iex/?tickers=${ticker}`
    const { data } = await axios.get(url, tiingoHeader)

    let description = 'No description'
    const urlMetadata = `https://api.tiingo.com/tiingo/daily/${ticker}`
    const metadata = await axios.get(urlMetadata, tiingoHeader)
    description = metadata.data.description

    //console.log('Real-time Data:', data)
    //console.log('Description:', description)

    if (data.length > 0) {
      const latestEntry = data[0]

      const timestamp = new Date(latestEntry.timestamp)
      const year = timestamp.getFullYear()
      const month = (timestamp.getMonth() + 1).toString().padStart(2, '0')
      const day = timestamp.getDate().toString().padStart(2, '0')
      const hours = timestamp.getHours().toString().padStart(2, '0')
      const minutes = timestamp.getMinutes().toString().padStart(2, '0')
      const seconds = timestamp.getSeconds().toString().padStart(2, '0')
      const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

      const latest = latestEntry.last.toFixed(2)
      const previousClose = latestEntry.prevClose
      const changePercentage = previousClose
        ? ((latest - previousClose) / previousClose * 100).toFixed(2)
        : '-'
      
      const { name, sector } = getStockByTicker(ticker)
      console.log('Stock Name:', name)
      console.log('Sector:', sector)

      const stockData = {
        ticker: latestEntry.ticker,
        name,
        timestamp: formattedTimestamp,
        latest,
        pchange: changePercentage,
        sector,
        description: description,
      }

      await saveStockDataToDatabase(stockData)

      const formattedData = {
        ticker: latestEntry.ticker,
        name,
        datetime: formattedTimestamp,
        latest,
        percentageChange: `${changePercentage}%`,
      }

      response.status(200).json(formattedData)
    } else {
      response.status(404).json({ error: 'No data found for the ticker' })
    }

  } catch (error) {
    if (error.response && error.response.status === 429) {
      return response.status(429).json({ error: 'Rate limit reached. Please try again after some time.' })
    }
    console.log('API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from Tiingo API' })
  }
})

router.post('/description', async (request, response) => {
  const { ticker } = request.body

  try {
    const url = `https://api.tiingo.com/tiingo/daily/${ticker}`
    const metadata = await axios.get(url, tiingoHeader)
    //const stockname = metadata.data.name
    const description = metadata.data.description
    const exchange = metadata.data.exchangeCode
    
    //console.log('Stock description:', description)
    console.log('Exchange code:', exchange)

    const stockData = {
      ticker,
      sector: 'Unknown',
      description,
      exchange
    }

    await saveStockDataToDatabase(stockData)

    response.status(200).json(stockData)

  } catch (error) {
    if (error.response && error.response.status === 429) {
      return response.status(429).json({ error: 'Rate limit reached. Please try again after some time.' })
    }
    console.log('API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from Tiingo API' })
  }
})

module.exports = router