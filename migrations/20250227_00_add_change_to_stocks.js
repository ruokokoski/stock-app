const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('stocks', 'change', {
      type: DataTypes.FLOAT,
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('stocks', 'change')
  },
}