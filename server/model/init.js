const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  'vue-element-admin', // 数据库名
  'root', // 用户名
  '12346578', // 密码
  {
    'dialect': 'mysql', // 数据库类型
    'host': '127.0.0.1', // ip
    'port': 3306, // 端口
    define: {
      timestamps: false
    },
    timezone: '+08:00' // 东八时区
  }
)

module.exports = sequelize
