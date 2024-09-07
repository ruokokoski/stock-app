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
    // Fetch approx. 1 year of closing prices for later use which is ~255 trading days:
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1day&apikey=${TWELVEDATA_API_KEY}&outputsize=2`
    const data = await axios.get(url, twelvedataHeader)
    
    const latest = data.data.values[0]
    console.log('latest:', latest)
    const latestClose = parseFloat(latest.close)

    const previousDay = data.data.values[1]
    console.log('previousDay', previousDay)
    const previousClose = parseFloat(previousDay.close)
    const percentageChange = ((latestClose - previousClose) / previousClose) * 100
    //console.log('last:', data.data.values[254])
    
    /*Following logic does not provide exact results, because daily close is from 15:59 hours:
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=1min&apikey=${TWELVEDATA_API_KEY}&outputsize=1440`
    const data = await axios.get(url, twelvedataHeader)
    
    const latest = data.data.values[0]
    console.log('latest:', latest)
    const latestDate = new Date(data.data.values[0].datetime)
    console.log('last entry date:', latestDate)
    const latestClose = parseFloat(latest.close)
    let previousClose = null
    for (const entry of data.data.values) {
      const date = new Date(entry.datetime)
      if (date.getDate() !== latestDate.getDate()) {
        previousClose = parseFloat(entry.close)
        console.log('Previous day:', date)
        break
      }
    }
    const percentageChange = ((latestClose - previousClose) / previousClose) * 100
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
