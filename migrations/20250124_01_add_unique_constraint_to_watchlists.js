module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addConstraint('watchlists', {
      fields: ['user_id', 'stock_id'],
      type: 'unique',
      name: 'unique_user_stock',
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('watchlists', 'unique_user_stock');
  },
}