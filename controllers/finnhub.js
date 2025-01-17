const axios = require('axios')
const router = require('express').Router()
const { FINNHUB_API_KEY } = require('../util/config')
const { getStockByTicker } = require('../util/tickerHelper')
const { saveStockDataToDatabase } = require('../util/stockService')

const TOP_RESULTS_LIMIT = 3

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
    let description = 'No description'

    //console.log('Name: ', name)
    if (!name) {
      const stockInfo = getStockByTicker(ticker)
      stockName = stockInfo.name || 'No name provided'
      stockSector = stockInfo.sector || 'Unknown'
      /*
      const urlMetadata = `https://api.tiingo.com/tiingo/daily/${ticker}`
      const metadata = await axios.get(urlMetadata, tiingoHeader)
      description = metadata.data.description
      */
    }

    const timestampUTC = new Date(data.t * 1000).toISOString()

    const stockData = {
      ticker: ticker,
      name: stockName,
      timestamp: timestampUTC,
      latest: data.c,
      pchange: data.dp,
      sector: stockSector,
      description: description,
    }
    //console.log('Finnhub stock data:', stockData)

    await saveStockDataToDatabase(stockData)

    response.status(200).json(stockData)

  } catch (error) {
    if (error.response && error.response.status === 429) {
      return response.status(429).json({ error: 'Rate limit reached. Please try again after some time.' })
    }
    console.log('API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from FinnHub API' })
  }
})

router.post('/search', async (request, response) => {
  const { query } = request.body

  if (!query) {
    return response.status(400).json({ error: 'Search query is required' })
  }

  const finnhubHeader = {
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': `${FINNHUB_API_KEY}`,
    },
  }

  try {
    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&exchange=US`
    const { data } = await axios.get(url, finnhubHeader)

    if (!data || !data.result) {
      return response.status(404).json({ error: 'No results found' })
    }
    
    const commonStocks = data.result
      .filter(item => item.type.toLowerCase() === 'common stock')
      .slice(0, TOP_RESULTS_LIMIT)
    //console.log('Common Stocks: ', commonStocks)

    if (commonStocks.length === 0) {
      return response.status(404).json({ error: 'No stocks found. Try searching something else.' })
    }

    const stockDataPromises = commonStocks.map(async (stock) => {
      const { symbol } = stock
      const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}`
      const { data: quoteData } = await axios.get(quoteUrl, finnhubHeader)

      if (!quoteData) {
        throw new Error(`No quote data available for ${symbol}`)
      }

      const timestampUTC = new Date(quoteData.t * 1000).toISOString()
      const stockName = stock.description || 'No name provided'
      const stockSector = 'Unknown'

      const stockData = {
        ticker: symbol,
        name: stockName,
        timestamp: timestampUTC,
        latest: quoteData.c,
        pchange: quoteData.dp,
        sector: stockSector,
        description: 'No description',
      }

      if (stockData.latest === 0) {
        return null
      }

      await saveStockDataToDatabase(stockData)

      return stockData
    })

    const stocksWithData = await Promise.all(stockDataPromises)

    response.status(200).json({ result: stocksWithData })

  } catch (error) {
    if (error.response && error.response.status === 429) {
      return response.status(429).json({ error: 'Rate limit reached. Please try again later.' })
    }
    console.error('Search API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch search results from Finnhub API' })
  }
})

module.exports = router