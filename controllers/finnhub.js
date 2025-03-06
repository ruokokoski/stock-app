const axios = require('axios')
const router = require('express').Router()
const { FINNHUB_API_KEY } = require('../util/config')
const { getStockByTicker } = require('../util/tickerHelper')
const { saveStockDataToDatabase } = require('../util/stockService')

const SEARCH_RESULTS_LIMIT = 5
const ARTICLE_LIMIT = 10

const finnhubHeader = {
  headers: {
    'Content-Type': 'application/json',
    'X-Finnhub-Token': `${FINNHUB_API_KEY}`,
  },
}

const handleApiError = (error, response) => {
  if (error.response && error.response.status === 429) {
    return response.status(429).json({ error: 'Rate limit reached. Please try again later.' })
  }
  console.error('API call failed:', error)
  response.status(500).json({ error: 'Failed to fetch data from Finnhub API' })
}

router.post('/', async (request, response) => {
  const { ticker, name } = request.body

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}`
    const { data } = await axios.get(url, finnhubHeader)

    let stockName = name || 'No name provided'
    let stockSector = 'Unknown'
    let description = 'No description'

    //console.log('Name: ', name)
    if (!name) {
      const stockInfo = getStockByTicker(ticker)
      stockName = stockInfo.name || 'No name provided'
      stockSector = stockInfo.sector || 'Unknown'
    }

    const timestampUTC = new Date(data.t * 1000).toISOString()

    const stockData = {
      ticker: ticker,
      name: stockName,
      timestamp: timestampUTC,
      latest: data.c,
      change: data.d,
      pchange: data.dp,
      sector: stockSector,
      description: description,
    }
    //console.log('Finnhub stock data:', stockData)

    await saveStockDataToDatabase(stockData)

    response.status(200).json(stockData)

  } catch (error) {
    handleApiError(error, response)
  }
})

router.post('/search', async (request, response) => {
  const { query } = request.body

  if (!query) {
    return response.status(400).json({ error: 'Search query is required' })
  }

  try {
    const url = `https://finnhub.io/api/v1/search?q=${encodeURIComponent(query)}&exchange=US`
    const { data } = await axios.get(url, finnhubHeader)

    if (!data || !data.result) {
      return response.status(404).json({ error: 'No results found' })
    }
    
    const commonStocks = data.result
      .filter(item => item.type.toLowerCase() === 'common stock')
      .slice(0, SEARCH_RESULTS_LIMIT)
    //console.log('Common Stocks: ', commonStocks)

    if (commonStocks.length === 0) {
      return response.status(404).json({ error: 'No stocks found. Try searching something else.' })
    }

    const stockDataPromises = commonStocks.map(async (stock) => {
      const { symbol } = stock
      const quoteUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}`
      const { data: quoteData } = await axios.get(quoteUrl, finnhubHeader)

      if (!quoteData) {
        throw new Error(`No quote data available for ${symbol}`)
      }

      const timestampUTC = new Date(quoteData.t * 1000).toISOString()
      const stockName = stock.description || 'No name provided'
      const stockSector = 'Unknown'
      //console.log('stockName: ', stockName)

      const stockData = {
        ticker: symbol,
        name: stockName,
        timestamp: timestampUTC,
        latest: quoteData.c,
        change: quoteData.d,
        pchange: quoteData.dp,
        sector: stockSector,
        description: 'No description',
      }

      /*
      if (stockData.latest === 0) {
        return null
      }
      */

      await saveStockDataToDatabase(stockData)

      return stockData
    })

    const stocksWithData = await Promise.all(stockDataPromises)

    response.status(200).json({ result: stocksWithData })

  } catch (error) {
    handleApiError(error, response)
  }
})

router.post('/market_news', async (request, response) => {

  try {
    const url = 'https://finnhub.io/api/v1/news?category=general'
    const { data } = await axios.get(url, finnhubHeader)

    if (!data) {
      return response.status(404).json({ error: 'No news found' })
    }

    const filteredData = data.map(article => ({
      id: article.id,
      datetime: new Date(article.datetime * 1000).toISOString(),
      headline: article.headline,
      image: article.image,
      summary: article.summary,
      source: article.source,
      url: article.url
    })).slice(0, ARTICLE_LIMIT)

    response.status(200).json(filteredData)

  } catch (error) {
    handleApiError(error, response)
  }
})

router.post('/company_news', async (request, response) => {
  const { ticker } = request.body

  try {
    const today = new Date()
    const past = new Date()
    past.setDate(today.getDate() - 7) // 1wk of news

    const formatDate = (date) => date.toISOString().split('T')[0]
    const fromDate = formatDate(past)
    const toDate = formatDate(today)
    const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate}&to=${toDate}`
    const { data } = await axios.get(url, finnhubHeader)

    if (!data) {
      return response.status(404).json({ error: 'No news found' })
    }

    const filteredData = data.map(article => ({
      id: article.id,
      datetime: new Date(article.datetime * 1000).toISOString(),
      headline: article.headline,
      image: article.image,
      summary: article.summary,
      source: article.source,
      url: article.url
    }))
    //console.log('Company news: ', data)

    response.status(200).json(filteredData)
  } catch (error) {
    handleApiError(error, response)
  }
})

router.post('/company_profile', async (request, response) => {
  const { ticker } = request.body

  try {
    const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}`
    const { data } = await axios.get(url, finnhubHeader)

    const stockData = {
      ticker,
      name: data.name,
      sector: data.finnhubIndustry || 'Unknown',
    }

    await saveStockDataToDatabase(stockData)

    const fullStockData = {
      ...stockData,
      currency: data.currency,
      ipo: data.ipo,
      marketCap: data.marketCapitalization,
      weburl: data.weburl,
      logo: data.logo
    }
    //console.log('Stock data:', fullStockData)

    response.status(200).json(fullStockData)
  } catch (error) {
    handleApiError(error, response)
  }
})

router.post('/metrics', async (request, response) => {
  const { ticker } = request.body

  try {
    const url = `https://finnhub.io/api/v1/stock/metric?symbol=${ticker}&metric=all`
    const { data } = await axios.get(url, finnhubHeader)

    //console.log('Metrics: ', data.metric)
    const quarterlyData = data.series?.quarterly || {}
    const periods = quarterlyData.pb?.map((entry) => entry.period) || []
    //console.log('Periods: ', periods)

    const quarterlyMetrics = periods.map((period) => ({
      time: period,
      cRatio: quarterlyData.currentRatio?.find((m) => m.period === period)?.v ?? null,
      ebitPS: quarterlyData.ebitPerShare?.find((m) => m.period === period)?.v ?? null,
      eps: quarterlyData.eps?.find((m) => m.period === period)?.v ?? null,
      ev: quarterlyData.ev?.find((m) => m.period === period)?.v ?? null,
      gMargin: quarterlyData.grossMargin?.find((m) => m.period === period)?.v ?? null,
      nMargin: quarterlyData.netMargin?.find((m) => m.period === period)?.v ?? null,
      oMargin: quarterlyData.operatingMargin?.find((m) => m.period === period)?.v ?? null,
      pb: quarterlyData.pb?.find((m) => m.period === period)?.v ?? null,
      pe: quarterlyData.peTTM?.find((m) => m.period === period)?.v ?? null,
      roa: quarterlyData.roaTTM?.find((m) => m.period === period)?.v ?? null,
      roe: quarterlyData.roeTTM?.find((m) => m.period === period)?.v ?? null,
      roic: quarterlyData.roicTTM?.find((m) => m.period === period)?.v ?? null,
    })).sort((a, b) => new Date(a.time) - new Date(b.time))

    //console.log('quarterlyMetrics: ', quarterlyMetrics)

    const filteredData = {
      marketCap: data.metric.marketCapitalization != null 
        ? (data.metric.marketCapitalization / 1000).toFixed(0) 
        : '-',
      pe: data.metric.peAnnual?.toFixed(2) ?? '-',
      pb: data.metric.pbAnnual?.toFixed(2) ?? '-',
      ps: data.metric.psAnnual?.toFixed(2) ?? '-',
      eps: data.metric.epsAnnual?.toFixed(2) ?? '-',
      epsGrowth5y: data.metric.epsGrowth5Y ?? '-',
    
      divYield: data.metric.dividendYieldIndicatedAnnual?.toFixed(2) ?? '-',
      divGrowth5y: data.metric.dividendGrowthRate5Y?.toFixed(2) ?? '-',
      high52: data.metric['52WeekHigh'] ?? '-',
      low52: data.metric['52WeekLow'] ?? '-',
      revGrowthTTM: data.metric.revenueGrowthTTMYoy ?? '-',
      revGrowth5y: data.metric.revenueGrowth5Y ?? '-',
    
      roe: data.metric.roeTTM?.toFixed(2) ?? '-',
      roa: data.metric.roaTTM?.toFixed(2) ?? '-',
      netProfitMargin: data.metric.netProfitMarginTTM ?? '-',
      operatingMargin: data.metric.operatingMarginTTM ?? '-',
      ebitdaCagr5y: data.metric.ebitdaCagr5Y ?? '-',
      currentRatio: data.metric.currentRatioAnnual ?? '-',
    
      ytdPriceReturn: data.metric.yearToDatePriceReturnDaily ?? '-',
      quarterlyMetrics,
    }

    response.status(200).json(filteredData)
  } catch (error) {
    handleApiError(error, response)
  }
})

module.exports = router