import {conn, sequelize} from '../conn'


let Trans = conn.define('trans', {
  address: sequelize.STRING,
  date: sequelize.DATE,
  txCnt: sequelize.INTEGER
})

export {Trans}
