const Sequelize = require('sequelize')
const moment = require('moment')
const sequelize = require('./init')

// 定义表的模型
const UsresRolesModel = sequelize.define('users_roles', {
  user_role_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_id: {
    type: Sequelize.INTEGER
  },
  user_id: {
    type: Sequelize.INTEGER
  },
  create_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

module.exports = UsresRolesModel
