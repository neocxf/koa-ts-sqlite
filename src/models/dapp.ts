import {conn, sequelize} from '../conn'

let DApp = conn.define('dapps', {
  userId: sequelize.INTEGER,
  username: sequelize.STRING,
  name: sequelize.STRING,
  chain: sequelize.STRING,
  contract: sequelize.STRING,
  category: sequelize.STRING,
  url: sequelize.STRING,
  desc: sequelize.STRING,
  frontPage: sequelize.STRING,
  displayPage: sequelize.STRING,
  userGuide: sequelize.STRING,
  status: sequelize.STRING
})


export {DApp}
