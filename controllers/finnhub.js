const axios = require('axios')
const router = require('express').Router()
const { FINNHUB_API_KEY } = require('../util/config')
const { getStockByTicker } = require('../util/tickerHelper')
//const { saveStockDataToDatabase } = require('../util/stockService')

router.post('/', async (request, response) => {
  const { ticker, name } = request.body

  const finnhubHeader = {
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': `${FINNHUB_API_KEY}`,
    },
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}`
    const { data } = await axios.get(url, finnhubHeader)

    let stockName = name || 'No name provided'
    let stockSector = 'Unknown'

    console.log('Name: ', name)
    if (!name) {
      const stockInfo = getStockByTicker(ticker)
      stockName = stockInfo.name || 'No name provided'
      stockSector = stockInfo.sector || 'Unknown'
    }

    const timestampUTC = new Date(data.t * 1000).toISOString()

    const stockData = {
      ticker: ticker,
      name: stockName,
      timestamp: timestampUTC,
      latest: data.c,
      pchange: data.dp,
      sector: stockSector,
      description: 'No description',
    }
    console.log('Finnhub stock data:', stockData)
    
    /*
    const formattedData = {
      ticker: ticker,
      name: stockName,
      datetime: timestampUTC,
      latest: data.c,
      percentageChange: `${data.dp.toFixed(2)}%`,
    }
    */

    response.status(200).json(stockData)

  } catch (error) {
    if (error.response && error.response.status === 429) {
      return response.status(429).json({ error: 'Rate limit reached. Please try again after some time.' })
    }
    console.log('API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from FinnHub API' })
  }

})

module.exports = router