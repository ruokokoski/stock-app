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

router.get('/:ticker', async (req, res) => {
  const stock = await Stock.findOne({
    where: { ticker: req.params.ticker },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  })

  if (!stock) {
    return res.status(404).json({ error: 'Stock not found' })
  }

  res.status(200).json(stock)
})

module.exports = router