const axios = require('axios')
const router = require('express').Router()
const { TIINGO_API_KEY, TWELVEDATA_API_KEY } = require('../util/config')

router.post('/', async (request, response) => {
  const { ticker } = request.body

  const tiingoHeader = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${TIINGO_API_KEY}`,
    },
  }
  try {
    const url = `https://api.tiingo.com/tiingo/daily/${ticker}/prices`
    const { data } = await axios.get(url, tiingoHeader)
    response.status(200).json(data)
  } catch (error) {
    console.log('API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from Tiingo API' })
  }
})

module.exports = router