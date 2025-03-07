const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Stock extends Model {}

Stock.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ticker: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.STRING,
  },
  latest: {
    type: DataTypes.FLOAT,
  },
  change: {
    type: DataTypes.FLOAT,
  },
  pchange: {
    type: DataTypes.FLOAT,
  },
  sector: {
    type: DataTypes.STRING,
  },
  description: {
    type: DataTypes.TEXT,
  },
  exchange: {
    type: DataTypes.STRING,
  },
  marketcap: {
    type: DataTypes.FLOAT,
  },
  pe: {
    type: DataTypes.FLOAT,
  },
  pb: {
    type: DataTypes.FLOAT,
  },
  roe: {
    type: DataTypes.FLOAT,
  },
  divyield: {
    type: DataTypes.FLOAT,
  },
  ytdpricereturn: {
    type: DataTypes.FLOAT,
  },
  revgrowth: {
    type: DataTypes.FLOAT,
  },
  ebitdacagr5y: {
    type: DataTypes.FLOAT,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'stock'
})

module.exports = Stock