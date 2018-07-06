import {conn, sequelize} from '../conn'

let StarRelation = conn.define('user-dapp-stars', {
  userId: sequelize.INTEGER,
  dappId: sequelize.INTEGER,
  star: sequelize.FLOAT
})


export {StarRelation}
