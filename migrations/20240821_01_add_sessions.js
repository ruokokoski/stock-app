const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
      token: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      valid: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      }
    })
    await queryInterface.removeColumn('sessions', 'valid')
  },
  
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('sessions')
    await queryInterface.addColumn('sessions', 'valid', {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    })
  }
}