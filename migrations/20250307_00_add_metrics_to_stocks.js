const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await Promise.all([
      queryInterface.addColumn('stocks', 'marketcap', { type: DataTypes.FLOAT }),
      queryInterface.addColumn('stocks', 'pe', { type: DataTypes.FLOAT }),
      queryInterface.addColumn('stocks', 'pb', { type: DataTypes.FLOAT }),
      queryInterface.addColumn('stocks', 'roe', { type: DataTypes.FLOAT }),
      queryInterface.addColumn('stocks', 'divyield', { type: DataTypes.FLOAT }),
      queryInterface.addColumn('stocks', 'ytdpricereturn', { type: DataTypes.FLOAT }),
      queryInterface.addColumn('stocks', 'revgrowth', { type: DataTypes.FLOAT }),
      queryInterface.addColumn('stocks', 'ebitdacagr5y', { type: DataTypes.FLOAT }),
    ])
  },

  down: async ({ context: queryInterface }) => {
    await Promise.all([
      queryInterface.removeColumn('stocks', 'marketcap'),
      queryInterface.removeColumn('stocks', 'pe'),
      queryInterface.removeColumn('stocks', 'pb'),
      queryInterface.removeColumn('stocks', 'roe'),
      queryInterface.removeColumn('stocks', 'divyield'),
      queryInterface.removeColumn('stocks', 'ytdpricereturn'),
      queryInterface.removeColumn('stocks', 'revgrowth'),
      queryInterface.removeColumn('stocks', 'ebitdacagr5y'),
    ])
  },
}