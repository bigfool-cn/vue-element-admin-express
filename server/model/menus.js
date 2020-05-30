const Sequelize = require('sequelize')
const moment = require('moment')
const sequelize = require('./init')
const tools = require('../utils/tools')

// 定义表的模型
const MenusModel = sequelize.define('menus', {
  menu_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  parent_id: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  title: {
    type: Sequelize.STRING(255)
  },
  sort: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  type: {
    type: Sequelize.CHAR(1)
  },
  icon: {
    type: Sequelize.STRING(255)
  },
  name: {
    type: Sequelize.STRING(255)
  },
  component: {
    type: Sequelize.STRING(255)
  },
  path: {
    type: Sequelize.STRING(255)
  },
  permission: {
    type: Sequelize.STRING(255)
  },
  redirect: {
    type: Sequelize.STRING(255)
  },
  hidden: {
    type: Sequelize.TINYINT(1)
  },
  update_time: {
    type: Sequelize.DATE,
    get() {
      return this.getDataValue('update_time') ? moment(this.getDataValue('update_time')).format('YYYY-MM-DD HH:mm:ss') : null
    }
  },
  create_time: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get() {
      return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss')
    }
  }
})

MenusModel.getListTree = async function(where = {}) {
  const menus = await MenusModel.findAll({
    where: where,
    order: [['sort', 'DESC']]
  })
  const menusArr = menus.map(function(item) {
    return item.get({ plain: true })
  })
  return tools.getTreeData(menusArr, null, 'menu_id')
}

module.exports = MenusModel
