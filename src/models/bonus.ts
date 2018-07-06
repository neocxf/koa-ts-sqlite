import {conn, sequelize} from '../conn'

let Bonus = conn.define('bonus', {
  from: sequelize.STRING,
  to: sequelize.STRING,
  value: sequelize.FLOAT,
  dappId: sequelize.INTEGER,
  fromUser: sequelize.STRING,
  toUser: sequelize.STRING,
})

export {Bonus}


