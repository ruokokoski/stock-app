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
const finnhubRouter = require('./controllers/finnhub')
const eodhdRouter = require('./controllers/eodhd')
const polygonRouter = require('./controllers/polygon')
const cryptoRouter = require('./controllers/coincap')
//const stocksRouter = require('./controllers/stocks')

const { unknownEndpoint, errorHandler } = require('./util/middleware')

app.use(cors())

app.use(express.json())
//app.use(express.static('dist')) // for using frontend build later

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/tiingo', tiingoRouter)
app.use('/api/twelvedata', twelvedataRouter)
app.use('/api/finnhub', finnhubRouter)
app.use('/api/eodhd', eodhdRouter)
app.use('/api/polygon', polygonRouter)
app.use('/api/crypto', cryptoRouter)
//app.use('/api/stocks', stocksRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()