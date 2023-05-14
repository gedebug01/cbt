'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.belongsTo(models.Class, {
        foreignKey: 'class_id',
      });
      Question.hasMany(models.Result, { foreignKey: 'question_id' });
    }
  }
  Question.init(
    {
      question_link: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Link is required',
          },
          notEmpty: {
            msg: 'Link is required',
          },
        },
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Answer is required',
          },
          notEmpty: {
            msg: 'Answer is required',
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Name is required',
          },
          notEmpty: {
            msg: 'Name is required',
          },
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Duration is required',
          },
          notEmpty: {
            msg: 'Duration is required',
          },
        },
      },
      total_question: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Duration is required',
          },
          notEmpty: {
            msg: 'Duration is required',
          },
        },
      },
      teacher_id: DataTypes.UUID,
      class_id: DataTypes.UUID,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Question',
    }
  );
  return Question;
};
