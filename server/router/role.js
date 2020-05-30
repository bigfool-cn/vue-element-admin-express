const express = require('express')
const router = express.Router()
const RoleModel = require('../model/roles')

router.get('/list', (req, res, next) => {
  RoleModel.findAll({
    where: req.query
  }).then(function(roles) {
    const data = {
      roles: roles,
      count: roles ? roles.length : 0
    }
    return res.json({
      code: 20000,
      message: '获取成功',
      data: data
    })
  })
})

router.post('/add', (req, res, next) => {
  RoleModel.create(req.body).then(function(role) {
    if (!role) {
      return res.json({
        code: 40000,
        message: '创建失败',
        data: null
      })
    }
    return res.json({
      code: 20000,
      message: '创建成功',
      data: role.role_id
    })
  })
})

router.post('/edit', (req, res, next) => {
  const data = req.body
  data.update_time = new Date()
  RoleModel.update(data, {
    where: req.query
  }).then(function(role) {
    if (!role) {
      return res.json({
        code: 40000,
        message: '修改失败',
        data: null
      })
    }
    return res.json({
      code: 20000,
      message: '修改成功',
      data: role
    })
  })
})

router.post('/del', (req, res, next) => {
  const role_ids = req.body
  RoleModel.delRole(role_ids || []).then(function(role) {
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

router.get('/get', (req, res, next) => {
  RoleModel.findOne({
    where: req.query
  }).then(function(role) {
    return res.json({
      code: 20000,
      message: '获取成功',
      data: role
    })
  })
})

module.exports = router
