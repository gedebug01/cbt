'use strict';
const { Model } = require('sequelize');
const { v4: uuid } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Class extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Class.hasMany(models.Question, {
        foreignKey: 'class_id',
      });
      // Class.belongsToMany(models.Question, {
      //   foreignKey: 'class_id',
      //   through: models.ClassQuestion,
      // });
    }
  }
  Class.init(
    {
      grade: DataTypes.INTEGER,
      name: DataTypes.STRING,
      total_student: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Class',
    }
  );
  Class.beforeCreate((ins) => {
    ins.id = uuid();
  });
  return Class;
};
