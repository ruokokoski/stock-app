const fs = require('fs')
const path = require('path')

const getStockByTicker = (symbol) => {
  const filePaths = [
    path.join(__dirname, '../data/nyse_full_tickers.json'),
    path.join(__dirname, '../data/nasdaq_full_tickers.json'),
    path.join(__dirname, '../data/amex_full_tickers.json'),
  ]

  try {
    for (const filePath of filePaths) {
      const data = fs.readFileSync(filePath, 'utf-8')
      const tickers = JSON.parse(data)
      const stock = tickers.find(ticker => ticker.symbol === symbol)

      if (stock) {
        let name = stock.name
        if (name.endsWith(' Common Stock')) {
          name = name.slice(0, -' Common Stock'.length)
        }
        return { name, sector: stock.sector }
      }
    }

    return { name: symbol, sector: '-' }
  } catch (error) {
    console.error('Error reading or parsing the files:', error)
    return { name: symbol, sector: '-' }
  }
}

module.exports = { getStockByTicker }