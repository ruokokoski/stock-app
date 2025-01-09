const router = require('express').Router()
const { tokenExtractor } = require('../util/middleware')
const Session = require('../models/session')

router.post('/', tokenExtractor, async (req, res) => {
  await Session.destroy({
    where: {
      userId: req.user.id
    }
  })
  console.log('Logout successful')
  res.status(200).json({ message: 'Logout successful' })
})

module.exports = router