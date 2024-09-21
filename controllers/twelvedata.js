const axios = require('axios')
const router = require('express').Router()
const { TWELVEDATA_API_KEY } = require('../util/config')

router.post('/', async (request, response) => {
  const { ticker, range, dailyChange } = request.body

  const twelvedataHeader = {
    headers: {
      'Content-Type': 'application/json'
    },
  }

  let interval, outputsize
  if (dailyChange) {
    interval = '1day'
    outputsize = 2
  } else {
    switch (range) {
      case '1day':
        interval = '1min'
        outputsize = 390 // Approx. 1 trading day of minute data
        break
      case '1week':
        interval = '1h'
        outputsize = 40 // 7 trading days (approx.)
        break
      case '1month':
        interval = '1day'
        outputsize = 22 // Approx. 1 month of trading days
        break
      case '1year':
        interval = '1day'
        outputsize = 255; // Approx. 1 year of trading days
        break
      case 'max':
        interval = '1week'
        outputsize = 100 // Max data (check API limits)
        break
      default:
        return response.status(400).json({ error: 'Invalid range specified' })
    }
  }
  //console.log('Range:', range)
  //console.log('dailyChange:', dailyChange)

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=${interval}&apikey=${TWELVEDATA_API_KEY}&outputsize=${outputsize}`
    const data = await axios.get(url, twelvedataHeader)
    console.log('Data:', data.data)
    // Handle percentage change only case (interval = 1day, outputsize = 2)
    if (dailyChange) {
      const latest = data.data.values[0]
      const previousDay = data.data.values[1]
      const latestClose = parseFloat(latest.close)
      const previousClose = parseFloat(previousDay.close)
      //console.log(latestClose, previousClose)
      const percentageChange = ((latestClose - previousClose) / previousClose) * 100
      //console.log(percentageChange)
      return response.status(200).json({
        latest: {
          close: latestClose.toFixed(2),
          datetime: latest.datetime,
        },
        previous: {
          close: previousClose.toFixed(2),
          percentageChange: percentageChange.toFixed(2) + '%',
        },
      })
    }

    // General case for presenting chart data
    const chartData = data.data.values.map((entry) => ({
      datetime: entry.datetime,
      close: parseFloat(entry.close).toFixed(2),
    }))

    response.status(200).json({
      ticker,
      interval,
      range,
      chartData,
    })

  } catch (error) {
    console.error('TwelveData API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from TwelveData API' })
  }
})

module.exports = router
