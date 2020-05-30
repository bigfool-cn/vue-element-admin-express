const express = require('express')
const router = express.Router()
const MenusModel = require('../model/menus')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/list', (req, res, next) => {
  MenusModel.getListTree(req.query)
    .then(function(menuTree) {
      return res.json({
        code: 20000,
        message: '获取成功',
        data: menuTree || []
      })
    })
})

router.post('/add', (req, res, next) => {
  MenusModel.create(req.body).then(function(menu) {
    if (!menu) {
      return res.json({
        code: 40000,
        message: '创建失败',
        data: null
      })
    }
    return res.json({
      code: 20000,
      message: '创建成功',
      data: menu.menu_id
    })
  })
})

router.post('/edit', (req, res, next) => {
  delete req.body.menu_id
  const data = req.body
  data.update_time = new Date()
  MenusModel.update(data, {
    where: {
      menu_id: req.query.menu_id || 0
    }
  }).then(function(menu) {
    if (!menu) {
      return res.json({
        code: 40000,
        message: '修改失败',
        data: null
      })
    }
    return res.json({
      code: 20000,
      message: '修改成功',
      data: menu
    })
  })
})

router.post('/del', (req, res, next) => {
  MenusModel.destroy({
    where: {
      [Op.or]: [{ menu_id: req.body }, { parent_id: req.body }]
    }
  }).then(function(menu) {
    return res.json({
      code: 20000,
      message: '删除',
      data: menu
    })
  })
})

router.get('/get', (req, res, next) => {
  MenusModel.findOne({
    where: req.query
  }).then(function(menu) {
    return res.json({
      code: 20000,
      message: '获取成功',
      data: menu
    })
  })
})

module.exports = router
