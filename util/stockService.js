const { Stock } = require('../models')

const saveStockDataToDatabase = async (stockData) => {
  try {
    const existingStock = await Stock.findOne({ where: { ticker: stockData.ticker } })

    if (existingStock) {
      const updatedData = { ...stockData }

      if (stockData.description === 'No description') {
        delete updatedData.description
      }
      if (stockData.sector === 'Unknown') {
        delete updatedData.sector
      }
      //delete updatedData.exchange

      await existingStock.update(updatedData)
      console.log('Stock data updated in the database')
      //console.log('Exchange: ', updatedData.exchange)
    } else {
      await Stock.create(stockData)
      console.log('Stock data inserted into the database')
    }
  } catch (error) {
    console.log('Error saving stock data to database:', error)
  }
}

const saveMetricsToDatabase = async (ticker, metrics) => {
  try {
    const stock = await Stock.findOne({ where: { ticker } })

    if (!stock) {
      console.log(`Stock ${ticker} not found, skipping metrics save`)
      return
    }

    const updates = {}
    
    const metricMappings = {
      marketcap: metrics.marketCap !== '-' ? parseFloat(metrics.marketCap) : null,
      pe: metrics.pe !== '-' ? parseFloat(metrics.pe) : null,
      pb: metrics.pb !== '-' ? parseFloat(metrics.pb) : null,
      roe: metrics.roe !== '-' ? parseFloat(metrics.roe) : null,
      divyield: metrics.divYield !== '-' ? parseFloat(metrics.divYield) : null,
      ytdpricereturn: metrics.ytdPriceReturn !== '-' ? parseFloat(metrics.ytdPriceReturn) : null,
      revgrowth: metrics.revGrowthTTM !== '-' ? parseFloat(metrics.revGrowthTTM) : null,
      ebitdacagr5y: metrics.ebitdaCagr5y !== '-' ? parseFloat(metrics.ebitdaCagr5y) : null
    }

    Object.entries(metricMappings).forEach(([key, value]) => {
      if (value !== null && !isNaN(value)) {
        updates[key] = value
      }
    })

    if (Object.keys(updates).length > 0) {
      await stock.update(updates)
      console.log(`Metrics updated for ${ticker}`)
    }
  } catch (error) {
    console.error(`Error saving metrics for ${ticker}:`, error)
  }
}

module.exports = { saveStockDataToDatabase, saveMetricsToDatabase }