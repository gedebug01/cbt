'use strict';
const { Model } = require('sequelize');
const { hashingPassword } = require('../helpers/helpers');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.hasMany(models.Result, { foreignKey: 'student_id' });
      Student.belongsTo(models.Class, { foreignKey: 'class_id' });
    }
  }
  Student.init(
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
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
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
      nisn: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nis: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      class_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Class is required',
          },
          notEmpty: {
            msg: 'Class is required',
          },
        },
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Status is required',
          },
          notEmpty: {
            msg: 'Status is required',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Student',
    }
  );
  Student.beforeCreate((ins, option) => {
    if (ins.password) {
      ins.password = hashingPassword(ins.password);
    }
  });
  return Student;
};
