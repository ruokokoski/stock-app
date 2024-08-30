const { test, after, before } = require('node:test')
const supertest = require('supertest')
const { connectToDatabase, sequelize } = require('../util/db')
const express = require('express')

const usersRouter = require('../controllers/users')
const loginRouter = require('../controllers/login')
const logoutRouter = require('../controllers/logout')
const { errorHandler } = require('../util/middleware')
const app = express()

app.use(express.json())
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use(errorHandler)

let server
let api

before(async () => {
  await connectToDatabase()

  server = app.listen(4000)
  api = supertest(server)
})

test('Database connection works and /api/users returns JSON', async (t) => {
  await api
    .get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await server.close()
})
