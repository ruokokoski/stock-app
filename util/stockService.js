const { Stock } = require('../models')

const saveStockDataToDatabase = async (stockData) => {
  try {
    const existingStock = await Stock.findOne({ where: { ticker: stockData.ticker } })

    if (existingStock) {
      await existingStock.update(stockData)
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