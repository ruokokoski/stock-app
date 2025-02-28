const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('stocks', 'exchange', {
      type: DataTypes.STRING,
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('stocks', 'exchange')
  },
}