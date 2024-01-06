'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        foreignKey: 'customerId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'orderId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    }
  }
  Order.init({
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders', 
    timestamps: true, 
  });

  return Order;
};
