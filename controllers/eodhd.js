const axios = require('axios')
const router = require('express').Router()
//const { EODHD_API_KEY } = require('../util/config')

const MAX_REQUESTS = 6
const MIN_FETCH_INTERVAL = 60 * 1000 // 1 min
const tickerCache = {}

router.post('/', async (request, response) => {
  const { ticker } = request.body
  const currentTime = Date.now()

  if (tickerCache[ticker]) {
    const { lastFetchTime, cachedData, requestCounter } = tickerCache[ticker]

    if (requestCounter >= MAX_REQUESTS && currentTime - lastFetchTime < MIN_FETCH_INTERVAL) {
      if (cachedData) {
        return response.status(200).json(cachedData)
      } else {
        return response
          .status(429)
          .json({ error: 'Rate limit reached. Please try again after the cooldown period.' })
      }
    }

    if (currentTime - lastFetchTime >= MIN_FETCH_INTERVAL) {
      tickerCache[ticker].requestCounter = 0
    }
  } else {
    tickerCache[ticker] = {
      lastFetchTime: 0,
      cachedData: null,
      requestCounter: 0,
    }
  }

  try {
    tickerCache[ticker].requestCounter += 1
    tickerCache[ticker].lastFetchTime = currentTime
    //const url = `https://eodhd.com/api/real-time/${ticker}?api_token=${EODHD_API_KEY}&fmt=json`
    const url = `https://eodhd.com/api/real-time/${ticker}?api_token=demo&fmt=json`
    const data = await axios.get(url)
    
    //console.log('Full API response:', JSON.stringify(data.data, null, 2))

    const latest = data.data
    const latestClose = latest.close !== 'NA' ? parseFloat(latest.close) : null
    const previousClose = latest.previousClose !== 'NA' ? parseFloat(latest.previousClose) : 0.0
    const percentageChange = latest.change_p !== 'NA' ? parseFloat(latest.change_p) : '-'

    const close = latestClose !== null ? latestClose : previousClose

    const timestamp = latest.timestamp !== 'NA' ? parseInt(latest.timestamp) : null
    const datetimeUTC = timestamp ? new Date(timestamp * 1000).toUTCString() : '-'

    tickerCache[ticker].cachedData = {
      latest: {
        close: close.toFixed(2),
        datetime: datetimeUTC,
      },
      previous: {
        close: previousClose.toFixed(2),
        percentageChange: percentageChange === '-' ? '-' : `${percentageChange.toFixed(2)}%`,
      },
    }

    response.status(200).json(tickerCache[ticker].cachedData)
  } catch (error) {
    console.error('EODHD API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from EODHD API' })
  }
})

module.exports = router
