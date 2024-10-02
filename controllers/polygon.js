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

    const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${previousYearFormatted}/${currentFormatted}?sort=desc&apiKey=${POLYGON_API_KEY}`
    const { data } = await axios.get(url)

    const chartData = data.results
      .map((entry) => ({
        time: new Date(entry.t).toISOString().split('T')[0],
        value: parseFloat(entry.c).toFixed(2),
        //volume: parseInt(entry.volume)
      }))
      .sort((a, b) => new Date(a.time) - new Date(b.time))
    //console.log('Chart data:', chartData)

    let latest = '-', previous = '-'

    if (data.results && data.results.length >= 2) {
      const latestEntry = data.results[0]
      const latestClose = parseFloat(latestEntry.c)
      const previousDay = data.results[1]
      const previousClose = parseFloat(previousDay.c)
      const percentageChange = ((latestClose - previousClose) / previousClose) * 100

      console.log('LatestEntry.t polygon:', new Date(latestEntry.t).toISOString().split('T')[0])

      latest = {
        close: latestClose.toFixed(2),
        datetime: new Date(latestEntry.t).toISOString().split('T')[0],
      }
      previous = {
        close: previousClose.toFixed(2),
        percentageChange: percentageChange.toFixed(2) + '%',
      }

      // TODO: Save data also to database here

      response.status(200).json({
        ticker,
        interval: '1day',
        range: '1m',
        chartData,
        latest,
        previous,
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
