const express = require('express')
const cors = require('cors')
const app = express()
require('express-async-errors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const logoutRouter = require('./controllers/logout')
const tiingoRouter = require('./controllers/tiingo')
const twelvedataRouter = require('./controllers/twelvedata')
const eodhdRouter = require('./controllers/eodhd')

const { errorHandler } = require('./util/middleware')

app.use(cors())

app.use(express.json())
//app.use(express.static('dist')) for using frontend later

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/tiingo', tiingoRouter)
app.use('/api/twelvedata', twelvedataRouter)
app.use('/api/eodhd', eodhdRouter)

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()