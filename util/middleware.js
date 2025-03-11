const { User } = require('../models')
const Session = require('../models/session')
  
const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  console.log('Authorization header:', authorization)

  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const session = await checkSession(authorization.substring(7))

  console.log('Session exists:', !!session)
  console.log('User in session:', session?.user?.id)

  if (!session) {
    return res.status(401).json({ error: 'Session invalid' })
  }

  if (session.user.disabled) {
    return res.status(401).json({ error: 'User disabled' })
  }

  req.user = session.user
  
  next()
}

const checkSession = async (token) => {
  const session = await Session.findOne({
    where: { token },
    include: {
      model: User,
    },
  }) 
  //console.log('Session user:', session.user)
    
  return session
}

const isAdmin = async (req, res, next) => {
  if (!req.user || !req.user.admin) {
    return res.status(401).json({ error: 'Operation not allowed' })
  }
  next()
}

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
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
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(401).json({ error: 'Token invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }
  response.status(error.status || 500).json({
    error: error.message || 'Internal Server Error'
  })
  next()
}

module.exports = { tokenExtractor, isAdmin, unknownEndpoint, errorHandler }