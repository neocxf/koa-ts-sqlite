export = {
  up: async (queryInterface, Sequelize) => {
		let tableDef = await queryInterface.describeTable('users');

		if (! tableDef.activated) {
			await queryInterface.addColumn('users', 'activated', {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false
			})
		} else {
			await queryInterface.changeColumn('users', 'activated', {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: false
			})
		}

  },
  down: (queryInterface, Sequelize) => {
  }
}
