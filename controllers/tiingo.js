const axios = require('axios')
const router = require('express').Router()
const { TIINGO_API_KEY } = require('../util/config')
//const { getStockByTicker } = require('../util/tickerHelper')
const { saveStockDataToDatabase } = require('../util/stockService')

const tiingoHeader = {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Token ${TIINGO_API_KEY}`,
  },
}

router.post('/historical', async (request, response) => {
  const { ticker, start, end } = request.body

  try {
    //start and end format: YYYY-MM-DD
    const url = `https://api.tiingo.com/tiingo/daily/${ticker}/prices?startDate=${start}&endDate=${end}`
    const { data } = await axios.get(url, tiingoHeader)

    //console.log('Data:', data)
    const latestEntry = data[0]
    const datePart = latestEntry.date.split('T')[0]
    console.log('Date from tiingo: ', datePart)

    const chartData = data
      .map((entry) => ({
        time: entry.date.split('T')[0],
        open: parseFloat(entry.open).toFixed(2),
        close: parseFloat(entry.close).toFixed(2),
        high: parseFloat(entry.high).toFixed(2),
        low: parseFloat(entry.low).toFixed(2),
        volume: parseInt(entry.volume)
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time))
    
    //console.log('Chart data: ', chartData)

    response.status(200).json({
      ticker,
      chartData
    })

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
    const description = metadata.data.description
    const exchange = metadata.data.exchangeCode
    
    //console.log('Exchange code:', exchange)
    //console.log('Description: ', description)

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