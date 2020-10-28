'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Customer);
      Order.hasMany(models.Order_item);
    }
  };
  Order.init({
    CustomerId: DataTypes.INTEGER,
    order_number: DataTypes.STRING,
    subtotal: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    shipping_address: DataTypes.TEXT,
    phone: DataTypes.STRING,
    status: DataTypes.ENUM('unpaid','paid','shipping','shipped')
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};