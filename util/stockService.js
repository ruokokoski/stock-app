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
      await existingStock.update(updatedData)
      console.log('Stock data updated in the database')
    } else {
      await Stock.create(stockData)
      console.log('Stock data inserted into the database')
    }
  } catch (error) {
    console.log('Error saving stock data to database:', error)
  }
}

module.exports = { saveStockDataToDatabase }