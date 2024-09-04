const axios = require('axios')
const router = require('express').Router()
const { TWELVEDATA_API_KEY } = require('../util/config')

router.post('/', async (request, response) => {
  const { ticker } = request.body

  const twelvedataHeader = {
    headers: {
      'Content-Type': 'application/json'
    },
  }

  try {
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1day&apikey=${TWELVEDATA_API_KEY}&outputsize=2`
    const data = await axios.get(url, twelvedataHeader)
    console.log('data', data)
    
    const latest = data.data.values[0]
    console.log('latest:', latest)
    const latestClose = parseFloat(latest.close)

    const previousDay = data.data.values[1]
    console.log('previousDay', previousDay)

    const previousClose = parseFloat(previousDay.close)
    const percentageChange = ((latestClose - previousClose) / previousClose) * 100
    
    /*Following logic must be tested:
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1min&apikey=${TWELVEDATA_API_KEY}&outputsize=1440`
    const data = await axios.get(url, twelvedataHeader)
    
    const latest = data.data.values[0]
    console.log('latest:', latest)
    const latestClose = parseFloat(latest.close)
    let previousDayClose = null
    const currentDate = new Date()
    for (const entry of data.data.values) {
      const date = new Date(entry.datetime)
      if (date.getDate() !== currentDate.getDate()) {
        previousDayClose = parseFloat(entry.close)
        break
      }
    }
    const percentageChange = ((latestClose - previousDayClose) / previousDayClose) * 100
    */

    // TODO: Save data also to database here

    response.status(200).json({
      latest: {
        close: latestClose.toFixed(2),
        datetime: latest.datetime,
      },
      previous: {
        close: previousClose.toFixed(2),
        percentageChange: percentageChange.toFixed(2) + '%',
      },
    })
  } catch (error) {
    console.error('TwelveData API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from TwelveData API' })
  }
})

module.exports = router
