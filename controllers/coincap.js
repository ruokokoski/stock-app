const axios = require('axios')
const router = require('express').Router()
const { COINCAP_API_KEY } = require('../util/config')

router.post('/', async (request, response) => {
  const coincapHeader = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${COINCAP_API_KEY}`,
    },
  }

  try {
    const url = `https://api.coincap.io/v2/assets?limit=10`
    const data = await axios.get(url, coincapHeader)
    //console.log('Coincap data:', data.data)

    response.status(200).json(data.data)
  } catch (error) {
    console.error('Coincap API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from Coincap API' })
  }
})

module.exports = router