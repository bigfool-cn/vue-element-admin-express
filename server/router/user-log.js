const express = require('express')
const router = express.Router()
const UserLogsModel = require('../model/user-logs')
const UsersModel = require('../model/users')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

UserLogsModel.hasOne(UsersModel, { foreignKey: 'user_id', sourceKey: 'user_id' })

router.get('/list', (req, res, next) => {
  if (req.query.page <= 0) {
    req.query.page = 1
  }
  if (req.query.limit > 50) {
    req.query.limit = 50
  }
  let where = {}
  if (req.query.date && req.query.date.length === 2) {
    where = {
      create_time: {
        [Op.between]: req.query.date
      }
    }
  }
  const offset = (req.query.page - 1) * req.query.limit
  UserLogsModel.findAndCountAll({
    offset,
    limit: parseInt(req.query.limit) || 20,
    include: [
      {
        model: UsersModel,
        attributes: ['user_name']
      }
    ],
    where: where,
    order: [['create_time', 'DESC']]
  }).then(function(logs) {
    return res.json({
      code: 20000,
      message: '获取成功',
      data: {
        logs: logs.rows,
        total: logs.count
      }
    })
  })
})

router.post('/del', (req, res, next) => {
  const log_ids = req.body
  UserLogsModel.destroy({ where: { user_log_id: log_ids }}).then(function(role) {
    if (!role) {
      return res.json({
        code: 40000,
        message: '删除失败',
        data: null
      })
    }
    return res.json({
      code: 20000,
      message: '删除成功',
      data: role
    })
  })
})

module.exports = router
