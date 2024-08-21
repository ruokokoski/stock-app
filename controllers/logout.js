const router = require('express').Router()
const { tokenExtractor, checkSession } = require('../util/middleware')

router.post('/', tokenExtractor, checkSession, async (req, res) => {
  const session = req.session
  session.valid = false
  await session.save()
  res.status(200).json({ message: 'Logout successful' })
})

module.exports = router