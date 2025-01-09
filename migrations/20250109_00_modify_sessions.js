const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('sessions', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('sessions', 'user_id')
  },
}