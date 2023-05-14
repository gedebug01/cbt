'use strict';
const { Model } = require('sequelize');
const { hashingPassword } = require('../helpers/helpers');
const { v4: uuid } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Admin.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Username already used',
        },
        validate: {
          notNull: {
            msg: 'Username is required',
          },
          notEmpty: {
            msg: 'Username is required',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Admin',
    }
  );
  Admin.beforeCreate((ins) => {
    ins.id = uuid();
    ins.password = hashingPassword(ins.password);
  });
  return Admin;
};
