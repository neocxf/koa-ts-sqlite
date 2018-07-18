'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminUser = await queryInterface.rawSelect('users', {where: {name: 'dappstoreadmin'}}, ['id'])

    if (!adminUser) {
      const id = await queryInterface.bulkInsert('users', [{
        name: 'dappstoreadmin',
        password: '$2a$10$Gu4FT14pIVjYlDRm9wOmLulJTRXKGHSaDpEeKeYvGFHQkw25GfJZm',
        type: 'admin',
        email: 'neocxf@qq.com',
        createdAt: new Date(),
        updatedAt: new Date(),
				activated: true
      }], {})

      console.log(`the newly added admin id for users table is ${id}`)
    }
  },

  down: (queryInterface, Sequelize) => {
  }
};
