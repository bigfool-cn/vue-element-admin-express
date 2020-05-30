const Sequelize = require('sequelize')
const moment = require('moment')
const sequelize = require('./init')

// 定义表的模型
const UserLogsModel = sequelize.define('user_logs', {
  user_log_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: Sequelize.INTEGER
  },
  ip: {
    type: Sequelize.STRING(255)
  },
  ua: {
    type: Sequelize.STRING(500)
  },
  create_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

module.exports = UserLogsModel
