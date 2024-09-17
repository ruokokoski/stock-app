const axios = require('axios')
const router = require('express').Router()
const { POLYGON_API_KEY } = require('../util/config')

const formatDate = (date) => {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

router.post('/', async (request, response) => {
  const { ticker } = request.body

  try {
    const currentDate = new Date()
    const previousYear = new Date()
    previousYear.setFullYear(currentDate.getFullYear() - 1)
    const currentFormatted = formatDate(currentDate);
    const previousYearFormatted = formatDate(previousYear)

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${previousYearFormatted}/${currentFormatted}?sort=desc&apiKey=${POLYGON_API_KEY}&outputsize=2`
    const { data } = await axios.get(url)

    if (data.results && data.results.length >= 2) {
      const latest = data.results[0]
      //console.log('Latest:', latest)
      const latestClose = parseFloat(latest.c)

      const previousDay = data.results[1]
      //console.log('Previous day:', previousDay)
      const previousClose = parseFloat(previousDay.c)

      const percentageChange = ((latestClose - previousClose) / previousClose) * 100

      // TODO: Save data also to database here

      response.status(200).json({
        latest: {
          close: latestClose.toFixed(2),
          datetime: new Date(latest.t).toISOString().slice(0, 10),
        },
        previous: {
          close: previousClose.toFixed(2),
          percentageChange: percentageChange.toFixed(2) + '%',
        },
      })
    } else {
      response.status(404).json({ error: 'Not enough data returned from Polygon.io API' });
    }
  } catch (error) {
    console.error('Polygon API call failed:', error)
    response.status(500).json({ error: 'Failed to fetch data from Polygon.io API' })
  }
})

module.exports = router
