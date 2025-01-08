const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('stocks', {
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
      pchange: {
        type: DataTypes.FLOAT,
      },
      sector: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('stocks')
  },
}
