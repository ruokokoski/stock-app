const User = require('./user')
const Stock = require('./stock')

User.sync({ alter: true })
Stock.sync({ alter: true })

module.exports = {
  User,
  Stock
}