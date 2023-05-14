'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ClassQuestion.belongsTo(models.Class);
      ClassQuestion.belongsTo(models.Question);
    }
  }
  ClassQuestion.init(
    {
      question_id: DataTypes.UUID,
      class_id: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'ClassQuestion',
    }
  );
  return ClassQuestion;
};
