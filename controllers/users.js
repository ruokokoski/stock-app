const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User } = require('../models')
const { tokenExtractor, isAdmin } = require('../util/middleware')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    attributes: {
      exclude: [
        'passwordhash',
        'createdAt',
        'updatedAt'
      ]
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, name, password } = req.body
  const saltRounds = 10
  const passwordhash = await bcrypt.hash(password, saltRounds)

  try {
    const user = await User.create({
      username,
      name,
      passwordhash
    })

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: [
        'passwordhash',
        'createdAt', 
        'updatedAt'
      ]
    },
  })
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router