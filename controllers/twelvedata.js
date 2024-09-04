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
    const url = `https://api.twelvedata.com/time_series?symbol=${ticker}&interval=5min&apikey=${TWELVEDATA_API_KEY}`
    const { data } = await axios.get(url, twelvedataHeader)

    // TODO: Save data also to database here

    response.status(200).json(data)
  } catch (error) {
    console.error('TwelveData API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from TwelveData API' })
  }
})

module.exports = router
