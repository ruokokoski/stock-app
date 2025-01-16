const axios = require('axios')
const router = require('express').Router()
const { FINNHUB_API_KEY } = require('../util/config')
//const { getStockByTicker } = require('../util/tickerHelper')
//const { saveStockDataToDatabase } = require('../util/stockService')

router.post('/', async (request, response) => {
  const { ticker } = request.body

  const finnhubHeader = {
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': `${FINNHUB_API_KEY}`,
    },
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}`
    const { data } = await axios.get(url, finnhubHeader)

    console.log('Finnhub stock quote data:', data)
    const formattedData = {
      currentPrice: data.c,
      change: data.d,
      percentChange: data.dp,
      highPrice: data.h,
      lowPrice: data.l,
      openPrice: data.o,
      previousClose: data.pc,
      timestamp: data.t,
    }

    response.status(200).json(formattedData)

  } catch (error) {
    console.log('API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from FinnHub API' })
  }

})

module.exports = router