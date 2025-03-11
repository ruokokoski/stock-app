const User = require('./user')
const Stock = require('./stock')
const Session = require('./session')
const Watchlist = require('./watchlist')

//User.sync({ alter: true })
//Stock.sync({ alter: true })
//Watchlist.sync({ alter: true })

User.belongsToMany(Stock, { through: Watchlist })
Stock.belongsToMany(User, { through: Watchlist })

Watchlist.belongsTo(User, { foreignKey: 'userId' })
Watchlist.belongsTo(Stock, { foreignKey: 'stockId' })

User.hasMany(Session)
Session.belongsTo(User, { onDelete: 'CASCADE' })
//Session.belongsTo(User)

module.exports = {
  User,
  Stock,
  Watchlist,
  Session
}