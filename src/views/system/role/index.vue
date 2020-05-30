<template>
  <div class="app-container">
    <el-form ref="queryForm" :model="queryParams" :inline="true">
      <el-form-item label="角色名称" prop="role_name">
        <el-input
          v-model="queryParams.role_name"
          placeholder="请输入角色名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="角色状态"
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
        <el-button
          v-permission="['system:role:query']"
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
        >搜索</el-button>
        <el-button
          v-permission="['system:role:query']"
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
        >重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          v-permission="['system:role:add']"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          v-permission="['system:role:del']"
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="roleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="角色编号" prop="role_id" width="100" />
      <el-table-column label="角色名称" prop="role_name" :show-overflow-tooltip="true" />
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status ? 'success' : 'info'"
            disable-transitions
          >{{ scope.row.status ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180">
        <template slot-scope="scope">
          <el-button
            v-permission="['system:role:edit']"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            v-permission="['system:role:del']"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="750px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="角色名称" prop="role_name">
          <el-input v-model="form.role_name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :key="1" :label="1">启用</el-radio>
            <el-radio :key="0" :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="menu"
            :data="menuOptions"
            show-checkbox
            node-key="menu_id"
            empty-text="加载中，请稍后"
            :props="defaultProps"
            :check-strictly="checkStrictly"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <span>{{ node.label }}</span>
              <span v-if="data.children === undefined || data.children.length === 0" class="custom-tree-node-btns">
                <span> -- -- </span>
                <span>
                  <el-checkbox-group v-model="data.buttons" @change="checkBtn(node)">
                    <el-checkbox :label="data.permission + ':query'">查询</el-checkbox>
                    <el-checkbox :label="data.permission + ':add'">新增</el-checkbox>
                    <el-checkbox :label="data.permission + ':edit'">修改</el-checkbox>
                    <el-checkbox :label="data.permission + ':del'">删除</el-checkbox>
                  </el-checkbox-group>
                </span>
              </span>
            </span>
          </el-tree>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
import { listRole, delRole, addRole, updateRole } from '@/api/system/role'
import { listMenu } from '@/api/system/menu'

export default {
  name: 'Role',
  data() {
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
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 菜单列表
      menuOptions: [],
      // 默认菜单
      defaultKeys: [],
      // tree关联状态
      checkStrictly: false,
      // tree 里面button
      buttons: [],
      // 查询参数
      queryParams: {
        role_name: undefined,
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
        role_name: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true
      if (this.queryParams.role_name === '') {
        this.queryParams.role_name = undefined
      }
      listRole(this.queryParams).then(
        response => {
          this.roleList = response.data.roles
          this.total = response.data.count
          this.loading = false
        }
      )
    },
    /** 查询菜单树结构 */
    getMenuTreeselect(buttons = [], defaultKeys = null) {
      this.checkStrictly = true
      listMenu().then(response => {
        this.menuOptions = this.mergeTreeButton(response.data, buttons)
        if (defaultKeys && defaultKeys.length > 0) {
          this.$refs.menu.setCheckedKeys(defaultKeys)
        }
        this.checkStrictly = false
      })
    },
    /** 组合次菜单 button */
    mergeTreeButton(tree, buttons = []) {
      tree.forEach((item, key) => {
        tree[key].buttons = []
        buttons.filter(_item => {
          if (_item.menu_id === item.menu_id) {
            tree[key].buttons = _item.btns
            return true
          }
        })
        if (item.children && item.children.length > 0) {
          this.mergeTreeButton(item.children, buttons)
        }
      })
      return tree
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getHalfCheckedKeys()
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getCheckedKeys()
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys)
      return checkedKeys
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
        role_id: undefined,
        role_name: undefined,
        status: 0,
        menu_ids: [],
        remark: undefined
      }
      this.buttons = []
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
      this.ids = selection.map(item => item.role_id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.getMenuTreeselect()
      this.open = true
      this.title = '添加角色'
    },
    /** tree 选择btns */
    checkBtn(node) {
      if (this.buttons.length > 0) {
        const has = this.buttons.filter((item, key) => {
          if (item.menu_id === node.data.menu_id) {
            this.buttons[key].btns = node.data.buttons
            return true
          }
        })
        if (has.length === 0) {
          this.buttons.push({ 'menu_id': node.data.menu_id, 'btns': node.data.buttons })
        }
      } else {
        this.buttons.push({ 'menu_id': node.data.menu_id, 'btns': node.data.buttons })
      }
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.defaultKeys = row.menu_ids || []
      this.$nextTick(() => {
        this.getMenuTreeselect(row.buttons, this.defaultKeys)
      })
      this.form = {
        role_id: row.role_id,
        role_name: row.role_name,
        status: row.status,
        menu_ids: row.menu_ids,
        buttons: row.buttons,
        remark: row.remark
      }
      this.buttons = row.buttons
      this.open = true
      this.title = '修改角色'
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.form.buttons = this.buttons
          if (this.form.role_id !== undefined) {
            this.form.menu_ids = this.getMenuAllCheckedKeys()
            updateRole(this.form.role_id, this.form).then(response => {
              this.msgSuccess(response.message)
              this.open = false
              this.getList()
            })
          } else {
            this.form.menu_ids = this.getMenuAllCheckedKeys()
            addRole(this.form).then(response => {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const role_ids = row.role_id ? [row.role_id] : this.ids
      this.$confirm('是否确认删除角色编号为"' + role_ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(role_ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    height: 36px;
    line-height: 36px;
    .custom-tree-node-btns {
      span:nth-child(1) {
        padding: 0 10px;
      }
    }
    /deep/ .el-checkbox-group {
      display: inline-block;
      .el-checkbox {
        margin-right: 12px;
      }
    }
  }
</style>
