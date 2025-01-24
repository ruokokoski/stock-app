const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Watchlist extends Model {}

Watchlist.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'stocks', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  modelName: 'watchlist'
})

module.exports = Watchlist