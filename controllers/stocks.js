const router = require('express').Router()
const { fn, col, literal } = require('sequelize')
const { Stock } = require('../models')

router.get('/', async (req, res) => {
  const { sortBy = 'ticker', sortOrder = 'ASC' } = req.query
  
  const validSortFields = ['ticker', 'name', 'pe', 'pb', 'roe', 'divyield', 'ytdpricereturn']
  const validOrders = ['ASC', 'DESC']

  const sortField = validSortFields.includes(sortBy) ? sortBy : 'ticker'
  const order = validOrders.includes(sortOrder.toUpperCase()) ? sortOrder : 'ASC'

  const isNumericField = ['pe', 'pb', 'roe', 'divyield', 'ytdpricereturn'].includes(sortField)

  let orderClause

  if (isNumericField) {
    orderClause = [
      [
        literal(`
          CASE 
            WHEN "${sortField}" IS NULL THEN 2
            WHEN "${sortField}" = 0 THEN 1
            ELSE 0
          END
        `),
        'ASC'
      ],
      [col(sortField), order]
    ]
  } else {
    orderClause = [[fn('LOWER', col(sortField)), order]]
  }

  const stocks = await Stock.findAll({
    attributes: {
      exclude: [
        'sector',
        'description',
        'exchange',
        'createdAt',
        //'updatedAt'
      ]
    },
    order: orderClause
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