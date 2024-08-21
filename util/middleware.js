const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const Session = require('../models/session')

const errorHandler = (error, request, response) => {
  console.error('Error:', error, request)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return response.status(400).json({ error: 'Username must be unique' })
  } else if (error.name === 'SequelizeValidationError') {
    return response.status(400).json({
      error: error.errors.map(e => e.message)
    })
  }
  response.status(error.status || 500).json({
    error: error.message || 'Internal Server Error'
  })
}
  
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      req.decodedToken = jwt.verify(token, SECRET)
      console.log('Decoded token:', req.decodedToken)
      req.token = token
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

const checkSession = async (req, res, next) => {
  if (!req.token) {
    return res.status(401).json({ error: 'token missing' })
  }

  try {
    const session = await Session.findOne({ where: { token: req.token } })
    
    if (!session) {
      return res.status(401).json({ error: 'Session not found' })
    }
    
    if (session.expired) {
      return res.status(401).json({ error: 'Session expired' })
    }

    req.session = session
    next()
  } catch (error) {
    console.log('Error: ', error)
    return res.status(401).json({ error: 'Session invalid' })
  }
}

module.exports = { errorHandler, tokenExtractor, checkSession }