const router = require('express').Router()

const { Stock } = require('../models')

router.get('/', async (req, res) => {
  const stocks = await Stock.findAll({
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt'
      ]
    }
  })
  res.status(200).json(stocks)
})

router.post('/', async (req, res) => {
  const { ticker, name, timestamp, latest, pchange, sector, description } = req.body

  if (!ticker || !name) {
    return res.status(400).json({ error: 'Ticker and name are required' })
  }

  const existingStock = await Stock.findOne({ where: { ticker } })

  if (existingStock) {
    console.log('Updating stock info')
    await existingStock.update({
      name,
      timestamp,
      latest,
      pchange,
      sector,
      description
    })

    res.status(200).json({
      message: 'Stock updated successfully',
      id: existingStock.id,
      ticker: existingStock.ticker,
      name: existingStock.name,
      timestamp: existingStock.timestamp,
      latest: existingStock.latest,
      pchange: existingStock.pchange,
      sector: existingStock.sector,
      description: existingStock.description
    })
  } else {
    console.log('Storing stock to database')
    const stock = await Stock.create({
      ticker,
      name,
      timestamp,
      latest,
      pchange,
      sector,
      description
    })

    res.status(201).json({
      id: stock.id,
      ticker: stock.ticker,
      name: stock.name,
      timestamp: stock.timestamp,
      latest: stock.latest,
      pchange: stock.pchange,
      sector: stock.sector,
      description: stock.description
    })
  }
})

module.exports = router