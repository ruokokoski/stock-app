const User = require('./user')
const Stock = require('./stock')
const Session = require('./session')

User.sync({ alter: true })
Stock.sync({ alter: true })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  User,
  Stock,
  Session
}