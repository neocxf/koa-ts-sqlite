import Sequelize from 'sequelize'

const conn = new Sequelize('dappstore', 'root', 'dappstore', {
	host: 'localhost',
	dialect: 'sqlite',

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

	storage: 'dappstore.sqlite'
})

export  {
	conn,
	Sequelize as sequelize
}
