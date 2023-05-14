'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Result extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Result.belongsTo(models.Student, { foreignKey: 'student_id' });
      Result.belongsTo(models.Question, { foreignKey: 'question_id' });
    }
  }
  Result.init(
    {
      student_id: DataTypes.STRING,
      result: DataTypes.STRING,
      leave_count: DataTypes.STRING,
      answer: DataTypes.STRING,
      question_id: DataTypes.STRING,
      start_time: DataTypes.INTEGER,
      end_time: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Result',
    }
  );
  return Result;
};
