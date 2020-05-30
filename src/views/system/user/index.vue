<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="用户帐号" prop="role_name">
        <el-input
          v-model="queryParams.user_name"
          placeholder="请输入用户帐号"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="用户状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option key="-1" label="全部" :value="undefined" />
          <el-option key="1" label="启用" :value="1" />
          <el-option key="0" label="停用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button v-permission="['system:user:query']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permission="['system:user:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permission="['system:user:del']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="用户帐号" prop="user_name" width="120" />
      <el-table-column label="角色" prop="role_name" :show-overflow-tooltip="true" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.roles|mergeRoles }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.status ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" align="center" prop="update_time" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.update_time ? parseTime(scope.row.update_time) : '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-permission="['system:user:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-permission="['system:user:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdatePwd(scope.row)"
          >修改密码</el-button>
          <el-button
            v-permission="['system:user:del']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-if="form.action !== 'edit-pwd'" label="用户帐号" prop="user_name">
          <el-input v-model="form.user_name" placeholder="请输入帐号" />
        </el-form-item>
        <el-form-item v-if="form.action === 'edit-pwd'" label="原密码" prop="old_password">
          <el-input v-model="form.old_password" type="password" placeholder="请输入原用户密码" />
        </el-form-item>
        <el-form-item v-if="!form.user_id || form.action === 'edit-pwd'" label="用户密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入用户密码" />
        </el-form-item>
        <el-form-item v-if="!form.user_id || form.action === 'edit-pwd'" label="确认密码" prop="repassword">
          <el-input v-model="form.repassword" type="password" placeholder="请再次输入用户密码" />
        </el-form-item>
        <el-form-item v-if="form.action !== 'edit-pwd'" label="角色" prop="role_ids">
          <el-select v-model="form.role_ids" multiple placeholder="请选择角色">
            <el-option
              v-for="item in roles"
              :key="item.role_id"
              :label="item.role_name"
              :value="item.role_id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.action !== 'edit-pwd'" label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :key="1" :label="1">开启</el-radio>
            <el-radio :key="0" :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, delUser, addUser, updateUser, updatePwd } from '@/api/system/user'
import { listRole } from '@/api/system/role'
import { MessageBox } from 'element-ui'
import store from '../../../store'

export default {
  name: 'User',
  filters: {
    mergeRoles(roles) {
      const role_names = []
      roles.forEach(item => {
        role_names.push(item.role_name)
      })
      return role_names.join(' | ')
    }
  },
  data() {
    // 验证密码
    const validateOldPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        callback()
      }
    }
    // 验证密码
    const validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6'))
      } else {
        callback()
      }
    }
    // 二次验证密码
    const validateRePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 角色表格数据
      userList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 角色
      roles: [],
      // 查询参数
      queryParams: {
        user_name: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      // 表单校验
      rules: {
        user_name: [
          { required: true, message: '帐号不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '帐号长度3-10之内', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]+$/, message: '帐号只能字母数字组成', trigger: 'blur' }
        ],
        role_ids: [
          { type: 'array', required: true, message: '请选择角色', trigger: 'change' }
        ],
        old_password: [{ validator: validateOldPwd, trigger: 'change' }],
        password: [{ validator: validatePwd, trigger: 'change' }],
        repassword: [{ validator: validateRePwd, trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true
      if (this.queryParams.user_name === '') {
        this.queryParams.user_name = undefined
      }
      listUser(this.queryParams).then(
        response => {
          this.userList = response.data
          this.total = response.data.length
          this.loading = false
        }
      )
    },
    getListRole() {
      listRole().then(response => {
        this.roles = response.data.roles
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([])
      }
      this.form = {
        user_id: undefined,
        user_name: undefined,
        status: 0,
        role_ids: [],
        password: undefined,
        repassword: undefined
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.user_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.getListRole()
      this.open = true
      this.title = '添加用户'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getListRole()
      this.form = {
        user_id: row.user_id,
        user_name: row.user_name,
        status: row.status
      }
      const role_ids = row.roles.map(item => {
        return item.role_id
      })
      this.$set(this.form, 'role_ids', role_ids)
      this.open = true
      this.title = '修改用户'
    },
    /** 修改密码按钮操作 */
    handleUpdatePwd(row) {
      this.reset()
      this.form = {
        user_id: row.user_id,
        action: 'edit-pwd'
      }
      this.open = true
      this.title = '修改密码'
    },
    reLogin() {
      MessageBox.confirm('修改成功，请重新登录', '重新登录', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).finally(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.action === 'edit-pwd') {
            updatePwd(this.form.user_id, this.form).then(response => {
              if (this.form.user_id === this.$store.getters.user_id) {
                this.reLogin()
              }
              this.msgSuccess(response.message)
              this.open = false
              this.getList()
            })
            return false
          }
          if (this.form.user_id !== undefined) {
            updateUser(this.form.user_id, this.form).then(response => {
              if (this.form.user_id === this.$store.getters.user_id) {
                this.reLogin()
              }
              this.msgSuccess(response.message)
              this.open = false
              this.getList()
            })
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess(response.message)
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const user_ids = row.user_id ? [row.user_id] : this.ids
      this.$confirm('是否确认删除用户编号为"' + user_ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delUser(user_ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
<style lang="scss" scoped>
  /deep/ .el-select--default {
    width: 100%;
  }
</style>
