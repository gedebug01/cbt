'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Results', {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        default: sequelize.fn('uuid_generate_v4'),
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'Students',
            key: 'id',
          },
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      question_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: 'Questions',
            key: 'id',
          },
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      result: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      leave_count: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      answer: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Results');
  },
};
