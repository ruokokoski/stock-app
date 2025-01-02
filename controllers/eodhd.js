const axios = require('axios')
const router = require('express').Router()
//const { EODHD_API_KEY } = require('../util/config')

let lastFetchTime = 0
let cachedData = null
let requestCounter = 0
const MAX_REQUESTS = 6
const MIN_FETCH_INTERVAL = 2 * 60 * 1000 // 2 min

router.post('/', async (request, response) => {
  const { ticker } = request.body
  const currentTime = Date.now()

  if (requestCounter >= MAX_REQUESTS && currentTime - lastFetchTime < MIN_FETCH_INTERVAL) {
    if (cachedData) {
      return response.status(200).json(cachedData)
    } else {
      return response.status(200).json({ error: 'No data available yet, please try again after the cooldown.' })
    }
  }

  if (currentTime - lastFetchTime >= MIN_FETCH_INTERVAL) {
    requestCounter = 0
  }

  try {
    requestCounter += 1
    lastFetchTime = currentTime
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

    cachedData = {
      latest: {
        close: close.toFixed(2),
        datetime: datetimeUTC,
      },
      previous: {
        close: previousClose.toFixed(2),
        percentageChange: percentageChange === '-' ? '-' : percentageChange.toFixed(2) + '%',
      },
    }

    response.status(200).json(cachedData)
  } catch (error) {
    console.error('EODHD API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from EODHD API' })
  }
})

module.exports = router
