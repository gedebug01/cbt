'use strict';

const { hashingPassword } = require('../helpers/helpers');

module.exports = {
  async up(queryInterface, Sequelize) {
    const data = require('../data/admin.json').map((el) => {
      const pass = hashingPassword(el.password);
      delete el.role;
      return {
        ...el,
        id: '63f14514-19e9-4c34-a73b-06ed8982de7d',
        password: pass,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert('Admins', data, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admin', null, {});
  },
};
