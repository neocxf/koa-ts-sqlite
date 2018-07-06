import {conn, sequelize} from '../conn'

let DappLikes = conn.define('dapp-likes', {
  dappId: sequelize.INTEGER,
  userId: sequelize.INTEGER,
  likes: sequelize.INTEGER,
  disLikes: sequelize.INTEGER
})



export {DappLikes}
