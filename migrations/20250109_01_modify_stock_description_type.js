const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('stocks', 'description', {
      type: DataTypes.TEXT,
      allowNull: true,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('stocks', 'description', {
      type: DataTypes.STRING,
      allowNull: true,
    })
  }
}
