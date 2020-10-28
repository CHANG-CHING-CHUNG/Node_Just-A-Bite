'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CustomerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Customers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_number: {
        allowNull: false,
        type: Sequelize.STRING
      },
      subtotal: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      total: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      shipping_address: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('unpaid','paid','shipping','shipped'),
        defaultValue: 'unpaid'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Orders');
  }
};