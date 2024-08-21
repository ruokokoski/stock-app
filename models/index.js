const User = require('./user')

User.sync({ alter: true })

module.exports = {
  User
}