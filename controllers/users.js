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

    res.status(201).json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to create user' })
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

router.put('/:id', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  if (user.admin) {
    return res.status(400).json({ error: 'Cannot disable an admin user' })
  }

  user.disabled = req.body.disabled
  await user.save()
  res.json(user)
})

router.delete('/:id', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  if (user.admin) {
    return res.status(400).json({ error: 'Cannot delete an admin user' })
  }
  
  await user.destroy()
  res.status(204).end()
})

router.post('/change-password', tokenExtractor, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  const user = await User.findByPk(req.decodedToken.id)

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(currentPassword, user.passwordhash)

  if (!passwordCorrect) {
    return res.status(401).json({
      error: 'Invalid current password'
    })
  }

  const saltRounds = 10
  user.passwordhash = await bcrypt.hash(newPassword, saltRounds)
  await user.save()

  res.status(200).json({ message: 'Password changed successfully' })
})


module.exports = router