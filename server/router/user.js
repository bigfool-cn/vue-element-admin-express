const express = require('express')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const router = express.Router()
const UsersModel = require('../model/users')
const RolesModel = require('../model/roles')
const UserLogsModel = require('../model/user-logs')
const MenusModel = require('../model/menus')

/**
 * 登录
 */
router.post('/login', (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  const md5 = crypto.createHash('md5')
  const md5pwd = md5.update(password).digest('hex')
  UsersModel.findOne(
    {
      where: {
        user_name: username
      }
    }).then(function(user) {
    if (!user) {
      return res.json({
        code: 40000,
        message: '帐号不存在',
        data: ''
      })
    }
    if (!user.status) {
      return res.json({
        code: 40000,
        message: '帐号已停用',
        data: ''
      })
    }
    if (user.password === md5pwd) {
      const token = 'Bearer ' + jwt.sign(
        {
          _id: user.user_id,
          username: user.user_name
        },
        'bigfool.cn',
        {
          expiresIn: 3600 * 2
        }
      )

      const logData = {
        user_id: user.user_id,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        ua: req.headers['user-agent']
      }
      UserLogsModel.create(logData)
      return res.json({
        code: 20000,
        message: '登录成功',
        data: {
          token: token
        }
      })
    } else {
      return res.json({
        code: 40000,
        message: '密码错误',
        data: ''
      })
    }
  })
})

router.get('/info', (req, res, next) => {
  const user_id = req.user._id
  UsersModel.findOne({
    attributes: { exclude: ['password'] },
    include: [
      { model: RolesModel }
    ],
    where: {
      user_id: user_id
    }
  }).then(function(user_roles) {
    if (!user_roles) {
      return res.json({
        code: 40000,
        message: '帐号未分配角色',
        data: ''
      })
    }
    let menu_ids = []
    let buttons = []
    const role_names = []
    user_roles.roles.forEach(function(item) {
      if (item.status) {
        menu_ids = menu_ids.concat(item.menu_ids)
        role_names.push(item.role_name)
        item.buttons.forEach(function(button) {
          buttons = buttons.concat(button.btns)
        })
      }
    })
    MenusModel.getListTree({ menu_id: menu_ids })
      .then(function(menus) {
        return res.json({
          code: 20000,
          message: '获取成功',
          data: {
            roles: role_names,
            user_id: user_id,
            name: user_roles.user_name,
            avatar: 'https://s1.ax1x.com/2020/05/25/tp7UWF.gif',
            menus: menus,
            buttons: buttons
          }
        })
      })
  })
})

router.post('/logout', (req, res, next) => {
  return res.json({
    code: 20000,
    message: '注销成功',
    data: null
  })
})

router.get('/list', (req, res, next) => {
  UsersModel.findAll({
    attributes: { exclude: ['password'] },
    include: [
      { model: RolesModel }
    ],
    where: req.query
  }).then(function(user_roles) {
    return res.json({
      code: 20000,
      message: '获取成功',
      data: user_roles
    })
  })
})

router.post('/add', (req, res, next) => {
  if (req.body.password !== req.body.repassword) {
    return res.json({
      code: 40000,
      message: '两次密码输入不一致',
      data: null
    })
  }
  const password = req.body.password
  const md5 = crypto.createHash('md5')
  req.body.password = md5.update(password).digest('hex')
  const result = UsersModel.addUser(req.body)
  result.then(function(ret) {
    if (ret === true) {
      return res.json({
        code: 20000,
        message: '新增成功',
        data: ret
      })
    } else {
      return res.json({
        code: 40000,
        message: ret,
        data: null
      })
    }
  })
})

router.post('/edit', (req, res, next) => {
  const user_id = req.query.user_id
  req.body.password = undefined
  const result = UsersModel.updateUser(user_id, req.body)
  result.then(function(ret) {
    if (ret === true) {
      return res.json({
        code: 20000,
        message: '修改成功',
        data: ret
      })
    } else {
      return res.json({
        code: 40000,
        message: ret,
        data: null
      })
    }
  })
})

router.post('/del', (req, res, next) => {
  const user_ids = req.body
  UsersModel.delUser(user_ids || []).then(function(user) {
    if (user !== true) {
      return res.json({
        code: 40000,
        message: '删除失败',
        data: null
      })
    }
    return res.json({
      code: 20000,
      message: '删除成功',
      data: user
    })
  })
})

router.post('/edit-pwd', (req, res, next) => {
  if (req.body.password !== req.body.repassword) {
    return res.json({
      code: 40000,
      message: '两次密码输入不一致',
      data: null
    })
  }
  const user_id = req.query.user_id
  const old_password = req.body.old_password
  UsersModel.findOne({ where: { user_id: user_id }}).then(function(user) {
    if (!user) {
      return res.json({
        code: 40000,
        message: '用户不存在',
        data: null
      })
    }
    const md5 = crypto.createHash('md5')
    if (user.password !== md5.update(old_password).digest('hex')) {
      return res.json({
        code: 40000,
        message: '原密码不正确',
        data: null
      })
    }
    const _md5 = crypto.createHash('md5')
    const data = {
      password: _md5.update(req.body.password).digest('hex'),
      update_time: new Date()
    }
    const result = UsersModel.update(data, {
      where: {
        user_id: user_id
      }
    })
    result.then(function(ret) {
      if (ret) {
        return res.json({
          code: 20000,
          message: '修改成功',
          data: ret
        })
      } else {
        return res.json({
          code: 40000,
          message: ret,
          data: null
        })
      }
    })
  })
})

module.exports = router
