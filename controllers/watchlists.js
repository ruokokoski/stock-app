const router = require('express').Router()
const { Stock, Watchlist } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', tokenExtractor, async (req, res) => {
  const { ticker } = req.body

  if (!ticker) {
    return res.status(400).json({ error: 'Ticker is required' })
  }
  //console.log('Ticker: ', ticker)
  const stock = await Stock.findOne({ where: { ticker } })
  if (!stock) {
    return res.status(404).json({ error: 'Stock not found' })
  }
  //console.log('Stock from database: ', stock)
  
  try {
    const watchlistItem = await Watchlist.create({
      userId: req.user.id,
      stockId: stock.id,
    })
    return res.status(201).json(watchlistItem)
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Stock is already in the watchlist' })
    }
    throw error
  }
})

router.delete('/:id', tokenExtractor, async (req, res) => {
  const item = await Watchlist.findByPk(req.params.id)

  if (!item) {
    return res.status(404).send({
      error: 'Watchlist item not found'
    })
  }

  if ( req.user.id !== item.userId) {
    return res.status(401).send({
      error: 'Only allowed to delete stocks from own watchlists'
    })
  }

  await item.destroy()
  res.status(204).end()
})

router.get('/', tokenExtractor, async (req, res) => {
  try {
    const watchlistItems = await Watchlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: Stock, attributes: ['ticker', 'name'] }],
    })
    const stocks = watchlistItems.map(item => ({
      id: item.id,
      ticker: item.stock?.ticker,
      name: item.stock?.name,
    }))
    console.log('Watchlist stocks:', stocks)
    res.json(stocks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router