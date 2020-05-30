const Sequelize = require('sequelize')
const moment = require('moment')
const sequelize = require('./init')
const UsersRolesModel = require('./users-roles')

// 定义表的模型
const RolesModel = sequelize.define('roles', {
  role_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role_name: {
    type: Sequelize.STRING(255)
  },
  remark: {
    type: Sequelize.STRING(255)
  },
  status: {
    type: Sequelize.TINYINT,
    defaultValue: 0
  },
  menu_ids: {
    type: Sequelize.TEXT,
    set(val) {
      this.setDataValue('menu_ids', val && val.length > 0 ? JSON.stringify(val) : JSON.stringify([]))
    },
    get() {
      return this.getDataValue('menu_ids') ? JSON.parse(this.getDataValue('menu_ids')) : []
    }
  },
  buttons: {
    type: Sequelize.TEXT,
    set(val) {
      this.setDataValue('buttons', val && val.length > 0 ? JSON.stringify(val) : JSON.stringify([]))
    },
    get() {
      return this.getDataValue('buttons') ? JSON.parse(this.getDataValue('buttons')) : []
    }
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

RolesModel.delRole = async function(role_ids) {
  const t = await sequelize.transaction()
  try {
    await RolesModel.destroy({
      where: { role_id: role_ids }
    })
    await UsersRolesModel.destroy({
      where: { role_id: role_ids }
    })
    t.commit()
    return true
  } catch (e) {
    t.rollback()
    return false
  }
}

module.exports = RolesModel
