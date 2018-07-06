const {User, StarRelation, DAppComment, CommentLikes, DApp, DappLikes, Bonus, Trans} = require('../../models')

export = {
  up: async (queryInterface, Sequelize) => {
  	console.log(User.tableName)
  	console.log(StarRelation.tableName)
  	console.log(DAppComment.tableName)
  	console.log(CommentLikes.tableName)
  	console.log(DApp.tableName)
  	console.log(DappLikes.tableName)
  	console.log(Bonus.tableName)
  	console.log(Trans.tableName)

    await queryInterface.createTable(User.tableName, User.attributes)
    await queryInterface.createTable(StarRelation.tableName, StarRelation.attributes)
    await queryInterface.createTable(DAppComment.tableName, DAppComment.attributes)
    await queryInterface.createTable(CommentLikes.tableName, CommentLikes.attributes)
    await queryInterface.createTable(DApp.tableName, DApp.attributes)
    await queryInterface.createTable(DappLikes.tableName, DappLikes.attributes)
    await queryInterface.createTable(Bonus.tableName, Bonus.attributes)
    await queryInterface.createTable(Trans.tableName, Trans.attributes)
  },
  down: (queryInterface, Sequelize) => {
  }
}
