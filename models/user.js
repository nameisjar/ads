'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
    }
  }
  
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'customer',
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users', // Menyesuaikan nama tabel
    timestamps: true, // Memastikan Sequelize menambahkan createdAt dan updatedAt
  });

  return User;
};
