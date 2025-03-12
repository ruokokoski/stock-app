const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User, Session } = require('../models')
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
  /*
  if (req.body.disabled) {
    await Session.destroy({
      where: {
        userId: user.id,
      },
    })
  }
  */
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
  
  await Session.destroy({ where: { userId: user.id } })
  await user.destroy()
  res.status(204).end()
})

router.post('/change-password', tokenExtractor, async (req, res) => {
  const { currentPassword, newPassword } = req.body
  console.log('Start change-password')
  const user = await User.findByPk(req.user.id)
  if (!user) return res.status(401).json({ error: 'User not found' })
  console.log('Name:', user.name)

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(currentPassword, user.passwordhash)

  if (!passwordCorrect) {
    console.log('Current password incorrect')
    return res.status(400).json({
      error: 'Invalid current password'
    })
  }

  const saltRounds = 10
  user.passwordhash = await bcrypt.hash(newPassword, saltRounds)
  await user.save()

  res.status(200).json({ message: 'Password changed successfully' })
})

router.post('/change-name', tokenExtractor, async (req, res) => {
  const { newName } = req.body
  if (!newName || newName.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' })
  }
  
  const user = await User.findByPk(req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })

  user.name = newName.trim()
  await user.save()

  const userResponse = {
    id: user.id,
    name: user.name,
    username: user.username,
    admin: user.admin,
    disabled: user.disabled,
    token: req.headers.authorization.split(' ')[1]
  }

  res.status(200).json(userResponse)
})

module.exports = router