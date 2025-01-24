const User = require('./user')
const Stock = require('./stock')
const Session = require('./session')
const Watchlist = require('./watchlist')

//User.sync({ alter: true })
//Stock.sync({ alter: true })

User.belongsToMany(Stock, { through: Watchlist })
Stock.belongsToMany(User, { through: Watchlist })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  User,
  Stock,
  Watchlist,
  Session
}