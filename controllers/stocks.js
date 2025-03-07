const router = require('express').Router()
const { fn, col } = require('sequelize')
const { Stock } = require('../models')

router.get('/', async (req, res) => {
  const { sortBy = 'ticker', sortOrder = 'ASC' } = req.query
  
  const validSortFields = ['ticker', 'name']
  const validOrders = ['ASC', 'DESC']

  const sortField = validSortFields.includes(sortBy) ? sortBy : 'ticker'
  const order = validOrders.includes(sortOrder.toUpperCase()) ? sortOrder : 'ASC'

  const stocks = await Stock.findAll({
    attributes: {
      exclude: [
        'sector',
        'description',
        'exchange',
        'createdAt',
        'updatedAt'
      ]
    },
    order: [[fn('LOWER', col(sortField)), order]]
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