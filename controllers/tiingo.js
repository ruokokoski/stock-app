const axios = require('axios')
const router = require('express').Router()
const { TIINGO_API_KEY } = require('../util/config')

router.post('/', async (request, response) => {
  const { ticker } = request.body

  const tiingoHeader = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${TIINGO_API_KEY}`,
    },
  }

  try {
    //const url = `https://api.tiingo.com/tiingo/daily/${ticker}/prices` // historical prices
    const url = `https://api.tiingo.com/iex/?tickers=${ticker}`
    const { data } = await axios.get(url, tiingoHeader)

    // TODO: Save data also to database here

    console.log('Real-time Data:', data)

    if (data.length > 0) {
      const realTimeData = data[0]

      const timestamp = new Date(realTimeData.timestamp)
      const year = timestamp.getFullYear()
      const month = (timestamp.getMonth() + 1).toString().padStart(2, '0')
      const day = timestamp.getDate().toString().padStart(2, '0')
      const hours = timestamp.getHours().toString().padStart(2, '0')
      const minutes = timestamp.getMinutes().toString().padStart(2, '0')
      const seconds = timestamp.getSeconds().toString().padStart(2, '0')
      const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

      const last = realTimeData.last.toFixed(2)
      const prevClose = realTimeData.prevClose
      const changePercentage = prevClose
        ? ((last - prevClose) / prevClose * 100).toFixed(2)
        : 'N/A'

      const formattedData = {
        ticker: realTimeData.ticker,
        timestamp: formattedTimestamp,
        last,
        change_percentage: `${changePercentage}%`,
      }
      response.status(200).json(formattedData)
    } else {
      response.status(404).json({ error: 'No data found for the ticker' })
    }

  } catch (error) {
    console.log('API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from Tiingo API' })
  }
})

module.exports = router