const axios = require('axios')
const router = require('express').Router()
//const { EODHD_API_KEY } = require('../util/config')

router.post('/', async (request, response) => {
  const { ticker } = request.body

  try {
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

    response.status(200).json({
      latest: {
        close: close.toFixed(2),
        datetime: datetimeUTC,
      },
      previous: {
        close: previousClose.toFixed(2),
        percentageChange: percentageChange === '-' ? '-' : percentageChange.toFixed(2) + '%',
      },
    })
  } catch (error) {
    console.error('EODHD API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from EODHD API' })
  }
})

module.exports = router
