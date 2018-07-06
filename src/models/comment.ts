import {conn, sequelize} from '../conn'

let DAppComment = conn.define('dapp-comments', {
  dappId: sequelize.INTEGER,
  userId: sequelize.INTEGER,
  username: sequelize.STRING,
  comment: sequelize.STRING
})

export {DAppComment}
